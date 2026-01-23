import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ============ 상수 ============

const IMAGE_DURATION = 4000;
const VIDEO_DURATION = 3500;

interface MediaItem {
  src: string;
  caption: string;
  tabId: string;
  type: 'image' | 'video';
}

const MEDIA_ITEMS: MediaItem[] = [
  { src: '/screenshots/dashboard-1.png', caption: '내 학습', tabId: 'dashboard', type: 'image' },
  { src: '/screenshots/dashboard-2.png', caption: '내 학습 : 최근 활동', tabId: 'dashboard', type: 'image' },
  { src: '/screenshots/team-1.png', caption: '오늘의 팀 미션', tabId: 'team', type: 'image' },
  { src: '/screenshots/team-2.png', caption: '미션 문제 맞춤 설정', tabId: 'team', type: 'image' },
  { src: '/screenshots/team-solving.mp4', caption: '문제 해결 성공', tabId: 'team', type: 'video' },
  { src: '/screenshots/team-unsolving.mp4', caption: '문제 해결 실패', tabId: 'team', type: 'video' },
  { src: '/screenshots/email.png', caption: '오늘의 미션 알림', tabId: 'email', type: 'image' },
];

const TABS = [
  { id: 'dashboard', title: '내 학습' },
  { id: 'team', title: '팀 페이지' },
  { id: 'email', title: '이메일' },
] as const;

// ============ 컴포넌트 ============

function BrowserFrame({ children, progress }: { children: React.ReactNode; progress: number }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white relative">
      <div className="bg-gray-100 border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28C840]" />
        </div>
      </div>
      <div className="bg-white overflow-hidden relative">
        {children}
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

function NavButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev';
  const Icon = isPrev ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={onClick}
      className={`absolute ${isPrev ? 'left-1 sm:left-4' : 'right-1 sm:right-4'} top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white transition-colors`}
      aria-label={isPrev ? '이전' : '다음'}
    >
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
    </button>
  );
}

// ============ 훅 ============

function useIntersectionObserver(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ============ 메인 컴포넌트 ============

export default function ScreenshotGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const elapsedRef = useRef(0);

  const { ref: sectionRef, isVisible } = useIntersectionObserver();

  const currentMedia = MEDIA_ITEMS[currentIndex];
  const currentTabId = currentMedia.tabId;
  const activeTabIndex = TABS.findIndex(tab => tab.id === currentTabId);
  const mediaInCurrentTab = MEDIA_ITEMS.filter(m => m.tabId === currentTabId);
  const indexInTab = mediaInCurrentTab.findIndex(m => m.src === currentMedia.src);
  const duration = currentMedia.type === 'video' ? VIDEO_DURATION : IMAGE_DURATION;

  const goTo = useCallback((index: number) => {
    setProgress(0);
    elapsedRef.current = 0;
    setCurrentIndex(index);
  }, []);

  const goToNext = useCallback(() => {
    goTo(currentIndex === MEDIA_ITEMS.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, goTo]);

  const goToPrev = useCallback(() => {
    goTo(currentIndex === 0 ? MEDIA_ITEMS.length - 1 : currentIndex - 1);
  }, [currentIndex, goTo]);

  const getTabStartIndex = useCallback((tabId: string) => {
    return MEDIA_ITEMS.findIndex(m => m.tabId === tabId);
  }, []);

  // 슬라이드 타이머
  useEffect(() => {
    if (isPaused || !isVisible) return;

    const startTime = Date.now();
    const startElapsed = elapsedRef.current;

    const interval = setInterval(() => {
      const elapsed = startElapsed + (Date.now() - startTime);
      elapsedRef.current = elapsed;
      const percent = (elapsed / duration) * 100;

      if (percent >= 100) {
        goToNext();
      } else {
        setProgress(percent);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, isVisible, duration, goToNext]);

  // 비디오 재생 제어
  useEffect(() => {
    if (currentMedia.type !== 'video') return;
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    if (isVisible) video.play().catch(() => {});

    return () => video.pause();
  }, [currentIndex, currentMedia.type, isVisible]);

  return (
    <div ref={sectionRef} className="space-y-4">
      {/* 헤더 + 탭 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:relative">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-500 text-white text-xs sm:text-sm font-medium rounded">
            예시
          </span>
          <span className="text-sm sm:text-lg text-gray-200">실제 사용 화면</span>
        </div>

        <div className="flex gap-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => goTo(getTabStartIndex(tab.id))}
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

      {/* 갤러리 */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <NavButton direction="prev" onClick={goToPrev} />
        <NavButton direction="next" onClick={goToNext} />

        <BrowserFrame progress={progress}>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {MEDIA_ITEMS.map((media, i) => (
                <div key={media.src} className="w-full flex-shrink-0">
                  {media.type === 'video' ? (
                    <video
                      ref={i === currentIndex ? videoRef : null}
                      src={media.src}
                      className="w-full h-auto"
                      muted
                      playsInline
                      loop
                    />
                  ) : (
                    <img src={media.src} alt={media.caption} className="w-full h-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </BrowserFrame>

        <p className="text-center text-sm sm:text-base text-gray-200 mt-3">{currentMedia.caption}</p>
      </div>

      {/* 페이지네이션 */}
      {mediaInCurrentTab.length > 1 && (
        <div className="flex justify-center gap-2">
          {mediaInCurrentTab.map((media, i) => (
            <button
              key={media.src}
              onClick={() => goTo(getTabStartIndex(currentTabId) + i)}
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
