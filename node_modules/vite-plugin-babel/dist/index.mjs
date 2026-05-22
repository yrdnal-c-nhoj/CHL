import babel from '@babel/core';
import { createFilter } from 'vite';
import fs from 'fs';
import path from 'path';

function testFilter(filter, id) {
  return typeof filter === "function" ? filter(id) : filter.test(id);
}

const esbuildPluginBabel = (options) => ({
  name: "babel",
  setup(build) {
    const { filter = /.*/, namespace = "", config = {}, loader, customFilter } = options;
    const resolveLoader = (args) => {
      if (typeof loader === "function") {
        return loader(args.path);
      }
      return loader;
    };
    const transformContents = async (args, contents) => {
      const babelOptions = babel.loadOptions({
        filename: args.path,
        ...config,
        caller: {
          name: "esbuild-plugin-babel",
          supportsStaticESM: true
        }
      });
      if (!babelOptions) {
        return { contents, loader: resolveLoader(args) };
      }
      if (babelOptions.sourceMaps) {
        babelOptions.sourceFileName = path.relative(process.cwd(), args.path);
      }
      return babel.transformAsync(contents, babelOptions).then((result) => ({
        contents: result?.code ?? "",
        loader: resolveLoader(args)
      }));
    };
    build.onLoad({ filter: /.*/, namespace }, async (args) => {
      const shouldTransform = customFilter(args.path) && testFilter(filter, args.path);
      if (!shouldTransform) return;
      const contents = await fs.promises.readFile(args.path, "utf8");
      return transformContents(args, contents);
    });
  }
});

const DEFAULT_FILTER = /\.jsx?$/;
const babelPlugin = ({
  babelConfig = {},
  filter = DEFAULT_FILTER,
  include,
  exclude,
  apply,
  enforce = "pre",
  loader,
  optimizeOnSSR = false
} = {}) => {
  const customFilter = createFilter(include, exclude);
  const getOptimizeDeps = () => ({
    esbuildOptions: {
      plugins: [
        esbuildPluginBabel({
          config: { ...babelConfig },
          customFilter,
          filter,
          loader
        })
      ]
    }
  });
  let root;
  let babelPartialConfig;
  const getBabelOptions = () => {
    if (babelPartialConfig) return babelPartialConfig.options;
    babelPartialConfig = babel.loadPartialConfig({ cwd: root, root, ...babelConfig });
    return babelPartialConfig?.options ?? {};
  };
  return {
    name: "babel-plugin",
    apply,
    enforce,
    config() {
      return {
        optimizeDeps: getOptimizeDeps(),
        ssr: optimizeOnSSR ? { optimizeDeps: getOptimizeDeps() } : void 0
      };
    },
    configResolved(config) {
      root = config.root;
    },
    transform(code, id) {
      const shouldTransform = customFilter(id) && testFilter(filter, id);
      if (!shouldTransform) return;
      const babelOptions = getBabelOptions();
      return babel.transformAsync(code, { ...babelOptions, filename: id }).then((result) => ({ code: result?.code ?? "", map: result?.map }));
    }
  };
};

export { babelPlugin as default, esbuildPluginBabel };
