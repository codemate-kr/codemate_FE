import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// macOS 스타일 브라우저 프레임 컴포넌트
function BrowserFrame({ children, progress = 0 }: { children: React.ReactNode; progress?: number }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white relative">
      {/* 브라우저 상단바 */}
      <div className="bg-gray-100 border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center">
        {/* 트래픽 라이트 버튼 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28C840]" />
        </div>
      </div>
      {/* 브라우저 콘텐츠 */}
      <div className="bg-white overflow-hidden relative">
        {children}
        {/* 프로그레스 바 (스크린샷 위, 프레임 아래) */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent">
          <div
            className="h-full bg-blue-500 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// 모든 이미지를 플랫하게 펼침
const allImages = [
  { src: '/screenshots/dashboard-1.png', caption: '내 학습', tabId: 'dashboard' },
  { src: '/screenshots/dashboard-2.png', caption: '내 학습 : 최근 활동', tabId: 'dashboard' },
  { src: '/screenshots/team-1.png', caption: '오늘의 팀 미션', tabId: 'team' },
  { src: '/screenshots/team-2.png', caption: '미션 문제 맞춤 설정', tabId: 'team' },
  { src: '/screenshots/email.png', caption: '오늘의 미션 알림', tabId: 'email' },
];

const tabs = [
  { id: 'dashboard', title: '내 학습', startIndex: 0 },
  { id: 'team', title: '팀 페이지', startIndex: 2 },
  { id: 'email', title: '이메일', startIndex: 4 },
];

const AUTO_SLIDE_INTERVAL = 4000; // 4초마다 자동 전환

export default function TodayProblemsPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const currentImage = allImages[currentIndex];
  const activeTabIndex = tabs.findIndex(tab => tab.id === currentImage.tabId);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    setProgress(0);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleTabChange = (tabIndex: number) => {
    setCurrentIndex(tabs[tabIndex].startIndex);
    setProgress(0);
  };

  // 화면에 보이는지 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 } // 30% 이상 보일 때 활성화
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (isPaused || !isVisible) return;

    const timer = setInterval(goToNext, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, isVisible, goToNext]);

  // 프로그레스 바 애니메이션
  useEffect(() => {
    if (isPaused || !isVisible) return;

    const interval = 50; // 50ms마다 업데이트
    const step = (interval / AUTO_SLIDE_INTERVAL) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + step, 100));
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, isVisible, currentIndex]);

  // 현재 탭의 이미지들 중 몇 번째인지 계산
  const currentTab = tabs[activeTabIndex];
  const imagesInCurrentTab = allImages.filter(img => img.tabId === currentTab.id);
  const indexInTab = imagesInCurrentTab.findIndex(img => img.src === currentImage.src);
  const hasMultipleImages = imagesInCurrentTab.length > 1;

  return (
    <div ref={sectionRef} className="space-y-4">
      {/* 라벨 + 탭 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:relative">
        {/* 라벨 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-500 text-white text-xs sm:text-sm font-medium rounded">예시</span>
          <span className="text-sm sm:text-lg text-gray-200">실제 사용 화면</span>
        </div>

        {/* 탭: 모바일에서는 라벨 아래, 데스크탑에서는 중앙 */}
        <div className="flex gap-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(i)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                i === activeTabIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* 이미지 */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <button
          onClick={goToPrev}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white transition-colors"
          aria-label="이전"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white transition-colors"
          aria-label="다음"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <BrowserFrame progress={progress}>
          <div ref={containerRef} className="relative">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {allImages.map((image, i) => (
                <div key={i} className="w-full flex-shrink-0">
                  <img
                    src={image.src}
                    alt={image.caption}
                    className="w-full h-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden bg-gray-100 p-16 text-center">
                    <p className="text-gray-400 text-sm">스크린샷을 준비 중입니다</p>
                    <p className="text-gray-400 text-xs mt-1">{image.src}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BrowserFrame>

        {/* 캡션 */}
        <p className="text-center text-sm sm:text-base text-gray-200 mt-3">{currentImage.caption}</p>
      </div>

      {/* 인디케이터 (이미지가 여러 개일 때만) */}
      {hasMultipleImages && (
        <div className="flex justify-center gap-2">
          {imagesInCurrentTab.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(currentTab.startIndex + i);
                setProgress(0);
              }}
              className={`h-2 rounded-full transition-all ${
                i === indexInTab ? 'bg-blue-500 w-6' : 'bg-gray-600 w-2'
              }`}
              aria-label={`${i + 1}번 스크린샷`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
