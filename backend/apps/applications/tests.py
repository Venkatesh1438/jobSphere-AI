import uuid
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import UserRole
from apps.jobs.models import Job, JobStatus, EmploymentType, ExperienceLevel
from apps.companies.models import Company
from .models import Application, ApplicationStatus

User = get_user_model()

class ApplicationAPITests(APITestCase):
    def setUp(self):
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

        # Create Recruiter 1
        self.recruiter_user = User.objects.create_user(
            email="recruiter1@example.com",
            password=self.password,
            first_name="Recruiter",
            last_name="One",
            role=UserRole.RECRUITER,
            is_email_verified=True
        )

        # Create Recruiter 2
        self.recruiter_user2 = User.objects.create_user(
            email="recruiter2@example.com",
            password=self.password,
            first_name="Recruiter",
            last_name="Two",
            role=UserRole.RECRUITER,
            is_email_verified=True
        )

        # Create Company for Recruiter 1
        self.company = Company.objects.create(
            recruiter=self.recruiter_user,
            company_name="Google",
            company_logo=SimpleUploadedFile('l.png', b'image', 'image/png'),
            industry="Tech",
            website="https://google.com",
            linkedin="https://linkedin.com/company/google",
            email="hr@google.com",
            phone="+1234567890",
            location="CA",
            founded_year=1998,
            company_size="10000+",
            about="Search engine."
        )

        # Create Published Job belonging to Recruiter 1
        self.job = Job.objects.create(
            recruiter=self.recruiter_user,
            title="Software Engineer",
            description="Looking for Django expert",
            location="Remote",
            employment_type=EmploymentType.FULL_TIME,
            experience_level=ExperienceLevel.MID,
            salary_min=100000.00,
            salary_max=150000.00,
            skills_required=["Python", "Django"],
            status=JobStatus.PUBLISHED
        )

        # Create Closed Job belonging to Recruiter 1
        self.closed_job = Job.objects.create(
            recruiter=self.recruiter_user,
            title="Old Job",
            description="No longer active",
            location="Remote",
            status=JobStatus.CLOSED
        )

        self.apply_url = reverse('job-apply', kwargs={'id': self.job.id})
        self.apply_closed_url = reverse('job-apply', kwargs={'id': self.closed_job.id})
        
        # Small valid PDF content
        self.resume_file = self._create_test_pdf()

    def _create_test_pdf(self, name='my_resume.pdf'):
        return SimpleUploadedFile(
            name=name,
            content=b'%PDF-1.4 ... dummy content ...',
            content_type='application/pdf'
        )

    def get_headers(self, user):
        refresh = RefreshToken.for_user(user)
        return {'HTTP_AUTHORIZATION': f'Bearer {refresh.access_token}'}

    def test_candidate_applies_successfully(self):
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        
        data = {
            "resume": self.resume_file,
            "cover_letter": "I love Django!",
            "portfolio_url": "https://github.com/candidate"
        }
        
        response = self.client.post(self.apply_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['status'], ApplicationStatus.APPLIED)
        self.assertEqual(response.data['data']['job']['title'], "Software Engineer")
        self.assertEqual(response.data['data']['company']['company_name'], "Google")
        self.assertEqual(response.data['data']['portfolio_url'], "https://github.com/candidate")

    def test_recruiter_cannot_apply_for_job(self):
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        
        data = {"resume": self.resume_file}
        response = self.client.post(self.apply_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_duplicate_prevention_on_application(self):
        # Apply once
        Application.objects.create(
            candidate=self.candidate_user,
            job=self.job,
            resume=self._create_test_pdf()
        )

        # Apply again
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        
        data = {"resume": self._create_test_pdf()}
        response = self.client.post(self.apply_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already submitted an application", str(response.data))

    def test_cannot_apply_to_closed_jobs(self):
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        
        data = {"resume": self.resume_file}
        response = self.client.post(self.apply_closed_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("closed and no longer accepting applications", str(response.data))

    def test_withdraw_application_success(self):
        app = Application.objects.create(
            candidate=self.candidate_user,
            job=self.job,
            resume=self.resume_file
        )
        
        withdraw_url = reverse('applications:application-withdraw', kwargs={'id': app.id})
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        
        response = self.client.delete(withdraw_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        # Verify it is soft-deleted
        self.assertFalse(Application.objects.filter(id=app.id).exists())

    def test_cannot_withdraw_after_hired(self):
        app = Application.objects.create(
            candidate=self.candidate_user,
            job=self.job,
            resume=self.resume_file,
            status=ApplicationStatus.HIRED
        )
        
        withdraw_url = reverse('applications:application-withdraw', kwargs={'id': app.id})
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        
        response = self.client.delete(withdraw_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
        self.assertIn("Cannot withdraw application after being hired", response.data['message'])

    def test_list_own_applications_success(self):
        Application.objects.create(
            candidate=self.candidate_user,
            job=self.job,
            resume=self.resume_file
        )
        
        list_url = reverse('applications:application-me')
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        
        response = self.client.get(list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)

    def test_recruiter_lists_applications_for_own_job_success(self):
        app = Application.objects.create(
            candidate=self.candidate_user,
            job=self.job,
            resume=self.resume_file
        )
        
        job_apps_url = reverse('job-applications-list', kwargs={'id': self.job.id})
        headers = self.get_headers(self.recruiter_user) # Owner
        self.client.credentials(**headers)
        
        response = self.client.get(job_apps_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        # Should include Candidate Summary
        self.assertEqual(response.data['data'][0]['candidate']['email'], self.candidate_user.email)

    def test_recruiter_cannot_list_applications_for_unowned_job(self):
        job_apps_url = reverse('job-applications-list', kwargs={'id': self.job.id})
        headers = self.get_headers(self.recruiter_user2) # Non-owner recruiter
        self.client.credentials(**headers)
        
        response = self.client.get(job_apps_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_recruiter_updates_status_success(self):
        app = Application.objects.create(
            candidate=self.candidate_user,
            job=self.job,
            resume=self.resume_file
        )
        
        status_url = reverse('applications:application-status-update', kwargs={'id': app.id})
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        
        data = {"status": ApplicationStatus.INTERVIEW, "recruiter_notes": "Great profile, schedule interview."}
        response = self.client.patch(status_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['status'], ApplicationStatus.INTERVIEW)
        self.assertEqual(response.data['data']['recruiter_notes'], "Great profile, schedule interview.")

    def test_recruiter_cannot_update_unowned_job_application_status(self):
        app = Application.objects.create(
            candidate=self.candidate_user,
            job=self.job,
            resume=self.resume_file
        )
        
        status_url = reverse('applications:application-status-update', kwargs={'id': app.id})
        headers = self.get_headers(self.recruiter_user2) # Non-owner
        self.client.credentials(**headers)
        
        data = {"status": ApplicationStatus.REJECTED}
        response = self.client.patch(status_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_validation_resume_too_large(self):
        large_file = SimpleUploadedFile(
            name='large_resume.pdf',
            content=b'\x00' * (10 * 1024 * 1024 + 1), # 10MB + 1 byte
            content_type='application/pdf'
        )
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        
        data = {"resume": large_file}
        response = self.client.post(self.apply_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("resume", response.data)
        self.assertIn("size cannot exceed 10 MB", str(response.data["resume"]))

    def test_validation_resume_invalid_format(self):
        png_file = SimpleUploadedFile(
            name='my_resume.png',
            content=b'PNG...',
            content_type='image/png'
        )
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        
        data = {"resume": png_file}
        response = self.client.post(self.apply_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("resume", response.data)
        self.assertIn("Unsupported resume file format", str(response.data["resume"]))
