/* global process */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUpload } from "react-icons/fi";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting Tutorial:", formData);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/academy/tutorials`, {
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
    { id: 'resources', label: 'Resources' },
  ];

  return (
    <div className="min-h-screen bg-main-bg pt-[100px] px-[40px] max-md:px-5">
      <div className="max-w-narrow mx-auto">

        {/* Back Button */}
        <button className="bg-transparent border-none text-dark text-base cursor-pointer mb-5 py-2 inline-flex items-center transition-colors hover:text-dark-secondary" onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} /> Back
        </button>

        <h1 className="text-5xl font-bold text-dark mb-3">Create New Tutorial</h1>
        <p className="text-base text-dark-secondary mb-8">
          Fill in the details to create a new tutorial
        </p>

        <div className="flex flex-wrap">
          {steps.map((step) => (
            <button
              key={step.id}
              className={`py-3 px-5 text-base font-semibold cursor-pointer border-none transition-colors ${
                currentStep === step.id
                  ? "bg-light-tertiary text-dark"
                  : "bg-light-primary text-dark-tertiary hover:bg-light-secondary"
              }`}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.label}
            </button>
          ))}
        </div>

        {currentStep === 'basic-info' && (
          <div className="bg-light-tertiary p-8 mb-3 rounded">
            <h2 className="text-2xl font-semibold text-dark mb-2">Tutorial Information</h2>
            <p className="text-md text-dark-secondary mb-8">Basic details about your tutorial</p>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">
                Tutorial Title <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="w-full px-4 py-3 rounded-sm border border-light-secondary text-base text-dark bg-white font-[inherit] transition-colors focus:outline-none focus:border-dark placeholder:text-light-primary"
                placeholder="e.g., How to Create a Portfolio Website"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">
                Description <span className="text-accent">*</span>
              </label>
              <textarea
                name="description"
                className="w-full px-4 py-3 rounded-sm border border-light-secondary text-base text-dark bg-white font-[inherit] transition-colors resize-y min-h-[120px] focus:outline-none focus:border-dark placeholder:text-light-primary"
                placeholder="Describe what students will learn..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
              <div className="mb-6">
                <label className="block text-base font-semibold text-dark mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="w-full px-4 py-3 rounded-sm border border-light-secondary text-base text-dark bg-white font-[inherit] transition-colors focus:outline-none focus:border-dark placeholder:text-light-primary"
                  placeholder="e.g., 15 min"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-6">
                <label className="block text-base font-semibold text-dark mb-2">Category *</label>
                <input
                  type="text"
                  name="category"
                  className="w-full px-4 py-3 rounded-sm border border-light-secondary text-base text-dark bg-white font-[inherit] transition-colors focus:outline-none focus:border-dark placeholder:text-light-primary"
                  placeholder="e.g., Web Development"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="mb-6 relative">
              <label className="block text-base font-semibold text-dark mb-2">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnailUrl"
                className="w-full px-4 py-3 rounded-sm border border-light-secondary text-base text-dark bg-white font-[inherit] transition-colors focus:outline-none focus:border-dark placeholder:text-light-primary"
                placeholder="https://example.com/thumbnail.jpg"
                value={formData.thumbnailUrl}
                onChange={handleChange}
              />
              <FiUpload className="absolute right-[15px] top-1/2 -translate-y-1/2 text-lg text-dark-secondary cursor-pointer" />
            </div>
          </div>
        )}

        {currentStep === 'content' && (
          <div className="bg-light-tertiary p-8 mb-3 rounded">
            <h2 className="text-2xl font-semibold text-dark mb-2">Tutorial Content</h2>
            <p className="text-md text-dark-secondary mb-8">Video and written content</p>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">Video URL</label>
              <input
                type="text"
                name="videoUrl"
                className="w-full px-4 py-3 rounded-sm border border-light-secondary text-base text-dark bg-white font-[inherit] transition-colors focus:outline-none focus:border-dark placeholder:text-light-primary"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">Written Content</label>
              <textarea
                name="writtenContent"
                className="w-full px-4 py-3 rounded-sm border border-light-secondary text-base text-dark bg-white font-[inherit] transition-colors resize-y min-h-[120px] focus:outline-none focus:border-dark placeholder:text-light-primary"
                placeholder="Step-by-step instructions..."
                value={formData.writtenContent}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {currentStep === 'resources' && (
          <div className="bg-light-tertiary p-8 mb-3 rounded">
            <h2 className="text-2xl font-semibold text-dark mb-2">Downloadable Resources</h2>
            <p className="text-md text-dark-secondary mb-8">Optional supporting materials</p>

            <div className="py-[10px] mb-[15px]">
              {formData.resources.length === 0 && (
                <p className="text-dark-secondary text-base">No downloadable resources added yet.</p>
              )}

              {formData.resources.map((res, index) => (
                <input
                  key={index}
                  className="w-full px-4 py-3 rounded-sm border border-light-secondary text-base text-dark bg-white font-[inherit] transition-colors focus:outline-none focus:border-dark placeholder:text-light-primary mb-[15px]"
                  placeholder="Resource URL..."
                  value={res}
                  onChange={(e) =>
                    handleResourceChange(index, e.target.value)
                  }
                />
              ))}
            </div>

            <button className="py-[10px] px-[15px] bg-white text-dark border border-[#ccc] rounded-sm text-base cursor-pointer transition-colors hover:bg-[#f3f3f3]" onClick={addResource}>
              + Add Downloadable Resource
            </button>
          </div>
        )}

        {/* ===================== ACTION BUTTONS ===================== */}
        <div className="flex justify-end gap-4 pt-5">
          <button className="py-3 px-8 bg-transparent text-dark-secondary border-none rounded-sm text-md font-medium cursor-pointer transition-colors hover:text-dark" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="py-3 px-8 bg-accent text-white border-none rounded-sm text-md font-semibold cursor-pointer inline-flex items-center gap-2 transition-colors hover:bg-accent-tertiary" onClick={handleSubmit}>
            Create Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTutorial;
