# CodeVault

CodeVault is a full-stack application for saving, organizing, editing, and reusing code snippets. It combines a responsive React dashboard with a protected Express API, MongoDB persistence, cookie-based authentication, Google OAuth, and a code editor with syntax highlighting.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| State | Zustand |
| Code editor | CodeMirror |
| UI | Lucide React, Framer Motion |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT cookies, bcryptjs, Passport.js, Google OAuth 2.0 |
| Email | Resend |
| Security | Helmet, CORS, Express Rate Limit |


## Getting Started

### Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas database
- Google OAuth credentials for Google sign-in
- Resend API key for email features

### 1. Clone the repository

git clone https://github.com/Mihre31/Codevault.git
cd Codevault/codevault

### 2. Install frontend dependencies


npm install


### 3. Install backend dependencies


cd backend
npm install

