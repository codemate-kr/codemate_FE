import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    iconColor: 'text-green-600',
    textColor: 'text-green-900',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    iconColor: 'text-red-600',
    textColor: 'text-red-900',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-900',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
  },
};

export function Toast({ message, type = 'success' }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`${config.bgColor} border ${config.borderColor} rounded-lg shadow-sm px-4 py-3`}>
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
          <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
        </div>
      </div>
    </div>
  );
}
