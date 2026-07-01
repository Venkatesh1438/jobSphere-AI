from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import User, RecruiterProfile, UserRole

class RecruiterRegistrationTests(APITestCase):
    def setUp(self):
        self.url = reverse('users:register-recruiter')
        self.valid_payload = {
            "email": "hr@example.com",
            "password": "StrongPassword123!",
            "confirm_password": "StrongPassword123!",
            "first_name": "Rahul",
            "last_name": "Sharma",
            "phone_number": "9876543210",
            "company_name": "Google",
            "designation": "HR Manager"
        }

    def test_successful_registration(self):
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['message'], "Recruiter registered successfully.")
        self.assertEqual(response.data['data']['email'], "hr@example.com")
        self.assertEqual(response.data['data']['role'], UserRole.RECRUITER)
        self.assertNotIn('password', response.data['data'])

        # Verify DB records
        user = User.objects.get(email="hr@example.com")
        self.assertEqual(user.first_name, "Rahul")
        self.assertEqual(user.last_name, "Sharma")
        self.assertEqual(user.phone_number, "9876543210")
        self.assertEqual(user.role, UserRole.RECRUITER)

        profile = RecruiterProfile.objects.get(user=user)
        self.assertEqual(profile.company_name, "Google")
        self.assertEqual(profile.designation, "HR Manager")

    def test_whitespace_normalization(self):
        payload = self.valid_payload.copy()
        payload['email'] = "hr_strip@example.com"
        payload['company_name'] = "   Google Inc.   "
        payload['designation'] = "  Senior Lead Recruiter\n"
        
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        user = User.objects.get(email="hr_strip@example.com")
        profile = RecruiterProfile.objects.get(user=user)
        self.assertEqual(profile.company_name, "Google Inc.")
        self.assertEqual(profile.designation, "Senior Lead Recruiter")

    def test_email_uniqueness_validation(self):
        # Create a user with same email first
        User.objects.create_user(
            email="hr@example.com",
            password="SomePassword123!",
            first_name="Test",
            last_name="User"
        )
        response = self.client.post(self.url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_password_mismatch(self):
        payload = self.valid_payload.copy()
        payload['confirm_password'] = "DifferentPassword123!"
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('confirm_password', response.data)

    def test_weak_password(self):
        payload = self.valid_payload.copy()
        payload['password'] = "123"
        payload['confirm_password'] = "123"
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_missing_required_fields(self):
        required_fields = ['email', 'password', 'first_name', 'last_name', 'company_name', 'designation']
        for field in required_fields:
            payload = self.valid_payload.copy()
            if field in payload:
                payload.pop(field)
            response = self.client.post(self.url, payload, format='json')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn(field, response.data)

    def test_transaction_atomic_rollback(self):
        # We can simulate profile creation failure by mocking RecruiterProfile.objects.create to raise an exception.
        # This will verify transaction.atomic works and rollback is done (no user created).
        from unittest.mock import patch
        from django.db import IntegrityError

        initial_user_count = User.objects.count()

        with patch('apps.users.models.RecruiterProfile.objects.create', side_effect=IntegrityError("Simulated Profile Error")):
            payload = self.valid_payload.copy()
            payload['email'] = "rollback@example.com"
            # It should raise the exception because we mock RecruiterProfile.objects.create to fail,
            # which will raise standard IntegrityError and bubble up.
            with self.assertRaises(IntegrityError):
                self.client.post(self.url, payload, format='json')
            
            # Check user was NOT created due to rollback
            self.assertEqual(User.objects.count(), initial_user_count)
            self.assertFalse(User.objects.filter(email="rollback@example.com").exists())
