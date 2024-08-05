from django.db import models

from user.models import User

# Create your models here.

class Organizations(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.TextField(max_length=255, unique=True)
    address = models.TextField(max_length=255)
    image = models.ImageField(blank=True, upload_to="images/", null=True)
    is_open = models.BooleanField(default=False)
    work_time_open = models.TimeField(null=True, blank=True)
    work_time_close = models.TimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.name
