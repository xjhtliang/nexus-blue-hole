import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { ChevronRight, ChevronDown } from 'lucide-react';

export interface NavItem {
  id: string;
  title: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

interface NavMenuProps {
  items: NavItem[];
  isOpen: boolean;
}

const NavGroup = ({ item, isOpen, level = 0 }: { item: NavItem; isOpen: boolean; level?: number }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const Icon = item.icon;

  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
            isActive 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            level > 0 && "ml-4"
          )
        }
      >
        {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
        <span className={cn("whitespace-nowrap transition-all duration-300", !isOpen && "opacity-0 w-0 overflow-hidden")}>
          {item.title}
        </span>
        
        {!isOpen && (
          <div className="absolute left-14 bg-popover text-popover-foreground px-2 py-1 rounded text-xs shadow-md opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity whitespace-nowrap">
            {item.title}
          </div>
        )}
      </NavLink>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:bg-secondary hover:text-foreground",
          level > 0 && "ml-4"
        )}
      >
        <div className="flex items-center gap-3">
            {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
            <span className={cn("whitespace-nowrap transition-all duration-300", !isOpen && "opacity-0 w-0 overflow-hidden")}>
            {item.title}
            </span>
        </div>
        {isOpen && (
             isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
        )}
      </button>
      
      {isExpanded && isOpen && (
        <div className="mt-1 space-y-1">
          {item.children?.map(child => (
            <NavGroup key={child.id} item={child} isOpen={isOpen} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Navigation: React.FC<NavMenuProps> = ({ items, isOpen }) => {
  return (
    <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
      {items.map(item => (
        <NavGroup key={item.id} item={item} isOpen={isOpen} />
      ))}
    </nav>
  );
};