## NeoConnect - Staff Feedback & Complaint Platform

NeoConnect is an internal platform for staff to submit complaints/feedback, track case resolutions, participate in polls, and access public transparency information.

### Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Auth**: JWT (stored in `localStorage`)

### Project Structure

- `server/` - Express API (auth, cases, polls, analytics, minutes, digests, users)
- `client/` - Next.js frontend (dashboards, forms, charts)

### Getting Started

1. **Clone / open the project directory**

2. **Configure environment**

   - Copy `.env.example` to `.env` in the **root** and adjust values as needed.
   - For the client, Next.js will read `NEXT_PUBLIC_API_BASE` from the same `.env` during dev.

3. **Start MongoDB**

   - Ensure a local MongoDB instance is running on `mongodb://localhost:27017`.

4. **Install dependencies**

   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

5. **Run in development**

   In two terminals:

   ```bash
   # Terminal 1 - backend
   cd server
   npm run dev

   # Terminal 2 - frontend
   cd client
   npm run dev
   ```

   - API: `http://localhost:4000/api`
   - Frontend: `http://localhost:3000`

### Core Features

- **Staff**
  - Submit complaints/feedback (with optional anonymous flag and file upload).
  - View submitted cases.
  - Vote in polls.
  - Access the public hub (Quarterly Digest, Impact Tracking, Minutes Archive).

- **Secretariat / Management**
  - View and filter all cases.
  - Assign cases to Case Managers.
  - Create polls.
  - Upload meeting minutes (PDF).
  - View analytics (cases by department, category, status + hotspot detection).

- **Case Manager**
  - View assigned cases.
  - Update case status and add notes.

- **Admin**
  - Manage users, roles, and departments.

### Escalation & Analytics

- A daily cron job (08:00) checks cases in `Assigned`, `In Progress`, or `Pending`:
  - If no response for **7 working days** (weekends skipped), status is set to `Escalated` and management is notified (logged server-side).
- Analytics endpoint aggregates:
  - Cases by department, category, status.
  - Hotspots when a `(department, category)` pair has **≥ 5** cases.

### File Uploads

- `multer` stores files in `server/uploads`.
- Allowed types: **jpg, png, pdf**.
- Max size: **5 MB**.

