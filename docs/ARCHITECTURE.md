# BugTrack Architecture

BugTrack is built as a client-server monitoring platform for Android applications.

The system has four main parts:

```text
Android App + BugTrack SDK
        ↓
FastAPI Backend
        ↓
SQLite Database
        ↓
React Dashboard
```

---

## Main components

### 1. Android BugTrack SDK

The Android SDK is written in Kotlin and is embedded inside the test Android app.

Its job is to collect and send reports to the backend.

Main responsibilities:

- Initialize with project ID and API key
- Capture unhandled crashes
- Capture caught exceptions
- Send manual bug reports
- Collect device and app metadata
- Track current screen
- Store breadcrumbs
- Save failed reports locally
- Retry failed reports later

---

### 2. FastAPI backend

The backend is written in Python using FastAPI.

Main responsibilities:

- User registration and login
- JWT authentication for dashboard users
- Project creation and deletion
- API key generation per project
- API key validation for SDK reports
- Report storage
- Crash grouping using fingerprints
- Report filtering
- Report status updates
- Report deletion
- Summary statistics for the dashboard

---

### 3. SQLite database

The backend uses SQLite through SQLAlchemy.

Main entities:

```text
User
Project
Report
```

### User

Represents a dashboard user.

Important fields:

```text
id
email
password_hash
created_at
```

### Project

Represents an Android app connected to BugTrack.

Important fields:

```text
id
user_id
name
api_key
created_at
```

A user can have multiple projects. Each project has one unique API key.

### Report

Represents a crash or manual bug report.

Important fields:

```text
id
project_id
type
title
message
description
breadcrumbs
stack_trace
severity
status
screen_name
android_version
device_model
app_version
user_id
fingerprint
occurrence_count
created_at
last_seen_at
```

---

## Data flow: creating a project

```text
Dashboard user logs in
        ↓
Dashboard sends JWT to backend
        ↓
User creates a new project
        ↓
Backend generates project_id and api_key
        ↓
Dashboard displays SDK integration snippet
        ↓
Developer copies project_id and api_key into Android app
```

---

## Data flow: submitting a report

```text
Android app detects bug/crash
        ↓
BugTrack SDK builds report object
        ↓
SDK sends POST /api/reports
        ↓
SDK includes X-API-Key header
        ↓
Backend validates project_id + API key
        ↓
Backend stores report or updates existing fingerprint group
        ↓
Dashboard displays the report
```

---

## Data flow: offline report queue

```text
SDK tries to send report
        ↓
Network/backend unavailable
        ↓
Report is saved in local SharedPreferences queue
        ↓
App starts again or retry is called
        ↓
SDK sends queued reports
        ↓
Successful reports are removed from queue
```

---

## Crash grouping design

BugTrack prevents duplicate crash rows by using a fingerprint.

If two reports have the same:

```text
project_id + type + fingerprint
```

then the backend treats them as the same issue.

Instead of inserting a new row, it updates:

```text
occurrence_count += 1
last_seen_at = current time
```

This makes the dashboard easier to read because repeated crashes are grouped.

---

## Authentication design

BugTrack uses two separate security mechanisms.

### Dashboard authentication

Dashboard users authenticate with email and password.

After login, the backend returns a JWT token.

The dashboard sends this token in:

```text
Authorization: Bearer <token>
```

This is used for project management endpoints.

### SDK authentication

The Android SDK does not use user login.

Instead, each project has an API key.

The SDK sends:

```text
X-API-Key: <project api_key>
```

The backend checks that the API key belongs to the project ID in the report.

---

## Why this architecture was chosen

This architecture separates responsibilities clearly:

- The Android SDK only collects and sends reports.
- The backend handles validation, storage, grouping, and business logic.
- The database stores persistent data.
- The dashboard focuses on visualization and project/report management.

This separation makes the system easier to maintain, explain, and extend.
