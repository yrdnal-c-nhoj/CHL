/*
  Centralized console filters to reduce noise from known third-party/browser-internal
  logging that is not actionable in this app.
*/

type ConsoleMethod = 'debug' | 'info' | 'warn' | 'error' | 'log';

const shouldSuppress = (msg: string) => {
  // Firefox Glean/NewTabGleanUtils spam (from browser internals, not from this app).
  const patterns = [
    'Reporting Header:',
    'Browser Console Mode',
    'Multiprocess(Slower)',
    'Experiment',
    'unknown featureId',
    'purgeTrackingCookieJars',
    'nsIScriptSecurityManager',
    'createContentPrincipalFromOrigin',
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
    'PushDB',
    'PushService',
    'ServiceWorker for scope',
    'Cookie “_dcid” will soon be rejected',
    'can\'t access property "browsingContext"',
    'NotFoundError: No such JSProcessActor',
    'BrowserToolboxDevToolsProcess',
    'Parent process only(Fast)',
    'TypeError: Response constructor: Response body is given with a null body status',
    'NS_ERROR_NOT_AVAILABLE',
    'NS_ERROR_FAILURE',
    'NS_ERROR_ILLEGAL_VALUE',
    '0x80004005',
    '0x80070057',
    'LinkHandlerParent',
    '0x80040111',
    '[Exception...',
    'FormAutofillParent',
    'createFromField',
    'ExtensionChild',
    '.sys.mjs',
    'email-autocomplete-relay',
    'newtabRefinedCardsLayout',
    'SuggestBackendMerino',
    'DataCloneError',
    'Cross-Origin Request Blocked',
    'Same Origin Policy',
    'izooto.com',
    'decide.dev',
    'addons.webextension',
    'addons.update-checker',
    'browser-customtitlebar.js',
    'js.stripe.com',
    'WebRequestUpload',
    'nsIHttpChannel',
    'ObliviousHTTP',
    'FrecencyBoostProvider',
    'HPKEConfigManager',
    'WallpaperFeed',
    'EssentialDomainsRemoteSettings',
    'SimpleURIUnknownSchemesRemoteObserver',
    'IgnoreLists',
    'AppServicesTracing',
    'SuggestBackendRust',
    'ASRouter',
  ];

  const lowerMsg = msg.toLowerCase();
  if (patterns.some((p) => lowerMsg.includes(p.toLowerCase()))) {
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
              a instanceof Error
                ? `${a.name}: ${a.message}\n${a.stack}`
                : typeof a === 'string'
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
