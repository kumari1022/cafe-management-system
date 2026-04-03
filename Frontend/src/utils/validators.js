export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function validatePhone(value) {
  return /^[0-9]{10,15}$/.test(String(value || ""));
}
