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