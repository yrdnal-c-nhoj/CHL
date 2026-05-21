/*
  Centralized console filters to reduce noise from known third-party/browser-internal
  logging that is not actionable in this app.
*/

type ConsoleMethod = 'debug' | 'info' | 'warn' | 'error' | 'log';

const shouldSuppress = (msg: string) => {
  // Firefox Glean/NewTabGleanUtils spam (from browser internals, not from this app).
  if (
    msg.includes('Reporting Header: invalid JSON value received. collect') ||
    msg.includes('Reporting Header: invalid JSON value received') ||
    msg.includes(
      'SyntaxError: JSON.parse: expected double-quoted property name',
    )
  ) {
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
