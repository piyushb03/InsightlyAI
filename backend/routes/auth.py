from flask import Blueprint, jsonify
from auth_utils import require_auth
from flask import request

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/me", methods=["GET"])
@require_auth
def me():
    """Returns basic user info from the verified Supabase JWT."""
    return jsonify({
        "user": {
            "id": request.current_user_id,
            "email": request.current_user_email,
        }
    })
