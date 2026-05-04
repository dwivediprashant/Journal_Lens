# Journal Lens

Journal Lens is an AI-powered research discovery platform built to simplify how users explore academic journals, papers, and authors in one place. It brings together structured research browsing, secure access, and contextual AI assistance to reduce the friction of finding relevant scholarly content.

Designed for an academic workflow, the platform helps students, researchers, and faculty move from broad journal discovery to detailed paper exploration through a clean and guided interface.

## Live Demo

https://journal-lens.vercel.app/

## Features

- Browse journals and open-access research papers in a structured UI.
- View journal detail pages, paper details, and deeper paper metadata through protected routes.
- Explore author-related research information through the backend API.
- Use the integrated AI chatbot for contextual research help.
- Sign in with Clerk-based authentication for protected content.
- Load and manage data with React Query for smoother client-side fetching.
- Track production usage with Vercel Analytics.
- Use a clean, responsive interface built around the project's blue visual theme.

## Frontend Tech Stack

| Technology           | Purpose                                              | Icon                                                                                                                      |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| React 19             | Component-based user interface                       | <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" height="28" />                         |
| Vite                 | Fast development server and production build tooling | <img src="https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite&logoColor=white" height="28" />                   |
| React Router         | Client-side routing                                  | <img src="https://img.shields.io/badge/React_Router-Routing-CA4245?logo=reactrouter&logoColor=white" height="28" />       |
| TanStack React Query | Server-state management and caching                  | <img src="https://img.shields.io/badge/TanStack_Query-Server_State-FF4154?logo=reactquery&logoColor=white" height="28" /> |
| Clerk React          | Authentication and user session handling             | <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white" height="28" />                       |
| Tailwind CSS         | Utility-first styling workflow                       | <img src="https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?logo=tailwindcss&logoColor=white" height="28" />       |
| Vercel Analytics     | Production analytics                                 | <img src="https://img.shields.io/badge/Vercel-Analytics-000000?logo=vercel&logoColor=white" height="28" />                |
| React Loader Spinner | Loading indicators                                   | <img src="https://img.shields.io/badge/Loader-Spinner-00BFFF?logo=react&logoColor=white" height="28" />                   |
| UUID                 | Unique ID generation where needed                    | <img src="https://img.shields.io/badge/UUID-Generator-000000?logo=uuid&logoColor=white" height="28" />                    |
| Axios                | API requests from the frontend                       | <img src="https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?logo=axios&logoColor=white" height="28" />                |

## Backend Tech Stack

| Technology    | Purpose                               | Icon                                                                                                              |
| ------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Node.js       | Runtime environment                   | <img src="https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&logoColor=white" height="28" />        |
| Express.js    | REST API server                       | <img src="https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white" height="28" />         |
| Clerk Express | Backend authentication middleware     | <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white" height="28" />               |
| OpenAlex API  | Research paper and author data source | <img src="https://img.shields.io/badge/OpenAlex-API-0055FF?logo=databricks&logoColor=white" height="28" />        |
| Groq SDK      | AI chat and generative responses      | <img src="https://img.shields.io/badge/Groq-AI-FF4F00?logo=groq&logoColor=white" height="28" />                   |
| Axios         | External API requests                 | <img src="https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?logo=axios&logoColor=white" height="28" />        |
| CORS          | Cross-origin request handling         | <img src="https://img.shields.io/badge/CORS-Enabled-003366?logo=cloudflare&logoColor=white" height="28" />        |
| dotenv        | Environment variable management       | <img src="https://img.shields.io/badge/dotenv-Env_Config-ECD53F?logo=dotenv&logoColor=black" height="28" />       |
| pdf-parse     | PDF text extraction support           | <img src="https://img.shields.io/badge/PDF-Parsing-FF0000?logo=adobeacrobatreader&logoColor=white" height="28" /> |
| node-fetch    | Fetch support inside backend flows    | <img src="https://img.shields.io/badge/node--fetch-Fetch_API-339933?logo=node.js&logoColor=white" height="28" />  |

## Project Structure

```md
Journal-Lens/
├─ README.md
├─ backend/
│ ├─ index.js
│ ├─ package.json
│ ├─ configs/
│ │ └─ corsOptions.js
│ ├─ middlewares/
│ │ └─ requireAuth.js
│ └─ routes/
│ ├─ author.js
│ ├─ chat.js
│ └─ researchpapers.js
└─ frontend/
├─ index.html
├─ package.json
├─ vite.config.js
├─ eslint.config.js
├─ public/
│ └─ media/
│ ├─ banners/
│ ├─ fields/
│ └─ publishers/
└─ src/
├─ App.jsx
├─ App.css
├─ main.jsx
├─ Contexts/
├─ configs/
└─ components/
├─ auth/
├─ ChatBot/
├─ Footer/
├─ Hero/
├─ Navbar/
├─ loaders/
├─ pages/
│ ├─ Custom_journals/
│ ├─ Detail/
│ ├─ journals/
│ └─ More_detail/
├─ publishers-card/
├─ researchCard/
└─ utils/
```

## Local Setup

### 1. Prerequisites

- Node.js 18+ recommended
- npm installed
- Clerk, Groq, and OpenAlex API credentials

### 2. Clone the repository

```bash
git clone <your-repo-url>
cd Internship_project_IDEA_LAB
```

### 3. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the required variables:

```env
PORT=8080
OPENALEX_API_KEY=your_openalex_api_key
OPENALEX_BASE_URL=https://api.openalex.org
FRONTEND_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/` with the required variables:

```env
VITE_BACKEND_BASE_URL=http://localhost:8080/api
VITE_LOGO_DEV_PUBLIC_KEY=your_logo_dev_public_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 5. Run the application locally

Start the backend in one terminal:

```bash
cd backend
npm start
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

## NOTE

Journal Lens is an AICTE IDEA Lab internship project built for the LNCT campus. It is designed to make academic research discovery easier by bringing journals, open-access papers, author details, and AI-assisted guidance into a single research-focused platform.

The project aims to support students, faculty, and researchers with a cleaner way to explore academic content, filter relevant material, and move from journal-level discovery to paper-level detail without unnecessary friction.
