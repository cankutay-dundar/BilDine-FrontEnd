import { useEffect, useState } from "react";
import { getAllUsers, getUserKindByUserId, getUserSpecialValue, getPayrollAmount, decreasePayroll } from "../../api/peopleApi";
import { Link } from "react-router-dom";

function PeopleList() {
  const [users, setUsers] = useState([]);
  const [selectedUserForPayroll, setSelectedUserForPayroll] = useState(null);
  const [payrollAmount, setPayrollAmount] = useState(0);
  const [decreaseAmount, setDecreaseAmount] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllUsers();
      const enhancedUsers = await Promise.all(
        fetchedUsers.map(async (u) => {
          try {
            const kind = await getUserKindByUserId(u.id);
            const specialValue = await getUserSpecialValue(u.id);
            return { ...u, kind, specialValue };
          } catch (error) {
            console.error(`Error fetching details for user ${u.id}:`, error);
            return { ...u, kind: 'BASE_USER', specialValue: '' };
          }
        })
      );
      setUsers(enhancedUsers);
    };
    fetchUsers();
  }, []);

  const handleDecreasePayrollClick = async (userId) => {
    try {
      const amount = await getPayrollAmount(userId);
      setPayrollAmount(amount);
      setSelectedUserForPayroll(userId);
      setDecreaseAmount('');
    } catch (error) {
      alert('Failed to fetch payroll amount');
    }
  };

  const handleConfirmDecrease = async () => {
    if (!decreaseAmount || isNaN(decreaseAmount) || decreaseAmount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }
    try {
      await decreasePayroll(selectedUserForPayroll, parseFloat(decreaseAmount));
      alert('Payroll decreased successfully');
      setSelectedUserForPayroll(null);
      // Optionally refresh users or update payroll
    } catch (error) {
      alert('Failed to decrease payroll');
    }
  };

  const handleCancelDecrease = () => {
    setSelectedUserForPayroll(null);
  };

  const groupedUsers = {
    MANAGER: [],
    KITCHEN_STAFF: [],
    DELIVERER: [],
    CLEANER: [],
    BASE_USER: []
  };

  users.forEach(u => {
    if (groupedUsers[u.kind]) {
      groupedUsers[u.kind].push(u);
    } else {
      groupedUsers.BASE_USER.push(u);
    }
  });

  const specialColumnNames = {
    MANAGER: 'Level',
    KITCHEN_STAFF: 'Kitchen Role',
    DELIVERER: 'Deliverer Type',
    CLEANER: 'Duty'
  };

  const renderTable = (userType, userList) => {
    if (userList.length === 0) return null;
    const hasSpecialColumn = userType !== 'BASE_USER';
    const specialColumnName = specialColumnNames[userType] || '';

    return (
      <div key={userType} style={{ marginBottom: 40 }}>
        <h3>{userType.replace('_', ' ')} Users</h3>
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
            {userList.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.fullName}</td>
                <td>{u.salaryPerHour}</td>
                {hasSpecialColumn && <td>{u.specialValue}</td>}
                <td>
                  <Link to={`/schedule`}>
                    <button>📅 Schedule</button>
                  </Link>{" "}
                  <Link to={`/people/promote?userId=${u.id}`}>
                    <button>⬆️ Promote</button>
                  </Link>{" "}
                  <button onClick={() => handleDecreasePayrollClick(u.id)}>💰 Decrease Payroll</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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

      {/* PAYROLL DECREASE FORM */}
      {selectedUserForPayroll && (
        <div style={{ border: '1px solid #ccc', padding: 20, marginBottom: 20, background: '#f9f9f9' }}>
          <h4>Decrease Payroll for User ID: {selectedUserForPayroll}</h4>
          <p>Current Payroll: ${payrollAmount.toFixed(2)}</p>
          <label>
            Decrease Amount: 
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
          <button onClick={handleCancelDecrease}>Cancel</button>
        </div>
      )}

      {/* USERS TABLES */}
      {Object.keys(groupedUsers).map(userType => renderTable(userType, groupedUsers[userType]))}
    </div>
  );
}

export default PeopleList;
