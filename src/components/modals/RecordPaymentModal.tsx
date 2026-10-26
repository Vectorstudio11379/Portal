import React, { useState, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { 
  DollarSign, 
  CheckCircle2, 
  MessageCircle, 
  X 
} from 'lucide-react';

export const RecordPaymentModal: React.FC = () => {
  const { state, activeModal, modalData, closeModal, recordClientPayment, showToast } = useAgency();

  const clientAccounts = state.admin.clientAccounts || [];
  const invoices = state.admin.invoices || [];

  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'full' | 'part'>('full');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Direct Bank Wire Transfer');
  const [notes, setNotes] = useState<string>('Bank wire received and verified in corporate account.');
  const [notifyWhatsApp, setNotifyWhatsApp] = useState<boolean>(true);
  const [checkedMilestoneIdx, setCheckedMilestoneIdx] = useState<number | undefined>(undefined);

  // Initialize from modalData if opened from an invoice row or client row
  useEffect(() => {
    if (activeModal === 'record_payment') {
      if (modalData?.invoiceId) {
        setSelectedInvoiceId(modalData.invoiceId);
        const inv = invoices.find(i => i.id === modalData.invoiceId);
        if (inv) {
          const client = clientAccounts.find(c => c.clientName === inv.client);
          if (client) setSelectedClientId(client.id);
          const currentPaid = inv.paidAmount || (inv.status === 'paid' ? inv.amount : 0);
          const remaining = Math.max(0, inv.amount - currentPaid);
          setAmountPaid(remaining > 0 ? remaining : inv.amount);
          setPaymentType(remaining <= 0 || currentPaid === 0 ? 'full' : 'part');
        }
      } else if (modalData?.clientId) {
        setSelectedClientId(modalData.clientId);
        const client = clientAccounts.find(c => c.id === modalData.clientId);
        if (client) {
          const clientInvs = invoices.filter(i => i.client === client.clientName);
          if (clientInvs.length > 0) setSelectedInvoiceId(clientInvs[0].id);
          const totalBudget = client.projectBudget || 35000;
          const currentPaid = client.paidAmount || 0;
          const remaining = Math.max(0, totalBudget - currentPaid);
          setAmountPaid(remaining > 0 ? remaining : totalBudget);
        }
      } else if (clientAccounts.length > 0) {
        setSelectedClientId(clientAccounts[0].id);
        const firstClient = clientAccounts[0];
        const clientInvs = invoices.filter(i => i.client === firstClient.clientName);
        if (clientInvs.length > 0) {
          setSelectedInvoiceId(clientInvs[0].id);
          setAmountPaid(clientInvs[0].amount);
        } else {
          setAmountPaid(firstClient.projectBudget || 35000);
        }
      }
    }
  }, [activeModal, modalData]);

  if (activeModal !== 'record_payment') return null;

  const currentClient = clientAccounts.find(c => c.id === selectedClientId);
  const currentInvoice = invoices.find(i => i.id === selectedInvoiceId);

  // Compute total and remaining balances
  const totalAmount = currentInvoice ? currentInvoice.amount : (currentClient?.projectBudget || 35000);
  const previouslyPaid = currentInvoice ? (currentInvoice.paidAmount || (currentInvoice.status === 'paid' ? currentInvoice.amount : 0)) : (currentClient?.paidAmount || 0);
  const remainingBefore = Math.max(0, totalAmount - previouslyPaid);
  const remainingAfter = Math.max(0, remainingBefore - amountPaid);

  const handleClientChange = (newClientId: string) => {
    setSelectedClientId(newClientId);
    const client = clientAccounts.find(c => c.id === newClientId);
    if (client) {
      const clientInvs = invoices.filter(i => i.client === client.clientName);
      if (clientInvs.length > 0) {
        setSelectedInvoiceId(clientInvs[0].id);
        const invPaid = clientInvs[0].paidAmount || 0;
        setAmountPaid(Math.max(0, clientInvs[0].amount - invPaid));
      } else {
        setSelectedInvoiceId('');
        const clientPaid = client.paidAmount || 0;
        setAmountPaid(Math.max(0, (client.projectBudget || 35000) - clientPaid));
      }
    }
  };

  const handleInvoiceChange = (newInvoiceId: string) => {
    setSelectedInvoiceId(newInvoiceId);
    const inv = invoices.find(i => i.id === newInvoiceId);
    if (inv) {
      const client = clientAccounts.find(c => c.clientName === inv.client);
      if (client) setSelectedClientId(client.id);
      const invPaid = inv.paidAmount || 0;
      setAmountPaid(paymentType === 'full' ? inv.amount : Math.max(0, inv.amount - invPaid));
    }
  };

  const setPercentageQuickAmount = (pct: number) => {
    const calc = Math.round(totalAmount * pct);
    setAmountPaid(calc);
    setPaymentType(pct === 1.0 ? 'full' : 'part');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountPaid <= 0) {
      showToast('Please enter a payment amount greater than zero.');
      return;
    }

    recordClientPayment({
      clientId: selectedClientId,
      invoiceId: selectedInvoiceId || undefined,
      paymentType,
      amountPaid,
      paymentMethod,
      notes,
      milestoneIndex: checkedMilestoneIdx
    });

    // Optional WhatsApp dispatch
    if (notifyWhatsApp && currentClient?.whatsappNumber) {
      const cleanNum = currentClient.whatsappNumber.replace(/[^0-9]/g, '');
      if (cleanNum) {
        const msg = `Hi ${currentClient.contactName}, we have successfully recorded and verified your payment of $${amountPaid.toLocaleString()} USD (${paymentType === 'full' ? 'Full Settlement' : 'Part Payment'}) for ${currentClient.company}.\n\nRemaining Balance: $${remainingAfter.toLocaleString()} USD.\n\nThank you for partnering with VectorStudio!`;
        window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
      }
    }

    closeModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div 
        className="modal-dialog" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '620px', width: '92%', borderRadius: '20px', padding: '0', overflow: 'hidden' }}
      >
        {/* Header Bar */}
        <div style={{ 
          background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', 
          padding: '24px 28px',
          color: '#ffffff',
          position: 'relative',
          borderBottom: '1px solid #3f3f46'
        }}>
          <button 
            type="button" 
            onClick={closeModal}
            style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '20px', 
              background: 'rgba(255,255,255,0.1)', 
              border: 'none', 
              color: '#ffffff', 
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              backgroundColor: '#ff6900', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(255, 105, 0, 0.4)'
            }}>
              <DollarSign style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ff8a3d' }}>
                Off-Platform Settlement
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Record Client Payment
              </h2>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#a1a1aa', margin: 0, lineHeight: 1.4 }}>
            Record bank wire transfers, direct deposits, or milestone payments made off-platform and automatically calculate remaining balances.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', backgroundColor: '#ffffff', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Target Client & Invoice Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Client Account
              </label>
              <select 
                className="noventra-select"
                value={selectedClientId}
                onChange={(e) => handleClientChange(e.target.value)}
                style={{ width: '100%', height: '42px', borderRadius: '10px', fontSize: '13px' }}
              >
                {clientAccounts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.clientName} ({c.company})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Associated Invoice / SOW
              </label>
              <select 
                className="noventra-select"
                value={selectedInvoiceId}
                onChange={(e) => handleInvoiceChange(e.target.value)}
                style={{ width: '100%', height: '42px', borderRadius: '10px', fontSize: '13px' }}
              >
                <option value="">General Project Account Balance</option>
                {invoices.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.num} • {i.client} (${i.amount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Type Toggles: Full vs Part */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
              Settlement Structure
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setPaymentType('full');
                  setAmountPaid(remainingBefore > 0 ? remainingBefore : totalAmount);
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: paymentType === 'full' ? '2px solid #10b981' : '1px solid #e5e7eb',
                  backgroundColor: paymentType === 'full' ? '#f0fdf4' : '#faf9f6',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: paymentType === 'full' ? '#166534' : '#18181b' }}>
                    Full Payment
                  </span>
                  {paymentType === 'full' && <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />}
                </div>
                <span style={{ fontSize: '11.5px', color: '#6b7280' }}>
                  100% complete settlement of invoice/project balance
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentType('part');
                  if (amountPaid >= totalAmount) setAmountPaid(Math.round(totalAmount * 0.5));
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: paymentType === 'part' ? '2px solid #ff6900' : '1px solid #e5e7eb',
                  backgroundColor: paymentType === 'part' ? '#fffaf5' : '#faf9f6',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: paymentType === 'part' ? '#c2410c' : '#18181b' }}>
                    Part / Half Payment
                  </span>
                  {paymentType === 'part' && <CheckCircle2 style={{ width: '16px', height: '16px', color: '#ff6900' }} />}
                </div>
                <span style={{ fontSize: '11.5px', color: '#6b7280' }}>
                  Record milestone deposit or custom partial sum
                </span>
              </button>
            </div>
          </div>

          {/* Quick Shortcuts (if Part payment) */}
          {paymentType === 'part' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#6b7280' }}>Quick Presets:</span>
              <button 
                type="button" 
                className="noventra-outline-btn small" 
                onClick={() => setPercentageQuickAmount(0.5)}
                style={{ padding: '4px 10px', fontSize: '11.5px' }}
              >
                50% Half Payment (${Math.round(totalAmount * 0.5).toLocaleString()})
              </button>
              <button 
                type="button" 
                className="noventra-outline-btn small" 
                onClick={() => setPercentageQuickAmount(0.3)}
                style={{ padding: '4px 10px', fontSize: '11.5px' }}
              >
                30% Kickoff Deposit (${Math.round(totalAmount * 0.3).toLocaleString()})
              </button>
              <button 
                type="button" 
                className="noventra-outline-btn small" 
                onClick={() => setPercentageQuickAmount(0.4)}
                style={{ padding: '4px 10px', fontSize: '11.5px' }}
              >
                40% Staging QA (${Math.round(totalAmount * 0.4).toLocaleString()})
              </button>
            </div>
          )}

          {/* Payment Amount Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              Amount Paid Now (USD)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: '#6b7280', fontSize: '16px' }}>
                $
              </span>
              <input 
                type="number"
                required
                min={1}
                value={amountPaid || ''}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                style={{ 
                  width: '100%', 
                  height: '46px', 
                  paddingLeft: '32px', 
                  borderRadius: '10px', 
                  border: '1.5px solid #d1d5db', 
                  fontSize: '16px', 
                  fontWeight: 800,
                  color: '#18181b'
                }}
              />
            </div>
          </div>

          {/* Real-time Calculation Ledger Preview Box */}
          <div style={{ 
            backgroundColor: '#faf9f6', 
            borderRadius: '12px', 
            border: '1px solid #eae7df', 
            padding: '16px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#78716c', display: 'block', marginBottom: '10px' }}>
              Live Financial Balance Computation
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #f2efe9' }}>
                <span style={{ fontSize: '11px', color: '#78716c', display: 'block' }}>Total Payable</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#18181b' }}>
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #f2efe9' }}>
                <span style={{ fontSize: '11px', color: '#78716c', display: 'block' }}>Recording Now</span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#16a34a' }}>
                  +${amountPaid.toLocaleString()}
                </span>
              </div>
              <div style={{ backgroundColor: remainingAfter === 0 ? '#f0fdf4' : '#fffaf5', padding: '10px', borderRadius: '8px', border: remainingAfter === 0 ? '1px solid #bbf7d0' : '1px solid #fed7aa' }}>
                <span style={{ fontSize: '11px', color: remainingAfter === 0 ? '#166534' : '#9a3412', display: 'block' }}>
                  {remainingAfter === 0 ? 'Balance Settled' : 'Remaining Balance'}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: remainingAfter === 0 ? '#16a34a' : '#ea580c' }}>
                  ${remainingAfter.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method & Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Payment Method / Channel
              </label>
              <select 
                className="noventra-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%', height: '42px', borderRadius: '10px', fontSize: '13px' }}
              >
                <option value="Direct Bank Wire Transfer">Direct Bank Wire Transfer</option>
                <option value="Bank ACH Direct Deposit">Bank ACH Direct Deposit</option>
                <option value="SWIFT International Wire">SWIFT International Wire</option>
                <option value="Company Corporate Check">Company Corporate Check</option>
                <option value="Cash / Escrow Settlement">Cash / Escrow Settlement</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Payment Reference / Note
              </label>
              <input 
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Wire Ref #88291 confirmed"
                style={{ 
                  width: '100%', 
                  height: '42px', 
                  padding: '0 12px', 
                  borderRadius: '10px', 
                  border: '1.5px solid #d1d5db', 
                  fontSize: '13px' 
                }}
              />
            </div>
          </div>

          {/* Milestone Checklist (Optional Milestone Signoff) */}
          {currentClient?.milestonesChecklist && currentClient.milestonesChecklist.length > 0 && (
            <div style={{ marginBottom: '18px', padding: '14px', backgroundColor: '#faf9f6', borderRadius: '10px', border: '1px solid #eae7df' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#18181b', display: 'block', marginBottom: '8px' }}>
                Mark Milestone Checklist Cleared (Optional):
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentClient.milestonesChecklist.map((m, idx) => (
                  <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '12.5px', color: '#374151' }}>
                    <input 
                      type="checkbox" 
                      checked={m.completed || checkedMilestoneIdx === idx} 
                      disabled={m.completed}
                      onChange={(e) => setCheckedMilestoneIdx(e.target.checked ? idx : undefined)}
                    />
                    <span style={{ fontWeight: m.completed ? 600 : 700, color: m.completed ? '#16a34a' : '#18181b' }}>
                      {m.title} (${m.amount.toLocaleString()}) {m.completed ? '✓ Already Cleared' : ''}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Notification Checkbox */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#18181b' }}>
              <input 
                type="checkbox" 
                checked={notifyWhatsApp} 
                onChange={(e) => setNotifyWhatsApp(e.target.checked)} 
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageCircle style={{ width: '15px', height: '15px', color: '#16a34a' }} />
                <span>Open direct WhatsApp receipt confirmation to {currentClient?.contactName || 'Client'}</span>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="noventra-outline-btn"
              onClick={closeModal}
              style={{ padding: '10px 18px', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="noventra-orange-btn"
              style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: 800 }}
            >
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              <span>Record & Update Ledger (${amountPaid.toLocaleString()})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
