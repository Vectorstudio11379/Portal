import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  CheckSquare, 
  Calendar,
  Layers, 
  Users,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import type { Task } from '../types';

interface Props {
  onBack: () => void;
}

export const TaskTracker: React.FC<Props> = ({ onBack }) => {
  const { state, openModal, toggleTask, showToast, openAIAssistant, setActiveNav } = useAgency();
  const { admin } = state;
  const [viewMode, setViewMode] = useState<'kanban' | 'workload' | 'list'>('kanban');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<'all' | 'mine'>('all');
  const [filterClient] = useState<string>('all');
  const [localTasks, setLocalTasks] = useState<Task[]>(admin.tasks);

  // Sync with global state tasks if they change
  React.useEffect(() => {
    setLocalTasks(admin.tasks);
  }, [admin.tasks]);

  const filteredTasks = localTasks.filter(t => {
    const matchesPriority = filterPriority === 'all' || t.priority.toLowerCase() === filterPriority.toLowerCase();
    const matchesClient = filterClient === 'all' || t.client === filterClient;
    const matchesAssignee = filterAssignee === 'all' || 
      (Boolean(state.currentUser?.name) && t.assignee.toLowerCase().includes(state.currentUser?.name.toLowerCase() || ''));
    return matchesPriority && matchesClient && matchesAssignee;
  });

  const moveTaskStatus = (taskId: string, newStatus: 'todo' | 'in_progress' | 'review' | 'done') => {
    setLocalTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          done: newStatus === 'done'
        };
      }
      return t;
    }));
    showToast(`Task updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
  };

  const openWhatsAppForAssignee = (assigneeName: string, taskTitle: string, clientName: string) => {
    const matchedUser = state.users.find(u => 
      u.name.toLowerCase().includes(assigneeName.toLowerCase()) || 
      assigneeName.toLowerCase().includes(u.name.toLowerCase())
    );
    const num = matchedUser?.whatsappNumber || '+14155550192';
    const cleanNum = num.replace(/[^0-9]/g, '');
    const msg = `Hi ${assigneeName}, messaging you regarding the "${taskTitle}" task for ${clientName} on VectorStudio Agency OS. What is the current sprint status?`;
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    showToast(`Opening WhatsApp chat with ${assigneeName}...`);
  };

  const columns: { id: 'todo' | 'in_progress' | 'review' | 'done'; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do / Backlog', color: '#94a3b8' },
    { id: 'in_progress', title: 'In Progress', color: '#ff6900' },
    { id: 'review', title: 'Review & QA', color: '#3b82f6' },
    { id: 'done', title: 'Completed & Signed', color: '#10b981' }
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
            <span className="noventra-breadcrumb-active">Task Tracker</span>
          </div>
        </div>

        <div className="noventra-banner-row">
          <div>
            <h1 className="noventra-banner-title">Task Management & Kanban Board</h1>
            <p className="noventra-banner-sub">
              Drag-and-drop workflow status, workload distribution, due date tracking, and agency productivity analytics.
            </p>
          </div>
          <div className="noventra-banner-actions">
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={() => setActiveNav('meetings')}
              title="Track all task deadlines on the agency schedule calendar"
            >
              <Calendar style={{ width: '14px', height: '14px', color: '#ff6900' }} />
              <span className="btn-desktop-text">Track in Calendar 📅</span>
              <span className="btn-mobile-text">Calendar</span>
            </button>
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={() => openAIAssistant('Break down 3 sprint tasks for Arc Company')}
            >
              <Sparkles style={{ width: '14px', height: '14px', color: '#ff6900' }} />
              <span className="btn-desktop-text">✨ AI Task Generator</span>
              <span className="btn-mobile-text">✨ AI Tasks</span>
            </button>
            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={() => openModal('task')}
            >
              <Plus style={{ width: '15px', height: '15px' }} />
              <span className="btn-desktop-text">+ Add Task</span>
              <span className="btn-mobile-text">+ Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Productivity Analytics Stat Cards */}
      <div className="noventra-stat-grid-4">
        <div className="noventra-stat-box">
          <span className="stat-label">Active Tasks</span>
          <span className="stat-val">{localTasks.filter(t => !t.done).length} In Flight</span>
          <span className="stat-trend green">▲ {localTasks.filter(t => t.done).length} completed this cycle</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Urgent / High Priority</span>
          <span className="stat-val">{localTasks.filter(t => t.priority === 'Urgent' || t.priority === 'High').length} Tasks</span>
          <span className="stat-trend orange">● 2 delivery gates approaching</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Productivity Score</span>
          <span className="stat-val">94.2%</span>
          <span className="stat-trend green">▲ +4.8% vs last sprint</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Avg. Completion Time</span>
          <span className="stat-val">1.8 Days</span>
          <span className="stat-trend green">● 24% faster than estimate</span>
        </div>
      </div>

      {/* View Switcher & Filter Toolbar */}
      <div className="timeline-toolbar-card">
        <div className="timeline-tabs-group">
          <button 
            type="button" 
            className={`timeline-tab-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
          >
            <Layers style={{ width: '15px', height: '15px' }} />
            <span>Interactive Kanban Board</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${viewMode === 'workload' ? 'active' : ''}`}
            onClick={() => setViewMode('workload')}
          >
            <Users style={{ width: '15px', height: '15px' }} />
            <span>Workload Distribution</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <CheckSquare style={{ width: '15px', height: '15px' }} />
            <span>List Matrix</span>
          </button>
        </div>

        <div className="timeline-filter-pills" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Assignee:</span>
          <button
            type="button"
            className={`timeline-client-filter-btn ${filterAssignee === 'all' ? 'active' : ''}`}
            onClick={() => setFilterAssignee('all')}
          >
            ALL TEAM
          </button>
          <button
            type="button"
            className={`timeline-client-filter-btn ${filterAssignee === 'mine' ? 'active' : ''}`}
            onClick={() => setFilterAssignee('mine')}
            style={{ fontWeight: 700 }}
          >
            ★ MY ASSIGNED TASKS ({localTasks.filter(t => Boolean(state.currentUser?.name) && t.assignee.toLowerCase().includes(state.currentUser?.name.toLowerCase() || '')).length})
          </button>

          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, marginLeft: '6px' }}>Priority:</span>
          {['all', 'urgent', 'high', 'medium'].map(p => (
            <button
              key={p}
              type="button"
              className={`timeline-client-filter-btn ${filterPriority === p ? 'active' : ''}`}
              onClick={() => setFilterPriority(p)}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE 4-COLUMN KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="kanban-board-grid">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => {
              if (col.id === 'done') return t.done || t.status === 'done';
              if (col.id === 'todo') return t.status === 'todo';
              if (col.id === 'in_progress') return t.status === 'in_progress' && !t.done;
              if (col.id === 'review') return t.status === 'review' && !t.done;
              return false;
            });

            return (
              <div key={col.id} className="kanban-column-card">
                <div className="kanban-col-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="kanban-col-dot" style={{ backgroundColor: col.color }}></span>
                    <h3 className="kanban-col-title">{col.title}</h3>
                  </div>
                  <span className="kanban-col-count">{colTasks.length}</span>
                </div>

                <div className="kanban-cards-stack">
                  {colTasks.map(task => (
                    <div key={task.id} className="kanban-item-card">
                      <div className="kanban-item-top">
                        <span className={`task-priority-tag priority-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                        <span className="kanban-client-tag">{task.client}</span>
                      </div>

                      <h4 className="kanban-task-title">{task.title}</h4>
                      {task.description && (
                        <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '4px 0 8px', lineHeight: 1.4 }}>
                          {task.description}
                        </p>
                      )}

                      <div className="kanban-item-footer">
                        <div className="kanban-assignee">
                          <img src={task.avatar} alt={task.assignee} className="kanban-avatar-img" />
                          <span>{task.assignee.split(' ')[0]}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openWhatsAppForAssignee(task.assignee, task.title, task.client);
                            }}
                            title={`Chat ${task.assignee} on WhatsApp`}
                            style={{
                              border: 'none',
                              background: '#f0fdf4',
                              color: '#25D366',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '2px',
                              borderRadius: '50%',
                              marginLeft: '4px'
                            }}
                          >
                            <MessageCircle style={{ width: '13px', height: '13px' }} />
                          </button>
                        </div>
                        <div className="kanban-due-date" style={{ color: '#ea580c', fontWeight: 700, gap: '4px' }}>
                          <Calendar style={{ width: '12px', height: '12px' }} />
                          <span>{task.deadline || task.dueDate || 'Oct 28'}</span>
                        </div>
                      </div>

                      {/* Move Stage Quick Action */}
                      <div className="kanban-stage-mover">
                        {col.id !== 'todo' && (
                          <button 
                            type="button" 
                            className="kanban-stage-btn"
                            onClick={() => moveTaskStatus(task.id, col.id === 'done' ? 'review' : col.id === 'review' ? 'in_progress' : 'todo')}
                          >
                            &larr; Prev
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button 
                            type="button" 
                            className="kanban-stage-btn next"
                            onClick={() => moveTaskStatus(task.id, col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'review' : 'done')}
                          >
                            Next &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="kanban-empty-placeholder">
                      <span>No tasks in this stage</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: WORKLOAD DISTRIBUTION */}
      {viewMode === 'workload' && (
        <div className="noventra-card">
          <div className="noventra-card-title-row">
            <div>
              <h2 className="noventra-card-heading">Team Capacity & Workload Distribution Matrix</h2>
              <span className="noventra-card-subtitle">Task allocation, active deliverable queues, and burn rate per specialist</span>
            </div>
            <span className="noventra-status-pill status-green">Optimal Workload Balance</span>
          </div>

          <div className="noventra-stat-grid-4">
            {state.users.slice(0, 8).map((member) => {
              const assignedTasks = localTasks.filter(t => t.assignee.toLowerCase().includes(member.name.toLowerCase()));
              const tasksCount = assignedTasks.length;
              const capacity = Math.min(100, Math.max(15, tasksCount * 28));
              return (
                <div key={member.id} className="team-capacity-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <img src={member.avatar} alt={member.name} className="lead-table-avatar" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{member.name}</h4>
                      <span style={{ fontSize: '11px', color: '#ff6900', fontWeight: 600 }}>{member.adminRoleTitle || member.profession || 'Team Member'}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <strong>Assigned:</strong> {tasksCount} Tasks in Pipeline
                  </div>
                  <div className="flex-between" style={{ fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Workload Allocation</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{capacity}%</span>
                  </div>
                  <div className="sprint-progress-bar-container">
                    <div 
                      className="sprint-progress-bar-fill" 
                      style={{ 
                        width: `${capacity}%`,
                        backgroundColor: capacity > 80 ? '#ff6900' : '#10b981'
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: LIST MATRIX */}
      {viewMode === 'list' && (
        <div className="noventra-card">
          <div className="noventra-table-container">
            <table className="noventra-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Client Account</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      <div>{t.title}</div>
                      {t.description && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 400 }}>{t.description}</div>
                      )}
                    </td>
                    <td>{t.client}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={t.avatar} alt={t.assignee} className="lead-table-avatar" style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                        <span style={{ color: 'var(--text-primary)' }}>{t.assignee}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`task-priority-tag priority-${t.priority.toLowerCase()}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#ea580c', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ width: '12px', height: '12px' }} />
                        {t.deadline || t.dueDate || 'Oct 28, 2026'}
                      </span>
                    </td>
                    <td>
                      <span className={`noventra-status-pill ${t.done ? 'status-green' : 'status-orange'}`}>
                        {t.done ? '● Completed' : '● In Progress'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button" 
                        className="noventra-orange-btn"
                        style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-flex' }}
                        onClick={() => toggleTask(t.id)}
                      >
                        {t.done ? 'Reopen' : 'Mark Done'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
