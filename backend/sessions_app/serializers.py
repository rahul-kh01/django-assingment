from rest_framework import serializers
from .models import Session
from accounts.serializers import UserSerializer


class SessionSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    spots_left = serializers.ReadOnlyField()

    class Meta:
        model = Session
        fields = [
            "id", "creator", "title", "description", "image",
            "date", "duration_minutes", "max_participants",
            "price", "is_active", "spots_left", "created_at",
        ]
        read_only_fields = ["id", "creator", "created_at"]


class SessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = [
            "title", "description", "image", "date",
            "duration_minutes", "max_participants", "price", "is_active",
        ]