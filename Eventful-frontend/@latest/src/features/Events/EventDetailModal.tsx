import { useEffect, useState } from "react";
import { getEventById, updateEvent, deleteEvent, type EventsType } from "./EventsService";
import styles from "./eventDetailModal.module.css";
import Skeleton from "../../components/Skeleton";

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
  const [coverImage, setCoverImage] = useState("");
  const [maxTicketsPerPurchase, setMaxTicketsPerPurchase] = useState("");

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
        const toLocalInput = (isoStr: string) => {
          const d = new Date(isoStr);
          return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        };
        setStartTime(data.startTime ? toLocalInput(data.startTime) : "");
        setEndTime(data.endTime ? toLocalInput(data.endTime) : "");
        setCoverImage(data.coverImage || "");
        setMaxTicketsPerPurchase(String(data.maxTicketsPerPurchase ?? ""));
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
        coverImage: coverImage || undefined,
        maxTicketsPerPurchase: maxTicketsPerPurchase ? Number(maxTicketsPerPurchase) : undefined,
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

        {loading && (
          <div>
            <Skeleton height="200px" borderRadius="8px" style={{ marginBottom: "20px" }} />
            <Skeleton height="28px" width="70%" style={{ marginBottom: "10px" }} />
            <Skeleton height="14px" style={{ marginBottom: "6px" }} />
            <Skeleton height="14px" width="85%" style={{ marginBottom: "20px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              {[60, 75, 65, 70, 55].map((w, i) => (
                <Skeleton key={i} height="16px" width={`${w}%`} />
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <Skeleton height="40px" width="110px" borderRadius="6px" />
              <Skeleton height="40px" width="110px" borderRadius="6px" />
            </div>
          </div>
        )}
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
              <p><span>Start</span>{new Date(event.startTime).toLocaleString("en-NG", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" })}</p>
              <p><span>End</span>{new Date(event.endTime).toLocaleString("en-NG", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" })}</p>
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
            <input className={styles.input} type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Cover image URL (https://...)" />
            <input className={styles.input} type="number" min={1} value={maxTicketsPerPurchase} onChange={(e) => setMaxTicketsPerPurchase(e.target.value)} placeholder="Max tickets per purchase" />
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
