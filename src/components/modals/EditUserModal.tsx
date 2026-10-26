import React, { useState, useEffect, useRef } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { 
  User, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Check, 
  X,
  AlertTriangle,
  Trash2,
  UserX,
  UserCheck,
  Upload
} from 'lucide-react';
import { STANDARD_ROLES, type Role } from '../../types';

export const EditUserModal: React.FC = () => {
  const { 
    state, 
    activeModal, 
    modalData, 
    closeModal, 
    updateUser, 
    suspendUser, 
    deleteUser, 
    showToast 
  } = useAgency();

  const [targetUserId, setTargetUserId] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profession, setProfession] = useState('');
  const [adminRoleTitle, setAdminRoleTitle] = useState<string>('Web Developer');
  const [role, setRole] = useState<Role>('admin');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [avatar, setAvatar] = useState('/assets/images/diego.jpg');
  const [status, setStatus] = useState<'active' | 'invited' | 'pending' | 'suspended'>('active');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Granular RBAC Permissions State
  const [canViewFinances, setCanViewFinances] = useState(false);
  const [canManageClients, setCanManageClients] = useState(false);
  const [canEditSprints, setCanEditSprints] = useState(true);
  const [canApproveDeliverables, setCanApproveDeliverables] = useState(false);
  const [canManageSettings, setCanManageSettings] = useState(false);

  // Populate data when modal opens
  useEffect(() => {
    if (activeModal === 'edit_user' && modalData?.userId) {
      const user = (state.users || []).find(u => u.id === modalData.userId);
      if (user) {
        setTargetUserId(user.id);
        setName(user.name);
        setEmail(user.email);
        setUsername(user.username || user.email.split('@')[0]);
        setPassword(user.password || '');
        setProfession(user.profession || user.adminRoleTitle || 'Web Developer');
        setAdminRoleTitle(user.adminRoleTitle || 'Web Developer');
        setRole(user.role || 'admin');
        setWhatsappNumber(user.whatsappNumber || '');
        setContactAddress(user.contactAddress || '');
        setAvatar(user.avatar || '/assets/images/diego.jpg');
        setStatus(user.status || 'active');
        setConfirmDelete(false);

        const perms = user.permissions || {
          canViewFinances: user.adminRoleTitle?.includes('Director') || user.adminRoleTitle?.includes('Manager') || user.adminRoleTitle?.includes('Ads') || user.adminRoleTitle?.includes('Assistant'),
          canManageClients: user.adminRoleTitle?.includes('Director') || user.adminRoleTitle?.includes('Client') || user.adminRoleTitle?.includes('Assistant') || user.adminRoleTitle?.includes('Project'),
          canEditSprints: true,
          canApproveDeliverables: user.adminRoleTitle?.includes('Director') || user.adminRoleTitle?.includes('Project') || user.adminRoleTitle?.includes('Developer') || user.adminRoleTitle?.includes('Designer'),
          canManageSettings: user.adminRoleTitle?.includes('Director') || user.adminRoleTitle?.includes('Assistant')
        };
        setCanViewFinances(!!perms.canViewFinances);
        setCanManageClients(!!perms.canManageClients);
        setCanEditSprints(!!perms.canEditSprints);
        setCanApproveDeliverables(!!perms.canApproveDeliverables);
        setCanManageSettings(!!perms.canManageSettings);
      }
    }
  }, [activeModal, modalData, state.users]);

  if (activeModal !== 'edit_user') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId) return;

    updateUser(targetUserId, {
      name,
      email,
      username,
      password: password || undefined,
      profession,
      adminRoleTitle,
      role,
      whatsappNumber,
      contactAddress,
      avatar,
      status,
      permissions: {
        canViewFinances,
        canManageClients,
        canEditSprints,
        canApproveDeliverables,
        canManageSettings
      }
    });
  };

  const handleToggleSuspend = () => {
    if (!targetUserId) return;
    suspendUser(targetUserId);
  };

  const handleDelete = () => {
    if (!targetUserId) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteUser(targetUserId);
  };

  const openWhatsAppDirect = () => {
    if (!whatsappNumber) {
      showToast('No WhatsApp number provided for this user');
      return;
    }
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hi ${name}, messaging you from VectorStudio Agency OS regarding your account and assigned deliverables.`);
    window.open(`https://api.whatsapp.com/send/?phone=${cleanNumber}&text=${text}`, '_blank');
  };

  const avatarOptions = [
    { name: 'Diego', src: '/assets/images/diego.jpg' },
    { name: 'Carlos', src: '/assets/images/carlos.jpg' },
    { name: 'Liam', src: '/assets/images/liam.jpg' },
    { name: 'Owais', src: '/assets/images/owais.jpg' },
    { name: 'Sarah', src: '/assets/images/tommy.jpg' }
  ];

  const isSuspended = status === 'suspended';

  return (
    <div className="modal-backdrop" onClick={closeModal} style={{ zIndex: 9999 }}>
      <div 
        className="modal-content-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '680px', 
          width: '94%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: 'var(--surface, #ffffff)',
          color: 'var(--text-primary)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Modal Header */}
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface-sunken, #f8fafc)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-square icon-orange" style={{ width: '40px', height: '40px' }}>
              <User style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Manage User Account & Permissions
                </h3>
                {isSuspended ? (
                  <span className="noventra-status-pill status-red" style={{ fontSize: '10px', padding: '2px 8px' }}>
                    SUSPENDED
                  </span>
                ) : (
                  <span className="noventra-status-pill status-green" style={{ fontSize: '10px', padding: '2px 8px' }}>
                    ACTIVE
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Full administrative access to edit role, reset credentials, suspend or delete account.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={closeModal} 
            className="modal-close-btn"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Modal Body Form */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: 'var(--surface, #ffffff)' }}>
          <form onSubmit={handleSubmit}>
            {/* Quick Actions Bar (Suspend / Delete / WhatsApp) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: isSuspended ? 'rgba(239, 68, 68, 0.08)' : 'var(--surface-sunken)',
              border: `1px solid ${isSuspended ? '#ef4444' : 'var(--border-color)'}`,
              borderRadius: '12px',
              marginBottom: '20px',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src={avatar} 
                  alt={name} 
                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-orange)' }} 
                />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', display: 'block' }}>
                    {name || 'User Profile'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    @{username || 'user'} • {adminRoleTitle}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {whatsappNumber && (
                  <button
                    type="button"
                    onClick={openWhatsAppDirect}
                    className="noventra-whatsapp-btn small"
                    title="Launch WhatsApp direct chat"
                    style={{ fontSize: '11px', padding: '5px 10px' }}
                  >
                    <MessageCircle style={{ width: '13px', height: '13px' }} />
                    <span>WhatsApp</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleToggleSuspend}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: isSuspended ? '#16a34a' : '#f59e0b',
                    color: '#ffffff',
                    border: 'none'
                  }}
                  title={isSuspended ? "Reactivate suspended user account" : "Suspend user account access immediately"}
                >
                  {isSuspended ? (
                    <>
                      <UserCheck style={{ width: '13px', height: '13px' }} />
                      <span>Reactivate User</span>
                    </>
                  ) : (
                    <>
                      <UserX style={{ width: '13px', height: '13px' }} />
                      <span>Suspend Account</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: confirmDelete ? '#b91c1c' : '#ef4444',
                    color: '#ffffff',
                    border: 'none'
                  }}
                  title="Permanently remove user from agency platform"
                >
                  <Trash2 style={{ width: '13px', height: '13px' }} />
                  <span>{confirmDelete ? 'Confirm Delete?' : 'Delete'}</span>
                </button>
              </div>
            </div>

            {confirmDelete && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1.5px solid #ef4444',
                borderRadius: '10px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertTriangle style={{ width: '18px', height: '18px', color: '#ef4444', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>
                  Warning: Deleting will remove this user's account and reassign their open tasks. Click "Confirm Delete?" again to execute, or continue editing below.
                </span>
              </div>
            )}

            {/* Form Fields Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Full Legal Name</span>
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Diego Alvarez" 
                    required 
                    style={{ paddingLeft: '34px' }}
                  />
                  <User style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Email Address</span>
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="e.g. diego@vectorstudio.design" 
                    required 
                    style={{ paddingLeft: '34px' }}
                  />
                  <Mail style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              {/* Assigned Role (RBAC) */}
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Assigned Agency Role</span>
                  <span style={{ color: '#ff6900', fontWeight: 700 }}>● Standard Matrix</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-input"
                    value={adminRoleTitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAdminRoleTitle(val);
                      if (val.toLowerCase().includes('client')) {
                        setRole('client');
                      } else {
                        setRole('admin');
                      }
                    }}
                    style={{ paddingLeft: '34px', fontWeight: 700, color: 'var(--accent-orange)' }}
                  >
                    {STANDARD_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                    <option value="Client Partner">Client Partner (External Portal)</option>
                  </select>
                  <ShieldCheck style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: '#ff6900' }} />
                </div>
              </div>

              {/* Profession / Title */}
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Profession / Title</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={profession} 
                    onChange={(e) => setProfession(e.target.value)} 
                    placeholder="e.g. Senior Web Developer" 
                    style={{ paddingLeft: '34px' }}
                  />
                  <Briefcase style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>WhatsApp Number (Sprint Chat)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={whatsappNumber} 
                    onChange={(e) => setWhatsappNumber(e.target.value)} 
                    placeholder="+1 (415) 555-0192" 
                    style={{ paddingLeft: '34px' }}
                  />
                  <MessageCircle style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: '#25D366' }} />
                </div>
              </div>

              {/* Contact Address */}
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Physical Address / Office Location</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={contactAddress} 
                    onChange={(e) => setContactAddress(e.target.value)} 
                    placeholder="e.g. 742 Montgomery St, San Francisco, CA" 
                    style={{ paddingLeft: '34px' }}
                  />
                  <MapPin style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              {/* Username */}
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Username / Login ID</span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="e.g. diego.alvarez" 
                />
              </div>

              {/* Password / Reset */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>
                    <span>Account Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const tempPass = `VS-${Math.floor(100000 + Math.random() * 900000)}#`;
                      setPassword(tempPass);
                      showToast(`New password generated: ${tempPass}`);
                    }}
                    style={{ background: 'none', border: 'none', color: '#ff6900', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Generate Secure
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Leave unchanged or type new password" 
                    style={{ paddingRight: '40px', paddingLeft: '34px' }}
                  />
                  <KeyRound style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Avatar Selector with Custom Upload */}
            <div style={{ marginTop: '16px' }}>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        setAvatar(ev.target.result as string);
                        showToast('✓ Custom profile image loaded!');
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 700 }}>
                  Profile Avatar:
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#ff6900',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Upload style={{ width: '12px', height: '12px' }} />
                  <span>Upload Custom Image</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Active Custom Avatar Preview if uploaded */}
                {avatar.startsWith('data:') && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '24px',
                    border: '2px solid #ff6900',
                    backgroundColor: 'rgba(255, 105, 0, 0.12)'
                  }}>
                    <img src={avatar} alt="Custom upload" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#ff6900' }}>Custom Uploaded</span>
                  </div>
                )}

                {avatarOptions.map(av => (
                  <button
                    key={av.name}
                    type="button"
                    onClick={() => setAvatar(av.src)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '24px',
                      border: avatar === av.src ? '2px solid #ff6900' : '1px solid var(--border-color)',
                      backgroundColor: avatar === av.src ? 'rgba(255, 105, 0, 0.1)' : 'var(--surface)',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={av.src} alt={av.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: avatar === av.src ? '#ff6900' : 'var(--text-secondary)' }}>{av.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Granular RBAC Permissions Selector */}
            <div style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: 'var(--surface-sunken, #f8fafc)',
              borderRadius: '14px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck style={{ width: '18px', height: '18px', color: '#ff6900' }} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Granular Access Permissions & RBAC
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Platform Access Matrix
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {[
                  { key: 'canViewFinances', label: 'Financial Ledgers & Billing', val: canViewFinances, set: setCanViewFinances, desc: 'View revenue, invoices & deposits' },
                  { key: 'canManageClients', label: 'Client Management & CRM', val: canManageClients, set: setCanManageClients, desc: 'Onboard clients & edit briefs' },
                  { key: 'canEditSprints', label: 'Sprint & Task Tracker', val: canEditSprints, set: setCanEditSprints, desc: 'Create, assign & edit deadlines' },
                  { key: 'canApproveDeliverables', label: 'Deliverable Sign-Offs', val: canApproveDeliverables, set: setCanApproveDeliverables, desc: 'Approve or request changes' },
                  { key: 'canManageSettings', label: 'Agency System Settings', val: canManageSettings, set: setCanManageSettings, desc: 'Gemini AI key & platform rules' },
                ].map(p => (
                  <label 
                    key={p.key}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: p.val ? '1.5px solid #ff6900' : '1px solid var(--border-color)',
                      backgroundColor: p.val ? 'rgba(255, 105, 0, 0.08)' : 'var(--surface, #ffffff)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={p.val}
                      onChange={(e) => p.set(e.target.checked)}
                      style={{ marginTop: '3px', accentColor: '#ff6900', width: '15px', height: '15px', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: p.val ? '#ff6900' : 'var(--text-primary)' }}>
                        {p.label}
                      </span>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {p.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '12px', 
              marginTop: '24px', 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: '16px' 
            }}>
              <button 
                type="button" 
                className="noventra-outline-btn"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="noventra-orange-btn"
                style={{ padding: '8px 20px', gap: '6px' }}
              >
                <Check style={{ width: '16px', height: '16px' }} />
                <span>Save User Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
