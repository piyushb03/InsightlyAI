from flask import Blueprint, request, jsonify
from database import get_db
from auth_utils import require_auth
from services.forecaster import generate_forecast

forecast_bp = Blueprint("forecast", __name__)


@forecast_bp.route("/<upload_id>", methods=["GET"])
@require_auth
def get_forecast(upload_id):
    db = get_db()
    res = (
        db.table("forecasts")
        .select("*")
        .eq("upload_id", upload_id)
        .eq("user_id", request.current_user_id)
        .execute()
    )
    if not res.data:
        return jsonify(None)
    return jsonify(res.data[0])


@forecast_bp.route("/<upload_id>/generate", methods=["POST"])
@require_auth
def generate(upload_id):
    db = get_db()

    upload_res = (
        db.table("uploads")
        .select("id, status, col_schema, storage_key")
        .eq("id", upload_id)
        .eq("user_id", request.current_user_id)
        .execute()
    )
    if not upload_res.data:
        return jsonify({"error": "Upload not found"}), 404

    upload = upload_res.data[0]
    if upload["status"] != "ready":
        return jsonify({"error": "Upload not ready yet"}), 400

    data = request.get_json() or {}
    col_schema = upload["col_schema"] or []
    date_col = data.get("date_col") or next(
        (c["name"] for c in col_schema if c["dtype"] == "date"), None
    )
    target_col = data.get("target_col") or next(
        (c["name"] for c in col_schema if c["dtype"] == "numeric"), None
    )

    if not date_col or not target_col:
        return jsonify({"error": "Could not detect date and numeric columns for forecasting"}), 400

    import os
    from config import Config
    file_path = os.path.join(Config.UPLOAD_FOLDER, upload["storage_key"])

    try:
        forecast_data = generate_forecast(upload["id"], file_path, date_col, target_col, horizon_days=90)

        existing = (
            db.table("forecasts")
            .select("id")
            .eq("upload_id", upload_id)
            .eq("user_id", request.current_user_id)
            .execute()
        )

        if existing.data:
            result = (
                db.table("forecasts")
                .update({
                    "data": forecast_data,
                    "date_col": date_col,
                    "target_col": target_col,
                })
                .eq("id", existing.data[0]["id"])
                .execute()
            )
        else:
            result = (
                db.table("forecasts")
                .insert({
                    "user_id": request.current_user_id,
                    "upload_id": upload_id,
                    "date_col": date_col,
                    "target_col": target_col,
                    "data": forecast_data,
                })
                .execute()
            )

        return jsonify(result.data[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
