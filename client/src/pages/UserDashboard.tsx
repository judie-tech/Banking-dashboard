import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Send,
  CreditCard,
  DollarSign,
  FileText,
  Download,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import StatsCard from "../components/Dashboard/StatsCard";
import RecentTransactions from "../components/Dashboard/RecentTransactions";
import TransferModal from "../components/Transfer/TransferModal";
import DepositModal from "../components/Deposit/DepositModal";
import StatementsModal from "../components/Statements/StatementsModal";
import { Transaction } from "../types";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [statementsModalOpen, setStatementsModalOpen] = useState(false);

  // Mock data - replace with actual data from backend
  const recentTransactions: Transaction[] = []; // Empty array to show "no transactions" state

  const stats = [
    {
      title: "Available Balance",
      value: "KES 0",
      icon: Wallet,
      color: "teal" as const,
    },
    {
      title: "Total Deposits",
      value: "KES 0",
      icon: TrendingUp,
      color: "blue" as const,
    },
    {
      title: "Total Withdrawals",
      value: "0",
      icon: TrendingDown,
      color: "coral" as const,
    },
    {
      title: "Recent Transactions",
      value: "0",
      icon: CreditCard,
      color: "purple" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="bg-gradient-to-r from-[#2a3b8f] to-[#00c9b1] rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="opacity-90 text-lg">Manage your finances with ease</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
              <p className="text-sm opacity-90 mb-1">Current Balance</p>
              <p className="text-4xl font-bold mb-1">
                KES {user?.balance.toLocaleString() || "0"}
              </p>
              <p className="text-sm opacity-75 capitalize">
                {user?.accountType} Account
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          onClick={() => setTransferModalOpen(true)}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b6b] to-[#ff5252] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Transfer Money
              </h3>
              <p className="text-sm text-gray-600">
                Send money to other accounts
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setDepositModalOpen(true)}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00c9b1] to-[#00a896] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Deposit Funds
              </h3>
              <p className="text-sm text-gray-600">Add money to your account</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setStatementsModalOpen(true)}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2a3b8f] to-[#1e2875] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                View Statements
              </h3>
              <p className="text-sm text-gray-600">
                Download account statements
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Transactions */}
      <div>
        <RecentTransactions transactions={recentTransactions} />
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        currentBalance={user?.balance || 0}
      />

      {/* Deposit Modal */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
      />

      {/* Statements Modal */}
      <StatementsModal
        isOpen={statementsModalOpen}
        onClose={() => setStatementsModalOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;
