from django.urls import path
from .views import CompanyListCreateAPIView, CompanyDetailAPIView

app_name = 'companies'

urlpatterns = [
    path('', CompanyListCreateAPIView.as_view(), name='company-list-create'),
    path('<uuid:id>/', CompanyDetailAPIView.as_view(), name='company-detail'),
]
