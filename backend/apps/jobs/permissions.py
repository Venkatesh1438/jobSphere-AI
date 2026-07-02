from rest_framework import permissions
from apps.users.models import UserRole

class IsJobRecruiterOwner(permissions.BasePermission):
    """
    Permission to allow only the recruiter who created the job to modify or delete it.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        # If writing, user must be a recruiter
        if request.method not in permissions.SAFE_METHODS:
            return request.user.role == UserRole.RECRUITER
        return True

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner recruiter
        return obj.recruiter == request.user
