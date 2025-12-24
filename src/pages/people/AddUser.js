import { useState } from "react";
import { addUser } from "../../api/peopleApi";

function AddUser() {
  const [form, setForm] = useState({
    fullName: "",
    password: "",
    salaryPerHour: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    await addUser({
      ...form,
      salaryPerHour: Number(form.salaryPerHour)
    });
    alert("User added");
    setForm({ fullName: "", password: "", salaryPerHour: "" });
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
        />

        <input
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salaryPerHour"
          placeholder="Salary / Hour"
          value={form.salaryPerHour}
          onChange={handleChange}
          required
        />

        <button>Add</button>
      </form>
    </div>
  );
}

export default AddUser;
