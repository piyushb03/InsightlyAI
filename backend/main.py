from flask import Flask
from flask_cors import CORS
from config import Config
from database import init_db
from routes.auth import auth_bp
from routes.uploads import uploads_bp
from routes.dashboards import dashboards_bp
from routes.insights import insights_bp
from routes.forecast import forecast_bp
from routes.export import export_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

    init_db(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(uploads_bp, url_prefix="/api/uploads")
    app.register_blueprint(dashboards_bp, url_prefix="/api/dashboards")
    app.register_blueprint(insights_bp, url_prefix="/api/insights")
    app.register_blueprint(forecast_bp, url_prefix="/api/forecast")
    app.register_blueprint(export_bp, url_prefix="/api/export")

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
