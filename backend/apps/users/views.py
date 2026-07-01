from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    CandidateRegistrationSerializer,
    RecruiterRegistrationSerializer,
    LoginSerializer,
    LogoutSerializer,
    MeUserSerializer,
    ChangePasswordSerializer,
)


class CandidateRegistrationAPIView(GenericAPIView):
    """
    API View to handle candidate registration.
    Accepts POST requests only.
    """
    serializer_class = CandidateRegistrationSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "success": True,
            "message": "Candidate registered successfully.",
            "data": {
                "id": str(user.id),
                "email": user.email,
                "role": user.role
            }
        }, status=status.HTTP_201_CREATED)


class RecruiterRegistrationAPIView(GenericAPIView):
    """
    API View to handle recruiter registration.
    Accepts POST requests only.
    """
    serializer_class = RecruiterRegistrationSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "success": True,
            "message": "Recruiter registered successfully.",
            "data": {
                "id": str(user.id),
                "email": user.email,
                "role": user.role
            }
        }, status=status.HTTP_201_CREATED)


class LoginAPIView(GenericAPIView):
    """
    API View to handle user login.
    Accepts POST requests only.
    """
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response({
            "success": True,
            "message": "Login successful.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class LogoutAPIView(GenericAPIView):
    """
    API View to handle user logout by blacklisting the refresh token.
    Accepts POST requests only.
    """
    serializer_class = LogoutSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "success": True,
            "message": "Logout successful."
        }, status=status.HTTP_200_OK)


class MeAPIView(GenericAPIView):
    """
    API View to retrieve the current authenticated user's details.
    Accepts GET requests only.
    """
    serializer_class = MeUserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class ChangePasswordAPIView(GenericAPIView):
    """
    API View to handle password change for authenticated users.
    Accepts POST requests only.
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "success": True,
            "message": "Password changed successfully."
        }, status=status.HTTP_200_OK)


