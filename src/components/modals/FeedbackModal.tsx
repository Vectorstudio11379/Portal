import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';

export const FeedbackModal: React.FC = () => {
  const { activeModal, modalData, closeModal, requestChangesDeliverable } = useAgency();
  const [notes, setNotes] = useState('');

  if (activeModal !== 'feedback') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    requestChangesDeliverable(modalData?.deliverableId, notes.trim());
    setNotes('');
    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Request Changes on Deliverable</h3>
          <button type="button" className="modal-close" onClick={closeModal}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <p style={{ fontSize: '13px', color: '#475569' }}>
            Deliverable: <strong>{modalData?.name}</strong>
          </p>
          <div className="form-group">
            <label>Feedback & Revision Notes</label>
            <textarea 
              rows={4} 
              required 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Describe the specific adjustments or revisions required by your team..."
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ backgroundColor: '#d97706' }}>
              Submit Revision Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
