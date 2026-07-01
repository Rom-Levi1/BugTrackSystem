import { AlertTriangle, Bug, CheckCircle2, Clock, Flame, Inbox } from "lucide-react";

function SummaryCards({ summary }) {
  const cards = [
    {
      title: "Total Reports",
      value: summary?.total_reports || 0,
      icon: Inbox,
      description: "All reports received",
    },
    {
      title: "Open",
      value: summary?.open_reports || 0,
      icon: Clock,
      description: "Need attention",
    },
    {
      title: "Fixed",
      value: summary?.fixed_reports || 0,
      icon: CheckCircle2,
      description: "Resolved reports",
    },
    {
      title: "Ignored",
      value: summary?.ignored_reports || 0,
      icon: AlertTriangle,
      description: "Marked as ignored",
    },
    {
      title: "High Severity",
      value: summary?.high_severity_reports || 0,
      icon: Flame,
      description: "Critical issues",
    },
    {
      title: "Crashes",
      value: summary?.crash_reports || 0,
      icon: Bug,
      description: "Automatic crash reports",
    },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div className="summary-card card" key={card.title}>
            <div className="summary-icon">
              <Icon size={22} />
            </div>

            <div>
              <p>{card.title}</p>
              <h3>{card.value}</h3>
              <span>{card.description}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default SummaryCards;