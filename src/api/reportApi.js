const REPORT_BASE = "/api/manager/report";

export const getDailyReport = async (date) => {
  const today = new Date().toISOString().split("T")[0];
  const reportDate = date || today;

  const res = await fetch(`${REPORT_BASE}/daily?date=${reportDate}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch daily report");
  }
  const data = await res.json();
  return data.report;
};
