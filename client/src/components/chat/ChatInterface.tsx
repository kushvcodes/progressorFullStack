
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Plus, MoveRight, Lock } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type SuggestionType = {
  id: string;
  text: string;
  action?: () => void;
};

interface ChatInterfaceProps {
  className?: string;
  introText?: string;
  suggestions?: SuggestionType[];
  fullSize?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  className, 
  introText = "Hello! I'm ProgressorAI, your personal productivity assistant. How can I help you today?",
  suggestions = [],
  fullSize = false
}) => {
  const { isLoggedIn, messageCount, incrementMessageCount } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: introText,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const defaultSuggestions: SuggestionType[] = [
    { id: '1', text: 'Create a new task' },
    { id: '2', text: 'Show my upcoming deadlines' },
    { id: '3', text: 'Generate a productivity report' },
  ];

  const allSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;
  const messageLimit = 2; // Free message limit for non-logged in users

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Check if user has reached message limit
    if (!isLoggedIn && messageCount >= messageLimit) {
      // Show login required message
      const limitMessage = {
        id: Date.now().toString(),
        content: "You've reached the free message limit. Please log in to continue using ProgressorAI.",
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, limitMessage]);
      setInputValue('');
      return;
    }
    
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user' as const,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    
    // Increment message count
    incrementMessageCount();
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate AI response after delay
    setTimeout(() => {
      // Special handling for first two messages for non-logged in users
      let responseContent = '';
      
      if (!isLoggedIn && messageCount === 1) {
        responseContent = "ProgressorAI is an intelligent productivity assistant that helps you manage tasks, track your work, and optimize your workflow with AI-powered insights. You can use it to organize your to-dos, schedule your time efficiently, and get personalized recommendations.";
      } else if (!isLoggedIn && messageCount === 2) {
        responseContent = "To continue using ProgressorAI and unlock all features, please create an account or log in. With a full account, you'll get unlimited messaging, task synchronization across devices, detailed productivity analytics, and more!";
      } else {
        responseContent = getBotResponse(inputValue);
      }
      
      const botResponse = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userMessage: string): string => {
    // Simple response logic - in a real app this would connect to a backend
    const message = userMessage.toLowerCase();
    
    if (message.includes('task') || message.includes('todo')) {
      return "I can help you manage your tasks. Would you like to create a new task, view your existing ones, or something else?";
    } else if (message.includes('deadline') || message.includes('due')) {
      return "You have 3 upcoming deadlines this week. The most urgent is 'Project Proposal' due tomorrow at 5pm.";
    } else if (message.includes('report') || message.includes('productivity')) {
      return "Based on your activity, your productivity has increased by 15% this week. Great job maintaining focus!";
    } else if (message.includes('hello') || message.includes('hi')) {
      return "Hello! How can I assist with your productivity today?";
    } else {
      return "I understand you want to improve your productivity. Can you tell me more specifically how I can help you today?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMessageLimitReached = !isLoggedIn && messageCount >= messageLimit;

  return (
    <GlassCard 
      variant="dark" 
      className={cn(
        'flex flex-col chat-container-bg',
        fullSize ? 'h-[calc(100vh-100px)]' : 'h-[70vh] md:h-[75vh] max-h-[800px]',
        className
      )}
    >
      {/* Chat header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-sm">ProgressorAI Assistant</h3>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>
        
        {!isLoggedIn && (
          <div className="text-xs flex items-center">
            <span className="text-muted-foreground mr-2">
              {messageCount}/{messageLimit} free messages
            </span>
          </div>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none flex flex-col gap-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex max-w-[80%] animate-chat-bubble',
              message.sender === 'user' ? 'self-end' : 'self-start'
            )}
          >
            <div
              className={cn(
                'rounded-xl p-3 text-sm flex flex-col',
                message.sender === 'user'
                  ? 'bg-primary/20 text-foreground rounded-tr-none'
                  : 'glass-panel rounded-tl-none'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.sender === 'bot' ? (
                  <Bot size={14} className="text-primary" />
                ) : (
                  <User size={14} className="text-primary" />
                )}
                <span className="font-medium text-xs">
                  {message.sender === 'bot' ? 'ProgressorAI' : 'You'}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="self-start flex max-w-[80%] animate-chat-bubble">
            <div className="glass-panel rounded-tl-none rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Bot size={14} className="text-primary" />
                <span className="text-xs font-medium">ProgressorAI</span>
                <div className="flex items-center gap-1 ml-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/50 animate-pulse"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/50 animate-pulse delay-100"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/50 animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {allSuggestions.length > 0 && messages.length < 3 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground mb-2">Suggested prompts:</p>
          <div className="flex flex-wrap gap-2">
            {allSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => suggestion.action ? suggestion.action() : handleSuggestionClick(suggestion.text)}
                className="text-xs py-1.5 px-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-secondary-foreground whitespace-nowrap"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-3 border-t border-border">
        {isMessageLimitReached ? (
          <div className="flex flex-col gap-2">
            <div className="bg-primary/10 rounded-lg p-3 text-sm flex items-center justify-center">
              <Lock size={14} className="mr-2 text-primary" />
              <span>You've reached the free message limit</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login">
                <Button variant="outline" className="w-full text-sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full text-sm">Sign Up Free</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full rounded-lg bg-secondary/70 text-foreground placeholder:text-muted-foreground resize-none p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px] max-h-[120px] text-sm"
                rows={1}
                style={{ height: 'auto' }}
              />
              <Button
                size="icon"
                className="absolute right-1 bottom-1 h-8 w-8 bg-transparent hover:bg-transparent"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
              >
                {isTyping ? (
                  <Loader2 size={18} className="animate-spin text-muted-foreground" />
                ) : (
                  <Send size={18} className="text-primary" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick link to tasks */}
      {!fullSize && (
        <div className="p-3 pt-0">
          <Link 
            to="/tasks"
            className="flex items-center justify-center w-full gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <span>View and manage your tasks</span>
            <MoveRight size={12} />
          </Link>
        </div>
      )}
    </GlassCard>
  );
};

export default ChatInterface;
