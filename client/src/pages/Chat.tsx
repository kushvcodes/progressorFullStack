
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ChatInterface from '@/components/chat/ChatInterface';
import Particles from '@/components/animations/Particles';
import Footer from '@/components/layout/Footer';

const Chat = () => {
  return (
    <div className="min-h-screen overflow-hidden animated-gradient-bg flex flex-col">
      <Particles quantity={20} staticity={70} ease={70} />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-6 md:px-6 relative z-10 flex-grow flex flex-col">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]">AI Assistant</h1>
          <p className="text-muted-foreground drop-shadow-md">Chat with your productivity AI assistant.</p>
        </div>
        
        <div className="flex-grow">
          <ChatInterface 
            fullSize={true}
            introText="Welcome to your AI assistant! I'm here to help you with your tasks, scheduling, and productivity questions."
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
