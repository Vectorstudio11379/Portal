import React, { useState } from 'react';
import { 
  LayoutGrid, 
  BarChart2, 
  Layers, 
  Users, 
  Mail, 
  Calendar, 
  Settings, 
  LogOut, 
  ChevronDown,
  FileText, 
  FolderKanban, 
  Share2, 
  CheckSquare, 
  CreditCard,
  Sparkles,
  X,
  UserCheck,
  Building2,
  KeyRound,
  GitBranch,
  MessageCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const Sidebar: React.FC = () => {
  const { state, setActiveNav, logout, isMobileSidebarOpen, closeMobileSidebar, toggleTheme } = useAgency();
  const isAdmin = state.currentRole === 'admin';
  const [settingsExpanded, setSettingsExpanded] = useState(true);

  const isAdminSettingsActive = state.activeNav === 'settings' || state.activeNav.startsWith('settings-');

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="mobile-sidebar-backdrop" 
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top">
          {/* Header Row with Brand Logo and Mobile Close Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="brand-logo" onClick={() => setActiveNav('overview')} style={{ cursor: 'pointer' }}>
              <div className="noventra-logo-icon">
                <svg viewBox="0 0 32 32" fill="none" style={{ width: '24px', height: '24px' }}>
                  <circle cx="16" cy="16" r="14" fill="#ff6900" />
                  <path 
                    d="M16 6L18.5 13.5L26 16L18.5 18.5L16 26L13.5 18.5L6 16L13.5 13.5L16 6Z" 
                    fill="#ffffff" 
                  />
                  <circle cx="16" cy="16" r="3.5" fill="#ff6900" />
                </svg>
              </div>
              <div className="noventra-brand-text">
                <span className="noventra-title">Agency OS</span>
                <span className="noventra-sub">by VectorStudio</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              type="button" 
              className="sidebar-mobile-close-btn"
              onClick={closeMobileSidebar}
              aria-label="Close Navigation"
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

        {/* ADMIN VIEW NAVIGATION */}
        {isAdmin ? (
          <>
            {/* MAIN MENU */}
            <div className="nav-group">
              <span className="nav-group-title">Main Menu</span>
              <nav className="nav-list">
                {/* 1. Dashboard */}
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'overview' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('overview')}
                >
                  <LayoutGrid className="noventra-nav-icon" />
                  <span>Dashboard</span>
                </button>

                {/* 2. Timeline Board */}
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'timeline' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('timeline')}
                >
                  <Layers className="noventra-nav-icon" />
                  <span>Timeline Board</span>
                </button>

                {/* 3. Proposal Builder */}
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'proposals' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('proposals')}
                >
                  <Sparkles className="noventra-nav-icon" />
                  <span>Proposal Builder</span>
                </button>

                {/* 4. Task Tracker */}
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'tasks' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('tasks')}
                >
                  <CheckSquare className="noventra-nav-icon" />
                  <span>Task Tracker</span>
                </button>

                {/* 5. Retainer Tracker */}
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'retainers' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('retainers')}
                >
                  <CreditCard className="noventra-nav-icon" />
                  <span>Retainer Tracker</span>
                </button>

                {/* 6. Analytics */}
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'revenue' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('revenue')}
                >
                  <BarChart2 className="noventra-nav-icon" />
                  <span>Analytics</span>
                </button>

                {/* 7. Customers */}
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'clients' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('clients')}
                >
                  <Users className="noventra-nav-icon" />
                  <span>Customers</span>
                  <ChevronDown className="noventra-chevron" />
                </button>

                {/* 8. Invoices */}
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'invoices' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('invoices')}
                >
                  <FileText className="noventra-nav-icon" />
                  <span>Invoices</span>
                </button>

                {/* 9. Messages */}
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'messages' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('messages')}
                >
                  <Mail className="noventra-nav-icon" />
                  <span>Messages</span>
                  <span className="noventra-badge-red">2</span>
                </button>

                {/* 10. Calendars */}
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'meetings' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('meetings')}
                >
                  <Calendar className="noventra-nav-icon" />
                  <span>Calendars</span>
                </button>

                {/* 11. Admin Settings with Expandable Sub-Navigation */}
                <div className="noventra-nav-collapsible-block">
                  <button 
                    type="button" 
                    className={`noventra-nav-item ${isAdminSettingsActive ? 'active-orange' : ''}`}
                    onClick={() => {
                      setSettingsExpanded(prev => !prev);
                      if (!isAdminSettingsActive) {
                        setActiveNav('settings-users');
                      }
                    }}
                  >
                    <Settings className="noventra-nav-icon" />
                    <span style={{ flex: 1, textAlign: 'left' }}>Admin Settings</span>
                    <ChevronDown 
                      style={{ 
                        width: '14px', 
                        height: '14px', 
                        opacity: 0.7,
                        transform: settingsExpanded ? 'rotate(180deg)' : 'none', 
                        transition: 'transform 0.2s ease' 
                      }} 
                    />
                  </button>

                  {/* Sub-navigation Menu for Web Dev Platform Settings */}
                  {settingsExpanded && (
                    <div className="noventra-nav-submenu">
                      <button 
                        type="button" 
                        className={`noventra-nav-subitem ${state.activeNav === 'settings-users' || state.activeNav === 'settings' ? 'subitem-active' : ''}`}
                        onClick={() => setActiveNav('settings-users')}
                      >
                        <UserCheck className="subitem-icon" />
                        <span>Team Users</span>
                      </button>

                      <button 
                        type="button" 
                        className={`noventra-nav-subitem ${state.activeNav === 'settings-clients' ? 'subitem-active' : ''}`}
                        onClick={() => setActiveNav('settings-clients')}
                      >
                        <Building2 className="subitem-icon" />
                        <span>Client Onboarding</span>
                      </button>

                      <button 
                        type="button" 
                        className={`noventra-nav-subitem ${state.activeNav === 'settings-roles' ? 'subitem-active' : ''}`}
                        onClick={() => setActiveNav('settings-roles')}
                      >
                        <KeyRound className="subitem-icon" />
                        <span>Web Dev Roles</span>
                      </button>

                      <button 
                        type="button" 
                        className={`noventra-nav-subitem ${state.activeNav === 'settings-workflow' ? 'subitem-active' : ''}`}
                        onClick={() => setActiveNav('settings-workflow')}
                      >
                        <GitBranch className="subitem-icon" />
                        <span>Project Lifecycle</span>
                      </button>

                      <button 
                        type="button" 
                        className={`noventra-nav-subitem ${state.activeNav === 'settings-integrations' ? 'subitem-active' : ''}`}
                        onClick={() => setActiveNav('settings-integrations')}
                      >
                        <MessageCircle className="subitem-icon" />
                        <span>WhatsApp & API</span>
                      </button>

                    </div>
                  )}
                </div>
              </nav>
            </div>
          </>
        ) : (
          /* CLIENT PORTAL VIEW NAVIGATION */
          <>
            <div className="nav-group">
              <span className="nav-group-title">Client Workspace</span>
              <nav className="nav-list">
                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'portal-overview' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('portal-overview')}
                >
                  <LayoutGrid className="noventra-nav-icon" />
                  <span>Project Overview</span>
                </button>

                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'portal-deliverables' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('portal-deliverables')}
                >
                  <FolderKanban className="noventra-nav-icon" />
                  <span>Pending Approvals</span>
                  <span className="noventra-badge-red">
                    {state.clientPortal.deliverables.filter(d => d.status === 'pending').length}
                  </span>
                </button>

                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'portal-files' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('portal-files')}
                >
                  <FileText className="noventra-nav-icon" />
                  <span>Shared Files</span>
                </button>

                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'portal-milestones' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('portal-milestones')}
                >
                  <Calendar className="noventra-nav-icon" />
                  <span>Milestones</span>
                </button>

                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'portal-channels' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('portal-channels')}
                >
                  <Share2 className="noventra-nav-icon" />
                  <span>Live Integrations</span>
                </button>

                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'portal-proposals' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('portal-proposals')}
                >
                  <Sparkles className="noventra-nav-icon" />
                  <span>Payment Proposals</span>
                  <span className="noventra-badge-red">
                    {(state.clientPortal.proposals || []).filter(p => p.status !== 'Paid & Active').length}
                  </span>
                </button>

                <button 
                  type="button" 
                  className={`noventra-nav-item ${state.activeNav === 'portal-invoices' ? 'active-orange' : ''}`}
                  onClick={() => setActiveNav('portal-invoices')}
                >
                  <CreditCard className="noventra-nav-icon" />
                  <span>Billing & Invoices</span>
                </button>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Sleek Bottom Sign Out Button & Opposite Theme Switcher */}
      <div className="sidebar-footer-auth">
        <button 
          type="button" 
          className="noventra-logout-btn"
          onClick={logout}
          title="Sign out of Agency OS"
        >
          <LogOut className="noventra-nav-icon logout-icon" />
          <span className="logout-text">Sign Out</span>
        </button>

        <button
          type="button"
          className="noventra-theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${state.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          {state.theme === 'dark' ? (
            <>
              <Sun className="theme-toggle-icon sun-icon" />
              <span className="theme-toggle-text">Light</span>
            </>
          ) : (
            <>
              <Moon className="theme-toggle-icon moon-icon" />
              <span className="theme-toggle-text">Dark</span>
            </>
          )}
        </button>
      </div>
    </aside>
    </>
  );
};
