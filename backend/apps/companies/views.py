from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Company
from .serializers import CompanySerializer
from .permissions import IsCompanyOwnerOrReadOnly
from .pagination import CompanyPagination

class CompanyListCreateAPIView(generics.GenericAPIView):
    """
    API View to handle listing and creating companies.
    GET: Authenticated users can list all companies.
    POST: Authenticated recruiters can create their company profile (exactly one).
    """
    serializer_class = CompanySerializer
    pagination_class = CompanyPagination

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated(), IsCompanyOwnerOrReadOnly()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Company.objects.all()

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
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
            "message": "Company profile created successfully.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)


class CompanyDetailAPIView(generics.GenericAPIView):
    """
    API View to retrieve, update, and delete a single company profile.
    GET: Authenticated users can retrieve details.
    PUT/PATCH/DELETE: Only the recruiter who owns the company profile can modify or delete it.
    """
    serializer_class = CompanySerializer
    queryset = Company.objects.all()
    lookup_field = 'id'

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated(), IsCompanyOwnerOrReadOnly()]
        return [IsAuthenticated()]

    def get(self, request, *args, **kwargs):
        company = self.get_object()
        serializer = self.get_serializer(company)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "message": "Company profile updated successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "success": True,
            "message": "Company profile updated successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        company = self.get_object()
        company.delete()
        return Response({
            "success": True,
            "message": "Company profile deleted successfully."
        }, status=status.HTTP_200_OK)
