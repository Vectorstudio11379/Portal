import React, { useState, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Calendar, Clock, Bell, Check, X, FileText } from 'lucide-react';

export const MeetingModal: React.FC = () => {
  const { activeModal, modalData, closeModal, scheduleMeeting, state } = useAgency();

  const [title, setTitle] = useState('');
  const [client, setClient] = useState('Arc Company');
  const [date, setDate] = useState('2026-10-24');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [notificationAhead, setNotificationAhead] = useState<'15m' | '30m' | '1h' | '1d'>('30m');
  const [topic, setTopic] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>(['Owais Anwer', 'Carlos Mendes']);

  const allClients = state.admin.clientAccounts || [];
  const teamUsers = state.users || [];

  useEffect(() => {
    if (activeModal === 'meeting') {
      if (modalData?.defaultDate) {
        setDate(modalData.defaultDate);
      } else {
        setDate('2026-10-24');
      }
      if (modalData?.client) setClient(modalData.client);
      setTitle('');
      setTopic('');
      setNotificationAhead('30m');
    }
  }, [activeModal, modalData]);

  if (activeModal !== 'meeting') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    scheduleMeeting({
      title: title.trim(),
      client,
      date,
      time: `${startTime} - ${endTime}`,
      attendees: selectedAttendees.length > 0 ? selectedAttendees : ['Owais Anwer'],
      topic: topic.trim() || `Strategy alignment and deliverable review with ${client}.`,
      notificationAhead
    });
    closeModal();
  };

  const toggleAttendee = (name: string) => {
    setSelectedAttendees(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

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
          backgroundColor: 'var(--surface-sunken, #f8fafc)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-square icon-orange" style={{ width: '40px', height: '40px' }}>
              <Calendar style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Schedule Meeting & Reminder
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Set calendar date, time, and ahead-of-time notification alert.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={closeModal} 
            className="modal-close-btn"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Modal Body Form */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: 'var(--surface, #ffffff)' }}>
          <form onSubmit={handleSubmit}>
            {/* Meeting Title */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                <span>Meeting Title / Subject</span>
                <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Sprint 4 Deliverables & UX Review" 
                  required 
                  style={{ paddingLeft: '34px' }}
                />
                <FileText style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
              </div>
            </div>

            {/* Client Organization */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                <span>Client Stakeholder</span>
              </label>
              <select 
                className="form-input"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                style={{ fontWeight: 600 }}
              >
                {allClients.map(c => (
                  <option key={c.id} value={c.clientName}>
                    {c.clientName} ({c.contactName})
                  </option>
                ))}
                <option value="Internal Studio Sync">Internal Studio Sync (No External Client)</option>
              </select>
            </div>

            {/* Date & Time Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              {/* Meeting Date */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Meeting Date</span>
                  <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                    style={{ paddingLeft: '34px' }}
                  />
                  <Calendar style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              {/* Start Time */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>Start Time</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    className="form-input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ paddingLeft: '34px' }}
                  >
                    {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <Clock style={{ position: 'absolute', left: '11px', top: '11px', width: '15px', height: '15px', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              {/* End Time */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                  <span>End Time</span>
                </label>
                <select 
                  className="form-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {['09:30 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:30 PM', '01:30 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:30 PM', '05:00 PM', '05:30 PM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ahead-of-Time Notification Selector */}
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--surface-sunken, #f8fafc)',
              borderRadius: '12px',
              border: '1.5px solid var(--border-color)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Bell style={{ width: '16px', height: '16px', color: '#ff6900' }} />
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Ahead-of-Time Notification Alert
                </span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Automatically triggers an executive notification banner and task alert before the meeting begins.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                {[
                  { id: '15m', label: '15 Mins Ahead' },
                  { id: '30m', label: '30 Mins Ahead' },
                  { id: '1h', label: '1 Hour Ahead' },
                  { id: '1d', label: '1 Day Ahead' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setNotificationAhead(opt.id as any)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: notificationAhead === opt.id ? '2px solid #ff6900' : '1px solid var(--border-color)',
                      backgroundColor: notificationAhead === opt.id ? 'rgba(255, 105, 0, 0.12)' : 'var(--surface, #ffffff)',
                      color: notificationAhead === opt.id ? '#ff6900' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic / Agenda Notes */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ color: 'var(--text-primary)' }}>
                <span>Meeting Agenda & Discussion Topics</span>
              </label>
              <textarea 
                className="form-input" 
                rows={3}
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                placeholder="Key talking points, milestone sign-offs, and staging deliverables to review." 
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Assigned Attendees Selector */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Required Team Attendees:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {teamUsers.map(u => {
                  const isSelected = selectedAttendees.includes(u.name);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => toggleAttendee(u.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        border: isSelected ? '1.5px solid #ff6900' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'rgba(255, 105, 0, 0.1)' : 'var(--surface, #ffffff)',
                        color: isSelected ? '#ff6900' : 'var(--text-secondary)'
                      }}
                    >
                      <img src={u.avatar} alt={u.name} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontSize: '11.5px', fontWeight: 600 }}>{u.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '12px', 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: '16px' 
            }}>
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
                style={{ padding: '8px 20px', gap: '6px' }}
              >
                <Check style={{ width: '16px', height: '16px' }} />
                <span>Confirm & Set Notification</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
