from celery import shared_task

@shared_task
def sample_task():
    print("This is a stub task. Replace with real logic later.")
