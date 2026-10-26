import type { AgencyState, AppUser, MeetingItem, TeamMessage } from '../types';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-1',
    name: 'Owais Anwer',
    username: 'owais',
    email: 'owais@vectorstudio.design',
    password: 'admin',
    role: 'admin',
    adminRoleTitle: 'Executive Director (SuperAdmin)',
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
  },
  {
    id: 'usr-2',
    name: 'Carlos Mendes',
    username: 'carlos',
    email: 'carlos@vectorstudio.design',
    password: 'admin',
    role: 'admin',
    adminRoleTitle: 'Project Manager',
    profession: 'Senior Technical Web Project Manager',
    contactAddress: '120 Broadway, New York, NY',
    whatsappNumber: '+12125550183',
    avatar: '/assets/images/carlos.jpg',
    status: 'active',
    lastLogin: '2h ago',
    permissions: {
      canViewFinances: true,
      canManageClients: true,
      canEditSprints: true,
      canApproveDeliverables: true,
      canManageSettings: false
    }
  },
  {
    id: 'usr-3',
    name: 'Diego Alvarez',
    username: 'diego',
    email: 'diego@vectorstudio.design',
    password: 'admin',
    role: 'admin',
    adminRoleTitle: 'Web Developer',
    profession: 'Lead Fullstack Next.js Web Developer',
    contactAddress: '450 University Ave, Palo Alto, CA',
    whatsappNumber: '+16505550144',
    avatar: '/assets/images/diego.jpg',
    status: 'active',
    lastLogin: '1h ago',
    permissions: {
      canViewFinances: false,
      canManageClients: false,
      canEditSprints: true,
      canApproveDeliverables: true,
      canManageSettings: false
    }
  },
  {
    id: 'usr-4',
    name: 'Liam Brooks',
    username: 'liam',
    email: 'liam@vectorstudio.design',
    password: 'admin',
    role: 'admin',
    adminRoleTitle: 'Graphics Designer',
    profession: 'Lead Brand Identity & Graphics Designer',
    contactAddress: '88 King St W, Toronto, ON',
    whatsappNumber: '+14165550167',
    avatar: '/assets/images/liam.jpg',
    status: 'active',
    lastLogin: 'Yesterday',
    permissions: {
      canViewFinances: false,
      canManageClients: false,
      canEditSprints: true,
      canApproveDeliverables: true,
      canManageSettings: false
    }
  },
  {
    id: 'usr-5',
    name: 'Sarah Jenkins',
    username: 'sarah.arc',
    email: 'sarah.jenkins@arccompany.io',
    password: 'client',
    role: 'admin',
    adminRoleTitle: 'Client Manager',
    clientAccount: 'Arc Company',
    profession: 'Client Partner & Strategic Account Manager',
    contactAddress: '100 Cyber Way, Austin, TX',
    whatsappNumber: '+15125550198',
    avatar: '/assets/images/tommy.jpg',
    status: 'active',
    lastLogin: 'Today, 2:15 PM',
    permissions: {
      canViewFinances: true,
      canManageClients: true,
      canEditSprints: false,
      canApproveDeliverables: true,
      canManageSettings: false
    }
  },
  {
    id: 'usr-6',
    name: 'Elena Rostova',
    username: 'elena.nexus',
    email: 'elena@nexuslabs.co',
    password: 'admin',
    role: 'admin',
    adminRoleTitle: 'Social Media Manager',
    profession: 'Social Campaigns & Brand Engagement Manager',
    contactAddress: '220 Tech Park, Seattle, WA',
    whatsappNumber: '+12065550123',
    avatar: '/assets/images/diego.jpg',
    status: 'active',
    lastLogin: 'Yesterday, 5:30 PM',
    permissions: {
      canViewFinances: false,
      canManageClients: false,
      canEditSprints: true,
      canApproveDeliverables: false,
      canManageSettings: false
    }
  },
  {
    id: 'usr-7',
    name: 'David Chen',
    username: 'dchen.lumina',
    email: 'david.chen@luminahealth.org',
    password: 'admin',
    role: 'admin',
    adminRoleTitle: 'Ads Specialist',
    profession: 'Performance Marketing & Paid Ads Specialist',
    contactAddress: '55 Medical Center Dr, Boston, MA',
    whatsappNumber: '+16175550189',
    avatar: '/assets/images/carlos.jpg',
    status: 'active',
    lastLogin: 'Oct 22, 2026',
    permissions: {
      canViewFinances: true,
      canManageClients: false,
      canEditSprints: true,
      canApproveDeliverables: false,
      canManageSettings: false
    }
  },
  {
    id: 'usr-8',
    name: 'Maya Lin',
    username: 'maya',
    email: 'maya@vectorstudio.design',
    password: 'admin',
    role: 'admin',
    adminRoleTitle: 'Executive Assistant',
    profession: 'Executive Operations Assistant',
    contactAddress: '350 Mission St, San Francisco, CA',
    whatsappNumber: '+14155550176',
    avatar: '/assets/images/owais.jpg',
    status: 'active',
    lastLogin: '3h ago',
    permissions: {
      canViewFinances: true,
      canManageClients: true,
      canEditSprints: false,
      canApproveDeliverables: false,
      canManageSettings: true
    }
  }
];

