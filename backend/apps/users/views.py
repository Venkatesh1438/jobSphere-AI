from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from .serializers import CandidateRegistrationSerializer


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
