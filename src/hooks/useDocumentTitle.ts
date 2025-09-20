import { useEffect } from 'react';
import { env } from '../config/env';

const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    const baseTitle = env.APP_TITLE;
    const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;

    document.title = fullTitle;

    // 컴포넌트 언마운트 시 기본 타이틀로 복원
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};

export default useDocumentTitle;