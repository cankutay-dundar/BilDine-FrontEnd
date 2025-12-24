import React, { useEffect, useState } from "react";
import { getAllCourses, updateCourse } from "../../api/inventoryApi";
import { useParams, useNavigate } from "react-router-dom";

function CourseEdit() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    getAllCourses().then(list => {
      const found = list.find(c => c.courseName === name);
      setCourse(found);
    });
  }, [name]);

  if (!course) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateCourse(name, {
      price: course.price,
      type: course.type
    });

    navigate("/courses");
  };

  return (
    <div>
      <h2>Edit Course: {course.courseName}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="price"
          type="number"
          step="0.01"
          value={course.price}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="type"
          value={course.type}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default CourseEdit;
