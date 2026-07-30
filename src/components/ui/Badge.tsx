import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'white' | 'purple' | 'outline';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  className = '',
  icon,
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    amber: 'bg-amber-100 text-amber-800 border border-amber-200',
    white: 'bg-white text-slate-800 border border-slate-200/80 shadow-xs',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
    outline: 'bg-white/15 text-emerald-100 border border-white/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${variantStyles[variant]} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
