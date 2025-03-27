
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthButtonsProps {
  vertical?: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ vertical = false }) => {
  return (
    <div className={vertical ? "flex flex-col gap-3 mt-2" : "flex items-center gap-2"}>
      <Link to="/login" className={vertical ? "w-full" : ""}>
        <Button 
          variant={vertical ? "outline" : "ghost"} 
          size="sm" 
          className={vertical ? "w-full" : "text-muted-foreground hover:text-foreground"}
        >
          {vertical && <LogIn size={16} className="mr-2" />}
          Log in
        </Button>
      </Link>
      <Link to="/signup" className={vertical ? "w-full" : ""}>
        <Button 
          variant="default" 
          size="sm" 
          className={cn(
            "bg-primary hover:bg-primary/90", 
            vertical && "w-full"
          )}
        >
          Sign up
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
