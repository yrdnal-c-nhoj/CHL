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
    'purgeTrackingCookieJars',
    'nsIScriptSecurityManager',
    'createContentPrincipalFromOrigin',
    'SearchSuggestionController',
    'SuggestBackendMerino',
    'NetworkGeolocationProvider',
    'NewTabGleanUtils',
    'RemoteSettingsExperimentLoader',
    'nsIFaviconService',
    'after sniff',
    'unexpected string value',
    'invalid JSON value received',
    'PurgeTrackerService',
    'URLBar - MerinoClient',
    'email-autocomplete-relay',
    'newtabRefinedCardsLayout',
    'Referrer Policy:',
    'Cookie “FPID” has been rejected',
    'nimbusStore', // New pattern identified
    'feltPrivacy', // New pattern identified
    'SessionStore', // New pattern identified
    'Cookie “FPLC” has been rejected',
    'ownerGlobal',
    'PictureInPicture.sys.mjs',
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
    'HTTP error',
    'HTTP request timeout',
    '0x80004005',
    '0x80070057',
    'LinkHandlerParent',
    'Cannot attach ID to a tab in a closed window',
    '[Exception...',
    'FormAutofillParent',
    'createFromField',
    'ExtensionChild',
    'DataCloneError: Function object could not be cloned',
    '.sys.mjs',
    'Sync encountered an error',
    'policies.sys.mjs',
    'Cross-Origin Request Blocked',
    'Same Origin Policy',
    'keywee.co',
    'linkedin.com/wa',
    'izooto.com',
    'decide.dev',
    'addons.webextension',
    'browser-customtitlebar.js',
    'parseFormData',
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
    'LinkPreviewChild',
    'Empty string passed to getElementById()',
    'MerinoClient',
    'WindowGlobalParent',
  ];
patterns.push('ext-browser.js');
  patterns.push('unwatchFronts');
  patterns.push('windowGlobalTarget');
  patterns.push('innerWindowId');
  patterns.push('watcher.js');
  patterns.push('JSProcessActor');

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

// Only filter known browser-internal noise on 'debug' and 'info' channels.
  // Never suppress 'warn' or 'error' — those may contain actionable app issues.
  (['debug', 'info'] as ConsoleMethod[]).forEach(
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
