const BASE_URL = "http://localhost:8080/api/inventory";

/* ================= ITEMS ================= */
/* ================= ITEMS ================= */

export const getAllItems = async () => {
  try {
    const res = await fetch("/api/inventory/items");
    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;

    console.error("Unexpected response:", data);
    return [];
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
};


export const getItem = (name) =>
  fetch(`${BASE_URL}/items/${name}`).then(res => res.json());

export const createItem = async (data) => {
  console.log("📤 createItem called with:", data);

  const res = await fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  console.log("📡 createItem response status:", res.status);

  let result;
  try {
    result = await res.json();
  } catch (e) {
    result = null;
  }

  console.log("📦 createItem response body:", result);

  if (!res.ok) {
    throw new Error("Create item failed");
  }

  return result;
};
export const updateItem = (name, data) =>
  fetch(`${BASE_URL}/items/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

export const updateItemPrice = (name, price) =>
  fetch(`${BASE_URL}/items/${name}/price`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price })
  });

export const restockItem = (name, amount) =>
  fetch(`${BASE_URL}/items/${name}/restock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });

export const consumeItem = (name, amount) =>
  fetch(`${BASE_URL}/items/${name}/consume`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });

export const deleteItem = (name) =>
  fetch(`${BASE_URL}/items/${name}`, { method: "DELETE" });

/* ================= COURSES ================= */

export const getAllCourses = () =>
  fetch(`${BASE_URL}/courses`).then(res => res.json());

export const createCourse = async (course) => {

  const payload = {
    courseName: course.courseName,
    price: course.price,
    type: course.type
  };

  console.log("📤 FINAL PAYLOAD:", payload);

  const res = await fetch("/api/inventory/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Create course failed");
  }

  return res.json();
};

export const updateCourse = (name, data) =>
  fetch(`${BASE_URL}/courses/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

export const getCourseIngredients = (courseName) =>
  fetch(`${BASE_URL}/courses/${courseName}/ingredients`)
    .then(res => res.json());

export const addIngredient = (courseName, data) =>
  fetch(`${BASE_URL}/courses/${courseName}/ingredients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

export const checkCourseAvailability = (courseName) =>
  fetch(`${BASE_URL}/courses/${courseName}/availability`)
    .then(res => res.json());

/* ================= WASTE ================= */

export const recordWaste = (data) =>
  fetch(`${BASE_URL}/waste`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

export const getWasteReport = ({ start, end, date }) => {
  let query = [];
  if (date) query.push(`date=${date}`);
  if (start && end) query.push(`start=${start}&end=${end}`);
  return fetch(`${BASE_URL}/waste?${query.join("&")}`)
    .then(res => res.json());
};

export const getItemWasteTotal = (itemName) =>
  fetch(`${BASE_URL}/waste/${itemName}`)
    .then(res => res.json());

/* ================= USAGE ================= */

export const recordUsage = (data) =>
  fetch(`${BASE_URL}/usage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

export async function getAllUsage({ type, start, end } = {}) {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  if (start) params.append("start", start);
  if (end) params.append("end", end);

  const queryString = params.toString();
  const url = `${BASE_URL}/usage${queryString ? "?" + queryString : ""}`;

  console.log("📡 GET USAGE URL:", url);

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    console.error("❌ USAGE FETCH FAILED:", text);
    throw new Error("Failed to fetch usage");
  }

  const data = await res.json();
  console.log("📥 USAGE RESPONSE:", data);

  return data;
}


export const getItemUsageHistory = (itemName) =>
  fetch(`${BASE_URL}/usage/${itemName}`)
    .then(res => res.json());

export const getLowStockItems = async (threshold = 10) => {
  const res = await fetch(`/api/inventory/items/low-stock?threshold=${threshold}`);
  return res.json();
};

export const getLowStockAlerts = async () => {
  const res = await fetch(`/api/inventory/items/alerts`);
  return res.json();
};
