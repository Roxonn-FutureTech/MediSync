import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { Snackbar, Button, Alert } from '@mui/material';

export default function PWAUpdater() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Handle PWA install prompt
    const beforeInstallPromptHandler = (e: Event) => {
      // Don't prevent default
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    // Register service worker
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
      onRegistered(r) {
        setRegistration(r);
        if (r) {
          // Enable navigation preload
          r.navigationPreload?.enable().catch(console.error);
        }
      },
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    };
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Send skip waiting message to service worker
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Listen for the controlling service worker changing
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  const handleInstall = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choiceResult = await installPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      } catch (err) {
        console.error('Error during installation:', err);
      } finally {
        setInstallPrompt(null);
      }
    }
  };

  return (
    <>
      <Snackbar
        open={needRefresh}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={handleUpdate}>
              Update
            </Button>
          }
        >
          New version available!
        </Alert>
      </Snackbar>

      <Snackbar
        open={offlineReady}
        autoHideDuration={3000}
        onClose={() => setOfflineReady(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">
          App ready to work offline
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(installPrompt)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={handleInstall}>
              Install
            </Button>
          }
        >
          Install MediSync for better experience
        </Alert>
      </Snackbar>
    </>
  );
} 