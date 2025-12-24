import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/peopleApi";
import { Link } from "react-router-dom";

function PeopleList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

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

        {/* 🔥 REQUEST CREATE */}
        <Link to="/people/availability">
          <button>🕒 Create Availability / Time-Off</button>
        </Link>{" "}

        {/* 🔥 MANAGER ONLY */}
        <Link to="/people/availability/requests">
          <button>📥 View Requests</button>
        </Link>{" "}

        <Link to="/people/schedule">
          <button>📅 Schedule</button>
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
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullName}</td>
              <td>{u.salaryPerHour}</td>
              <td>
                <Link to={`/schedule`}>
                  <button>📅 Schedule</button>
                </Link>{" "}
                <Link to={`/people/promote?userId=${u.id}`}>
                  <button>⬆️ Promote</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PeopleList;
