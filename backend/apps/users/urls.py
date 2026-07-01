from django.urls import path
from .views import CandidateRegistrationAPIView

app_name = 'users'

urlpatterns = [
    path('register/candidate/', CandidateRegistrationAPIView.as_view(), name='register-candidate'),
]
