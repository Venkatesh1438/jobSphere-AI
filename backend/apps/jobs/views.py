from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsRecruiter
from .models import Job
from .serializers import JobSerializer


class JobListCreateAPIView(generics.GenericAPIView):
    """
    API View to handle listing and creating jobs.
    GET: Authenticated users can list all jobs.
    POST: Authenticated recruiters can create jobs.
    """
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsRecruiter()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Job.objects.all()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "message": "Job created successfully.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)


class JobDetailAPIView(generics.GenericAPIView):
    """
    API View to retrieve a single job by its UUID.
    GET: Authenticated users can retrieve details.
    """
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Job.objects.all()

    def get(self, request, *args, **kwargs):
        job = self.get_object()
        serializer = self.get_serializer(job)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)
