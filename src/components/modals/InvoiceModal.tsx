import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';

export const InvoiceModal: React.FC = () => {
  const { activeModal, closeModal, addInvoice } = useAgency();
  const [client, setClient] = useState('Arc Company');
  const [amount, setAmount] = useState(8500);
  const [desc, setDesc] = useState('Monthly Retainer - Nov 2026 Cycle');

  if (activeModal !== 'invoice') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !desc) return;
    addInvoice(client, desc, amount);
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Create New Invoice</h3>
          <button type="button" className="modal-close" onClick={closeModal}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Client</label>
            <select value={client} onChange={(e) => setClient(e.target.value)}>
              <option value="Arc Company">Arc Company</option>
              <option value="Nexus Labs">Nexus Labs</option>
              <option value="Lumina Health">Lumina Health</option>
              <option value="Vanguard AI">Vanguard AI</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount (USD)</label>
            <input 
              type="number" 
              required 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Description / Milestone</label>
            <input 
              type="text" 
              required 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" className="noventra-outline-btn" onClick={closeModal}>Cancel</button>
            <button type="submit" className="noventra-orange-btn">Issue Invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
};
