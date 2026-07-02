import { useState, useMemo, useRef, useEffect } from "react";
import Header from "../components/Header";
import StatusFilter from "../components/StatusFilter";
import OrdersTable from "../components/OrdersTable";
import ErrorState from "../components/ErrorState";
import CreateOrderModal from "../components/CreateOrderModal";
import SchedulerModal from "../components/SchedulerModal";
import { IconCheck, IconAlertCircle } from "../components/icons";
import { formatCompactCurrency } from "../utils/formatters";
import { useOrders } from "../hooks/useOrders";

const Dashboard = () => {
  const {
    orders,
    rawOrders,
    loading,
    error,
    statusFilter,
    searchTerm,
    currentPage,
    totalPages,
    totalOrders,
    countdown,
    setSearchTerm,
    setCurrentPage,
    handleStatusChange,
    refresh,
  } = useOrders("All");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef([]);

  useEffect(() => {
    return () => toastTimers.current.forEach(clearTimeout);
  }, []);

  const triggerToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 11);
    setToasts((prev) => [...prev, { id, message, type }]);

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
    toastTimers.current.push(timer);
  };

  const handleCreateSuccess = (msg) => {
    triggerToast(msg || "Order created successfully!");
    refresh();
  };

  const handleSchedulerSuccess = (msg) => {
    triggerToast(msg || "Scheduler run complete!");
    refresh();
  };

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let pendingRevenue = 0;
    let paidCount = 0;
    let placedCount = 0;
    let processingCount = 0;
    let readyCount = 0;

    for (const o of rawOrders) {
      if (o.paymentStatus === "PAID") {
        totalRevenue += o.amount;
        paidCount++;
      } else if (o.paymentStatus === "PENDING") {
        pendingRevenue += o.amount;
      }

      if (o.status === "PLACED") placedCount++;
      else if (o.status === "PROCESSING") processingCount++;
      else if (o.status === "READY_TO_SHIP") readyCount++;
    }

    const totalCount = rawOrders.length;
    const pct = (n) => (totalCount > 0 ? Math.round((n / totalCount) * 100) : 0);

    return {
      totalCount,
      totalRevenue,
      pendingRevenue,
      paidCount,
      paidPercent: pct(paidCount),
      placedPercent: pct(placedCount),
      processingPercent: pct(processingCount),
      readyPercent: pct(readyCount),
      avgOrderValue: totalCount > 0 ? totalRevenue / Math.max(1, paidCount) : 0,
    };
  }, [rawOrders]);

  return (
    <div className="app-layout" data-testid="dashboard-root">
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`} role="alert">
            <span style={{ display: "inline-flex" }}>
              {toast.type === "success" ? (
                <IconCheck size={16} />
              ) : (
                <IconAlertCircle size={16} stroke="#ef4444" />
              )}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <main className="main-workspace">
        <div className="workspace-container">
          <Header
            onCreateOrderClick={() => setIsCreateOpen(true)}
            onTriggerSchedulerClick={() => setIsSchedulerOpen(true)}
          />

          <div className="workspace-content-grid">
            <section className="table-workspace-section">
              <StatusFilter activeStatus={statusFilter} onChange={handleStatusChange} />

              {error ? (
                <div className="table-card" style={{ marginTop: "1rem" }}>
                  <ErrorState error={error} onRetry={refresh} />
                </div>
              ) : (
                <div style={{ marginTop: "1rem" }}>
                  <OrdersTable
                    orders={orders}
                    loading={loading}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalOrders={totalOrders}
                    setCurrentPage={setCurrentPage}
                    onRefresh={refresh}
                    countdown={countdown}
                  />
                </div>
              )}
            </section>

            <aside className="workspace-stats-sidebar">
              <div className="stats-panel-block">
                <h3 className="panel-block-title">Receipt of Goods</h3>
                <div className="circular-progress-wrapper">
                  <svg className="progress-ring-svg" viewBox="0 0 100 100">
                    <circle className="progress-ring-bg" cx="50" cy="50" r="40" />
                    <circle
                      className="progress-ring-fill"
                      cx="50"
                      cy="50"
                      r="40"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * stats.paidPercent) / 100}
                    />
                  </svg>
                  <div className="circular-progress-text">
                    <span className="ring-revenue">{formatCompactCurrency(stats.totalRevenue)}</span>
                    <span className="ring-subtext">{stats.paidCount} of {stats.totalCount} paid</span>
                  </div>
                </div>

                <div className="stats-panel-subrow">
                  <div>
                    <span className="subrow-dot green"></span>
                    <span className="subrow-label">Paid Revenue</span>
                    <strong className="subrow-val">{formatCompactCurrency(stats.totalRevenue)}</strong>
                  </div>
                  <div>
                    <span className="subrow-dot orange"></span>
                    <span className="subrow-label">Unpaid / Pending</span>
                    <strong className="subrow-val">{formatCompactCurrency(stats.pendingRevenue)}</strong>
                  </div>
                </div>
              </div>

              <div className="stats-panel-block">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 className="panel-block-title" style={{ margin: 0 }}>Orders Status</h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>Active</span>
                </div>

                <div className="status-bars-list">
                  <div className="status-bar-item">
                    <div className="status-bar-info">
                      <span>PLACED</span>
                      <strong>{stats.placedPercent}%</strong>
                    </div>
                    <div className="status-bar-track">
                      <div className="status-bar-fill blue" style={{ width: `${stats.placedPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="status-bar-item">
                    <div className="status-bar-info">
                      <span>PROCESSING</span>
                      <strong>{stats.processingPercent}%</strong>
                    </div>
                    <div className="status-bar-track">
                      <div className="status-bar-fill purple" style={{ width: `${stats.processingPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="status-bar-item">
                    <div className="status-bar-info">
                      <span>READY TO SHIP</span>
                      <strong>{stats.readyPercent}%</strong>
                    </div>
                    <div className="status-bar-track">
                      <div className="status-bar-fill orange" style={{ width: `${stats.readyPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-panel-block">
                <h3 className="panel-block-title">Overview</h3>

                <div className="overview-stats-grid">
                  <div className="overview-stat-tile">
                    <span className="overview-tile-label">Avg. Order Value</span>
                    <strong className="overview-tile-val">
                      {formatCompactCurrency(stats.avgOrderValue)}
                    </strong>
                  </div>

                  <div className="overview-stat-tile">
                    <span className="overview-tile-label">Total Revenue</span>
                    <strong className="overview-tile-val">{formatCompactCurrency(stats.totalRevenue)}</strong>
                  </div>

                  <div className="overview-stat-tile">
                    <span className="overview-tile-label">Completed Payments</span>
                    <strong className="overview-tile-val">{stats.paidCount} orders</strong>
                  </div>

                  <div className="overview-stat-tile">
                    <span className="overview-tile-label">Total Volume</span>
                    <strong className="overview-tile-val">{stats.totalCount} orders</strong>
                  </div>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </main>

      <CreateOrderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitSuccess={handleCreateSuccess}
      />

      <SchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        onRunSuccess={handleSchedulerSuccess}
      />
    </div>
  );
};

export default Dashboard;
