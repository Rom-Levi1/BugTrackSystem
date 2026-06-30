from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timezone
import uuid

from database import engine, SessionLocal
import models


# Create the database tables if they do not already exist.
# This is useful for development because the SQLite table is created automatically.
models.Base.metadata.create_all(bind=engine)

# FastAPI application object.
# The title and description will appear in the automatic /docs page.
app = FastAPI(
    title="BugTrack API",
    description="Backend API for crash reports, bug reports, and analytics events",
    version="1.0.0"
)


class ReportCreate(BaseModel):
    # This class defines the JSON structure that the Android SDK sends to the backend.

    model_config = ConfigDict(extra="ignore")

    project_id: str
    type: str

    title: Optional[str] = None
    message: str
    description: Optional[str] = None
    breadcrumbs: Optional[str] = None
    stack_trace: Optional[str] = None

    severity: Optional[str] = "Medium"
    status: Optional[str] = "Open"

    screen_name: Optional[str] = None
    android_version: Optional[str] = None
    device_model: Optional[str] = None
    app_version: Optional[str] = None

    user_id: Optional[str] = None
    fingerprint: Optional[str] = None



class ReportResponse(BaseModel):
    # This class defines the JSON structure returned from the backend to the dashboard.

    id: str

    project_id: str
    type: str

    title: Optional[str]
    message: str
    description: Optional[str]
    breadcrumbs: Optional[str] = None
    stack_trace: Optional[str]

    severity: str
    status: str

    screen_name: Optional[str]
    android_version: Optional[str]
    device_model: Optional[str]
    app_version: Optional[str]

    user_id: Optional[str]
    fingerprint: Optional[str]
    occurrence_count: int

    created_at: datetime
    last_seen_at: datetime


    class Config:
        # Allows Pydantic to convert SQLAlchemy objects into JSON responses.
        from_attributes = True


class StatusUpdate(BaseModel):
    # This class is used when the dashboard updates the status of a report.
    # Example: Open -> Fixed
    status: str

class SummaryResponse(BaseModel):
    # This class defines the data returned for the dashboard summary cards.

    total_reports: int
    open_reports: int
    fixed_reports: int
    ignored_reports: int
    high_severity_reports: int
    crash_reports: int
    bug_reports: int

def get_db():
    # Opens a database session for each request.
    # After the request is finished, the session is closed.
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_api_key(x_api_key: str = Header(None)):
    # Simple API key check for the MVP.
    # for now hardcoded.
    valid_api_key = "test_api_key_123"

    if x_api_key != valid_api_key:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

    return x_api_key

def normalize_status(status: str):
    # Keeps status values consistent in the database.
    # Example: fixed, FIXED, and Fixed will all be saved as Fixed.
    status_map = {
        "open": "Open",
        "fixed": "Fixed",
        "ignored": "Ignored"
    }

    normalized_status = status_map.get(status.lower())

    if normalized_status is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid status. Use Open, Fixed, or Ignored."
        )

    return normalized_status


def normalize_severity(severity: str):
    # Keeps severity values consistent in the database.
    # Example: high, HIGH, and High will all be saved as High.
    severity_map = {
        "low": "Low",
        "medium": "Medium",
        "high": "High"
    }

    normalized_severity = severity_map.get(severity.lower())

    if normalized_severity is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid severity. Use Low, Medium, or High."
        )

    return normalized_severity

@app.get("/")
def home():
    # Simple route to check if the backend server is running.
    return {
        "message": "BugTrack backend is running"
    }


