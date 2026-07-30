import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'white' | 'amber' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs',
    white: 'bg-white hover:bg-slate-50 text-slate-900 shadow-md hover:shadow-lg border border-slate-200',
    amber: 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs font-extrabold',
    outline: 'border border-emerald-600 text-emerald-700 hover:bg-emerald-50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl font-bold',
    lg: 'px-7 py-3.5 text-base rounded-2xl font-extrabold',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
};
