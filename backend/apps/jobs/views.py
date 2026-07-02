from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from apps.users.permissions import IsRecruiter
from .models import Job
from .serializers import JobSerializer, JobStatusSerializer
from .permissions import IsJobRecruiterOwner
from .pagination import JobPagination
from .filters import JobFilter


class JobListCreateAPIView(generics.GenericAPIView):
    """
    API View to handle listing and creating jobs.
    GET: Authenticated users can list all jobs with search, filtering, and ordering.
    POST: Authenticated recruiters can create jobs.
    """
    serializer_class = JobSerializer
    pagination_class = JobPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = JobFilter
    search_fields = ['title', 'description', 'location', 'skills_required']
    ordering_fields = ['created_at', 'salary_min', 'salary_max', 'application_deadline']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsRecruiter()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Job.objects.all()

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

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
    API View to retrieve, update, and delete a single job.
    GET: Authenticated users can retrieve details.
    PUT/PATCH: Only the recruiter who created the job can edit it.
    DELETE: Only the recruiter who created the job can delete it.
    """
    serializer_class = JobSerializer
    lookup_field = 'id'

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsJobRecruiterOwner()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Job.objects.all()

    def get(self, request, *args, **kwargs):
        job = self.get_object()
        serializer = self.get_serializer(job)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        job = self.get_object()
        serializer = self.get_serializer(job, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "message": "Job updated successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        job = self.get_object()
        serializer = self.get_serializer(job, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "message": "Job updated successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        job = self.get_object()
        job.delete()
        return Response({
            "success": True,
            "message": "Job deleted successfully."
        }, status=status.HTTP_200_OK)


class JobStatusChangeAPIView(generics.GenericAPIView):
    """
    API View to change the status of a job.
    PATCH: Only the recruiter who created the job can change its status.
    """
    serializer_class = JobStatusSerializer
    permission_classes = [IsAuthenticated, IsJobRecruiterOwner]
    lookup_field = 'id'

    def get_queryset(self):
        return Job.objects.all()

    def patch(self, request, *args, **kwargs):
        job = self.get_object()
        serializer = self.get_serializer(job, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "message": "Job status updated successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
