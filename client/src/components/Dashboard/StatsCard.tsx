import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: 'teal' | 'coral' | 'blue' | 'purple';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color
}) => {
  const colorClasses = {
    teal: 'from-[#00c9b1] to-[#00a896]',
    coral: 'from-[#ff6b6b] to-[#ff5252]',
    blue: 'from-[#2a3b8f] to-[#1e2875]',
    purple: 'from-[#4e54c8] to-[#8f94fb]'
  };

  const changeClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${changeClasses[changeType]}`}>
            {changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : ''}{change}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;