import { useNavigate } from "react-router-dom";
import styles from "./notFound.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";

function NotFoundPage() {
  usePageTitle("404 Not Found");
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page not found</h2>
        <p className={styles.subtitle}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => navigate(-1)}>
            Go Back
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
