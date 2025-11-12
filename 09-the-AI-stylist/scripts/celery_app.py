"""
--- Step 8: Asynchronous Tasks (Celery Configuration) ---
This file configures Celery to use Redis as the message broker.
Celery allows us to run tasks in the background without blocking API requests.
"""

from celery import Celery

# Create Celery app instance
# 'style_journal_tasks' is the name of our Celery application
celery_app = Celery(
    'style_journal_tasks',
    broker='redis://localhost:6379/0',  # Redis connection URL (message broker)
    backend='redis://localhost:6379/0'  # Redis connection URL (result backend)
)

# Celery configuration
celery_app.conf.update(
    task_serializer='json',           # Serialize tasks as JSON
    accept_content=['json'],          # Accept only JSON content
    result_serializer='json',         # Serialize results as JSON
    timezone='UTC',                   # Use UTC timezone
    enable_utc=True,                  # Enable UTC
    task_track_started=True,          # Track when tasks start
    task_time_limit=300,              # Task timeout: 5 minutes (300 seconds)
    result_expires=3600,              # Results expire after 1 hour
)

# Auto-discover tasks from the tasks module
celery_app.autodiscover_tasks(['scripts'])

print("✓ Celery app configured successfully!")
print("  Broker: redis://localhost:6379/0")
print("  Backend: redis://localhost:6379/0")
