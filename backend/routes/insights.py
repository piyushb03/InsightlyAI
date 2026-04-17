from flask import Blueprint, request, jsonify
from database import get_db
from auth_utils import require_auth
from services.insight_engine import generate_insights

insights_bp = Blueprint("insights", __name__)


@insights_bp.route("/<upload_id>", methods=["GET"])
@require_auth
def get_insights(upload_id):
    db = get_db()
    res = (
        db.table("insights")
        .select("*")
        .eq("upload_id", upload_id)
        .eq("user_id", request.current_user_id)
        .execute()
    )
    if not res.data:
        return jsonify(None)
    return jsonify(res.data[0])


@insights_bp.route("/<upload_id>/generate", methods=["POST"])
@require_auth
def generate(upload_id):
    db = get_db()

    # Verify this upload belongs to the current user
    upload_res = (
        db.table("uploads")
        .select("id, status, col_schema, stats")
        .eq("id", upload_id)
        .eq("user_id", request.current_user_id)
        .execute()
    )
    if not upload_res.data:
        return jsonify({"error": "Upload not found"}), 404

    upload = upload_res.data[0]
    if upload["status"] != "ready":
        return jsonify({"error": "Upload not ready yet"}), 400

    try:
        content = generate_insights(upload["id"], upload["col_schema"] or [], upload["stats"] or {})

        # Upsert: update if exists, insert if not
        existing = (
            db.table("insights")
            .select("id")
            .eq("upload_id", upload_id)
            .eq("user_id", request.current_user_id)
            .execute()
        )

        if existing.data:
            result = (
                db.table("insights")
                .update({"content": content})
                .eq("id", existing.data[0]["id"])
                .execute()
            )
        else:
            result = (
                db.table("insights")
                .insert({
                    "user_id": request.current_user_id,
                    "upload_id": upload_id,
                    "content": content,
                })
                .execute()
            )

        return jsonify(result.data[0])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
