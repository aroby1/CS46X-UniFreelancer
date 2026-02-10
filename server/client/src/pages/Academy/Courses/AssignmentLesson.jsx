import React, { useState, useEffect } from 'react';
import './CourseLearning.css';

function AssignmentLesson({ courseId, lesson, onComplete, progress }) {
  const [textSubmission, setTextSubmission] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check if already submitted
  const existingSubmission = progress?.assignmentSubmissions?.find(
    sub => sub.lessonId === lesson._id
  );

  useEffect(() => {
    if (existingSubmission) {
      setTextSubmission(existingSubmission.textSubmission || '');
      setFileUrl(existingSubmission.fileUrl || '');
    }
  }, [existingSubmission]);

  const handleSubmit = async () => {
    if (!textSubmission && !fileUrl) {
      alert('Please provide a submission');
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(
        `/api/courses/${courseId}/progress/assignment/${lesson._id}/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ textSubmission, fileUrl })
        }
      );

      if (!res.ok) throw new Error('Submission failed');

      alert('Assignment submitted successfully!');
      onComplete();

    } catch (err) {
      console.error('Error submitting assignment:', err);
      alert('Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="assignment-lesson">
      <div className="lesson-header">
        <h2>📝 {lesson.title}</h2>
      </div>

      <div className="assignment-content">
        <div className="instructions">
          <h3>Instructions</h3>
          <p>{lesson.instructions || 'Complete the assignment and submit below.'}</p>
        </div>

        {(lesson.assignmentType === 'text' || lesson.assignmentType === 'both') && (
          <div className="submission-section">
            <label>Your Submission</label>
            <textarea
              value={textSubmission}
              onChange={(e) => setTextSubmission(e.target.value)}
              placeholder="Enter your answer here..."
              rows={10}
              disabled={!!existingSubmission}
            />
          </div>
        )}

        {(lesson.assignmentType === 'file' || lesson.assignmentType === 'both') && (
          <div className="submission-section">
            <label>File URL (Optional)</label>
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="Paste Google Drive link, Dropbox link, etc."
              disabled={!!existingSubmission}
            />
            <small>Upload your file to a cloud service and paste the link here</small>
          </div>
        )}

        {existingSubmission ? (
          <div className="submitted-badge">
            ✅ Submitted on {new Date(existingSubmission.submittedAt).toLocaleDateString()}
          </div>
        ) : (
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        )}
      </div>
    </div>
  );
}

export default AssignmentLesson;