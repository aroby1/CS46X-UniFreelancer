import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './CreateCourse.css';
import ImageUpload from '../../../components/ImageUpload';

function CreateCourse() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    duration: '',
    difficulty: 'Beginner',
    category: '',
    thumbnail: '',
    isLiteVersion: false,
    instructor: {
      name: '',
      title: '',
      bio: '',
      avatar: ''
    },
    pricing: {
      amount: 0,
      currency: 'USD',
      type: 'one-time'
    },
    learningPoints: [],
    modules: [],
    finalTest: {
      title: 'Final Test',
      description: '',
      passingScore: 70,
      timeLimit: 0,
      questions: []
    },
    badge: {
      name: '',
      description: '',
      color: '#4F46E5',
      imageUrl: ''
    }
  });

  const [newLearningPoint, setNewLearningPoint] = useState('');
  const [currentModule, setCurrentModule] = useState({
    title: '',
    description: '',
    order: 0,
    lessons: []
  });
  const [currentLesson, setCurrentLesson] = useState({
    type: 'video',
    title: '',
    order: 0,
    videoUrl: '',
    duration: '',
    assignmentType: 'text',
    instructions: '',
    questions: [],
    passingScore: 70
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    questionType: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  const steps = ['Basic Info', 'Instructor', 'Pricing', 'Content', 'Modules', 'Final Test', 'Badge'];

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setCourseData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setCourseData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addLearningPoint = () => {
    if (newLearningPoint.trim()) {
      setCourseData(prev => ({
        ...prev,
        learningPoints: [...prev.learningPoints, newLearningPoint]
      }));
      setNewLearningPoint('');
    }
  };

  const removeLearningPoint = (index) => {
    setCourseData(prev => ({
      ...prev,
      learningPoints: prev.learningPoints.filter((_, i) => i !== index)
    }));
  };

  const addQuestionToLesson = () => {
    if (!currentQuestion.question) {
      alert('Please enter a question');
      return;
    }
    if (currentQuestion.questionType === 'multiple-choice' && currentQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill in all answer options');
      return;
    }
    if (!currentQuestion.correctAnswer) {
      alert('Please specify the correct answer');
      return;
    }

    setCurrentLesson(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));

    setCurrentQuestion({
      question: '',
      questionType: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });
  };

  const removeQuestionFromLesson = (index) => {
    setCurrentLesson(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const addLesson = () => {
    if (!currentLesson.title) {
      alert('Please enter a lesson title');
      return;
    }

    const lesson = { ...currentLesson, order: currentModule.lessons.length };
    setCurrentModule(prev => ({
      ...prev,
      lessons: [...prev.lessons, lesson]
    }));

    setCurrentLesson({
      type: 'video',
      title: '',
      order: 0,
      videoUrl: '',
      duration: '',
      assignmentType: 'text',
      instructions: '',
      questions: [],
      passingScore: 70
    });
  };

  const removeLesson = (index) => {
    setCurrentModule(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index)
    }));
  };

  const addModule = () => {
    if (!currentModule.title) {
      alert('Please enter a module title');
      return;
    }
    if (currentModule.lessons.length === 0) {
      alert('Please add at least one lesson to the module');
      return;
    }

    const module = { ...currentModule, order: courseData.modules.length };
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, module]
    }));

    setCurrentModule({
      title: '',
      description: '',
      order: 0,
      lessons: []
    });
  };

  const removeModule = (index) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const addQuestionToTest = () => {
    if (!currentQuestion.question) {
      alert('Please enter a question');
      return;
    }
    if (currentQuestion.options.some(opt => !opt.trim())) {
      alert('Please fill in all answer options');
      return;
    }
    if (currentQuestion.correctAnswer === '') {
      alert('Please specify the correct answer');
      return;
    }

    setCourseData(prev => ({
      ...prev,
      finalTest: {
        ...prev.finalTest,
        questions: [...prev.finalTest.questions, {
          question: currentQuestion.question,
          options: currentQuestion.options,
          correctAnswer: parseInt(currentQuestion.correctAnswer),
          points: currentQuestion.points
        }]
      }
    }));

    setCurrentQuestion({
      question: '',
      questionType: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });
  };

  const removeQuestionFromTest = (index) => {
    setCourseData(prev => ({
      ...prev,
      finalTest: {
        ...prev.finalTest,
        questions: prev.finalTest.questions.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!courseData.title || !courseData.description) {
        alert('Please fill in all required fields');
        return;
      }
      if (!courseData.instructor.name) {
        alert('Please fill in instructor information');
        return;
      }
      if (courseData.modules.length === 0) {
        alert('Please add at least one module');
        return;
      }

      const res = await fetch('/api/academy/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(courseData)
      });

      if (!res.ok) throw new Error('Failed to create course');

      alert('Course created successfully!');
      navigate('/academy/courses');

    } catch (err) {
      console.error('Error creating course:', err);
      alert('Failed to create course');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section">
            <h2>Course Information</h2>
            <p className="section-subtitle">Basic details about your course</p>

            <div className="form-group">
              <label>Course Title *</label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => handleInputChange(null, 'title', e.target.value)}
                placeholder="e.g., Complete Digital Marketing Masterclass"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={courseData.description}
                onChange={(e) => handleInputChange(null, 'description', e.target.value)}
                placeholder="Describe what students will learn in this course..."
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={courseData.duration}
                  onChange={(e) => handleInputChange(null, 'duration', e.target.value)}
                  placeholder="e.g., 12 weeks"
                />
              </div>

              <div className="form-group">
                <label>Difficulty Level</label>
                <select
                  value={courseData.difficulty}
                  onChange={(e) => handleInputChange(null, 'difficulty', e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={courseData.category}
                onChange={(e) => handleInputChange(null, 'category', e.target.value)}
                placeholder="e.g., Digital Marketing"
              />
            </div>

            <ImageUpload
              value={courseData.thumbnail}
              onChange={(url) => handleInputChange(null, 'thumbnail', url)}
              label="Course Thumbnail"
            />

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={courseData.isLiteVersion}
                  onChange={(e) => handleInputChange(null, 'isLiteVersion', e.target.checked)}
                />
                This is a Lite version (free tier with limited content)
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <h2>Instructor Information</h2>
            <p className="section-subtitle">Details about the course instructor</p>

            <div className="form-group">
              <label>Instructor Name *</label>
              <input
                type="text"
                value={courseData.instructor.name}
                onChange={(e) => handleInputChange('instructor', 'name', e.target.value)}
                placeholder="e.g., Alina Padilla-Miller"
              />
            </div>

            <div className="form-group">
              <label>Instructor Title/Role</label>
              <input
                type="text"
                value={courseData.instructor.title}
                onChange={(e) => handleInputChange('instructor', 'title', e.target.value)}
                placeholder="e.g., Senior Freelance Designer"
              />
            </div>

            <div className="form-group">
              <label>Instructor Bio</label>
              <textarea
                value={courseData.instructor.bio}
                onChange={(e) => handleInputChange('instructor', 'bio', e.target.value)}
                placeholder="Short overview of the instructor's background..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Instructor Avatar URL</label>
              <ImageUpload
                value={courseData.instructor.avatar}
                onChange={(url) => handleInputChange('instructor', 'avatar', url)}
                label="Instructor Avatar"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <h2>Pricing Details</h2>
            <p className="section-subtitle">Set the price for your course. Leave blank for free courses</p>

            <div className="form-row">
              <div className="form-group">
                <label>Price Amount</label>
                <input
                  type="number"
                  value={courseData.pricing.amount}
                  onChange={(e) => handleInputChange('pricing', 'amount', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 199"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select
                  value={courseData.pricing.currency}
                  onChange={(e) => handleInputChange('pricing', 'currency', e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Pricing Type</label>
              <select
                value={courseData.pricing.type}
                onChange={(e) => handleInputChange('pricing', 'type', e.target.value)}
              >
                <option value="one-time">One-time payment</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-section">
            <h2>Course Content</h2>
            <p className="section-subtitle">Add key learning points for your course</p>

            <div className="form-group">
              <label>Learning Points</label>
              <div className="add-item-container">
                <input
                  type="text"
                  value={newLearningPoint}
                  onChange={(e) => setNewLearningPoint(e.target.value)}
                  placeholder="e.g., Master social media marketing strategies"
                  onKeyPress={(e) => e.key === 'Enter' && addLearningPoint()}
                />
                <button type="button" onClick={addLearningPoint} className="add-button">
                  Add Point
                </button>
              </div>
            </div>

            {courseData.learningPoints.length > 0 && (
              <div className="items-list">
                {courseData.learningPoints.map((point, index) => (
                  <div key={index} className="list-item">
                    <span>{point}</span>
                    <button onClick={() => removeLearningPoint(index)} className="remove-button">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {courseData.learningPoints.length === 0 && (
              <p className="empty-state">No learning points added yet. Add some to help students understand what they'll learn!</p>
            )}
          </div>
        );

      case 5:
        return (
          <div className="form-section">
            <h2>Course Modules</h2>
            <p className="section-subtitle">Organize your course into structured modules with lessons</p>

            <div className="module-form">
              <h3>Add New Module</h3>
              
              <div className="form-group">
                <label>Module Title *</label>
                <input
                  type="text"
                  value={currentModule.title}
                  onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                  placeholder="e.g., Introduction to Digital Marketing"
                />
              </div>

              <div className="form-group">
                <label>Module Description</label>
                <textarea
                  value={currentModule.description}
                  onChange={(e) => setCurrentModule({ ...currentModule, description: e.target.value })}
                  placeholder="Brief description of what this module covers..."
                  rows={3}
                />
              </div>

              <div className="lesson-section">
                <h4>Module Lessons</h4>

                <div className="form-group">
                  <label>Lesson Type</label>
                  <select
                    value={currentLesson.type}
                    onChange={(e) => setCurrentLesson({ ...currentLesson, type: e.target.value })}
                  >
                    <option value="video">Video</option>
                    <option value="assignment">Assignment</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Lesson Title *</label>
                  <input
                    type="text"
                    value={currentLesson.title}
                    onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                    placeholder="e.g., Course Overview & Welcome"
                  />
                </div>

                {currentLesson.type === 'video' && (
                  <>
                    <div className="form-group">
                      <label>Video URL</label>
                      <input
                        type="text"
                        value={currentLesson.videoUrl}
                        onChange={(e) => setCurrentLesson({ ...currentLesson, videoUrl: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="text"
                        value={currentLesson.duration}
                        onChange={(e) => setCurrentLesson({ ...currentLesson, duration: e.target.value })}
                        placeholder="e.g., 12 min"
                      />
                    </div>
                  </>
                )}

                {currentLesson.type === 'assignment' && (
                  <>
                    <div className="form-group">
                      <label>Assignment Type</label>
                      <select
                        value={currentLesson.assignmentType}
                        onChange={(e) => setCurrentLesson({ ...currentLesson, assignmentType: e.target.value })}
                      >
                        <option value="text">Text Submission</option>
                        <option value="file">File Upload</option>
                        <option value="both">Both Text & File</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Instructions</label>
                      <textarea
                        value={currentLesson.instructions}
                        onChange={(e) => setCurrentLesson({ ...currentLesson, instructions: e.target.value })}
                        placeholder="Instructions for the assignment..."
                        rows={4}
                      />
                    </div>
                  </>
                )}

                {currentLesson.type === 'quiz' && (
                  <>
                    <div className="form-group">
                      <label>Passing Score (%)</label>
                      <input
                        type="number"
                        value={currentLesson.passingScore}
                        onChange={(e) => setCurrentLesson({ ...currentLesson, passingScore: parseInt(e.target.value) })}
                        min="0"
                        max="100"
                      />
                    </div>

                    <div className="question-builder">
                      <h5>Quiz Questions</h5>

                      <div className="form-group">
                        <label>Question Type</label>
                        <select
                          value={currentQuestion.questionType}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionType: e.target.value })}
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="short-answer">Short Answer</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Question</label>
                        <input
                          type="text"
                          value={currentQuestion.question}
                          onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                          placeholder="Enter your question..."
                        />
                      </div>

                      {currentQuestion.questionType === 'multiple-choice' ? (
                        <>
                          <div className="form-group">
                            <label>Answer Options</label>
                            {currentQuestion.options.map((option, index) => (
                              <input
                                key={index}
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...currentQuestion.options];
                                  newOptions[index] = e.target.value;
                                  setCurrentQuestion({ ...currentQuestion, options: newOptions });
                                }}
                                placeholder={`Option ${index + 1}`}
                                style={{ marginBottom: '8px' }}
                              />
                            ))}
                          </div>

                          <div className="form-group">
                            <label>Correct Answer</label>
                            <select
                              value={currentQuestion.correctAnswer}
                              onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                            >
                              <option value="">Select correct answer...</option>
                              {currentQuestion.options.map((option, index) => (
                                <option key={index} value={index}>{option || `Option ${index + 1}`}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      ) : (
                        <div className="form-group">
                          <label>Correct Answer</label>
                          <input
                            type="text"
                            value={currentQuestion.correctAnswer}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                            placeholder="Enter the correct answer..."
                          />
                        </div>
                      )}

                      <button type="button" onClick={addQuestionToLesson} className="add-button">
                        Add Question
                      </button>

                      {currentLesson.questions.length > 0 && (
                        <div className="items-list">
                          {currentLesson.questions.map((q, index) => (
                            <div key={index} className="list-item">
                              <span>{q.question}</span>
                              <button onClick={() => removeQuestionFromLesson(index)} className="remove-button">
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <button type="button" onClick={addLesson} className="add-button" style={{ marginTop: '15px' }}>
                  + Add Lesson to Module
                </button>

                {currentModule.lessons.length > 0 && (
                  <div className="items-list">
                    <h5>Lessons in this module:</h5>
                    {currentModule.lessons.map((lesson, index) => (
                      <div key={index} className="list-item">
                        <span>
                          {lesson.type === 'video' && '▶️'}
                          {lesson.type === 'assignment' && '📝'}
                          {lesson.type === 'quiz' && '❓'}
                          {' '}{lesson.title}
                        </span>
                        <button onClick={() => removeLesson(index)} className="remove-button">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="button" onClick={addModule} className="primary-button" style={{ marginTop: '20px' }}>
                + Add Module to Course
              </button>
            </div>

            {courseData.modules.length > 0 && (
              <div className="modules-list">
                <h3>Course Modules ({courseData.modules.length})</h3>
                {courseData.modules.map((module, index) => (
                  <div key={index} className="module-card">
                    <div className="module-header">
                      <h4>Module {index + 1}: {module.title}</h4>
                      <button onClick={() => removeModule(index)} className="remove-button">
                        Remove
                      </button>
                    </div>
                    <p>{module.description}</p>
                    <p className="lesson-count">{module.lessons.length} lesson(s)</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="form-section">
            <h2>Final Test</h2>
            <p className="section-subtitle">Create a final test to assess student learning (optional)</p>

            <div className="form-group">
              <label>Test Title</label>
              <input
                type="text"
                value={courseData.finalTest.title}
                onChange={(e) => handleInputChange('finalTest', 'title', e.target.value)}
                placeholder="Final Test"
              />
            </div>

            <div className="form-group">
              <label>Test Description</label>
              <textarea
                value={courseData.finalTest.description}
                onChange={(e) => handleInputChange('finalTest', 'description', e.target.value)}
                placeholder="Description of the final test..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Passing Score (%)</label>
                <input
                  type="number"
                  value={courseData.finalTest.passingScore}
                  onChange={(e) => handleInputChange('finalTest', 'passingScore', parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Time Limit (minutes, 0 = no limit)</label>
                <input
                  type="number"
                  value={courseData.finalTest.timeLimit}
                  onChange={(e) => handleInputChange('finalTest', 'timeLimit', parseInt(e.target.value))}
                  min="0"
                />
              </div>
            </div>

            <div className="question-builder">
              <h4>Add Test Questions</h4>

              <div className="form-group">
                <label>Question</label>
                <input
                  type="text"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  placeholder="Enter your question..."
                />
              </div>

              <div className="form-group">
                <label>Answer Options</label>
                {currentQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion({ ...currentQuestion, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                    style={{ marginBottom: '8px' }}
                  />
                ))}
              </div>

              <div className="form-group">
                <label>Correct Answer</label>
                <select
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                >
                  <option value="">Select correct answer...</option>
                  {currentQuestion.options.map((option, index) => (
                    <option key={index} value={index}>{option || `Option ${index + 1}`}</option>
                  ))}
                </select>
              </div>

              <button type="button" onClick={addQuestionToTest} className="add-button">
                Add Question
              </button>

              {courseData.finalTest.questions.length > 0 && (
                <div className="items-list">
                  <h5>Test Questions ({courseData.finalTest.questions.length})</h5>
                  {courseData.finalTest.questions.map((q, index) => (
                    <div key={index} className="list-item">
                      <span>{index + 1}. {q.question}</span>
                      <button onClick={() => removeQuestionFromTest(index)} className="remove-button">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="form-section">
            <h2>Completion Badge</h2>
            <p className="section-subtitle">Design a badge that students will earn upon completing the course</p>

            <div className="form-group">
              <label>Badge Name</label>
              <input
                type="text"
                value={courseData.badge.name}
                onChange={(e) => handleInputChange('badge', 'name', e.target.value)}
                placeholder="e.g., Digital Marketing Master"
              />
            </div>

            <div className="form-group">
              <label>Badge Description</label>
              <textarea
                value={courseData.badge.description}
                onChange={(e) => handleInputChange('badge', 'description', e.target.value)}
                placeholder="Description of what this badge represents..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Badge Color</label>
              <input
                type="color"
                value={courseData.badge.color}
                onChange={(e) => handleInputChange('badge', 'color', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Badge Image URL (optional)</label>
              <ImageUpload
                value={courseData.badge.imageUrl}
                onChange={(url) => handleInputChange('badge', 'imageUrl', url)}
                label="Badge Image (optional)"
              />
            </div>

            {courseData.badge.name && (
              <div className="badge-preview">
                <h4>Badge Preview</h4>
                <div 
                  className="preview-badge"
                  style={{ backgroundColor: courseData.badge.color }}
                >
                  {courseData.badge.imageUrl ? (
                    <img src={courseData.badge.imageUrl} alt={courseData.badge.name} />
                  ) : (
                    <span className="badge-emoji">🏆</span>
                  )}
                </div>
                <p><strong>{courseData.badge.name}</strong></p>
                <p>{courseData.badge.description}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} /> Back
        </button>

        <h1>Create New Course</h1>
        <p className="page-subtitle">Fill in the details to create a new course</p>

        <div className="steps-indicator">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step ${currentStep === index + 1 ? 'active' : ''} ${
                currentStep > index + 1 ? 'completed' : ''
              }`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step}</div>
            </div>
          ))}
        </div>

        <div className="form-container">
          {renderStepContent()}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="secondary-button"
          >
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="primary-button"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="primary-button"
            >
              Create Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
