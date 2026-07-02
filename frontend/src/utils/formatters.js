const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const currencyWholeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount) => currencyFormatter.format(amount);

export const formatCompactCurrency = (value) => {
  if (value >= 1.0e6) return `$${(value / 1.0e6).toFixed(1)}m`;
  if (value >= 1.0e3) return `$${(value / 1.0e3).toFixed(1)}k`;
  return currencyWholeFormatter.format(value);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PAYMENT_BADGE_MAP = {
  PAID: "badge-paid",
  FAILED: "badge-failed",
};

export const getPaymentBadgeClass = (status) => {
  const normalized = status?.toUpperCase() || "PENDING";
  return PAYMENT_BADGE_MAP[normalized] || "badge-pending";
};

const ORDER_BADGE_MAP = {
  PROCESSING: "badge-processing",
  READY_TO_SHIP: "badge-ready_to_ship",
  DELIVERED: "badge-delivered",
  CANCELLED: "badge-cancelled",
};

export const getOrderBadgeClass = (status) => {
  const normalized = status?.toUpperCase() || "PLACED";
  return ORDER_BADGE_MAP[normalized] || "badge-placed";
};
