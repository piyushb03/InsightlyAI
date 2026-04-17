import os
from flask import Blueprint, request, jsonify, current_app, send_file
from werkzeug.utils import secure_filename
from database import get_db
from auth_utils import require_auth
from services.ingestor import ingest_file

uploads_bp = Blueprint("uploads", __name__)

ALLOWED_EXTENSIONS = {"csv", "xlsx", "xls"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@uploads_bp.route("", methods=["GET"])
@require_auth
def list_uploads():
    db = get_db()
    res = (
        db.table("uploads")
        .select("*")
        .eq("user_id", request.current_user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return jsonify(res.data)


@uploads_bp.route("", methods=["POST"])
@require_auth
def create_upload():
    db = get_db()
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        if not file.filename or not allowed_file(file.filename):
            return jsonify({"error": "File must be CSV or Excel (.xlsx, .xls)"}), 400

        filename = secure_filename(file.filename)
        if not filename:
            filename = "upload_file.csv"

        user_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], str(request.current_user_id))
        os.makedirs(user_dir, exist_ok=True)

        storage_key = os.path.join(str(request.current_user_id), filename)
        file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], storage_key)
        file.save(file_path)

        # Insert upload row — Postgres generates the UUID
        insert_res = (
            db.table("uploads")
            .insert({
                "user_id": request.current_user_id,
                "filename": filename,
                "storage_key": storage_key,
                "status": "pending",
            })
            .execute()
        )
        upload = insert_res.data[0]
        upload_id = upload["id"]

    except Exception as e:
        import traceback
        return jsonify({"error": "Server error during upload setup: " + str(e), "trace": traceback.format_exc()}), 500

    # Ingest synchronously (fast for small files)
    try:
        result = ingest_file(upload_id, file_path)

        # Update upload with parsed data
        update_res = (
            db.table("uploads")
            .update({
                "status": "ready",
                "row_count": result["row_count"],
                "col_schema": result["col_schema"],
                "stats": result["stats"],
            })
            .eq("id", upload_id)
            .execute()
        )
        upload = update_res.data[0]

        # Auto-generate dashboard config
        config = _build_dashboard_config(result["col_schema"])
        dash_res = (
            db.table("dashboards")
            .insert({
                "user_id": request.current_user_id,
                "upload_id": upload_id,
                "name": f"{filename} Dashboard",
                "config": config,
            })
            .execute()
        )
        dashboard = dash_res.data[0]

        return jsonify({"upload": upload, "dashboard_id": dashboard["id"]}), 201

    except Exception as e:
        # Mark upload as failed
        db.table("uploads").update({"status": "failed"}).eq("id", upload_id).execute()
        return jsonify({"error": str(e)}), 500


def _build_dashboard_config(col_schema: list) -> list:
    config = []
    date_col = next((c for c in col_schema if c["dtype"] == "date"), None)
    numeric_cols = [c for c in col_schema if c["dtype"] == "numeric"]
    cat_cols = [c for c in col_schema if c["dtype"] == "categorical"]

    if date_col and numeric_cols:
        config.append({
            "type": "SalesLineChart",
            "date_col": date_col["name"],
            "value_col": numeric_cols[0]["name"],
            "title": f"{numeric_cols[0]['name']} Over Time",
        })

    for col in numeric_cols[:4]:
        config.append({"type": "KPICard", "col": col["name"]})

    for col in cat_cols[:2]:
        config.append({"type": "CategoryBarChart", "col": col["name"], "title": f"Top {col['name']}"})

    return config
