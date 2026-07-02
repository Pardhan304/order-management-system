import { IconWarningTriangle, IconRefresh } from "./icons";

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="state-container" data-testid="error-state">
      <div className="state-icon">
        <IconWarningTriangle size={48} stroke="#ef4444" />
      </div>
      <h3 className="state-title">Failed to Load Orders</h3>
      <p className="state-description">
        {error || "An unexpected error occurred while communicating with the API server."}
      </p>
      <button 
        type="button" 
        className="btn btn-primary" 
        onClick={onRetry}
        style={{ marginTop: "0.5rem" }}
      >
        <IconRefresh size={14} style={{ marginRight: "0.4rem" }} />
        Retry Connection
      </button>
    </div>
  );
};

export default ErrorState;
