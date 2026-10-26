import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Users, 
  Sparkles, 
  Lock 
} from 'lucide-react';
import { useAgency } from '../../context/AgencyContext';
import type { UserSession } from '../../types';

export const AuthModal: React.FC = () => {
  const { state, activeModal, closeModal, loginAsUser, loginWithCredentials, showToast } = useAgency();
  const [activeTab, setActiveTab] = useState<'switch' | 'credentials' | 'magic'>('switch');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [magicEmail, setMagicEmail] = useState('');

  if (activeModal !== 'auth') return null;

  const demoAccounts: UserSession[] = state.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    adminRoleTitle: u.adminRoleTitle,
    clientAccount: u.clientAccount,
    avatar: u.avatar || '/assets/images/owais.jpg'
  }));

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) {
      showToast('Please enter an email or username.');
      return;
    }
    const success = loginWithCredentials(inputEmail, inputPassword);
    if (success) {
      closeModal();
    } else {
      showToast('Invalid credentials. Please verify your username and password.');
    }
  };

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `magic_${Math.random().toString(36).substring(2, 9)}`;
    showToast(`Magic login link generated (token: ${token}) and dispatched to ${magicEmail || state.users[0]?.email}!`);
    setTimeout(() => {
      const matched = demoAccounts.find(a => a.email.toLowerCase() === (magicEmail || '').toLowerCase()) || demoAccounts[0];
      if (matched) {
        loginAsUser(matched);
      }
    }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="noventra-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        {/* Modal Top */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-square icon-orange" style={{ width: '38px', height: '38px' }}>
              <ShieldCheck style={{ width: '20px', height: '20px', color: '#ff6900' }} />
            </div>
            <div>
              <h3 className="modal-title">Authentication & Identity</h3>
              <span className="modal-subtitle">Agency OS by VectorStudio &bull; Role-Based Access Control</span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={closeModal} aria-label="Close">
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Current Session Banner */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: '#faf9f6',
          borderRadius: '14px',
          border: '1px solid #eae7df',
          margin: '16px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={state.currentUser?.avatar || '/assets/images/owais.jpg'} 
              alt="Avatar" 
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} 
            />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#18181b' }}>
                {state.currentUser?.name}
              </div>
              <div style={{ fontSize: '11.5px', color: '#78716c' }}>
                {state.currentUser?.email}
              </div>
            </div>
          </div>
          <span className={`noventra-status-pill ${state.currentUser?.role === 'admin' ? 'status-green' : 'status-blue'}`} style={{ fontSize: '11px', textTransform: 'uppercase' }}>
            ● {state.currentUser?.role === 'admin' ? (state.currentUser.adminRoleTitle || 'SuperAdmin') : `${state.currentUser?.clientAccount || 'Client'} Stakeholder`}
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="timeline-tabs-group" style={{ marginBottom: '18px', width: '100%', justifyContent: 'space-between' }}>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'switch' ? 'active' : ''}`}
            onClick={() => setActiveTab('switch')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Users style={{ width: '14px', height: '14px' }} />
            <span>Switch Role / Account</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'magic' ? 'active' : ''}`}
            onClick={() => setActiveTab('magic')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Sparkles style={{ width: '14px', height: '14px' }} />
            <span>Magic Link Invite</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'credentials' ? 'active' : ''}`}
            onClick={() => setActiveTab('credentials')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Lock style={{ width: '14px', height: '14px' }} />
            <span>Direct Sign In</span>
          </button>
        </div>

        {/* TAB 1: SWITCH ROLE / ACCOUNT */}
        {activeTab === 'switch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Active Identity to Launch:
            </span>
            {demoAccounts.map(account => {
              const isActive = state.currentUser?.id === account.id;
              return (
                <div 
                  key={account.id}
                  onClick={() => loginAsUser(account)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isActive ? '2px solid #ff6900' : '1px solid #eae7df',
                    backgroundColor: isActive ? '#fff7ed' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="auth-account-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={account.avatar} 
                      alt={account.name} 
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#18181b' }}>{account.name}</span>
                        {account.role === 'admin' ? (
                          <span className="noventra-status-pill status-orange" style={{ fontSize: '10px', padding: '1px 6px' }}>ADMIN</span>
                        ) : (
                          <span className="noventra-status-pill status-blue" style={{ fontSize: '10px', padding: '1px 6px' }}>{account.clientAccount}</span>
                        )}
                      </div>
                      <span style={{ fontSize: '11.5px', color: '#78716c' }}>{account.email} &bull; {account.adminRoleTitle || `${account.clientAccount} Portal`}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className={isActive ? 'noventra-orange-btn small' : 'noventra-outline-btn small'}
                    onClick={(e) => { e.stopPropagation(); loginAsUser(account); }}
                  >
                    {isActive ? 'Active' : 'Launch ↗'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MAGIC LINK ONBOARDING */}
        {activeTab === 'magic' && (
          <form onSubmit={handleSendMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                Instant Client Portal Onboarding Link
              </div>
              <p style={{ fontSize: '12px', color: '#15803d' }}>
                When you onboard a client, an encrypted magic link is dispatched to their email so they can log straight into their deliverables workspace without setting a complex password first.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Client Recipient Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={magicEmail} 
                onChange={(e) => setMagicEmail(e.target.value)} 
                placeholder="client.name@company.com" 
                required 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="noventra-outline-btn" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="noventra-orange-btn">
                <Mail style={{ width: '15px', height: '15px' }} />
                <span>Dispatch Magic Link & Log In</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CREDENTIALS SIGN IN */}
        {activeTab === 'credentials' && (
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <input 
                type="text" 
                className="form-input" 
                value={inputEmail} 
                onChange={(e) => setInputEmail(e.target.value)} 
                placeholder="timi or timi@vectorstudio.design" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={inputPassword} 
                onChange={(e) => setInputPassword(e.target.value)} 
                placeholder="••••••••••••" 
                required 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', color: '#78716c' }}>
                Admin username: timi
              </span>
              <button type="submit" className="noventra-orange-btn">
                <span>Sign In ↗</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
