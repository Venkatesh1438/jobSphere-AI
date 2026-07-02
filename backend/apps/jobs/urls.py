from django.urls import path
from .views import JobListCreateAPIView, JobDetailAPIView, JobStatusChangeAPIView

app_name = 'jobs'

urlpatterns = [
    path('', JobListCreateAPIView.as_view(), name='job-list-create'),
    path('<uuid:id>/', JobDetailAPIView.as_view(), name='job-detail'),
    path('<uuid:id>/status/', JobStatusChangeAPIView.as_view(), name='job-status-change'),
]

