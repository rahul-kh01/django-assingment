# Ahoum SpiritualTech — Sessions Marketplace

A full-stack sessions marketplace where users sign in via OAuth, browse spiritual sessions, and book them.

## Tech Stack

- **Frontend**: React 18 + React Router 6  
- **Backend**: Django 5.1 + Django REST Framework + SimpleJWT  
- **Database**: PostgreSQL 16  
- **Infrastructure**: Docker Compose (frontend, backend, db, nginx reverse proxy)  
- **Auth**: Google / GitHub OAuth → JWT tokens  

## Prerequisites

- Docker & Docker Compose installed  
- A Google and/or GitHub OAuth application (see below)  

## Setup Steps

### 1. Clone the repository

```bash
git clone https://github.com/rahul-kh01/django-assingment
cd assignment
```

---

## TEST

```bash
docker compose exec backend python manage.py shell -c "
from accounts.models import User
from sessions_app.models import Session
from bookings.models import Booking
from django.utils import timezone
from datetime import timedelta

# Create a Creator user
creator, _ = User.objects.get_or_create(
    username='demo_creator',
    defaults={
        'email': 'creator@example.com',
        'first_name': 'Sarah',
        'last_name': 'Chen',
        'role': 'creator',
        'avatar': 'https://i.pravatar.cc/150?u=creator',
    }
)
creator.set_password('testpass123')
creator.save()

# Create a regular User
user, _ = User.objects.get_or_create(
    username='demo_user',
    defaults={
        'email': 'user@example.com',
        'first_name': 'Alex',
        'last_name': 'Johnson',
        'role': 'user',
        'avatar': 'https://i.pravatar.cc/150?u=user',
    }
)
user.set_password('testpass123')
user.save()

# Create Sessions
now = timezone.now()
sessions_data = [
    {
        'title': 'Morning Meditation & Breathwork',
        'description': 'Start your day with a guided 60-minute meditation session focusing on deep breathwork techniques, mindfulness, and inner peace. Suitable for all levels.',
        'image': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
        'date': now + timedelta(days=3, hours=7),
        'duration_minutes': 60,
        'max_participants': 20,
        'price': 25.00,
    },
    {
        'title': 'Yoga & Spiritual Healing',
        'description': 'A holistic yoga session combining traditional asanas with chakra healing. Reconnect with your body and spirit through ancient practices adapted for modern life.',
        'image': 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600',
        'date': now + timedelta(days=5, hours=9),
        'duration_minutes': 90,
        'max_participants': 15,
        'price': 35.00,
    },
    {
        'title': 'Sound Bath & Crystal Healing',
        'description': 'Immerse yourself in the healing vibrations of Tibetan singing bowls, crystal bowls, and gongs. A deeply relaxing experience that promotes emotional release.',
        'image': 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600',
        'date': now + timedelta(days=7, hours=18),
        'duration_minutes': 75,
        'max_participants': 12,
        'price': 40.00,
    },
    {
        'title': 'Guided Energy Work Workshop',
        'description': 'Learn the fundamentals of energy healing, including Reiki basics, aura cleansing, and grounding techniques. Interactive hands-on workshop for beginners.',
        'image': 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600',
        'date': now + timedelta(days=10, hours=14),
        'duration_minutes': 120,
        'max_participants': 10,
        'price': 55.00,
    },
    {
        'title': 'Mindful Journaling Circle',
        'description': 'A guided journaling session designed to help you explore your inner world. Includes prompts for self-reflection, gratitude practice, and intention setting.',
        'image': 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600',
        'date': now + timedelta(days=2, hours=10),
        'duration_minutes': 45,
        'max_participants': 25,
        'price': 15.00,
    },
    {
        'title': 'Full Moon Ceremony & Ritual',
        'description': 'Join our monthly full moon gathering to release what no longer serves you and set powerful intentions. Includes guided meditation, fire ceremony, and group sharing.',
        'image': 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=600',
        'date': now + timedelta(days=14, hours=20),
        'duration_minutes': 90,
        'max_participants': 30,
        'price': 20.00,
    },
]

for s_data in sessions_data:
    Session.objects.get_or_create(
        title=s_data['title'],
        creator=creator,
        defaults=s_data,
    )

# Create bookings
all_sessions = Session.objects.all()[:3]
for s in all_sessions:
    Booking.objects.get_or_create(
        user=user,
        session=s,
        defaults={'status': 'confirmed'},
    )

print(f'Created {User.objects.count()} users')
print(f'Created {Session.objects.count()} sessions')
print(f'Created {Booking.objects.count()} bookings')
print('Done! Visit http://localhost to see the catalog.')
"
```