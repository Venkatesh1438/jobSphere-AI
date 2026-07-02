from rest_framework.permissions import BasePermission
from .models import UserRole


class IsCandidate(BasePermission):
    """
    Permission skeleton allowing access only to candidate users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.CANDIDATE
        )


class IsRecruiter(BasePermission):
    """
    Permission skeleton allowing access only to recruiter users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.RECRUITER
        )


class IsAdmin(BasePermission):
    """
    Permission skeleton allowing access only to admin users or staff.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == UserRole.ADMIN or request.user.is_staff)
        )
