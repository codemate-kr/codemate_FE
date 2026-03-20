import { useMemo, useState } from 'react';
import { Eye, PenSquare, List, Megaphone } from 'lucide-react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

interface PreviewPost {
  id: number;
  title: string;
  oneLine: string;
  host: string;
  linkedTeamName: string;
  linkedTeamId: number;
  targetTier: string;
  body: string;
}

const previewPosts: PreviewPost[] = [
  {
    id: 1,
    title: '1일1백준 스터디',
    oneLine: '매일 백준 1문제 인증하는 기본 스터디입니다.',
    host: 'codemate_admin',
    linkedTeamName: '1일1백준 인증팀',
    linkedTeamId: 65535,
    targetTier: '실버 2 ~ 골드 4',
    body: '## 스터디 소개\n매일 백준 1문제를 꾸준히 풀며 실력을 올리는 스터디입니다.\n\n### 진행 방식\n- 평일: 1일 1문제 풀이\n- 일요일: 주간 회고 + 풀이 공유\n\n### 참여 안내\n- 결석 없이 꾸준히 참여할 분\n- 풀이 아이디어를 간단히 공유할 분',
  },
  {
    id: 2,
    title: '1일1골드 스터디',
    oneLine: '골드 난이도 문제를 하루 1개씩 꾸준히 푸는 스터디입니다.',
    host: 'ryu',
    linkedTeamName: '1일1골드 도전팀',
    linkedTeamId: 1024,
    targetTier: '골드 5 ~ 플래티넘 5',
    body: '## 스터디 목표\n골드 난이도 문제를 하루 1개씩 풀이하고 핵심 아이디어를 기록합니다.\n\n### 체크리스트\n- [ ] 문제 접근 방식 요약\n- [ ] 시간복잡도 분석\n- [ ] 반례 1개 이상 작성\n\n### 참여 가이드\n- 주 5회 문제 풀이\n- 주 1회 풀이 공유',
  },
  {
    id: 3,
    title: '코테 준비 스터디',
    oneLine: '코딩테스트 대비를 위해 자주 나오는 유형을 함께 공부합니다.',
    host: 'alice',
    linkedTeamName: '코테 준비 A팀',
    linkedTeamId: 8192,
    targetTier: '골드 3 ~ 플래티넘 5',
    body: '## 코테 준비 스터디\n코딩테스트 빈출 유형 위주로 문제를 선정해 풀이합니다.\n\n### 커리큘럼\n1. 구현 / 시뮬레이션\n2. 그래프 (BFS, 다익스트라)\n3. DP 기본\n\n> 매주 토요일 모의 테스트 1회 진행',
  },
];

interface DraftPostForm {
  title: string;
  difficulty: string;
  linkedTeamId: string;
}

interface InlineContentLike {
  text?: string;
  content?: InlineContentLike[];
}

interface BlockLike {
  type?: string;
  props?: {
    level?: number;
    checked?: boolean;
    language?: string;
  };
  content?: InlineContentLike[];
  children?: BlockLike[];
}

interface MyTeamOption {
  id: number;
  name: string;
}

const myTeamOptions: MyTeamOption[] = [
  { id: 65535, name: '1일1백준 인증팀' },
  { id: 1024, name: '1일1골드 도전팀' },
  { id: 8192, name: '코테 준비 A팀' },
];

const initialDraftForm: DraftPostForm = {
  title: '1일1백준 스터디',
  difficulty: '실버 2 ~ 골드 4',
  linkedTeamId: '65535',
};

const extractInlineText = (contents?: InlineContentLike[]): string => {
  if (!contents || contents.length === 0) return '';
  return contents
    .map((item) => {
      const selfText = item.text ?? '';
      const childText = extractInlineText(item.content);
      return `${selfText}${childText}`;
    })
    .join('')
    .trim();
};

const blockToMarkdownLine = (block: BlockLike, index: number, depth: number): string => {
  const indent = '  '.repeat(depth);
  const text = extractInlineText(block.content);
  const type = block.type ?? 'paragraph';

  if (type === 'heading') {
    const level = Math.min(6, Math.max(1, block.props?.level ?? 2));
    return `${'#'.repeat(level)} ${text}`.trim();
  }

  if (type === 'bulletListItem') {
    return `${indent}- ${text}`.trimEnd();
  }

  if (type === 'numberedListItem') {
    return `${indent}${index + 1}. ${text}`.trimEnd();
  }

  if (type === 'checkListItem') {
    const checked = block.props?.checked ? 'x' : ' ';
    return `${indent}- [${checked}] ${text}`.trimEnd();
  }

  if (type === 'quote') {
    return `${indent}> ${text}`.trimEnd();
  }

  return `${indent}${text}`.trimEnd();
};

const serializeBlocksToMarkdown = (blocks: BlockLike[], depth: number = 0): string => {
  const lines: string[] = [];

  blocks.forEach((block, index) => {
    const line = blockToMarkdownLine(block, index, depth);
    if (line.trim()) {
      lines.push(line);
    }

    if (block.children && block.children.length > 0) {
      const childMarkdown = serializeBlocksToMarkdown(block.children, depth + 1);
      if (childMarkdown.trim()) {
        lines.push(childMarkdown);
      }
    }
  });

  return lines.join('\n\n').trim();
};

