# BugTrack Demo Script

This document describes the recommended demo video flow.

The demo video link should be added to the main `README.md` before submission.

---

## Recommended length

```text
3-5 minutes
```

---

## Demo preparation

Before recording:

1. Start the backend.
2. Start the frontend.
3. Open the Android test app.
4. Make sure the backend database has either test data or the app can generate reports live.
5. Open the dashboard at `http://localhost:5173`.
6. Open Swagger at `http://localhost:8000/docs` only if needed.

---

## Commands to run

### Backend

```bash
cd bugtrack-backend
source venv/Scripts/activate
python -m uvicorn main:app --reload
```

### Frontend

```bash
cd bugtrack-dashboard
npm run dev
```

---

## Demo flow

### 1. Introduce the system

Explain:

```text
BugTrack is a lightweight Android crash and bug reporting system.
It includes an Android SDK, FastAPI backend, SQLite database, and React dashboard.
```

---

### 2. Show login/register

Open:

```text
http://localhost:5173
```

Show:

- Login page
- Register option
- Successful login

Explain that dashboard users authenticate with JWT.

---

### 3. Create a project

In the dashboard:

1. Click `New Project`.
2. Create a project, for example:

```text
Demo Android App
```

Show that the dashboard generates:

```text
project_id
api_key
```

---

### 4. Show SDK integration snippet

Show the Kotlin snippet:

```kotlin
BugTrack.init(
    application = application,
    projectId = "project_xxxxxxxx",
    apiKey = "bt_xxxxxxxxxxxxxxxxxxxxxxxxx"
)
```

Explain that each project has its own API key.

---

### 5. Show Android SDK usage

Open the Android project and show the SDK initialization.

Mention SDK capabilities:

```text
automatic crash capture
manual reports
caught exceptions
breadcrumbs
offline queue
device metadata
```

---

### 6. Send a manual bug report

From the Android app, trigger a manual bug report.

Then return to the dashboard and click refresh.

Show the report in the table.

---

### 7. Send a caught exception

Trigger a caught exception report from the Android app.

Show that it appears in the dashboard as a crash report.

---

### 8. Trigger an unhandled crash

Trigger an unhandled crash.

Explain that the SDK uses:

```kotlin
Thread.setDefaultUncaughtExceptionHandler
```

Then reopen the app if needed and show the report in the dashboard.

---

### 9. Show report details

Click a report in the dashboard.

Show:

```text
status
severity
type
message
device model
Android version
app version
screen name
breadcrumbs
stack trace
fingerprint
occurrence count
```

---

### 10. Show filtering/search/sorting

Demonstrate:

```text
Filter by status
Filter by severity
Filter by type
Search reports
Sort by newest / oldest / occurrence count
```

---

### 11. Update report status

Change a report status to:

```text
Fixed
```

Show that the summary cards update.

---

### 12. Show project deletion

Create a temporary project, then delete it.

Explain that deleting a project also deletes its reports.

---

## Closing explanation

End with:

```text
BugTrack helps Android developers collect, group, and manage crashes and bug reports from multiple projects through a simple SDK and dashboard.
```
