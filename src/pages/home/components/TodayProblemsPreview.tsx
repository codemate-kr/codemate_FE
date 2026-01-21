import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// macOS 스타일 브라우저 프레임 컴포넌트
function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {/* 브라우저 상단바 */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center">
        {/* 트래픽 라이트 버튼 */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
      </div>
      {/* 브라우저 콘텐츠 */}
      <div className="bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// 모든 이미지를 플랫하게 펼침
const allImages = [
  { src: '/screenshots/dashboard-1.png', caption: '가입한 팀 목록', tabId: 'dashboard' },
  { src: '/screenshots/dashboard-2.png', caption: '오늘의 문제', tabId: 'dashboard' },
  { src: '/screenshots/team-1.png', caption: '오늘의 팀 미션', tabId: 'team' },
  { src: '/screenshots/email.png', caption: '오늘의 미션 알림', tabId: 'email' },
];

const tabs = [
  { id: 'dashboard', title: '내 학습', startIndex: 0 },
  { id: 'team', title: '팀 페이지', startIndex: 2 },
  { id: 'email', title: '이메일', startIndex: 3 },
];

export default function TodayProblemsPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImage = allImages[currentIndex];
  const activeTabIndex = tabs.findIndex(tab => tab.id === currentImage.tabId);

  const handleTabChange = (tabIndex: number) => {
    setCurrentIndex(tabs[tabIndex].startIndex);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // 현재 탭의 이미지들 중 몇 번째인지 계산
  const currentTab = tabs[activeTabIndex];
  const imagesInCurrentTab = allImages.filter(img => img.tabId === currentTab.id);
  const indexInTab = imagesInCurrentTab.findIndex(img => img.src === currentImage.src);
  const hasMultipleImages = imagesInCurrentTab.length > 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">예시</span>
        <span className="text-sm text-gray-500">실제 사용 화면</span>
      </div>

      {/* 탭 */}
      <div className="flex justify-center gap-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              i === activeTabIndex
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* 이미지 */}
      <div className="relative">
        <button
          onClick={goToPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white transition-colors"
          aria-label="이전"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white transition-colors"
          aria-label="다음"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <BrowserFrame>
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
        <p className="text-center text-sm text-gray-500 mt-3">{currentImage.caption}</p>
      </div>

      {/* 인디케이터 (이미지가 여러 개일 때만) */}
      {hasMultipleImages && (
        <div className="flex justify-center gap-2">
          {imagesInCurrentTab.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(currentTab.startIndex + i)}
              className={`h-2 rounded-full transition-all ${
                i === indexInTab ? 'bg-blue-600 w-6' : 'bg-gray-300 w-2'
              }`}
              aria-label={`${i + 1}번 스크린샷`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
