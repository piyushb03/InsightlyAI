import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from database import db
from models import Upload, Dashboard
from auth_utils import require_auth
from services.ingestor import ingest_file

uploads_bp = Blueprint("uploads", __name__)

ALLOWED_EXTENSIONS = {"csv", "xlsx", "xls"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@uploads_bp.route("", methods=["GET"])
@require_auth
def list_uploads():
    uploads = (
        Upload.query.filter_by(user_id=request.current_user.id)
        .order_by(Upload.created_at.desc())
        .all()
    )
    return jsonify([u.to_dict() for u in uploads])


@uploads_bp.route("", methods=["POST"])
@require_auth
def create_upload():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename or not allowed_file(file.filename):
        return jsonify({"error": "File must be CSV or Excel (.xlsx, .xls)"}), 400

    filename = secure_filename(file.filename)
    user_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], request.current_user.id)
    os.makedirs(user_dir, exist_ok=True)

    storage_key = os.path.join(request.current_user.id, filename)
    file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], storage_key)
    file.save(file_path)

    upload = Upload(
        user_id=request.current_user.id,
        filename=filename,
        storage_key=storage_key,
        status="pending",
    )
    db.session.add(upload)
    db.session.commit()

    # Ingest synchronously (fast for small files)
    try:
        result = ingest_file(upload.id, file_path)
        upload.status = "ready"
        upload.row_count = result["row_count"]
        upload.col_schema = result["col_schema"]
        upload.stats = result["stats"]

        # Auto-generate dashboard config
        config = _build_dashboard_config(result["col_schema"])
        dashboard = Dashboard(
            user_id=request.current_user.id,
            upload_id=upload.id,
            name=f"{filename} Dashboard",
            config=config,
        )
        db.session.add(dashboard)
        db.session.commit()

        return jsonify({"upload": upload.to_dict(), "dashboard_id": dashboard.id}), 201
    except Exception as e:
        upload.status = "failed"
        db.session.commit()
        return jsonify({"error": str(e)}), 500


def _build_dashboard_config(col_schema: list) -> list:
    config = []
    date_col = next((c for c in col_schema if c["dtype"] == "date"), None)
    numeric_cols = [c for c in col_schema if c["dtype"] == "numeric"]
    cat_cols = [c for c in col_schema if c["dtype"] == "categorical"]

    if date_col and numeric_cols:
        config.append({"type": "SalesLineChart", "date_col": date_col["name"], "value_col": numeric_cols[0]["name"], "title": f"{numeric_cols[0]['name']} Over Time"})

    for col in numeric_cols[:4]:
        config.append({"type": "KPICard", "col": col["name"]})

    for col in cat_cols[:2]:
        config.append({"type": "CategoryBarChart", "col": col["name"], "title": f"Top {col['name']}"})

    return config
