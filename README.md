# AI Realtime Chat

Full-stack AI-powered realtime chat application.

## Tech stack

- Frontend: Next.js
- Backend: Node.js + Express
- Socket.IO
- Google OAuth
- Gemini API
- Razorpay

## Features

1. Google OAuth login + show user profile
2. Single chat room (realtime with Socket.IO)
3. Gemini AI — Suggest reply and Summarize chat (after premium)
4. Razorpay payment (create order, checkout, verify) to unlock premium
5. Socket event after payment to update UI live

## Folder structure

```
backend/src/
  config/
  models/
  controllers/
  routes/
  middleware/
  services/
  socket/
frontend/src/
  app/
  components/
  store/
  lib/
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Runs on `http://localhost:5000`

Fill these in `backend/.env`:

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default `5000`) |
| `CLIENT_URL` | Frontend URL (`http://localhost:3000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `PREMIUM_AMOUNT_INR` | Premium price in INR (e.g. `49`) |

Google OAuth callback URL:

```
http://localhost:5000/api/auth/google/callback
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Runs on `http://localhost:3000`

Fill these in `frontend/.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL (`http://localhost:5000`) |
| `NEXT_PUBLIC_PREMIUM_AMOUNT_INR` | Premium price shown in UI (e.g. `49`) |

## Deploy

- Frontend → Vercel  
  Set `NEXT_PUBLIC_API_URL` to your backend URL
- Backend → Render (enable WebSockets)  
  Set `CLIENT_URL` to your frontend URL  
  Update Google OAuth callback to production backend URL
