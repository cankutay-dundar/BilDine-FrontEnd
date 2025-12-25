import { useEffect, useState } from "react";
import { createOnlineOrder } from "../../api/orderApi";
import { getAllCourses } from "../../api/inventoryApi";
import { useNavigate } from "react-router-dom";

function UserOnlineOrderCreate() {
  const [coursesList, setCoursesList] = useState([]);

  const [onlineCustomerId, setOnlineCustomerId] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [courses, setCourses] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCourses().then(setCoursesList);
  }, []);

  const addCourse = () => {
    if (!selectedCourse || Number(quantity) <= 0) return;

    setCourses((prev) => ({
      ...prev,
      [selectedCourse]: (prev[selectedCourse] || 0) + Number(quantity)
    }));

    setSelectedCourse("");
    setQuantity(1);
  };

  const removeCourse = (name) => {
    setCourses((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const clearForm = () => {
    setOnlineCustomerId("");
    setAddress("");
    setPhone("");
    setSelectedCourse("");
    setQuantity(1);
    setCourses({});
  };

  const submit = async (e) => {
    e.preventDefault();

    if (Object.keys(courses).length === 0) {
      alert("Please add at least one course.");
      return;
    }
    if (!address.trim()) {
      alert("Address is required.");
      return;
    }

    setSubmitting(true);
    try {
      const orderId = await createOnlineOrder(
          onlineCustomerId ? Number(onlineCustomerId) : null,
          address,
          phone,
          courses
      );

      alert(`Online order created.\nOrder ID: ${orderId}`);
      navigate(`/user/order/${orderId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create online order.");
    } finally {
      setSubmitting(false);
    }
  };



  return (
      <div style={{ maxWidth: 900 }}>
        <h2>Online Order</h2>

        <div style={{ border: "1px solid #ddd", padding: 16 }}>
          <h4>Create</h4>

          <input
              placeholder="Customer ID (optional)"
              value={onlineCustomerId}
              onChange={(e) => setOnlineCustomerId(e.target.value)}
          />
          <br /><br />

          <input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%" }}
          />
          <br /><br />

          <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
          />
          <br /><br />

          <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {coursesList.map((c) => (
                <option key={c.courseName} value={c.courseName}>
                  {c.courseName}
                </option>
            ))}
          </select>

          <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ width: 60, marginLeft: 6 }}
          />

          <button type="button" onClick={addCourse} style={{ marginLeft: 6 }} disabled={submitting}>
            Add
          </button>

          {Object.keys(courses).length > 0 && (
              <ul style={{ marginTop: 10 }}>
                {Object.entries(courses).map(([n, q]) => (
                    <li key={n}>
                      {n} × {q}{" "}
                      <button type="button" onClick={() => removeCourse(n)} disabled={submitting}>
                        remove
                      </button>
                    </li>
                ))}
              </ul>
          )}

          <button type="button" onClick={submit} disabled={submitting}>
            {submitting ? "Creating..." : "Create Order"}
          </button>

          <button type="button" onClick={clearForm} style={{ marginLeft: 8 }} disabled={submitting}>
            Clear
          </button>
        </div>
      </div>
  );

}

export default UserOnlineOrderCreate;
