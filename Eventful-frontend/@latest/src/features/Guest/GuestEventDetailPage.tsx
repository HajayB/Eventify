import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTodayEvents, guestInitializePayment, type EventsType } from "../Events/EventsService";
import styles from "./guest.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";

function GuestEventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventsType | null>(null);
  usePageTitle(event?.title ?? "Event Details");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getTodayEvents()
      .then((events) => {
        const found = events.find((e) => e._id === eventId);
        if (found) setEvent(found);
        else setError("Event not found or not available today.");
      })
      .catch(() => setError("Failed to load event."))
      .finally(() => setLoading(false));
  }, [eventId]);

  async function handleBuy(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;
    setError(null);
    setSubmitting(true);
    try {
      const { authorizationUrl } = await guestInitializePayment({
        eventId: event._id,
        quantity,
        email,
      });
      window.location.href = authorizationUrl;
    } catch (err: any) {
      setError(err.response?.data?.message || "Payment initialization failed.");
      setSubmitting(false);
    }
  }

  const maxQty = event
    ? Math.min(event.maxTicketsPerPurchase, event.totalTickets - event.ticketsSold)
    : 1;
  const total = event ? event.price * quantity : 0;

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

        <button className={styles.backBtn} onClick={() => navigate("/guest")}>← Back to events</button>

        {loading && <p className={styles.subtitle}>Loading...</p>}
        {error && !event && <p className={styles.errorText}>{error}</p>}

        {event && (
          <>
            {event.coverImage && (
              <img className={styles.coverImage} src={event.coverImage} alt={event.title} />
            )}
            <div className={styles.body}>
              <div className={styles.details}>
                <h1 className={styles.title}>{event.title}</h1>
                <p className={styles.description}>{event.description}</p>
                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Location</span>
                    <span>{event.location}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Starts</span>
                    <span>
                      {new Date(event.startTime).toLocaleString("en-NG", {
                        timeZone: "Africa/Lagos",
                        dateStyle: "full",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Ends</span>
                    <span>
                      {new Date(event.endTime).toLocaleString("en-NG", {
                        timeZone: "Africa/Lagos",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Tickets Available</span>
                    <span>{event.totalTickets - event.ticketsSold} remaining</span>
                  </div>
                </div>
              </div>

              <div className={styles.purchaseCard}>
                <p className={styles.purchaseTitle}>Get Your Ticket</p>
                <form className={styles.purchaseForm} onSubmit={handleBuy}>
                  <span className={styles.label}>Email address</span>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <span className={styles.label}>Quantity (max {maxQty})</span>
                  <input
                    className={styles.input}
                    type="number"
                    min={1}
                    max={maxQty}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                  />
                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span className={styles.totalPrice}>
                      {event.price === 0 ? "Free" : `₦${total.toLocaleString()}`}
                    </span>
                  </div>
                  {error && <p className={styles.errorText}>{error}</p>}
                  <button className={styles.buyBtn} type="submit" disabled={submitting || maxQty === 0}>
                    {submitting ? "Redirecting..." : maxQty === 0 ? "Sold Out" : "Buy Ticket"}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GuestEventDetailPage;
