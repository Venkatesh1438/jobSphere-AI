from rest_framework import serializers
from .models import User, CandidateProfile, RecruiterProfile


class UserSerializer(serializers.ModelSerializer):
    """
    Skeleton serializer for the custom User model.
    """
    class Meta:
        model = User
        fields = '__all__'


class CandidateProfileSerializer(serializers.ModelSerializer):
    """
    Skeleton serializer for the CandidateProfile model.
    """
    class Meta:
        model = CandidateProfile
        fields = '__all__'


class RecruiterProfileSerializer(serializers.ModelSerializer):
    """
    Skeleton serializer for the RecruiterProfile model.
    """
    class Meta:
        model = RecruiterProfile
        fields = '__all__'
