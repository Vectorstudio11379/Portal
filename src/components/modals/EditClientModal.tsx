import React, { useState, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { 
  Building2, 
  User, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  MapPin, 
  DollarSign, 
  Check, 
  X
} from 'lucide-react';
import type { Lead, ClientAccount } from '../../types';

export const EditClientModal: React.FC = () => {
  const { state, activeModal, modalData, closeModal, updateClientAccount, updateLead, showToast } = useAgency();

  const [targetClientId, setTargetClientId] = useState<string>('');
  const [targetLeadId, setTargetLeadId] = useState<string>('');

  // Form Fields
  const [clientName, setClientName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [projectType, setProjectType] = useState('');
  const [projectScope, setProjectScope] = useState('');
  const [projectBudget, setProjectBudget] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partially_paid' | 'pending'>('pending');
  const [startDate, setStartDate] = useState('');
  const [targetLaunchDate, setTargetLaunchDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [leadStatus, setLeadStatus] = useState<Lead['status']>('Won & Signed');

  // Populate data when modal opens
  useEffect(() => {
    if (activeModal === 'edit_client' && modalData) {
      let client: ClientAccount | undefined;
      let lead: Lead | undefined;

      if (modalData.clientId) {
        client = (state.admin.clientAccounts || []).find(c => c.id === modalData.clientId);
      } else if (modalData.leadId) {
        lead = (state.admin.leads || []).find(l => l.id === modalData.leadId);
        if (lead) {
          client = (state.admin.clientAccounts || []).find(c => 
            c.clientName.toLowerCase() === lead?.company.toLowerCase() ||
            c.contactName.toLowerCase() === lead?.name.toLowerCase()
          );
        }
      }

      if (client) {
        setTargetClientId(client.id);
        setClientName(client.clientName);
        setContactName(client.contactName);
        setEmail(client.email);
        setWhatsappNumber(client.whatsappNumber || '');
        setContactAddress(client.contactAddress || '');
        setProjectType(client.projectType || 'Fullstack Web Platform');
        setProjectScope(client.projectScope || '');
        setProjectBudget(client.projectBudget || 35000);
        setPaidAmount(client.paidAmount || 0);
        setPaymentStatus(client.paymentStatus || 'pending');
        setStartDate(client.startDate || 'Oct 10, 2026');
        setTargetLaunchDate(client.targetLaunchDate || 'Dec 15, 2026');
        setUsername(client.username || client.email.split('@')[0]);
        setPassword(client.password || 'ArcLaunch#2026');
      }

      if (lead) {
        setTargetLeadId(lead.id);
        if (!client) {
          setClientName(lead.company);
          setContactName(lead.name);
          setEmail(lead.email || `${lead.name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`);
          setWhatsappNumber(lead.phone || '');
          setContactAddress(lead.contactAddress || '');
          setProjectType(lead.projectScope || 'Enterprise Web SOW');
          setProjectScope(lead.notes || '');
          setProjectBudget(lead.projectBudget || 30000);
          setPaidAmount(0);
          setPaymentStatus('pending');
          setStartDate(lead.contactedDate || 'Oct 15, 2026');
          setTargetLaunchDate(lead.followUpDate || 'Dec 15, 2026');
          setUsername(lead.name.toLowerCase().replace(/[^a-z0-9]/g, '.'));
          setPassword('ClientPass#2026');
        }
        setLeadStatus(lead.status);
      } else if (client) {
        const matchingLead = (state.admin.leads || []).find(l => 
          l.company.toLowerCase() === client?.clientName.toLowerCase() ||
          l.name.toLowerCase() === client?.contactName.toLowerCase()
        );
        if (matchingLead) {
          setTargetLeadId(matchingLead.id);
          setLeadStatus(matchingLead.status);
        }
      }
    }
  }, [activeModal, modalData, state.admin.clientAccounts, state.admin.leads]);

  if (activeModal !== 'edit_client') return null;

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = 'VS-';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setShowPassword(true);
    showToast('New temporary password generated!');
  };

  const handleOpenWhatsApp = () => {
    if (!whatsappNumber) {
      showToast('No WhatsApp number provided.');
      return;
    }
    const clean = whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${clean}?text=${encodeURIComponent(`Hi ${contactName}, checking in from VectorStudio regarding your ${clientName} project specifications.`)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const computedStatus: 'paid' | 'partially_paid' | 'pending' = 
      paidAmount >= projectBudget && projectBudget > 0 
        ? 'paid' 
        : (paidAmount > 0 ? 'partially_paid' : paymentStatus);

    if (targetClientId) {
      updateClientAccount(targetClientId, {
        clientName: clientName.trim(),
        company: `${clientName.trim()} Inc.`,
        contactName: contactName.trim(),
        email: email.trim().toLowerCase(),
        whatsappNumber: whatsappNumber.trim(),
        contactAddress: contactAddress.trim(),
        projectType,
        projectScope,
        projectBudget: Number(projectBudget),
        paidAmount: Number(paidAmount),
        paymentStatus: computedStatus,
        startDate,
        targetLaunchDate,
        username: username.trim(),
        password: password.trim()
      });
    }

    if (targetLeadId) {
      updateLead(targetLeadId, {
        name: contactName.trim(),
        company: clientName.trim(),
        phone: whatsappNumber.trim(),
        email: email.trim().toLowerCase(),
        contactAddress: contactAddress.trim(),
        projectBudget: Number(projectBudget),
        projectScope: projectType,
        status: leadStatus,
        followUpDate: targetLaunchDate
      });
    }

    closeModal();
    showToast(`All client details for "${clientName}" updated and saved.`);
  };

  const remaining = Math.max(0, projectBudget - paidAmount);

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div 
        className="modal-container modal-lg" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', width: '94%', maxHeight: '90vh', overflowY: 'auto', padding: 0 }}
      >
        {/* Header */}
        <div className="modal-header-luxury" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 30px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-square icon-orange" style={{ width: '40px', height: '40px' }}>
              <Building2 style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Edit Client & Lead Specifications
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Update organization profile, credentials, budget, WhatsApp channel, and project scope.
              </span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={closeModal}
            className="noventra-circle-btn"
            style={{ width: '32px', height: '32px' }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 30px 30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Row 1: Org & Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Client Organization / Company</span>
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    required 
                    style={{ paddingLeft: '34px' }}
                  />
                  <Building2 style={{ position: 'absolute', left: '11px', top: '13px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Primary Stakeholder / Contact Name</span>
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={contactName} 
                    onChange={(e) => setContactName(e.target.value)} 
                    required 
                    style={{ paddingLeft: '34px' }}
                  />
                  <User style={{ position: 'absolute', left: '11px', top: '13px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>

            {/* Row 2: Email & WhatsApp */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Work Email Address</span>
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ paddingLeft: '34px' }}
                  />
                  <Mail style={{ position: 'absolute', left: '11px', top: '13px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    WhatsApp Number
                  </label>
                  {whatsappNumber && (
                    <button 
                      type="button" 
                      onClick={handleOpenWhatsApp}
                      style={{ fontSize: '11px', color: '#25D366', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      💬 Test Chat
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={whatsappNumber} 
                    onChange={(e) => setWhatsappNumber(e.target.value)} 
                    placeholder="+1 (415) 555-0199" 
                    style={{ paddingLeft: '34px' }}
                  />
                  <MessageCircle style={{ position: 'absolute', left: '11px', top: '13px', width: '16px', height: '16px', color: '#25D366' }} />
                </div>
              </div>
            </div>

            {/* Office Address */}
            <div className="form-group">
              <label className="form-label">
                <span>Office / Billing Address</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  value={contactAddress} 
                  onChange={(e) => setContactAddress(e.target.value)} 
                  placeholder="e.g. 100 Montgomery St, San Francisco, CA" 
                  style={{ paddingLeft: '34px' }}
                />
                <MapPin style={{ position: 'absolute', left: '11px', top: '13px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Credentials Row */}
            <div className="form-subcard">
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginBottom: '12px' }}>
                Client Portal Access & Login Credentials
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Portal Username</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Password</label>
                    <button 
                      type="button" 
                      onClick={handleGeneratePassword}
                      style={{ fontSize: '11px', color: '#ff6900', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      ⚡ Reset Password
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="form-input" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      style={{ paddingLeft: '34px', paddingRight: '36px' }}
                    />
                    <KeyRound style={{ position: 'absolute', left: '11px', top: '13px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '11px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial & Scope Settings */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Total SOW Budget ($)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={projectBudget} 
                    onChange={(e) => setProjectBudget(Number(e.target.value))} 
                    style={{ paddingLeft: '34px' }}
                  />
                  <DollarSign style={{ position: 'absolute', left: '11px', top: '13px', width: '16px', height: '16px', color: '#16a34a' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Off-Platform Amount Paid ($)</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={paidAmount} 
                    onChange={(e) => setPaidAmount(Number(e.target.value))} 
                    style={{ paddingLeft: '34px' }}
                  />
                  <DollarSign style={{ position: 'absolute', left: '11px', top: '13px', width: '16px', height: '16px', color: '#ff6900' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">CRM Pipeline Stage</label>
                <select 
                  className="form-input"
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value as any)}
                >
                  <option value="Won & Signed">Won & Signed (Active Client)</option>
                  <option value="Proposal Sent">Proposal Sent (Awaiting Deposit)</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Contacted">Contacted</option>
                  <option value="New Lead">New Lead</option>
                </select>
              </div>
            </div>

            {/* Live Calculation Box */}
            <div className="form-subcard" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Remaining Balance: <strong style={{ color: remaining > 0 ? '#ff6900' : '#16a34a' }}>${remaining.toLocaleString()} USD</strong>
              </span>
              <span className={`noventra-status-pill ${paidAmount >= projectBudget && projectBudget > 0 ? 'status-green' : (paidAmount > 0 ? 'status-orange' : 'status-gray')}`} style={{ fontSize: '11px', fontWeight: 700 }}>
                {paidAmount >= projectBudget && projectBudget > 0 ? '● FULLY SETTLED' : (paidAmount > 0 ? '● PARTIALLY PAID' : '● PAYMENT DUE')}
              </span>
            </div>

            {/* Project Scope Description */}
            <div className="form-group">
              <label className="form-label">Project Scope Description</label>
              <textarea 
                className="form-input" 
                rows={3} 
                value={projectScope} 
                onChange={(e) => setProjectScope(e.target.value)} 
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Timelines */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Project Kickoff Date</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Launch Milestone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={targetLaunchDate} 
                  onChange={(e) => setTargetLaunchDate(e.target.value)} 
                />
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
            <button type="button" className="noventra-outline-btn" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="noventra-orange-btn">
              <Check style={{ width: '15px', height: '15px' }} />
              <span>Save Changes & Sync Everywhere</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
