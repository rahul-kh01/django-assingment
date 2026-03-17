from rest_framework import serializers
from .models import Booking
from sessions_app.serializers import SessionSerializer


class BookingSerializer(serializers.ModelSerializer):
    session = SessionSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "session", "status", "created_at"]
        read_only_fields = ["id", "status", "created_at"]


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["session"]

    def validate_session(self, session):
        if session.spots_left <= 0:
            raise serializers.ValidationError("No spots available.")
        if not session.is_active:
            raise serializers.ValidationError("Session is no longer active.")
        return session

    def validate(self, attrs):
        user = self.context["request"].user
        if Booking.objects.filter(user=user, session=attrs["session"], status="confirmed").exists():
            raise serializers.ValidationError("You have already booked this session.")
        return attrs