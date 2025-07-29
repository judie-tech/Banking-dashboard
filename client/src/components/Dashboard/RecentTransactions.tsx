import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Transaction } from '../../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
    }
  };

  // Show message when no transactions
  if (transactions.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <span className="text-sm text-gray-500">Last 5</span>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpRight className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No transactions yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Transactions will appear here after backend integration
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-[#2a3b8f] hover:text-[#00c9b1] text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                transaction.type === 'credit' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {transaction.type === 'credit' ? (
                  <ArrowDownLeft className="w-5 h-5" />
                ) : (
                  <ArrowUpRight className="w-5 h-5" />
                )}
              </div>
              
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(transaction.status)}
                  <span className="capitalize">{transaction.status}</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}KES {transaction.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;