from django.urls import path
from .views import (
    CandidateRegistrationAPIView,
    RecruiterRegistrationAPIView,
    LoginAPIView,
)

app_name = 'users'

urlpatterns = [
    path('register/candidate/', CandidateRegistrationAPIView.as_view(), name='register-candidate'),
    path('register/recruiter/', RecruiterRegistrationAPIView.as_view(), name='register-recruiter'),
    path('login/', LoginAPIView.as_view(), name='login'),
]
