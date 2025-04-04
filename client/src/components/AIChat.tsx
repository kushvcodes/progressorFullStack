// components/AIChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Send, Bot, User, Loader2 } from 'lucide-react';

type Message = {
  id?: string;
  content: string;
  sender: 'user' | 'AI';
  timestamp: string;
};

const AIChat = () => {
  const { user, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load message history on mount
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadHistory = async () => {
      try {
        const response = await fetch('/api/v1/chat/messages/', {
          headers: {
            'Authorization': `JWT ${localStorage.getItem('access_token')}`
          }
        });
        const data = await response.json();
        setMessages(data.messages.map((msg: any) => ({
          content: msg.content,
          sender: msg.sender === user?.username ? 'user' : 'AI',
          timestamp: msg.timestamp
        })));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };

    loadHistory();
  }, [isLoggedIn, user]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const token = localStorage.getItem('access_token');
    const wsUrl = `ws://${window.location.host}/ws/chat/?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnecting(false);
      setSocket(ws);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages(prev => [...prev, {
        content: data.message,
        sender: data.sender === 'AI' ? 'AI' : 'user',
        timestamp: data.timestamp
      }]);
    };

    ws.onclose = () => {
      setSocket(null);
      setIsConnecting(true);
      // Attempt reconnect after 5 seconds
      setTimeout(() => setSocket(new WebSocket(wsUrl)), 5000);
    };

    return () => {
      ws.close();
    };
  }, [isLoggedIn, user]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
      message: inputValue
    }));
    setInputValue('');
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">Please log in to chat</h3>
          <p className="text-muted-foreground">
            You need to be authenticated to use the chat feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.sender === 'AI' ? (
                  <Bot size={14} className="text-accent" />
                ) : (
                  <User size={14} className="text-accent" />
                )}
                <span className="font-medium text-xs">
                  {msg.sender === 'AI' ? 'AI Assistant' : 'You'}
                </span>
                <span className="text-xs opacity-70 ml-auto">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isConnecting && (
          <div className="flex justify-center">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" />
              Connecting to chat...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-lg p-3 border resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isConnecting}
            className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;