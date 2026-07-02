import { IconSettings, IconPlus } from "./icons";

const Header = ({ onCreateOrderClick, onTriggerSchedulerClick }) => {
  return (
    <header className="workspace-header" data-testid="header">
      <h1 className="workspace-title">Orders</h1>
      <div className="header-actions">
        <button 
          type="button" 
          className="btn btn-outline" 
          onClick={onTriggerSchedulerClick}
          title="Execute order state transitions cron job"
        >
          <IconSettings style={{ marginRight: "0.3rem" }} />
          Trigger Scheduler
        </button>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={onCreateOrderClick}
        >
          <IconPlus style={{ marginRight: "0.3rem" }} />
          Create New Order
        </button>
      </div>
    </header>
  );
};

export default Header;
