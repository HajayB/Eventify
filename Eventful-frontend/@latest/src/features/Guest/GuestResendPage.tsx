import { useState } from "react";
import { Link } from "react-router-dom";
import { guestResendTicket } from "../Events/EventsService";
import styles from "./guest.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";

function GuestResendPage() {
  usePageTitle("Resend Tickets");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      const data = await guestResendTicket({ email, reference });
      setSuccessMsg(data.message || "Tickets resent! Check your inbox.");
      setEmail("");
      setReference("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not resend tickets. Check your email and reference.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.logo}>Eventify</span>
          <div className={styles.headerLinks}>
            <Link to="/guest" className={styles.linkBtn}>Today's Events</Link>
            <Link to="/login" className={styles.linkBtn}>Sign in</Link>
          </div>
        </div>

        <div className={styles.card2} style={{ textAlign: "left" }}>
          <h2 style={{ textAlign: "center" }}>Resend My Tickets</h2>
          <p style={{ textAlign: "center" }}>
            Enter the email and reference from your original purchase email.
          </p>

          <form className={styles.purchaseForm} onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <span className={styles.label}>Email address</span>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className={styles.label}>Payment reference</span>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              required
            />
            {error && <p className={styles.errorText}>{error}</p>}
            {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
            <button className={styles.buyBtn} type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Resend Tickets"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GuestResendPage;
