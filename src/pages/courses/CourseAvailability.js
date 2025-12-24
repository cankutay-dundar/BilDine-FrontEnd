import React, { useEffect, useState } from "react";
import { checkCourseAvailability } from "../../api/inventoryApi";
import { useParams } from "react-router-dom";

function CourseAvailability() {
  const { courseName } = useParams();
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    checkCourseAvailability(courseName)
      .then(res => setAvailable(res.available));
  }, [courseName]);

  return (
    <div>
      <h2>Availability</h2>
      <p>
        {available
          ? "✅ Course can be prepared"
          : "❌ Insufficient ingredients"}
      </p>
    </div>
  );
}

export default CourseAvailability;
