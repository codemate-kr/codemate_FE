import { useState, useMemo, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Loader2, X, ExternalLink } from 'lucide-react';
import NewBadge from '../../../components/common/NewBadge';
import { getTierName } from '../../../utils/tierUtils';
import {
  memberApi,
  type DailySolved,
  type DailySolvedProblem,
  type DailySolvedResponse,
} from '../../../api/member';

interface DailySolvedChartProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

type PeriodType = 'all' | '1y' | '6m' | '3m' | '30d' | '7d';

const PERIOD_OPTIONS: { value: PeriodType; label: string; days: number }[] = [
  { value: 'all', label: '전부', days: 730 },
  { value: '1y', label: '1년', days: 365 },
  { value: '6m', label: '6개월', days: 180 },
  { value: '3m', label: '3개월', days: 90 },
  { value: '30d', label: '1개월', days: 30 },
  { value: '7d', label: '7일', days: 7 },
];

// 티어 약어 변환 (Bronze V -> B5)
const getTierShort = (tier: number): string => {
  const tierName = getTierName(tier);
  const match = tierName.match(/^(\w+)\s+([IV]+)$/);
  if (!match) return '?';
  const [, rank, level] = match;
  const rankMap: Record<string, string> = {
    Bronze: 'B',
    Silver: 'S',
    Gold: 'G',
    Platinum: 'P',
    Diamond: 'D',
    Ruby: 'R',
  };
  const levelMap: Record<string, string> = { V: '5', IV: '4', III: '3', II: '2', I: '1' };
  return `${rankMap[rank] || '?'}${levelMap[level] || '?'}`;
};

// 티어별 텍스트 색상
const getTierTextColor = (tier: number): string => {
  if (tier <= 5) return 'text-orange-600'; // Bronze
  if (tier <= 10) return 'text-gray-500'; // Silver
  if (tier <= 15) return 'text-yellow-600'; // Gold
  if (tier <= 20) return 'text-cyan-600'; // Platinum
  if (tier <= 25) return 'text-blue-600'; // Diamond
  return 'text-red-600'; // Ruby
};

// 요일 매핑
const getDayName = (dateStr: string): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[new Date(dateStr).getDay()];
};

// 오늘 날짜인지 확인
const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};

// 기간별 라벨 포맷
const formatLabel = (dateStr: string, period: PeriodType): string => {
  const date = new Date(dateStr);
  if (period === '7d' || period === '30d') {
    return String(date.getDate());
  }
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// 기간별 데이터 그룹화 (긴 기간은 주 단위로)
const groupDataByPeriod = (data: DailySolved[], period: PeriodType): DailySolved[] => {
  if (period === '7d' || period === '30d') {
    return data;
  }

  const grouped: Map<string, DailySolved> = new Map();

  data.forEach((item) => {
    const date = new Date(item.date);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const weekKey = monday.toISOString().split('T')[0];

    if (grouped.has(weekKey)) {
      const existing = grouped.get(weekKey)!;
      existing.count += item.count;
      existing.problems = [...existing.problems, ...item.problems];
    } else {
      grouped.set(weekKey, {
        date: weekKey,
        count: item.count,
        problems: [...item.problems],
      });
    }
  });

  return Array.from(grouped.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

interface ChartDataItem {
  date: string;
  count: number;
  problems: DailySolvedProblem[];
  label: string;
  dayName: string;
  isToday: boolean;
}

interface PopoverData {
  item: ChartDataItem;
  x: number;
  y: number;
}

// 비로그인용 고정 예시 데이터
const generateSampleData = (): DailySolvedResponse => {
  const today = new Date();
  const counts = [2, 3, 1, 2, 3, 3, 1]; // 6일 전 ~ 오늘
  const sampleProblems = [
    { problemId: 1000, title: 'A+B', tier: 1 },
    { problemId: 1003, title: '피보나치 수', tier: 8 },
    { problemId: 1753, title: '최단경로', tier: 12 },
    { problemId: 1260, title: 'DFS와 BFS', tier: 10 },
    { problemId: 2750, title: '수 정렬하기', tier: 6 },
    { problemId: 1920, title: '수 찾기', tier: 9 },
  ];

  const dailySolved: DailySolved[] = counts.map((count, idx) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - idx));
    const dateStr = date.toISOString().split('T')[0];

    const problems: DailySolvedProblem[] = [];
    for (let j = 0; j < count; j++) {
      const sample = sampleProblems[(idx + j) % sampleProblems.length];
      problems.push(sample);
    }

    return { date: dateStr, count, problems };
  });

  return {
    dailySolved,
    totalCount: counts.reduce((sum, c) => sum + c, 0),
  };
};

