import { useEffect } from 'react';
import channelService from '../../services/channelService';
import { useAuthStore } from '../../store/authStore';

export default function ChannelIOInitializer() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const pluginKey = import.meta.env.VITE_CHANNEL_IO_PLUGIN_KEY;

    if (!pluginKey) {
      console.warn('Channel.io plugin key is not configured');
      return;
    }

    // Load Channel.io script
    channelService.loadScript();

    // Boot Channel.io
    const bootOption = {
      pluginKey,
      language: 'ko',
      hideChannelButtonOnBoot: false,
      zIndex: 60, // 채널톡을 가장 위에 배치
    };

    if (isAuthenticated && user?.id) {
      // Boot as authenticated user
      channelService.boot({
        ...bootOption,
        memberId: user.id,
        profile: {
          name: user.handle || user.email || '',
          email: user.email,
        },
      });
    } else {
      // Boot as anonymous user
      channelService.boot(bootOption);
    }
  }, [isAuthenticated, user?.id, user?.handle, user?.email]);

  return null;
}
