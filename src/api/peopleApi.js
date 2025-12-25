const BASE_URL = "/api/people";
const STAFF_BASE = "/api/staff";

/* ================= USERS ================= */

export const addUser = (data) =>
  fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: data.fullName,
      password: data.password,
      salaryPerHour: Number(data.salaryPerHour)
    })
  });

export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) return [];
  return res.json();
};

export const getAllWaiters = async () => {
  const res = await fetch(`${BASE_URL}/waiters`);
  if (!res.ok) return [];
  return res.json();
};

export const getUserSpecialValue = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/special-value`);
  if (!res.ok) throw new Error("Failed to get user special value");
  return res.text();
};

export const getUserKindByUserId = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/kind`);
  if (!res.ok) throw new Error("Failed to get user kind");
  return res.json();
};

export const getPayrollAmount = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/payroll-amount`);
  if (!res.ok) throw new Error("Failed to get payroll amount");
  return res.json();
};

export const decreasePayroll = (userId, amount) =>
  fetch(`${BASE_URL}/users/${userId}/decrease-payroll?userId=${userId}&amount=${amount}`, {
    method: "POST"
  });

export const updateSalary = (fullName, salaryPerHour) =>
  fetch(`${BASE_URL}/users/salary`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName,
      salaryPerHour: Number(salaryPerHour)
    })
  });

/* ================= PROMOTION ================= */

export const promoteToStaff = (userId) =>
  fetch(`${BASE_URL}/promote/staff/${userId}`, {
    method: "POST"
  });

export const promoteToManager = (userId, level) =>
  fetch(`${BASE_URL}/promote/manager/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ level: Number(level) })
  });

/* ================= SCHEDULE (OLD – KEPT) ================= */

export const getScheduleByName = (fullName) =>
  fetch(`${BASE_URL}/schedule/name/${encodeURIComponent(fullName)}`)
    .then(res => res.json());

export const getScheduleByUserId = (userId) =>
  fetch(`${BASE_URL}/schedule/${userId}`)
    .then(res => res.json());

/* ================= SCHEDULE (NEW – BACKEND ENTITIES) ================= */
/*
  RegularShift       -> weekly plan
  WorkHours          -> actual worked hours
  TimeOffRequest     -> leave / time-off
*/

export const getRegularShifts = (userId) =>
  fetch(`${BASE_URL}/schedule/${userId}/regular`)
    .then(res => res.json());

export const getWorkHours = (userId) =>
  fetch(`${BASE_URL}/schedule/${userId}/work-hours`)
    .then(res => res.json());

export const getTimeOffRequests = (userId) =>
  fetch(`${BASE_URL}/schedule/${userId}/time-off`)
    .then(res => res.json());

/* ================= AVAILABILITY REQUESTS ================= */

export const getAvailabilityRequests = () =>
  fetch(`${BASE_URL}/availability/requests`)
    .then(res => res.json());

export const approveAvailability = (userId, date, startTime) =>
  fetch(`${BASE_URL}/availability/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, date, startTime })
  });

/* ================= AVAILABILITY / TIME OFF ================= */

export const getFullScheduleByUserId = (userId) =>
  fetch(`/api/people/schedule/${userId}`)
    .then(res => {
      if (!res.ok) throw new Error("Schedule not found");
      return res.json();
    });
export const getRegularSchedule = (userId) =>
  fetch(`/api/people/schedule/${userId}`)
    .then(res => {
      if (!res.ok) throw new Error("Regular schedule not found");
      return res.json();
    });

export const getTimeOffByUserId = (userId) =>
  fetch(`/api/people/timeoff/${userId}`)
    .then(res => res.ok ? res.json() : []);
/* ================= REGULAR SHIFTS ================= */

export const getRegularShiftByUserId = (userId) =>
  fetch(`${STAFF_BASE}/${userId}/regular-shift`)
    .then(res => {
      if (!res.ok) throw new Error("Regular shift not found");
      return res.json();
    });

/* ================= TIME OFF ================= */

export const requestTimeOff = (userId, date, start, end) =>
  fetch(`${STAFF_BASE}/${userId}/timeoff?date=${date}&start=${start}&end=${end}`, {
    method: "POST"
  });

export const cancelTimeOff = (userId, date, start) =>
  fetch(`${STAFF_BASE}/${userId}/timeoff?date=${date}&start=${start}`, {
    method: "DELETE"
  });

/* ================= AVAILABILITY ================= */

export const requestAvailability = (userId, date, start, end) =>
  fetch(`${STAFF_BASE}/${userId}/availability?date=${date}&start=${start}&end=${end}`, {
    method: "POST"
  });

export const cancelAvailability = (userId, date, start, end) =>
  fetch(`${STAFF_BASE}/${userId}/availability?date=${date}&start=${start}&end=${end}`, {
    method: "DELETE"
  });

/* ================= WORK HOURS ================= */

export const checkIn = (userId) =>
  fetch(`${STAFF_BASE}/${userId}/work-hours/check-in`, {
    method: "POST"
  });

export const checkOut = (userId) =>
  fetch(`${STAFF_BASE}/${userId}/work-hours/check-out`, {
    method: "POST"
  });