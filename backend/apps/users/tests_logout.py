import time
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import UserRole

User = get_user_model()


class LogoutAPITests(APITestCase):
    def setUp(self):
        self.logout_url = reverse('users:logout')
        self.refresh_url = reverse('token_refresh')
        self.password = "StrongPassword123!"

        # Create a test candidate user
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password=self.password,
            first_name="Test",
            last_name="User",
            role=UserRole.CANDIDATE
        )

    def test_successful_logout(self):
        # 1. Generate token
        refresh = RefreshToken.for_user(self.user)
        refresh_token_str = str(refresh)

        # 2. Call logout endpoint
        payload = {"refresh": refresh_token_str}
        response = self.client.post(self.logout_url, payload, format='json')

        # 3. Verify response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['message'], "Logout successful.")

        # 4. Verify token is blacklisted by trying to refresh it
        refresh_payload = {"refresh": refresh_token_str}
        refresh_response = self.client.post(self.refresh_url, refresh_payload, format='json')
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_missing_refresh_token(self):
        # Send empty payload
        response = self.client.post(self.logout_url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('refresh', response.data)

        # Send null/None refresh token
        response = self.client.post(self.logout_url, {"refresh": None}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('refresh', response.data)

        # Send empty string refresh token
        response = self.client.post(self.logout_url, {"refresh": ""}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('refresh', response.data)

    def test_invalid_refresh_token(self):
        payload = {"refresh": "this-is-not-a-valid-jwt-token"}
        response = self.client.post(self.logout_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('refresh', response.data)
        # Should be a list containing the generic message
        errors = response.data['refresh']
        self.assertIn("Invalid or expired refresh token.", errors)

    def test_expired_refresh_token(self):
        # Generate token and manually set its exp to the past
        refresh = RefreshToken.for_user(self.user)
        refresh['exp'] = int(time.time()) - 3600
        expired_token_str = str(refresh)

        payload = {"refresh": expired_token_str}
        response = self.client.post(self.logout_url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('refresh', response.data)
        errors = response.data['refresh']
        self.assertIn("Invalid or expired refresh token.", errors)

    def test_logout_already_blacklisted_token(self):
        # Generate token
        refresh = RefreshToken.for_user(self.user)
        refresh_token_str = str(refresh)

        # Logout first time (should succeed)
        payload = {"refresh": refresh_token_str}
        response = self.client.post(self.logout_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Logout second time with the same token (should fail since it is already blacklisted)
        response_second = self.client.post(self.logout_url, payload, format='json')
        self.assertEqual(response_second.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('refresh', response_second.data)
        errors = response_second.data['refresh']
        self.assertIn("Invalid or expired refresh token.", errors)
