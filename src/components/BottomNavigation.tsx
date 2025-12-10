import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Ticket, Plus, Users, MapPin } from 'lucide-react';

interface BottomNavigationProps {
  onAddEvent?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onAddEvent }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Compass, label: 'Explore', path: '/' },
    { icon: Ticket, label: 'Buy tickets', path: '/tickets' },
    { icon: Plus, label: 'Add', action: onAddEvent, isMain: true },
    { icon: MapPin, label: 'Tickets', path: '/my-tickets' },
    { icon: Users, label: 'Groups', path: '/groups' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.path === location.pathname;

          if (item.isMain) {
            return (
              <button
                key={index}
                onClick={item.action}
                className="relative -mt-8 w-14 h-14 rounded-full vibe-gradient 
                         flex items-center justify-center shadow-lg shadow-accent/30
                         transform transition-transform hover:scale-105 active:scale-95"
              >
                <Icon className="w-6 h-6 text-accent-foreground" />
              </button>
            );
          }

          return (
            <button
              key={index}
              onClick={() => item.path && navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors
                ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
