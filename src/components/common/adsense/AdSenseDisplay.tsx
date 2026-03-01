import { useEffect } from 'react';
import {
  AD_SLOTS,
  ADSENSE_CLIENT_ID,
  ADSENSE_SCRIPT_SRC,
  type AdSlotKey,
  isLocalhostHost,
} from './constants';

interface AdSenseDisplayProps {
  slot?: string;
  slotKey?: AdSlotKey;
  className?: string;
  size?: 'H90' | 'H280' | 'V420';
}

const SIZE_STYLE = {
  H90: {
    height: 90,
    heightClass: 'h-[90px]',
  },
  H280: {
    height: 280,
    heightClass: 'h-[280px]',
  },
  V420: {
    height: 420,
    heightClass: 'h-[420px]',
  },
} as const;

export default function AdSenseDisplay({ slot, slotKey, className, size = 'H90' }: AdSenseDisplayProps) {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalhost = isLocalhostHost(hostname);
  const sizeStyle = SIZE_STYLE[size];
  const slotId = slotKey ? AD_SLOTS[slotKey] : slot;

  if (!slotId) {
    return null;
  }

  useEffect(() => {
    if (typeof window === 'undefined' || isLocalhost) return;

    const hasScript = document.querySelector(`script[src="${ADSENSE_SCRIPT_SRC}"]`);

    if (!hasScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = ADSENSE_SCRIPT_SRC;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }

    const timer = window.setTimeout(() => {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        console.error('Adsense push failed:', error);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isLocalhost]);

  if (isLocalhost) {
    return (
      <div className={`w-full ${sizeStyle.heightClass} rounded-lg border border-gray-300 bg-gray-200 text-gray-600 text-xs sm:text-sm font-medium flex items-center justify-center`}>
        Local Ad Placeholder ({size})
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle w-full ${className ?? ''}`.trim()}
      style={{ display: 'block', width: '100%', height: `${sizeStyle.height}px` }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
