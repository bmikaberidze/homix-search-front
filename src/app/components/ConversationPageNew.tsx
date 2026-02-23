import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useLocation, useNavigationType } from 'react-router-dom';
import { Message, OwnerChat, ScheduledVisit, Property } from '../types';
import { sampleProperties } from '../data';
import { getCurrentTime, convertListingToProperty } from '../utils';
import { startSession, streamChatMessage, SessionNotFoundError } from '../api/chat';
import PropertyCard from './PropertyCard';
import MiniPropertyCard from './ui/MiniPropertyCard';
import ScheduleVisitDialog from './ScheduleVisitDialog';
import { MessageCircle, Send, Home as HomeIcon, User, Building2, Brain, ChevronDown, ChevronUp, Trash2, Calendar, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/app/context/AppContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Quick Reply Buttons Component
function QuickReplies({ onReplyClick, show }: { onReplyClick: (text: string) => void; show: boolean }) {
  if (!show) return null;

  const quickReplies = [
    { emoji: '🏠', text: 'Buy property', color: '#7065f0', bg: '#f0effb' },
    { emoji: '💰', text: 'Sell property', color: '#2E7D32', bg: '#E8F5E9' },
    { emoji: '🔑', text: 'Rent property', color: '#D97706', bg: '#FEF3C7' },
    { emoji: '🏢', text: 'Commercial', color: '#DC2626', bg: '#FEE2E2' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 w-full max-w-[400px]">
      {quickReplies.map((reply) => (
        <button
          key={reply.text}
          onClick={() => onReplyClick(reply.text)}
          style={{ backgroundColor: reply.bg, borderColor: reply.bg }}
          className="border-[1.5px] rounded-[8px] p-4 hover:border-[#7065f0] transition-all flex flex-col items-center gap-2">
          <span className="text-[24px]">{reply.emoji}</span>
          <span style={{ color: reply.color }} className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[12px]">
            {reply.text}
          </span>
        </button>
      ))}
    </div>
  );
}

// Typing Indicator Component
function TypingIndicator() {
  return (
    <div className="bg-[#f0effb] rounded-[12px] h-10 px-[16px] flex items-center gap-[6px] w-fit">
      {[0, 0.2, 0.4].map((delay, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-[#7065f0] animate-bounce"
          style={{
            animationDelay: `${delay}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );
}

// Thinking Block Component
function ThinkingBlock({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content, isOpen]);

  if (!content) return null;

  return (

    <div className="mb-2 w-full max-w-[80%] min-w-0 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0effb] hover:bg-[#e0defa] transition-colors text-[12px] font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[#7065f0]"
      >
        <Brain className="w-3.5 h-3.5" />
        <span className="font-bold uppercase tracking-wider">Homix Thinking</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        //
        <div ref={scrollRef} className="mt-2 p-3 rounded-[12px] bg-[#f8f7ff] border border-[#f0effb] text-[12px] text-[#8f90a6] font-mono px-[16px] py-[12px] overflow-y-auto overflow-x-hidden max-h-[150px] whitespace-pre-wrap break-all">
          {/* <div ref={scrollRef} className="mt-2 p-3 rounded-[12px] bg-[#f8f7ff] border border-[#f0effb] text-[12px] text-[#8f90a6] font-mono whitespace-pre-wrap break-words overflow-y-auto max-h-[200px]"> */}
          {content}
        </div>
      )}
    </div>
  );
}

// Markdown Text Component using react-markdown
function MarkdownText({ content, className = '', isUser = false }: { content: string; className?: string; isUser?: boolean }) {
  if (!content) return null;

  return (
    <div className={`${className} prose prose-sm max-w-none`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => (
            <li className={`pl-1 ${isUser ? 'marker:text-white' : 'marker:text-[#7065f0]'}`}>
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className={`font-bold ${isUser ? 'text-white' : 'text-[#110229]'}`}>
              {children}
            </strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${isUser ? 'text-white underline' : 'text-[#7065f0] hover:underline'}`}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function ConversationPageNew() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigationType = useNavigationType();
  const isReturning = navigationType === 'POP';
  const initialQuery = searchParams.get('q') || '';
  const initialProperty = (location.state as any)?.ownerProperty || null;
  const isNewConversation = !isReturning && !!(initialQuery || initialProperty || (location.state as any)?.newConversation);

  const {
    scheduledVisits,
    handleScheduleVisit: onScheduleVisit,
    ownerChats,
    handleUpdateOwnerChats: onUpdateOwnerChats,
  } = useApp();

  // STATE (AgroHub Pattern)
  const [currentView, setCurrentView] = useState<'general' | 'owner'>('general');
  const [generalMessages, setGeneralMessages] = useState<Message[]>([]);
  const [activeOwnerChat, setActiveOwnerChat] = useState<OwnerChat | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ label: string, value: string }[]>([]);
  const [rankedResults, setRankedResults] = useState<Property[]>([]);
  const [isResultsExpanded, setIsResultsExpanded] = useState(false);
  const [referencedProperties, setReferencedProperties] = useState<Property[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const sessionPromiseRef = useRef<Promise<string> | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);

  const ensureSession = useCallback(async (): Promise<string> => {
    if (sessionIdRef.current) return sessionIdRef.current;

    const saved = localStorage.getItem('homix_chat_session_id');
    if (saved && saved !== 'default') {
      sessionIdRef.current = saved;
      return saved;
    }

    if (sessionPromiseRef.current) return sessionPromiseRef.current;

    const promise = (async () => {
      try {
        const id = await startSession();
        sessionIdRef.current = id;
        localStorage.setItem('homix_chat_session_id', id);
        return id;
      } catch {
        try {
          await new Promise(r => setTimeout(r, 1000));
          const id = await startSession();
          sessionIdRef.current = id;
          localStorage.setItem('homix_chat_session_id', id);
          return id;
        } catch {
          const fallback = `local-${crypto.randomUUID()}`;
          sessionIdRef.current = fallback;
          toast.warning('Could not connect to server. Your conversation may not be saved.');
          return fallback;
        }
      } finally {
        sessionPromiseRef.current = null;
      }
    })();

    sessionPromiseRef.current = promise;
    return promise;
  }, []);

  const ensureConversationId = useCallback((): string => {
    if (conversationIdRef.current) return conversationIdRef.current;

    const saved = localStorage.getItem('homix_conversation_id');
    if (saved) {
      conversationIdRef.current = saved;
      return saved;
    }

    const id = crypto.randomUUID();
    conversationIdRef.current = id;
    localStorage.setItem('homix_conversation_id', id);
    return id;
  }, []);

  const resetSession = useCallback(async (): Promise<string> => {
    // Clear old session state
    sessionIdRef.current = null;
    sessionPromiseRef.current = null;
    localStorage.removeItem('homix_chat_session_id');

    // Clear conversation
    const newConvId = crypto.randomUUID();
    conversationIdRef.current = newConvId;
    localStorage.setItem('homix_conversation_id', newConvId);

    // Start fresh session
    const newSessionId = await startSession();
    sessionIdRef.current = newSessionId;
    localStorage.setItem('homix_chat_session_id', newSessionId);
    return newSessionId;
  }, []);

  const handleClearConversation = useCallback(() => {
    const oldConvId = conversationIdRef.current;
    if (oldConvId) {
      localStorage.removeItem(`homix_messages_${oldConvId}`);
      localStorage.removeItem(`homix_ranked_results_${oldConvId}`);
    }
    const id = crypto.randomUUID();
    conversationIdRef.current = id;
    localStorage.setItem('homix_conversation_id', id);
    setGeneralMessages([]);
    setShowQuickReplies(true);
    setCurrentView('general');
    setActiveOwnerChat(null);
    setRankedResults([]);
    setIsResultsExpanded(false);
    toast.success('Conversation cleared');
  }, []);

  useEffect(() => {
    if (isNewConversation) {
      // Generate a new conversation ID — session is kept intact
      const newConvId = crypto.randomUUID();
      conversationIdRef.current = newConvId;
      localStorage.setItem('homix_conversation_id', newConvId);
    }
    ensureSession();
    const convId = ensureConversationId();

    // Load persisted messages and ranked results for this conversation (only when returning to an existing one)
    if (!isNewConversation) {
      const stored = localStorage.getItem(`homix_messages_${convId}`);
      if (stored) {
        try {
          const messages = JSON.parse(stored) as Message[];
          if (messages.length > 0) {
            setGeneralMessages(messages);
            setShowQuickReplies(false);
          }
        } catch {
          // corrupted data — ignore, start fresh
        }
      }

      const storedResults = localStorage.getItem(`homix_ranked_results_${convId}`);
      if (storedResults) {
        try {
          const results = JSON.parse(storedResults) as Property[];
          if (results.length > 0) {
            setRankedResults(results);
          }
        } catch {
          // corrupted data — ignore
        }
      }
    }
  }, []);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    const convId = conversationIdRef.current;
    if (!convId || generalMessages.length === 0) return;
    localStorage.setItem(`homix_messages_${convId}`, JSON.stringify(generalMessages));
  }, [generalMessages]);

  // Persist ranked results to localStorage whenever they change
  useEffect(() => {
    const convId = conversationIdRef.current;
    if (!convId) return;
    if (rankedResults.length === 0) {
      localStorage.removeItem(`homix_ranked_results_${convId}`);
    } else {
      localStorage.setItem(`homix_ranked_results_${convId}`, JSON.stringify(rankedResults));
    }
  }, [rankedResults]);

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [generalMessages, activeOwnerChat, isTyping]);

  // Handle initial query from homepage search
  useEffect(() => {
    if (initialQuery && !isReturning && !hasInitialized.current) {
      handleSendMessage(initialQuery);
      hasInitialized.current = true;
    }
  }, [initialQuery]);

  // Handle initial property to chat with owner
  useEffect(() => {
    if (initialProperty && !isReturning && !hasInitialized.current) {
      handleChatWithOwner(initialProperty);
      hasInitialized.current = true;
    }
  }, [initialProperty]);

  const currentMessages = currentView === 'general' ? generalMessages : (activeOwnerChat?.messages || []);

  // AI Response Processing
  const processAIResponse = async (messageText: string, referenceUrls?: string[]) => {
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

    // Create a placeholder message ID
    const aiMessageId = (Date.now() + 1).toString();
    const startTime = getCurrentTime();

    // Optimistically add the AI message with empty content or loading state
    const initialAiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '', // Start empty
      timestamp: startTime,
    };

    setGeneralMessages(prev => [...prev, initialAiMessage]);
    setIsTyping(true);

    let fullText = '';

    try {
      const currentSessionId = await ensureSession();
      const currentConversationId = ensureConversationId();

      await streamChatMessage(
          messageText,
          currentSessionId,
          currentConversationId,
          (event: any) => {
            console.log('🎯 UI received event:', event.type, event);

            // Normalize event type to handle potential whitespace issues
            const eventType = typeof event.type === 'string' ? event.type.trim() : event.type;

            // Debug: Check event type details
            if (event.type && typeof event.type === 'string') {
              console.log('🔍 Event type details:', {
                original: event.type,
                normalized: eventType,
                length: event.type.length,
                match: eventType === 'show_suggestions_placeholder'
              });
            }

            if (eventType === 'answer' && event.content) {
              fullText += event.content;

              setGeneralMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, content: fullText }
                    : msg
                )
              );
            } else if (eventType === 'show_suggestions_placeholder') {
              // Mark the message to show placeholder cards
              console.log('✅ Matched show_suggestions_placeholder! Setting placeholders for message:', aiMessageId);
              setGeneralMessages(prev => {
                const updated = prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, showPlaceholders: true }
                    : msg
                );
                console.log('📦 Messages after placeholder update:', updated.find(m => m.id === aiMessageId));
                return updated;
              });
            } else if (eventType === 'suggestions') {
              // Parse suggestions from event.data
              console.log('🏠 Received suggestions event:', event.data);
              const suggestionsData = Array.isArray(event.data)
                ? event.data
                : event.data?.suggestions || [];

              console.log('🏠 Parsing suggestions data:', suggestionsData);

              // Convert Listing objects to Property objects
              const properties = suggestionsData
                .map((listing: any, index: number) =>
                  convertListingToProperty(listing, index)
                );

              console.log('🏠 Converted to properties:', properties);

              // Replace placeholders with real properties
              setGeneralMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, properties, showPlaceholders: false }
                    : msg
                )
              );
            } else if (eventType === 'ranked_results') {
              console.log('🏆 Received ranked_results event:', event.data);
              const resultsData = Array.isArray(event.data)
                ? event.data
                : event.data?.results || event.data?.listings || [];

              const properties = resultsData.map((listing: any, index: number) =>
                convertListingToProperty(listing, index)
              );

              console.log('🏆 Converted ranked results:', properties);
              setRankedResults(properties);
            } else if (!['done', 'show_suggestions_placeholder', 'suggestions'].includes(eventType)) {
              // Handle other events in thinking block
              let eventContent = '';

              if (eventType === 'tool_call') {
                const toolName = event.data?.name || 'tool';
                const args = event.data?.args ? JSON.stringify(event.data.args) : '';
                eventContent = `\n> Executing: ${toolName}(${args})`;
              } else if (eventType === 'tool_result') {
                const result = event.data?.preview || event.data?.result || event.content || JSON.stringify(event.data);
                eventContent = `\n> Result: ${result}`;
              } else if (eventType === 'scraping') {
                const url = event.data?.url ? JSON.stringify(event.data.url) : '';
                eventContent = `\n> Scraping: ${url}`;
              } else {
                eventContent = `\n> ${eventType}: ${event.content || (event.data ? JSON.stringify(event.data) : '')}`;
              }

              setGeneralMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, thinking: (msg.thinking || '') + eventContent }
                    : msg
                )
              );
            } else if (eventType === 'done') {
              setGeneralMessages(prev =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, showPlaceholders: false }
                    : msg
                )
              );
              console.log('✅ Stream completed');
            } else {
              console.log('⚠️ Unhandled event type:', eventType, event);
            }
          },
          controller.signal,
          referenceUrls,
      );

      // Real property suggestions are already injected via the 'suggestions' SSE event.
      // No need to match mock properties here.

      // Extract filters from AI response or thinking
      if (messageText.toLowerCase().includes('new york')) {
        setActiveFilters(prev => [...prev.filter(f => f.label !== 'Location'), { label: 'Location', value: 'New York' }]);
      } else if (messageText.toLowerCase().includes('tbilisi')) {
        setActiveFilters(prev => [...prev.filter(f => f.label !== 'Location'), { label: 'Location', value: 'Tbilisi' }]);
      }

      if (messageText.toLowerCase().includes('100') || messageText.toLowerCase().includes('price')) {
        setActiveFilters(prev => [...prev.filter(f => f.label !== 'Budget'), { label: 'Budget', value: 'Under 3000' }]);
      }


    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      // Session expired or not found — start fresh and retry
      if (error instanceof SessionNotFoundError) {
        console.warn('Session not found, resetting session and retrying...');
        toast.info('Session expired. Starting a new conversation...');
        // Keep only the user message that triggered this request
        setGeneralMessages(prev => {
          const userMsg = [...prev].reverse().find(msg => msg.type === 'user');
          return userMsg ? [userMsg] : [];
        });
        setShowQuickReplies(false);
        try {
          await resetSession();
          setIsTyping(false);
          // Retry the same message with the new session
          await processAIResponse(messageText);
          return;
        } catch (retryError) {
          console.error('Failed to recover from session_not_found:', retryError);
          toast.error('Could not reconnect. Please try again.');
          return;
        }
      }

      console.error('Chat API error:', error);
      toast.error('Chat service is unavailable. Showing fallback results.');

      // Show error fallback text without mock property cards
      setGeneralMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: 'Sorry, something went wrong. Please try again.' }
            : msg
        )
      );
    } finally {
      if (requestControllerRef.current === controller) {
        setIsTyping(false);
      }
    }
  };

  // Send Message Handler
  const handleSendMessage = async (text?: string) => {
    const messageText = (text || inputValue).trim();
    if (!messageText) return;

    setShowQuickReplies(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: getCurrentTime(),
    };

    if (currentView === 'general') {
      // GENERAL AI CHAT
      const refUrls = referencedProperties
        .map(p => p.url)
        .filter((url): url is string => !!url);

      setGeneralMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setReferencedProperties([]);
      setIsTyping(true);
      // setRankedResults([]);
      setIsResultsExpanded(false);


      await processAIResponse(messageText, refUrls.length > 0 ? refUrls : undefined);
    } else if (activeOwnerChat) {
      // OWNER CHAT
      const updatedChat = {
        ...activeOwnerChat,
        messages: [...activeOwnerChat.messages, userMessage],
        lastMessage: messageText,
      };
      setActiveOwnerChat(updatedChat);
      const updatedChats = ownerChats.map(chat =>
        chat.id === activeOwnerChat.id ? updatedChat : chat
      );
      onUpdateOwnerChats(updatedChats);
      setInputValue('');

      // Simulate owner response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);

        // Generate dynamic owner responses based on message content
        const lowerCaseMessage = messageText.toLowerCase();
        let ownerResponseText = '';

        if (lowerCaseMessage.includes('schedule') || lowerCaseMessage.includes('visit') || lowerCaseMessage.includes('viewing')) {
          ownerResponseText = `Absolutely! I'd be happy to schedule a viewing of ${activeOwnerChat.property?.title}. What day and time works best for you?`;
        } else if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('cost') || lowerCaseMessage.includes('rent')) {
          ownerResponseText = `Great question! The price for ${activeOwnerChat.property?.title} is very competitive. Would you like to discuss payment options or negotiate?`;
        } else if (lowerCaseMessage.includes('available') || lowerCaseMessage.includes('when')) {
          ownerResponseText = `Yes, ${activeOwnerChat.property?.title} is currently available! I can show it to you as soon as tomorrow if that works for you.`;
        } else if (lowerCaseMessage.includes('pets') || lowerCaseMessage.includes('pet')) {
          ownerResponseText = `Good question! Let me check the pet policy for ${activeOwnerChat.property?.title}. In most cases, we're pet-friendly with a small deposit.`;
        } else if (lowerCaseMessage.includes('parking') || lowerCaseMessage.includes('garage')) {
          ownerResponseText = `${activeOwnerChat.property?.title} includes parking facilities. I can give you more details during a viewing!`;
        } else if (lowerCaseMessage.includes('amenities') || lowerCaseMessage.includes('features')) {
          ownerResponseText = `${activeOwnerChat.property?.title} has amazing amenities! Let me know if you'd like a detailed tour to see everything.`;
        } else if (lowerCaseMessage.includes('interested') || lowerCaseMessage.includes('love')) {
          ownerResponseText = `That's wonderful! ${activeOwnerChat.property?.title} is truly special. Would you like to schedule a viewing or do you have any specific questions?`;
        } else {
          // Default responses
          const defaultResponses = [
            `Thanks for reaching out about ${activeOwnerChat.property?.title}! I'm here to answer any questions you have.`,
            `Great to hear from you! ${activeOwnerChat.property?.title} is a fantastic property. What would you like to know?`,
            `I appreciate your interest in ${activeOwnerChat.property?.title}. How can I help you today?`,
            `Hello! I'd be happy to help you with ${activeOwnerChat.property?.title}. What information can I provide?`
          ];
          ownerResponseText = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        const ownerResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'owner',
          content: ownerResponseText,
          timestamp: getCurrentTime(),
        };
        const chatWithResponse = {
          ...updatedChat,
          messages: [...updatedChat.messages, ownerResponse],
          lastMessage: ownerResponse.content,
        };
        setActiveOwnerChat(chatWithResponse);
        const updatedChatsWithResponse = ownerChats.map(chat =>
          chat.id === activeOwnerChat.id ? chatWithResponse : chat
        );
        onUpdateOwnerChats(updatedChatsWithResponse);
      }, 1500);
    }
  };

  // Connect to Owner Handler (KEY FUNCTION)
  const handleChatWithOwner = (property: Property) => {
    // Deactivate for MVP
    toast.error('Chat with owner is not available yet. Please use general chat.');
    return;

    const existingChat = ownerChats.find(chat => chat.owner.id === property.owner.id);

    if (existingChat) {
      setActiveOwnerChat(existingChat);
      setCurrentView('owner');
      toast.success(`Switched to chat with ${property.owner.name}`);
    } else {
      const ownerProperties = sampleProperties.filter((p: Property) => p.owner.id === property.owner.id);

      const newChat: OwnerChat = {
        id: property.owner.id,
        owner: property.owner,
        property: { id: property.id, title: property.title },
        messages: [
          {
            id: Date.now().toString(),
            type: 'owner',
            content: `Hi! I'm ${property.owner.name}. How can I help you with ${property.title}?`,
            timestamp: getCurrentTime(),
          },
          {
            id: (Date.now() + 1).toString(),
            type: 'owner',
            content: 'Here are all my available properties:',
            timestamp: getCurrentTime(),
            properties: ownerProperties,
          }
        ],
        lastMessage: `Hi! I'm ${property.owner.name}...`,
        unread: 0,
      };

      onUpdateOwnerChats([newChat, ...ownerChats]);
      setActiveOwnerChat(newChat);
      setCurrentView('owner');
      toast.success(`Connected with ${property.owner.name}`);
    }
  };

  // Schedule Visit Handler
  const handleScheduleVisitDialog = (property: Property) => {
    setSelectedProperty(property);
    setScheduleDialogOpen(true);
  };

  const handleConfirmSchedule = (visit: Omit<ScheduledVisit, 'id'>) => {
    onScheduleVisit(visit);
    toast.success('Visit scheduled successfully!');
    setScheduleDialogOpen(false);

    // Add confirmation message to chat
    if (activeOwnerChat) {
      const confirmMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `✅ Your visit to ${visit.propertyName} has been scheduled for ${visit.date.toLocaleDateString()} at ${visit.time}`,
        timestamp: getCurrentTime(),
      };
      const updatedChat = {
        ...activeOwnerChat,
        messages: [...activeOwnerChat.messages, confirmMessage],
      };
      setActiveOwnerChat(updatedChat);
      const updatedChats = ownerChats.map(chat =>
        chat.id === activeOwnerChat.id ? updatedChat : chat
      );
      onUpdateOwnerChats(updatedChats);
    }
  };

  const handleViewProperty = (propertyId: string) => {
    toast.error('Viewing property is not available yet.');
  };

  const handleSelectProperty = useCallback((property: Property) => {
    setReferencedProperties(prev => {
      if (prev.some(p => p.id === property.id)) return prev;
      return [...prev, property];
    });
  }, []);

  const handleRemoveReference = useCallback((propertyId: string) => {
    setReferencedProperties(prev => prev.filter(p => p.id !== propertyId));
  }, []);

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-white/50 backdrop-blur-sm">
        {/* LEFT SIDEBAR */}
        <div className="w-[300px] border-r border-[#f0effb] flex flex-col bg-white/80 backdrop-blur-md">
          <div className="p-6 border-b border-[#f0effb] flex items-center justify-between">
            <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[18px] text-[#110229]">
              Conversations
            </h2>
            <button
              onClick={handleClearConversation}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors group"
            >
              <Trash2 className="w-5 h-5 text-[#8f90a6] group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <button
              onClick={() => {
                setCurrentView('general');
                setActiveOwnerChat(null);
              }}
              className={`w-full p-4 rounded-[20px] flex items-center gap-4 transition-all duration-300 ${currentView === 'general'
                ? 'bg-[#7065f0] text-white shadow-lg shadow-purple-200'
                : 'hover:bg-[#f0effb] text-[#110229]'
                }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentView === 'general' ? 'bg-white/20' : 'bg-[#7065f0]/10'}`}>
                <HomeIcon className={`w-5 h-5 ${currentView === 'general' ? 'text-white' : 'text-[#7065f0]'}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px]">
                  Homix AI
                </p>
                <p className={`font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[11px] ${currentView === 'general' ? 'text-white/70' : 'text-[#8f90a6]'}`}>
                  AI Assistant
                </p>
              </div>
            </button>

            {ownerChats.length > 0 ? (
              ownerChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setCurrentView('owner');
                    setActiveOwnerChat(chat);
                  }}
                  className={`w-full p-4 rounded-[20px] flex items-center gap-4 transition-all duration-300 ${activeOwnerChat?.id === chat.id
                    ? 'bg-[#7065f0] text-white shadow-lg shadow-purple-200'
                    : 'hover:bg-[#f0effb] text-[#110229]'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeOwnerChat?.id === chat.id ? 'bg-white/20' : 'bg-[#7065f0]/10'}`}>
                    {chat.owner.type === 'individual' ?
                      <User className={`w-5 h-5 ${activeOwnerChat?.id === chat.id ? 'text-white' : 'text-[#7065f0]'}`} /> :
                      <Building2 className={`w-5 h-5 ${activeOwnerChat?.id === chat.id ? 'text-white' : 'text-[#7065f0]'}`} />
                    }
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px]">
                      {chat.owner.name}
                    </p>
                    <p className={`font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[11px] truncate max-w-[140px] ${activeOwnerChat?.id === chat.id ? 'text-white/70' : 'text-[#8f90a6]'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              currentView === 'general' && (
                <div className="p-8 text-center bg-[#f7f7fd] border border-dashed border-[#f0effb] rounded-[24px]">
                  <MessageCircle className="w-8 h-8 text-[#8f90a6] mx-auto mb-4 opacity-20" />
                  <p className="text-[#8f90a6] text-[13px] font-medium leading-relaxed">
                    No conversations yet<br />
                    <span className="text-[12px] opacity-70">Chat with property owners to see them here</span>
                  </p>
                </div>
              )
            )}

          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col relative bg-[#f7f7fd]">
          {/* Active Filters */}
          {activeFilters.length > 0 && currentView === 'general' && (
            <div className="px-10 pt-6 flex flex-wrap gap-2">
              {activeFilters.map((filter, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border border-[#f0effb] px-3 py-1.5 rounded-full shadow-sm animate-in fade-in zoom-in duration-300">
                  <span className="text-[11px] font-bold text-[#8f90a6] uppercase tracking-wider">{filter.label}:</span>
                  <span className="text-[13px] font-bold text-[#7065f0]">{filter.value}</span>
                  <button
                    onClick={() => setActiveFilters(prev => prev.filter((_, idx) => idx !== i))}
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setActiveFilters([])}
                className="text-[11px] font-bold text-[#8f90a6] hover:text-[#7065f0] uppercase tracking-wider ml-2 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8">
            {currentMessages.map((msg: Message) => (
              <div key={msg.id} className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
                {msg.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-[#110229] rounded-[24px] rounded-tr-none px-6 py-4 max-w-[70%] shadow-xl shadow-gray-200/50">
                      <MarkdownText
                        content={msg.content}
                        isUser={true}
                        className="text-white text-[16px] font-['Plus_Jakarta_Sans:Medium',sans-serif]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {msg.thinking && <ThinkingBlock content={msg.thinking} />}
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.content ? 'mt-1' : ''} shadow-lg ${msg.content ? 'bg-gradient-to-br from-[#7065f0] to-[#5048c7] shadow-purple-100' : 'bg-[#7065f0]/10'}`}>
                        <HomeIcon className={`w-5 h-5 ${msg.content ? 'text-white' : 'text-[#7065f0]'}`} />
                      </div>
                      <div className="flex flex-col gap-4 max-w-[85%]">
                        {msg.content ? (
                          <div className="bg-white rounded-[24px] rounded-tl-none px-6 py-4 shadow-sm border border-[#f0effb]">
                            <MarkdownText
                              content={msg.content}
                              className="text-[#110229] text-[16px] font-['Plus_Jakarta_Sans:Medium',sans-serif]"
                            />
                          </div>
                        ) : (
                          <TypingIndicator />
                        )}

                        {msg.properties && msg.properties.length > 0 && (
                          <div className="w-full overflow-x-auto pb-4 -mx-1 px-1">
                            <div className="flex gap-6 w-max">
                              {msg.properties.map((property: Property) => (
                                <PropertyCard
                                  key={property.id}
                                  property={property}
                                  showOwnerInfo={true}
                                  inChat={true}
                                  onSelect={handleSelectProperty}
                                  onChatWithOwner={currentView === 'general' ? handleChatWithOwner : undefined}
                                  onScheduleViewing={currentView === 'owner' ? handleScheduleVisitDialog : undefined}
                                  onClick={() => handleViewProperty(property.id)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (currentView === 'owner' || (currentMessages.length > 0 && currentMessages[currentMessages.length - 1].type !== 'ai')) && (
              <div className="flex gap-4 items-center animate-in fade-in slide-in-from-bottom-2">
                <div className="w-10 h-10 rounded-full bg-[#7065f0]/10 flex items-center justify-center flex-shrink-0">
                  <HomeIcon className="w-5 h-5 text-[#7065f0]" />
                </div>
                <TypingIndicator />
              </div>
            )}
          </div>

          {/* Quick Replies */}
          {showQuickReplies && currentView === 'general' && generalMessages.length < 2 && (
            <div className="px-10 pb-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { emoji: '🏠', text: 'გთხოვ, მაყიდინო ბინა ვერაზე, 70 კვ.მ.', color: '#7065f0', bg: '#f0effb' },
                  { emoji: '🔑', text: 'ვიქირავებ ბინას საბურთალოზე, დღეში 100 ლარად', color: '#D97706', bg: '#FEF3C7' },
                ].map((reply) => (
                  <button
                    key={reply.text}
                    onClick={() => handleSendMessage(reply.text)}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#f0effb] hover:border-[#7065f0] hover:shadow-lg transition-all text-[14px] font-bold text-[#110229]"
                  >
                    <span>{reply.emoji}</span>
                    <span>{reply.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-10 pb-10">
            <div>
              {/* Referenced Properties Mini Cards */}
              {referencedProperties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 animate-in fade-in duration-200">
                  {referencedProperties.map(property => (
                    <MiniPropertyCard
                      key={property.id}
                      property={property}
                      onRemove={handleRemoveReference}
                    />
                  ))}
                </div>
              )}
              {/* Input row with toggle button */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-[#7065f0]/10 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    onFocus={() => setIsResultsExpanded(false)}
                    placeholder="Message Homix AI..."
                    className="relative w-full h-[72px] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[18px] text-[#110229] placeholder:text-[#8f90a6] bg-white border-[2px] border-[#f0effb] rounded-full px-8 pr-20 focus:border-[#7065f0] focus:outline-none transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] focus:shadow-[0_20px_50px_-15px_rgba(112,101,240,0.15)]"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-[52px] h-[52px] bg-[#7065f0] rounded-full flex items-center justify-center hover:bg-[#5048c7] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-200"
                  >
                    <Send className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Ranked Results Toggle Button */}
                {rankedResults.length > 0 && (
                  <button
                    onClick={() => setIsResultsExpanded(prev => !prev)}
                    className={`flex items-center gap-2 h-[52px] px-5 rounded-full font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[13px] transition-all duration-[1500ms] whitespace-nowrap animate-in fade-in zoom-in duration-300 ${
                      isResultsExpanded
                        ? 'bg-[#7065f0] text-white shadow-lg shadow-purple-200'
                        : 'bg-[#7065f0]/15 border-[2px] border-[#7065f0]/30 text-[#7065f0] hover:border-[#7065f0] hover:shadow-md'
                    }`}
                    style={{
                      animation: 'resultsBtnAppear 1.5s ease-out forwards',
                    }}
                  >
                    <Search className="w-4 h-4" />
                    <span>ძიების შედეგები</span>
                    <span className={`ml-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isResultsExpanded
                        ? 'bg-white/20 text-white'
                        : 'bg-[#7065f0]/10 text-[#7065f0]'
                    }`}>
                      {rankedResults.length}
                    </span>
                    {isResultsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                )}
                <style>{`
                  @keyframes resultsBtnAppear {
                    0% {
                      background-color: #7065f0;
                      color: white;
                      border-color: #7065f0;
                      box-shadow: 0 10px 25px -5px rgba(112, 101, 240, 0.4);
                    }
                    100% {
                      background-color: rgba(112, 101, 240, 0.15);
                      color: #7065f0;
                      border-color: rgba(112, 101, 240, 0.3);
                      box-shadow: none;
                    }
                  }
                `}</style>
              </div>

              {/* Ranked Results Box */}
              {isResultsExpanded && rankedResults.length > 0 && (
                <div className="mt-4 bg-white border-[2px] border-[#f0effb] rounded-[24px] shadow-[0_20px_50px_-15px_rgba(112,101,240,0.1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0effb]">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#7065f0]" />
                      <span className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] text-[#110229]">
                        ძიების შედეგები
                      </span>
                      <span className="bg-[#7065f0]/10 text-[#7065f0] px-2 py-0.5 rounded-full text-[11px] font-bold">
                        {rankedResults.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsResultsExpanded(false)}
                      className="w-8 h-8 rounded-full hover:bg-[#f0effb] flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-[#8f90a6]" />
                    </button>
                  </div>

                  {/* Property Grid */}
                  <div className="p-6 overflow-y-auto max-h-[400px]">
                    <div className="grid grid-cols-4 gap-4">
                      {rankedResults.map((property: Property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          showOwnerInfo={true}
                          inChat={true}
                          onSelect={handleSelectProperty}
                          onChatWithOwner={currentView === 'general' ? handleChatWithOwner : undefined}
                          onClick={() => handleViewProperty(property.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Scheduled Visits */}
        <div className="w-[300px] border-l border-[#f0effb] flex flex-col bg-white/80 backdrop-blur-md">
          <div className="p-6 border-b border-[#f0effb]">
            <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[18px] text-[#110229]">
              Activity
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[12px] text-[#8f90a6] uppercase tracking-wider mb-4 px-2">
                Scheduled Visits
              </h3>
              {scheduledVisits.length === 0 ? (
                <div className="bg-[#f7f7fd] border border-dashed border-[#f0effb] rounded-[24px] p-8 text-center">
                  <Calendar className="w-8 h-8 text-[#8f90a6] mx-auto mb-4 opacity-20" />
                  <p className="text-[#8f90a6] text-[13px] font-medium">
                    No visits scheduled
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledVisits.map((visit) => (
                    <div key={visit.id} className="bg-white border border-[#f0effb] rounded-[20px] p-4 shadow-sm hover:border-[#7065f0] transition-colors">
                      <p className="font-bold text-[14px] text-[#110229] mb-2">
                        {visit.propertyName}
                      </p>
                      <div className="flex items-center gap-2 text-[12px] text-[#8f90a6]">
                        <Calendar className="w-3 h-3" />
                        <span>{visit.date.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-[#8f90a6] mt-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{visit.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Visit Dialog */}
      {selectedProperty && (
        <ScheduleVisitDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          property={selectedProperty}
          ownerName={selectedProperty.owner.name}
          onConfirm={handleConfirmSchedule}
        />
      )}
    </>
  );
}
