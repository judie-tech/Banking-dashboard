import React, { useState } from 'react';
import { X, Download, Calendar, FileText, Filter } from 'lucide-react';

interface StatementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatementsModal: React.FC<StatementsModalProps> = ({ isOpen, onClose }) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statementType, setStatementType] = useState<'monthly' | 'quarterly' | 'yearly' | 'custom'>('monthly');
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');

  const handleDownload = () => {
    // Simulate download
    console.log('Downloading statement:', { dateRange, statementType, format });
    // In real implementation, this would trigger a download
    alert(`Statement download started! Format: ${format.toUpperCase()}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-gray-900">Account Statements</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Statement Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Statement Period
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="statementType"
                  value="monthly"
                  checked={statementType === 'monthly'}
                  onChange={(e) => setStatementType(e.target.value as 'monthly')}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Monthly</span>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="statementType"
                  value="quarterly"
                  checked={statementType === 'quarterly'}
                  onChange={(e) => setStatementType(e.target.value as 'quarterly')}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Quarterly</span>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="statementType"
                  value="yearly"
                  checked={statementType === 'yearly'}
                  onChange={(e) => setStatementType(e.target.value as 'yearly')}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Yearly</span>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="statementType"
                  value="custom"
                  checked={statementType === 'custom'}
                  onChange={(e) => setStatementType(e.target.value as 'custom')}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Custom</span>
              </label>
            </div>
          </div>

          {/* Custom Date Range */}
          {statementType === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a3b8f] text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Download Format
            </label>
            <div className="flex space-x-3">
              <label className="flex-1 flex items-center justify-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={(e) => setFormat(e.target.value as 'pdf')}
                  className="mr-3"
                />
                <FileText className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-medium">PDF</span>
              </label>

              <label className="flex-1 flex items-center justify-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value as 'csv')}
                  className="mr-3"
                />
                <Filter className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium">CSV</span>
              </label>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium text-sm">Statement Preview</p>
                <p className="text-blue-600 text-xs mt-1">
                  {statementType === 'custom' && dateRange.start && dateRange.end
                    ? `${dateRange.start} to ${dateRange.end}`
                    : `Last ${statementType} statement`}
                </p>
                <p className="text-blue-600 text-xs">Format: {format.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full py-3 bg-gradient-to-r from-[#2a3b8f] to-[#00c9b1] text-white font-semibold rounded-xl hover:from-[#1e2875] hover:to-[#00a896] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Statement</span>
          </button>

          {/* Available Statements */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Statements</h4>
            <div className="space-y-2">
              {['December 2024', 'November 2024', 'October 2024'].map((month) => (
                <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{month}</span>
                  <button className="text-[#2a3b8f] hover:text-[#00c9b1] text-sm font-medium transition-colors">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementsModal;