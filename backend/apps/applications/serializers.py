import os
from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.jobs.models import Job, JobStatus
from apps.companies.models import Company
from apps.users.models import UserRole
from .models import Application, ApplicationStatus

User = get_user_model()

class JobSummarySerializer(serializers.ModelSerializer):
    """
    Serializer to return nested lightweight job details.
    """
    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'location',
            'employment_type',
            'experience_level',
            'salary_min',
            'salary_max',
            'status'
        ]


class CompanySummarySerializer(serializers.ModelSerializer):
    """
    Serializer to return nested lightweight company details.
    """
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id',
            'company_name',
            'company_logo',
            'logo_url',
            'industry',
            'website',
            'location'
        ]

    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.company_logo:
            return request.build_absolute_uri(obj.company_logo.url) if request else obj.company_logo.url
        return None


class CandidateSummarySerializer(serializers.ModelSerializer):
    """
    Serializer to return safe Candidate user details for recruiter views.
    """
    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone_number'
        ]
        read_only_fields = fields


class ApplicationSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing detailed application information (React Ready).
    Includes nested job, nested company (derived), and candidate summary.
    """
    job = JobSummarySerializer(read_only=True)
    company = serializers.SerializerMethodField()
    candidate = CandidateSummarySerializer(read_only=True)

    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'company',
            'candidate',
            'resume',
            'cover_letter',
            'portfolio_url',
            'status',
            'recruiter_notes',
            'applied_at',
            'updated_at',
            'match_score',
            'matched_skills',
            'missing_skills'
        ]
        read_only_fields = fields

    def get_company(self, obj):
        # Retrieve the company owned by the job's recruiter
        try:
            recruiter = obj.job.recruiter
            if hasattr(recruiter, 'company'):
                return CompanySummarySerializer(recruiter.company, context=self.context).data
        except Exception:
            pass
        return None


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer to handle candidate job applications.
    Enforces file limits, candidate checks, and closed job checks.
    """
    class Meta:
        model = Application
        fields = ['resume', 'cover_letter', 'portfolio_url']

    def validate_resume(self, value):
        if not value:
            raise serializers.ValidationError("Resume file is required.")
        
        # Enforce PDF and DOCX extensions
        ext = os.path.splitext(value.name)[1].lower().replace('.', '')
        allowed_extensions = ['pdf', 'docx']
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Unsupported resume file format. Only {', '.join(allowed_extensions).upper()} are allowed."
            )
        
        # Enforce maximum size of 10 MB
        max_size = 10 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError("Resume file size cannot exceed 10 MB.")
        
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user
        job_id = self.context.get('job_id')

        # 1. Verify user is a Candidate
        if user.role != UserRole.CANDIDATE:
            raise serializers.ValidationError({"detail": "Only candidates can apply to job postings."})

        # 2. Verify Job exists and is active
        try:
            job = Job.objects.get(id=job_id, is_deleted=False)
        except Job.DoesNotExist:
            raise serializers.ValidationError({"detail": "Job posting not found."})

        # 3. Cannot apply to CLOSED jobs
        if job.status == JobStatus.CLOSED:
            raise serializers.ValidationError({"detail": "This job posting is closed and no longer accepting applications."})

        # 4. Duplicate prevention (one application per candidate per job)
        if Application.objects.filter(candidate=user, job=job, is_deleted=False).exists():
            raise serializers.ValidationError({"detail": "You have already submitted an application for this job."})

        # Store job in context for use in create
        self.context['job_object'] = job
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        job = self.context['job_object']
        return Application.objects.create(
            candidate=user,
            job=job,
            **validated_data
        )


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer used by recruiters to update application status and notes.
    """
    class Meta:
        model = Application
        fields = ['status', 'recruiter_notes']

    def validate_status(self, value):
        if value not in ApplicationStatus.values:
            raise serializers.ValidationError("Invalid application status choice.")
        return value
