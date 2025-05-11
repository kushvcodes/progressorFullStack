
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Logo: React.FC = () => {
  const [showText, setShowText] = useState(false);
  
  useEffect(() => {
    // Trigger the animation after component mounts
    const timer = setTimeout(() => {
      setShowText(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="relative flex items-center">
        <img 
          src="https://cdn.prod.website-files.com/67d9b81906c4755794477085/67dac1211a22882b301f5d47_Untitled%20design%20(1).png" 
          alt="ProgressorAI Logo" 
          className="h-8 w-auto"
        />
        <span className={cn(
          "text-primary cursor-blink absolute left-[calc(100%-2px)] top-0 transition-opacity duration-500 opacity-0",
          showText ? "opacity-100" : "opacity-0"
        )}>|</span>
        <span className={cn(
          "text-xl font-semibold tracking-tight text-gradient bg-clip-text text-transparent ml-4 transition-all duration-700",
          showText ? "opacity-100 translate-x-0" : "opacity-100 -translate-x-2"
        )}>
          ProgressorAI
        </span>
      </div>
    </Link>
  );
};

export default Logo;
