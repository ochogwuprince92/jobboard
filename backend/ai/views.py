from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes

from .services import ResumeParser, JobMatcher, SkillExtractor
from jobs.models import Job
from resumes.models import Resume


@extend_schema(
    tags=['AI'],
    summary='Parse resume',
    description='Extract structured information from resume text using AI',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'resume_text': {
                    'type': 'string',
                    'description': 'Full resume text content'
                }
            },
            'required': ['resume_text']
        }
    },
    responses={
        200: {
            'description': 'Resume parsed successfully',
            'examples': {
                'application/json': {
                    'email': 'john@example.com',
                    'phone': '+1234567890',
                    'skills': {
                        'programming_languages': ['python', 'javascript'],
                        'web_frameworks': ['django', 'react']
                    },
                    'all_skills': ['python', 'javascript', 'django', 'react'],
                    'education': ['Bachelor of Science in Computer Science'],
                    'experience_years': 5
                }
            }
        }
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def parse_resume(request):
    """
    Parse resume text and extract structured information including:
    - Contact information (email, phone)
    - Skills (categorized by type)
    - Education
    - Years of experience
    """
    resume_text = request.data.get('resume_text', '')
    
    if not resume_text:
        return Response(
            {'error': 'resume_text is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    parsed_data = ResumeParser.parse_resume(resume_text)
    
    return Response(parsed_data, status=status.HTTP_200_OK)


@extend_schema(
    tags=['AI'],
    summary='Extract skills from text',
    description='Extract and categorize skills from job description or resume text',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'text': {
                    'type': 'string',
                    'description': 'Text to extract skills from'
                }
            },
            'required': ['text']
        }
    },
    responses={
        200: {
            'description': 'Skills extracted successfully',
            'examples': {
                'application/json': {
                    'skills': {
                        'programming_languages': ['python', 'java'],
                        'databases': ['postgresql', 'mongodb'],
                        'cloud_devops': ['aws', 'docker']
                    },
                    'all_skills': ['python', 'java', 'postgresql', 'mongodb', 'aws', 'docker']
                }
            }
        }
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def extract_skills(request):
    """
    Extract skills from text and categorize them by type
    (programming languages, frameworks, databases, etc.)
    """
    text = request.data.get('text', '')
    
    if not text:
        return Response(
            {'error': 'text is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    skills = SkillExtractor.extract_skills(text)
    all_skills = SkillExtractor.get_all_skills_flat(text)
    
    return Response({
        'skills': skills,
        'all_skills': all_skills
    }, status=status.HTTP_200_OK)


@extend_schema(
    tags=['AI'],
    summary='Match resume to job',
    description='Calculate match score between a resume and job posting',
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'resume_id': {
                    'type': 'integer',
                    'description': 'Resume ID to match'
                },
                'job_id': {
                    'type': 'integer',
                    'description': 'Job ID to match against'
                },
                'resume_text': {
                    'type': 'string',
                    'description': 'Optional: Resume text if resume_id not provided'
                }
            }
        }
    },
    responses={
        200: {
            'description': 'Match calculated successfully',
            'examples': {
                'application/json': {
                    'overall_score': 75.5,
                    'skill_match': 80.0,
                    'text_similarity': 68.5,
                    'match_level': 'Excellent',
                    'matched_skills': ['python', 'django', 'postgresql'],
                    'missing_skills': ['react', 'aws'],
                    'resume_skills': ['python', 'django', 'postgresql', 'mongodb'],
                    'job_skills': ['python', 'django', 'postgresql', 'react', 'aws']
                }
            }
        }
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def match_resume_to_job(request):
    """
    Calculate how well a resume matches a job posting.
    Returns overall score, skill match, and missing skills.
    """
    resume_id = request.data.get('resume_id')
    job_id = request.data.get('job_id')
    resume_text = request.data.get('resume_text')
    
    # Get job
    try:
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response(
            {'error': 'Job not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get resume text
    if resume_id:
        try:
            resume = Resume.objects.get(id=resume_id, user=request.user)
            # Assuming Resume model has a way to get text content
            # You may need to adjust this based on your Resume model
            resume_text = getattr(resume, 'content', '') or str(resume.file.read().decode('utf-8', errors='ignore') if resume.file else '')
        except Resume.DoesNotExist:
            return Response(
                {'error': 'Resume not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    if not resume_text:
        return Response(
            {'error': 'resume_text or resume_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Calculate match
    match_result = JobMatcher.match_resume_to_job(
        resume_text=resume_text,
        job_description=job.description,
        job_requirements=job.requirements or ""
    )
    
    return Response(match_result, status=status.HTTP_200_OK)


@extend_schema(
    tags=['AI'],
    summary='Get job recommendations',
    description='Get recommended jobs for a user based on their resume',
    parameters=[
        OpenApiParameter(
            name='resume_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Resume ID to base recommendations on',
            required=True
        ),
        OpenApiParameter(
            name='limit',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Number of recommendations to return (default: 10)',
            required=False
        ),
    ],
    responses={
        200: {
            'description': 'Recommendations generated successfully',
            'examples': {
                'application/json': {
                    'recommendations': [
                        {
                            'job_id': 1,
                            'job_title': 'Senior Python Developer',
                            'company': 'Tech Corp',
                            'match_score': 85.5,
                            'match_level': 'Excellent',
                            'matched_skills': ['python', 'django', 'postgresql']
                        }
                    ]
                }
            }
        }
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_job_recommendations(request):
    """
    Get personalized job recommendations based on user's resume.
    Jobs are ranked by match score.
    """
    resume_id = request.query_params.get('resume_id')
    limit = int(request.query_params.get('limit', 10))
    
    if not resume_id:
        return Response(
            {'error': 'resume_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get resume
    try:
        resume = Resume.objects.get(id=resume_id, user=request.user)
        resume_text = getattr(resume, 'content', '') or str(resume.file.read().decode('utf-8', errors='ignore') if resume.file else '')
    except Resume.DoesNotExist:
        return Response(
            {'error': 'Resume not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get active jobs
    jobs = Job.objects.filter(is_active=True)[:50]  # Limit to 50 for performance
    
    # Calculate match scores
    recommendations = []
    for job in jobs:
        match_result = JobMatcher.match_resume_to_job(
            resume_text=resume_text,
            job_description=job.description,
            job_requirements=job.requirements or ""
        )
        
        recommendations.append({
            'job_id': job.id,
            'job_title': job.title,
            'company': job.company.company_name if job.company else 'Unknown',
            'location': job.location,
            'match_score': match_result['overall_score'],
            'match_level': match_result['match_level'],
            'matched_skills': match_result['matched_skills'][:5],  # Top 5 matched skills
        })
    
    # Sort by match score and limit
    recommendations.sort(key=lambda x: x['match_score'], reverse=True)
    recommendations = recommendations[:limit]
    
    return Response({
        'recommendations': recommendations
    }, status=status.HTTP_200_OK)
