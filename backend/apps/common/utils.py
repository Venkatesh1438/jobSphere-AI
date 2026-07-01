import os
import uuid
from django.utils.text import slugify

def get_file_upload_path(instance, filename):
    """
    Generate a dynamic, unique path for file uploads.
    Format: uploads/{model_name}/{uuid_hex}/{slugified_filename}
    """
    ext = filename.split('.')[-1]
    name = '.'.join(filename.split('.')[:-1])
    unique_id = uuid.uuid4().hex
    
    clean_filename = f"{slugify(name)}.{ext}"
    model_folder = instance.__class__.__name__.lower()
    
    return os.path.join("uploads", model_folder, unique_id, clean_filename)
