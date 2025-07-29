import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const userNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/transactions', icon: CreditCard, label: 'Transactions' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const adminNavItems = [
    { path: '/admin', icon: Home, label: 'Admin Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/transactions', icon: CreditCard, label: 'All Transactions' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-lg border-r border-white/20 shadow-xl z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2a3b8f] to-[#00c9b1] rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#2a3b8f]">NeoBank</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-[#2a3b8f]" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00c9b1] to-[#ff6b6b] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-semibold text-[#2a3b8f]">{user?.name}</p>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                      isActive || location.pathname === item.path
                        ? 'bg-gradient-to-r from-[#2a3b8f] to-[#00c9b1] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white/50 hover:text-[#2a3b8f]'
                    }`
                  }
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {(location.pathname === item.path) && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;