export type Role = 'admin' | 'client';

export interface Sprint {
  id: string;
  name: string;
  client: string;
  status: 'Completed' | 'In Review' | 'In Progress' | 'Staging' | 'Scheduled';
  progress: number;
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  avatar: string;
  company: string;
  companyIcon?: string;
  phone: string;
  status: 'New Lead' | 'In Discussion' | 'Proposal Sent' | 'Won & Signed' | 'Contacted';
  contactedDate: string;
  followUpDate: string;
  email?: string;
  contactAddress?: string;
  projectBudget?: number;
  projectScope?: string;
  notes?: string;
}

export const STANDARD_ROLES = [
  'Web Developer',
  'Social Media Manager',
  'Ads Specialist',
  'Project Manager',
  'Client Manager',
  'Executive Assistant',
  'Graphics Designer',
  'Executive Director (SuperAdmin)'
] as const;

export type StandardRole = typeof STANDARD_ROLES[number];

export interface Task {
  id: string;
  title: string;
  client: string;
  assignee: string;
  avatar: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Normal';
  done: boolean;
  status?: 'todo' | 'in_progress' | 'review' | 'done';
  dueDate?: string;
  deadline?: string;
  description?: string;
}

export interface ProposalItem {
  id: string;
  propNum: string;
  client: string;
  title: string;
  scope: string;
  budget: number;
  winProbability: number;
  status: 'Draft' | 'Sent for Review' | 'Signed & Won' | 'In Negotiation' | 'Paid & Active';
  date: string;
  docsUrl: string;
  signatureStatus: 'Signed' | 'Pending Signature' | 'Draft';
  assignedLead?: string; // Team user (e.g. 'Owais Anwer', 'Diego Alvarez')
  assignedLeadRole?: string;
  assignedClientUser?: string; // Client user (e.g. 'Sarah Jenkins')
  paymentTerms?: string; // e.g. '30% Kickoff Deposit, 40% Development, 30% Live Launch'
  paymentStatus?: 'unpaid' | 'deposit_paid' | 'fully_paid';
  depositAmount?: number;
  paidAmount?: number;
  milestonesBreakdown?: {
    title: string;
    amount: number;
    status: 'pending' | 'due' | 'paid';
  }[];
}

export interface Retainer {
  id: string;
  client: string;
  tier: string;
  monthlyRevenue?: number;
  used: number;
  total: number;
  status: 'normal' | 'warning' | 'alert';
  renewalDate?: string;
  renewalDaysLeft?: number;
  paymentMethod?: string;
  lastInvoiceNum?: string;
  lastInvoiceStatus?: 'paid' | 'pending' | 'overdue';
  outstandingBalance?: number;
}

export interface Invoice {
  id: string;
  num: string;
  client: string;
  desc: string;
  amount: number;
  paidAmount?: number;
  status: 'paid' | 'pending' | 'partially_paid' | 'overdue';
  paymentMethod?: string;
  paymentDate?: string;
  paymentNotes?: string;
  milestonesChecklist?: {
    id: string;
    title: string;
    amount: number;
    completed: boolean;
  }[];
}

export interface Deliverable {
  id: string;
  name: string;
  desc: string;
  version: string;
  submittedBy: string;
  date: string;
  status: 'approved' | 'pending' | 'changes_requested';
}

export interface SharedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedDate?: string;
  uploadedBy?: string;
  client?: string;
  status?: 'active' | 'archived' | 'client_reviewed';
  downloadUrl?: string;
  description?: string;
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  desc: string;
  status: 'completed' | 'active' | 'upcoming';
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: 'agency' | 'client';
  text: string;
  time: string;
}

export interface AppNotification {
  id: string;
  title: string;
  meta: string;
  type: 'green' | 'blue' | 'orange' | 'purple';
  unread: boolean;
  nav?: string;
  timestamp: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionResult?: {
    type: 'task' | 'proposal' | 'milestone' | 'notification' | 'analysis';
    title: string;
    details: string;
    badge: string;
    navTarget?: string;
    items?: string[];
  };
}

export interface ClientAccount {
  id: string;
  clientName: string;
  company: string;
  contactName: string;
  email: string;
  username: string;
  password?: string;
  role: 'client_owner' | 'client_team' | 'client_billing';
  status: 'active' | 'invited' | 'pending_setup';
  onboardingToken: string;
  magicLinkUrl: string;
  lastLogin: string;
  retainerTier: string;
  contactAddress?: string;
  whatsappNumber?: string;
  projectType?: string;
  projectScope?: string;
  projectBudget?: number;
  paidAmount?: number;
  paymentStatus?: 'paid' | 'partially_paid' | 'pending';
  paymentNotes?: string;
  startDate?: string;
  targetLaunchDate?: string;
  milestonesChecklist?: {
    id: string;
    title: string;
    amount: number;
    completed: boolean;
  }[];
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  adminRoleTitle?: string;
  avatar: string;
  clientAccount?: string;
  profession?: string;
  whatsappNumber?: string;
}

export interface AppUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: Role;
  adminRoleTitle?: string;
  clientAccount?: string;
  avatar: string;
  status: 'active' | 'invited' | 'pending' | 'suspended';
  lastLogin: string;
  profession?: string;
  contactAddress?: string;
  whatsappNumber?: string;
  permissions?: RolePermissionFlags;
}

export interface RolePermissionFlags {
  canViewFinances: boolean;
  canManageClients: boolean;
  canEditSprints: boolean;
  canApproveDeliverables: boolean;
  canManageSettings: boolean;
}

export interface RolePermission extends RolePermissionFlags {
  id: string;
  roleTitle: string;
  description: string;
  userCount: number;
}

export interface MeetingItem {
  id: string;
  title: string;
  client: string;
  date: string; // YYYY-MM-DD or readable string
  time: string; // e.g. "10:00 am - 11:30 am"
  attendees: string[]; // names or avatars
  topic: string;
  notificationAhead: '15m' | '30m' | '1h' | '1d';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface TeamMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string; // user id (e.g. 'usr_carlos') or channel id ('#general-agency')
  content: string;
  timestamp: string;
  readStatus: 'sent' | 'delivered' | 'read';
}

export interface AgencyState {
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  currentRole: Role;
  currentUser: UserSession | null;
  activeNav: string;
  searchQuery: string;
  users: AppUser[];
  meetings?: MeetingItem[];
  teamMessages?: TeamMessage[];
  admin: {
    revenue: number;
    activeClients: number;
    pendingInvoicesTotal: number;
    retainerHoursLogged: number;
    retainerHoursTotal: number;
    sprints: Sprint[];
    tasks: Task[];
    retainers: Retainer[];
    invoices: Invoice[];
    leads: Lead[];
    proposals: ProposalItem[];
    clientAccounts: ClientAccount[];
    rolesList: RolePermission[];
    meetings?: MeetingItem[];
    geminiApiKey?: string;
    geminiModel?: string;
    bankWireDetails?: {
      bankName: string;
      accountName: string;
      accountNumber: string;
      routingOrIban: string;
      swiftBic: string;
      instructions: string;
    };
  };
  clientPortal: {
    clientName: string;
    contactName: string;
    contactTitle: string;
    progressPercent: number;
    deliverables: Deliverable[];
    files: SharedFile[];
    milestones: Milestone[];
    chatMessages: ChatMessage[];
    proposals?: ProposalItem[];
    invoices?: Invoice[];
  };
}

