from django.contrib import admin
from .models import Session


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ["title", "creator", "date", "price", "is_active"]
    list_filter = ["is_active", "date"]
    search_fields = ["title"]