import { useCallback, useEffect, useState } from 'react';

// Chromium's install event isn't in the DOM typings yet
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // iOS home-screen apps
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  // iPadOS reports itself as a Mac
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/**
 * Install support. Chrome/Edge/Android fire `beforeinstallprompt`, which we
 * keep to show our own "Install" button; iOS Safari has no such event, so we
 * explain the Share → Add to Home Screen steps instead.
 */
export const useInstallPrompt = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // we show the prompt from our own UI
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === 'accepted') setInstalled(true);
  }, [deferred]);

  return {
    installed,
    canInstall: !installed && deferred != null,
    /** iPhone/iPad in Safari, not yet on the home screen */
    showIosHint: !installed && isIOS(),
    install,
  };
};

export type InstallState = ReturnType<typeof useInstallPrompt>;
