/* global process */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiDollarSign, FiBook, FiHeadphones, FiVideo } from 'react-icons/fi';
import './CourseDetail.css';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [enrolling, setEnrolling] = useState(false);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/academy/courses/${id}`);
        if (!response.ok) {
          throw new Error('Course not found');
        }
        const data = await response.json();
        setCourse(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  useEffect(() => {
    if (user && course) {
      const enrolled = user.enrolledCourses?.includes(course._id);
      setIsEnrolled(enrolled);
    }
  }, [user, course]);

  const handleBack = () => {
    navigate('/academy/courses');
  };

  const handleContinueLearning = () => {
    navigate(`/academy/courses/${id}/learn`);
  };

  const handleEnroll = async () => {
    if (!course) {
      console.warn("handleEnroll called with no course");
      return;
    }

    if (!user) {
      navigate(`/login?returnTo=/academy/courses/${id}`);
      return;
    }

    try {
      setEnrolling(true);

      const res = await fetch(
        "/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            courseId: course._id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      if (data.free) {
        alert("You've been enrolled in this free course!");
        setIsEnrolled(true);
        const userRes = await fetch('/api/users/me', { credentials: 'include' });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Invalid response from server");

    } catch (err) {
      console.error("Enrollment failed:", err);
      alert(`Enrollment failed: ${err.message}`);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="course-detail-page">
        <div className="course-detail-container">
          <div className="loading-message">Loading course...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-page">
        <div className="course-detail-container">
          <button className="back-button" onClick={handleBack}>
            ← Back to Courses
          </button>
          <div className="error-message">
            <h2>Course Not Found</h2>
            <p>{error || 'The course you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="course-detail-container">
        <button className="back-button" onClick={handleBack}>
          ← Back to Courses
        </button>

        <div className="course-header-section">
          <div className="course-hero">
            <div className="course-hero-image">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} />
              ) : (
                <div className="placeholder-hero-image">📚</div>
              )}
            </div>

            <div className="course-hero-content">
              <div className="course-badges">
                {course.isLiteVersion && (
                  <span className="lite-badge">Lite Version</span>
                )}
                <span className="difficulty-badge">
                  {course.difficulty || "Beginner"}
                </span>
                <span className="category-badge">
                  {course.category || "General"}
                </span>
              </div>

              <h1>{course.title}</h1>

              <div className="course-meta">
                <div>
                  <FiClock /> {course.duration || "N/A"}
                </div>
                <div>
                  <FiDollarSign />{" "}
                  {course.isFree ? "Free" : `$${course.priceAmount}`}
                </div>
              </div>

              {course.instructor && (
                <div className="instructor-info">
                  <div className="instructor-avatar">
                    {course.instructor.avatar ? (
                      <img src={course.instructor.avatar} alt={course.instructor.name} />
                    ) : (
                      <div className="avatar-placeholder">👤</div>
                    )}
                  </div>
                  <div className="instructor-details">
                    <strong>{course.instructor.name}</strong>
                    {course.instructor.title && <span>{course.instructor.title}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="course-section">
          <h2>Course Overview</h2>
          <p>{course.description}</p>
        </div>

        {course.modules?.length > 0 && (
          <div className="course-section">
            <h2>Course Modules</h2>

            {course.modules.map((module, index) => {
              const key = module._id || index;

              return (
                <div key={key} className="module-card">
                  <div
                    className="module-card-header"
                    onClick={() => toggleModule(key)}
                  >
                    <div className="module-title-section">
                      <h3>Module {index + 1}: {module.title}</h3>
                      <p className="module-description">{module.description}</p>
                    </div>
                    <span className="toggle-icon">{expandedModules[key] ? "−" : "+"}</span>
                  </div>

                  {expandedModules[key] && (
                    <div className="module-content">
                      {/* Learning Outcomes */}
                      {module.learningOutcomes && module.learningOutcomes.length > 0 && (
                        <div className="module-section">
                          <h4>📋 Learning Outcomes</h4>
                          <ul className="learning-outcomes-list">
                            {module.learningOutcomes.map((outcome, idx) => (
                              <li key={idx}>{outcome}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Learning Materials */}
                      {module.learningMaterials && (
                        <div className="module-section">
                          <h4>📚 Learning Materials</h4>
                          
                          {/* Readings */}
                          {module.learningMaterials.readings?.length > 0 && (
                            <div className="materials-subsection">
                              <h5><FiBook /> Readings</h5>
                              <ul className="materials-list">
                                {module.learningMaterials.readings.map((reading, idx) => (
                                  <li key={idx}>
                                    <strong>{reading.title}</strong>
                                    {reading.author && <span className="author"> by {reading.author}</span>}
                                    <div className="citation">{reading.citation}</div>
                                    {reading.link && (
                                      <a href={reading.link} target="_blank" rel="noopener noreferrer">
                                        View Resource →
                                      </a>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Podcasts */}
                          {module.learningMaterials.podcasts?.length > 0 && (
                            <div className="materials-subsection">
                              <h5><FiHeadphones /> Podcasts</h5>
                              <ul className="materials-list">
                                {module.learningMaterials.podcasts.map((podcast, idx) => (
                                  <li key={idx}>
                                    {podcast.title && <strong>{podcast.title}</strong>}
                                    <a href={podcast.link} target="_blank" rel="noopener noreferrer">
                                      Listen to Podcast →
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Videos */}
                          {module.learningMaterials.videos?.length > 0 && (
                            <div className="materials-subsection">
                              <h5><FiVideo /> Videos</h5>
                              <ul className="materials-list">
                                {module.learningMaterials.videos.map((video, idx) => (
                                  <li key={idx}>
                                    {video.title && <strong>{video.title}</strong>}
                                    <a href={video.link} target="_blank" rel="noopener noreferrer">
                                      Watch Video →
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Assignment */}
                      {module.assignment && (
                        <div className="module-section assignment-section">
                          <h4>📝 Assignment: {module.assignment.title}</h4>
                          <p className="assignment-purpose"><strong>Purpose:</strong> {module.assignment.purpose}</p>
                          
                          {module.assignment.instructions && (
                            <p className="assignment-instructions">{module.assignment.instructions}</p>
                          )}

                          {module.assignment.parts && module.assignment.parts.length > 0 && (
                            <div className="assignment-parts">
                              <h5>Assignment Parts:</h5>
                              {module.assignment.parts.map((part, idx) => (
                                <div key={idx} className="assignment-part">
                                  <strong>Part {part.partNumber}: {part.title}</strong>
                                  <p>{part.instructions}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {module.assignment.gradingCriteria && module.assignment.gradingCriteria.length > 0 && (
                            <div className="grading-criteria">
                              <h5>Grading Criteria:</h5>
                              <ul>
                                {module.assignment.gradingCriteria.map((criterion, idx) => (
                                  <li key={idx}>
                                    {criterion.name} ({criterion.points} pts)
                                  </li>
                                ))}
                              </ul>
                              <p className="total-points">
                                <strong>Total Points:</strong> {module.assignment.gradingCriteria.reduce((sum, c) => sum + c.points, 0)}
                              </p>
                            </div>
                          )}

                          {module.assignment.deliverableFormat && (
                            <p className="deliverable-format">
                              <strong>Deliverable Format:</strong> {module.assignment.deliverableFormat}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isEnrolled ? (
          <button
            className="continue-learning-button"
            onClick={handleContinueLearning}
          >
            Continue Learning →
          </button>
        ) : (
          <button
            className="enroll-button"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {course.isFree
              ? enrolling ? "Enrolling..." : "Enroll Free"
              : enrolling
              ? "Starting Checkout..."
              : `Enroll for $${course.priceAmount}`}
          </button>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;