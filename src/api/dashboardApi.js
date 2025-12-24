const BASE_URL = "/api/dashboard";

export async function getDailyDashboard(date) {
  let url = `${BASE_URL}/daily`;
  if (date) {
    url += `?date=${date}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Dashboard data could not be fetched");
  }
  return res.json();
}
