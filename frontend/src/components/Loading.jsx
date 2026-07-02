const Loading = ({ rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} className="skeleton-row" data-testid="skeleton-row">
          <td data-label="Order ID"><div className="skeleton-cell" style={{ width: "80px" }}></div></td>
          <td data-label="Customer"><div className="skeleton-cell" style={{ width: "120px" }}></div></td>
          <td data-label="Phone"><div className="skeleton-cell" style={{ width: "100px" }}></div></td>
          <td data-label="Product"><div className="skeleton-cell" style={{ width: "140px" }}></div></td>
          <td data-label="Amount"><div className="skeleton-cell" style={{ width: "60px" }}></div></td>
          <td data-label="Payment Status"><div className="skeleton-cell" style={{ width: "70px", borderRadius: "9999px" }}></div></td>
          <td data-label="Order Status"><div className="skeleton-cell" style={{ width: "80px", borderRadius: "9999px" }}></div></td>
          <td data-label="Created Time"><div className="skeleton-cell" style={{ width: "110px" }}></div></td>
        </tr>
      ))}
    </>
  );
};

export default Loading;
