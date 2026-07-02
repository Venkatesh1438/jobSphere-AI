import re
import os
from rest_framework import serializers
from apps.users.serializers import SafeUserSerializer
from apps.jobs.models import Job, JobStatus
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    active_jobs_count = serializers.SerializerMethodField()
    recruiter = SafeUserSerializer(read_only=True)

    class Meta:
        model = Company
        fields = [
            'id',
            'recruiter',
            'company_name',
            'company_logo',
            'company_cover',
            'company_tagline',
            'company_culture',
            'company_benefits',
            'industry',
            'website',
            'linkedin',
            'email',
            'phone',
            'location',
            'founded_year',
            'company_size',
            'about',
            'verified',
            'logo_url',
            'cover_image_url',
            'active_jobs_count',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'recruiter', 'verified', 'created_at', 'updated_at']

    def get_logo_url(self, obj):
        request = self.context.get('request')
        if obj.company_logo:
            # Build full URL if request is available, otherwise default to relative path
            return request.build_absolute_uri(obj.company_logo.url) if request else obj.company_logo.url
        return None

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.company_cover:
            # Build full URL if request is available, otherwise default to relative path
            return request.build_absolute_uri(obj.company_cover.url) if request else obj.company_cover.url
        return None

    def get_active_jobs_count(self, obj):
        # Only count jobs whose status is PUBLISHED and are not soft-deleted
        return Job.objects.filter(
            recruiter=obj.recruiter,
            status=JobStatus.PUBLISHED,
            is_deleted=False
        ).count()

    def validate_company_logo(self, value):
        if value:
            # Allowed extensions: PNG, JPG, JPEG, WEBP
            ext = os.path.splitext(value.name)[1].lower().replace('.', '')
            allowed_extensions = ['png', 'jpg', 'jpeg', 'webp']
            if ext not in allowed_extensions:
                raise serializers.ValidationError(
                    f"Unsupported logo image extension. Allowed formats: {', '.join(allowed_extensions).upper()}."
                )
            # Maximum size: 5 MB
            max_size = 5 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError("Company logo size cannot exceed 5 MB.")
        return value

    def validate_company_cover(self, value):
        if value:
            # Allowed extensions: PNG, JPG, JPEG, WEBP
            ext = os.path.splitext(value.name)[1].lower().replace('.', '')
            allowed_extensions = ['png', 'jpg', 'jpeg', 'webp']
            if ext not in allowed_extensions:
                raise serializers.ValidationError(
                    f"Unsupported cover image extension. Allowed formats: {', '.join(allowed_extensions).upper()}."
                )
            # Maximum size: 10 MB
            max_size = 10 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError("Company cover banner size cannot exceed 10 MB.")
        return value

    def validate_phone(self, value):
        # Validate international/local format (e.g. +123456789, (123) 456-7890)
        phone_regex = r'^\+?[0-9\s\-()]{7,20}$'
        if not re.match(phone_regex, value):
            raise serializers.ValidationError("Invalid phone number format.")
        return value

    def validate_linkedin(self, value):
        # Validate LinkedIn URL
        linkedin_regex = r'^https?://(www\.)?linkedin\.com/.*$'
        if not re.match(linkedin_regex, value):
            raise serializers.ValidationError("Enter a valid LinkedIn profile URL.")
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            # Recruiters only
            if user.role != 'RECRUITER':
                raise serializers.ValidationError("Only recruiters can manage or own a company profile.")
            
            # Check unique OneToOne relationship on creation
            if not self.instance:
                if Company.objects.filter(recruiter=user).exists():
                    raise serializers.ValidationError("You already own a company. A recruiter cannot own multiple companies.")
        return attrs

    def create(self, validated_data):
        # Automatically assign the logged-in recruiter user as the owner
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['recruiter'] = request.user
        return super().create(validated_data)
