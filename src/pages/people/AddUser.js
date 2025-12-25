import { useState } from "react";
import { registerUser } from "../../api/peopleApi";

function AddUser() {
  const [form, setForm] = useState({
    fullName: "",
    password: "",
    salaryPerHour: "",
    hireDate: "",
    kind: "MANAGER",
  });
  const [subtypeData, setSubtypeData] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubtypeChange = (e) => {
    setSubtypeData(e.target.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    // Validate hireDate format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(form.hireDate)) {
      alert("Hire Date must be in YYYY-MM-DD format");
      return;
    }
    try {
      await registerUser({
        ...form,
        salaryPerHour: Number(form.salaryPerHour),
        subtypeData: subtypeData,
      });
      alert("User registered");
      setForm({ fullName: "", password: "", salaryPerHour: "", hireDate: "", kind: "MANAGER" });
      setSubtypeData("");
    } catch (err) {
      alert("Failed: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={submit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
          style={{ color: '#222', background: '#fff' }}
        />
        <input
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ color: '#222', background: '#fff' }}
        />
        <input
          type="number"
          name="salaryPerHour"
          placeholder="Salary / Hour"
          value={form.salaryPerHour}
          onChange={handleChange}
          required
          style={{ color: '#222', background: '#fff' }}
        />
        <input
          type="date"
          name="hireDate"
          placeholder="Hire Date"
          value={form.hireDate}
          onChange={handleChange}
          required
          style={{ color: '#222', background: '#fff' }}
        />
        <select name="kind" value={form.kind} onChange={handleChange} required>
          <option value="MANAGER">Manager</option>
          <option value="KITCHEN_STAFF">Kitchen Staff</option>
          <option value="DELIVERER">Deliverer</option>
          <option value="CLEANER">Cleaner</option>
          <option value="BASE_USER">Base User</option>
        </select>
        <label style={{ display: "block", marginTop: 10 }}>
          {form.kind === "MANAGER"
            ? "Manager Level (integer)"
            : form.kind === "KITCHEN_STAFF"
            ? "Kitchen Role (string)"
            : form.kind === "DELIVERER"
            ? "Deliverer Type (string)"
            : form.kind === "CLEANER"
            ? "Area (string)"
            : "Special Info (string)"}
          <input
            type="text"
            name="subtypeData"
            placeholder={form.kind === "MANAGER" ? "e.g. 1" : "e.g. kitchen"}
            value={subtypeData}
            onChange={handleSubtypeChange}
            style={{ width: "100%", color: '#222', background: '#fff' }}
          />
        </label>
        <button>Add</button>
      </form>
    </div>
  );
}

export default AddUser;
