
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import UserRole
from .models import Job, JobStatus, EmploymentType, ExperienceLevel

User = get_user_model()


class JobAPITests(APITestCase):
    def setUp(self):
        self.list_create_url = reverse('jobs:job-list-create')
        self.password = "StrongPassword123!"

        # Create Candidate
        self.candidate_user = User.objects.create_user(
            email="candidate@example.com",
            password=self.password,
            first_name="Candidate",
            last_name="User",
            role=UserRole.CANDIDATE,
            is_email_verified=True
        )

        # Create Recruiter
        self.recruiter_user = User.objects.create_user(
            email="recruiter@example.com",
            password=self.password,
            first_name="Recruiter",
            last_name="User",
            role=UserRole.RECRUITER,
            is_email_verified=True
        )

        # Create a Job beforehand for detail and list tests
        self.job = Job.objects.create(
            recruiter=self.recruiter_user,
            title="Software Engineer",
            description="Looking for Django expert",
            location="Remote",
            employment_type=EmploymentType.FULL_TIME,
            experience_level=ExperienceLevel.MID,
            salary_min=100000.00,
            salary_max=150000.00,
            skills_required=["Python", "Django", "DRF"],
            status=JobStatus.PUBLISHED
        )
        self.detail_url = reverse('jobs:job-detail', kwargs={'id': self.job.id})

    def get_headers(self, user):
        refresh = RefreshToken.for_user(user)
        return {'HTTP_AUTHORIZATION': f'Bearer {refresh.access_token}'}

    def test_recruiter_creates_job_success(self):
        headers = self.get_headers(self.recruiter_user)
        data = {
            "title": "Backend Dev",
            "description": "We need a Python developer.",
            "location": "New York",
            "employment_type": EmploymentType.CONTRACT,
            "experience_level": ExperienceLevel.SENIOR,
            "salary_min": "90000.00",
            "salary_max": "120000.00",
            "skills_required": ["Django", "PostgreSQL"],
            "status": JobStatus.DRAFT
        }
        self.client.credentials(**headers)
        response = self.client.post(self.list_create_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['title'], "Backend Dev")
        self.assertEqual(response.data['data']['recruiter']['email'], self.recruiter_user.email)

    def test_candidate_cannot_create_job(self):
        headers = self.get_headers(self.candidate_user)
        data = {
            "title": "Backend Dev",
            "description": "We need a Python developer.",
            "location": "New York"
        }
        self.client.credentials(**headers)
        response = self.client.post(self.list_create_url, data, format='json')

        # Candidates are forbidden from creating jobs (HTTP 403)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_user_denied_create(self):
        self.client.credentials()  # Clear auth
        data = {
            "title": "Backend Dev",
            "description": "We need a Python developer."
        }
        response = self.client.post(self.list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_anonymous_user_denied_list(self):
        self.client.credentials()
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_anonymous_user_denied_detail(self):
        self.client.credentials()
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_job_list_for_authenticated_users(self):
        # Candidate should be able to view jobs
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        response = self.client.get(self.list_create_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['id'], str(self.job.id))

    def test_job_detail_for_authenticated_users(self):
        # Recruiter should also be able to view job details
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['id'], str(self.job.id))
        self.assertEqual(response.data['data']['title'], "Software Engineer")

    def test_invalid_salary_ranges(self):
        headers = self.get_headers(self.recruiter_user)
        data = {
            "title": "Backend Dev",
            "description": "We need a Python developer.",
            "location": "New York",
            "salary_min": "100000.00",
            "salary_max": "80000.00",  # max < min
        }
        self.client.credentials(**headers)
        response = self.client.post(self.list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("salary_max", response.data)
