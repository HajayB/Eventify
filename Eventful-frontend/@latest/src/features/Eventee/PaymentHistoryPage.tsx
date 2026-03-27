import { useEffect, useState } from "react";
import Sidebar from "../../services/sideBar";
import { eventeeMenu } from "../../services/sideBarData";
import Skeleton from "../../components/Skeleton";
import { getPaymentHistory, resendTicket, type PaymentHistoryItem } from "./EventeeService";
import styles from "./paymentHistoryPage.module.css";

function PaymentHistoryPage() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingRef, setResendingRef] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUCCESS" | "PENDING">("ALL");

  useEffect(() => {
    async function load() {
      try {
        const data = await getPaymentHistory();
        setPayments(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredPayments = statusFilter === "ALL"
    ? payments
    : payments.filter((p) => p.status === statusFilter);

  const totalSpent = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  async function handleResendById(payment: PaymentHistoryItem) {
    setResendingRef(payment._id);
    try {
      await resendTicket(payment.reference);
      setResendMsg((prev) => ({ ...prev, [payment._id]: "Tickets resent to your email." }));
    } catch (err: any) {
      setResendMsg((prev) => ({
        ...prev,
        [payment._id]: err.response?.data?.message || "Failed to resend.",
      }));
    } finally {
      setResendingRef(null);
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Sidebar menu={eventeeMenu} />
        <main className={styles.content}>
          <Skeleton height="28px" width="200px" style={{ marginBottom: "28px" }} />
          <div className={styles.summaryRow}>
            {[0, 1, 2].map((i) => (
              <div key={i} className={styles.summaryCard}>
                <Skeleton height="12px" width="80px" />
                <Skeleton height="32px" width="50%" />
              </div>
            ))}
          </div>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height="90px" borderRadius="12px" style={{ marginBottom: "10px" }} />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar menu={eventeeMenu} />
      <main className={styles.content}>
        <h2 className={styles.pageTitle}>Payment History</h2>

        {/* ── SUMMARY CARDS ── */}
        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total Spent</span>
            <span className={styles.summaryValue}>₦{totalSpent.toLocaleString()}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Transactions</span>
            <span className={styles.summaryValue}>{payments.length}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Tickets Purchased</span>
            <span className={styles.summaryValue}>
              {payments.filter((p) => p.status === "SUCCESS").reduce((s, p) => s + p.quantity, 0)}
            </span>
          </div>
        </div>

        {/* ── FILTER ── */}
        <div className={styles.filterRow}>
          <label className={styles.filterLabel}>Filter by status</label>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="ALL">All ({payments.length})</option>
            <option value="SUCCESS">Success ({payments.filter(p => p.status === "SUCCESS").length})</option>
            <option value="PENDING">Pending ({payments.filter(p => p.status === "PENDING").length})</option>
          </select>
        </div>

        {/* ── PAYMENT LIST ── */}
        {filteredPayments.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>💳</span>
            <p>No payments yet.</p>
            <p className={styles.emptySubtext}>Browse events and grab a ticket to get started.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {filteredPayments.map((payment) => (
              <div key={payment._id} className={styles.paymentCard}>
                <div className={styles.cardLeft}>
                  <p className={styles.eventTitle}>{payment.event.title}</p>
                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                      <span className={styles.metaLabel}>Amount</span>
                      ₦{payment.amount.toLocaleString()}
                    </span>
                    <span className={styles.metaDot} />
                    <span className={styles.metaItem}>
                      <span className={styles.metaLabel}>Tickets</span>
                      {payment.quantity}
                    </span>
                    <span className={styles.metaDot} />
                    <span className={styles.metaItem}>
                      <span className={styles.metaLabel}>Date</span>
                      {new Date(payment.paidAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                    </span>
                  </div>
                  <p className={styles.reference}>Ref: {payment.reference}</p>

                  {resendMsg[payment._id] && (
                    <p className={
                      resendMsg[payment._id].includes("resent")
                        ? styles.successText
                        : styles.errorText
                    }>
                      {resendMsg[payment._id]}
                    </p>
                  )}
                </div>

                <div className={styles.cardRight}>
                  <span className={`${styles.badge} ${
                    payment.status === "SUCCESS"
                      ? styles.badgeSuccess
                      : payment.status === "FAILED"
                      ? styles.badgeFailed
                      : styles.badgePending
                  }`}>
                    {payment.status === "SUCCESS" ? "Paid" : payment.status}
                  </span>

                  {payment.status === "SUCCESS" && (
                    <button
                      className={styles.resendBtn}
                      onClick={() => handleResendById(payment)}
                      disabled={resendingRef === payment._id}
                    >
                      {resendingRef === payment._id ? "Sending..." : "Resend tickets"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default PaymentHistoryPage;
