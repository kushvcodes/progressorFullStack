
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, User, LogOut, Settings, MessageSquare, FileText, Coffee, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tasks', path: '/tasks', tourId: 'tasks-link' },
    { name: 'Chat', path: '/chat' },
    { name: 'Analytics', path: '/analytics', tourId: 'analytics-link' },
    { name: 'Documentation', path: '/documentation' },
    { name: 'Donate', path: '/donate' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'glass-panel-dark py-3' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks links={navLinks} />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isLoggedIn && <NotificationCenter />}
            {isLoggedIn ? (
              <AccountMenu user={user} onLogout={logout} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {isLoggedIn && <NotificationCenter />}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel-dark animate-slide-down absolute top-full left-0 w-full">
          <div className="container mx-auto px-4 py-4">
            <NavLinks links={navLinks} vertical />
            <div className="border-t border-border my-2 pt-4">
              {isLoggedIn ? (
                <MobileUserMenu user={user} onLogout={logout} />
              ) : (
                <AuthButtons vertical />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

interface AccountMenuProps {
  user: { name?: string; email?: string } | null;
  onLogout: () => void;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ user, onLogout }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-sm">
          <span>{user?.name || 'Account'}</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel-dark animate-scale-in min-w-[180px]">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
            <User size={14} />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/chat" className="flex items-center gap-2 cursor-pointer">
            <MessageSquare size={14} />
            <span>Chat</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/analytics" className="flex items-center gap-2 cursor-pointer">
            <BarChart2 size={14} />
            <span>Analytics</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/documentation" className="flex items-center gap-2 cursor-pointer">
            <FileText size={14} />
            <span>Documentation</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/donate" className="flex items-center gap-2 cursor-pointer">
            <Coffee size={14} />
            <span>Donate</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
          onClick={onLogout}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface MobileUserMenuProps {
  user: { name?: string; email?: string } | null;
  onLogout: () => void;
}

const MobileUserMenu: React.FC<MobileUserMenuProps> = ({ user, onLogout }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 py-2 text-muted-foreground">
        <User size={16} />
        <span className="text-sm font-medium">{user?.name || 'User'}</span>
      </div>
      <Link to="/profile" className="text-sm font-medium py-2 flex items-center gap-2 text-muted-foreground hover:text-primary">
        <Settings size={16} />
        Settings
      </Link>
      <button 
        className="text-sm font-medium py-2 flex items-center gap-2 text-muted-foreground hover:text-primary w-full text-left"
        onClick={onLogout}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
};

export default Navbar;
