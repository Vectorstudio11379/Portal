import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  ArrowUpRight, 
  MoreHorizontal, 
  CreditCard, 
  Clock, 
  Users,
  SlidersHorizontal, 
  MessageSquare, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Check,
  Plus,
  Sparkles,
  Video,
  Layers,
  CheckSquare,
  Settings,
  Download,
  Calendar,
  FileText,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  FilePlus,
  X
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import { TimelineBoard } from './TimelineBoard';
import { ProposalBuilder } from './ProposalBuilder';
import { TaskTracker } from './TaskTracker';
import { RetainerTracker } from './RetainerTracker';
import { AdminSettings } from './AdminSettings';
import { InvoicesLedger } from './InvoicesLedger';
import { CustomersCRM } from './CustomersCRM';
import { MeetingsCalendar } from './MeetingsCalendar';
import { RevenueAnalytics } from './RevenueAnalytics';
import { MessagesCenter } from './MessagesCenter';

export const AdminDashboard: React.FC = () => {
  const { state, setRole, setActiveNav, toggleTask, openModal, showToast, openAIAssistant } = useAgency();
  const { admin, activeNav, searchQuery } = state;
  const [tableSearch, setTableSearch] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [activeCalendarDay, setActiveCalendarDay] = useState(13);

  // Dropdown & Popover States for Interactive Menus
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [streamFilterOpen, setStreamFilterOpen] = useState(false);
  const [streamNotesOpen, setStreamNotesOpen] = useState(false);
  const [streamLayers, setStreamLayers] = useState({ retainers: true, sows: true, target: true });
  const [selectedMonth, setSelectedMonth] = useState<'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun'>('Apr');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Speedometer Gauge States
  const [gaugeCohort, setGaugeCohort] = useState<'90d' | 'enterprise' | 'annual'>('90d');
  const [hoveredGaugePct, setHoveredGaugePct] = useState<number | null>(null);

  // Donut Chart States
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState<'referrals' | 'inbound' | 'outreach' | null>(null);
  const [pipelineDropdownOpen, setPipelineDropdownOpen] = useState(false);
  const [pipelineFilter, setPipelineFilter] = useState('Active Pipeline');

  // Table Filter States
  const [tableFilterOpen, setTableFilterOpen] = useState(false);
  const [tableStatusFilter, setTableStatusFilter] = useState('All');
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);

  // Global click outside to close popovers
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenu(null);
      setStreamFilterOpen(false);
      setStreamNotesOpen(false);
      setPipelineDropdownOpen(false);
      setTableFilterOpen(false);
      setActiveRowMenu(null);
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Meetings schedule mapping for calendar days 10 to 16
  const calendarMeetings: Record<number, { title: string; time: string; platform: string; attendees: number; avatars: string[] }> = {
    10: { title: 'Arc Brand Guidelines Handover', time: '2:00 pm - 3:30 pm', platform: 'Google Meet', attendees: 5, avatars: ['/assets/images/owais.jpg', '/assets/images/sarah.jpg'] },
    11: { title: 'Sprint 4 Architecture Sync', time: '11:00 am - 12:00 pm', platform: 'Zoom Video', attendees: 4, avatars: ['/assets/images/owais.jpg', '/assets/images/carlos.jpg'] },
    12: { title: 'Nexus Labs Contract Review', time: '4:00 pm - 4:45 pm', platform: 'Google Meet', attendees: 3, avatars: ['/assets/images/owais.jpg', '/assets/images/liam.jpg'] },
    13: { title: 'Mesh Weekly Meeting & Client Alignment', time: '10:00 am - 12:00 pm', platform: 'Google Meet', attendees: 11, avatars: ['/assets/images/owais.jpg', '/assets/images/carlos.jpg', '/assets/images/liam.jpg'] },
    14: { title: 'Vanguard Staging QA Demo', time: '1:00 pm - 2:00 pm', platform: 'Zoom Video', attendees: 6, avatars: ['/assets/images/owais.jpg', '/assets/images/sarah.jpg'] },
    15: { title: 'Executive Retainer Retrospective', time: '3:00 pm - 4:00 pm', platform: 'Google Meet', attendees: 4, avatars: ['/assets/images/owais.jpg', '/assets/images/carlos.jpg'] },
    16: { title: 'VectorStudio Weekly All-Hands', time: '9:30 am - 10:30 am', platform: 'Studio HQ', attendees: 14, avatars: ['/assets/images/owais.jpg', '/assets/images/sarah.jpg', '/assets/images/liam.jpg'] },
  };

  // Monthly revenue breakdown for interactive streamgraph
  const monthlyRevenueData: Record<string, { total: number; retainer: number; sows: number; targetPct: number; benchmark: string; note: string; x: number }> = {
    'Jan': { total: 41200, retainer: 33000, sows: 8200, targetPct: 75, benchmark: '75% Met', note: 'Q1 Launch & contract rollouts across enterprise tier.', x: 45 },
    'Feb': { total: 43500, retainer: 34800, sows: 8700, targetPct: 79, benchmark: '79% Met', note: 'New retainers onboarded (Lumina, Nexus Labs).', x: 145 },
    'Mar': { total: 45800, retainer: 36500, sows: 9300, targetPct: 83, benchmark: '83% Met', note: 'Sprint delivery surge in Q1 close with zero churn.', x: 260 },
    'Apr': { total: 48250, retainer: 38500, sows: 9750, targetPct: 88, benchmark: '82% Target Met', note: 'Active milestone with +24% YoY surge in retainer revenue.', x: 380 },
    'May': { total: 51600, retainer: 40000, sows: 11600, targetPct: 94, benchmark: 'Projected 94%', note: 'Upcoming expansion sprint for Arc Company staging release.', x: 455 },
    'Jun': { total: 54900, retainer: 42500, sows: 12400, targetPct: 100, benchmark: 'Projected 100%', note: 'Target ceiling ($55.0K Max) projected achievable on time.', x: 510 },
  };

  const filteredTasks = admin.tasks.filter(t => 
    !searchQuery || 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSprints = admin.sprints.filter(s =>
    !searchQuery ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = admin.invoices.filter(i =>
    !searchQuery ||
    i.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayLeads = admin.leads.filter(l => {
    const matchesSearch = !tableSearch ||
      l.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      l.company.toLowerCase().includes(tableSearch.toLowerCase()) ||
      l.status.toLowerCase().includes(tableSearch.toLowerCase());
    
    const matchesStatus = tableStatusFilter === 'All' || l.status === tableStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleLeadSelection = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === displayLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(displayLeads.map(l => l.id));
    }
  };

  // =========================================================================
  // DEDICATED FULL PAGE WORKSPACES FOR ALL NAV ITEMS
  // =========================================================================
  if (activeNav === 'timeline') {
    return <TimelineBoard onBack={() => setActiveNav('overview')} />;
  }

  if (activeNav === 'proposals') {
    return <ProposalBuilder onBack={() => setActiveNav('overview')} />;
  }

  if (activeNav === 'tasks') {
    return <TaskTracker onBack={() => setActiveNav('overview')} />;
  }

  if (activeNav === 'retainers') {
    return <RetainerTracker onBack={() => setActiveNav('overview')} />;
  }

  if (activeNav === 'settings' || activeNav.startsWith('settings-')) {
    return <AdminSettings onBack={() => setActiveNav('overview')} initialSubTab={activeNav} />;
  }

  if (activeNav === 'invoices') {
    return <InvoicesLedger onBack={() => setActiveNav('overview')} />;
  }

  if (activeNav === 'clients') {
    return <CustomersCRM onBack={() => setActiveNav('overview')} />;
  }

  if (activeNav === 'meetings') {
    return <MeetingsCalendar onBack={() => setActiveNav('overview')} />;
  }

  if (activeNav === 'revenue') {
    return <RevenueAnalytics onBack={() => setActiveNav('overview')} />;
  }

  if (activeNav === 'messages') {
    return <MessagesCenter onBack={() => setActiveNav('overview')} />;
  }

  // =========================================================================
  // FULL PAGE VIEW WHEN OTHER CARDS ARE CLICKED
  // =========================================================================
  if (activeNav !== 'overview') {
    let pageTitle = 'Section Workspace';
    if (activeNav === 'revenue') pageTitle = 'Revenue & Financial Analytics';
    if (activeNav === 'invoices') pageTitle = 'Invoices, Savings & Expenses';
    if (activeNav === 'clients') pageTitle = 'Customers & Leads CRM';
    if (activeNav === 'meetings') pageTitle = 'Schedule & Strategy Meetings';

    return (
      <div className="noventra-view-container">
        {/* Full Page Navigation Header */}
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
              <span>Platform Overview</span>
              <span>/</span>
              <span className="noventra-breadcrumb-active">{pageTitle}</span>
            </div>
          </div>

          <div className="noventra-banner-row">
            <div>
              <h1 className="noventra-banner-title">{pageTitle}</h1>
              <p className="noventra-banner-sub">
                Complete operational workspace with live controls, detailed reporting, and executive actions.
              </p>
            </div>
            <div className="noventra-banner-actions">
              {activeNav === 'invoices' && (
                <button 
                  type="button" 
                  className="noventra-orange-btn"
                  onClick={() => openModal('invoice')}
                >
                  <Plus style={{ width: '15px', height: '15px' }} />
                  <span>Create Invoice</span>
                </button>
              )}
              {activeNav === 'tasks' && (
                <button 
                  type="button" 
                  className="noventra-orange-btn"
                  onClick={() => openModal('task')}
                >
                  <Plus style={{ width: '15px', height: '15px' }} />
                  <span>Add Task</span>
                </button>
              )}
              {activeNav === 'proposals' && (
                <button 
                  type="button" 
                  className="noventra-orange-btn"
                  onClick={() => openModal('proposal')}
                >
                  <Sparkles style={{ width: '15px', height: '15px' }} />
                  <span>Build Proposal</span>
                </button>
              )}
              {activeNav === 'meetings' && (
                <button 
                  type="button" 
                  className="noventra-orange-btn"
                  onClick={() => openModal('meeting')}
                >
                  <Video style={{ width: '15px', height: '15px' }} />
                  <span>Schedule Meeting</span>
                </button>
              )}
              <button 
                type="button" 
                className="noventra-outline-btn"
                onClick={() => setRole('client')}
              >
                <span>Preview Client Portal ↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* FULL PAGE 1: REVENUE & FINANCIAL ANALYTICS */}
        {activeNav === 'revenue' && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Revenue & Retainer Performance</h2>
                <span className="noventra-card-subtitle">Monthly recurring revenue, target projections, and historical stream</span>
              </div>
              <button 
                type="button" 
                className="noventra-orange-btn"
                onClick={() => openModal('invoice')}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                <span>Issue New Billing</span>
              </button>
            </div>

            <div className="noventra-stat-grid-3">
              <div className="noventra-stat-box">
                <span className="stat-label">Total Year-to-Date Revenue</span>
                <span className="stat-val">$241,600</span>
                <span className="stat-trend green">▲ +24.8% vs last year</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Monthly Run-rate (MRR)</span>
                <span className="stat-val">$48,250</span>
                <span className="stat-trend green">▲ 9 active client retainers</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Average Contract Value</span>
                <span className="stat-val">$18,400</span>
                <span className="stat-trend orange">● 92% retention rate</span>
              </div>
            </div>

            <div className="noventra-table-container" style={{ marginTop: '24px' }}>
              <table className="noventra-table">
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Client Account</th>
                    <th>Billing Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {admin.invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 700 }}>{inv.num}</td>
                      <td>{inv.client}</td>
                      <td>{inv.desc}</td>
                      <td style={{ fontWeight: 700 }}>${inv.amount.toLocaleString()}</td>
                      <td>
                        <span className={`noventra-status-pill ${inv.status === 'paid' ? 'status-green' : 'status-orange'}`}>
                          ● {inv.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FULL PAGE 2: PROJECTS & TIMELINE BOARD */}
        {activeNav === 'timeline' && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Project Timeline Board & Sprints</h2>
                <span className="noventra-card-subtitle">Live delivery stages, milestone sprint roadmaps, and client approvals</span>
              </div>
            </div>

            <div className="sprint-pipeline-grid">
              {filteredSprints.map((sprint) => (
                <div key={sprint.id} className="sprint-pipeline-card">
                  <div className="sprint-header">
                    <span className="sprint-client-tag">{sprint.client}</span>
                    <span className={`noventra-status-pill ${sprint.status === 'Completed' ? 'status-green' : 'status-orange'}`}>
                      {sprint.status}
                    </span>
                  </div>
                  <h3 className="sprint-name">{sprint.name}</h3>
                  <div className="sprint-progress-bar-container">
                    <div className="sprint-progress-bar-fill" style={{ width: `${sprint.progress}%` }}></div>
                  </div>
                  <div className="sprint-footer">
                    <span className="sprint-progress-text">{sprint.progress}% complete</span>
                    <span className="sprint-date">{sprint.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FULL PAGE 3: RETENTION & CLIENT HEALTH */}
        {activeNav === 'retainers' && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Retention Rate & Account Health</h2>
                <span className="noventra-card-subtitle">Active VIP client contracts, allocation burn rate, and satisfaction</span>
              </div>
            </div>

            <div className="noventra-stat-grid-3">
              <div className="noventra-stat-box">
                <span className="stat-label">Net Retention Rate</span>
                <span className="stat-val">65%</span>
                <span className="stat-trend green">▲ +18% vs last month</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Total Retainer Hours</span>
                <span className="stat-val">{admin.retainerHoursLogged} / {admin.retainerHoursTotal} hrs</span>
                <span className="stat-trend green">● 78.8% burn rate (On Track)</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Client Health Score</span>
                <span className="stat-val">9.4 / 10</span>
                <span className="stat-trend green">● Zero churn risk</span>
              </div>
            </div>

            <div className="retainers-detail-grid" style={{ marginTop: '24px' }}>
              {admin.retainers.map((ret) => (
                <div key={ret.id} className="retainer-account-card">
                  <div className="retainer-card-top">
                    <div>
                      <h4 className="retainer-client-name">{ret.client}</h4>
                      <span className="retainer-tier-label">{ret.tier}</span>
                    </div>
                    <span className="retainer-hours-badge">{ret.used} / {ret.total} hrs</span>
                  </div>
                  <div className="sprint-progress-bar-container" style={{ margin: '14px 0 8px 0' }}>
                    <div 
                      className="sprint-progress-bar-fill" 
                      style={{ 
                        width: `${Math.round((ret.used / ret.total) * 100)}%`,
                        backgroundColor: ret.status === 'warning' ? '#ea580c' : '#10b981'
                      }}
                    ></div>
                  </div>
                  <div className="flex-between" style={{ fontSize: '12px', color: '#78716c' }}>
                    <span>Allocation utilization</span>
                    <span style={{ fontWeight: 700, color: '#1c1917' }}>{Math.round((ret.used / ret.total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FULL PAGE 4: INVOICES & FINANCIALS */}
        {activeNav === 'invoices' && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Invoices, Savings & Expenses Ledger</h2>
                <span className="noventra-card-subtitle">Audited financial registry, incoming payouts, and expense management</span>
              </div>
              <button 
                type="button" 
                className="noventra-orange-btn"
                onClick={() => openModal('invoice')}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                <span>Create Invoice</span>
              </button>
            </div>

            <div className="noventra-stat-grid-4">
              <div className="noventra-stat-box">
                <span className="stat-label">Current Balance</span>
                <span className="stat-val">$18.4K</span>
                <span className="stat-trend green">▲ +3.2% vs last week</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Total Savings</span>
                <span className="stat-val">$42.8K</span>
                <span className="stat-trend green">▲ +6.5% vs growth</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Total Income</span>
                <span className="stat-val">$75.3K</span>
                <span className="stat-trend green">▲ +11.4% this month</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Total Expenses</span>
                <span className="stat-val">$28.9K</span>
                <span className="stat-trend red">▼ -4.1% reduction</span>
              </div>
            </div>

            <div className="noventra-table-container" style={{ marginTop: '24px' }}>
              <table className="noventra-table">
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Client</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 700 }}>{inv.num}</td>
                      <td>{inv.client}</td>
                      <td>{inv.desc}</td>
                      <td style={{ fontWeight: 700 }}>${inv.amount.toLocaleString()}</td>
                      <td>
                        <span className={`noventra-status-pill ${inv.status === 'paid' ? 'status-green' : 'status-orange'}`}>
                          ● {inv.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button type="button" className="table-action-link" onClick={() => openModal('invoice')}>
                          View PDF ↗
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FULL PAGE 5: TASK TRACKER */}
        {activeNav === 'tasks' && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Delivery Task Tracker</h2>
                <span className="noventra-card-subtitle">Real-time team deliverables, QA checklists, and client handoffs</span>
              </div>
              <button 
                type="button" 
                className="noventra-orange-btn"
                onClick={() => openModal('task')}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                <span>Add Task</span>
              </button>
            </div>

            <div className="tasks-grid-list">
              {filteredTasks.map((t) => (
                <div 
                  key={t.id} 
                  className={`task-row-card ${t.done ? 'task-done' : ''}`}
                  onClick={() => toggleTask(t.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`task-checkbox-round ${t.done ? 'checked' : ''}`}>
                    {t.done && <Check style={{ width: '14px', height: '14px', color: '#ffffff' }} />}
                  </div>
                  <div className="task-content">
                    <span className="task-title-text">{t.title}</span>
                    <span className="task-client-sub">{t.client}</span>
                  </div>
                  <div className="task-meta">
                    <span className={`task-priority-tag priority-${t.priority.toLowerCase()}`}>
                      {t.priority}
                    </span>
                    <div className="task-assignee">
                      <img src={t.avatar} alt={t.assignee} className="task-assignee-avatar" />
                      <span>{t.assignee}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FULL PAGE 6: CLIENTS & LEADS CRM */}
        {activeNav === 'clients' && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Customers & Lead Pipeline CRM</h2>
                <span className="noventra-card-subtitle">Active agency accounts, leads pipeline, and deal conversions</span>
              </div>
              <button 
                type="button" 
                className="noventra-orange-btn"
                onClick={() => openModal('proposal')}
              >
                <Sparkles style={{ width: '14px', height: '14px' }} />
                <span>New Lead Proposal</span>
              </button>
            </div>

            <div className="noventra-stat-grid-3">
              <div className="noventra-stat-box">
                <span className="stat-label">Total Active Pipeline</span>
                <span className="stat-val">48%</span>
                <span className="stat-trend green">● 14 Active Accounts</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Desktop Leads</span>
                <span className="stat-val">40.1%</span>
                <span className="stat-trend orange">● Primary Conversion Channel</span>
              </div>
              <div className="noventra-stat-box">
                <span className="stat-label">Mobile & Laptop</span>
                <span className="stat-val">56.8%</span>
                <span className="stat-trend green">▲ Growing +12% MoM</span>
              </div>
            </div>

            <div className="noventra-table-container" style={{ marginTop: '24px' }}>
              <table className="noventra-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Company</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Contacted</th>
                    <th>Follow-Up</th>
                  </tr>
                </thead>
                <tbody>
                  {admin.leads.map((l) => (
                    <tr key={l.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={l.avatar} alt={l.name} className="lead-table-avatar" />
                        <span style={{ fontWeight: 700 }}>{l.name}</span>
                      </td>
                      <td>{l.company}</td>
                      <td>{l.phone}</td>
                      <td>
                        <span className="noventra-status-pill status-green">● {l.status}</span>
                      </td>
                      <td>{l.contactedDate}</td>
                      <td>{l.followUpDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FULL PAGE 7: MEETINGS & CALENDARS */}
        {activeNav === 'meetings' && (
          <div className="noventra-card">
            <div className="noventra-card-title-row">
              <div>
                <h2 className="noventra-card-heading">Schedule, Calendars & Executive Syncs</h2>
                <span className="noventra-card-subtitle">Quarterly client review calls, design presentations, and strategy sessions</span>
              </div>
              <button 
                type="button" 
                className="noventra-orange-btn"
                onClick={() => openModal('meeting')}
              >
                <Video style={{ width: '14px', height: '14px' }} />
                <span>Launch Video Room</span>
              </button>
            </div>

            <div className="meeting-banner-highlight">
              <div className="meeting-pulse-badge">
                <span className="pulse-dot"></span> UPCOMING TODAY
              </div>
              <h3 className="meeting-highlight-title">Mesh Weekly Meeting & Client Alignment</h3>
              <p className="meeting-highlight-desc">
                Review of brand guideline deliverables, sprint roadmap handoff, and staging server demonstration with Google Meet encrypted video room.
              </p>
              <div className="meeting-meta-row">
                <span><strong>Time:</strong> 10:00 am - 12:00 am</span>
                <span><strong>Location:</strong> Google Meet / VectorStudio HD Room</span>
                <span className="link-hover">Join Room ↗</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // DEFAULT VIEW: PIXEL-PERFECT RECREATION OF USER'S REFERENCE MOCKUP
  // =========================================================================
  const activeMonthKey = hoveredMonth || selectedMonth;
  const activeRevenueInfo = monthlyRevenueData[activeMonthKey] || monthlyRevenueData['Apr'];

  const cohortData = {
    '90d': { pct: 65, angle: 40, label: '90-Day Cohort', sub: 'Across 38 enterprise accounts (90d window)', status: '65% (Healthy)' },
    'enterprise': { pct: 82, angle: 86, label: 'VIP Retainers', sub: '14 Core Enterprise Retainers with renewals', status: '82% (Excellent)' },
    'annual': { pct: 91, angle: 110, label: 'Annualized', sub: 'Annual contract renewals across all tiers', status: '91% (Top 5% Tier)' }
  }[gaugeCohort];

  const currentGaugePct = hoveredGaugePct !== null ? hoveredGaugePct : cohortData.pct;
  const currentGaugeAngle = hoveredGaugePct !== null ? (-135 + (hoveredGaugePct / 100) * 270) : cohortData.angle;

  // Donut center display calculation
  let donutCenterTitle = '15';
  let donutCenterSubtitle = 'Active Deals';
  let donutCenterRate = '48% Close Rate';
  let donutCenterColor = '#ea580c';

  if (hoveredDonutSegment === 'referrals') {
    donutCenterTitle = '6 Deals';
    donutCenterSubtitle = 'Client Referrals';
    donutCenterRate = '40% • $21.4K';
    donutCenterColor = '#ff6900';
  } else if (hoveredDonutSegment === 'inbound') {
    donutCenterTitle = '4 Deals';
    donutCenterSubtitle = 'Inbound RFPs';
    donutCenterRate = '24% • $14.2K';
    donutCenterColor = '#0284c7';
  } else if (hoveredDonutSegment === 'outreach') {
    donutCenterTitle = '5 Deals';
    donutCenterSubtitle = 'Outreach Deals';
    donutCenterRate = '36% • $18.6K';
    donutCenterColor = '#059669';
  }

  const activeMeeting = calendarMeetings[activeCalendarDay] || calendarMeetings[13];

  return (
    <div className="noventra-dashboard-container">
      {/* Dedicated Workspace Quick Links Bar - Strictly Single Row & Smaller */}
      <div className="workspace-quick-links-bar">
        <button 
          type="button" 
          className="workspace-link-pill" 
          onClick={() => setActiveNav('timeline')}
          title="Open Timeline Board (Gantt)"
        >
          <Layers style={{ width: '13px', height: '13px', color: '#ff6900' }} />
          <span>Timeline (Gantt)</span>
        </button>
        <button 
          type="button" 
          className="workspace-link-pill" 
          onClick={() => setActiveNav('proposals')}
          title="Open Proposal Builder"
        >
          <Sparkles style={{ width: '13px', height: '13px', color: '#2563eb' }} />
          <span>Proposals (Docs)</span>
        </button>
        <button 
          type="button" 
          className="workspace-link-pill" 
          onClick={() => setActiveNav('tasks')}
          title="Open Task Tracker"
        >
          <CheckSquare style={{ width: '13px', height: '13px', color: '#10b981' }} />
          <span>Tasks (Kanban)</span>
        </button>
        <button 
          type="button" 
          className="workspace-link-pill" 
          onClick={() => setActiveNav('retainers')}
          title="Open Retainer Tracker"
        >
          <CreditCard style={{ width: '13px', height: '13px', color: '#0f9d58' }} />
          <span>Retainers (Sheets)</span>
        </button>
        <button 
          type="button" 
          className="workspace-link-pill" 
          onClick={() => setActiveNav('settings')}
          title="Open Admin Settings & RBAC"
        >
          <Settings style={{ width: '13px', height: '13px', color: '#8b5cf6' }} />
          <span>Admin RBAC</span>
        </button>
        <button 
          type="button" 
          className="workspace-link-pill ai-highlight-pill" 
          onClick={() => openAIAssistant()}
          title="Launch VectorAI Executive Copilot (Ctrl+K)"
        >
          <Sparkles style={{ width: '13px', height: '13px', color: '#ff6900' }} />
          <span>✨ VectorAI Copilot</span>
        </button>
      </div>

      {/* =====================================================================
          ROW 1: (Left: 2x2 Metric Grid, Right: Wide Total Revenue Stream Chart)
          ===================================================================== */}
      <section className="noventra-row-1" aria-label="Top Financial Overview">
        {/* Left 2x2 Metric Grid */}
        <div className="noventra-2x2-grid">
          {/* 1. Retainer Time Tracker */}
          <div 
            className="noventra-metric-card" 
            onClick={() => setActiveNav('retainers')}
            role="button"
            tabIndex={0}
            style={{ position: 'relative' }}
          >
            <div className="metric-card-top">
              <div className="metric-icon-square icon-orange">
                <Clock style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="metric-title">Retainer Time Tracker</span>
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button 
                  type="button" 
                  className="metric-more-btn" 
                  aria-label="Options"
                  onClick={() => setActiveMenu(activeMenu === 'time' ? null : 'time')}
                >
                  <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                </button>
                {activeMenu === 'time' && (
                  <div className="card-dropdown-menu">
                    <div className="card-dropdown-header">Time Tracker Actions</div>
                    <button type="button" className="card-dropdown-item" onClick={() => { showToast('Exporting logged hours to CSV...'); setActiveMenu(null); }}>
                      <Download style={{ width: '13px', height: '13px' }} />
                      <span>Export Hours (CSV)</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { setActiveNav('retainers'); setActiveMenu(null); }}>
                      <FileSpreadsheet style={{ width: '13px', height: '13px' }} />
                      <span>Sync Google Sheets</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { showToast('Bi-weekly billing cycle reset.'); setActiveMenu(null); }}>
                      <RefreshCw style={{ width: '13px', height: '13px' }} />
                      <span>Reset Billing Cycle</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="metric-amount-row">
              <span className="metric-amount">{admin.retainerHoursLogged} / {admin.retainerHoursTotal} hrs</span>
            </div>
            <div className="metric-footer-row">
              <span className="metric-trend green">
                ▲ 78.8% <span className="trend-sub">burn rate (On Track)</span>
              </span>
              <span className="metric-details-link">Details ↗</span>
            </div>
          </div>

          {/* 2. Proposal Generator */}
          <div 
            className="noventra-metric-card" 
            onClick={() => setActiveNav('proposals')}
            role="button"
            tabIndex={0}
            style={{ position: 'relative' }}
          >
            <div className="metric-card-top">
              <div className="metric-icon-square icon-blue">
                <Sparkles style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="metric-title">Proposal Generator</span>
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button 
                  type="button" 
                  className="metric-more-btn" 
                  aria-label="Options"
                  onClick={() => setActiveMenu(activeMenu === 'proposal' ? null : 'proposal')}
                >
                  <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                </button>
                {activeMenu === 'proposal' && (
                  <div className="card-dropdown-menu">
                    <div className="card-dropdown-header">Proposal Actions</div>
                    <button type="button" className="card-dropdown-item" onClick={() => { openModal('proposal'); setActiveMenu(null); }}>
                      <FilePlus style={{ width: '13px', height: '13px' }} />
                      <span>New Proposal (Modal)</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { setActiveNav('proposals'); setActiveMenu(null); }}>
                      <FileText style={{ width: '13px', height: '13px' }} />
                      <span>Google Docs Templates</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { showToast('Win rate: 88% (22 won of 25 sent)'); setActiveMenu(null); }}>
                      <Sparkles style={{ width: '13px', height: '13px' }} />
                      <span>Win Rate Analytics</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="metric-amount-row">
              <span className="metric-amount">$34.5K</span>
            </div>
            <div className="metric-footer-row">
              <span className="metric-trend green">
                ▲ 88% <span className="trend-sub">win rate &bull; 3 in review</span>
              </span>
              <span className="metric-details-link">Build ↗</span>
            </div>
          </div>

          {/* 3. Invoices & Payments */}
          <div 
            className="noventra-metric-card" 
            onClick={() => setActiveNav('invoices')}
            role="button"
            tabIndex={0}
            style={{ position: 'relative' }}
          >
            <div className="metric-card-top">
              <div className="metric-icon-square icon-green">
                <CreditCard style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="metric-title">Pending Invoices</span>
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button 
                  type="button" 
                  className="metric-more-btn" 
                  aria-label="Options"
                  onClick={() => setActiveMenu(activeMenu === 'invoice' ? null : 'invoice')}
                >
                  <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                </button>
                {activeMenu === 'invoice' && (
                  <div className="card-dropdown-menu">
                    <div className="card-dropdown-header">Billing & Invoices</div>
                    <button type="button" className="card-dropdown-item" onClick={() => { openModal('invoice'); setActiveMenu(null); }}>
                      <Plus style={{ width: '13px', height: '13px' }} />
                      <span>Create Invoice</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { openModal('recordPayment'); setActiveMenu(null); }}>
                      <ExternalLink style={{ width: '13px', height: '13px' }} />
                      <span>Record Bank Settlement</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { showToast('Downloading monthly invoices PDF summary...'); setActiveMenu(null); }}>
                      <Download style={{ width: '13px', height: '13px' }} />
                      <span>Download PDF Statement</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="metric-amount-row">
              <span className="metric-amount">${admin.pendingInvoicesTotal.toLocaleString()}</span>
            </div>
            <div className="metric-footer-row">
              <span className="metric-trend green">
                ▲ 4 pending <span className="trend-sub">&bull; 1 awaiting payout</span>
              </span>
              <span className="metric-details-link">Details ↗</span>
            </div>
          </div>

          {/* 4. Active Clients CRM */}
          <div 
            className="noventra-metric-card" 
            onClick={() => setActiveNav('clients')}
            role="button"
            tabIndex={0}
            style={{ position: 'relative' }}
          >
            <div className="metric-card-top">
              <div className="metric-icon-square icon-red">
                <Users style={{ width: '18px', height: '18px' }} />
              </div>
              <span className="metric-title">Active Clients CRM</span>
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button 
                  type="button" 
                  className="metric-more-btn" 
                  aria-label="Options"
                  onClick={() => setActiveMenu(activeMenu === 'client' ? null : 'client')}
                >
                  <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                </button>
                {activeMenu === 'client' && (
                  <div className="card-dropdown-menu">
                    <div className="card-dropdown-header">Client CRM Options</div>
                    <button type="button" className="card-dropdown-item" onClick={() => { setActiveNav('clients'); setActiveMenu(null); }}>
                      <Users style={{ width: '13px', height: '13px' }} />
                      <span>View All 14 Clients</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { showToast('Importing contacts from HubSpot / CSV...'); setActiveMenu(null); }}>
                      <Download style={{ width: '13px', height: '13px' }} />
                      <span>Import Contacts CSV</span>
                    </button>
                    <button type="button" className="card-dropdown-item" onClick={() => { showToast('Directory exported to CSV.'); setActiveMenu(null); }}>
                      <FileSpreadsheet style={{ width: '13px', height: '13px' }} />
                      <span>Export Directory</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="metric-amount-row">
              <span className="metric-amount">{admin.activeClients} Accounts</span>
            </div>
            <div className="metric-footer-row">
              <span className="metric-trend green">
                ▲ Arc, Nexus <span className="trend-sub">Lumina, Vanguard</span>
              </span>
              <span className="metric-details-link">Details ↗</span>
            </div>
          </div>
        </div>

        {/* Right Wide Card: Interactive Multi-layer Stream Chart */}
        <div 
          className="noventra-revenue-card"
          onClick={() => setActiveNav('revenue')}
          role="button"
          tabIndex={0}
          style={{ position: 'relative' }}
        >
          <div className="revenue-card-top">
            <h3 className="revenue-card-title">Agency MRR & Retainer Stream</h3>
            <div className="revenue-card-controls" onClick={(e) => e.stopPropagation()}>
              {/* Filter Stream Layers Popover */}
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
                  <div className="card-dropdown-menu" style={{ width: '240px', left: 0, right: 'auto' }}>
                    <div className="card-dropdown-header">Stream Layer Display</div>
                    <div 
                      className="card-dropdown-item" 
                      onClick={() => setStreamLayers(p => ({ ...p, retainers: !p.retainers }))}
                    >
                      <input type="checkbox" checked={streamLayers.retainers} readOnly />
                      <span>Retainer Stream ($38.5K)</span>
                    </div>
                    <div 
                      className="card-dropdown-item" 
                      onClick={() => setStreamLayers(p => ({ ...p, sows: !p.sows }))}
                    >
                      <input type="checkbox" checked={streamLayers.sows} readOnly />
                      <span>Sprint SOWs Ribbon ($9.75K)</span>
                    </div>
                    <div 
                      className="card-dropdown-item" 
                      onClick={() => setStreamLayers(p => ({ ...p, target: !p.target }))}
                    >
                      <input type="checkbox" checked={streamLayers.target} readOnly />
                      <span>Target Ceiling ($55.0K)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Notes Popover */}
              <div style={{ position: 'relative' }}>
                <button 
                  type="button" 
                  className={`rev-icon-btn ${streamNotesOpen ? 'dark' : 'light'}`} 
                  title="Executive notes"
                  onClick={() => setStreamNotesOpen(prev => !prev)}
                >
                  <MessageSquare style={{ width: '14px', height: '14px' }} />
                </button>

                {streamNotesOpen && (
                  <div className="card-dropdown-menu" style={{ width: '280px', right: 0 }}>
                    <div className="card-dropdown-header">Financial Milestone Notes</div>
                    <div style={{ padding: '8px 10px', fontSize: '11.5px', color: '#44403c', lineHeight: 1.5 }}>
                      <p><strong>April 2026 Milestone:</strong> Currently at 82% of quarterly capacity target ($48,250 / $55,000).</p>
                      <p style={{ marginTop: '6px', color: '#16a34a', fontWeight: '600' }}>✓ Retainer MRR up +24% YoY with zero churn.</p>
                      <p style={{ marginTop: '6px', color: '#78716c' }}>Next milestone payout: May 1st ($12,800 USD pending).</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Expand to Full Revenue Page */}
              <button 
                type="button" 
                className="rev-icon-btn light" 
                title="Expand Revenue Page"
                onClick={() => setActiveNav('revenue')}
              >
                <ArrowUpRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>

          <div className="revenue-amount-row">
            <span className="revenue-amount">${activeRevenueInfo.total.toLocaleString()}</span>
            <span className="revenue-currency">USD / mo {hoveredMonth && `(${hoveredMonth} Preview)`}</span>
          </div>

          {/* Sinuous Ribbon / Streamgraph SVG with month hover and interactive tooltip */}
          <div className="revenue-stream-container" onClick={(e) => e.stopPropagation()}>
            {/* Interactive Floating Hover Tooltip */}
            {hoveredMonth && (
              <div className="stream-hover-badge">
                <span><strong>{hoveredMonth} 2026</strong></span>
                <span>Total: <strong>${monthlyRevenueData[hoveredMonth]?.total.toLocaleString()}</strong></span>
                <span>Retainer: ${(monthlyRevenueData[hoveredMonth]?.retainer / 1000).toFixed(1)}K</span>
                <span>SOWs: ${(monthlyRevenueData[hoveredMonth]?.sows / 1000).toFixed(1)}K</span>
                <span>{monthlyRevenueData[hoveredMonth]?.benchmark}</span>
              </div>
            )}

            <svg 
              viewBox="0 0 540 160" 
              className="revenue-stream-svg" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="warmStreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.85" />
                  <stop offset="40%" stopColor="#ea580c" stopOpacity="0.75" />
                  <stop offset="70%" stopColor="#d97706" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
                </linearGradient>

                <linearGradient id="coolStreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fdba74" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="midStreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#a7f3d0" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.7" />
                </linearGradient>

                <filter id="glowOrange" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ff6900" floodOpacity="0.7" />
                </filter>
              </defs>

              {/* Lower Cool Layer (Retainer Base) */}
              {streamLayers.retainers && (
                <path
                  className="stream-layer-2"
                  d="M 20 85 C 100 82, 160 88, 220 86 C 280 84, 320 72, 380 65 C 440 58, 480 50, 520 48 L 520 120 C 480 122, 440 125, 380 115 C 320 105, 280 95, 220 92 C 160 90, 100 95, 20 96 Z"
                  fill="url(#coolStreamGrad)"
                />
              )}

              {/* Mid Layer (Smooth Transition) */}
              {streamLayers.sows && (
                <path
                  className="stream-layer-3"
                  d="M 20 70 C 100 68, 160 74, 220 78 C 280 82, 320 80, 380 72 C 440 64, 480 58, 520 54 L 520 102 C 480 106, 440 108, 380 102 C 320 96, 280 90, 220 88 C 160 86, 100 80, 20 78 Z"
                  fill="url(#midStreamGrad)"
                />
              )}

              {/* Upper Warm Amber Layer (Sprint SOWs) */}
              {streamLayers.retainers && (
                <path
                  className="stream-layer-1"
                  d="M 20 50 C 80 48, 140 52, 200 68 C 260 84, 310 82, 360 78 C 420 74, 460 70, 520 68 L 520 88 C 460 90, 420 92, 360 88 C 310 84, 260 86, 200 82 C 140 78, 80 74, 20 72 Z"
                  fill="url(#warmStreamGrad)"
                />
              )}

              {/* Dynamic Interactive Vertical Marker Guideline tracking active month */}
              {streamLayers.target && (
                <g style={{ transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                  <line 
                    x1={activeRevenueInfo.x} 
                    y1="18" 
                    x2={activeRevenueInfo.x} 
                    y2="140" 
                    stroke="#18181b" 
                    strokeWidth="1.2" 
                    strokeDasharray="3 3" 
                  />

                  {/* Pulsing Intersection Beacon Dot on Ribbon */}
                  <circle 
                    cx={activeRevenueInfo.x} 
                    cy="78" 
                    r="6" 
                    fill="#ffffff" 
                    stroke="#ff6900" 
                    strokeWidth="2.5" 
                    filter="url(#glowOrange)" 
                    className="donut-halo-circle" 
                  />
                  <circle cx={activeRevenueInfo.x} cy="78" r="3" fill="#ff6900" />

                  {/* Top Benchmark Pill */}
                  <g transform={`translate(${activeRevenueInfo.x - 34}, 8)`}>
                    <rect x="0" y="0" width="68" height="22" rx="11" fill="#18181b" />
                    <text x="34" y="15" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">
                      {activeRevenueInfo.targetPct}% Target
                    </text>
                  </g>

                  {/* Bottom Growth Pill */}
                  <g transform={`translate(${activeRevenueInfo.x - 30}, 126)`}>
                    <rect x="0" y="0" width="60" height="22" rx="11" fill="#f4f3ef" stroke="#e5e3dc" strokeWidth="1" />
                    <text x="30" y="15" fill="#18181b" fontSize="10" fontWeight="700" textAnchor="middle">
                      +24% YoY
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Month Selection Buttons Row */}
          <div className="revenue-months-row" onClick={(e) => e.stopPropagation()}>
            {(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`month-btn-item ${selectedMonth === m ? 'month-active' : ''}`}
                onMouseEnter={() => setHoveredMonth(m)}
                onMouseLeave={() => setHoveredMonth(null)}
                onClick={() => {
                  setSelectedMonth(m);
                  showToast(`Selected Milestone: ${m} 2026 ($${monthlyRevenueData[m].total.toLocaleString()} USD)`);
                }}
              >
                {m === 'Apr' ? 'Apr (Active Milestone)' : m}
              </button>
            ))}
          </div>

          {/* Clean Aligned Stream Legend Bar */}
          <div className="stream-legend-bar" style={{ marginTop: '12px' }}>
            <div className="stream-legend-tag" title="Enterprise Retainer MRR">
              <span className="tag-dot" style={{ backgroundColor: '#ea580c' }}></span>
              <span>Retainer MRR (${(activeRevenueInfo.retainer / 1000).toFixed(1)}K • 80%)</span>
            </div>
            <div className="stream-legend-tag" title="Project-based Sprint SOWs">
              <span className="tag-dot" style={{ backgroundColor: '#fed7aa', border: '1px solid #fdba74' }}></span>
              <span>Sprint SOWs (${(activeRevenueInfo.sows / 1000).toFixed(1)}K • 20%)</span>
            </div>
            <div className="stream-legend-tag" title="Capacity Target Ceiling">
              <span className="tag-dot" style={{ backgroundColor: '#38bdf8' }}></span>
              <span>Target Ceiling ($55.0K Max)</span>
            </div>
            <div className="stream-legend-tag" style={{ marginLeft: 'auto', color: '#16a34a', fontWeight: '800' }}>
              <span>✓ {activeRevenueInfo.benchmark}</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ROW 2: (3 Columns of Equal Width - Retention Gauge, Leads Donut, Schedule)
          ===================================================================== */}
      <section className="noventra-row-2" aria-label="Performance, Channels, and Calendar">
        {/* CARD 1: Retention Rate (Radial Speedometer Gauge with Clear Spacing) */}
        <div 
          className="noventra-col-card"
          onClick={() => setActiveNav('retainers')}
          role="button"
          tabIndex={0}
          style={{ position: 'relative' }}
        >
          <div className="col-card-header">
            <h3 className="col-card-title">Retention Rate</h3>
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="metric-more-btn" 
                aria-label="Options"
                onClick={() => setActiveMenu(activeMenu === 'retention' ? null : 'retention')}
              >
                <MoreHorizontal style={{ width: '16px', height: '16px' }} />
              </button>
              {activeMenu === 'retention' && (
                <div className="card-dropdown-menu">
                  <div className="card-dropdown-header">Retention Analytics</div>
                  <button type="button" className="card-dropdown-item" onClick={() => { setGaugeCohort('90d'); setActiveMenu(null); }}>
                    <span>90-Day Cohort (65%)</span>
                  </button>
                  <button type="button" className="card-dropdown-item" onClick={() => { setGaugeCohort('enterprise'); setActiveMenu(null); }}>
                    <span>VIP Retainers (82%)</span>
                  </button>
                  <button type="button" className="card-dropdown-item" onClick={() => { setGaugeCohort('annual'); setActiveMenu(null); }}>
                    <span>Annual Renewals (91%)</span>
                  </button>
                  <button type="button" className="card-dropdown-item" onClick={() => { showToast('Downloading client retention CSV...'); setActiveMenu(null); }}>
                    <Download style={{ width: '13px', height: '13px' }} />
                    <span>Export Retention CSV</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="retention-metric-row">
            <span className="retention-pct">{currentGaugePct}%</span>
            <span className="retention-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span className="tag-dot anim-pulse-green" style={{ width: '6px', height: '6px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span>
              +18% vs last month
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
              {/* Segmented Ticks along the arc: Inner radius 50px, Outer radius 66px */}
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

                const isFilled = (i / 27) <= (currentGaugePct / 100);

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

              {/* Perimeter Numbers placed at Radius ~92px - Giving a huge 26px clearance! */}
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
                x2={120 + 52 * Math.cos((currentGaugeAngle * Math.PI) / 180)}
                y2={110 + 52 * Math.sin((currentGaugeAngle * Math.PI) / 180)}
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
              className={`gauge-cohort-btn ${gaugeCohort === '90d' ? 'active' : ''}`}
              onClick={() => { setGaugeCohort('90d'); showToast('Cohort set to 90-Day (65%)'); }}
            >
              90-Day (65%)
            </button>
            <button
              type="button"
              className={`gauge-cohort-btn ${gaugeCohort === 'enterprise' ? 'active' : ''}`}
              onClick={() => { setGaugeCohort('enterprise'); showToast('Cohort set to VIP Retainers (82%)'); }}
            >
              Retainers (82%)
            </button>
            <button
              type="button"
              className={`gauge-cohort-btn ${gaugeCohort === 'annual' ? 'active' : ''}`}
              onClick={() => { setGaugeCohort('annual'); showToast('Cohort set to Annual Renewals (91%)'); }}
            >
              Annual (91%)
            </button>
          </div>

          {/* Speedometer Benchmarks Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', padding: '6px 10px', backgroundColor: '#faf9f6', borderRadius: '8px', fontSize: '11px', border: '1px solid #eae7df' }}>
            <span style={{ color: '#78716c' }}>Floor: <strong>0%</strong></span>
            <span style={{ color: '#ea580c', fontWeight: '700' }}>● Current: {cohortData.status}</span>
            <span style={{ color: '#16a34a', fontWeight: '700' }}>Target: <strong>85%</strong></span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#78716c', textAlign: 'center' }}>
            {cohortData.sub}
          </p>
        </div>

        {/* CARD 2: Leads Status (Clean Donut Chart with Interactive Segments & Aligned Metrics) */}
        <div 
          className="noventra-col-card"
          onClick={() => setActiveNav('clients')}
          role="button"
          tabIndex={0}
          style={{ position: 'relative' }}
        >
          <div className="col-card-header">
            <h3 className="col-card-title">Leads Status & Pipeline</h3>
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <div 
                className="leads-dropdown-pill" 
                onClick={() => setPipelineDropdownOpen(prev => !prev)}
              >
                <span>{pipelineFilter}</span>
                <ChevronDown style={{ width: '13px', height: '13px', color: '#78716c' }} />
              </div>

              {pipelineDropdownOpen && (
                <div className="card-dropdown-menu" style={{ width: '220px', right: 0 }}>
                  <div className="card-dropdown-header">Pipeline Segments</div>
                  {['Active Pipeline', 'Q1 2026 Qualified', 'Enterprise Retainers', 'Closed Won'].map((option) => (
                    <div 
                      key={option}
                      className={`card-dropdown-item ${pipelineFilter === option ? 'selected' : ''}`}
                      onClick={() => {
                        setPipelineFilter(option);
                        setPipelineDropdownOpen(false);
                        showToast(`Filtered pipeline to: ${option}`);
                      }}
                    >
                      <span>{option}</span>
                      {pipelineFilter === option && <Check style={{ width: '13px', height: '13px', color: '#ff6900', marginLeft: 'auto' }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clean Donut Chart - No Messy Wire Callouts, Interactive Hover */}
          <div className="donut-chart-container" onClick={(e) => e.stopPropagation()}>
            <svg viewBox="0 0 320 180" className="donut-svg">
              {/* Background circle outline */}
              <circle cx="160" cy="90" r="50" fill="none" stroke="#f4f3ef" strokeWidth="18" />

              {/* Outer Glowing Halo Ring */}
              <circle 
                cx="160" 
                cy="90" 
                r="60" 
                fill="none" 
                stroke={donutCenterColor} 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
                className="donut-halo-circle" 
              />

              {/* Segment 1: Client Referrals (40.1% - Orange) */}
              <circle
                className="donut-segment"
                cx="160"
                cy="90"
                r="50"
                fill="none"
                stroke="#ff6900"
                strokeWidth={hoveredDonutSegment === 'referrals' ? 24 : 18}
                strokeDasharray="125 314"
                strokeDashoffset="78"
                strokeLinecap="round"
                onMouseEnter={() => setHoveredDonutSegment('referrals')}
                onMouseLeave={() => setHoveredDonutSegment(null)}
              />

              {/* Segment 2: Inbound RFP (24.0% - Blue) */}
              <circle
                className="donut-segment"
                cx="160"
                cy="90"
                r="50"
                fill="none"
                stroke="#38bdf8"
                strokeWidth={hoveredDonutSegment === 'inbound' ? 24 : 18}
                strokeDasharray="75 314"
                strokeDashoffset="-50"
                strokeLinecap="round"
                onMouseEnter={() => setHoveredDonutSegment('inbound')}
                onMouseLeave={() => setHoveredDonutSegment(null)}
              />

              {/* Segment 3: Direct Outreach (35.9% - Green) */}
              <circle
                className="donut-segment"
                cx="160"
                cy="90"
                r="50"
                fill="none"
                stroke="#10b981"
                strokeWidth={hoveredDonutSegment === 'outreach' ? 24 : 18}
                strokeDasharray="105 314"
                strokeDashoffset="-130"
                strokeLinecap="round"
                onMouseEnter={() => setHoveredDonutSegment('outreach')}
                onMouseLeave={() => setHoveredDonutSegment(null)}
              />

              {/* Center Cutout Text with live interactive feedback */}
              <text x="160" y="82" fill="#18181b" fontSize="22" fontWeight="800" textAnchor="middle">
                {donutCenterTitle}
              </text>
              <text x="160" y="98" fill="#78716c" fontSize="10.5" fontWeight="600" textAnchor="middle">
                {donutCenterSubtitle}
              </text>
              <text x="160" y="112" fill={donutCenterColor} fontSize="10" fontWeight="700" textAnchor="middle">
                {donutCenterRate}
              </text>
            </svg>
          </div>

          {/* Aligned 3-Card Channel Metrics Grid with generous breathing space */}
          <div className="donut-channels-grid" onClick={(e) => e.stopPropagation()}>
            <div 
              className={`donut-channel-card ${hoveredDonutSegment === 'referrals' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredDonutSegment('referrals')}
              onMouseLeave={() => setHoveredDonutSegment(null)}
            >
              <div className="donut-card-top">
                <span className="tag-dot anim-pulse-orange" style={{ backgroundColor: '#ff6900' }}></span>
                <span>Referrals</span>
              </div>
              <span className="donut-card-val">6 Deals</span>
              <span className="donut-card-sub">40% • $21.4K</span>
            </div>

            <div 
              className={`donut-channel-card ${hoveredDonutSegment === 'inbound' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredDonutSegment('inbound')}
              onMouseLeave={() => setHoveredDonutSegment(null)}
            >
              <div className="donut-card-top">
                <span className="tag-dot anim-pulse-blue" style={{ backgroundColor: '#38bdf8' }}></span>
                <span>Inbound</span>
              </div>
              <span className="donut-card-val">4 Deals</span>
              <span className="donut-card-sub">24% • $14.2K</span>
            </div>

            <div 
              className={`donut-channel-card ${hoveredDonutSegment === 'outreach' ? 'active' : ''}`}
              onMouseEnter={() => setHoveredDonutSegment('outreach')}
              onMouseLeave={() => setHoveredDonutSegment(null)}
            >
              <div className="donut-card-top">
                <span className="tag-dot anim-pulse-green" style={{ backgroundColor: '#10b981' }}></span>
                <span>Outreach</span>
              </div>
              <span className="donut-card-val">5 Deals</span>
              <span className="donut-card-sub">36% • $18.6K</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Schedule (Interactive Calendar Days & Meeting Preview) */}
        <div 
          className="noventra-col-card"
          onClick={() => setActiveNav('meetings')}
          role="button"
          tabIndex={0}
          style={{ position: 'relative' }}
        >
          <div className="col-card-header">
            <h3 className="col-card-title">Schedule</h3>
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
                  <div className="card-dropdown-header">Calendar Actions</div>
                  <button type="button" className="card-dropdown-item" onClick={() => { openModal('meeting'); setActiveMenu(null); }}>
                    <Plus style={{ width: '13px', height: '13px' }} />
                    <span>Schedule New Sync</span>
                  </button>
                  <button type="button" className="card-dropdown-item" onClick={() => { showToast('Syncing with Google Calendar...'); setActiveMenu(null); }}>
                    <Calendar style={{ width: '13px', height: '13px' }} />
                    <span>Sync Google Calendar</span>
                  </button>
                  <button type="button" className="card-dropdown-item" onClick={() => { showToast('Meet Link copied to clipboard.'); setActiveMenu(null); }}>
                    <ExternalLink style={{ width: '13px', height: '13px' }} />
                    <span>Copy Meet Room URL</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mini Calendar Strip with clickable days */}
          <div className="mini-calendar-widget" onClick={(e) => e.stopPropagation()}>
            <div className="calendar-nav-row">
              <button 
                type="button" 
                className="cal-arrow-btn"
                onClick={() => showToast('Previous week schedule')}
              >
                <ChevronLeft style={{ width: '14px', height: '14px' }} />
              </button>
              <span className="calendar-month-label">February 2026</span>
              <button 
                type="button" 
                className="cal-arrow-btn"
                onClick={() => showToast('Next week schedule')}
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

          {/* Meeting Item Box dynamically showing the selected day's meeting */}
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
              <span className="event-meet-link">On {activeMeeting.platform} &gt;</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ROW 3: (Full-Width Lead Conversion Tracker Table Card)
          ===================================================================== */}
      <section className="noventra-row-3" aria-label="Lead Conversion Pipeline">
        <div className="noventra-table-card">
          <div className="table-card-header">
            <div>
              <h3 className="table-card-title">Lead Conversion Tracker</h3>
              <span style={{ fontSize: '12px', color: '#78716c' }}>
                Showing {displayLeads.length} active prospects & client enterprise accounts
              </span>
            </div>
            <div className="table-header-controls">
              <div className="table-search-pill">
                <input 
                  type="text" 
                  placeholder="Search leads..." 
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
                    {['All', 'Won & Signed', 'Proposal Sent', 'In Discussion', 'Contacted'].map((statusOption) => (
                      <div 
                        key={statusOption}
                        className={`card-dropdown-item ${tableStatusFilter === statusOption ? 'selected' : ''}`}
                        onClick={() => {
                          setTableStatusFilter(statusOption);
                          setTableFilterOpen(false);
                          showToast(`Filtering leads by: ${statusOption}`);
                        }}
                      >
                        <span>{statusOption === 'All' ? 'All Statuses' : statusOption}</span>
                        {tableStatusFilter === statusOption && <Check style={{ width: '13px', height: '13px', color: '#ff6900', marginLeft: 'auto' }} />}
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
                      checked={selectedLeads.length === displayLeads.length && displayLeads.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>
                    <div className="th-sort-wrapper">
                      <span>Lead Name</span>
                      <span className="sort-arrows">⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-sort-wrapper">
                      <span>Company</span>
                      <span className="sort-arrows">⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-sort-wrapper">
                      <span>Number</span>
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
                      <span>Contacted</span>
                      <span className="sort-arrows">⇅</span>
                    </div>
                  </th>
                  <th>
                    <div className="th-sort-wrapper">
                      <span>Follow-Up</span>
                      <span className="sort-arrows">⇅</span>
                    </div>
                  </th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayLeads.map((lead) => {
                  const isSelected = selectedLeads.includes(lead.id);

                  let statusClass = 'status-green';
                  if (lead.status === 'In Discussion') statusClass = 'status-orange';
                  if (lead.status === 'Proposal Sent') statusClass = 'status-blue';
                  if (lead.status === 'Won & Signed') statusClass = 'status-green';
                  if (lead.status === 'Contacted') statusClass = 'status-purple';

                  return (
                    <tr 
                      key={lead.id} 
                      className={isSelected ? 'row-selected' : ''}
                      onClick={() => setActiveNav('clients')}
                      style={{ cursor: 'pointer' }}
                    >
                      <td onClick={(e) => { e.stopPropagation(); toggleLeadSelection(lead.id); }}>
                        <input 
                          type="checkbox" 
                          className="custom-checkbox"
                          checked={isSelected}
                          onChange={() => toggleLeadSelection(lead.id)}
                        />
                      </td>
                      <td>
                        <div className="lead-name-cell">
                          <img src={lead.avatar} alt={lead.name} className="lead-avatar-img" />
                          <span className="lead-name-text">{lead.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="lead-company-cell">
                          <span className="company-logo-badge">
                            {lead.companyIcon === 'apple' && ''}
                            {lead.companyIcon === 'arc' && '▲'}
                            {lead.companyIcon === 'nexus' && '◆'}
                            {lead.companyIcon === 'lumina' && '✚'}
                            {lead.companyIcon === 'vanguard' && '✦'}
                          </span>
                          <span className="lead-company-text">{lead.company}</span>
                        </div>
                      </td>
                      <td className="lead-phone-cell">{lead.phone}</td>
                      <td>
                        <span className={`noventra-status-pill ${statusClass}`}>
                          ● {lead.status}
                        </span>
                      </td>
                      <td className="lead-date-cell">{lead.contactedDate}</td>
                      <td className="lead-date-cell">{lead.followUpDate}</td>
                      <td style={{ textAlign: 'right', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                        <button 
                          type="button" 
                          className="row-action-btn" 
                          aria-label="Lead Actions"
                          onClick={() => setActiveRowMenu(activeRowMenu === lead.id ? null : lead.id)}
                        >
                          <MoreHorizontal style={{ width: '16px', height: '16px' }} />
                        </button>

                        {activeRowMenu === lead.id && (
                          <div className="card-dropdown-menu" style={{ width: '180px', right: 0, top: '80%' }}>
                            <div className="card-dropdown-header">Lead Actions</div>
                            <button 
                              type="button" 
                              className="card-dropdown-item"
                              onClick={() => { setActiveNav('clients'); setActiveRowMenu(null); }}
                            >
                              <Users style={{ width: '13px', height: '13px' }} />
                              <span>View Dossier</span>
                            </button>
                            <button 
                              type="button" 
                              className="card-dropdown-item"
                              onClick={() => { openModal('proposal'); setActiveRowMenu(null); }}
                            >
                              <Sparkles style={{ width: '13px', height: '13px' }} />
                              <span>Send Proposal</span>
                            </button>
                            <button 
                              type="button" 
                              className="card-dropdown-item"
                              onClick={() => { openModal('meeting'); setActiveRowMenu(null); }}
                            >
                              <Calendar style={{ width: '13px', height: '13px' }} />
                              <span>Schedule Call</span>
                            </button>
                            <button 
                              type="button" 
                              className="card-dropdown-item danger"
                              onClick={() => { showToast(`Lead ${lead.name} archived.`); setActiveRowMenu(null); }}
                            >
                              <X style={{ width: '13px', height: '13px' }} />
                              <span>Archive Lead</span>
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

