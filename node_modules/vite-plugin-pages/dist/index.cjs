"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  PageContext: () => PageContext,
  default: () => index_default,
  reactResolver: () => reactResolver,
  solidResolver: () => solidResolver,
  syncIndexResolver: () => syncIndexResolver,
  vueResolver: () => vueResolver
});
module.exports = __toCommonJS(index_exports);

// src/constants.ts
var MODULE_IDS = [
  "~pages",
  "~react-pages",
  "~solid-pages",
  "pages-generated",
  "virtual:generated-pages",
  "virtual:generated-pages-react"
];
var MODULE_ID_VIRTUAL = "virtual:vite-plugin-pages/generated-pages";
var ROUTE_BLOCK_ID_VIRTUAL = "virtual:vite-plugin-pages/route-block";
var ROUTE_IMPORT_NAME = "__pages_import_$1__";
var routeBlockQueryRE = /\?vue&type=route/;
var dynamicRouteRE = /^\[(.+)\]$/;
var cacheAllRouteRE = /^\[\.{3}(.*)\]$/;
var replaceDynamicRouteRE = /^\[(?:\.{3})?(.*)\]$/;
var nuxtDynamicRouteRE = /^_(.*)$/;
var nuxtCacheAllRouteRE = /^_$/;
var countSlashRE = /\//g;
var replaceIndexRE = /\/?index$/;

// src/context.ts
var import_node_path4 = require("path");
var import_node_process2 = __toESM(require("process"), 1);

// node_modules/.pnpm/@antfu+utils@9.3.0/node_modules/@antfu/utils/dist/index.mjs
function toArray(array) {
  array = array != null ? array : [];
  return Array.isArray(array) ? array : [array];
}
function slash(str) {
  return str.replace(/\\/g, "/");
}

// src/files.ts
var import_node_path2 = require("path");
var import_tinyglobby = require("tinyglobby");

