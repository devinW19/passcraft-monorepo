"""
============================================================
FILE: flask-backend/app/config/database.py
============================================================
OWNER:        Team Member 4 (Backend Developer — Python/Flask)
TECHNOLOGIES: Python 3.11+, PyMongo, python-dotenv,
              MongoDB Atlas (Cloud), pymongo.MongoClient

INSTRUCTIONS FOR TEAM MEMBER 4:
─────────────────────────────────────────────────────────────
This module initialises and provides access to the MongoDB
client and database instance used by all Flask route handlers
and service modules. It follows a module-level singleton
pattern — the client is created once and reused across all
requests to avoid connection pool exhaustion.

STEPS TO IMPLEMENT:

1. Imports:
   - `from pymongo import MongoClient`
   - `from pymongo.errors import ConnectionFailure`
   - `import os`
   - `from dotenv import load_dotenv`

2. Load Environment Variables:
   - Call `load_dotenv()` at the top of this module.
   - This reads variables from flask-backend/.env into os.environ.

3. Read the MongoDB URI:
   - `MONGO_URI = os.getenv('MONGO_URI')`
   - `DB_NAME   = os.getenv('MONGO_DB_NAME', 'passcraft')`
   - If MONGO_URI is None, raise an EnvironmentError:
       `if not MONGO_URI:`
       `    raise EnvironmentError('MONGO_URI not set in .env')`

4. MongoClient Instantiation:
   - Create the client with connection pool configuration:
       `client = MongoClient(`
       `    MONGO_URI,`
       `    maxPoolSize=50,`       # max concurrent connections
       `    minPoolSize=5,`        # maintain at least 5 connections
       `    serverSelectionTimeoutMS=5000,`  # fail fast if unreachable
       `    connectTimeoutMS=10000,`
       `    socketTimeoutMS=20000,`
       `)`
   - maxPoolSize=50 prevents resource exhaustion under load.
   - serverSelectionTimeoutMS=5000 ensures a quick startup
     failure if Atlas is unreachable (instead of hanging).

5. Connectivity Check:
   - After creating the client, verify the connection:
       `try:`
       `    client.admin.command('ping')`
       `    print('[Flask DB] MongoDB connection established.')`
       `except ConnectionFailure as e:`
       `    print(f'[Flask DB] Could not connect to MongoDB: {e}')`
       `    raise`
   - This runs at import time (module load), so if the DB is
     unreachable, the Flask app will fail to start with a
     clear error message.

6. Database and Collection Accessors:
   - Expose the target database as a module-level variable:
       `db = client[DB_NAME]`
   - Expose individual collection handles for convenience:
       `events_collection   = db['events']`
       `bookings_collection = db['bookings']`
       `users_collection    = db['users']`
       `reviews_collection  = db['reviews']`
   - Import these collection variables in service modules:
       `from app.config.database import events_collection`

7. Get DB Helper Function (for use with Flask app context):
   - Optionally, expose a `get_db()` function:
       `def get_db():`
       `    return db`
   - This can be used with Flask's g object if you prefer
     request-scoped DB access.
============================================================
"""
