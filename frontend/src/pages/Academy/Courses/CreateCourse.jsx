/* global process */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function CreateCourse() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('basic-info');
  const [learningPoint, setLearningPoint] = useState('');
  const [modulePoint, setModulePoint] = useState('');
  const [currentModule, setCurrentModule] = useState({
    title: '',
    description: '',
    videoUrl: '',
    articleContent: '',
    pdfUrl: '',
    learningPoints: [],
    duration: '',
    thumbnail: '',
  });

  const [courseData, setCourseData] = useState({
    // basic info
    title: '',
    description: '',
    duration: '',
    difficulty: 'Beginner',
    category: '',
    thumbnail: '',
    isLiteVersion: false,

    // instructor
    instructorName: '',
    instructorTitle: '',
    instructorBio: '',
    instructorAvatar: '',

    // pricing
    priceAmount: '',
    priceCurrency: 'USD',
    pricingType: 'one-time',

    // subscription info
    isSubscriptionCourse: false,
    subscriptionTier: '',

    // content
    learningPoints: [],

    // modules
    modules: [],
  });

  const handleBack = () => {
    navigate('/academy/create');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData({
      ...courseData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddLearningPoint = () => {
    if (learningPoint.trim()) {
      setCourseData({
        ...courseData,
        learningPoints: [...courseData.learningPoints, learningPoint.trim()],
      });
      setLearningPoint('');
    }
  };

  const handleRemoveLearningPoint = (index) => {
    setCourseData({
      ...courseData,
      learningPoints: courseData.learningPoints.filter((_, i) => i !== index),
    });
  };

  const handleModuleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentModule({
      ...currentModule,
      [name]: value,
    });
  };

  const handleAddModulePoint = () => {
    if (modulePoint.trim()) {
      setCurrentModule({
        ...currentModule,
        learningPoints: [...currentModule.learningPoints, modulePoint.trim()],
      });
      setModulePoint('');
    }
  };

  const handleRemoveModulePoint = (index) => {
    setCurrentModule({
      ...currentModule,
      learningPoints: currentModule.learningPoints.filter((_, i) => i !== index),
    });
  };

  const handleAddModule = () => {
    if (!currentModule.title.trim()) {
      alert('Please enter a module title');
      return;
    }

    setCourseData({
      ...courseData,
      modules: [...courseData.modules, { ...currentModule, order: courseData.modules.length }],
    });

    // Reset current module
    setCurrentModule({
      title: '',
      description: '',
      videoUrl: '',
      articleContent: '',
      pdfUrl: '',
      learningPoints: [],
      duration: '',
      thumbnail: '',
    });
    setModulePoint('');
  };

  const handleRemoveModule = (index) => {
    setCourseData({
      ...courseData,
      modules: courseData.modules.filter((_, i) => i !== index),
    });
  };

  const validateForm = () => {
    if (!courseData.title.trim()) {
      alert('Please enter a course title');
      setCurrentStep('basic-info');
      return false;
    }
    if (!courseData.description.trim()) {
      alert('Please enter a course description');
      setCurrentStep('basic-info');
      return false;
    }
    if (!courseData.instructorName.trim()) {
      alert('Please enter an instructor name');
      setCurrentStep('instructor');
      return false;
    }
    return true;
  };

  const handleCreateCourse = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/academy/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description,
          duration: courseData.duration,
          difficulty: courseData.difficulty,
          category: courseData.category,
          thumbnail: courseData.thumbnail,
          isLiteVersion: courseData.isLiteVersion,

          instructor: {
            name: courseData.instructorName,
            title: courseData.instructorTitle,
            bio: courseData.instructorBio,
            avatar: courseData.instructorAvatar,
          },

          pricing: {
            amount: courseData.priceAmount ? Number(courseData.priceAmount) : 0,
            currency: courseData.priceCurrency,
            type: courseData.pricingType,
          },

          subscription: {
            isSubscriptionCourse: courseData.isSubscriptionCourse,
            tier: courseData.subscriptionTier,
          },

          learningPoints: courseData.learningPoints,
          modules: courseData.modules,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Course created successfully!');
        navigate('/academy/courses');
      } else {
        alert(`Failed to create course: ${data.error || data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('An error occurred while creating the course. Please try again.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/academy/create');
    }
  };

  const steps = [
    { id: 'basic-info', label: 'Basic Info' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'content', label: 'Content' },
    { id: 'modules', label: 'Modules' },
  ];

  return (
    <div className="min-h-screen bg-main-bg pt-8 px-10 max-md:px-5">
      <div className="max-w-narrow mx-auto">
        <button className="bg-transparent border-none text-dark-primary text-base cursor-pointer mb-5 py-2 inline-flex items-center transition-colors duration-300 hover:text-dark-secondary" onClick={handleBack}>
          <FiArrowLeft className="inline mr-1" /> Back
        </button>

        <h1 className="text-5xl font-bold text-dark-primary mb-3">Create New Course</h1>
        <p className="text-base text-dark-secondary mb-8">Fill in the details to create a new course</p>

        <div className="flex flex-wrap max-md:overflow-x-auto max-md:flex-nowrap">
          {steps.map((step) => (
            <button
              key={step.id}
              className={`py-3 px-5 text-base font-semibold cursor-pointer border-none transition-colors duration-300 max-md:whitespace-nowrap ${currentStep === step.id ? 'bg-light-tertiary text-dark-primary' : 'bg-light-primary text-dark-tertiary hover:bg-light-secondary'}`}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.label}
            </button>
          ))}
        </div>

        {currentStep === 'basic-info' && (
          <div className="bg-light-tertiary p-8 mb-3">
            <h2 className="text-2xl font-semibold text-dark-primary mb-2">Course Information</h2>
            <p className="text-md text-dark-secondary mb-8">Basic details about your course</p>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark-primary mb-2">
                Course Title <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                placeholder="e.g., Complete Digital Marketing Masterclass"
                value={courseData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark-primary mb-2">
                Description <span className="text-accent">*</span>
              </label>
              <textarea
                name="description"
                className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 resize-y min-h-[120px] focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                rows="5"
                placeholder="Describe what students will learn in this course..."
                value={courseData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
              <div className="mb-6">
                <label className="block text-base font-semibold text-dark-primary mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                  placeholder="e.g., 12 weeks"
                  value={courseData.duration}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block text-base font-semibold text-dark-primary mb-2">Difficulty Level</label>
                <select
                  name="difficulty"
                  className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans cursor-pointer bg-white transition-colors duration-300 focus:outline-none focus:border-dark-primary"
                  value={courseData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark-primary mb-2">Category</label>
              <input
                type="text"
                name="category"
                className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                placeholder="e.g., Digital Marketing"
                value={courseData.category}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark-primary mb-2">Thumbnail URL</label>
              <div className="relative">
                <input
                  type="text"
                  name="thumbnail"
                  className="w-full px-4 py-3 pr-[45px] border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                  placeholder="https://example.com/image.jpg"
                  value={courseData.thumbnail}
                  onChange={handleInputChange}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-dark-secondary cursor-pointer">⬆</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2.5 cursor-pointer text-base text-dark-primary">
                <input
                  type="checkbox"
                  name="isLiteVersion"
                  checked={courseData.isLiteVersion}
                  onChange={handleInputChange}
                  className="w-[18px] h-[18px] cursor-pointer"
                />
                <span>This is a Lite version (free tier with limited content)</span>
              </label>
            </div>
          </div>
        )}

        {currentStep === 'instructor' && (
          <div className="bg-light-tertiary p-8 mb-3">
            <h2 className="text-2xl font-semibold text-dark-primary mb-2">Instructor Information</h2>
            <p className="text-md text-dark-secondary mb-8">Details about the course instructor</p>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark-primary mb-2">
                Instructor Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="instructorName"
                className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                placeholder="e.g., Alina Padilla-Miller"
                value={courseData.instructorName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark-primary mb-2">Instructor Title/Role</label>
              <input
                type="text"
                name="instructorTitle"
                className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                placeholder="e.g., Senior Freelance Designer"
                value={courseData.instructorTitle}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark-primary mb-2">Instructor Bio</label>
              <textarea
                name="instructorBio"
                className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 resize-y min-h-[120px] focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                rows="4"
                placeholder="Short overview of the instructor's background..."
                value={courseData.instructorBio}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark-primary mb-2">Instructor Avatar URL</label>
              <input
                type="text"
                name="instructorAvatar"
                className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                placeholder="https://example.com/avatar.png"
                value={courseData.instructorAvatar}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {currentStep === 'pricing' && (
          <div className="bg-light-tertiary p-8 mb-3">
            <h2 className="text-2xl font-semibold text-dark-primary mb-2">Pricing Details</h2>
            <p className="text-md text-dark-secondary mb-8">Set the price for your course. Leave blank for free courses</p>

            <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
              <div className="mb-6">
                <label className="block text-base font-semibold text-dark-primary mb-2">Price Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="priceAmount"
                  className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                  placeholder="e.g., 199"
                  value={courseData.priceAmount}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block text-base font-semibold text-dark-primary mb-2">Currency</label>
                <select
                  name="priceCurrency"
                  className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans cursor-pointer bg-white transition-colors duration-300 focus:outline-none focus:border-dark-primary"
                  value={courseData.priceCurrency}
                  onChange={handleInputChange}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark-primary mb-2">Pricing Type</label>
              <select
                name="pricingType"
                className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans cursor-pointer bg-white transition-colors duration-300 focus:outline-none focus:border-dark-primary"
                value={courseData.pricingType}
                onChange={handleInputChange}
              >
                <option value="one-time">One-time payment</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>

            {courseData.pricingType === 'subscription' && (
              <p className="text-md text-dark-secondary mt-2.5">
                (You can extend this to monthly / yearly plans later.)
              </p>
            )}

            {courseData.isLiteVersion && (
              <p className="text-md text-dark-secondary mt-2.5">
                Note: this course is marked as "Lite", so it may be treated as
                free in the course list.
              </p>
            )}
          </div>
        )}

        {currentStep === 'content' && (
          <div className="bg-light-tertiary p-8 mb-3">
            <h2 className="text-2xl font-semibold text-dark-primary mb-2">Course Content</h2>
            <p className="text-md text-dark-secondary mb-8">Add key learning points for your course</p>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark-primary mb-2">Learning Points</label>
              <div className="flex gap-2.5 mb-5">
                <input
                  type="text"
                  className="flex-1 w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                  placeholder="e.g., Master social media marketing strategies"
                  value={learningPoint}
                  onChange={(e) => setLearningPoint(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLearningPoint();
                    }
                  }}
                />
                <button
                  type="button"
                  className="py-3 px-6 bg-accent text-white border-none rounded-sm text-base font-semibold cursor-pointer whitespace-nowrap transition-colors duration-300 hover:bg-accent-secondary"
                  onClick={handleAddLearningPoint}
                >
                  Add Point
                </button>
              </div>
            </div>

            {courseData.learningPoints.length > 0 && (
              <div className="bg-white rounded p-5 mt-5">
                <h3 className="text-base font-semibold text-dark-primary mb-4">Added Learning Points:</h3>
                <ul className="list-none p-0 m-0">
                  {courseData.learningPoints.map((point, index) => (
                    <li key={index} className="flex justify-between items-center py-3 px-4 bg-light-tertiary rounded-sm mb-2.5 last:mb-0 transition-colors duration-200 hover:bg-light-secondary">
                      <span className="flex-1 text-dark-primary text-base">✓ {point}</span>
                      <button
                        type="button"
                        className="bg-transparent border-none text-accent text-lg cursor-pointer px-2 py-1 transition-colors duration-200 hover:text-accent-secondary"
                        onClick={() => handleRemoveLearningPoint(index)}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {courseData.learningPoints.length === 0 && (
              <p className="text-center py-10 px-5 text-light-primary italic text-base">No learning points added yet. Add some to help students understand what they'll learn!</p>
            )}
          </div>
        )}

        {currentStep === 'modules' && (
          <div className="bg-light-tertiary p-8 mb-3">
            <h2 className="text-2xl font-semibold text-dark-primary mb-2">Course Modules</h2>
            <p className="text-md text-dark-secondary mb-8">Organize your course into structured modules with content</p>

            <div className="rounded p-6 mb-8">
              <h3 className="text-lg font-semibold text-dark-primary mb-5">Add New Module</h3>

              <div className="mb-6">
                <label className="block text-base font-semibold text-dark-primary mb-2">
                  Module Title <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                  placeholder="e.g., Introduction to Digital Marketing"
                  value={currentModule.title}
                  onChange={handleModuleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block text-base font-semibold text-dark-primary mb-2">Module Description</label>
                <textarea
                  name="description"
                  className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 resize-y min-h-[120px] focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                  rows="3"
                  placeholder="Brief description of what this module covers..."
                  value={currentModule.description}
                  onChange={handleModuleInputChange}
                />
              </div>

              <div className="bg-light-tertiary p-5 rounded-sm my-5">
                <h4 className="text-md font-semibold text-dark-primary mb-4">Module Content</h4>

                <div className="mb-6">
                  <label className="block text-base font-semibold text-dark-primary mb-2">Video URL</label>
                  <input
                    type="text"
                    name="videoUrl"
                    className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                    placeholder="https://youtube.com/watch?v=..."
                    value={currentModule.videoUrl}
                    onChange={handleModuleInputChange}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-base font-semibold text-dark-primary mb-2">Article Content</label>
                  <textarea
                    name="articleContent"
                    className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 resize-y min-h-[120px] focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                    rows="5"
                    placeholder="Write your article content here..."
                    value={currentModule.articleContent}
                    onChange={handleModuleInputChange}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-base font-semibold text-dark-primary mb-2">PDF/Document URL</label>
                  <input
                    type="text"
                    name="pdfUrl"
                    className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                    placeholder="https://example.com/document.pdf"
                    value={currentModule.pdfUrl}
                    onChange={handleModuleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                <div className="mb-6">
                  <label className="block text-base font-semibold text-dark-primary mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                    placeholder="e.g., 45 minutes"
                    value={currentModule.duration}
                    onChange={handleModuleInputChange}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-base font-semibold text-dark-primary mb-2">Thumbnail URL</label>
                  <input
                    type="text"
                    name="thumbnail"
                    className="w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                    placeholder="https://example.com/thumb.jpg"
                    value={currentModule.thumbnail}
                    onChange={handleModuleInputChange}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-base font-semibold text-dark-primary mb-2">Module Learning Points</label>
                <div className="flex gap-2.5 mb-5">
                  <input
                    type="text"
                    className="flex-1 w-full px-4 py-3 border border-light-secondary rounded-sm text-base text-dark-primary font-sans transition-colors duration-300 focus:outline-none focus:border-dark-primary placeholder:text-light-primary"
                    placeholder="e.g., Understand key marketing concepts"
                    value={modulePoint}
                    onChange={(e) => setModulePoint(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddModulePoint();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="py-3 px-6 bg-accent text-white border-none rounded-sm text-base font-semibold cursor-pointer whitespace-nowrap transition-colors duration-300 hover:bg-accent-secondary"
                    onClick={handleAddModulePoint}
                  >
                    Add Point
                  </button>
                </div>
              </div>

              {currentModule.learningPoints.length > 0 && (
                <div className="mt-4 mb-5">
                  <ul className="list-none p-0 m-0">
                    {currentModule.learningPoints.map((point, index) => (
                      <li key={index} className="flex justify-between items-center py-3 px-4 bg-light-tertiary rounded-sm mb-2.5 last:mb-0 transition-colors duration-200 hover:bg-light-secondary">
                        <span className="flex-1 text-dark-primary text-base">✓ {point}</span>
                        <button
                          type="button"
                          className="bg-transparent border-none text-accent text-lg cursor-pointer px-2 py-1 transition-colors duration-200 hover:text-accent-secondary"
                          onClick={() => handleRemoveModulePoint(index)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                className="w-full py-3.5 px-6 bg-dark-primary text-white border-none rounded-sm text-md font-semibold cursor-pointer transition-colors duration-300 mt-5 hover:bg-dark-secondary"
                onClick={handleAddModule}
              >
                + Add Module to Course
              </button>
            </div>

            {courseData.modules.length > 0 && (
              <div className="mt-8">
                <h3 className="text-base font-semibold text-dark-primary mb-4">Course Modules ({courseData.modules.length})</h3>
                {courseData.modules.map((module, index) => (
                  <div key={index} className="bg-white rounded p-5 mb-4 border border-light-secondary transition-shadow duration-200 hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <span className="inline-block bg-accent text-white py-1 px-3 rounded text-xs font-semibold mb-2">Module {index + 1}</span>
                        <h4 className="text-lg font-semibold text-dark-primary my-2">{module.title}</h4>
                        {module.duration && <span className="text-sm text-dark-secondary ml-2.5">⏱ {module.duration}</span>}
                      </div>
                      <button
                        type="button"
                        className="bg-transparent text-accent border border-accent py-2 px-4 rounded text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-accent hover:text-white"
                        onClick={() => handleRemoveModule(index)}
                      >
                        ✕ Remove
                      </button>
                    </div>
                    {module.description && (
                      <p className="text-dark-secondary text-base mb-3 leading-relaxed">{module.description}</p>
                    )}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {module.videoUrl && <span className="bg-light-tertiary py-1.5 px-3 rounded text-sm text-dark-primary font-medium">📹 Video</span>}
                      {module.articleContent && <span className="bg-light-tertiary py-1.5 px-3 rounded text-sm text-dark-primary font-medium">📝 Article</span>}
                      {module.pdfUrl && <span className="bg-light-tertiary py-1.5 px-3 rounded text-sm text-dark-primary font-medium">📄 PDF</span>}
                    </div>
                    {module.learningPoints.length > 0 && (
                      <div className="mt-3 p-3 bg-light-tertiary rounded">
                        <strong className="text-sm text-dark-primary block mb-2">Learning Points:</strong>
                        <ul className="m-0 pl-5">
                          {module.learningPoints.map((point, idx) => (
                            <li key={idx} className="text-sm text-dark-secondary mb-1">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {courseData.modules.length === 0 && (
              <p className="text-center py-10 px-5 text-light-primary italic text-base">No modules added yet. Create your first module above!</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-4 pt-5">
          <button className="py-3 px-8 bg-transparent text-dark-secondary border-none rounded-sm text-md font-medium cursor-pointer transition-colors duration-300 hover:text-dark-primary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="py-3 px-8 bg-accent text-white border-none rounded-sm text-md font-semibold cursor-pointer inline-flex items-center gap-2 transition-colors duration-300 hover:bg-accent-tertiary" onClick={handleCreateCourse}>
            Create Course
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
