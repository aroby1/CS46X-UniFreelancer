import React, { useState } from 'react';
import './AssignmentBuilder.css';

function AssignmentBuilder({ assignment, onSave, onRemove }) {
  const [isBuilding, setIsBuilding] = useState(false);
  const [assignmentData, setAssignmentData] = useState(
    assignment || {
      title: '',
      purpose: '',
      instructions: '',
      parts: [],
      gradingCriteria: [],
      deliverableFormat: '',
      totalPoints: 30
    }
  );

  const [newPart, setNewPart] = useState({
    partNumber: 1,
    title: '',
    instructions: ''
  });

  const [newCriterion, setNewCriterion] = useState({
    name: '',
    points: 0
  });

  const addPart = () => {
    if (!newPart.title || !newPart.instructions) {
      alert('Please fill in part title and instructions');
      return;
    }

    setAssignmentData({
      ...assignmentData,
      parts: [...assignmentData.parts, { ...newPart, partNumber: assignmentData.parts.length + 1 }]
    });

    setNewPart({ partNumber: assignmentData.parts.length + 2, title: '', instructions: '' });
  };

  const removePart = (index) => {
    setAssignmentData({
      ...assignmentData,
      parts: assignmentData.parts.filter((_, i) => i !== index)
    });
  };

  const addCriterion = () => {
    if (!newCriterion.name || newCriterion.points <= 0) {
      alert('Please fill in criterion name and points');
      return;
    }

    setAssignmentData({
      ...assignmentData,
      gradingCriteria: [...assignmentData.gradingCriteria, newCriterion]
    });

    setNewCriterion({ name: '', points: 0 });
  };

  const removeCriterion = (index) => {
    setAssignmentData({
      ...assignmentData,
      gradingCriteria: assignmentData.gradingCriteria.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    if (!assignmentData.title) {
      alert('Please enter an assignment title');
      return;
    }
    if (!assignmentData.purpose) {
      alert('Please enter the assignment purpose');
      return;
    }
    if (assignmentData.parts.length === 0) {
      alert('Please add at least one part');
      return;
    }
    if (assignmentData.gradingCriteria.length === 0) {
      alert('Please add grading criteria');
      return;
    }

    onSave(assignmentData);
    setIsBuilding(false);
  };

  const handleCancel = () => {
    if (assignment) {
      setAssignmentData(assignment);
    } else {
      setAssignmentData({
        title: '',
        purpose: '',
        instructions: '',
        parts: [],
        gradingCriteria: [],
        deliverableFormat: '',
        totalPoints: 30
      });
    }
    setIsBuilding(false);
  };

  if (assignment && !isBuilding) {
    return (
      <div className="assignment-preview">
        <div className="assignment-preview-header">
          <div>
            <h4>{assignment.title}</h4>
            <p className="assignment-purpose">{assignment.purpose}</p>
            <div className="assignment-stats">
              <span>{assignment.parts.length} parts</span>
              <span>•</span>
              <span>{assignment.gradingCriteria.reduce((sum, c) => sum + c.points, 0)} points</span>
            </div>
          </div>
          <div className="assignment-preview-actions">
            <button onClick={() => setIsBuilding(true)} className="edit-button">
              Edit
            </button>
            <button onClick={onRemove} className="remove-button">
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isBuilding && !assignment) {
    return (
      <div className="no-assignment">
        <p>No assignment added yet</p>
        <button onClick={() => setIsBuilding(true)} className="add-assignment-button">
          + Add Assignment
        </button>
      </div>
    );
  }

  return (
    <div className="assignment-builder">
      <div className="form-group">
        <label>Assignment Title *</label>
        <input
          type="text"
          value={assignmentData.title}
          onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
          placeholder="e.g., Building Your Brand Identity & Social Currency Strategy"
        />
      </div>

      <div className="form-group">
        <label>Purpose *</label>
        <textarea
          value={assignmentData.purpose}
          onChange={(e) => setAssignmentData({ ...assignmentData, purpose: e.target.value })}
          placeholder="This assignment will help you apply the principles of brand identity..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>General Instructions (optional)</label>
        <textarea
          value={assignmentData.instructions}
          onChange={(e) => setAssignmentData({ ...assignmentData, instructions: e.target.value })}
          placeholder="Overall instructions for completing this assignment..."
          rows={2}
        />
      </div>

      <div className="assignment-parts-section">
        <h4>Assignment Parts</h4>
        
        <div className="add-part-form">
          <div className="form-group">
            <label>Part Title *</label>
            <input
              type="text"
              value={newPart.title}
              onChange={(e) => setNewPart({ ...newPart, title: e.target.value })}
              placeholder="e.g., Define Your Brand Identity"
            />
          </div>

          <div className="form-group">
            <label>Part Instructions *</label>
            <textarea
              value={newPart.instructions}
              onChange={(e) => setNewPart({ ...newPart, instructions: e.target.value })}
              placeholder="Create a detailed description of your brand that includes..."
              rows={3}
            />
          </div>

          <button type="button" onClick={addPart} className="add-button">
            + Add Part
          </button>
        </div>

        {assignmentData.parts.length > 0 && (
          <div className="parts-list">
            {assignmentData.parts.map((part, index) => (
              <div key={index} className="part-item">
                <div className="part-header">
                  <strong>Part {part.partNumber}: {part.title}</strong>
                  <button onClick={() => removePart(index)} className="remove-button-small">
                    ×
                  </button>
                </div>
                <p className="part-instructions">{part.instructions}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grading-criteria-section">
        <h4>Grading Criteria</h4>
        
        <div className="add-criterion-form">
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label>Criterion Name *</label>
              <input
                type="text"
                value={newCriterion.name}
                onChange={(e) => setNewCriterion({ ...newCriterion, name: e.target.value })}
                placeholder="e.g., Brand Identity Summary"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Points *</label>
              <input
                type="number"
                value={newCriterion.points}
                onChange={(e) => setNewCriterion({ ...newCriterion, points: parseInt(e.target.value) || 0 })}
                placeholder="8"
                min="0"
              />
            </div>
          </div>

          <button type="button" onClick={addCriterion} className="add-button">
            + Add Criterion
          </button>
        </div>

        {assignmentData.gradingCriteria.length > 0 && (
          <div className="criteria-list">
            {assignmentData.gradingCriteria.map((criterion, index) => (
              <div key={index} className="criterion-item">
                <span className="criterion-name">{criterion.name}</span>
                <span className="criterion-points">({criterion.points} pts)</span>
                <button onClick={() => removeCriterion(index)} className="remove-button-small">
                  ×
                </button>
              </div>
            ))}
            <div className="total-points">
              <strong>Total Points: </strong>
              {assignmentData.gradingCriteria.reduce((sum, c) => sum + c.points, 0)} pts
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Deliverable Format</label>
        <input
          type="text"
          value={assignmentData.deliverableFormat}
          onChange={(e) => setAssignmentData({ ...assignmentData, deliverableFormat: e.target.value })}
          placeholder="e.g., Submit as a written document (Word or PDF)"
        />
      </div>

      <div className="assignment-actions">
        <button type="button" onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
        <button type="button" onClick={handleSave} className="save-button">
          Save Assignment
        </button>
      </div>
    </div>
  );
}

export default AssignmentBuilder;