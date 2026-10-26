import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  SlidersHorizontal, 
  Menu, 
  Check, 
  Clock, 
  CreditCard, 
  FileText, 
  FolderKanban, 
  Users, 
  LogOut, 
  Settings, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Sun,
  Moon,
  Camera
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const Header: React.FC = () => {
  const { 
    state, 
    setRole, 
    setSearchQuery, 
    setActiveNav, 
    logout, 
    showToast,
    toggleMobileSidebar,
    notifications,
    markNotificationsAsRead,
    openAIAssistant,
    toggleTheme,
    openModal
  } = useAgency();

  const isAdmin = state.currentRole === 'admin';
  const user = state.currentUser;

  // Dropdown & Popover States
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All Operations');

  const searchRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setShowFiltersMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotificationsMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock search results based on query
  const query = state.searchQuery.toLowerCase().trim();
  const searchResults = [
    { type: 'Client CRM', title: 'Arc Company', sub: 'Active Retainer • 34/40 hrs', nav: 'clients', icon: Users },
    { type: 'Client CRM', title: 'Nexus Labs', sub: 'In Discussion • $14.2K SOW', nav: 'clients', icon: Users },
    { type: 'Proposal', title: 'Sprint 4 SOW & Architecture', sub: '$34,500 USD • Approved', nav: 'proposals', icon: Sparkles },
    { type: 'Invoice', title: 'INV-2026-088 (Arc Monthly Retainer)', sub: '$12,800 USD • Paid', nav: 'invoices', icon: CreditCard },
    { type: 'Deliverable', title: 'Figma UI Kit v2.4 (Design System)', sub: 'Approved by Arc Executive', nav: 'deliverables', icon: FileText },
    { type: 'Task Kanban', title: 'High-Fidelity Interaction Polish', sub: 'In Review • Carlos Mendes', nav: 'tasks', icon: FolderKanban },
  ].filter(item => !query || item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query));

  return (
    <header className="noventra-header">
      {/* Left: Hamburger & Greeting */}
      <div className="noventra-header-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Hamburger Toggle Button */}
          <button 
            type="button" 
            className="noventra-hamburger-btn"
            onClick={toggleMobileSidebar}
            aria-label="Toggle Navigation Menu"
            title="Open Menu"
          >
            <Menu style={{ width: '20px', height: '20px' }} />
          </button>

          <div>
            <h1 className="noventra-greeting">
              Welcome Back, {user?.name?.split(' ')[0] || (isAdmin ? 'Owais' : 'Sarah')}
            </h1>
            <p className="noventra-greeting-sub">
              {isAdmin 
                ? 'Executive overview for VectorStudio agency operations & financial streams.' 
                : `Client Portal workspace for ${state.clientPortal.clientName} & deliverable approvals.`}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Search, Tools, Profile & Role Switcher */}
      <div className="noventra-header-right">
        {/* Role Switcher Pill */}
        <div className="noventra-role-toggle">
          <button 
            type="button" 
            className={`noventra-role-btn ${isAdmin ? 'active' : ''}`}
            onClick={() => setRole('admin')}
            title="Switch to Admin Dashboard"
          >
            Admin
          </button>
          <button 
            type="button" 
            className={`noventra-role-btn ${!isAdmin ? 'active' : ''}`}
            onClick={() => setRole('client')}
            title="Switch to Client Portal"
          >
            Client Portal
          </button>
        </div>

        {/* Search Pill Input with Interactive Results Popover */}
        <div className="search-pill-wrapper" ref={searchRef} style={{ position: 'relative' }}>
          <div className="noventra-search-pill">
            <input 
              type="text" 
              placeholder="Search projects, clients, invoices..." 
              value={state.searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
            />
            <button 
              type="button" 
              className="noventra-search-icon-btn" 
              aria-label="Search"
              onClick={() => setShowSearchDropdown(prev => !prev)}
            >
              <Search style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Interactive Live Search Dropdown */}
          {showSearchDropdown && (
            <div className="header-dropdown-menu search-results-popover">
              <div className="dropdown-header-row">
                <span className="dropdown-title">Quick Search Results</span>
                <span className="dropdown-count">{searchResults.length} matches</span>
              </div>
              <div className="dropdown-items-scroll">
                {searchResults.length === 0 ? (
                  <div className="dropdown-empty-state">No matching projects or records found.</div>
                ) : (
                  searchResults.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div 
                        key={idx}
                        className="search-result-row"
                        onClick={() => {
                          setActiveNav(item.nav);
                          setShowSearchDropdown(false);
                          showToast(`Navigating to ${item.type}: ${item.title}`);
                        }}
                      >
                        <div className="search-result-icon">
                          <IconComp style={{ width: '15px', height: '15px' }} />
                        </div>
                        <div className="search-result-info">
                          <div className="search-result-title-row">
                            <span className="search-result-title">{item.title}</span>
                            <span className="search-result-badge">{item.type}</span>
                          </div>
                          <span className="search-result-sub">{item.sub}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="dropdown-footer-link" onClick={() => { setActiveNav(isAdmin ? 'overview' : 'portal-overview'); setShowSearchDropdown(false); }}>
                <span>Press Enter to search entire VectorStudio registry</span>
                <ExternalLink style={{ width: '12px', height: '12px' }} />
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Filter Scope Popover */}
        <div style={{ position: 'relative' }} ref={filtersRef}>
          <button 
            type="button" 
            className={`noventra-circle-btn ${showFiltersMenu ? 'btn-active' : ''}`}
            title="Filter Operational Scope"
            onClick={() => setShowFiltersMenu(prev => !prev)}
          >
            <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
          </button>

          {showFiltersMenu && (
            <div className="header-dropdown-menu filter-scope-popover">
              <div className="dropdown-header-row">
                <span className="dropdown-title">Filter Operations View</span>
              </div>
              {['All Operations', 'Clients CRM Only', 'Financials & Invoices', 'Proposals Pipeline', 'Active Tasks'].map((filterOption) => (
                <div 
                  key={filterOption}
                  className={`menu-action-item ${selectedFilter === filterOption ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedFilter(filterOption);
                    setShowFiltersMenu(false);
                    showToast(`View filtered to: ${filterOption}`);
                  }}
                >
                  <span>{filterOption}</span>
                  {selectedFilter === filterOption && <Check style={{ width: '14px', height: '14px', color: '#ff6900' }} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VectorAI Copilot Launch Button (Admin Only) */}
        {isAdmin && (
          <button 
            type="button" 
            className="noventra-ai-copilot-pill"
            onClick={() => openAIAssistant()}
            title="Launch VectorAI Executive Copilot (Ctrl+K)"
          >
            <Sparkles style={{ width: '14px', height: '14px', color: '#ff6900' }} />
            <span className="btn-desktop-text">AI Copilot</span>
            <span className="btn-mobile-text">AI</span>
            <span className="ai-kbd-tag">⌘K</span>
          </button>
        )}

        {/* Action Button: Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            type="button" 
            className={`noventra-circle-btn noventra-bell-btn ${showNotificationsMenu ? 'btn-active' : ''}`} 
            title="Notifications Center"
            onClick={() => setShowNotificationsMenu(prev => !prev)}
          >
            <Bell style={{ width: '16px', height: '16px' }} />
            {notifications.some(n => n.unread) && <span className="noventra-bell-dot"></span>}
          </button>

          {showNotificationsMenu && (
            <div className="header-dropdown-menu notifications-popover">
              <div className="dropdown-header-row">
                <span className="dropdown-title">Agency Notifications</span>
                <button 
                  type="button" 
                  className="dropdown-mark-read"
                  onClick={() => markNotificationsAsRead()}
                >
                  Mark all read
                </button>
              </div>

              <div className="notification-items-list">
                {notifications.length === 0 ? (
                  <div className="dropdown-empty-state">No new notifications.</div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`notification-item ${notif.unread ? 'unread' : ''}`}
                      onClick={() => {
                        if (notif.nav) setActiveNav(notif.nav);
                        setShowNotificationsMenu(false);
                      }}
                    >
                      <div className={`notif-icon-circle ${notif.type}`}>
                        {notif.type === 'green' && <Check style={{ width: '14px', height: '14px' }} />}
                        {notif.type === 'blue' && <CreditCard style={{ width: '14px', height: '14px' }} />}
                        {notif.type === 'orange' && <Clock style={{ width: '14px', height: '14px' }} />}
                        {notif.type === 'purple' && <Sparkles style={{ width: '14px', height: '14px' }} />}
                      </div>
                      <div className="notif-content">
                        <span className="notif-title">{notif.title}</span>
                        <span className="notif-meta">{notif.meta}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="dropdown-footer-link" onClick={() => { setActiveNav('overview'); setShowNotificationsMenu(false); }}>
                <span>View all activity audit logs</span>
                <ChevronDown style={{ width: '12px', height: '12px' }} />
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Quick Theme Toggle */}
        <button
          type="button"
          className="noventra-circle-btn noventra-theme-header-btn"
          title={`Switch to ${state.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {state.theme === 'dark' ? (
            <Sun style={{ width: '16px', height: '16px', color: '#ff6900' }} />
          ) : (
            <Moon style={{ width: '16px', height: '16px', color: '#475569' }} />
          )}
        </button>

        {/* User Profile Avatar with Interactive Account Dropdown (Only Profile Image) */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button 
            type="button"
            className={`noventra-profile-avatar-btn ${showProfileMenu ? 'profile-active' : ''}`}
            onClick={() => setShowProfileMenu(prev => !prev)}
            aria-label="User Account & Security"
            title={`${user?.name || (isAdmin ? 'Owais Anwer' : 'Sarah Jenkins')} (${user?.role === 'admin' ? (user.adminRoleTitle || 'Executive Admin') : (user?.clientAccount || 'Arc Company')})`}
          >
            <img 
              src={user?.avatar || (isAdmin ? '/assets/images/owais.jpg' : '/assets/images/tommy.jpg')} 
              alt="Profile Avatar" 
              className="noventra-profile-img" 
            />
          </button>

          {/* Interactive User Account Menu */}
          {showProfileMenu && (
            <div className="header-dropdown-menu profile-popover">
              <div className="profile-popover-header">
                <img 
                  src={user?.avatar || (isAdmin ? '/assets/images/owais.jpg' : '/assets/images/tommy.jpg')} 
                  alt="Profile Avatar" 
                  className="popover-avatar" 
                />
                <div className="popover-info">
                  <span className="popover-name">{user?.name || (isAdmin ? 'Owais Anwer' : 'Sarah Jenkins')}</span>
                  <span className="popover-email">{user?.email || (isAdmin ? 'owais@vectorstudio.co' : 'sarah@arc.security')}</span>
                  <span className="popover-badge">
                    <ShieldCheck style={{ width: '12px', height: '12px' }} />
                    {isAdmin ? 'SuperAdmin & Managing Director' : 'Verified Client Partner'}
                  </span>
                </div>
              </div>

              <div className="menu-divider"></div>

              {/* Role Quick Toggle */}
              <div className="profile-role-section">
                <span className="section-label">Active Workspace Role</span>
                <div className="profile-role-grid">
                  <button 
                    type="button" 
                    className={`role-select-card ${isAdmin ? 'selected' : ''}`}
                    onClick={() => { setRole('admin'); setShowProfileMenu(false); }}
                  >
                    <span className="role-card-title">Executive Admin</span>
                    <span className="role-card-desc">Full agency operations & financials</span>
                  </button>
                  <button 
                    type="button" 
                    className={`role-select-card ${!isAdmin ? 'selected' : ''}`}
                    onClick={() => { setRole('client'); setShowProfileMenu(false); }}
                  >
                    <span className="role-card-title">Client Portal</span>
                    <span className="role-card-desc">Arc Company project deliverables</span>
                  </button>
                </div>
              </div>

              <div className="menu-divider"></div>

              {/* Navigation Actions */}
              <div 
                className="menu-action-item"
                onClick={() => { setShowProfileMenu(false); openModal('user_profile'); }}
                style={{ fontWeight: 600, color: 'var(--text-primary)' }}
              >
                <Camera style={{ width: '15px', height: '15px', color: '#ff6900' }} />
                <span>Change Profile Photo & Avatar</span>
              </div>

              <div 
                className="menu-action-item"
                onClick={() => { setActiveNav('settings'); setShowProfileMenu(false); }}
              >
                <Settings style={{ width: '15px', height: '15px', color: '#78716c' }} />
                <span>Admin Settings & RBAC Roles</span>
              </div>

              <div 
                className="menu-action-item"
                onClick={() => { setActiveNav('timeline'); setShowProfileMenu(false); }}
              >
                <FolderKanban style={{ width: '15px', height: '15px', color: '#78716c' }} />
                <span>Project Timeline & Sprints</span>
              </div>

              <div 
                className="menu-action-item"
                onClick={() => toggleTheme()}
              >
                {state.theme === 'dark' ? (
                  <>
                    <Sun style={{ width: '15px', height: '15px', color: '#ff6900' }} />
                    <span>Switch to Light Theme</span>
                  </>
                ) : (
                  <>
                    <Moon style={{ width: '15px', height: '15px', color: '#6366f1' }} />
                    <span>Switch to Dark Theme</span>
                  </>
                )}
              </div>

              <div className="menu-divider"></div>

              {/* Sign Out */}
              <div 
                className="menu-action-item logout"
                onClick={() => { setShowProfileMenu(false); logout(); }}
              >
                <LogOut style={{ width: '15px', height: '15px', color: '#dc2626' }} />
                <span style={{ color: '#dc2626', fontWeight: '700' }}>Sign Out of Agency OS</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
