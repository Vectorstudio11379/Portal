import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  Building2, 
  KeyRound, 
  X 
} from 'lucide-react';

export const ClientCredentialsModal: React.FC = () => {
  const { createdClientCredentials, clearCreatedClientCredentials, showToast } = useAgency();
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!createdClientCredentials) return null;

  const creds = createdClientCredentials;
  const portalUrl = window.location.origin;

  const fullLoginMessage = `🚀 Welcome to VectorStudio! Your Client Project Portal account has been configured.\n\n• Portal URL: ${portalUrl}\n• Username: ${creds.username}\n• Temporary Password: ${creds.password}\n• Organization: ${creds.company}\n\nYou can log in directly at ${portalUrl} to review your project timeline, milestone deliverables, and budget statements.\n\nBest regards,\nVectorStudio Engineering Squad`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(label);
    showToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleWhatsAppDispatch = () => {
    if (!creds.whatsappNumber) {
      copyToClipboard(fullLoginMessage, 'Login credentials');
      showToast('No WhatsApp number provided. Credentials copied to clipboard instead.');
      return;
    }

    const cleanNum = creds.whatsappNumber.replace(/[^0-9]/g, '');
    if (!cleanNum) {
      copyToClipboard(fullLoginMessage, 'Login credentials');
      showToast('Invalid WhatsApp number. Credentials copied to clipboard.');
      return;
    }

    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(fullLoginMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(`Opening WhatsApp chat with ${creds.contactName}...`);
  };

  return (
    <div className="modal-backdrop" onClick={clearCreatedClientCredentials}>
      <div 
        className="modal-dialog" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '580px', width: '92%', borderRadius: '20px', padding: '0', overflow: 'hidden' }}
      >
        {/* Top Header Banner */}
        <div style={{ 
          background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', 
          padding: '24px 28px',
          color: '#ffffff',
          position: 'relative',
          borderBottom: '1px solid #3f3f46'
        }}>
          <button 
            type="button" 
            onClick={clearCreatedClientCredentials}
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              background: 'rgba(255,255,255,0.1)', 
              border: 'none', 
              color: '#ffffff', 
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              backgroundColor: '#10b981', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}>
              <CheckCircle2 style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#34d399' }}>
                Onboarding Configured
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Client Portal Credentials Ready
              </h2>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#a1a1aa', margin: 0, lineHeight: 1.4 }}>
            Account for <strong>{creds.clientName}</strong> has been configured with an automated 4-phase web development sprint roadmap. Copy or dispatch credentials below.
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', backgroundColor: '#ffffff' }}>
          {/* Project Summary Chip */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 16px', 
            backgroundColor: '#faf9f6', 
            borderRadius: '12px', 
            border: '1px solid #eae7df',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 style={{ width: '18px', height: '18px', color: '#ff6900' }} />
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#18181b', display: 'block' }}>
                  {creds.company}
                </span>
                <span style={{ fontSize: '11.5px', color: '#78716c' }}>
                  {creds.contactName} • {creds.email}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#78716c', display: 'block' }}>Project Budget</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#16a34a' }}>
                ${(creds.projectBudget || 35000).toLocaleString()} USD
              </span>
            </div>
          </div>

          {/* Credentials Box */}
          <div style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: '14px', 
            border: '1.5px dashed #cbd5e1', 
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <KeyRound style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569' }}>
                Client Authentication Keys
              </span>
            </div>

            {/* Username Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', fontWeight: 700 }}>PORTAL USERNAME / EMAIL</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{creds.username}</span>
              </div>
              <button 
                type="button" 
                className="noventra-outline-btn small" 
                onClick={() => copyToClipboard(creds.username, 'Username')}
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                {copiedKey === 'Username' ? <Check style={{ width: '12px', height: '12px', color: '#16a34a' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                <span>{copiedKey === 'Username' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Password Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', fontWeight: 700 }}>TEMPORARY ACCESS PASSWORD</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                  {showPassword ? creds.password : '••••••••••••'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  type="button" 
                  className="noventra-outline-btn small" 
                  onClick={() => setShowPassword(!showPassword)}
                  title="Toggle Password Visibility"
                  style={{ padding: '4px 8px' }}
                >
                  {showPassword ? <EyeOff style={{ width: '13px', height: '13px' }} /> : <Eye style={{ width: '13px', height: '13px' }} />}
                </button>
                <button 
                  type="button" 
                  className="noventra-outline-btn small" 
                  onClick={() => copyToClipboard(creds.password, 'Password')}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  {copiedKey === 'Password' ? <Check style={{ width: '12px', height: '12px', color: '#16a34a' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                  <span>{copiedKey === 'Password' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Portal Login Link */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', fontWeight: 700 }}>PORTAL URL</span>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#2563eb' }}>{portalUrl}</span>
              </div>
              <button 
                type="button" 
                className="noventra-outline-btn small" 
                onClick={() => copyToClipboard(portalUrl, 'Portal URL')}
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                {copiedKey === 'Portal URL' ? <Check style={{ width: '12px', height: '12px', color: '#16a34a' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                <span>{copiedKey === 'Portal URL' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              type="button" 
              className="noventra-whatsapp-btn"
              onClick={handleWhatsAppDispatch}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 18px', fontSize: '14px', fontWeight: 800 }}
            >
              <MessageCircle style={{ width: '18px', height: '18px' }} />
              <span>Send Login Credentials via WhatsApp ↗</span>
            </button>

            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={() => copyToClipboard(fullLoginMessage, 'Complete credentials message')}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 18px', fontSize: '13.5px' }}
            >
              {copiedKey === 'Complete credentials message' ? (
                <>
                  <Check style={{ width: '16px', height: '16px' }} />
                  <span>Copied All Credentials to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy style={{ width: '16px', height: '16px' }} />
                  <span>Copy Complete Login Message</span>
                </>
              )}
            </button>

            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={clearCreatedClientCredentials}
              style={{ width: '100%', justifyContent: 'center', padding: '10px 18px', fontSize: '13px' }}
            >
              Done & Return to Client Accounts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
