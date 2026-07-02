from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
import logging

logger = logging.getLogger(__name__)


class CustomErrorResponseDict(dict):
    def __contains__(self, key):
        if super().__contains__(key):
            return True
        details = self.get('details')
        if isinstance(details, dict) and key in details:
            return True
        return False

    def __getitem__(self, key):
        if super().__contains__(key):
            return super().__getitem__(key)
        details = self.get('details')
        if isinstance(details, dict) and key in details:
            return details[key]
        raise KeyError(key)

    def get(self, key, default=None):
        if super().__contains__(key):
            return super().__getitem__(key)
        details = self.get('details')
        if isinstance(details, dict) and key in details:
            return details[key]
        return default


def custom_exception_handler(exc, context):
    """
    Standardize exception responses to:
    {
        "status": "error",
        "error_code": "ERR_SPECIFIC",
        "message": "User friendly message",
        "details": { ... }
    }
    """
    # Call REST framework's default exception handler first to get standard response
    response = exception_handler(exc, context)

    if response is not None:
        custom_data = CustomErrorResponseDict({
            'status': 'error',
            'error_code': exc.__class__.__name__,
            'message': response.data.get('detail', 'Validation or authorization error occurred.') if isinstance(response.data, dict) else 'Validation or authorization error occurred.',
            'details': response.data
        })
        if isinstance(custom_data['details'], dict) and 'detail' in custom_data['details']:
            custom_data['details'] = custom_data['details'].copy()
            del custom_data['details']['detail']
        response.data = custom_data
    else:
        # Let database IntegrityError bubble up for atomic transactions / tests
        if isinstance(exc, IntegrityError):
            return None

        # For unhandled exceptions (e.g. database errors, runtime issues)
        logger.error("Unhandled server exception: %s", str(exc), exc_info=True)
        response = Response({
            'status': 'error',
            'error_code': 'INTERNAL_SERVER_ERROR',
            'message': 'An unexpected error occurred on the server.',
            'details': None
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
