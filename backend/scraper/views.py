from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .services import ScraperService
from .tasks import run_all_scrapers_task
from .models import ScrapedJob
from .serializers import ScrapedJobSerializer


class ScrapingRequestSerializer(Serializer):
    keyword = serializers.CharField(required=False)
    location = serializers.CharField(required=False)
    run_async = serializers.BooleanField(default=False, required=False)


@extend_schema(
    tags=['Scraper'],
    summary='Trigger job scraping',
    description='Manually trigger job scraping from configured job sites. Admin only.',
    request=ScrapingRequestSerializer,
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
        400: {'description': 'Invalid parameters'},
        403: {'description': 'Permission denied'},
        500: {'description': 'Scraping failed'}
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def trigger_scraping(request):
    """
    Manually trigger job scraping from configured sources.
    Requires admin privileges.
    """
    # First try to get data from request body (for POST requests)
    if request.method == 'POST' and request.data:
        serializer = ScrapingRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        keyword = serializer.validated_data.get('keyword')
        location = serializer.validated_data.get('location')
        run_async = serializer.validated_data.get('run_async', False)
    else:
        # Fall back to query params (for GET requests or backward compatibility)
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
