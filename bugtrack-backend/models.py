from sqlalchemy import Column, String, Integer, DateTime, Text
from datetime import datetime, timezone
from database import Base


class Report(Base):
    # This class represents the reports table in the SQLite database.
    # A report can be either an automatic crash report or a manual bug report.
    __tablename__ = "reports"

    # Unique report id, for example: report_a1b2c3d4
    id = Column(String, primary_key=True, index=True)

    # The project/application that sent the report.
    # This allows the dashboard to filter reports by project.
    project_id = Column(String, nullable=False, index=True)

    # Type of report, for example: crash or bug.
    type = Column(String, nullable=False)

    # Short title for the report. Useful mostly for manual bug reports.
    title = Column(String, nullable=True)

    # Main error/bug message.
    # Example: NullPointerException
    message = Column(Text, nullable=False)

    # Optional longer explanation from the user or SDK.
    description = Column(Text, nullable=True)

    # Recent user actions before the report/crash happened.
    breadcrumbs = Column(Text, nullable=True)

    # Stack trace is mainly used for crash reports.
    # It helps the developer understand where the crash happened.
    stack_trace = Column(Text, nullable=True)

    # Report severity, for example: Low, Medium, High.
    # Indexed because the dashboard can filter by severity.
    severity = Column(String, nullable=False, default="Medium", index=True)

    # Report status, for example: Open, Fixed, Ignored.
    # Indexed because the dashboard will often filter by status.
    status = Column(String, nullable=False, default="Open", index=True)

    # Screen or Activity where the issue happened.
    # Example: DailyLogActivity
    screen_name = Column(String, nullable=True)

    # Android/device/app metadata collected by the SDK.
    android_version = Column(String, nullable=True)
    device_model = Column(String, nullable=True)
    app_version = Column(String, nullable=True)

    # Optional user id attached by the SDK using setUser().
    user_id = Column(String, nullable=True)

    # Fingerprint is used to identify repeated crashes.
    # If the same fingerprint arrives again, we increase occurrence_count instead of creating duplicates.
    fingerprint = Column(String, nullable=True, index=True)

    # Counts how many times the same report happened.
    occurrence_count = Column(Integer, nullable=False, default=1)

    # When the report was first created.
    # Stored in UTC so the backend has consistent time.
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Last time this same report was seen.
    # Updated when a duplicate fingerprint is received.
    last_seen_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

