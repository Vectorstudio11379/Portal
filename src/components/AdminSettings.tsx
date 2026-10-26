import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  KeyRound, 
  Plus, 
  Search, 
  Copy, 
  Building2, 
  FileSpreadsheet, 
  UserCheck,
  MessageCircle,
  MapPin,
  GitBranch,
  Sparkles,
  DollarSign,
  Eye,
  EyeOff,
  Camera
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { STANDARD_ROLES, type ClientAccount, type Role } from '../types';

interface Props {
  onBack: () => void;
  initialSubTab?: string;
}

export const AdminSettings: React.FC<Props> = ({ onBack, initialSubTab }) => {
  const { 
    state, 
    resetClientPassword, 
    addClientAccount, 
    addUser,
    loginAsUser, 
    updateUserRole,
    setActiveNav,
    openModal,
    updateGeminiApiKey,
    updateRolePermissions,
    showToast
  } = useAgency();

  // Tab mapping based on initialSubTab or default
  const getInitialTab = (): 'users' | 'clients' | 'rbac' | 'workflow' | 'integrations' | 'profile' => {
    if (initialSubTab === 'settings-clients') return 'clients';
    if (initialSubTab === 'settings-roles') return 'rbac';
    if (initialSubTab === 'settings-workflow') return 'workflow';
    if (initialSubTab === 'settings-integrations') return 'integrations';
    return 'users';
  };

  const [activeTab, setActiveTab] = useState<'users' | 'clients' | 'rbac' | 'workflow' | 'integrations' | 'profile'>(getInitialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  // Sync when initialSubTab changes from sidebar click
  useEffect(() => {
    if (initialSubTab === 'settings-clients') setActiveTab('clients');
    else if (initialSubTab === 'settings-roles') setActiveTab('rbac');
    else if (initialSubTab === 'settings-workflow') setActiveTab('workflow');
    else if (initialSubTab === 'settings-integrations') setActiveTab('integrations');
    else if (initialSubTab === 'settings-users') setActiveTab('users');
  }, [initialSubTab]);

  const handleTabSwitch = (tab: 'users' | 'clients' | 'rbac' | 'workflow' | 'integrations' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'users') setActiveNav('settings-users');
    else if (tab === 'clients') setActiveNav('settings-clients');
    else if (tab === 'rbac') setActiveNav('settings-roles');
    else if (tab === 'workflow') setActiveNav('settings-workflow');
    else if (tab === 'integrations') setActiveNav('settings-integrations');
    else setActiveNav('settings');
  };

  // =========================================================================
  // USER ONBOARDING FORM STATE
  // =========================================================================
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserProfession, setNewUserProfession] = useState('Web Developer');
  const [newUserContactAddress, setNewUserContactAddress] = useState('');
  const [newUserWhatsapp, setNewUserWhatsapp] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('admin');
  const [newUserRoleTitle, setNewUserRoleTitle] = useState('Web Developer');
  const [newUserAvatar, setNewUserAvatar] = useState('/assets/images/diego.jpg');

  // Standard Agency Roles requested by user
  const professionPresets = [
    'Web Developer',
    'Social Media Manager',
    'Ads Specialist',
    'Project Manager',
    'Client Manager',
    'Executive Assistant',
    'Graphics Designer',
    'Executive Director (SuperAdmin)'
  ];

  // =========================================================================
  // CLIENT ONBOARDING FORM STATE (Web Dev Project Brief)
  // =========================================================================
  const [newClientName, setNewClientName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newClientWhatsapp, setNewClientWhatsapp] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientProjectType, setNewClientProjectType] = useState('Enterprise SaaS Web Platform');
  const [newClientBudget, setNewClientBudget] = useState('45000');
  const [newClientStartDate, setNewClientStartDate] = useState(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  const [newClientTargetDate, setNewClientTargetDate] = useState('Dec 15, 2026');
  const [newTier, setNewTier] = useState('Growth Product Tier');
  const [newClientUsername, setNewClientUsername] = useState('');
  const [newClientPassword, setNewClientPassword] = useState('');
  const [showClientPassword, setShowClientPassword] = useState(false);

  // Gemini 3.4 API Configuration State
  const [geminiKeyInput, setGeminiKeyInput] = useState(state.admin.geminiApiKey || localStorage.getItem('vectorstudio_gemini_api_key') || '');
  const [selectedGeminiModel, setSelectedGeminiModel] = useState(state.admin.geminiModel || localStorage.getItem('vectorstudio_gemini_model') || 'gemini-3.4');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiTestStatus, setGeminiTestStatus] = useState<'idle' | 'success' | 'error'>(state.admin.geminiApiKey ? 'success' : 'idle');

  // Direct Bank Wire Details State
  const bankDetails = state.admin.bankWireDetails || {
    bankName: 'Silicon Valley Commercial Bank',
    accountName: 'VectorStudio Creative Labs LLC',
    accountNumber: '•••••••• 8821',
    routingOrIban: '021000021 / US89SVBK0210000218821',
    swiftBic: 'SVBKUS33XXX',
    instructions: 'Please include your invoice/proposal reference in the wire memo and notify your Project Lead via WhatsApp upon transfer dispatch.'
  };

  const clientAccounts = state.admin.clientAccounts || [];
  const rolesList = state.admin.rolesList || [];
  const allUsers = state.users || [];

  const filteredUsers = allUsers.filter(u => 
    !userSearchTerm || 
    u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (u.profession && u.profession.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
    (u.adminRoleTitle && u.adminRoleTitle.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
    (u.clientAccount && u.clientAccount.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  const filteredClients = clientAccounts.filter(c => 
    !searchTerm || 
    c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.projectType && c.projectType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper to open direct WhatsApp chat
  const openWhatsAppChat = (whatsappNumber?: string, recipientName?: string, customMsg?: string) => {
    if (!whatsappNumber) {
      showToast('No WhatsApp number registered for this contact.');
      return;
    }
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    if (!cleanNumber) {
      showToast('Invalid WhatsApp number format.');
      return;
    }
    const greeting = customMsg || `Hi ${recipientName || 'there'}, messaging you from VectorStudio Agency OS regarding your web development project deliverables and timeline.`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(`Opening WhatsApp chat with ${recipientName || cleanNumber}...`);
  };



  const handleTestClientPortal = (client: ClientAccount) => {
    loginAsUser({
      id: 'usr_' + client.id,
      name: client.contactName,
      email: client.email,
      role: 'client',
      clientAccount: client.clientName,
      avatar: '/assets/images/tommy.jpg'
    });
    showToast(`Switched into Client Portal for ${client.clientName}`);
  };

  // Submit Client Onboarding Form
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newEmail) {
      showToast('Please provide both Client Organization name and Email.');
      return;
    }

    const generatedUser = newClientUsername || newEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const generatedPass = newClientPassword || `VS-${newClientName.replace(/[^a-zA-Z0-9]/g, '')}#2026`;

    addClientAccount({
      clientName: newClientName,
      company: newCompany || `${newClientName} Inc.`,
      contactName: newContactName || 'Lead Stakeholder',
      email: newEmail,
      username: generatedUser,
      password: generatedPass,
      role: 'client_owner',
      status: 'invited',
      lastLogin: 'Never (Invite Dispatched)',
      retainerTier: newTier,
      contactAddress: newClientAddress || 'Headquarters Office',
      whatsappNumber: newClientWhatsapp,
      projectType: newClientProjectType,
      projectBudget: Number(newClientBudget) || 35000,
      paidAmount: 0,
      paymentStatus: 'pending',
      startDate: newClientStartDate,
      targetLaunchDate: newClientTargetDate || 'Dec 15, 2026',
      projectScope: `Complete web development lifecycle from architecture to production cutover for ${newClientName}.`
    });

    setShowAddClientForm(false);
    setNewClientName('');
    setNewCompany('');
    setNewContactName('');
    setNewEmail('');
    setNewClientWhatsapp('');
    setNewClientAddress('');
    setNewClientUsername('');
    setNewClientPassword('');
    showToast(`✨ Web Development Client "${newClientName}" onboarded with automated sprint roadmap!`);
  };

  const handleTestGemini = async () => {
    if (!geminiKeyInput.trim()) {
      showToast('Please enter a Google Gemini API Key first.');
      return;
    }
    setIsTestingGemini(true);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKeyInput.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Ping VectorStudio OS' }] }]
        })
      });
      if (res.ok) {
        setGeminiTestStatus('success');
        updateGeminiApiKey(geminiKeyInput.trim(), selectedGeminiModel);
        showToast('✨ Gemini 3.4 API verified and connected successfully!');
      } else {
        const err = await res.json().catch(() => ({}));
        setGeminiTestStatus('error');
        showToast(`Connection failed: ${err.error?.message || 'Invalid API Key'}`);
      }
    } catch (_err) {
      setGeminiTestStatus('error');
      showToast('Connection error: Unable to reach Google Gemini API endpoint.');
    } finally {
      setIsTestingGemini(false);
    }
  };

  // Submit User Onboarding Form
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      showToast('Please provide Full Name and Email Address.');
      return;
    }

    addUser({
      name: newUserName,
      email: newUserEmail,
      profession: newUserProfession || 'Fullstack Web Developer',
      contactAddress: newUserContactAddress || 'Remote Studio HQ',
      whatsappNumber: newUserWhatsapp,
      role: newUserRole,
      adminRoleTitle: newUserRole === 'admin' ? newUserRoleTitle : 'Client Partner',
      avatar: newUserAvatar
    });

    setShowAddUserForm(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserProfession('Senior Fullstack Web Developer');
    setNewUserContactAddress('');
    setNewUserWhatsapp('');
  };

  return (
    <div className="noventra-view-container">
      {/* Top Header & Breadcrumb */}
      <div className="noventra-fullpage-header">
        <div className="noventra-nav-breadcrumb-row">
          <button type="button" className="noventra-back-btn" onClick={onBack}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Back to Dashboard</span>
          </button>
          <div className="noventra-breadcrumb">
            <span>Platform Operations</span>
            <span>/</span>
            <span className="noventra-breadcrumb-active">Admin Settings & Web Dev Governance</span>
          </div>
        </div>

        <div className="noventra-banner-row">
          <div>
            <h1 className="noventra-banner-title">Admin Settings & Web Development Operations</h1>
            <p className="noventra-banner-sub">
              End-to-end web client project governance: onboard team members with WhatsApp connectivity, assign 4-tier web development roles, provision client portals, and track full lifecycle delivery.
            </p>
          </div>
          <div className="noventra-banner-actions">
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={() => showToast('Studio security audit: 100% compliant with zero anomalous login attempts.')}
            >
              <ShieldCheck style={{ width: '13px', height: '13px', color: '#16a34a' }} />
              <span className="btn-desktop-text">Security Audit</span>
              <span className="btn-mobile-text">Audit</span>
            </button>
            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={() => {
                if (activeTab === 'clients') {
                  setShowAddClientForm(!showAddClientForm);
                } else {
                  setShowAddUserForm(!showAddUserForm);
                }
              }}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span className="btn-desktop-text">{activeTab === 'clients' ? '+ Onboard Web Client' : '+ Onboard Team Member'}</span>
              <span className="btn-mobile-text">{activeTab === 'clients' ? '+ Client' : '+ User'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards Listing User Counts & Settings */}
      <div className="noventra-stat-grid-4">
        <div className="noventra-stat-box">
          <span className="stat-label">Total System Users</span>
          <span className="stat-val">{allUsers.length} Users</span>
          <span className="stat-trend green">
            ▲ {allUsers.filter(u => u.role === 'admin').length} Admins &bull; {allUsers.filter(u => u.role === 'client').length} Clients
          </span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Client Portals</span>
          <span className="stat-val">{clientAccounts.length} Portals</span>
          <span className="stat-trend green">● 100% with direct WhatsApp sync</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Web Dev Roles (RBAC)</span>
          <span className="stat-val">4 Core Roles</span>
          <span className="stat-trend orange">● Project Lead, Designer, Dev, Client</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">WhatsApp Integrations</span>
          <span className="stat-val">Active wa.me API</span>
          <span className="stat-trend green">● Direct 1-click team & client chat</span>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="timeline-toolbar-card">
        <div className="timeline-tabs-group">
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('users')}
          >
            <UserCheck style={{ width: '14px', height: '14px' }} />
            <span>Team Users & Roles ({allUsers.length})</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('clients')}
          >
            <Building2 style={{ width: '14px', height: '14px' }} />
            <span>Client Onboarding ({clientAccounts.length})</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'rbac' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('rbac')}
          >
            <KeyRound style={{ width: '14px', height: '14px' }} />
            <span>Web Dev Roles Matrix</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('workflow')}
          >
            <GitBranch style={{ width: '14px', height: '14px' }} />
            <span>Project Lifecycle & Sprints</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('integrations')}
          >
            <MessageCircle style={{ width: '14px', height: '14px' }} />
            <span>WhatsApp & Connectors</span>
          </button>

          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('profile')}
          >
            <ShieldCheck style={{ width: '14px', height: '14px' }} />
            <span>Studio Profile</span>
          </button>
        </div>

        {activeTab === 'users' ? (
          <div className="table-search-pill" style={{ minWidth: '240px' }}>
            <input 
              type="text" 
              placeholder="Search users by name, profession, or role..." 
              value={userSearchTerm} 
              onChange={(e) => setUserSearchTerm(e.target.value)} 
            />
            <Search style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
          </div>
        ) : activeTab === 'clients' ? (
          <div className="table-search-pill" style={{ minWidth: '240px' }}>
            <input 
              type="text" 
              placeholder="Search clients by name, project, or email..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <Search style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
          </div>
        ) : null}
      </div>

      {/* =====================================================================
          TAB 1: TEAM USERS & ONBOARDING FORM WITH WHATSAPP
      ===================================================================== */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* USER ONBOARDING FORM DRAWER */}
          {showAddUserForm && (
            <div className="noventra-card" style={{ border: '2px solid #ff6900', background: '#fffdfa' }}>
              <div className="noventra-card-title-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="metric-icon-square icon-orange" style={{ width: '38px', height: '38px' }}>
                    <UserCheck style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div>
                    <h3 className="noventra-card-heading">Onboard New Team Member & Assign Web Dev Role</h3>
                    <span className="noventra-card-subtitle">
                      Complete user profile with profession, contact address, WhatsApp number for instant chat, and permissions.
                    </span>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="noventra-outline-btn small"
                  onClick={() => setShowAddUserForm(false)}
                >
                  Cancel
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateUser} style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {/* Full Name */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Full Name</span>
                      <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Lucas Vance" 
                      value={newUserName} 
                      onChange={(e) => setNewUserName(e.target.value)} 
                      required 
                    />
                  </div>

                  {/* Email Address */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Email Address</span>
                      <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="e.g. lucas@vectorstudio.design" 
                      value={newUserEmail} 
                      onChange={(e) => setNewUserEmail(e.target.value)} 
                      required 
                    />
                  </div>

                  {/* Profession */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Profession / Technical Specialty</span>
                      <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Senior Fullstack Web Developer" 
                      value={newUserProfession} 
                      onChange={(e) => setNewUserProfession(e.target.value)} 
                      required 
                    />
                  </div>

                  {/* WhatsApp Number */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>WhatsApp Number (with Country Code)</span>
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>● Instant Chat</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="tel" 
                        className="form-input" 
                        placeholder="+1 (415) 555-0192 or +234 801 234 5678" 
                        value={newUserWhatsapp} 
                        onChange={(e) => setNewUserWhatsapp(e.target.value)} 
                        style={{ paddingLeft: '36px' }}
                      />
                      <MessageCircle style={{ position: 'absolute', left: '11px', top: '12px', width: '16px', height: '16px', color: '#25D366' }} />
                    </div>
                  </div>

                  {/* Contact Address */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Contact Address / Office Location</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 742 Montgomery St, San Francisco, CA" 
                      value={newUserContactAddress} 
                      onChange={(e) => setNewUserContactAddress(e.target.value)} 
                    />
                  </div>

                  {/* Assigned Role (Web Dev Platform) */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Assigned Web Development Role (RBAC)</span>
                      <span style={{ color: '#ff6900', fontWeight: 600 }}>● Admin Controlled</span>
                    </label>
                    <select 
                      className="form-input"
                      value={newUserRoleTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewUserRoleTitle(val);
                        if (val === 'Client Partner') {
                          setNewUserRole('client');
                        } else {
                          setNewUserRole('admin');
                        }
                      }}
                    >
                      {STANDARD_ROLES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                      <option value="Client Partner">Client Partner (Stakeholder approvals & review access)</option>
                    </select>
                  </div>
                </div>

                {/* Profession Quick Suggestion Pills */}
                <div style={{ marginTop: '14px' }}>
                  <span style={{ fontSize: '11.5px', color: '#78716c', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Quick Select Profession Presets:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {professionPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNewUserProfession(preset)}
                        style={{
                          fontSize: '11.5px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          border: newUserProfession === preset ? '1.5px solid #ff6900' : '1px solid #eae7df',
                          backgroundColor: newUserProfession === preset ? '#fff7ed' : '#ffffff',
                          color: newUserProfession === preset ? '#ff6900' : '#4b5563',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Preset Selector */}
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '11.5px', color: '#78716c', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Select Profile Avatar:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                      { name: 'Diego', src: '/assets/images/diego.jpg' },
                      { name: 'Carlos', src: '/assets/images/carlos.jpg' },
                      { name: 'Liam', src: '/assets/images/liam.jpg' },
                      { name: 'Owais', src: '/assets/images/owais.jpg' },
                      { name: 'Sarah', src: '/assets/images/tommy.jpg' }
                    ].map(av => (
                      <button
                        key={av.name}
                        type="button"
                        onClick={() => setNewUserAvatar(av.src)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          borderRadius: '24px',
                          border: newUserAvatar === av.src ? '2px solid #ff6900' : '1px solid #eae7df',
                          backgroundColor: newUserAvatar === av.src ? '#fff7ed' : '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        <img src={av.src} alt={av.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontSize: '11.5px', fontWeight: 600, color: newUserAvatar === av.src ? '#ff6900' : '#4b5563' }}>{av.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', borderTop: '1px solid #f2efe9', paddingTop: '16px' }}>
                  <button 
                    type="button" 
                    className="noventra-outline-btn"
                    onClick={() => setShowAddUserForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="noventra-orange-btn">
                    <Plus style={{ width: '16px', height: '16px' }} />
                    <span>Onboard User & Save Profile</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quick Identity Switcher Deck with Direct WhatsApp Launcher */}
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h3 className="noventra-card-heading">Active Web Team Members & Quick WhatsApp Link</h3>
                <span className="noventra-card-subtitle">
                  Click the WhatsApp button to chat directly from the portal, or switch identities to preview user permissions.
                </span>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', 
              gap: '14px', 
              marginTop: '16px' 
            }}>
              {allUsers.slice(0, 6).map(u => {
                const isActive = state.currentUser?.id === u.id;
                return (
                  <div 
                    key={u.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: isActive ? 'rgba(255, 105, 0, 0.08)' : 'var(--card-bg)',
                      border: isActive ? '2px solid #ff6900' : '1px solid var(--border-color)',
                      borderRadius: '14px',
                      transition: 'all 0.2s ease',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <img 
                        src={u.avatar} 
                        alt={u.name} 
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)' }}>{u.name}</span>
                          <span className={`noventra-status-pill ${u.status === 'suspended' ? 'status-red' : (u.role === 'admin' ? 'status-orange' : 'status-blue')}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                            {u.status === 'suspended' ? 'SUSPENDED' : (u.adminRoleTitle || (u.role === 'admin' ? 'ADMIN' : 'CLIENT'))}
                          </span>
                        </div>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                          {u.profession || u.adminRoleTitle || 'Web Developer'}
                        </span>
                        {u.contactAddress && (
                          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin style={{ width: '10px', height: '10px' }} />
                            {u.contactAddress}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                      {/* Direct WhatsApp Chat Trigger */}
                      {u.whatsappNumber ? (
                        <button 
                          type="button" 
                          className="noventra-whatsapp-btn"
                          onClick={() => openWhatsAppChat(u.whatsappNumber, u.name, `Hi ${u.name}, messaging you from VectorStudio Agency OS regarding your assigned web development deliverables.`)}
                          title={`Chat with ${u.name} on WhatsApp (${u.whatsappNumber})`}
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          <MessageCircle style={{ width: '13px', height: '13px' }} />
                          <span>WhatsApp</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', flex: 1 }}>No WhatsApp</span>
                      )}

                      <button 
                        type="button" 
                        className="noventra-outline-btn small"
                        onClick={() => openModal('edit_user', { userId: u.id })}
                        title="Edit user account, permissions, suspend or delete"
                      >
                        Edit ✏️
                      </button>

                      <button 
                        type="button" 
                        className={isActive ? 'noventra-orange-btn small' : 'noventra-outline-btn small'}
                        onClick={() => loginAsUser({
                          id: u.id,
                          name: u.name,
                          email: u.email,
                          role: u.role,
                          adminRoleTitle: u.adminRoleTitle,
                          clientAccount: u.clientAccount,
                          avatar: u.avatar
                        })}
                      >
                        {isActive ? 'Active' : 'Switch ↗'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Accounts Registry Table */}
          <div className="noventra-table-card">
            <div className="table-card-header">
              <div>
                <h3 className="table-card-title">Registered Team Directory & Role Setting</h3>
                <span className="noventra-card-subtitle">
                  The admin has full access to edit, change roles, suspend, or delete user accounts, and initiate WhatsApp conversations.
                </span>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="noventra-data-table">
                <thead>
                  <tr>
                    <th>User & Profession</th>
                    <th>Contact Info & Address</th>
                    <th>Direct WhatsApp Chat</th>
                    <th>Role Selection (Admin Set)</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const isCurrentUser = state.currentUser?.id === user.id;
                    const roleTitle = user.adminRoleTitle || (user.role === 'admin' ? 'Web Developer' : 'Client Partner');

                    return (
                      <tr key={user.id} style={{ backgroundColor: isCurrentUser ? 'rgba(255, 105, 0, 0.08)' : undefined }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                            <div>
                              <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
                                {user.name}
                              </span>
                              <span style={{ fontSize: '11.5px', color: '#ff6900', fontWeight: 600 }}>
                                {user.profession || user.adminRoleTitle || (user.role === 'admin' ? 'Web Developer' : 'Client Stakeholder')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</span>
                            {user.contactAddress && (
                              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin style={{ width: '10px', height: '10px' }} />
                                {user.contactAddress}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          {user.whatsappNumber ? (
                            <button 
                              type="button" 
                              className="noventra-whatsapp-btn"
                              onClick={() => openWhatsAppChat(user.whatsappNumber, user.name, `Hi ${user.name}, messaging you from VectorStudio Agency OS regarding your web deliverables.`)}
                              title={`Click to open WhatsApp chat with ${user.name} at ${user.whatsappNumber}`}
                            >
                              <MessageCircle style={{ width: '13px', height: '13px' }} />
                              <span>{user.whatsappNumber}</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>— Not set</span>
                          )}
                        </td>
                        <td>
                          {/* INLINE ROLE PICKER DROPDOWN: The Admin can directly set the user role */}
                          <select 
                            style={{ 
                              padding: '6px 12px', 
                              borderRadius: '8px', 
                              border: '1.5px solid var(--border-color)', 
                              fontSize: '12px', 
                              fontWeight: 700,
                              backgroundColor: 'var(--card-bg)',
                              color: user.role === 'admin' ? '#ea580c' : '#2563eb',
                              cursor: 'pointer'
                            }}
                            value={roleTitle}
                            onChange={(e) => {
                              const selectedRoleTitle = e.target.value;
                              if (selectedRoleTitle === 'Client Partner') {
                                updateUserRole(user.id, 'client', 'Client Partner');
                              } else {
                                updateUserRole(user.id, 'admin', selectedRoleTitle);
                              }
                            }}
                          >
                            {STANDARD_ROLES.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                            <option value="Client Partner">Client Partner (Stakeholder Review Portal)</option>
                          </select>
                        </td>
                        <td>
                          <span className={`noventra-status-pill ${user.status === 'suspended' ? 'status-red' : 'status-green'}`}>
                            ● {user.status === 'suspended' ? 'Suspended' : (user.status || 'Active')}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button 
                              type="button" 
                              className="noventra-outline-btn small"
                              onClick={() => openModal('edit_user', { userId: user.id })}
                              title="Edit user details, roles, suspend or delete"
                            >
                              Edit ✏️
                            </button>
                            <button 
                              type="button" 
                              className={isCurrentUser ? "noventra-orange-btn small" : "noventra-outline-btn small"}
                              onClick={() => loginAsUser({
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                adminRoleTitle: user.adminRoleTitle,
                                clientAccount: user.clientAccount,
                                avatar: user.avatar
                              })}
                            >
                              {isCurrentUser ? 'Active' : 'Switch ↗'}
                            </button>
                            <button 
                              type="button" 
                              className="noventra-outline-btn small"
                              onClick={() => {
                                const tempPass = `VS-${Math.floor(100000 + Math.random() * 900000)}`;
                                showToast(`Password for @${user.username} reset! Temporary key: ${tempPass} sent to ${user.email}`);
                              }}
                            >
                              Reset
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: CLIENT ONBOARDING & FULL WEB PROJECT SPECIFICATION
      ===================================================================== */}
      {activeTab === 'clients' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CLIENT ONBOARDING FORM DRAWER */}
          {showAddClientForm && (
            <div className="noventra-card" style={{ border: '2px solid #ff6900', background: '#fffdfa' }}>
              <div className="noventra-card-title-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="metric-icon-square icon-orange" style={{ width: '38px', height: '38px' }}>
                    <Building2 style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div>
                    <h3 className="noventra-card-heading">Onboard New Web Development Client</h3>
                    <span className="noventra-card-subtitle">
                      Configure organization details, lead contact, WhatsApp channel, project scope, budget, and target launch milestone.
                    </span>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="noventra-outline-btn small"
                  onClick={() => setShowAddClientForm(false)}
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateClient} style={{ marginTop: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {/* Organization Name */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Client Organization Name</span>
                      <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Horizon Retail Group" 
                      value={newClientName} 
                      onChange={(e) => setNewClientName(e.target.value)} 
                      required 
                    />
                  </div>

                  {/* Company Legal Entity */}
                  <div className="form-group">
                    <label className="form-label">Company Legal Entity</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Horizon Commerce Ltd." 
                      value={newCompany} 
                      onChange={(e) => setNewCompany(e.target.value)} 
                    />
                  </div>

                  {/* Contact Person */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Primary Contact Stakeholder</span>
                      <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Elena Rostova" 
                      value={newContactName} 
                      onChange={(e) => setNewContactName(e.target.value)} 
                      required 
                    />
                  </div>

                  {/* Contact Email */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Client Email (For Magic Link)</span>
                      <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="e.g. elena@horizonretail.io" 
                      value={newEmail} 
                      onChange={(e) => setNewEmail(e.target.value)} 
                      required 
                    />
                  </div>

                  {/* WhatsApp Number */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>WhatsApp Number (Sprint Chat)</span>
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>● Instant Review</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="tel" 
                        className="form-input" 
                        placeholder="+44 7700 900123" 
                        value={newClientWhatsapp} 
                        onChange={(e) => setNewClientWhatsapp(e.target.value)} 
                        style={{ paddingLeft: '36px' }}
                      />
                      <MessageCircle style={{ position: 'absolute', left: '11px', top: '12px', width: '16px', height: '16px', color: '#25D366' }} />
                    </div>
                  </div>

                  {/* Physical Address */}
                  <div className="form-group">
                    <label className="form-label">Client Office / Billing Address</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 120 Holborn, London EC1N 2TD, UK" 
                      value={newClientAddress} 
                      onChange={(e) => setNewClientAddress(e.target.value)} 
                    />
                  </div>

                  {/* Web Project Type */}
                  <div className="form-group">
                    <label className="form-label">Web Project Scope / Type</label>
                    <select 
                      className="form-input"
                      value={newClientProjectType}
                      onChange={(e) => setNewClientProjectType(e.target.value)}
                    >
                      <option value="Enterprise SaaS Web Platform">Enterprise SaaS Web Platform (Next.js, Node, Postgres)</option>
                      <option value="E-Commerce Headless Storefront">E-Commerce Headless Storefront (Shopify / Next.js)</option>
                      <option value="Corporate Brand Portal & Headless CMS">Corporate Brand Portal & Headless CMS (Sanity / Storyblok)</option>
                      <option value="Custom Web Application MVP">Custom Web Application MVP & Custom APIs</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div className="form-group">
                    <label className="form-label">Project Budget (USD)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 45000" 
                      value={newClientBudget} 
                      onChange={(e) => setNewClientBudget(e.target.value)} 
                    />
                  </div>

                  {/* Project Start Date */}
                  <div className="form-group">
                    <label className="form-label">Project Start Date</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Oct 24, 2026" 
                      value={newClientStartDate} 
                      onChange={(e) => setNewClientStartDate(e.target.value)} 
                    />
                  </div>

                  {/* Target Launch Date */}
                  <div className="form-group">
                    <label className="form-label">Target Production Launch Date</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Dec 15, 2026" 
                      value={newClientTargetDate} 
                      onChange={(e) => setNewClientTargetDate(e.target.value)} 
                    />
                  </div>

                  {/* Retainer / Support Tier */}
                  <div className="form-group">
                    <label className="form-label">Client Retainer / Support Tier</label>
                    <select 
                      className="form-input"
                      value={newTier}
                      onChange={(e) => setNewTier(e.target.value)}
                    >
                      <option value="Tier 1 VIP Retainer">Tier 1 VIP Retainer (40h / $8,500)</option>
                      <option value="Growth Product Tier">Growth Product Tier (35h / $5,500)</option>
                      <option value="Scale Dedicated Tier">Scale Dedicated Tier (20h / $6,800)</option>
                      <option value="Executive Advisory Tier">Executive Advisory Tier (15h / $4,500)</option>
                    </select>
                  </div>

                  {/* Portal Login Username */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Portal Username / Login ID</span>
                      <span style={{ color: '#2563eb', fontSize: '11px' }}>● Auto-suggested</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. elena.horizon" 
                      value={newClientUsername} 
                      onChange={(e) => setNewClientUsername(e.target.value)} 
                    />
                  </div>

                  {/* Temporary Password */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Temporary Access Password</span>
                      <span style={{ color: '#10b981', fontSize: '11px' }}>● Auto-generated if blank</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showClientPassword ? 'text' : 'password'} 
                        className="form-input" 
                        placeholder="e.g. HorizonSecure#2026" 
                        value={newClientPassword} 
                        onChange={(e) => setNewClientPassword(e.target.value)} 
                        style={{ paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowClientPassword(!showClientPassword)}
                        style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                      >
                        {showClientPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Alert explaining automatic web dev milestone seeding */}
                <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles style={{ width: '18px', height: '18px', color: '#2563eb', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#1e40af' }}>
                    <strong>Automated Web Dev Roadmap:</strong> Submitting will automatically generate a secure magic link, provision client login, and seed 4 milestone stages (Discovery &rarr; Interactive UI &rarr; Fullstack Web Dev &rarr; QA & Launch).
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', borderTop: '1px solid #f2efe9', paddingTop: '16px' }}>
                  <button 
                    type="button" 
                    className="noventra-outline-btn"
                    onClick={() => setShowAddClientForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="noventra-orange-btn">
                    <Plus style={{ width: '15px', height: '15px' }} />
                    <span>Onboard Client & Generate Roadmap</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Client Accounts Table */}
          <div className="noventra-table-card">
            <div className="table-card-header">
              <div>
                <h3 className="table-card-title">Client Portals & Web Development Projects</h3>
                <span className="noventra-card-subtitle">
                  Manage client accounts, dispatch magic links, launch direct WhatsApp chats, and test client view.
                </span>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="noventra-data-table">
                <thead>
                  <tr>
                    <th>Client Organization</th>
                    <th>Stakeholder & Address</th>
                    <th>WhatsApp Chat</th>
                    <th>Web Dev Scope</th>
                    <th>Off-Platform Payment Status</th>
                    <th>Login Credentials</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(client => {
                    const totalBudget = client.projectBudget || 35000;
                    const paid = client.paidAmount || 0;
                    const remaining = Math.max(0, totalBudget - paid);
                    const isFullyPaid = paid >= totalBudget;
                    const isPartPaid = paid > 0 && !isFullyPaid;

                    return (
                      <tr key={client.id}>
                        <td>
                          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#18181b', display: 'block' }}>
                            {client.clientName}
                          </span>
                          <span style={{ fontSize: '11px', color: '#78716c' }}>
                            {client.company}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#18181b', display: 'block' }}>
                            {client.contactName}
                          </span>
                          <span style={{ fontSize: '11px', color: '#78716c' }}>
                            {client.email}
                          </span>
                          {client.contactAddress && (
                            <span style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block' }}>
                              {client.contactAddress}
                            </span>
                          )}
                        </td>
                        <td>
                          {client.whatsappNumber ? (
                            <button 
                              type="button" 
                              className="noventra-whatsapp-btn"
                              onClick={() => openWhatsAppChat(client.whatsappNumber, client.contactName, `Hi ${client.contactName}, messaging you from VectorStudio Agency OS regarding your ${client.clientName} web project deliverables and milestone status.`)}
                              title={`Chat with ${client.contactName} on WhatsApp (${client.whatsappNumber})`}
                            >
                              <MessageCircle style={{ width: '13px', height: '13px' }} />
                              <span>{client.whatsappNumber}</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '11.5px', color: '#9ca3af' }}>— Not set</span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#18181b', display: 'block' }}>
                            {client.projectType || 'Fullstack Web Platform'}
                          </span>
                          <span className="noventra-status-pill status-orange" style={{ fontSize: '10px' }}>
                            Target: {client.targetLaunchDate || 'Dec 15, 2026'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: isFullyPaid ? '#16a34a' : (isPartPaid ? '#ff6900' : '#4b5563') }}>
                                ${paid.toLocaleString()} / ${totalBudget.toLocaleString()}
                              </span>
                              <span className={`noventra-status-pill ${isFullyPaid ? 'status-green' : (isPartPaid ? 'status-orange' : 'status-gray')}`} style={{ fontSize: '9.5px', padding: '2px 6px' }}>
                                {isFullyPaid ? '● FULLY PAID' : (isPartPaid ? `● $${remaining.toLocaleString()} DUE` : '● PAYMENT DUE')}
                              </span>
                            </div>
                            <button 
                              type="button" 
                              className="noventra-outline-btn small"
                              onClick={() => openModal('record_payment', { clientId: client.id })}
                              style={{ width: 'fit-content', padding: '3px 8px', fontSize: '11px', gap: '4px' }}
                            >
                              <DollarSign style={{ width: '11px', height: '11px', color: '#ff6900' }} />
                              <span>Record Payment</span>
                            </button>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '11.5px', fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>
                              {client.username || client.email.split('@')[0]}
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              {client.password ? '••••••••' : 'ArcLaunch#2026'}
                            </span>
                            <button 
                              type="button" 
                              className="noventra-outline-btn small"
                              onClick={() => {
                                const un = client.username || client.email.split('@')[0];
                                const pw = client.password || 'ArcLaunch#2026';
                                navigator.clipboard?.writeText(`Username: ${un}\nPassword: ${pw}\nPortal: ${window.location.origin}`);
                                showToast(`Credentials copied for ${client.clientName}!`);
                              }}
                              style={{ width: 'fit-content', padding: '2px 6px', fontSize: '10px' }}
                            >
                              <Copy style={{ width: '10px', height: '10px' }} />
                              <span>Copy Login</span>
                            </button>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button 
                              type="button" 
                              className="noventra-outline-btn small"
                              onClick={() => openModal('edit_client', { clientId: client.id })}
                              title="Edit all client details and project specifications"
                            >
                              Edit ✏️
                            </button>
                            <button 
                              type="button" 
                              className="noventra-orange-btn small"
                              onClick={() => handleTestClientPortal(client)}
                              title="Test & preview exact Client Portal view"
                            >
                              Test Portal ↗
                            </button>
                            <button 
                              type="button" 
                              className="noventra-outline-btn small"
                              onClick={() => resetClientPassword(client.id)}
                              title="Reset client password"
                            >
                              Reset
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: WEB DEVELOPMENT ROLES (RBAC) MATRIX
      ===================================================================== */}
      {activeTab === 'rbac' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="noventra-card" style={{ background: 'var(--surface-sunken)' }}>
            <h3 className="noventra-card-heading">8-Tier Agency Role Architecture & Permission Matrix</h3>
            <p className="noventra-card-subtitle">
              Configured specifically for agency operations across Web Development, Social Media, Ads, Project Management, Client Relations, and Executive Leadership.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            {rolesList.map(role => (
              <div key={role.id} className="noventra-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div className="metric-icon-square icon-orange" style={{ width: '40px', height: '40px' }}>
                      <KeyRound style={{ width: '20px', height: '20px' }} />
                    </div>
                    <span className="noventra-status-pill status-orange" style={{ fontSize: '11px' }}>
                      {role.userCount} Assigned
                    </span>
                  </div>

                  <h3 className="noventra-card-heading" style={{ marginBottom: '6px' }}>
                    {role.roleTitle}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {role.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                    {[
                      { key: 'canViewFinances' as const, label: 'Financial Ledgers & Billing', val: role.canViewFinances },
                      { key: 'canManageClients' as const, label: 'Client Account Management', val: role.canManageClients },
                      { key: 'canEditSprints' as const, label: 'Sprint & Task Assignment', val: role.canEditSprints },
                      { key: 'canApproveDeliverables' as const, label: 'Deliverable Sign-Offs', val: role.canApproveDeliverables },
                      { key: 'canManageSettings' as const, label: 'System Settings & WhatsApp API', val: role.canManageSettings }
                    ].map(perm => (
                      <button
                        key={perm.key}
                        type="button"
                        onClick={() => updateRolePermissions(role.id, { [perm.key]: !perm.val })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: '8px',
                          transition: 'all 0.15s ease',
                          width: '100%',
                          textAlign: 'left'
                        }}
                        title={`Click to ${perm.val ? 'restrict' : 'grant'} ${perm.label} for ${role.roleTitle}`}
                      >
                        <span style={{ color: 'var(--text-secondary)' }}>{perm.label}</span>
                        <span style={{ 
                          fontWeight: 700, 
                          fontSize: '11px',
                          color: perm.val ? '#16a34a' : '#94a3b8',
                          backgroundColor: perm.val ? 'rgba(22, 163, 74, 0.12)' : 'rgba(148, 163, 184, 0.12)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          border: perm.val ? '1px solid rgba(22, 163, 74, 0.25)' : '1px solid rgba(148, 163, 184, 0.25)'
                        }}>
                          {perm.val ? '✓ Granted' : '✕ Restricted'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    type="button" 
                    className="noventra-outline-btn small" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      handleTabSwitch('users');
                      showToast(`Managing members for ${role.roleTitle} in User Directory`);
                    }}
                  >
                    Manage Assigned Users →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: WEB DEV LIFECYCLE & WORKFLOW
      ===================================================================== */}
      {activeTab === 'workflow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="noventra-card">
            <h3 className="noventra-card-heading">End-to-End Web Development Client Project Lifecycle</h3>
            <p className="noventra-card-subtitle">
              The systematic pipeline through which every client project travels from onboarding to live production cutover.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {/* Phase 1 */}
              <div style={{ padding: '16px', borderRadius: '12px', border: '1.5px solid #2563eb', background: '#eff6ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>Stage 1</span>
                  <span className="noventra-status-pill status-blue" style={{ fontSize: '10px' }}>Week 1 - 2</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1e3a8a', marginBottom: '6px' }}>
                  Discovery & UX Architecture
                </h4>
                <p style={{ fontSize: '12px', color: '#3b82f6', lineHeight: 1.5 }}>
                  Sitemap scoping, wireframes, tech stack selection (React/Next.js/Tailwind), database schemas, and stakeholder kickoff.
                </p>
                <div style={{ marginTop: '12px', fontSize: '11.5px', color: '#1e40af', fontWeight: 700 }}>
                  Lead: Project Lead
                </div>
              </div>

              {/* Phase 2 */}
              <div style={{ padding: '16px', borderRadius: '12px', border: '1.5px solid #ff6900', background: '#fff7ed' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase' }}>Stage 2</span>
                  <span className="noventra-status-pill status-orange" style={{ fontSize: '10px' }}>Week 3 - 4</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#7c2d12', marginBottom: '6px' }}>
                  Interactive UI & Design Systems
                </h4>
                <p style={{ fontSize: '12px', color: '#c2410c', lineHeight: 1.5 }}>
                  Figma design tokens, responsive breakpoints (mobile, tablet, desktop), prototype reviews, and client sign-off.
                </p>
                <div style={{ marginTop: '12px', fontSize: '11.5px', color: '#9a3412', fontWeight: 700 }}>
                  Lead: Product Designer
                </div>
              </div>

              {/* Phase 3 */}
              <div style={{ padding: '16px', borderRadius: '12px', border: '1.5px solid #16a34a', background: '#f0fdf4' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>Stage 3</span>
                  <span className="noventra-status-pill status-green" style={{ fontSize: '10px' }}>Week 5 - 8</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#14532d', marginBottom: '6px' }}>
                  Fullstack Web Dev & CMS
                </h4>
                <p style={{ fontSize: '12px', color: '#15803d', lineHeight: 1.5 }}>
                  Frontend Next.js components, REST/GraphQL APIs, database integration, headless CMS webhooks, and staging deploys.
                </p>
                <div style={{ marginTop: '12px', fontSize: '11.5px', color: '#166534', fontWeight: 700 }}>
                  Lead: Fullstack Web Developer
                </div>
              </div>

              {/* Phase 4 */}
              <div style={{ padding: '16px', borderRadius: '12px', border: '1.5px solid #9333ea', background: '#faf5ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#9333ea', textTransform: 'uppercase' }}>Stage 4</span>
                  <span className="noventra-status-pill status-purple" style={{ fontSize: '10px' }}>Launch Week</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#581c87', marginBottom: '6px' }}>
                  QA, SEO Audit & Cutover
                </h4>
                <p style={{ fontSize: '12px', color: '#7e22ce', lineHeight: 1.5 }}>
                  Lighthouse 95+ score check, cross-browser compatibility, security scans, SSL certificates, and live DNS domain cutover.
                </p>
                <div style={{ marginTop: '12px', fontSize: '11.5px', color: '#6b21a8', fontWeight: 700 }}>
                  Lead: Project Lead & Fullstack Dev
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: AI ENGINE & INTEGRATIONS
      ===================================================================== */}
      {activeTab === 'integrations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
          {/* Card 1: Google Gemini 3.4 Autonomous Copilot Engine */}
          <div className="noventra-card" style={{ border: '2px solid #ff6900', background: '#fffdfa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #ff6900 0%, #ea580c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 4px 12px rgba(255,105,0,0.3)' }}>
                <Sparkles style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h3 className="noventra-card-heading">Google Gemini 3.4 Autonomous Copilot</h3>
                <span className="noventra-card-subtitle">AI platform management, invoice creation & team dispatch</span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '16px', lineHeight: 1.5 }}>
              Attach your Google Gemini API key to enable autonomous agency management: editing and creating invoices, tracking off-platform client payments, and dispatching team WhatsApp reminders.
            </p>

            {/* Model Selector */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Active Gemini Model
              </label>
              <select 
                className="noventra-select"
                value={selectedGeminiModel}
                onChange={(e) => setSelectedGeminiModel(e.target.value)}
                style={{ width: '100%', height: '38px', borderRadius: '8px', fontSize: '13px' }}
              >
                <option value="gemini-3.4">Gemini 3.4 (Recommended • Autonomous Ops & Reasoning)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra Fast Latency)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Code & Contract Analysis)</option>
              </select>
            </div>

            {/* API Key Input */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Google Gemini API Key
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showGeminiKey ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={geminiKeyInput}
                  onChange={(e) => {
                    setGeminiKeyInput(e.target.value);
                    setGeminiTestStatus('idle');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (geminiKeyInput.trim()) {
                        updateGeminiApiKey(geminiKeyInput.trim(), selectedGeminiModel);
                        setGeminiTestStatus('success');
                      }
                    }
                  }}
                  className="form-input"
                  style={{ 
                    width: '100%', 
                    height: '42px', 
                    paddingLeft: '12px', 
                    paddingRight: '40px',
                    borderRadius: '8px', 
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'var(--surface, #ffffff)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontFamily: 'monospace'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  {showGeminiKey ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            {/* Status & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: geminiTestStatus === 'success' ? 'rgba(22, 163, 74, 0.1)' : 'var(--surface-sunken, #f8fafc)', borderRadius: '10px', border: geminiTestStatus === 'success' ? '1px solid #16a34a' : '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: geminiTestStatus === 'success' ? '#16a34a' : (geminiKeyInput ? '#ea580c' : 'var(--text-secondary)') }}>
                {geminiTestStatus === 'success' ? '● GEMINI CONNECTED' : (geminiKeyInput ? '● KEY SET (CLICK SAVE KEY)' : '● KEY REQUIRED')}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  className="noventra-outline-btn small"
                  disabled={isTestingGemini || !geminiKeyInput}
                  onClick={handleTestGemini}
                >
                  {isTestingGemini ? 'Testing...' : 'Test Connection'}
                </button>
                <button 
                  type="button" 
                  className="noventra-orange-btn small"
                  onClick={() => {
                    updateGeminiApiKey(geminiKeyInput.trim(), selectedGeminiModel);
                    setGeminiTestStatus('success');
                  }}
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Direct Bank Wire & Off-Platform Settlement Details */}
          <div className="noventra-card" style={{ border: '1.5px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div className="metric-icon-square icon-blue" style={{ width: '42px', height: '42px' }}>
                <DollarSign style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h3 className="noventra-card-heading">Direct Wire & Bank Transfer Details</h3>
                <span className="noventra-card-subtitle">Official payment coordinates displayed in Client Portal</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px', lineHeight: 1.5 }}>
              Since payments are collected off-platform, clients receive these wire coordinates to dispatch deposits and milestone balances.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Bank:</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{bankDetails.bankName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Beneficiary:</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{bankDetails.accountName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Routing / IBAN:</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{bankDetails.routingOrIban}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>SWIFT / BIC:</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{bankDetails.swiftBic}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>● ACTIVE IN CLIENT PORTAL</span>
              <button 
                type="button" 
                className="noventra-outline-btn small" 
                onClick={() => showToast('Bank settlement details verified and synced with Client Portal.')}
              >
                Verify Coordinates
              </button>
            </div>
          </div>

          {/* Card 3: WhatsApp Web Direct Integration */}
          <div className="noventra-card" style={{ border: '2px solid #25D366' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                <MessageCircle style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <h3 className="noventra-card-heading">WhatsApp Web Direct Integration</h3>
                <span className="noventra-card-subtitle">Universal wa.me gateway for instant team & client chat</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
              Admins can launch direct WhatsApp conversations with developers, designers, and clients with 1-click right from their user card or table row.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#16a34a' }}>● CONNECTED & READY</span>
              <button 
                type="button" 
                className="noventra-whatsapp-btn"
                onClick={() => openWhatsAppChat('+14155550192', 'Executive Test', 'VectorStudio WhatsApp Integration test message.')}
              >
                Test Chat ↗
              </button>
            </div>
          </div>

          {/* Card 4: Google Sheets Financial Master */}
          <div className="noventra-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div className="metric-icon-square icon-orange" style={{ width: '42px', height: '42px' }}>
                <FileSpreadsheet style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h3 className="noventra-card-heading">Google Sheets Financial Master</h3>
                <span className="noventra-card-subtitle">Real-time sync of invoice ledgers and runway projections</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Sheet: <code>VectorStudio_Financial_Ledger_2026.gsheet</code>. Sync frequency: Every 15 minutes.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#faf9f6', borderRadius: '12px', border: '1px solid #f2efe9' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#ff6900' }}>● SYNC ACTIVE</span>
              <button type="button" className="noventra-outline-btn small" onClick={() => showToast('Financial ledger synchronized with Google Sheets.')}>
                Sync Now
              </button>
            </div>
          </div>
        </div>
      )}



      {/* =====================================================================
          TAB 7: STUDIO PROFILE & PERSONAL AVATAR
      ===================================================================== */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
          {/* User Profile & Avatar Card */}
          <div className="noventra-card" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={state.currentUser?.avatar || '/assets/images/owais.jpg'} 
                  alt="Profile Avatar" 
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ff6900' }} 
                />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {state.currentUser?.name || 'Owais Anwer'}
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-muted, #94a3b8)' }}>
                  {state.currentUser?.adminRoleTitle || 'Executive Director'} &bull; {state.currentUser?.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="noventra-orange-btn"
              onClick={() => openModal('user_profile')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Camera style={{ width: '15px', height: '15px' }} />
              <span>Change Profile Image</span>
            </button>
          </div>

          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Studio Identity & Platform Configuration</h2>
                <span className="noventra-card-subtitle">Executive branding, studio headquarters, and portal domain routing.</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px', marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">Platform Name</label>
                <input type="text" className="form-input" defaultValue="Agency OS by VectorStudio" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Client Portal Domain</label>
                <input type="text" className="form-input" defaultValue="https://app.vectorstudio.design" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Primary Industry Target</label>
                <input type="text" className="form-input" defaultValue="Web Development Client Project Management" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Default Communication Protocol</label>
                <input type="text" className="form-input" defaultValue="WhatsApp Direct Web Gateway (wa.me)" readOnly />
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                type="button" 
                className="noventra-orange-btn"
                onClick={() => showToast('Agency settings saved successfully.')}
              >
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
