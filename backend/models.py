import uuid
from datetime import datetime
from database import db


def gen_uuid():
    return str(uuid.uuid4())


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    uploads = db.relationship("Upload", backref="user", lazy=True, cascade="all, delete-orphan")
    dashboards = db.relationship("Dashboard", backref="user", lazy=True, cascade="all, delete-orphan")
    insights = db.relationship("Insight", backref="user", lazy=True, cascade="all, delete-orphan")
    forecasts = db.relationship("Forecast", backref="user", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {"id": self.id, "email": self.email, "created_at": self.created_at.isoformat()}


class Upload(db.Model):
    __tablename__ = "uploads"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, index=True)
    filename = db.Column(db.String(255), nullable=False)
    storage_key = db.Column(db.String(512), nullable=False)   # local path: uploads/{user_id}/{filename}
    status = db.Column(db.String(20), default="pending")       # pending | ready | failed
    row_count = db.Column(db.Integer)
    col_schema = db.Column(db.JSON)                            # [{name, dtype, sample_values, unique_count}]
    stats = db.Column(db.JSON)                                 # {col: {sum, mean, min, max}}
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    dashboards = db.relationship("Dashboard", backref="upload", lazy=True, cascade="all, delete-orphan")
    insights = db.relationship("Insight", backref="upload", lazy=True, cascade="all, delete-orphan")
    forecasts = db.relationship("Forecast", backref="upload", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "status": self.status,
            "row_count": self.row_count,
            "col_schema": self.col_schema,
            "stats": self.stats,
            "created_at": self.created_at.isoformat(),
        }


class Dashboard(db.Model):
    __tablename__ = "dashboards"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, index=True)
    upload_id = db.Column(db.String(36), db.ForeignKey("uploads.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    config = db.Column(db.JSON, default=list)                  # [{type, col, title, ...}]
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "upload_id": self.upload_id,
            "name": self.name,
            "config": self.config,
            "created_at": self.created_at.isoformat(),
            "upload": self.upload.to_dict() if self.upload else None,
        }


class Insight(db.Model):
    __tablename__ = "insights"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, index=True)
    upload_id = db.Column(db.String(36), db.ForeignKey("uploads.id"), nullable=False)
    content = db.Column(db.JSON)                               # {summary, top_performers, anomalies, trends, recommendations}
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {"id": self.id, "upload_id": self.upload_id, "content": self.content, "created_at": self.created_at.isoformat()}


class Forecast(db.Model):
    __tablename__ = "forecasts"

    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, index=True)
    upload_id = db.Column(db.String(36), db.ForeignKey("uploads.id"), nullable=False)
    date_col = db.Column(db.String(100), nullable=False)
    target_col = db.Column(db.String(100), nullable=False)
    horizon_days = db.Column(db.Integer, default=90)
    data = db.Column(db.JSON)                                  # [{ds, yhat, yhat_lower, yhat_upper}]
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "upload_id": self.upload_id,
            "date_col": self.date_col,
            "target_col": self.target_col,
            "data": self.data,
            "created_at": self.created_at.isoformat(),
        }
