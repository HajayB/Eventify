import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import Sidebar from "../../services/sideBar";
import { creatorMenu, eventeeMenu } from "../../services/sideBarData";
import styles from "./changePassword.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ChangePasswordPage() {
  usePageTitle("Change Password");
  const navigate = useNavigate();
  const isCreator = !!localStorage.getItem("creator");
  const menu = isCreator ? creatorMenu : eventeeMenu;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function showMsg(msg: string, type: "success" | "error") {
    if (type === "success") {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 3000);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showMsg("New passwords do not match.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`${baseUrl}/auth/change-password`, {
        currentPassword,
        newPassword,
      });
      showMsg(res.data.message || "Password changed successfully.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate(isCreator ? "/creator/dashboard" : "/dashboard"), 2000);
    } catch (err: any) {
      showMsg(err.response?.data?.message || "Failed to change password.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <Sidebar menu={menu} />
      <main className={styles.content}>
        <h2 className={styles.pageTitle}>Change Password</h2>
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Current Password</label>
              <input
                className={styles.input}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>New Password</label>
              <input
                className={styles.input}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirm New Password</label>
              <input
                className={styles.input}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>

            {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
            {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ChangePasswordPage;
