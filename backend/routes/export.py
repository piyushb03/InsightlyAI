import os
from flask import Blueprint, request, send_file, current_app
from models import Upload
from auth_utils import require_auth

export_bp = Blueprint("export", __name__)


@export_bp.route("/<upload_id>", methods=["GET"])
@require_auth
def export_csv(upload_id):
    upload = Upload.query.filter_by(id=upload_id, user_id=request.current_user.id).first_or_404()
    file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], upload.storage_key)
    if not os.path.exists(file_path):
        return {"error": "File not found"}, 404
    return send_file(file_path, as_attachment=True, download_name=upload.filename)
