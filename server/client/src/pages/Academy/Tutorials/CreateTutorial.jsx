/* global process */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTutorial.css";
import { FiArrowLeft } from "react-icons/fi";
import ImageUpload from "../../../components/ImageUpload";

function CreateTutorial() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('basic-info');

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    category: "",
    thumbnailUrl: "",
    videoUrl: "",
    writtenContent: "",
    resources: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, ""],
    });
  };

  const handleResourceChange = (index, value) => {
    const updated = [...formData.resources];
    updated[index] = value;
    setFormData({ ...formData, resources: updated });
  };

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    try {
      console.log("Submitting Tutorial:", formData);

      const response = await fetch(`/api/academy/tutorials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Tutorial created successfully!");
        navigate("/academy/tutorials");
      } else {
        const errorData = await response.json();
        console.error("Tutorial creation failed:", errorData);
        alert("Failed to create tutorial. Check console for details.");
      }
    } catch (error) {
      console.error("Error creating tutorial:", error);
      alert("An unexpected error occurred while creating the tutorial.");
    }
  };

  const steps = [
    { id: 'basic-info', label: 'Basic Info' },
    { id: 'content', label: 'Content' },
    { id: 'resources', label: 'Resources' }
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  const isStepValid = (stepId) => {
    if (stepId === "basic-info") {
      return (
        formData.title.trim() !== "" &&
        formData.description.trim() !== "" &&
        formData.category.trim() !== ""
      );
    }

    if (stepId === "content") {
      return (
        formData.videoUrl.trim() !== "" ||
        formData.writtenContent.trim() !== ""
      );
    }

    return true;
  };

  const handleNext = () => {
    if (!isStepValid(currentStep)) {
      if (currentStep === "basic-info") {
        alert("Please fill in all required fields before continuing.");
      } else if (currentStep === "content") {
        alert("Please add a video URL or written content before continuing.");
      }
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="create-tutorial-page">
      <div className="create-tutorial-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} /> Back
        </button>

        <h1>Create New Tutorial</h1>
        <p className="page-subtitle">Fill in the details to create a new tutorial</p>

        <div className="steps-indicator">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`step ${currentStepIndex === index ? "active" : ""} ${
                currentStepIndex > index ? "completed" : ""
              }`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>

        <div className="form-container">
          {currentStep === "basic-info" && (
            <div className="form-section">
              <h2>Tutorial Information</h2>
              <p className="section-subtitle">Basic details about your tutorial</p>

              <div className="form-group">
                <label>Tutorial Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., How to Create a Portfolio Website"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  placeholder="Describe what students will learn..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g., 15 min"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g., Web Development"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <ImageUpload
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                label="Tutorial Thumbnail"
              />
            </div>
          )}

          {currentStep === "content" && (
            <div className="form-section">
              <h2>Tutorial Content</h2>
              <p className="section-subtitle">Video and written content</p>

              <div className="form-group">
                <label>Video URL</label>
                <input
                  type="text"
                  name="videoUrl"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Written Content</label>
                <textarea
                  name="writtenContent"
                  placeholder="Step-by-step instructions..."
                  value={formData.writtenContent}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          )}

          {currentStep === "resources" && (
            <div className="form-section">
              <h2>Downloadable Resources</h2>
              <p className="section-subtitle">Optional supporting materials</p>

              <div className="resource-list">
                {formData.resources.length === 0 && (
                  <p className="empty-state">No downloadable resources added yet.</p>
                )}

                {formData.resources.map((res, index) => (
                  <input
                    key={index}
                    className="resource-input"
                    placeholder="Resource URL..."
                    value={res}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                  />
                ))}
              </div>

              <button type="button" className="add-button" onClick={addResource}>
                + Add Downloadable Resource
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="secondary-button"
          >
            Previous
          </button>

          {currentStepIndex < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="primary-button"
              disabled={!isStepValid(currentStep)}
            >
              Next
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="primary-button">
              Create Tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateTutorial;
