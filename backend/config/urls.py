from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from apps.applications.views import JobApplyAPIView, JobApplicationsListAPIView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API v1 Auth
    path('api/v1/auth/', include('apps.users.urls')),
    
    # API v1 Companies
    path('api/v1/companies/', include('apps.companies.urls')),
    
    # Job-specific Applications sub-routes (placed before jobs urls include to ensure correct matching)
    path('api/v1/jobs/<uuid:id>/apply/', JobApplyAPIView.as_view(), name='job-apply'),
    path('api/v1/jobs/<uuid:id>/applications/', JobApplicationsListAPIView.as_view(), name='job-applications-list'),
    
    # API v1 Jobs
    path('api/v1/jobs/', include('apps.jobs.urls')),
    
    # API v1 Applications
    path('api/v1/applications/', include('apps.applications.urls')),
    
    # Simple JWT Auth
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # OpenAPI Schema generation views
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
