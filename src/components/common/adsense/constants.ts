export const ADSENSE_CLIENT_ID = 'ca-pub-3202475348649003';
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

export const AD_SLOTS = {
  TOP: '3054560516',
  BOTTOM: '2719518595',
  SIDE: '5888607411',
} as const;

export type AdSlotKey = keyof typeof AD_SLOTS;

export const ADSENSE_LOCALHOST_OVERRIDE = import.meta.env.VITE_ADSENSE_LOCALHOST_OVERRIDE === 'true';

export function isLocalhostHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
}