// src/utils.ts
var import_node_path = require("path");
var import_node_url = require("url");
var import_debug = __toESM(require("debug"), 1);
var import_micromatch = __toESM(require("micromatch"), 1);
var debug = {
  hmr: (0, import_debug.default)("vite-plugin-pages:hmr"),
  routeBlock: (0, import_debug.default)("vite-plugin-pages:routeBlock"),
  options: (0, import_debug.default)("vite-plugin-pages:options"),
  pages: (0, import_debug.default)("vite-plugin-pages:pages"),
  search: (0, import_debug.default)("vite-plugin-pages:search"),
  env: (0, import_debug.default)("vite-plugin-pages:env"),
  cache: (0, import_debug.default)("vite-plugin-pages:cache"),
  resolver: (0, import_debug.default)("vite-plugin-pages:resolver")
};
function extsToGlob(extensions) {
  return extensions.length > 1 ? `{${extensions.join(",")}}` : extensions[0] || "";
}
function countSlash(value) {
  return (value.match(countSlashRE) || []).length;
}
function isPagesDir(path, options) {
  for (const page of options.dirs) {
    const dirPath = slash((0, import_node_path.resolve)(options.root, page.dir));
    if (path.startsWith(dirPath))
      return true;
  }
  return false;
}
function isTarget(path, options) {
  return isPagesDir(path, options) && !import_micromatch.default.isMatch(path, options.exclude) && options.extensionsRE.test(path);
}
function isDynamicRoute(routePath, nuxtStyle = false) {
  return nuxtStyle ? nuxtDynamicRouteRE.test(routePath) : dynamicRouteRE.test(routePath);
}
function isCatchAllRoute(routePath, nuxtStyle = false) {
  return nuxtStyle ? nuxtCacheAllRouteRE.test(routePath) : cacheAllRouteRE.test(routePath);
}
function resolveImportMode(filepath, options) {
  const mode = options.importMode;
  if (typeof mode === "function")
    return mode(filepath, options);
  return mode;
}
function invalidatePagesModule(server) {
  const { moduleGraph } = server;
  const mods = moduleGraph.getModulesByFile(MODULE_ID_VIRTUAL);
  if (mods) {
    const seen = /* @__PURE__ */ new Set();
    mods.forEach((mod) => {
      moduleGraph.invalidateModule(mod, seen);
    });
  }
}
function normalizeCase(str, caseSensitive) {
  if (!caseSensitive)
    return str.toLocaleLowerCase();
  return str;
}
function normalizeName(name, isDynamic, nuxtStyle = false) {
  if (!isDynamic)
    return name;
  return nuxtStyle ? name.replace(nuxtDynamicRouteRE, "$1") || "all" : name.replace(replaceDynamicRouteRE, "$1");
}
function buildReactRoutePath(node, nuxtStyle = false) {
  const isDynamic = isDynamicRoute(node, nuxtStyle);
  const isCatchAll = isCatchAllRoute(node, nuxtStyle);
  const normalizedName = normalizeName(node, isDynamic, nuxtStyle);
  if (isDynamic) {
    if (isCatchAll)
      return "*";
    return `:${normalizedName}`;
  }
  return `${normalizedName}`;
}
function buildReactRemixRoutePath(node) {
  const escapeStart = "[";
  const escapeEnd = "]";
  let result = "";
  let rawSegmentBuffer = "";
  let inEscapeSequence = 0;
  let skipSegment = false;
  for (let i = 0; i < node.length; i++) {
    let isNewEscapeSequence2 = function() {
      return !inEscapeSequence && char === escapeStart && lastChar !== escapeStart;
    }, isCloseEscapeSequence2 = function() {
      return inEscapeSequence && char === escapeEnd && nextChar !== escapeEnd;
    }, isStartOfLayoutSegment2 = function() {
      return char === "_" && nextChar === "_" && !rawSegmentBuffer;
    };
    var isNewEscapeSequence = isNewEscapeSequence2, isCloseEscapeSequence = isCloseEscapeSequence2, isStartOfLayoutSegment = isStartOfLayoutSegment2;
    const char = node.charAt(i);
    const lastChar = i > 0 ? node.charAt(i - 1) : void 0;
    const nextChar = i < node.length - 1 ? node.charAt(i + 1) : void 0;
    if (skipSegment) {
      if (char === "/" || char === "." || char === import_node_path.win32.sep)
        skipSegment = false;
      continue;
    }
    if (isNewEscapeSequence2()) {
      inEscapeSequence++;
      continue;
    }
    if (isCloseEscapeSequence2()) {
      inEscapeSequence--;
      continue;
    }
    if (inEscapeSequence) {
      result += char;
      continue;
    }
    if (char === "/" || char === import_node_path.win32.sep || char === ".") {
      if (rawSegmentBuffer === "index" && result.endsWith("index"))
        result = result.replace(replaceIndexRE, "");
      else result += "/";
      rawSegmentBuffer = "";
      continue;
    }
    if (isStartOfLayoutSegment2()) {
      skipSegment = true;
      continue;
    }
    rawSegmentBuffer += char;
    if (char === "$") {
      result += typeof nextChar === "undefined" ? "*" : ":";
      continue;
    }
    result += char;
  }
  if (rawSegmentBuffer === "index" && result.endsWith("index"))
    result = result.replace(replaceIndexRE, "");
  return result || void 0;
}
function parsePageRequest(id) {
  const [moduleId, rawQuery] = id.split("?", 2);
  const query = new import_node_url.URLSearchParams(rawQuery);
  const pageId = query.get("id");
  return {
    moduleId,
    query,
    pageId
  };
}

// src/files.ts
function getPageDirs(PageOptions, root, exclude) {
  const dirs = (0, import_tinyglobby.globSync)(slash(PageOptions.dir), {
    ignore: exclude,
    onlyDirectories: true,
    dot: true,
    expandDirectories: false,
    cwd: root
  });
  const pageDirs = dirs.map((dir) => __spreadProps(__spreadValues({}, PageOptions), {
    dir: dir.replace(/\/$/, "")
  }));
  return pageDirs;
}
function getPageFiles(path, options, pageOptions) {
  var _a;
  const {
    exclude,
    extensions
  } = options;
  const ext = extsToGlob(extensions);
  const pattern = (_a = pageOptions == null ? void 0 : pageOptions.filePattern) != null ? _a : `**/*.${ext}`;
  const files = (0, import_tinyglobby.globSync)(pattern, {
    ignore: exclude,
    onlyFiles: true,
    cwd: path
  }).map((p) => slash((0, import_node_path2.join)(path, p)));
  return files;
}

// src/options.ts
var import_node_path3 = require("path");
var import_node_process = __toESM(require("process"), 1);