@app.post("/api/reports", response_model=ReportResponse)
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    # This endpoint receives crash/bug reports from the Android SDK.

    report.status = normalize_status(report.status)
    report.severity = normalize_severity(report.severity)

    # If the report has a fingerprint, we check if the same report already exists.
    # This prevents duplicate crash entries in the dashboard.
    if report.fingerprint:
        existing_report = db.query(models.Report).filter(
            models.Report.project_id == report.project_id,
            models.Report.type == report.type,
            models.Report.fingerprint == report.fingerprint
        ).first()

        # If the report already exists, update the counter and last seen time.
        if existing_report:
            existing_report.occurrence_count += 1
            existing_report.last_seen_at = datetime.now(timezone.utc)

            db.commit()
            db.refresh(existing_report)

            return existing_report

    # Create a short unique report id.
    # Example: report_3779f104
    report_id = "report_" + str(uuid.uuid4())[:8]

    # Create a new database report object from the received JSON.
    new_report = models.Report(
        id=report_id,
        project_id=report.project_id,
        type=report.type,
        title=report.title,
        message=report.message,
        description=report.description,
        breadcrumbs=report.breadcrumbs,
        stack_trace=report.stack_trace,
        severity=report.severity,
        status=report.status,
        screen_name=report.screen_name,
        android_version=report.android_version,
        device_model=report.device_model,
        app_version=report.app_version,
        user_id=report.user_id,
        fingerprint=report.fingerprint,
        occurrence_count=1
    )

    # Save the new report in the database.
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report


@app.get("/api/reports", response_model=List[ReportResponse])
def get_reports(
    project_id: Optional[str] = None,
    status: Optional[str] = None,
    severity: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # This endpoint is used by the dashboard to get reports.
    # Optional query parameters allow filtering.

    query = db.query(models.Report)

    # Filter by project if project_id is provided.
    if project_id:
        query = query.filter(models.Report.project_id == project_id)

    # Filter by report status if status is provided.
    if status:
        query = query.filter(models.Report.status == status)

    # Filter by severity if severity is provided.
    if severity:
        query = query.filter(models.Report.severity == severity)

    # Filter by report type if type is provided.
    # Example: crash or bug
    if type:
        query = query.filter(models.Report.type == type)

    # Newest reports appear first in the dashboard.
    reports = query.order_by(models.Report.created_at.desc()).all()

    return reports


@app.get("/api/reports/{report_id}", response_model=ReportResponse)
def get_report_by_id(
    report_id: str,
    db: Session = Depends(get_db)
):
    # This endpoint returns one specific report.
    # It will be used by the dashboard details panel.

    report = db.query(models.Report).filter(
        models.Report.id == report_id
    ).first()

    # If no report with this id exists, return 404 Not Found.
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    return report


@app.patch("/api/reports/{report_id}/status", response_model=ReportResponse)
def update_report_status(
    report_id: str,
    status_update: StatusUpdate,
    db: Session = Depends(get_db)
):
    # This endpoint lets the dashboard update the report status.
    # Example statuses: Open, Fixed, Ignored.

    report = db.query(models.Report).filter(
        models.Report.id == report_id
    ).first()

    # If the report does not exist, return 404 Not Found.
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    # Update the report status and save the change.
    report.status = normalize_status(status_update.status)

    db.commit()
    db.refresh(report)

    return report

@app.get("/api/summary", response_model=SummaryResponse)
def get_summary(
    project_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # This endpoint gives the dashboard summary numbers.
    # If project_id is provided, the summary is calculated only for that project.

    query = db.query(models.Report)

    # Filter by project if the dashboard asks for a specific project.
    if project_id:
        query = query.filter(models.Report.project_id == project_id)

    total_reports = query.count()

    open_reports = query.filter(
        models.Report.status == "Open"
    ).count()

    fixed_reports = query.filter(
        models.Report.status == "Fixed"
    ).count()

    ignored_reports = query.filter(
        models.Report.status == "Ignored"
    ).count()

    high_severity_reports = query.filter(
        models.Report.severity == "High"
    ).count()

    crash_reports = query.filter(
        models.Report.type == "crash"
    ).count()

    bug_reports = query.filter(
        models.Report.type == "bug"
    ).count()

    return {
        "total_reports": total_reports,
        "open_reports": open_reports,
        "fixed_reports": fixed_reports,
        "ignored_reports": ignored_reports,
        "high_severity_reports": high_severity_reports,
        "crash_reports": crash_reports,
        "bug_reports": bug_reports
    }

@app.delete("/api/reports/{report_id}")
def delete_report(
    report_id: str,
    db: Session = Depends(get_db)
):
    # This endpoint deletes a report from the database.
    # It is mainly useful during development and testing.

    report = db.query(models.Report).filter(
        models.Report.id == report_id
    ).first()

    # If the report does not exist, return 404 Not Found.
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    db.delete(report)
    db.commit()

    return {
        "message": "Report deleted successfully",
        "deleted_report_id": report_id
    }