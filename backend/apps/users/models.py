from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
# pyrefly: ignore [missing-import]
from apps.common.models import BaseModel


class UserRole(models.TextChoices):
    ADMIN = 'ADMIN', 'Admin'
    RECRUITER = 'RECRUITER', 'Recruiter'
    CANDIDATE = 'CANDIDATE', 'Candidate'


class CustomUserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier
    for authentication instead of usernames.
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', UserRole.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, BaseModel):
    """
    Custom User Model for JobSphere AI.
    Uses UUID as primary key (from BaseModel) and email for login.
    """
    username = None  # Remove username field
    email = models.EmailField('email address', unique=True, db_index=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CANDIDATE,
        db_index=True
    )
    is_email_verified = models.BooleanField(default=False, db_index=True)
    is_profile_completed = models.BooleanField(default=False)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # email & password are required by default

    objects = CustomUserManager()

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email


class CandidateProfile(BaseModel):
    """
    Candidate Profile Model containing resume, portfolio, and social links.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='candidate_profile'
    )
    headline = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    resume_score = models.PositiveSmallIntegerField(default=0)
    profile_completion = models.PositiveSmallIntegerField(default=0)
    github = models.URLField(max_length=200, null=True, blank=True)
    linkedin = models.URLField(max_length=200, null=True, blank=True)
    portfolio = models.URLField(max_length=200, null=True, blank=True)

    objects = models.Manager()  # Standard manager to bypass soft deletion

    class Meta:
        db_table = 'candidate_profiles'
        verbose_name = 'Candidate Profile'
        verbose_name_plural = 'Candidate Profiles'

    def __str__(self):
        return f"Candidate Profile - {self.user.email}"


class RecruiterProfile(BaseModel):
    """
    Recruiter Profile Model containing company and designation info.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='recruiter_profile'
    )
    company_name = models.CharField(max_length=255, null=True, blank=True)
    designation = models.CharField(max_length=150, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)

    objects = models.Manager()  # Standard manager to bypass soft deletion

    class Meta:
        db_table = 'recruiter_profiles'
        verbose_name = 'Recruiter Profile'
        verbose_name_plural = 'Recruiter Profiles'

    def __str__(self):
        return f"Recruiter Profile - {self.user.email}"
