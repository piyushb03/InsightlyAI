from functools import wraps
from flask import request, jsonify
from database import get_db


def verify_supabase_user(token: str) -> dict | None:
    """
    Verify the token with Supabase and return user data.
    """
    try:
        supabase = get_db()
        response = supabase.auth.get_user(token)
        if response.user:
            return {
                "sub": response.user.id,
                "email": response.user.email
            }
        return None
    except Exception:
        return None


def get_token_from_request() -> str | None:
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_from_request()
        if not token:
            return jsonify({"error": "Missing authorization token"}), 401

        user_data = verify_supabase_user(token)
        if not user_data:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Store user info for use in routes
        request.current_user_id = user_data["sub"]
        request.current_user_email = user_data.get("email", "")
        return f(*args, **kwargs)

    return decorated
