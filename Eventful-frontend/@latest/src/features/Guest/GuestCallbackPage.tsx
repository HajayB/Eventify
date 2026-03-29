import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./guest.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";

function GuestCallbackPage() {
  usePageTitle("Payment Confirmed");
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    // Paystack redirects here with ?reference=... and ?trxref=...
    // We just show confirmation — the webhook handles actual ticket issuance.
    if (reference) {
      setStatus("success");
    } else {
      setStatus("failed");
    }
  }, [reference]);

  if (status === "loading") {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card2}>
            <p style={{ color: "#cdd9e5" }}>Verifying payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card2}>
            <div className={styles.successIcon}>❌</div>
            <h2>Payment Incomplete</h2>
            <p>We couldn't confirm your payment. If you were charged, please use Resend Tickets with your email and reference to retrieve them.</p>
            <div className={styles.btnRow}>
              <Link to="/guest/resend" className={styles.primaryBtn}>Resend Tickets</Link>
              <Link to="/guest" className={styles.ghostBtn}>Back to Events</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.card2}>
          <div className={styles.successIcon}>🎉</div>
          <h2>Payment Successful!</h2>
          <p>
            Your tickets are being processed and will be sent to your email shortly.
          </p>
          <p>
            <strong>Save your reference number</strong> — you'll need it if you ever need to resend your tickets.
          </p>
          <div className={styles.refBox}>{reference}</div>
          <p style={{ fontSize: "0.85rem", color: "#9baebe" }}>
            Didn't receive your email? Check your spam folder, or use the Resend Tickets page.
          </p>
          <div className={styles.btnRow}>
            <Link to="/guest/resend" className={styles.ghostBtn}>Resend Tickets</Link>
            <Link to="/guest" className={styles.primaryBtn}>Back to Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestCallbackPage;
