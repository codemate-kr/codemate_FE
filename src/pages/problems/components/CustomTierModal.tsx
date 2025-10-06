import { useState } from 'react';
import { X, Target, CheckCircle } from 'lucide-react';
import { type SolvedacTier } from '../../../api/teams';

interface CustomTierModalProps {
  onClose: () => void;
  onSelect: (minLevel: number, maxLevel: number) => void;
  currentMinLevel: number | null;
  currentMaxLevel: number | null;
}

export function CustomTierModal({ onClose, onSelect, currentMinLevel, currentMaxLevel }: CustomTierModalProps) {
  const [minTier, setMinTier] = useState<SolvedacTier>(currentMinLevel as SolvedacTier || 1);
  const [maxTier, setMaxTier] = useState<SolvedacTier>(currentMaxLevel as SolvedacTier || 5);

  const getTierName = (tier: SolvedacTier): string => {
    const tierNames = [
      '', 'Bronze 5', 'Bronze 4', 'Bronze 3', 'Bronze 2', 'Bronze 1',
      'Silver 5', 'Silver 4', 'Silver 3', 'Silver 2', 'Silver 1',
      'Gold 5', 'Gold 4', 'Gold 3', 'Gold 2', 'Gold 1',
      'Platinum 5', 'Platinum 4', 'Platinum 3', 'Platinum 2', 'Platinum 1'
    ];
    return tierNames[tier] || `Tier ${tier}`;
  };

  const getTierColor = (tier: SolvedacTier): string => {
    if (tier <= 5) return 'text-orange-600'; // Bronze
    if (tier <= 10) return 'text-gray-600'; // Silver
    if (tier <= 15) return 'text-yellow-600'; // Gold
    return 'text-green-600'; // Platinum
  };

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최소 티어
                </label>
                <select
                  value={minTier}
                  onChange={(e) => setMinTier(Number(e.target.value) as SolvedacTier)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(tier => (
                    <option key={tier} value={tier}>
                      {getTierName(tier as SolvedacTier)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 티어
                </label>
                <select
                  value={maxTier}
                  onChange={(e) => setMaxTier(Number(e.target.value) as SolvedacTier)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(tier => (
                    <option key={tier} value={tier}>
                      {getTierName(tier as SolvedacTier)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">선택된 범위</p>
                  <p>
                    <span className={getTierColor(minTier)}>{getTierName(minTier)}</span>
                    {' ~ '}
                    <span className={getTierColor(maxTier)}>{getTierName(maxTier)}</span>
                  </p>
                </div>
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