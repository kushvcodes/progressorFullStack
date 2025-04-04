import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MoveRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from '@/components/ui/use-toast';

// Use window.location.origin to get the current domain dynamically
const API_BASE_URL = window.location.origin;
const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

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
  introText = "Hello! I'm ProgressorAI. How can I help?",
  suggestions = [],
  fullSize = false
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const defaultSuggestions: SuggestionType[] = [
    { id: '1', text: 'Create a new task' },
    { id: '2', text: 'Show my upcoming deadlines' },
    { id: '3', text: 'Generate productivity report' },
  ];
  const allSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  // WebSocket Connection
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast({ title: "Login required", variant: "destructive" });
      return;
    }

    const wsUrl = `${WS_BASE_URL}/ws/chat/?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnecting(false);
      setSocket(ws);
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'system') return;

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: data.content || data.message,
          sender: data.sender === 'AI' ? 'bot' : 'user',
          timestamp: new Date(data.timestamp || Date.now())
        }]);
      } catch (err) {
        console.error("Message parse error:", err);
      }
      setIsTyping(false);
    };

    ws.onerror = () => {
      toast({ title: "Connection error", variant: "destructive" });
    };

    ws.onclose = () => {
      setIsConnecting(true);
      setTimeout(() => setSocket(new WebSocket(wsUrl)), 3000);
    };

    return () => ws.close();
  }, []);

  // Load Message History
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/messages/`, {
          headers: {
            'Authorization': `JWT ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const loadedMessages = data.messages.map((msg: any) => ({
          id: msg.id.toString(),
          content: msg.content,
          sender: msg.sender === 'AI' ? 'bot' : 'user', // Simplified check
          timestamp: new Date(msg.timestamp)
        }));

        setMessages(loadedMessages.length > 0 ? loadedMessages : [{
          id: 'intro',
          content: introText,
          sender: 'bot',
          timestamp: new Date()
        }]);

      } catch (error) {
        console.error("History load failed:", error);
        setMessages([{
          id: 'error',
          content: introText,
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    };

    loadHistory();
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket) return;

    const tempId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: tempId,
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ message: inputValue }));
      } else {
        throw new Error("WebSocket not ready");
      }
    } catch (err) {
      console.error("Send failed:", err);
      setMessages(prev => prev.filter(m => m.id !== tempId));
      toast({
        title: "Send failed",
        description: "Message couldn't be delivered",
        variant: "destructive"
      });
    }
  };

  // UI Helpers
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => scrollToBottom(), [messages]);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  return (
    <GlassCard 
      variant="dark" 
      className={cn(
        'flex flex-col border border-border/20',
        fullSize ? 'h-[calc(100vh-100px)]' : 'h-[70vh] md:h-[75vh] max-h-[800px]',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium">ProgressorAI</h3>
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full ${
                isConnecting ? 'bg-yellow-400' : 'bg-green-400'
              } mr-2`} />
              <p className="text-xs text-muted-foreground">
                {isConnecting ? 'Connecting...' : 'Online'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none flex flex-col gap-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex max-w-[90%] animate-chat-bubble',
              message.sender === 'user' ? 'self-end' : 'self-start'
            )}
          >
            <div className={cn(
              'rounded-xl p-3 text-sm flex flex-col',
              message.sender === 'user'
                ? 'bg-primary/10 border border-primary/20 rounded-tr-none'
                : 'bg-secondary/50 rounded-tl-none'
            )}>
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
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="self-start flex max-w-[80%]">
            <div className="bg-secondary/50 rounded-xl p-3 rounded-tl-none">
              <div className="flex items-center gap-2">
                <Bot size={14} className="text-primary" />
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse delay-100" />
                  <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse delay-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {allSuggestions.length > 0 && messages.length <= 2 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {allSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => setInputValue(suggestion.text)}
                className="text-xs py-1.5 px-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-border/30">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full rounded-lg bg-secondary/30 text-foreground placeholder:text-muted-foreground resize-none p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px] max-h-[120px] text-sm"
              rows={1}
            />
            <Button
              size="icon"
              className="absolute right-1 bottom-1 h-8 w-8"
              variant="ghost"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping || isConnecting}
            >
              {isTyping ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} className="text-primary" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Link */}
      {!fullSize && (
        <div className="p-3 pt-0 border-t border-border/20">
          <Link 
            to="/tasks" 
            className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <span>View your tasks</span>
            <MoveRight size={12} />
          </Link>
        </div>
      )}
    </GlassCard>
  );
};

export default ChatInterface;