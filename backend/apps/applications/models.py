import uuid
from django.db import models
from django.conf import settings
from apps.common.models import BaseModel
from apps.common.utils import get_file_upload_path
from apps.jobs.models import Job

class ApplicationStatus(models.TextChoices):
    APPLIED = 'APPLIED', 'Applied'
    REVIEWED = 'REVIEWED', 'Reviewed'
    SHORTLISTED = 'SHORTLISTED', 'Shortlisted'
    INTERVIEW = 'INTERVIEW', 'Interview'
    REJECTED = 'REJECTED', 'Rejected'
    HIRED = 'HIRED', 'Hired'

class Application(BaseModel):
    """
    Application Model representing a candidate's job application.
    """
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications',
        limit_choices_to={'role': 'CANDIDATE'}
    )
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    resume = models.FileField(upload_to=get_file_upload_path)
    cover_letter = models.TextField(null=True, blank=True)
    portfolio_url = models.URLField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED,
        db_index=True
    )
    recruiter_notes = models.TextField(null=True, blank=True)
    
    # Auto-audit fields mapping
    applied_at = models.DateTimeField(auto_now_add=True, db_index=True)
    # BaseModel provides updated_at automatically, but let's make sure it is indexed or kept standard.

    # AI Ready Nullable Fields
    match_score = models.FloatField(null=True, blank=True)
    matched_skills = models.JSONField(default=list, blank=True, null=True)
    missing_skills = models.JSONField(default=list, blank=True, null=True)

    class Meta:
        db_table = 'applications'
        ordering = ['-applied_at']
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'
        constraints = [
            # Prevent duplicate active applications per candidate per job (ignores soft-deleted ones)
            models.UniqueConstraint(
                fields=['candidate', 'job'],
                condition=models.Q(is_deleted=False),
                name='unique_active_candidate_job_application'
            )
        ]

    def __str__(self):
        return f"{self.candidate.email} -> {self.job.title}"
