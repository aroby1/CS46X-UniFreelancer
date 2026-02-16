/* global process */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function CreateSeminar() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('basic-info');
  const [seminarData, setSeminarData] = useState({
    title: '',
    description: '',
    duration: '',
    type: 'Live Now',
    thumbnail: '',

    speakerName: '',
    speakerBio: '',
    speakerAvatar: '',

    date: '',
    time: '',
    joinUrl: ''
  });

  const handleBack = () => {
    navigate('/academy/create');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSeminarData({
      ...seminarData,
      [name]: value
    });
  };

  const handleCreateSeminar = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/academy/seminars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: seminarData.title,
          description: seminarData.description,
          duration: seminarData.duration,
          type: seminarData.type,
          thumbnail: seminarData.thumbnail,

          speaker: {
            name: seminarData.speakerName,
            bio: seminarData.speakerBio,
            avatar: seminarData.speakerAvatar
          },

          schedule: {
            date: seminarData.date,
            time: seminarData.time,
            joinUrl: seminarData.joinUrl
          }
        }),
      });

      if (response.ok) {
        alert('Seminar created successfully!');
        navigate('/academy');
      } else {
        alert('Failed to create seminar. Please try again.');
      }
    } catch (error) {
      console.error('Error creating seminar:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/academy/create');
  };

  const steps = [
    { id: 'basic-info', label: 'Basic Info' },
    { id: 'speaker', label: 'Speaker' },
    { id: 'schedule', label: 'Schedule' },
  ];

  return (
    <div className="min-h-screen bg-main-bg pt-10 px-6">
      <div className="max-w-narrow mx-auto">

        <button className="bg-transparent border-none text-dark text-base cursor-pointer mb-5 py-2 inline-flex items-center hover:text-dark-secondary transition-colors" onClick={handleBack}>
          <FiArrowLeft className="inline mr-1" /> Back
        </button>

        <h1 className="text-5xl font-bold text-dark mb-3">Create New Seminar</h1>
        <p className="text-base text-dark-secondary mb-8">
          Fill in the details to create a new seminar or webinar
        </p>

        <div className="flex flex-wrap">
          {steps.map((step) => (
            <button
              key={step.id}
              className={`py-3 px-5 text-base font-semibold cursor-pointer border-none transition-colors ${currentStep === step.id ? 'bg-light-tertiary text-dark' : 'bg-light-primary text-dark-tertiary hover:bg-light-secondary'}`}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.label}
            </button>
          ))}
        </div>

        {currentStep === 'basic-info' && (
          <div className="bg-light-tertiary p-8 mb-3 rounded">
            <h2 className="text-2xl font-semibold text-dark mb-2">Seminar Information</h2>
            <p className="text-md text-dark-secondary mb-8">Basic details about your seminar</p>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">Seminar Title *</label>
              <input
                type="text"
                name="title"
                className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors"
                placeholder="e.g., Building Your Freelance Brand"
                value={seminarData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">Description *</label>
              <textarea
                name="description"
                rows="5"
                className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors resize-y min-h-[120px]"
                placeholder="Describe what attendees will learn in this seminar..."
                value={seminarData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="mb-6">
                <label className="block text-base font-semibold text-dark mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors"
                  placeholder="e.g., 1.5 hours"
                  value={seminarData.duration}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block text-base font-semibold text-dark mb-2">Seminar Type</label>
                <select
                  name="type"
                  className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors cursor-pointer bg-white"
                  value={seminarData.type}
                  onChange={handleInputChange}
                >
                  <option value="Live Now">Live Now</option>
                  <option value="Recorded">Recorded</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail"
                className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors"
                placeholder="https://example.com/image.jpg"
                value={seminarData.thumbnail}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {currentStep === 'speaker' && (
          <div className="bg-light-tertiary p-8 mb-3 rounded">
            <h2 className="text-2xl font-semibold text-dark mb-2">Speaker Information</h2>
            <p className="text-md text-dark-secondary mb-8">Details about the seminar speaker</p>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">Speaker Name *</label>
              <input
                type="text"
                name="speakerName"
                className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors"
                placeholder="e.g., John Smith"
                value={seminarData.speakerName}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">Speaker Bio</label>
              <textarea
                name="speakerBio"
                rows="4"
                className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors resize-y min-h-[120px]"
                placeholder="Brief biography of the speaker..."
                value={seminarData.speakerBio}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">Speaker Avatar URL</label>
              <input
                type="text"
                name="speakerAvatar"
                className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors"
                placeholder="https://example.com/avatar.jpg"
                value={seminarData.speakerAvatar}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {currentStep === 'schedule' && (
          <div className="bg-light-tertiary p-8 mb-3 rounded">
            <h2 className="text-2xl font-semibold text-dark mb-2">Schedule</h2>
            <p className="text-md text-dark-secondary mb-8">When will this seminar take place?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="mb-6">
                <label className="block text-base font-semibold text-dark mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors"
                  value={seminarData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label className="block text-base font-semibold text-dark mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors"
                  value={seminarData.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-base font-semibold text-dark mb-2">Join URL</label>
              <input
                type="text"
                name="joinUrl"
                className="w-full px-4 py-3 rounded-md border border-border focus:outline-none focus:border-accent text-base text-dark font-sans transition-colors"
                placeholder="https://zoom.us/..."
                value={seminarData.joinUrl}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-5">
          <button className="py-3 px-8 bg-transparent text-dark-secondary border-none rounded-sm text-md font-medium cursor-pointer hover:text-dark transition-colors" onClick={handleCancel}>
            Cancel
          </button>
          <button className="py-3 px-8 bg-accent text-white font-semibold rounded-md hover:bg-accent-secondary transition-colors cursor-pointer text-md inline-flex items-center gap-2" onClick={handleCreateSeminar}>
            Create Seminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSeminar;
