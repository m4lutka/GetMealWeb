from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator

from organization.models import Organizations

class Menus(models.Model):
    name = models.TextField(max_length=35)
    description =models.TextField(max_length=300)
    image = models.ImageField(blank=True)
    organization = models.ForeignKey(Organizations, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name

class Categories(models.Model):
    name = models.TextField(max_length=35)
    description = models.TextField(max_length=300)
    image = models.ImageField(blank=True)
    menu = models.ForeignKey(Menus, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name
      
class AdditionalOptionGroups(models.Model):
    SELECTION_TYPES = {
        "one": "Only One",
        "multiple": "Multiple",
    }
    name = models.TextField(max_length=35)
    selection_type = models.CharField(choices=SELECTION_TYPES)

    def __str__(self) -> str:
        return self.name

class AdditionalOptions(models.Model):
    name = models.TextField(max_length=35)
    price = models.IntegerField()
    image = models.ImageField(blank=True)
    additional_option_group = models.ForeignKey(AdditionalOptionGroups, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name
    
class MenuItems(models.Model):
    name = models.TextField(max_length=35)
    description = models.TextField(max_length=300)
    composition = ArrayField(models.CharField(35))
    price = models.IntegerField()
    discount = models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(100)], default=0)
    image = models.ImageField(blank=True)
    menu = models.ManyToManyField(Menus)
    category = models.ManyToManyField(Categories)
    additional_option = models.ManyToManyField(AdditionalOptions, blank=True)

    def __str__(self) -> str:
        return self.name
    