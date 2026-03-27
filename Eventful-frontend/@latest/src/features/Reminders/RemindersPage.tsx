import { useEffect, useState } from "react";
import Sidebar from "../../services/sideBar";
import { creatorMenu } from "../../services/sideBarData";
import { getUserReminders, createReminder, type Reminder } from "./RemindersService";
import { getEvents, type EventsType } from "../Events/EventsService";
import Skeleton from "../../components/Skeleton";
import styles from "./remindersPage.module.css";

function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [events, setEvents] = useState<EventsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [selectedEventId, setSelectedEventId] = useState("");
  const [remindAt, setRemindAt] = useState("");

  const selectedEvent = events.find((e) => e._id === selectedEventId);
  const maxDateTime = selectedEvent
    ? new Date(selectedEvent.startTime).toISOString().slice(0, 16)
    : undefined;

  useEffect(() => {
    async function load() {
      try {
        const [reminderData, eventData] = await Promise.all([
          getUserReminders(),
          getEvents(),
        ]);
        setReminders(reminderData);
        // Only show future events in the dropdown
        const upcoming = eventData.events.filter(
          (e) => new Date(e.startTime) > new Date()
        );
        setEvents(upcoming);
      } catch {
        // silently fall through — skeletons will just be replaced with empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEventId || !remindAt) return;
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    try {
      await createReminder({
        eventId: selectedEventId,
        remindAt: new Date(remindAt).toISOString(),
      });
      setFormSuccess("Reminder set! You'll receive an email before the event.");
      setSelectedEventId("");
      setRemindAt("");
      // Refetch so the list shows the populated event data
      const updated = await getUserReminders();
      setReminders(updated);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to set reminder.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar menu={creatorMenu} />
        <main className={styles.content}>
          <Skeleton height="28px" width="160px" style={{ marginBottom: "32px" }} />
          <div className={styles.layout}>
            <div className={styles.formCard}>
              <Skeleton height="20px" width="140px" style={{ marginBottom: "24px" }} />
              <Skeleton height="44px" borderRadius="8px" style={{ marginBottom: "14px" }} />
              <Skeleton height="44px" borderRadius="8px" style={{ marginBottom: "24px" }} />
              <Skeleton height="44px" width="100%" borderRadius="8px" />
            </div>
            <div className={styles.listSection}>
              <Skeleton height="20px" width="160px" style={{ marginBottom: "20px" }} />
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} height="90px" borderRadius="12px" style={{ marginBottom: "12px" }} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar menu={creatorMenu} />
      <main className={styles.content}>
        <h2 className={styles.pageTitle}>Reminders</h2>

        <div className={styles.layout}>
          {/* ── FORM CARD ── */}
          <div className={styles.formCard}>
            <h3 className={styles.cardTitle}>Set a Reminder</h3>
            <p className={styles.cardSubtext}>
              Pick an event and we'll send you an email before it starts.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Event</label>
                <select
                  className={styles.select}
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    setRemindAt("");
                  }}
                  required
                >
                  <option value="">Select an event...</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title} — {new Date(event.startTime).toLocaleDateString("en-NG", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Remind me at</label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  value={remindAt}
                  max={maxDateTime}
                  onChange={(e) => setRemindAt(e.target.value)}
                  required
                  disabled={!selectedEventId}
                />
                {selectedEvent && (
                  <p className={styles.hint}>
                    Event starts {new Date(selectedEvent.startTime).toLocaleString("en-NG", {
                      dateStyle: "medium", timeStyle: "short",
                    })} — reminder must be before this.
                  </p>
                )}
              </div>

              {formError && <p className={styles.errorText}>{formError}</p>}
              {formSuccess && <p className={styles.successText}>{formSuccess}</p>}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting || !selectedEventId || !remindAt}
              >
                {submitting ? "Setting reminder..." : "Set Reminder"}
              </button>
            </form>
          </div>

          {/* ── REMINDERS LIST ── */}
          <div className={styles.listSection}>
            <h3 className={styles.cardTitle}>Your Reminders</h3>

            {reminders.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🔔</span>
                <p>No reminders set yet.</p>
                <p className={styles.emptySubtext}>Pick an event on the left to get started.</p>
              </div>
            ) : (
              <div className={styles.reminderList}>
                {reminders.map((reminder) => (
                  <div key={reminder._id} className={styles.reminderCard}>
                    <div className={styles.reminderLeft}>
                      <p className={styles.reminderEventTitle}>{reminder.event.title}</p>
                      <p className={styles.reminderMeta}>
                        <span>Event</span>
                        {new Date(reminder.event.startTime).toLocaleString("en-NG", {
                          dateStyle: "medium", timeStyle: "short",
                        })}
                      </p>
                      <p className={styles.reminderMeta}>
                        <span>Reminder</span>
                        {new Date(reminder.remindAt).toLocaleString("en-NG", {
                          dateStyle: "medium", timeStyle: "short",
                        })}
                      </p>
                      <p className={styles.reminderMeta}>
                        <span>Location</span>{reminder.event.location}
                      </p>
                    </div>
                    <div className={styles.reminderRight}>
                      <span className={`${styles.badge} ${reminder.status === "SENT" ? styles.badgeSent : styles.badgePending}`}>
                        {reminder.status === "SENT" ? "✓ Sent" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RemindersPage;
