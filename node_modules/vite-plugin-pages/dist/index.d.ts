import { Logger, ViteDevServer, Plugin } from 'vite';
import * as debug from 'debug';

/**
 * Promise, or maybe not
 */
type Awaitable<T> = T | PromiseLike<T>;

interface PageRoute {
    path: string;
    route: string;
}
declare class PageContext {
    private _server;
    private _pageRouteMap;
    rawOptions: UserOptions;
    root: string;
    options: ResolvedOptions;
    logger?: Logger;
    constructor(userOptions: UserOptions, viteRoot?: string);
    setLogger(logger: Logger): void;
    setupViteServer(server: ViteDevServer): void;
    setupWatcher(watcher: ViteDevServer['watcher']): void;
    addPage(path: string | string[], pageDir: PageOptions): Promise<void>;
    removePage(path: string): Promise<void>;
    onUpdate(): void;
    resolveRoutes(): Promise<string>;
    searchGlob(): Promise<void>;
    get debug(): {
        hmr: debug.Debugger;
        routeBlock: debug.Debugger;
        options: debug.Debugger;
        pages: debug.Debugger;
        search: debug.Debugger;
        env: debug.Debugger;
        cache: debug.Debugger;
        resolver: debug.Debugger;
    };
    get pageRouteMap(): Map<string, PageRoute>;
}

interface ReactRouteBase {
    caseSensitive?: boolean;
    children?: ReactRouteBase[];
    element?: string;
    index?: boolean;
    path?: string;
    rawRoute: string;
}
interface ReactRoute extends Omit<Optional<ReactRouteBase, 'rawRoute' | 'path'>, 'children'> {
    children?: ReactRoute[];
}
declare function reactResolver(): PageResolver;

interface SolidRouteBase {
    rawRoute: string;
    path: string;
    children?: SolidRouteBase[];
    component?: string;
    element?: string;
}
interface SolidRoute extends Omit<Optional<SolidRouteBase, 'rawRoute' | 'path'>, 'children'> {
    children?: SolidRoute[];
}
declare function solidResolver(): PageResolver;

interface VueRouteBase {
    name: string;
    path: string;
    props?: boolean;
    component: string;
    children?: VueRouteBase[];
    customBlock?: CustomBlock;
    rawRoute: string;
}
interface VueRoute extends Omit<Optional<VueRouteBase, 'rawRoute' | 'name'>, 'children'> {
    children?: VueRoute[];
}
declare function vueResolver(): PageResolver;

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type ImportMode = 'sync' | 'async';
type ImportModeResolver = (filepath: string, pluginOptions: ResolvedOptions) => ImportMode;
interface ParsedJSX {
    value: string;
    loc: {
        start: {
            line: number;
        };
    };
}
type CustomBlock = Record<string, any>;
type InternalPageResolvers = 'vue' | 'react' | 'solid';
interface PageOptions {
    /**
     * Page base directory.
     * @default 'src/pages'
     */
    dir: string;
    /**
     * Page base route.
     */
    baseRoute: string;
    /**
     * Page file pattern.
     * @example `**\/*.page.vue`
     */
    filePattern?: string;
}
interface PageResolver {
    resolveModuleIds: () => string[];
    resolveExtensions: () => string[];
    resolveRoutes: (ctx: PageContext) => Awaitable<string>;
    getComputedRoutes: (ctx: PageContext) => Awaitable<VueRoute[] | ReactRoute[] | SolidRoute[]>;
    stringify?: {
        dynamicImport?: (importPath: string) => string;
        component?: (importName: string) => string;
        final?: (code: string) => string;
    };
    hmr?: {
        added?: (ctx: PageContext, path: string) => Awaitable<void>;
        removed?: (ctx: PageContext, path: string) => Awaitable<void>;
        changed?: (ctx: PageContext, path: string) => Awaitable<void>;
    };
}
/**
 * Plugin options.
 */
interface Options {
    /**
     * Paths to the directory to search for page components.
     * @default 'src/pages'
     */
    dirs: string | (string | PageOptions)[];
    /**
     * Valid file extensions for page components.
     * @default ['vue', 'js']
     */
    extensions: string[];
    /**
     * List of path globs to exclude when resolving pages.
     */
    exclude: string[];
    /**
     * Import routes directly or as async components
     * @default 'root index file => "sync", others => "async"'
     */
    importMode: ImportMode | ImportModeResolver;
    /**
     * Import page components from absolute or relative paths.
     * @default 'relative'
     */
    importPath: 'absolute' | 'relative';
    /**
     * Routing style
     * @default false
     */
    routeStyle: 'next' | 'nuxt' | 'remix';
    /**
     * Separator for generated route names.
     * @default -
     */
    routeNameSeparator: string;
    /**
     * Case for route paths
     * @default false
     */
    caseSensitive: boolean;
    /**
     * Set the default route block parser, or use `<route lang=xxx>` in SFC route block
     * @default 'json5'
     */
    routeBlockLang: 'json5' | 'json' | 'yaml' | 'yml';
    /**
     * Module id for routes import
     * @default '~pages'
     */
    moduleId: string;
    /**
     * Generate React Route
     * @default 'auto detect'
     */
    resolver: InternalPageResolvers | PageResolver;
    /**
     * Extend route records
     */
    extendRoute?: (route: any, parent: any | undefined) => any | void;
    /**
     * Custom generated routes
     */
    onRoutesGenerated?: (routes: any[]) => Awaitable<any[] | void>;
    /**
     * Custom generated client code
     */
    onClientGenerated?: (clientCode: string) => Awaitable<string | void>;
}
type UserOptions = Partial<Options>;
interface ResolvedOptions extends Omit<Options, 'pagesDir' | 'replaceSquareBrackets' | 'nuxtStyle' | 'syncIndex' | 'moduleId'> {
    /**
     * Resolves to the `root` value from Vite config.
     * @default config.root
     */
    root: string;
    /**
     * Resolved page dirs
     */
    dirs: PageOptions[];
    /**
     * Resolved page resolver
     */
    resolver: PageResolver;
    /**
     * RegExp to match extensions
     */
    extensionsRE: RegExp;
    /**
     * Module IDs for routes import
     */
    moduleIds: string[];
}

declare const syncIndexResolver: ImportModeResolver;

declare function pagesPlugin(userOptions?: UserOptions): Plugin;

export { type CustomBlock, type ImportMode, type ImportModeResolver, type InternalPageResolvers, type Optional, PageContext, type PageOptions, type PageResolver, type ParsedJSX, type ReactRoute, type ResolvedOptions, type SolidRoute, type UserOptions, type VueRoute, pagesPlugin as default, reactResolver, solidResolver, syncIndexResolver, vueResolver };
