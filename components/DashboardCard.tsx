import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-4 sm:p-6 ${className}`}>
      <h2 className="text-xl font-bold text-cyan-300 mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default DashboardCard;