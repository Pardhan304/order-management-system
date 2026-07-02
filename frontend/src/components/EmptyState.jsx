import { IconInbox } from "./icons";

const EmptyState = ({ message = "No Orders Found", submessage = "Try adjusting your filters or search terms, or create a new order." }) => {
  return (
    <div className="state-container" data-testid="empty-state">
      <div className="state-icon">
        <IconInbox size={48} />
      </div>
      <h3 className="state-title">{message}</h3>
      <p className="state-description">{submessage}</p>
    </div>
  );
};

export default EmptyState;
