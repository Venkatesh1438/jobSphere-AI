
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

    def test_invalid_salary_ranges_partial_update(self):
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)

        # Existing job has salary_min=100000.00 and salary_max=150000.00
        # Attempt to patch only salary_max to 80000.00 (which is < existing salary_min 100000.00)
        response = self.client.patch(self.detail_url, {"salary_max": "80000.00"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("salary_max", response.data)

        # Attempt to patch only salary_min to 180000.00 (which is > existing salary_max 150000.00)
        response = self.client.patch(self.detail_url, {"salary_min": "180000.00"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("salary_max", response.data)

    def test_update_job_success(self):
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        
        # Test PUT
        put_data = {
            "title": "Senior Software Engineer",
            "description": "Looking for Django expert with DRF experience",
            "location": "Remote",
            "employment_type": EmploymentType.FULL_TIME,
            "experience_level": ExperienceLevel.SENIOR,
            "salary_min": "120000.00",
            "salary_max": "180000.00",
            "skills_required": ["Python", "Django", "DRF", "PostgreSQL"],
            "status": JobStatus.PUBLISHED
        }
        response = self.client.put(self.detail_url, put_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], "Senior Software Engineer")
        self.assertEqual(response.data['data']['experience_level'], ExperienceLevel.SENIOR)

        # Test PATCH
        patch_data = {"title": "Staff Software Engineer"}
        response = self.client.patch(self.detail_url, patch_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['title'], "Staff Software Engineer")

    def test_update_job_permissions(self):
        # Create another recruiter
        other_recruiter = User.objects.create_user(
            email="other_recruiter@example.com",
            password=self.password,
            first_name="Other",
            last_name="Recruiter",
            role=UserRole.RECRUITER,
            is_email_verified=True
        )

        patch_data = {"title": "Updated Title"}

        # Non-owner recruiter cannot update
        headers = self.get_headers(other_recruiter)
        self.client.credentials(**headers)
        response = self.client.patch(self.detail_url, patch_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Candidate cannot update
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        response = self.client.patch(self.detail_url, patch_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Anonymous cannot update
        self.client.credentials()
        response = self.client.patch(self.detail_url, patch_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_job_success(self):
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

        # Check soft delete
        self.assertFalse(Job.objects.filter(id=self.job.id).exists())
        self.assertTrue(Job.all_objects.filter(id=self.job.id, is_deleted=True).exists())

    def test_delete_job_permissions(self):
        other_recruiter = User.objects.create_user(
            email="other_recruiter2@example.com",
            password=self.password,
            first_name="Other",
            last_name="Recruiter",
            role=UserRole.RECRUITER,
            is_email_verified=True
        )

        # Non-owner recruiter cannot delete
        headers = self.get_headers(other_recruiter)
        self.client.credentials(**headers)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Candidate cannot delete
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Anonymous cannot delete
        self.client.credentials()
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_status_success(self):
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        status_url = reverse('jobs:job-status-change', kwargs={'id': self.job.id})

        for status_val in [JobStatus.DRAFT, JobStatus.PUBLISHED, JobStatus.CLOSED]:
            response = self.client.patch(status_url, {"status": status_val}, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['data']['status'], status_val)

    def test_change_status_validation_error(self):
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        status_url = reverse('jobs:job-status-change', kwargs={'id': self.job.id})

        response = self.client.patch(status_url, {"status": "INVALID_STATUS"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_status_permissions(self):
        other_recruiter = User.objects.create_user(
            email="other_recruiter3@example.com",
            password=self.password,
            first_name="Other",
            last_name="Recruiter",
            role=UserRole.RECRUITER,
            is_email_verified=True
        )
        status_url = reverse('jobs:job-status-change', kwargs={'id': self.job.id})

        # Non-owner recruiter cannot change status
        headers = self.get_headers(other_recruiter)
        self.client.credentials(**headers)
        response = self.client.patch(status_url, {"status": JobStatus.CLOSED}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Candidate cannot change status
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        response = self.client.patch(status_url, {"status": JobStatus.CLOSED}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Anonymous cannot change status
        self.client.credentials()
        response = self.client.patch(status_url, {"status": JobStatus.CLOSED}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cannot_modify_closed_job(self):
        # Set job to CLOSED
        self.job.status = JobStatus.CLOSED
        self.job.save()

        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)

        # Attempt PUT update
        put_data = {
            "title": "Another Title",
            "description": "Looking for Django expert",
            "location": "Remote",
            "employment_type": EmploymentType.FULL_TIME,
            "experience_level": ExperienceLevel.MID,
            "salary_min": 100000.00,
            "salary_max": 150000.00,
            "skills_required": ["Python", "Django", "DRF"],
            "status": JobStatus.CLOSED
        }
        response = self.client.put(self.detail_url, put_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Attempt PATCH update
        response = self.client.patch(self.detail_url, {"title": "Another Title"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Attempt Status patch
        status_url = reverse('jobs:job-status-change', kwargs={'id': self.job.id})
        response = self.client.patch(status_url, {"status": JobStatus.PUBLISHED}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_search_jobs(self):
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)

        # Create another job to test search
        Job.objects.create(
            recruiter=self.recruiter_user,
            title="React Frontend Developer",
            description="We need a senior frontend dev",
            location="Chicago",
            employment_type=EmploymentType.PART_TIME,
            experience_level=ExperienceLevel.SENIOR,
            salary_min=80000.00,
            salary_max=120000.00,
            skills_required=["React", "Redux", "TypeScript"],
            status=JobStatus.PUBLISHED
        )

        # Search matching title
        response = self.client.get(f"{self.list_create_url}?search=React")
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['title'], "React Frontend Developer")

        # Search matching description
        response = self.client.get(f"{self.list_create_url}?search=Django")
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['title'], "Software Engineer")

        # Search matching skills_required (JSONField)
        response = self.client.get(f"{self.list_create_url}?search=TypeScript")
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['title'], "React Frontend Developer")

        # Search matching location
        response = self.client.get(f"{self.list_create_url}?search=Chicago")
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['title'], "React Frontend Developer")

    def test_filtering_jobs(self):
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)

        # Create a second job with different attributes
        Job.objects.create(
            recruiter=self.recruiter_user,
            title="React Frontend Developer",
            description="We need a senior frontend dev",
            location="Chicago",
            employment_type=EmploymentType.PART_TIME,
            experience_level=ExperienceLevel.SENIOR,
            salary_min=80000.00,
            salary_max=120000.00,
            skills_required=["React"],
            status=JobStatus.DRAFT
        )

        # Filter by employment_type
        response = self.client.get(f"{self.list_create_url}?employment_type={EmploymentType.PART_TIME}")
        self.assertEqual(len(response.data['data']), 1)

        # Filter by experience_level
        response = self.client.get(f"{self.list_create_url}?experience_level={ExperienceLevel.MID}")
        self.assertEqual(len(response.data['data']), 1)

        # Filter by status
        response = self.client.get(f"{self.list_create_url}?status={JobStatus.DRAFT}")
        self.assertEqual(len(response.data['data']), 1)

        # Filter by location (icontains)
        response = self.client.get(f"{self.list_create_url}?location=chic")
        self.assertEqual(len(response.data['data']), 1)

        # Filter by salary_min
        response = self.client.get(f"{self.list_create_url}?salary_min=90000")
        self.assertEqual(len(response.data['data']), 1)  # only mid-level job pays >= 90000 (100k)

        # Filter by salary_max
        response = self.client.get(f"{self.list_create_url}?salary_max=130000")
        self.assertEqual(len(response.data['data']), 1)  # only frontend dev pays <= 130000 (120k)

    def test_ordering_jobs(self):
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)

        # Create a second job
        Job.objects.create(
            recruiter=self.recruiter_user,
            title="React Frontend Developer",
            description="We need a senior frontend dev",
            location="Chicago",
            employment_type=EmploymentType.PART_TIME,
            experience_level=ExperienceLevel.SENIOR,
            salary_min=80000.00,
            salary_max=120000.00,
            skills_required=["React"],
            status=JobStatus.PUBLISHED
        )

        # Order by salary_min ascending
        response = self.client.get(f"{self.list_create_url}?ordering=salary_min")
        self.assertEqual(response.data['data'][0]['title'], "React Frontend Developer")  # 80k is first

        # Order by salary_min descending
        response = self.client.get(f"{self.list_create_url}?ordering=-salary_min")
        self.assertEqual(response.data['data'][0]['title'], "Software Engineer")  # 100k is first

    def test_pagination_jobs(self):
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)

        # Create 25 additional jobs (total 26)
        for i in range(25):
            Job.objects.create(
                recruiter=self.recruiter_user,
                title=f"Job {i}",
                description=f"Description {i}",
                location="Location",
                employment_type=EmploymentType.FULL_TIME,
                experience_level=ExperienceLevel.MID,
                salary_min=50000.00,
                salary_max=80000.00,
                status=JobStatus.PUBLISHED
            )

        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check custom response envelope
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['count'], 26)
        self.assertEqual(len(response.data['data']), 20)  # Paginated to 20
        self.assertIsNotNone(response.data['next'])

