import uuid
from django.db import models
from django.conf import settings
from apps.common.models import BaseModel


class JobStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    PUBLISHED = 'PUBLISHED', 'Published'
    CLOSED = 'CLOSED', 'Closed'


class EmploymentType(models.TextChoices):
    FULL_TIME = 'FULL_TIME', 'Full-time'
    PART_TIME = 'PART_TIME', 'Part-time'
    CONTRACT = 'CONTRACT', 'Contract'
    INTERNSHIP = 'INTERNSHIP', 'Internship'
    OTHER = 'OTHER', 'Other'


class ExperienceLevel(models.TextChoices):
    ENTRY = 'ENTRY', 'Entry Level'
    MID = 'MID', 'Mid Level'
    SENIOR = 'SENIOR', 'Senior Level'
    LEAD = 'LEAD', 'Lead'
    EXECUTIVE = 'EXECUTIVE', 'Executive'


class Job(BaseModel):
    """
    Job Model representing a job posting.
    Created by a Recruiter.
    """
    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='jobs',
        limit_choices_to={'role': 'RECRUITER'}
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    employment_type = models.CharField(
        max_length=50,
        choices=EmploymentType.choices,
        default=EmploymentType.FULL_TIME
    )
    experience_level = models.CharField(
        max_length=50,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.MID
    )
    salary_min = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    salary_max = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    skills_required = models.JSONField(
        default=list,
        blank=True
    )
    status = models.CharField(
        max_length=20,
        choices=JobStatus.choices,
        default=JobStatus.DRAFT
    )
    application_deadline = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = 'jobs'
        ordering = ['-created_at']
        verbose_name = 'Job'
        verbose_name_plural = 'Jobs'

    def __str__(self):
        return f"{self.title} - {self.recruiter.email}"
