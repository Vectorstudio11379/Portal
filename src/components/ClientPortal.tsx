import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  ArrowUpRight, 
  MoreHorizontal,
  TrendingUp, 
  FolderKanban, 
  HardDrive,
  Clock, 
  Download, 
  Check, 
  Send,
  Mail,
  Phone,
  SlidersHorizontal,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  FileCheck,
  Plus,
  Calendar,
  ExternalLink,
  FileText,
  ShieldCheck,
  MessageCircle,
  Building2
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const ClientPortal: React.FC = () => {
  const { 
    state, 
    setActiveNav, 
    approveDeliverable, 
    openModal, 
    sendChatMessage, 
    showToast
  } = useAgency();
  const { clientPortal, activeNav, searchQuery } = state;
  const [chatInput, setChatInput] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeCalendarDay, setActiveCalendarDay] = useState(13);

  // Dropdown & Popover States
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [streamFilterOpen, setStreamFilterOpen] = useState(false);
  const [streamNotesOpen, setStreamNotesOpen] = useState(false);
  const [streamLayers, setStreamLayers] = useState({ brand: true, tokens: true, beta: true });
  const [selectedStage, setSelectedStage] = useState<'Discovery' | 'Tokens' | 'Prototypes' | 'Beta Staging' | 'QA Review' | 'Launch'>('Beta Staging');
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  // Sign-Off Rate Speedometer States
  const [gaugeCohort, setGaugeCohort] = useState<'sprint4' | 'sprint3' | 'overall'>('sprint4');
  const [hoveredGaugePct, setHoveredGaugePct] = useState<number | null>(null);

  // Connected Channels Donut States
  const [hoveredChannelSegment, setHoveredChannelSegment] = useState<'drive' | 'slack' | 'whatsapp' | null>(null);
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);
  const [channelFilter, setChannelFilter] = useState('5 Active Bridges');

  // Table Filter States
  const [tableFilterOpen, setTableFilterOpen] = useState(false);
  const [tableStatusFilter, setTableStatusFilter] = useState('All');
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);

  // Global click-outside listener
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenu(null);
      setStreamFilterOpen(false);
      setStreamNotesOpen(false);
      setChannelDropdownOpen(false);
      setTableFilterOpen(false);
      setActiveRowMenu(null);
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Calendar meetings mapping for client portal
  const calendarMeetings: Record<number, { title: string; time: string; platform: string; attendees: number; avatars: string[] }> = {
    10: { title: 'Brand Guidelines Review & Token Sign-Off', time: '2:00 pm - 3:00 pm', platform: 'Google Meet', attendees: 4, avatars: ['/assets/images/owais.jpg', '/assets/images/sarah.jpg'] },
    11: { title: 'Component Library Staging Demo', time: '11:00 am - 12:00 pm', platform: 'Zoom Video', attendees: 3, avatars: ['/assets/images/carlos.jpg', '/assets/images/sarah.jpg'] },
    12: { title: 'Executive Retainer Hour Alignment', time: '4:00 pm - 4:30 pm', platform: 'Google Meet', attendees: 2, avatars: ['/assets/images/owais.jpg', '/assets/images/sarah.jpg'] },
    13: { title: 'Quarterly Strategy Review & Beta Preview', time: '10:00 am - 12:00 pm', platform: 'Google Meet', attendees: 7, avatars: ['/assets/images/owais.jpg', '/assets/images/carlos.jpg', '/assets/images/liam.jpg'] },
    14: { title: 'API Integration & Auth Handoff', time: '1:00 pm - 2:00 pm', platform: 'Zoom Video', attendees: 4, avatars: ['/assets/images/carlos.jpg', '/assets/images/sarah.jpg'] },
    15: { title: 'Asset Package Download & Sign-off', time: '3:00 pm - 3:45 pm', platform: 'Google Meet', attendees: 3, avatars: ['/assets/images/owais.jpg', '/assets/images/sarah.jpg'] },
    16: { title: 'Weekly Arc Co. & VectorStudio Sync', time: '9:30 am - 10:30 am', platform: 'Google Meet', attendees: 6, avatars: ['/assets/images/owais.jpg', '/assets/images/sarah.jpg', '/assets/images/liam.jpg'] },
  };

  // Stage milestone data for streamgraph
  const stageVelocityData: Record<string, { velocityPct: number; approved: number; total: number; daysLeft: string; x: number; phase: string }> = {
    'Discovery': { velocityPct: 100, approved: 14, total: 14, daysLeft: 'Completed', x: 45, phase: 'Phase 1: Brand Strategy (100% Sign-Off)' },
    'Tokens': { velocityPct: 100, approved: 28, total: 28, daysLeft: 'Completed', x: 145, phase: 'Phase 2: Tokens Foundation (100% Sign-Off)' },
    'Prototypes': { velocityPct: 85, approved: 18, total: 20, daysLeft: 'Completed', x: 260, phase: 'Phase 2: High-Fi Prototypes (85% Approved)' },
    'Beta Staging': { velocityPct: 76, approved: 16, total: 20, daysLeft: '3 Days Left', x: 380, phase: 'Phase 3: Beta Staging (Current Sprint 4)' },
    'QA Review': { velocityPct: 40, approved: 4, total: 10, daysLeft: '12 Days Left', x: 455, phase: 'Phase 3: Security & Performance QA' },
    'Launch': { velocityPct: 0, approved: 0, total: 12, daysLeft: 'Scheduled Nov 15', x: 510, phase: 'Phase 4: DNS Cutover & Global Release' },
  };

  const pendingCount = clientPortal.deliverables.filter(d => d.status === 'pending').length;

  const filteredDeliverables = clientPortal.deliverables.filter(d =>
    !searchQuery || 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = clientPortal.files.filter(f =>
    !searchQuery ||
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayDeliverables = clientPortal.deliverables.filter(d => {
    const matchesSearch = !tableSearch ||
      d.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      d.submittedBy.toLowerCase().includes(tableSearch.toLowerCase()) ||
      d.status.toLowerCase().includes(tableSearch.toLowerCase());
    
    const matchesStatus = tableStatusFilter === 'All' || d.status === tableStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput.trim());
    setChatInput('');
  };

  const handleChannelClick = (channel: string) => {
    if (channel === 'drive') showToast('Google Drive: Synced shared project folder opened (1.4 GB / 18 files).');
    if (channel === 'slack') showToast('Slack: Connected to #arc-company-vector. Direct 2-way bot sync active.');
    if (channel === 'telegram') showToast('Telegram: @VectorStudioBot alert test ping dispatched!');
    if (channel === 'gmail') showToast('Gmail: Next executive summary digest queued for sarah@arccompany.io.');
    if (channel === 'whatsapp') showToast('WhatsApp: VIP escalation bridge open (+1 415-555-0199).');
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === displayDeliverables.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(displayDeliverables.map(d => d.id));
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const validClientSubviews = [
    'progress', 'deliverables', 'portal-deliverables',
    'files', 'portal-files', 'milestones', 'portal-milestones',
    'chat', 'messages', 'hours', 'retainers', 'channels', 'portal-channels',
    'proposals', 'portal-proposals', 'invoices', 'portal-invoices'
  ];
  const isOverview = activeNav === 'overview' || activeNav === 'portal-overview' || !validClientSubviews.includes(activeNav);


  // =========================================================================
  // FULL PAGE VIEWS WHEN AN OVERVIEW CARD IS CLICKED
  // =========================================================================
  if (!isOverview) {
    let pageTitle = 'Portal Workspace';
    if (activeNav === 'progress') pageTitle = 'Project Trajectory & Phase Status';
    if (activeNav === 'deliverables' || activeNav === 'portal-deliverables') pageTitle = 'Deliverables & Approvals Queue';
    if (activeNav === 'files' || activeNav === 'portal-files') pageTitle = 'Shared Cloud Assets & Drive Repository';
    if (activeNav === 'milestones' || activeNav === 'portal-milestones') pageTitle = 'Project Delivery Roadmap & Milestones';
    if (activeNav === 'chat' || activeNav === 'messages') pageTitle = 'Director Messages & Direct Line';
    if (activeNav === 'hours' || activeNav === 'retainers') pageTitle = 'Monthly Retainer Hours & Team Breakdown';
    if (activeNav === 'channels' || activeNav === 'portal-channels') pageTitle = 'Connected Ecosystem Bridges';
    if (activeNav === 'proposals' || activeNav === 'portal-proposals') pageTitle = 'Payment Proposals & Digital Contracts';
    if (activeNav === 'invoices' || activeNav === 'portal-invoices') pageTitle = 'Billing Ledgers & Settlement Records';

    return (
      <div className="noventra-view-container">
        {/* Full Page Back Header */}
        <div className="noventra-fullpage-header">
          <div className="noventra-nav-breadcrumb-row">
            <button 
              type="button" 
              className="noventra-back-btn"
              onClick={() => setActiveNav('overview')}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              <span>Back to Overview</span>
            </button>
            <div className="noventra-breadcrumb">
              <span>Client Portal (Arc Co.)</span>
              <span>/</span>
              <span className="noventra-breadcrumb-active">{pageTitle}</span>
            </div>
          </div>

          <div className="noventra-banner-row">
            <div>
              <h1 className="noventra-banner-title">{pageTitle}</h1>
              <p className="noventra-banner-sub">
                Transparent client workspace: review assets, sign off on deliverables, and direct collaborate with VectorStudio directors.
              </p>
            </div>
            <div className="noventra-banner-actions">
              <button 
                type="button" 
                className="noventra-orange-btn"
                onClick={() => setActiveNav('chat')}
              >
                <Send style={{ width: '13px', height: '13px' }} />
                <span className="btn-desktop-text">Message Agency</span>
                <span className="btn-mobile-text">Message</span>
              </button>
              <button 
                type="button" 
                className="noventra-outline-btn"
                onClick={() => showToast('Drive folder synced: Drag and drop files to share.')}
              >
                <span className="btn-desktop-text">+ Upload File</span>
                <span className="btn-mobile-text">+ Upload</span>
              </button>
            </div>
          </div>
        </div>

        {/* FULL PAGE 1: PROJECT TRAJECTORY */}
        {activeNav === 'progress' && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Project Trajectory & Phase Status</h2>
                <span className="noventra-card-subtitle">Comprehensive delivery timeline across Q4 milestones</span>
              </div>
              <span className="noventra-status-pill status-green">76% Overall Completion</span>
            </div>

            <div className="sprint-pipeline-grid">
              {[
                { phase: 'Phase 1: Brand Strategy & Architecture', status: 'Completed', pct: 100, date: 'Oct 10, 2026', scope: 'Core positioning, tone of voice, identity manual.' },
                { phase: 'Phase 2: Design System & Token Foundation', status: 'Completed', pct: 100, date: 'Oct 18, 2026', scope: '140+ components, variable tokens, Figma UI kit.' },
                { phase: 'Phase 3: Beta Release & Staging Deployment', status: 'Active (In Progress)', pct: 85, date: 'Oct 27, 2026 (3 Days Left)', scope: 'Frontend staging deployment, REST API hooks.' },
                { phase: 'Phase 4: Production Launch & DNS Cutover', status: 'Upcoming', pct: 0, date: 'Nov 15, 2026', scope: 'Zero-downtime cutover and executive monitoring.' }
              ].map((p, idx) => (
                <div key={idx} className="sprint-pipeline-card">
                  <div className="sprint-header">
                    <span className="sprint-client-tag">Arc Company</span>
                    <span className={`noventra-status-pill ${p.pct === 100 ? 'status-green' : p.pct > 0 ? 'status-orange' : 'status-blue'}`}>
                      {p.status}
                    </span>
                  </div>
                  <h3 className="sprint-name">{p.phase}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '8px 0 16px 0', lineHeight: 1.5 }}>{p.scope}</p>
                  <div className="sprint-progress-bar-container">
                    <div className="sprint-progress-bar-fill" style={{ width: `${p.pct}%` }}></div>
                  </div>
                  <div className="sprint-footer">
                    <span className="sprint-progress-text">{p.pct}% complete</span>
                    <span className="sprint-date">{p.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FULL PAGE 2: DELIVERABLES & APPROVALS QUEUE */}
        {(activeNav === 'deliverables' || activeNav === 'portal-deliverables') && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Deliverables & Approvals Queue</h2>
                <span className="noventra-card-subtitle">Review design files, specs, and approve assets for production</span>
              </div>
              <span className="noventra-status-pill status-orange">{pendingCount} Action Required</span>
            </div>

            <div className="deliverables-grid">
              {filteredDeliverables.map((del) => (
                <div key={del.id} className="deliverable-card">
                  <div className="deliverable-header">
                    <div>
                      <span className="deliverable-ver-badge">{del.version}</span>
                      <h3 className="deliverable-name">{del.name}</h3>
                    </div>
                    <span className={`noventra-status-pill ${del.status === 'approved' ? 'status-green' : 'status-orange'}`}>
                      {del.status === 'approved' ? '● Approved' : '● Action Required'}
                    </span>
                  </div>
                  <p className="deliverable-desc">{del.desc}</p>
                  <div className="deliverable-meta">
                    <span>Submitted by <strong>{del.submittedBy}</strong></span>
                    <span>Date: {del.date}</span>
                  </div>
                  <div className="deliverable-actions">
                    {del.status === 'pending' ? (
                      <>
                        <button 
                          type="button" 
                          className="noventra-orange-btn"
                          onClick={() => approveDeliverable(del.id)}
                        >
                          <Check style={{ width: '15px', height: '15px' }} />
                          <span>Approve Deliverable</span>
                        </button>
                        <button 
                          type="button" 
                          className="noventra-outline-btn"
                          onClick={() => openModal('feedback', { deliverableId: del.id, name: del.name })}
                        >
                          <span>Request Changes</span>
                        </button>
                      </>
                    ) : (
                      <button 
                        type="button" 
                        className="noventra-outline-btn"
                        onClick={() => showToast(`Downloading signed release: ${del.name}...`)}
                      >
                        <Download style={{ width: '15px', height: '15px' }} />
                        <span>Download Release Package</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FULL PAGE 3: SHARED CLOUD FILES */}
        {(activeNav === 'files' || activeNav === 'portal-files') && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Shared Cloud Assets & Drive Repository</h2>
                <span className="noventra-card-subtitle">Production exports, design tokens, and architectural specifications</span>
              </div>
              <button 
                type="button" 
                className="noventra-orange-btn"
                onClick={() => handleChannelClick('drive')}
              >
                <HardDrive style={{ width: '15px', height: '15px' }} />
                <span>Open Google Drive (1.4 GB)</span>
              </button>
            </div>

            <div className="noventra-table-container">
              <table className="noventra-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Synced With</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id}>
                      <td style={{ fontWeight: 700 }}>{file.name}</td>
                      <td><span className="file-type-pill">{file.type}</span></td>
                      <td style={{ color: '#78716c' }}>{file.size}</td>
                      <td>Google Drive Cloud</td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          type="button" 
                          className="noventra-orange-btn"
                          style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-flex' }}
                          onClick={() => showToast(`Downloading ${file.name}...`)}
                        >
                          <Download style={{ width: '13px', height: '13px' }} />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FULL PAGE 4: MILESTONES ROADMAP */}
        {(activeNav === 'milestones' || activeNav === 'portal-milestones') && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Delivery Roadmap & Key Milestones</h2>
                <span className="noventra-card-subtitle">Major project checkpoints, deliverables sign-offs, and launch gates</span>
              </div>
            </div>

            <div className="milestones-timeline-list">
              {clientPortal.milestones.map((m) => (
                <div key={m.id} className="milestone-timeline-item">
                  <div className={`milestone-timeline-dot ${m.status}`}>
                    {m.status === 'completed' && <Check style={{ width: '13px', height: '13px', color: '#ffffff' }} />}
                  </div>
                  <div className="milestone-timeline-body">
                    <div className="milestone-title-row">
                      <h4 className="milestone-name">{m.name}</h4>
                      <span className={`noventra-status-pill ${m.status === 'completed' ? 'status-green' : m.status === 'active' ? 'status-orange' : 'status-blue'}`}>
                        {m.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="milestone-date-label">{m.date}</span>
                    <p className="milestone-desc-text">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FULL PAGE 5: DIRECT COMMUNICATION & MESSAGES */}
        {(activeNav === 'chat' || activeNav === 'messages') && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Direct Agency Chat & Strategy Line</h2>
                <span className="noventra-card-subtitle">Direct collaboration with Owais Anwer (Director) & Carlos Mendes (Lead)</span>
              </div>
              <span className="badge-live-sync"><span className="pulse-dot"></span> Agency Leads Online</span>
            </div>

            <div className="chat-window-container">
              <div className="chat-messages-scroll">
                {clientPortal.chatMessages.map((msg) => (
                  <div key={msg.id} className={`chat-message-bubble ${msg.role}`}>
                    <div className="chat-msg-header">
                      <span className="chat-sender-name">{msg.sender}</span>
                      <span className="chat-msg-time">{msg.time}</span>
                    </div>
                    <p className="chat-msg-body">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatSubmit} className="chat-input-bar">
                <input 
                  type="text" 
                  placeholder="Type a message to VectorStudio directors..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="noventra-orange-btn">
                  <Send style={{ width: '15px', height: '15px' }} />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* FULL PAGE 6: RETAINER HOURS */}
        {(activeNav === 'hours' || activeNav === 'retainers') && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Monthly Retainer Allocation & Team Workload</h2>
                <span className="noventra-card-subtitle">Arc Company Tier 1 VIP Retainer &bull; October 2026</span>
              </div>
              <span className="noventra-status-pill status-green">85% Utilized (On Track)</span>
            </div>

            <div className="noventra-stat-grid-3">
              <div className="noventra-stat-box">
                <span className="stat-label">Hours Logged This Cycle</span>
                <span className="stat-val">34 hrs</span>
                <span className="stat-trend green">● Out of 40 monthly allocated</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Remaining Allocation</span>
                <span className="stat-val">6 hrs</span>
                <span className="stat-trend orange">● 7 days remaining in cycle</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Dedicated Team Leads</span>
                <span className="stat-val">4 Leads</span>
                <span className="stat-trend green">● Owais, Carlos, Liam, Diego</span>
              </div>
            </div>
          </div>
        )}

        {/* FULL PAGE 7: CONNECTED ECOSYSTEM BRIDGES */}
        {(activeNav === 'channels' || activeNav === 'portal-channels') && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Connected Client Ecosystem Bridges</h2>
                <span className="noventra-card-subtitle">Manage communication hooks, cloud storage sync, and automated notification bots</span>
              </div>
              <span className="badge-live-sync"><span className="pulse-dot"></span> 5 Bridges Active</span>
            </div>

            <div className="connected-channels-grid">
              {[
                { id: 'drive', name: 'Google Drive', sub: 'Shared Project Folder (1.4 GB / 18 files synced)', action: 'Open Folder', icon: <HardDrive style={{ width: '18px', height: '18px' }} />, wrap: 'drive' },
                { id: 'slack', name: 'Slack', sub: '#arc-company-vector &bull; 2-way bot channel active', action: 'Ping Channel', icon: <MessageSquare style={{ width: '18px', height: '18px' }} />, wrap: 'slack' },
                { id: 'telegram', name: 'Telegram', sub: '@VectorStudioBot alert dispatcher active', action: 'Test Alerts', icon: <Send style={{ width: '17px', height: '17px' }} />, wrap: 'telegram' },
                { id: 'gmail', name: 'Gmail', sub: 'Weekly executive summary digests to sarah@arccompany.io', action: 'Queue Digest', icon: <Mail style={{ width: '17px', height: '17px' }} />, wrap: 'gmail' },
                { id: 'whatsapp', name: 'WhatsApp', sub: 'VIP Executive group line (+1 415-555-0199)', action: 'Open Chat', icon: <Phone style={{ width: '17px', height: '17px' }} />, wrap: 'whatsapp' }
              ].map(ch => (
                <div key={ch.id} className="channel-card">
                  <div className={`channel-icon-wrap ${ch.wrap}`}>
                    {ch.icon}
                  </div>
                  <div className="channel-info">
                    <h4 className="channel-name">{ch.name}</h4>
                    <span className="channel-status">{ch.sub}</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn-channel-action"
                    onClick={() => handleChannelClick(ch.id)}
                  >
                    {ch.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FULL PAGE: SHARED DELIVERABLES & FILES VAULT */}
        {(activeNav === 'files' || activeNav === 'portal-files') && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Shared Deliverables & Asset Vault</h2>
                <span className="noventra-card-subtitle">
                  Design tokens, specification documents, production exports, and contract SOWs
                </span>
              </div>
              <button 
                type="button" 
                className="noventra-orange-btn small"
                onClick={() => openModal('file_sharing')}
              >
                <Plus style={{ width: '13px', height: '13px' }} />
                <span>Upload & Manage Files</span>
              </button>
            </div>

            <div className="noventra-table-container" style={{ marginTop: '20px' }}>
              <table className="noventra-table">
                <thead>
                  <tr>
                    <th>File Asset</th>
                    <th>Format</th>
                    <th>Size</th>
                    <th>Date Added</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(clientPortal.files || []).map((file) => (
                    <tr key={file.id}>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{file.name}</span>
                        {file.description && (
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{file.description}</span>
                        )}
                      </td>
                      <td>
                        <span className="noventra-status-pill status-blue" style={{ fontSize: '10px' }}>
                          {file.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{file.size}</td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{file.uploadedDate || 'Oct 20, 2026'}</td>
                      <td>
                        <span className={`noventra-status-pill ${file.status === 'client_reviewed' ? 'status-green' : 'status-blue'}`} style={{ fontSize: '10px' }}>
                          {file.status === 'client_reviewed' ? '● REVIEWED' : '● ACTIVE'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button 
                            type="button" 
                            className="noventra-outline-btn small"
                            onClick={() => openModal('file_sharing')}
                          >
                            Edit
                          </button>
                          <button 
                            type="button" 
                            className="noventra-orange-btn small"
                            onClick={() => showToast(`Downloading "${file.name}"...`)}
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FULL PAGE 8: PROPOSALS & CONTRACT PAYMENT BRIDGE */}
        {(activeNav === 'proposals' || activeNav === 'portal-proposals') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="noventra-card">
              <div className="noventra-card-title-row">
                <div>
                  <h2 className="noventra-card-heading">Web Development Proposals & Milestone Contracts</h2>
                  <span className="noventra-card-subtitle">
                    Authorize digital agreements, review milestone deliverables, and inspect off-platform settlement schedules verified by your Project Lead.
                  </span>
                </div>
                <span className="noventra-status-pill status-green">
                  ● {(clientPortal.proposals || []).filter(p => p.status === 'Paid & Active').length} Contracts Active
                </span>
              </div>

              {/* Proposals Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                {(clientPortal.proposals || []).map((prop) => {
                  const isPaid = prop.paymentStatus === 'deposit_paid' || prop.paymentStatus === 'fully_paid';
                  const deposit = prop.depositAmount || Math.round(prop.budget * 0.3);

                  return (
                    <div 
                      key={prop.id} 
                      className="noventra-card" 
                      style={{ 
                        border: isPaid ? '1.5px solid #10b981' : '2px solid #ff6900',
                        backgroundColor: isPaid ? '#ffffff' : '#fffdfa'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#ff6900' }}>{prop.propNum}</span>
                            <span className={`noventra-status-pill ${isPaid ? 'status-green' : 'status-orange'}`}>
                              ● {isPaid ? 'Paid & Active' : 'Pending Signature & Deposit'}
                            </span>
                            <span className="noventra-status-pill status-blue" style={{ fontSize: '10px' }}>
                              Date: {prop.date}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#18181b', marginBottom: '6px' }}>
                            {prop.title}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.5, maxWidth: '800px' }}>
                            {prop.scope}
                          </p>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11.5px', color: '#78716c', display: 'block' }}>Total Project Value</span>
                          <span style={{ fontSize: '24px', fontWeight: 900, color: '#18181b', display: 'block' }}>
                            ${prop.budget.toLocaleString()} USD
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>
                            Required Kickoff Deposit: ${deposit.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Milestone Breakdown Bar */}
                      <div style={{ margin: '16px 0', padding: '14px', backgroundColor: '#faf9f6', borderRadius: '10px', border: '1px solid #eae7df' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#18181b', display: 'block', marginBottom: '8px' }}>
                          Milestone Payment Schedule:
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                          {(prop.milestonesBreakdown || [
                            { title: 'Kickoff Discovery & Architecture (30%)', amount: deposit, status: isPaid ? 'paid' : 'due' },
                            { title: 'Fullstack Staging & CMS (40%)', amount: Math.round(prop.budget * 0.4), status: 'pending' },
                            { title: 'Production Cutover & Launch (30%)', amount: Math.round(prop.budget * 0.3), status: 'pending' }
                          ]).map((ms, idx) => (
                            <div key={idx} style={{ padding: '8px 12px', backgroundColor: ms.status === 'paid' ? '#f0fdf4' : '#ffffff', borderRadius: '8px', border: ms.status === 'paid' ? '1px solid #bbf7d0' : '1px solid #eae7df' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: ms.status === 'paid' ? '#166534' : '#18181b', display: 'block' }}>
                                {ms.title}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 800, color: '#18181b' }}>${ms.amount.toLocaleString()}</span>
                                <span className={`noventra-status-pill ${ms.status === 'paid' ? 'status-green' : ms.status === 'due' ? 'status-orange' : 'status-blue'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                                  {ms.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions & Assigned Lead */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f2efe9', paddingTop: '14px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', color: '#78716c' }}>Assigned Project Lead:</span>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#18181b' }}>
                            {prop.assignedLead || 'Owais Anwer'} ({prop.assignedLeadRole || 'Project Lead'})
                          </span>
                          <button 
                            type="button" 
                            className="noventra-whatsapp-btn"
                            onClick={() => {
                              const msg = `Hi ${prop.assignedLead || 'Owais'}, I have a question regarding the scope and deposit schedule for proposal ${prop.propNum} (${prop.title}).`;
                              window.open(`https://wa.me/14155550192?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                            }}
                            title="Chat with Lead on WhatsApp"
                          >
                            <MessageCircle style={{ width: '12px', height: '12px' }} />
                            <span>WhatsApp Lead</span>
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button 
                            type="button" 
                            className="noventra-outline-btn small"
                            onClick={() => showToast(`Downloading PDF Contract for ${prop.propNum}...`)}
                          >
                            <Download style={{ width: '13px', height: '13px' }} />
                            <span>View PDF SOW</span>
                          </button>

                          {!isPaid ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="noventra-status-pill status-orange" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
                                Kickoff Deposit Due: ${deposit.toLocaleString()}
                              </span>
                              <button 
                                type="button" 
                                className="noventra-whatsapp-btn small"
                                onClick={() => {
                                  const msg = `Hi ${prop.assignedLead || 'Owais'}, I am confirming that we have dispatched the bank wire transfer of $${deposit.toLocaleString()} USD for kickoff deposit on proposal ${prop.propNum} (${prop.title}). Please let us know once funds clear.`;
                                  window.open(`https://wa.me/14155550192?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                                }}
                                title="Notify Lead via WhatsApp"
                              >
                                <MessageCircle style={{ width: '13px', height: '13px' }} />
                                <span>Notify Lead of Wire</span>
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '12.5px' }}>
                              <ShieldCheck style={{ width: '18px', height: '18px' }} />
                              <span>Kickoff Deposit Cleared • Sprint 1 Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* FULL PAGE 9: BILLING & INVOICES LEDGER */}
        {(activeNav === 'invoices' || activeNav === 'portal-invoices') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Direct Bank Wire Coordinates Card */}
            <div className="noventra-card" style={{ border: '1.5px solid #e2e8f0', background: '#faf9f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="metric-icon-square icon-blue" style={{ width: '38px', height: '38px' }}>
                    <Building2 style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div>
                    <h3 className="noventra-card-heading" style={{ fontSize: '16px', margin: 0 }}>
                      Official Bank Wire Transfer Coordinates
                    </h3>
                    <span className="noventra-card-subtitle" style={{ fontSize: '12px' }}>
                      All invoice and milestone settlements are processed off-platform via corporate wire or ACH.
                    </span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="noventra-whatsapp-btn small"
                  onClick={() => {
                    const msg = `Hi Owais, I am confirming that we have dispatched a bank wire payment for our project account. Please check receipt.`;
                    window.open(`https://wa.me/14155550192?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <MessageCircle style={{ width: '13px', height: '13px' }} />
                  <span>Notify Lead via WhatsApp</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12.5px' }}>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #eae7df' }}>
                  <span style={{ fontSize: '10.5px', color: '#78716c', display: 'block', fontWeight: 700 }}>BENEFICIARY BANK</span>
                  <span style={{ fontWeight: 800, color: '#18181b' }}>Silicon Valley Commercial Bank</span>
                </div>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #eae7df' }}>
                  <span style={{ fontSize: '10.5px', color: '#78716c', display: 'block', fontWeight: 700 }}>ACCOUNT NAME</span>
                  <span style={{ fontWeight: 800, color: '#18181b' }}>VectorStudio Creative Labs LLC</span>
                </div>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #eae7df' }}>
                  <span style={{ fontSize: '10.5px', color: '#78716c', display: 'block', fontWeight: 700 }}>ACCOUNT NUMBER</span>
                  <span style={{ fontWeight: 800, color: '#18181b', fontFamily: 'monospace' }}>•••••••• 8821</span>
                </div>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #eae7df' }}>
                  <span style={{ fontSize: '10.5px', color: '#78716c', display: 'block', fontWeight: 700 }}>ROUTING / IBAN</span>
                  <span style={{ fontWeight: 800, color: '#18181b', fontFamily: 'monospace' }}>021000021</span>
                </div>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #eae7df' }}>
                  <span style={{ fontSize: '10.5px', color: '#78716c', display: 'block', fontWeight: 700 }}>SWIFT / BIC</span>
                  <span style={{ fontWeight: 800, color: '#18181b', fontFamily: 'monospace' }}>SVBKUS33XXX</span>
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="noventra-card">
              <div className="noventra-card-title-row">
                <div>
                  <h2 className="noventra-card-heading">Client Invoices & Settlement Records</h2>
                  <span className="noventra-card-subtitle">
                    Audited financial ledger, paid milestone receipts, and direct wire settlement statements
                  </span>
                </div>
                <span className="noventra-status-pill status-green">● Official Agency Ledger</span>
              </div>

              <div className="noventra-table-container" style={{ marginTop: '20px' }}>
                <table className="noventra-table">
                  <thead>
                    <tr>
                      <th>Invoice No.</th>
                      <th>Billing Description</th>
                      <th>Amount (USD)</th>
                      <th>Settlement Channel</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Receipts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(clientPortal.invoices || []).map((inv) => {
                      const isPaid = inv.status === 'paid';
                      const isPart = inv.status === 'partially_paid';

                      return (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 800, color: '#18181b' }}>{inv.num}</td>
                          <td>{inv.desc}</td>
                          <td style={{ fontWeight: 800, fontSize: '14px', color: '#18181b' }}>
                            ${inv.amount.toLocaleString()}
                          </td>
                          <td style={{ fontSize: '12px', color: '#64748b' }}>
                            {inv.paymentMethod || 'Direct Bank Wire'}
                          </td>
                          <td>
                            <span className={`noventra-status-pill ${isPaid ? 'status-green' : (isPart ? 'status-orange' : 'status-gray')}`}>
                              ● {isPaid ? 'PAID' : (isPart ? 'PARTIAL' : inv.status.toUpperCase())}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button 
                                type="button" 
                                className="noventra-outline-btn small"
                                onClick={() => showToast(`Receipt downloaded for ${inv.num}`)}
                              >
                                <Download style={{ width: '12px', height: '12px' }} />
                                <span>{isPaid ? 'Receipt PDF' : 'Invoice PDF'}</span>
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
      </div>
    );
  }

  // =========================================================================
  // DEFAULT VIEW: 3-ROW NOVENTRA ARCHITECTURE MATCHING ADMIN DASHBOARD
  // =========================================================================
  const activeStageKey = hoveredStage || selectedStage;
  const activeStageInfo = stageVelocityData[activeStageKey] || stageVelocityData['Beta Staging'];

  const signOffCohortData = {
    'sprint4': { pct: 80, angle: 70, label: 'Sprint 4 (Current)', sub: '16 of 20 deliverables signed off', status: '80% (On Track)' },
    'sprint3': { pct: 100, angle: 135, label: 'Sprint 3 (Previous)', sub: '18 of 18 deliverables signed off', status: '100% (Completed)' },
    'overall': { pct: 88, angle: 98, label: 'Overall Q4 Trajectory', sub: '54 of 62 total milestone deliverables signed off', status: '88% (Exceeding Target)' }
  }[gaugeCohort];

  const currentSignOffPct = hoveredGaugePct !== null ? hoveredGaugePct : signOffCohortData.pct;
  const currentSignOffAngle = hoveredGaugePct !== null ? (-135 + (hoveredGaugePct / 100) * 270) : signOffCohortData.angle;

  // Donut center display calculation for Client Portal Connected Channels
  let channelCenterTitle = '5';
  let channelCenterSubtitle = 'Live Bridges';
  let channelCenterRate = '100% Synced';
  let channelCenterColor = '#16a34a';

  if (hoveredChannelSegment === 'drive') {
    channelCenterTitle = '1.4 GB';
    channelCenterSubtitle = 'Google Drive';
    channelCenterRate = '18 Synced Files';
    channelCenterColor = '#ff6900';
  } else if (hoveredChannelSegment === 'slack') {
    channelCenterTitle = 'Live';
    channelCenterSubtitle = 'Slack #arc-vip';
    channelCenterRate = '2-Way Bot Active';
    channelCenterColor = '#0284c7';
  } else if (hoveredChannelSegment === 'whatsapp') {
    channelCenterTitle = '24/7';
    channelCenterSubtitle = 'WhatsApp VIP';
    channelCenterRate = 'Executive Hotline';
    channelCenterColor = '#059669';
  }

  const activeMeeting = calendarMeetings[activeCalendarDay] || calendarMeetings[13];

  return (
    <div className="noventra-dashboard-container">
      {/* Dedicated Workspace Quick Links Bar - Strictly Single Row & Smaller */}
      <div className="workspace-quick-links-bar">
        <button 
          type="button" 
          className="workspace-link-pill" 
          onClick={() => setActiveNav('progress')}
          title="Open Project Trajectory"
        >
          <TrendingUp style={{ width: '13px', height: '13px', color: '#ff6900' }} />
          <span>Trajectory (Phases)</span>
        </button>
        <button 
          type="button" 
          className="workspace-link-pill" 
          onClick={() => setActiveNav('deliverables')}
          title="Open Deliverables Queue"
        >
          <FileCheck style={{ width: '13px', height: '13px', color: '#2563eb' }} />
          <span>Deliverables (Approvals)</span>
        </button>
        <button 
          type="button" 
          className="workspace-link-pill" 
          onClick={() => setActiveNav('files')}
          title="Open Shared Cloud Assets"
        >
          <HardDrive style={{ width: '13px', height: '13px', color: '#10b981' }} />
          <span>Cloud Assets (Drive)</span>
        </button>
        <button 
          type="button" 
          className="workspace-link-pill" 
          onClick={() => setActiveNav('chat')}
          title="Open Director Line"
        >
          <MessageSquare style={{ width: '13px', height: '13px', color: '#8b5cf6' }} />
          <span>Director Line (Chat)</span>
        </button>
        <button 
          type="button" 
          className="workspace-link-pill" 
          onClick={() => setActiveNav('hours')}
          title="Open Retainer Hours"
        >
          <Clock style={{ width: '13px', height: '13px', color: '#ea580c' }} />
          <span>Retainer Hours (Sheets)</span>
        </button>
      </div>

      {/* =====================================================================
          ROW 1: (Left: 2x2 Metric Grid, Right: Wide Velocity & Stream Chart)
          ===================================================================== */}
      <section className="noventra-row-1" aria-label="Client Project Trajectory Overview">
        {/* Left 2x2 Metric Grid */}
        <div className="noventra-2x2-grid">
          {/* 1. Project Trajectory */}
          <div 
            className="noventra-metric-card" 
            onClick={() => setActiveNav('progress')}
            role="button"
            tabIndex={0}
            style={{ position: 'relative' }}
          >
            <div className="metric-card-top">
              <div className="metric-icon-square icon-orange">
                <TrendingUp style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="metric-title">Project Completion</span>
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button 
                  type="button" 
                  className="metric-more-btn" 
                  aria-label="Options"
                  onClick={() => setActiveMenu(activeMenu === 'progress' ? null : 'progress')}
                >
                  <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                </button>
                {activeMenu === 'progress' && (
                  <div className="card-dropdown-menu">
                    <div className="card-dropdown-header">Project Actions</div>
                    <button type="button" className="card-dropdown-item" onClick={() => { setActiveNav('progress'); setActiveMenu(null); }}>
                      <TrendingUp style={{ width: '13px', height: '13px' }} />
                      <span>View 4 Phase Roadmaps</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { showToast('Project milestone report exported.'); setActiveMenu(null); }}>
                      <Download style={{ width: '13px', height: '13px' }} />
                      <span>Download Phase Report</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="metric-amount-row">
              <span className="metric-amount">{clientPortal.progressPercent}%</span>
            </div>
            <div className="metric-footer-row">
              <span className="metric-trend green">
                ▲ Phase 3 of 4 <span className="trend-sub">active</span>
              </span>
              <span className="metric-details-link">Details ↗</span>
            </div>
          </div>

          {/* 2. Pending Approvals */}
          <div 
            className="noventra-metric-card" 
            onClick={() => setActiveNav('deliverables')}
            role="button"
            tabIndex={0}
            style={{ position: 'relative' }}
          >
            <div className="metric-card-top">
              <div className="metric-icon-square icon-blue">
                <FolderKanban style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="metric-title">Pending Approvals</span>
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button 
                  type="button" 
                  className="metric-more-btn" 
                  aria-label="Options"
                  onClick={() => setActiveMenu(activeMenu === 'approvals' ? null : 'approvals')}
                >
                  <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                </button>
                {activeMenu === 'approvals' && (
                  <div className="card-dropdown-menu">
                    <div className="card-dropdown-header">Approval Actions</div>
                    <button type="button" className="card-dropdown-item" onClick={() => { setActiveNav('deliverables'); setActiveMenu(null); }}>
                      <FileCheck style={{ width: '13px', height: '13px' }} />
                      <span>Review All Pending ({pendingCount})</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { showToast('Bulk approvals signed for all completed assets.'); setActiveMenu(null); }}>
                      <Check style={{ width: '13px', height: '13px' }} />
                      <span>Sign All Approved</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="metric-amount-row">
              <span className="metric-amount">{pendingCount} Items</span>
            </div>
            <div className="metric-footer-row">
              <span className="metric-trend orange">
                ● Action needed <span className="trend-sub">by Arc team</span>
              </span>
              <span className="metric-details-link">Review ↗</span>
            </div>
          </div>

          {/* 3. Shared Files */}
          <div 
            className="noventra-metric-card" 
            onClick={() => setActiveNav('files')}
            role="button"
            tabIndex={0}
            style={{ position: 'relative' }}
          >
            <div className="metric-card-top">
              <div className="metric-icon-square icon-green">
                <HardDrive style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="metric-title">Shared Cloud Assets</span>
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button 
                  type="button" 
                  className="metric-more-btn" 
                  aria-label="Options"
                  onClick={() => setActiveMenu(activeMenu === 'files' ? null : 'files')}
                >
                  <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                </button>
                {activeMenu === 'files' && (
                  <div className="card-dropdown-menu">
                    <div className="card-dropdown-header">Cloud Storage</div>
                    <button type="button" className="card-dropdown-item" onClick={() => { handleChannelClick('drive'); setActiveMenu(null); }}>
                      <ExternalLink style={{ width: '13px', height: '13px' }} />
                      <span>Open Google Drive</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { showToast('Packaging all 18 production assets into ZIP...'); setActiveMenu(null); }}>
                      <Download style={{ width: '13px', height: '13px' }} />
                      <span>Download All ZIP</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="metric-amount-row">
              <span className="metric-amount">{clientPortal.files.length} Assets</span>
            </div>
            <div className="metric-footer-row">
              <span className="metric-trend green">
                ▲ 1.4 GB <span className="trend-sub">synced to Drive</span>
              </span>
              <span className="metric-details-link">Open ↗</span>
            </div>
          </div>

          {/* 4. Retainer Hours Used */}
          <div 
            className="noventra-metric-card" 
            onClick={() => setActiveNav('hours')}
            role="button"
            tabIndex={0}
            style={{ position: 'relative' }}
          >
            <div className="metric-card-top">
              <div className="metric-icon-square icon-red">
                <Clock style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="metric-title">Monthly Retainer Hours</span>
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button 
                  type="button" 
                  className="metric-more-btn" 
                  aria-label="Options"
                  onClick={() => setActiveMenu(activeMenu === 'hours' ? null : 'hours')}
                >
                  <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                </button>
                {activeMenu === 'hours' && (
                  <div className="card-dropdown-menu">
                    <div className="card-dropdown-header">Retainer Details</div>
                    <button type="button" className="card-dropdown-item" onClick={() => { setActiveNav('hours'); setActiveMenu(null); }}>
                      <Clock style={{ width: '13px', height: '13px' }} />
                      <span>View Time Log Ledger</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { showToast('Request for extra 10 hour bucket sent to Owais.'); setActiveMenu(null); }}>
                      <Plus style={{ width: '13px', height: '13px' }} />
                      <span>Request +10 Hour Bucket</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="metric-amount-row">
              <span className="metric-amount">34 / 40 hrs</span>
            </div>
            <div className="metric-footer-row">
              <span className="metric-trend red">
                ● 85% used <span className="trend-sub">(6 hrs left)</span>
              </span>
              <span className="metric-details-link">Details ↗</span>
            </div>
          </div>
        </div>

        {/* Right Wide Card: Milestone Velocity & Deliverables Stream */}
        <div 
          className="noventra-revenue-card"
          onClick={() => setActiveNav('milestones')}
          role="button"
          tabIndex={0}
          style={{ position: 'relative' }}
        >
          <div className="revenue-card-top">
            <h3 className="revenue-card-title">Milestone Velocity & Deliverables Stream</h3>
            <div className="revenue-card-controls" onClick={(e) => e.stopPropagation()}>
              {/* Filter Velocity Layers Popover */}
              <div style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  className={`rev-icon-btn ${streamFilterOpen ? 'dark' : 'light'}`} 
                  title="Filter stream layers"
                  onClick={() => setStreamFilterOpen(prev => !prev)}
                >
                  <SlidersHorizontal style={{ width: '14px', height: '14px' }} />
                </button>

                {streamFilterOpen && (
                  <div className="card-dropdown-menu" style={{ width: '250px', left: 0, right: 'auto' }}>
                    <div className="card-dropdown-header">Delivery Layers</div>
                    <div 
                      className="card-dropdown-item" 
                      onClick={() => setStreamLayers(p => ({ ...p, brand: !p.brand }))}
                    >
                      <input type="checkbox" checked={streamLayers.brand} readOnly />
                      <span>Brand & Tokens (100% Signed)</span>
                    </div>
                    <div 
                      className="card-dropdown-item" 
                      onClick={() => setStreamLayers(p => ({ ...p, tokens: !p.tokens }))}
                    >
                      <input type="checkbox" checked={streamLayers.tokens} readOnly />
                      <span>Prototypes (85% Approved)</span>
                    </div>
                    <div 
                      className="card-dropdown-item" 
                      onClick={() => setStreamLayers(p => ({ ...p, beta: !p.beta }))}
                    >
                      <input type="checkbox" checked={streamLayers.beta} readOnly />
                      <span>Beta Staging (76% Velocity)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Director Popover */}
              <div style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  className={`rev-icon-btn ${streamNotesOpen ? 'dark' : 'light'}`} 
                  title="Director notes"
                  onClick={() => setStreamNotesOpen(prev => !prev)}
                >
                  <MessageSquare style={{ width: '14px', height: '14px' }} />
                </button>

                {streamNotesOpen && (
                  <div className="card-dropdown-menu" style={{ width: '280px', right: 0 }}>
                    <div className="card-dropdown-header">Director Delivery Notes</div>
                    <div style={{ padding: '8px 10px', fontSize: '11.5px', color: '#44403c', lineHeight: 1.5 }}>
                      <p><strong>Beta Staging Phase:</strong> Frontend release deployed to staging server. 16 of 20 deliverables signed off.</p>
                      <p style={{ marginTop: '6px', color: '#16a34a', fontWeight: '600' }}>✓ 3 days remaining before QA handoff.</p>
                      <p style={{ marginTop: '6px', color: '#ff6900' }}>Action item: 4 design tokens awaiting Sarah's review.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Expand Milestones Page */}
              <button 
                type="button" 
                className="rev-icon-btn light" 
                title="Expand Milestones Page"
                onClick={() => setActiveNav('milestones')}
              >
                <ArrowUpRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>

          <div className="revenue-amount-row">
            <span className="revenue-amount">{activeStageInfo.velocityPct}% Velocity</span>
            <span className="revenue-currency">{activeStageKey} {hoveredStage && '(Inspecting)'}</span>
          </div>

          {/* Sinuous Ribbon Streamgraph with interactive hover tooltip */}
          <div className="revenue-stream-container" onClick={(e) => e.stopPropagation()}>
            {/* Interactive Floating Hover Tooltip */}
            {hoveredStage && (
              <div className="stream-hover-badge">
                <span><strong>{hoveredStage}</strong></span>
                <span>Velocity: <strong>{stageVelocityData[hoveredStage]?.velocityPct}%</strong></span>
                <span>Approved: {stageVelocityData[hoveredStage]?.approved} / {stageVelocityData[hoveredStage]?.total}</span>
                <span>{stageVelocityData[hoveredStage]?.daysLeft}</span>
              </div>
            )}

            <svg 
              viewBox="0 0 540 160" 
              className="revenue-stream-svg" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="clientWarmStream" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.85" />
                  <stop offset="40%" stopColor="#ea580c" stopOpacity="0.75" />
                  <stop offset="70%" stopColor="#d97706" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
                </linearGradient>

                <linearGradient id="clientCoolStream" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fdba74" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="clientMidStream" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#a7f3d0" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.7" />
                </linearGradient>

                <filter id="clientGlowOrange" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ff6900" floodOpacity="0.7" />
                </filter>
              </defs>

              {streamLayers.brand && (
                <path
                  className="stream-layer-2"
                  d="M 20 85 C 100 82, 160 88, 220 86 C 280 84, 320 72, 380 65 C 440 58, 480 50, 520 48 L 520 120 C 480 122, 440 125, 380 115 C 320 105, 280 95, 220 92 C 160 90, 100 95, 20 96 Z"
                  fill="url(#clientCoolStream)"
                />
              )}

              {streamLayers.tokens && (
                <path
                  className="stream-layer-3"
                  d="M 20 70 C 100 68, 160 74, 220 78 C 280 82, 320 80, 380 72 C 440 64, 480 58, 520 54 L 520 102 C 480 106, 440 108, 380 102 C 320 96, 280 90, 220 88 C 160 86, 100 80, 20 78 Z"
                  fill="url(#clientMidStream)"
                />
              )}

              {streamLayers.beta && (
                <path
                  className="stream-layer-1"
                  d="M 20 50 C 80 48, 140 52, 200 68 C 260 84, 310 82, 360 78 C 420 74, 460 70, 520 68 L 520 88 C 460 90, 420 92, 360 88 C 310 84, 260 86, 200 82 C 140 78, 80 74, 20 72 Z"
                  fill="url(#clientWarmStream)"
                />
              )}

              {/* Dynamic Interactive Marker at Active Stage */}
              <g style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                <line 
                  x1={activeStageInfo.x} 
                  y1="18" 
                  x2={activeStageInfo.x} 
                  y2="140" 
                  stroke="#18181b" 
                  strokeWidth="1.2" 
                  strokeDasharray="3 3" 
                />

                <circle 
                  cx={activeStageInfo.x} 
                  cy="72" 
                  r="6" 
                  fill="#ffffff" 
                  stroke="#ff6900" 
                  strokeWidth="2.5" 
                  filter="url(#clientGlowOrange)" 
                  className="donut-halo-circle" 
                />
                <circle cx={activeStageInfo.x} cy="72" r="3" fill="#ff6900" />

                <g transform={`translate(${activeStageInfo.x - 35}, 8)`}>
                  <rect x="0" y="0" width="70" height="22" rx="11" fill="#18181b" />
                  <text x="35" y="15" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">
                    {activeStageInfo.velocityPct}% Appr.
                  </text>
                </g>

                <g transform={`translate(${activeStageInfo.x - 32}, 126)`}>
                  <rect x="0" y="0" width="64" height="22" rx="11" fill="#f4f3ef" stroke="#e5e3dc" strokeWidth="1" />
                  <text x="32" y="15" fill="#18181b" fontSize="10" fontWeight="700" textAnchor="middle">
                    {activeStageInfo.daysLeft}
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Interactive Milestone Stages Row */}
          <div className="revenue-months-row" onClick={(e) => e.stopPropagation()}>
            {(['Discovery', 'Tokens', 'Prototypes', 'Beta Staging', 'QA Review', 'Launch'] as const).map((stage) => (
              <button
                key={stage}
                type="button"
                className={`month-btn-item ${selectedStage === stage ? 'month-active' : ''}`}
                onMouseEnter={() => setHoveredStage(stage)}
                onMouseLeave={() => setHoveredStage(null)}
                onClick={() => {
                  setSelectedStage(stage);
                  showToast(`Selected Stage: ${stage} (${stageVelocityData[stage]?.velocityPct}% Complete)`);
                }}
              >
                {stage === 'Beta Staging' ? 'Beta Staging (Current)' : stage}
              </button>
            ))}
          </div>

          {/* Clean Aligned Stream Legend Bar */}
          <div className="stream-legend-bar" style={{ marginTop: '12px' }}>
            <div className="stream-legend-tag">
              <span className="tag-dot" style={{ backgroundColor: '#ea580c' }}></span>
              <span>Phase 1: Brand & Design System (100% Signed Off)</span>
            </div>
            <div className="stream-legend-tag">
              <span className="tag-dot" style={{ backgroundColor: '#fed7aa', border: '1px solid #fdba74' }}></span>
              <span>Phase 2: Prototypes & Tokens (85% Approved)</span>
            </div>
            <div className="stream-legend-tag">
              <span className="tag-dot" style={{ backgroundColor: '#38bdf8' }}></span>
              <span>Phase 3: Beta Staging (76% Velocity)</span>
            </div>
            <div className="stream-legend-tag" style={{ marginLeft: 'auto', color: '#16a34a', fontWeight: '800' }}>
              <span>✓ Target Velocity: {activeStageInfo.velocityPct}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ROW 2: (3 Columns of Equal Width - Sign-Off Gauge, Channels, Schedule)
          ===================================================================== */}
      <section className="noventra-row-2" aria-label="Approvals, Integrations, and Meetings">
        {/* CARD 1: Deliverable Sign-Off Rate (Radial Speedometer Gauge) */}
        <div 
          className="noventra-col-card"
          onClick={() => setActiveNav('deliverables')}
          role="button"
          tabIndex={0}
          style={{ position: 'relative' }}
        >
          <div className="col-card-header">
            <h3 className="col-card-title">Sign-Off Rate</h3>
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="metric-more-btn" 
                aria-label="Options"
                onClick={() => setActiveMenu(activeMenu === 'signoff' ? null : 'signoff')}
              >
                <MoreHorizontal style={{ width: '16px', height: '16px' }} />
              </button>
              {activeMenu === 'signoff' && (
                <div className="card-dropdown-menu">
                  <div className="card-dropdown-header">Sign-Off Milestones</div>
                  <button type="button" className="card-dropdown-item" onClick={() => { setGaugeCohort('sprint4'); setActiveMenu(null); }}>
                    <span>Sprint 4 (80%)</span>
                  </button>
                  <button type="button" className="card-dropdown-item" onClick={() => { setGaugeCohort('sprint3'); setActiveMenu(null); }}>
                    <span>Sprint 3 (100%)</span>
                  </button>
                  <button type="button" className="card-dropdown-item" onClick={() => { setGaugeCohort('overall'); setActiveMenu(null); }}>
                    <span>Overall Q4 (88%)</span>
                  </button>
                  <button type="button" className="card-dropdown-item" onClick={() => { showToast('Audit certificate downloaded.'); setActiveMenu(null); }}>
                    <Download style={{ width: '13px', height: '13px' }} />
                    <span>Download Sign-Off Audit</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="retention-metric-row">
            <span className="retention-pct">{currentSignOffPct}%</span>
            <span className="retention-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span className="tag-dot anim-pulse-green" style={{ width: '6px', height: '6px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span>
              +12% vs last sprint
            </span>
          </div>

          {/* Radial Segmented Speedometer Gauge with Generous 26px Spacing */}
          <div 
            className="gauge-wrapper"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = (e.clientX - rect.left) / rect.width;
              const sweptPct = Math.round(Math.max(10, Math.min(100, relX * 100)));
              setHoveredGaugePct(sweptPct);
            }}
            onMouseLeave={() => setHoveredGaugePct(null)}
          >
            <svg viewBox="0 0 240 140" className="gauge-svg">
              {Array.from({ length: 28 }).map((_, i) => {
                const startAngle = -135;
                const totalRange = 270;
                const angleDeg = startAngle + (i / 27) * totalRange;
                const angleRad = (angleDeg * Math.PI) / 180;
                
                const cx = 120;
                const cy = 110;
                const rInner = 50;
                const rOuter = 66;
                
                const x1 = cx + rInner * Math.cos(angleRad);
                const y1 = cy + rInner * Math.sin(angleRad);
                const x2 = cx + rOuter * Math.cos(angleRad);
                const y2 = cy + rOuter * Math.sin(angleRad);

                const isFilled = (i / 27) <= (currentSignOffPct / 100);

                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isFilled ? '#ff6900' : '#ede8df'}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Perimeter Numbers placed at Radius ~92px */}
              <text x="24" y="118" fill="#57534e" fontSize="11" fontWeight="700" textAnchor="middle">0%</text>
              <text x="28" y="55" fill="#57534e" fontSize="11" fontWeight="700" textAnchor="middle">25%</text>
              <text x="120" y="20" fill="#57534e" fontSize="11" fontWeight="700" textAnchor="middle">50%</text>
              <text x="212" y="55" fill="#ff6900" fontSize="11.5" fontWeight="800" textAnchor="middle">75%</text>
              <text x="216" y="118" fill="#16a34a" fontSize="11" fontWeight="800" textAnchor="middle">100%</text>

              {/* Center Pivot and Needle dynamically rotated */}
              <circle cx="120" cy="110" r="5" fill="#18181b" className="gauge-pivot" />
              <line
                className="gauge-needle"
                x1="120"
                y1="110"
                x2={120 + 52 * Math.cos((currentSignOffAngle * Math.PI) / 180)}
                y2={110 + 52 * Math.sin((currentSignOffAngle * Math.PI) / 180)}
                stroke="#18181b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Interactive Cohort Selector Buttons */}
          <div className="gauge-cohort-selector" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={`gauge-cohort-btn ${gaugeCohort === 'sprint4' ? 'active' : ''}`}
              onClick={() => { setGaugeCohort('sprint4'); showToast('Sprint 4: 80% (16/20 approved)'); }}
            >
              Sprint 4 (80%)
            </button>
            <button
              type="button"
              className={`gauge-cohort-btn ${gaugeCohort === 'sprint3' ? 'active' : ''}`}
              onClick={() => { setGaugeCohort('sprint3'); showToast('Sprint 3: 100% (18/18 approved)'); }}
            >
              Sprint 3 (100%)
            </button>
            <button
              type="button"
              className={`gauge-cohort-btn ${gaugeCohort === 'overall' ? 'active' : ''}`}
              onClick={() => { setGaugeCohort('overall'); showToast('Overall Q4: 88% approved'); }}
            >
              All Q4 (88%)
            </button>
          </div>

          {/* Explicit Speedometer Benchmarks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', padding: '6px 10px', backgroundColor: '#faf9f6', borderRadius: '8px', fontSize: '11px', border: '1px solid #eae7df' }}>
            <span style={{ color: '#78716c' }}>Floor: <strong>0%</strong></span>
            <span style={{ color: '#ea580c', fontWeight: '700' }}>● Current: {signOffCohortData.status}</span>
            <span style={{ color: '#16a34a', fontWeight: '700' }}>Target: <strong>90%</strong></span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#78716c', textAlign: 'center' }}>
            {signOffCohortData.sub}
          </p>
        </div>

        {/* CARD 2: Connected Ecosystem Bridges (Donut Chart) */}
        <div 
          className="noventra-col-card"
          onClick={() => setActiveNav('channels')}
          role="button"
          tabIndex={0}
          style={{ position: 'relative' }}
        >
          <div className="col-card-header">
            <h3 className="col-card-title">Connected Channels</h3>
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <div 
                className="leads-dropdown-pill" 
                onClick={() => setChannelDropdownOpen(prev => !prev)}
              >
                <span>{channelFilter}</span>
                <ChevronDown style={{ width: '13px', height: '13px', color: '#78716c' }} />
              </div>

              {channelDropdownOpen && (
                <div className="card-dropdown-menu" style={{ width: '220px', right: 0 }}>
                  <div className="card-dropdown-header">Ecosystem Bridges</div>
                  {['5 Active Bridges', 'Cloud Storage (Drive)', 'Instant Comms (Slack)', 'Executive VIP (WhatsApp)'].map((opt) => (
                    <div 
                      key={opt}
                      className={`card-dropdown-item ${channelFilter === opt ? 'selected' : ''}`}
                      onClick={() => {
                        setChannelFilter(opt);
                        setChannelDropdownOpen(false);
                        showToast(`Filtered bridges to: ${opt}`);
                      }}
                    >
                      <span>{opt}</span>
                      {channelFilter === opt && <Check style={{ width: '13px', height: '13px', color: '#ff6900', marginLeft: 'auto' }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clean Donut Chart - No Messy Wire Callouts */}
          <div className="donut-chart-container" onClick={(e) => e.stopPropagation()}>
            <svg viewBox="0 0 320 180" className="donut-svg">
              <circle cx="160" cy="90" r="50" fill="none" stroke="#f4f3ef" strokeWidth="18" />

              {/* Animated Glowing Outer Ring */}
              <circle 
                cx="160" 
                cy="90" 
                r="60" 
                fill="none" 
                stroke={channelCenterColor} 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
                className="donut-halo-circle" 
              />

              {/* Segment 1: Drive (Orange ~40%) */}
              <circle
                className="donut-segment"
                cx="160"
                cy="90"
                r="50"
                fill="none"
                stroke="#ff6900"
                strokeWidth={hoveredChannelSegment === 'drive' ? 24 : 18}
                strokeDasharray="125 314"
                strokeDashoffset="78"
                strokeLinecap="round"
                onMouseEnter={() => setHoveredChannelSegment('drive')}
                onMouseLeave={() => setHoveredChannelSegment(null)}
              />

              {/* Segment 2: Slack (Blue ~32%) */}
              <circle
                className="donut-segment"
                cx="160"
                cy="90"
                r="50"
                fill="none"
                stroke="#38bdf8"
                strokeWidth={hoveredChannelSegment === 'slack' ? 24 : 18}
                strokeDasharray="100 314"
                strokeDashoffset="-50"
                strokeLinecap="round"
                onMouseEnter={() => setHoveredChannelSegment('slack')}
                onMouseLeave={() => setHoveredChannelSegment(null)}
              />

              {/* Segment 3: WhatsApp/Telegram (Green ~28%) */}
              <circle
                className="donut-segment"
                cx="160"
                cy="90"
                r="50"
                fill="none"
                stroke="#10b981"
                strokeWidth={hoveredChannelSegment === 'whatsapp' ? 24 : 18}
                strokeDasharray="89 314"
                strokeDashoffset="-155"
                strokeLinecap="round"
                onMouseEnter={() => setHoveredChannelSegment('whatsapp')}
                onMouseLeave={() => setHoveredChannelSegment(null)}
              />

              {/* Dynamic Center Cutout */}
              <text x="160" y="82" fill="#18181b" fontSize="20" fontWeight="800" textAnchor="middle">
                {channelCenterTitle}
              </text>
              <text x="160" y="98" fill="#78716c" fontSize="10.5" fontWeight="600" textAnchor="middle">
                {channelCenterSubtitle}
              </text>
              <text x="160" y="112" fill={channelCenterColor} fontSize="10" fontWeight="700" textAnchor="middle">
                {channelCenterRate}
              </text>
            </svg>
          </div>

          {/* Aligned 3-Card Channel Metrics Grid */}
          <div className="donut-channels-grid" onClick={(e) => e.stopPropagation()}>
            <div 
              className={`donut-channel-card ${hoveredChannelSegment === 'drive' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredChannelSegment('drive')}
              onMouseLeave={() => setHoveredChannelSegment(null)}
              onClick={() => handleChannelClick('drive')}
            >
              <div className="donut-card-top">
                <span className="tag-dot anim-pulse-orange" style={{ backgroundColor: '#ff6900' }}></span>
                <span>Drive</span>
              </div>
              <span className="donut-card-val">1.4 GB</span>
              <span className="donut-card-sub">18 Files Synced</span>
            </div>

            <div 
              className={`donut-channel-card ${hoveredChannelSegment === 'slack' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredChannelSegment('slack')}
              onMouseLeave={() => setHoveredChannelSegment(null)}
              onClick={() => handleChannelClick('slack')}
            >
              <div className="donut-card-top">
                <span className="tag-dot anim-pulse-blue" style={{ backgroundColor: '#38bdf8' }}></span>
                <span>Slack</span>
              </div>
              <span className="donut-card-val">Live #hq</span>
              <span className="donut-card-sub">2-Way Sync</span>
            </div>

            <div 
              className={`donut-channel-card ${hoveredChannelSegment === 'whatsapp' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredChannelSegment('whatsapp')}
              onMouseLeave={() => setHoveredChannelSegment(null)}
              onClick={() => handleChannelClick('whatsapp')}
            >
              <div className="donut-card-top">
                <span className="tag-dot anim-pulse-green" style={{ backgroundColor: '#10b981' }}></span>
                <span>WhatsApp</span>
              </div>
              <span className="donut-card-val">VIP 24/7</span>
              <span className="donut-card-sub">Priority Line</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Upcoming Milestones & Executive Calls (Schedule) */}
        <div 
          className="noventra-col-card"
          onClick={() => openModal('meeting')}
          role="button"
          tabIndex={0}
          style={{ position: 'relative' }}
        >
          <div className="col-card-header">
            <h3 className="col-card-title">Upcoming Schedule</h3>
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="metric-more-btn" 
                aria-label="Options"
                onClick={() => setActiveMenu(activeMenu === 'schedule' ? null : 'schedule')}
              >
                <MoreHorizontal style={{ width: '16px', height: '16px' }} />
              </button>
              {activeMenu === 'schedule' && (
                <div className="card-dropdown-menu">
                  <div className="card-dropdown-header">Schedule Actions</div>
                  <button type="button" className="card-dropdown-item" onClick={() => { openModal('meeting'); setActiveMenu(null); }}>
                    <Plus style={{ width: '13px', height: '13px' }} />
                    <span>Request Director Call</span>
                  </button>
                  <button type="button" className="card-dropdown-item" onClick={() => { showToast('Syncing with Google Calendar...'); setActiveMenu(null); }}>
                    <Calendar style={{ width: '13px', height: '13px' }} />
                    <span>Sync Google Calendar</span>
                  </button>
                  <button type="button" className="card-dropdown-item" onClick={() => { showToast('Meet link copied to clipboard.'); setActiveMenu(null); }}>
                    <ExternalLink style={{ width: '13px', height: '13px' }} />
                    <span>Copy Google Meet Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mini-calendar-widget" onClick={(e) => e.stopPropagation()}>
            <div className="calendar-nav-row">
              <button 
                type="button" 
                className="cal-arrow-btn"
                onClick={() => showToast('Previous week agenda')}
              >
                <ChevronLeft style={{ width: '14px', height: '14px' }} />
              </button>
              <span className="calendar-month-label">February 2026</span>
              <button 
                type="button" 
                className="cal-arrow-btn"
                onClick={() => showToast('Next week agenda')}
              >
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>

            <div className="calendar-days-row">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            <div className="calendar-dates-row">
              {[10, 11, 12, 13, 14, 15, 16].map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`calendar-date-pill ${activeCalendarDay === day ? 'active-orange' : ''}`}
                  onClick={() => {
                    setActiveCalendarDay(day);
                    showToast(`Loaded agenda for Feb ${day}, 2026`);
                  }}
                  title={`Feb ${day}: ${calendarMeetings[day]?.title || 'Meeting'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div 
            className="calendar-event-box" 
            onClick={(e) => { e.stopPropagation(); openModal('meeting'); }}
            title="Click to view full meeting details & room link"
          >
            <div className="event-top-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="tag-dot anim-pulse-green" style={{ width: '8px', height: '8px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span>
                <span className="event-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                  {activeMeeting.title}
                </span>
              </div>
              <span className="event-time">{activeMeeting.time.split(' - ')[0]}</span>
            </div>
            <div className="event-bottom-row">
              <div className="event-avatars-cluster">
                {activeMeeting.avatars.map((av, idx) => (
                  <img key={idx} src={av} alt="Attendee" className="avatar-cluster-item" />
                ))}
                <span className="avatar-cluster-badge">+{activeMeeting.attendees - activeMeeting.avatars.length}</span>
              </div>
              <span className="event-meet-link" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                🔔 Reminder Active
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ROW 3: (Full-Width Deliverables & Approvals Queue Table Card)
          ===================================================================== */}
      <section className="noventra-row-3" aria-label="Deliverables & Approvals Tracker">
        <div className="noventra-table-card">
          <div className="table-card-header">
            <div>
              <h3 className="table-card-title">Deliverables & Approvals Queue</h3>
              <span style={{ fontSize: '12px', color: '#78716c' }}>
                Review assets, provide director feedback, and sign off for production release
              </span>
            </div>
            <div className="table-header-controls">
              <div className="table-search-pill">
                <input 
                  type="text" 
                  placeholder="Search deliverables..." 
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                />
                <Search style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
              </div>

              {/* Status Filter Dropdown */}
              <div style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  className={`table-filter-btn ${tableFilterOpen ? 'active' : ''}`}
                  onClick={() => setTableFilterOpen(prev => !prev)}
                >
                  <span>{tableStatusFilter === 'All' ? 'Filter' : tableStatusFilter}</span>
                  <Filter style={{ width: '14px', height: '14px' }} />
                </button>

                {tableFilterOpen && (
                  <div className="card-dropdown-menu" style={{ width: '180px', right: 0 }}>
                    <div className="card-dropdown-header">Filter by Status</div>
                    {['All', 'approved', 'pending'].map((opt) => (
                      <div 
                        key={opt}
                        className={`card-dropdown-item ${tableStatusFilter === opt ? 'selected' : ''}`}
                        onClick={() => {
                          setTableStatusFilter(opt);
                          setTableFilterOpen(false);
                          showToast(`Filtering deliverables: ${opt === 'All' ? 'All' : opt.toUpperCase()}`);
                        }}
                      >
                        <span>{opt === 'All' ? 'All Deliverables' : opt === 'approved' ? 'Approved Only' : 'Pending Review'}</span>
                        {tableStatusFilter === opt && <Check style={{ width: '13px', height: '13px', color: '#ff6900', marginLeft: 'auto' }} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="table-scroll-wrapper">
            <table className="lead-tracker-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      className="custom-checkbox"
                      checked={selectedItems.length === displayDeliverables.length && displayDeliverables.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>
                    <div className="th-sort-wrapper">
                      <span>Deliverable Name</span>
                      <span className="sort-arrows">⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-sort-wrapper">
                      <span>Version</span>
                      <span className="sort-arrows">⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-sort-wrapper">
                      <span>Submitted By</span>
                      <span className="sort-arrows">⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-sort-wrapper">
                      <span>Status</span>
                      <span className="sort-arrows">⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-sort-wrapper">
                      <span>Date</span>
                      <span className="sort-arrows">⇅</span>
                    </div>
                  </th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayDeliverables.map((del) => {
                  const isSelected = selectedItems.includes(del.id);
                  const isPending = del.status === 'pending';

                  return (
                    <tr 
                      key={del.id} 
                      className={isSelected ? 'row-selected' : ''}
                      onClick={() => setActiveNav('deliverables')}
                      style={{ cursor: 'pointer' }}
                    >
                      <td onClick={(e) => { e.stopPropagation(); toggleItemSelection(del.id); }}>
                        <input 
                          type="checkbox" 
                          className="custom-checkbox"
                          checked={isSelected}
                          onChange={() => toggleItemSelection(del.id)}
                        />
                      </td>
                      <td>
                        <div className="lead-name-cell">
                          <span className="company-logo-badge" style={{ backgroundColor: '#fff4ea', color: '#ea580c' }}>
                            <FileCheck style={{ width: '13px', height: '13px' }} />
                          </span>
                          <span className="lead-name-text">{del.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="file-type-pill" style={{ fontWeight: 700 }}>{del.version}</span>
                      </td>
                      <td>
                        <span style={{ color: '#44403c', fontWeight: 600 }}>{del.submittedBy}</span>
                      </td>
                      <td>
                        <span className={`noventra-status-pill ${del.status === 'approved' ? 'status-green' : 'status-orange'}`}>
                          ● {del.status === 'approved' ? 'Approved' : 'Pending Review'}
                        </span>
                      </td>
                      <td className="lead-date-cell">{del.date}</td>
                      <td style={{ textAlign: 'right', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          {isPending ? (
                            <button 
                              type="button" 
                              className="noventra-orange-btn"
                              style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-flex' }}
                              onClick={() => approveDeliverable(del.id)}
                            >
                              <Check style={{ width: '13px', height: '13px' }} />
                              <span>Approve</span>
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              className="noventra-outline-btn"
                              style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-flex' }}
                              onClick={() => showToast(`Downloading signed release: ${del.name}...`)}
                            >
                              <Download style={{ width: '13px', height: '13px' }} />
                              <span>Download ↗</span>
                            </button>
                          )}

                          <button 
                            type="button" 
                            className="row-action-btn"
                            aria-label="Options"
                            onClick={() => setActiveRowMenu(activeRowMenu === del.id ? null : del.id)}
                          >
                            <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>

                        {activeRowMenu === del.id && (
                          <div className="card-dropdown-menu" style={{ width: '180px', right: 0, top: '80%' }}>
                            <div className="card-dropdown-header">Deliverable Actions</div>
                            <button 
                              type="button" 
                              className="card-dropdown-item"
                              onClick={() => { setActiveNav('deliverables'); setActiveRowMenu(null); }}
                            >
                              <FileText style={{ width: '13px', height: '13px' }} />
                              <span>Inspect Specs</span>
                            </button>
                            <button 
                              type="button" 
                              className="card-dropdown-item"
                              onClick={() => { openModal('feedback'); setActiveRowMenu(null); }}
                            >
                              <MessageSquare style={{ width: '13px', height: '13px' }} />
                              <span>Send Feedback</span>
                            </button>
                            <button 
                              type="button" 
                              className="card-dropdown-item"
                              onClick={() => { showToast(`Deliverable shared with Arc team.`); setActiveRowMenu(null); }}
                            >
                              <ExternalLink style={{ width: '13px', height: '13px' }} />
                              <span>Share Link</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

