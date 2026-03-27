import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, initializePayment, type EventsType } from "./EventsService";
import Sidebar from "../../services/sideBar";
import { eventeeMenu } from "../../services/sideBarData";
import styles from "./eventeeEventDetailPage.module.css";
import Skeleton from "../../components/Skeleton";

function EventeeEventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("");
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await getEventById(eventId!);
        setEvent(data);
      } catch {
        setFetchError("Event not found or no longer available.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  async function handleBuyTickets(e: React.FormEvent) {
    e.preventDefault();
    setBuying(true);
    setBuyError(null);
    try {
      const result = await initializePayment({ eventId: eventId!, quantity, email });
      window.location.href = result.authorizationUrl;
    } catch (err: any) {
      setBuyError(err.response?.data?.message || "Payment initialization failed. Try again.");
      setBuying(false);
    }
  }

  const availableTickets = event ? event.totalTickets - event.ticketsSold : 0;
  const totalPrice = event ? event.price * quantity : 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar menu={eventeeMenu} />
        <main className={styles.content}>
          <Skeleton height="20px" width="80px" style={{ marginBottom: "24px" }} />
          <Skeleton height="340px" borderRadius="12px" style={{ marginBottom: "32px" }} />
          <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
              <Skeleton height="36px" width="70%" />
              <Skeleton height="14px" />
              <Skeleton height="14px" width="90%" />
              <Skeleton height="14px" width="80%" />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <Skeleton height="10px" width="80px" />
                    <Skeleton height="16px" width="55%" />
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              width: "320px", flexShrink: 0,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px", padding: "28px",
              display: "flex", flexDirection: "column", gap: "16px",
            }}>
              <Skeleton height="22px" width="50%" />
              <Skeleton height="10px" width="140px" />
              <Skeleton height="44px" borderRadius="6px" />
              <Skeleton height="10px" width="80px" />
              <Skeleton height="44px" borderRadius="6px" />
              <Skeleton height="1px" style={{ margin: "4px 0" }} />
              <Skeleton height="48px" borderRadius="8px" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (fetchError || !event) {
    return (
      <div className={styles.container}>
        <Sidebar menu={eventeeMenu} />
        <main className={styles.content}>
          <p className={styles.errorText}>{fetchError ?? "Event not found."}</p>
          <button className={styles.backBtn} onClick={() => navigate("/eventee/events")}>
            ← Back to Events
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar menu={eventeeMenu} />
      <main className={styles.content}>

        <button className={styles.backBtn} onClick={() => navigate("/eventee/events")}>
          ← Back to Events
        </button>

        {event.coverImage && (
          <img className={styles.coverImage} src={event.coverImage} alt={event.title} />
        )}

        <div className={styles.body}>

          {/* LEFT — event details */}
          <div className={styles.details}>
            <h1 className={styles.title}>{event.title}</h1>
            <p className={styles.description}>{event.description}</p>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Location</span>
                <span>{event.location}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Start</span>
                <span>{new Date(event.startTime).toLocaleString()}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>End</span>
                <span>{new Date(event.endTime).toLocaleString()}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Price</span>
                <span>₦{event.price.toLocaleString()} per ticket</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Availability</span>
                <span>{availableTickets} ticket{availableTickets !== 1 ? "s" : ""} left</span>
              </div>
            </div>
          </div>

          {/* RIGHT — buy tickets */}
          <div className={styles.purchaseCard}>
            <h2 className={styles.purchaseTitle}>Get Tickets</h2>

            {availableTickets === 0 ? (
              <p className={styles.soldOut}>Sold Out</p>
            ) : (
              <form onSubmit={handleBuyTickets} className={styles.purchaseForm}>
                <label className={styles.label}>Email for ticket delivery</label>
                <input
                  className={styles.input}
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label className={styles.label}>Quantity</label>
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  max={Math.min(10, availableTickets)}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />

                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span className={styles.totalPrice}>₦{totalPrice.toLocaleString()}</span>
                </div>

                {buyError && <p className={styles.errorText}>{buyError}</p>}

                <button
                  type="submit"
                  className={styles.buyBtn}
                  disabled={buying}
                >
                  {buying ? "Redirecting to payment..." : "Buy Tickets"}
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default EventeeEventDetailPage;
