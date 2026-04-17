import jwt
from functools import wraps
from flask import request, jsonify, current_app


def decode_supabase_token(token: str) -> dict | None:
    """
    Verify a Supabase-issued JWT using the project's JWT secret.
    The secret is the value from:
      Supabase Dashboard → Settings → API → JWT Settings → JWT Secret
    Set it as SUPABASE_JWT_SECRET in backend/.env
    """
    try:
        secret = current_app.config["SUPABASE_JWT_SECRET"]
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            audience="authenticated",  # Supabase always sets aud=authenticated
            options={"verify_exp": True},
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
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

        payload = decode_supabase_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Supabase stores the user UUID in the `sub` claim
        request.current_user_id = payload["sub"]
        request.current_user_email = payload.get("email", "")
        return f(*args, **kwargs)

    return decorated
