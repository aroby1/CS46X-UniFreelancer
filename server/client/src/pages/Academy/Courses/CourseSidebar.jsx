import React, { useState } from 'react';
import './CourseLearning.css';

function CourseSidebar({ course, progress, currentLesson, onLessonSelect }) {
  const [expandedModules, setExpandedModules] = useState(
    course.modules.reduce((acc, module, index) => {
      acc[module._id] = index === 0; // Expand first module by default
      return acc;
    }, {})
  );

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const isLessonCompleted = (lessonId) => {
    return progress?.completedLessons?.includes(lessonId);
  };

  const isLessonAccessible = (module, lesson) => {
    // First lesson is always accessible
    const moduleIndex = course.modules.findIndex(m => m._id === module._id);
    const lessonIndex = module.lessons.findIndex(l => l._id === lesson._id);
    
    if (moduleIndex === 0 && lessonIndex === 0) return true;

    // Get all previous lessons
    const allLessons = [];
    for (let i = 0; i < course.modules.length; i++) {
      for (let j = 0; j < course.modules[i].lessons.length; j++) {
        if (i < moduleIndex || (i === moduleIndex && j < lessonIndex)) {
          allLessons.push(course.modules[i].lessons[j]._id);
        }
      }
    }

    // Check if all previous lessons are completed
    return allLessons.every(id => isLessonCompleted(id));
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return '▶️';
      case 'assignment':
        return '📝';
      case 'quiz':
        return '❓';
      default:
        return '📄';
    }
  };

  return (
    <div className="course-sidebar">
      <div className="sidebar-header">
        <h3>Course Content</h3>
      </div>

      <div className="modules-list">
        {course.modules.map((module, moduleIndex) => (
          <div key={module._id} className="module-item">
            <div
              className="module-header"
              onClick={() => toggleModule(module._id)}
            >
              <div className="module-title">
                <span className="module-number">Module {moduleIndex + 1}</span>
                <span className="module-name">{module.title}</span>
              </div>
              <span className="expand-icon">
                {expandedModules[module._id] ? '−' : '+'}
              </span>
            </div>

            {expandedModules[module._id] && (
              <div className="lessons-list">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isCompleted = isLessonCompleted(lesson._id);
                  const isAccessible = isLessonAccessible(module, lesson);
                  const isCurrent = currentLesson?._id === lesson._id;

                  return (
                    <div
                      key={lesson._id}
                      className={`lesson-item ${isCurrent ? 'current' : ''} ${
                        !isAccessible ? 'locked' : ''
                      } ${isCompleted ? 'completed' : ''}`}
                      onClick={() => {
                        if (isAccessible) {
                          onLessonSelect(module, lesson);
                        }
                      }}
                    >
                      <div className="lesson-content">
                        <span className="lesson-icon">
                          {isCompleted ? '✅' : getLessonIcon(lesson.type)}
                        </span>
                        <div className="lesson-info">
                          <div className="lesson-title">{lesson.title}</div>
                          <div className="lesson-meta">
                            {lesson.duration && (
                              <span className="lesson-duration">
                                {lesson.duration}
                              </span>
                            )}
                            <span className="lesson-type">
                              {lesson.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!isAccessible && (
                        <span className="lock-icon">🔒</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {course.finalTest && course.finalTest.questions.length > 0 && (
          <div className="module-item final-test-item">
            <div className="module-header">
              <div className="module-title">
                <span className="module-name">📋 Final Test</span>
              </div>
              <span className="test-badge">Required</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseSidebar;