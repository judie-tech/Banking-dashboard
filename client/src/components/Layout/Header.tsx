import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <Menu className="w-6 h-6 text-[#2a3b8f]" />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-[#2a3b8f]">
              {user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center space-x-2 bg-white/50 rounded-xl px-4 py-2 min-w-[300px]">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions, users..."
              className="bg-transparent border-none outline-none flex-1 text-gray-700"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-3 rounded-xl bg-white/50 hover:bg-white/70 transition-colors">
            <Bell className="w-5 h-5 text-[#2a3b8f]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff6b6b] rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00c9b1] to-[#ff6b6b] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-[#2a3b8f]">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;