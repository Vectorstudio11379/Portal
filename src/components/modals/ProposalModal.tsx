import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Sparkles, MessageCircle } from 'lucide-react';

export const ProposalModal: React.FC = () => {
  const { state, activeModal, closeModal, addProposalWithDetails, showToast } = useAgency();

  const clientAccounts = state.admin.clientAccounts || [];
  const teamUsers = state.users.filter(u => u.role === 'admin') || [];

  const [client, setClient] = useState(clientAccounts[0]?.clientName || 'Arc Company');
  const [title, setTitle] = useState('Fullstack Web Application & Custom API Architecture');
  const [assignedLead, setAssignedLead] = useState(teamUsers[0]?.name || 'Owais Anwer');
  const [budget, setBudget] = useState(32000);
  const [duration, setDuration] = useState('8 Weeks');
  const [scope, setScope] = useState('Discovery, Figma design system tokens, Next.js frontend, Node/Postgres backend APIs, CMS integration, and zero-downtime cutover.');
  const [paymentTerms, setPaymentTerms] = useState('30% Kickoff Deposit ($9,600), 40% Staging QA ($12,800), 30% Live Launch ($9,600)');
  const [sendWhatsAppAlert, setSendWhatsAppAlert] = useState(true);

  if (activeModal !== 'proposal') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    addProposalWithDetails({
      client,
      title,
      scope,
      budget,
      duration,
      assignedLead,
      assignedClientUser: client + ' Executive Stakeholder',
      winProbability: 90
    });

    if (sendWhatsAppAlert) {
      const selectedClient = clientAccounts.find(c => c.clientName.toLowerCase() === client.toLowerCase());
      if (selectedClient?.whatsappNumber) {
        const cleanNum = selectedClient.whatsappNumber.replace(/[^0-9]/g, '');
        const msg = `Hi ${selectedClient.contactName}, a new web development proposal "${title}" ($${budget.toLocaleString()} USD) has been generated for ${client}. You can review, sign, and authorize the kickoff deposit directly in your Client Portal.`;
        window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
      }
    }

    closeModal();
    showToast(`✨ Proposal "${title}" dispatched to ${client}!`);
  };

  const depositAmount = Math.round(budget * 0.3);

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="metric-icon-square icon-orange" style={{ width: '38px', height: '38px' }}>
              <Sparkles style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <h3 className="modal-title">Web Development Proposal & Payment Contract</h3>
              <span className="modal-subtitle">Connect team lead, client stakeholder, milestones & bank wire deposit schedule</span>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={closeModal}>&times;</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row-2">
            {/* Client Account Selector */}
            <div className="form-group">
              <label>Target Client Organization</label>
              <select 
                value={client}
                onChange={(e) => setClient(e.target.value)}
                style={{ height: '42px', borderRadius: '8px', border: '1px solid #eae7df', padding: '0 12px', fontSize: '13px', fontWeight: 600 }}
              >
                {clientAccounts.map(c => (
                  <option key={c.id} value={c.clientName}>
                    {c.clientName} ({c.contactName})
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned Project Lead */}
            <div className="form-group">
              <label>Assigned Web Project Lead (User)</label>
              <select 
                value={assignedLead}
                onChange={(e) => setAssignedLead(e.target.value)}
                style={{ height: '42px', borderRadius: '8px', border: '1px solid #eae7df', padding: '0 12px', fontSize: '13px', fontWeight: 600 }}
              >
                {teamUsers.map(u => (
                  <option key={u.id} value={u.name}>
                    {u.name} — {u.adminRoleTitle || 'Project Lead'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Project Title / Scope Name</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Next.js 15 Web Platform & API Architecture"
            />
          </div>

          <div className="form-group">
            <label>Detailed Scope of Work & Deliverables</label>
            <textarea 
              rows={3} 
              value={scope}
              onChange={(e) => setScope(e.target.value)}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Total SOW Budget (USD)</label>
              <input 
                type="number" 
                required 
                value={budget} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setBudget(val);
                  const dep = Math.round(val * 0.3);
                  const mid = Math.round(val * 0.4);
                  const fin = Math.round(val * 0.3);
                  setPaymentTerms(`30% Kickoff Deposit ($${dep.toLocaleString()}), 40% Staging QA ($${mid.toLocaleString()}), 30% Live Launch ($${fin.toLocaleString()})`);
                }}
              />
            </div>
            <div className="form-group">
              <label>Estimated Delivery Duration</label>
              <input 
                type="text" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Terms & Milestone Breakdown */}
          <div className="form-group" style={{ background: '#faf9f6', padding: '14px', borderRadius: '10px', border: '1px solid #eae7df' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ margin: 0, fontWeight: 700, fontSize: '12.5px', color: '#18181b' }}>
                Payment Schedule & Milestone Terms
              </label>
              <span className="noventra-status-pill status-green" style={{ fontSize: '11px' }}>
                30% Deposit: ${depositAmount.toLocaleString()} USD
              </span>
            </div>
            <input 
              type="text" 
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              style={{ fontSize: '12px' }}
            />
          </div>

          {/* WhatsApp Direct Notification Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <input 
              type="checkbox" 
              id="sendWhatsAppAlert"
              checked={sendWhatsAppAlert}
              onChange={(e) => setSendWhatsAppAlert(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#25D366' }}
            />
            <label htmlFor="sendWhatsAppAlert" style={{ margin: 0, fontSize: '12px', color: '#166534', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageCircle style={{ width: '14px', height: '14px', color: '#25D366' }} />
              <span>Automatically send proposal review & deposit payment link to client's WhatsApp</span>
            </label>
          </div>

          <div className="modal-actions flex-between" style={{ marginTop: '16px' }}>
            <span className="proposal-preview-note" style={{ fontSize: '11.5px' }}>
              ⚡ Instant Client Portal bridge & deposit invoice generation
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="noventra-outline-btn" onClick={closeModal}>Cancel</button>
              <button type="submit" className="noventra-orange-btn">
                <span>Create & Send Proposal</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
