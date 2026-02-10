const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/profile`,
          { credentials: "include" }
        );

        if (res.status === 401) {
          navigate("/login?returnTo=/academy/my-courses");
          return;
        }

        const data = await res.json();
        setCourses(data.enrolledCourses || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [navigate]);

  if (loading) return <p>Loading your courses…</p>;

  return (
    <div className="courses-page">
      <h1>My Courses</h1>

      {courses.length === 0 ? (
        <p>You are not enrolled in any courses yet.</p>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
