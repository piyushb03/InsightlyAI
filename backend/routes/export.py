import os
from flask import Blueprint, request, send_file
from database import get_db
from auth_utils import require_auth
from services.report_generator import generate_pdf_report

export_bp = Blueprint("export", __name__)


@export_bp.route("/<upload_id>", methods=["GET"])
@require_auth
def export_report(upload_id):
    db = get_db()

    upload_res = (
        db.table("uploads")
        .select("*")
        .eq("id", upload_id)
        .eq("user_id", request.current_user_id)
        .execute()
    )
    if not upload_res.data:
        return {"error": "Upload not found"}, 404

    upload = upload_res.data[0]

    insight_res = (
        db.table("insights")
        .select("*")
        .eq("upload_id", upload_id)
        .execute()
    )
    insight = insight_res.data[0] if insight_res.data else None

    pdf_buffer = generate_pdf_report(upload, insight)

    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"InsightlyAI_Report_{upload['filename']}.pdf",
        mimetype="application/pdf",
    )
