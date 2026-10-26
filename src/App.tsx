import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { AgencyProvider, useAgency } from './context/AgencyContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AdminDashboard } from './components/AdminDashboard';
import { ClientPortal } from './components/ClientPortal';
import { LoginPage } from './components/LoginPage';
import { ProposalModal } from './components/modals/ProposalModal';
import { InvoiceModal } from './components/modals/InvoiceModal';
import { TaskModal } from './components/modals/TaskModal';
import { MeetingModal } from './components/modals/MeetingModal';
import { FeedbackModal } from './components/modals/FeedbackModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { ClientCredentialsModal } from './components/modals/ClientCredentialsModal';
import { AddClientLeadModal } from './components/modals/AddClientLeadModal';
import { EditClientModal } from './components/modals/EditClientModal';
import { EditUserModal } from './components/modals/EditUserModal';
import { FileSharingModal } from './components/modals/FileSharingModal';
import { UserProfileModal } from './components/modals/UserProfileModal';
import { ToastContainer } from './components/ToastContainer';
import { AdminAICopilot } from './components/AdminAICopilot';

const MainLayout: React.FC = () => {
  const { state, openAIAssistant } = useAgency();

  // Global Keyboard shortcut Ctrl+K / Cmd+K to launch VectorAI Copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openAIAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openAIAssistant]);

  // Show full-page dedicated Login Page when logged out
  if (!state.isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="app-layout">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="main-content">
        <Header />

        {/* View Switching between Admin and Client Portal */}
        {state.currentRole === 'admin' ? (
          <AdminDashboard />
        ) : (
          <ClientPortal />
        )}
      </main>

      {/* Interactive Modals */}
      <ProposalModal />
      <InvoiceModal />
      <TaskModal />
      <MeetingModal />
      <FeedbackModal />
      <RecordPaymentModal />
      <ClientCredentialsModal />
      <AddClientLeadModal />
      <EditClientModal />
      <EditUserModal />
      <FileSharingModal />
      <UserProfileModal />

      {/* VectorAI Floating Action Button (Admin Only) */}
      {state.currentRole === 'admin' && (
        <button
          type="button"
          className="vector-ai-floating-fab"
          onClick={() => openAIAssistant()}
          title="Open VectorAI Executive Copilot (Ctrl+K)"
        >
          <div className="fab-sparkle-icon">
            <Sparkles style={{ width: '18px', height: '18px' }} />
          </div>
          <span className="fab-label">VectorAI Copilot</span>
          <span className="fab-kbd">⌘K</span>
        </button>
      )}

      {/* VectorAI Executive Copilot Drawer & Modal */}
      <AdminAICopilot />

      {/* Toast Notification Stream */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AgencyProvider>
      <MainLayout />
    </AgencyProvider>
  );
}

export default App;
