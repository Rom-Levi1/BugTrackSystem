# BugTrack API Reference

Base URL for local development:

```text
http://localhost:8000
```

Interactive Swagger documentation is available while the backend is running:

```text
http://localhost:8000/docs
```

---

## Authentication methods

BugTrack uses two authentication mechanisms.

| Mechanism | Used by | Header |
|---|---|---|
| JWT bearer token | Dashboard users and project management | `Authorization: Bearer <token>` |
| Project API key | Android SDK report submission | `X-API-Key: <project api_key>` |

Dashboard users authenticate with email and password. After login, the backend returns a JWT token.

Android client apps do not use the dashboard user's JWT. Instead, each project has its own generated API key.

---

## Auth endpoints

### `POST /api/auth/register`

Creates a new dashboard user.

#### Request body

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

#### Response `200`

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```

#### Possible errors

| Status | Meaning |
|---|---|
| `400` | Email is already registered |
| `422` | Invalid request body |

---

### `POST /api/auth/login`

Logs in an existing dashboard user.

This endpoint uses OAuth2 password form format, so the request is sent as:

```text
application/x-www-form-urlencoded
```

The `username` field is treated as the user's email.

#### Request body

```text
username=user@example.com&password=secret123
```

#### Response `200`

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```

#### Possible errors

| Status | Meaning |
|---|---|
| `401` | Invalid email or password |
| `422` | Missing username or password |

---

## Project endpoints

All project endpoints require:

```text
Authorization: Bearer <token>
```

---

### `POST /api/projects`

Creates a new project for the logged-in user.

Each project receives a unique project ID and API key.

#### Request body

```json
{
  "name": "My Android App"
}
```

#### Response `200`

```json
{
  "id": "project_1a2b3c4d",
  "name": "My Android App",
  "api_key": "bt_xxxxxxxxxxxxxxxxxxxxxxxxx",
  "created_at": "2026-07-05T12:00:00Z"
}
```

---

### `GET /api/projects`

Returns all projects owned by the logged-in user.

#### Response `200`

```json
[
  {
    "id": "project_1a2b3c4d",
    "name": "My Android App",
    "api_key": "bt_xxxxxxxxxxxxxxxxxxxxxxxxx",
    "created_at": "2026-07-05T12:00:00Z"
  }
]
```

---

### `DELETE /api/projects/{project_id}`

Deletes a project owned by the logged-in user.

All reports that belong to the deleted project are also deleted.

#### Response `200`

```json
{
  "message": "Project deleted successfully",
  "project_id": "project_1a2b3c4d"
}
```

#### Possible errors

| Status | Meaning |
|---|---|
| `401` | Missing or invalid JWT |
| `404` | Project not found or not owned by current user |

---

## Report endpoints

### `POST /api/reports`

Submits a crash or bug report.

This endpoint is used by the Android SDK.

It requires the project API key:

```text
X-API-Key: <project api_key>
```

The request body must include a `project_id` that matches the API key.

#### Request body

```json
{
  "project_id": "project_1a2b3c4d",
  "type": "crash",
  "title": "NullPointerException",
  "message": "Attempt to invoke virtual method on a null object reference",
  "description": "Optional longer description",
  "breadcrumbs": "MainActivity: User clicked Save | MainActivity: API call started",
  "stack_trace": "java.lang.NullPointerException...",
  "severity": "High",
  "status": "Open",
  "screen_name": "MainActivity",
  "android_version": "14",
  "device_model": "Google Pixel 7",
  "app_version": "1.0.0",
  "user_id": "optional-user-id",
  "fingerprint": "NullPointerException_MainActivity_42"
}
```

#### Required fields

```text
project_id
type
message
```

#### Defaults

```text
severity = Medium
status = Open
```

Severity is normalized to:

```text
Low | Medium | High
```

Status is normalized to:

```text
Open | Fixed | Ignored
```

#### Fingerprint grouping

If a report is submitted with the same:

```text
project_id + type + fingerprint
```

then the backend updates the existing report instead of creating a duplicate.

It increments:

```text
occurrence_count
```

and updates:

```text
last_seen_at
```

#### Response `200`

Returns the created or updated report.

---

### `GET /api/reports`

Returns reports.

The endpoint supports optional filters:

| Query parameter | Values |
|---|---|
| `project_id` | Project ID |
| `status` | `Open`, `Fixed`, `Ignored` |
| `severity` | `Low`, `Medium`, `High` |
| `type` | `crash`, `bug` |

Example:

```text
GET /api/reports?project_id=project_1a2b3c4d&status=Open&type=crash
```

---

### `GET /api/reports/{report_id}`

Returns a single report by ID.

#### Possible errors

| Status | Meaning |
|---|---|
| `404` | Report not found |

---

### `PATCH /api/reports/{report_id}/status`

Updates a report status.

#### Request body

```json
{
  "status": "Fixed"
}
```

Allowed statuses:

```text
Open
Fixed
Ignored
```

#### Response `200`

Returns the updated report.

---

### `DELETE /api/reports/{report_id}`

Deletes a report.

This endpoint is mainly useful for development and testing.

#### Response `200`

```json
{
  "message": "Report deleted successfully",
  "report_id": "report_a1b2c3d4"
}
```

---

## Report response shape

```json
{
  "id": "report_a1b2c3d4",
  "project_id": "project_1a2b3c4d",
  "type": "crash",
  "title": "NullPointerException",
  "message": "Attempt to invoke virtual method on a null object reference",
  "description": "Optional longer description",
  "breadcrumbs": "MainActivity: User clicked Save",
  "stack_trace": "java.lang.NullPointerException...",
  "severity": "High",
  "status": "Open",
  "screen_name": "MainActivity",
  "android_version": "14",
  "device_model": "Google Pixel 7",
  "app_version": "1.0.0",
  "user_id": "optional-user-id",
  "fingerprint": "NullPointerException_MainActivity_42",
  "occurrence_count": 3,
  "created_at": "2026-07-05T12:00:00Z",
  "last_seen_at": "2026-07-05T13:00:00Z"
}
```

---

## Summary endpoint

### `GET /api/summary`

Returns aggregate report counts for the dashboard.

Optional query parameter:

| Query parameter | Meaning |
|---|---|
| `project_id` | Scope summary to one project |

Example:

```text
GET /api/summary?project_id=project_1a2b3c4d
```

#### Response `200`

```json
{
  "total_reports": 5,
  "open_reports": 4,
  "fixed_reports": 1,
  "ignored_reports": 0,
  "high_severity_reports": 2,
  "crash_reports": 3,
  "bug_reports": 2
}
```

---

## Common error responses

FastAPI error responses usually follow this shape:

```json
{
  "detail": "Human-readable error message"
}
```

Common status codes:

| Status | Meaning |
|---|---|
| `400` | Invalid status, severity, or duplicate email |
| `401` | Missing or invalid JWT/API key |
| `404` | Project or report not found |
| `422` | Invalid request body |
