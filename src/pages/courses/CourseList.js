import React, { useEffect, useState } from "react";
import { getAllCourses } from "../../api/inventoryApi";
import { Link, useLocation } from "react-router-dom";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const location = useLocation();

  useEffect(() => {
    getAllCourses().then(data => {
      console.log("📥 COURSES FETCHED:", data);
      setCourses(data);
    });
  }, [location.pathname]); // 🔑 create sonrası otomatik refresh

  return (
    <div>
      <h2>Courses</h2>

      <Link to="/courses/create">➕ Add Course</Link>
      <br /><br />

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map(course => (
            <tr key={course.courseName}>
              <td>{course.courseName}</td>
              <td>{course.price}</td>
              <td>{course.type}</td>
              <td>
                <Link to={`/courses/edit/${course.courseName}`}>Edit</Link>{" "}
                <Link to={`/courses/${course.courseName}/ingredients`}>
                  Ingredients
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseList;
