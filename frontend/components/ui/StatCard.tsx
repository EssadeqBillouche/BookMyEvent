import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export default function StatCard({ title, value, subtitle, icon, iconBgColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBgColor }}>
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm mt-1" style={{ color: '#7c90a6' }}>
        {subtitle}
      </p>
    </div>
  );
}
