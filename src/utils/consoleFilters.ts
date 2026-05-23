/*
  Centralized console filters to reduce noise from known third-party/browser-internal
  logging that is not actionable in this app.
*/

type ConsoleMethod = 'debug' | 'info' | 'warn' | 'error' | 'log';

const shouldSuppress = (msg: string) => {
  // Firefox Glean/NewTabGleanUtils spam (from browser internals, not from this app).
  const patterns = [
    'Reporting Header: invalid JSON value received',
    'Browser Console Mode',
    'Parent process only(Fast)',
    'Multiprocess(Slower)',
    'Experiment',
    'SearchSuggestionController',
    'NewTabGleanUtils',
    'RemoteSettingsExperimentLoader',
    'PurgeTrackerService',
    'URLBar - MerinoClient',
    'OpaqueResponseBlocking',
    'Referrer Policy:',
    'Cookie “FPID” has been rejected',
    'Cookie “FPLC” has been rejected',
    'ownerGlobal',
    'Window.fullScreen',
    'NotFoundError: No such JSProcessActor',
    'BrowserToolboxDevToolsProcess',
    'ly(Fast)',
    'Multiprocess(Slower)',
    'TypeError: Response constructor: Response body is given with a null body status',
  ];

  if (patterns.some((p) => msg.includes(p))) {
    return true;
  }
  return false;
};

let installed = false;

export function installConsoleFilters() {
  if (installed) return;
  installed = true;

  (['debug', 'info', 'warn', 'error', 'log'] as ConsoleMethod[]).forEach(
    (method) => {
      const original = console[method];
      console[method] = (...args: unknown[]) => {
        try {
          const joined = args
            .map((a) =>
              typeof a === 'string'
                ? a
                : (() => {
                    try {
                      return JSON.stringify(a);
                    } catch {
                      return String(a);
                    }
                  })(),
            )
            .join(' ');

          if (shouldSuppress(joined)) return;
        } catch {
          // Never block logging due to filter failure.
        }

        original.apply(console, args as any);
      };
    },
  );
}
