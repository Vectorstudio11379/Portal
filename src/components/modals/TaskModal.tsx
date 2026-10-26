import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { 
  CheckSquare, 
  Calendar, 
  User, 
  Building2, 
  AlertCircle, 
  X 
} from 'lucide-react';

export const TaskModal: React.FC = () => {
  const { state, activeModal, closeModal, addTask } = useAgency();
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('Arc Company');
  const [assignee, setAssignee] = useState(state.users?.[0]?.name || 'Carlos Mendes');
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Normal'>('High');
  const [description, setDescription] = useState('');

  if (activeModal !== 'task') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Format deadline nicely
    let formattedDeadline = deadline;
    try {
      const parts = deadline.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        formattedDeadline = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch {
      formattedDeadline = deadline;
    }

    addTask(title.trim(), client, assignee, formattedDeadline, priority, description.trim());
    setTitle('');
    setDescription('');
  };

  const usersList = state.users || [];
  const clientAccounts = state.admin.clientAccounts || [];

  return (
    <div className="modal-backdrop" onClick={closeModal} style={{ zIndex: 9999 }}>
      <div 
        className="modal-content-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '560px', 
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
          background: 'var(--surface-sunken)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-square icon-orange" style={{ width: '38px', height: '38px' }}>
              <CheckSquare style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Assign Task with Deadline
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Assigned team member will see this instantly on their dashboard and in-app calendar.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={closeModal} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Task Title */}
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                <span>Task Title / Objective</span>
                <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                type="text" 
                required 
                className="form-input"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Audit responsive Figma tokens and deploy API route"
              />
            </div>

            {/* Client & Assignee */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Client / Project</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-input"
                    value={client} 
                    onChange={(e) => setClient(e.target.value)}
                    style={{ paddingLeft: '34px' }}
                  >
                    <option value="Arc Company">Arc Company</option>
                    <option value="Nexus Labs">Nexus Labs</option>
                    <option value="Lumina Health">Lumina Health</option>
                    <option value="Vanguard AI">Vanguard AI</option>
                    {clientAccounts.map(c => (
                      <option key={c.id} value={c.clientName}>{c.clientName}</option>
                    ))}
                    <option value="VectorStudio">VectorStudio (Internal)</option>
                  </select>
                  <Building2 style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Assign Team Member</span>
                  <span style={{ color: '#ff6900', fontWeight: 700 }}>● Instant Sync</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-input"
                    value={assignee} 
                    onChange={(e) => setAssignee(e.target.value)}
                    style={{ paddingLeft: '34px', fontWeight: 600 }}
                  >
                    {usersList.map(u => (
                      <option key={u.id} value={u.name}>
                        {u.name} — {u.adminRoleTitle || u.profession || 'Team Member'}
                      </option>
                    ))}
                  </select>
                  <User style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: '#ff6900' }} />
                </div>
              </div>
            </div>

            {/* Deadline & Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Deadline Date</span>
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="date" 
                    required 
                    className="form-input"
                    value={deadline} 
                    onChange={(e) => setDeadline(e.target.value)}
                    style={{ paddingLeft: '34px' }}
                  />
                  <Calendar style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: '#ff6900' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Priority Level</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-input"
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value as any)}
                    style={{ paddingLeft: '34px' }}
                  >
                    <option value="Urgent">🔥 Urgent (Immediate Deliverable)</option>
                    <option value="High">⚡ High Priority</option>
                    <option value="Medium">● Medium</option>
                    <option value="Normal">○ Normal Backlog</option>
                  </select>
                  <AlertCircle style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
                </div>
              </div>
            </div>

            {/* Description / Instructions */}
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                <span>Deliverable Scope / Notes</span>
              </label>
              <textarea 
                className="form-input"
                rows={3}
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Include specifications, acceptance criteria, or links to Figma / PRs..."
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Modal Actions */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '12px', 
              marginTop: '12px', 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: '16px' 
            }}>
              <button type="button" className="noventra-outline-btn" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="noventra-orange-btn" style={{ padding: '8px 22px' }}>
                Assign Task & Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