export const INITIAL_MEETINGS: MeetingItem[] = [
  {
    id: 'mtg-1',
    title: 'Mesh Weekly Meeting & Client Alignment',
    client: 'Arc Company',
    date: '2026-10-24',
    time: '10:00 am - 12:00 pm',
    attendees: ['Owais Anwer', 'Carlos Mendes', 'Liam Brooks'],
    topic: 'Review of brand guideline deliverables, sprint roadmap handoff, and staging demonstration.',
    notificationAhead: '15m',
    status: 'scheduled'
  },
  {
    id: 'mtg-2',
    title: 'REST Webhooks & Architecture Gate',
    client: 'Nexus Labs',
    date: '2026-10-24',
    time: '02:00 pm - 03:00 pm',
    attendees: ['Diego Alvarez', 'Owais Anwer'],
    topic: 'Technical architecture review of off-platform settlement webhooks, PostgreSQL schemas, and staging server deployments.',
    notificationAhead: '30m',
    status: 'scheduled'
  },
  {
    id: 'mtg-3',
    title: 'HIPAA Compliance & Security Review',
    client: 'Lumina Health',
    date: '2026-10-25',
    time: '04:30 pm - 05:15 pm',
    attendees: ['Owais Anwer', 'Sarah Jenkins'],
    topic: 'Healthcare compliance sign-off on encrypted EHR API endpoints, client authentication, and access controls.',
    notificationAhead: '1h',
    status: 'scheduled'
  },
  {
    id: 'mtg-4',
    title: 'Social Campaign Strategy & Content Calendar',
    client: 'Zenith Retail',
    date: '2026-10-27',
    time: '11:00 am - 12:00 pm',
    attendees: ['Elena Rostova', 'Carlos Mendes'],
    topic: 'Holiday promotion campaign schedule, Instagram Reels roadmap, and advertising budget allocations.',
    notificationAhead: '1h',
    status: 'scheduled'
  },
  {
    id: 'mtg-5',
    title: 'Paid Ads Performance & ROAS Audit',
    client: 'Pulse Fitness',
    date: '2026-10-29',
    time: '03:00 pm - 04:00 pm',
    attendees: ['David Chen', 'Owais Anwer'],
    topic: 'Meta & Google Ads CPA optimization, retargeting funnels, and Q4 media budget expansion.',
    notificationAhead: '30m',
    status: 'scheduled'
  }
];

export const INITIAL_TEAM_MESSAGES: TeamMessage[] = [
  {
    id: 'msg-1',
    senderId: 'usr-3',
    senderName: 'Diego Alvarez',
    senderAvatar: '/assets/images/diego.jpg',
    recipientId: '#general-agency',
    content: 'Just deployed the responsive dark mode tokens to staging server! All UI tables and cards are aligned.',
    timestamp: '10:14 AM',
    readStatus: 'read'
  },
  {
    id: 'msg-2',
    senderId: 'usr-1',
    senderName: 'Owais Anwer',
    senderAvatar: '/assets/images/owais.jpg',
    recipientId: '#general-agency',
    content: 'Awesome work Diego! Checking the accessibility contrast now. Liam, how are the brand assets coming?',
    timestamp: '10:18 AM',
    readStatus: 'read'
  },
  {
    id: 'msg-3',
    senderId: 'usr-4',
    senderName: 'Liam Brooks',
    senderAvatar: '/assets/images/liam.jpg',
    recipientId: '#general-agency',
    content: 'High-res exports and vector iconography are uploaded to the shared assets hub. Ready for client review.',
    timestamp: '10:25 AM',
    readStatus: 'read'
  },
  {
    id: 'msg-4',
    senderId: 'usr-2',
    senderName: 'Carlos Mendes',
    senderAvatar: '/assets/images/carlos.jpg',
    recipientId: 'usr-1',
    content: 'Hey Owais, I reviewed the upcoming sprint deliverables for Arc Company. We can hit the milestone by Tuesday.',
    timestamp: '11:05 AM',
    readStatus: 'read'
  },
  {
    id: 'msg-5',
    senderId: 'usr-1',
    senderName: 'Owais Anwer',
    senderAvatar: '/assets/images/owais.jpg',
    recipientId: 'usr-2',
    content: 'Sounds great Carlos! Let us make sure Sarah gets the milestone preview ahead of our sync.',
    timestamp: '11:12 AM',
    readStatus: 'read'
  }
];

