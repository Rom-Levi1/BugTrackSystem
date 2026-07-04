# BugTrack Dashboard Guide

The BugTrack dashboard is a React application used by developers to manage projects and inspect incoming reports.

---

## Dashboard purpose

The dashboard gives developers a central place to:

- Register and log in
- Create Android projects
- View project API keys
- Copy SDK integration snippets
- View bug/crash reports
- Filter reports
- Search reports
- Sort reports
- Inspect report details
- Update report status
- Delete projects

---

## Authentication

The dashboard uses email/password login.

After login, the backend returns a JWT token.

The dashboard stores the token in local storage and sends it with protected API requests:

```text
Authorization: Bearer <token>
```

---

## Project Manager

The Project Manager card allows the user to:

- Select a project
- Create a new project
- Delete a selected project

Each project has:

```text
project_id
api_key
created_at
```

The project ID and API key are needed by the Android SDK.

---

## SDK Credentials card

This card displays:

```text
Project ID
API Key
```

The user can copy both values.

These values are used in the Android app:

```kotlin
BugTrack.init(
    application = application,
    projectId = "project_xxxxxxxx",
    apiKey = "bt_xxxxxxxxxxxxxxxxxxxxxxxxx"
)
```

---

## SDK Integration card

This card shows a ready-to-copy Kotlin integration snippet.

The goal is to make integration easier for the developer.

---

## Summary cards

The dashboard displays summary statistics for the selected project.

Examples:

```text
Total Reports
Open Reports
Fixed Reports
Ignored Reports
High Severity Reports
Crash Reports
```

These values come from:

```text
GET /api/summary?project_id=<project_id>
```

---

## Filters and search

The dashboard can filter reports by:

```text
Status
Severity
Type
```

It also supports searching by:

```text
title
message
description
screen name
device model
user ID
```

Sorting options:

```text
Newest first
Oldest first
Most occurrences
```

---

## Reports table

The reports table shows incoming bug and crash reports.

Main columns:

```text
Title
Type
Severity
Status
Screen
Occurrences
Last Seen
```

Clicking a report opens the details panel.

---

## Report details panel

The details panel shows deeper context about a selected report:

```text
Message
Description
Status controls
Device model
Android version
App version
User ID
Screen name
Created time
Last seen time
Occurrence count
Breadcrumbs
Stack trace
Fingerprint
```

---

## Status controls

A report can be marked as:

```text
Open
Fixed
Ignored
```

When the status is changed, the dashboard sends:

```text
PATCH /api/reports/{report_id}/status
```

---

## Refresh

The dashboard has a refresh button.

It reloads:

```text
summary data
report list
last updated timestamp
```

---

## Delete project

The dashboard supports deleting a project.

When a project is deleted:

1. The dashboard asks for confirmation.
2. The backend deletes the project.
3. The backend deletes all reports belonging to that project.
4. The dashboard reloads the remaining projects.

---

## Design goal

The dashboard is designed to feel like a real developer console:

- Dark UI
- Clear cards
- Project-based workflow
- Searchable issue feed
- Report triage controls
- Copyable SDK setup information
