from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import UserRole

User = get_user_model()


class MeAPITests(APITestCase):
    def setUp(self):
        self.me_url = reverse('users:me')
        self.password = "StrongPassword123!"

        # Create a candidate user
        self.candidate_user = User.objects.create_user(
            email="candidate@example.com",
            password=self.password,
            first_name="John",
            last_name="Doe",
            role=UserRole.CANDIDATE,
            phone_number="+1234567890",
            is_email_verified=True
        )

        # Create a recruiter user
        self.recruiter_user = User.objects.create_user(
            email="recruiter@example.com",
            password=self.password,
            first_name="Jane",
            last_name="Smith",
            role=UserRole.RECRUITER,
            phone_number="+0987654321",
            is_email_verified=False
        )

    def test_get_current_user_candidate_success(self):
        # Generate token for candidate
        refresh = RefreshToken.for_user(self.candidate_user)
        access_token = str(refresh.access_token)

        # Set Authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # Request
        response = self.client.get(self.me_url)

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        data = response.data['data']
        self.assertEqual(data['id'], str(self.candidate_user.id))
        self.assertEqual(data['email'], "candidate@example.com")
        self.assertEqual(data['first_name'], "John")
        self.assertEqual(data['last_name'], "Doe")
        self.assertEqual(data['role'], UserRole.CANDIDATE)
        self.assertEqual(data['profile_completed'], False)  # is_profile_completed defaults to False
        self.assertEqual(data['phone_number'], "+1234567890")
        self.assertEqual(data['is_email_verified'], True)
        
        # Verify sensitive fields are not exposed
        self.assertNotIn('password', data)
        self.assertNotIn('is_superuser', data)
        self.assertNotIn('is_staff', data)

    def test_get_current_user_recruiter_success(self):
        # Generate token for recruiter
        refresh = RefreshToken.for_user(self.recruiter_user)
        access_token = str(refresh.access_token)

        # Set Authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        # Request
        response = self.client.get(self.me_url)

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        data = response.data['data']
        self.assertEqual(data['id'], str(self.recruiter_user.id))
        self.assertEqual(data['email'], "recruiter@example.com")
        self.assertEqual(data['first_name'], "Jane")
        self.assertEqual(data['last_name'], "Smith")
        self.assertEqual(data['role'], UserRole.RECRUITER)
        self.assertEqual(data['profile_completed'], False)
        self.assertEqual(data['phone_number'], "+0987654321")
        self.assertEqual(data['is_email_verified'], False)

    def test_get_current_user_unauthorized(self):
        # Clear any credentials
        self.client.credentials()

        # Request without token
        response = self.client.get(self.me_url)

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_current_user_invalid_token(self):
        # Set invalid/malformed Authorization token
        self.client.credentials(HTTP_AUTHORIZATION='Bearer this-is-not-a-valid-token')

        # Request
        response = self.client.get(self.me_url)

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
