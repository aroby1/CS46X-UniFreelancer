import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function CreateContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('course');

  const handleBackToAcademy = () => {
    navigate('/academy');
  };

  const handleCreateCourse = () => {
    navigate('/academy/create/course');
  };

  const handleCreateSeminar = () => {
    navigate('/academy/create/seminar');
  };

  const handleCreateTutorial = () => {
    navigate('/academy/create/tutorial');
  };

  const tabClasses = (tabName) =>
    `flex-1 py-3 px-2.5 sm:py-3.5 sm:px-4 md:py-5 md:px-6 border-none text-dark text-xs sm:text-sm md:text-base font-semibold cursor-pointer transition-all duration-300 relative ${
      activeTab === tabName
        ? 'bg-light-tertiary'
        : 'bg-light-primary hover:bg-light-secondary'
    }`;

  const liClasses =
    "py-2 sm:py-2.5 pl-7 sm:pl-[30px] relative text-sm sm:text-md text-dark-secondary leading-relaxed before:content-['\\2713'] before:absolute before:left-0 before:text-accent before:font-bold before:text-lg";

  return (
    <div className="min-h-screen bg-main-bg pt-5 px-[15px] md:pt-[100px] md:px-6">
      <div className="max-w-[1000px] mx-auto">
        <button
          className="bg-transparent border-none text-dark text-base cursor-pointer mb-8 py-2 inline-flex items-center transition-colors duration-300 hover:text-dark-secondary"
          onClick={handleBackToAcademy}
        >
          <FiArrowLeft className="inline mr-1" /> Back to Academy
        </button>

        <h1 className="text-3xl md:text-5xl font-bold text-center text-dark mb-4">Create New Content</h1>
        <p className="text-md md:text-base leading-relaxed text-center text-dark-secondary max-w-[700px] mx-auto mb-10">
          Choose the type of content you want to create and share your expertise with the UniFreelancer community.
        </p>

        {/* Tab Navigation */}
        <div className="flex rounded-t overflow-hidden shadow-sm">
          <button
            className={`${tabClasses('course')} border-r border-[#d0d0d0]`}
            onClick={() => setActiveTab('course')}
          >
            Course
          </button>
          <button
            className={`${tabClasses('seminar')} border-r border-[#d0d0d0]`}
            onClick={() => setActiveTab('seminar')}
          >
            Seminar
          </button>
          <button
            className={tabClasses('tutorial')}
            onClick={() => setActiveTab('tutorial')}
          >
            Tutorial
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="bg-light-tertiary rounded-b py-[25px] px-5 sm:py-[30px] sm:px-[25px] md:py-12 md:px-16 min-h-[400px] md:min-h-[500px]">
          {activeTab === 'course' && (
            <div className="animate-fade-in-up">
              <div className="max-w-[700px] mx-auto">
                <h2 className="text-[22px] sm:text-[26px] md:text-4xl font-bold text-dark mb-5">Create a Course</h2>
                <p className="text-md md:text-[17px] leading-[1.7] text-dark-secondary mb-8">
                  Courses are comprehensive, structured learning programs designed to teach students a
                  complete skill or subject. They typically include multiple modules, lessons, and assessments.
                </p>

                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-semibold text-dark mb-4">What you can include:</h3>
                  <ul className="list-none p-0">
                    <li className={liClasses}>Multiple modules and lessons</li>
                    <li className={liClasses}>Video lectures and presentations</li>
                    <li className={liClasses}>Downloadable resources</li>
                    <li className={liClasses}>Quizzes and assessments</li>
                    <li className={liClasses}>Certificates upon completion</li>
                    <li className={liClasses}>Discussion forums</li>
                  </ul>
                </div>

                <button className="w-full py-3.5 px-7 md:py-4 md:px-8 bg-accent text-white border-none rounded text-base md:text-[17px] font-semibold cursor-pointer transition-all duration-300 shadow-md hover:bg-accent-tertiary" onClick={handleCreateCourse}>
                  Start Creating Course
                </button>
              </div>
            </div>
          )}

          {activeTab === 'seminar' && (
            <div className="animate-fade-in-up">
              <div className="max-w-[700px] mx-auto">
                <h2 className="text-[22px] sm:text-[26px] md:text-4xl font-bold text-dark mb-5">Create a Seminar</h2>
                <p className="text-md md:text-[17px] leading-[1.7] text-dark-secondary mb-8">
                  Seminars are live or recorded webinar sessions focused on specific topics. They're perfect
                  for workshops, presentations, and interactive learning experiences.
                </p>

                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-semibold text-dark mb-4">What you can include:</h3>
                  <ul className="list-none p-0">
                    <li className={liClasses}>Live streaming or pre-recorded sessions</li>
                    <li className={liClasses}>Q&A sessions with attendees</li>
                    <li className={liClasses}>Presentation slides and materials</li>
                    <li className={liClasses}>Interactive polls and discussions</li>
                    <li className={liClasses}>Networking opportunities</li>
                    <li className={liClasses}>Session recordings</li>
                  </ul>
                </div>

                <button className="w-full py-3.5 px-7 md:py-4 md:px-8 bg-accent text-white border-none rounded text-base md:text-[17px] font-semibold cursor-pointer transition-all duration-300 shadow-md hover:bg-accent-tertiary" onClick={handleCreateSeminar}>
                  Start Creating Seminar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tutorial' && (
            <div className="animate-fade-in-up">
              <div className="max-w-[700px] mx-auto">
                <h2 className="text-[22px] sm:text-[26px] md:text-4xl font-bold text-dark mb-5">Create a Tutorial</h2>
                <p className="text-md md:text-[17px] leading-[1.7] text-dark-secondary mb-8">
                  Tutorials are quick, focused lessons that teach a specific skill or technique. They're
                  perfect for step-by-step guides and practical how-to content.
                </p>

                <div className="mb-8">
                  <h3 className="text-lg md:text-xl font-semibold text-dark mb-4">What you can include:</h3>
                  <ul className="list-none p-0">
                    <li className={liClasses}>Step-by-step instructions</li>
                    <li className={liClasses}>Video demonstrations</li>
                    <li className={liClasses}>Code snippets or templates</li>
                    <li className={liClasses}>Screenshots and diagrams</li>
                    <li className={liClasses}>Practice exercises</li>
                    <li className={liClasses}>Quick reference guides</li>
                  </ul>
                </div>


                <button className="w-full py-3.5 px-7 md:py-4 md:px-8 bg-accent text-white border-none rounded text-base md:text-[17px] font-semibold cursor-pointer transition-all duration-300 shadow-md hover:bg-accent-tertiary" onClick={handleCreateTutorial}>
                  Start Creating Tutorial
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateContent;
