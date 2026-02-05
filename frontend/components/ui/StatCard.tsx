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
    <div className="glass-card p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{ background: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110 hover:rotate-6" style={{ backgroundColor: iconBgColor, backdropFilter: 'blur(10px)' }}>
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
      </div>
      <p className="text-4xl font-bold text-white">{value}</p>
      <p className="text-sm mt-2 text-white/60">
        {subtitle}
      </p>
    </div>
  );
}
