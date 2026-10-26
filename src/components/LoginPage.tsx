import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials, loginAsUser, showToast } = useAgency();
  const [identifier, setIdentifier] = useState('owais');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'password' | 'magic'>('password');
  const [magicEmail, setMagicEmail] = useState('sarah.jenkins@arccompany.io');

  const demoAccounts = [
    {
      label: 'Owais Anwer',
      sub: 'Managing Director & SuperAdmin',
      role: 'admin' as const,
      identifier: 'owais',
      pass: 'admin123',
      badge: 'Admin Operations',
      avatar: '/assets/images/owais.jpg',
      badgeColor: 'status-orange'
    },
    {
      label: 'Carlos Mendes',
      sub: 'Lead Design Architect',
      role: 'admin' as const,
      identifier: 'carlos',
      pass: 'admin123',
      badge: 'Admin Operations',
      avatar: '/assets/images/carlos.jpg',
      badgeColor: 'status-orange'
    },
    {
      label: 'Sarah Jenkins',
      sub: 'Arc Company Client Owner',
      role: 'client' as const,
      identifier: 'sarah.arc',
      pass: 'client123',
      badge: 'Arc Co. Portal',
      avatar: '/assets/images/tommy.jpg',
      badgeColor: 'status-blue'
    },
    {
      label: 'Elena Rostova',
      sub: 'Nexus Labs Client Owner',
      role: 'client' as const,
      identifier: 'elena.nexus',
      pass: 'client123',
      badge: 'Nexus Labs Portal',
      avatar: '/assets/images/diego.jpg',
      badgeColor: 'status-purple'
    },
    {
      label: 'David Chen',
      sub: 'Lumina Health Client',
      role: 'client' as const,
      identifier: 'dchen.lumina',
      pass: 'client123',
      badge: 'Lumina Health Portal',
      avatar: '/assets/images/carlos.jpg',
      badgeColor: 'status-green'
    }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your username or email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = loginWithCredentials(identifier, password);
      setIsLoading(false);
      if (!success) {
        setErrorMessage('Invalid credentials. Please verify your username/email, or click any demo account below.');
      }
    }, 450);
  };

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicEmail.trim()) {
      setErrorMessage('Please enter your client email.');
      return;
    }

    setIsLoading(true);
    const token = `magic_${Math.random().toString(36).substring(2, 9)}`;
    showToast(`Magic sign-in link (Token: ${token}) sent to ${magicEmail}!`);

    setTimeout(() => {
      const matched = demoAccounts.find(d => d.identifier.toLowerCase() === magicEmail.toLowerCase()) || demoAccounts[2];
      loginAsUser({
        id: 'usr_' + Date.now(),
        name: matched.label,
        email: magicEmail,
        role: matched.role,
        adminRoleTitle: matched.role === 'admin' ? matched.sub : undefined,
        clientAccount: matched.role === 'client' ? matched.badge.replace(' Portal', '') : undefined,
        avatar: matched.avatar
      });
      setIsLoading(false);
    }, 700);
  };

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setIdentifier(acc.identifier);
    setPassword(acc.pass);
    setErrorMessage('');
    
    // Auto submit demo login
    setIsLoading(true);
    setTimeout(() => {
      loginWithCredentials(acc.identifier, acc.pass);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="login-page-container">
      {/* Background Ambient Elements */}
      <div className="login-ambient-glow" />
      
      <div className="login-card-wrapper">
        {/* Top Brand Emblem */}
        <div className="login-brand-header">
          <div className="noventra-logo-icon" style={{ width: '42px', height: '42px' }}>
            <svg viewBox="0 0 32 32" fill="none" style={{ width: '32px', height: '32px' }}>
              <circle cx="16" cy="16" r="14" fill="#ff6900" />
              <path d="M10 16L14 20L22 12" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="login-brand-title">Agency OS</h1>
            <span className="login-brand-subtitle">by VectorStudio</span>
          </div>
        </div>

        {/* Login Main Card */}
        <div className="login-card">
          <div className="login-header-text">
            <h2 className="login-heading">Sign In to Agency OS</h2>
            <p className="login-subheading">
              Unified access for studio executives & client stakeholders. Enter your credentials to automatically load your dedicated workspace.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="login-tab-switcher">
            <button 
              type="button" 
              className={`login-tab-btn ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => { setActiveTab('password'); setErrorMessage(''); }}
            >
              <Lock style={{ width: '14px', height: '14px' }} />
              <span>Password Sign In</span>
            </button>
            <button 
              type="button" 
              className={`login-tab-btn ${activeTab === 'magic' ? 'active' : ''}`}
              onClick={() => { setActiveTab('magic'); setErrorMessage(''); }}
            >
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span>Magic Link Access</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="login-error-banner">
              <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form: Password Login */}
          {activeTab === 'password' ? (
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="login-identifier">Username or Email</label>
                <div className="login-input-wrap">
                  <User className="login-field-icon" />
                  <input 
                    id="login-identifier"
                    type="text" 
                    className="form-input login-field" 
                    value={identifier} 
                    onChange={(e) => setIdentifier(e.target.value)} 
                    placeholder="e.g. owais or sarah.arc"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <button 
                    type="button" 
                    className="forgot-pass-link"
                    onClick={() => setActiveTab('magic')}
                  >
                    Need Magic Link?
                  </button>
                </div>
                <div className="login-input-wrap">
                  <Lock className="login-field-icon" />
                  <input 
                    id="login-password"
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input login-field" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    className="login-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="login-submit-btn" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Form: Magic Link Access */
            <form onSubmit={handleMagicLinkSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="login-magic-email">Client Account Email</label>
                <div className="login-input-wrap">
                  <Mail className="login-field-icon" />
                  <input 
                    id="login-magic-email"
                    type="email" 
                    className="form-input login-field" 
                    value={magicEmail} 
                    onChange={(e) => setMagicEmail(e.target.value)} 
                    placeholder="sarah.jenkins@arccompany.io"
                    required
                  />
                </div>
              </div>

              <div className="magic-info-box">
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#16a34a', flexShrink: 0 }} />
                <span>Passwordless 1-click token dispatched directly to your authorized inbox.</span>
              </div>

              <button 
                type="submit" 
                className="login-submit-btn" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Dispatching Token...</span>
                ) : (
                  <>
                    <span>Enter via Magic Link</span>
                    <Sparkles style={{ width: '16px', height: '16px' }} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick-Access Demo Accounts */}
          <div className="demo-accounts-section">
            <div className="demo-accounts-divider">
              <span>OR 1-CLICK QUICK ACCESS</span>
            </div>

            <div className="demo-accounts-grid">
              {demoAccounts.map(acc => (
                <button
                  key={acc.identifier}
                  type="button"
                  className="demo-account-pill-btn"
                  onClick={() => handleSelectDemo(acc)}
                >
                  <img src={acc.avatar} alt={acc.label} className="demo-avatar" />
                  <div className="demo-info">
                    <div className="demo-name-row">
                      <span className="demo-name">{acc.label}</span>
                      <span className={`noventra-status-pill ${acc.badgeColor}`} style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                        {acc.badge}
                      </span>
                    </div>
                    <span className="demo-sub">{acc.sub} &bull; <code>{acc.identifier}</code></span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Security Notice */}
          <div className="login-card-footer">
            <ShieldCheck style={{ width: '15px', height: '15px', color: '#16a34a' }} />
            <span>Role-Based Access Control (RBAC) & End-to-End Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};
