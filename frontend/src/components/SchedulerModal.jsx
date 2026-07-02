import { useState } from "react";
import { runScheduler } from "../api/schedulerApi";
import { IconClose, IconAlertCircle, IconCheck } from "./icons";

const SchedulerModal = ({ isOpen, onClose, onRunSuccess }) => {
  const [secret, setSecret] = useState(
    "41170225b136d95ebdaf6fc76a16a087df3c4eff64c5fd2184eb01f04599f927"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleRun = async (e) => {
    e.preventDefault();
    if (!secret.trim()) {
      setError("Scheduler secret is required");
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const response = await runScheduler(secret);
      if (response.success) {
        setResult(response.data);
        onRunSuccess("Scheduler executed successfully!");
      } else {
        setError(response.message || "Failed to execute scheduler");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "Unauthorized or connection failed";
      setError(errMsg);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="scheduler-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Trigger Order Scheduler</h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <IconClose />
          </button>
        </div>

        <form onSubmit={handleRun}>
          <div className="modal-body">
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: "0 0 1rem" }}>
              The scheduler executes configured order state transitions (e.g. <strong>PLACED &rarr; PROCESSING</strong> after 10 mins and <strong>PROCESSING &rarr; READY_TO_SHIP</strong> after 20 mins) and logs results.
            </p>

            {error && (
              <div className="warning-alert" style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)", color: "#fca5a5", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <IconAlertCircle size={16} stroke="#fca5a5" style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="warning-alert" style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.2)", color: "#86efac", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <IconCheck size={16} stroke="#86efac" />
                  <strong>Execution Log:</strong>
                </div>
                <ul style={{ margin: "0", paddingLeft: "1.25rem", fontSize: "0.8rem" }}>
                  <li>Total Orders Processed: {result.totalOrders ?? 0}</li>
                  <li>Successfully Transitioned: {result.successCount ?? 0}</li>
                  <li>Failed Updates: {result.failedCount ?? 0}</li>
                  {result.transitions && result.transitions.map((t, idx) => (
                    <li key={idx} style={{ marginTop: "0.2rem", listStyleType: "circle" }}>
                      {t.from} &rarr; {t.to}: {t.processed} processed, {t.failed} failed
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="schedulerSecret">Scheduler Secret (x-scheduler-secret)</label>
              <input
                id="schedulerSecret"
                type="password"
                className="form-input"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret token"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isRunning}
            >
              Close
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Run Scheduler Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulerModal;
