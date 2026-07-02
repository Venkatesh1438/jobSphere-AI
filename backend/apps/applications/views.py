from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsCandidate, IsRecruiter
from apps.jobs.models import Job
from .models import Application, ApplicationStatus
from .serializers import (
    ApplicationSerializer,
    ApplicationCreateSerializer,
    ApplicationStatusUpdateSerializer
)

class JobApplyAPIView(generics.GenericAPIView):
    """
    API View to submit a job application.
    POST: Authenticated candidates can apply to a job posting by providing their resume.
    """
    serializer_class = ApplicationCreateSerializer
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request, id, *args, **kwargs):
        # Pass the job id from the URL parameters to the serializer validation context
        context = self.get_serializer_context()
        context['job_id'] = id

        serializer = self.get_serializer(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)
        application = serializer.save()

        # Return full application details in response
        response_serializer = ApplicationSerializer(application, context={'request': request})
        return Response({
            "success": True,
            "message": "Application submitted successfully.",
            "data": response_serializer.data
        }, status=status.HTTP_201_CREATED)


class ApplicationWithdrawAPIView(generics.GenericAPIView):
    """
    API View to withdraw a submitted job application.
    DELETE: Authenticated candidates can withdraw their own application.
    """
    permission_classes = [IsAuthenticated, IsCandidate]
    queryset = Application.objects.all()
    lookup_field = 'id'

    def delete(self, request, id, *args, **kwargs):
        application = self.get_object()

        # Enforce that only the candidate who applied can withdraw
        if application.candidate != request.user:
            return Response({
                "success": False,
                "message": "You do not have permission to withdraw this application."
            }, status=status.HTTP_403_FORBIDDEN)

        # Enforce that candidates cannot withdraw after being hired
        if application.status == ApplicationStatus.HIRED:
            return Response({
                "success": False,
                "message": "Cannot withdraw application after being hired."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Soft delete the application
        application.delete()
        return Response({
            "success": True,
            "message": "Application withdrawn successfully."
        }, status=status.HTTP_200_OK)


class ApplicationMeAPIView(generics.GenericAPIView):
    """
    API View to get all applications submitted by the current candidate.
    GET: Authenticated candidates retrieve a list of their applications.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request, *args, **kwargs):
        queryset = Application.objects.filter(candidate=request.user, is_deleted=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class JobApplicationsListAPIView(generics.GenericAPIView):
    """
    API View for recruiters to view all applications for a job posting.
    GET: Authenticated recruiters can view applications for a job posting they own.
    """
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request, id, *args, **kwargs):
        try:
            job = Job.objects.get(id=id, is_deleted=False)
        except Job.DoesNotExist:
            return Response({
                "success": False,
                "message": "Job posting not found."
            }, status=status.HTTP_404_NOT_FOUND)

        # Enforce recruiter ownership of the job
        if job.recruiter != request.user:
            return Response({
                "success": False,
                "message": "You do not have permission to view applications for this job."
            }, status=status.HTTP_403_FORBIDDEN)

        queryset = Application.objects.filter(job=job, is_deleted=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class ApplicationStatusUpdateAPIView(generics.GenericAPIView):
    """
    API View to update the status of a job application.
    PATCH: Authenticated recruiters can update status/notes of applications on jobs they own.
    """
    serializer_class = ApplicationStatusUpdateSerializer
    queryset = Application.objects.all()
    permission_classes = [IsAuthenticated, IsRecruiter]
    lookup_field = 'id'

    def patch(self, request, id, *args, **kwargs):
        application = self.get_object()

        # Enforce recruiter ownership of the job associated with the application
        if application.job.recruiter != request.user:
            return Response({
                "success": False,
                "message": "You do not have permission to manage this application."
            }, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(application, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Return full updated application details
        full_serializer = ApplicationSerializer(application, context={'request': request})
        return Response({
            "success": True,
            "message": "Application status updated successfully.",
            "data": full_serializer.data
        }, status=status.HTTP_200_OK)
