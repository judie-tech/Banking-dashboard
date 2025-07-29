import React, { useState } from 'react';
import { Filter, Download, Calendar, Search } from 'lucide-react';
import { Transaction } from '../types';

const TransactionHistory: React.FC = () => {
  const [transactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [transactionType, setTransactionType] = useState<'all' | 'debit' | 'credit'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const transactionsPerPage = 10;

  const exportTransactions = (format: 'csv' | 'pdf') => {
    // Simulate export functionality
    console.log(`Exporting transactions as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2a3b8f] to-[#00c9b1] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Transaction History</h1>
            <p className="opacity-90">View and manage your transaction records</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => exportTransactions('csv')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => exportTransactions('pdf')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] text-sm"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] text-sm"
              />
            </div>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as 'all' | 'debit' | 'credit')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] text-sm"
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] text-sm"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] text-sm"
              >
                <option value="desc">Newest</option>
                <option value="asc">Oldest</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
        <div className="p-6 border-b border-white/20">
          <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 bg-gray-50/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium mb-2">No transactions found</p>
                      <p className="text-sm">Transactions will appear here after backend integration</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Transactions will be mapped here when available
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Transaction data ready for backend integration
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination would go here */}
        <div className="px-6 py-4 border-t border-white/20">
          <div className="text-sm text-gray-600 text-center">
            Ready for pagination implementation
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;