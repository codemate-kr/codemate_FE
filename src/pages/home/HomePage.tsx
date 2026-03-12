import Layout from '../../components/common/Layout';
import HeroSection from './components/HeroSection';
import usePageMeta from '../../hooks/usePageMeta';

export default function HomePage() {
  usePageMeta({
    description: '알고리즘 스터디와 백준 스터디를 쉽게 관리할 수 있는 CodeMate의 홈입니다. 문제 추천, 팀 운영, 학습 흐름을 한곳에서 확인할 수 있습니다.',
    path: '/',
  });

  return (
    <Layout showFooter fullWidth>
      <HeroSection />
    </Layout>
  );
}
