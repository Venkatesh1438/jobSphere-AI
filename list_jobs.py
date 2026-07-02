import os
import sys
import django
sys.path.insert(0, 'c:\\Users\\venkatesh\\Downloads\\JobSpher-AI\\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

from apps.jobs.models import Job
for job in Job.objects.all():
    has_company = hasattr(job.recruiter, 'company')
    company_name = job.recruiter.company.company_name if has_company else "No Company"
    print(f"Job: {job.title} | Recruiter: {job.recruiter.email} | Company: {company_name}")
