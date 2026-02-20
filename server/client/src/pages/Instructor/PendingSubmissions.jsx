import React, { useState } from 'react';
import './InstructorDashboard.css';

function PendingSubmissions({ submissions, onGrade, onRefresh }) {
  const [filter, setFilter] = useState('all'); // all, pending, graded
  const [searchTerm, setSearchTerm] = useState('');

  // Filter submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="pending-submissions">
      <div className="submissions-header">
        <h2>Pending Submissions ({submissions.length})</h2>
        <button className="refresh-button" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      {/* Search */}
      <div className="submissions-controls">
        <input
          type="text"
          placeholder="Search by student, course, or assignment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? (
            <>
              <h3>No results found</h3>
              <p>Try adjusting your search terms</p>
            </>
          ) : (
            <>
              <h3>No pending submissions</h3>
              <p>All caught up! 🎉</p>
            </>
          )}
        </div>
      ) : (
        <div className="submissions-list">
          {filteredSubmissions.map((submission) => (
            <div key={submission._id} className="submission-item">
              {/* Student Info */}
              <div className="submission-student">
                <div className="student-avatar">
                  {submission.student?.avatar ? (
                    <img src={submission.student.avatar} alt={submission.studentName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {submission.studentName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="student-info">
                  <strong>{submission.studentName}</strong>
                  <span className="student-email">{submission.studentEmail}</span>
                </div>
              </div>

              {/* Assignment Info */}
              <div className="submission-details">
                <div className="detail-row">
                  <span className="detail-label">Course:</span>
                  <span className="detail-value">{submission.courseName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Module:</span>
                  <span className="detail-value">{submission.moduleName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Assignment:</span>
                  <span className="detail-value">{submission.assignmentTitle}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Submitted:</span>
                  <span className="detail-value">{formatDate(submission.submittedAt)}</span>
                </div>
              </div>

              {/* Status */}
              <div className="submission-status">
                <span className="status-badge pending">
                  ⏳ Pending
                </span>
                <span className="max-points">
                  Max: {submission.maxScore} pts
                </span>
              </div>

              {/* Action */}
              <div className="submission-action">
                <button
                  className="grade-button"
                  onClick={() => onGrade(submission._id)}
                >
                  Grade Assignment →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingSubmissions;