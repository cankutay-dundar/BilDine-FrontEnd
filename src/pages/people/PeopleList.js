import { useEffect, useState } from "react";
import {
  getManagers,
  getKitchenStaff,
  getDeliverers,
  getCleaners,
  getPayrollAmount,
  decreasePayroll,
  addRegularShift,
} from "../../api/peopleApi";
import { Link } from "react-router-dom";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function PeopleList() {
  const [groupedUsers, setGroupedUsers] = useState({
    MANAGER: [],
    KITCHEN_STAFF: [],
    DELIVERER: [],
    CLEANER: [],
    BASE_USER: [],
  });

  const [selectedUserForPayroll, setSelectedUserForPayroll] = useState(null);
  const [payrollAmount, setPayrollAmount] = useState(0);
  const [decreaseAmount, setDecreaseAmount] = useState("");

  const [addingShiftFor, setAddingShiftFor] = useState(null);
  const [day, setDay] = useState(0);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchGrouped = async () => {
      try {
        const [managers, kitchen, deliverers, cleaners] = await Promise.all([
          getManagers(),
          getKitchenStaff(),
          getDeliverers(),
          getCleaners(),
        ]);

        setGroupedUsers({
          MANAGER: managers || [],
          KITCHEN_STAFF: kitchen || [],
          DELIVERER: deliverers || [],
          CLEANER: cleaners || [],
          BASE_USER: [], // If you later add /base-users endpoint, fill it here.
        });
      } catch (err) {
        console.error("Failed to load grouped users:", err);
      }
    };

    fetchGrouped();
  }, []);

  const handleDecreasePayrollClick = async (userId) => {
    try {
      const amount = await getPayrollAmount(userId);
      setPayrollAmount(amount);
      setSelectedUserForPayroll(userId);
      setDecreaseAmount("");
    } catch (error) {
      alert("Failed to fetch payroll amount");
    }
  };

  const handleConfirmDecrease = async () => {
    const n = Number(decreaseAmount);
    if (!decreaseAmount || Number.isNaN(n) || n <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }
    try {
      await decreasePayroll(selectedUserForPayroll, n);
      alert("Payroll decreased successfully");
      setSelectedUserForPayroll(null);
    } catch (error) {
      alert("Failed to decrease payroll");
    }
  };

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

  const specialColumnNames = {
    MANAGER: "Level",
    KITCHEN_STAFF: "Kitchen Role",
    DELIVERER: "Deliverer Type",
    CLEANER: "Duty",
  };

  const renderTable = (userType, summaries) => {
    if (!summaries || summaries.length === 0) return null;

    const hasSpecialColumn = userType !== "BASE_USER";
    const specialColumnName = specialColumnNames[userType] || "";

    return (
      <div key={userType} style={{ marginBottom: 40 }}>
        <h3>{userType.replace("_", " ")} Users</h3>

        <table border="1" width="100%" cellPadding="6">
          <thead style={{ background: "#f2f2f2" }}>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Salary / Hour</th>
              {hasSpecialColumn && <th>{specialColumnName}</th>}
              <th>Quick Actions</th>
            </tr>
          </thead>

          <tbody>
            {summaries.map((s) => {
              const u = s.user; // IMPORTANT: record field `user`
              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.fullName}</td>
                  <td>{u.salaryPerHour}</td>
                  {hasSpecialColumn && <td>{s.specialValue}</td>}

                  <td>
                    <Link to={`/schedule`}>
                      <button>📅 Schedule</button>
                    </Link>{" "}
                    <Link to={`/people/promote?userId=${u.id}`}>
                      <button>⬆️ Promote</button>
                    </Link>{" "}
                    <button onClick={() => handleDecreasePayrollClick(u.id)}>
                      💰 Decrease Payroll
                    </button>{" "}
                    <button onClick={() => setAddingShiftFor(u.id)}>➕ Add Shift</button>

                    {addingShiftFor === u.id && (
                      <div
                        style={{
                          marginTop: 10,
                          border: "1px solid #ddd",
                          padding: 10,
                          borderRadius: 4,
                        }}
                      >
                        <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
                          {DAYS.map((d, i) => (
                            <option key={i} value={i}>
                              {d}
                            </option>
                          ))}
                        </select>{" "}
                        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />{" "}
                        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />{" "}
                        <button onClick={() => handleAddShift(u.id)}>Add</button>{" "}
                        <button onClick={() => setAddingShiftFor(null)}>Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <h2>👥 People Management</h2>

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

      {selectedUserForPayroll && (
        <div
          style={{
            border: "1px solid #444",
            padding: 20,
            marginBottom: 20,
            background: "transparent",
            color: "#ffffff",
          }}
        >
          <h4>Decrease Payroll for User ID: {selectedUserForPayroll}</h4>
          <p>Current Payroll: ${payrollAmount.toFixed(2)}</p>

          <label>
            Decrease Amount:{" "}
            <input
              type="number"
              value={decreaseAmount}
              onChange={(e) => setDecreaseAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </label>

          <br />
          <button onClick={handleConfirmDecrease}>Confirm Decrease</button>{" "}
          <button onClick={() => setSelectedUserForPayroll(null)}>Cancel</button>
        </div>
      )}

      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {Object.keys(groupedUsers).map((t) => renderTable(t, groupedUsers[t]))}
    </div>
  );
}

export default PeopleList;
