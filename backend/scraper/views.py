from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .services import ScraperService
from .tasks import run_all_scrapers_task
from .models import ScrapedJob
from .serializers import ScrapedJobSerializer


@extend_schema(
    tags=['Scraper'],
    summary='Trigger job scraping',
    description='Manually trigger job scraping from configured job sites. Admin only.',
    parameters=[
        OpenApiParameter(
            name='keyword',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Job keyword to search for',
            required=False
        ),
        OpenApiParameter(
            name='location',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Location to filter jobs',
            required=False
        ),
        OpenApiParameter(
            name='async',
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            description='Run scraping asynchronously using Celery',
            required=False
        ),
    ],
    responses={
        200: {
            'description': 'Scraping completed successfully',
            'examples': {
                'application/json': {
                    'message': 'Scraping completed',
                    'jobs_found': 25,
                    'jobs_saved': 15
                }
            }
        },
        202: {
            'description': 'Scraping task queued',
            'examples': {
                'application/json': {
                    'message': 'Scraping task queued',
                    'task_id': 'abc123'
                }
            }
        }
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def trigger_scraping(request):
    """
    Manually trigger job scraping from configured sources.
    Requires admin privileges.
    """
    keyword = request.query_params.get('keyword')
    location = request.query_params.get('location')
    run_async = request.query_params.get('async', 'false').lower() == 'true'
    
    if run_async:
        # Run asynchronously with Celery
        task = run_all_scrapers_task.delay(keyword=keyword, location=location)
        return Response({
            'message': 'Scraping task queued',
            'task_id': str(task.id)
        }, status=status.HTTP_202_ACCEPTED)
    else:
        # Run synchronously
        scraper_service = ScraperService(keyword=keyword, location=location)
        jobs = scraper_service.run_all_scrapers()
        
        # Save to database
        saved_count = 0
        for job_data in jobs:
            try:
                ScrapedJob.objects.get_or_create(
                    job_url=job_data.get('url', ''),
                    defaults={
                        'title': job_data.get('title', ''),
                        'company_name': job_data.get('company', ''),
                        'location': job_data.get('location', ''),
                        'description': job_data.get('description', ''),
                        'source_website': job_data.get('source', ''),
                    }
                )
                saved_count += 1
            except Exception as e:
                print(f"Error saving job: {e}")
                continue
        
        return Response({
            'message': 'Scraping completed',
            'jobs_found': len(jobs),
            'jobs_saved': saved_count
        }, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Scraper'],
    summary='List scraped jobs',
    description='Get a list of all scraped jobs from external sources',
    parameters=[
        OpenApiParameter(
            name='source',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filter by source website',
            required=False
        ),
    ],
    responses={200: ScrapedJobSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_scraped_jobs(request):
    """
    List all scraped jobs. Can be filtered by source website.
    """
    source = request.query_params.get('source')
    
    queryset = ScrapedJob.objects.all().order_by('-created_at')
    
    if source:
        queryset = queryset.filter(source_website=source)
    
    serializer = ScrapedJobSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
