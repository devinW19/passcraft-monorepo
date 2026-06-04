"""
============================================================
FILE: flask-backend/app/services/sentiment_analyzer.py
============================================================
OWNER:        Team Member 4 (Backend Developer — Python/Flask)
TECHNOLOGIES: Python 3.11+, VADER (vaderSentiment or NLTK),
              OR HuggingFace Transformers (distilbert-sentiment),
              PyMongo, pandas, scikit-learn (optional)

INSTRUCTIONS FOR TEAM MEMBER 4:
─────────────────────────────────────────────────────────────
This service module implements NLP-based sentiment analysis
on user review text data stored in MongoDB. It is called by
the Flask analytics route handlers. Choose ONE of the two
implementation approaches below:

  Option A: VADER (Simpler, no GPU needed — RECOMMENDED for MVP)
  Option B: HuggingFace Transformers (More accurate, requires
            model download and optionally GPU)

STEPS TO IMPLEMENT (Option A — VADER):

1. Imports:
   - `from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer`
   - `from app.config.database import reviews_collection`
   - `from bson import ObjectId`
   - `import re`

2. Analyser Instantiation:
   - Create a module-level singleton to avoid re-initialising
     on every function call:
       `analyser = SentimentIntensityAnalyzer()`

3. `clean_text(text: str) -> str` Helper:
   - Strip HTML tags, URLs, special characters, and extra whitespace
     from raw review text before analysis:
       `text = re.sub(r'<[^>]+>', ' ', text)`
       `text = re.sub(r'http\S+', '', text)`
       `text = re.sub(r'[^a-zA-Z0-9\s.,!?]', '', text)`
       `text = re.sub(r'\s+', ' ', text).strip()`
       `return text`

4. `analyse_text(text: str) -> dict` Function:
   - Export this function for use in route handlers:
       `def analyse_text(text: str) -> dict:`
       `    cleaned = clean_text(text)`
       `    scores = analyser.polarity_scores(cleaned)`
       `    # scores = { neg: float, neu: float, pos: float, compound: float }`
       `    # compound ranges from -1.0 (most negative) to +1.0 (most positive)`
       `    if scores['compound'] >= 0.05:`
       `        label = 'Positive'`
       `    elif scores['compound'] <= -0.05:`
       `        label = 'Negative'`
       `    else:`
       `        label = 'Neutral'`
       `    return { 'label': label, 'scores': scores, 'compound': scores['compound'] }`

5. `analyse_event_reviews(event_id: str) -> dict` Function:
   - Query MongoDB for all reviews belonging to a specific event:
       `def analyse_event_reviews(event_id: str) -> dict:`
       `    reviews = list(reviews_collection.find({'event_id': ObjectId(event_id)}))`
       `    if not reviews:`
       `        return { 'message': 'No reviews found', 'total': 0 }`
       `    results = [analyse_text(r['text']) for r in reviews]`
       `    labels = [r['label'] for r in results]`
       `    distribution = {`
       `        'Positive': labels.count('Positive'),`
       `        'Negative': labels.count('Negative'),`
       `        'Neutral':  labels.count('Neutral'),`
       `    }`
       `    avg_compound = sum(r['compound'] for r in results) / len(results)`
       `    return {`
       `        'total': len(reviews),`
       `        'distribution': distribution,`
       `        'averageCompound': round(avg_compound, 3),`
       `        'averageSentimentLabel': analyse_text('')['label'],  # recalculate on avg`
       `    }`

6. `get_global_sentiment_summary() -> dict` Function:
   - Aggregate sentiment across ALL events for the Dashboard:
       `def get_global_sentiment_summary() -> dict:`
       `    # Fetch all reviews, run analyse_text on each,`
       `    # group results into Positive / Negative / Neutral counts,`
       `    # calculate overall average compound score,`
       `    # return a dict suitable for the PieChart in Dashboard.jsx.`

STEPS TO IMPLEMENT (Option B — HuggingFace, for production):
   - Install: `transformers`, `torch` (or `tensorflow`).
   - Load a pre-trained model:
       `from transformers import pipeline`
       `sentiment_pipeline = pipeline(`
       `    'text-classification',`
       `    model='distilbert-base-uncased-finetuned-sst-2-english',`
       `    truncation=True, max_length=512`
       `)`
   - Replace VADER calls with: `sentiment_pipeline(text)[0]`
   - Labels returned: 'POSITIVE' or 'NEGATIVE' with a confidence score.
   - Cache the pipeline at module level to avoid reloading on each call.
============================================================
"""
