import { useState, useEffect, useCallback, useRef } from "react";
import { getOrders } from "../api/orderApi";

export const useOrders = (initialStatus = "All") => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [countdown, setCountdown] = useState(30);

  const filterRef = useRef(statusFilter);
  useEffect(() => {
    filterRef.current = statusFilter;
  }, [statusFilter]);

  const fetchOrdersData = useCallback(async (status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders(status);
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
        setError("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to load orders";
      setError(errMsg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setCountdown(30);
    fetchOrdersData(filterRef.current);
  }, [fetchOrdersData]);

  const handleStatusChange = useCallback((newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
    fetchOrdersData(newStatus);
  }, [fetchOrdersData]);

  useEffect(() => {
    fetchOrdersData(statusFilter);
  }, [statusFilter, fetchOrdersData]);

  useEffect(() => {
    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchOrdersData(filterRef.current);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchOrdersData]);

  const searchNormalized = searchTerm.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    if (!searchNormalized) return true;
    
    const matchesId = order.orderId?.toLowerCase().includes(searchNormalized);
    const matchesName = order.customerName?.toLowerCase().includes(searchNormalized);
    const matchesProduct = order.productName?.toLowerCase().includes(searchNormalized);
    
    return matchesId || matchesName || matchesProduct;
  });

  const totalOrders = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / itemsPerPage));
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return {
    orders: paginatedOrders,
    rawOrders: orders,
    loading,
    error,
    statusFilter,
    searchTerm,
    currentPage,
    totalPages,
    totalOrders,
    countdown,
    setSearchTerm: (term) => {
      setSearchTerm(term);
      setCurrentPage(1);
    },
    setCurrentPage,
    handleStatusChange,
    refresh,
  };
};
