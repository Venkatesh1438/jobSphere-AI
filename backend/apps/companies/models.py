import uuid
from django.db import models
from django.conf import settings
from apps.common.models import BaseModel
from apps.common.utils import get_file_upload_path

class Company(BaseModel):
    """
    Company Model representing a recruiter's company profile.
    Each Recruiter owns exactly one company.
    """
    recruiter = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='company',
        limit_choices_to={'role': 'RECRUITER'}
    )
    company_name = models.CharField(max_length=255)
    company_logo = models.ImageField(upload_to=get_file_upload_path)
    company_cover = models.ImageField(upload_to=get_file_upload_path, null=True, blank=True)
    
    # Optional fields for Sprint 4 Enhancements
    company_tagline = models.CharField(max_length=255, null=True, blank=True)
    company_culture = models.TextField(null=True, blank=True)
    company_benefits = models.JSONField(default=list, blank=True)
    
    industry = models.CharField(max_length=150)
    website = models.URLField()
    linkedin = models.URLField()
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    founded_year = models.PositiveIntegerField()
    company_size = models.CharField(max_length=50)  # e.g., "1-10", "11-50", "51-200", etc.
    about = models.TextField()
    verified = models.BooleanField(default=False)

    # Future Ready Extension Points (Reviews, Followers, Bookmarks compatible)
    # E.g., Reviews -> GenericRelation or ForeignKey in reviews app
    # E.g., Followers -> M2M relationship with User
    # E.g., Bookmarks -> GenericRelation

    class Meta:
        db_table = 'companies'
        ordering = ['-created_at']
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'

    def __str__(self):
        return self.company_name
