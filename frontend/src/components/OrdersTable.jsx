import Loading from "./Loading";
import EmptyState from "./EmptyState";
import RefreshButton from "./RefreshButton";
import { IconSearch, IconChevronLeft, IconChevronRight } from "./icons";
import { formatCurrency, formatDate, getPaymentBadgeClass, getOrderBadgeClass } from "../utils/formatters";

const OrdersTable = ({
  orders = [],
  loading = false,
  searchTerm = "",
  setSearchTerm,
  currentPage = 1,
  totalPages = 1,
  totalOrders = 0,
  setCurrentPage,
  onRefresh,
  countdown,
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="table-card" data-testid="orders-table-card">
      <div className="table-header-row">
        <h2>
          <span>Orders List</span>
          <span className="table-badge-count">{totalOrders} matched</span>
        </h2>
        <RefreshButton onRefresh={onRefresh} loading={loading} countdown={countdown} />
      </div>

      <div className="control-bar" style={{ borderRadius: 0, borderInline: "none", borderTop: "none" }}>
        <div className="search-input-wrapper">
          <span className="search-icon" style={{ display: "inline-flex", alignItems: "center" }}>
            <IconSearch />
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by Order ID or Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search orders"
          />
        </div>
      </div>

      <div className="responsive-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Phone</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Created Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <Loading rows={4} />
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: 0 }}>
                  <EmptyState />
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id || order.orderId} data-testid={`order-row-${order.orderId}`}>
                  <td data-label="Order ID" className="order-id-cell">
                    {order.orderId}
                  </td>
                  <td data-label="Customer Name" className="customer-name-cell">
                    {order.customerName}
                  </td>
                  <td data-label="Phone" className="phone-cell">
                    {order.phone}
                  </td>
                  <td data-label="Product" className="product-cell">
                    {order.productName}
                  </td>
                  <td data-label="Amount" className="amount-cell">
                    {formatCurrency(order.amount)}
                  </td>
                  <td data-label="Payment Status">
                    <span className={`badge ${getPaymentBadgeClass(order.paymentStatus)}`}>
                      {(order.paymentStatus || "PENDING").toUpperCase()}
                    </span>
                  </td>
                  <td data-label="Order Status">
                    <span className={`badge ${getOrderBadgeClass(order.status)}`}>
                      {(order.status || "PLACED").toUpperCase()}
                    </span>
                  </td>
                  <td data-label="Created Time" className="date-cell">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({totalOrders} total orders)
          </div>
          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
              aria-label="Previous Page"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              <IconChevronLeft />
            </button>
            <span className="pagination-page-indicator">{currentPage}</span>
            <button
              type="button"
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
              aria-label="Next Page"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            >
              <IconChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
