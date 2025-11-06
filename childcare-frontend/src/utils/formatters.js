// Format number with commas as thousands separator
export function formatNumber(num) {
  return num.toLocaleString();
}

// Format number as currency, e.g., 1234.5 => "$1,234.50"
export function formatCurrency(num, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(num);
}

// Capitalize first letter of each word
export function capitalizeWords(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Shorten text to a maximum length with "..."
export function truncateText(str, maxLength = 50) {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

// Format a date string as DD/MM/YYYY
export function formatDateDMY(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
