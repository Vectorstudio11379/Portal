import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Clock,
  Sparkles,
  Calendar as CalendarIcon,
  MessageCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Users
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

interface Props {
  onBack: () => void;
}

export const MeetingsCalendar: React.FC<Props> = ({ onBack }) => {
  const { state, openModal, toggleTask, showToast, openAIAssistant, deleteMeeting } = useAgency();
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [currentYear] = useState<number>(2026);
  const [activeTab, setActiveTab] = useState<'all' | 'meetings' | 'deadlines'>('all');
  const [filterAssignee, setFilterAssignee] = useState<'all' | 'mine'>('all');

  const tasks = state.admin.tasks || [];
  const currentUserName = state.currentUser?.name || '';
  const meetings = state.meetings || state.admin.meetings || [];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar generation for October 2026 (starts on Thursday, 31 days)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 4 = Thu for Oct 2026

  const daysGrid: (number | null)[] = [];
  for (let i = 0; i < firstDayWeekday; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  // Format date helper: YYYY-MM-DD
  const formatIsoDate = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  const getMeetingsForDay = (day: number) => {
    const iso = formatIsoDate(day);
    return meetings.filter(m => {
      if (!m.date) return false;
      if (m.date === iso) return true;
      if (m.date.toLowerCase().includes(`oct ${day}`) || m.date.toLowerCase().includes(`october ${day}`)) return true;
      return false;
    });
  };

  const getTasksForDay = (day: number) => {
    const iso = formatIsoDate(day);
    return tasks.filter(t => {
      const d = t.deadline || t.dueDate || '';
      if (!d) return false;
      if (d === iso) return true;
      if (d.toLowerCase().includes(`oct ${day}`) || d.toLowerCase().includes(`october ${day}`)) return true;
      return false;
    });
  };

  const selectedDateIso = formatIsoDate(selectedDay);
  const selectedDayMeetings = meetings.filter(m => {
    if (!m.date) return false;
    if (m.date === selectedDateIso) return true;
    if (m.date.toLowerCase().includes(`oct ${selectedDay}`) || m.date.toLowerCase().includes(`october ${selectedDay}`)) return true;
    return false;
  });

  const filteredTasks = tasks.filter(t => {
    if (filterAssignee === 'mine' && currentUserName) {
      return t.assignee.toLowerCase().includes(currentUserName.toLowerCase());
    }
    return true;
  });

  const openWhatsAppForAssignee = (assigneeName: string, taskTitle: string, clientName: string) => {
    const matchedUser = state.users.find(u => 
      u.name.toLowerCase().includes(assigneeName.toLowerCase()) || 
      assigneeName.toLowerCase().includes(u.name.toLowerCase())
    );
    const num = matchedUser?.whatsappNumber || '+14155550192';
    const cleanNum = num.replace(/[^0-9]/g, '');
    const msg = `Hi ${assigneeName}, messaging you from VectorStudio Agency OS regarding upcoming schedule for "${taskTitle}" (${clientName}).`;
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    showToast(`Opening WhatsApp chat with ${assigneeName}...`);
  };

  const aheadLabelMap: Record<string, string> = {
    '15m': '15 mins ahead',
    '30m': '30 mins ahead',
    '1h': '1 hour ahead',
    '1d': '1 day ahead'
  };

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
            <span className="noventra-breadcrumb-active">Executive Master Calendar</span>
          </div>
        </div>

        <div className="noventra-banner-row">
          <div>
            <h1 className="noventra-banner-title">Full Calendar & Notification Tracker</h1>
            <p className="noventra-banner-sub">
              Full monthly schedule with automated ahead-of-time meeting notification alerts and synchronized sprint deadlines.
            </p>
          </div>
          <div className="noventra-banner-actions">
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={() => openAIAssistant('Review all scheduled calendar meetings and deadline alerts for October 2026')}
            >
              <Sparkles style={{ width: '13px', height: '13px', color: '#ff6900' }} />
              <span className="btn-desktop-text">✨ AI Schedule Audit</span>
              <span className="btn-mobile-text">✨ Audit</span>
            </button>
            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={() => openModal('meeting', { defaultDate: selectedDateIso })}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span className="btn-desktop-text">+ Schedule Meeting with Reminder</span>
              <span className="btn-mobile-text">+ Meeting</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Boxes */}
      <div className="noventra-stat-grid-4">
        <div className="noventra-stat-box">
          <span className="stat-label">Scheduled Client Meetings</span>
          <span className="stat-val">{meetings.length} Sessions</span>
          <span className="stat-trend green">● Ahead-of-time alerts active</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Active Task Deadlines</span>
          <span className="stat-val">{tasks.filter(t => !t.done).length} Due</span>
          <span className="stat-trend orange">● Tracked across sprints</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Selected Date Agenda</span>
          <span className="stat-val">
            Oct {selectedDay}, {currentYear}
          </span>
          <span className="stat-trend green">
            ● {selectedDayMeetings.length} Meeting{selectedDayMeetings.length !== 1 ? 's' : ''} scheduled
          </span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Notification Lead-Times</span>
          <span className="stat-val">15m – 1d</span>
          <span className="stat-trend green">▲ Dispatched ahead of sync</span>
        </div>
      </div>

      {/* FULL MONTHLY INTERACTIVE CALENDAR GRID */}
      <div className="noventra-card" style={{ padding: '24px', marginBottom: '24px' }}>
        {/* Calendar Month Header & Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-square icon-orange" style={{ width: '40px', height: '40px' }}>
              <CalendarIcon style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Click any calendar day to inspect scheduled syncs, tasks, and ahead-of-time notification alerts
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="noventra-outline-btn small"
              onClick={() => {
                if (currentMonth > 0) setCurrentMonth(prev => prev - 1);
              }}
              disabled={currentMonth === 0}
              title="Previous Month"
            >
              <ChevronLeft style={{ width: '14px', height: '14px' }} />
            </button>
            <button
              type="button"
              className="noventra-outline-btn small"
              onClick={() => {
                setCurrentMonth(9);
                setSelectedDay(24);
                showToast('Calendar jumped to Today (Oct 24, 2026)');
              }}
            >
              <span>Today (Oct 24)</span>
            </button>
            <button
              type="button"
              className="noventra-outline-btn small"
              onClick={() => {
                if (currentMonth < 11) setCurrentMonth(prev => prev + 1);
              }}
              disabled={currentMonth === 11}
              title="Next Month"
            >
              <ChevronRight style={{ width: '14px', height: '14px' }} />
            </button>
            <button 
              type="button" 
              className="noventra-orange-btn small"
              onClick={() => openModal('meeting', { defaultDate: selectedDateIso })}
              style={{ marginLeft: '6px' }}
            >
              <Plus style={{ width: '13px', height: '13px' }} />
              <span>+ Add Meeting</span>
            </button>
          </div>
        </div>

        {/* 7-Day Column Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '12px',
          color: 'var(--text-secondary)',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {d}
            </div>
          ))}
        </div>

        {/* 7x5 Days Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginTop: '10px'
        }}>
          {daysGrid.map((day, idx) => {
            if (day === null) {
              return (
                <div 
                  key={`empty-${idx}`} 
                  style={{
                    minHeight: '80px',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    opacity: 0.2
                  }}
                />
              );
            }

            const dayMeetings = getMeetingsForDay(day);
            const dayTasks = getTasksForDay(day);
            const isToday = day === 24 && currentMonth === 9;
            const isSelected = day === selectedDay;

            return (
              <div
                key={`day-${day}`}
                onClick={() => {
                  setSelectedDay(day);
                }}
                style={{
                  minHeight: '86px',
                  padding: '8px',
                  borderRadius: '12px',
                  border: isSelected 
                    ? '2px solid #ff6900' 
                    : (isToday ? '1.5px solid #3b82f6' : '1px solid var(--border-color)'),
                  backgroundColor: isSelected 
                    ? 'rgba(255, 105, 0, 0.08)' 
                    : (isToday ? 'rgba(59, 130, 246, 0.05)' : 'var(--surface, #ffffff)'),
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                {/* Day Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: isSelected || isToday ? 800 : 600,
                    color: isSelected ? '#ff6900' : (isToday ? '#2563eb' : 'var(--text-primary)'),
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'rgba(255, 105, 0, 0.15)' : (isToday ? 'rgba(59, 130, 246, 0.15)' : 'transparent')
                  }}>
                    {day}
                  </span>
                  {isToday && (
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                      Today
                    </span>
                  )}
                </div>

                {/* Day Event Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
                  {dayMeetings.slice(0, 2).map((m) => (
                    <div
                      key={m.id}
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 5px',
                        borderRadius: '4px',
                        backgroundColor: '#ff6900',
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                      title={`${m.title} (${m.time})`}
                    >
                      <Bell style={{ width: '9px', height: '9px', flexShrink: 0 }} />
                      <span>{m.title}</span>
                    </div>
                  ))}

                  {dayTasks.slice(0, 1).map((t) => (
                    <div
                      key={t.id}
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 600,
                        padding: '1px 4px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                        color: '#2563eb',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={`Due: ${t.title}`}
                    >
                      ✓ {t.title}
                    </div>
                  ))}

                  {dayMeetings.length > 2 && (
                    <span style={{ fontSize: '9px', color: '#ff6900', fontWeight: 700 }}>
                      +{dayMeetings.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER & TABS TOOLBAR */}
      <div className="timeline-toolbar-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Viewing: Oct {selectedDay}, {currentYear}
            </span>
            <span className="retainer-tier-pill" style={{ fontSize: '11px' }}>
              {selectedDayMeetings.length} Meeting{selectedDayMeetings.length !== 1 ? 's' : ''} &bull; {getTasksForDay(selectedDay).length} Task Deadlines
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div className="timeline-tabs-group" style={{ margin: 0 }}>
              <button 
                type="button" 
                className={`timeline-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <span>All Scheduled Items</span>
              </button>
              <button 
                type="button" 
                className={`timeline-tab-btn ${activeTab === 'meetings' ? 'active' : ''}`}
                onClick={() => setActiveTab('meetings')}
              >
                <span>Meetings with Notification ({meetings.length})</span>
              </button>
              <button 
                type="button" 
                className={`timeline-tab-btn ${activeTab === 'deadlines' ? 'active' : ''}`}
                onClick={() => setActiveTab('deadlines')}
              >
                <span>Task Deadlines ({tasks.length})</span>
              </button>
            </div>

            <button
              type="button"
              className={`timeline-client-filter-btn ${filterAssignee === 'mine' ? 'active' : ''}`}
              onClick={() => setFilterAssignee(prev => prev === 'mine' ? 'all' : 'mine')}
              style={{ fontWeight: 700 }}
            >
              {filterAssignee === 'mine' ? '✓ Showing My Deadlines' : 'Filter: My Deadlines'}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: SCHEDULED MEETINGS WITH NOTIFICATION AHEAD OF TIME */}
      {(activeTab === 'all' || activeTab === 'meetings') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="metric-icon-square icon-orange" style={{ width: '32px', height: '32px' }}>
                <Bell style={{ width: '16px', height: '16px' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Scheduled Meetings & Ahead-of-Time Notification Alerts
              </h3>
            </div>
            <button 
              type="button" 
              className="noventra-orange-btn small"
              onClick={() => openModal('meeting', { defaultDate: selectedDateIso })}
            >
              <Plus style={{ width: '13px', height: '13px' }} />
              <span>+ Schedule Meeting</span>
            </button>
          </div>

          {/* List meetings for selected day or upcoming */}
          {(selectedDayMeetings.length > 0 ? selectedDayMeetings : meetings).map((meeting) => (
            <div key={meeting.id} className="noventra-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span className="retainer-tier-pill">{meeting.client}</span>
                    <span className="noventra-status-pill status-orange" style={{ fontSize: '11px' }}>
                      <Clock style={{ width: '12px', height: '12px' }} />
                      {meeting.date} &bull; {meeting.time}
                    </span>
                    <span 
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'rgba(255, 105, 0, 0.12)',
                        color: '#ff6900',
                        border: '1px solid rgba(255, 105, 0, 0.25)'
                      }}
                    >
                      <Bell style={{ width: '11px', height: '11px' }} />
                      <span>Alert: {aheadLabelMap[meeting.notificationAhead] || '30 mins ahead'}</span>
                    </span>
                  </div>

                  <h3 className="noventra-card-heading" style={{ fontSize: '17px', margin: '6px 0 4px' }}>
                    {meeting.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 10px', maxWidth: '780px', lineHeight: 1.5 }}>
                    {meeting.topic}
                  </p>

                  {/* Attendees List */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users style={{ width: '14px', height: '14px', color: 'var(--text-secondary)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Attendees: {meeting.attendees?.join(', ') || 'Owais Anwer'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className="noventra-outline-btn small"
                    onClick={() => {
                      showToast(`🔔 Notification confirmed: Alert will fire ${aheadLabelMap[meeting.notificationAhead]} before meeting`);
                    }}
                  >
                    <Bell style={{ width: '13px', height: '13px' }} />
                    <span>Test Alert</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteMeeting(meeting.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      backgroundColor: 'rgba(239, 68, 68, 0.08)',
                      color: '#ef4444',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title="Cancel and remove meeting from calendar"
                  >
                    <Trash2 style={{ width: '13px', height: '13px' }} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {meetings.length === 0 && (
            <div className="noventra-card" style={{ padding: '36px', textAlign: 'center' }}>
              <CalendarIcon style={{ width: '36px', height: '36px', color: '#ff6900', margin: '0 auto 8px' }} />
              <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>No Scheduled Meetings</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '6px 0 16px' }}>
                Schedule strategic client reviews with ahead-of-time notification alerts.
              </p>
              <button 
                type="button" 
                className="noventra-orange-btn"
                onClick={() => openModal('meeting', { defaultDate: selectedDateIso })}
              >
                + Schedule Meeting with Reminder
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: TASK DEADLINES & DELIVERABLES */}
      {(activeTab === 'all' || activeTab === 'deadlines') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="metric-icon-square icon-orange" style={{ width: '32px', height: '32px' }}>
                <CalendarIcon style={{ width: '16px', height: '16px' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Deliverable Deadlines & Task Schedules
              </h3>
            </div>
            <button 
              type="button" 
              className="noventra-outline-btn small"
              onClick={() => openModal('task')}
            >
              + Assign Task
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {filteredTasks.map((t) => {
              const isMine = Boolean(currentUserName) && t.assignee.toLowerCase().includes(currentUserName.toLowerCase());
              const deadlineDate = t.deadline || t.dueDate || 'Oct 28, 2026';

              return (
                <div 
                  key={t.id} 
                  className="noventra-card" 
                  style={{ 
                    padding: '18px',
                    border: isMine ? '2px solid #ff6900' : '1px solid var(--border-color)',
                    backgroundColor: t.done ? 'var(--surface-sunken)' : 'var(--card-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className={`task-priority-tag priority-${t.priority.toLowerCase()}`}>
                        {t.priority}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="retainer-tier-pill" style={{ fontSize: '11px' }}>{t.client}</span>
                        {isMine && (
                          <span className="noventra-status-pill status-orange" style={{ fontSize: '9px', padding: '1px 6px' }}>
                            ASSIGNED TO YOU
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 style={{ 
                      fontSize: '14.5px', 
                      fontWeight: 700, 
                      color: 'var(--text-primary)', 
                      margin: '0 0 6px',
                      textDecoration: t.done ? 'line-through' : 'none',
                      opacity: t.done ? 0.6 : 1
                    }}>
                      {t.title}
                    </h4>

                    {t.description && (
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
                        {t.description}
                      </p>
                    )}
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: '12px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img 
                        src={t.avatar} 
                        alt={t.assignee} 
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {t.assignee}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11.5px', color: '#ff6900', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock style={{ width: '12px', height: '12px' }} />
                        {deadlineDate}
                      </span>

                      <button
                        type="button"
                        onClick={() => openWhatsAppForAssignee(t.assignee, t.title, t.client)}
                        className="noventra-whatsapp-btn small"
                        title="Send WhatsApp deadline ping"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                      >
                        <MessageCircle style={{ width: '12px', height: '12px' }} />
                      </button>

                      <button 
                        type="button" 
                        className={t.done ? "noventra-outline-btn small" : "noventra-orange-btn small"}
                        onClick={() => toggleTask(t.id)}
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        {t.done ? 'Reopen' : 'Done ✓'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
