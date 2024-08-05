from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager


class NewUserManager(UserManager):
    def create_user(self,email,password=None):
        """Create a new user profile"""
        if not email:
            raise ValueError('User must have an email address')
        
        email = self.normalize_email(email) 
        user = self.model(email=email,username=email) 
        user.set_password(password)
        user.save(using=self.db)
        return user
    
    def create_superuser(self,email,password=None):
        """Create a new superuser profile"""
        if not email:
            raise ValueError('User must have an email address')
        
        email = self.normalize_email(email) 
        user = self.model(email=email,username=email, is_superuser=1, is_staff=1) 
        user.set_password(password)
        user.save(using=self.db)
        return user
    

class User(AbstractUser):
    objects = NewUserManager()
    email = models.EmailField(max_length=255, unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    #phone_number = models.TextField(max_length=10, unique=True, blank=True)
    phone_number = models.TextField(max_length=10, blank=True)
    is_organization = models.BooleanField(default=False, blank=True)
    
    def __str__(self):
        return str(self.email)