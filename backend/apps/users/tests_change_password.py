from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import UserRole

User = get_user_model()


class ChangePasswordAPITests(APITestCase):
    def setUp(self):
        self.change_password_url = reverse('users:change-password')
        self.email = "testuser@example.com"
        self.old_password = "OldPassword123!"
        self.new_password = "NewPassword123!"

        # Create a test user
        self.user = User.objects.create_user(
            email=self.email,
            password=self.old_password,
            first_name="Test",
            last_name="User",
            role=UserRole.CANDIDATE,
            phone_number="+1234567890",
            is_email_verified=True
        )

        # Generate JWT access token for authenticated requests
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def test_change_password_success(self):
        # Set Authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        payload = {
            "old_password": self.old_password,
            "new_password": self.new_password,
            "confirm_password": self.new_password
        }

        response = self.client.post(self.change_password_url, payload, format='json')

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {
            "success": True,
            "message": "Password changed successfully."
        })

        # Refresh user from DB and check password
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(self.new_password))
        self.assertFalse(self.user.check_password(self.old_password))

        # Check that we can still authenticate (JWT is not revoked)
        # Note: In SimpleJWT, stateless access token remains valid until expiration
        response_me = self.client.get(reverse('users:me'))
        self.assertEqual(response_me.status_code, status.HTTP_200_OK)

    def test_change_password_incorrect_old_password(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        payload = {
            "old_password": "WrongOldPassword123!",
            "new_password": self.new_password,
            "confirm_password": self.new_password
        }

        response = self.client.post(self.change_password_url, payload, format='json')

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('old_password', response.data)
        
        # Verify password is NOT changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(self.old_password))

    def test_change_password_mismatch(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        payload = {
            "old_password": self.old_password,
            "new_password": self.new_password,
            "confirm_password": "DifferentConfirmPassword123!"
        }

        response = self.client.post(self.change_password_url, payload, format='json')

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('confirm_password', response.data)

        # Verify password is NOT changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(self.old_password))

    def test_change_password_weak_password(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # A password that fails standard django validators (e.g. too short)
        payload = {
            "old_password": self.old_password,
            "new_password": "short",
            "confirm_password": "short"
        }

        response = self.client.post(self.change_password_url, payload, format='json')

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)

        # Verify password is NOT changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(self.old_password))

    def test_change_password_same_password(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        # Attempt to change to the same password
        payload = {
            "old_password": self.old_password,
            "new_password": self.old_password,
            "confirm_password": self.old_password
        }

        response = self.client.post(self.change_password_url, payload, format='json')

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)
        self.assertEqual(response.data['new_password'][0], 'New password cannot be the same as the old password.')

        # Verify password remains the same
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(self.old_password))

    def test_change_password_unauthorized(self):
        # Clear credentials
        self.client.credentials()

        payload = {
            "old_password": self.old_password,
            "new_password": self.new_password,
            "confirm_password": self.new_password
        }

        response = self.client.post(self.change_password_url, payload, format='json')

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