const summarizeFirstLine = (markdown: string): string => {
  const firstMeaningful = markdown.split('\n').find((line) => line.trim().length > 0) ?? '';
  return firstMeaningful
    .replace(/^#{1,6}\s+/, '')
    .replace(/^[-*+]\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/^-\s\[[ xX]\]\s+/, '')
    .replace(/^>\s+/, '')
    .trim();
};

export default function BoardPreviewLab() {
  const [posts, setPosts] = useState<PreviewPost[]>(previewPosts);
  const [mode, setMode] = useState<'browse' | 'write'>('browse');
  const [selectedPostId, setSelectedPostId] = useState<number>(previewPosts[0].id);
  const [draftForm, setDraftForm] = useState<DraftPostForm>(initialDraftForm);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? posts[0],
    [selectedPostId, posts],
  );

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: 'paragraph',
        content: '',
      },
    ],
    placeholders: {
      emptyDocument: "명령어를 사용하려면 '/'를 입력하세요.",
      default: "명령어를 사용하려면 '/'를 입력하세요.",
    },
  });

  const handleDraftFieldChange = (field: keyof DraftPostForm, value: string) => {
    setDraftForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadPreview = () => {
    const title = draftForm.title.trim();
    const linkedTeamId = Number(draftForm.linkedTeamId.trim());
    const selectedTeam = myTeamOptions.find((team) => team.id === linkedTeamId);
    const body = serializeBlocksToMarkdown(editor.document as unknown as BlockLike[]);

    if (!title || Number.isNaN(linkedTeamId) || !selectedTeam) {
      toast.error('제목, 난이도, 연결 팀을 확인해주세요.');
      return;
    }

    if (!body) {
      toast.error('본문을 작성해주세요.');
      return;
    }

    const nextId = Math.max(...posts.map((post) => post.id)) + 1;
    const oneLine = summarizeFirstLine(body) || '스터디 모집글입니다.';

    const createdPost: PreviewPost = {
      id: nextId,
      title,
      oneLine,
      host: 'me',
      linkedTeamName: selectedTeam.name,
      linkedTeamId,
      targetTier: draftForm.difficulty.trim() || '미정',
      body,
    };

    setPosts((prev) => [createdPost, ...prev]);
    setSelectedPostId(createdPost.id);
    setMode('browse');
    setDraftForm(initialDraftForm);
    toast.success('로컬 프리뷰 게시글로 업로드되었습니다. (새로고침 시 초기화)');
  };

  const handleEditorContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('[contenteditable="true"], .bn-editor, .ProseMirror')) {
      return;
    }

    requestAnimationFrame(() => {
      editor.focus();
    });
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">스터디 홍보게시판 프리뷰</h2>
          <p className="text-sm text-gray-600">모집글 목록, 상세 보기, 작성 흐름을 한 화면에서 검증합니다.</p>
        </div>

        <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setMode('browse')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === 'browse' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="h-4 w-4" />
            둘러보기
          </button>
          <button
            onClick={() => setMode('write')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === 'write' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PenSquare className="h-4 w-4" />
            작성
          </button>
        </div>
      </div>

      {mode === 'browse' ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700 flex items-center gap-2">
              <List className="h-4 w-4" />
              모집글 목록
            </div>
            <div className="divide-y divide-gray-100">
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    selectedPostId === post.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">{post.title}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{post.oneLine}</p>
                </button>
              ))}
            </div>
          </div>

          <article className="lg:col-span-3 rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{selectedPost.title}</h3>
                <p className="text-xs text-gray-500 mt-1">운영자 {selectedPost.host}</p>
              </div>
              <Megaphone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="rounded-lg bg-white border border-blue-200 px-3 py-3 mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] text-blue-600 mb-1">연결된 팀</p>
                <p className="text-sm font-semibold text-gray-900">{selectedPost.linkedTeamName}</p>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                팀 상세 보기 #{selectedPost.linkedTeamId}
              </button>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 mb-4">
              <p className="text-[11px] text-blue-600 mb-1">권장 대상 티어</p>
              <p className="text-sm font-semibold text-blue-900">{selectedPost.targetTier}</p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => <h1 className="text-lg font-bold text-gray-900 mt-4 mb-2 first:mt-0" {...props} />,
                  h2: ({ ...props }) => <h2 className="text-base font-bold text-gray-900 mt-4 mb-2 first:mt-0" {...props} />,
                  h3: ({ ...props }) => <h3 className="text-sm font-semibold text-gray-900 mt-3 mb-1.5" {...props} />,
                  p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                  blockquote: ({ ...props }) => <blockquote className="border-l-4 border-blue-200 pl-3 text-gray-600 my-2" {...props} />,
                  code: ({ className, children, ...props }) => {
                    const isBlock = Boolean(className);
                    if (!isBlock) {
                      return (
                        <code className="px-1 py-0.5 rounded bg-gray-200 text-gray-800 text-[13px]" {...props}>
                          {children}
                        </code>
                      );
                    }

                    return (
                      <code
                        className="block w-full overflow-x-auto rounded-lg bg-gray-900 text-gray-100 p-3 text-[13px] leading-6"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {selectedPost.body}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={draftForm.title}
                onChange={(e) => handleDraftFieldChange('title', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="스터디 제목"
              />
              <input
                type="text"
                value={draftForm.difficulty}
                onChange={(e) => handleDraftFieldChange('difficulty', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="대상 티어 (예: 실버3~골드2, 골드 이상)"
              />
            </div>
            <select
              value={draftForm.linkedTeamId}
              onChange={(e) => handleDraftFieldChange('linkedTeamId', e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {myTeamOptions.map((team) => (
                <option key={team.id} value={team.id.toString()}>
                  {team.name} #{team.id}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDraftForm(initialDraftForm)}
                className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                초기화
              </button>
              <button
                type="button"
                onClick={handleUploadPreview}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                업로드 (로컬)
              </button>
            </div>
          </div>
          <div
            className="min-h-[420px] p-2 sm:p-4 cursor-text"
            onClick={handleEditorContainerClick}
          >
            <BlockNoteView editor={editor} />
          </div>
        </div>
      )}
    </section>
  );
}
