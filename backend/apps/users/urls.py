from django.urls import path
from .views import CandidateRegistrationAPIView, RecruiterRegistrationAPIView

app_name = 'users'

urlpatterns = [
    path('register/candidate/', CandidateRegistrationAPIView.as_view(), name='register-candidate'),
    path('register/recruiter/', RecruiterRegistrationAPIView.as_view(), name='register-recruiter'),
]
