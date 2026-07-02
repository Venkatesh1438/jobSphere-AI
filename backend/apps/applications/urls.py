from django.urls import path
from .views import (
    ApplicationMeAPIView,
    ApplicationWithdrawAPIView,
    ApplicationStatusUpdateAPIView
)

app_name = 'applications'

urlpatterns = [
    path('me/', ApplicationMeAPIView.as_view(), name='application-me'),
    path('<uuid:id>/withdraw/', ApplicationWithdrawAPIView.as_view(), name='application-withdraw'),
    path('<uuid:id>/status/', ApplicationStatusUpdateAPIView.as_view(), name='application-status-update'),
]
