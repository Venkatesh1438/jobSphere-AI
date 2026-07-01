from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.settings import api_settings
from .models import User, UserRole, CandidateProfile, RecruiterProfile


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


class CandidateRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for candidate registration.
    Validates email uniqueness, password strength/match, and creates
    both User and CandidateProfile within a transaction.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    phone_number = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=15,
        default=''
    )

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'password',
            'confirm_password',
            'first_name',
            'last_name',
            'phone_number',
            'role',
        ]
        read_only_fields = ['id', 'role']

    def validate(self, attrs):
        # 1. Validate email uniqueness
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                'email': 'A user with this email already exists.'
            })

        # 2. Confirm password matching
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })

        # 3. Validate password using Django password validators
        password = attrs.get('password')
        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({
                'password': list(e.messages)
            })

        return attrs

    def create(self, validated_data):
        # Remove confirm_password as it's not a field on the User model
        validated_data.pop('confirm_password')

        # Create user and candidate profile atomically
        with transaction.atomic():
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                phone_number=validated_data.get('phone_number', ''),
                role=UserRole.CANDIDATE
            )
            # Create CandidateProfile automatically
            CandidateProfile.objects.create(user=user)

        return user


class RecruiterRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for recruiter registration.
    Validates email uniqueness, password strength/match, and creates
    both User and RecruiterProfile within a transaction.
    Normalizes company_name and designation by stripping whitespace.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    phone_number = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=15,
        default=''
    )
    company_name = serializers.CharField(required=True, max_length=255)
    designation = serializers.CharField(required=True, max_length=150)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'password',
            'confirm_password',
            'first_name',
            'last_name',
            'phone_number',
            'company_name',
            'designation',
            'role',
        ]
        read_only_fields = ['id', 'role']

    def validate(self, attrs):
        # 1. Validate email uniqueness
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                'email': 'A user with this email already exists.'
            })

        # 2. Confirm password matching
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })

        # 3. Validate password using Django password validators
        password = attrs.get('password')
        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({
                'password': list(e.messages)
            })

        return attrs

    def create(self, validated_data):
        # Remove fields not present in User model
        validated_data.pop('confirm_password')
        company_name = validated_data.pop('company_name')
        designation = validated_data.pop('designation')

        # Normalize company_name and designation
        company_name = company_name.strip()
        designation = designation.strip()

        # Create user and recruiter profile atomically
        with transaction.atomic():
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                phone_number=validated_data.get('phone_number', ''),
                role=UserRole.RECRUITER
            )
            # Create RecruiterProfile automatically
            RecruiterProfile.objects.create(
                user=user,
                company_name=company_name,
                designation=designation
            )

        return user


class SafeUserSerializer(serializers.ModelSerializer):
    """
    Serializer to return non-sensitive, safe user information.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']
        read_only_fields = fields


class LoginSerializer(serializers.Serializer):
    """
    Serializer for handling user login with email and password,
    authenticating, checking active status, conditionally updating
    last_login, and generating JWT access and refresh tokens.
    """
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    token_type = serializers.CharField(read_only=True, default='Bearer')
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    user = SafeUserSerializer(read_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        # Check if the user exists first to distinguish between invalid credentials and inactive account
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("Invalid email or password.")

        # If user exists but is inactive
        if not user.is_active:
            # Check password to prevent user enumeration security issues
            if user.check_password(password):
                raise PermissionDenied("User account is inactive.")
            raise AuthenticationFailed("Invalid email or password.")

        # Authenticate active user
        authenticated_user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )
        if not authenticated_user:
            raise AuthenticationFailed("Invalid email or password.")

        # Conditionally update last login based on simple-jwt settings
        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, authenticated_user)

        # Generate tokens
        refresh = RefreshToken.for_user(authenticated_user)

        return {
            'token_type': 'Bearer',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': authenticated_user
        }

