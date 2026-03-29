import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./paymentCallback.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";

function PaymentCallbackPage() {
  usePageTitle("Payment Confirmed");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>✓</div>
        </div>

        <h1 className={styles.title}>Payment Received!</h1>
        <p className={styles.message}>
          Your tickets are being processed. Check your email — they'll arrive shortly.
        </p>

        {reference && (
          <p className={styles.reference}>
            Reference: <span>{reference}</span>
          </p>
        )}

        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/eventee/events")}
          >
            Browse More Events
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCallbackPage;
