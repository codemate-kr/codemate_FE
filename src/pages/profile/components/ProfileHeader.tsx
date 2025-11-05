import { User, Check } from 'lucide-react';
import type { MyProfileResponse } from '../../../api/member';

interface ProfileHeaderProps {
  profile: MyProfileResponse;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-100">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <User className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {profile.handle || '미인증'}
            </h2>
            {profile.verified && (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0">
                <Check className="h-3 w-3" />
                인증됨
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs sm:text-sm text-gray-600 truncate">{profile.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
