import AdSenseDisplay from './AdSenseDisplay';
import type { AdSlotKey } from './constants';
import { cn } from '../../../utils/cn';

interface AdSenseBlockProps {
  slotKey: AdSlotKey;
  size?: 'H90' | 'H280' | 'V420';
  sectionClassName?: string;
  wrapperClassName?: string;
}

const SLOT_DEFAULT_SIZE: Record<AdSlotKey, 'H90' | 'H280' | 'V420'> = {
  TOP: 'H90',
  BOTTOM: 'H280',
  SIDE: 'V420',
};

export default function AdSenseBlock({
  slotKey,
  size,
  sectionClassName,
  wrapperClassName,
}: AdSenseBlockProps) {
  const resolvedSize = size ?? SLOT_DEFAULT_SIZE[slotKey];

  return (
    <section className={cn('w-full mt-8', sectionClassName)}>
      <div className={cn('w-full', wrapperClassName)}>
        <AdSenseDisplay slotKey={slotKey} size={resolvedSize} />
      </div>
    </section>
  );
}
