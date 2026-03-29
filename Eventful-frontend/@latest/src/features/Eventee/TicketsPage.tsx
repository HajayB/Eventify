import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Sidebar from "../../services/sideBar";
import { eventeeMenu } from "../../services/sideBarData";
import Skeleton from "../../components/Skeleton";
import { getMyTickets, getTicketQr, type Ticket } from "./EventeeService";
import styles from "./ticketsPage.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";

type Filter = "all" | "unused" | "used";

function TicketsPage() {
  usePageTitle("My Tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [loadingQr, setLoadingQr] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCodeMap, setShowCodeMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyTickets();
        setTickets(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleShowQr(ticket: Ticket) {
    if (expandedId === ticket._id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(ticket._id);
    if (qrMap[ticket._id]) return;

    setLoadingQr(ticket._id);
    setQrError(null);
    try {
      const payload = await getTicketQr(ticket._id);
      setQrMap((prev) => ({ ...prev, [ticket._id]: payload }));
    } catch (err: any) {
      setQrError(err.response?.data?.message || "Could not load QR code.");
      setExpandedId(null);
    } finally {
      setLoadingQr(null);
    }
  }

  const filteredTickets =
    filter === "all"
      ? tickets
      : tickets.filter((t) => t.status === (filter === "used" ? "USED" : "UNUSED"));

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar menu={eventeeMenu} />
        <main className={styles.content}>
          <Skeleton height="28px" width="120px" style={{ marginBottom: "28px" }} />
          <div className={styles.filterBar}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} height="38px" width="90px" borderRadius="8px" />
            ))}
          </div>
          <div className={styles.grid}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height="180px" borderRadius="14px" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar menu={eventeeMenu} />
      <main className={styles.content}>
        <h2 className={styles.pageTitle}>My Tickets</h2>

        {/* ── FILTER BAR ── */}
        <div className={styles.filterBar}>
          {(["all", "unused", "used"] as Filter[]).map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <span className={styles.ticketCount}>{filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}</span>
        </div>

        {qrError && <p className={styles.errorText}>{qrError}</p>}

        {filteredTickets.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🎟️</span>
            <p>No {filter === "all" ? "" : filter} tickets found.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredTickets.map((ticket) => {
              const isExpanded = expandedId === ticket._id;
              const isLoadingThisQr = loadingQr === ticket._id;

              return (
                <div
                  key={ticket._id}
                  className={`${styles.ticketCard} ${ticket.status === "USED" ? styles.ticketUsed : ""}`}
                >
                  {/* ── TICKET HEADER ── */}
                  <div className={styles.ticketHeader}>
                    <span className={`${styles.badge} ${ticket.status === "UNUSED" ? styles.badgeUnused : styles.badgeUsed}`}>
                      {ticket.status === "UNUSED" ? "Valid" : "Used"}
                    </span>
                  </div>

                  {/* ── EVENT INFO ── */}
                  <p className={styles.eventTitle}>{ticket.eventId.title}</p>
                  <div className={styles.ticketMeta}>
                    <p><span>📍</span>{ticket.eventId.location}</p>
                    <p>
                      <span>📅</span>
                      {new Date(ticket.eventId.startTime).toLocaleString("en-NG", {
                        dateStyle: "medium", timeStyle: "short",
                      })}
                    </p>
                    <p>
                      <span>🗓️</span>Purchased {new Date(ticket.createdAt).toLocaleDateString("en-NG", {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>

                  {/* ── QR SECTION ── */}
                  {ticket.status === "UNUSED" && (
                    <div className={styles.qrSection}>
                      <button
                        className={styles.qrBtn}
                        onClick={() => handleShowQr(ticket)}
                        disabled={isLoadingThisQr}
                      >
                        {isLoadingThisQr
                          ? "Loading..."
                          : isExpanded
                          ? "Hide QR"
                          : "Show QR Code"}
                      </button>

                      {isExpanded && qrMap[ticket._id] && (
                        <div className={styles.qrWrapper}>
                          <QRCode
                            value={qrMap[ticket._id]}
                            size={180}
                            bgColor="white"
                            fgColor="#0f2027"
                            level="M"
                          />
                          <p className={styles.qrHint}>Present this at the event entrance</p>

                          <button
                            className={styles.showCodeBtn}
                            onClick={() =>
                              setShowCodeMap((prev) => ({
                                ...prev,
                                [ticket._id]: !prev[ticket._id],
                              }))
                            }
                          >
                            {showCodeMap[ticket._id] ? "Hide Code" : "Scanner not working? Show Code"}
                          </button>

                          {showCodeMap[ticket._id] && (
                            <code className={styles.ticketCode}>
                              {qrMap[ticket._id]}
                            </code>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {ticket.status === "USED" && (
                    <p className={styles.usedLabel}>✓ Scanned at entry</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default TicketsPage;
