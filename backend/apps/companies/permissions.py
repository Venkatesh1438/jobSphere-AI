from rest_framework import permissions
from apps.users.models import UserRole

class IsCompanyOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission for Company profiles:
    - Safe methods (GET, HEAD, OPTIONS) allowed for all authenticated users.
    - Candidates and other users have Read-Only access.
    - Recruiters can Create, Update, or Delete their own company.
    - Admins/Staff have full access.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        # Candidates can only access safe (read-only) methods
        if request.user.role == UserRole.CANDIDATE:
            return request.method in permissions.SAFE_METHODS

        # Recruiters and Admins can create (POST) or modify
        if request.user.role in [UserRole.RECRUITER, UserRole.ADMIN] or request.user.is_staff:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        # Safe methods are readable by all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write operations are restricted to the owner recruiter or admin
        return obj.recruiter == request.user or request.user.role == UserRole.ADMIN or request.user.is_staff
