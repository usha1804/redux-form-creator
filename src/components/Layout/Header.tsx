import React from 'react';
import { Home, Hammer, Eye, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/create', label: 'Builder', icon: <Hammer className="w-4 h-4" /> },
    { path: '/preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> },
    { path: '/myforms', label: 'My Forms', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary to-secondary shadow-sm">
      <div className="flex h-16 items-center px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mr-4 text-primary-foreground hover:bg-white/10"
        >
          <Home className="w-5 h-5 mr-2" />
          Home
        </Button>
        
        <h1 className="flex-1 text-xl font-bold text-primary-foreground">
          Dynamic Form Builder
        </h1>

        <nav className="flex gap-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`text-primary-foreground hover:bg-white/10 ${
                location.pathname === item.path 
                  ? 'bg-white/20' 
                  : ''
              }`}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;