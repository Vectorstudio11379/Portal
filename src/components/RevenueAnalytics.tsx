import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  FileSpreadsheet
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

interface Props {
  onBack: () => void;
}

export const RevenueAnalytics: React.FC<Props> = ({ onBack }) => {
  const { state, showToast } = useAgency();
  const [selectedMonth, setSelectedMonth] = useState('Apr');

  const monthlyHistory = [
    { month: 'January', gross: 38200, mrr: 35000, clients: 6, retention: '92%' },
    { month: 'February', gross: 41500, mrr: 38000, clients: 6, retention: '94%' },
    { month: 'March', gross: 44000, mrr: 42000, clients: 7, retention: '95%' },
    { month: 'April', gross: 48250, mrr: 48250, clients: 8, retention: '100%' },
    { month: 'May (Projected)', gross: 52000, mrr: 50000, clients: 9, retention: '100%' },
    { month: 'June (Projected)', gross: 55000, mrr: 52000, clients: 10, retention: '100%' }
  ];

  const handleExportPDF = () => {
    window.print();
    showToast('✓ Print / PDF dialogue opened for Revenue Analytics report.');
  };

  const handleSyncToSheets = () => {
    const headers = ['Month', 'Gross Revenue (USD)', 'MRR (USD)', 'Active Clients', 'Retention Rate'];
    const rows = monthlyHistory.map(m => [
      `"${m.month}"`,
      m.gross,
      m.mrr,
      m.clients,
      `"${m.retention}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'VectorStudio_Revenue_Model_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ VectorStudio_Revenue_Model_2026.csv exported for Google Sheets.');
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
            <span className="noventra-breadcrumb-active">Revenue & Financial Stream Analytics</span>
          </div>
        </div>

        <div className="noventra-banner-row">
          <div>
            <h1 className="noventra-banner-title">Revenue & Retainer Stream Analytics</h1>
            <p className="noventra-banner-sub">
              Multi-layer sinuous streamgraph, monthly run-rate expansion, client lifetime value, and cash-flow projections.
            </p>
          </div>
          <div className="noventra-banner-actions">
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={handleExportPDF}
            >
              <Download style={{ width: '14px', height: '14px' }} />
              <span>Export PDF Report</span>
            </button>
            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={handleSyncToSheets}
            >
              <FileSpreadsheet style={{ width: '15px', height: '15px' }} />
              <span>Sync to Sheets</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Boxes */}
      <div className="noventra-stat-grid-4">
        <div className="noventra-stat-box">
          <span className="stat-label">Total Year-to-Date Revenue</span>
          <span className="stat-val">$241,600</span>
          <span className="stat-trend green">▲ +24.8% vs last year</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Monthly Run-Rate (MRR)</span>
          <span className="stat-val">${state.admin.revenue.toLocaleString()}</span>
          <span className="stat-trend green">▲ 8 active client retainers</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Average Contract Value</span>
          <span className="stat-val">$18,400</span>
          <span className="stat-trend orange">● 92% retention rate</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Net Retention Rate</span>
          <span className="stat-val">65%</span>
          <span className="stat-trend green">▲ +18% vs last month</span>
        </div>
      </div>

      {/* Sinuous Ribbon Streamgraph Card */}
      <div className="noventra-card" style={{ marginTop: '22px' }}>
        <div className="noventra-card-title-row">
          <div>
            <h2 className="noventra-card-heading">Multi-Layer Financial Streamgraph (Q1 - Q2 2026)</h2>
            <span className="noventra-card-subtitle">Visual sinuous wave of recurring revenue, retainer hours, and milestone payouts</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => (
              <button
                key={m}
                type="button"
                className={`timeline-client-filter-btn ${selectedMonth === m ? 'active' : ''}`}
                onClick={() => { setSelectedMonth(m); showToast(`Revenue focus shifted to ${m} 2026.`); }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Streamgraph */}
        <div className="revenue-stream-container" style={{ height: '240px', marginTop: '14px' }}>
          <svg viewBox="0 0 540 160" className="revenue-stream-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="warmStreamGradFull" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#ea580c" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#d97706" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="coolStreamGradFull" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fdba74" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="midStreamGradFull" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#a7f3d0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Lower Cool Layer */}
            <path
              d="M 20 85 C 100 82, 160 88, 220 86 C 280 84, 320 72, 380 65 C 440 58, 480 50, 520 48 L 520 120 C 480 122, 440 125, 380 115 C 320 105, 280 95, 220 92 C 160 90, 100 95, 20 96 Z"
              fill="url(#coolStreamGradFull)"
            />

            {/* Mid Layer */}
            <path
              d="M 20 70 C 100 68, 160 74, 220 78 C 280 82, 320 80, 380 72 C 440 64, 480 58, 520 54 L 520 102 C 480 106, 440 108, 380 102 C 320 96, 280 90, 220 88 C 160 86, 100 80, 20 78 Z"
              fill="url(#midStreamGradFull)"
            />

            {/* Upper Warm Layer */}
            <path
              d="M 20 50 C 80 48, 140 52, 200 68 C 260 84, 310 82, 360 78 C 420 74, 460 70, 520 68 L 520 88 C 460 90, 420 92, 360 88 C 310 84, 260 86, 200 82 C 140 78, 80 74, 20 72 Z"
              fill="url(#warmStreamGradFull)"
            />

            {/* Vertical Marker */}
            <line x1="380" y1="18" x2="380" y2="140" stroke="#18181b" strokeWidth="1.2" strokeDasharray="3 3" />

            <g transform="translate(362, 10)">
              <rect x="0" y="0" width="36" height="20" rx="10" fill="#18181b" />
              <text x="18" y="14" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle">82%</text>
            </g>
            <g transform="translate(362, 126)">
              <rect x="0" y="0" width="36" height="20" rx="10" fill="#f4f3ef" stroke="#e5e3dc" strokeWidth="1" />
              <text x="18" y="14" fill="#18181b" fontSize="10.5" fontWeight="700" textAnchor="middle">24%</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="noventra-table-card" style={{ marginTop: '22px' }}>
        <div className="table-card-header">
          <div>
            <h3 className="table-card-title">Monthly Run-Rate Expansion & Audit</h3>
            <span className="noventra-card-subtitle">Verified client settlements, bank wire streams, and account retention</span>
          </div>
        </div>

        <div className="table-scroll-wrapper">
          <table className="lead-tracker-table">
            <thead>
              <tr>
                <th>Billing Month</th>
                <th>Gross Volume</th>
                <th>Retainer Recurring (MRR)</th>
                <th>Active Retainer Accounts</th>
                <th>Retention Rate</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {monthlyHistory.map((m, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800, color: '#18181b' }}>{m.month}</td>
                  <td style={{ fontWeight: 700 }}>${m.gross.toLocaleString()}</td>
                  <td style={{ fontWeight: 800, color: '#ff6900' }}>${m.mrr.toLocaleString()}</td>
                  <td>{m.clients} Accounts</td>
                  <td>
                    <span className="noventra-status-pill status-green">
                      ● {m.retention}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      type="button" 
                      className="table-action-link"
                      onClick={() => showToast(`Opening audited breakdown for ${m.month}`)}
                    >
                      Audit View &gt;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
