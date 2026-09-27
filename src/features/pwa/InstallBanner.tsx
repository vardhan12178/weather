import { useState } from 'react';
import { Share, Smartphone } from 'lucide-react';
import { Toast } from '../../components/Toast';
import { readJson, STORAGE_KEYS, writeJson } from '../../lib/storage';
import type { InstallState } from './useInstallPrompt';

/** One-time, dismissible suggestion to install the app (also available in Settings). */
const InstallBanner = ({ install }: { install: InstallState }) => {
  const [dismissed, setDismissed] = useState(() => readJson(STORAGE_KEYS.installDismissed, false));

  if (dismissed || (!install.canInstall && !install.showIosHint)) return null;

  const dismiss = () => {
    setDismissed(true);
    writeJson(STORAGE_KEYS.installDismissed, true);
  };

  if (install.canInstall) {
    return (
      <Toast icon={<Smartphone size={18} />} action={{ label: 'Install', onClick: install.install }} onDismiss={dismiss}>
        Install Weatherly for quick access, even offline.
      </Toast>
    );
  }

  return (
    <Toast icon={<Share size={18} />} onDismiss={dismiss}>
      Add Weatherly to your Home Screen: tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.
    </Toast>
  );
};

export default InstallBanner;
