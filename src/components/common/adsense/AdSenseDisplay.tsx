import { useEffect, useRef } from 'react';
import {
  AD_SLOTS,
  ADSENSE_CLIENT_ID,
  ADSENSE_LOCALHOST_OVERRIDE,
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

type AdsByGoogleWindow = Window & {
  adsbygoogle?: Array<Record<string, never>>;
};

function applyFixedHeight(element: HTMLElement | null, fixedHeight: string) {
  if (!element) return;
  element.style.height = fixedHeight;
  element.style.minHeight = fixedHeight;
  element.style.maxHeight = fixedHeight;
}

export default function AdSenseDisplay({ slot, slotKey, className, size = 'H90' }: AdSenseDisplayProps) {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalhost = isLocalhostHost(hostname) && !ADSENSE_LOCALHOST_OVERRIDE;
  const sizeStyle = SIZE_STYLE[size];
  const slotId = slotKey ? AD_SLOTS[slotKey] : slot;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const adRef = useRef<HTMLModElement | null>(null);

  if (!slotId) {
    return null;
  }

  useEffect(() => {
    if (typeof window === 'undefined' || isLocalhost) return;
    const fixedHeight = `${sizeStyle.height}px`;
    const enforceFixedHeight = () => {
      applyFixedHeight(containerRef.current, fixedHeight);
      applyFixedHeight(adRef.current, fixedHeight);
    };

    enforceFixedHeight();

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
        const adsWindow = window as AdsByGoogleWindow;
        adsWindow.adsbygoogle = adsWindow.adsbygoogle || [];
        adsWindow.adsbygoogle.push({});
        // adsbygoogle가 inline style을 바꿀 수 있어 다시 고정값 적용
        window.setTimeout(enforceFixedHeight, 0);
      } catch (error) {
        console.error('Adsense push failed:', error);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isLocalhost, sizeStyle.height]);

  if (isLocalhost) {
    return (
      <div className={`w-full ${sizeStyle.heightClass} rounded-lg border border-gray-300 bg-gray-200 text-gray-600 text-xs sm:text-sm font-medium flex items-center justify-center`}>
        Local Ad Placeholder ({size})
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden ${sizeStyle.heightClass}`}
      style={{
        height: `${sizeStyle.height}px`,
        minHeight: `${sizeStyle.height}px`,
        maxHeight: `${sizeStyle.height}px`,
      }}
    >
      <ins
        ref={adRef}
        className={`adsbygoogle w-full ${className ?? ''}`.trim()}
        style={{
          display: 'block',
          width: '100%',
          height: `${sizeStyle.height}px`,
          minHeight: `${sizeStyle.height}px`,
          maxHeight: `${sizeStyle.height}px`,
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
      />
    </div>
  );
}
