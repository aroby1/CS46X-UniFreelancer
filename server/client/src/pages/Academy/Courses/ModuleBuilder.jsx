import React from 'react';
import './ModuleBuilder.css';
import LearningMaterialsInput from './LearningMaterialsInput';
import AssignmentBuilder from './AssignmentBuilder';

function ModuleBuilder({ 
  currentModule, 
  setCurrentModule, 
  onSave,
  newOutcome,
  setNewOutcome,
  addLearningOutcome,
  removeLearningOutcome
}) {

  const handleSaveModule = () => {
    if (!currentModule.title) {
      alert('Please enter a module title');
      return;
    }
    if (!currentModule.overview) {
      alert('Please enter a module overview');
      return;
    }
    if (currentModule.learningOutcomes.length === 0) {
      alert('Please add at least one learning outcome');
      return;
    }

    onSave(currentModule);
  };

  const handleAssignmentSave = (assignment) => {
    setCurrentModule(prev => ({
      ...prev,
      assignment: assignment
    }));
  };

  return (
    <div className="module-builder">
      <div className="builder-section">
        <h3>Module Information</h3>
        
        <div className="form-group">
          <label>Module Title *</label>
          <input
            type="text"
            value={currentModule.title}
            onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
            placeholder="e.g., Module 1: Brand Identity and Social Currency"
          />
        </div>

        <div className="form-group">
          <label>Module Overview *</label>
          <textarea
            value={currentModule.overview}
            onChange={(e) => setCurrentModule({ ...currentModule, overview: e.target.value })}
            placeholder="This module focuses on building a strong brand identity and leveraging social currency..."
            rows={4}
          />
        </div>
      </div>

      <div className="builder-section">
        <h3>Learning Outcomes</h3>
        <p className="helper-text">After successful completion of this module, students will be able to:</p>
        
        <div className="form-group">
          <div className="add-item-container">
            <input
              type="text"
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.target.value)}
              placeholder="e.g., Define and apply the concept of social currency..."
              onKeyPress={(e) => e.key === 'Enter' && addLearningOutcome()}
            />
            <button type="button" onClick={addLearningOutcome} className="add-button">
              Add Outcome
            </button>
          </div>
        </div>

        {currentModule.learningOutcomes.length > 0 && (
          <div className="outcomes-list">
            {currentModule.learningOutcomes.map((outcome, index) => (
              <div key={index} className="outcome-item">
                <span className="outcome-number">{index + 1}.</span>
                <span className="outcome-text">{outcome}</span>
                <button onClick={() => removeLearningOutcome(index)} className="remove-button-small">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {currentModule.learningOutcomes.length === 0 && (
          <p className="empty-state">No learning outcomes added yet</p>
        )}
      </div>

      <div className="builder-section">
        <h3>Learning Materials</h3>
        <LearningMaterialsInput 
          materials={currentModule.learningMaterials}
          setMaterials={(materials) => setCurrentModule({ ...currentModule, learningMaterials: materials })}
        />
      </div>

      <div className="builder-section">
        <h3>Assignment (Optional)</h3>
        <AssignmentBuilder 
          assignment={currentModule.assignment}
          onSave={handleAssignmentSave}
          onRemove={() => setCurrentModule({ ...currentModule, assignment: null })}
        />
      </div>

      <div className="module-actions">
        <button type="button" onClick={handleSaveModule} className="save-module-button">
          + Add Module to Course
        </button>
      </div>
    </div>
  );
}

export default ModuleBuilder;