export function parseApiPayload(data) {
  if (data == null) return null;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return { uuid: data };
    }
  }
  return data;
}

export function formatCurrency(value) {
  return `Rs ${Number(value || 0).toFixed(2)}`;
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
