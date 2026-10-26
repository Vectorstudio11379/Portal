import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Paperclip,
  Search,
  Hash,
  Users,
  Wifi,
  ShieldCheck,
  CheckCheck,
  X,
  FileText
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import type { TeamMessage } from '../types';

interface Props {
  onBack: () => void;
}

const TEAM_CHANNELS = [
  { id: '#general-agency', name: 'general-agency', desc: 'All-Hands Studio Announcements & General Sync' },
  { id: '#engineering-sprint', name: 'engineering-sprint', desc: 'Web Developers, APIs & Architecture Pipeline' },
  { id: '#design-deliverables', name: 'design-deliverables', desc: 'Graphics Designers, UI/UX Deliverables & Figma Assets' },
  { id: '#client-management', name: 'client-management', desc: 'Client Managers, Retainers & SLA Communication' },
];

export const MessagesCenter: React.FC<Props> = ({ onBack }) => {
  const { state, sendRealTimeMessage, markMessagesRead, loginAsUser } = useAgency();
  const [activeRecipientId, setActiveRecipientId] = useState<string>('#general-agency');
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = state.currentUser || {
    id: 'usr-1',
    name: 'Owais Anwer',
    email: 'owais@vectorstudio.design',
    role: 'admin' as const,
    adminRoleTitle: 'Executive Director (SuperAdmin)',
    avatar: '/assets/images/owais.jpg'
  };

  const allUsers = state.users || [];
  const teamMessages = state.teamMessages || [];

  // Filter messages for active channel or direct conversation
  const currentMessages = teamMessages.filter((msg: TeamMessage) => {
    if (activeRecipientId.startsWith('#')) {
      return msg.recipientId === activeRecipientId;
    }
    // Direct message between currentUser and activeRecipientId
    return (
      (msg.senderId === currentUser.id && msg.recipientId === activeRecipientId) ||
      (msg.senderId === activeRecipientId && msg.recipientId === currentUser.id)
    );
  });

  // Calculate unread count per channel or user
  const getUnreadCount = (targetId: string) => {
    return teamMessages.filter(m => 
      m.recipientId === currentUser.id && 
      m.senderId === targetId && 
      m.readStatus !== 'read'
    ).length;
  };

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, isTyping]);

  // Mark messages as read when opening conversation
  useEffect(() => {
    if (!activeRecipientId.startsWith('#')) {
      markMessagesRead(activeRecipientId);
    }
  }, [activeRecipientId]);

  const activeChannel = TEAM_CHANNELS.find(c => c.id === activeRecipientId);
  const activeTeammate = allUsers.find(u => u.id === activeRecipientId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    let fullContent = inputText.trim();
    if (attachedFile) {
      fullContent += ` [Attachment: ${attachedFile.name} (${attachedFile.size})]`;
    }

    sendRealTimeMessage(currentUser.id, activeRecipientId, fullContent);
    setInputText('');
    setAttachedFile(null);

    // If chatting with a direct teammate, show typing indicator momentarily
    if (activeTeammate && activeRecipientId !== currentUser.id) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 1100);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      setAttachedFile({ name: file.name, size: sizeStr });
    }
  };

  const filteredChannels = TEAM_CHANNELS.filter(c => 
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.desc.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u => 
    u.id !== currentUser.id && (
      u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (u.adminRoleTitle || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (u.profession || '').toLowerCase().includes(searchFilter.toLowerCase())
    )
  );

  return (
    <div className="noventra-view-container">
      {/* Header & Breadcrumb */}
      <div className="noventra-fullpage-header">
        <div className="noventra-nav-breadcrumb-row">
          <button type="button" className="noventra-back-btn" onClick={onBack}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Back to Overview</span>
          </button>
          <div className="noventra-breadcrumb">
            <span>Platform Overview</span>
            <span>/</span>
            <span className="noventra-breadcrumb-active">Real-Time Team Messaging</span>
          </div>
        </div>

        <div className="noventra-banner-row">
          <div>
            <h1 className="noventra-banner-title">Real-Time Team Communication Engine</h1>
            <p className="noventra-banner-sub">
              Bi-directional duplex messaging stream connecting agency team members and project channels with zero page reload.
            </p>
          </div>
          <div className="noventra-banner-actions">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '12px',
              fontWeight: 700
            }}>
              <Wifi style={{ width: '14px', height: '14px' }} />
              <span>WebSocket Duplex: Connected (14ms)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Boxes */}
      <div className="noventra-stat-grid-4">
        <div className="noventra-stat-box">
          <span className="stat-label">Communication Protocol</span>
          <span className="stat-val">WebSockets / Duplex</span>
          <span className="stat-trend green">● Bi-directional zero reload stream</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Active Team Members</span>
          <span className="stat-val">{allUsers.length} Online</span>
          <span className="stat-trend green">▲ All 8 agency roles mapped</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Channels & Rooms</span>
          <span className="stat-val">4 Active Rooms</span>
          <span className="stat-trend green">● #general, #engineering, #design, #client</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Security & Authorization</span>
          <span className="stat-val">Role-Gated RBAC</span>
          <span className="stat-trend green">🔒 Encrypted duplex message store</span>
        </div>
      </div>

      {/* Main 2-Column Messaging Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '20px',
        minHeight: '620px',
        marginTop: '16px'
      }}>
        {/* Left Column: User & Team Directory */}
        <div className="noventra-card" style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          height: '680px',
          overflow: 'hidden'
        }}>
          {/* Active User Switcher / Identity Badge */}
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface-sunken, #f8fafc)',
            border: '1px solid var(--border-color, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={currentUser.avatar || '/assets/images/owais.jpg'} 
                alt={currentUser.name} 
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-color, #0f172a)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                  {currentUser.adminRoleTitle || 'Admin'}
                </div>
              </div>
            </div>
            
            {/* Quick Teammate Switcher for Testing Real-time Chat */}
            <select
              style={{
                fontSize: '11px',
                padding: '4px 6px',
                borderRadius: '6px',
                border: '1px solid var(--border-color, #e2e8f0)',
                backgroundColor: 'var(--card-bg, #ffffff)',
                color: 'var(--text-color, #0f172a)',
                cursor: 'pointer'
              }}
              value={currentUser.id}
              onChange={(e) => {
                const target = allUsers.find(u => u.id === e.target.value);
                if (target) {
                  loginAsUser({
                    id: target.id,
                    name: target.name,
                    email: target.email,
                    role: target.role,
                    adminRoleTitle: target.adminRoleTitle,
                    avatar: target.avatar,
                    profession: target.profession,
                    whatsappNumber: target.whatsappNumber
                  });
                }
              }}
              title="Switch active user to test real-time messaging between teammates"
            >
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.adminRoleTitle?.split(' ')[0] || u.role})
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search style={{ width: '14px', height: '14px', position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search team or rooms..." 
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #e2e8f0)',
                backgroundColor: 'var(--card-bg, #ffffff)',
                color: 'var(--text-color, #0f172a)',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          {/* Directory Lists */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Channels Group */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Hash style={{ width: '12px', height: '12px' }} />
                <span>Team Channels</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filteredChannels.map(ch => {
                  const isActive = activeRecipientId === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setActiveRecipientId(ch.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: isActive ? 'rgba(255, 105, 0, 0.12)' : 'transparent',
                        color: isActive ? '#ff6900' : 'var(--text-color, #0f172a)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px' }}>#</span>
                        <span style={{ fontSize: '13px', fontWeight: isActive ? 800 : 600 }}>{ch.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Teammates Group */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users style={{ width: '12px', height: '12px' }} />
                <span>Direct Team Members ({filteredUsers.length})</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {filteredUsers.map(u => {
                  const isActive = activeRecipientId === u.id;
                  const unread = getUnreadCount(u.id);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setActiveRecipientId(u.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: isActive ? 'rgba(255, 105, 0, 0.12)' : 'transparent',
                        color: isActive ? '#ff6900' : 'var(--text-color, #0f172a)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={u.avatar || '/assets/images/carlos.jpg'} 
                            alt={u.name} 
                            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                          />
                          <span style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#10b981',
                            border: '1.5px solid var(--card-bg, #ffffff)'
                          }}></span>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '12.5px', fontWeight: isActive ? 800 : 600, color: isActive ? '#ff6900' : 'var(--text-primary, #0f172a)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {u.name}
                          </div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted, #94a3b8)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {u.adminRoleTitle || 'Specialist'}
                          </div>
                        </div>
                      </div>

                      {unread > 0 && (
                        <span style={{
                          padding: '2px 7px',
                          borderRadius: '9999px',
                          backgroundColor: '#ff6900',
                          color: '#ffffff',
                          fontSize: '10px',
                          fontWeight: 800
                        }}>
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Conversation Stream & Input */}
        <div className="noventra-card" style={{
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          height: '680px',
          overflow: 'hidden'
        }}>
          {/* Conversation Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color, #e2e8f0)',
            backgroundColor: 'var(--surface-sunken, #f8fafc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {activeChannel ? (
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 105, 0, 0.12)',
                  color: '#ff6900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '20px'
                }}>
                  #
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img 
                    src={activeTeammate?.avatar || '/assets/images/carlos.jpg'} 
                    alt={activeTeammate?.name || 'User'} 
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '2px solid var(--card-bg, #ffffff)'
                  }}></span>
                </div>
              )}

              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-color, #0f172a)' }}>
                  {activeChannel ? `#${activeChannel.name}` : activeTeammate?.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck style={{ width: '13px', height: '13px', color: '#10b981' }} />
                  <span>
                    {activeChannel 
                      ? activeChannel.desc 
                      : `${activeTeammate?.adminRoleTitle || 'Team Member'} • ${activeTeammate?.email}`}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                fontWeight: 700
              }}>
                Duplex Active
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            backgroundColor: 'var(--card-bg, #ffffff)'
          }}>
            {currentMessages.length === 0 ? (
              <div style={{
                margin: 'auto',
                textAlign: 'center',
                color: '#94a3b8',
                maxWidth: '320px',
                padding: '40px 20px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-sunken, #f8fafc)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <Send style={{ width: '20px', height: '20px', color: '#ff6900' }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-color, #0f172a)', marginBottom: '4px' }}>
                  Start conversation
                </div>
                <div style={{ fontSize: '12px' }}>
                  Send a message to initiate real-time duplex communication with {activeChannel ? `#${activeChannel.name}` : activeTeammate?.name}.
                </div>
              </div>
            ) : (
              currentMessages.map((msg: TeamMessage) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div 
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      alignSelf: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#64748b', 
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {!isMe && (
                        <img 
                          src={msg.senderAvatar || '/assets/images/diego.jpg'} 
                          alt={msg.senderName} 
                          style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                      )}
                      <span>{msg.senderName}</span>
                      <span>&bull;</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div style={{
                      padding: '12px 18px',
                      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      backgroundColor: isMe ? '#ff6900' : 'var(--surface-sunken, #1e293b)',
                      color: isMe ? '#ffffff' : 'var(--text-primary, #0f172a)',
                      fontSize: '13.5px',
                      lineHeight: '1.5',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                      wordBreak: 'break-word',
                      border: isMe ? 'none' : '1px solid var(--border-color, #e2e8f0)'
                    }}>
                      {msg.content}
                    </div>

                    {isMe && (
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#94a3b8', 
                        marginTop: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCheck style={{ width: '12px', height: '12px', color: '#10b981' }} />
                        <span>Delivered</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {isTyping && activeTeammate && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#64748b',
                fontSize: '12px',
                fontStyle: 'italic',
                padding: '6px 12px'
              }}>
                <img 
                  src={activeTeammate.avatar || '/assets/images/carlos.jpg'} 
                  alt={activeTeammate.name} 
                  style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <span>{activeTeammate.name} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Attached File Preview Chip */}
          {attachedFile && (
            <div style={{
              padding: '8px 18px',
              backgroundColor: 'rgba(255, 105, 0, 0.08)',
              borderTop: '1px solid var(--border-color, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ff6900', fontWeight: 600 }}>
                <FileText style={{ width: '15px', height: '15px' }} />
                <span>{attachedFile.name} ({attachedFile.size})</span>
              </div>
              <button 
                type="button" 
                onClick={() => setAttachedFile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <form 
            onSubmit={handleSendMessage}
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--border-color, #e2e8f0)',
              backgroundColor: 'var(--surface-sunken, #f8fafc)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileSelect} 
            />

            <button 
              type="button" 
              className="noventra-circle-btn"
              title="Attach File or Deliverable"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--border-color, #e2e8f0)',
                backgroundColor: 'var(--card-bg, #ffffff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-color, #0f172a)'
              }}
            >
              <Paperclip style={{ width: '16px', height: '16px' }} />
            </button>

            <input 
              type="text" 
              placeholder={`Send real-time message to ${activeChannel ? '#' + activeChannel.name : activeTeammate?.name || 'team'}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '9999px',
                border: '1px solid var(--border-color, #e2e8f0)',
                backgroundColor: 'var(--card-bg, #ffffff)',
                color: 'var(--text-color, #0f172a)',
                fontSize: '13.5px',
                outline: 'none'
              }}
            />

            <button 
              type="submit" 
              className="noventra-orange-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '11px 20px',
                borderRadius: '9999px',
                fontWeight: 700
              }}
            >
              <Send style={{ width: '15px', height: '15px' }} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
