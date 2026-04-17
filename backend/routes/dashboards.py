from flask import Blueprint, request, jsonify
from database import get_db
from auth_utils import require_auth

dashboards_bp = Blueprint("dashboards", __name__)


def _not_found():
    from flask import abort
    abort(404)


@dashboards_bp.route("", methods=["GET"])
@require_auth
def list_dashboards():
    db = get_db()
    res = (
        db.table("dashboards")
        .select("*, upload:uploads(*)")
        .eq("user_id", request.current_user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return jsonify(res.data)


@dashboards_bp.route("/<dashboard_id>", methods=["GET"])
@require_auth
def get_dashboard(dashboard_id):
    db = get_db()
    res = (
        db.table("dashboards")
        .select("*, upload:uploads(*)")
        .eq("id", dashboard_id)
        .eq("user_id", request.current_user_id)
        .execute()
    )
    if not res.data:
        return jsonify({"error": "Dashboard not found"}), 404
    return jsonify(res.data[0])
