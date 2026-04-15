import os
from flask import Blueprint, request, send_file, current_app
from models import Upload, Insight
from auth_utils import require_auth
from services.report_generator import generate_pdf_report

export_bp = Blueprint("export", __name__)


@export_bp.route("/<upload_id>", methods=["GET"])
@require_auth
def export_report(upload_id):
    upload = Upload.query.filter_by(id=upload_id, user_id=request.current_user.id).first_or_404()
    insight = Insight.query.filter_by(upload_id=upload.id).first()
    
    pdf_buffer = generate_pdf_report(upload, insight)
    
    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"InsightlyAI_Report_{upload.filename}.pdf",
        mimetype="application/pdf"
    )
