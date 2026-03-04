from flask import Blueprint, request, jsonify
from models import Dashboard
from auth_utils import require_auth

dashboards_bp = Blueprint("dashboards", __name__)


@dashboards_bp.route("", methods=["GET"])
@require_auth
def list_dashboards():
    dashboards = (
        Dashboard.query.filter_by(user_id=request.current_user.id)
        .order_by(Dashboard.created_at.desc())
        .all()
    )
    return jsonify([d.to_dict() for d in dashboards])


@dashboards_bp.route("/<dashboard_id>", methods=["GET"])
@require_auth
def get_dashboard(dashboard_id):
    dashboard = Dashboard.query.filter_by(
        id=dashboard_id, user_id=request.current_user.id
    ).first_or_404()
    return jsonify(dashboard.to_dict())
