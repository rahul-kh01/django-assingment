from django.db import models
from django.conf import settings


class Session(models.Model):
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_sessions"
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.URLField(blank=True, default="")
    date = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=60)
    max_participants = models.PositiveIntegerField(default=20)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return self.title

    @property
    def spots_left(self):
        booked = self.bookings.filter(status="confirmed").count()
        return max(0, self.max_participants - booked)