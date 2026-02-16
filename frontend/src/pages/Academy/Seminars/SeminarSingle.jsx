/* global process */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function SeminarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seminar, setSeminar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/academy/seminars/${id}`);

        if (!response.ok) {
          throw new Error('Seminar not found');
        }

        const data = await response.json();
        setSeminar(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching seminar:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSeminar();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/academy/seminars');
  };

  const getTypeBadgeClass = (type) => {
    if (!type) return 'bg-red-50 text-red-800';
    const t = type.toLowerCase();
    if (t.includes('recorded')) return 'bg-blue-50 text-blue-700';
    if (t.includes('hybrid')) return 'bg-orange-50 text-orange-800';
    return 'bg-red-50 text-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg px-5 py-10">
        <div className="max-w-content mx-auto">
          <div className="text-center py-16 text-dark-secondary">Loading seminar...</div>
        </div>
      </div>
    );
  }

  if (error || !seminar) {
    return (
      <div className="min-h-screen bg-main-bg px-5 py-10">
        <div className="max-w-content mx-auto">
          <button className="bg-transparent border-none text-dark text-base cursor-pointer mb-8 py-2 inline-flex items-center hover:text-dark-secondary transition-colors" onClick={handleBack}>
            <FiArrowLeft className="inline mr-1" /> Back to Seminars
          </button>
          <div className="text-center py-16 text-dark-secondary">
            <h2 className="text-dark mb-2.5">Seminar Not Found</h2>
            <p>{error || 'The seminar you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const speakerName = seminar.speaker?.name || 'Unknown Speaker';
  const speakerBio = seminar.speaker?.bio || '';
  const speakerAvatar = seminar.speaker?.avatar;
  const scheduleDate = seminar.schedule?.date;
  const scheduleTime = seminar.schedule?.time;
  const joinUrl = seminar.schedule?.joinUrl;
  const seminarType = seminar.type || 'Live Now';

  return (
    <div className="min-h-screen bg-main-bg px-5 py-10">
      <div className="max-w-content mx-auto">
        <button className="bg-transparent border-none text-dark text-base cursor-pointer mb-8 py-2 inline-flex items-center hover:text-dark-secondary transition-colors" onClick={handleBack}>
          <FiArrowLeft className="inline mr-1" /> Back to Seminars
        </button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 bg-light-tertiary rounded-lg p-10 shadow-card mb-12">
          <div className="w-full h-[300px] md:h-[300px] rounded-md overflow-hidden bg-gray-100">
            {seminar.thumbnail ? (
              <img src={seminar.thumbnail} alt={seminar.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[100px] bg-gradient-to-br from-indigo-400 to-purple-500 text-white">🎤</div>
            )}
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex gap-2.5 mb-5 flex-wrap">
              <span className={`px-3.5 py-1.5 rounded-full text-sm font-semibold ${getTypeBadgeClass(seminarType)}`}>
                {seminarType}
              </span>
            </div>
            <h1 className="text-5xl md:text-3xl font-bold text-dark mb-4 leading-tight">{seminar.title}</h1>
            <p className="text-base leading-relaxed text-dark-secondary mb-5">
              {seminar.description?.substring(0, 200)}
              {seminar.description?.length > 200 ? '...' : ''}
            </p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-auto">
              <div className="flex items-center gap-2 text-base text-dark-secondary">
                <span className="text-xl">🗣️</span>
                <span>{speakerName}</span>
              </div>
              <div className="flex items-center gap-2 text-base text-dark-secondary">
                <span className="text-xl">📅</span>
                <span>{scheduleDate || 'Date TBD'}</span>
              </div>
              <div className="flex items-center gap-2 text-base text-dark-secondary">
                <span className="text-xl">🕐</span>
                <span>{scheduleTime || 'Time TBD'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Session - Zoom Placeholder */}
        <div className="mb-12 bg-light-tertiary rounded-lg p-10 shadow-card">
          <h2 className="text-3xl font-bold text-dark mb-6 pb-4 border-b-2 border-border">Live Session</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-dashed border-gray-400 rounded-[14px] px-8 py-10 text-center">
            <div className="text-5xl mb-4">🖥️</div>
            <h3 className="text-xl font-bold text-dark mb-2">Zoom Integration Coming Soon</h3>
            <p className="text-base text-dark-secondary m-0">
              Live video sessions will be available directly on this page.
            </p>
          </div>
        </div>

        {/* About This Event */}
        <div className="mb-12 bg-light-tertiary rounded-lg p-10 shadow-card">
          <h2 className="text-3xl font-bold text-dark mb-6 pb-4 border-b-2 border-border">About This Event</h2>
          <p className="text-base leading-loose text-dark-secondary m-0">
            {seminar.description || 'No description available for this seminar.'}
          </p>
        </div>

        {/* Speaker Information */}
        <div className="mb-12 bg-light-tertiary rounded-lg p-10 shadow-card">
          <h2 className="text-3xl font-bold text-dark mb-6 pb-4 border-b-2 border-border">Speaker</h2>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-start">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center text-[40px] text-muted">
              {speakerAvatar ? (
                <img src={speakerAvatar} alt={speakerName} className="w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-dark mb-2">{speakerName}</h3>
              {speakerBio && <p className="text-md leading-relaxed text-dark-secondary m-0">{speakerBio}</p>}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="mb-12 bg-light-tertiary rounded-lg p-10 shadow-card">
          <h2 className="text-3xl font-bold text-dark mb-6 pb-4 border-b-2 border-border">Schedule</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-center gap-3.5 bg-indigo-50 rounded-md px-5 py-4">
              <span className="text-2xl">📅</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wide text-dark">DATE</span>
                <span className="text-md text-dark-secondary mt-0.5">{scheduleDate || 'Date TBD'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5 bg-indigo-50 rounded-md px-5 py-4">
              <span className="text-2xl">🕐</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wide text-dark">TIME</span>
                <span className="text-md text-dark-secondary mt-0.5">{scheduleTime || 'Time TBD'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Register Button */}
        <div className="mt-12 pt-8 border-t-2 border-border flex justify-center">
          <button className="bg-accent text-white font-semibold rounded-md px-12 py-4 text-lg hover:bg-accent-secondary hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">Register for Event</button>
        </div>
      </div>
    </div>
  );
}

export default SeminarDetail;
