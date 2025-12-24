const BASE_URL = "/api/orders";

/* ======================
   ORDERS – READ
====================== */

// ✅ TEK ORDER GET
export const getOrderById = async (orderId) => {
  const res = await fetch(`${BASE_URL}/${orderId}`);
  if (!res.ok) {
    throw new Error("Order not found");
  }
  return res.json();
};

// ❌ Backend’te yok → boş bırakıyoruz
export const getAllOrders = async () => {
  console.warn("GET ALL ORDERS endpoint not implemented on backend");
  return [];
};

/* ======================
   CREATE ORDERS
====================== */

export const createDineInOrder = async (waiterId, tableNo, courses) => {
  const payload = {
    waiterId,
    tableNo,
    courses
  };

  console.log("📤 CREATE DINE-IN PAYLOAD:", payload);

  const res = await fetch(`${BASE_URL}/dine-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  console.log("📡 RESPONSE STATUS:", res.status);

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  console.log("📥 RESPONSE BODY:", data);

  if (!res.ok) {
    throw new Error("Failed to create dine-in order");
  }

  return data;
};
export const createOnlineOrder = async (
  onlineCustomerId,
  address,
  phone,
  courses
) => {
  const res = await fetch(`${BASE_URL}/online`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      onlineCustomerId,
      address,
      phone,
      courses
    })
  });

  if (!res.ok) {
    throw new Error("Failed to create online order");
  }

  return res.json(); // orderId
};

/* ======================
   ONLINE – COURIER
====================== */

export const getReadyOnlineOrders = async () => {
  const res = await fetch(`${BASE_URL}/ready-online`);
  if (!res.ok) return [];
  return res.json();
};

export const claimOrder = async (orderId, courierId) => {
  const res = await fetch(
    `${BASE_URL}/${orderId}/claim/${courierId}`,
    { method: "PATCH" }
  );

  if (!res.ok) {
    throw new Error("Failed to claim order");
  }
};
export const moveToPreparing = (id) =>
  fetch(`/api/orders/${id}/preparing`, { method: "PATCH" });

export const moveToReady = (id) =>
  fetch(`/api/orders/${id}/ready`, { method: "PATCH" });

export const deliverOrder = (id, courierId) =>
  fetch(`/api/orders/${id}/deliver/${courierId}`, { method: "PATCH" });
