# IQAC Management System (Frontend Portal)

A production-grade, comprehensive frontend application for a college **Internal Quality Assurance Cell (IQAC)** and institutional ERP management system. Built with React 19, Vite, Tailwind CSS v4, React Router DOM, Lucide Icons, and Recharts.

---

## 🚀 Quick Start Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)

### Option 1: 1-Click Launch (Windows)
Double-click `start-project.bat` in the root folder, or run:
```cmd
start-project.bat
```

### Option 2: Manual Terminal Commands
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install all dependencies (if not already installed)
npm install

# 3. Start the local development server
npm run dev
```

Open your browser and visit: **`http://localhost:5173`** (or `http://127.0.0.1:5173`)

---

## 👥 Demo Logins & Role Accounts

The application includes a **1-Click Demo Login bar** on both the **Login page** and the **Top Navigation Bar** inside the dashboard. You can switch between any role instantly:

| Role | Name | Department / Portfolio | Key Permissions & Features |
|---|---|---|---|
| **Staff / Faculty** | Dr. Rajesh Kumar | CSE | Data Entry, Publication Submissions, Grants, FDP, Profile Completion |
| **HOD** | Dr. Ramesh Sharma | CSE | Department Approvals Queue (Approve / Reject / Correction), Faculty Roster |
| **Dean (Academics)** | Dr. Anita Desai | Academic Affairs | Student Enrollment, Pass %, Syllabus Progress, Cross-Dept Matrix |
| **Dean (Research)** | Dr. S. Mukherjee | Research & Innovation | ₹7.85 Cr Grants Pool, SCI/Scopus Trends, Patents, H-Index |
| **Dean (Placement)** | Dr. R. Ramanujan | Career & Placement | 89.4% Placement rate, ₹44 LPA Highest Package, Recruiter stats |
| **IQAC Member** | Prof. Priya Nair | Quality Assurance | Internal AAA Audits, Data Verification, Criterion Evidence review |
| **IQAC Head** | Dr. M. S. Swaminathan | Quality Coordinator | 7 NAAC Criteria Attainment Grid, Quality Initiatives Tracker, AQAR |
| **Director (Admin)** | Dr. Homi J. Bhabha | Executive Directorate | NIRF Forecast, Lock Academic Year (`FREEZE_ACADEMIC_YEAR`), Statutory Sign & Dispatch, Manage IQAC Head (`MANAGE_IQAC_HEAD`) |

> **Default Demo Password:** `password123` (or simply use the 1-click buttons).

---

## 🏛️ Key Features & Modules

### 1. Multi-Role Institutional Dashboards
- **Staff Dashboard**: Profile completion progress, quick submission cards, recent publications, and activity timeline.
- **HOD Dashboard**: Department KPI summary, actionable Approvals Queue with evidence preview modals.
- **Dean Dashboard**: Dynamically adapts for Academic, Research, and Placement portfolios with Recharts visualizations.
- **IQAC Dashboard**: NAAC 7 Criteria Assessment & Readiness Grid, Internal AAA Audits schedule, and Quality Initiatives progress tracker.
- **Director Executive Portal**: Institutional benchmarking, NIRF forecast, and special statutory governance controls.

### 2. Research Publications Module (`/publications`)
- Filter by Indexing (SCI, Scopus, UGC-CARE), Status, and Academic Year.
- Add Publication form with React Hook Form, DOI integration, and evidence file attachment.
- Draft vs. Submit for HOD Verification workflow.
- Evidence document viewer modal and CSV export.

### 3. Sponsored Research & Grants (`/research`)
- Project proposals, sanctioned grants, funding agency breakdown (DST, SERB, AICTE, Industry).
- Official sanction order attachment and verification workflow.

### 4. Faculty Development Programs (`/fdp`)
- Log AICTE ATAL, NPTEL, Short-Term Training Programs (STTP), and Industrial Workshops.
- Certificate upload and verification status.

### 5. Student & Faculty Achievements (`/achievements`)
- Track Hackathons (e.g. Smart India Hackathon), Fellowship awards, and professional recognitions.

### 6. Academic Teaching Records (`/academic`)
- Course outcome attainment, pass percentage, student feedback ratings (out of 5.0), and course file status.

### 7. HOD Department Administration (`/hod/approvals`, `/hod/faculty`)
- Full approval queue with tabs (All, Publication, Research, FDP, Achievement).
- Actions: **Approve**, **Reject** (with reason), and **Request Correction**.
- Faculty roster with detailed portfolio drawer and account suspend/activate controls.

