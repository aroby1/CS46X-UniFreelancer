import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../../components/Courses/CourseCard";
import "./MyCourses.css";

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/profile`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setCourses(data.enrolledCourses || []);
      } catch (err) {
        console.error("Failed to fetch enrolled courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [navigate]);

  if (loading) {
    return <div className="my-courses-loading">Loading your courses…</div>;
  }

  return (
    <div className="my-courses-page">
      <h1>My Courses</h1>

      {courses.length === 0 ? (
        <p>You are not enrolled in any courses yet.</p>
      ) : (
        <div className="my-courses-grid">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
