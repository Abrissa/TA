import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 2,
  className = '',
}) => {
  const baseStyle = 'font-heading font-extrabold text-slate-900 tracking-tight';

  switch (level) {
    case 1:
      return <h1 className={`text-3xl sm:text-5xl lg:text-6xl ${baseStyle} ${className}`}>{children}</h1>;
    case 2:
      return <h2 className={`text-2xl sm:text-3xl lg:text-4xl ${baseStyle} ${className}`}>{children}</h2>;
    case 3:
      return <h3 className={`text-xl sm:text-2xl ${baseStyle} ${className}`}>{children}</h3>;
    case 4:
      return <h4 className={`text-lg sm:text-xl ${baseStyle} ${className}`}>{children}</h4>;
    default:
      return <h2 className={`text-2xl sm:text-3xl ${baseStyle} ${className}`}>{children}</h2>;
  }
};
