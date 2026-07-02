import { IconRefresh } from "./icons";

const RefreshButton = ({ onRefresh, loading, countdown }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }} data-testid="refresh-section">
      <div className="refresh-info">
        <div className="refresh-timer-circle" style={{ animationPlayState: loading ? "running" : "paused" }}></div>
        <span>Syncing in {countdown}s</span>
      </div>
      <button
        type="button"
        className="btn btn-outline"
        onClick={onRefresh}
        disabled={loading}
        title="Refresh orders manually"
        style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <IconRefresh
          className={loading ? "spin-icon" : ""}
          style={{ animation: loading ? "spin 1.2s linear infinite" : "none" }}
        />
        {loading ? "Syncing..." : "Refresh"}
      </button>
    </div>
  );
};

export default RefreshButton;
