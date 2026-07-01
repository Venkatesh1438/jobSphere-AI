import time
import logging
from django.db import connection

logger = logging.getLogger(__name__)

class APILatencyMiddleware:
    """
    Middleware to log request latency, HTTP status code, and the total count 
    of database queries executed during the lifecycle of the request.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        initial_queries = len(connection.queries)

        response = self.get_response(request)

        duration = time.time() - start_time
        final_queries = len(connection.queries)
        queries_run = final_queries - initial_queries

        logger.info(
            "API Request: %s %s | Status: %s | Latency: %.3fs | SQL Queries: %d",
            request.method,
            request.path,
            response.status_code,
            duration,
            queries_run
        )

        return response
