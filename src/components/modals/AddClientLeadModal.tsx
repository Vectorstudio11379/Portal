import React, { useState } from 'react';
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
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  X
} from 'lucide-react';

export const AddClientLeadModal: React.FC = () => {
  const { activeModal, closeModal, addClientAccount, showToast } = useAgency();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Client Credentials & Identity
  const [clientName, setClientName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Project Scope, SOW & Contact Details
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [projectType, setProjectType] = useState('Fullstack Web Platform');
  const [projectScope, setProjectScope] = useState('Discovery, UX wireframes, Next.js frontend, Node/Postgres APIs, staging CMS & production cutover.');
  const [projectBudget, setProjectBudget] = useState<number>(38500);
  const [startDate, setStartDate] = useState(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  const [targetLaunchDate, setTargetLaunchDate] = useState('Dec 20, 2026');
  const [retainerTier] = useState('Growth Product Tier');
  const [sendWhatsAppOnCreate, setSendWhatsAppOnCreate] = useState(true);

  if (activeModal !== 'add_client_lead') return null;

  // Auto-generate username from email or client name
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!username) {
      const generated = val.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      setUsername(generated);
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = 'VS-';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setShowPassword(true);
    showToast('Secure temporary password generated!');
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !contactName.trim() || !email.trim()) {
      showToast('Please fill in Client Organization, Contact Name, and Email.');
      return;
    }
    if (!password) {
      handleGeneratePassword();
    }
    setStep(2);
  };

  const handleSubmitFinal = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPassword = password || `VS-${clientName.replace(/[^a-zA-Z0-9]/g, '')}#2026`;
    const finalUsername = username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    addClientAccount({
      clientName: clientName.trim(),
      company: `${clientName.trim()} Inc.`,
      contactName: contactName.trim(),
      email: email.trim().toLowerCase(),
      username: finalUsername,
      password: finalPassword,
      role: 'client_owner',
      status: 'active',
      lastLogin: 'Never (Just Provisioned)',
      retainerTier,
      contactAddress: contactAddress.trim() || 'Global Headquarters',
      whatsappNumber: whatsappNumber.trim() || '+1 (555) 000-0000',
      projectType,
      projectScope,
      projectBudget: Number(projectBudget) || 35000,
      paidAmount: 0,
      paymentStatus: 'pending',
      startDate,
      targetLaunchDate
    });

    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div 
        className="modal-container modal-lg" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '700px', width: '92%', maxHeight: '90vh', overflowY: 'auto', padding: 0 }}
      >
        {/* Header */}
        <div className="modal-header-luxury" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 30px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-square icon-orange" style={{ width: '40px', height: '40px' }}>
              <Building2 style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {step === 1 ? '1. Provision Client Login & Credentials' : '2. Web Project Scope & SOW Specifications'}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {step === 1 
                  ? 'Set up client identity, username, and temporary password' 
                  : 'Configure budget, WhatsApp bridge, timelines, and milestones'}
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

        {/* Step Indicator Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', padding: '16px 30px 18px' }}>
          <div style={{ flex: 1, height: '4px', borderRadius: '4px', backgroundColor: '#ff6900' }} />
          <div style={{ flex: 1, height: '4px', borderRadius: '4px', backgroundColor: step === 2 ? '#ff6900' : 'var(--border-subtle)', transition: 'background-color 0.3s' }} />
        </div>

        {/* STEP 1: INITIAL CREDENTIALS & IDENTITY */}
        {step === 1 && (
          <form onSubmit={handleNextStep} style={{ padding: '0 30px 30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Client Organization / Company</span>
                    <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Apex Health Systems" 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)} 
                      required 
                      style={{ paddingLeft: '34px' }}
                    />
                    <Building2 style={{ position: 'absolute', left: '10px', top: '11px', width: '15px', height: '15px', color: '#9ca3af' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Contact Stakeholder Name</span>
                    <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Rachel Torres" 
                      value={contactName} 
                      onChange={(e) => setContactName(e.target.value)} 
                      required 
                      style={{ paddingLeft: '34px' }}
                    />
                    <User style={{ position: 'absolute', left: '10px', top: '11px', width: '15px', height: '15px', color: '#9ca3af' }} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Work Email Address</span>
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="e.g. rachel@apexhealth.com" 
                    value={email} 
                    onChange={(e) => handleEmailChange(e.target.value)} 
                    required 
                    style={{ paddingLeft: '34px' }}
                  />
                  <Mail style={{ position: 'absolute', left: '10px', top: '11px', width: '15px', height: '15px', color: '#9ca3af' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Portal Username</span>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>● For client login</span>
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. rachel.apex" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="form-label" style={{ margin: 0 }}>
                      <span>Temporary Access Password</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={handleGeneratePassword}
                      style={{ fontSize: '11px', color: '#ff6900', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                    >
                      ⚡ Auto-generate
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="form-input" 
                      placeholder="e.g. ApexSecure#2026" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      style={{ paddingLeft: '34px', paddingRight: '36px' }}
                    />
                    <KeyRound style={{ position: 'absolute', left: '10px', top: '11px', width: '15px', height: '15px', color: '#9ca3af' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-subcard" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Sparkles style={{ width: '18px', height: '18px', color: '#ff6900', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Saving credentials will allow you to generate a 1-click WhatsApp onboarding invite and automatically provision client portal access.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <button type="button" className="noventra-outline-btn" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="noventra-orange-btn">
                <span>Continue to Project Scope & SOW</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PROJECT DETAILS, SOW & CONTACT */}
        {step === 2 && (
          <form onSubmit={handleSubmitFinal} style={{ padding: '0 30px 30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>WhatsApp Number (with Country Code)</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>● Instant Chat</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="+1 (415) 555-0199 or +234..." 
                      value={whatsappNumber} 
                      onChange={(e) => setWhatsappNumber(e.target.value)} 
                      style={{ paddingLeft: '34px' }}
                    />
                    <MessageCircle style={{ position: 'absolute', left: '10px', top: '11px', width: '15px', height: '15px', color: '#25D366' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Office / Billing Address</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 100 Montgomery St, San Francisco, CA" 
                      value={contactAddress} 
                      onChange={(e) => setContactAddress(e.target.value)} 
                      style={{ paddingLeft: '34px' }}
                    />
                    <MapPin style={{ position: 'absolute', left: '10px', top: '11px', width: '15px', height: '15px', color: '#9ca3af' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Web Development Scope / Project Type</span>
                  </label>
                  <select 
                    className="form-input"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                  >
                    <option value="Fullstack Web Platform">Fullstack Web Platform (Next.js, Node, Postgres)</option>
                    <option value="Headless E-Commerce & Checkout">Headless E-Commerce & Checkout</option>
                    <option value="SaaS Dashboard & Client Portal">SaaS Dashboard & Client Portal</option>
                    <option value="Brand Identity & Interactive Website">Brand Identity & Interactive Website</option>
                    <option value="Custom API Architecture & Integrations">Custom API Architecture & Integrations</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Total SOW Budget ($ USD)</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>● Off-Platform Wire</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={projectBudget} 
                      onChange={(e) => setProjectBudget(Number(e.target.value))} 
                      required 
                      style={{ paddingLeft: '34px' }}
                    />
                    <DollarSign style={{ position: 'absolute', left: '10px', top: '11px', width: '15px', height: '15px', color: '#16a34a' }} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Detailed Deliverable Scope & Milestones</span>
                </label>
                <textarea 
                  className="form-input" 
                  rows={2} 
                  value={projectScope} 
                  onChange={(e) => setProjectScope(e.target.value)} 
                  style={{ resize: 'vertical', fontSize: '12.5px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(37, 211, 102, 0.08)', borderRadius: '8px', border: '1px solid rgba(37, 211, 102, 0.25)' }}>
                <input 
                  type="checkbox" 
                  id="sendWhatsAppOnCreate"
                  checked={sendWhatsAppOnCreate}
                  onChange={(e) => setSendWhatsAppOnCreate(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#25D366' }}
                />
                <label htmlFor="sendWhatsAppOnCreate" style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageCircle style={{ width: '14px', height: '14px', color: '#25D366' }} />
                  <span>Prompt 1-click WhatsApp message to dispatch login credentials upon saving</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '22px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <button 
                type="button" 
                className="noventra-outline-btn"
                onClick={() => setStep(1)}
              >
                <ArrowLeft style={{ width: '14px', height: '14px' }} />
                <span>Back to Credentials</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="noventra-outline-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="noventra-orange-btn">
                  <Check style={{ width: '15px', height: '15px' }} />
                  <span>Onboard Client & Launch Portal</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
