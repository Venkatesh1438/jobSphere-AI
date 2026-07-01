from django.urls import path
from .views import JobListCreateAPIView, JobDetailAPIView

app_name = 'jobs'

urlpatterns = [
    path('', JobListCreateAPIView.as_view(), name='job-list-create'),
    path('<uuid:id>/', JobDetailAPIView.as_view(), name='job-detail'),
]
