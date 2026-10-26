import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { 
  FileText, 
  Upload, 
  Search, 
  Download, 
  Copy, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  Plus
} from 'lucide-react';
import type { SharedFile } from '../../types';

export const FileSharingModal: React.FC = () => {
  const { 
    state, 
    activeModal, 
    closeModal, 
    addSharedFile, 
    updateSharedFile, 
    deleteSharedFile, 
    showToast 
  } = useAgency();

  const files = state.clientPortal.files || [];
  const clientAccounts = state.admin.clientAccounts || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientFilter, setSelectedClientFilter] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);

  // New File State
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('PDF');
  const [newFileSize, setNewFileSize] = useState('12.4 MB');
  const [newFileClient, setNewFileClient] = useState(clientAccounts[0]?.clientName || 'Arc Company');
  const [newFileDescription, setNewFileDescription] = useState('');

  // Editing File State
  const [editName, setEditName] = useState('');
  const [editClient, setEditClient] = useState('');
  const [editType, setEditType] = useState('');
  const [editStatus, setEditStatus] = useState<SharedFile['status']>('active');
  const [editDescription, setEditDescription] = useState('');

  if (activeModal !== 'file_sharing') return null;

  const filteredFiles = files.filter(f => {
    const matchesSearch = !searchTerm || 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.client && f.client.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesClient = selectedClientFilter === 'all' || 
      (f.client && f.client.toLowerCase() === selectedClientFilter.toLowerCase());

    return matchesSearch && matchesClient;
  });

  const handleStartEdit = (file: SharedFile) => {
    setEditingFileId(file.id);
    setEditName(file.name);
    setEditClient(file.client || 'Arc Company');
    setEditType(file.type);
    setEditStatus(file.status || 'active');
    setEditDescription(file.description || '');
  };

  const handleSaveEdit = (fileId: string) => {
    updateSharedFile(fileId, {
      name: editName.trim(),
      client: editClient,
      type: editType,
      status: editStatus,
      description: editDescription.trim()
    });
    setEditingFileId(null);
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      showToast('Please enter a file name.');
      return;
    }

    addSharedFile({
      name: newFileName.trim(),
      type: newFileType,
      size: newFileSize.trim() || '5.2 MB',
      client: newFileClient,
      uploadedBy: state.currentUser?.name || 'Owais Anwer',
      description: newFileDescription.trim() || 'Uploaded via Project Vault',
      status: 'active'
    });

    setNewFileName('');
    setNewFileDescription('');
    setShowUploadForm(false);
  };

  const handleCopyLink = (file: SharedFile) => {
    const link = `https://app.vectorstudio.design/vault/${file.id}?token=share_${Math.random().toString(36).substring(2, 8)}`;
    navigator.clipboard?.writeText(link);
    showToast(`Direct share link copied for "${file.name}"!`);
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div 
        className="modal-container modal-lg" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '820px', width: '94%', maxHeight: '90vh', overflowY: 'auto', padding: 0 }}
      >
        {/* Header */}
        <div className="modal-header-luxury" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 30px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="metric-icon-square icon-blue" style={{ width: '42px', height: '42px' }}>
              <FileText style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Shared Files & Deliverables Vault
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                View, upload, edit metadata, and share project assets with client partners.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button" 
              className="noventra-orange-btn small"
              onClick={() => setShowUploadForm(prev => !prev)}
            >
              <Plus style={{ width: '13px', height: '13px' }} />
              <span>{showUploadForm ? 'Close Form' : 'Upload File'}</span>
            </button>
            <button 
              type="button" 
              onClick={closeModal}
              className="noventra-circle-btn"
              style={{ width: '32px', height: '32px' }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 30px 30px' }}>
          {/* Upload New File Subform */}
          {showUploadForm && (
            <div className="form-subcard" style={{ marginBottom: '18px', border: '1.5px solid var(--noventra-orange)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Upload style={{ width: '16px', height: '16px', color: '#ff6900' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Add New Shared File / Deliverable
                </h4>
              </div>

            <form onSubmit={handleCreateFile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">File Name with Extension</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. NextJS_Architecture_v1.0.pdf" 
                    value={newFileName} 
                    onChange={(e) => setNewFileName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Client</label>
                  <select 
                    className="form-input"
                    value={newFileClient}
                    onChange={(e) => setNewFileClient(e.target.value)}
                  >
                    {clientAccounts.map(c => (
                      <option key={c.id} value={c.clientName}>{c.clientName}</option>
                    ))}
                    <option value="Global Studio Asset">Global Studio Asset</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Format / Type</label>
                  <select 
                    className="form-input"
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value)}
                  >
                    <option value="PDF">PDF (Design Specs & SOW)</option>
                    <option value="FIG">FIG (Figma UI Kit)</option>
                    <option value="JSON">JSON (Design Tokens)</option>
                    <option value="YAML">YAML (OpenAPI Contract)</option>
                    <option value="VIDEO">VIDEO (Prototype Walkthrough)</option>
                    <option value="ZIP">ZIP (Source Code Bundle)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Size</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 18.5 MB" 
                    value={newFileSize} 
                    onChange={(e) => setNewFileSize(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Deliverable Notes</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. High-fidelity wireframe tokens exported for Sprint 2 client sign-off." 
                  value={newFileDescription} 
                  onChange={(e) => setNewFileDescription(e.target.value)} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" className="noventra-outline-btn small" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="noventra-orange-btn small">
                  <Check style={{ width: '13px', height: '13px' }} />
                  <span>Save File to Vault</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px 0', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search files by name, type, client..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ paddingLeft: '34px', fontSize: '13px' }}
            />
            <Search style={{ position: 'absolute', left: '10px', top: '11px', width: '15px', height: '15px', color: '#9ca3af' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Client:</span>
            <select 
              className="form-input" 
              value={selectedClientFilter} 
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              style={{ width: 'auto', padding: '6px 12px', fontSize: '12.5px' }}
            >
              <option value="all">All Clients ({files.length})</option>
              {clientAccounts.map(c => (
                <option key={c.id} value={c.clientName}>{c.clientName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Files List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredFiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', background: 'var(--noventra-bg-pill)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
              <FileText style={{ width: '36px', height: '36px', color: '#9ca3af', margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>No Files Found</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Try adjusting your search query or upload a new file deliverable.
              </p>
            </div>
          ) : (
            filteredFiles.map(file => {
              const isEditing = editingFileId === file.id;

              return (
                <div 
                  key={file.id} 
                  style={{ 
                    padding: '14px 16px', 
                    borderRadius: '12px', 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isEditing ? (
                    /* Inline Editing Mode */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '11px' }}>File Name</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '11px' }}>Client</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={editClient} 
                            onChange={(e) => setEditClient(e.target.value)} 
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: '11px' }}>Status</label>
                          <select 
                            className="form-input" 
                            value={editStatus} 
                            onChange={(e) => setEditStatus(e.target.value as any)}
                          >
                            <option value="active">Active</option>
                            <option value="client_reviewed">Client Reviewed</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '11px' }}>Description</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={editDescription} 
                          onChange={(e) => setEditDescription(e.target.value)} 
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button 
                          type="button" 
                          className="noventra-outline-btn small" 
                          onClick={() => setEditingFileId(null)}
                        >
                          Cancel
                        </button>
                        <button 
                          type="button" 
                          className="noventra-orange-btn small" 
                          onClick={() => handleSaveEdit(file.id)}
                        >
                          <Check style={{ width: '13px', height: '13px' }} />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal Display Row */
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
                        <div className={`metric-icon-square ${file.type === 'PDF' ? 'icon-orange' : (file.type === 'FIG' ? 'icon-purple' : 'icon-blue')}`} style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 900 }}>{file.type}</span>
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {file.name}
                            </span>
                            <span className={`noventra-status-pill ${file.status === 'client_reviewed' ? 'status-green' : 'status-blue'}`} style={{ fontSize: '9.5px', padding: '1px 6px' }}>
                              {file.status === 'client_reviewed' ? '● REVIEWED' : '● ACTIVE'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <span>Size: <strong>{file.size}</strong></span>
                            <span>•</span>
                            <span>Client: <strong style={{ color: 'var(--text-secondary)' }}>{file.client || 'Arc Company'}</strong></span>
                            <span>•</span>
                            <span>Uploaded: {file.uploadedDate || 'Oct 20, 2026'}</span>
                          </div>

                          {file.description && (
                            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                              {file.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Row Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button 
                          type="button" 
                          className="noventra-outline-btn small"
                          onClick={() => handleCopyLink(file)}
                          title="Copy secure link"
                        >
                          <Copy style={{ width: '12px', height: '12px' }} />
                          <span>Share Link</span>
                        </button>

                        <button 
                          type="button" 
                          className="noventra-outline-btn small"
                          onClick={() => handleStartEdit(file)}
                          title="Edit file details"
                        >
                          <Edit3 style={{ width: '12px', height: '12px' }} />
                          <span>Edit</span>
                        </button>

                        <button 
                          type="button" 
                          className="noventra-orange-btn small"
                          onClick={() => showToast(`Downloading "${file.name}" (${file.size})...`)}
                          title="Download file"
                        >
                          <Download style={{ width: '12px', height: '12px' }} />
                          <span>Download</span>
                        </button>

                        <button 
                          type="button" 
                          className="noventra-circle-btn"
                          onClick={() => deleteSharedFile(file.id)}
                          title="Delete file from vault"
                          style={{ width: '28px', height: '28px', color: '#ef4444' }}
                        >
                          <Trash2 style={{ width: '12px', height: '12px' }} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredFiles.length}</strong> of <strong>{files.length}</strong> shared assets
            </span>
            <button type="button" className="noventra-outline-btn" onClick={closeModal}>
              Close Vault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
