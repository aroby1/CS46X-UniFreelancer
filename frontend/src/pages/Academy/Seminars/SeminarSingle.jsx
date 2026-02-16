/* global process */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SeminarDetail.css';

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
    if (!type) return 'live';
    const t = type.toLowerCase();
    if (t.includes('recorded')) return 'recorded';
    if (t.includes('hybrid')) return 'hybrid';
    return 'live';
  };

  if (loading) {
    return (
      <div className="seminar-detail-page">
        <div className="seminar-detail-container">
          <div className="loading-message">Loading seminar...</div>
        </div>
      </div>
    );
  }

  if (error || !seminar) {
    return (
      <div className="seminar-detail-page">
        <div className="seminar-detail-container">
          <button className="back-button" onClick={handleBack}>
            ← Back to Seminars
          </button>
          <div className="error-message">
            <h2>Seminar Not Found</h2>
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
    <div className="seminar-detail-page">
      <div className="seminar-detail-container">
        <button className="back-button" onClick={handleBack}>
          ← Back to Seminars
        </button>

        {/* Hero Section */}
        <div className="seminar-hero">
          <div className="seminar-hero-image">
            {seminar.thumbnail ? (
              <img src={seminar.thumbnail} alt={seminar.title} />
            ) : (
              <div className="placeholder-hero-image">🎤</div>
            )}
          </div>
          <div className="seminar-hero-content">
            <div className="seminar-badges">
              <span className={`seminar-type-badge ${getTypeBadgeClass(seminarType)}`}>
                {seminarType}
              </span>
            </div>
            <h1 className="seminar-title">{seminar.title}</h1>
            <p className="seminar-description">
              {seminar.description?.substring(0, 200)}
              {seminar.description?.length > 200 ? '...' : ''}
            </p>
            <div className="seminar-meta">
              <div className="seminar-meta-item">
                <span className="seminar-meta-icon">🗣️</span>
                <span>{speakerName}</span>
              </div>
              <div className="seminar-meta-item">
                <span className="seminar-meta-icon">📅</span>
                <span>{scheduleDate || 'Date TBD'}</span>
              </div>
              <div className="seminar-meta-item">
                <span className="seminar-meta-icon">🕐</span>
                <span>{scheduleTime || 'Time TBD'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Session - Zoom Placeholder */}
        <div className="seminar-section">
          <h2 className="section-title">Live Session</h2>
          <div className="zoom-placeholder">
            <div className="zoom-placeholder-icon">🖥️</div>
            <h3 className="zoom-placeholder-title">Zoom Integration Coming Soon</h3>
            <p className="zoom-placeholder-text">
              Live video sessions will be available directly on this page.
            </p>
          </div>
        </div>

        {/* About This Event */}
        <div className="seminar-section">
          <h2 className="section-title">About This Event</h2>
          <p className="seminar-overview-text">
            {seminar.description || 'No description available for this seminar.'}
          </p>
        </div>

        {/* Speaker Information */}
        <div className="seminar-section">
          <h2 className="section-title">Speaker</h2>
          <div className="speaker-info">
            <div className="speaker-avatar">
              {speakerAvatar ? (
                <img src={speakerAvatar} alt={speakerName} />
              ) : (
                '👤'
              )}
            </div>
            <div className="speaker-details">
              <h3 className="speaker-name">{speakerName}</h3>
              {speakerBio && <p className="speaker-bio">{speakerBio}</p>}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="seminar-section">
          <h2 className="section-title">Schedule</h2>
          <div className="schedule-cards">
            <div className="schedule-card">
              <span className="schedule-card-icon">📅</span>
              <div className="schedule-card-content">
                <span className="schedule-card-label">DATE</span>
                <span className="schedule-card-value">{scheduleDate || 'Date TBD'}</span>
              </div>
            </div>
            <div className="schedule-card">
              <span className="schedule-card-icon">🕐</span>
              <div className="schedule-card-content">
                <span className="schedule-card-label">TIME</span>
                <span className="schedule-card-value">{scheduleTime || 'Time TBD'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Register Button */}
        <div className="seminar-actions">
          <button className="register-button">Register for Event</button>
        </div>
      </div>
    </div>
  );
}

export default SeminarDetail;
