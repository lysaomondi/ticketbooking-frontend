#Event Ticket Booking System — Frontend

React + Tailwind frontend for browsing events and booking tickets, talking to a Django REST API backend.

Live site: https://ticketbooking-frontend.vercel.app 
Backend API: https://ticketbooking-backend-wvo2.onrender.com

#Tech Stack
Framework: React (Vite)
Styling: Tailwind CSS
Routing: React Router
HTTP client: Axios (with JWT-aware interceptors)
Containerization: Docker
CI: GitHub Actions
Deployment: Vercel

#Features
Browse upcoming events (homepage highlights + full searchable/filterable Browse Events page)
Event detail page 
JWT-based signup/login
Organizer flow: create events with one or more ticket types
Customer flow: book tickets, view booking history and status
Embedded venue map on event detail pages

3Docker
bash
docker build -t ticketbooking-frontend .
docker run -p 5173:5173 ticketbooking-frontend

Or run alongside the backend via the backend repo's docker-compose.yml (requires both repos cloned as sibling folders).
