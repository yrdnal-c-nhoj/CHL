/*
  Centralized console filters to reduce noise from known third-party/browser-internal
  logging that is not actionable in this app.
*/

type ConsoleMethod = 'debug' | 'info' | 'warn' | 'error' | 'log';

const shouldSuppress = (msg: string) => {
  // Firefox Glean/NewTabGleanUtils spam (from browser internals, not from this app).
  const patterns = [
    'Reporting Header: invalid JSON value received',
    'SyntaxError: JSON.parse: expected double-quoted property name',
    'NewTabGleanUtils',
    'RemoteSettingsExperimentLoader',
    'PurgeTrackerService',
    'URLBar - MerinoClient',
    'OpaqueResponseBlocking',
    'Referrer Policy: Ignoring the less restricted referrer policy',
    'Cookie “FPID” has been rejected',
    'Cookie “FPLC” has been rejected',
    'Window.fullScreen attribute is deprecated',
    'NotFoundError: No such JSProcessActor',
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
