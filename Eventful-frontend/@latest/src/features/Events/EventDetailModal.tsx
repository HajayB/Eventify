import { useEffect, useState } from "react";
import { getEventById, updateEvent, deleteEvent, type EventsType } from "./EventsService";
import styles from "./eventDetailModal.module.css";

type Props = {
  eventId: string;
  onClose: () => void;
  onSuccess: () => void;
};

function EventDetailModal({ eventId, onClose, onSuccess }: Props) {
  const [event, setEvent] = useState<EventsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await getEventById(eventId);
        setEvent(data);
        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        setPrice(String(data.price));
        setTotalTickets(String(data.totalTickets));
        setStartTime(data.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : "");
        setEndTime(data.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : "");
      } catch {
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await updateEvent(eventId, {
        title,
        description,
        location,
        price: Number(price),
        totalTickets: Number(totalTickets),
        startTime: startTime ? new Date(startTime).toISOString() : undefined,
        endTime: endTime ? new Date(endTime).toISOString() : undefined,
      });
      onSuccess();
    } catch {
      setError("Failed to update event.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteEvent(eventId);
      onSuccess();
      onClose();
    } catch {
      setError("Failed to delete event.");
      setDeleting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {loading && <p className={styles.status}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {event && !loading && !isEditing && (
          <div className={styles.details}>
            {event.coverImage && (
              <img className={styles.coverImage} src={event.coverImage} alt={event.title} />
            )}
            <h2 className={styles.eventTitle}>{event.title}</h2>
            <p className={styles.description}>{event.description}</p>
            <div className={styles.meta}>
              <p><span>Location</span>{event.location}</p>
              <p><span>Start</span>{new Date(event.startTime).toLocaleString()}</p>
              <p><span>End</span>{new Date(event.endTime).toLocaleString()}</p>
              <p><span>Price</span>₦{event.price}</p>
              <p><span>Tickets sold</span>{event.ticketsSold} / {event.totalTickets}</p>
            </div>
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => setIsEditing(true)}>Edit</button>
              {!confirmDelete ? (
                <button className={styles.deleteBtn} onClick={() => setConfirmDelete(true)}>Delete</button>
              ) : (
                <div className={styles.confirmRow}>
                  <span className={styles.confirmText}>Are you sure?</span>
                  <button className={styles.deleteBtn} onClick={handleDelete} disabled={deleting}>
                    {deleting ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setConfirmDelete(false)}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        )}

        {event && !loading && isEditing && (
          <div className={styles.editForm}>
            <h2 className={styles.eventTitle}>Edit Event</h2>
            <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <input className={styles.input} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <input className={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
            <input className={styles.input} type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
            <input className={styles.input} type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <input className={styles.input} type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            <input className={styles.input} type="number" value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} placeholder="Total Tickets" />
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetailModal;
