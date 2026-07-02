import uuid
import json
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import UserRole
from apps.jobs.models import Job, JobStatus
from .models import Company

User = get_user_model()

class CompanyAPITests(APITestCase):
    def _create_test_image(self, name='logo.png', content_type='image/png'):
        from PIL import Image
        import io
        file_obj = io.BytesIO()
        mode = "RGB" if content_type == 'image/jpeg' else "RGBA"
        format_str = "JPEG" if content_type == 'image/jpeg' else "PNG"
        image = Image.new(mode, size=(10, 10), color=(255, 0, 0))
        image.save(file_obj, format_str)
        file_obj.seek(0)
        return SimpleUploadedFile(
            name=name,
            content=file_obj.read(),
            content_type=content_type
        )

    def _create_large_test_image(self, name='large_logo.png', content_type='image/png'):
        from PIL import Image
        import io
        file_obj = io.BytesIO()
        image = Image.new("RGBA", size=(10, 10), color=(255, 0, 0))
        image.save(file_obj, "PNG")
        file_obj.seek(0)
        content = file_obj.read() + b'\x00' * (5 * 1024 * 1024 + 1)
        return SimpleUploadedFile(
            name=name,
            content=content,
            content_type=content_type
        )

    def setUp(self):
        self.list_create_url = reverse('companies:company-list-create')
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

        self.logo_file = self._create_test_image(
            name='logo.png',
            content_type='image/png'
        )

        self.cover_file = self._create_test_image(
            name='cover.jpg',
            content_type='image/jpeg'
        )

    def get_headers(self, user):
        refresh = RefreshToken.for_user(user)
        return {'HTTP_AUTHORIZATION': f'Bearer {refresh.access_token}'}

    def test_recruiter_creates_company_success(self):
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        
        data = {
            "company_name": "Google",
            "company_logo": self.logo_file,
            "company_cover": self.cover_file,
            "company_tagline": "Do the right thing",
            "company_culture": "Innovative and open-source friendly.",
            "company_benefits": json.dumps(["Healthcare", "Free food", "Remote friendly"]),
            "industry": "Tech",
            "website": "https://google.com",
            "linkedin": "https://linkedin.com/company/google",
            "email": "hr@google.com",
            "phone": "+1234567890",
            "location": "Mountain View, CA",
            "founded_year": 1998,
            "company_size": "10000+",
            "about": "Search engine and cloud provider."
        }
        
        response = self.client.post(self.list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['company_name'], "Google")
        self.assertIsNotNone(response.data['data']['logo_url'])
        self.assertIsNotNone(response.data['data']['cover_image_url'])
        self.assertEqual(response.data['data']['company_tagline'], "Do the right thing")
        self.assertEqual(response.data['data']['company_benefits'], ["Healthcare", "Free food", "Remote friendly"])

    def test_recruiter_can_only_create_one_company(self):
        # Create first company
        Company.objects.create(
            recruiter=self.recruiter_user,
            company_name="Google",
            company_logo=self._create_test_image(name='logo1.png'),
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

        # Attempt to create second company
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        
        data = {
            "company_name": "Google Nest",
            "company_logo": self._create_test_image(name='logo2.png'),
            "industry": "Hardware",
            "website": "https://nest.com",
            "linkedin": "https://linkedin.com/company/nest",
            "email": "hr@nest.com",
            "phone": "+1234567890",
            "location": "CA",
            "founded_year": 2010,
            "company_size": "500-1000",
            "about": "Smart home products."
        }
        response = self.client.post(self.list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already own a company", str(response.data))

    def test_candidate_cannot_create_company(self):
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        
        data = {"company_name": "Invalid Candidate Company", "industry": "None"}
        response = self.client.post(self.list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_unauthorized(self):
        self.client.credentials()  # Clear auth
        response = self.client.post(self.list_create_url, {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_companies_any_authenticated(self):
        # Create a company to list
        Company.objects.create(
            recruiter=self.recruiter_user,
            company_name="Google",
            company_logo=self.logo_file,
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

        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['data']), 1)

    def test_retrieve_company_and_active_jobs_count(self):
        company = Company.objects.create(
            recruiter=self.recruiter_user,
            company_name="Google",
            company_logo=self.logo_file,
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

        # Create some jobs for recruiter
        Job.objects.create(
            recruiter=self.recruiter_user,
            title="Software Engineer",
            description="Django",
            location="Remote",
            status=JobStatus.PUBLISHED
        )
        Job.objects.create(
            recruiter=self.recruiter_user,
            title="Frontend Developer",
            description="React",
            location="Remote",
            status=JobStatus.DRAFT  # Should not be counted in active jobs
        )

        detail_url = reverse('companies:company-detail', kwargs={'id': company.id})
        headers = self.get_headers(self.candidate_user)
        self.client.credentials(**headers)
        
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['active_jobs_count'], 1)
        self.assertEqual(response.data['data']['recruiter']['email'], self.recruiter_user.email)

    def test_update_company_owner_success(self):
        company = Company.objects.create(
            recruiter=self.recruiter_user,
            company_name="Google",
            company_logo=self.logo_file,
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

        detail_url = reverse('companies:company-detail', kwargs={'id': company.id})
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        
        data = {"company_name": "Alphabet", "industry": "Conglomerate"}
        response = self.client.patch(detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['company_name'], "Alphabet")

    def test_update_company_non_owner_forbidden(self):
        company = Company.objects.create(
            recruiter=self.recruiter_user,
            company_name="Google",
            company_logo=self.logo_file,
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

        detail_url = reverse('companies:company-detail', kwargs={'id': company.id})
        headers = self.get_headers(self.recruiter_user2) # Different recruiter
        self.client.credentials(**headers)
        
        data = {"company_name": "Hacked name"}
        response = self.client.patch(detail_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_validation_invalid_linkedin(self):
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        
        data = {
            "company_name": "Test Co",
            "company_logo": self.logo_file,
            "industry": "HR",
            "website": "https://test.com",
            "linkedin": "https://notlinkedin.com/invalid",
            "email": "hr@test.com",
            "phone": "+1234567890",
            "location": "NY",
            "founded_year": 2020,
            "company_size": "1-10",
            "about": "About us"
        }
        response = self.client.post(self.list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("linkedin", response.data)

    def test_validation_invalid_phone(self):
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        
        data = {
            "company_name": "Test Co",
            "company_logo": self.logo_file,
            "industry": "HR",
            "website": "https://test.com",
            "linkedin": "https://linkedin.com/company/test",
            "email": "hr@test.com",
            "phone": "abc-1234-invalid",
            "location": "NY",
            "founded_year": 2020,
            "company_size": "1-10",
            "about": "About us"
        }
        response = self.client.post(self.list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phone", response.data)

    def test_validation_logo_too_large(self):
        # Create a valid image whose size exceeds 5 MB
        large_image = self._create_large_test_image(name='large_logo.png')
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        
        data = {
            "company_name": "Test Co",
            "company_logo": large_image,
            "industry": "HR",
            "website": "https://test.com",
            "linkedin": "https://linkedin.com/company/test",
            "email": "hr@test.com",
            "phone": "+1234567890",
            "location": "NY",
            "founded_year": 2020,
            "company_size": "1-10",
            "about": "About us"
        }
        response = self.client.post(self.list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("company_logo", response.data)
        self.assertIn("exceed 5 MB", str(response.data["company_logo"]))

    def test_validation_logo_invalid_extension(self):
        text_file = SimpleUploadedFile(
            name='logo.txt',
            content=b'Not an image',
            content_type='text/plain'
        )
        headers = self.get_headers(self.recruiter_user)
        self.client.credentials(**headers)
        
        data = {
            "company_name": "Test Co",
            "company_logo": text_file,
            "industry": "HR",
            "website": "https://test.com",
            "linkedin": "https://linkedin.com/company/test",
            "email": "hr@test.com",
            "phone": "+1234567890",
            "location": "NY",
            "founded_year": 2020,
            "company_size": "1-10",
            "about": "About us"
        }
        response = self.client.post(self.list_create_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("company_logo", response.data)
