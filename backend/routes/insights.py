from flask import Blueprint, request, jsonify
from database import db
from models import Insight, Upload
from auth_utils import require_auth
from services.insight_engine import generate_insights

insights_bp = Blueprint("insights", __name__)


@insights_bp.route("/<upload_id>", methods=["GET"])
@require_auth
def get_insights(upload_id):
    insight = Insight.query.filter_by(upload_id=upload_id, user_id=request.current_user.id).first()
    if not insight:
        return jsonify(None)
    return jsonify(insight.to_dict())


@insights_bp.route("/<upload_id>/generate", methods=["POST"])
@require_auth
def generate(upload_id):
    upload = Upload.query.filter_by(id=upload_id, user_id=request.current_user.id).first_or_404()
    if upload.status != "ready":
        return jsonify({"error": "Upload not ready yet"}), 400

    try:
        content = generate_insights(upload.id, upload.col_schema or [], upload.stats or {})
        insight = Insight.query.filter_by(upload_id=upload_id, user_id=request.current_user.id).first()
        if insight:
            insight.content = content
        else:
            insight = Insight(user_id=request.current_user.id, upload_id=upload_id, content=content)
            db.session.add(insight)
        db.session.commit()
        return jsonify(insight.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
