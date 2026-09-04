# ResumeAi (ResumeForge)
# make resume and apply job
An AI-powered resume builder and job application tracking platform. This application allows users to seamlessly build and manage their resumes, extract details from uploaded existing resumes, generate tailored professional content using Google Gemini AI, and track job applications.

## Features

- **User Authentication**: Secure signup, login, and authorization using JWT and bcrypt.
- **AI-Powered Resume Builder**: Create professional resumes with AI assistance (powered by Google Gemini) for drafting summaries, work experience bullet points, and skills.
- **Resume Parsing**: Upload existing resumes in PDF or DOCX formats, and have the details automatically parsed and populated into the builder.
- **Job Matching & Tracking**: Search and view job postings, and track applications directly from the platform.
- **Interactive Dashboards**: Dedicated dashboards for users and administrators to manage profiles, resumes, and system data.
- **Export to PDF**: Generate and download your beautifully formatted resume in a standard PDF format.

## Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **State Management**: Zustand
- **Forms**: React Hook Form, Zod (Validation)
- **PDF Generation**: `@react-pdf/renderer`, `html2pdf.js`
- **Icons**: Lucide React

### Backend (Server)
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose (Models: User, Resume, Job, Application)
- **AI Integration**: Google Generative AI (`@google/generative-ai`)
- **Authentication**: JSON Web Token (JWT)
- **File Handling**: Multer
- **Document Parsing**: `pdf-parse` (for PDF), `mammoth` (for DOCX)

## Project Structure

```text
ResumeAi/
├── client/           # Frontend React/Vite application
│   ├── public/
│   ├── src/
│   │   ├── pages/    # Routes (Builder, Dashboard, Jobs, Upload, Admin, etc.)
│   │   └── ...
│   └── package.json
├── server/           # Backend Express/Node application
│   ├── src/
│   │   ├── models/   # Mongoose schemas
│   │   ├── routes/   # Express API routes
│   │   └── index.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ResumeAi
   ```

2. **Setup Backend (Server)**
   ```bash
   cd server
   npm install
   ```
   
   Create a `.env` file in the `server` directory and add the following configuration variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Setup Frontend (Client)**
   ```bash
   cd ../client
   npm install
   ```

   *(Optional)* Create a `.env` file in the `client` directory if you need to override the default API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage
- Open your browser and navigate to the frontend URL (typically `http://localhost:5173`).
- **Register** a new account or **Log in**.
- Go to the **Builder** to create a resume from scratch, or to **Upload** to parse an existing one.
- Navigate to the **Dashboard** to manage all your saved resumes.
- Visit the **Jobs** section to look for opportunities and track your job applications.
