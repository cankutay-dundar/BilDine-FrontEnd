import { useEffect, useState } from "react";
import { getAllUsers, addRegularShift } from "../../api/peopleApi";
import { Link } from "react-router-dom";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

function PeopleList() {
  const [users, setUsers] = useState([]);
  const [addingShiftFor, setAddingShiftFor] = useState(null);
  const [day, setDay] = useState(0);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(err => console.error("Failed to load users:", err));
  }, []);

  const handleAddShift = async (userId) => {
    try {
      await addRegularShift(userId, day, start, end);
      setMsg(`Shift added for user ${userId}`);
      setAddingShiftFor(null);
    } catch (err) {
      console.error(err);
      setMsg("Failed to add shift");
    }
  };

  return (
    <div>
      <h2>👥 People Management</h2>

      {/* ACTION BAR */}
      <div style={{ marginBottom: 20 }}>
        <Link to="/people/add">
          <button>➕ Add User</button>
        </Link>{" "}
        <Link to="/people/promote">
          <button>⬆️ Promote User</button>
        </Link>{" "}
        <Link to="/people/availability/requests">
          <button>🕒 Availability Requests</button>
        </Link>{" "}
        <Link to="/people/timeoff/requests">
          <button>⏱ Time-Off Requests</button>
        </Link>
      </div>

      {/* USERS TABLE */}
      <table border="1" width="100%" cellPadding="6">
        <thead style={{ background: "#f2f2f2" }}>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Salary / Hour</th>
            <th>Quick Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="4" align="center">No users found</td>
            </tr>
          )}

          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullName}</td>
              <td>{u.salaryPerHour}</td>
              <td>
                <Link to="/schedule">
                  <button>📅 Schedule</button>
                </Link>{" "}
                <Link to={`/people/promote?userId=${u.id}`}>
                  <button>⬆️ Promote</button>
                </Link>{" "}
                <button onClick={() => setAddingShiftFor(u.id)}>
                  ➕ Add Shift
                </button>

                {/* INLINE ADD SHIFT FORM */}
                {addingShiftFor === u.id && (
                  <div style={{ marginTop: 5 }}>
                    <select
                      value={day}
                      onChange={e => setDay(Number(e.target.value))}
                    >
                      {DAYS.map((d, i) => (
                        <option key={i} value={i}>{d}</option>
                      ))}
                    </select>{" "}
                    <input
                      type="time"
                      value={start}
                      onChange={e => setStart(e.target.value)}
                    />{" "}
                    <input
                      type="time"
                      value={end}
                      onChange={e => setEnd(e.target.value)}
                    />{" "}
                    <button onClick={() => handleAddShift(u.id)}>
                      Add
                    </button>{" "}
                    <button onClick={() => setAddingShiftFor(null)}>
                      Cancel
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
    </div>
  );
}

export default PeopleList;
