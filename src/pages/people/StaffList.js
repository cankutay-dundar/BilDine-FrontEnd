import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/peopleApi";

export default function StaffList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  return (
    <>
      <h2>Staff & Managers</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Salary / Hour</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullName}</td>
              <td>{u.salaryPerHour}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
