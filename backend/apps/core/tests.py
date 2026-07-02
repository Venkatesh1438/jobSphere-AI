from django.test import TestCase, RequestFactory
from django.http import HttpResponse
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, AuthenticationFailed
from django.http import Http404
from unittest.mock import patch
import logging

from apps.core.middlewares import APILatencyMiddleware
from apps.core.exceptions import custom_exception_handler

class DummyAPIView(APIView):
    permission_classes = []
    def get(self, request):
        return Response({"message": "success"})

class ValidationErrorAPIView(APIView):
    permission_classes = []
    def get(self, request):
        raise ValidationError({"field": "This field is required."})

class PermissionDeniedAPIView(APIView):
    permission_classes = []
    def get(self, request):
        raise PermissionDenied("You do not have permission.")

class AuthenticationFailedAPIView(APIView):
    permission_classes = []
    def get(self, request):
        raise AuthenticationFailed("Invalid token.")

class Http404APIView(APIView):
    permission_classes = []
    def get(self, request):
        raise Http404("Resource not found.")

class RuntimeExceptionAPIView(APIView):
    permission_classes = []
    def get(self, request):
        raise Exception("Unhandled database/runtime failure.")


class CoreMiddlewareAndExceptionTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    @patch('apps.core.middlewares.logger')
    def test_api_latency_middleware_logs(self, mock_logger):
        # Create a dummy get_response callable
        def get_response(req):
            return HttpResponse("OK", status=200)

        middleware = APILatencyMiddleware(get_response)
        request = self.factory.get('/api/v1/jobs/')
        
        response = middleware(request)
        
        self.assertEqual(response.status_code, 200)
        # Verify logger.info is called
        mock_logger.info.assert_called_once()
        log_args = mock_logger.info.call_args[0]
        # First argument is log format string, following are parameters
        self.assertIn("API Request: %s %s | Status: %s | Latency: %.3fs | SQL Queries: %d", log_args[0])
        self.assertEqual(log_args[1], "GET")
        self.assertEqual(log_args[2], "/api/v1/jobs/")
        self.assertEqual(log_args[3], 200)

    def test_custom_exception_handler_validation_error(self):
        view = ValidationErrorAPIView.as_view()
        request = self.factory.get('/dummy/')
        response = view(request)
        
        # Exception should be caught and custom_exception_handler called
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertEqual(response.data['error_code'], 'ValidationError')
        self.assertIn('field', response.data['details'])

    def test_custom_exception_handler_permission_denied(self):
        view = PermissionDeniedAPIView.as_view()
        request = self.factory.get('/dummy/')
        response = view(request)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['status'], 'error')
        self.assertEqual(response.data['error_code'], 'PermissionDenied')
        self.assertEqual(response.data['message'], 'You do not have permission.')

    def test_custom_exception_handler_authentication_failed(self):
        view = AuthenticationFailedAPIView.as_view()
        request = self.factory.get('/dummy/')
        response = view(request)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['status'], 'error')
        self.assertEqual(response.data['error_code'], 'AuthenticationFailed')
        self.assertEqual(response.data['message'], 'Invalid token.')

    def test_custom_exception_handler_http404(self):
        view = Http404APIView.as_view()
        request = self.factory.get('/dummy/')
        response = view(request)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['status'], 'error')
        self.assertEqual(response.data['error_code'], 'Http404')

    @patch('apps.core.exceptions.logger')
    def test_custom_exception_handler_unhandled_exception(self, mock_logger):
        view = RuntimeExceptionAPIView.as_view()
        request = self.factory.get('/dummy/')
        response = view(request)
        
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data['status'], 'error')
        self.assertEqual(response.data['error_code'], 'INTERNAL_SERVER_ERROR')
        self.assertEqual(response.data['message'], 'An unexpected error occurred on the server.')
        self.assertIsNone(response.data['details'])
        mock_logger.error.assert_called_once()
