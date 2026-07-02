from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.users.models import UserRole
from apps.jobs.models import Job, JobStatus

User = get_user_model()

class CommonBaseModelTests(TestCase):
    def setUp(self):
        # Create a Recruiter User to satisfy the Job model's ForeignKey constraint
        self.recruiter = User.objects.create_user(
            email="recruiter_test@example.com",
            password="StrongPassword123!",
            first_name="Test",
            last_name="Recruiter",
            role=UserRole.RECRUITER,
            is_email_verified=True
        )

    def test_basemodel_fields_on_create(self):
        # Create a Job
        job = Job.objects.create(
            recruiter=self.recruiter,
            title="Software Dev",
            description="Django",
            location="Remote"
        )
        # Check UUID primary key generation
        self.assertIsNotNone(job.id)
        # Check created_at and updated_at are populated
        self.assertIsNotNone(job.created_at)
        self.assertIsNotNone(job.updated_at)
        # Check defaults
        self.assertFalse(job.is_deleted)
        self.assertIsNone(job.deleted_at)

    def test_soft_delete_instance(self):
        job = Job.objects.create(
            recruiter=self.recruiter,
            title="Software Dev",
            description="Django",
            location="Remote"
        )
        # Call instance delete (should soft delete)
        job.delete()
        
        # Reload from DB with all_objects manager
        job_reloaded = Job.all_objects.get(id=job.id)
        self.assertTrue(job_reloaded.is_deleted)
        self.assertIsNotNone(job_reloaded.deleted_at)
        
        # Verify it is hidden from the default objects manager
        self.assertFalse(Job.objects.filter(id=job.id).exists())

    def test_queryset_delete_soft_deletes(self):
        Job.objects.create(
            recruiter=self.recruiter,
            title="Software Dev 1",
            description="Django",
            location="Remote"
        )
        Job.objects.create(
            recruiter=self.recruiter,
            title="Software Dev 2",
            description="Django",
            location="Remote"
        )
        # Call queryset delete
        Job.objects.all().delete()
        
        # Verify all are soft-deleted and excluded from default objects
        self.assertEqual(Job.objects.count(), 0)
        self.assertEqual(Job.all_objects.filter(is_deleted=True).count(), 2)

    def test_hard_delete_instance(self):
        job = Job.objects.create(
            recruiter=self.recruiter,
            title="Software Dev",
            description="Django",
            location="Remote"
        )
        # Hard delete
        job.hard_delete()
        
        # Verify it is completely removed from DB
        self.assertFalse(Job.all_objects.filter(id=job.id).exists())

    def test_queryset_hard_delete(self):
        Job.objects.create(
            recruiter=self.recruiter,
            title="Software Dev",
            description="Django",
            location="Remote"
        )
        # QuerySet hard delete
        Job.all_objects.all().hard_delete()
        self.assertEqual(Job.all_objects.count(), 0)

    def test_alive_and_dead_filters(self):
        job_alive = Job.objects.create(
            recruiter=self.recruiter,
            title="Alive Dev",
            description="Django",
            location="Remote"
        )
        job_dead = Job.objects.create(
            recruiter=self.recruiter,
            title="Dead Dev",
            description="Django",
            location="Remote"
        )
        job_dead.delete()
        
        # Query using all_with_deleted queryset methods
        qs = Job.objects.all_with_deleted()
        self.assertEqual(qs.alive().count(), 1)
        self.assertEqual(qs.alive().first().id, job_alive.id)
        self.assertEqual(qs.dead().count(), 1)
        self.assertEqual(qs.dead().first().id, job_dead.id)
