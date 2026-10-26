import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  Search, 
  MessageCircle
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

interface Props {
  onBack: () => void;
}

export const ProposalBuilder: React.FC<Props> = ({ onBack }) => {
  const { state, openModal, showToast, openAIAssistant } = useAgency();
  const { admin } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const proposals = admin.proposals || [];

  const filteredProposals = proposals.filter(p => {
    const matchesSearch = !searchTerm || 
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.propNum.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPipeline = proposals.reduce((acc, p) => acc + p.budget, 0);

  const handleDocsSync = () => {
    showToast('Google Docs: 4 templates synced & doc variables updated from VectorStudio core.');
  };

  const handleSignSimulate = (propNum: string) => {
    showToast(`Digital Signature link dispatched via DocuSign to client for ${propNum}`);
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
            <span className="noventra-breadcrumb-active">Proposal Builder</span>
          </div>
        </div>

        <div className="noventra-banner-row">
          <div>
            <h1 className="noventra-banner-title">Proposal Management & Quotes Engine</h1>
            <p className="noventra-banner-sub">
              Create client proposals, generate scopes from templates, track digital signatures, and sync directly with Google Docs.
            </p>
          </div>
          <div className="noventra-banner-actions">
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={() => openAIAssistant('Draft an enterprise architecture proposal for Solana Labs with budget $45,000')}
            >
              <Sparkles style={{ width: '13px', height: '13px', color: '#ff6900' }} />
              <span className="btn-desktop-text">✨ AI Proposal Drafter</span>
              <span className="btn-mobile-text">✨ AI Drafter</span>
            </button>
            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={() => openModal('proposal')}
            >
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span className="btn-desktop-text">+ Create Proposal</span>
              <span className="btn-mobile-text">+ Proposal</span>
            </button>
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={handleDocsSync}
            >
              <ExternalLink style={{ width: '13px', height: '13px' }} />
              <span className="btn-desktop-text">Sync with Google Docs</span>
              <span className="btn-mobile-text">Sync Docs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Proposal Analytics Cards */}
      <div className="noventra-stat-grid-4">
        <div className="noventra-stat-box">
          <span className="stat-label">Active Pipeline Value</span>
          <span className="stat-val">${totalPipeline.toLocaleString()}</span>
          <span className="stat-trend green">▲ +18.4% vs last quarter</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Quotes in Pipeline</span>
          <span className="stat-val">{proposals.length} Proposals</span>
          <span className="stat-trend orange">● 2 awaiting client sign-off</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Proposal Win Rate</span>
          <span className="stat-val">88%</span>
          <span className="stat-trend green">▲ Industry benchmark: 64%</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Average Contract Value</span>
          <span className="stat-val">${Math.round(totalPipeline / (proposals.length || 1)).toLocaleString()}</span>
          <span className="stat-trend green">● Tier 1 agency standard</span>
        </div>
      </div>

      {/* Google Docs Integration & Template Library Banner */}
      <div className="docs-sync-banner-card">
        <div className="docs-banner-left">
          <div className="docs-icon-badge">
            <FileText style={{ width: '22px', height: '22px', color: '#2563eb' }} />
          </div>
          <div>
            <h3 className="docs-banner-title">Google Docs Integration Active</h3>
            <p className="docs-banner-sub">
              Connected to <strong>VectorStudio_Master_Proposals</strong> &bull; 4 production templates ready for one-click quote generation.
            </p>
          </div>
        </div>
        <div className="docs-banner-actions">
          <button 
            type="button" 
            className="noventra-outline-btn"
            onClick={() => showToast('Google Docs template: Design System & Token SOW loaded into generator.')}
          >
            Use Design System Template
          </button>
          <button 
            type="button" 
            className="noventra-orange-btn"
            onClick={() => openModal('proposal')}
          >
            Generate Quote
          </button>
        </div>
      </div>

      {/* Proposals Pipeline & Approvals Table */}
      <div className="noventra-table-card">
        <div className="table-card-header">
          <h3 className="table-card-title">Client Pipeline & Proposal Approvals</h3>
          <div className="table-header-controls">
            <div className="table-search-pill">
              <input 
                type="text" 
                placeholder="Search proposals..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
            </div>
            <select 
              className="table-filter-btn"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Signed & Won">Signed & Won</option>
              <option value="Sent for Review">Sent for Review</option>
              <option value="In Negotiation">In Negotiation</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="table-scroll-wrapper">
          <table className="lead-tracker-table">
            <thead>
              <tr>
                <th>Proposal No.</th>
                <th>Client & Contact</th>
                <th>Assigned Project Lead</th>
                <th>Scope Title & Terms</th>
                <th>Quote Value</th>
                <th>Payment & Deposit</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map((prop) => {
                let statusClass = 'status-green';
                if (prop.status === 'Sent for Review') statusClass = 'status-orange';
                if (prop.status === 'In Negotiation') statusClass = 'status-blue';
                if (prop.status === 'Draft') statusClass = 'status-purple';

                const clientAccount = state.admin.clientAccounts.find(c => c.clientName.toLowerCase() === prop.client.toLowerCase());
                const isPaid = prop.paymentStatus === 'deposit_paid' || prop.paymentStatus === 'fully_paid';

                return (
                  <tr key={prop.id}>
                    <td style={{ fontWeight: 700, color: '#18181b' }}>{prop.propNum}</td>
                    <td>
                      <span style={{ fontWeight: 700, display: 'block' }}>{prop.client}</span>
                      <span style={{ fontSize: '11px', color: '#78716c' }}>
                        {prop.assignedClientUser || clientAccount?.contactName || 'Client Stakeholder'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#18181b' }}>
                          {prop.assignedLead || 'Owais Anwer'}
                        </span>
                        <span className="noventra-status-pill status-orange" style={{ fontSize: '9px', padding: '1px 5px' }}>
                          {prop.assignedLeadRole || 'Project Lead'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: '#18181b' }}>{prop.title}</span>
                        <span style={{ fontSize: '11px', color: '#78716c' }}>{prop.paymentTerms || prop.scope}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '14px', color: '#18181b' }}>
                      ${prop.budget.toLocaleString()}
                    </td>
                    <td>
                      <span className={`noventra-status-pill ${isPaid ? 'status-green' : 'status-orange'}`} style={{ fontSize: '11px' }}>
                        {isPaid ? `● Deposit Paid ($${(prop.depositAmount || Math.round(prop.budget * 0.3)).toLocaleString()})` : `Deposit Due ($${(prop.depositAmount || Math.round(prop.budget * 0.3)).toLocaleString()})`}
                      </span>
                    </td>
                    <td>
                      <span className={`noventra-status-pill ${statusClass}`}>
                        ● {prop.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {clientAccount?.whatsappNumber && (
                          <button 
                            type="button" 
                            className="noventra-whatsapp-btn"
                            onClick={() => {
                              const cleanNum = clientAccount.whatsappNumber?.replace(/[^0-9]/g, '');
                              const msg = `Hi ${clientAccount.contactName}, following up on proposal ${prop.propNum} ("${prop.title}") for ${prop.client}. What questions can we answer for your team?`;
                              window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                            }}
                            title={`Chat ${clientAccount.contactName} on WhatsApp`}
                          >
                            <MessageCircle style={{ width: '12px', height: '12px' }} />
                            <span>WhatsApp</span>
                          </button>
                        )}
                        <button 
                          type="button" 
                          className="noventra-orange-btn"
                          style={{ padding: '6px 12px', fontSize: '11.5px' }}
                          onClick={() => handleSignSimulate(prop.propNum)}
                        >
                          Sign / Review
                        </button>
                        <button 
                          type="button" 
                          className="noventra-outline-btn"
                          style={{ padding: '6px 12px', fontSize: '11.5px' }}
                          onClick={() => showToast(`Opening Google Docs: ${prop.docsUrl}`)}
                        >
                          Docs ↗
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
