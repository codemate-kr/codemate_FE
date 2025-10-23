/**
 * 요일 이름 배열을 월요일부터 일요일 순서로 정렬합니다.
 * @param dayNames 한글 요일 이름 배열 (예: ["수요일", "월요일", "금요일"])
 * @returns 정렬된 요일 이름 배열 (예: ["월요일", "수요일", "금요일"])
 */
export function sortDayNames(dayNames: string[]): string[] {
  const dayOrder: Record<string, number> = {
    '월요일': 1,
    '화요일': 2,
    '수요일': 3,
    '목요일': 4,
    '금요일': 5,
    '토요일': 6,
    '일요일': 7,
  };

  return [...dayNames].sort((a, b) => {
    const orderA = dayOrder[a] ?? 99;
    const orderB = dayOrder[b] ?? 99;
    return orderA - orderB;
  });
}
