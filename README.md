# Event RSVP Demo

Minimal full-stack event RSVP application built to explore MongoDB document modeling, indexing, and atomic updates.

**Live Demo**  
Frontend: https://event-rsvp-demo.vercel.app  
Backend: https://event-rsvp-demo.onrender.com

---

## Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Deployed on Vercel

### Backend

- Node.js
- Express
- MongoDB Node Driver
- Deployed on Render

### Database

- MongoDB Atlas (M0 free tier)

---

## Features

- Create events
- Fetch recent events (sorted by date)
- Fetch event by ID
- RSVP to events
- Embedded RSVP storage
- Indexed queries
- Production deployment with environment configuration

---

## API Endpoints

### Create Event

POST `/events`

Example request body:

    {
      "title": "Launch Party",
      "date": "2026-02-13"
    }

---

### Get Recent Events

GET `/events`

Returns events sorted by `date` (ascending).

---

### Get Event by ID

GET `/events/:id`

---

### Add RSVP

POST `/events/:id/rsvp`

Example request body:

    {
      "name": "Eddie",
      "status": "yes"
    }

Uses MongoDB `$push` for atomic updates.

---

## Data Model

    Event {
      _id: ObjectId,
      title: String,
      date: String (ISO 8601 format),
      rsvps: [
        {
          name: String,
          status: "yes" | "no" | "maybe",
          createdAt: Date
        }
      ],
      createdAt: Date
    }

---

## Data Modeling Decisions

### Embedded RSVPs

RSVPs are embedded within the Event document because:

- They are always read together with the event.
- It avoids joins.
- It enables atomic updates using `$push`.
- It keeps the data model simple.

If RSVP volume grew large (for example, thousands per event), RSVPs would likely be moved to a separate collection to avoid large document growth and document rewrite costs.

---

## Indexing Strategy

The following indexes are ensured at application startup:

    { createdAt: -1 }
    { date: 1 }

- `createdAt` supports recent-event queries.
- `date` supports chronological sorting.

Indexes are created using `createIndexes()` during server initialization.

---

## Deployment Architecture

Frontend (Vercel)  
→ calls  
Backend (Render)  
→ connects to  
MongoDB Atlas

CORS is configured via environment variables to restrict frontend origin.

Environment variables are managed securely and not committed to the repository.

---

## Local Development

### Backend

    cd backend
    npm install
    npm run dev

### Frontend

    cd frontend
    npm install
    npm run dev

Create `.env` files in each project based on `.env.example`.

---

## Future Improvements

- Convert `date` field to BSON Date for richer range queries.
- Add pagination for event list.
- Prevent duplicate RSVPs via `$addToSet`.
- Add date range filtering endpoint.
- Add basic authentication.
