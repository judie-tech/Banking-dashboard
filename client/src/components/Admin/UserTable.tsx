import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { User } from '../../types';

interface UserTableProps {
  users: User[];
  onUserClick: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onUserClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Check if balance is below threshold
  const isLowBalance = (balance: number) => balance < 100;

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Red rows indicate balance below KES 100</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] focus:border-transparent"
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20 bg-gray-50/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Balance (KES)</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Account Type</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium mb-2">No users found</p>
                    <p className="text-sm">
                      {searchTerm ? 'Try adjusting your search terms' : 'Users will be loaded from the backend'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => onUserClick(user)}
                  className={`border-b border-white/10 hover:bg-white/50 cursor-pointer transition-all duration-200 ${
                    isLowBalance(user.balance) ? 'bg-red-50/70 hover:bg-red-100/50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00c9b1] to-[#ff6b6b] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className={`font-semibold ${
                      isLowBalance(user.balance) ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {user.balance.toLocaleString()}
                    </p>
                    {isLowBalance(user.balance) && (
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-600">Low Balance</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.accountType === 'Savings' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.accountType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;