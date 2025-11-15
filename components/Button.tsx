import React from 'react';
import clsx from 'classnames';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2';
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary:
      'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm',
    ghost: 'text-gray-700 hover:bg-gray-100'
  };
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}


