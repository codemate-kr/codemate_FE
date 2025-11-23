import toastLib from 'react-hot-toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export const toast = (message: string, type: ToastType = 'success') => {
  switch (type) {
    case 'success':
      toastLib.success(message);
      break;
    case 'error':
      toastLib.error(message);
      break;
    case 'warning':
      toastLib(message, { icon: '⚠️' });
      break;
    case 'info':
      toastLib(message, { icon: 'ℹ️' });
      break;
  }
};
