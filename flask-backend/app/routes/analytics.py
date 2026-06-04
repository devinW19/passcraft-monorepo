"""
============================================================
FILE: flask-backend/app/routes/analytics.py
============================================================
OWNER:        Team Member 4 (Backend Developer — Python/Flask)
TECHNOLOGIES: Python 3.11+, Flask (Blueprint, jsonify, request),
              PyMongo (aggregation pipeline), bson.ObjectId,
              sentiment_analyzer service, datetime

INSTRUCTIONS FOR TEAM MEMBER 4:
─────────────────────────────────────────────────────────────
This module defines a Flask Blueprint named 'analytics' that
contains all API endpoints consumed by the React Dashboard.jsx
component. It aggregates data from MongoDB using PyMongo's
aggregation pipeline and calls the sentiment analyser service.
All responses are returned as JSON.

STEPS TO IMPLEMENT:

1. Imports:
   - `from flask import Blueprint, jsonify, request`
   - `from app.config.database import events_collection, bookings_collection, reviews_collection`
   - `from app.services.sentiment_analyzer import get_global_sentiment_summary, analyse_event_reviews`
   - `from bson import ObjectId`
   - `from datetime import datetime, timedelta`
   - `import math`

2. Blueprint Instantiation:
   - `analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')`
   - This Blueprint is registered in app/__init__.py.

3. `GET /api/analytics/overview` → Overview Stats:
   - @analytics_bp.route('/overview', methods=['GET'])
   - def get_overview():
   - Query MongoDB to compute:
       total_events   = events_collection.count_documents({'isPublished': True})
       total_bookings = bookings_collection.count_documents({})
       # Total revenue: sum of totalAmount across all confirmed bookings:
       revenue_pipeline = [
           {'$match': {'status': 'confirmed'}},
           {'$group': {'_id': None, 'total': {'$sum': '$totalAmount'}}}
       ]
       revenue_result = list(bookings_collection.aggregate(revenue_pipeline))
       total_revenue = revenue_result[0]['total'] if revenue_result else 0
       # Average sentiment compound score:
       sentiment = get_global_sentiment_summary()
       avg_sentiment = round(sentiment.get('averageCompound', 0) * 100, 1)
   - Return:
       return jsonify({
           'totalEvents':    total_events,
           'totalBookings':  total_bookings,
           'totalRevenue':   round(total_revenue, 2),
           'avgSentiment':   avg_sentiment,
       }), 200

4. `GET /api/analytics/bookings-trend` → 30-day Booking Trend:
   - @analytics_bp.route('/bookings-trend', methods=['GET'])
   - def get_bookings_trend():
   - Use a MongoDB aggregation pipeline to group booking counts
     by day for the last 30 days:
       thirty_days_ago = datetime.utcnow() - timedelta(days=30)
       pipeline = [
           {'$match': {'createdAt': {'$gte': thirty_days_ago}}},
           {'$group': {
               '_id': {
                   'year':  {'$year':  '$createdAt'},
                   'month': {'$month': '$createdAt'},
                   'day':   {'$dayOfMonth': '$createdAt'},
               },
               'bookings': {'$sum': 1},
               'revenue':  {'$sum': '$totalAmount'},
           }},
           {'$sort': {'_id': 1}},
       ]
       results = list(bookings_collection.aggregate(pipeline))
   - Transform each result into a flat dict:
       { 'date': 'Jan 01', 'bookings': 12, 'revenue': 599.88 }
   - Return the array as JSON for Recharts LineChart.

5. `GET /api/analytics/sentiment` → Sentiment Distribution:
   - @analytics_bp.route('/sentiment', methods=['GET'])
   - def get_sentiment_distribution():
   - Call get_global_sentiment_summary() from the service.
   - Transform the distribution dict into a list format for
     Recharts PieChart:
       [
           { 'name': 'Positive', 'value': 42 },
           { 'name': 'Negative', 'value': 8  },
           { 'name': 'Neutral',  'value': 15 },
       ]
   - Return as JSON.

6. `GET /api/analytics/top-events` → Top Events by Bookings:
   - @analytics_bp.route('/top-events', methods=['GET'])
   - def get_top_events():
   - Aggregate top 5 events by booking count:
       pipeline = [
           {'$group': {'_id': '$event', 'bookings': {'$sum': '$quantity'}}},
           {'$sort': {'bookings': -1}},
           {'$limit': 5},
           {'$lookup': {
               'from': 'events',
               'localField': '_id',
               'foreignField': '_id',
               'as': 'eventDetails',
           }},
           {'$unwind': '$eventDetails'},
           {'$project': {
               'title': '$eventDetails.title',
               'bookings': 1,
               '_id': 0,
           }},
       ]
       results = list(bookings_collection.aggregate(pipeline))
   - Return as JSON for Recharts BarChart.

7. `GET /api/analytics/event/<event_id>/sentiment` → Per-Event Sentiment:
   - @analytics_bp.route('/event/<string:event_id>/sentiment', methods=['GET'])
   - def get_event_sentiment(event_id):
   - Call analyse_event_reviews(event_id) from sentiment_analyzer.
   - Return the result as JSON.

8. Error Handling:
   - Wrap DB operations in try/except blocks.
   - On PyMongo exceptions, return:
       return jsonify({'error': 'Database query failed'}), 500
   - On invalid ObjectId format:
       return jsonify({'error': 'Invalid event ID format'}), 400
============================================================
"""
