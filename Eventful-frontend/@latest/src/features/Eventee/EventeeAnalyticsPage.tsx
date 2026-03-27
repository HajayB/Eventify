import { useEffect, useState } from "react";
import Sidebar from "../../services/sideBar";
import { eventeeMenu } from "../../services/sideBarData";
import Skeleton from "../../components/Skeleton";
import {
  getPaidEvents,
  getAttendedEvents,
  getUnattendedEvents,
  type PaidEvent,
  type AttendedEvent,
  type UnattendedEvent,
} from "./EventeeService";
import styles from "./eventeeAnalyticsPage.module.css";

type Tab = "attended" | "upcoming" | "missed" | "payments";

function EventeeAnalyticsPage() {
  const [paid, setPaid] = useState<PaidEvent[]>([]);
  const [attended, setAttended] = useState<AttendedEvent[]>([]);
  const [unattended, setUnattended] = useState<UnattendedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("attended");

  useEffect(() => {
    async function load() {
      try {
        const [paidData, attendedData, unattendedData] = await Promise.all([
          getPaidEvents(),
          getAttendedEvents(),
          getUnattendedEvents(),
        ]);
        setPaid(paidData);
        setAttended(attendedData);
        setUnattended(unattendedData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const now = new Date();
  const successPaid = paid.filter((p) => p.status === "SUCCESS");
  const totalSpent = successPaid.reduce((sum, p) => sum + p.amount, 0);
  const upcoming = unattended.filter((item) => new Date(item.eventId.startTime) > now);
  const missed = unattended.filter((item) => new Date(item.eventId.startTime) <= now);

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar menu={eventeeMenu} />
        <main className={styles.content}>
          <Skeleton height="28px" width="160px" style={{ marginBottom: "28px" }} />
          <div className={styles.statsGrid}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={styles.statCard}>
                <Skeleton height="12px" width="90px" />
                <Skeleton height="36px" width="55%" />
              </div>
            ))}
          </div>
          <div className={styles.tabBar}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} height="38px" width="120px" borderRadius="8px" />
            ))}
          </div>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height="76px" borderRadius="12px" style={{ marginBottom: "10px" }} />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar menu={eventeeMenu} />
      <main className={styles.content}>
        <h2 className={styles.pageTitle}>My Analytics</h2>

        {error && <p style={{ color: "#fc8181", marginBottom: "20px" }}>{error}</p>}

        {/* ── STAT CARDS ── */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Spent</span>
            <span className={styles.statValue}>₦{totalSpent.toLocaleString()}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Events Paid For</span>
            <span className={styles.statValue}>{successPaid.length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Events Attended</span>
            <span className={styles.statValue}>{attended.length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Missed Events</span>
            <span className={`${styles.statValue} ${missed.length > 0 ? styles.warnValue : ""}`}>
              {missed.length}
            </span>
          </div>
        </div>

        {/* ── ATTENDANCE RATE ── */}
        {successPaid.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Attendance Rate</h3>
            <div className={styles.rateRow}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${Math.round((attended.length / successPaid.length) * 100)}%` }}
                />
              </div>
              <span className={styles.rateLabel}>
                {Math.round((attended.length / successPaid.length) * 100)}%
              </span>
            </div>
            <p className={styles.rateSubtext}>
              Attended {attended.length} of {successPaid.length} events you paid for
            </p>
          </div>
        )}

        {/* ── TABS ── */}
        <div className={styles.tabBar}>
          <button
            className={`${styles.tab} ${activeTab === "attended" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("attended")}
          >
            Attended ({attended.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === "upcoming" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Coming Up ({upcoming.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === "missed" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("missed")}
          >
            Missed ({missed.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === "payments" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            Payments ({successPaid.length})
          </button>
        </div>

        {/* ── ATTENDED ── */}
        {activeTab === "attended" && (
          <div className={styles.list}>
            {attended.length === 0 ? (
              <p className={styles.emptyText}>No attended events yet.</p>
            ) : (
              attended.map((item) => (
                <div key={item._id} className={styles.card}>
                  <div className={styles.cardLeft}>
                    <p className={styles.cardTitle}>{item.eventId.title}</p>
                    <p className={styles.cardMeta}><span>Location</span>{item.eventId.location}</p>
                    <p className={styles.cardMeta}>
                      <span>Event date</span>
                      {new Date(item.eventId.startTime).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                    <p className={styles.cardMeta}>
                      <span>Checked in</span>
                      {new Date(item.scannedAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeUsed}`}>✓ Attended</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── COMING UP ── */}
        {activeTab === "upcoming" && (
          <div className={styles.list}>
            {upcoming.length === 0 ? (
              <p className={styles.emptyText}>No upcoming events with unused tickets.</p>
            ) : (
              upcoming.map((item) => (
                <div key={item._id} className={styles.card}>
                  <div className={styles.cardLeft}>
                    <p className={styles.cardTitle}>{item.eventId.title}</p>
                    <p className={styles.cardMeta}><span>Location</span>{item.eventId.location}</p>
                    <p className={styles.cardMeta}>
                      <span>Event date</span>
                      {new Date(item.eventId.startTime).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeUpcoming}`}>Coming Up</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── MISSED ── */}
        {activeTab === "missed" && (
          <div className={styles.list}>
            {missed.length === 0 ? (
              <p className={styles.emptyText}>You haven't missed any events.</p>
            ) : (
              missed.map((item) => (
                <div key={item._id} className={styles.card}>
                  <div className={styles.cardLeft}>
                    <p className={styles.cardTitle}>{item.eventId.title}</p>
                    <p className={styles.cardMeta}><span>Location</span>{item.eventId.location}</p>
                    <p className={styles.cardMeta}>
                      <span>Event date</span>
                      {new Date(item.eventId.startTime).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeMissed}`}>Missed</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {activeTab === "payments" && (
          <div className={styles.list}>
            {successPaid.length === 0 ? (
              <p className={styles.emptyText}>No payment records yet.</p>
            ) : (
              successPaid.map((item) => (
                <div key={item._id} className={styles.card}>
                  <div className={styles.cardLeft}>
                    <p className={styles.cardTitle}>{item.eventId.title}</p>
                    <p className={styles.cardMeta}><span>Paid</span>₦{item.amount.toLocaleString()}</p>
                    <p className={styles.cardMeta}><span>Tickets</span>{item.quantity}</p>
                    <p className={styles.cardMeta}>
                      <span>Date</span>
                      {new Date(item.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                    <p className={styles.cardRef}>Ref: {item.reference}</p>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeUsed}`}>Paid</span>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default EventeeAnalyticsPage;
