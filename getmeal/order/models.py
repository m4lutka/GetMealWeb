from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator

from organization.models import Organizations
from cart.models import Cart

class OrderStatus(models.Model):
    status_type = models.TextField(max_length=100)

    def __str__(self) -> str:
        return self.status_type

# Create your models here.
class Order(models.Model):
    organization = models.ForeignKey(Organizations, on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    paid_at = models.DateTimeField(blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    total_price = models.IntegerField(validators=[MinValueValidator(0)])
    status = models.ForeignKey(OrderStatus, on_delete=models.PROTECT, blank=True)

    def __str__(self) -> str:
        return f"Order created at {self.created_at}. Total {self.total_price}.Is paid - {self.is_paid}. Status {self.status}."