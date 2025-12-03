import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { type SolvedacTier } from '../../../api/teams';
import { getTierName } from '../../../utils/tierUtils';

// 미리 생성된 30개 티어 아이콘 풀
const TIER_ICONS = Array.from({ length: 30 }, (_, i) => i + 1);

// 티어 아이콘 풀에서 특정 레벨만 보이게 표시
function TierIconPool({ visibleLevel, size }: { visibleLevel: number; size: number }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      {TIER_ICONS.map((level) => (
        <img
          key={level}
          src={`/tier/${level}.svg`}
          alt={getTierName(level)}
          width={size}
          height={size}
          className={`absolute inset-0 ${level === visibleLevel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        />
      ))}
    </span>
  );
}

interface CustomTierModalProps {
  onClose: () => void;
  onSelect: (minLevel: number, maxLevel: number) => void;
  currentMinLevel: number | null;
  currentMaxLevel: number | null;
}

export function CustomTierModal({ onClose, onSelect, currentMinLevel, currentMaxLevel }: CustomTierModalProps) {
  const [minTier, setMinTier] = useState<SolvedacTier>(currentMinLevel as SolvedacTier || 1);
  const [maxTier, setMaxTier] = useState<SolvedacTier>(currentMaxLevel as SolvedacTier || 20);

  const handleConfirm = () => {
    if (minTier > maxTier) {
      alert('최소 티어는 최대 티어보다 낮거나 같아야 합니다.');
      return;
    }
    onSelect(minTier, maxTier);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-[60] flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">커스텀 난이도 설정</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  티어 범위 선택
                </label>
                <div className="flex items-center gap-2">
                  <TierIconPool visibleLevel={minTier} size={20} />
                  <span className="text-gray-400 text-m">~</span>
                  <TierIconPool visibleLevel={maxTier} size={20} />
                </div>
              </div>

              <div className="relative pt-2 pb-12">
                {/* 배경 트랙 */}
                <div className="absolute top-2 left-0 right-0 h-2 bg-gray-200 rounded-lg"></div>

                {/* 눈금 표시 (브5, 실5, 골5, 플5, 다5, 루5) */}
                {[1, 6, 11, 16, 21, 26].map((tier) => (
                  <div
                    key={tier}
                    className="absolute top-0 w-0.5 h-6 bg-gray-300"
                    style={{
                      left: `${((tier - 1) / 29) * 100}%`,
                      transform: 'translateX(-1px)'
                    }}
                  ></div>
                ))}

                {/* 선택된 범위 표시 */}
                <div
                  className="absolute top-2 h-2 bg-blue-500 rounded-lg"
                  style={{
                    left: `${((minTier - 1) / 29) * 100}%`,
                    right: `${((30 - maxTier) / 29) * 100}%`
                  }}
                ></div>

                {/* 최소 티어 슬라이더 */}
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={minTier}
                  onChange={(e) => {
                    const newMin = Number(e.target.value) as SolvedacTier;
                    if (newMin <= maxTier) {
                      setMinTier(newMin);
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-6 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                  style={{ zIndex: minTier > maxTier - 5 ? 5 : 3 }}
                />

                {/* 최대 티어 슬라이더 */}
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={maxTier}
                  onChange={(e) => {
                    const newMax = Number(e.target.value) as SolvedacTier;
                    if (newMax >= minTier) {
                      setMaxTier(newMax);
                    }
                  }}
                  className="absolute top-0 left-0 w-full h-6 appearance-none bg-transparent cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                  style={{ zIndex: 4 }}
                />

                {/* 티어 아이콘 레이블 */}
                {[1, 6, 11, 16, 21, 26].map((tier) => (
                  <div
                    key={tier}
                    className="absolute top-10 flex items-center justify-center"
                    style={{
                      left: `${((tier - 1) / 29) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <img src={`/tier/${tier}.svg`} alt={getTierName(tier)} width={12} height={12} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>확인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}