import { useState } from "react";
import { createOrder } from "../api/orderApi";
import { IconClose, IconAlertCircle } from "./icons";

const CreateOrderModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    productName: "",
    amount: "",
    paymentStatus: "PENDING",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!form.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!form.productName.trim()) {
      newErrors.productName = "Product name is required";
    }
    if (!form.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const parsedAmount = parseFloat(form.amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
      };
      const response = await createOrder(payload);
      if (response.success) {
        onSubmitSuccess("Order created successfully!");
        onClose();
        setForm({
          customerName: "",
          phone: "",
          productName: "",
          amount: "",
          paymentStatus: "PENDING",
        });
      } else {
        setApiError(response.message || "Failed to create order");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "An error occurred while creating order";
      setApiError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="create-order-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Order</h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <IconClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {apiError && (
              <div className="warning-alert" style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)", color: "#fca5a5", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <IconAlertCircle size={16} stroke="#fca5a5" style={{ flexShrink: 0 }} />
                <span>{apiError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="customerName">Customer Name</label>
              <input
                id="customerName"
                type="text"
                name="customerName"
                className={`form-input ${errors.customerName ? "error" : ""}`}
                value={form.customerName}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
              />
              {errors.customerName && <span className="form-input-error-msg">{errors.customerName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                className={`form-input ${errors.phone ? "error" : ""}`}
                value={form.phone}
                onChange={handleInputChange}
                placeholder="e.g. +1 555-0199 or 9876543210"
              />
              {errors.phone && <span className="form-input-error-msg">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="productName">Product Name</label>
              <input
                id="productName"
                type="text"
                name="productName"
                className={`form-input ${errors.productName ? "error" : ""}`}
                value={form.productName}
                onChange={handleInputChange}
                placeholder="e.g. Mechanical Keyboard"
              />
              {errors.productName && <span className="form-input-error-msg">{errors.productName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="amount">Amount ($)</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                name="amount"
                className={`form-input ${errors.amount ? "error" : ""}`}
                value={form.amount}
                onChange={handleInputChange}
                placeholder="e.g. 99.99"
              />
              {errors.amount && <span className="form-input-error-msg">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="paymentStatus">Payment Status</label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                className="form-select"
                value={form.paymentStatus}
                onChange={handleInputChange}
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;
