from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        USER = "user", "User"
        CREATOR = "creator", "Creator"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER)
    avatar = models.URLField(blank=True, default="")
    oauth_provider = models.CharField(max_length=20, blank=True, default="")
    oauth_uid = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["oauth_provider", "oauth_uid"],
                name="unique_oauth_account",
                condition=~models.Q(oauth_provider=""),
            )
        ]

    def __str__(self):
        return f"{self.username} ({self.role})"