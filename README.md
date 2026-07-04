# BugTrack System

BugTrack is a lightweight crash and bug reporting platform for Android applications.

The system allows Android apps to send automatic crash reports and manual bug reports to a FastAPI backend using a per-project API key. Developers can then review, filter, search, and manage those reports through a React dashboard.

## Demo video

Demo video: `VIDEO_LINK_WILL_BE_ADDED_HERE`

> Note: The demo video link should be added before final submission.

---

## Main features

- Android Kotlin SDK for reporting crashes and bugs
- Automatic crash capture using a global uncaught exception handler
- Manual bug reports from the client app
- Optional report dialog for user-submitted reports
- Breadcrumb tracking for recent user actions
- Device and app context collection:
  - Android version
  - Device model
  - App version
  - Current screen
  - User ID
- Offline queue for failed reports
- Retry mechanism for reports that failed to send
- Fingerprint-based crash grouping
- Occurrence count for repeated crashes
- FastAPI backend with SQLite database
- Dashboard authentication using JWT
- Multiple projects per dashboard user
- Unique API key per project
- React dashboard for:
  - Project management
  - API key display
  - SDK integration snippet
  - Summary statistics
  - Report filtering
  - Report search
  - Report sorting
  - Report details
  - Stack traces
  - Breadcrumbs
  - Status updates
  - Project deletion

---

## Project structure

```text
BugTrackSystem/
├── bugtrack-backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── requirements.txt
│   └── bugtrack.db              # ignored by git
│
├── bugtrack-dashboard/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
│
├── BugTrackTestApp/
│   └── Android test app containing the BugTrack Kotlin SDK files
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── SDK_USAGE.md
│   ├── DASHBOARD.md
│   └── DEMO_SCRIPT.md
│
└── README.md