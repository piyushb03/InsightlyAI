from flask import Blueprint, request, jsonify
from database import db
from models import Forecast, Upload
from auth_utils import require_auth
from services.forecaster import generate_forecast

forecast_bp = Blueprint("forecast", __name__)


@forecast_bp.route("/<upload_id>", methods=["GET"])
@require_auth
def get_forecast(upload_id):
    forecast = Forecast.query.filter_by(upload_id=upload_id, user_id=request.current_user.id).first()
    if not forecast:
        return jsonify(None)
    return jsonify(forecast.to_dict())


@forecast_bp.route("/<upload_id>/generate", methods=["POST"])
@require_auth
def generate(upload_id):
    upload = Upload.query.filter_by(id=upload_id, user_id=request.current_user.id).first_or_404()
    if upload.status != "ready":
        return jsonify({"error": "Upload not ready yet"}), 400

    data = request.get_json() or {}
    col_schema = upload.col_schema or []
    date_col = data.get("date_col") or next((c["name"] for c in col_schema if c["dtype"] == "date"), None)
    target_col = data.get("target_col") or next((c["name"] for c in col_schema if c["dtype"] == "numeric"), None)

    if not date_col or not target_col:
        return jsonify({"error": "Could not detect date and numeric columns for forecasting"}), 400

    from config import Config
    upload_folder = Config.UPLOAD_FOLDER
    import os
    file_path = os.path.join(upload_folder, upload.storage_key)

    try:
        forecast_data = generate_forecast(upload.id, file_path, date_col, target_col, horizon_days=90)
        forecast = Forecast.query.filter_by(upload_id=upload_id, user_id=request.current_user.id).first()
        if forecast:
            forecast.data = forecast_data
            forecast.date_col = date_col
            forecast.target_col = target_col
        else:
            forecast = Forecast(user_id=request.current_user.id, upload_id=upload_id, date_col=date_col, target_col=target_col, data=forecast_data)
            db.session.add(forecast)
        db.session.commit()
        return jsonify(forecast.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
