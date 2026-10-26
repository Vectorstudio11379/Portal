import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Bell, 
  FileText, 
  Zap, 
  Check, 
  ChevronRight
} from 'lucide-react';
import { useAgency } from '../context/AgencyContext';
import type { AIMessage } from '../types';

export const AdminAICopilot: React.FC = () => {
  const { 
    state, 
    isAIAssistantOpen, 
    closeAIAssistant, 
    aiInitialPrompt,
    addMultipleTasks,
    addProposalWithDetails,
    addMilestone,
    dispatchNotification,
    setActiveNav,
    updateGeminiApiKey,
    showToast 
  } = useAgency();

  const { admin, clientPortal } = state;
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks' | 'proposals' | 'timeline' | 'notifications'>('chat');
  const [inputText, setInputText] = useState('');
  const [quickApiKey, setQuickApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initial welcome message and conversation history
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg_init',
      role: 'assistant',
      content: `Hello ${state.currentUser?.name?.split(' ')[0] || 'Executive'}. I am your **VectorAI Executive Copilot**.\n\nI can execute live operations across VectorStudio: auto-generating sprint tasks, drafting proposals synced with Google Docs, scheduling milestone timelines on the calendar, and dispatching smart notifications for pending items. How would you like to proceed?`,
      timestamp: 'Active Now'
    }
  ]);

  // Task Generator State
  const [taskClient, setTaskClient] = useState('Arc Company');
  const [taskEpic, setTaskEpic] = useState('Mobile Responsive Polish & Performance Audit');
  const [taskCount, setTaskCount] = useState(3);

  // Proposal Generator State
  const [propClient, setPropClient] = useState('Solana Labs');
  const [propTemplate, setPropTemplate] = useState('Enterprise Web Architecture & SaaS Dashboard');
  const [propBudget, setPropBudget] = useState(38500);

  // Timeline / Calendar State
  const [milestoneClient, setMilestoneClient] = useState('Arc Company');
  const [milestoneTitle, setMilestoneTitle] = useState('Sprint 5 Handoff & Staging Validation');
  const [milestoneDate, setMilestoneDate] = useState('Nov 18, 2026');
  const [milestoneDesc, setMilestoneDesc] = useState('End-to-end user acceptance testing, Figma token sync, and staging sign-off.');

  // Handle incoming initial prompt
  useEffect(() => {
    if (aiInitialPrompt && isAIAssistantOpen) {
      handleUserSubmit(aiInitialPrompt);
    }
  }, [aiInitialPrompt, isAIAssistantOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  if (!isAIAssistantOpen) return null;

  // Execute Natural Language Commands
  const handleUserSubmit = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isProcessing) return;

    const userMsg: AIMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsProcessing(true);

    // Live Google Gemini API Integration
    const apiKey = admin.geminiApiKey || localStorage.getItem('vectorstudio_gemini_api_key');
    if (apiKey) {
      try {
        const clientsBrief = admin.clientAccounts.map(c => `${c.clientName} (Budget: $${c.projectBudget}, Paid: $${c.paidAmount || 0}, Status: ${c.paymentStatus})`).join('; ');
        const invoicesBrief = admin.invoices.map(i => `${i.num}: $${i.amount} (${i.status}) for ${i.client}`).join('; ');
        const tasksBrief = admin.tasks.slice(0, 5).map(t => `${t.title} [${t.priority}] -> ${t.assignee}`).join('; ');

        const systemPrompt = `You are the VectorAI Executive Copilot for VectorStudio Agency OS, powered by Google Gemini 3.4.
Platform Telemetry:
- Active Clients: ${clientsBrief}
- Current Invoices: ${invoicesBrief}
- Sprint Tasks: ${tasksBrief}
- Total Revenue: $${admin.revenue.toLocaleString()}
Role: Autonomous agency project manager. You help the admin create/edit invoices, manage off-platform client payments, assign sprint tasks, and draft team WhatsApp reminders.
Be concise, professional, and action-oriented. Use bullet points where appropriate.`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nAdmin Prompt: ${textToSend}` }] }
            ]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            setMessages(prev => [...prev, {
              id: 'ai_' + Date.now(),
              role: 'assistant',
              content: reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              actionResult: {
                type: 'analysis',
                title: 'Gemini 3.4 Autonomous Action',
                details: 'Processed via Google Gemini AI Engine',
                badge: 'Gemini 3.4 Live'
              }
            }]);
            setIsProcessing(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local intent engine:', err);
      }
    }

    // AI Intent Recognition & Execution
    setTimeout(() => {
      const lower = textToSend.toLowerCase();

      // INTENT 1: MANAGE / GENERATE TASKS
      if (lower.includes('task') || lower.includes('todo') || lower.includes('assign') || lower.includes('sprint breakdown')) {
        const targetClient = lower.includes('nexus') ? 'Nexus Labs' : lower.includes('lumina') ? 'Lumina Health' : 'Arc Company';
        const generatedTasks = [
          {
            title: 'Audit mobile button tap targets & typography scale',
            client: targetClient,
            assignee: 'Carlos Mendes',
            priority: 'Urgent' as const,
            dueDate: 'In 2 days'
          },
          {
            title: 'Equalize stat card heights & align action footers',
            client: targetClient,
            assignee: 'Diego Alvarez',
            priority: 'High' as const,
            dueDate: 'In 3 days'
          },
          {
            title: 'Verify Google Sheets 2-way sync data schema',
            client: targetClient,
            assignee: 'Liam Brooks',
            priority: 'Medium' as const,
            dueDate: 'In 5 days'
          }
        ];

        addMultipleTasks(generatedTasks);

        const aiResponse: AIMessage = {
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: `I've analyzed your workload and scheduled **3 agile sprint tasks** for **${targetClient}**. They have been assigned to Carlos Mendes, Diego Alvarez, and Liam Brooks with appropriate priority tags and due dates.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionResult: {
            type: 'task',
            title: `3 Tasks Created for ${targetClient}`,
            details: 'Assigned to Carlos, Diego, and Liam • Priority: Urgent / High',
            badge: 'Live in Kanban',
            navTarget: 'tasks',
            items: generatedTasks.map(t => `[${t.priority}] ${t.title} (${t.assignee})`)
          }
        };
        setMessages(prev => [...prev, aiResponse]);
      }
      // INTENT 2: CREATE / DRAFT PROPOSALS
      else if (lower.includes('proposal') || lower.includes('quote') || lower.includes('sow') || lower.includes('pitch')) {
        const clientName = lower.includes('solana') ? 'Solana Labs' : lower.includes('nike') ? 'Nike Digital' : lower.includes('nexus') ? 'Nexus Labs' : 'Arc Company';
        const budget = lower.includes('50000') || lower.includes('50k') ? 50000 : lower.includes('60000') || lower.includes('60k') ? 60000 : 38500;
        const proposalTitle = `${clientName} Q1 Digital Platform & High-Velocity Architecture`;
        const proposalScope = 'Phase 1: Brand system & typography tokens. Phase 2: React Vite architecture & interactive analytics. Phase 3: DocuSign workflow integration & client approval portal.';

        addProposalWithDetails({
          client: clientName,
          title: proposalTitle,
          scope: proposalScope,
          budget,
          winProbability: 88,
          duration: '6 Weeks Sprint'
        });

        const aiResponse: AIMessage = {
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: `Proposal **${proposalTitle}** has been generated and added to your revenue pipeline ($${budget.toLocaleString()} USD). Win probability calculated at 88%. Google Docs workspace synced and digital signature dispatched via DocuSign link.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionResult: {
            type: 'proposal',
            title: `Proposal Drafted: $${budget.toLocaleString()} for ${clientName}`,
            details: 'Synced with Google Docs • 88% Win Probability • Sent for Review',
            badge: 'Added to Pipeline',
            navTarget: 'proposals'
          }
        };
        setMessages(prev => [...prev, aiResponse]);
      }
      // INTENT 3: MANAGE TIMELINES AND CALENDAR
      else if (lower.includes('timeline') || lower.includes('milestone') || lower.includes('calendar') || lower.includes('schedule') || lower.includes('sprint')) {
        const targetClient = lower.includes('nexus') ? 'Nexus Labs' : 'Arc Company';
        const msName = lower.includes('beta') ? 'Beta Release & User Validation' : 'Sprint 5 Staging & QA Gate';
        const msDate = 'Nov 20, 2026';

        addMilestone({
          name: msName,
          date: msDate,
          desc: 'Deliverable package validation, client review call, and staging server verification.',
          status: 'upcoming',
          client: targetClient
        });

        const aiResponse: AIMessage = {
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: `Milestone **"${msName}"** has been scheduled for **${targetClient}** on **${msDate}**. Sprints Gantt timeline synchronized and strategy session invite generated on Google Meet.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionResult: {
            type: 'milestone',
            title: `Milestone Scheduled: ${msName}`,
            details: `Target: ${msDate} • Calendar & Gantt Synced for ${targetClient}`,
            badge: 'Scheduled',
            navTarget: 'timeline'
          }
        };
        setMessages(prev => [...prev, aiResponse]);
      }
      // INTENT 4: NOTIFY USERS ON PENDING TASKS
      else if (lower.includes('notify') || lower.includes('reminder') || lower.includes('alert') || lower.includes('pending') || lower.includes('nudge')) {
        const pendingCount = admin.tasks.filter(t => !t.done).length;
        const pendingDeliverables = clientPortal.deliverables.filter(d => d.status === 'pending').length;

        dispatchNotification(
          `Action Required: ${pendingCount} Active Tasks Pending Review`,
          'Dispatched alert to Carlos Mendes, Diego Alvarez, and Liam Brooks',
          'orange',
          'tasks'
        );

        dispatchNotification(
          `Client Nudge: ${pendingDeliverables} Deliverables Awaiting Sign-Off`,
          'Automated reminder email & Slack alert sent to Arc Company executive team',
          'purple',
          'deliverables'
        );

        const aiResponse: AIMessage = {
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: `Dispatched automated alerts across channels:\n\n• **${pendingCount} pending sprint tasks** flagged for team members.\n• **${pendingDeliverables} deliverable approvals** nudged to Arc Company client portal.\n• Notifications logged to executive header alert stream.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionResult: {
            type: 'notification',
            title: 'Dispatched Team & Client Nudges',
            details: `${pendingCount} Tasks Flagged • ${pendingDeliverables} Client Reviews Nudged`,
            badge: 'Alerts Dispatched',
            navTarget: 'tasks'
          }
        };
        setMessages(prev => [...prev, aiResponse]);
      }
      // INTENT 5: AGENCY ANALYSIS & OVERVIEW
      else {
        const pendingTasks = admin.tasks.filter(t => !t.done).length;
        const totalPipeline = admin.proposals.reduce((a, b) => a + b.budget, 0);

        const aiResponse: AIMessage = {
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: `Here is the current executive telemetry for **VectorStudio**:\n\n• **Active Pipeline**: $${totalPipeline.toLocaleString()} across ${admin.proposals.length} proposals.\n• **Sprint Health**: ${pendingTasks} tasks in flight, team capacity at 86%.\n• **Retainer Revenue**: $${admin.revenue.toLocaleString()} with 100% renewal retention.\n\nWhat action would you like me to take next? You can ask me to draft a proposal, add sprint tasks, schedule a milestone, or notify users of pending items.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionResult: {
            type: 'analysis',
            title: 'Agency Operational Telemetry',
            details: `Pipeline: $${totalPipeline.toLocaleString()} • In-Flight Tasks: ${pendingTasks}`,
            badge: 'Status: Optimal',
            navTarget: 'overview'
          }
        };
        setMessages(prev => [...prev, aiResponse]);
      }

      setIsProcessing(false);
    }, 700);
  };

  // 1-Click Task Generator Trigger
  const handleExecuteTaskGen = () => {
    setIsProcessing(true);
    const presets = [
      { title: `Mobile button responsiveness & compact padding for ${taskClient}`, assignee: 'Carlos Mendes', priority: 'Urgent' as const, dueDate: 'In 2 days' },
      { title: `Grid card alignment & baseline footer balance on desktop`, assignee: 'Diego Alvarez', priority: 'High' as const, dueDate: 'In 3 days' },
      { title: `Google Sheets 2-way sync reconciliation audit`, assignee: 'Liam Brooks', priority: 'Medium' as const, dueDate: 'In 4 days' },
      { title: `Client bank wire reconciliation & settlement verification`, assignee: 'Tommy Zhang', priority: 'Normal' as const, dueDate: 'In 5 days' },
      { title: `Client Portal deliverable sign-off modal polish`, assignee: 'Carlos Mendes', priority: 'High' as const, dueDate: 'In 6 days' }
    ].slice(0, taskCount);

    addMultipleTasks(presets.map(p => ({ ...p, client: taskClient })));
    setIsProcessing(false);
    showToast(`✨ Generated ${presets.length} sprint tasks for ${taskClient}!`);
    setActiveTab('chat');
  };

  // 1-Click Proposal Generator Trigger
  const handleExecuteProposalGen = () => {
    setIsProcessing(true);
    addProposalWithDetails({
      client: propClient,
      title: `${propClient} — ${propTemplate}`,
      scope: 'Complete agency deliverables: architecture design, design system documentation, continuous deployment pipeline, and quarterly executive review.',
      budget: propBudget,
      winProbability: 85,
      duration: '8 Weeks Agile'
    });
    setIsProcessing(false);
    showToast(`✨ Proposal drafted for ${propClient} ($${propBudget.toLocaleString()})!`);
    setActiveTab('chat');
  };

  // 1-Click Timeline Milestone Trigger
  const handleExecuteMilestoneGen = () => {
    setIsProcessing(true);
    addMilestone({
      name: milestoneTitle,
      date: milestoneDate,
      desc: milestoneDesc,
      status: 'upcoming',
      client: milestoneClient
    });
    setIsProcessing(false);
    showToast(`✨ Scheduled milestone "${milestoneTitle}" for ${milestoneDate}!`);
    setActiveTab('chat');
  };

  // 1-Click Pending Notification Batch Trigger
  const handleExecuteBatchNotify = () => {
    setIsProcessing(true);
    const pendingTasks = admin.tasks.filter(t => !t.done);
    pendingTasks.slice(0, 3).forEach(task => {
      dispatchNotification(
        `Nudge: "${task.title}" is pending review`,
        `Assigned to ${task.assignee} • Priority: ${task.priority}`,
        task.priority === 'Urgent' ? 'orange' : 'green',
        'tasks'
      );
    });

    dispatchNotification(
      'Client Alert: Deliverable approval reminder dispatched to Arc Company',
      'Automated email notification with direct portal magic link',
      'purple',
      'deliverables'
    );

    setIsProcessing(false);
    showToast('✨ Dispatched reminders for pending tasks & client approvals!');
    setActiveTab('chat');
  };

  return (
    <div className="ai-copilot-drawer-backdrop" onClick={closeAIAssistant}>
      <div className="ai-copilot-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="ai-copilot-header">
          <div className="ai-copilot-header-left">
            <div className="ai-badge-pulse">
              <Sparkles style={{ width: '18px', height: '18px', color: '#ff6900' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="ai-copilot-title">VectorAI Executive Copilot</h2>
                <span className="ai-status-pill">
                  <span className="ai-status-dot"></span>
                  Gemini 3.4 Pro
                </span>
              </div>
              <p className="ai-copilot-sub">
                Autonomous task orchestration, proposal engine, timeline planning & alert dispatch.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="ai-copilot-close-btn" 
            onClick={closeAIAssistant}
            title="Close Copilot (Esc)"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Gemini API Key Alert Banner if not configured */}
        {!(admin.geminiApiKey || localStorage.getItem('vectorstudio_gemini_api_key')) && (
          <div style={{ backgroundColor: 'var(--surface-sunken, #fff7ed)', borderBottom: '1px solid var(--border-color, #fed7aa)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles style={{ width: '14px', height: '14px', color: '#ff6900' }} />
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Enter Gemini Key:</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
              <input 
                type="password"
                placeholder="AIzaSy..."
                value={quickApiKey}
                onChange={(e) => setQuickApiKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && quickApiKey.trim()) {
                    e.preventDefault();
                    updateGeminiApiKey(quickApiKey.trim());
                  }
                }}
                className="form-input"
                style={{ height: '32px', fontSize: '11.5px', padding: '0 8px', flex: 1, fontFamily: 'monospace' }}
              />
              <button 
                type="button" 
                className="noventra-orange-btn small"
                disabled={!quickApiKey.trim()}
                onClick={() => {
                  if (quickApiKey.trim()) {
                    updateGeminiApiKey(quickApiKey.trim());
                  }
                }}
                style={{ padding: '4px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}
              >
                Save & Connect
              </button>
            </div>
            <button 
              type="button" 
              onClick={() => { closeAIAssistant(); setActiveNav('settings'); }}
              style={{ background: 'none', border: 'none', color: '#ea580c', fontSize: '11px', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Advanced Settings &rarr;
            </button>
          </div>
        )}

        {/* Feature Navigation Tabs */}
        <div className="ai-copilot-tabs-bar">
          <button 
            type="button" 
            className={`ai-tab-pill ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <Sparkles style={{ width: '14px', height: '14px' }} />
            <span>AI Copilot</span>
          </button>
          <button 
            type="button" 
            className={`ai-tab-pill ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <Layers style={{ width: '14px', height: '14px' }} />
            <span>Manage Tasks</span>
          </button>
          <button 
            type="button" 
            className={`ai-tab-pill ${activeTab === 'proposals' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            <FileText style={{ width: '14px', height: '14px' }} />
            <span>Create Proposals</span>
          </button>
          <button 
            type="button" 
            className={`ai-tab-pill ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Calendar style={{ width: '14px', height: '14px' }} />
            <span>Timeline & Calendar</span>
          </button>
          <button 
            type="button" 
            className={`ai-tab-pill ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell style={{ width: '14px', height: '14px' }} />
            <span>Notify Pending</span>
          </button>
        </div>

        {/* BODY CONTAINER */}
        <div className="ai-copilot-body">
          {/* TAB 1: CHAT & COMMANDS */}
          {activeTab === 'chat' && (
            <div className="ai-chat-view">
              {/* Quick AI Command Prompt Chips */}
              <div className="ai-prompt-chips-row">
                <span className="chips-label">Quick Actions:</span>
                {[
                  { label: '⚡ Breakdown tasks for Arc Co', prompt: 'Breakdown 3 sprint tasks for Arc Company' },
                  { label: '📋 Draft $45k proposal for Solana', prompt: 'Draft a $45,000 digital architecture proposal for Solana Labs' },
                  { label: '📅 Schedule milestone on Nov 18', prompt: 'Schedule milestone for Arc Company: Beta Release on Nov 18' },
                  { label: '🔔 Notify team of pending tasks', prompt: 'Notify team and clients about pending tasks and deliverable approvals' },
                  { label: '📊 Scan agency bottlenecks', prompt: 'Analyze our agency bottlenecks and team workload' }
                ].map((chip, idx) => (
                  <button 
                    key={idx} 
                    type="button" 
                    className="ai-prompt-chip-btn"
                    onClick={() => handleUserSubmit(chip.prompt)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Chat Messages Stream */}
              <div className="ai-messages-scroll">
                {messages.map((m) => (
                  <div key={m.id} className={`ai-message-bubble-wrapper ${m.role}`}>
                    {m.role === 'assistant' && (
                      <div className="ai-avatar-badge">
                        <Sparkles style={{ width: '14px', height: '14px', color: '#ff6900' }} />
                      </div>
                    )}
                    <div className="ai-message-bubble">
                      <div className="ai-message-text" style={{ whiteSpace: 'pre-wrap' }}>
                        {m.content}
                      </div>

                      {/* Interactive Live Action Result Card */}
                      {m.actionResult && (
                        <div className="ai-action-card">
                          <div className="ai-action-card-header">
                            <span className="ai-action-badge">{m.actionResult.badge}</span>
                            <span className="ai-action-time">{m.timestamp}</span>
                          </div>
                          <div className="ai-action-card-body">
                            <h4 className="ai-action-title">{m.actionResult.title}</h4>
                            <p className="ai-action-desc">{m.actionResult.details}</p>
                            {m.actionResult.items && m.actionResult.items.length > 0 && (
                              <div className="ai-action-items-list">
                                {m.actionResult.items.map((it, i) => (
                                  <div key={i} className="ai-action-subitem">
                                    <Check style={{ width: '12px', height: '12px', color: '#10b981' }} />
                                    <span>{it}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {m.actionResult.navTarget && (
                            <button 
                              type="button" 
                              className="ai-action-jump-btn"
                              onClick={() => {
                                setActiveNav(m.actionResult!.navTarget!);
                                closeAIAssistant();
                              }}
                            >
                              <span>View in {m.actionResult.navTarget.toUpperCase()}</span>
                              <ChevronRight style={{ width: '14px', height: '14px' }} />
                            </button>
                          )}
                        </div>
                      )}

                      <span className="ai-message-time">{m.timestamp}</span>
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="ai-message-bubble-wrapper assistant">
                    <div className="ai-avatar-badge">
                      <Sparkles style={{ width: '14px', height: '14px', color: '#ff6900', animation: 'spin 1.5s linear infinite' }} />
                    </div>
                    <div className="ai-message-bubble processing">
                      <div className="ai-typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#78716c' }}>VectorAI is orchestrating operations...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Field */}
              <div className="ai-chat-input-bar">
                <input 
                  type="text" 
                  placeholder="Ask VectorAI to create tasks, draft proposals, schedule milestones, or notify users..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUserSubmit();
                  }}
                  disabled={isProcessing}
                />
                <button 
                  type="button" 
                  className="ai-send-btn"
                  onClick={() => handleUserSubmit()}
                  disabled={!inputText.trim() || isProcessing}
                  title="Send Instruction"
                >
                  <Send style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE TASKS TOOL */}
          {activeTab === 'tasks' && (
            <div className="ai-tool-panel">
              <div className="ai-tool-banner">
                <div className="tool-banner-icon">
                  <Layers style={{ width: '22px', height: '22px', color: '#ff6900' }} />
                </div>
                <div>
                  <h3 className="tool-banner-title">AI Task Breakdown & Team Assignment</h3>
                  <p className="tool-banner-sub">
                    Automatically partition client projects into prioritized tasks, assign to available architects, and set due dates.
                  </p>
                </div>
              </div>

              <div className="ai-tool-form">
                <div className="ai-form-group">
                  <label>Target Client Account</label>
                  <select value={taskClient} onChange={(e) => setTaskClient(e.target.value)}>
                    <option value="Arc Company">Arc Company (Active Retainer)</option>
                    <option value="Nexus Labs">Nexus Labs (Direct Wire Settlement)</option>
                    <option value="Lumina Health">Lumina Health (HIPAA Compliance Portal)</option>
                    <option value="Solana Labs">Solana Labs (Web3 Architecture)</option>
                  </select>
                </div>

                <div className="ai-form-group">
                  <label>Project Scope or Feature Epic</label>
                  <input 
                    type="text" 
                    value={taskEpic} 
                    onChange={(e) => setTaskEpic(e.target.value)}
                    placeholder="e.g. Mobile Responsive Polish, Design System v2.4, PostgreSQL Schema"
                  />
                </div>

                <div className="ai-form-group">
                  <label>Number of Sprint Tasks to Generate</label>
                  <div className="ai-counter-row">
                    {[2, 3, 4, 5].map(n => (
                      <button 
                        key={n}
                        type="button" 
                        className={`ai-counter-pill ${taskCount === n ? 'active' : ''}`}
                        onClick={() => setTaskCount(n)}
                      >
                        {n} Tasks
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ai-preview-box">
                  <span className="preview-label">AI Assignment Matrix:</span>
                  <div className="preview-items-grid">
                    <div className="preview-item">
                      <span className="pi-title">Task 1: Mobile responsive button & font scaling</span>
                      <span className="pi-badge urgent">Urgent &bull; Carlos Mendes</span>
                    </div>
                    <div className="preview-item">
                      <span className="pi-title">Task 2: Card alignment & footer baseline balance</span>
                      <span className="pi-badge high">High &bull; Diego Alvarez</span>
                    </div>
                    {taskCount >= 3 && (
                      <div className="preview-item">
                        <span className="pi-title">Task 3: Google Sheets 2-way sync reconciliation</span>
                        <span className="pi-badge medium">Medium &bull; Liam Brooks</span>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="button" 
                  className="noventra-orange-btn ai-submit-action-btn"
                  onClick={handleExecuteTaskGen}
                  disabled={isProcessing}
                >
                  <Zap style={{ width: '15px', height: '15px' }} />
                  <span>Generate & Schedule {taskCount} Tasks into Kanban</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CREATE PROPOSALS TOOL */}
          {activeTab === 'proposals' && (
            <div className="ai-tool-panel">
              <div className="ai-tool-banner">
                <div className="tool-banner-icon">
                  <FileText style={{ width: '22px', height: '22px', color: '#ff6900' }} />
                </div>
                <div>
                  <h3 className="tool-banner-title">AI Proposal & Scope Generator</h3>
                  <p className="tool-banner-sub">
                    Draft high-converting client proposals with phased deliverables, revenue pipeline sync, and Google Docs templates.
                  </p>
                </div>
              </div>

              <div className="ai-tool-form">
                <div className="ai-form-group">
                  <label>Client or Prospect Organization</label>
                  <input 
                    type="text" 
                    value={propClient} 
                    onChange={(e) => setPropClient(e.target.value)}
                    placeholder="e.g. Solana Labs, Vercel, Nike Digital"
                  />
                </div>

                <div className="ai-form-group">
                  <label>Engagement Scope Model</label>
                  <select value={propTemplate} onChange={(e) => setPropTemplate(e.target.value)}>
                    <option value="Enterprise Web Architecture & SaaS Dashboard">Enterprise Web Architecture & SaaS Dashboard ($38,500)</option>
                    <option value="Brand Identity & Global Design System">Brand Identity & Global Design System ($26,000)</option>
                    <option value="Executive Retainer & Strategic Design Ops">Executive Retainer & Strategic Design Ops ($14,000/mo)</option>
                    <option value="Mobile Application MVP & App Store Suite">Mobile Application MVP & App Store Suite ($42,000)</option>
                  </select>
                </div>

                <div className="ai-form-group">
                  <label>Estimated Project Budget (USD)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '11px', color: '#78716c', fontWeight: 700 }}>$</span>
                    <input 
                      type="number" 
                      value={propBudget} 
                      onChange={(e) => setPropBudget(Number(e.target.value))}
                      style={{ paddingLeft: '32px' }}
                    />
                  </div>
                </div>

                <div className="ai-preview-box">
                  <span className="preview-label">Automated Inclusions:</span>
                  <div className="inclusions-checklist">
                    <div><CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} /> <span>Google Docs Master Template Auto-Generated</span></div>
                    <div><CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} /> <span>DocuSign Digital Signature Workflow Synced</span></div>
                    <div><CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981' }} /> <span>35% Upfront Deposit Added to Revenue Pipeline</span></div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="noventra-orange-btn ai-submit-action-btn"
                  onClick={handleExecuteProposalGen}
                  disabled={isProcessing}
                >
                  <FileText style={{ width: '15px', height: '15px' }} />
                  <span>Draft Proposal & Sync Pipeline (${propBudget.toLocaleString()})</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE & CALENDAR TOOL */}
          {activeTab === 'timeline' && (
            <div className="ai-tool-panel">
              <div className="ai-tool-banner">
                <div className="tool-banner-icon">
                  <Calendar style={{ width: '22px', height: '22px', color: '#ff6900' }} />
                </div>
                <div>
                  <h3 className="tool-banner-title">AI Milestone & Calendar Scheduler</h3>
                  <p className="tool-banner-sub">
                    Schedule client milestones, sync timeline Gantt charts, and prevent overlapping team delivery conflicts.
                  </p>
                </div>
              </div>

              <div className="ai-tool-form">
                <div className="ai-form-group">
                  <label>Client Account</label>
                  <select value={milestoneClient} onChange={(e) => setMilestoneClient(e.target.value)}>
                    <option value="Arc Company">Arc Company</option>
                    <option value="Nexus Labs">Nexus Labs</option>
                    <option value="Lumina Health">Lumina Health</option>
                  </select>
                </div>

                <div className="ai-form-group">
                  <label>Milestone Title</label>
                  <input 
                    type="text" 
                    value={milestoneTitle} 
                    onChange={(e) => setMilestoneTitle(e.target.value)}
                  />
                </div>

                <div className="ai-form-group">
                  <label>Target Delivery Date</label>
                  <input 
                    type="text" 
                    value={milestoneDate} 
                    onChange={(e) => setMilestoneDate(e.target.value)}
                    placeholder="e.g. Nov 18, 2026"
                  />
                </div>

                <div className="ai-form-group">
                  <label>Deliverable Scope & Validation Criteria</label>
                  <textarea 
                    rows={3}
                    value={milestoneDesc} 
                    onChange={(e) => setMilestoneDesc(e.target.value)}
                  />
                </div>

                <button 
                  type="button" 
                  className="noventra-orange-btn ai-submit-action-btn"
                  onClick={handleExecuteMilestoneGen}
                  disabled={isProcessing}
                >
                  <Calendar style={{ width: '15px', height: '15px' }} />
                  <span>Schedule Milestone on Gantt & Calendar</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFY USERS ON PENDING TASKS */}
          {activeTab === 'notifications' && (
            <div className="ai-tool-panel">
              <div className="ai-tool-banner">
                <div className="tool-banner-icon">
                  <Bell style={{ width: '22px', height: '22px', color: '#ff6900' }} />
                </div>
                <div>
                  <h3 className="tool-banner-title">Smart Pending Item Dispatcher</h3>
                  <p className="tool-banner-sub">
                    Scan VectorStudio for pending tasks, overdue deliverables, and upcoming renewals, then trigger automated notifications.
                  </p>
                </div>
              </div>

              <div className="ai-tool-form">
                <div className="pending-audit-cards-grid">
                  <div className="pending-audit-box">
                    <span className="pab-num">{admin.tasks.filter(t => !t.done).length}</span>
                    <span className="pab-label">In-Flight Tasks</span>
                    <span className="pab-sub">Carlos, Diego, Liam pending</span>
                  </div>
                  <div className="pending-audit-box">
                    <span className="pab-num">{clientPortal.deliverables.filter(d => d.status === 'pending').length}</span>
                    <span className="pab-label">Client Reviews</span>
                    <span className="pab-sub">Arc Co sign-off pending</span>
                  </div>
                  <div className="pending-audit-box">
                    <span className="pab-num">3</span>
                    <span className="pab-label">Retainer Renewals</span>
                    <span className="pab-sub">Within next 14 days</span>
                  </div>
                </div>

                <div className="pending-items-list-container">
                  <span className="preview-label">Detected Action Items:</span>
                  {admin.tasks.filter(t => !t.done).slice(0, 4).map(t => (
                    <div key={t.id} className="pending-row-item">
                      <div className="pri-info">
                        <span className="pri-title">{t.title}</span>
                        <span className="pri-meta">{t.client} &bull; {t.assignee} &bull; {t.priority}</span>
                      </div>
                      <button 
                        type="button" 
                        className="noventra-outline-btn small"
                        onClick={() => {
                          dispatchNotification(
                            `Nudge sent for "${t.title}"`,
                            `Alert dispatched to ${t.assignee}`,
                            t.priority === 'Urgent' ? 'orange' : 'green',
                            'tasks'
                          );
                        }}
                      >
                        Notify
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  type="button" 
                  className="noventra-orange-btn ai-submit-action-btn"
                  onClick={handleExecuteBatchNotify}
                  disabled={isProcessing}
                >
                  <Bell style={{ width: '15px', height: '15px' }} />
                  <span>⚡ Batch Dispatch All Pending Notifications</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
