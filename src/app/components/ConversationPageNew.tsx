import { useState, useEffect, useRef } from 'react';
import { Page, Message, OwnerChat, ScheduledVisit, Property } from '@/app/types';
import { sampleProperties } from '@/app/data';
import { getCurrentTime, matchPropertiesFromResponse, convertListingToProperty } from '@/app/utils';
import { sendChatMessage } from '@/app/api/chat';
import PropertyCard from './PropertyCard';
import PropertyCardSkeleton from './PropertyCardSkeleton';
import ScheduleVisitDialog from './ScheduleVisitDialog';
import { MessageCircle, Send, Home as HomeIcon, User, Building2, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { UserData } from './AuthDialog';
import UserMenu from './UserMenu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ConversationPageProps {
  onNavigate: (page: Page, query?: string, property?: Property) => void;
  initialQuery?: string;
  initialProperty?: Property | null;
  scheduledVisits: ScheduledVisit[];
  onScheduleVisit: (visit: Omit<ScheduledVisit, 'id'>) => void;
  onViewProperty?: (propertyId: string) => void;
  ownerChats: OwnerChat[];
  onUpdateOwnerChats: (chats: OwnerChat[]) => void;
  currentUser: UserData | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

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
    <div className="bg-[#f0effb] rounded-[12px] px-[16px] py-[12px] flex gap-[6px] w-fit">
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

export default function ConversationPageNew({
  onNavigate,
  initialQuery = '',
  initialProperty = null,
  scheduledVisits,
  onScheduleVisit,
  onViewProperty,
  ownerChats,
  onUpdateOwnerChats,
  currentUser,
  onOpenAuth,
  onSignOut,
}: ConversationPageProps) {
  // STATE (AgroHub Pattern)
  const [currentView, setCurrentView] = useState<'general' | 'owner'>('general');
  const [generalMessages, setGeneralMessages] = useState<Message[]>([
    // {
    //   id: '1',
    //   type: 'ai',
    //   content: "Hello! 👋 I'm Homix AI. I help you find, sell, or rent properties. What are you looking for today?",
    //   timestamp: getCurrentTime(),
    // }
  ]);
  const [activeOwnerChat, setActiveOwnerChat] = useState<OwnerChat | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const sessionIdRef = useRef<string>('');
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    sessionIdRef.current = 'default';
    localStorage.setItem('homix_chat_session_id', 'default');
  }, []);

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
    if (initialQuery && !hasInitialized.current) {
      handleSendMessage(initialQuery);
      hasInitialized.current = true;
    }
  }, [initialQuery]);

  // Handle initial property to chat with owner
  useEffect(() => {
    if (initialProperty && !hasInitialized.current) {
      handleChatWithOwner(initialProperty);
      hasInitialized.current = true;
    }
  }, [initialProperty]);

  const currentMessages = currentView === 'general' ? generalMessages : (activeOwnerChat?.messages || []);
  const showSidebar = true; // Always show sidebars

  // AI Response Processing
  const processAIResponse = async (messageText: string) => {
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
      await import('@/app/api/chat').then(m => 
        m.streamChatMessage(
          messageText, 
          sessionIdRef.current, 
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
          controller.signal
        )
      );
      
      // After stream is done, match properties
      const properties = matchPropertiesFromResponse(fullText, messageText);
      if (properties.length > 0) {
        setGeneralMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, properties } 
              : msg
          )
        );
      }

    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      console.error('Chat API error:', error);
      toast.error('Chat service is unavailable. Showing fallback results.');

      // Fallback on error - remove the empty/partial message and show fallback
      // Or update the existing one with fallback text
      const properties = matchPropertiesFromResponse('', messageText);
      const fallbackContent = properties.length > 0 ? 'Here are some properties I found:' : 'Let me help you find properties. What are you looking for?';
      
      setGeneralMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: fallbackContent, properties: properties.length > 0 ? properties : undefined } 
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
      setGeneralMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);
      
      await processAIResponse(messageText);
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
  const handleScheduleVisit = (property: Property) => {
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

  return (
    <div className="bg-white h-screen flex flex-col relative">
      {/* Header */}
      <header className="border-b border-[#f0effb] py-6 px-8 relative z-10">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[44px] text-[#110229] uppercase tracking-[-1.32px] cursor-pointer hover:text-[#7065f0] transition-colors"
          >
            HOMIX.AI
          </button>
          <nav className="flex gap-6 font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[18px] tracking-[-0.54px] uppercase">
            <button onClick={() => onNavigate('products')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Products</button>
            <button onClick={() => onNavigate('features')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Features</button>
            <button onClick={() => onNavigate('pricing')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Pricing</button>
          </nav>
          <UserMenu
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
            onSignOut={onSignOut}
            onNavigate={onNavigate}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - Only shows when ownerChats exist */}
        {showSidebar && (
          <div className="w-[262px] border-r border-[#f0effb] flex flex-col bg-white" style={{ transition: 'all 0.3s ease' }}>
            <div className="p-4 border-b border-[#f0effb]">
              <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[18px] text-[#110229]">
                Conversations
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {/* AI Chat */}
              <button
                onClick={() => {
                  setCurrentView('general');
                  setActiveOwnerChat(null);
                }}
                className={`w-full p-3 rounded-[6px] mb-2 flex items-center gap-3 transition-colors ${
                  currentView === 'general' 
                    ? 'bg-[#f0effb] border-[1.5px] border-[#7065f0]' 
                    : 'hover:bg-[#f0effb] border-[1.5px] border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7065f0] to-[#5048c7] flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[12px] text-[#110229]">
                    Homix AI
                  </p>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[10px] text-[#8f90a6] truncate">
                    AI Assistant
                  </p>
                </div>
              </button>

              {/* Owner Chats */}
              {ownerChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setCurrentView('owner');
                    setActiveOwnerChat(chat);
                  }}
                  className={`w-full p-3 rounded-[6px] mb-2 flex items-center gap-3 transition-colors ${
                    activeOwnerChat?.id === chat.id 
                      ? 'bg-[#f0effb] border-[1.5px] border-[#7065f0]' 
                      : 'hover:bg-[#f0effb] border-[1.5px] border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#f0effb] flex items-center justify-center">
                    {chat.owner.type === 'individual' ? 
                      <User className="w-5 h-5 text-[#7065f0]" /> : 
                      <Building2 className="w-5 h-5 text-[#7065f0]" />
                    }
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[12px] text-[#110229] truncate">
                      {chat.owner.name}
                    </p>
                    <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[10px] text-[#8f90a6] truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-[#7065f0] flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{chat.unread}</span>
                    </div>
                  )}
                </button>
              ))}

              {/* Recent Conversations Section */}
              {ownerChats.length === 0 && (
                <div className="mt-4">
                  <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[12px] text-[#8f90a6] mb-2 px-3">
                    Recent Conversations
                  </h3>
                  <div className="text-center py-6">
                    <MessageCircle className="w-8 h-8 text-[#8f90a6] mx-auto mb-2 opacity-30" />
                    <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[11px] text-[#8f90a6]">
                      No conversations yet
                    </p>
                    <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[10px] text-[#8f90a6] mt-1">
                      Chat with property owners to see them here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAIN CHAT AREA */}
        <div 
          className="flex-1 flex flex-col"
          style={{
            marginLeft: showSidebar ? '0' : 'auto',
            marginRight: 'auto',
            maxWidth: showSidebar ? '100%' : '800px',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Messages Container */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {currentMessages.map((msg: Message, idx: number) => (
              <div key={msg.id} className="w-full">
                {msg.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-[#7065f0] rounded-[12px] px-[16px] py-[12px] max-w-[80%]">
                      <MarkdownText 
                        content={msg.content} 
                        isUser={true}
                        className="text-white text-[14px] font-['Plus_Jakarta_Sans:Medium',sans-serif]" 
                      />
                      <p className="text-white/70 text-[10px] mt-1 font-['Plus_Jakarta_Sans:Medium',sans-serif]">{msg.timestamp}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {msg.thinking && <ThinkingBlock content={msg.thinking} />}
                    {msg.content && (
                      <div className="bg-[#f0effb] rounded-[12px] px-[16px] py-[12px] max-w-[80%]">
                        <MarkdownText 
                          content={msg.content} 
                          className="text-[#110229] text-[14px] font-['Plus_Jakarta_Sans:Medium',sans-serif]" 
                        />
                        <p className="text-[#8f90a6] text-[10px] mt-1 font-['Plus_Jakarta_Sans:Medium',sans-serif]">{msg.timestamp}</p>
                      </div>
                    )}

                    {/* Show placeholder cards while loading */}
                    {msg.showPlaceholders && (
                      <div className="w-full overflow-x-auto">
                        <div className="flex gap-3 pb-2">
                          {[1, 2, 3].map((i) => (
                            <PropertyCardSkeleton key={`placeholder-${i}`} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show real property cards when available */}
                    {msg.properties && msg.properties.length > 0 && !msg.showPlaceholders && (
                      <div className={`w-full ${msg.properties.length > 2 ? 'overflow-x-auto' : ''}`}>
                        <div className={`flex gap-3 pb-2 ${msg.properties.length > 2 ? 'w-max' : 'grid grid-cols-1 md:grid-cols-2'}`}>
                          {msg.properties.map((property: Property) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              showOwnerInfo={true}
                              inChat={true}
                              onChatWithOwner={currentView === 'general' ? handleChatWithOwner : undefined}
                              onScheduleViewing={currentView === 'owner' ? handleScheduleVisit : undefined}
                              onClick={onViewProperty ? () => onViewProperty(property.id) : undefined}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Show Quick Replies after first AI message */}
                    {idx === 0 && showQuickReplies && currentView === 'general' && (
                      <QuickReplies onReplyClick={handleSendMessage} show={showQuickReplies} />
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && <TypingIndicator />}
          </div>

          {/* Input Area */}
          <div className="border-t border-[#f0effb] p-4">
            <div className="max-w-[622px] mx-auto relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="What are you looking for?"
                className="w-full h-[60px] font-['Darker_Grotesque:Medium',sans-serif] font-medium text-[18px] text-[#110229] placeholder:text-[#8f90a6] bg-white border-[1.5px] border-[#f0effb] rounded-[6px] px-4 pr-12 focus:border-[#7065f0] focus:outline-none transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-[36px] h-[36px] bg-[#7065f0] rounded-full flex items-center justify-center hover:bg-[#5048c7] transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Scheduled Visits */}
        {showSidebar && (
          <div className="w-[262px] border-l border-[#f0effb] flex flex-col bg-white">
            <div className="p-4 border-b border-[#f0effb]">
              <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[18px] text-[#110229]">
                Scheduled Visits
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {scheduledVisits.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-[#8f90a6] text-[14px] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                    No visits scheduled yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledVisits.map((visit) => (
                    <div key={visit.id} className="bg-[#f0effb] rounded-[8px] p-3">
                      <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[12px] text-[#110229] mb-1">
                        {visit.propertyName}
                      </p>
                      <p className="text-[10px] text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                        {visit.date.toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                        {visit.time}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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
    </div>
  );
}