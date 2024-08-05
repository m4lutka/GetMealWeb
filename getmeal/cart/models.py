from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator

from user.models import User
from menu.models import MenuItems, AdditionalOptions



class Cart(models.Model):
    user = models.ForeignKey(User, blank=True, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    
class CartItem(models.Model):
    item = models.ForeignKey(MenuItems, on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    additional_option = models.ManyToManyField(AdditionalOptions, blank=True)

    quantity = models.IntegerField(validators=[MinValueValidator(1)], default=1)

    def __str__(self) -> str:
        return f"{self.item} in {self.cart} cart. Quantity - {self.quantity}"
    

    

