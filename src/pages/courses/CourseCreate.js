import React, { useState } from "react";
import { createCourse } from "../../api/inventoryApi";
import { useNavigate } from "react-router-dom";

function CourseCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    courseName: "",
    price: 0,
    type: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🟡 COURSE FORM STATE:", form);

    try {
      const res = await createCourse(form);
      console.log("🟢 COURSE CREATED:", res);
      navigate("/courses");
    } catch (err) {
      console.error("🔴 CREATE COURSE ERROR:", err);
      alert("Course could not be created");
    }
  };

  return (
    <div>
      <h2>Create Course</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="courseName"
          placeholder="Course Name"
          value={form.courseName}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="type"
          placeholder="Type (Main, Dessert, Drink)"
          value={form.type}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default CourseCreate;
