const statuses = [
  "All",
  "PLACED",
  "PROCESSING",
  "READY_TO_SHIP"
];

const StatusFilter = ({ activeStatus, onChange }) => {
  return (
    <div className="status-filter-container" data-testid="status-filter">
      <div className="status-filter-wrapper">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            className={`status-tab ${activeStatus === status ? "active" : ""}`}
            onClick={() => onChange(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
