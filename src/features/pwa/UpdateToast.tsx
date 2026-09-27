import { useEffect } from 'react';
import { CloudDownload, RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Toast } from '../../components/Toast';

const UPDATE_CHECK_MS = 60 * 60 * 1000;

/**
 * Registers the service worker. When a new version is deployed it waits for
 * the user to tap "Reload" (no surprise reloads mid-use); the first install
 * shows a short "ready offline" note.
 */
const UpdateToast = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Long-lived installed apps rarely navigate, so poll for new versions
      if (registration) setInterval(() => registration.update(), UPDATE_CHECK_MS);
    },
  });

  useEffect(() => {
    if (!offlineReady) return;
    const id = setTimeout(() => setOfflineReady(false), 5000);
    return () => clearTimeout(id);
  }, [offlineReady, setOfflineReady]);

  if (needRefresh) {
    return (
      <Toast
        icon={<RefreshCw size={18} />}
        action={{ label: 'Reload', onClick: () => updateServiceWorker(true) }}
        onDismiss={() => setNeedRefresh(false)}
      >
        A new version of Weatherly is available.
      </Toast>
    );
  }

  if (offlineReady) {
    return (
      <Toast icon={<CloudDownload size={18} />} onDismiss={() => setOfflineReady(false)}>
        Weatherly is ready to work offline.
      </Toast>
    );
  }

  return null;
};

export default UpdateToast;
