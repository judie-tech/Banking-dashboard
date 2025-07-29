import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import UserTable from '../components/Admin/UserTable';
import TransactionHistory from './TransactionHistory';
import { User } from '../types';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Determine which view to show based on the current path
  const currentView = location.pathname === '/admin/users' ? 'users' : 
                     location.pathname === '/admin/transactions' ? 'transactions' : 'dashboard';

  // Mock fetch users function - replace with actual API call
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API call to JSONPlaceholder
      const mockUsers: User[] = [];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (user: User) => {
    // Navigate to user details page
    console.log('Navigate to user:', user.id);
  };

  const stats = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      change: '0%',
      changeType: 'neutral' as const,
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Low Balance Accounts',
      value: users.filter(user => user.balance < 100).length.toString(),
      change: '0%',
      changeType: 'neutral' as const,
      icon: AlertTriangle,
      color: 'coral' as const
    },
    {
      title: 'Total System Balance',
      value: `KES ${users.reduce((sum, user) => sum + user.balance, 0).toLocaleString()}`,
      change: '0%',
      changeType: 'neutral' as const,
      icon: TrendingUp,
      color: 'teal' as const
    },
    {
      title: 'Active Accounts',
      value: users.length.toString(),
      icon: CreditCard,
      color: 'purple' as const
    }
  ];

  // Render different views based on current path
  if (currentView === 'transactions') {
    return <TransactionHistory />;
  }

  if (currentView === 'users') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2a3b8f] to-[#00c9b1] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">User Management</h1>
              <p className="opacity-90">Manage and monitor all user accounts</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Total Users</p>
              <p className="text-3xl font-bold">{users.length}</p>
              <p className="text-sm opacity-75">Active Accounts</p>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="px-4 py-2 bg-[#2a3b8f] text-white rounded-xl hover:bg-[#1e2875] transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Users'}
            </button>
          </div>

          {loading ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-lg border border-white/20">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-[#2a3b8f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users from JSONPlaceholder API...</p>
              </div>
            </div>
          ) : (
            <UserTable users={users} onUserClick={handleUserClick} />
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#2a3b8f] to-[#00c9b1] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <p className="opacity-90">Manage users and monitor system activity</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">System Overview</p>
            <p className="text-3xl font-bold">{users.length}</p>
            <p className="text-sm opacity-75">Total Users</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2a3b8f] to-[#1e2875] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00c9b1] to-[#00a896] rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Monitor Transactions</h3>
              <p className="text-sm text-gray-600">View all system transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b6b] to-[#ff5252] rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">System Alerts</h3>
              <p className="text-sm text-gray-600">Monitor system health</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
        <div className="space-y-3">
          {users.filter(user => user.balance < 100).length === 0 ? (
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-green-800 text-sm">All user accounts have sufficient balance</p>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-800 text-sm">
                {users.filter(user => user.balance < 100).length} account(s) have balance below KES 100
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-blue-800 text-sm">System is running normally</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;