const SAMPLE_DATA = generateSampleData();

export default function DailySolvedChart({ isAuthenticated, onLoginClick }: DailySolvedChartProps) {
  const [period, setPeriod] = useState<PeriodType>('7d');
  const [initialData, setInitialData] = useState<DailySolvedResponse | null>(null); // 7일 데이터
  const [fullData, setFullData] = useState<DailySolvedResponse | null>(null); // 전체 데이터
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popover, setPopover] = useState<PopoverData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const periodConfig = PERIOD_OPTIONS.find((p) => p.value === period)!;

  // 초기 7일 데이터 로드
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await memberApi.getDailySolved(7);
        setInitialData(response);
      } catch (err) {
        console.error('일별 풀이 현황 로딩 실패:', err);
        setError('데이터를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [isAuthenticated]);

  // 7일 외 다른 기간 선택 시 전체 데이터 로드
  useEffect(() => {
    if (!isAuthenticated || period === '7d' || fullData) return;

    const fetchFullData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await memberApi.getDailySolved(730); // 전체 데이터
        setFullData(response);
      } catch (err) {
        console.error('전체 풀이 현황 로딩 실패:', err);
        setError('데이터를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [isAuthenticated, period, fullData]);

  // 현재 기간에 맞는 데이터 필터링
  const data = useMemo(() => {
    // 비로그인 시 샘플 데이터 사용
    if (!isAuthenticated) {
      return SAMPLE_DATA;
    }

    if (period === '7d') {
      return initialData;
    }
    if (!fullData) return null;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodConfig.days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];

    const filteredSolved = fullData.dailySolved.filter(
      (item) => item.date >= cutoffStr
    );
    const totalCount = filteredSolved.reduce((sum, item) => sum + item.count, 0);

    return {
      dailySolved: filteredSolved,
      totalCount,
    };
  }, [isAuthenticated, period, periodConfig.days, initialData, fullData]);

  // 외부 클릭 시 팝오버 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        chartContainerRef.current &&
        !chartContainerRef.current.contains(event.target as Node)
      ) {
        setPopover(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 기간 변경 시 팝오버 닫기
  useEffect(() => {
    setPopover(null);
  }, [period]);

  const groupedData = useMemo(() => {
    if (!data) return [];
    return groupDataByPeriod(data.dailySolved, period);
  }, [data, period]);

  const chartData: ChartDataItem[] = useMemo(() => {
    return groupedData.map((item) => ({
      ...item,
      label: formatLabel(item.date, period),
      dayName: getDayName(item.date),
      isToday: isToday(item.date),
    }));
  }, [groupedData, period]);

  const maxCount = useMemo(() => {
    return Math.max(...chartData.map((d) => d.count), 1);
  }, [chartData]);

  const showDayName = period === '7d';

  const handleBarHover = (data: ChartDataItem, event: React.MouseEvent) => {
    if (!chartContainerRef.current) return;

    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setPopover({ item: data, x, y });
  };

  const handleBarLeave = () => {
    // 팝오버에 마우스가 있으면 닫지 않음 (약간의 딜레이로 팝오버로 이동 가능하게)
    setTimeout(() => {
      if (popoverRef.current && !popoverRef.current.matches(':hover')) {
        setPopover(null);
      }
    }, 150);
  };

  const renderPopover = () => {
    if (!popover) return null;

    const { item, x, y } = popover;
    const date = new Date(item.date);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const isWeekly = period !== '7d' && period !== '30d';
    const dateLabel = isWeekly
      ? `${month}월 ${day}일 주`
      : `${month}월 ${day}일 (${item.dayName})`;

    const displayProblems = item.problems.slice(0, 5);
    const remainingCount = item.problems.length - 5;

    // 팝오버 위치 조정 (화면 밖으로 나가지 않도록)
    const containerWidth = chartContainerRef.current?.offsetWidth || 300;
    const popoverWidth = isMobile ? 200 : 224;
    const popoverStyle: React.CSSProperties = {
      position: 'absolute',
      left: Math.min(Math.max(x - popoverWidth / 2, 0), containerWidth - popoverWidth),
      top: Math.max(y - (isMobile ? 120 : 150), 10),
      zIndex: 50,
    };

    return (
      <div
        ref={popoverRef}
        className={`bg-white border border-gray-200 rounded-lg shadow-xl p-2 sm:p-3 ${isMobile ? 'w-[200px]' : 'w-56'}`}
        style={popoverStyle}
        onMouseLeave={() => !isMobile && setPopover(null)}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="font-semibold text-gray-900 text-sm sm:text-base">{dateLabel}</div>
          <button
            onClick={() => setPopover(null)}
            className="p-0.5 hover:bg-gray-100 rounded"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
          </button>
        </div>
        <div className="text-xs sm:text-sm text-gray-600 mb-2">{item.count}문제 해결</div>
        {displayProblems.length > 0 && (
          <>
            <div className="border-t border-gray-100 my-1.5 sm:my-2" />
            <div className="space-y-0.5 sm:space-y-1">
              {displayProblems.map((problem) => (
                <a
                  key={problem.problemId}
                  href={`https://boj.kr/${problem.problemId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs sm:text-sm hover:bg-gray-50 rounded px-1 py-0.5 transition-colors group"
                >
                  <span className={`font-medium shrink-0 ${getTierTextColor(problem.tier)}`}>
                    [{getTierShort(problem.tier)}]
                  </span>
                  <span className="text-gray-700 truncate">{problem.title}</span>
                  <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-500 shrink-0" />
                </a>
              ))}
              {remainingCount > 0 && (
                <div className="text-xs text-gray-400 px-1">외 {remainingCount}문제</div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2 relative">
      {/* 비로그인 오버레이 */}
      {!isAuthenticated && (
        <button
          onClick={onLoginClick}
          className="absolute inset-0 z-10 rounded-xl flex flex-col items-center justify-center bg-gray-900/30 cursor-pointer group transition-all hover:bg-gray-900/40"
        >
          <p className="text-xl sm:text-2xl font-bold text-white mb-2">학습 기록을 보려면</p>
          <p className="text-base sm:text-lg text-white/90 group-hover:text-white transition-colors">로그인이 필요해요 →</p>
        </button>
      )}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
        <div className="flex items-center justify-between sm:flex-row">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">최근 활동</h3>
            <NewBadge />
          </div>
          <div className="hidden sm:flex gap-1">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  period === option.value
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {/* 모바일 기간 선택 */}
        <div className="flex sm:hidden gap-1 mt-3 flex-wrap">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                period === option.value
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {error ? (
          <div className="flex items-center justify-center h-44 sm:h-52">
            <p className="text-gray-500 text-sm sm:text-base">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-sm sm:text-base text-gray-700">
                최근 {periodConfig.label}간{' '}
                <span className="font-bold text-blue-600">{data?.totalCount ?? 0}문제</span> 해결
              </span>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
            </div>

            <div className="h-44 sm:h-52 relative" ref={chartContainerRef}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={period}
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                  barCategoryGap={period === '7d' ? '20%' : '10%'}
                >
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={({ x, y, payload }) => {
                      const item = chartData.find((d) => d.label === payload.value);
                      const isCurrentDay = item?.isToday;
                      const baseFontSize = isMobile ? 10 : 12;
                      const smallFontSize = isMobile ? 8 : 10;
                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text
                            x={0}
                            y={0}
                            dy={10}
                            textAnchor="middle"
                            fill={isCurrentDay ? '#3B82F6' : '#6B7280'}
                            fontSize={period === '7d' || period === '30d' ? baseFontSize : smallFontSize}
                            fontWeight={isCurrentDay ? 600 : 400}
                          >
                            {payload.value}
                          </text>
                          {showDayName && (
                            <text
                              x={0}
                              y={0}
                              dy={isMobile ? 22 : 24}
                              textAnchor="middle"
                              fill={isCurrentDay ? '#3B82F6' : '#9CA3AF'}
                              fontSize={isMobile ? 9 : 11}
                              fontWeight={isCurrentDay ? 500 : 400}
                            >
                              {item?.dayName}
                            </text>
                          )}
                        </g>
                      );
                    }}
                    height={showDayName ? (isMobile ? 35 : 40) : (isMobile ? 20 : 25)}
                    interval={period === '30d' ? (isMobile ? 4 : 2) : period === '7d' ? 0 : 'preserveStartEnd'}
                  />
                  <YAxis
                    domain={[0, maxCount + 1]}
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: isMobile ? 10 : 12, fill: '#6B7280' }}
                    width={isMobile ? 20 : 25}
                  />
                  <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    barSize={
                      isMobile
                        ? (period === '7d' ? 24 : period === '30d' ? 10 : 8)
                        : (period === '7d' ? 32 : period === '30d' ? 16 : 12)
                    }
                    isAnimationActive={true}
                    animationDuration={400}
                    animationEasing="ease-out"
                    cursor="pointer"
                    onMouseOver={(data, _index, event) => {
                      handleBarHover(data as unknown as ChartDataItem, event as unknown as React.MouseEvent);
                    }}
                    onMouseLeave={handleBarLeave}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isToday ? '#93C5FD' : '#3B82F6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {renderPopover()}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
