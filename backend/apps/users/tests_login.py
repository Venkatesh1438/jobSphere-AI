from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import UserRole

User = get_user_model()


class LoginAPITests(APITestCase):
    def setUp(self):
        self.url = reverse('users:login')
        self.password = "StrongPassword123!"

        # Create active candidate user
        self.candidate_user = User.objects.create_user(
            email="candidate@example.com",
            password=self.password,
            first_name="John",
            last_name="Doe",
            role=UserRole.CANDIDATE
        )

        # Create active recruiter user
        self.recruiter_user = User.objects.create_user(
            email="recruiter@example.com",
            password=self.password,
            first_name="Jane",
            last_name="Smith",
            role=UserRole.RECRUITER
        )

        # Create inactive candidate user
        self.inactive_user = User.objects.create_user(
            email="inactive@example.com",
            password=self.password,
            first_name="Inactive",
            last_name="User",
            role=UserRole.CANDIDATE
        )
        self.inactive_user.is_active = False
        self.inactive_user.save()

    def test_successful_candidate_login(self):
        payload = {
            "email": "candidate@example.com",
            "password": self.password
        }
        
        # Fresh fetch from DB to get pre-login last_login (likely None)
        self.candidate_user.refresh_from_db()
        pre_last_login = self.candidate_user.last_login

        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['message'], "Login successful.")
        
        data = response.data['data']
        self.assertEqual(data['token_type'], "Bearer")
        self.assertIn('access', data)
        self.assertIn('refresh', data)
        
        user_info = data['user']
        self.assertEqual(user_info['id'], str(self.candidate_user.id))
        self.assertEqual(user_info['email'], "candidate@example.com")
        self.assertEqual(user_info['first_name'], "John")
        self.assertEqual(user_info['last_name'], "Doe")
        self.assertEqual(user_info['role'], UserRole.CANDIDATE)
        self.assertNotIn('password', user_info)

        # Verify last_login updated
        self.candidate_user.refresh_from_db()
        self.assertNotEqual(self.candidate_user.last_login, pre_last_login)
        self.assertIsNotNone(self.candidate_user.last_login)

    def test_successful_recruiter_login(self):
        payload = {
            "email": "recruiter@example.com",
            "password": self.password
        }
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        
        data = response.data['data']
        self.assertEqual(data['user']['role'], UserRole.RECRUITER)

    def test_invalid_email_login(self):
        payload = {
            "email": "nonexistent@example.com",
            "password": self.password
        }
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_password_login(self):
        payload = {
            "email": "candidate@example.com",
            "password": "WrongPassword123!"
        }
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_inactive_user_login(self):
        payload = {
            "email": "inactive@example.com",
            "password": self.password
        }
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_inactive_user_wrong_password_login(self):
        # Inactive user with incorrect password should return 401, not 403, to prevent status enumeration
        payload = {
            "email": "inactive@example.com",
            "password": "WrongPassword123!"
        }
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_missing_email_login(self):
        payload = {
            "password": self.password
        }
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_password_login(self):
        payload = {
            "email": "candidate@example.com"
        }
        response = self.client.post(self.url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
