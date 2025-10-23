import { Shield, MessageSquare, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <Link
            to="/privacy-policy"
            className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">개인정보처리방침</span>
          </Link>

          <div className="hidden sm:block w-px h-4 bg-gray-300"></div>

          <a
            href="https://forms.gle/F1DsQs64bsWUQXgy6"
            className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">피드백 보내기</span>
          </a>

          <div className="hidden sm:block w-px h-4 bg-gray-300"></div>

          <a
            href="https://blog.naver.com/ryu_eclipse"
            className="group flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">개발자 블로그</span>
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 CodeMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
