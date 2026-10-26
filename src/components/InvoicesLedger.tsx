import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Download
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

interface Props {
  onBack: () => void;
}

export const InvoicesLedger: React.FC<Props> = ({ onBack }) => {
  const { state, openModal, showToast, dispatchNotification } = useAgency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const invoices = state.admin.invoices || [];

  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Client', 'Description', 'Amount', 'Paid Amount', 'Status', 'Payment Method'];
    const rows = invoices.map(inv => [
      inv.num,
      `"${inv.client}"`,
      `"${inv.desc.replace(/"/g, '""')}"`,
      inv.amount,
      inv.paidAmount || 0,
      inv.status,
      `"${inv.paymentMethod || 'Wire/Direct'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VectorStudio_Invoices_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ VectorStudio_Invoices_2026.csv downloaded successfully!');
  };

  const handleDownloadPDF = (inv: typeof invoices[0]) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${inv.num} - ${inv.client}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #18181b; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #ff6900; padding-bottom: 20px; }
              .title { font-size: 28px; font-weight: 800; color: #ff6900; }
              .meta { margin-top: 24px; font-size: 14px; line-height: 1.6; }
              .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
              .table th, .table td { border-bottom: 1px solid #e4e4e7; padding: 12px 8px; text-align: left; }
              .total { text-align: right; font-size: 20px; font-weight: 800; margin-top: 24px; color: #18181b; }
              .status { display: inline-block; padding: 4px 12px; border-radius: 999px; background: #ecfdf5; color: #059669; font-weight: 700; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="title">VECTORSTUDIO</div>
                <p>Executive Digital Agency & Product Studio<br/>San Francisco, CA • billing@vectorstudio.design</p>
              </div>
              <div style="text-align: right;">
                <h2>INVOICE</h2>
                <p><strong>${inv.num}</strong><br/>Issued: ${inv.paymentDate || 'Oct 2026'}</p>
              </div>
            </div>
            <div class="meta">
              <p><strong>Billed To:</strong> ${inv.client}<br/><strong>Payment Status:</strong> <span class="status">${inv.status.toUpperCase()}</span></p>
            </div>
            <table class="table">
              <thead><tr><th>Item Description</th><th style="text-align: right;">Amount (USD)</th></tr></thead>
              <tbody><tr><td>${inv.desc}</td><td style="text-align: right;">$${inv.amount.toLocaleString()}</td></tr></tbody>
            </table>
            <div class="total">Total: $${inv.amount.toLocaleString()} USD</div>
            <script>window.onload = function() { window.print(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
    showToast(`✓ Invoice ${inv.num} printable receipt generated.`);
  };

  const handleSendReminder = (inv: typeof invoices[0]) => {
    dispatchNotification(
      `Payment Reminder Sent`,
      `Reminder dispatched to ${inv.client} for invoice ${inv.num} ($${inv.amount.toLocaleString()}).`,
      'orange',
      'invoices'
    );
    showToast(`✓ Payment reminder dispatched to ${inv.client}`);
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = !searchTerm || 
      inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.num.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPending = invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0);

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
            <span className="noventra-breadcrumb-active">Invoices & Financial Ledger</span>
          </div>
        </div>

        <div className="noventra-banner-row">
          <div>
            <h1 className="noventra-banner-title">Invoices & Accounts Receivable</h1>
            <p className="noventra-banner-sub">
              Audited registry of client retainers, milestone billings, direct bank wire settlements, and accounts receivable.
            </p>
          </div>
          <div className="noventra-banner-actions">
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={handleExportCSV}
            >
              <Download style={{ width: '14px', height: '14px' }} />
              <span>Export CSV</span>
            </button>
            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={() => openModal('invoice')}
            >
              <Plus style={{ width: '15px', height: '15px' }} />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Boxes */}
      <div className="noventra-stat-grid-4">
        <div className="noventra-stat-box">
          <span className="stat-label">Pending Receivables</span>
          <span className="stat-val">${totalPending.toLocaleString()}</span>
          <span className="stat-trend orange">● 3 invoices awaiting payment</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Paid Year-to-Date</span>
          <span className="stat-val">${(totalPaid + 66800).toLocaleString()}</span>
          <span className="stat-trend green">▲ +24.8% vs last year</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Monthly Run-Rate (MRR)</span>
          <span className="stat-val">$48,250</span>
          <span className="stat-trend green">▲ 8 active retainers</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Avg. Payment Speed</span>
          <span className="stat-val">2.4 Days</span>
          <span className="stat-trend green">● Direct Wire & Bank Settlements</span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="timeline-toolbar-card">
        <div className="timeline-tabs-group">
          {(['all', 'paid', 'pending', 'overdue'] as const).map(tab => (
            <button 
              key={tab}
              type="button" 
              className={`timeline-tab-btn ${statusFilter === tab ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab)}
            >
              <span>{tab.toUpperCase()} ({tab === 'all' ? invoices.length : invoices.filter(i => i.status === tab).length})</span>
            </button>
          ))}
        </div>

        <div className="table-search-pill" style={{ minWidth: '240px' }}>
          <input 
            type="text" 
            placeholder="Search invoice or client..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <Search style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
        </div>
      </div>

      {/* Invoices Table Card */}
      <div className="noventra-table-card">
        <div className="table-card-header">
          <div>
            <h3 className="table-card-title">Audited Invoice Registry</h3>
            <span className="noventra-card-subtitle">All project invoices with off-platform bank wire and milestone payment tracking</span>
          </div>
          <button 
            type="button" 
            className="noventra-orange-btn small"
            onClick={() => openModal('record_payment')}
            style={{ gap: '6px' }}
          >
            <Plus style={{ width: '13px', height: '13px' }} />
            <span>Record Payment</span>
          </button>
        </div>

        <div className="table-scroll-wrapper">
          <table className="lead-tracker-table">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Client Account</th>
                <th>Billing Description</th>
                <th>Payable / Paid</th>
                <th>Settlement Method</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => {
                const isPaid = inv.status === 'paid';
                const isPart = inv.status === 'partially_paid';
                const paidAmt = inv.paidAmount || (isPaid ? inv.amount : 0);
                const remaining = Math.max(0, inv.amount - paidAmt);

                return (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 800, color: '#18181b' }}>{inv.num}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#18181b' }}>{inv.client}</span>
                    </td>
                    <td style={{ color: '#475569' }}>{inv.desc}</td>
                    <td>
                      <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#18181b', display: 'block' }}>
                        ${inv.amount.toLocaleString()}
                      </span>
                      {paidAmt > 0 && !isPaid && (
                        <span style={{ fontSize: '11px', color: '#ff6900', fontWeight: 600 }}>
                          Paid: ${paidAmt.toLocaleString()} • Due: ${remaining.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#4b5563' }}>
                        {inv.paymentMethod || 'Direct Wire Transfer'}
                      </span>
                      {inv.paymentDate && (
                        <span style={{ fontSize: '10.5px', color: '#9ca3af', display: 'block' }}>
                          {inv.paymentDate}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`noventra-status-pill ${isPaid ? 'status-green' : (isPart ? 'status-orange' : 'status-gray')}`}>
                        ● {isPaid ? 'PAID' : (isPart ? 'PARTIAL' : inv.status.toUpperCase())}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {!isPaid && (
                          <button 
                            type="button" 
                            className="noventra-orange-btn small"
                            onClick={() => openModal('record_payment', { invoiceId: inv.id })}
                            style={{ padding: '3px 8px', fontSize: '11px' }}
                          >
                            <span>Record Payment</span>
                          </button>
                        )}
                        <button 
                          type="button" 
                          className="noventra-outline-btn small"
                          onClick={() => handleDownloadPDF(inv)}
                        >
                          PDF
                        </button>
                        <button 
                          type="button" 
                          className="table-action-link"
                          onClick={() => handleSendReminder(inv)}
                        >
                          {isPaid ? 'Receipt ↗' : 'Remind >'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
