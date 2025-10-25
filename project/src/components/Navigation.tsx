import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, BarChart3, Users, User, Zap } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/running', icon: Activity, label: 'Track' },
    { path: '/history', icon: BarChart3, label: 'Analytics' },
    { path: '/clubs', icon: Users, label: 'Community' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-lg blur-sm opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white text-black font-bold text-lg px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
                <Zap className="h-4 w-4" />
                <span>BOLT</span>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:block text-sm">{item.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-white rounded-lg blur-sm opacity-20 -z-10"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;