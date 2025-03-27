
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLink {
  name: string;
  path: string;
  tourId?: string;
}

interface NavLinksProps {
  links: NavLink[];
  vertical?: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ links, vertical = false }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <ul className={cn("flex", vertical ? "flex-col gap-4" : "gap-6")}>
      {links.map((link) => (
        <li key={link.path}>
          <Link
            to={link.path}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              vertical ? 'block py-2' : 'relative py-2',
              isActive(link.path) 
                ? vertical ? 'text-primary' : 'nav-link-active' 
                : 'text-muted-foreground hover:text-primary'
            )}
            data-tour={link.tourId}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
