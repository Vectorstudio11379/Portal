import type { AgencyState, AppUser, MeetingItem, TeamMessage } from '../types';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-admin',
    name: 'Timi',
    username: 'timi',
    email: 'timi@vectorstudio.design',
    password: 'Computerangel13',
    role: 'admin',
    adminRoleTitle: 'Managing Director & SuperAdmin',
    profession: 'Executive Director & Studio Founder',
    contactAddress: '742 Montgomery St, San Francisco, CA',
    whatsappNumber: '+14155550192',
    avatar: '/assets/images/owais.jpg',
    status: 'active',
    lastLogin: 'Active Now',
    permissions: {
      canViewFinances: true,
      canManageClients: true,
      canEditSprints: true,
      canApproveDeliverables: true,
      canManageSettings: true
    }
  }
];

export const INITIAL_MEETINGS: MeetingItem[] = [];

export const INITIAL_TEAM_MESSAGES: TeamMessage[] = [];

export const INITIAL_AGENCY_STATE: AgencyState = {
  theme: (typeof window !== 'undefined' && localStorage.getItem('vectorstudio_theme') === 'dark') ? 'dark' : 'light',
  isAuthenticated: true,
  currentRole: 'admin',
  currentUser: {
    id: 'usr-admin',
    name: 'Timi',
    email: 'timi@vectorstudio.design',
    role: 'admin',
    adminRoleTitle: 'Managing Director & SuperAdmin',
    avatar: '/assets/images/owais.jpg'
  },
  activeNav: 'overview',
  searchQuery: '',
  users: INITIAL_USERS,
  meetings: INITIAL_MEETINGS,
  teamMessages: INITIAL_TEAM_MESSAGES,
  admin: {
    revenue: 0,
    activeClients: 0,
    pendingInvoicesTotal: 0,
    retainerHoursLogged: 0,
    retainerHoursTotal: 0,
    sprints: [],
    tasks: [],
    retainers: [],
    invoices: [],
    leads: [],
    proposals: [],
    clientAccounts: [],
    rolesList: [
      {
        id: 'role-1',
        roleTitle: 'Web Developer',
        description: 'Frontend & backend web applications, API integrations, database architecture, and production deployments.',
        userCount: 0,
        canViewFinances: false,
        canManageClients: false,
        canEditSprints: true,
        canApproveDeliverables: false,
        canManageSettings: false
      },
      {
        id: 'role-2',
        roleTitle: 'Social Media Manager',
        description: 'Multi-platform content calendars, brand community engagement, viral campaigns, and social analytics tracking.',
        userCount: 0,
        canViewFinances: false,
        canManageClients: true,
        canEditSprints: true,
        canApproveDeliverables: false,
        canManageSettings: false
      },
      {
        id: 'role-3',
        roleTitle: 'Ads Specialist',
        description: 'Performance ad campaigns across Meta, Google, TikTok, and LinkedIn, ROAS tracking, and audience retargeting.',
        userCount: 0,
        canViewFinances: true,
        canManageClients: true,
        canEditSprints: true,
        canApproveDeliverables: false,
        canManageSettings: false
      },
      {
        id: 'role-4',
        roleTitle: 'Project Manager',
        description: 'End-to-end sprint governance, deadline tracking, task allocations, milestone sign-offs, and agency velocity.',
        userCount: 0,
        canViewFinances: true,
        canManageClients: true,
        canEditSprints: true,
        canApproveDeliverables: true,
        canManageSettings: true
      },
      {
        id: 'role-5',
        roleTitle: 'Client Manager',
        description: 'Client relationship orchestration, onboarding interviews, contract proposals, reviews, and client satisfaction.',
        userCount: 0,
        canViewFinances: true,
        canManageClients: true,
        canEditSprints: true,
        canApproveDeliverables: true,
        canManageSettings: false
      },
      {
        id: 'role-6',
        roleTitle: 'Executive Assistant',
        description: 'Executive scheduling, client meeting coordination, correspondence, documentation, and calendar agenda alignment.',
        userCount: 0,
        canViewFinances: false,
        canManageClients: true,
        canEditSprints: true,
        canApproveDeliverables: false,
        canManageSettings: true
      },
      {
        id: 'role-7',
        roleTitle: 'Graphics Designer',
        description: 'Visual identity branding, marketing collateral, vector graphic assets, Figma UI tokens, and creative design sprints.',
        userCount: 0,
        canViewFinances: false,
        canManageClients: false,
        canEditSprints: true,
        canApproveDeliverables: true,
        canManageSettings: false
      },
      {
        id: 'role-8',
        roleTitle: 'Executive Director (SuperAdmin)',
        description: 'Full studio executive governance, financial ledgers, system administration, client contracts, and agency infrastructure.',
        userCount: 1,
        canViewFinances: true,
        canManageClients: true,
        canEditSprints: true,
        canApproveDeliverables: true,
        canManageSettings: true
      }
    ],
    geminiApiKey: '',
    geminiModel: 'gemini-3.4',
    bankWireDetails: {
      bankName: 'Silicon Valley Commercial Bank',
      accountName: 'VectorStudio Creative Labs LLC',
      accountNumber: '•••••••• 8821',
      routingOrIban: '021000021 / US89SVBK0210000218821',
      swiftBic: 'SVBKUS33XXX',
      instructions: 'Please include your invoice or proposal reference (#INV-XXXX) in the wire description. Notify your Project Lead via WhatsApp as soon as transfer is released.'
    }
  },
  clientPortal: {
    clientName: 'VectorStudio Portal',
    contactName: 'Client Contact',
    contactTitle: 'Client Representative',
    progressPercent: 0,
    deliverables: [],
    files: [],
    milestones: [],
    chatMessages: [],
    proposals: [],
    invoices: []
  }
};
