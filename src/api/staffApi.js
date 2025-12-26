const BASE = "/api/staff";

const handle = async (res) => {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
};

/* ================= SCHEDULE ================= */
export const getRegularShifts = async (userId) => {
  if (!userId) throw new Error("User not logged in");
  const res = await fetch(`${BASE}/${userId}/regular-shift`);
  return handle(res);
};

/* ================= AVAILABILITY ================= */
export const addAvailability = async (userId, { date, start, end }) => {
  if (!userId) throw new Error("User not logged in");
  const res = await fetch(`${BASE}/${userId}/availability?date=${date}&start=${start}&end=${end}`, {
    method: "POST",
  });
  return handle(res);
};

export const deleteAvailability = async (userId, { date, start, end }) => {
  if (!userId) throw new Error("User not logged in");
  const res = await fetch(`${BASE}/${userId}/availability?date=${date}&start=${start}&end=${end}`, {
    method: "DELETE",
  });
  return handle(res);
};

/* ================= TIME OFF ================= */
export const addTimeOff = async (userId, { date, start, end }) => {
  if (!userId) throw new Error("User not logged in");
  const res = await fetch(`${BASE}/${userId}/timeoff?date=${date}&start=${start}&end=${end}`, {
    method: "POST",
  });
  return handle(res);
};

export const deleteTimeOff = async (userId, { date, start }) => {
  if (!userId) throw new Error("User not logged in");
  const res = await fetch(`${BASE}/${userId}/timeoff?date=${date}&start=${start}`, {
    method: "DELETE",
  });

  if (res.status === 204) return { message: "Time-off request deleted" };
  return handle(res);
};

/* ================= WORK HOURS ================= */
export const checkIn = async (userId) => {
  if (!userId) throw new Error("User not logged in");
  const res = await fetch(`${BASE}/${userId}/work-hours/check-in`, {
    method: "POST",
  });
  return handle(res);
};

export const checkOut = async (userId) => {
  if (!userId) throw new Error("User not logged in");
  const res = await fetch(`${BASE}/${userId}/work-hours/check-out`, {
    method: "POST",
  });
  return handle(res);
};
