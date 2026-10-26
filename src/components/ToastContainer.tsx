import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAgency } from '../context/AgencyContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useAgency();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981', flexShrink: 0 }} />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
};
