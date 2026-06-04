"""
============================================================
FILE: flask-backend/app/__init__.py
============================================================
OWNER:        Team Member 4 (Backend Developer — Python/Flask)
TECHNOLOGIES: Python 3.11+, Flask, Flask-CORS, python-dotenv,
              Application Factory Pattern, Blueprint Registration

INSTRUCTIONS FOR TEAM MEMBER 4:
─────────────────────────────────────────────────────────────
This file implements the Flask Application Factory Pattern.
Instead of creating the Flask app at module level (which
prevents easy testing and multiple app instances), the app is
created inside a `create_app()` function. This function is
called once by wsgi.py to produce the configured Flask
application instance.

STEPS TO IMPLEMENT:

1. Imports:
   - `from flask import Flask`
   - `from flask_cors import CORS`
   - `from dotenv import load_dotenv`
   - `import os`

2. `create_app(config_name: str = 'development') -> Flask` Function:
   - Define the application factory:
       `def create_app(config_name='development'):`

   Step a — Load environment variables:
       `load_dotenv()`  # reads .env file into os.environ

   Step b — Instantiate the Flask app:
       `app = Flask(__name__)`

   Step c — Load configuration:
       Configure the app using settings from environment variables:
       `app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-insecure-key')`
       `app.config['DEBUG'] = config_name == 'development'`
       `app.config['TESTING'] = config_name == 'test'`
       `app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024`  # 16MB max upload

   Step d — Configure CORS:
       `CORS(app, resources={`
       `    r'/api/*': {`
       `        'origins': os.getenv('FRONTEND_URL', 'http://localhost:5173'),`
       `        'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],`
       `        'allow_headers': ['Content-Type', 'Authorization'],`
       `    }`
       `})`
       - Only the /api/* prefix is CORS-enabled.
       - Origins are restricted to the frontend URL from .env.
       - For local development, allow both Vite (5173) and Node (5000).

   Step e — Register Blueprints:
       Import and register all Blueprint modules:
       `from app.routes.analytics import analytics_bp`
       `app.register_blueprint(analytics_bp)`

       Future blueprints to register as the app grows:
       `# from app.routes.tickets import tickets_bp`
       `# app.register_blueprint(tickets_bp)`
       `# from app.routes.health import health_bp`
       `# app.register_blueprint(health_bp)`

   Step f — Health Check Route (inline, not a Blueprint):
       Register a simple health check endpoint directly on app:
       `@app.route('/health')`
       `def health_check():`
       `    return {'status': 'ok', 'service': 'flask-backend'}, 200`

   Step g — Global Error Handlers:
       `@app.errorhandler(404)`
       `def not_found(e):`
       `    return {'error': 'Route not found'}, 404`

       `@app.errorhandler(500)`
       `def internal_error(e):`
       `    return {'error': 'Internal server error'}, 500`

       `@app.errorhandler(422)`
       `def unprocessable(e):`
       `    return {'error': 'Unprocessable request data'}, 422`

   Step h — Return the configured app:
       `return app`

3. Package Markers:
   - This __init__.py file also makes 'app' a Python package.
   - Do NOT import models or services at the top of this file
     (outside create_app) to avoid circular import issues.
   - All imports of models/services must happen INSIDE create_app()
     or inside the Blueprint files themselves.

4. Logging Configuration (optional but recommended):
   Inside create_app(), configure Python's logging module:
   `import logging`
   `logging.basicConfig(`
   `    level=logging.INFO if config_name == 'production' else logging.DEBUG,`
   `    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'`
   `)`
============================================================
"""
