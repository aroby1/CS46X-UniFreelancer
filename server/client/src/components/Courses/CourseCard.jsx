import React from "react";
import { useNavigate } from "react-router-dom";
import "./CourseCard.css";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="course-card">
      <div className="course-card-body">
        <h3>{course.title}</h3>
        <p>{course.description?.slice(0, 100)}...</p>

        <button
          onClick={() => navigate(`/academy/courses/${course._id}`)}
        >
          Go to Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