// src/stringify.ts
var componentRE = /"(?:component|element)":("(.*?)")/g;
var hasFunctionRE = /"(?:props|beforeEnter)":("(.*?)")/g;
var multilineCommentsRE = /\/\*(.|[\r\n])*?\*\//g;
var singlelineCommentsRE = /\/\/.*/g;
function replaceFunction(_, value) {
  if (typeof value === "function" || typeof value === "function") {
    const fnBody = value.toString().replace(multilineCommentsRE, "").replace(singlelineCommentsRE, "").replace(/(\s)/g, "");
    if (fnBody.length < 8 || fnBody.substring(0, 8) !== "function")
      return `_NuFrRa_${fnBody}`;
    return fnBody;
  }
  return value;
}
function stringifyRoutes(preparedRoutes, options) {
  const importsMap = /* @__PURE__ */ new Map();
  function getImportString(path, importName) {
    var _a, _b;
    const mode = resolveImportMode(path, options);
    return mode === "sync" ? `import ${importName} from "${path}"` : `const ${importName} = ${((_b = (_a = options.resolver.stringify) == null ? void 0 : _a.dynamicImport) == null ? void 0 : _b.call(_a, path)) || `() => import("${path}")`}`;
  }
  function componentReplacer(str, replaceStr, path) {
    var _a, _b;
    let importName = importsMap.get(path);
    if (!importName)
      importName = ROUTE_IMPORT_NAME.replace("$1", `${importsMap.size}`);
    importsMap.set(path, importName);
    importName = ((_b = (_a = options.resolver.stringify) == null ? void 0 : _a.component) == null ? void 0 : _b.call(_a, importName)) || importName;
    return str.replace(replaceStr, importName);
  }
  function functionReplacer(str, replaceStr, content) {
    if (content.startsWith("function"))
      return str.replace(replaceStr, content);
    if (content.startsWith("_NuFrRa_"))
      return str.replace(replaceStr, content.slice(8));
    return str;
  }
  const stringRoutes = JSON.stringify(preparedRoutes, replaceFunction).replace(componentRE, componentReplacer).replace(hasFunctionRE, functionReplacer);
  const imports = Array.from(importsMap).map((args) => getImportString(...args));
  return {
    imports,
    stringRoutes
  };
}
function generateClientCode(routes, options) {
  var _a, _b;
  const { imports, stringRoutes } = stringifyRoutes(routes, options);
  const code = `${imports.join(";\n")};

const routes = ${stringRoutes};

export default routes;`;
  return ((_b = (_a = options.resolver.stringify) == null ? void 0 : _a.final) == null ? void 0 : _b.call(_a, code)) || code;
}

