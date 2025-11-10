import { getTierName } from '../../utils/tierUtils';

/**
 * solved.ac 티어 레벨을 로컬 SVG 아이콘으로 반환
 * @param level - 티어 레벨 (1-30, Bronze V ~ Ruby I)
 * @param size - 아이콘 크기 (기본값: 18px)
 */
export const getTierIcon = (level: number, size: number = 18) => {
  const safe = Number.isFinite(level) ? Math.min(30, Math.max(1, Math.floor(level))) : 1;
  const src = `/tier/${safe}.svg`;
  const tierName = getTierName(safe);

  return (
    <img
      src={src}
      alt={tierName}
      title={tierName}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className="inline-block align-middle flex-shrink-0"
      onError={(e) => {
        // Fallback to Bronze V if image fails to load
        e.currentTarget.src = '/tier/1.svg';
      }}
    />
  );
};

