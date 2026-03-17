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
git clone <your-repo-url>
cd assignment