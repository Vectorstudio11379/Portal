import React, { useState, useEffect, useRef } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { 
  Camera, 
  Upload, 
  Check, 
  X, 
  User, 
  Mail, 
  Trash2 
} from 'lucide-react';

const PRESET_AVATARS = [
  { name: 'Owais Anwer', src: '/assets/images/owais.jpg', role: 'Executive' },
  { name: 'Diego Alvarez', src: '/assets/images/diego.jpg', role: 'Developer' },
  { name: 'Carlos Mendes', src: '/assets/images/carlos.jpg', role: 'Project Lead' },
  { name: 'Liam Brooks', src: '/assets/images/liam.jpg', role: 'Designer' },
  { name: 'Sarah Jenkins', src: '/assets/images/sarah.jpg', role: 'Client Manager' },
  { name: 'Tommy Clarke', src: '/assets/images/tommy.jpg', role: 'Product Lead' },
];

export const UserProfileModal: React.FC = () => {
  const { activeModal, closeModal, state, updateProfileImage, showToast } = useAgency();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = state.currentUser || {
    id: 'usr-1',
    name: 'Owais Anwer',
    email: 'owais@vectorstudio.design',
    role: 'admin' as const,
    adminRoleTitle: 'Executive Director (SuperAdmin)',
    avatar: '/assets/images/owais.jpg'
  };

  const [currentAvatar, setCurrentAvatar] = useState(currentUser.avatar || '/assets/images/owais.jpg');
  const [userName, setUserName] = useState(currentUser.name);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  useEffect(() => {
    if (activeModal === 'user_profile') {
      setCurrentAvatar(currentUser.avatar || '/assets/images/owais.jpg');
      setUserName(currentUser.name);
    }
  }, [activeModal, currentUser]);

  if (activeModal !== 'user_profile') return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCurrentAvatar(result);
        showToast('✓ Custom photo loaded! Click Save to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileImage(currentAvatar, currentUser.id);
    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div 
        className="modal-container modal-content-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          padding: '28px',
          borderRadius: '20px',
          backgroundColor: 'var(--surface, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          color: 'var(--text-primary, #0f172a)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              My Profile & Avatar
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted, #94a3b8)', margin: '4px 0 0' }}>
              Personalize your identity and profile photo across the platform
            </p>
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

        <form onSubmit={handleSave}>
          {/* Main Avatar Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px',
            backgroundColor: 'var(--surface-sunken, #f8fafc)',
            borderRadius: '16px',
            border: '1px solid var(--border-color, #e2e8f0)',
            marginBottom: '20px'
          }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleFileChange}
            />

            <div 
              style={{
                position: 'relative',
                width: '104px',
                height: '104px',
                borderRadius: '50%',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
              onMouseEnter={() => setIsHoveringAvatar(true)}
              onMouseLeave={() => setIsHoveringAvatar(false)}
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload custom photo from computer"
            >
              <img 
                src={currentAvatar} 
                alt="Profile Avatar Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #ff6900',
                  boxShadow: '0 8px 24px rgba(255, 105, 0, 0.25)'
                }}
              />

              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backgroundColor: isHoveringAvatar ? 'rgba(0, 0, 0, 0.55)' : 'rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                transition: 'background-color 0.2s ease'
              }}>
                <Camera style={{ width: '22px', height: '22px', marginBottom: '2px' }} />
                <span style={{ fontSize: '10px', fontWeight: 700 }}>Upload</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="noventra-orange-btn small"
                onClick={() => fileInputRef.current?.click()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
              >
                <Upload style={{ width: '13px', height: '13px' }} />
                <span>Upload Photo from Device</span>
              </button>

              {currentAvatar !== '/assets/images/owais.jpg' && (
                <button
                  type="button"
                  className="noventra-outline-btn small"
                  onClick={() => setCurrentAvatar('/assets/images/owais.jpg')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ef4444' }}
                >
                  <Trash2 style={{ width: '13px', height: '13px' }} />
                  <span>Reset</span>
                </button>
              )}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', marginTop: '8px' }}>
              Supports JPG, PNG, WebP, GIF up to 5MB
            </span>
          </div>

          {/* Quick Preset Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted, #64748b)', display: 'block', marginBottom: '8px' }}>
              Or Choose from Studio Avatars:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {PRESET_AVATARS.map(av => {
                const isSelected = currentAvatar === av.src;
                return (
                  <button
                    key={av.name}
                    type="button"
                    onClick={() => setCurrentAvatar(av.src)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #ff6900' : '1px solid var(--border-color, #e2e8f0)',
                      backgroundColor: isSelected ? 'rgba(255, 105, 0, 0.1)' : 'var(--surface-sunken, #f8fafc)',
                      color: isSelected ? '#ff6900' : 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <img src={av.src} alt={av.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '11.5px', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {av.name.split(' ')[0]}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)' }}>
                        {av.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Details Readout */}
          <div style={{
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: 'var(--surface-sunken, #f8fafc)',
            border: '1px solid var(--border-color, #e2e8f0)',
            marginBottom: '24px',
            fontSize: '12px',
            color: 'var(--text-muted, #64748b)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
              <User style={{ width: '13px', height: '13px', color: '#ff6900' }} />
              <strong>{userName}</strong> &bull; {currentUser.adminRoleTitle || currentUser.role}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail style={{ width: '13px', height: '13px' }} />
              <span>{currentUser.email}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Check style={{ width: '15px', height: '15px' }} />
              <span>Save Profile Photo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
