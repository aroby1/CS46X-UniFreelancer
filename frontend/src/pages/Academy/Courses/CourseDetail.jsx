import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiDollarSign } from 'react-icons/fi';
import './CourseDetail.css';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/academy/courses/${id}`);

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

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/academy/courses');
  };

  const getCoursePrice = (course) => {
    if (!course) return 'Free';
    if (course.isLiteVersion) return 'Free (Lite)';
    if (course.priceAmount && course.priceAmount > 0) {
      return `$${course.priceAmount}`;
    }
    return 'Free';
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return duration;
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

  const publishedDate = course?.createdAt
    ? new Date(course.createdAt).toLocaleDateString()
    : null;

  return (
    <div className="course-detail-page">
      <div className="course-detail-container">
        <button className="back-button" onClick={handleBack}>
          ← Back to Courses
        </button>

        {/* Course Header */}
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
                {course.isLiteVersion && <span className="lite-badge">Lite Version</span>}
                <span className="difficulty-badge">{course.difficulty || 'Beginner'}</span>
                <span className="category-badge">{course.category || 'General'}</span>
              </div>
              <h1 className="course-title">{course.title}</h1>

              <div className="course-hero-bottom">
                <div className="course-meta">
                  <div className="course-meta-item">
                    <FiClock className="course-meta-icon" />
                    <div>
                      <span className="course-meta-label">Estimated Time</span>
                      <span className="course-meta-value">{formatDuration(course.duration)}</span>
                    </div>
                  </div>
                  <div className="course-meta-item">
                    <FiDollarSign className="course-meta-icon" />
                    <div>
                      <span className="course-meta-label">Price</span>
                      <span className="course-meta-value">{getCoursePrice(course)}</span>
                    </div>
                  </div>
                </div>

                {publishedDate && (
                  <p className="published-date">Published {publishedDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Overview */}
        <div className="course-section">
          <h2 className="section-title">Course Overview</h2>
          <div className="course-description">
            {course.description ? (
              <p>{course.description}</p>
            ) : (
              <p>No description available for this course.</p>
            )}
          </div>
        </div>

        {/* Instructor Information */}
        {course.instructor && (
          <div className="course-section">
            <h2 className="section-title">Instructor</h2>
            <div className="instructor-info">
              {course.instructor.avatar && (
                <div className="instructor-avatar">
                  <img src={course.instructor.avatar} alt={course.instructor.name} />
                </div>
              )}
              <div className="instructor-details">
                <h3 className="instructor-name">{course.instructor.name}</h3>
                {course.instructor.title && (
                  <p className="instructor-title">{course.instructor.title}</p>
                )}
                {course.instructor.bio && (
                  <p className="instructor-bio">{course.instructor.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Learning Points */}
        {course.learningPoints && course.learningPoints.length > 0 && (
          <div className="course-section">
            <h2 className="section-title">What You'll Learn</h2>
            <ul className="learning-points-list">
              {course.learningPoints.map((point, index) => (
                <li key={index} className="learning-point">
                  <span className="point-icon">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Course Modules */}
        {course.modules && course.modules.length > 0 && (
          <div className="course-section">
            <h2 className="section-title">Course Modules</h2>
            <div className="modules-list">
              {course.modules
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((module, index) => {
                  const isExpanded = expandedModules[module._id || index];
                  return (
                    <div key={module._id || index} className={`module-card ${isExpanded ? 'expanded' : ''}`}>
                      <div className="module-card-header" onClick={() => toggleModule(module._id || index)}>
                        {/* Thumbnail Section */}
                        <div className="module-thumbnail">
                          {module.thumbnail ? (
                            <img src={module.thumbnail} alt={`Module ${index + 1}`} />
                          ) : (
                            <div className="module-placeholder-thumbnail">
                            </div>
                          )}
                        </div>

                        {/* Info Section */}
                        <div className="module-info-compact">
                          <div className="module-number">Module {index + 1}</div>
                          <h3 className="module-title-compact">{module.title}</h3>
                          <div className="module-meta-compact">
                            {(module.duration || module.estimatedMinutes) && (
                              <span className="module-duration-compact">
                                {module.duration || `${module.estimatedMinutes} min`}
                              </span>
                            )}
                          </div>
                          {module.description && (
                            <p className="module-description-preview">
                              {module.description.length > 100
                                ? `${module.description.substring(0, 100)}...`
                                : module.description}
                            </p>
                          )}
                        </div>

                        {/* Toggle Icon */}
                        <div className="module-toggle-icon">
                          {isExpanded ? '−' : '+'}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <div className={`module-details-expanded ${isExpanded ? 'expanded' : ''}`}>
                        {module.description && (
                          <div className="module-full-description">
                            <h4 className="module-subtitle">Overview</h4>
                            <p>{module.description}</p>
                          </div>
                        )}

                        {module.learningPoints && module.learningPoints.length > 0 && (
                          <div className="module-learning-points">
                            <h4 className="module-subtitle">Learning Outcomes</h4>
                            <ul className="module-points-list">
                              {module.learningPoints.map((point, pointIndex) => (
                                <li key={pointIndex}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="module-content">
                          {module.videoUrl && (
                            <div className="content-item">
                              <span className="content-icon">🎥</span>
                              <a href={module.videoUrl} target="_blank" rel="noopener noreferrer" className="content-link">
                                Video Content
                              </a>
                            </div>
                          )}
                          {module.articleContent && (
                            <div className="content-item">
                              <span className="content-icon">📄</span>
                              <span className="content-text">Article Content Available</span>
                            </div>
                          )}
                          {module.pdfUrl && (
                            <div className="content-item">
                              <span className="content-icon">📕</span>
                              <a href={module.pdfUrl} target="_blank" rel="noopener noreferrer" className="content-link">
                                PDF Resource
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Course Actions */}
        <div className="course-actions">
          <button className="enroll-button">Enroll in Course</button>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
