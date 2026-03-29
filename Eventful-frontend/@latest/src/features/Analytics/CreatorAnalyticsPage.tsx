import { useEffect, useState } from "react";
import Skeleton from "../../components/Skeleton";
import Sidebar from "../../services/sideBar";
import { creatorMenu } from "../../services/sideBarData";
import {
  getCreatorAllTimeAnalytics,
  getCreatorPaymentAnalytics,
  getCreatorEventAnalytics,
  type AllTimeAnalytics,
  type PerEventPaymentAnalytics,
  type EventAnalytics,
} from "./AnalyticsService";
import styles from "./creatorAnalyticsPage.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";

function CreatorAnalyticsPage() {
  usePageTitle("Analytics");
  const [allTime, setAllTime] = useState<AllTimeAnalytics | null>(null);
  const [perEvent, setPerEvent] = useState<PerEventPaymentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [eventAnalyticsCache, setEventAnalyticsCache] = useState<Record<string, EventAnalytics>>({});
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [allTimeData, paymentData] = await Promise.all([
          getCreatorAllTimeAnalytics(),
          getCreatorPaymentAnalytics(),
        ]);
        setAllTime(allTimeData);
        setPerEvent(paymentData.perEvent);
      } catch {
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  async function handleRowClick(eventId: string) {
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
      return;
    }

    setExpandedEventId(eventId);

    if (eventAnalyticsCache[eventId]) return;

    setLoadingEventId(eventId);
    try {
      const data = await getCreatorEventAnalytics(eventId);
      setEventAnalyticsCache((prev) => ({ ...prev, [eventId]: data }));
    } catch {
      // silently fail — row stays expanded with no drill-down data
    } finally {
      setLoadingEventId(null);
    }
  }

  const attendanceRate = allTime && allTime.totalTicketsSold > 0
    ? Math.round((allTime.totalAttendees / allTime.totalTicketsSold) * 100)
    : 0;

  return (
    <div className={styles.container}>
      <Sidebar menu={creatorMenu} />
      <main className={styles.content}>

        <h2 className={styles.pageTitle}>Analytics</h2>

        {loading && (
          <>
            <div className={styles.statsGrid}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={styles.statCard}>
                  <Skeleton height="12px" width="90px" />
                  <Skeleton height="36px" width="55%" />
                </div>
              ))}
            </div>
            <div className={styles.section}>
              <Skeleton height="18px" width="200px" style={{ marginBottom: "14px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <Skeleton height="10px" style={{ flex: 1, borderRadius: "99px" }} />
                <Skeleton height="18px" width="36px" />
              </div>
              <Skeleton height="13px" width="220px" style={{ marginTop: "8px" }} />
            </div>
            <div className={styles.section}>
              <Skeleton height="18px" width="180px" style={{ marginBottom: "16px" }} />
              <div className={styles.tableWrapper}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <Skeleton height="16px" width={`${65 + i * 5}%`} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {error && <p className={styles.errorText}>{error}</p>}

        {!loading && allTime && (
          <>
            {/* ── STAT CARDS ── */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Revenue</span>
                <span className={styles.statValue}>₦{allTime.totalRevenue.toLocaleString()}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Tickets Sold</span>
                <span className={styles.statValue}>{allTime.totalTicketsSold.toLocaleString()}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Total Attendees</span>
                <span className={styles.statValue}>{allTime.totalAttendees.toLocaleString()}</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Unused Tickets</span>
                <span className={`${styles.statValue} ${allTime.totalUnusedTickets > 0 ? styles.warnValue : ""}`}>
                  {allTime.totalUnusedTickets.toLocaleString()}
                </span>
              </div>
            </div>

            {/* ── ATTENDANCE RATE BAR ── */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Overall Attendance Rate</h3>
              <div className={styles.rateRow}>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
                <span className={styles.rateLabel}>{attendanceRate}%</span>
              </div>
              <p className={styles.rateSubtext}>
                {allTime.totalAttendees} of {allTime.totalTicketsSold} ticket holders attended
              </p>
            </div>

            {/* ── PER-EVENT BREAKDOWN ── */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Per-Event Breakdown</h3>

              {perEvent.length === 0 ? (
                <p className={styles.emptyText}>No event data yet.</p>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Revenue</th>
                        <th>Tickets Sold</th>
                        <th>Payments</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {perEvent.map((event) => {
                        const isExpanded = expandedEventId === event.eventId;
                        const drill = eventAnalyticsCache[event.eventId];
                        const isLoadingDrill = loadingEventId === event.eventId;
                        const drillAttendance = drill && drill.ticketsSold > 0
                          ? Math.round((drill.qrVerified / drill.ticketsSold) * 100)
                          : 0;

                        return (
                          <>
                            <tr
                              key={`${event.eventId} - ${event.title} `}
                              className={`${styles.row} ${isExpanded ? styles.rowExpanded : ""}`}
                              onClick={() => handleRowClick(event.eventId)}
                            >
                              <td className={styles.eventName}>{event.title}</td>
                              <td>₦{event.revenue.toLocaleString()}</td>
                              <td>{event.ticketsSold}</td>
                              <td>{event.payments}</td>
                              <td className={styles.chevronCell}>
                                <span className={`${styles.chevron} ${isExpanded ? styles.chevronUp : ""}`}>
                                  ›
                                </span>
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr key={`${event.eventId} - ${event.title}-drill`} className={styles.drillRow}>
                                <td colSpan={5}>
                                  {isLoadingDrill ? (
                                    <p className={styles.drillLoading}>Loading event details...</p>
                                  ) : drill ? (
                                    <div className={styles.drillContent}>
                                      <div className={styles.drillStats}>
                                        <div className={styles.drillStat}>
                                          <span className={styles.drillLabel}>QR Verified</span>
                                          <span className={styles.drillVerified}>{drill.qrVerified}</span>
                                        </div>
                                        <div className={styles.drillStat}>
                                          <span className={styles.drillLabel}>QR Unverified</span>
                                          <span className={styles.drillUnverified}>{drill.qrUnverified}</span>
                                        </div>
                                        <div className={styles.drillStat}>
                                          <span className={styles.drillLabel}>Attendance Rate</span>
                                          <span className={styles.drillRate}>{drillAttendance}%</span>
                                        </div>
                                      </div>
                                      <div className={styles.drillBarRow}>
                                        <div className={styles.progressTrack}>
                                          <div
                                            className={styles.progressFill}
                                            style={{ width: `${drillAttendance}%` }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className={styles.drillLoading}>No details available.</p>
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default CreatorAnalyticsPage;
