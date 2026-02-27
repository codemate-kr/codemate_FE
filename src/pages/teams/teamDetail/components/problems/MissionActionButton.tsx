import type { ButtonHTMLAttributes, ReactNode } from 'react';

type MissionButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'success';
type MissionButtonSize = 'md' | 'sm';

interface MissionActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: MissionButtonVariant;
  size?: MissionButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
}

const variantClassMap: Record<MissionButtonVariant, string> = {
  primary: 'border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:border-blue-700 disabled:hover:bg-blue-600 disabled:hover:border-blue-600',
  secondary: 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-white hover:text-blue-700 hover:border-blue-300',
  tertiary: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-700 hover:border-slate-300',
  success: 'border-green-600 bg-green-600 text-white',
};

const sizeClassMap: Record<MissionButtonSize, string> = {
  md: 'px-4 py-2 text-sm',
  sm: 'px-3.5 py-2 text-sm',
};

export function MissionActionButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leadingIcon,
  className = '',
  children,
  ...props
}: MissionActionButtonProps) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-1.5 font-medium rounded-md border transition-colors',
        variantClassMap[variant],
        sizeClassMap[size],
        fullWidth ? 'w-full' : '',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      ].join(' ').trim()}
    >
      {leadingIcon}
      {children}
    </button>
  );
}

interface MissionIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function MissionIconButton({
  active = false,
  className = '',
  children,
  ...props
}: MissionIconButtonProps) {
  return (
    <button
      {...props}
      className={[
        'p-1 rounded-full transition-colors',
        active
          ? 'text-green-500 hover:bg-green-100'
          : 'text-gray-400 hover:text-blue-500 hover:bg-blue-100',
        className,
      ].join(' ').trim()}
    >
      {children}
    </button>
  );
}
