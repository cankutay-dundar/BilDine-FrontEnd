const BASE = "/api/staff";

const toQuery = (params) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, v);
  });
  return sp.toString();
};

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
  const res = await fetch(`${BASE}/${userId}/regular-shift`);
  return handle(res); // List<RegularShiftSlot>
};

/* ================= AVAILABILITY ================= */
export const addAvailability = async (userId, { date, start, end }) => {
  const qs = toQuery({ date, start, end });
  const res = await fetch(`${BASE}/${userId}/availability?${qs}`, {
    method: "POST"
  });
  return handle(res); // {message}
};

export const deleteAvailability = async (userId, { date, start, end }) => {
  const qs = toQuery({ date, start, end });
  const res = await fetch(`${BASE}/${userId}/availability?${qs}`, {
    method: "DELETE"
  });
  return handle(res); // {message}
};

/* ================= TIME OFF ================= */
export const addTimeOff = async (userId, { date, start, end }) => {
  const qs = toQuery({ date, start, end });
  const res = await fetch(`${BASE}/${userId}/timeoff?${qs}`, {
    method: "POST"
  });
  return handle(res); // {message}
};

// backend deleteTimeOff: date + start (end yok)
export const deleteTimeOff = async (userId, { date, start }) => {
  const qs = toQuery({ date, start });
  const res = await fetch(`${BASE}/${userId}/timeoff?${qs}`, {
    method: "DELETE"
  });

  // 204 No Content -> handle() json beklemesin
  if (res.status === 204) return { message: "Time-off request deleted" };
  return handle(res);
};

/* ================= WORK HOURS ================= */
export const checkIn = async (userId) => {
  const res = await fetch(`${BASE}/${userId}/work-hours/check-in`, {
    method: "POST"
  });
  return handle(res); // {message}
};

export const checkOut = async (userId) => {
  const res = await fetch(`${BASE}/${userId}/work-hours/check-out`, {
    method: "POST"
  });
  return handle(res); // {message}
};
