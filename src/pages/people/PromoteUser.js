import { useState } from "react";
import { promoteToStaff, promoteToManager } from "../../api/peopleApi";

function PromoteUser() {
  const [userId, setUserId] = useState("");
  const [level, setLevel] = useState(1);

  return (
    <div>
      <h2>Promote User</h2>

      <input
        placeholder="User ID"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />

      <br /><br />

      <button onClick={() => promoteToStaff(userId)}>
        Promote to Staff
      </button>

      <br /><br />

      <input
        type="number"
        placeholder="Manager Level"
        value={level}
        onChange={e => setLevel(e.target.value)}
      />

      <button onClick={() => promoteToManager(userId, level)}>
        Promote to Manager
      </button>
    </div>
  );
}

export default PromoteUser;
