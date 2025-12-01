/**
 * solved.ac 티어 레벨을 티어 이름으로 변환
 * @param level - 티어 레벨 (1-30)
 * @returns 티어 이름 (예: "Bronze V", "Silver III", "Gold I", "Diamond II", "Ruby I")
 */
export const getTierName = (level: number): string => {
  const tiers = [
    'Bronze V', 'Bronze IV', 'Bronze III', 'Bronze II', 'Bronze I',
    'Silver V', 'Silver IV', 'Silver III', 'Silver II', 'Silver I',
    'Gold V', 'Gold IV', 'Gold III', 'Gold II', 'Gold I',
    'Platinum V', 'Platinum IV', 'Platinum III', 'Platinum II', 'Platinum I',
    'Diamond V', 'Diamond IV', 'Diamond III', 'Diamond II', 'Diamond I',
    'Ruby V', 'Ruby IV', 'Ruby III', 'Ruby II', 'Ruby I'
  ];
  return tiers[level - 1] || 'Unknown';
};

/**
 * solved.ac 티어 레벨을 축약형 티어 이름으로 변환 (한글 첫글자 + 로마숫자)
 * @param level - 티어 레벨 (1-30)
 * @returns 축약형 티어 이름 (예: "브Ⅴ", "실Ⅲ", "골Ⅰ", "플Ⅱ", "다Ⅰ", "루Ⅰ")
 */
export const getTierShortName = (level: number): string => {
  const tierIndex = Math.floor((level - 1) / 5);
  const tierNumber = 5 - ((level - 1) % 5);
  const tierPrefixes = ['브', '실', '골', '플', '다', '루'];
  const romanNumerals = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ'];
  return `${tierPrefixes[tierIndex] || '?'}${romanNumerals[tierNumber - 1] || '?'}`;
};

/**
 * solved.ac 티어 레벨을 Tailwind CSS 색상 클래스로 변환
 * @param level - 티어 레벨 (1-30)
 * @returns Tailwind CSS 클래스 문자열
 */
export const getTierColor = (level: number): string => {
  if (level <= 5) return 'text-orange-600 bg-orange-50'; // Bronze
  if (level <= 10) return 'text-gray-500 bg-gray-100'; // Silver
  if (level <= 15) return 'text-yellow-600 bg-yellow-50'; // Gold
  if (level <= 20) return 'text-cyan-600 bg-cyan-50'; // Platinum
  if (level <= 25) return 'text-blue-600 bg-blue-50'; // Diamond
  return 'text-red-600 bg-red-50'; // Ruby
};
