// Get status badge variant
export const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'destructive';
    default:
      return 'secondary';
  }
};

// Get status color
export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return '#10b981';
    case 'pending':
      return '#f59e0b';
    case 'cancelled':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

// Format date and time in Sri Lanka timezone
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-LK', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Get payment method label
export const getPaymentModeLabel = (mode) => {
  switch (mode) {
    case 'CASH':
      return 'Cash';
    case 'CARD':
      return 'Card';
    case 'UPI':
      return 'UPI';
    default:
      return mode;
  }
};
