from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

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
        custom_data = {
            'status': 'error',
            'error_code': exc.__class__.__name__,
            'message': response.data.get('detail', 'Validation or authorization error occurred.'),
            'details': response.data
        }
        if 'detail' in custom_data['details']:
            del custom_data['details']['detail']
        response.data = custom_data
    else:
        # For unhandled exceptions (e.g. database errors, runtime issues)
        logger.error("Unhandled server exception: %s", str(exc), exc_info=True)
        response = Response({
            'status': 'error',
            'error_code': 'INTERNAL_SERVER_ERROR',
            'message': 'An unexpected error occurred on the server.',
            'details': None
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
