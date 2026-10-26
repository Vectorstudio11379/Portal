import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  CreditCard, 
  ExternalLink, 
  Search, 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  Layers,
  Sparkles
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

interface Props {
  onBack: () => void;
}

export const RetainerTracker: React.FC<Props> = ({ onBack }) => {
  const { state, showToast, openAIAssistant } = useAgency();
  const { admin } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSheetTab, setActiveSheetTab] = useState<'retainers' | 'history' | 'hours' | 'forecast'>('retainers');

  const retainers = admin.retainers || [];

  const filteredRetainers = retainers.filter(r => {
    const matchesSearch = !searchTerm || 
      r.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tier.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tierFilter === 'all') return matchesSearch;
    if (tierFilter === 'renewals') return matchesSearch && (r.renewalDaysLeft !== undefined && r.renewalDaysLeft <= 14);
    if (tierFilter === 'warning') return matchesSearch && (r.status === 'warning' || r.status === 'alert');
    return matchesSearch && r.tier.toLowerCase().includes(tierFilter.toLowerCase());
  });

  const totalMRR = retainers.reduce((acc, r) => acc + (r.monthlyRevenue || 0), 0);
  const totalOutstanding = retainers.reduce((acc, r) => acc + (r.outstandingBalance || 0), 0);
  const upcomingRenewalsCount = retainers.filter(r => (r.renewalDaysLeft !== undefined && r.renewalDaysLeft <= 14)).length;
  const totalHoursLogged = retainers.reduce((acc, r) => acc + r.used, 0);
  const totalHoursCapacity = retainers.reduce((acc, r) => acc + r.total, 0);

  const handleSheetsSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Google Sheets: "VectorStudio_Retainers_Master_2026.xlsx" successfully synchronized (8 client rows, 12 ledger items).');
    }, 900);
  };

  const handleExportCSV = () => {
    showToast('Exporting VectorStudio_Retainers_Ledger_Q4.csv to downloads.');
  };

  const handleSendReminder = (client: string, invoiceNum?: string) => {
    showToast(`Payment reminder dispatched to ${client} for ${invoiceNum || 'upcoming renewal'}.`);
  };

  const handleLogHours = (client: string) => {
    showToast(`Time logger opened for ${client} (allocation logged).`);
  };

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
            <span className="noventra-breadcrumb-active">Retainer Tracker & Recurring Revenue</span>
          </div>
        </div>

        <div className="noventra-banner-row">
          <div>
            <h1 className="noventra-banner-title">Retainer Management & Recurring Revenue</h1>
            <p className="noventra-banner-sub">
              Track monthly recurring contracts, allocation burn rate, renewal countdowns, invoice payments, and Google Sheets 2-way sync.
            </p>
          </div>
          <div className="noventra-banner-actions">
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={() => openAIAssistant('Scan retainer accounts for upcoming renewals and burn rate warnings')}
            >
              <Sparkles style={{ width: '13px', height: '13px', color: '#ff6900' }} />
              <span className="btn-desktop-text">✨ AI Retainer Audit</span>
              <span className="btn-mobile-text">✨ AI Audit</span>
            </button>
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={handleSheetsSync}
              disabled={isSyncing}
            >
              <RefreshCw style={{ width: '13px', height: '13px', animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
              <span className="btn-desktop-text">{isSyncing ? 'Syncing...' : 'Sync with Google Sheets'}</span>
              <span className="btn-mobile-text">{isSyncing ? 'Syncing...' : 'Sync Sheets'}</span>
            </button>
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={handleExportCSV}
            >
              <Download style={{ width: '13px', height: '13px' }} />
              <span className="btn-desktop-text">Export CSV</span>
              <span className="btn-mobile-text">Export</span>
            </button>
            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={() => showToast('New Client Retainer agreement modal initialized.')}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span className="btn-desktop-text">+ New Retainer</span>
              <span className="btn-mobile-text">+ Retainer</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top Executive Metrics */}
      <div className="noventra-stat-grid-4">
        <div className="noventra-stat-box">
          <span className="stat-label">Monthly Recurring Revenue (MRR)</span>
          <span className="stat-val">${totalMRR.toLocaleString()}</span>
          <span className="stat-trend green">▲ +14.2% MoM growth &bull; On schedule</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Active Client Retainers</span>
          <span className="stat-val">{retainers.length} Accounts</span>
          <span className="stat-trend green">● 100% renewal retention rate</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Outstanding Balances</span>
          <span className="stat-val">${totalOutstanding.toLocaleString()}</span>
          <span className="stat-trend orange">● 3 pending invoices awaiting payout</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Upcoming Renewals</span>
          <span className="stat-val">{upcomingRenewalsCount} in &le; 14 Days</span>
          <span className="stat-trend green">● Vanguard AI (3d) &bull; Arc Co (7d)</span>
        </div>
      </div>

      {/* Google Sheets Integration Banner */}
      <div className="sheets-sync-banner-card">
        <div className="sheets-banner-left">
          <div className="sheets-icon-badge">
            <FileSpreadsheet style={{ width: '22px', height: '22px', color: '#0f9d58' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <h3 className="sheets-banner-title">Google Sheets 2-Way Sync Active</h3>
              <span className="noventra-status-pill status-green" style={{ fontSize: '11px', padding: '2px 8px' }}>
                ● SYNCED 2M AGO
              </span>
            </div>
            <p className="sheets-banner-sub">
              Spreadsheet: <strong>VectorStudio_Retainers_Master_2026.xlsx</strong> &bull; Auto-exports invoice settlements and hour allocation logs.
            </p>
          </div>
        </div>
        <div className="sheets-banner-actions">
          <button 
            type="button" 
            className="noventra-outline-btn"
            onClick={() => showToast('Opening spreadsheet in Google Sheets web viewer...')}
          >
            <ExternalLink style={{ width: '14px', height: '14px' }} />
            <span className="btn-desktop-text">Open in Google Sheets</span>
            <span className="btn-mobile-text">Open Sheets</span>
          </button>
          <button 
            type="button" 
            className="noventra-orange-btn"
            onClick={handleSheetsSync}
          >
            <RefreshCw style={{ width: '14px', height: '14px' }} />
            <span className="btn-desktop-text">Sync Master Sheet</span>
            <span className="btn-mobile-text">Sync Sheet</span>
          </button>
        </div>
      </div>

      {/* Sub-view Navigation Tabs */}
      <div className="timeline-toolbar-card">
        <div className="timeline-tabs-group">
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeSheetTab === 'retainers' ? 'active' : ''}`}
            onClick={() => setActiveSheetTab('retainers')}
          >
            <Layers style={{ width: '15px', height: '15px' }} />
            <span>Active Retainers Grid ({retainers.length})</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeSheetTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveSheetTab('history')}
          >
            <CreditCard style={{ width: '15px', height: '15px' }} />
            <span>Invoice & Payment History</span>
          </button>
          <button 
            type="button" 
            className={`timeline-tab-btn ${activeSheetTab === 'hours' ? 'active' : ''}`}
            onClick={() => setActiveSheetTab('hours')}
          >
            <Clock style={{ width: '15px', height: '15px' }} />
            <span>Hour Allocation Burn ({totalHoursLogged}/{totalHoursCapacity} hrs)</span>
          </button>
        </div>

        <div className="timeline-filter-pills">
          <span style={{ fontSize: '12px', color: '#78716c', fontWeight: 600 }}>Filter:</span>
          {[
            { id: 'all', label: 'All Retainers' },
            { id: 'renewals', label: 'Renewing Soon' },
            { id: 'warning', label: 'High Burn Rate' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              className={`timeline-client-filter-btn ${tierFilter === f.id ? 'active' : ''}`}
              onClick={() => setTierFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: ACTIVE RETAINERS GRID */}
      {activeSheetTab === 'retainers' && (
        <div className="retainers-overview-grid">
          {filteredRetainers.map((ret) => {
            const burnPct = Math.round((ret.used / ret.total) * 100);
            let burnColor = '#10b981';
            if (burnPct >= 80) burnColor = '#ff6900';
            if (burnPct >= 95) burnColor = '#ef4444';

            return (
              <div key={ret.id} className="retainer-card-luxury">
                <div className="retainer-card-header">
                  <div>
                    <span className="retainer-tier-pill">{ret.tier}</span>
                    <h3 className="retainer-client-name" style={{ marginTop: '6px' }}>{ret.client}</h3>
                  </div>
                  <div className="retainer-mrr-val">
                    ${ret.monthlyRevenue?.toLocaleString()}
                    <span className="mrr-sub">/ mo</span>
                  </div>
                </div>

                {/* Hour Burn Progress Bar */}
                <div className="retainer-burn-section">
                  <div className="retainer-burn-header">
                    <span className="burn-label">Allocation Burn Rate</span>
                    <span className="burn-numbers">{ret.used} / {ret.total} hrs ({burnPct}%)</span>
                  </div>
                  <div className="sprint-progress-bar-container" style={{ margin: '8px 0' }}>
                    <div 
                      className="sprint-progress-bar-fill" 
                      style={{ 
                        width: `${burnPct}%`,
                        backgroundColor: burnColor
                      }}
                    ></div>
                  </div>
                </div>

                {/* Retainer Details Matrix */}
                <div className="retainer-meta-row">
                  <div className="meta-item">
                    <span className="meta-label">Payment Channel</span>
                    <span className="meta-val">{ret.paymentMethod || 'Direct Wire Transfer'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Next Renewal</span>
                    <span className="meta-val">{ret.renewalDate || 'Nov 01, 2026'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Last Invoice</span>
                    <span className="meta-val">
                      <span className={`noventra-status-pill ${ret.lastInvoiceStatus === 'paid' ? 'status-green' : 'status-orange'}`} style={{ fontSize: '11px', padding: '2px 6px' }}>
                        {ret.lastInvoiceNum} &bull; {ret.lastInvoiceStatus?.toUpperCase()}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="retainer-card-footer">
                  <div className="renewal-countdown">
                    {ret.renewalDaysLeft !== undefined && ret.renewalDaysLeft <= 7 ? (
                      <span className="countdown-pill alert">⚠ Renews in {ret.renewalDaysLeft} days</span>
                    ) : (
                      <span className="countdown-pill normal">● Renews in {ret.renewalDaysLeft} days</span>
                    )}
                  </div>
                  <div className="retainer-btn-group">
                    <button 
                      type="button" 
                      className="noventra-outline-btn small"
                      onClick={() => handleLogHours(ret.client)}
                    >
                      Log Hours
                    </button>
                    <button 
                      type="button" 
                      className="noventra-orange-btn small"
                      onClick={() => handleSendReminder(ret.client, ret.lastInvoiceNum)}
                    >
                      {ret.lastInvoiceStatus === 'paid' ? 'Send Receipt' : 'Send Invoice'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: INVOICE & PAYMENT HISTORY TABLE */}
      {activeSheetTab === 'history' && (
        <div className="noventra-table-card">
          <div className="table-card-header">
            <div>
              <h3 className="table-card-title">Retainer Invoices & Payment Ledger</h3>
              <span className="noventra-card-subtitle">Audited monthly recurring invoices, payment gateways, and renewal receipts</span>
            </div>
            <div className="table-header-controls">
              <div className="table-search-pill">
                <input 
                  type="text" 
                  placeholder="Search invoice or client..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
              </div>
              <button 
                type="button" 
                className="table-filter-btn"
                onClick={handleExportCSV}
              >
                <span>Export Ledger</span>
                <Download style={{ width: '13px', height: '13px' }} />
              </button>
            </div>
          </div>

          <div className="table-scroll-wrapper">
            <table className="lead-tracker-table">
              <thead>
                <tr>
                  <th>Invoice No.</th>
                  <th>Client Account</th>
                  <th>Retainer Tier</th>
                  <th>Billing Amount</th>
                  <th>Payment Method</th>
                  <th>Invoice Status</th>
                  <th>Renewal Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {retainers.map((ret) => (
                  <tr key={ret.id}>
                    <td style={{ fontWeight: 700 }}>{ret.lastInvoiceNum || '#INV-2048'}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#18181b' }}>{ret.client}</span>
                    </td>
                    <td>{ret.tier}</td>
                    <td style={{ fontWeight: 800 }}>${ret.monthlyRevenue?.toLocaleString()}</td>
                    <td>{ret.paymentMethod || 'Direct Wire Transfer'}</td>
                    <td>
                      <span className={`noventra-status-pill ${ret.lastInvoiceStatus === 'paid' ? 'status-green' : 'status-orange'}`}>
                        ● {(ret.lastInvoiceStatus || 'paid').toUpperCase()}
                      </span>
                    </td>
                    <td>{ret.renewalDate}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button" 
                        className="noventra-outline-btn small"
                        style={{ marginRight: '6px' }}
                        onClick={() => showToast(`Invoice PDF downloaded for ${ret.client}`)}
                      >
                        PDF
                      </button>
                      <button 
                        type="button" 
                        className="table-action-link"
                        onClick={() => handleSendReminder(ret.client, ret.lastInvoiceNum)}
                      >
                        {ret.lastInvoiceStatus === 'paid' ? 'Receipt' : 'Reminder'} &gt;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: HOUR ALLOCATION BURN */}
      {activeSheetTab === 'hours' && (
        <div className="noventra-card">
          <div className="noventra-card-title-row">
            <div>
              <h2 className="noventra-card-heading">Retainer Hours Burn & Capacity Planning</h2>
              <span className="noventra-card-subtitle">Monthly client capacity allocation, overtime prevention, and staff utilization</span>
            </div>
            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={() => showToast('Allocation adjustment modal opened.')}
            >
              <Plus style={{ width: '14px', height: '14px' }} />
              <span>Adjust Allocations</span>
            </button>
          </div>

          <div className="noventra-table-container">
            <table className="noventra-table">
              <thead>
                <tr>
                  <th>Client Account</th>
                  <th>Contracted Tier</th>
                  <th>Logged Hours</th>
                  <th>Total Cap</th>
                  <th>Burn %</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {retainers.map(ret => {
                  const pct = Math.round((ret.used / ret.total) * 100);
                  return (
                    <tr key={ret.id}>
                      <td style={{ fontWeight: 700 }}>{ret.client}</td>
                      <td>{ret.tier}</td>
                      <td style={{ fontWeight: 700 }}>{ret.used} hrs</td>
                      <td>{ret.total} hrs</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="sprint-progress-bar-container" style={{ width: '120px', height: '7px' }}>
                            <div 
                              className="sprint-progress-bar-fill" 
                              style={{ 
                                width: `${pct}%`,
                                backgroundColor: pct > 90 ? '#ef4444' : (pct > 80 ? '#ff6900' : '#10b981')
                              }}
                            ></div>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '12px' }}>{pct}%</span>
                        </div>
                      </td>
                      <td>
                        {pct > 90 ? (
                          <span className="noventra-status-pill status-red">● HIGH BURN</span>
                        ) : pct > 75 ? (
                          <span className="noventra-status-pill status-orange">● NORMAL</span>
                        ) : (
                          <span className="noventra-status-pill status-green">● OPTIMAL</span>
                        )}
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="table-action-link"
                          onClick={() => handleLogHours(ret.client)}
                        >
                          + Log Time &gt;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
