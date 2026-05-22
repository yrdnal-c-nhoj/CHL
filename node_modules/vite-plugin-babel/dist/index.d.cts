import { TransformOptions } from '@babel/core';
import { Loader, Plugin } from 'esbuild';
import { Plugin as Plugin$1, FilterPattern } from 'vite';

type Filter = ((id: string) => boolean) | RegExp;

/**
 * Original: https://github.com/nativew/esbuild-plugin-babel
 * Copied and customized, because there was a problem with `type: "module"` in `package.json`
 */
interface ESBuildPluginBabelOptions {
    config?: TransformOptions;
    filter?: Filter;
    customFilter: (id: unknown) => boolean;
    namespace?: string;
    loader?: Loader | ((path: string) => Loader);
}
declare const esbuildPluginBabel: (options: ESBuildPluginBabelOptions) => Plugin;

interface BabelPluginOptions {
    apply?: Plugin$1['apply'];
    enforce?: Plugin$1['enforce'];
    babelConfig?: TransformOptions;
    filter?: Filter;
    include?: FilterPattern;
    exclude?: FilterPattern;
    loader?: Loader | ((path: string) => Loader);
    optimizeOnSSR?: boolean;
}
declare const babelPlugin: ({ babelConfig, filter, include, exclude, apply, enforce, loader, optimizeOnSSR, }?: BabelPluginOptions) => Plugin$1;

export { babelPlugin as default, esbuildPluginBabel };
export type { BabelPluginOptions, ESBuildPluginBabelOptions, Filter };
