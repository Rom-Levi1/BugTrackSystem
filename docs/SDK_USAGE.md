# BugTrack Android SDK Usage

This document explains how an Android developer uses the BugTrack Kotlin SDK.

---

## SDK purpose

The SDK allows Android apps to send crash reports and manual bug reports to the BugTrack backend.

It supports:

- Automatic crash reporting
- Manual bug reporting
- Caught exception reporting
- Breadcrumbs
- Device metadata collection
- Current screen tracking
- Offline queue
- Retry of failed reports

---

## Initialization

The developer first creates a project in the BugTrack dashboard.

The dashboard generates:

```text
project_id
api_key
```

Then the developer initializes BugTrack inside the Android app:

```kotlin
BugTrack.init(
    application = application,
    projectId = "project_xxxxxxxx",
    apiKey = "bt_xxxxxxxxxxxxxxxxxxxxxxxxx"
)
```

The SDK uses these values when sending reports.

---

## Automatic crash reporting

The SDK uses:

```kotlin
Thread.setDefaultUncaughtExceptionHandler(...)
```

This allows the SDK to catch unhandled crashes before the app process exits.

When a crash happens, the SDK:

1. Builds a crash report.
2. Saves it to the offline queue immediately.
3. Tries to send it to the backend.
4. If sending succeeds, it removes the report from the queue.
5. If sending fails, it keeps the report for retry.

---

## Manual bug report

A developer can manually send a bug report:

```kotlin
BugTrack.report(
    title = "Save button not working",
    message = "The save button does not respond",
    description = "User clicked save but no action happened",
    severity = "Medium"
)
```

This creates a report of type:

```text
bug
```

---

## Caught exception reporting

A developer can report exceptions that were caught with `try/catch`:

```kotlin
try {
    riskyFunction()
} catch (e: Exception) {
    BugTrack.captureException(
        exception = e,
        severity = "High"
    )
}
```

This creates a report of type:

```text
crash
```

The stack trace is included in the report.

---

## Breadcrumbs

Breadcrumbs describe recent user actions before a bug or crash.

Example:

```kotlin
BugTrack.leaveBreadcrumb("User opened DailyLog screen")
BugTrack.leaveBreadcrumb("User clicked Save")
BugTrack.leaveBreadcrumb("Save request started")
```

When a report is sent, the breadcrumbs are included in the report data.

This helps developers understand what happened before the issue.

---

## Current screen tracking

The SDK can automatically track the current Activity using:

```kotlin
Application.ActivityLifecycleCallbacks
```

When an Activity resumes, the SDK saves the screen name.

This screen name is attached to future reports.

The developer can also manually override the screen name if needed:

```kotlin
BugTrack.setCurrentScreen("DailyLogFragment")
```

---

## Report dialog

The SDK includes an optional report dialog.

Example:

```kotlin
BugTrack.openReportDialog(this)
```

This allows a user or tester to submit a manual bug report from inside the app.

---

## Offline queue

If the report cannot be sent because of network/backend failure, the SDK saves it locally.

The queue is stored using:

```text
SharedPreferences + Gson
```

When retry succeeds, the report is removed from the queue.

This prevents reports from being lost.

---

## Report fields sent by the SDK

The SDK can send:

```text
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
```

---

## Example SDK setup

```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        BugTrack.init(
            application = application,
            projectId = "project_xxxxxxxx",
            apiKey = "bt_xxxxxxxxxxxxxxxxxxxxxxxxx"
        )

        BugTrack.leaveBreadcrumb("MainActivity opened")
    }
}
```

---

## Example full flow

```text
Developer creates project in dashboard
        ↓
Dashboard generates project_id and api_key
        ↓
Developer copies credentials into Android app
        ↓
App sends reports through SDK
        ↓
Backend stores reports
        ↓
Dashboard displays reports
```
