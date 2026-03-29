import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Sidebar from "../../services/sideBar";
import { creatorMenu } from "../../services/sideBarData";
import { getCreatorEvents, scanTicket, type EventsType } from "./EventsService";
import styles from "./scanTicket.module.css";
import { usePageTitle } from "../../hooks/usePageTitle";

type ScanResult = {
  valid: boolean;
  message: string;
  scannedAt?: string;
} | null;

function ScanTicketPage() {
  usePageTitle("Scan Tickets");
  const [events, setEvents] = useState<EventsType[]>([]);
  const [eventId, setEventId] = useState("");
  const [result, setResult] = useState<ScanResult>(null);
  const [scanning, setScanning] = useState(false);
  const [manualPayload, setManualPayload] = useState("");
  const [submittingManual, setSubmittingManual] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const processingRef = useRef(false); // prevent duplicate scans on the same frame

  // Load creator's events for the dropdown
  useEffect(() => {
    getCreatorEvents().then((data) => {
      setEvents(data.CurrentEvents.activeEvents);
    }).catch(console.error);
  }, []);

  // Start/stop camera scanner when eventId changes
  useEffect(() => {
    if (!eventId) return;

    setResult(null);
    processingRef.current = false;
    setScanning(true);

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 260, height: 260 }, aspectRatio: 1 },
      false
    );

    scanner.render(
      async (decodedText) => {
        if (processingRef.current) return;
        processingRef.current = true;

        try {
          const res = await scanTicket({ qrPayload: decodedText, eventId });
          setResult({ valid: true, message: res.message, scannedAt: res.scannedAt });
        } catch (err: any) {
          setResult({
            valid: false,
            message: err.response?.data?.message || "Invalid ticket",
          });
        }

        // Reset after 3 seconds so the creator can scan the next ticket
        setTimeout(() => {
          setResult(null);
          processingRef.current = false;
        }, 3000);
      },
      () => {
        // per-frame decode errors are normal (no QR in frame yet) — ignore
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(console.error);
      scannerRef.current = null;
      setScanning(false);
    };
  }, [eventId]);

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualPayload.trim() || !eventId) return;
    setSubmittingManual(true);
    try {
      const res = await scanTicket({ qrPayload: manualPayload.trim(), eventId });
      setResult({ valid: true, message: res.message, scannedAt: res.scannedAt });
      setManualPayload("");
    } catch (err: any) {
      setResult({
        valid: false,
        message: err.response?.data?.message || "Invalid ticket",
      });
    } finally {
      setSubmittingManual(false);
      setTimeout(() => setResult(null), 3000);
    }
  }

  return (
    <div className={styles.container}>
      <Sidebar menu={creatorMenu} />
      <main className={styles.content}>
        <h2 className={styles.pageTitle}>Scan Tickets</h2>

        {/* ── EVENT SELECTOR ── */}
        <div className={styles.selectorCard}>
          <label className={styles.label}>Select Event</label>
          <select
            className={styles.select}
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Choose an event to scan for...</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title} — {new Date(event.startTime).toLocaleDateString("en-NG", {
                  timeZone: "Africa/Lagos", dateStyle: "medium",
                })}
              </option>
            ))}
          </select>
        </div>

        {!eventId && (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>📷</span>
            <p>Select an event above to start scanning</p>
          </div>
        )}

        {eventId && (
          <div className={styles.scanArea}>
            {/* ── RESULT OVERLAY ── */}
            {result && (
              <div className={`${styles.resultBanner} ${result.valid ? styles.resultValid : styles.resultInvalid}`}>
                <span className={styles.resultIcon}>{result.valid ? "✓" : "✗"}</span>
                <div>
                  <p className={styles.resultMsg}>{result.message}</p>
                  {result.valid && result.scannedAt && (
                    <p className={styles.resultSub}>
                      Scanned at {new Date(result.scannedAt).toLocaleTimeString("en-NG", {
                        timeZone: "Africa/Lagos", timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── CAMERA VIEW ── */}
            <div className={styles.cameraCard}>
              <p className={styles.cameraHint}>
                {scanning ? "Point the camera at the attendee's QR code" : "Starting camera..."}
              </p>
              <div id="qr-reader" className={styles.qrReader} />
            </div>

            {/* ── MANUAL FALLBACK ── */}
            <div className={styles.manualSection}>
              <button
                className={styles.toggleManual}
                onClick={() => setShowManual((v) => !v)}
              >
                {showManual ? "Hide manual entry" : "Scanner not working? Enter code manually"}
              </button>

              {showManual && (
                <form onSubmit={handleManualSubmit} className={styles.manualForm}>
                  <input
                    className={styles.manualInput}
                    type="text"
                    value={manualPayload}
                    onChange={(e) => setManualPayload(e.target.value)}
                    placeholder="Paste ticket code here..."
                  />
                  <button
                    type="submit"
                    className={styles.manualBtn}
                    disabled={submittingManual || !manualPayload.trim()}
                  >
                    {submittingManual ? "Checking..." : "Verify"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ScanTicketPage;