export const INITIAL_AGENCY_STATE: AgencyState = {
  theme: (typeof window !== 'undefined' && localStorage.getItem('vectorstudio_theme') === 'dark') ? 'dark' : 'light',
  isAuthenticated: true,
  currentRole: 'admin',
  currentUser: {
    id: 'usr-1',
    name: 'Owais Anwer',
    email: 'owais@vectorstudio.design',
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
    revenue: 48250,
    activeClients: 14,
    pendingInvoicesTotal: 12800,
    retainerHoursLogged: 142,
    retainerHoursTotal: 180,
    sprints: [
      { id: 'sp1', name: 'Brand Strategy & Identity System', client: 'Arc Company', status: 'Completed', progress: 100, date: 'Oct 10' },
      { id: 'sp2', name: 'Figma Design System & Tokens v2.4', client: 'Arc Company', status: 'In Review', progress: 85, date: 'Oct 24' },
      { id: 'sp3', name: 'Web App Core MVP Staging', client: 'Nexus Labs', status: 'In Progress', progress: 68, date: 'Nov 02' },
      { id: 'sp4', name: 'REST API & Webhooks Integration', client: 'Arc Company', status: 'Staging', progress: 90, date: 'Nov 05' },
      { id: 'sp5', name: 'Healthcare Compliance Audit', client: 'Lumina Health', status: 'Scheduled', progress: 20, date: 'Nov 12' }
    ],
    tasks: [
      { id: 'tsk1', title: 'Review Arc Co. design token exports', client: 'Arc Company', assignee: 'Carlos Mendes', avatar: '/assets/images/carlos.jpg', priority: 'High', done: false, status: 'in_progress', dueDate: 'Today, 5:00 PM' },
      { id: 'tsk2', title: 'Deploy client payment gateway & webhook handlers to staging', client: 'Nexus Labs', assignee: 'Diego Alvarez', avatar: '/assets/images/diego.jpg', priority: 'Urgent', done: false, status: 'todo', dueDate: 'Tomorrow, 12:00 PM' },
      { id: 'tsk3', title: 'Generate monthly retainer burn report', client: 'VectorStudio', assignee: 'Liam Brooks', avatar: '/assets/images/liam.jpg', priority: 'Medium', done: true, status: 'done', dueDate: 'Yesterday' },
      { id: 'tsk4', title: 'QA audit on mobile responsive components', client: 'Arc Company', assignee: 'Tommy Clarke', avatar: '/assets/images/tommy.jpg', priority: 'Normal', done: false, status: 'review', dueDate: 'Oct 26' },
      { id: 'tsk5', title: 'Figma UI kit token variables v2.4 export', client: 'Arc Company', assignee: 'Carlos Mendes', avatar: '/assets/images/carlos.jpg', priority: 'High', done: false, status: 'review', dueDate: 'Oct 25' },
      { id: 'tsk6', title: 'HIPAA compliance architecture review', client: 'Lumina Health', assignee: 'Owais Anwer', avatar: '/assets/images/owais.jpg', priority: 'Urgent', done: false, status: 'in_progress', dueDate: 'Oct 28' }
    ],
    retainers: [
      { id: 'ret1', client: 'Arc Company', tier: 'Tier 1 VIP Retainer', monthlyRevenue: 8500, used: 34, total: 40, status: 'normal', renewalDate: 'Nov 01, 2026', renewalDaysLeft: 7, paymentMethod: 'Direct Wire Transfer', lastInvoiceNum: '#INV-2048', lastInvoiceStatus: 'paid', outstandingBalance: 0 },
      { id: 'ret2', client: 'Nexus Labs', tier: 'Growth Product Tier', monthlyRevenue: 5500, used: 28, total: 35, status: 'normal', renewalDate: 'Nov 05, 2026', renewalDaysLeft: 11, paymentMethod: 'Bank ACH Transfer', lastInvoiceNum: '#INV-2049', lastInvoiceStatus: 'pending', outstandingBalance: 2100 },
      { id: 'ret3', client: 'Lumina Health', tier: 'Scale Dedicated Tier', monthlyRevenue: 6800, used: 18, total: 20, status: 'warning', renewalDate: 'Nov 14, 2026', renewalDaysLeft: 20, paymentMethod: 'Direct Wire Transfer', lastInvoiceNum: '#INV-2050', lastInvoiceStatus: 'pending', outstandingBalance: 5500 },
      { id: 'ret4', client: 'Vanguard AI', tier: 'Executive Advisory Tier', monthlyRevenue: 4500, used: 14, total: 15, status: 'alert', renewalDate: 'Oct 28, 2026', renewalDaysLeft: 3, paymentMethod: 'Direct Wire Transfer', lastInvoiceNum: '#INV-2051', lastInvoiceStatus: 'pending', outstandingBalance: 3100 },
      { id: 'ret5', client: 'Solaria Systems', tier: 'Enterprise Scale Tier', monthlyRevenue: 7200, used: 22, total: 30, status: 'normal', renewalDate: 'Nov 18, 2026', renewalDaysLeft: 24, paymentMethod: 'Direct Wire Transfer', lastInvoiceNum: '#INV-2045', lastInvoiceStatus: 'paid', outstandingBalance: 0 },
      { id: 'ret6', client: 'Kinetix Robotics', tier: 'Design System Tier', monthlyRevenue: 6400, used: 15, total: 25, status: 'normal', renewalDate: 'Nov 22, 2026', renewalDaysLeft: 28, paymentMethod: 'Bank ACH Transfer', lastInvoiceNum: '#INV-2046', lastInvoiceStatus: 'paid', outstandingBalance: 0 },
      { id: 'ret7', client: 'Hyperion Dynamics', tier: 'Dedicated Squad Tier', monthlyRevenue: 5850, used: 19, total: 20, status: 'warning', renewalDate: 'Nov 03, 2026', renewalDaysLeft: 9, paymentMethod: 'Direct Wire Transfer', lastInvoiceNum: '#INV-2044', lastInvoiceStatus: 'paid', outstandingBalance: 0 },
      { id: 'ret8', client: 'Apex Media', tier: 'Advisory Retainer', monthlyRevenue: 3500, used: 8, total: 10, status: 'normal', renewalDate: 'Dec 01, 2026', renewalDaysLeft: 37, paymentMethod: 'Direct Wire Transfer', lastInvoiceNum: '#INV-2043', lastInvoiceStatus: 'paid', outstandingBalance: 0 }
    ],
    invoices: [
      { id: 'inv1', num: '#INV-2048', client: 'Arc Company', desc: 'Monthly Retainer - Oct 2026', amount: 8500, paidAmount: 8500, status: 'paid', paymentMethod: 'Direct Wire Transfer', paymentDate: 'Oct 02, 2026' },
      { 
        id: 'inv2', 
        num: '#INV-2049', 
        client: 'Nexus Labs', 
        desc: 'Milestone 2 - UI Kit Deliverable', 
        amount: 4200, 
        paidAmount: 2100, 
        status: 'partially_paid', 
        paymentMethod: 'Bank ACH Transfer', 
        paymentDate: 'Oct 15, 2026',
        milestonesChecklist: [
          { id: 'm1', title: '50% Initial Milestone Payment', amount: 2100, completed: true },
          { id: 'm2', title: '50% Final Deliverable Balance', amount: 2100, completed: false }
        ]
      },
      { id: 'inv3', num: '#INV-2050', client: 'Lumina Health', desc: 'Sprint 1 - Brand Identity', amount: 5500, paidAmount: 0, status: 'pending', paymentMethod: 'Direct Wire Transfer' },
      { id: 'inv4', num: '#INV-2051', client: 'Vanguard AI', desc: 'Technical Architecture Review', amount: 3100, paidAmount: 0, status: 'pending', paymentMethod: 'Direct Wire Transfer' }
    ],
    leads: [
      {
        id: 'ld1',
        name: 'Blanca Seals',
        avatar: '/assets/images/owais.jpg',
        company: 'Davis Tech',
        companyIcon: 'apple',
        phone: '(480) 957-2489',
        status: 'New Lead',
        contactedDate: 'Mar 03, 2026',
        followUpDate: 'Mar 10, 2026'
      },
      {
        id: 'ld2',
        name: 'Marcus Vance',
        avatar: '/assets/images/carlos.jpg',
        company: 'Arc Company',
        companyIcon: 'arc',
        phone: '(415) 883-9120',
        status: 'In Discussion',
        contactedDate: 'Feb 28, 2026',
        followUpDate: 'Mar 08, 2026'
      },
      {
        id: 'ld3',
        name: 'Elena Rostova',
        avatar: '/assets/images/liam.jpg',
        company: 'Nexus Labs',
        companyIcon: 'nexus',
        phone: '(650) 441-7892',
        status: 'Proposal Sent',
        contactedDate: 'Mar 01, 2026',
        followUpDate: 'Mar 12, 2026'
      },
      {
        id: 'ld4',
        name: 'David Chen',
        avatar: '/assets/images/diego.jpg',
        company: 'Lumina Health',
        companyIcon: 'lumina',
        phone: '(312) 550-6194',
        status: 'Won & Signed',
        contactedDate: 'Feb 24, 2026',
        followUpDate: 'Mar 05, 2026'
      },
      {
        id: 'ld5',
        name: 'Sophia Martinez',
        avatar: '/assets/images/tommy.jpg',
        company: 'Vanguard AI',
        companyIcon: 'vanguard',
        phone: '(206) 774-3381',
        status: 'Contacted',
        contactedDate: 'Mar 02, 2026',
        followUpDate: 'Mar 14, 2026'
      }
    ],
    proposals: [
      {
        id: 'prop-1',
        propNum: '#PROP-2048',
        client: 'Arc Company',
        title: 'Design System & Token Architecture v2.4',
        scope: '140+ components, multi-brand tokens, and dark mode scaling.',
        budget: 18500,
        winProbability: 95,
        status: 'Signed & Won',
        date: 'Oct 12, 2026',
        docsUrl: 'https://docs.google.com/document/d/arc-proposal',
        signatureStatus: 'Signed',
        assignedLead: 'Owais Anwer',
        assignedLeadRole: 'Project Lead',
        assignedClientUser: 'Sarah Jenkins (VP Product)',
        paymentTerms: '30% Deposit ($5,550), 40% Development ($7,400), 30% Final Launch ($5,550)',
        paymentStatus: 'deposit_paid',
        depositAmount: 5550,
        paidAmount: 5550,
        milestonesBreakdown: [
          { title: 'Kickoff Discovery & Architecture (30%)', amount: 5550, status: 'paid' },
          { title: 'Figma Token Library & Staging Build (40%)', amount: 7400, status: 'due' },
          { title: 'Production Cutover & Sign-Off (30%)', amount: 5550, status: 'pending' }
        ]
      },
      {
        id: 'prop-2',
        propNum: '#PROP-2049',
        client: 'Nexus Labs',
        title: 'Fullstack Web App Core MVP & Custom Engine',
        scope: 'Next.js 15, PostgreSQL, modular API webhooks, auth flows.',
        budget: 28000,
        winProbability: 85,
        status: 'Sent for Review',
        date: 'Oct 22, 2026',
        docsUrl: 'https://docs.google.com/document/d/nexus-proposal',
        signatureStatus: 'Pending Signature',
        assignedLead: 'Diego Alvarez',
        assignedLeadRole: 'Fullstack Web Developer',
        assignedClientUser: 'Elena Rostova (Founder)',
        paymentTerms: '40% Deposit ($11,200), 30% Beta Milestone ($8,400), 30% Live Launch ($8,400)',
        paymentStatus: 'unpaid',
        depositAmount: 11200,
        paidAmount: 0,
        milestonesBreakdown: [
          { title: 'Project Kickoff & DB Architecture (40%)', amount: 11200, status: 'due' },
          { title: 'Beta Staging & API Integration (30%)', amount: 8400, status: 'pending' },
          { title: 'Production Launch & DNS Cutover (30%)', amount: 8400, status: 'pending' }
        ]
      },
      {
        id: 'prop-3',
        propNum: '#PROP-2050',
        client: 'Lumina Health',
        title: 'HIPAA Compliant Patient Portal & Telehealth UI',
        scope: 'Compliance-verified UI kit, encryption workflows, EHR integration.',
        budget: 24000,
        winProbability: 80,
        status: 'In Negotiation',
        date: 'Oct 23, 2026',
        docsUrl: 'https://docs.google.com/document/d/lumina-proposal',
        signatureStatus: 'Draft',
        assignedLead: 'Carlos Mendes',
        assignedLeadRole: 'Product Designer',
        assignedClientUser: 'David Chen (Director of Tech)',
        paymentTerms: '50% Upfront ($12,000), 50% Audit Sign-off ($12,000)',
        paymentStatus: 'unpaid',
        depositAmount: 12000,
        paidAmount: 0,
        milestonesBreakdown: [
          { title: 'Discovery & Security Wireframing (50%)', amount: 12000, status: 'pending' },
          { title: 'HIPAA Portal Delivery & Cutover (50%)', amount: 12000, status: 'pending' }
        ]
      },
      {
        id: 'prop-4',
        propNum: '#PROP-2051',
        client: 'Vanguard AI',
        title: 'Executive Advisory & Generative UX Overhaul',
        scope: 'Quarterly AI prompt engineering guidelines and conversational UX.',
        budget: 14000,
        winProbability: 90,
        status: 'Sent for Review',
        date: 'Oct 24, 2026',
        docsUrl: 'https://docs.google.com/document/d/vanguard-proposal',
        signatureStatus: 'Pending Signature',
        assignedLead: 'Liam Brooks',
        assignedLeadRole: 'Product Designer',
        assignedClientUser: 'Sophia Martinez (VP Ops)',
        paymentTerms: '100% Invoiced Retainer ($14,000)',
        paymentStatus: 'unpaid',
        depositAmount: 14000,
        paidAmount: 0,
        milestonesBreakdown: [
          { title: 'Quarterly Advisory Package (100%)', amount: 14000, status: 'due' }
        ]
      }
    ],
    clientAccounts: [
      {
        id: 'acc-1',
        clientName: 'Arc Company',
        company: 'Arc Technologies Inc.',
        contactName: 'Sarah Jenkins',
        email: 'sarah.jenkins@arccompany.io',
        username: 'sarah.arc',
        password: 'ArcLaunch#2026',
        role: 'client_owner',
        status: 'active',
        onboardingToken: 'arc_sec_tok_9942a',
        magicLinkUrl: 'https://app.vectorstudio.design/portal/login?token=arc_sec_tok_9942a',
        lastLogin: 'Today, 2:15 PM',
        retainerTier: 'Tier 1 VIP Retainer',
        contactAddress: '100 Cyber Way, Austin, TX',
        whatsappNumber: '+15125550198',
        projectType: 'Enterprise SaaS Web Platform',
        projectScope: 'Next.js 15 web platform, multi-brand design system tokens, and encrypted client portal.',
        projectBudget: 48500,
        paidAmount: 14050,
        paymentStatus: 'partially_paid',
        startDate: 'Oct 01, 2026',
        targetLaunchDate: 'Dec 15, 2026',
        milestonesChecklist: [
          { id: 'm-arc-1', title: 'Kickoff Discovery & Architecture (30%)', amount: 14550, completed: true },
          { id: 'm-arc-2', title: 'Figma Token Library & Staging Build (40%)', amount: 19400, completed: false },
          { id: 'm-arc-3', title: 'Production Cutover & Sign-Off (30%)', amount: 14550, completed: false }
        ]
      },
      {
        id: 'acc-2',
        clientName: 'Nexus Labs',
        company: 'Nexus AI & Robotics',
        contactName: 'Elena Rostova',
        email: 'elena@nexuslabs.co',
        username: 'elena.nexus',
        password: 'NexusSecure!882',
        role: 'client_owner',
        status: 'active',
        onboardingToken: 'nexus_sec_tok_8112f',
        magicLinkUrl: 'https://app.vectorstudio.design/portal/login?token=nexus_sec_tok_8112f',
        lastLogin: 'Yesterday, 5:30 PM',
        retainerTier: 'Growth Product Tier',
        contactAddress: '220 Tech Park, Seattle, WA',
        whatsappNumber: '+12065550123',
        projectType: 'E-commerce & AI Dashboard Suite',
        projectScope: 'Custom checkout architecture, headless portal, and PostgreSQL analytics backend.',
        projectBudget: 34000,
        paidAmount: 11200,
        paymentStatus: 'partially_paid',
        startDate: 'Oct 10, 2026',
        targetLaunchDate: 'Jan 20, 2027',
        milestonesChecklist: [
          { id: 'm-nex-1', title: 'Project Kickoff & DB Architecture (40%)', amount: 13600, completed: true },
          { id: 'm-nex-2', title: 'Beta Staging & API Integration (30%)', amount: 10200, completed: false },
          { id: 'm-nex-3', title: 'Production Launch & DNS Cutover (30%)', amount: 10200, completed: false }
        ]
      },
      {
        id: 'acc-3',
        clientName: 'Lumina Health',
        company: 'Lumina Healthcare Systems',
        contactName: 'David Chen',
        email: 'david.chen@luminahealth.org',
        username: 'dchen.lumina',
        password: 'LuminaHealth#2026',
        role: 'client_owner',
        status: 'invited',
        onboardingToken: 'lumina_sec_tok_4721d',
        magicLinkUrl: 'https://app.vectorstudio.design/portal/login?token=lumina_sec_tok_4721d',
        lastLogin: 'Never (Invite Dispatched)',
        retainerTier: 'Scale Dedicated Tier',
        contactAddress: '55 Medical Center Dr, Boston, MA',
        whatsappNumber: '+16175550189',
        projectType: 'HIPAA Compliant Web Portal',
        projectScope: 'Telehealth scheduling, encrypted EHR integrations, and patient dashboard.',
        projectBudget: 52000,
        paidAmount: 0,
        paymentStatus: 'pending',
        startDate: 'Nov 01, 2026',
        targetLaunchDate: 'Feb 10, 2027',
        milestonesChecklist: [
          { id: 'm-lum-1', title: 'Compliance & Threat Modeling (30%)', amount: 15600, completed: false },
          { id: 'm-lum-2', title: 'Patient Portal Frontend & APIs (40%)', amount: 20800, completed: false },
          { id: 'm-lum-3', title: 'EHR Production Cutover (30%)', amount: 15600, completed: false }
        ]
      },
      {
        id: 'acc-4',
        clientName: 'Vanguard AI',
        company: 'Vanguard Cognitive Computing',
        contactName: 'Sophia Martinez',
        email: 'smartinez@vanguardai.com',
        username: 'sophia.vanguard',
        password: 'VanguardAI$Pass1',
        role: 'client_billing',
        status: 'active',
        onboardingToken: 'vanguard_sec_tok_1039b',
        magicLinkUrl: 'https://app.vectorstudio.design/portal/login?token=vanguard_sec_tok_1039b',
        lastLogin: 'Oct 23, 2026',
        retainerTier: 'Executive Advisory Tier',
        contactAddress: '88 Palo Alto Sq, Palo Alto, CA',
        whatsappNumber: '+16505550177',
        projectType: 'AI Agent Web Platform',
        projectScope: 'Generative prompt studio, vector database connectivity, and WebSocket stream UX.',
        projectBudget: 29500,
        paidAmount: 0,
        paymentStatus: 'pending',
        startDate: 'Oct 20, 2026',
        targetLaunchDate: 'Nov 30, 2026',
        milestonesChecklist: [
          { id: 'm-van-1', title: 'Architecture Review & Discovery (50%)', amount: 14750, completed: false },
          { id: 'm-van-2', title: 'Model Pipeline & Final Delivery (50%)', amount: 14750, completed: false }
        ]
      }
    ],
    rolesList: [
      {
        id: 'role-1',
        roleTitle: 'Web Developer',
        description: 'Frontend & backend web applications, API integrations, database architecture, and production deployments.',
        userCount: 2,
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
        userCount: 1,
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
        userCount: 1,
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
        userCount: 1,
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
        userCount: 1,
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
        userCount: 1,
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
        userCount: 1,
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
    clientName: 'Arc Company',
    contactName: 'Sarah Jenkins',
    contactTitle: 'VP of Product',
    progressPercent: 76,
    deliverables: [
      {
        id: 'del-1',
        name: 'Brand Guidelines v2.0 & Identity Manual',
        desc: 'Comprehensive visual manual, typography scale, digital palette, and responsive logo exports.',
        version: 'v2.0',
        submittedBy: 'Liam Brooks',
        date: 'Oct 20, 2026',
        status: 'approved'
      },
      {
        id: 'del-2',
        name: 'Figma Design System UI Kit v2.4',
        desc: 'Over 140+ production components with auto-layout, token variables, and WCAG AA contrast compliance.',
        version: 'v2.4',
        submittedBy: 'Carlos Mendes',
        date: 'Oct 24, 2026',
        status: 'pending'
      },
      {
        id: 'del-3',
        name: 'Landing Page High-Fidelity Prototype',
        desc: 'Interactive micro-interactions, responsive mobile layout, and user onboarding flow animation.',
        version: 'v1.8',
        submittedBy: 'Owais Anwer',
        date: 'Oct 24, 2026',
        status: 'pending'
      },
      {
        id: 'del-4',
        name: 'REST API & Webhook Contract Spec',
        desc: 'OpenAPI 3.1 specification for client portal sync, REST API endpoints, and authentication flows.',
        version: 'v1.2',
        submittedBy: 'Diego Alvarez',
        date: 'Oct 18, 2026',
        status: 'approved'
      }
    ],
    files: [
      { id: 'f1', name: 'Arc_Brand_Guidelines_v2.0.pdf', size: '24.5 MB', type: 'PDF', uploadedDate: 'Oct 20, 2026', uploadedBy: 'Liam Brooks', client: 'Arc Company', status: 'client_reviewed', description: 'Comprehensive visual manual, typography scale, digital palette, and responsive logo exports.' },
      { id: 'f2', name: 'VectorStudio_Design_Tokens.json', size: '184 KB', type: 'JSON', uploadedDate: 'Oct 22, 2026', uploadedBy: 'Carlos Mendes', client: 'Arc Company', status: 'active', description: 'Design tokens in JSON format for web and iOS/Android styles.' },
      { id: 'f3', name: 'Arc_Figma_Component_Library.fig', size: '48.2 MB', type: 'FIG', uploadedDate: 'Oct 23, 2026', uploadedBy: 'Carlos Mendes', client: 'Arc Company', status: 'active', description: 'Production Figma components with auto-layout and dark mode variants.' },
      { id: 'f4', name: 'Interactive_Prototype_Walkthrough.mp4', size: '16.8 MB', type: 'VIDEO', uploadedDate: 'Oct 24, 2026', uploadedBy: 'Owais Anwer', client: 'Arc Company', status: 'client_reviewed', description: 'Walkthrough video demonstrating landing page and micro-interactions.' },
      { id: 'f5', name: 'OpenAPI_3.1_Specification.yaml', size: '92 KB', type: 'YAML', uploadedDate: 'Oct 18, 2026', uploadedBy: 'Diego Alvarez', client: 'Arc Company', status: 'active', description: 'REST API contract specifications and payload schemas.' }
    ],
    milestones: [
      { id: 'm1', name: 'Phase 1: Brand Strategy & Architecture', date: 'Oct 10, 2026', desc: 'Core discovery, brand positioning, identity manual sign-off.', status: 'completed' },
      { id: 'm2', name: 'Phase 2: Design System & Token Foundation', date: 'Oct 18, 2026', desc: 'Component library, color systems, Figma UI kit.', status: 'completed' },
      { id: 'm3', name: 'Phase 3: Beta Release & Staging Deployment', date: 'Oct 27, 2026 (3 Days Left)', desc: 'Full application staging deployment and security audit.', status: 'active' },
      { id: 'm4', name: 'Phase 4: Production Launch & DNS Cutover', date: 'Nov 15, 2026', desc: 'Zero-downtime production deployment and launch monitoring.', status: 'upcoming' }
    ],
    chatMessages: [
      { id: 'c1', sender: 'Owais Anwer', role: 'agency', text: 'Hi Sarah! We have pushed the updated Figma Design System v2.4 and the interactive landing prototype for your review.', time: '10:45 AM' },
      { id: 'c2', sender: 'Sarah Jenkins', role: 'client', text: 'Thanks Owais! Reviewing with our executive team right now. The micro-interactions and dark mode look exceptional.', time: '11:15 AM' },
      { id: 'c3', sender: 'Carlos Mendes', role: 'agency', text: 'Let us know if you need any adjustments to the typography tokens before final sign-off.', time: '11:22 AM' }
    ],
    proposals: [
      {
        id: 'prop-1',
        propNum: '#PROP-2048',
        client: 'Arc Company',
        title: 'Design System & Token Architecture v2.4',
        scope: '140+ components, multi-brand tokens, and dark mode scaling.',
        budget: 18500,
        winProbability: 95,
        status: 'Signed & Won',
        date: 'Oct 12, 2026',
        docsUrl: 'https://docs.google.com/document/d/arc-proposal',
        signatureStatus: 'Signed',
        assignedLead: 'Owais Anwer',
        assignedLeadRole: 'Project Lead',
        assignedClientUser: 'Sarah Jenkins (VP Product)',
        paymentTerms: '30% Deposit ($5,550), 40% Development ($7,400), 30% Final Launch ($5,550)',
        paymentStatus: 'deposit_paid',
        depositAmount: 5550,
        paidAmount: 5550,
        milestonesBreakdown: [
          { title: 'Kickoff Discovery & Architecture (30%)', amount: 5550, status: 'paid' },
          { title: 'Figma Token Library & Staging Build (40%)', amount: 7400, status: 'due' },
          { title: 'Production Cutover & Sign-Off (30%)', amount: 5550, status: 'pending' }
        ]
      },
      {
        id: 'prop-5',
        propNum: '#PROP-2055',
        client: 'Arc Company',
        title: 'Fullstack Next.js 15 Web Portal & Custom API Architecture',
        scope: 'Production Next.js frontend, PostgreSQL database, automated API webhooks, and Lighthouse 95+ performance optimization.',
        budget: 32000,
        winProbability: 90,
        status: 'Sent for Review',
        date: 'Oct 24, 2026',
        docsUrl: 'https://docs.google.com/document/d/arc-web-expansion',
        signatureStatus: 'Pending Signature',
        assignedLead: 'Diego Alvarez',
        assignedLeadRole: 'Fullstack Web Developer',
        assignedClientUser: 'Sarah Jenkins (VP Product)',
        paymentTerms: '30% Kickoff Deposit ($9,600), 40% Staging QA ($12,800), 30% Live Cutover ($9,600)',
        paymentStatus: 'unpaid',
        depositAmount: 9600,
        paidAmount: 0,
        milestonesBreakdown: [
          { title: 'Kickoff Deposit & Architecture Setup (30%)', amount: 9600, status: 'due' },
          { title: 'Fullstack Development & Staging Review (40%)', amount: 12800, status: 'pending' },
          { title: 'Production Cutover & Domain Launch (30%)', amount: 9600, status: 'pending' }
        ]
      }
    ],
    invoices: [
      { id: 'inv1', num: '#INV-2048', client: 'Arc Company', desc: 'Monthly Retainer - Oct 2026', amount: 8500, paidAmount: 8500, status: 'paid', paymentMethod: 'Direct Wire Transfer', paymentDate: 'Oct 02, 2026' },
      { id: 'inv-dep-1', num: '#INV-2048-DEP', client: 'Arc Company', desc: 'Kickoff Deposit for Design System v2.4 (#PROP-2048)', amount: 5550, paidAmount: 5550, status: 'paid', paymentMethod: 'Direct Wire Transfer', paymentDate: 'Oct 12, 2026' },
      { id: 'inv-due-1', num: '#INV-2055-DEP', client: 'Arc Company', desc: '30% Kickoff Deposit for Next.js 15 Web Portal (#PROP-2055)', amount: 9600, paidAmount: 0, status: 'pending', paymentMethod: 'Bank Wire Transfer' }
    ]
  }
};
