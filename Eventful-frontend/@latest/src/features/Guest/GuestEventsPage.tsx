import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTodayEvents, type EventsType } from "../Events/EventsService";
import styles from "./guest.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";

function GuestEventsPage() {
  usePageTitle("Today's Events");
  const [events, setEvents] = useState<EventsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTodayEvents()
      .then(setEvents)
      .catch(() => setError("Failed to load events."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.logo}>Eventify</span>
          <div className={styles.headerLinks}>
            <Link to="/guest/resend" className={styles.linkBtn}>Resend Tickets</Link>
            <Link to="/login" className={styles.linkBtn}>Sign in</Link>
          </div>
        </div>

        <h1 className={styles.pageTitle}>Today's Events</h1>
        <p className={styles.subtitle}>Buy tickets at the door — no account needed.</p>

        {loading && <p className={styles.subtitle}>Loading events...</p>}
        {error && <p className={styles.errorText}>{error}</p>}

        {!loading && !error && events.length === 0 && (
          <div className={styles.emptyState}>
            <h3>No events today</h3>
            <p>Check back later or browse all upcoming events.</p>
            <Link to="/events" className={styles.linkBtn} style={{ marginTop: 16, display: "inline-block" }}>
              Browse all events
            </Link>
          </div>
        )}

        <div className={styles.grid}>
          {events.map((event) => (
            <Link key={event._id} to={`/guest/events/${event._id}`} className={styles.card}>
              {event.coverImage && (
                <img className={styles.cardImage} src={event.coverImage} alt={event.title} />
              )}
              <div className={styles.cardBody}>
                <p className={styles.cardTitle}>{event.title}</p>
                <div className={styles.cardMeta}>
                  <span>📍 {event.location}</span>
                  <span>
                    🕐{" "}
                    {new Date(event.startTime).toLocaleString("en-NG", {
                      timeZone: "Africa/Lagos",
                      timeStyle: "short",
                      dateStyle: "medium",
                    })}
                  </span>
                  <span>{event.ticketsSold} / {event.totalTickets} sold</span>
                </div>
                <p className={styles.cardPrice}>
                  {event.price === 0 ? "Free" : `₦${event.price.toLocaleString()}`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GuestEventsPage;
