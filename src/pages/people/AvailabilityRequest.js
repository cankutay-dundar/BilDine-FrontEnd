import { useEffect, useState } from "react";
import {
  requestAvailability,
  requestTimeOff,
  getAllUsers
} from "../../api/peopleApi";

function AvailabilityRequest() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    date: "",
    start: "",
    end: ""
  });

  useEffect(() => {
    getAllUsers().then(data => {
      console.log("👥 USERS:", data);
      setUsers(data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitAvailability = async () => {
    console.log("📤 Availability payload:", form);

    if (!form.userId || !form.date || !form.start || !form.end) {
      alert("Fill all fields");
      return;
    }

    await requestAvailability(form);
    alert("Availability request sent");
  };

  const submitTimeOff = async () => {
    console.log("📤 Time off payload:", form);

    if (!form.userId || !form.date || !form.start || !form.end) {
      alert("Fill all fields");
      return;
    }

    await requestTimeOff(form);
    alert("Time off request sent");
  };

  return (
    <div>
      <h2>🕒 Availability / Time Off</h2>

      <select
        name="userId"
        value={form.userId}
        onChange={handleChange}
      >
        <option value="">Select User</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.fullName} (ID: {u.id})
          </option>
        ))}
      </select>

      <br /><br />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <input
        type="time"
        name="start"
        value={form.start}
        onChange={handleChange}
      />

      <input
        type="time"
        name="end"
        value={form.end}
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={submitAvailability}>
        Send Availability
      </button>

      <button onClick={submitTimeOff}>
        Send Time Off
      </button>
    </div>
  );
}

export default AvailabilityRequest;
