"""
============================================================
FILE: flask-backend/wsgi.py
============================================================
OWNER:        Team Member 4 (Backend Developer — Python/Flask)
TECHNOLOGIES: Python 3.11+, Flask Application Factory,
              Gunicorn (production WSGI server), python-dotenv

INSTRUCTIONS FOR TEAM MEMBER 4:
─────────────────────────────────────────────────────────────
This is the WSGI entry point script. It calls the application
factory to create the Flask app instance and exposes it as
`application`, which is the conventional name used by all
WSGI-compatible servers (Gunicorn, uWSGI, mod_wsgi, etc.).

This file is the top-level entry point — it is NOT a Flask
module and contains no route definitions or business logic.

STEPS TO IMPLEMENT:

1. Imports:
   - `import os`
   - `from app import create_app`

2. Determine Config Name:
   - Read the desired configuration from the environment:
       `config_name = os.getenv('FLASK_ENV', 'development')`
   - Valid values: 'development', 'production', 'test'
   - The value maps to conditional logic inside create_app().

3. Create the Application Instance:
   - Call the factory function:
       `application = create_app(config_name)`
   - The variable MUST be named `application` (lowercase).
     Gunicorn uses `wsgi:application` as the default entry point
     target when you run:
         `gunicorn --bind 0.0.0.0:5001 wsgi:application`

4. Development Server Block:
   - Include a guard for running the dev server directly:
       `if __name__ == '__main__':`
       `    port = int(os.getenv('PORT', 5001))`
       `    debug = config_name == 'development'`
       `    application.run(`
       `        host='0.0.0.0',`
       `        port=port,`
       `        debug=debug,`
       `    )`
   - In development, Flask's built-in Werkzeug server is used.
   - In production (Docker), Gunicorn is used instead — do NOT
     use Flask's built-in server in production.

5. Gunicorn Production Run Command:
   - The Dockerfile CMD should invoke:
       gunicorn
         --bind 0.0.0.0:5001
         --workers 4
         --timeout 120
         --access-logfile -
         --error-logfile -
         wsgi:application
   - Workers = (2 × CPU cores) + 1 is a common formula.
   - For the Docker container (1–2 vCPUs), 4 workers is appropriate.
   - --access-logfile - and --error-logfile - route logs to stdout/stderr,
     which Docker captures and forwards to your logging infrastructure.

6. Environment Validation (optional):
   - Before create_app(), validate that critical env vars exist:
       `required_env = ['MONGO_URI', 'SECRET_KEY']`
       `missing = [v for v in required_env if not os.getenv(v)]`
       `if missing:`
       `    raise EnvironmentError(f'Missing required env vars: {missing}')`
   - This provides a clear startup error if .env is not configured.
============================================================
"""
