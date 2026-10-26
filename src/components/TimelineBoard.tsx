import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

interface Props {
  onBack: () => void;
}

export const TimelineBoard: React.FC<Props> = ({ onBack }) => {
  const { state, openModal, showToast, openAIAssistant, setActiveNav } = useAgency();
  const { admin } = state;
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'Arc Company' | 'Nexus Labs' | 'Lumina Health'>('all');
  const [activeTab, setActiveTab] = useState<'gantt' | 'milestones' | 'team'>('gantt');

  const filteredSprints = admin.sprints.filter(s => 
    selectedFilter === 'all' || s.client === selectedFilter
  );

  const teamMembers = [
    { name: 'Carlos Mendes', role: 'Lead Architect', avatar: '/assets/images/carlos.jpg', active: 'Figma Design System v2.4', load: 85, health: 'On Track' },
    { name: 'Diego Alvarez', role: 'Fullstack Engineer', avatar: '/assets/images/diego.jpg', active: 'REST APIs & Webhook Handlers', load: 78, health: 'On Track' },
    { name: 'Liam Brooks', role: 'Design Systems Lead', avatar: '/assets/images/liam.jpg', active: 'Brand Identity Manual', load: 90, health: 'Completed' },
    { name: 'Owais Anwer', role: 'Managing Director', avatar: '/assets/images/owais.jpg', active: 'Compliance Architecture', load: 60, health: 'On Track' }
  ];

  return (
    <div className="noventra-view-container">
      {/* Top Header & Breadcrumb */}
      <div className="noventra-fullpage-header">
        <div className="noventra-nav-breadcrumb-row">
          <button type="button" className="noventra-back-btn" onClick={onBack}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Back to Overview</span>
          </button>
          <div className="noventra-breadcrumb">
            <span>Platform Overview</span>
            <span>/</span>
            <span className="noventra-breadcrumb-active">Project Timeline Board</span>
          </div>
        </div>

        <div className="noventra-banner-row">
          <div>
            <h1 className="noventra-banner-title">Project Timeline Board & Sprints</h1>
            <p className="noventra-banner-sub">
              Live Gantt charts, milestone deadlines, team resourcing, and delivery health across all active client accounts.
            </p>
          </div>
          <div className="noventra-banner-actions">
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={() => openAIAssistant('Schedule milestone for Arc Company: Beta Release on Nov 18, 2026')}
            >
              <Sparkles style={{ width: '13px', height: '13px', color: '#ff6900' }} />
              <span className="btn-desktop-text">✨ AI Milestone Planner</span>
              <span className="btn-mobile-text">✨ AI Plan</span>
            </button>
            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={() => openAIAssistant('Plan sprint milestones')}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span className="btn-desktop-text">+ New Milestone</span>
              <span className="btn-mobile-text">+ Milestone</span>
            </button>
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={() => openModal('task')}
            >
              <Plus style={{ width: '13px', height: '13px' }} />
              <span className="btn-desktop-text">+ Add Task</span>
              <span className="btn-mobile-text">+ Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="noventra-stat-grid-4">
        <div className="noventra-stat-box">
          <span className="stat-label">Active Sprint Pipelines</span>
          <span className="stat-val">{admin.sprints.length} Pipelines</span>
          <span className="stat-trend green">▲ 100% on target schedule</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Milestones Completed</span>
          <span className="stat-val">14 / 18</span>
          <span className="stat-trend green">▲ 77.8% sprint velocity</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Critical Deadlines</span>
          <span className="stat-val">2 Approaching</span>
          <span className="stat-trend orange">● Arc Co. Beta (3 days left)</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Team Resourcing</span>
          <span className="stat-val">86% Load</span>
          <span className="stat-trend green">● Optimal delivery capacity</span>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="timeline-toolbar-card">
        <div className="timeline-tabs-group">
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'gantt' ? 'active' : ''}`}
            onClick={() => setActiveTab('gantt')}
          >
            <Calendar style={{ width: '15px', height: '15px' }} />
            <span>Interactive Gantt Chart</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'milestones' ? 'active' : ''}`}
            onClick={() => setActiveTab('milestones')}
          >
            <Layers style={{ width: '15px', height: '15px' }} />
            <span>Milestone Gates</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Clock style={{ width: '15px', height: '15px' }} />
            <span>Team Assignments</span>
          </button>
        </div>

        <div className="timeline-filter-pills">
          <span style={{ fontSize: '12px', color: '#78716c', fontWeight: 600 }}>Filter Client:</span>
          {(['all', 'Arc Company', 'Nexus Labs', 'Lumina Health'] as const).map(client => (
            <button
              key={client}
              type="button"
              className={`timeline-client-filter-btn ${selectedFilter === client ? 'active' : ''}`}
              onClick={() => setSelectedFilter(client)}
            >
              {client === 'all' ? 'All Clients' : client}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: INTERACTIVE GANTT CHART */}
      {activeTab === 'gantt' && (
        <div className="noventra-card">
          <div className="noventra-card-title-row">
            <div>
              <h2 className="noventra-card-heading">Project Timeline & Sprints (Q4 2026)</h2>
              <span className="noventra-card-subtitle">8-Week Gantt horizon with milestones, delivery dependencies, and stage progress</span>
            </div>
            <div className="gantt-legend">
              <span className="gantt-legend-item"><span className="legend-box completed"></span> Completed</span>
              <span className="gantt-legend-item"><span className="legend-box review"></span> In Review</span>
              <span className="gantt-legend-item"><span className="legend-box progress"></span> In Progress</span>
              <span className="gantt-legend-item"><span className="legend-box scheduled"></span> Scheduled</span>
            </div>
          </div>

          <div className="gantt-chart-wrapper">
            {/* Timeline Header Row with Weeks */}
            <div className="gantt-header-row">
              <div className="gantt-col-task-title">Project & Sprint Scope</div>
              <div className="gantt-timeline-scales">
                <span>Oct W1</span>
                <span>Oct W2</span>
                <span>Oct W3</span>
                <span>Oct W4</span>
                <span>Nov W1</span>
                <span>Nov W2</span>
                <span>Nov W3</span>
                <span>Nov W4</span>
              </div>
            </div>

            {/* Gantt Project Rows */}
            {filteredSprints.map((sprint) => {
              // Calculate start and width percentages for Gantt bars
              let startPct = 0;
              let widthPct = 30;
              let barColor = '#10b981';

              if (sprint.id === 'sp1') { startPct = 0; widthPct = 25; barColor = '#10b981'; }
              if (sprint.id === 'sp2') { startPct = 12; widthPct = 35; barColor = '#ff6900'; }
              if (sprint.id === 'sp3') { startPct = 25; widthPct = 40; barColor = '#3b82f6'; }
              if (sprint.id === 'sp4') { startPct = 38; widthPct = 32; barColor = '#8b5cf6'; }
              if (sprint.id === 'sp5') { startPct = 50; widthPct = 45; barColor = '#eab308'; }

              return (
                <div key={sprint.id} className="gantt-project-row">
                  <div className="gantt-project-meta">
                    <span className="gantt-client-badge">{sprint.client}</span>
                    <h4 className="gantt-sprint-name">{sprint.name}</h4>
                    <span className="gantt-progress-sub">{sprint.progress}% &bull; {sprint.date}</span>
                  </div>

                  <div className="gantt-track-area">
                    {/* Vertical grid lines */}
                    <div className="gantt-grid-lines">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="gantt-grid-col"></div>
                      ))}
                    </div>

                    {/* The Gantt Bar */}
                    <div 
                      className="gantt-bar-fill" 
                      style={{ 
                        left: `${startPct}%`, 
                        width: `${widthPct}%`,
                        backgroundColor: barColor
                      }}
                      onClick={() => openModal('task', { sprintName: sprint.name, client: sprint.client })}
                      title={`Click to manage sprint tasks for ${sprint.name}`}
                    >
                      <span className="gantt-bar-label">{sprint.progress}%</span>
                      {sprint.progress === 100 && (
                        <CheckCircle2 style={{ width: '13px', height: '13px', marginLeft: '6px' }} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MILESTONE GATES */}
      {activeTab === 'milestones' && (
        <div className="noventra-card">
          <div className="noventra-card-title-row">
            <div>
              <h2 className="noventra-card-heading">Milestone Delivery Gates & Sign-Offs</h2>
              <span className="noventra-card-subtitle">Critical client check-points, sign-offs, and QA release gates</span>
            </div>
          </div>

          <div className="noventra-table-container">
            <table className="noventra-table">
              <thead>
                <tr>
                  <th>Milestone Name</th>
                  <th>Client Account</th>
                  <th>Target Deadline</th>
                  <th>Assigned Lead</th>
                  <th>Delivery Health</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Phase 1: Brand Strategy Sign-off', client: 'Arc Company', date: 'Oct 10, 2026', lead: 'Liam Brooks', health: 'Completed' },
                  { name: 'Phase 2: Figma Design System v2.4 Approval', client: 'Arc Company', date: 'Oct 24, 2026', lead: 'Carlos Mendes', health: 'In Review' },
                  { name: 'Phase 3: Beta Release Staging Cutover', client: 'Arc Company', date: 'Oct 27, 2026 (3d Left)', lead: 'Diego Alvarez', health: 'On Track' },
                  { name: 'Phase 2: MVP Frontend & Modular APIs', client: 'Nexus Labs', date: 'Nov 02, 2026', lead: 'Diego Alvarez', health: 'On Track' },
                  { name: 'Phase 1: HIPAA Compliance Data Protocol', client: 'Lumina Health', date: 'Nov 12, 2026', lead: 'Owais Anwer', health: 'Scheduled' }
                ].map((m, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{m.name}</td>
                    <td>{m.client}</td>
                    <td style={{ color: '#78716c' }}>{m.date}</td>
                    <td><strong>{m.lead}</strong></td>
                    <td>
                      <span className={`noventra-status-pill ${m.health === 'Completed' ? 'status-green' : m.health === 'In Review' ? 'status-orange' : 'status-blue'}`}>
                        ● {m.health}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button" 
                        className="noventra-orange-btn"
                        style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-flex' }}
                        onClick={() => {
                          setActiveNav('portal-deliverables');
                          showToast(`Navigated to deliverables pipeline for ${m.name}`);
                        }}
                      >
                        Inspect Gate ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TEAM ASSIGNMENTS */}
      {activeTab === 'team' && (
        <div className="noventra-card">
          <div className="noventra-card-title-row">
            <div>
              <h2 className="noventra-card-heading">Team Resourcing & Assignment Matrix</h2>
              <span className="noventra-card-subtitle">Active capacity allocation across project sprints and lead specialists</span>
            </div>
            <span className="noventra-status-pill status-green">86% Team Efficiency</span>
          </div>

          <div className="noventra-stat-grid-4">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="team-capacity-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <img src={member.avatar} alt={member.name} className="lead-table-avatar" style={{ width: '44px', height: '44px' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#18181b' }}>{member.name}</h4>
                    <span style={{ fontSize: '11px', color: '#78716c' }}>{member.role}</span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#44403c', marginBottom: '8px' }}>
                  <strong>Sprint:</strong> {member.active}
                </div>
                <div className="flex-between" style={{ fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#78716c' }}>Workload Load</span>
                  <span style={{ fontWeight: 700, color: '#18181b' }}>{member.load}%</span>
                </div>
                <div className="sprint-progress-bar-container">
                  <div 
                    className="sprint-progress-bar-fill" 
                    style={{ 
                      width: `${member.load}%`,
                      backgroundColor: member.load > 85 ? '#ff6900' : '#10b981'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