### 8. IQAC Quality & Audits (`/iqac/initiatives`, `/iqac/audits`, `/iqac/accreditation`)
- Quality Enhancement Initiatives with milestone progress step updates.
- Internal Academic & Administrative Audits (AAA) scheduler and observation tracker.
- NAAC 7 Criteria breakdown with qualitative/quantitative metric compliance & evidence locker.

### 9. Central Document Repository (`/documents`)
- Institutional proof files, SSR documents, and meeting minutes.
- Upload, preview, and simulated download support.

### 10. Statutory Report Generator (`/reports/generate`, `/reports/view/:id`)
- Pre-configured statutory templates:
  - **AQAR Master Dossier (NAAC)**
  - **NAAC Criterion 3 Research Dossier**
  - **NIRF Engineering Data Tables**
  - **Department Annual Performance Review**
  - **Faculty PBAS / Self Appraisal Summary**
- Printable Institutional Report with official letterhead, criteria tables, and signature blocks.

### 11. Global Productivity Tools
- **Global Search Modal (`Ctrl + K`)**: Instant cross-module search across publications, faculty, documents, and audits.
- **Academic Year Global Switcher**: Persistent across all pages.
- **In-App Notifications**: Real-time approval alerts and activity tracking.

---

## 🛠️ Project Structure

```
IQAC-Project/
├── start-project.bat          # Windows 1-click startup script
├── start-project.sh           # Linux/Mac startup script
├── README.md                  # Master documentation
└── frontend/
    ├── package.json           # Dependencies and build scripts
    ├── vite.config.js         # Vite configuration
    ├── index.html             # HTML entry point with fonts & metadata
    └── src/
        ├── config/            # Roles, RBAC permissions, navigation, academic years
        ├── context/           # AuthContext (session, roles) & ToastContext (notifications)
        ├── data/              # Initial mock seed data (persisted to localStorage)
        ├── services/          # Decoupled mock API service layer
        ├── hooks/             # Custom hooks (useAuth, usePermissions, useSearch, etc.)
        ├── components/        # Reusable UI components
        │   ├── common/        # Buttons, Badges, Loaders, Avatars, Timelines
        │   ├── forms/         # Input, Select, Textarea, FileInput, Checkbox
        │   ├── tables/        # DataTable with sorting, search & pagination
        │   ├── layout/        # Sidebar, TopNavbar, PageContainer, Card
        │   ├── overlay/       # Modal, ConfirmModal, Drawer
        │   ├── dashboard/     # StatCard, ChartCard, QuickActionCard
        │   ├── charts/        # Recharts widgets (Bar, Line, Area, Pie)
        │   ├── approval/      # ApprovalActionModal, EvidenceViewerModal
        │   ├── documents/     # DocumentCard, DocumentUploadModal
        │   └── notifications/ # NotificationDropdown
        ├── layouts/           # AppLayout master container
        ├── pages/             # Route-level page components
        │   ├── auth/          # Login, Register, ForgotPassword
        │   ├── dashboards/    # Staff, HOD, Dean, IQAC, Director Dashboards
        │   ├── publications/  # PublicationList, AddPublication, PublicationDetails
        │   ├── research/      # ResearchList, AddResearch
        │   ├── fdp/           # FdpList, AddFdp
        │   ├── achievements/  # AchievementList, AddAchievement
        │   ├── academic/      # AcademicRecordList, AddAcademicRecord
        │   ├── hod/           # DepartmentApprovals, FacultyManagement
        │   ├── iqac/          # QualityInitiatives, InternalAudits, AccreditationCriteria
        │   ├── documents/     # DocumentRepository
        │   ├── reports/       # ReportGenerator, ReportViewer
        │   ├── notifications/ # NotificationsList
        │   ├── profile/       # UserProfile, Settings
        │   └── common/        # NotFound, Unauthorized, GlobalSearchModal
        └── routes/            # AppRouter, ProtectedRoute, RoleRoute
```

---

## ⚙️ Future Backend Connection
The architecture strictly decouples UI components from storage via the `src/services/` layer. To connect a live backend (Node.js, Express, Spring, or Django):
1. Replace simulated calls in `src/services/api.js` with standard Axios HTTP requests (`axios.get`, `axios.post`, etc.).
2. The UI components and pages require zero refactoring.
