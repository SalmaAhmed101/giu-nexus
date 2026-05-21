# GIU Nexus — AI-Powered Career & Talent Platform

## Team Members
- [Member 1] (Team Leader) Salma Ahmed 16007446 T18
- [Member 2] Lojy Shawky 16009778 T19
- [Member 3] Nourine Rasmy 16006612 T17
- [Member 4] Engy Rashdan 16007284 T15
- [Member 5] Malak Tarek 16006062 T17

A full-stack MERN web application that connects university students with internship
and job opportunities, powered by Hugging Face AI for skill extraction and job
classification.

**The problem it solves:**
- Students waste time browsing irrelevant job listings
- Recruiters manually tag jobs and miss good candidates
- No centralized platform exists for GIU-specific opportunities

**How it solves it:**
- AI reads a student's bio and extracts their skills automatically
- AI classifies every job post into the correct technical category on creation
- A recommendation engine ranks jobs by how well they match each student's skill set

---

## User Roles

There are three distinct user types, each with different permissions and views.

### Job Seeker (Standard User)
- Register and create a profile with bio and profile picture
- Receive AI-generated skill chips based on their written bio
- Browse all approved and open job listings
- Apply to jobs with an optional cover letter
- Track all applications and their current statuses
- View personalized job recommendations on the homepage

### Recruiter (Company Representative)
- Register and wait for admin approval before posting
- Create, edit, and delete their own job listings
- Have their job posts auto-classified by AI on creation
- View all applicants per job posting
- Update application statuses (pending → shortlisted or rejected)
- Access a dashboard showing all active postings and applicant counts

### System Admin
- Approve or reject newly registered recruiter accounts
- Remove flagged or inappropriate job listings
- View platform-wide analytics and summary statistics
- Full visibility over all users, jobs, and applications

---

## Features

### Task 1
- [ ] Git repository with branch-per-member workflow
- [ ] Pull Request based merging with peer review
- [ ] Mongoose schema design for Users, JobPosts, and Applications
- [ ] README and .gitignore

### Task 2
- [ ] Express server setup
- [ ] User authentication with JWT and bcrypt
- [ ] Role-based access control middleware
- [ ] CRUD operations for users, jobs, and applications
- [ ] Hugging Face NER integration for skill extraction
- [ ] Hugging Face zero-shot classification for job categories
- [ ] Sentence embedding model for job recommendations

### Task 3
- [ ] React project setup with routing
- [ ] Student registration, login, and profile pages
- [ ] Job listings browse and filter page
- [ ] Application submission and tracking UI
- [ ] Recruiter dashboard
- [ ] Admin panel
- [ ] AI result rendering (skill chips, recommended jobs)

---

## Milestones

### Task 1 — Schema Design 
- Set up GitHub repo with correct collaborators
- Each member creates own feature branch
- All three Mongoose schemas designed and merged via PRs
- README and .gitignore present

### Task 2 — Backend Development 
- Express server with full REST API
- JWT authentication and role-based access control
- All CRUD operations functional
- Hugging Face API integrated for all three AI features

### Task 3 — Frontend Development 
- React app with all user flows implemented
- Connected to backend API
- AI results rendered in the UI (skill chips, recommended jobs)

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React.js | User interface and routing |
| Backend | Node.js + Express.js | REST API and server logic |
| Database | MongoDB + Mongoose | Data storage and schema modeling |
| Authentication | JWT + bcrypt | Secure login and password hashing |
| AI / ML | Hugging Face Inference API | Skill extraction, job classification, recommendations |
| Version Control | Git + GitHub | Collaboration and code management |

---

## Project Structure

```text
server/
├── config/
│ └── db.js # MongoDB connection helper
├── models/
│ ├── User.js # User model
│ ├── JobPost.js # Job post model
│ └── Application.js # Application model
├── controllers/
│ ├── authController.js # Authentication logic
│ ├── userController.js # User management
│ ├── jobController.js # Job operations
│ ├── applicationController.js # Application handling
│ └── profileController.js # Profile management
├── routes/
│ ├── authRoutes.js # Authentication endpoints
│ ├── userRoutes.js # User endpoints
│ ├── jobRoutes.js # Job endpoints
│ ├── applicationRoutes.js # Application endpoints
│ └── profileRoutes.js # Profile endpoints
├── middleware/
│ ├── auth.js # Authentication & authorization
│ └── errorHandler.js # Error handling middleware
├── services/
│ ├── hfService.js # HuggingFace client singleton
│ └── emailService.js # Nodemailer helper
├── server.js # Main application entry point
├── .env # Environment variables
├── .env.example # Environment variables template
├── .gitignore # Git ignore rules
└── README.md
```
---

## Git Workflow

### Rules
- Never commit directly to `main`
- Every change goes through a Pull Request
- The team lead must review and approve every PR before merging into main
- Resolve all review comments before merging
- Write meaningful commit messages — not `"fix"` or `"update"`
- Continue using one feature branch per page or feature group (e.g. feature/job-detail-page, feature/saved-jobs)

---

## Contributors

[Member 1 Salma Ahmed](https://github.com/SalmaAhmed101/giu-nexus/commits?author=SalmaAhmed101)
[Member 2 Engy Rashdan](https://github.com/SalmaAhmed101/giu-nexus/commits?author=engymohamedtaher)
[Member 3 Logien Mohamed](https://github.com/SalmaAhmed101/giu-nexus/commits?author=logienshawky)
[Member 4 Malak tarek](https://github.com/SalmaAhmed101/giu-nexus/commits?author=malakelkomy)
[Member 5 Nourine Rasmy](https://github.com/SalmaAhmed101/giu-nexus/commits?author=nourinerasmy16006612)
