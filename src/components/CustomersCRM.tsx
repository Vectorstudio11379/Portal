import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Edit3,
  MessageCircle
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

interface Props {
  onBack: () => void;
}

export const CustomersCRM: React.FC<Props> = ({ onBack }) => {
  const { state, openModal, showToast } = useAgency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const leads = state.admin.leads || [];

  const filteredLeads = leads.filter(l => {
    const matchesSearch = !searchTerm || 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || l.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const toggleLeadSelection = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
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
            <span className="noventra-breadcrumb-active">Customers & Leads CRM</span>
          </div>
        </div>

        <div className="noventra-banner-row">
          <div>
            <h1 className="noventra-banner-title">Customers & Leads CRM</h1>
            <p className="noventra-banner-sub">
              Manage enterprise relationships, lead conversion pipelines, contact profiles, and follow-up schedules.
            </p>
          </div>
          <div className="noventra-banner-actions">
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={() => showToast('Exporting CRM accounts & leads to CSV...')}
            >
              <span>Export Contacts</span>
            </button>
            <button 
              type="button" 
              className="noventra-orange-btn"
              onClick={() => openModal('add_client_lead')}
            >
              <Plus style={{ width: '15px', height: '15px' }} />
              <span>+ Add Lead / Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Boxes */}
      <div className="noventra-stat-grid-4">
        <div className="noventra-stat-box">
          <span className="stat-label">Active Client Accounts</span>
          <span className="stat-val">14 Accounts</span>
          <span className="stat-trend green">▲ 8 Retainers &bull; 6 Projects</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Lead Conversion Rate</span>
          <span className="stat-val">48.2%</span>
          <span className="stat-trend green">▲ +8.4% vs industry baseline</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Total Pipeline Quotes</span>
          <span className="stat-val">$84,500</span>
          <span className="stat-trend orange">● 4 high-value opportunities</span>
        </div>
        <div className="noventra-stat-box">
          <span className="stat-label">Avg. Contract Lifetime</span>
          <span className="stat-val">14.6 Mos</span>
          <span className="stat-trend green">● 92% renewal retention</span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="timeline-toolbar-card">
        <div className="timeline-tabs-group">
          {[
            { id: 'all', label: 'All Accounts' },
            { id: 'won & signed', label: 'Won & Signed' },
            { id: 'in discussion', label: 'In Discussion' },
            { id: 'proposal sent', label: 'Proposal Sent' },
            { id: 'new lead', label: 'New Leads' }
          ].map(f => (
            <button 
              key={f.id}
              type="button" 
              className={`timeline-tab-btn ${statusFilter === f.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.id)}
            >
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        <div className="table-search-pill" style={{ minWidth: '240px' }}>
          <input 
            type="text" 
            placeholder="Search leads or company..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <Search style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="noventra-table-card">
        <div className="table-card-header">
          <div>
            <h3 className="table-card-title">Enterprise Pipeline & Accounts</h3>
            <span className="noventra-card-subtitle">Select leads to initiate bulk communications or generate onboarding credentials</span>
          </div>
        </div>

        <div className="table-scroll-wrapper">
          <table className="lead-tracker-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    className="custom-checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Lead / Executive Name</th>
                <th>Company</th>
                <th>Phone Number</th>
                <th>Pipeline Status</th>
                <th>Contacted Date</th>
                <th>Follow-Up Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const isSelected = selectedLeads.includes(lead.id);

                let statusClass = 'status-green';
                if (lead.status === 'In Discussion') statusClass = 'status-orange';
                if (lead.status === 'Proposal Sent') statusClass = 'status-blue';
                if (lead.status === 'Won & Signed') statusClass = 'status-green';
                if (lead.status === 'Contacted') statusClass = 'status-purple';

                return (
                  <tr key={lead.id} className={isSelected ? 'row-selected' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        className="custom-checkbox"
                        checked={isSelected}
                        onChange={() => toggleLeadSelection(lead.id)}
                      />
                    </td>
                    <td>
                      <div className="lead-name-cell">
                        <img src={lead.avatar} alt={lead.name} className="lead-avatar-img" />
                        <span className="lead-name-text">{lead.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="lead-company-cell">
                        <span className="company-logo-badge">
                          {lead.companyIcon === 'apple' && ''}
                          {lead.companyIcon === 'arc' && '▲'}
                          {lead.companyIcon === 'nexus' && '◆'}
                          {lead.companyIcon === 'lumina' && '✚'}
                          {lead.companyIcon === 'vanguard' && '✦'}
                        </span>
                        <span className="lead-company-text">{lead.company}</span>
                      </div>
                    </td>
                    <td className="lead-phone-cell">{lead.phone}</td>
                    <td>
                      <span className={`noventra-status-pill ${statusClass}`}>
                        ● {lead.status}
                      </span>
                    </td>
                    <td className="lead-date-cell">{lead.contactedDate}</td>
                    <td className="lead-date-cell">{lead.followUpDate}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          type="button" 
                          className="noventra-outline-btn small"
                          onClick={() => openModal('edit_client', { leadId: lead.id })}
                          title="Edit all customer and project details"
                        >
                          <Edit3 style={{ width: '12px', height: '12px', color: '#ff6900' }} />
                          <span>Edit</span>
                        </button>
                        <button 
                          type="button" 
                          className="noventra-whatsapp-btn small"
                          onClick={() => {
                            const clean = lead.phone.replace(/[^0-9]/g, '');
                            window.open(`https://wa.me/${clean}?text=${encodeURIComponent(`Hi ${lead.name}, messaging from VectorStudio regarding your project at ${lead.company}.`)}`, '_blank', 'noopener,noreferrer');
                          }}
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle style={{ width: '12px', height: '12px' }} />
                          <span>Chat</span>
                        </button>
                        <button 
                          type="button" 
                          className="noventra-orange-btn small"
                          onClick={() => openModal('proposal', { client: lead.company })}
                        >
                          Quote ↗
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
