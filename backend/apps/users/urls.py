from django.urls import path
from .views import (
    CandidateRegistrationAPIView,
    RecruiterRegistrationAPIView,
    LoginAPIView,
    LogoutAPIView,
    MeAPIView,
)

app_name = 'users'

urlpatterns = [
    path('register/candidate/', CandidateRegistrationAPIView.as_view(), name='register-candidate'),
    path('register/recruiter/', RecruiterRegistrationAPIView.as_view(), name='register-recruiter'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('me/', MeAPIView.as_view(), name='me'),
]
