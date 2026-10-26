import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { 
  AgencyState, 
  Role, 
  Task, 
  Invoice, 
  UserSession, 
  ClientAccount,
  AppNotification,
  Milestone,
  ProposalItem,
  SharedFile,
  Lead,
  AppUser,
  RolePermissionFlags,
  RolePermission,
  MeetingItem,
  TeamMessage
} from '../types';
import { INITIAL_AGENCY_STATE } from '../data/mockData';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  pullStateFromSupabase, 
  pushStateToSupabase, 
  getSupabaseClient,
  insertDbTask,
  updateDbTask,
  insertDbInvoice,
  updateDbInvoice,
  insertDbMeeting,
  deleteDbMeeting,
  insertDbMessage,
  insertDbClientAccount,
  updateDbClientAccount
} from '../lib/supabase';

interface Toast {
  id: string;
  msg: string;
}

interface AgencyContextType {
  state: AgencyState;
  setRole: (role: Role) => void;
  setActiveNav: (nav: string) => void;
  setSearchQuery: (q: string) => void;
  approveDeliverable: (id: string) => void;
  requestChangesDeliverable: (id: string, notes: string) => void;
  toggleTask: (id: string) => void;
  addTask: (title: string, client: string, assignee: string, deadline?: string, priority?: 'Urgent' | 'High' | 'Medium' | 'Normal', description?: string) => void;
  addInvoice: (client: string, desc: string, amount: number) => void;
  addProposal: (client: string, budget: number, duration: string) => void;
  acceptAndPayProposal: (proposalId: string, paymentMethod?: string) => void;
  payInvoice: (invoiceId: string, paymentMethod?: string) => void;
  recordClientPayment: (data: {
    clientId?: string;
    invoiceId?: string;
    proposalId?: string;
    paymentType: 'full' | 'part';
    amountPaid: number;
    paymentMethod?: string;
    notes?: string;
    milestoneIndex?: number;
  }) => void;
  updateGeminiApiKey: (key: string, model?: string) => void;
  updateClientMilestoneChecklist: (clientId: string, milestoneIndex: number, completed: boolean) => void;
  createdClientCredentials: {
    clientName: string;
    company: string;
    contactName: string;
    email: string;
    username: string;
    password: string;
    magicLinkUrl: string;
    whatsappNumber?: string;
    projectBudget?: number;
    projectType?: string;
  } | null;
  clearCreatedClientCredentials: () => void;
  addProposalWithDetails: (proposal: {
    client: string;
    title: string;
    scope: string;
    budget: number;
    winProbability?: number;
    duration?: string;
    assignedLead?: string;
    assignedClientUser?: string;
  }) => void;
  addMultipleTasks: (tasks: {
    title: string;
    client: string;
    assignee: string;
    priority: 'Urgent' | 'High' | 'Medium' | 'Normal';
    dueDate?: string;
  }[]) => void;
  addMilestone: (milestone: {
    name: string;
    date: string;
    desc: string;
    status: 'completed' | 'active' | 'upcoming';
    client?: string;
  }) => void;
  notifications: AppNotification[];
  markNotificationsAsRead: () => void;
  dispatchNotification: (title: string, meta: string, type?: 'green' | 'blue' | 'orange' | 'purple', nav?: string) => void;
  isAIAssistantOpen: boolean;
  aiInitialPrompt: string;
  openAIAssistant: (initialPrompt?: string) => void;
  closeAIAssistant: () => void;
  sendChatMessage: (text: string) => void;
  loginAsUser: (user: UserSession) => void;
  loginWithCredentials: (identifier: string, password?: string) => boolean;
  logout: () => void;
  updateUserRole: (userId: string, newRole: Role, roleTitle?: string) => void;
  sendOnboardingInvite: (clientId: string) => void;
  resetClientPassword: (clientId: string) => void;
  addClientAccount: (clientData: Omit<ClientAccount, 'id' | 'onboardingToken' | 'magicLinkUrl'>) => void;
  addUser: (userData: {
    name: string;
    email: string;
    profession: string;
    contactAddress: string;
    whatsappNumber: string;
    role: Role;
    adminRoleTitle: string;
    avatar?: string;
  }) => void;
  toasts: Toast[];
  showToast: (msg: string) => void;
  activeModal: string | null;
  modalData: any;
  openModal: (name: string, data?: any) => void;
  closeModal: () => void;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  updateClientAccount: (clientId: string, updatedData: Partial<ClientAccount>) => void;
  updateLead: (leadId: string, updatedData: Partial<Lead>) => void;
  addSharedFile: (file: Omit<SharedFile, 'id'>) => void;
  updateSharedFile: (fileId: string, updatedData: Partial<SharedFile>) => void;
  deleteSharedFile: (fileId: string) => void;
  updateUser: (userId: string, updatedData: Partial<AppUser>) => void;
  suspendUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  updateUserPermissions: (userId: string, permissions: RolePermissionFlags) => void;
  updateRolePermissions: (roleId: string, permissions: Partial<RolePermission>) => void;
  scheduleMeeting: (meeting: Omit<MeetingItem, 'id' | 'status'>) => void;
  deleteMeeting: (meetingId: string) => void;
  sendRealTimeMessage: (senderId: string, recipientId: string, content: string) => void;
  markMessagesRead: (recipientId: string) => void;
  updateProfileImage: (avatarUrl: string, userId?: string) => void;
  syncWithSupabase: () => Promise<{ success: boolean; syncedRecords: number; message: string }>;
  supabaseConfig: { url: string; anonKey: string; isConnected: boolean; lastSyncTime?: string };
  updateSupabaseConfig: (url: string, key: string) => void;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const AgencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AgencyState>(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vectorstudio_agency_react_state');
      }
      const saved = typeof window !== 'undefined' ? localStorage.getItem('vectorstudio_agency_state_v3') : null;
      if (saved) {
        const parsed = JSON.parse(saved);

        const defaultPermsByRole: Record<string, RolePermissionFlags> = {
          'Executive Director (SuperAdmin)': { canViewFinances: true, canManageClients: true, canEditSprints: true, canApproveDeliverables: true, canManageSettings: true },
          'Project Manager': { canViewFinances: true, canManageClients: true, canEditSprints: true, canApproveDeliverables: true, canManageSettings: false },
          'Web Developer': { canViewFinances: false, canManageClients: false, canEditSprints: true, canApproveDeliverables: true, canManageSettings: false },
          'Graphics Designer': { canViewFinances: false, canManageClients: false, canEditSprints: true, canApproveDeliverables: true, canManageSettings: false },
          'Client Manager': { canViewFinances: true, canManageClients: true, canEditSprints: false, canApproveDeliverables: true, canManageSettings: false },
          'Social Media Manager': { canViewFinances: false, canManageClients: false, canEditSprints: true, canApproveDeliverables: false, canManageSettings: false },
          'Ads Specialist': { canViewFinances: true, canManageClients: false, canEditSprints: true, canApproveDeliverables: false, canManageSettings: false },
          'Executive Assistant': { canViewFinances: true, canManageClients: true, canEditSprints: false, canApproveDeliverables: false, canManageSettings: true }
        };

        const rawUsers: AppUser[] = (parsed.users?.length && parsed.users[0]?.username === 'timi') ? parsed.users : INITIAL_AGENCY_STATE.users;
        const normalizedUsers = rawUsers.map(u => ({
          ...u,
          permissions: u.permissions || defaultPermsByRole[u.adminRoleTitle || 'Web Developer'] || {
            canViewFinances: false,
            canManageClients: false,
            canEditSprints: true,
            canApproveDeliverables: false,
            canManageSettings: false
          }
        }));

        return {
          ...INITIAL_AGENCY_STATE,
          ...parsed,
          isAuthenticated: typeof parsed.isAuthenticated === 'boolean' ? parsed.isAuthenticated : true,
          currentRole: parsed.currentRole || 'admin',
          currentUser: (parsed.currentUser?.username === 'timi' || parsed.currentUser?.name === 'Timi') ? parsed.currentUser : INITIAL_AGENCY_STATE.currentUser,
          users: normalizedUsers,
          meetings: parsed.meetings || [],
          teamMessages: parsed.teamMessages || [],
          activeNav: 'overview',
          admin: {
            ...INITIAL_AGENCY_STATE.admin,
            leads: parsed.admin?.leads || [],
            proposals: parsed.admin?.proposals || [],
            tasks: parsed.admin?.tasks || [],
            retainers: parsed.admin?.retainers || [],
            clientAccounts: parsed.admin?.clientAccounts || [],
            rolesList: parsed.admin?.rolesList?.length ? parsed.admin.rolesList : INITIAL_AGENCY_STATE.admin.rolesList,
            meetings: parsed.admin?.meetings || []
          }
        };
      }
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }
    return INITIAL_AGENCY_STATE;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [createdClientCredentials, setCreatedClientCredentials] = useState<{
    clientName: string;
    company: string;
    contactName: string;
    email: string;
    username: string;
    password: string;
    magicLinkUrl: string;
    whatsappNumber?: string;
    projectBudget?: number;
    projectType?: string;
  } | null>(null);

  const clearCreatedClientCredentials = () => setCreatedClientCredentials(null);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      title: 'Arc Company approved Sprint 4 SOW',
      meta: '5 mins ago • Retainer Contract #ARC-2026',
      type: 'green',
      unread: true,
      nav: 'retainers',
      timestamp: '5m ago'
    },
    {
      id: 'notif_2',
      title: 'Payment received: $14,200 from Nexus Labs',
      meta: '1 hour ago • Direct Wire ACH',
      type: 'blue',
      unread: true,
      nav: 'invoices',
      timestamp: '1h ago'
    },
    {
      id: 'notif_3',
      title: 'Retainer Invoice INV-092 due in 24 hrs',
      meta: '3 hours ago • Automated reminder queued',
      type: 'orange',
      unread: false,
      nav: 'invoices',
      timestamp: '3h ago'
    },
    {
      id: 'notif_4',
      title: 'Mesh Weekly Sync starts in 25 mins',
      meta: 'Today 10:00 AM • Google Meet HD',
      type: 'purple',
      unread: false,
      nav: 'meetings',
      timestamp: 'Today'
    }
  ]);

  // AI Assistant State
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');

  const openAIAssistant = (initialPrompt?: string) => {
    setAiInitialPrompt(initialPrompt || '');
    setIsAIAssistantOpen(true);
  };

  const closeAIAssistant = () => {
    setIsAIAssistantOpen(false);
    setAiInitialPrompt('');
  };

  const dispatchNotification = (
    title: string, 
    meta: string, 
    type: 'green' | 'blue' | 'orange' | 'purple' = 'green', 
    nav?: string
  ) => {
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now() + Math.random(),
      title,
      meta,
      type,
      unread: true,
      nav,
      timestamp: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`🔔 ${title}`);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read.');
  };

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  useEffect(() => {
    try {
      localStorage.setItem('vectorstudio_agency_state_v3', JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [state]);

  // Synchronize Theme with DOM attribute and localStorage
  useEffect(() => {
    const curTheme = state.theme || (localStorage.getItem('vectorstudio_theme') as 'light' | 'dark') || 'light';
    document.documentElement.setAttribute('data-theme', curTheme);
    localStorage.setItem('vectorstudio_theme', curTheme);
  }, [state.theme]);

  // Debounced Toast Notification Dispatcher to prevent duplicate toasts
  const lastToastRef = useRef<{ msg: string; time: number }>({ msg: '', time: 0 });

  const showToast = (msg: string) => {
    const now = Date.now();
    // Strictly deduplicate identical messages dispatched within 900ms
    if (lastToastRef.current.msg === msg && (now - lastToastRef.current.time) < 900) {
      return;
    }
    lastToastRef.current = { msg, time: now };

    const id = 'toast_' + now + '_' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev.filter(t => t.msg !== msg), { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const toggleTheme = () => {
    const nextTheme: 'light' | 'dark' = state.theme === 'dark' ? 'light' : 'dark';
    setState(prev => ({ ...prev, theme: nextTheme }));
    showToast(nextTheme === 'dark' ? '🌙 Premium Obsidian Dark Mode activated' : '☀️ Luxury Cream Light Mode activated');
  };

  const setRole = (role: Role) => {
    setState(prev => ({ ...prev, currentRole: role, activeNav: 'overview' }));
    closeMobileSidebar();
    showToast(role === 'admin' ? 'Switched to Executive Admin Operations' : 'Switched to Arc Company Client Portal');
  };

  const setActiveNav = (nav: string) => {
    setState(prev => ({ ...prev, activeNav: nav }));
    closeMobileSidebar();
  };

  const setSearchQuery = (q: string) => {
    setState(prev => ({ ...prev, searchQuery: q }));
  };

  const approveDeliverable = (id: string) => {
    setState(prev => {
      const updatedDeliverables = prev.clientPortal.deliverables.map(d => 
        d.id === id ? { ...d, status: 'approved' as const } : d
      );

      const approvedCount = updatedDeliverables.filter(d => d.status === 'approved').length;
      const progressPercent = Math.round((approvedCount / updatedDeliverables.length) * 100);

      const approvedItem = prev.clientPortal.deliverables.find(d => d.id === id);
      const newMessages = [...prev.clientPortal.chatMessages];
      if (approvedItem) {
        newMessages.push({
          id: 'c_' + Date.now(),
          sender: 'Sarah Jenkins',
          role: 'client',
          text: `Deliverable Approved: "${approvedItem.name}" (${approvedItem.version}). Sprints aligned for next release.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // Sync with Admin Sprints
      const updatedSprints = prev.admin.sprints.map(s => {
        if (s.name.includes('Design System')) {
          return { ...s, status: 'Completed' as const, progress: 100 };
        }
        return s;
      });

      return {
        ...prev,
        admin: {
          ...prev.admin,
          sprints: updatedSprints
        },
        clientPortal: {
          ...prev.clientPortal,
          progressPercent,
          deliverables: updatedDeliverables,
          chatMessages: newMessages
        }
      };
    });

    showToast('Deliverable signed off and approved!');
  };

  const requestChangesDeliverable = (id: string, notes: string) => {
    setState(prev => {
      const target = prev.clientPortal.deliverables.find(d => d.id === id);
      const updatedDeliverables = prev.clientPortal.deliverables.map(d => 
        d.id === id ? { ...d, status: 'changes_requested' as const } : d
      );

      const newMessages = [...prev.clientPortal.chatMessages];
      if (target) {
        newMessages.push({
          id: 'c_' + Date.now(),
          sender: 'Sarah Jenkins',
          role: 'client',
          text: `Revision Request on "${target.name}": ${notes}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      return {
        ...prev,
        clientPortal: {
          ...prev.clientPortal,
          deliverables: updatedDeliverables,
          chatMessages: newMessages
        }
      };
    });

    closeModal();
    showToast('Revisions sent to VectorStudio team');
  };

  const toggleTask = (id: string) => {
    const target = state.admin.tasks.find(t => t.id === id);
    if (target) {
      const nextDone = !target.done;
      showToast(nextDone ? `Completed task: ${target.title}` : `Reopened task: ${target.title}`);
      updateDbTask(id, { done: nextDone, status: nextDone ? 'done' : 'in_progress' });
    }
    setState(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        tasks: prev.admin.tasks.map(t => t.id === id ? { ...t, done: !t.done, status: !t.done ? 'done' : 'in_progress' } : t)
      }
    }));
  };

  const addTask = (
    title: string, 
    client: string, 
    assignee: string, 
    deadline?: string, 
    priority: 'Urgent' | 'High' | 'Medium' | 'Normal' = 'High',
    description?: string
  ) => {
    const matchedUser = (state.users || []).find(u => u.name.toLowerCase() === assignee.toLowerCase());
    let avatar = matchedUser?.avatar || '/assets/images/carlos.jpg';
    if (!matchedUser) {
      if (assignee.includes('Liam')) avatar = '/assets/images/liam.jpg';
      if (assignee.includes('Diego')) avatar = '/assets/images/diego.jpg';
      if (assignee.includes('Tommy')) avatar = '/assets/images/tommy.jpg';
      if (assignee.includes('Maya')) avatar = '/assets/images/owais.jpg';
      if (assignee.includes('Sarah')) avatar = '/assets/images/tommy.jpg';
    }

    const taskDeadline = deadline || 'Oct 28, 2026';

    const newTask: Task = {
      id: 'tsk_' + Date.now(),
      title,
      client,
      assignee,
      avatar,
      priority,
      done: false,
      status: 'todo',
      deadline: taskDeadline,
      dueDate: taskDeadline,
      description
    };

    setState(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        tasks: [newTask, ...prev.admin.tasks]
      }
    }));

    insertDbTask(newTask);
    closeModal();
    showToast(`Task assigned to ${assignee} (Deadline: ${taskDeadline})`);
    dispatchNotification(
      'New Task Assigned',
      `"${title}" assigned to ${assignee} • Due: ${taskDeadline}`,
      'orange',
      'tasks'
    );
  };

  const addInvoice = (client: string, desc: string, amount: number) => {
    const newInv: Invoice = {
      id: 'inv_' + Date.now(),
      num: `#INV-${Math.floor(2052 + Math.random() * 50)}`,
      client,
      desc,
      amount,
      status: 'pending'
    };

    setState(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        pendingInvoicesTotal: prev.admin.pendingInvoicesTotal + amount,
        invoices: [newInv, ...prev.admin.invoices]
      }
    }));

    insertDbInvoice(newInv);
    closeModal();
    showToast(`Invoice ${newInv.num} issued for $${amount.toLocaleString()}`);
  };

  const addProposal = (client: string, budget: number, duration: string) => {
    const propNum = `#PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const deposit = Math.round(budget * 0.3);
    const newProp: ProposalItem = {
      id: 'prop_' + Date.now(),
      propNum,
      client,
      title: `Fullstack Web Application SOW (${client})`,
      scope: 'Discovery, UI kit tokens, responsive layouts, Next.js build, and deployment cutover.',
      budget,
      winProbability: 90,
      status: 'Sent for Review',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      docsUrl: 'https://docs.google.com/document/d/prop-' + Date.now(),
      signatureStatus: 'Pending Signature',
      assignedLead: state.currentUser?.name || 'Owais Anwer',
      assignedLeadRole: state.currentUser?.adminRoleTitle || 'Project Lead',
      assignedClientUser: client + ' Executive Stakeholder',
      paymentTerms: '30% Kickoff Deposit, 40% Development Delivery, 30% Live Launch',
      paymentStatus: 'unpaid',
      depositAmount: deposit,
      paidAmount: 0,
      milestonesBreakdown: [
        { title: 'Kickoff Discovery & Architecture (30%)', amount: deposit, status: 'due' },
        { title: 'Fullstack Staging & CMS (40%)', amount: Math.round(budget * 0.4), status: 'pending' },
        { title: 'Production Cutover & Launch (30%)', amount: Math.round(budget * 0.3), status: 'pending' }
      ]
    };

    setState(prev => {
      const isCurrentClient = prev.clientPortal.clientName.toLowerCase() === client.toLowerCase();
      return {
        ...prev,
        admin: {
          ...prev.admin,
          proposals: [newProp, ...prev.admin.proposals],
          sprints: [
            ...prev.admin.sprints,
            {
              id: 'sp_' + Date.now(),
              name: `Proposal Scope: ${client}`,
              client,
              status: 'Scheduled',
              progress: 0,
              date: duration
            }
          ]
        },
        clientPortal: {
          ...prev.clientPortal,
          proposals: isCurrentClient ? [newProp, ...(prev.clientPortal.proposals || [])] : prev.clientPortal.proposals
        }
      };
    });

    closeModal();
    dispatchNotification(
      `Proposal Dispatched: ${propNum}`,
      `Sent to ${client} • Budget: $${budget.toLocaleString()} • Deposit: $${deposit.toLocaleString()}`,
      'purple',
      'proposals'
    );
    showToast(`Proposal ${propNum} sent to ${client}! Added to billing pipeline.`);
  };

  const addProposalWithDetails = (proposalData: {
    client: string;
    title: string;
    scope: string;
    budget: number;
    winProbability?: number;
    duration?: string;
    assignedLead?: string;
    assignedClientUser?: string;
  }) => {
    const propNum = `#PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const deposit = Math.round(proposalData.budget * 0.3);
    const newProp: ProposalItem = {
      id: 'prop_' + Date.now(),
      propNum,
      client: proposalData.client,
      title: proposalData.title,
      scope: proposalData.scope,
      budget: proposalData.budget,
      winProbability: proposalData.winProbability || 85,
      status: 'Sent for Review',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      docsUrl: 'https://docs.google.com/document/d/vectorstudio-prop-' + Date.now(),
      signatureStatus: 'Pending Signature',
      assignedLead: proposalData.assignedLead || state.currentUser?.name || 'Owais Anwer',
      assignedLeadRole: 'Project Lead',
      assignedClientUser: proposalData.assignedClientUser || proposalData.client + ' Executive',
      paymentTerms: '30% Kickoff Deposit, 40% Development, 30% Live Launch',
      paymentStatus: 'unpaid',
      depositAmount: deposit,
      paidAmount: 0,
      milestonesBreakdown: [
        { title: 'Discovery & Architecture (30%)', amount: deposit, status: 'due' },
        { title: 'Frontend & Backend Delivery (40%)', amount: Math.round(proposalData.budget * 0.4), status: 'pending' },
        { title: 'Production Cutover & Launch (30%)', amount: Math.round(proposalData.budget * 0.3), status: 'pending' }
      ]
    };

    setState(prev => {
      const isCurrentClient = prev.clientPortal.clientName.toLowerCase() === proposalData.client.toLowerCase();
      return {
        ...prev,
        admin: {
          ...prev.admin,
          proposals: [newProp, ...prev.admin.proposals],
          sprints: [
            ...prev.admin.sprints,
            {
              id: 'sp_' + Date.now(),
              name: proposalData.title,
              client: proposalData.client,
              status: 'In Progress',
              progress: 10,
              date: proposalData.duration || 'Nov 2026 - Dec 2026'
            }
          ]
        },
        clientPortal: {
          ...prev.clientPortal,
          proposals: isCurrentClient ? [newProp, ...(prev.clientPortal.proposals || [])] : prev.clientPortal.proposals
        }
      };
    });

    dispatchNotification(
      `Web Proposal Created: ${propNum}`,
      `Client: ${proposalData.client} • Budget: $${proposalData.budget.toLocaleString()}`,
      'purple',
      'proposals'
    );
    showToast(`✨ Proposal drafted: ${proposalData.title} ($${proposalData.budget.toLocaleString()})`);
  };

  const acceptAndPayProposal = (proposalId: string, paymentMethod: string = 'Direct Bank Wire / Settlement') => {
    const targetProposal = state.admin.proposals.find(p => p.id === proposalId) || 
                           state.clientPortal.proposals?.find(p => p.id === proposalId);
    if (!targetProposal) return;

    const deposit = targetProposal.depositAmount || Math.round(targetProposal.budget * 0.3);
    const invoiceNum = `#INV-${targetProposal.propNum.replace('#PROP-', '')}-DEP`;

    const newInvoice: Invoice = {
      id: 'inv_' + Date.now(),
      num: invoiceNum,
      client: targetProposal.client,
      desc: `Kickoff Deposit (30%) for ${targetProposal.title} (${targetProposal.propNum})`,
      amount: deposit,
      paidAmount: deposit,
      status: 'paid',
      paymentMethod,
      paymentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setState(prev => {
      const updatedAdminProposals = prev.admin.proposals.map(p => 
        p.id === proposalId 
          ? { 
              ...p, 
              status: 'Paid & Active' as const, 
              signatureStatus: 'Signed' as const,
              paymentStatus: 'deposit_paid' as const,
              paidAmount: deposit,
              milestonesBreakdown: p.milestonesBreakdown?.map((m, idx) => idx === 0 ? { ...m, status: 'paid' as const } : m)
            } 
          : p
      );

      const updatedClientProposals = (prev.clientPortal.proposals || []).map(p =>
        p.id === proposalId 
          ? { 
              ...p, 
              status: 'Paid & Active' as const, 
              signatureStatus: 'Signed' as const,
              paymentStatus: 'deposit_paid' as const,
              paidAmount: deposit,
              milestonesBreakdown: p.milestonesBreakdown?.map((m, idx) => idx === 0 ? { ...m, status: 'paid' as const } : m)
            } 
          : p
      );

      return {
        ...prev,
        admin: {
          ...prev.admin,
          revenue: prev.admin.revenue + deposit,
          proposals: updatedAdminProposals,
          invoices: [newInvoice, ...prev.admin.invoices],
          sprints: [
            {
              id: 'sp_prop_' + Date.now(),
              name: `${targetProposal.client}: Kickoff & Architecture Sprint`,
              client: targetProposal.client,
              status: 'In Progress',
              progress: 25,
              date: 'Sprint 1 (Active)'
            },
            ...prev.admin.sprints
          ]
        },
        clientPortal: {
          ...prev.clientPortal,
          proposals: updatedClientProposals,
          invoices: [newInvoice, ...(prev.clientPortal.invoices || [])],
          milestones: [
            {
              id: 'm_paid_' + Date.now(),
              name: `Deposit Confirmed: ${targetProposal.title}`,
              date: 'Activated Today',
              desc: `Kickoff deposit of $${deposit.toLocaleString()} recorded via ${paymentMethod}. Engineering squad mobilized.`,
              status: 'completed'
            },
            ...prev.clientPortal.milestones
          ]
        }
      };
    });

    insertDbInvoice(newInvoice);

    dispatchNotification(
      `Deposit Payment Confirmed: ${targetProposal.client}`,
      `$${deposit.toLocaleString()} USD recorded via ${paymentMethod} for ${targetProposal.propNum}. Sprint 1 mobilized!`,
      'green',
      'invoices'
    );
    showToast(`🎉 Deposit of $${deposit.toLocaleString()} confirmed! Proposal ${targetProposal.propNum} signed & active.`);
  };

  const payInvoice = (invoiceId: string, paymentMethod: string = 'Direct Bank Wire / Transfer') => {
    const inv = state.admin.invoices.find(i => i.id === invoiceId) || 
                state.clientPortal.invoices?.find(i => i.id === invoiceId);
    if (!inv) return;

    setState(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        revenue: prev.admin.revenue + inv.amount,
        invoices: prev.admin.invoices.map(i => i.id === invoiceId ? { 
          ...i, 
          paidAmount: i.amount, 
          status: 'paid' as const,
          paymentMethod,
          paymentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        } : i)
      },
      clientPortal: {
        ...prev.clientPortal,
        invoices: (prev.clientPortal.invoices || []).map(i => i.id === invoiceId ? { 
          ...i, 
          paidAmount: i.amount, 
          status: 'paid' as const,
          paymentMethod,
          paymentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        } : i)
      }
    }));

    updateDbInvoice(invoiceId, {
      paidAmount: inv.amount,
      status: 'paid',
      paymentMethod,
      paymentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    dispatchNotification(
      `Invoice Payment Cleared: ${inv.num}`,
      `$${inv.amount.toLocaleString()} USD settled via ${paymentMethod} from ${inv.client}.`,
      'green',
      'invoices'
    );
    showToast(`✓ Payment of $${inv.amount.toLocaleString()} recorded for invoice ${inv.num}!`);
  };

  const recordClientPayment = (data: {
    clientId?: string;
    invoiceId?: string;
    proposalId?: string;
    paymentType: 'full' | 'part';
    amountPaid: number;
    paymentMethod?: string;
    notes?: string;
    milestoneIndex?: number;
  }) => {
    const method = data.paymentMethod || 'Direct Bank Wire / Transfer';
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setState(prev => {
      let revenueDelta = data.amountPaid;
      let updatedInvoices = [...prev.admin.invoices];
      let updatedClientInvoices = [...(prev.clientPortal.invoices || [])];
      let updatedClientAccounts = [...prev.admin.clientAccounts];
      let targetClientName = '';

      if (data.invoiceId) {
        const inv = updatedInvoices.find(i => i.id === data.invoiceId);
        if (inv) {
          targetClientName = inv.client;
          const currentPaid = inv.paidAmount || (inv.status === 'paid' ? inv.amount : 0);
          const newPaid = data.paymentType === 'full' ? inv.amount : Math.min(inv.amount, currentPaid + data.amountPaid);
          const newStatus: 'paid' | 'partially_paid' | 'pending' = newPaid >= inv.amount ? 'paid' : (newPaid > 0 ? 'partially_paid' : 'pending');

          updatedInvoices = updatedInvoices.map(i => i.id === data.invoiceId ? {
            ...i,
            paidAmount: newPaid,
            status: newStatus,
            paymentMethod: method,
            paymentDate: today,
            paymentNotes: data.notes
          } : i);

          updatedClientInvoices = updatedClientInvoices.map(i => i.id === data.invoiceId ? {
            ...i,
            paidAmount: newPaid,
            status: newStatus,
            paymentMethod: method,
            paymentDate: today,
            paymentNotes: data.notes
          } : i);
        }
      }

      if (data.clientId || targetClientName) {
        updatedClientAccounts = updatedClientAccounts.map(c => {
          if (c.id === data.clientId || c.clientName === targetClientName) {
            const totalBudget = c.projectBudget || 35000;
            const currentClientPaid = c.paidAmount || 0;
            const newClientPaid = data.paymentType === 'full' ? totalBudget : Math.min(totalBudget, currentClientPaid + data.amountPaid);
            const newStatus: 'paid' | 'partially_paid' | 'pending' = newClientPaid >= totalBudget ? 'paid' : (newClientPaid > 0 ? 'partially_paid' : 'pending');

            let updatedMilestones = c.milestonesChecklist ? [...c.milestonesChecklist] : [];
            if (typeof data.milestoneIndex === 'number' && updatedMilestones[data.milestoneIndex]) {
              updatedMilestones[data.milestoneIndex] = { ...updatedMilestones[data.milestoneIndex], completed: true };
            }

            return {
              ...c,
              paidAmount: newClientPaid,
              paymentStatus: newStatus,
              milestonesChecklist: updatedMilestones,
              paymentNotes: data.notes || c.paymentNotes
            };
          }
          return c;
        });
      }

      return {
        ...prev,
        admin: {
          ...prev.admin,
          revenue: prev.admin.revenue + revenueDelta,
          invoices: updatedInvoices,
          clientAccounts: updatedClientAccounts
        },
        clientPortal: {
          ...prev.clientPortal,
          invoices: updatedClientInvoices
        }
      };
    });

    if (data.invoiceId) {
      const inv = state.admin.invoices.find(i => i.id === data.invoiceId);
      if (inv) {
        const currentPaid = inv.paidAmount || (inv.status === 'paid' ? inv.amount : 0);
        const newPaid = data.paymentType === 'full' ? inv.amount : Math.min(inv.amount, currentPaid + data.amountPaid);
        const newStatus: 'paid' | 'partially_paid' | 'pending' = newPaid >= inv.amount ? 'paid' : (newPaid > 0 ? 'partially_paid' : 'pending');
        updateDbInvoice(data.invoiceId, {
          paidAmount: newPaid,
          status: newStatus,
          paymentMethod: method,
          paymentDate: today
        });
      }
    }

    if (data.clientId) {
      const client = state.admin.clientAccounts.find(c => c.id === data.clientId);
      if (client) {
        const totalBudget = client.projectBudget || 35000;
        const currentClientPaid = client.paidAmount || 0;
        const newClientPaid = data.paymentType === 'full' ? totalBudget : Math.min(totalBudget, currentClientPaid + data.amountPaid);
        updateDbClientAccount(data.clientId, {
          paidAmount: newClientPaid
        });
      }
    }

    dispatchNotification(
      `Payment Recorded: $${data.amountPaid.toLocaleString()} USD`,
      `Settled via ${method} (${data.paymentType === 'full' ? '100% Full Payment' : 'Part Payment'}). Ledgers updated.`,
      'green',
      'invoices'
    );
    showToast(`✓ Payment of $${data.amountPaid.toLocaleString()} recorded (${data.paymentType === 'full' ? 'Full Settlement' : 'Part Payment'})`);
  };

  const updateGeminiApiKey = (key: string, model: string = 'gemini-3.4') => {
    localStorage.setItem('vectorstudio_gemini_api_key', key);
    localStorage.setItem('vectorstudio_gemini_model', model);
    setState(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        geminiApiKey: key,
        geminiModel: model
      }
    }));
    showToast(key ? `✨ Google Gemini API Key configured (${model})!` : 'Gemini API Key removed.');
  };

  const updateClientMilestoneChecklist = (clientId: string, milestoneIndex: number, completed: boolean) => {
    setState(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        clientAccounts: prev.admin.clientAccounts.map(c => {
          if (c.id === clientId && c.milestonesChecklist) {
            const updated = [...c.milestonesChecklist];
            if (updated[milestoneIndex]) {
              updated[milestoneIndex] = { ...updated[milestoneIndex], completed };
            }
            return { ...c, milestonesChecklist: updated };
          }
          return c;
        })
      }
    }));
    showToast('Milestone checklist updated.');
  };

  const addMultipleTasks = (tasksList: {
    title: string;
    client: string;
    assignee: string;
    priority: 'Urgent' | 'High' | 'Medium' | 'Normal';
    dueDate?: string;
  }[]) => {
    const newTasks: Task[] = tasksList.map((t, idx) => {
      let avatar = '/assets/images/carlos.jpg';
      if (t.assignee.includes('Liam')) avatar = '/assets/images/liam.jpg';
      if (t.assignee.includes('Diego')) avatar = '/assets/images/diego.jpg';
      if (t.assignee.includes('Tommy')) avatar = '/assets/images/tommy.jpg';
      if (t.assignee.includes('Owais')) avatar = '/assets/images/owais.jpg';
      return {
        id: 'tsk_' + (Date.now() + idx),
        title: t.title,
        client: t.client,
        assignee: t.assignee,
        avatar,
        priority: t.priority,
        done: false,
        status: 'todo',
        dueDate: t.dueDate || 'In 4 days'
      };
    });

    setState(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        tasks: [...newTasks, ...prev.admin.tasks]
      }
    }));

    dispatchNotification(
      `AI Scheduled ${newTasks.length} Sprint Tasks`,
      `Assigned to ${newTasks.map(t => t.assignee).slice(0, 2).join(', ')}`,
      'green',
      'tasks'
    );
    showToast(`✨ VectorAI added ${newTasks.length} tasks to sprint pipeline`);
  };

  const addMilestone = (milestoneData: {
    name: string;
    date: string;
    desc: string;
    status: 'completed' | 'active' | 'upcoming';
    client?: string;
  }) => {
    const newMilestone: Milestone = {
      id: 'm_' + Date.now(),
      name: milestoneData.name,
      date: milestoneData.date,
      desc: milestoneData.desc,
      status: milestoneData.status
    };

    setState(prev => ({
      ...prev,
      clientPortal: {
        ...prev.clientPortal,
        milestones: [...prev.clientPortal.milestones, newMilestone]
      },
      admin: {
        ...prev.admin,
        sprints: [
          ...prev.admin.sprints,
          {
            id: 'sp_m_' + Date.now(),
            name: milestoneData.name,
            client: milestoneData.client || prev.clientPortal.clientName,
            status: milestoneData.status === 'completed' ? 'Completed' : 'Scheduled',
            progress: milestoneData.status === 'completed' ? 100 : 25,
            date: milestoneData.date
          }
        ]
      }
    }));

    dispatchNotification(
      `New Milestone Scheduled: "${milestoneData.name}"`,
      `Target: ${milestoneData.date} • Calendar & Sprints Synced`,
      'purple',
      'timeline'
    );
    showToast(`✨ VectorAI: Milestone "${milestoneData.name}" scheduled`);
  };

  const sendChatMessage = (text: string) => {
    const clientMsg = {
      id: 'c_' + Date.now(),
      sender: 'Sarah Jenkins (Arc Co.)',
      role: 'client' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setState(prev => ({
      ...prev,
      clientPortal: {
        ...prev.clientPortal,
        chatMessages: [...prev.clientPortal.chatMessages, clientMsg]
      }
    }));

    // Auto-respond from agency
    setTimeout(() => {
      const agencyMsg = {
        id: 'c_' + (Date.now() + 1),
        sender: 'Owais Anwer (VectorStudio)',
        role: 'agency' as const,
        text: 'Received! Our engineering team is currently reviewing and we will update you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setState(prev => ({
        ...prev,
        clientPortal: {
          ...prev.clientPortal,
          chatMessages: [...prev.clientPortal.chatMessages, agencyMsg]
        }
      }));
      showToast('New message from Owais Anwer');
    }, 1200);
  };

  const loginAsUser = (user: UserSession) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      currentUser: user,
      currentRole: user.role,
      activeNav: user.role === 'admin' ? 'overview' : 'portal-overview',
      clientPortal: {
        ...prev.clientPortal,
        clientName: user.clientAccount || prev.clientPortal.clientName,
        contactName: user.name
      }
    }));
    closeModal();
    showToast(`Switched identity to ${user.name} (${user.role === 'admin' ? user.adminRoleTitle || 'Admin' : user.clientAccount || 'Client'})`);
  };

  const loginWithCredentials = (identifier: string, _password?: string): boolean => {
    const trimmed = identifier.trim().toLowerCase();
    const matched = state.users.find(u => 
      u.username.toLowerCase() === trimmed || 
      u.email.toLowerCase() === trimmed
    );

    if (matched) {
      const sessionUser: UserSession = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        adminRoleTitle: matched.adminRoleTitle,
        clientAccount: matched.clientAccount,
        avatar: matched.avatar
      };

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        currentUser: sessionUser,
        currentRole: matched.role,
        activeNav: matched.role === 'admin' ? 'overview' : 'portal-overview',
        clientPortal: {
          ...prev.clientPortal,
          clientName: matched.clientAccount || prev.clientPortal.clientName,
          contactName: matched.name
        }
      }));

      showToast(`Welcome back, ${matched.name}! Redirecting to ${matched.role === 'admin' ? 'Executive Operations' : `${matched.clientAccount} Portal`}...`);
      return true;
    }

    // Fallback support if identifier contains @
    if (identifier.includes('@')) {
      const isClient = !identifier.toLowerCase().includes('vectorstudio');
      const baseName = identifier.split('@')[0];
      const displayName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
      const sessionUser: UserSession = {
        id: 'usr_' + Date.now(),
        name: displayName,
        email: identifier,
        role: isClient ? 'client' : 'admin',
        adminRoleTitle: isClient ? undefined : 'Studio Executive',
        clientAccount: isClient ? 'Arc Company' : undefined,
        avatar: '/assets/images/owais.jpg'
      };

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        currentUser: sessionUser,
        currentRole: sessionUser.role,
        activeNav: sessionUser.role === 'admin' ? 'overview' : 'portal-overview',
        clientPortal: {
          ...prev.clientPortal,
          clientName: sessionUser.clientAccount || prev.clientPortal.clientName,
          contactName: sessionUser.name
        }
      }));

      showToast(`Signed in as ${displayName}`);
      return true;
    }

    return false;
  };

  const logout = () => {
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      currentUser: null,
      activeNav: 'overview'
    }));
    closeModal();
    showToast('Signed out successfully. Session terminated.');
  };

  const updateUserRole = (userId: string, newRole: Role, roleTitle?: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              role: newRole, 
              adminRoleTitle: newRole === 'admin' ? (roleTitle || 'Executive Member') : undefined 
            } 
          : u
      )
    }));
    showToast(`Role updated to ${newRole === 'admin' ? (roleTitle || 'Executive Admin') : 'Client Stakeholder'}`);
  };

  const sendOnboardingInvite = (clientId: string) => {
    const client = state.admin.clientAccounts.find(c => c.id === clientId);
    if (!client) return;

    const token = `sec_tok_${Math.random().toString(36).substring(2, 9)}`;
    const magicLinkUrl = `https://app.vectorstudio.design/portal/login?token=${token}`;

    setState(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        clientAccounts: prev.admin.clientAccounts.map(c => 
          c.id === clientId 
            ? { ...c, status: 'invited', onboardingToken: token, magicLinkUrl } 
            : c
        )
      }
    }));

    showToast(`Secure magic-link invite dispatched to ${client.email}! Token: ${token}`);
  };

  const resetClientPassword = (clientId: string) => {
    const client = state.admin.clientAccounts.find(c => c.id === clientId);
    if (!client) return;
    const tempPass = `VS-${Math.floor(100000 + Math.random() * 900000)}`;
    showToast(`Password reset for ${client.username}. Temporary access code: ${tempPass} sent to ${client.email}`);
  };

  const addClientAccount = (clientData: Omit<ClientAccount, 'id' | 'onboardingToken' | 'magicLinkUrl'>) => {
    const token = `sec_tok_${Math.random().toString(36).substring(2, 9)}`;
    const defaultPassword = clientData.password || `VS-${(clientData.clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '')}#2026`;
    const clientUsername = clientData.username || clientData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const magicLinkUrl = `https://app.vectorstudio.design/portal/login?token=${token}`;

    const newAccount: ClientAccount = {
      ...clientData,
      id: 'acc_' + Date.now(),
      username: clientUsername,
      password: defaultPassword,
      onboardingToken: token,
      magicLinkUrl,
      paidAmount: clientData.paidAmount || 0,
      paymentStatus: clientData.paymentStatus || 'pending',
      startDate: clientData.startDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      milestonesChecklist: [
        { id: 'm1_' + Date.now(), title: 'Phase 1: Architecture & UX Discovery (30%)', amount: Math.round((clientData.projectBudget || 35000) * 0.3), completed: false },
        { id: 'm2_' + Date.now(), title: 'Phase 2: UI Design System & Frontend Staging (40%)', amount: Math.round((clientData.projectBudget || 35000) * 0.4), completed: false },
        { id: 'm3_' + Date.now(), title: 'Phase 3: Backend APIs, QA & Domain Cutover (30%)', amount: Math.round((clientData.projectBudget || 35000) * 0.3), completed: false }
      ]
    };

    // Auto seed client user so they can log in
    const clientUser = {
      id: 'usr_cl_' + Date.now(),
      name: clientData.contactName,
      email: clientData.email,
      username: clientUsername,
      password: defaultPassword,
      profession: 'Client Partner',
      contactAddress: clientData.contactAddress || 'Registered Office',
      whatsappNumber: clientData.whatsappNumber || '',
      role: 'client' as Role,
      clientAccount: clientData.clientName,
      status: 'active' as const,
      lastLogin: 'Never (Just Onboarded)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    };

    // Auto-seed comprehensive Web Development Project Milestones
    const targetDate = clientData.targetLaunchDate || 'Dec 15, 2026';
    const webDevMilestones: Milestone[] = [
      { id: 'm_wd1_' + Date.now(), name: 'Discovery & UX Architecture', date: 'Sprint 1', desc: 'Sitemap, wireframes, tech stack & design system scoping', status: 'active' },
      { id: 'm_wd2_' + Date.now(), name: 'Interactive UI & Design Review', date: 'Sprint 2', desc: 'Figma components, high-fidelity responsive layouts & brand tokens', status: 'upcoming' },
      { id: 'm_wd3_' + Date.now(), name: 'Fullstack Web Development & CMS', date: 'Sprint 3', desc: 'React/Next.js frontend, backend API services & content staging', status: 'upcoming' },
      { id: 'm_wd4_' + Date.now(), name: 'QA, SEO Audit & Production Cutover', date: targetDate, desc: 'Lighthouse 95+ performance, responsive testing & domain SSL launch', status: 'upcoming' }
    ];

    // Trigger the Credentials Delivery Modal for the Admin
    setCreatedClientCredentials({
      clientName: clientData.clientName,
      company: clientData.company || `${clientData.clientName} Inc.`,
      contactName: clientData.contactName,
      email: clientData.email,
      username: clientUsername,
      password: defaultPassword,
      magicLinkUrl,
      whatsappNumber: clientData.whatsappNumber,
      projectBudget: clientData.projectBudget || 35000,
      projectType: clientData.projectType || 'Enterprise Web Platform'
    });

    // Auto-seed matching lead in CRM so they appear immediately in CustomersCRM
    const newLead: Lead = {
      id: 'lead_' + Date.now(),
      name: clientData.contactName,
      company: clientData.clientName,
      companyIcon: 'arc',
      phone: clientData.whatsappNumber || '+1 (555) 000-0000',
      email: clientData.email,
      contactAddress: clientData.contactAddress,
      projectBudget: clientData.projectBudget || 35000,
      projectScope: clientData.projectScope || clientData.projectType || 'Fullstack Web Platform',
      status: 'Won & Signed',
      contactedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      followUpDate: clientData.targetLaunchDate || 'Dec 15, 2026',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    };

    setState(prev => ({
      ...prev,
      users: [clientUser, ...prev.users],
      clientPortal: {
        ...prev.clientPortal,
        clientName: clientData.clientName,
        contactName: clientData.contactName,
        milestones: [...webDevMilestones, ...prev.clientPortal.milestones]
      },
      admin: {
        ...prev.admin,
        activeClients: prev.admin.activeClients + 1,
        clientAccounts: [newAccount, ...prev.admin.clientAccounts],
        leads: [newLead, ...prev.admin.leads],
        sprints: [
          {
            id: 'sp_wd_' + Date.now(),
            name: `${clientData.clientName}: Web Sprint 1 (Discovery & Architecture)`,
            client: clientData.clientName,
            status: 'In Progress',
            progress: 20,
            date: 'Target: Sprint 1'
          },
          ...prev.admin.sprints
        ]
      }
    }));
    insertDbClientAccount(newAccount);

    dispatchNotification(
      `Web Client Onboarded: ${clientData.clientName}`,
      `Scope: ${clientData.projectType || 'Custom Web Application'} • WhatsApp: ${clientData.whatsappNumber || 'N/A'}`,
      'purple',
      'settings'
    );
    showToast(`Client "${clientData.clientName}" onboarded with full web development roadmap!`);
  };

  const addUser = (userData: {
    name: string;
    email: string;
    profession: string;
    contactAddress: string;
    whatsappNumber: string;
    role: Role;
    adminRoleTitle: string;
    avatar?: string;
  }) => {
    const username = userData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const newUser = {
      id: 'usr_' + Date.now(),
      name: userData.name,
      email: userData.email,
      username: username || `user${Date.now()}`,
      profession: userData.profession,
      contactAddress: userData.contactAddress,
      whatsappNumber: userData.whatsappNumber,
      role: userData.role,
      adminRoleTitle: userData.role === 'admin' ? userData.adminRoleTitle : undefined,
      clientAccount: userData.role === 'client' ? 'Client Partner' : undefined,
      status: 'active' as const,
      lastLogin: 'Never (Just Onboarded)',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };

    setState(prev => ({
      ...prev,
      users: [newUser, ...prev.users]
    }));

    dispatchNotification(
      `New Team Member Onboarded: ${userData.name}`,
      `Role: ${userData.adminRoleTitle || userData.role} • WhatsApp: ${userData.whatsappNumber || 'N/A'}`,
      'green',
      'settings'
    );
    showToast(`Team member "${userData.name}" onboarded as ${userData.adminRoleTitle || userData.role}!`);
  };

  const updateUser = (userId: string, updatedData: Partial<AppUser>) => {
    setState(prev => {
      const updatedUsers = (prev.users || []).map(u => {
        if (u.id === userId) {
          const updated = { ...u, ...updatedData };
          return updated;
        }
        return u;
      });

      let updatedCurrentUser = prev.currentUser;
      if (prev.currentUser?.id === userId) {
        updatedCurrentUser = {
          ...prev.currentUser,
          ...updatedData,
          adminRoleTitle: updatedData.adminRoleTitle || prev.currentUser.adminRoleTitle
        };
      }

      return {
        ...prev,
        users: updatedUsers,
        currentUser: updatedCurrentUser
      };
    });

    closeModal();
    showToast(`User account updated successfully!`);
    dispatchNotification('User Profile Updated', `User profile updated.`, 'blue', 'settings');
  };

  const suspendUser = (userId: string) => {
    let newStatusStr = 'active';
    setState(prev => {
      const targetUser = prev.users.find(u => u.id === userId);
      const isCurrentlySuspended = targetUser?.status === 'suspended';
      const newStatus: 'active' | 'suspended' = isCurrentlySuspended ? 'active' : 'suspended';
      newStatusStr = newStatus;

      const updatedUsers: AppUser[] = (prev.users || []).map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      );

      return {
        ...prev,
        users: updatedUsers
      };
    });

    closeModal();
    showToast(`User status set to ${newStatusStr.toUpperCase()}`);
    dispatchNotification('User Status Changed', `User status set to ${newStatusStr}`, 'orange', 'settings');
  };

  const deleteUser = (userId: string) => {
    setState(prev => {
      const updatedUsers = (prev.users || []).filter(u => u.id !== userId);
      return {
        ...prev,
        users: updatedUsers
      };
    });

    closeModal();
    showToast(`User account deleted permanently from system.`);
    dispatchNotification('User Deleted', `User account deleted.`, 'orange', 'settings');
  };

  const updateUserPermissions = (userId: string, permissions: RolePermissionFlags) => {
    setState(prev => {
      const updatedUsers: AppUser[] = (prev.users || []).map(u => 
        u.id === userId ? { ...u, permissions } : u
      );
      return {
        ...prev,
        users: updatedUsers
      };
    });
    showToast(`✓ Granular permissions updated for user`);
    dispatchNotification('Permissions Updated', `User permissions modified by Executive Admin.`, 'green', 'settings');
  };

  const updateRolePermissions = (roleId: string, permissions: Partial<RolePermission>) => {
    setState(prev => ({
      ...prev,
      admin: {
        ...prev.admin,
        rolesList: (prev.admin.rolesList || []).map(r => 
          r.id === roleId ? { ...r, ...permissions } : r
        )
      }
    }));
    showToast(`✓ Policy matrix updated for role`);
    dispatchNotification('Role Policy Matrix Updated', `RBAC permissions updated for role.`, 'orange', 'settings');
  };

  const scheduleMeeting = (meetingData: Omit<MeetingItem, 'id' | 'status'>) => {
    const newMeeting: MeetingItem = {
      ...meetingData,
      id: 'mtg-' + Date.now(),
      status: 'scheduled'
    };

    setState(prev => ({
      ...prev,
      meetings: [...(prev.meetings || []), newMeeting],
      admin: {
        ...prev.admin,
        meetings: [...(prev.admin.meetings || []), newMeeting]
      }
    }));

    insertDbMeeting(newMeeting);

    const aheadLabels: Record<string, string> = {
      '15m': '15 minutes ahead of time',
      '30m': '30 minutes ahead of time',
      '1h': '1 hour ahead of time',
      '1d': '1 day ahead of time'
    };
    const aheadStr = aheadLabels[meetingData.notificationAhead] || '30 minutes ahead';

    dispatchNotification(
      `Meeting Scheduled: ${newMeeting.title}`,
      `Date: ${newMeeting.date} at ${newMeeting.time} with ${newMeeting.client}. Ahead-of-time notification set (${aheadStr}).`,
      'blue',
      'meetings'
    );
    showToast(`📅 Meeting scheduled with ${aheadStr} notification alert`);
  };

  const deleteMeeting = (meetingId: string) => {
    setState(prev => ({
      ...prev,
      meetings: (prev.meetings || []).filter(m => m.id !== meetingId),
      admin: {
        ...prev.admin,
        meetings: (prev.admin.meetings || []).filter(m => m.id !== meetingId)
      }
    }));
    deleteDbMeeting(meetingId);
    showToast('Meeting cancelled and removed from calendar.');
  };

  // Real-Time Messaging Engine with BroadcastChannel & LocalStorage Event Sync
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('vectorstudio_realtime_chat');
        channel.onmessage = (event) => {
          if (event.data?.type === 'NEW_MESSAGE' && event.data.payload) {
            const incoming: TeamMessage = event.data.payload;
            setState(prev => {
              const existing = prev.teamMessages || [];
              if (existing.some(m => m.id === incoming.id)) return prev;
              return {
                ...prev,
                teamMessages: [...existing, incoming]
              };
            });
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }

    return () => {
      try {
        channel?.close();
      } catch (e) {}
    };
  }, []);

  const sendRealTimeMessage = (senderId: string, recipientId: string, content: string) => {
    const sender = (state.users || []).find(u => u.id === senderId) || state.currentUser;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg: TeamMessage = {
      id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6),
      senderId: sender?.id || 'usr-1',
      senderName: sender?.name || 'Owais Anwer',
      senderAvatar: sender?.avatar || '/assets/images/owais.jpg',
      recipientId,
      content,
      timestamp: timeStr,
      readStatus: 'delivered'
    };

    setState(prev => ({
      ...prev,
      teamMessages: [...(prev.teamMessages || []), newMsg]
    }));

    insertDbMessage(newMsg);

    // Broadcast down the WebSocket / real-time channel
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('vectorstudio_realtime_chat');
        bc.postMessage({ type: 'NEW_MESSAGE', payload: newMsg });
        bc.close();
      }
    } catch (e) {
      // BroadcastChannel fallback
    }

    // Realistic real-time response simulation if chatting with another team member
    if (recipientId.startsWith('usr-') && recipientId !== sender?.id) {
      const recipientUser = (state.users || []).find(u => u.id === recipientId);
      if (recipientUser) {
        setTimeout(() => {
          const autoReplies = [
            `Got it, ${sender?.name?.split(' ')[0] || 'team'}! Checking on it right now.`,
            `Thanks for sending this over! Reviewing the sprint items now.`,
            `Sounds great! I will have the deliverables pushed to staging shortly.`,
            `Confirmed! Let's align on this in our next scheduled calendar sync.`
          ];
          const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          const replyMsg: TeamMessage = {
            id: 'msg_' + Date.now() + Math.random().toString(36).substring(2, 6),
            senderId: recipientUser.id,
            senderName: recipientUser.name,
            senderAvatar: recipientUser.avatar,
            recipientId: sender?.id || 'usr-1',
            content: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            readStatus: 'delivered'
          };
          setState(prev => ({
            ...prev,
            teamMessages: [...(prev.teamMessages || []), replyMsg]
          }));
          insertDbMessage(replyMsg);
          dispatchNotification(`New message from ${recipientUser.name}`, replyText, 'green', 'messages');
        }, 1200);
      }
    }
  };

  const markMessagesRead = (conversationId: string) => {
    setState(prev => ({
      ...prev,
      teamMessages: (prev.teamMessages || []).map(m => {
        if (m.recipientId === conversationId || m.senderId === conversationId) {
          return { ...m, readStatus: 'read' };
        }
        return m;
      })
    }));
  };

  const openModal = (name: string, data?: any) => {
    setActiveModal(name);
    setModalData(data || null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const updateClientAccount = (clientId: string, updatedData: Partial<ClientAccount>) => {
    setState(prev => {
      const updatedAccounts = (prev.admin.clientAccounts || []).map(c => 
        c.id === clientId ? { ...c, ...updatedData } : c
      );
      const targetClient = updatedAccounts.find(c => c.id === clientId);
      const updatedLeads = (prev.admin.leads || []).map(lead => {
        if (lead.company.toLowerCase() === targetClient?.clientName.toLowerCase() || lead.name.toLowerCase() === targetClient?.contactName.toLowerCase()) {
          return {
            ...lead,
            name: updatedData.contactName || lead.name,
            company: updatedData.clientName || lead.company,
            phone: updatedData.whatsappNumber || lead.phone,
            email: updatedData.email || lead.email,
            contactAddress: updatedData.contactAddress || lead.contactAddress,
            projectBudget: updatedData.projectBudget || lead.projectBudget,
            projectScope: updatedData.projectScope || lead.projectScope
          };
        }
        return lead;
      });

      return {
        ...prev,
        admin: {
          ...prev.admin,
          clientAccounts: updatedAccounts,
          leads: updatedLeads
        }
      };
    });
    updateDbClientAccount(clientId, updatedData);
    showToast(`Client account details saved & synchronized!`);
    dispatchNotification('Client Profile Updated', `Details updated for ${updatedData.clientName || 'Client'}.`, 'blue', 'settings-clients');
  };

  const updateLead = (leadId: string, updatedData: Partial<Lead>) => {
    setState(prev => {
      const updatedLeads = (prev.admin.leads || []).map(l => 
        l.id === leadId ? { ...l, ...updatedData } : l
      );
      const targetLead = updatedLeads.find(l => l.id === leadId);
      const updatedAccounts = (prev.admin.clientAccounts || []).map(c => {
        if (c.clientName.toLowerCase() === targetLead?.company.toLowerCase() || c.contactName.toLowerCase() === targetLead?.name.toLowerCase()) {
          return {
            ...c,
            clientName: updatedData.company || c.clientName,
            contactName: updatedData.name || c.contactName,
            whatsappNumber: updatedData.phone || c.whatsappNumber,
            email: updatedData.email || c.email,
            contactAddress: updatedData.contactAddress || c.contactAddress,
            projectBudget: updatedData.projectBudget || c.projectBudget,
            projectScope: updatedData.projectScope || c.projectScope
          };
        }
        return c;
      });

      return {
        ...prev,
        admin: {
          ...prev.admin,
          leads: updatedLeads,
          clientAccounts: updatedAccounts
        }
      };
    });
    showToast(`Lead / Customer updated successfully!`);
  };

  const addSharedFile = (file: Omit<SharedFile, 'id'>) => {
    const newFile: SharedFile = {
      id: 'f_' + Date.now(),
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'active',
      ...file
    };
    setState(prev => ({
      ...prev,
      clientPortal: {
        ...prev.clientPortal,
        files: [newFile, ...(prev.clientPortal.files || [])]
      }
    }));
    showToast(`File "${newFile.name}" shared successfully!`);
    dispatchNotification('New File Shared', `"${newFile.name}" shared with ${newFile.client || 'Client'}.`, 'green', 'portal-files');
  };

  const updateSharedFile = (fileId: string, updatedData: Partial<SharedFile>) => {
    setState(prev => ({
      ...prev,
      clientPortal: {
        ...prev.clientPortal,
        files: (prev.clientPortal.files || []).map(f => f.id === fileId ? { ...f, ...updatedData } : f)
      }
    }));
    showToast(`Shared file details updated.`);
  };

  const deleteSharedFile = (fileId: string) => {
    setState(prev => ({
      ...prev,
      clientPortal: {
        ...prev.clientPortal,
        files: (prev.clientPortal.files || []).filter(f => f.id !== fileId)
      }
    }));
    showToast(`File removed from shared directory.`);
  };

  // Profile Image Changer
  const updateProfileImage = (avatarUrl: string, userId?: string) => {
    const targetId = userId || state.currentUser?.id;
    setState(prev => {
      const updatedUsers = (prev.users || []).map(u => 
        u.id === targetId ? { ...u, avatar: avatarUrl } : u
      );
      const isCurrentUser = !userId || userId === prev.currentUser?.id;
      return {
        ...prev,
        users: updatedUsers,
        currentUser: isCurrentUser && prev.currentUser 
          ? { ...prev.currentUser, avatar: avatarUrl } 
          : prev.currentUser
      };
    });
    showToast('✓ Profile image updated successfully!');
  };

  // Supabase state management
  const [supabaseConfig, setSupabaseConfigState] = useState(() => getSupabaseConfig());

  // Check for ?token= in URL on mount to auto-login client or user
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    const accounts = state.admin.clientAccounts || [];
    const matchedAccount = accounts.find(c => c.onboardingToken === token || token === `tok_${c.id}`);
    if (matchedAccount) {
      loginAsUser({
        id: matchedAccount.id,
        name: matchedAccount.contactName,
        email: matchedAccount.email,
        role: 'client',
        clientAccount: matchedAccount.clientName,
        avatar: '/assets/images/tommy.jpg'
      });
      showToast(`Welcome ${matchedAccount.contactName}! Signed in via secure Magic Link.`);
    }
  }, [state.admin.clientAccounts]);

  // Automatic pull from Supabase on launch if connected
  useEffect(() => {
    if (supabaseConfig.isConnected) {
      pullStateFromSupabase().then(remoteState => {
        if (remoteState) {
          setState(prev => ({
            ...prev,
            ...remoteState,
            admin: {
              ...prev.admin,
              ...(remoteState.admin || {})
            }
          }));
          showToast('⚡ Live sync: Connected to Supabase Database');
        }
      });

      const client = getSupabaseClient();
      if (client) {
        const channel = client.channel('agency-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, () => {
            pullStateFromSupabase().then(freshData => {
              if (freshData) {
                setState(prev => ({ ...prev, ...freshData }));
              }
            });
          })
          .subscribe();

        return () => {
          client.removeChannel(channel);
        };
      }
    }
  }, [supabaseConfig.isConnected]);

  const updateSupabaseConfig = (url: string, key: string) => {
    saveSupabaseConfig(url, key);
    setSupabaseConfigState(getSupabaseConfig());
    showToast('Supabase credentials saved successfully!');
  };

  const syncWithSupabase = async () => {
    const res = await pushStateToSupabase(state);
    if (res.success) {
      setSupabaseConfigState(getSupabaseConfig());
      showToast(`✓ ${res.message}`);
    } else {
      showToast(`⚠️ Sync notice: ${res.message}`);
    }
    return res;
  };

  return (
    <AgencyContext.Provider
      value={{
        state,
        setRole,
        setActiveNav,
        setSearchQuery,
        approveDeliverable,
        requestChangesDeliverable,
        toggleTask,
        addTask,
        addInvoice,
        addProposal,
        acceptAndPayProposal,
        payInvoice,
        recordClientPayment,
        updateGeminiApiKey,
        updateClientMilestoneChecklist,
        createdClientCredentials,
        clearCreatedClientCredentials,
        addProposalWithDetails,
        addMultipleTasks,
        addMilestone,
        notifications,
        markNotificationsAsRead,
        dispatchNotification,
        isAIAssistantOpen,
        aiInitialPrompt,
        openAIAssistant,
        closeAIAssistant,
        sendChatMessage,
        loginAsUser,
        loginWithCredentials,
        logout,
        updateUserRole,
        sendOnboardingInvite,
        resetClientPassword,
        addClientAccount,
        addUser,
        toasts,
        showToast,
        activeModal,
        modalData,
        openModal,
        closeModal,
        isMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        theme: state.theme,
        toggleTheme,
        updateClientAccount,
        updateLead,
        addSharedFile,
        updateSharedFile,
        deleteSharedFile,
        updateUser,
        suspendUser,
        deleteUser,
        updateUserPermissions,
        updateRolePermissions,
        scheduleMeeting,
        deleteMeeting,
        sendRealTimeMessage,
        markMessagesRead,
        updateProfileImage,
        syncWithSupabase,
        supabaseConfig,
        updateSupabaseConfig
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
};
