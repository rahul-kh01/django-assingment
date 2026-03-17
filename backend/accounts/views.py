import requests
from django.conf import settings
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer, ProfileUpdateSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    code = request.data.get("code")
    if not code:
        return Response({"error": "Authorization code required"}, status=400)

    token_res = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": request.data.get("redirect_uri", "http://localhost/auth/google/callback"),
            "grant_type": "authorization_code",
        },
    )
    if token_res.status_code != 200:
        return Response({"error": "Failed to exchange code"}, status=400)

    access_token = token_res.json().get("access_token")
    user_info = requests.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()

    user, created = User.objects.get_or_create(
        oauth_provider="google",
        oauth_uid=user_info["id"],
        defaults={
            "username": f'google_{user_info["id"]}',
            "email": user_info.get("email", ""),
            "first_name": user_info.get("given_name", ""),
            "last_name": user_info.get("family_name", ""),
            "avatar": user_info.get("picture", ""),
        },
    )

    tokens = get_tokens_for_user(user)
    return Response({"tokens": tokens, "user": UserSerializer(user).data})


@api_view(["POST"])
@permission_classes([AllowAny])
def github_login(request):
    code = request.data.get("code")
    if not code:
        return Response({"error": "Authorization code required"}, status=400)

    token_res = requests.post(
        "https://github.com/login/oauth/access_token",
        data={
            "code": code,
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
        },
        headers={"Accept": "application/json"},
    )
    if token_res.status_code != 200:
        return Response({"error": "Failed to exchange code"}, status=400)

    access_token = token_res.json().get("access_token")
    user_info = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()

    emails_res = requests.get(
        "https://api.github.com/user/emails",
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()
    primary_email = next((e["email"] for e in emails_res if e.get("primary")), "")

    user, created = User.objects.get_or_create(
        oauth_provider="github",
        oauth_uid=str(user_info["id"]),
        defaults={
            "username": f'github_{user_info["id"]}',
            "email": primary_email,
            "first_name": user_info.get("name", "") or "",
            "avatar": user_info.get("avatar_url", ""),
        },
    )

    tokens = get_tokens_for_user(user)
    return Response({"tokens": tokens, "user": UserSerializer(user).data})


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == "GET":
            return UserSerializer
        return ProfileUpdateSerializer