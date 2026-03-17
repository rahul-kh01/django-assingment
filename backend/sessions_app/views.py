from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Session
from .serializers import SessionSerializer, SessionCreateSerializer
from accounts.permissions import IsCreator


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.select_related("creator").filter(is_active=True)
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["date", "price", "created_at"]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return SessionCreateSerializer
        return SessionSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [permissions.IsAuthenticated(), IsCreator()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list" and self.request.query_params.get("mine") == "true":
            qs = Session.objects.filter(creator=self.request.user)
        return qs