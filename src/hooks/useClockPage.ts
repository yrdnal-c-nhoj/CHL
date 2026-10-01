import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { getClockImport } from '@/clock/clockRegistry';
import { preloadAssets } from '@/utils/assetLoader';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; Clock: ComponentType }
  | { status: 'error'; message: string };

const VIDEO = /\.(mp4|webm|ogg)$/i;

async function preloadWithTimeout(urls: string[], ms = 5000) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<void>((resolve) => {
    timer = setTimeout(resolve, ms);
  });
  try {
    await Promise.race([preloadAssets(urls.map((src) => ({ src }))), timeout]);
  } catch (err) {
    console.warn('[useClockPage] Preload failed:', err);
  } finally {
    clearTimeout(timer);
  }
}

export function useClockPage(date: string | undefined) {
  const [state, setState] = useState<State>(() =>
    date ? { status: 'loading' } : { status: 'idle' },
  );

  useEffect(() => {
    if (!date) {
      setState({ status: 'idle' });
      return;
    }
    let cancelled = false;
    setState({ status: 'loading' });

    (async () => {
      const importFn = getClockImport(date.trim());
      if (!importFn) {
        setState({ status: 'error', message: `No clock exists for ${date}.` });
        return;
      }
      try {
        const mod = await importFn();
        if (cancelled) return;
        if (!mod.default) throw new Error('Missing default export.');

        const urls = Array.isArray(mod.assets)
          ? mod.assets.filter((a): a is string => typeof a === 'string')
          : [];
        const toPreload =
          urls.length > 1 ? urls.filter((u) => !VIDEO.test(u)) : urls;
        if (toPreload.length) await preloadWithTimeout(toPreload);

        if (!cancelled) setState({ status: 'ready', Clock: mod.default });
      } catch (err) {
        if (cancelled) return;
        console.error(`[useClockPage] ${date}:`, err);
        setState({
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown loading error',
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [date]);

  return {
    ClockComponent: state.status === 'ready' ? state.Clock : null,
    isReady: state.status === 'ready',
    error: state.status === 'error' ? state.message : null,
    overlayVisible: state.status === 'loading',
  };
}