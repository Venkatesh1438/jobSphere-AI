import os
import sys
import django
import traceback

sys.path.insert(0, 'c:\\Users\\venkatesh\\Downloads\\JobSpher-AI\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

from django.contrib.auth import get_user_model
from apps.users.models import UserRole
from apps.jobs.models import Job, JobStatus, EmploymentType, ExperienceLevel
from apps.applications.serializers import ApplicationCreateSerializer
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

User = get_user_model()

try:
    # Find or create candidate
    candidate, _ = User.objects.get_or_create(
        email="test_candidate@example.com",
        defaults={
            "first_name": "Test",
            "last_name": "Candidate",
            "role": UserRole.CANDIDATE,
            "is_email_verified": True
        }
    )

    # Create recruiter without company
    recruiter, _ = User.objects.get_or_create(
        email="recruiter_nocompany@example.com",
        defaults={
            "first_name": "Recruiter",
            "last_name": "NoCompany",
            "role": UserRole.RECRUITER,
            "is_email_verified": True
        }
    )

    # Create job for this recruiter
    job = Job.objects.create(
        recruiter=recruiter,
        title="No Company Job",
        description="This job is from a recruiter with no company.",
        location="Remote",
        employment_type=EmploymentType.FULL_TIME,
        experience_level=ExperienceLevel.MID,
        status=JobStatus.PUBLISHED
    )

    # Simulate POST request
    factory = APIRequestFactory()
    request = factory.post(f'/api/v1/jobs/{job.id}/apply/')

    # Wrap in rest_framework Request
    drf_request = Request(request)
    drf_request._user = candidate

    serializer_context = {
        'request': drf_request,
        'job_id': str(job.id)
    }

    from django.core.files.uploadedfile import SimpleUploadedFile
    resume_file = SimpleUploadedFile('resume.pdf', b'%PDF-1.4 dummy content', content_type='application/pdf')

    data = {
        'resume': resume_file,
        'cover_letter': 'Hello'
    }

    serializer = ApplicationCreateSerializer(data=data, context=serializer_context)
    if serializer.is_valid():
        app = serializer.save()
        print("Application saved successfully!", app)
        
        # Now serialize with ApplicationSerializer
        from apps.applications.serializers import ApplicationSerializer
        resp_serializer = ApplicationSerializer(app, context={'request': Request(request)})
        print("Serialized data successfully!")
    else:
        print("Serializer errors:", serializer.errors)
except Exception as e:
    print("EXCEPTION OCCURRED:")
    traceback.print_exc()