// src/resolvers/react.ts
function prepareRoutes(routes, options, parent) {
  var _a, _b;
  for (const route of routes) {
    if (parent)
      route.path = (_a = route.path) == null ? void 0 : _a.replace(/^\//, "");
    if (route.children)
      route.children = prepareRoutes(route.children, options, route);
    delete route.rawRoute;
    Object.assign(route, ((_b = options.extendRoute) == null ? void 0 : _b.call(options, route, parent)) || {});
  }
  return routes;
}
async function computeReactRoutes(ctx) {
  var _a, _b;
  const { routeStyle, caseSensitive, importPath } = ctx.options;
  const nuxtStyle = routeStyle === "nuxt";
  const pageRoutes = [...ctx.pageRouteMap.values()].sort((a, b) => countSlash(a.route) - countSlash(b.route));
  const routes = [];
  pageRoutes.forEach((page) => {
    const pathNodes = page.route.split("/");
    const element = importPath === "relative" ? page.path.replace(ctx.root, "") : page.path;
    let parentRoutes = routes;
    for (let i = 0; i < pathNodes.length; i++) {
      const node = pathNodes[i];
      const route = {
        caseSensitive,
        path: "",
        rawRoute: pathNodes.slice(0, i + 1).join("/")
      };
      if (i === pathNodes.length - 1)
        route.element = element;
      const isIndexRoute = normalizeCase(node, caseSensitive).endsWith("index");
      if (!route.path && isIndexRoute) {
        route.path = "/";
      } else if (!isIndexRoute) {
        if (routeStyle === "remix")
          route.path = buildReactRemixRoutePath(node);
        else
          route.path = buildReactRoutePath(node, nuxtStyle);
      }
      const parent = parentRoutes.find((parent2) => {
        return pathNodes.slice(0, i).join("/") === parent2.rawRoute;
      });
      if (parent) {
        parent.children = parent.children || [];
        parentRoutes = parent.children;
      }
      const exits = parentRoutes.some((parent2) => {
        return pathNodes.slice(0, i + 1).join("/") === parent2.rawRoute;
      });
      if (!exits)
        parentRoutes.push(route);
    }
  });
  let finalRoutes = prepareRoutes(routes, ctx.options);
  finalRoutes = await ((_b = (_a = ctx.options).onRoutesGenerated) == null ? void 0 : _b.call(_a, finalRoutes)) || finalRoutes;
  return finalRoutes;
}
async function resolveReactRoutes(ctx) {
  var _a, _b;
  const finalRoutes = await computeReactRoutes(ctx);
  let client = generateClientCode(finalRoutes, ctx.options);
  client = await ((_b = (_a = ctx.options).onClientGenerated) == null ? void 0 : _b.call(_a, client)) || client;
  return client;
}
function reactResolver() {
  return {
    resolveModuleIds() {
      return ["~react-pages", "virtual:generated-pages-react"];
    },
    resolveExtensions() {
      return ["tsx", "jsx", "ts", "js"];
    },
    async resolveRoutes(ctx) {
      return resolveReactRoutes(ctx);
    },
    async getComputedRoutes(ctx) {
      return computeReactRoutes(ctx);
    },
    stringify: {
      component: (path) => `React.createElement(${path})`,
      dynamicImport: (path) => `React.lazy(() => import("${path}"))`,
      final: (code) => `import React from "react";
${code}`
    }
  };
}

// src/resolvers/solid.ts
function prepareRoutes2(options, routes, parent) {
  var _a, _b;
  for (const route of routes) {
    if (parent)
      route.path = (_a = route.path) == null ? void 0 : _a.replace(/^\//, "");
    if (route.children)
      route.children = prepareRoutes2(options, route.children, route);
    delete route.rawRoute;
    Object.assign(route, ((_b = options.extendRoute) == null ? void 0 : _b.call(options, route, parent)) || {});
  }
  return routes;
}
async function computeSolidRoutes(ctx) {
  var _a, _b;
  const { routeStyle, caseSensitive, importPath } = ctx.options;
  const nuxtStyle = routeStyle === "nuxt";
  const pageRoutes = [...ctx.pageRouteMap.values()].sort((a, b) => countSlash(a.route) - countSlash(b.route));
  const routes = [];
  pageRoutes.forEach((page) => {
    const pathNodes = page.route.split("/");
    const component = importPath === "relative" ? page.path.replace(ctx.root, "") : page.path;
    const element = importPath === "relative" ? page.path.replace(ctx.root, "") : page.path;
    let parentRoutes = routes;
    for (let i = 0; i < pathNodes.length; i++) {
      const node = pathNodes[i];
      const normalizedPath = normalizeCase(node, caseSensitive);
      const route = {
        path: "",
        rawRoute: pathNodes.slice(0, i + 1).join("/")
      };
      const parent = parentRoutes.find(
        (parent2) => pathNodes.slice(0, i).join("/") === parent2.rawRoute
      );
      if (parent) {
        parent.children = parent.children || [];
        parentRoutes = parent.children;
      }
      if (i === pathNodes.length - 1) {
        route.element = element;
        route.component = component;
      }
      if (normalizedPath === "index") {
        if (!route.path)
          route.path = "/";
      } else if (normalizedPath !== "index") {
        if (routeStyle === "remix")
          route.path = buildReactRemixRoutePath(node) || "";
        else
          route.path = buildReactRoutePath(node, nuxtStyle) || "";
      }
      const exist = parentRoutes.some((parent2) => {
        return pathNodes.slice(0, i + 1).join("/") === parent2.rawRoute;
      });
      if (!exist)
        parentRoutes.push(route);
    }
  });
  let finalRoutes = prepareRoutes2(ctx.options, routes);
  finalRoutes = await ((_b = (_a = ctx.options).onRoutesGenerated) == null ? void 0 : _b.call(_a, finalRoutes)) || finalRoutes;
  return finalRoutes;
}
async function resolveSolidRoutes(ctx) {
  var _a, _b;
  const finalRoutes = await computeSolidRoutes(ctx);
  let client = generateClientCode(finalRoutes, ctx.options);
  client = await ((_b = (_a = ctx.options).onClientGenerated) == null ? void 0 : _b.call(_a, client)) || client;
  return client;
}
function solidResolver() {
  return {
    resolveModuleIds() {
      return ["~solid-pages"];
    },
    resolveExtensions() {
      return ["tsx", "jsx", "ts", "js"];
    },
    async resolveRoutes(ctx) {
      return resolveSolidRoutes(ctx);
    },
    async getComputedRoutes(ctx) {
      return computeSolidRoutes(ctx);
    },
    stringify: {
      dynamicImport: (path) => `Solid.lazy(() => import("${path}"))`,
      final: (code) => `import * as Solid from "solid-js";
${code}`
    }
  };
}

// src/resolvers/vue.ts
var import_dequal = require("dequal");
var import_picocolors = __toESM(require("picocolors"), 1);

// src/customBlock.ts
var import_node_fs = __toESM(require("fs"), 1);
var import_extract_comments = __toESM(require("extract-comments"), 1);
var import_json5 = __toESM(require("json5"), 1);
var import_local_pkg = require("local-pkg");
var import_yaml = require("yaml");
var routeJSXReg = /^\s+(route)\s+/gm;
function parseJSX(code) {
  return (0, import_extract_comments.default)(code).slice(0, 1).filter((comment) => routeJSXReg.test(comment.value) && comment.value.includes(":") && comment.loc.start.line === 1);
}
function parseYamlComment(code, path) {
  return code.reduce((memo, item) => {
    const { value } = item;
    const v = value.replace(routeJSXReg, "");
    debug.routeBlock(`use ${v} parser`);
    try {
      const yamlResult = (0, import_yaml.parse)(v);
      return __spreadValues(__spreadValues({}, memo), yamlResult);
    } catch (err) {
      throw new Error(`Invalid YAML format of comment in ${path}
${err.message}`);
    }
  }, {});
}
async function parseSFC(code) {
  try {
    const { parse } = await (0, import_local_pkg.importModule)("@vue/compiler-sfc");
    return parse(code, {
      pad: "space"
    }).descriptor || parse({
      source: code
    });
  } catch (e) {
    throw new Error(`[vite-plugin-pages] Vue3's "@vue/compiler-sfc" is required.`);
  }
}
function parseCustomBlock(block, filePath, options) {
  var _a;
  const lang = (_a = block.lang) != null ? _a : options.routeBlockLang;
  debug.routeBlock(`use ${lang} parser`);
  if (lang === "json5") {
    try {
      return import_json5.default.parse(block.content);
    } catch (err) {
      throw new Error(`Invalid JSON5 format of <${block.type}> content in ${filePath}
${err.message}`);
    }
  } else if (lang === "json") {
    try {
      return JSON.parse(block.content);
    } catch (err) {
      throw new Error(`Invalid JSON format of <${block.type}> content in ${filePath}
${err.message}`);
    }
  } else if (lang === "yaml" || lang === "yml") {
    try {
      return (0, import_yaml.parse)(block.content);
    } catch (err) {
      throw new Error(`Invalid YAML format of <${block.type}> content in ${filePath}
${err.message}`);
    }
  }
}
async function getRouteBlock(path, options) {
  const content = import_node_fs.default.readFileSync(path, "utf8");
  const parsedSFC = await parseSFC(content);
  const blockStr = parsedSFC == null ? void 0 : parsedSFC.customBlocks.find((b) => b.type === "route");
  const parsedJSX = parseJSX(content);
  if (!blockStr && parsedJSX.length === 0)
    return;
  let result;
  if (blockStr)
    result = parseCustomBlock(blockStr, path, options);
  if (parsedJSX.length > 0)
    result = parseYamlComment(parsedJSX, path);
  return result;
}

// src/resolvers/vue.ts
function prepareRoutes3(ctx, routes, parent) {
  var _a, _b, _c, _d;
  for (const route of routes) {
    if (route.name)
      route.name = route.name.replace(new RegExp(`${ctx.options.routeNameSeparator}index$`), "");
    if (parent)
      route.path = (_a = route.path) == null ? void 0 : _a.replace(/^\//, "");
    if (route.children)
      route.children = prepareRoutes3(ctx, route.children, route);
    if ((_b = route.children) == null ? void 0 : _b.find((c) => c.name === route.name))
      delete route.name;
    route.props = true;
    delete route.rawRoute;
    if (route.customBlock) {
      Object.assign(route, route.customBlock || {});
      delete route.customBlock;
    }
    Object.assign(route, ((_d = (_c = ctx.options).extendRoute) == null ? void 0 : _d.call(_c, route, parent)) || {});
  }
  return routes;
}
async function computeVueRoutes(ctx, customBlockMap) {
  var _a, _b;
  const { routeStyle, caseSensitive, importPath, routeNameSeparator } = ctx.options;
  const pageRoutes = [...ctx.pageRouteMap.values()].sort((a, b) => countSlash(a.route) - countSlash(b.route));
  const routes = [];
  pageRoutes.forEach((page) => {
    const pathNodes = page.route.split("/");
    const component = importPath === "relative" ? page.path.replace(ctx.root, "") : page.path;
    const customBlock = customBlockMap.get(page.path);
    const route = {
      name: "",
      path: "",
      component,
      customBlock,
      rawRoute: page.route
    };
    let parentRoutes = routes;
    let dynamicRoute = false;
    for (let i = 0; i < pathNodes.length; i++) {
      const node = pathNodes[i];
      const nuxtStyle = routeStyle === "nuxt";
      const isDynamic = isDynamicRoute(node, nuxtStyle);
      const isCatchAll = isCatchAllRoute(node, nuxtStyle);
      const normalizedName = normalizeName(node, isDynamic, nuxtStyle);
      const normalizedPath = normalizeCase(normalizedName, caseSensitive);
      if (isDynamic)
        dynamicRoute = true;
      route.name += route.name ? `${routeNameSeparator}${normalizedName}` : normalizedName;
      const parent = parentRoutes.find((parent2) => {
        return pathNodes.slice(0, i + 1).join("/") === parent2.rawRoute;
      });
      if (parent) {
        parent.children = parent.children || [];
        parentRoutes = parent.children;
        route.path = "";
      } else if (normalizedPath === "index") {
        if (!route.path)
          route.path = "/";
      } else if (normalizedPath !== "index") {
        if (isDynamic) {
          route.path += `/:${normalizedName}`;
          if (isCatchAll) {
            if (i === 0)
              route.path += "(.*)*";
            else
              route.path += "(.*)";
          } else if (nuxtStyle && i === pathNodes.length - 1) {
            const isIndexFound = pageRoutes.find(({ route: route2 }) => {
              return route2 === page.route.replace(pathNodes[i], "index");
            });
            if (!isIndexFound)
              route.path += "?";
          }
        } else {
          route.path += `/${normalizedPath}`;
        }
      }
    }
    if (dynamicRoute)
      parentRoutes.push(route);
    else
      parentRoutes.unshift(route);
  });
  let finalRoutes = prepareRoutes3(ctx, routes);
  finalRoutes = await ((_b = (_a = ctx.options).onRoutesGenerated) == null ? void 0 : _b.call(_a, finalRoutes)) || finalRoutes;
  return finalRoutes;
}
async function resolveVueRoutes(ctx, customBlockMap) {
  var _a, _b;
  const finalRoutes = await computeVueRoutes(ctx, customBlockMap);
  let client = generateClientCode(finalRoutes, ctx.options);
  client = await ((_b = (_a = ctx.options).onClientGenerated) == null ? void 0 : _b.call(_a, client)) || client;
  return client;
}
function vueResolver() {
  const customBlockMap = /* @__PURE__ */ new Map();
  async function checkCustomBlockChange(ctx, path) {
    var _a;
    const exitsCustomBlock = customBlockMap.get(path);
    let customBlock;
    try {
      customBlock = await getRouteBlock(path, ctx.options);
    } catch (error) {
      (_a = ctx.logger) == null ? void 0 : _a.error(import_picocolors.default.red(`[vite-plugin-pages] ${error.message}`));
      return;
    }
    if (!exitsCustomBlock && !customBlock)
      return;
    if (!customBlock) {
      customBlockMap.delete(path);
      ctx.debug.routeBlock("%s deleted", path);
      return;
    }
    if (!exitsCustomBlock || !(0, import_dequal.dequal)(exitsCustomBlock, customBlock)) {
      ctx.debug.routeBlock("%s old: %O", path, exitsCustomBlock);
      ctx.debug.routeBlock("%s new: %O", path, customBlock);
      customBlockMap.set(path, customBlock);
      ctx.onUpdate();
    }
  }
  return {
    resolveExtensions() {
      return ["vue", "ts", "js"];
    },
    resolveModuleIds() {
      return ["~pages", "pages-generated", "virtual:generated-pages"];
    },
    async resolveRoutes(ctx) {
      return resolveVueRoutes(ctx, customBlockMap);
    },
    async getComputedRoutes(ctx) {
      return computeVueRoutes(ctx, customBlockMap);
    },
    hmr: {
      added: async (ctx, path) => checkCustomBlockChange(ctx, path),
      changed: async (ctx, path) => checkCustomBlockChange(ctx, path),
      removed: async (_ctx, path) => {
        customBlockMap.delete(path);
      }
    }
  };
}

// src/options.ts
function resolvePageDirs(dirs, root, exclude) {
  dirs = toArray(dirs);
  return dirs.flatMap((dir) => {
    const option = typeof dir === "string" ? { dir, baseRoute: "" } : dir;
    option.dir = slash((0, import_node_path3.resolve)(root, option.dir)).replace(`${root}/`, "");
    option.baseRoute = option.baseRoute.replace(/^\//, "").replace(/\/$/, "");
    return getPageDirs(option, root, exclude);
  });
}
var syncIndexResolver = (filepath, options) => {
  for (const page of options.dirs) {
    if (page.baseRoute === "" && filepath.startsWith(`/${page.dir}/index`))
      return "sync";
  }
  return "async";
};
function getResolver(originalResolver) {
  let resolver = originalResolver || "vue";
  if (typeof resolver !== "string")
    return resolver;
  switch (resolver) {
    case "vue":
      resolver = vueResolver();
      break;
    case "react":
      resolver = reactResolver();
      break;
    case "solid":
      resolver = solidResolver();
      break;
    default:
      throw new Error(`Unsupported resolver: ${resolver}`);
  }
  return resolver;
}
function resolveOptions(userOptions, viteRoot) {
  var _a;
  const {
    dirs = ["src/pages"],
    routeBlockLang = "json5",
    exclude = ["node_modules", ".git", "**/__*__/**"],
    caseSensitive = false,
    routeNameSeparator = "-",
    extendRoute,
    onRoutesGenerated,
    onClientGenerated
  } = userOptions;
  const root = viteRoot || slash(import_node_process.default.cwd());
  const importMode = userOptions.importMode || syncIndexResolver;
  const importPath = userOptions.importPath || "relative";
  const resolver = getResolver(userOptions.resolver);
  const extensions = userOptions.extensions || resolver.resolveExtensions();
  const extensionsRE = new RegExp(`\\.(${extensions.join("|")})$`);
  const resolvedDirs = resolvePageDirs(dirs, root, exclude);
  const routeStyle = userOptions.routeStyle || "next";
  const moduleIds = userOptions.moduleId ? [userOptions.moduleId] : ((_a = resolver.resolveModuleIds) == null ? void 0 : _a.call(resolver)) || MODULE_IDS;
  const resolvedOptions = {
    dirs: resolvedDirs,
    routeStyle,
    routeBlockLang,
    moduleIds,
    root,
    extensions,
    importMode,
    importPath,
    exclude,
    caseSensitive,
    resolver,
    extensionsRE,
    extendRoute,
    onRoutesGenerated,
    onClientGenerated,
    routeNameSeparator
  };
  return resolvedOptions;
}

// src/context.ts
var PageContext = class {
  constructor(userOptions, viteRoot = import_node_process2.default.cwd()) {
    this._pageRouteMap = /* @__PURE__ */ new Map();
    this.rawOptions = userOptions;
    this.root = slash(viteRoot);
    debug.env("root", this.root);
    this.options = resolveOptions(userOptions, this.root);
    debug.options(this.options);
  }
  setLogger(logger) {
    this.logger = logger;
  }
  setupViteServer(server) {
    if (this._server === server)
      return;
    this._server = server;
    this.setupWatcher(server.watcher);
  }
  setupWatcher(watcher) {
    watcher.on("unlink", async (path) => {
      path = slash(path);
      if (!isTarget(path, this.options))
        return;
      await this.removePage(path);
      this.onUpdate();
    });
    watcher.on("add", async (path) => {
      path = slash(path);
      if (!isTarget(path, this.options))
        return;
      const page = this.options.dirs.find((i) => path.startsWith(slash((0, import_node_path4.resolve)(this.root, i.dir))));
      await this.addPage(path, page);
      this.onUpdate();
    });
    watcher.on("change", async (path) => {
      var _a, _b;
      path = slash(path);
      if (!isTarget(path, this.options))
        return;
      const page = this._pageRouteMap.get(path);
      if (page)
        await ((_b = (_a = this.options.resolver.hmr) == null ? void 0 : _a.changed) == null ? void 0 : _b.call(_a, this, path));
    });
  }
  async addPage(path, pageDir) {
    var _a, _b;
    debug.pages("add", path);
    for (const p of toArray(path)) {
      const pageDirPath = slash((0, import_node_path4.resolve)(this.root, pageDir.dir));
      const extension = this.options.extensions.find((ext) => p.endsWith(`.${ext}`));
      if (!extension)
        continue;
      const route = slash((0, import_node_path4.join)(pageDir.baseRoute, p.replace(`${pageDirPath}/`, "").replace(`.${extension}`, "")));
      this._pageRouteMap.set(p, {
        path: p,
        route
      });
      await ((_b = (_a = this.options.resolver.hmr) == null ? void 0 : _a.added) == null ? void 0 : _b.call(_a, this, p));
    }
  }
  async removePage(path) {
    var _a, _b;
    debug.pages("remove", path);
    this._pageRouteMap.delete(path);
    await ((_b = (_a = this.options.resolver.hmr) == null ? void 0 : _a.removed) == null ? void 0 : _b.call(_a, this, path));
  }
  onUpdate() {
    if (!this._server)
      return;
    invalidatePagesModule(this._server);
    debug.hmr("Reload generated pages.");
    this._server.ws.send({
      type: "full-reload"
    });
  }
  async resolveRoutes() {
    return this.options.resolver.resolveRoutes(this);
  }
  async searchGlob() {
    const pageDirFiles = this.options.dirs.map((page) => {
      const pagesDirPath = slash((0, import_node_path4.resolve)(this.options.root, page.dir));
      const files = getPageFiles(pagesDirPath, this.options, page);
      debug.search(page.dir, files);
      return __spreadProps(__spreadValues({}, page), {
        files: files.map((file) => slash(file))
      });
    });
    for (const page of pageDirFiles)
      await this.addPage(page.files, page);
    debug.cache(this.pageRouteMap);
  }
  get debug() {
    return debug;
  }
  get pageRouteMap() {
    return this._pageRouteMap;
  }
};

// src/index.ts
function pagesPlugin(userOptions = {}) {
  let ctx;
  return {
    name: "vite-plugin-pages",
    enforce: "pre",
    async configResolved(config) {
      if (!userOptions.resolver && config.plugins.find((i) => i.name.includes("vite:react"))) {
        userOptions.resolver = "react";
      }
      if (!userOptions.resolver && config.plugins.find((i) => i.name.includes("solid"))) {
        userOptions.resolver = "solid";
      }
      ctx = new PageContext(userOptions, config.root);
      ctx.setLogger(config.logger);
      await ctx.searchGlob();
    },
    api: {
      getResolvedRoutes() {
        return ctx.options.resolver.getComputedRoutes(ctx);
      }
    },
    configureServer(server) {
      ctx.setupViteServer(server);
    },
    resolveId(id) {
      if (ctx.options.moduleIds.includes(id))
        return `${MODULE_ID_VIRTUAL}?id=${id}`;
      if (routeBlockQueryRE.test(id))
        return ROUTE_BLOCK_ID_VIRTUAL;
      return null;
    },
    async load(id) {
      const {
        moduleId,
        pageId
      } = parsePageRequest(id);
      if (moduleId === MODULE_ID_VIRTUAL && pageId && ctx.options.moduleIds.includes(pageId))
        return ctx.resolveRoutes();
      if (id === ROUTE_BLOCK_ID_VIRTUAL) {
        return {
          code: "export default {};",
          map: null
        };
      }
      return null;
    }
  };
}
var index_default = pagesPlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PageContext,
  reactResolver,
  solidResolver,
  syncIndexResolver,
  vueResolver
});
//# sourceMappingURL=index.cjs.map