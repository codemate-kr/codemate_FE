import { Shield, MessageSquare, Globe, FileText, ChevronDown, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

export default function Footer() {
  const [isLegalMenuOpen, setIsLegalMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지하여 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLegalMenuOpen(false);
      }
    };

    if (isLegalMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLegalMenuOpen]);

  return (
    <footer className="bg-gray-50 border-t border-gray-200 dark:bg-slate-950 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
          {/* 법률 문서 드롭다운 */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setIsLegalMenuOpen(true)}
            onMouseLeave={() => setIsLegalMenuOpen(false)}
          >
            <button
              onClick={() => setIsLegalMenuOpen(!isLegalMenuOpen)}
              className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">법률 정보</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${isLegalMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* 드롭다운 메뉴 */}
            {isLegalMenuOpen && (
              <div className="absolute bottom-full mb-0 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-10 dark:bg-gray-800 dark:border-gray-700">
                <Link
                  to="/terms-of-service"
                  onClick={() => setIsLegalMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>이용약관</span>
                </Link>
                <Link
                  to="/privacy-policy"
                  onClick={() => setIsLegalMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span>개인정보처리방침</span>
                </Link>
              </div>
            )}
          </div>

          <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-700"></div>

          <a
            href="https://forms.gle/F1DsQs64bsWUQXgy6"
            className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">피드백 보내기</span>
          </a>

          <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-700"></div>

          <a
            href="https://blog.naver.com/ryu_eclipse"
            className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">개발자 블로그</span>
          </a>

          <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-700"></div>

          <a
            href="https://github.com/codemate-kr"
            className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">GitHub</span>
          </a>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2025 CodeMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
