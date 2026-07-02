from rest_framework import serializers
from apps.users.serializers import SafeUserSerializer
from .models import Job, JobStatus, EmploymentType, ExperienceLevel


class JobSerializer(serializers.ModelSerializer):
    recruiter = SafeUserSerializer(read_only=True)

    class Meta:
        model = Job
        fields = [
            'id',
            'recruiter',
            'title',
            'description',
            'location',
            'employment_type',
            'experience_level',
            'salary_min',
            'salary_max',
            'skills_required',
            'status',
            'application_deadline',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        # Prevent modification if the job is closed
        if self.instance and self.instance.status == JobStatus.CLOSED:
            raise serializers.ValidationError("Cannot modify a closed job.")

        # Get effective values, merging input with existing instance values
        salary_min = attrs.get('salary_min') if 'salary_min' in attrs else (self.instance.salary_min if self.instance else None)
        salary_max = attrs.get('salary_max') if 'salary_max' in attrs else (self.instance.salary_max if self.instance else None)

        # Validate that salary_min is positive
        if salary_min is not None and salary_min < 0:
            raise serializers.ValidationError({
                "salary_min": "Minimum salary must be a positive value."
            })

        # Validate that salary_max is positive
        if salary_max is not None and salary_max < 0:
            raise serializers.ValidationError({
                "salary_max": "Maximum salary must be a positive value."
            })

        # Validate that salary_max is not less than salary_min
        if salary_min is not None and salary_max is not None:
            if salary_max < salary_min:
                raise serializers.ValidationError({
                    "salary_max": "Maximum salary cannot be less than minimum salary."
                })

        return attrs

    def create(self, validated_data):
        # Dynamically set recruiter as the request's authenticated user
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['recruiter'] = request.user
        return super().create(validated_data)


class JobStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['status']

    def validate(self, attrs):
        # Prevent modification if the job is closed
        if self.instance and self.instance.status == JobStatus.CLOSED:
            raise serializers.ValidationError("Cannot modify a closed job.")
        return attrs

