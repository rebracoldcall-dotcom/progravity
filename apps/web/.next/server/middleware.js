// runtime can't be in strict mode because a global variable is assign and maybe created.
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[826],{

/***/ 2067:
/***/ ((module) => {

"use strict";
module.exports = require("node:async_hooks");

/***/ }),

/***/ 6195:
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ 548:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ nHandler)
});

// NAMESPACE OBJECT: ./middleware.ts
var middleware_namespaceObject = {};
__webpack_require__.r(middleware_namespaceObject);
__webpack_require__.d(middleware_namespaceObject, {
  config: () => (config),
  "default": () => (middleware)
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/globals.js
async function registerInstrumentation() {
    if ("_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && _ENTRIES.middleware_instrumentation.register) {
        try {
            await _ENTRIES.middleware_instrumentation.register();
        } catch (err) {
            err.message = `An error occurred while loading instrumentation hook: ${err.message}`;
            throw err;
        }
    }
}
let registerInstrumentationPromise = null;
function ensureInstrumentationRegistered() {
    if (!registerInstrumentationPromise) {
        registerInstrumentationPromise = registerInstrumentation();
    }
    return registerInstrumentationPromise;
}
function getUnsupportedModuleErrorMessage(module) {
    // warning: if you change these messages, you must adjust how react-dev-overlay's middleware detects modules not found
    return `The edge runtime does not support Node.js '${module}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
}
function __import_unsupported(moduleName) {
    const proxy = new Proxy(function() {}, {
        get (_obj, prop) {
            if (prop === "then") {
                return {};
            }
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        },
        construct () {
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        },
        apply (_target, _this, args) {
            if (typeof args[0] === "function") {
                return args[0](proxy);
            }
            throw new Error(getUnsupportedModuleErrorMessage(moduleName));
        }
    });
    return new Proxy({}, {
        get: ()=>proxy
    });
}
function enhanceGlobals() {
    // The condition is true when the "process" module is provided
    if (process !== __webpack_require__.g.process) {
        // prefer local process but global.process has correct "env"
        process.env = __webpack_require__.g.process.env;
        __webpack_require__.g.process = process;
    }
    // to allow building code that import but does not use node.js modules,
    // webpack will expect this function to exist in global scope
    Object.defineProperty(globalThis, "__import_unsupported", {
        value: __import_unsupported,
        enumerable: false,
        configurable: false
    });
    // Eagerly fire instrumentation hook to make the startup faster.
    void ensureInstrumentationRegistered();
}
enhanceGlobals(); //# sourceMappingURL=globals.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/error.js
class PageSignatureError extends Error {
    constructor({ page }){
        super(`The middleware "${page}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
    }
}
class RemovedPageError extends Error {
    constructor(){
        super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
    }
}
class RemovedUAError extends Error {
    constructor(){
        super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
    }
} //# sourceMappingURL=error.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/utils.js
/**
 * Converts a Node.js IncomingHttpHeaders object to a Headers object. Any
 * headers with multiple values will be joined with a comma and space. Any
 * headers that have an undefined value will be ignored and others will be
 * coerced to strings.
 *
 * @param nodeHeaders the headers object to convert
 * @returns the converted headers object
 */ function fromNodeOutgoingHttpHeaders(nodeHeaders) {
    const headers = new Headers();
    for (let [key, value] of Object.entries(nodeHeaders)){
        const values = Array.isArray(value) ? value : [
            value
        ];
        for (let v of values){
            if (typeof v === "undefined") continue;
            if (typeof v === "number") {
                v = v.toString();
            }
            headers.append(key, v);
        }
    }
    return headers;
}
/*
  Set-Cookie header field-values are sometimes comma joined in one string. This splits them without choking on commas
  that are within a single set-cookie field-value, such as in the Expires portion.
  This is uncommon, but explicitly allowed - see https://tools.ietf.org/html/rfc2616#section-4.2
  Node.js does this for every header *except* set-cookie - see https://github.com/nodejs/node/blob/d5e363b77ebaf1caf67cd7528224b651c86815c1/lib/_http_incoming.js#L128
  React Native's fetch does this for *every* header, including set-cookie.
  
  Based on: https://github.com/google/j2objc/commit/16820fdbc8f76ca0c33472810ce0cb03d20efe25
  Credits to: https://github.com/tomball for original and https://github.com/chrusart for JavaScript implementation
*/ function splitCookiesString(cookiesString) {
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
                // ',' is a cookie separator if we have later first '=', not ';' or ','
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                // currently special character
                if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                    // we found cookies separator
                    cookiesSeparatorFound = true;
                    // pos is inside the next cookie, so back up and return it.
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    // in param ',' or param separator ';',
                    // we continue from that comma
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
/**
 * Converts a Headers object to a Node.js OutgoingHttpHeaders object. This is
 * required to support the set-cookie header, which may have multiple values.
 *
 * @param headers the headers object to convert
 * @returns the converted headers object
 */ function toNodeOutgoingHttpHeaders(headers) {
    const nodeHeaders = {};
    const cookies = [];
    if (headers) {
        for (const [key, value] of headers.entries()){
            if (key.toLowerCase() === "set-cookie") {
                // We may have gotten a comma joined string of cookies, or multiple
                // set-cookie headers. We need to merge them into one header array
                // to represent all the cookies.
                cookies.push(...splitCookiesString(value));
                nodeHeaders[key] = cookies.length === 1 ? cookies[0] : cookies;
            } else {
                nodeHeaders[key] = value;
            }
        }
    }
    return nodeHeaders;
}
/**
 * Validate the correctness of a user-provided URL.
 */ function validateURL(url) {
    try {
        return String(new URL(String(url)));
    } catch (error) {
        throw new Error(`URL is malformed "${String(url)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, {
            cause: error
        });
    }
} //# sourceMappingURL=utils.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/spec-extension/fetch-event.js

const responseSymbol = Symbol("response");
const passThroughSymbol = Symbol("passThrough");
const waitUntilSymbol = Symbol("waitUntil");
class FetchEvent {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(_request){
        this[waitUntilSymbol] = [];
        this[passThroughSymbol] = false;
    }
    respondWith(response) {
        if (!this[responseSymbol]) {
            this[responseSymbol] = Promise.resolve(response);
        }
    }
    passThroughOnException() {
        this[passThroughSymbol] = true;
    }
    waitUntil(promise) {
        this[waitUntilSymbol].push(promise);
    }
}
class NextFetchEvent extends FetchEvent {
    constructor(params){
        super(params.request);
        this.sourcePage = params.page;
    }
    /**
   * @deprecated The `request` is now the first parameter and the API is now async.
   *
   * Read more: https://nextjs.org/docs/messages/middleware-new-signature
   */ get request() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
    /**
   * @deprecated Using `respondWith` is no longer needed.
   *
   * Read more: https://nextjs.org/docs/messages/middleware-new-signature
   */ respondWith() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
} //# sourceMappingURL=fetch-event.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/i18n/detect-domain-locale.js
function detectDomainLocale(domainItems, hostname, detectedLocale) {
    if (!domainItems) return;
    if (detectedLocale) {
        detectedLocale = detectedLocale.toLowerCase();
    }
    for (const item of domainItems){
        var _item_domain, _item_locales;
        // remove port if present
        const domainHostname = (_item_domain = item.domain) == null ? void 0 : _item_domain.split(":", 1)[0].toLowerCase();
        if (hostname === domainHostname || detectedLocale === item.defaultLocale.toLowerCase() || ((_item_locales = item.locales) == null ? void 0 : _item_locales.some((locale)=>locale.toLowerCase() === detectedLocale))) {
            return item;
        }
    }
} //# sourceMappingURL=detect-domain-locale.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/remove-trailing-slash.js
/**
 * Removes the trailing slash for a given route or page path. Preserves the
 * root page. Examples:
 *   - `/foo/bar/` -> `/foo/bar`
 *   - `/foo/bar` -> `/foo/bar`
 *   - `/` -> `/`
 */ function removeTrailingSlash(route) {
    return route.replace(/\/$/, "") || "/";
} //# sourceMappingURL=remove-trailing-slash.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/parse-path.js
/**
 * Given a path this function will find the pathname, query and hash and return
 * them. This is useful to parse full paths on the client side.
 * @param path A path to parse e.g. /foo/bar?id=1#hash
 */ function parsePath(path) {
    const hashIndex = path.indexOf("#");
    const queryIndex = path.indexOf("?");
    const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
    if (hasQuery || hashIndex > -1) {
        return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined) : "",
            hash: hashIndex > -1 ? path.slice(hashIndex) : ""
        };
    }
    return {
        pathname: path,
        query: "",
        hash: ""
    };
} //# sourceMappingURL=parse-path.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/add-path-prefix.js

/**
 * Adds the provided prefix to the given path. It first ensures that the path
 * is indeed starting with a slash.
 */ function addPathPrefix(path, prefix) {
    if (!path.startsWith("/") || !prefix) {
        return path;
    }
    const { pathname, query, hash } = parsePath(path);
    return "" + prefix + pathname + query + hash;
} //# sourceMappingURL=add-path-prefix.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/add-path-suffix.js

/**
 * Similarly to `addPathPrefix`, this function adds a suffix at the end on the
 * provided path. It also works only for paths ensuring the argument starts
 * with a slash.
 */ function addPathSuffix(path, suffix) {
    if (!path.startsWith("/") || !suffix) {
        return path;
    }
    const { pathname, query, hash } = parsePath(path);
    return "" + pathname + suffix + query + hash;
} //# sourceMappingURL=add-path-suffix.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/path-has-prefix.js

/**
 * Checks if a given path starts with a given prefix. It ensures it matches
 * exactly without containing extra chars. e.g. prefix /docs should replace
 * for /docs, /docs/, /docs/a but not /docsss
 * @param path The path to check.
 * @param prefix The prefix to check against.
 */ function pathHasPrefix(path, prefix) {
    if (typeof path !== "string") {
        return false;
    }
    const { pathname } = parsePath(path);
    return pathname === prefix || pathname.startsWith(prefix + "/");
} //# sourceMappingURL=path-has-prefix.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/add-locale.js


/**
 * For a given path and a locale, if the locale is given, it will prefix the
 * locale. The path shouldn't be an API path. If a default locale is given the
 * prefix will be omitted if the locale is already the default locale.
 */ function addLocale(path, locale, defaultLocale, ignorePrefix) {
    // If no locale was given or the locale is the default locale, we don't need
    // to prefix the path.
    if (!locale || locale === defaultLocale) return path;
    const lower = path.toLowerCase();
    // If the path is an API path or the path already has the locale prefix, we
    // don't need to prefix the path.
    if (!ignorePrefix) {
        if (pathHasPrefix(lower, "/api")) return path;
        if (pathHasPrefix(lower, "/" + locale.toLowerCase())) return path;
    }
    // Add the locale prefix to the path.
    return addPathPrefix(path, "/" + locale);
} //# sourceMappingURL=add-locale.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/format-next-pathname-info.js




function formatNextPathnameInfo(info) {
    let pathname = addLocale(info.pathname, info.locale, info.buildId ? undefined : info.defaultLocale, info.ignorePrefix);
    if (info.buildId || !info.trailingSlash) {
        pathname = removeTrailingSlash(pathname);
    }
    if (info.buildId) {
        pathname = addPathSuffix(addPathPrefix(pathname, "/_next/data/" + info.buildId), info.pathname === "/" ? "index.json" : ".json");
    }
    pathname = addPathPrefix(pathname, info.basePath);
    return !info.buildId && info.trailingSlash ? !pathname.endsWith("/") ? addPathSuffix(pathname, "/") : pathname : removeTrailingSlash(pathname);
} //# sourceMappingURL=format-next-pathname-info.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/get-hostname.js
/**
 * Takes an object with a hostname property (like a parsed URL) and some
 * headers that may contain Host and returns the preferred hostname.
 * @param parsed An object containing a hostname property.
 * @param headers A dictionary with headers containing a `host`.
 */ function getHostname(parsed, headers) {
    // Get the hostname from the headers if it exists, otherwise use the parsed
    // hostname.
    let hostname;
    if ((headers == null ? void 0 : headers.host) && !Array.isArray(headers.host)) {
        hostname = headers.host.toString().split(":", 1)[0];
    } else if (parsed.hostname) {
        hostname = parsed.hostname;
    } else return;
    return hostname.toLowerCase();
} //# sourceMappingURL=get-hostname.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/i18n/normalize-locale-path.js
/**
 * For a pathname that may include a locale from a list of locales, it
 * removes the locale from the pathname returning it alongside with the
 * detected locale.
 *
 * @param pathname A pathname that may include a locale.
 * @param locales A list of locales.
 * @returns The detected locale and pathname without locale
 */ function normalizeLocalePath(pathname, locales) {
    let detectedLocale;
    // first item will be empty string from splitting at first char
    const pathnameParts = pathname.split("/");
    (locales || []).some((locale)=>{
        if (pathnameParts[1] && pathnameParts[1].toLowerCase() === locale.toLowerCase()) {
            detectedLocale = locale;
            pathnameParts.splice(1, 1);
            pathname = pathnameParts.join("/") || "/";
            return true;
        }
        return false;
    });
    return {
        pathname,
        detectedLocale
    };
} //# sourceMappingURL=normalize-locale-path.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/remove-path-prefix.js

/**
 * Given a path and a prefix it will remove the prefix when it exists in the
 * given path. It ensures it matches exactly without containing extra chars
 * and if the prefix is not there it will be noop.
 *
 * @param path The path to remove the prefix from.
 * @param prefix The prefix to be removed.
 */ function removePathPrefix(path, prefix) {
    // If the path doesn't start with the prefix we can return it as is. This
    // protects us from situations where the prefix is a substring of the path
    // prefix such as:
    //
    // For prefix: /blog
    //
    //   /blog -> true
    //   /blog/ -> true
    //   /blog/1 -> true
    //   /blogging -> false
    //   /blogging/ -> false
    //   /blogging/1 -> false
    if (!pathHasPrefix(path, prefix)) {
        return path;
    }
    // Remove the prefix from the path via slicing.
    const withoutPrefix = path.slice(prefix.length);
    // If the path without the prefix starts with a `/` we can return it as is.
    if (withoutPrefix.startsWith("/")) {
        return withoutPrefix;
    }
    // If the path without the prefix doesn't start with a `/` we need to add it
    // back to the path to make sure it's a valid path.
    return "/" + withoutPrefix;
} //# sourceMappingURL=remove-path-prefix.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/get-next-pathname-info.js



function getNextPathnameInfo(pathname, options) {
    var _options_nextConfig;
    const { basePath, i18n, trailingSlash } = (_options_nextConfig = options.nextConfig) != null ? _options_nextConfig : {};
    const info = {
        pathname,
        trailingSlash: pathname !== "/" ? pathname.endsWith("/") : trailingSlash
    };
    if (basePath && pathHasPrefix(info.pathname, basePath)) {
        info.pathname = removePathPrefix(info.pathname, basePath);
        info.basePath = basePath;
    }
    let pathnameNoDataPrefix = info.pathname;
    if (info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
        const paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
        const buildId = paths[0];
        info.buildId = buildId;
        pathnameNoDataPrefix = paths[1] !== "index" ? "/" + paths.slice(1).join("/") : "/";
        // update pathname with normalized if enabled although
        // we use normalized to populate locale info still
        if (options.parseData === true) {
            info.pathname = pathnameNoDataPrefix;
        }
    }
    // If provided, use the locale route normalizer to detect the locale instead
    // of the function below.
    if (i18n) {
        let result = options.i18nProvider ? options.i18nProvider.analyze(info.pathname) : normalizeLocalePath(info.pathname, i18n.locales);
        info.locale = result.detectedLocale;
        var _result_pathname;
        info.pathname = (_result_pathname = result.pathname) != null ? _result_pathname : info.pathname;
        if (!result.detectedLocale && info.buildId) {
            result = options.i18nProvider ? options.i18nProvider.analyze(pathnameNoDataPrefix) : normalizeLocalePath(pathnameNoDataPrefix, i18n.locales);
            if (result.detectedLocale) {
                info.locale = result.detectedLocale;
            }
        }
    }
    return info;
} //# sourceMappingURL=get-next-pathname-info.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/next-url.js




const REGEX_LOCALHOST_HOSTNAME = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
function parseURL(url, base) {
    return new URL(String(url).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"), base && String(base).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"));
}
const Internal = Symbol("NextURLInternal");
class NextURL {
    constructor(input, baseOrOpts, opts){
        let base;
        let options;
        if (typeof baseOrOpts === "object" && "pathname" in baseOrOpts || typeof baseOrOpts === "string") {
            base = baseOrOpts;
            options = opts || {};
        } else {
            options = opts || baseOrOpts || {};
        }
        this[Internal] = {
            url: parseURL(input, base ?? options.base),
            options: options,
            basePath: ""
        };
        this.analyze();
    }
    analyze() {
        var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig, _this_Internal_domainLocale, _this_Internal_options_nextConfig_i18n1, _this_Internal_options_nextConfig1;
        const info = getNextPathnameInfo(this[Internal].url.pathname, {
            nextConfig: this[Internal].options.nextConfig,
            parseData: !undefined,
            i18nProvider: this[Internal].options.i18nProvider
        });
        const hostname = getHostname(this[Internal].url, this[Internal].options.headers);
        this[Internal].domainLocale = this[Internal].options.i18nProvider ? this[Internal].options.i18nProvider.detectDomainLocale(hostname) : detectDomainLocale((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.domains, hostname);
        const defaultLocale = ((_this_Internal_domainLocale = this[Internal].domainLocale) == null ? void 0 : _this_Internal_domainLocale.defaultLocale) || ((_this_Internal_options_nextConfig1 = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n1 = _this_Internal_options_nextConfig1.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n1.defaultLocale);
        this[Internal].url.pathname = info.pathname;
        this[Internal].defaultLocale = defaultLocale;
        this[Internal].basePath = info.basePath ?? "";
        this[Internal].buildId = info.buildId;
        this[Internal].locale = info.locale ?? defaultLocale;
        this[Internal].trailingSlash = info.trailingSlash;
    }
    formatPathname() {
        return formatNextPathnameInfo({
            basePath: this[Internal].basePath,
            buildId: this[Internal].buildId,
            defaultLocale: !this[Internal].options.forceLocale ? this[Internal].defaultLocale : undefined,
            locale: this[Internal].locale,
            pathname: this[Internal].url.pathname,
            trailingSlash: this[Internal].trailingSlash
        });
    }
    formatSearch() {
        return this[Internal].url.search;
    }
    get buildId() {
        return this[Internal].buildId;
    }
    set buildId(buildId) {
        this[Internal].buildId = buildId;
    }
    get locale() {
        return this[Internal].locale ?? "";
    }
    set locale(locale) {
        var _this_Internal_options_nextConfig_i18n, _this_Internal_options_nextConfig;
        if (!this[Internal].locale || !((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.locales.includes(locale))) {
            throw new TypeError(`The NextURL configuration includes no locale "${locale}"`);
        }
        this[Internal].locale = locale;
    }
    get defaultLocale() {
        return this[Internal].defaultLocale;
    }
    get domainLocale() {
        return this[Internal].domainLocale;
    }
    get searchParams() {
        return this[Internal].url.searchParams;
    }
    get host() {
        return this[Internal].url.host;
    }
    set host(value) {
        this[Internal].url.host = value;
    }
    get hostname() {
        return this[Internal].url.hostname;
    }
    set hostname(value) {
        this[Internal].url.hostname = value;
    }
    get port() {
        return this[Internal].url.port;
    }
    set port(value) {
        this[Internal].url.port = value;
    }
    get protocol() {
        return this[Internal].url.protocol;
    }
    set protocol(value) {
        this[Internal].url.protocol = value;
    }
    get href() {
        const pathname = this.formatPathname();
        const search = this.formatSearch();
        return `${this.protocol}//${this.host}${pathname}${search}${this.hash}`;
    }
    set href(url) {
        this[Internal].url = parseURL(url);
        this.analyze();
    }
    get origin() {
        return this[Internal].url.origin;
    }
    get pathname() {
        return this[Internal].url.pathname;
    }
    set pathname(value) {
        this[Internal].url.pathname = value;
    }
    get hash() {
        return this[Internal].url.hash;
    }
    set hash(value) {
        this[Internal].url.hash = value;
    }
    get search() {
        return this[Internal].url.search;
    }
    set search(value) {
        this[Internal].url.search = value;
    }
    get password() {
        return this[Internal].url.password;
    }
    set password(value) {
        this[Internal].url.password = value;
    }
    get username() {
        return this[Internal].url.username;
    }
    set username(value) {
        this[Internal].url.username = value;
    }
    get basePath() {
        return this[Internal].basePath;
    }
    set basePath(value) {
        this[Internal].basePath = value.startsWith("/") ? value : `/${value}`;
    }
    toString() {
        return this.href;
    }
    toJSON() {
        return this.href;
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            href: this.href,
            origin: this.origin,
            protocol: this.protocol,
            username: this.username,
            password: this.password,
            host: this.host,
            hostname: this.hostname,
            port: this.port,
            pathname: this.pathname,
            search: this.search,
            searchParams: this.searchParams,
            hash: this.hash
        };
    }
    clone() {
        return new NextURL(String(this), this[Internal].options);
    }
} //# sourceMappingURL=next-url.js.map

// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/spec-extension/cookies.js
var spec_extension_cookies = __webpack_require__(9782);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/spec-extension/request.js




const INTERNALS = Symbol("internal request");
class NextRequest extends Request {
    constructor(input, init = {}){
        const url = typeof input !== "string" && "url" in input ? input.url : String(input);
        validateURL(url);
        if (input instanceof Request) super(input, init);
        else super(url, init);
        const nextUrl = new NextURL(url, {
            headers: toNodeOutgoingHttpHeaders(this.headers),
            nextConfig: init.nextConfig
        });
        this[INTERNALS] = {
            cookies: new spec_extension_cookies/* RequestCookies */.q(this.headers),
            geo: init.geo || {},
            ip: init.ip,
            nextUrl,
            url:  false ? 0 : nextUrl.toString()
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            geo: this.geo,
            ip: this.ip,
            nextUrl: this.nextUrl,
            url: this.url,
            // rest of props come from Request
            bodyUsed: this.bodyUsed,
            cache: this.cache,
            credentials: this.credentials,
            destination: this.destination,
            headers: Object.fromEntries(this.headers),
            integrity: this.integrity,
            keepalive: this.keepalive,
            method: this.method,
            mode: this.mode,
            redirect: this.redirect,
            referrer: this.referrer,
            referrerPolicy: this.referrerPolicy,
            signal: this.signal
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    get geo() {
        return this[INTERNALS].geo;
    }
    get ip() {
        return this[INTERNALS].ip;
    }
    get nextUrl() {
        return this[INTERNALS].nextUrl;
    }
    /**
   * @deprecated
   * `page` has been deprecated in favour of `URLPattern`.
   * Read more: https://nextjs.org/docs/messages/middleware-request-page
   */ get page() {
        throw new RemovedPageError();
    }
    /**
   * @deprecated
   * `ua` has been removed in favour of \`userAgent\` function.
   * Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
   */ get ua() {
        throw new RemovedUAError();
    }
    get url() {
        return this[INTERNALS].url;
    }
} //# sourceMappingURL=request.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/spec-extension/response.js



const response_INTERNALS = Symbol("internal response");
const REDIRECTS = new Set([
    301,
    302,
    303,
    307,
    308
]);
function handleMiddlewareField(init, headers) {
    var _init_request;
    if (init == null ? void 0 : (_init_request = init.request) == null ? void 0 : _init_request.headers) {
        if (!(init.request.headers instanceof Headers)) {
            throw new Error("request.headers must be an instance of Headers");
        }
        const keys = [];
        for (const [key, value] of init.request.headers){
            headers.set("x-middleware-request-" + key, value);
            keys.push(key);
        }
        headers.set("x-middleware-override-headers", keys.join(","));
    }
}
class NextResponse extends Response {
    constructor(body, init = {}){
        super(body, init);
        this[response_INTERNALS] = {
            cookies: new spec_extension_cookies/* ResponseCookies */.n(this.headers),
            url: init.url ? new NextURL(init.url, {
                headers: toNodeOutgoingHttpHeaders(this.headers),
                nextConfig: init.nextConfig
            }) : undefined
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            url: this.url,
            // rest of props come from Response
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: Object.fromEntries(this.headers),
            ok: this.ok,
            redirected: this.redirected,
            status: this.status,
            statusText: this.statusText,
            type: this.type
        };
    }
    get cookies() {
        return this[response_INTERNALS].cookies;
    }
    static json(body, init) {
        const response = Response.json(body, init);
        return new NextResponse(response.body, response);
    }
    static redirect(url, init) {
        const status = typeof init === "number" ? init : (init == null ? void 0 : init.status) ?? 307;
        if (!REDIRECTS.has(status)) {
            throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        const initObj = typeof init === "object" ? init : {};
        const headers = new Headers(initObj == null ? void 0 : initObj.headers);
        headers.set("Location", validateURL(url));
        return new NextResponse(null, {
            ...initObj,
            headers,
            status
        });
    }
    static rewrite(destination, init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-rewrite", validateURL(destination));
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
    static next(init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-next", "1");
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
} //# sourceMappingURL=response.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/relativize-url.js
/**
 * Given a URL as a string and a base URL it will make the URL relative
 * if the parsed protocol and host is the same as the one in the base
 * URL. Otherwise it returns the same URL string.
 */ function relativizeURL(url, base) {
    const baseURL = typeof base === "string" ? new URL(base) : base;
    const relative = new URL(url, base);
    const origin = baseURL.protocol + "//" + baseURL.host;
    return relative.protocol + "//" + relative.host === origin ? relative.toString().replace(origin, "") : relative.toString();
} //# sourceMappingURL=relativize-url.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/app-router-headers.js
const RSC_HEADER = "RSC";
const ACTION = "Next-Action";
const NEXT_ROUTER_STATE_TREE = "Next-Router-State-Tree";
const NEXT_ROUTER_PREFETCH_HEADER = "Next-Router-Prefetch";
const NEXT_URL = "Next-Url";
const RSC_CONTENT_TYPE_HEADER = "text/x-component";
const RSC_VARY_HEADER = RSC_HEADER + ", " + NEXT_ROUTER_STATE_TREE + ", " + NEXT_ROUTER_PREFETCH_HEADER + ", " + NEXT_URL;
const FLIGHT_PARAMETERS = [
    [
        RSC_HEADER
    ],
    [
        NEXT_ROUTER_STATE_TREE
    ],
    [
        NEXT_ROUTER_PREFETCH_HEADER
    ]
];
const NEXT_RSC_UNION_QUERY = "_rsc";
const NEXT_DID_POSTPONE_HEADER = "x-nextjs-postponed"; //# sourceMappingURL=app-router-headers.js.map

// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/modern-browserslist-target.js
var modern_browserslist_target = __webpack_require__(6455);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/constants.js


const COMPILER_NAMES = {
    client: "client",
    server: "server",
    edgeServer: "edge-server"
};
/**
 * Headers that are set by the Next.js server and should be stripped from the
 * request headers going to the user's application.
 */ const constants_INTERNAL_HEADERS = (/* unused pure expression or super */ null && ([
    "x-invoke-error",
    "x-invoke-output",
    "x-invoke-path",
    "x-invoke-query",
    "x-invoke-status",
    "x-middleware-invoke"
]));
const COMPILER_INDEXES = {
    [COMPILER_NAMES.client]: 0,
    [COMPILER_NAMES.server]: 1,
    [COMPILER_NAMES.edgeServer]: 2
};
const PHASE_EXPORT = "phase-export";
const PHASE_PRODUCTION_BUILD = "phase-production-build";
const PHASE_PRODUCTION_SERVER = "phase-production-server";
const PHASE_DEVELOPMENT_SERVER = "phase-development-server";
const PHASE_TEST = "phase-test";
const PHASE_INFO = "phase-info";
const PAGES_MANIFEST = "pages-manifest.json";
const APP_PATHS_MANIFEST = "app-paths-manifest.json";
const APP_PATH_ROUTES_MANIFEST = "app-path-routes-manifest.json";
const BUILD_MANIFEST = "build-manifest.json";
const APP_BUILD_MANIFEST = "app-build-manifest.json";
const FUNCTIONS_CONFIG_MANIFEST = "functions-config-manifest.json";
const SUBRESOURCE_INTEGRITY_MANIFEST = "subresource-integrity-manifest";
const NEXT_FONT_MANIFEST = "next-font-manifest";
const EXPORT_MARKER = "export-marker.json";
const EXPORT_DETAIL = "export-detail.json";
const PRERENDER_MANIFEST = "prerender-manifest.json";
const ROUTES_MANIFEST = "routes-manifest.json";
const IMAGES_MANIFEST = "images-manifest.json";
const SERVER_FILES_MANIFEST = "required-server-files.json";
const DEV_CLIENT_PAGES_MANIFEST = "_devPagesManifest.json";
const MIDDLEWARE_MANIFEST = "middleware-manifest.json";
const DEV_MIDDLEWARE_MANIFEST = "_devMiddlewareManifest.json";
const REACT_LOADABLE_MANIFEST = "react-loadable-manifest.json";
const FONT_MANIFEST = "font-manifest.json";
const SERVER_DIRECTORY = "server";
const CONFIG_FILES = (/* unused pure expression or super */ null && ([
    "next.config.js",
    "next.config.mjs"
]));
const BUILD_ID_FILE = "BUILD_ID";
const BLOCKED_PAGES = (/* unused pure expression or super */ null && ([
    "/_document",
    "/_app",
    "/_error"
]));
const CLIENT_PUBLIC_FILES_PATH = "public";
const CLIENT_STATIC_FILES_PATH = "static";
const STRING_LITERAL_DROP_BUNDLE = "__NEXT_DROP_CLIENT_FILE__";
const NEXT_BUILTIN_DOCUMENT = "__NEXT_BUILTIN_DOCUMENT__";
const BARREL_OPTIMIZATION_PREFIX = "__barrel_optimize__";
// server/[entry]/page_client-reference-manifest.js
const CLIENT_REFERENCE_MANIFEST = "client-reference-manifest";
// server/server-reference-manifest
const SERVER_REFERENCE_MANIFEST = "server-reference-manifest";
// server/middleware-build-manifest.js
const MIDDLEWARE_BUILD_MANIFEST = "middleware-build-manifest";
// server/middleware-react-loadable-manifest.js
const MIDDLEWARE_REACT_LOADABLE_MANIFEST = "middleware-react-loadable-manifest";
// static/runtime/main.js
const CLIENT_STATIC_FILES_RUNTIME_MAIN = "main";
const CLIENT_STATIC_FILES_RUNTIME_MAIN_APP = "" + CLIENT_STATIC_FILES_RUNTIME_MAIN + "-app";
// next internal client components chunk for layouts
const APP_CLIENT_INTERNALS = "app-pages-internals";
// static/runtime/react-refresh.js
const CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH = "react-refresh";
// static/runtime/amp.js
const CLIENT_STATIC_FILES_RUNTIME_AMP = "amp";
// static/runtime/webpack.js
const CLIENT_STATIC_FILES_RUNTIME_WEBPACK = "webpack";
// static/runtime/polyfills.js
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS = "polyfills";
const CLIENT_STATIC_FILES_RUNTIME_POLYFILLS_SYMBOL = Symbol(CLIENT_STATIC_FILES_RUNTIME_POLYFILLS);
const EDGE_RUNTIME_WEBPACK = "edge-runtime-webpack";
const STATIC_PROPS_ID = "__N_SSG";
const SERVER_PROPS_ID = "__N_SSP";
const GOOGLE_FONT_PROVIDER = "https://fonts.googleapis.com/";
const OPTIMIZED_FONT_PROVIDERS = [
    {
        url: GOOGLE_FONT_PROVIDER,
        preconnect: "https://fonts.gstatic.com"
    },
    {
        url: "https://use.typekit.net",
        preconnect: "https://use.typekit.net"
    }
];
const DEFAULT_SERIF_FONT = {
    name: "Times New Roman",
    xAvgCharWidth: 821,
    azAvgWidth: 854.3953488372093,
    unitsPerEm: 2048
};
const DEFAULT_SANS_SERIF_FONT = {
    name: "Arial",
    xAvgCharWidth: 904,
    azAvgWidth: 934.5116279069767,
    unitsPerEm: 2048
};
const STATIC_STATUS_PAGES = (/* unused pure expression or super */ null && ([
    "/500"
]));
const TRACE_OUTPUT_VERSION = 1;
// in `MB`
const TURBO_TRACE_DEFAULT_MEMORY_LIMIT = 6000;
const RSC_MODULE_TYPES = {
    client: "client",
    server: "server"
};
// comparing
// https://nextjs.org/docs/api-reference/edge-runtime
// with
// https://nodejs.org/docs/latest/api/globals.html
const EDGE_UNSUPPORTED_NODE_APIS = (/* unused pure expression or super */ null && ([
    "clearImmediate",
    "setImmediate",
    "BroadcastChannel",
    "ByteLengthQueuingStrategy",
    "CompressionStream",
    "CountQueuingStrategy",
    "DecompressionStream",
    "DomException",
    "MessageChannel",
    "MessageEvent",
    "MessagePort",
    "ReadableByteStreamController",
    "ReadableStreamBYOBRequest",
    "ReadableStreamDefaultController",
    "TransformStreamDefaultController",
    "WritableStreamDefaultController"
]));
const SYSTEM_ENTRYPOINTS = new Set([
    CLIENT_STATIC_FILES_RUNTIME_MAIN,
    CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH,
    CLIENT_STATIC_FILES_RUNTIME_AMP,
    CLIENT_STATIC_FILES_RUNTIME_MAIN_APP
]); //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/internal-utils.js


const INTERNAL_QUERY_NAMES = [
    "__nextFallback",
    "__nextLocale",
    "__nextInferredLocaleFromDefault",
    "__nextDefaultLocale",
    "__nextIsNotFound",
    NEXT_RSC_UNION_QUERY
];
const EDGE_EXTENDED_INTERNAL_QUERY_NAMES = [
    "__nextDataReq"
];
function stripInternalQueries(query) {
    for (const name of INTERNAL_QUERY_NAMES){
        delete query[name];
    }
}
function stripInternalSearchParams(url, isEdge) {
    const isStringUrl = typeof url === "string";
    const instance = isStringUrl ? new URL(url) : url;
    for (const name of INTERNAL_QUERY_NAMES){
        instance.searchParams.delete(name);
    }
    if (isEdge) {
        for (const name of EDGE_EXTENDED_INTERNAL_QUERY_NAMES){
            instance.searchParams.delete(name);
        }
    }
    return isStringUrl ? instance.toString() : instance;
}
/**
 * Strip internal headers from the request headers.
 *
 * @param headers the headers to strip of internal headers
 */ function stripInternalHeaders(headers) {
    for (const key of INTERNAL_HEADERS){
        delete headers[key];
    }
} //# sourceMappingURL=internal-utils.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/router/utils/app-paths.js


/**
 * Normalizes an app route so it represents the actual request path. Essentially
 * performing the following transformations:
 *
 * - `/(dashboard)/user/[id]/page` to `/user/[id]`
 * - `/(dashboard)/account/page` to `/account`
 * - `/user/[id]/page` to `/user/[id]`
 * - `/account/page` to `/account`
 * - `/page` to `/`
 * - `/(dashboard)/user/[id]/route` to `/user/[id]`
 * - `/(dashboard)/account/route` to `/account`
 * - `/user/[id]/route` to `/user/[id]`
 * - `/account/route` to `/account`
 * - `/route` to `/`
 * - `/` to `/`
 *
 * @param route the app route to normalize
 * @returns the normalized pathname
 */ function normalizeAppPath(route) {
    return ensureLeadingSlash(route.split("/").reduce((pathname, segment, index, segments)=>{
        // Empty segments are ignored.
        if (!segment) {
            return pathname;
        }
        // Groups are ignored.
        if (isGroupSegment(segment)) {
            return pathname;
        }
        // Parallel segments are ignored.
        if (segment[0] === "@") {
            return pathname;
        }
        // The last segment (if it's a leaf) should be ignored.
        if ((segment === "page" || segment === "route") && index === segments.length - 1) {
            return pathname;
        }
        return pathname + "/" + segment;
    }, ""));
}
/**
 * Strips the `.rsc` extension if it's in the pathname.
 * Since this function is used on full urls it checks `?` for searchParams handling.
 */ function normalizeRscURL(url) {
    return url.replace(/\.rsc($|\?)/, "$1");
} //# sourceMappingURL=app-paths.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/lib/constants.js
const NEXT_QUERY_PARAM_PREFIX = "nxtP";
const PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate";
const PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER = "x-prerender-revalidate-if-generated";
const RSC_PREFETCH_SUFFIX = ".prefetch.rsc";
const RSC_SUFFIX = ".rsc";
const NEXT_DATA_SUFFIX = ".json";
const NEXT_META_SUFFIX = ".meta";
const NEXT_BODY_SUFFIX = ".body";
const NEXT_CACHE_TAGS_HEADER = "x-next-cache-tags";
const NEXT_CACHE_SOFT_TAGS_HEADER = "x-next-cache-soft-tags";
const NEXT_CACHE_REVALIDATED_TAGS_HEADER = "x-next-revalidated-tags";
const NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER = "x-next-revalidate-tag-token";
const NEXT_CACHE_TAG_MAX_LENGTH = 256;
const NEXT_CACHE_SOFT_TAG_MAX_LENGTH = 1024;
const NEXT_CACHE_IMPLICIT_TAG_ID = "_N_T_";
// in seconds
const CACHE_ONE_YEAR = 31536000;
// Patterns to detect middleware files
const MIDDLEWARE_FILENAME = "middleware";
const MIDDLEWARE_LOCATION_REGEXP = (/* unused pure expression or super */ null && (`(?:src/)?${MIDDLEWARE_FILENAME}`));
// Pattern to detect instrumentation hooks file
const INSTRUMENTATION_HOOK_FILENAME = "instrumentation";
// Because on Windows absolute paths in the generated code can break because of numbers, eg 1 in the path,
// we have to use a private alias
const PAGES_DIR_ALIAS = "private-next-pages";
const DOT_NEXT_ALIAS = "private-dot-next";
const ROOT_DIR_ALIAS = "private-next-root-dir";
const APP_DIR_ALIAS = "private-next-app-dir";
const RSC_MOD_REF_PROXY_ALIAS = "private-next-rsc-mod-ref-proxy";
const RSC_ACTION_VALIDATE_ALIAS = "private-next-rsc-action-validate";
const RSC_ACTION_PROXY_ALIAS = "private-next-rsc-action-proxy";
const RSC_ACTION_ENCRYPTION_ALIAS = "private-next-rsc-action-encryption";
const RSC_ACTION_CLIENT_WRAPPER_ALIAS = "private-next-rsc-action-client-wrapper";
const PUBLIC_DIR_MIDDLEWARE_CONFLICT = (/* unused pure expression or super */ null && (`You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict`));
const SSG_GET_INITIAL_PROPS_CONFLICT = (/* unused pure expression or super */ null && (`You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`));
const SERVER_PROPS_GET_INIT_PROPS_CONFLICT = (/* unused pure expression or super */ null && (`You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`));
const SERVER_PROPS_SSG_CONFLICT = (/* unused pure expression or super */ null && (`You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps`));
const STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = (/* unused pure expression or super */ null && (`can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props`));
const SERVER_PROPS_EXPORT_ERROR = (/* unused pure expression or super */ null && (`pages with \`getServerSideProps\` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export`));
const GSP_NO_RETURNED_VALUE = "Your `getStaticProps` function did not return an object. Did you forget to add a `return`?";
const GSSP_NO_RETURNED_VALUE = "Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?";
const UNSTABLE_REVALIDATE_RENAME_ERROR = (/* unused pure expression or super */ null && ("The `unstable_revalidate` property is available for general use.\n" + "Please use `revalidate` instead."));
const GSSP_COMPONENT_MEMBER_ERROR = (/* unused pure expression or super */ null && (`can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member`));
const NON_STANDARD_NODE_ENV = (/* unused pure expression or super */ null && (`You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env`));
const SSG_FALLBACK_EXPORT_ERROR = (/* unused pure expression or super */ null && (`Pages with \`fallback\` enabled in \`getStaticPaths\` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export`));
const ESLINT_DEFAULT_DIRS = (/* unused pure expression or super */ null && ([
    "app",
    "pages",
    "components",
    "lib",
    "src"
]));
const ESLINT_PROMPT_VALUES = [
    {
        title: "Strict",
        recommended: true,
        config: {
            extends: "next/core-web-vitals"
        }
    },
    {
        title: "Base",
        config: {
            extends: "next"
        }
    },
    {
        title: "Cancel",
        config: null
    }
];
const SERVER_RUNTIME = {
    edge: "edge",
    experimentalEdge: "experimental-edge",
    nodejs: "nodejs"
};
/**
 * The names of the webpack layers. These layers are the primitives for the
 * webpack chunks.
 */ const WEBPACK_LAYERS_NAMES = {
    /**
   * The layer for the shared code between the client and server bundles.
   */ shared: "shared",
    /**
   * React Server Components layer (rsc).
   */ reactServerComponents: "rsc",
    /**
   * Server Side Rendering layer for app (ssr).
   */ serverSideRendering: "ssr",
    /**
   * The browser client bundle layer for actions.
   */ actionBrowser: "action-browser",
    /**
   * The layer for the API routes.
   */ api: "api",
    /**
   * The layer for the middleware code.
   */ middleware: "middleware",
    /**
   * The layer for assets on the edge.
   */ edgeAsset: "edge-asset",
    /**
   * The browser client bundle layer for App directory.
   */ appPagesBrowser: "app-pages-browser",
    /**
   * The server bundle layer for metadata routes.
   */ appMetadataRoute: "app-metadata-route",
    /**
   * The layer for the server bundle for App Route handlers.
   */ appRouteHandler: "app-route-handler"
};
const WEBPACK_LAYERS = {
    ...WEBPACK_LAYERS_NAMES,
    GROUP: {
        server: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.appMetadataRoute,
            WEBPACK_LAYERS_NAMES.appRouteHandler
        ],
        nonClientServerTarget: [
            // plus middleware and pages api
            WEBPACK_LAYERS_NAMES.middleware,
            WEBPACK_LAYERS_NAMES.api
        ],
        app: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.appMetadataRoute,
            WEBPACK_LAYERS_NAMES.appRouteHandler,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser,
            WEBPACK_LAYERS_NAMES.shared
        ]
    }
};
const WEBPACK_RESOURCE_QUERIES = {
    edgeSSREntry: "__next_edge_ssr_entry__",
    metadata: "__next_metadata__",
    metadataRoute: "__next_metadata_route__",
    metadataImageMeta: "__next_metadata_image_meta__"
};
 //# sourceMappingURL=constants.js.map

// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/spec-extension/adapters/headers.js
var adapters_headers = __webpack_require__(8924);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/spec-extension/adapters/request-cookies.js
var request_cookies = __webpack_require__(4984);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/api-utils/index.js


/**
 *
 * @param res response object
 * @param statusCode `HTTP` status code of response
 */ function sendStatusCode(res, statusCode) {
    res.statusCode = statusCode;
    return res;
}
/**
 *
 * @param res response object
 * @param [statusOrUrl] `HTTP` status code of redirect
 * @param url URL of redirect
 */ function redirect(res, statusOrUrl, url) {
    if (typeof statusOrUrl === "string") {
        url = statusOrUrl;
        statusOrUrl = 307;
    }
    if (typeof statusOrUrl !== "number" || typeof url !== "string") {
        throw new Error(`Invalid redirect arguments. Please use a single argument URL, e.g. res.redirect('/destination') or use a status code and URL, e.g. res.redirect(307, '/destination').`);
    }
    res.writeHead(statusOrUrl, {
        Location: url
    });
    res.write(url);
    res.end();
    return res;
}
function checkIsOnDemandRevalidate(req, previewProps) {
    const headers = adapters_headers/* HeadersAdapter */.h.from(req.headers);
    const previewModeId = headers.get(PRERENDER_REVALIDATE_HEADER);
    const isOnDemandRevalidate = previewModeId === previewProps.previewModeId;
    const revalidateOnlyGenerated = headers.has(PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER);
    return {
        isOnDemandRevalidate,
        revalidateOnlyGenerated
    };
}
const COOKIE_NAME_PRERENDER_BYPASS = `__prerender_bypass`;
const COOKIE_NAME_PRERENDER_DATA = `__next_preview_data`;
const RESPONSE_LIMIT_DEFAULT = (/* unused pure expression or super */ null && (4 * 1024 * 1024));
const SYMBOL_PREVIEW_DATA = Symbol(COOKIE_NAME_PRERENDER_DATA);
const SYMBOL_CLEARED_COOKIES = Symbol(COOKIE_NAME_PRERENDER_BYPASS);
function clearPreviewData(res, options = {}) {
    if (SYMBOL_CLEARED_COOKIES in res) {
        return res;
    }
    const { serialize } = __webpack_require__(765);
    const previous = res.getHeader("Set-Cookie");
    res.setHeader(`Set-Cookie`, [
        ...typeof previous === "string" ? [
            previous
        ] : Array.isArray(previous) ? previous : [],
        serialize(COOKIE_NAME_PRERENDER_BYPASS, "", {
            // To delete a cookie, set `expires` to a date in the past:
            // https://tools.ietf.org/html/rfc6265#section-4.1.1
            // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
            expires: new Date(0),
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        }),
        serialize(COOKIE_NAME_PRERENDER_DATA, "", {
            // To delete a cookie, set `expires` to a date in the past:
            // https://tools.ietf.org/html/rfc6265#section-4.1.1
            // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
            expires: new Date(0),
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        })
    ]);
    Object.defineProperty(res, SYMBOL_CLEARED_COOKIES, {
        value: true,
        enumerable: false
    });
    return res;
}
/**
 * Custom error class
 */ class ApiError extends (/* unused pure expression or super */ null && (Error)) {
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
    }
}
/**
 * Sends error in `response`
 * @param res response object
 * @param statusCode of response
 * @param message of response
 */ function sendError(res, statusCode, message) {
    res.statusCode = statusCode;
    res.statusMessage = message;
    res.end(message);
}
/**
 * Execute getter function only if its needed
 * @param LazyProps `req` and `params` for lazyProp
 * @param prop name of property
 * @param getter function to get data
 */ function setLazyProp({ req }, prop, getter) {
    const opts = {
        configurable: true,
        enumerable: true
    };
    const optsReset = {
        ...opts,
        writable: true
    };
    Object.defineProperty(req, prop, {
        ...opts,
        get: ()=>{
            const value = getter();
            // we set the property on the object to avoid recalculating it
            Object.defineProperty(req, prop, {
                ...optsReset,
                value
            });
            return value;
        },
        set: (value)=>{
            Object.defineProperty(req, prop, {
                ...optsReset,
                value
            });
        }
    });
} //# sourceMappingURL=index.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/async-storage/draft-mode-provider.js

class DraftModeProvider {
    constructor(previewProps, req, cookies, mutableCookies){
        var _cookies_get;
        // The logic for draftMode() is very similar to tryGetPreviewData()
        // but Draft Mode does not have any data associated with it.
        const isOnDemandRevalidate = previewProps && checkIsOnDemandRevalidate(req, previewProps).isOnDemandRevalidate;
        const cookieValue = (_cookies_get = cookies.get(COOKIE_NAME_PRERENDER_BYPASS)) == null ? void 0 : _cookies_get.value;
        this.isEnabled = Boolean(!isOnDemandRevalidate && cookieValue && previewProps && cookieValue === previewProps.previewModeId);
        this._previewModeId = previewProps == null ? void 0 : previewProps.previewModeId;
        this._mutableCookies = mutableCookies;
    }
    enable() {
        if (!this._previewModeId) {
            throw new Error("Invariant: previewProps missing previewModeId this should never happen");
        }
        this._mutableCookies.set({
            name: COOKIE_NAME_PRERENDER_BYPASS,
            value: this._previewModeId,
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/"
        });
    }
    disable() {
        // To delete a cookie, set `expires` to a date in the past:
        // https://tools.ietf.org/html/rfc6265#section-4.1.1
        // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
        this._mutableCookies.set({
            name: COOKIE_NAME_PRERENDER_BYPASS,
            value: "",
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            expires: new Date(0)
        });
    }
} //# sourceMappingURL=draft-mode-provider.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/async-storage/request-async-storage-wrapper.js





function getHeaders(headers) {
    const cleaned = adapters_headers/* HeadersAdapter */.h.from(headers);
    for (const param of FLIGHT_PARAMETERS){
        cleaned.delete(param.toString().toLowerCase());
    }
    return adapters_headers/* HeadersAdapter */.h.seal(cleaned);
}
function getCookies(headers) {
    const cookies = new spec_extension_cookies/* RequestCookies */.q(adapters_headers/* HeadersAdapter */.h.from(headers));
    return request_cookies/* RequestCookiesAdapter */.Qb.seal(cookies);
}
function getMutableCookies(headers, onUpdateCookies) {
    const cookies = new spec_extension_cookies/* RequestCookies */.q(adapters_headers/* HeadersAdapter */.h.from(headers));
    return request_cookies/* MutableRequestCookiesAdapter */.vr.wrap(cookies, onUpdateCookies);
}
const RequestAsyncStorageWrapper = {
    /**
   * Wrap the callback with the given store so it can access the underlying
   * store using hooks.
   *
   * @param storage underlying storage object returned by the module
   * @param context context to seed the store
   * @param callback function to call within the scope of the context
   * @returns the result returned by the callback
   */ wrap (storage, { req, res, renderOpts }, callback) {
        let previewProps = undefined;
        if (renderOpts && "previewProps" in renderOpts) {
            // TODO: investigate why previewProps isn't on RenderOpts
            previewProps = renderOpts.previewProps;
        }
        function defaultOnUpdateCookies(cookies) {
            if (res) {
                res.setHeader("Set-Cookie", cookies);
            }
        }
        const cache = {};
        const store = {
            get headers () {
                if (!cache.headers) {
                    // Seal the headers object that'll freeze out any methods that could
                    // mutate the underlying data.
                    cache.headers = getHeaders(req.headers);
                }
                return cache.headers;
            },
            get cookies () {
                if (!cache.cookies) {
                    // Seal the cookies object that'll freeze out any methods that could
                    // mutate the underlying data.
                    cache.cookies = getCookies(req.headers);
                }
                return cache.cookies;
            },
            get mutableCookies () {
                if (!cache.mutableCookies) {
                    cache.mutableCookies = getMutableCookies(req.headers, (renderOpts == null ? void 0 : renderOpts.onUpdateCookies) || (res ? defaultOnUpdateCookies : undefined));
                }
                return cache.mutableCookies;
            },
            get draftMode () {
                if (!cache.draftMode) {
                    cache.draftMode = new DraftModeProvider(previewProps, req, this.cookies, this.mutableCookies);
                }
                return cache.draftMode;
            }
        };
        return storage.run(store, callback, store);
    }
}; //# sourceMappingURL=request-async-storage-wrapper.js.map

// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/request-async-storage.external.js
var request_async_storage_external = __webpack_require__(3992);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/lib/trace/constants.js
/**
 * Contains predefined constants for the trace span name in next/server.
 *
 * Currently, next/server/tracer is internal implementation only for tracking
 * next.js's implementation only with known span names defined here.
 **/ // eslint typescript has a bug with TS enums
/* eslint-disable no-shadow */ var BaseServerSpan;
(function(BaseServerSpan) {
    BaseServerSpan["handleRequest"] = "BaseServer.handleRequest";
    BaseServerSpan["run"] = "BaseServer.run";
    BaseServerSpan["pipe"] = "BaseServer.pipe";
    BaseServerSpan["getStaticHTML"] = "BaseServer.getStaticHTML";
    BaseServerSpan["render"] = "BaseServer.render";
    BaseServerSpan["renderToResponseWithComponents"] = "BaseServer.renderToResponseWithComponents";
    BaseServerSpan["renderToResponse"] = "BaseServer.renderToResponse";
    BaseServerSpan["renderToHTML"] = "BaseServer.renderToHTML";
    BaseServerSpan["renderError"] = "BaseServer.renderError";
    BaseServerSpan["renderErrorToResponse"] = "BaseServer.renderErrorToResponse";
    BaseServerSpan["renderErrorToHTML"] = "BaseServer.renderErrorToHTML";
    BaseServerSpan["render404"] = "BaseServer.render404";
})(BaseServerSpan || (BaseServerSpan = {}));
var LoadComponentsSpan;
(function(LoadComponentsSpan) {
    LoadComponentsSpan["loadDefaultErrorComponents"] = "LoadComponents.loadDefaultErrorComponents";
    LoadComponentsSpan["loadComponents"] = "LoadComponents.loadComponents";
})(LoadComponentsSpan || (LoadComponentsSpan = {}));
var NextServerSpan;
(function(NextServerSpan) {
    NextServerSpan["getRequestHandler"] = "NextServer.getRequestHandler";
    NextServerSpan["getServer"] = "NextServer.getServer";
    NextServerSpan["getServerRequestHandler"] = "NextServer.getServerRequestHandler";
    NextServerSpan["createServer"] = "createServer.createServer";
})(NextServerSpan || (NextServerSpan = {}));
var NextNodeServerSpan;
(function(NextNodeServerSpan) {
    NextNodeServerSpan["compression"] = "NextNodeServer.compression";
    NextNodeServerSpan["getBuildId"] = "NextNodeServer.getBuildId";
    NextNodeServerSpan["getLayoutOrPageModule"] = "NextNodeServer.getLayoutOrPageModule";
    NextNodeServerSpan["generateStaticRoutes"] = "NextNodeServer.generateStaticRoutes";
    NextNodeServerSpan["generateFsStaticRoutes"] = "NextNodeServer.generateFsStaticRoutes";
    NextNodeServerSpan["generatePublicRoutes"] = "NextNodeServer.generatePublicRoutes";
    NextNodeServerSpan["generateImageRoutes"] = "NextNodeServer.generateImageRoutes.route";
    NextNodeServerSpan["sendRenderResult"] = "NextNodeServer.sendRenderResult";
    NextNodeServerSpan["proxyRequest"] = "NextNodeServer.proxyRequest";
    NextNodeServerSpan["runApi"] = "NextNodeServer.runApi";
    NextNodeServerSpan["render"] = "NextNodeServer.render";
    NextNodeServerSpan["renderHTML"] = "NextNodeServer.renderHTML";
    NextNodeServerSpan["imageOptimizer"] = "NextNodeServer.imageOptimizer";
    NextNodeServerSpan["getPagePath"] = "NextNodeServer.getPagePath";
    NextNodeServerSpan["getRoutesManifest"] = "NextNodeServer.getRoutesManifest";
    NextNodeServerSpan["findPageComponents"] = "NextNodeServer.findPageComponents";
    NextNodeServerSpan["getFontManifest"] = "NextNodeServer.getFontManifest";
    NextNodeServerSpan["getServerComponentManifest"] = "NextNodeServer.getServerComponentManifest";
    NextNodeServerSpan["getRequestHandler"] = "NextNodeServer.getRequestHandler";
    NextNodeServerSpan["renderToHTML"] = "NextNodeServer.renderToHTML";
    NextNodeServerSpan["renderError"] = "NextNodeServer.renderError";
    NextNodeServerSpan["renderErrorToHTML"] = "NextNodeServer.renderErrorToHTML";
    NextNodeServerSpan["render404"] = "NextNodeServer.render404";
    NextNodeServerSpan["route"] = "route";
    NextNodeServerSpan["onProxyReq"] = "onProxyReq";
    NextNodeServerSpan["apiResolver"] = "apiResolver";
    NextNodeServerSpan["internalFetch"] = "internalFetch";
})(NextNodeServerSpan || (NextNodeServerSpan = {}));
var StartServerSpan;
(function(StartServerSpan) {
    StartServerSpan["startServer"] = "startServer.startServer";
})(StartServerSpan || (StartServerSpan = {}));
var RenderSpan;
(function(RenderSpan) {
    RenderSpan["getServerSideProps"] = "Render.getServerSideProps";
    RenderSpan["getStaticProps"] = "Render.getStaticProps";
    RenderSpan["renderToString"] = "Render.renderToString";
    RenderSpan["renderDocument"] = "Render.renderDocument";
    RenderSpan["createBodyResult"] = "Render.createBodyResult";
})(RenderSpan || (RenderSpan = {}));
var AppRenderSpan;
(function(AppRenderSpan) {
    AppRenderSpan["renderToString"] = "AppRender.renderToString";
    AppRenderSpan["renderToReadableStream"] = "AppRender.renderToReadableStream";
    AppRenderSpan["getBodyResult"] = "AppRender.getBodyResult";
    AppRenderSpan["fetch"] = "AppRender.fetch";
})(AppRenderSpan || (AppRenderSpan = {}));
var RouterSpan;
(function(RouterSpan) {
    RouterSpan["executeRoute"] = "Router.executeRoute";
})(RouterSpan || (RouterSpan = {}));
var NodeSpan;
(function(NodeSpan) {
    NodeSpan["runHandler"] = "Node.runHandler";
})(NodeSpan || (NodeSpan = {}));
var AppRouteRouteHandlersSpan;
(function(AppRouteRouteHandlersSpan) {
    AppRouteRouteHandlersSpan["runHandler"] = "AppRouteRouteHandlers.runHandler";
})(AppRouteRouteHandlersSpan || (AppRouteRouteHandlersSpan = {}));
var ResolveMetadataSpan;
(function(ResolveMetadataSpan) {
    ResolveMetadataSpan["generateMetadata"] = "ResolveMetadata.generateMetadata";
    ResolveMetadataSpan["generateViewport"] = "ResolveMetadata.generateViewport";
})(ResolveMetadataSpan || (ResolveMetadataSpan = {}));
// This list is used to filter out spans that are not relevant to the user
const NextVanillaSpanAllowlist = [
    "BaseServer.handleRequest",
    "Render.getServerSideProps",
    "Render.getStaticProps",
    "AppRender.fetch",
    "AppRender.getBodyResult",
    "Render.renderDocument",
    "Node.runHandler",
    "AppRouteRouteHandlers.runHandler",
    "ResolveMetadata.generateMetadata",
    "ResolveMetadata.generateViewport",
    "NextNodeServer.findPageComponents",
    "NextNodeServer.getLayoutOrPageModule"
];
 //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/lib/trace/tracer.js

let api;
// we want to allow users to use their own version of @opentelemetry/api if they
// want to, so we try to require it first, and if it fails we fall back to the
// version that is bundled with Next.js
// this is because @opentelemetry/api has to be synced with the version of
// @opentelemetry/tracing that is used, and we don't want to force users to use
// the version that is bundled with Next.js.
// the API is ~stable, so this should be fine
if (true) {
    api = __webpack_require__(541);
} else {}
const { context, propagation, trace, SpanStatusCode, SpanKind, ROOT_CONTEXT } = api;
const isPromise = (p)=>{
    return p !== null && typeof p === "object" && typeof p.then === "function";
};
const closeSpanWithError = (span, error)=>{
    if ((error == null ? void 0 : error.bubble) === true) {
        span.setAttribute("next.bubble", true);
    } else {
        if (error) {
            span.recordException(error);
        }
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error == null ? void 0 : error.message
        });
    }
    span.end();
};
/** we use this map to propagate attributes from nested spans to the top span */ const rootSpanAttributesStore = new Map();
const rootSpanIdKey = api.createContextKey("next.rootSpanId");
let lastSpanId = 0;
const getSpanId = ()=>lastSpanId++;
class NextTracerImpl {
    /**
   * Returns an instance to the trace with configured name.
   * Since wrap / trace can be defined in any place prior to actual trace subscriber initialization,
   * This should be lazily evaluated.
   */ getTracerInstance() {
        return trace.getTracer("next.js", "0.0.1");
    }
    getContext() {
        return context;
    }
    getActiveScopeSpan() {
        return trace.getSpan(context == null ? void 0 : context.active());
    }
    withPropagatedContext(carrier, fn, getter) {
        const activeContext = context.active();
        if (trace.getSpanContext(activeContext)) {
            // Active span is already set, too late to propagate.
            return fn();
        }
        const remoteContext = propagation.extract(activeContext, carrier, getter);
        return context.with(remoteContext, fn);
    }
    trace(...args) {
        var _trace_getSpanContext;
        const [type, fnOrOptions, fnOrEmpty] = args;
        // coerce options form overload
        const { fn, options } = typeof fnOrOptions === "function" ? {
            fn: fnOrOptions,
            options: {}
        } : {
            fn: fnOrEmpty,
            options: {
                ...fnOrOptions
            }
        };
        if (!NextVanillaSpanAllowlist.includes(type) && process.env.NEXT_OTEL_VERBOSE !== "1" || options.hideSpan) {
            return fn();
        }
        const spanName = options.spanName ?? type;
        // Trying to get active scoped span to assign parent. If option specifies parent span manually, will try to use it.
        let spanContext = this.getSpanContext((options == null ? void 0 : options.parentSpan) ?? this.getActiveScopeSpan());
        let isRootSpan = false;
        if (!spanContext) {
            spanContext = ROOT_CONTEXT;
            isRootSpan = true;
        } else if ((_trace_getSpanContext = trace.getSpanContext(spanContext)) == null ? void 0 : _trace_getSpanContext.isRemote) {
            isRootSpan = true;
        }
        const spanId = getSpanId();
        options.attributes = {
            "next.span_name": spanName,
            "next.span_type": type,
            ...options.attributes
        };
        return context.with(spanContext.setValue(rootSpanIdKey, spanId), ()=>this.getTracerInstance().startActiveSpan(spanName, options, (span)=>{
                const onCleanup = ()=>{
                    rootSpanAttributesStore.delete(spanId);
                };
                if (isRootSpan) {
                    rootSpanAttributesStore.set(spanId, new Map(Object.entries(options.attributes ?? {})));
                }
                try {
                    if (fn.length > 1) {
                        return fn(span, (err)=>closeSpanWithError(span, err));
                    }
                    const result = fn(span);
                    if (isPromise(result)) {
                        // If there's error make sure it throws
                        return result.then((res)=>{
                            span.end();
                            // Need to pass down the promise result,
                            // it could be react stream response with error { error, stream }
                            return res;
                        }).catch((err)=>{
                            closeSpanWithError(span, err);
                            throw err;
                        }).finally(onCleanup);
                    } else {
                        span.end();
                        onCleanup();
                    }
                    return result;
                } catch (err) {
                    closeSpanWithError(span, err);
                    onCleanup();
                    throw err;
                }
            }));
    }
    wrap(...args) {
        const tracer = this;
        const [name, options, fn] = args.length === 3 ? args : [
            args[0],
            {},
            args[1]
        ];
        if (!NextVanillaSpanAllowlist.includes(name) && process.env.NEXT_OTEL_VERBOSE !== "1") {
            return fn;
        }
        return function() {
            let optionsObj = options;
            if (typeof optionsObj === "function" && typeof fn === "function") {
                optionsObj = optionsObj.apply(this, arguments);
            }
            const lastArgId = arguments.length - 1;
            const cb = arguments[lastArgId];
            if (typeof cb === "function") {
                const scopeBoundCb = tracer.getContext().bind(context.active(), cb);
                return tracer.trace(name, optionsObj, (_span, done)=>{
                    arguments[lastArgId] = function(err) {
                        done == null ? void 0 : done(err);
                        return scopeBoundCb.apply(this, arguments);
                    };
                    return fn.apply(this, arguments);
                });
            } else {
                return tracer.trace(name, optionsObj, ()=>fn.apply(this, arguments));
            }
        };
    }
    startSpan(...args) {
        const [type, options] = args;
        const spanContext = this.getSpanContext((options == null ? void 0 : options.parentSpan) ?? this.getActiveScopeSpan());
        return this.getTracerInstance().startSpan(type, options, spanContext);
    }
    getSpanContext(parentSpan) {
        const spanContext = parentSpan ? trace.setSpan(context.active(), parentSpan) : undefined;
        return spanContext;
    }
    getRootSpanAttributes() {
        const spanId = context.active().getValue(rootSpanIdKey);
        return rootSpanAttributesStore.get(spanId);
    }
}
const getTracer = (()=>{
    const tracer = new NextTracerImpl();
    return ()=>tracer;
})();
 //# sourceMappingURL=tracer.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/adapter.js
















class NextRequestHint extends NextRequest {
    constructor(params){
        super(params.input, params.init);
        this.sourcePage = params.page;
    }
    get request() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
    respondWith() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
    waitUntil() {
        throw new PageSignatureError({
            page: this.sourcePage
        });
    }
}
const headersGetter = {
    keys: (headers)=>Array.from(headers.keys()),
    get: (headers, key)=>headers.get(key) ?? undefined
};
let propagator = (request, fn)=>{
    const tracer = getTracer();
    return tracer.withPropagatedContext(request.headers, fn, headersGetter);
};
let testApisIntercepted = false;
function ensureTestApisIntercepted() {
    if (!testApisIntercepted) {
        testApisIntercepted = true;
        if (process.env.NEXT_PRIVATE_TEST_PROXY === "true") {
            const { interceptTestApis, wrapRequestHandler } = __webpack_require__(8939);
            interceptTestApis();
            propagator = wrapRequestHandler(propagator);
        }
    }
}
async function adapter(params) {
    ensureTestApisIntercepted();
    await ensureInstrumentationRegistered();
    // TODO-APP: use explicit marker for this
    const isEdgeRendering = typeof self.__BUILD_MANIFEST !== "undefined";
    const prerenderManifest = typeof self.__PRERENDER_MANIFEST === "string" ? JSON.parse(self.__PRERENDER_MANIFEST) : undefined;
    params.request.url = normalizeRscURL(params.request.url);
    const requestUrl = new NextURL(params.request.url, {
        headers: params.request.headers,
        nextConfig: params.request.nextConfig
    });
    // Iterator uses an index to keep track of the current iteration. Because of deleting and appending below we can't just use the iterator.
    // Instead we use the keys before iteration.
    const keys = [
        ...requestUrl.searchParams.keys()
    ];
    for (const key of keys){
        const value = requestUrl.searchParams.getAll(key);
        if (key !== NEXT_QUERY_PARAM_PREFIX && key.startsWith(NEXT_QUERY_PARAM_PREFIX)) {
            const normalizedKey = key.substring(NEXT_QUERY_PARAM_PREFIX.length);
            requestUrl.searchParams.delete(normalizedKey);
            for (const val of value){
                requestUrl.searchParams.append(normalizedKey, val);
            }
            requestUrl.searchParams.delete(key);
        }
    }
    // Ensure users only see page requests, never data requests.
    const buildId = requestUrl.buildId;
    requestUrl.buildId = "";
    const isDataReq = params.request.headers["x-nextjs-data"];
    if (isDataReq && requestUrl.pathname === "/index") {
        requestUrl.pathname = "/";
    }
    const requestHeaders = fromNodeOutgoingHttpHeaders(params.request.headers);
    const flightHeaders = new Map();
    // Parameters should only be stripped for middleware
    if (!isEdgeRendering) {
        for (const param of FLIGHT_PARAMETERS){
            const key = param.toString().toLowerCase();
            const value = requestHeaders.get(key);
            if (value) {
                flightHeaders.set(key, requestHeaders.get(key));
                requestHeaders.delete(key);
            }
        }
    }
    const normalizeUrl =  false ? 0 : requestUrl;
    const request = new NextRequestHint({
        page: params.page,
        // Strip internal query parameters off the request.
        input: stripInternalSearchParams(normalizeUrl, true).toString(),
        init: {
            body: params.request.body,
            geo: params.request.geo,
            headers: requestHeaders,
            ip: params.request.ip,
            method: params.request.method,
            nextConfig: params.request.nextConfig,
            signal: params.request.signal
        }
    });
    /**
   * This allows to identify the request as a data request. The user doesn't
   * need to know about this property neither use it. We add it for testing
   * purposes.
   */ if (isDataReq) {
        Object.defineProperty(request, "__isData", {
            enumerable: false,
            value: true
        });
    }
    if (!globalThis.__incrementalCache && params.IncrementalCache) {
        globalThis.__incrementalCache = new params.IncrementalCache({
            appDir: true,
            fetchCache: true,
            minimalMode: "production" !== "development",
            fetchCacheKeyPrefix: undefined,
            dev: "production" === "development",
            requestHeaders: params.request.headers,
            requestProtocol: "https",
            getPrerenderManifest: ()=>{
                return {
                    version: -1,
                    routes: {},
                    dynamicRoutes: {},
                    notFoundRoutes: [],
                    preview: {
                        previewModeId: "development-id"
                    }
                };
            }
        });
    }
    const event = new NextFetchEvent({
        request,
        page: params.page
    });
    let response;
    let cookiesFromResponse;
    response = await propagator(request, ()=>{
        // we only care to make async storage available for middleware
        const isMiddleware = params.page === "/middleware" || params.page === "/src/middleware";
        if (isMiddleware) {
            return RequestAsyncStorageWrapper.wrap(request_async_storage_external/* requestAsyncStorage */.F, {
                req: request,
                renderOpts: {
                    onUpdateCookies: (cookies)=>{
                        cookiesFromResponse = cookies;
                    },
                    // @ts-expect-error: TODO: investigate why previewProps isn't on RenderOpts
                    previewProps: (prerenderManifest == null ? void 0 : prerenderManifest.preview) || {
                        previewModeId: "development-id",
                        previewModeEncryptionKey: "",
                        previewModeSigningKey: ""
                    }
                }
            }, ()=>params.handler(request, event));
        }
        return params.handler(request, event);
    });
    // check if response is a Response object
    if (response && !(response instanceof Response)) {
        throw new TypeError("Expected an instance of Response to be returned");
    }
    if (response && cookiesFromResponse) {
        response.headers.set("set-cookie", cookiesFromResponse);
    }
    /**
   * For rewrites we must always include the locale in the final pathname
   * so we re-create the NextURL forcing it to include it when the it is
   * an internal rewrite. Also we make sure the outgoing rewrite URL is
   * a data URL if the request was a data request.
   */ const rewrite = response == null ? void 0 : response.headers.get("x-middleware-rewrite");
    if (response && rewrite) {
        const rewriteUrl = new NextURL(rewrite, {
            forceLocale: true,
            headers: params.request.headers,
            nextConfig: params.request.nextConfig
        });
        if (true) {
            if (rewriteUrl.host === request.nextUrl.host) {
                rewriteUrl.buildId = buildId || rewriteUrl.buildId;
                response.headers.set("x-middleware-rewrite", String(rewriteUrl));
            }
        }
        /**
     * When the request is a data request we must show if there was a rewrite
     * with an internal header so the client knows which component to load
     * from the data request.
     */ const relativizedRewrite = relativizeURL(String(rewriteUrl), String(requestUrl));
        if (isDataReq && // if the rewrite is external and external rewrite
        // resolving config is enabled don't add this header
        // so the upstream app can set it instead
        !(undefined && 0)) {
            response.headers.set("x-nextjs-rewrite", relativizedRewrite);
        }
    }
    /**
   * For redirects we will not include the locale in case when it is the
   * default and we must also make sure the outgoing URL is a data one if
   * the incoming request was a data request.
   */ const redirect = response == null ? void 0 : response.headers.get("Location");
    if (response && redirect && !isEdgeRendering) {
        const redirectURL = new NextURL(redirect, {
            forceLocale: false,
            headers: params.request.headers,
            nextConfig: params.request.nextConfig
        });
        /**
     * Responses created from redirects have immutable headers so we have
     * to clone the response to be able to modify it.
     */ response = new Response(response.body, response);
        if (true) {
            if (redirectURL.host === request.nextUrl.host) {
                redirectURL.buildId = buildId || redirectURL.buildId;
                response.headers.set("Location", String(redirectURL));
            }
        }
        /**
     * When the request is a data request we can't use the location header as
     * it may end up with CORS error. Instead we map to an internal header so
     * the client knows the destination.
     */ if (isDataReq) {
            response.headers.delete("Location");
            response.headers.set("x-nextjs-redirect", relativizeURL(String(redirectURL), String(requestUrl)));
        }
    }
    const finalResponse = response ? response : NextResponse.next();
    // Flight headers are not overridable / removable so they are applied at the end.
    const middlewareOverrideHeaders = finalResponse.headers.get("x-middleware-override-headers");
    const overwrittenHeaders = [];
    if (middlewareOverrideHeaders) {
        for (const [key, value] of flightHeaders){
            finalResponse.headers.set(`x-middleware-request-${key}`, value);
            overwrittenHeaders.push(key);
        }
        if (overwrittenHeaders.length > 0) {
            finalResponse.headers.set("x-middleware-override-headers", middlewareOverrideHeaders + "," + overwrittenHeaders.join(","));
        }
    }
    return {
        response: finalResponse,
        waitUntil: Promise.all(event[waitUntilSymbol]),
        fetchMetrics: request.fetchMetrics
    };
} //# sourceMappingURL=adapter.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/pathToRegexp-Bu45OrlU.mjs
//#region src/compiled/path-to-regexp/index.js
function _(r) {
    for(var n = [], e = 0; e < r.length;){
        var a = r[e];
        if (a === "*" || a === "+" || a === "?") {
            n.push({
                type: "MODIFIER",
                index: e,
                value: r[e++]
            });
            continue;
        }
        if (a === "\\") {
            n.push({
                type: "ESCAPED_CHAR",
                index: e++,
                value: r[e++]
            });
            continue;
        }
        if (a === "{") {
            n.push({
                type: "OPEN",
                index: e,
                value: r[e++]
            });
            continue;
        }
        if (a === "}") {
            n.push({
                type: "CLOSE",
                index: e,
                value: r[e++]
            });
            continue;
        }
        if (a === ":") {
            for(var u = "", t = e + 1; t < r.length;){
                var c = r.charCodeAt(t);
                if (c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 95) {
                    u += r[t++];
                    continue;
                }
                break;
            }
            if (!u) throw new TypeError("Missing parameter name at ".concat(e));
            n.push({
                type: "NAME",
                index: e,
                value: u
            }), e = t;
            continue;
        }
        if (a === "(") {
            var o = 1, m = "", t = e + 1;
            if (r[t] === "?") throw new TypeError('Pattern cannot start with "?" at '.concat(t));
            for(; t < r.length;){
                if (r[t] === "\\") {
                    m += r[t++] + r[t++];
                    continue;
                }
                if (r[t] === ")") {
                    if (o--, o === 0) {
                        t++;
                        break;
                    }
                } else if (r[t] === "(" && (o++, r[t + 1] !== "?")) throw new TypeError("Capturing groups are not allowed at ".concat(t));
                m += r[t++];
            }
            if (o) throw new TypeError("Unbalanced pattern at ".concat(e));
            if (!m) throw new TypeError("Missing pattern at ".concat(e));
            n.push({
                type: "PATTERN",
                index: e,
                value: m
            }), e = t;
            continue;
        }
        n.push({
            type: "CHAR",
            index: e,
            value: r[e++]
        });
    }
    return n.push({
        type: "END",
        index: e,
        value: ""
    }), n;
}
function F(r, n) {
    n === void 0 && (n = {});
    for(var e = _(r), a = n.prefixes, u = a === void 0 ? "./" : a, t = n.delimiter, c = t === void 0 ? "/#?" : t, o = [], m = 0, h = 0, p = "", f = function(l) {
        if (h < e.length && e[h].type === l) return e[h++].value;
    }, w = function(l) {
        var v = f(l);
        if (v !== void 0) return v;
        var E = e[h], N = E.type, S = E.index;
        throw new TypeError("Unexpected ".concat(N, " at ").concat(S, ", expected ").concat(l));
    }, d = function() {
        for(var l = "", v; v = f("CHAR") || f("ESCAPED_CHAR");)l += v;
        return l;
    }, M = function(l) {
        for(var v = 0, E = c; v < E.length; v++){
            var N = E[v];
            if (l.indexOf(N) > -1) return !0;
        }
        return !1;
    }, A = function(l) {
        var v = o[o.length - 1], E = l || (v && typeof v == "string" ? v : "");
        if (v && !E) throw new TypeError('Must have text between two parameters, missing text after "'.concat(v.name, '"'));
        return !E || M(E) ? "[^".concat(s(c), "]+?") : "(?:(?!".concat(s(E), ")[^").concat(s(c), "])+?");
    }; h < e.length;){
        var T = f("CHAR"), x = f("NAME"), C = f("PATTERN");
        if (x || C) {
            var g = T || "";
            u.indexOf(g) === -1 && (p += g, g = ""), p && (o.push(p), p = ""), o.push({
                name: x || m++,
                prefix: g,
                suffix: "",
                pattern: C || A(g),
                modifier: f("MODIFIER") || ""
            });
            continue;
        }
        var i = T || f("ESCAPED_CHAR");
        if (i) {
            p += i;
            continue;
        }
        p && (o.push(p), p = "");
        if (f("OPEN")) {
            var g = d(), y = f("NAME") || "", O = f("PATTERN") || "", b = d();
            w("CLOSE"), o.push({
                name: y || (O ? m++ : ""),
                pattern: y && !O ? A(g) : O,
                prefix: g,
                suffix: b,
                modifier: f("MODIFIER") || ""
            });
            continue;
        }
        w("END");
    }
    return o;
}
function H(r, n) {
    var e = [];
    return I(P(r, e, n), e, n);
}
function I(r, n, e) {
    e === void 0 && (e = {});
    var a = e.decode, u = a === void 0 ? function(t) {
        return t;
    } : a;
    return function(t) {
        var c = r.exec(t);
        if (!c) return !1;
        for(var o = c[0], m = c.index, h = Object.create(null), p = function(w) {
            if (c[w] === void 0) return "continue";
            var d = n[w - 1];
            d.modifier === "*" || d.modifier === "+" ? h[d.name] = c[w].split(d.prefix + d.suffix).map(function(M) {
                return u(M, d);
            }) : h[d.name] = u(c[w], d);
        }, f = 1; f < c.length; f++)p(f);
        return {
            path: o,
            index: m,
            params: h
        };
    };
}
function s(r) {
    return r.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function D(r) {
    return r && r.sensitive ? "" : "i";
}
function $(r, n) {
    if (!n) return r;
    for(var e = /\((?:\?<(.*?)>)?(?!\?)/g, a = 0, u = e.exec(r.source); u;)n.push({
        name: u[1] || a++,
        prefix: "",
        suffix: "",
        modifier: "",
        pattern: ""
    }), u = e.exec(r.source);
    return r;
}
function W(r, n, e) {
    var a = r.map(function(u) {
        return P(u, n, e).source;
    });
    return new RegExp("(?:".concat(a.join("|"), ")"), D(e));
}
function L(r, n, e) {
    return U(F(r, e), n, e);
}
function U(r, n, e) {
    e === void 0 && (e = {});
    for(var a = e.strict, u = a === void 0 ? !1 : a, t = e.start, c = t === void 0 ? !0 : t, o = e.end, m = o === void 0 ? !0 : o, h = e.encode, p = h === void 0 ? function(v) {
        return v;
    } : h, f = e.delimiter, w = f === void 0 ? "/#?" : f, d = e.endsWith, M = d === void 0 ? "" : d, A = "[".concat(s(M), "]|$"), T = "[".concat(s(w), "]"), x = c ? "^" : "", C = 0, g = r; C < g.length; C++){
        var i = g[C];
        if (typeof i == "string") x += s(p(i));
        else {
            var R = s(p(i.prefix)), y = s(p(i.suffix));
            if (i.pattern) if (n && n.push(i), R || y) if (i.modifier === "+" || i.modifier === "*") {
                var O = i.modifier === "*" ? "?" : "";
                x += "(?:".concat(R, "((?:").concat(i.pattern, ")(?:").concat(y).concat(R, "(?:").concat(i.pattern, "))*)").concat(y, ")").concat(O);
            } else x += "(?:".concat(R, "(").concat(i.pattern, ")").concat(y, ")").concat(i.modifier);
            else {
                if (i.modifier === "+" || i.modifier === "*") throw new TypeError('Can not repeat "'.concat(i.name, '" without a prefix and suffix'));
                x += "(".concat(i.pattern, ")").concat(i.modifier);
            }
            else x += "(?:".concat(R).concat(y, ")").concat(i.modifier);
        }
    }
    if (m) u || (x += "".concat(T, "?")), x += e.endsWith ? "(?=".concat(A, ")") : "$";
    else {
        var b = r[r.length - 1], l = typeof b == "string" ? T.indexOf(b[b.length - 1]) > -1 : b === void 0;
        u || (x += "(?:".concat(T, "(?=").concat(A, "))?")), l || (x += "(?=".concat(T, "|").concat(A, ")"));
    }
    return new RegExp(x, D(e));
}
function P(r, n, e) {
    return r instanceof RegExp ? $(r, n) : Array.isArray(r) ? W(r, n, e) : L(r, n, e);
}
//#endregion
//#region src/pathToRegexp.ts
const pathToRegexp = (path)=>{
    try {
        return P(path);
    } catch (e) {
        throw new Error(`Invalid path: ${path}.\nConsult the documentation of path-to-regexp here: https://github.com/pillarjs/path-to-regexp/tree/6.x\n${e.message}`);
    }
};
/**
*
*/ function match(str, options) {
    try {
        return H(str, options);
    } catch (e) {
        throw new Error(`Invalid path and options: Consult the documentation of path-to-regexp here: https://github.com/pillarjs/path-to-regexp/tree/6.x\n${e.message}`);
    }
}
//#endregion
 //# sourceMappingURL=pathToRegexp-Bu45OrlU.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/pathMatcher-B0k8rNqO.mjs

//#region src/pathMatcher.ts
const precomputePathRegex = (patterns)=>{
    return patterns.map((pattern)=>pattern instanceof RegExp ? pattern : pathToRegexp(pattern));
};
/**
* Creates a function that matches paths against a set of patterns.
*
* @param patterns - A string, RegExp, or array of patterns to match against
* @returns A function that takes a pathname and returns true if it matches any of the patterns
*/ const createPathMatcher = (patterns)=>{
    const matchers = precomputePathRegex([
        patterns || ""
    ].flat().filter(Boolean));
    return (pathname)=>matchers.some((matcher)=>matcher.test(pathname));
};
//#endregion
 //# sourceMappingURL=pathMatcher-B0k8rNqO.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/routeMatcher.js


const createRouteMatcher = (routes)=>{
    if (typeof routes === "function") {
        return (req)=>routes(req);
    }
    const matcher = createPathMatcher(routes);
    return (req)=>matcher(req.nextUrl.pathname);
};
 //# sourceMappingURL=routeMatcher.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/runtimeEnvironment-BB2sO-19.mjs
//#region src/utils/runtimeEnvironment.ts
const isDevelopmentEnvironment = ()=>{
    try {
        return "production" === "development";
    } catch  {}
    return false;
};
const isTestEnvironment = ()=>{
    try {
        return "production" === "test";
    } catch  {}
    return false;
};
const isProductionEnvironment = ()=>{
    try {
        return "production" === "production";
    } catch  {}
    return false;
};
//#endregion
 //# sourceMappingURL=runtimeEnvironment-BB2sO-19.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/deprecated-BqlFbLHj.mjs

//#region src/deprecated.ts
/**
* Mark class method / function as deprecated.
*
* A console WARNING will be displayed when class method / function is invoked.
*
* Examples
* 1. Deprecate class method
* class Example {
*   getSomething = (arg1, arg2) => {
*       deprecated('Example.getSomething', 'Use `getSomethingElse` instead.');
*       return `getSomethingValue:${arg1 || '-'}:${arg2 || '-'}`;
*   };
* }
*
* 2. Deprecate function
* const getSomething = () => {
*   deprecated('getSomething', 'Use `getSomethingElse` instead.');
*   return 'getSomethingValue';
* };
*/ const displayedWarnings = /* @__PURE__ */ new Set();
const deprecated = (fnName, warning, key)=>{
    const hideWarning = isTestEnvironment() || isProductionEnvironment();
    const messageId = key ?? fnName;
    if (displayedWarnings.has(messageId) || hideWarning) return;
    displayedWarnings.add(messageId);
    console.warn(`Clerk - DEPRECATION WARNING: "${fnName}" is deprecated and will be removed in the next major release.\n${warning}`);
};
const deprecatedProperty = (cls, propName, warning, isStatic = false)=>{
    const target = isStatic ? cls : cls.prototype;
    let value = target[propName];
    Object.defineProperty(target, propName, {
        get () {
            deprecated(propName, warning, `${cls.name}:${propName}`);
            return value;
        },
        set (v) {
            value = v;
        }
    });
};
/**
* Mark object property as deprecated.
*
* A console WARNING will be displayed when object property is being accessed.
*
* 1. Deprecate object property
* const obj = { something: 'aloha' };
*
* deprecatedObjectProperty(obj, 'something', 'Use `somethingElse` instead.');
*/ const deprecatedObjectProperty = (obj, propName, warning, key)=>{
    let value = obj[propName];
    Object.defineProperty(obj, propName, {
        get () {
            deprecated(propName, warning, key);
            return value;
        },
        set (v) {
            value = v;
        }
    });
};
//#endregion
 //# sourceMappingURL=deprecated-BqlFbLHj.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/deprecated.mjs




;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/constants-ByUssRbE.mjs
//#region src/constants.ts
const constants_ByUssRbE_LEGACY_DEV_INSTANCE_SUFFIXES = [
    ".lcl.dev",
    ".lclstage.dev",
    ".lclclerk.com"
];
const CURRENT_DEV_INSTANCE_SUFFIXES = [
    ".accounts.dev",
    ".accountsstage.dev",
    ".accounts.lclclerk.com"
];
const DEV_OR_STAGING_SUFFIXES = [
    ".lcl.dev",
    ".stg.dev",
    ".lclstage.dev",
    ".stgstage.dev",
    ".dev.lclclerk.com",
    ".stg.lclclerk.com",
    ".accounts.lclclerk.com",
    "accountsstage.dev",
    "accounts.dev"
];
const LOCAL_ENV_SUFFIXES = [
    ".lcl.dev",
    "lclstage.dev",
    ".lclclerk.com",
    ".accounts.lclclerk.com"
];
const STAGING_ENV_SUFFIXES = [
    ".accountsstage.dev"
];
const LOCAL_API_URL = "https://api.lclclerk.com";
const STAGING_API_URL = "https://api.clerkstage.dev";
const PROD_API_URL = "https://api.clerk.com";
/**
* Returns the URL for a static image
* using the new img.clerk.com service
*/ function iconImageUrl(id, format = "svg") {
    return `https://img.clerk.com/static/${id}.${format}`;
}
//#endregion
 //# sourceMappingURL=constants-ByUssRbE.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/isomorphicAtob-DybBXGFR.mjs
//#region src/isomorphicAtob.ts
/**
* A function that decodes a string of data which has been encoded using base-64 encoding.
* Uses `atob` if available, otherwise uses `Buffer` from `global`. If neither are available, returns the data as-is.
*/ const isomorphicAtob = (data)=>{
    if (typeof atob !== "undefined" && typeof atob === "function") return atob(data);
    else if (typeof global !== "undefined" && global.Buffer) return new global.Buffer(data, "base64").toString();
    return data;
};
//#endregion
 //# sourceMappingURL=isomorphicAtob-DybBXGFR.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/isomorphicBtoa-Dr7WubZv.mjs
//#region src/isomorphicBtoa.ts
const isomorphicBtoa_Dr7WubZv_isomorphicBtoa = (data)=>{
    if (typeof btoa !== "undefined" && typeof btoa === "function") return btoa(data);
    else if (typeof global !== "undefined" && global.Buffer) return new global.Buffer(data).toString("base64");
    return data;
};
//#endregion
 //# sourceMappingURL=isomorphicBtoa-Dr7WubZv.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/keys-YNv6yjKk.mjs



//#region src/keys.ts
/** Prefix used for production publishable keys */ const PUBLISHABLE_KEY_LIVE_PREFIX = "pk_live_";
/** Prefix used for development publishable keys */ const PUBLISHABLE_KEY_TEST_PREFIX = "pk_test_";
/**
* Regular expression that matches development frontend API keys.
* Matches patterns like: foo-bar-13.clerk.accounts.dev.
*/ const PUBLISHABLE_FRONTEND_API_DEV_REGEX = /^(([a-z]+)-){2}([0-9]{1,2})\.clerk\.accounts([a-z.]*)(dev|com)$/i;
/**
* Converts a frontend API URL into a base64-encoded publishable key.
*
* @param frontendApi - The frontend API URL (e.g., 'clerk.example.com').
* @returns A base64-encoded publishable key with appropriate prefix (pk_live_ or pk_test_).
*/ function buildPublishableKey(frontendApi) {
    return `${PUBLISHABLE_FRONTEND_API_DEV_REGEX.test(frontendApi) || frontendApi.startsWith("clerk.") && LEGACY_DEV_INSTANCE_SUFFIXES.some((s)=>frontendApi.endsWith(s)) ? PUBLISHABLE_KEY_TEST_PREFIX : PUBLISHABLE_KEY_LIVE_PREFIX}${isomorphicBtoa(`${frontendApi}$`)}`;
}
/**
* Validates that a decoded publishable key has the correct format.
* The decoded value should be a frontend API followed by exactly one '$' at the end.
*
* @param decoded - The decoded publishable key string to validate.
* @returns `true` if the decoded key has valid format, `false` otherwise.
*/ function isValidDecodedPublishableKey(decoded) {
    if (!decoded.endsWith("$")) return false;
    const withoutTrailing = decoded.slice(0, -1);
    if (withoutTrailing.includes("$")) return false;
    return withoutTrailing.includes(".");
}
/**
* Parses and validates a publishable key, extracting the frontend API and instance type.
*
* @param key - The publishable key to parse.
* @param options - Configuration options for parsing.
* @param options.fatal
* @param options.domain
* @param options.proxyUrl
* @param options.isSatellite
* @returns Parsed publishable key object with instanceType and frontendApi, or null if invalid.
*
* @throws {Error} When options.fatal is true and key is missing or invalid.
*/ function parsePublishableKey(key, options = {}) {
    key = key || "";
    if (!key || !isPublishableKey(key)) {
        if (options.fatal && !key) throw new Error("Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys");
        if (options.fatal && !isPublishableKey(key)) throw new Error("Publishable key not valid.");
        return null;
    }
    const instanceType = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) ? "production" : "development";
    let decodedFrontendApi;
    try {
        decodedFrontendApi = isomorphicAtob(key.split("_")[2]);
    } catch  {
        if (options.fatal) throw new Error("Publishable key not valid: Failed to decode key.");
        return null;
    }
    if (!isValidDecodedPublishableKey(decodedFrontendApi)) {
        if (options.fatal) throw new Error("Publishable key not valid: Decoded key has invalid format.");
        return null;
    }
    let frontendApi = decodedFrontendApi.slice(0, -1);
    if (options.proxyUrl) frontendApi = options.proxyUrl;
    else if (instanceType !== "development" && options.domain && options.isSatellite) frontendApi = `clerk.${options.domain}`;
    return {
        instanceType,
        frontendApi
    };
}
/**
* Checks if the provided key is a valid publishable key.
*
* @param key - The key to be checked. Defaults to an empty string if not provided.
* @returns `true` if 'key' is a valid publishable key, `false` otherwise.
*/ function isPublishableKey(key = "") {
    try {
        if (!(key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) || key.startsWith(PUBLISHABLE_KEY_TEST_PREFIX))) return false;
        const parts = key.split("_");
        if (parts.length !== 3) return false;
        const encodedPart = parts[2];
        if (!encodedPart) return false;
        return isValidDecodedPublishableKey(isomorphicAtob(encodedPart));
    } catch  {
        return false;
    }
}
/**
* Creates a memoized cache for checking if URLs are development or staging environments.
* Uses a Map to cache results for better performance on repeated checks.
*
* @returns An object with an isDevOrStagingUrl method that checks if a URL is dev/staging.
*/ function createDevOrStagingUrlCache() {
    const devOrStagingUrlCache = /* @__PURE__ */ new Map();
    return {
        isDevOrStagingUrl: (url)=>{
            if (!url) return false;
            const hostname = typeof url === "string" ? url : url.hostname;
            let res = devOrStagingUrlCache.get(hostname);
            if (res === void 0) {
                res = DEV_OR_STAGING_SUFFIXES.some((s)=>hostname.endsWith(s));
                devOrStagingUrlCache.set(hostname, res);
            }
            return res;
        }
    };
}
/**
* Checks if a publishable key is for a development environment.
* Supports both legacy format (test_) and new format (pk_test_).
*
* @param apiKey - The API key to check.
* @returns `true` if the key is for development, `false` otherwise.
*/ function isDevelopmentFromPublishableKey(apiKey) {
    return apiKey.startsWith("test_") || apiKey.startsWith("pk_test_");
}
/**
* Checks if a publishable key is for a production environment.
* Supports both legacy format (live_) and new format (pk_live_).
*
* @param apiKey - The API key to check.
* @returns `true` if the key is for production, `false` otherwise.
*/ function isProductionFromPublishableKey(apiKey) {
    return apiKey.startsWith("live_") || apiKey.startsWith("pk_live_");
}
/**
* Checks if a secret key is for a development environment.
* Supports both legacy format (test_) and new format (sk_test_).
*
* @param apiKey - The secret key to check.
* @returns `true` if the key is for development, `false` otherwise.
*/ function isDevelopmentFromSecretKey(apiKey) {
    return apiKey.startsWith("test_") || apiKey.startsWith("sk_test_");
}
/**
* Checks if a secret key is for a production environment.
* Supports both legacy format (live_) and new format (sk_live_).
*
* @param apiKey - The secret key to check.
* @returns `true` if the key is for production, `false` otherwise.
*/ function isProductionFromSecretKey(apiKey) {
    return apiKey.startsWith("live_") || apiKey.startsWith("sk_live_");
}
/**
* Generates a unique cookie suffix based on the publishable key using SHA-1 hashing.
* The suffix is base64-encoded and URL-safe (+ and / characters are replaced).
*
* @param publishableKey - The publishable key to generate suffix from.
* @param subtle - The SubtleCrypto interface to use for hashing (defaults to globalThis.crypto.subtle).
* @returns A promise that resolves to an 8-character URL-safe base64 string.
*/ async function getCookieSuffix(publishableKey, subtle = globalThis.crypto.subtle) {
    const data = new TextEncoder().encode(publishableKey);
    const digest = await subtle.digest("sha-1", data);
    return isomorphicBtoa_Dr7WubZv_isomorphicBtoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/gi, "-").replace(/\//gi, "_").substring(0, 8);
}
/**
* Creates a suffixed cookie name by appending the cookie suffix to the base name.
* Used to create unique cookie names based on the publishable key.
*
* @param cookieName - The base cookie name.
* @param cookieSuffix - The suffix to append (typically generated by getCookieSuffix).
* @returns The suffixed cookie name in format: `${cookieName}_${cookieSuffix}`.
*/ const getSuffixedCookieName = (cookieName, cookieSuffix)=>{
    return `${cookieName}_${cookieSuffix}`;
};
//#endregion
 //# sourceMappingURL=keys-YNv6yjKk.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/retry-DAlTROH9.mjs
//#region src/retry.ts
const defaultOptions = {
    initialDelay: 125,
    maxDelayBetweenRetries: 0,
    factor: 2,
    shouldRetry: (_, iteration)=>iteration < 5,
    retryImmediately: false,
    jitter: true
};
const RETRY_IMMEDIATELY_DELAY = 100;
const sleep = async (ms)=>new Promise((s)=>setTimeout(s, ms));
const applyJitter = (delay, jitter)=>{
    return jitter ? delay * (1 + Math.random()) : delay;
};
const createExponentialDelayAsyncFn = (opts)=>{
    let timesCalled = 0;
    const calculateDelayInMs = ()=>{
        const constant = opts.initialDelay;
        const base = opts.factor;
        let delay = constant * Math.pow(base, timesCalled);
        delay = applyJitter(delay, opts.jitter);
        return Math.min(opts.maxDelayBetweenRetries || delay, delay);
    };
    return async ()=>{
        await sleep(calculateDelayInMs());
        timesCalled++;
    };
};
/**
* Retries a callback until it succeeds or the shouldRetry function returns false.
* See {@link RetryOptions} for the available options.
*/ const retry = async (callback, options = {})=>{
    let iterations = 0;
    const { shouldRetry, initialDelay, maxDelayBetweenRetries, factor, retryImmediately, jitter, onBeforeRetry } = {
        ...defaultOptions,
        ...options
    };
    const delay = createExponentialDelayAsyncFn({
        initialDelay,
        maxDelayBetweenRetries,
        factor,
        jitter
    });
    while(true)try {
        return await callback();
    } catch (e) {
        iterations++;
        if (!shouldRetry(e, iterations)) throw e;
        if (onBeforeRetry) await onBeforeRetry(iterations);
        if (retryImmediately && iterations === 1) await sleep(applyJitter(RETRY_IMMEDIATELY_DELAY, jitter));
        else await delay();
    }
};
//#endregion
 //# sourceMappingURL=retry-DAlTROH9.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/retry.mjs



;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/error-74EhajFh.mjs
//#region src/errors/createErrorTypeGuard.ts
/**
* Creates a type guard function for any error class.
* The returned function can be called as a standalone function or as a method on an error object.
*
* @example
* ```typescript
* class MyError extends Error {}
* const isMyError = createErrorTypeGuard(MyError);
*
* // As a standalone function
* if (isMyError(error)) { ... }
*
* // As a method (when attached to error object)
* if (error.isMyError()) { ... }
* ```
*/ function createErrorTypeGuard(ErrorClass) {
    function typeGuard(error) {
        const target = error ?? this;
        if (!target) throw new TypeError(`${ErrorClass.kind || ErrorClass.name} type guard requires an error object`);
        return target instanceof ErrorClass;
    }
    return typeGuard;
}
//#endregion
//#region src/errors/clerkApiError.ts
/**
* This error contains the specific error message, code, and any additional metadata that was returned by the Clerk API.
*/ var ClerkAPIError = class {
    static{
        this.kind = "ClerkApiError";
    }
    constructor(json){
        const parsedError = {
            code: json.code,
            message: json.message,
            longMessage: json.long_message,
            meta: {
                paramName: json.meta?.param_name,
                sessionId: json.meta?.session_id,
                emailAddresses: json.meta?.email_addresses,
                identifiers: json.meta?.identifiers,
                zxcvbn: json.meta?.zxcvbn,
                plan: json.meta?.plan,
                isPlanUpgradePossible: json.meta?.is_plan_upgrade_possible
            }
        };
        this.code = parsedError.code;
        this.message = parsedError.message;
        this.longMessage = parsedError.longMessage;
        this.meta = parsedError.meta;
    }
};
/**
* Type guard to check if a value is a ClerkApiError instance.
*/ const isClerkApiError = createErrorTypeGuard(ClerkAPIError);
//#endregion
//#region src/errors/parseError.ts
/**
* Parses an array of ClerkAPIErrorJSON objects into an array of ClerkAPIError objects.
*
* @internal
*/ function parseErrors(data = []) {
    return data.length > 0 ? data.map((e)=>new ClerkAPIError(e)) : [];
}
/**
* Parses a ClerkAPIErrorJSON object into a ClerkAPIError object.
*
* @deprecated Use `ClerkAPIError` class instead
*
* @internal
*/ function parseError(error) {
    return new ClerkAPIError(error);
}
/**
* Converts a ClerkAPIError object into a ClerkAPIErrorJSON object.
*
* @internal
*/ function errorToJSON(error) {
    return {
        code: error?.code || "",
        message: error?.message || "",
        long_message: error?.longMessage,
        meta: {
            param_name: error?.meta?.paramName,
            session_id: error?.meta?.sessionId,
            email_addresses: error?.meta?.emailAddresses,
            identifiers: error?.meta?.identifiers,
            zxcvbn: error?.meta?.zxcvbn,
            plan: error?.meta?.plan,
            is_plan_upgrade_possible: error?.meta?.isPlanUpgradePossible
        }
    };
}
//#endregion
//#region src/errors/clerkError.ts
var ClerkError = class ClerkError extends Error {
    static{
        this.kind = "ClerkError";
    }
    get name() {
        return this.constructor.name;
    }
    constructor(opts){
        super(new.target.formatMessage(new.target.kind, opts.message, opts.code, opts.docsUrl), {
            cause: opts.cause
        });
        this.clerkError = true;
        Object.setPrototypeOf(this, ClerkError.prototype);
        this.code = opts.code;
        this.docsUrl = opts.docsUrl;
        this.longMessage = opts.longMessage;
        this.cause = opts.cause;
    }
    toString() {
        return `[${this.name}]\nMessage:${this.message}`;
    }
    static formatMessage(name, msg, code, docsUrl) {
        const prefix = "Clerk:";
        const regex = new RegExp(prefix.replace(" ", "\\s*"), "i");
        msg = msg.replace(regex, "");
        msg = `${prefix} ${msg.trim()}\n\n(code="${code}")\n\n`;
        if (docsUrl) msg += `\n\nDocs: ${docsUrl}`;
        return msg;
    }
};
//#endregion
//#region src/errors/clerkApiResponseError.ts
var ClerkAPIResponseError = class ClerkAPIResponseError extends ClerkError {
    static{
        this.kind = "ClerkAPIResponseError";
    }
    constructor(message, options){
        const { data: errorsJson, status, clerkTraceId, retryAfter } = options;
        super({
            ...options,
            message,
            code: "api_response_error"
        });
        Object.setPrototypeOf(this, ClerkAPIResponseError.prototype);
        this.status = status;
        this.clerkTraceId = clerkTraceId;
        this.retryAfter = retryAfter;
        this.errors = (errorsJson || []).map((e)=>new ClerkAPIError(e));
    }
    toString() {
        let message = `[${this.name}]\nMessage:${this.message}\nStatus:${this.status}\nSerialized errors: ${this.errors.map((e)=>JSON.stringify(e))}`;
        if (this.clerkTraceId) message += `\nClerk Trace ID: ${this.clerkTraceId}`;
        return message;
    }
    static formatMessage(name, msg, _, __) {
        return msg;
    }
};
/**
* Type guard to check if an error is a ClerkApiResponseError.
* Can be called as a standalone function or as a method on an error object.
*
* @example
* // As a standalone function
* if (isClerkApiResponseError(error)) { ... }
*
* // As a method (when attached to error object)
* if (error.isClerkApiResponseError()) { ... }
*/ const isClerkApiResponseError = createErrorTypeGuard(ClerkAPIResponseError);
//#endregion
//#region src/errors/errorThrower.ts
const DefaultMessages = Object.freeze({
    InvalidProxyUrlErrorMessage: `The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})`,
    InvalidPublishableKeyErrorMessage: `The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})`,
    MissingPublishableKeyErrorMessage: `Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
    MissingSecretKeyErrorMessage: `Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.`,
    MissingClerkProvider: `{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider`
});
/**
* Builds an error thrower.
*
* @internal
*/ function buildErrorThrower({ packageName, customMessages }) {
    let pkg = packageName;
    /**
	* Builds a message from a raw message and replacements.
	*
	* @internal
	*/ function buildMessage(rawMessage, replacements) {
        if (!replacements) return `${pkg}: ${rawMessage}`;
        let msg = rawMessage;
        const matches = rawMessage.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
        for (const match of matches){
            const replacement = (replacements[match[1]] || "").toString();
            msg = msg.replace(`{{${match[1]}}}`, replacement);
        }
        return `${pkg}: ${msg}`;
    }
    const messages = {
        ...DefaultMessages,
        ...customMessages
    };
    return {
        setPackageName ({ packageName: packageName$1 }) {
            if (typeof packageName$1 === "string") pkg = packageName$1;
            return this;
        },
        setMessages ({ customMessages: customMessages$1 }) {
            Object.assign(messages, customMessages$1 || {});
            return this;
        },
        throwInvalidPublishableKeyError (params) {
            throw new Error(buildMessage(messages.InvalidPublishableKeyErrorMessage, params));
        },
        throwInvalidProxyUrl (params) {
            throw new Error(buildMessage(messages.InvalidProxyUrlErrorMessage, params));
        },
        throwMissingPublishableKeyError () {
            throw new Error(buildMessage(messages.MissingPublishableKeyErrorMessage));
        },
        throwMissingSecretKeyError () {
            throw new Error(buildMessage(messages.MissingSecretKeyErrorMessage));
        },
        throwMissingClerkProviderError (params) {
            throw new Error(buildMessage(messages.MissingClerkProvider, params));
        },
        throw (message) {
            throw new Error(buildMessage(message));
        }
    };
}
//#endregion
//#region src/errors/emailLinkError.ts
var EmailLinkError = class EmailLinkError extends (/* unused pure expression or super */ null && (Error)) {
    constructor(code){
        super(code);
        this.code = code;
        this.name = "EmailLinkError";
        Object.setPrototypeOf(this, EmailLinkError.prototype);
    }
};
/**
* @deprecated Use `EmailLinkErrorCodeStatus` instead.
*
* @internal
*/ const EmailLinkErrorCode = {
    Expired: "expired",
    Failed: "failed",
    ClientMismatch: "client_mismatch"
};
const EmailLinkErrorCodeStatus = {
    Expired: "expired",
    Failed: "failed",
    ClientMismatch: "client_mismatch"
};
//#endregion
//#region src/errors/clerkRuntimeError.ts
/**
* Custom error class for representing Clerk runtime errors.
*
* @class ClerkRuntimeError
*
* @example
*   throw new ClerkRuntimeError('An error occurred', { code: 'password_invalid' });
*/ var ClerkRuntimeError = class ClerkRuntimeError extends ClerkError {
    static{
        this.kind = "ClerkRuntimeError";
    }
    constructor(message, options){
        super({
            ...options,
            message
        });
        /**
	* @deprecated Use `clerkError` property instead. This property is maintained for backward compatibility.
	*/ this.clerkRuntimeError = true;
        Object.setPrototypeOf(this, ClerkRuntimeError.prototype);
    }
};
/**
* Type guard to check if an error is a ClerkRuntimeError.
* Can be called as a standalone function or as a method on an error object.
*
* @example
* // As a standalone function
* if (isClerkRuntimeError(error)) { ... }
*
* // As a method (when attached to error object)
* if (error.isClerkRuntimeError()) { ... }
*/ const isClerkRuntimeError$1 = createErrorTypeGuard(ClerkRuntimeError);
//#endregion
//#region src/errors/webAuthNError.ts
var ClerkWebAuthnError = class extends (/* unused pure expression or super */ null && (ClerkRuntimeError)) {
    constructor(message, { code }){
        super(message, {
            code
        });
        this.code = code;
    }
};
//#endregion
//#region src/errors/helpers.ts
/**
* Checks if the provided error object is an unauthorized error.
*
* @internal
*
* @deprecated This is no longer used, and will be removed in the next major version.
*/ function isUnauthorizedError(e) {
    const status = e?.status;
    return e?.errors?.[0]?.code === "authentication_invalid" && status === 401;
}
/**
* Checks if the provided error object is a captcha error.
*
* @internal
*/ function isCaptchaError(e) {
    return [
        "captcha_invalid",
        "captcha_not_enabled",
        "captcha_missing_token"
    ].includes(e.errors[0].code);
}
/**
* Checks if the provided error is a 4xx error.
*
* @internal
*/ function is4xxError(e) {
    const status = e?.status;
    return !!status && status >= 400 && status < 500;
}
/**
* Checks if the provided error is a network error.
*
* @internal
*/ function isNetworkError(e) {
    return (`${e.message}${e.name}` || "").toLowerCase().replace(/\s+/g, "").includes("networkerror");
}
/**
* Checks if the provided error is either a ClerkAPIResponseError, a ClerkRuntimeError, or a MetamaskError.
*
* @internal
*/ function isKnownError(error) {
    return isClerkAPIResponseError(error) || isMetamaskError(error) || isClerkRuntimeError(error);
}
/**
* Checks if the provided error is a ClerkAPIResponseError.
*
* @internal
*/ function isClerkAPIResponseError(err) {
    return err && "clerkError" in err;
}
/**
* Checks if the provided error object is an instance of ClerkRuntimeError.
*
* @param err - The error object to check.
* @returns True if the error is a ClerkRuntimeError, false otherwise.
*
* @example
* const error = new ClerkRuntimeError('An error occurred');
* if (isClerkRuntimeError(error)) {
*   // Handle ClerkRuntimeError
*   console.error('ClerkRuntimeError:', error.message);
* } else {
*   // Handle other errors
*   console.error('Other error:', error.message);
* }
*/ function isClerkRuntimeError(err) {
    return "clerkRuntimeError" in err;
}
/**
* Checks if the provided error is a Clerk runtime error indicating a reverification was cancelled.
*
* @internal
*/ function isReverificationCancelledError(err) {
    return isClerkRuntimeError(err) && err.code === "reverification_cancelled";
}
/**
* Checks if the provided error is a Metamask error.
*
* @internal
*/ function isMetamaskError(err) {
    return "code" in err && [
        4001,
        32602,
        32603
    ].includes(err.code) && "message" in err;
}
/**
* Checks if the provided error is clerk api response error indicating a user is locked.
*
* @internal
*/ function isUserLockedError(err) {
    return isClerkAPIResponseError(err) && err.errors?.[0]?.code === "user_locked";
}
/**
* Checks if the provided error is a clerk api response error indicating a password was pwned.
*
* @internal
*/ function isPasswordPwnedError(err) {
    return isClerkAPIResponseError(err) && err.errors?.[0]?.code === "form_password_pwned";
}
/**
* Checks if the provided error is an EmailLinkError.
*
* @internal
*/ function isEmailLinkError(err) {
    return err.name === "EmailLinkError";
}
//#endregion
//#region src/errors/globalHookError.ts
/**
* Creates a ClerkGlobalHookError object from a ClerkError instance.
* It's a wrapper for all the different instances of Clerk errors that can
* be returned when using Clerk hooks.
*/ function createClerkGlobalHookError(error) {
    const predicates = {
        isClerkApiResponseError,
        isClerkRuntimeError: isClerkRuntimeError$1
    };
    for (const [name, fn] of Object.entries(predicates))Object.assign(error, {
        [name]: fn
    });
    return error;
}
//#endregion
 //# sourceMappingURL=error-74EhajFh.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/error.mjs



;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+backend@2.23.2_react_2762a69b54307b8bd802f183496730d6/node_modules/@clerk/backend/dist/chunk-YBVFDYDR.mjs
// src/util/shared.ts






var errorThrower = buildErrorThrower({
    packageName: "@clerk/backend"
});
var { isDevOrStagingUrl } = createDevOrStagingUrlCache();
 //# sourceMappingURL=chunk-YBVFDYDR.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+backend@2.23.2_react_2762a69b54307b8bd802f183496730d6/node_modules/@clerk/backend/dist/chunk-HNJNM32R.mjs
// src/errors.ts
var TokenVerificationErrorCode = {
    InvalidSecretKey: "clerk_key_invalid"
};
var TokenVerificationErrorReason = {
    TokenExpired: "token-expired",
    TokenInvalid: "token-invalid",
    TokenInvalidAlgorithm: "token-invalid-algorithm",
    TokenInvalidAuthorizedParties: "token-invalid-authorized-parties",
    TokenInvalidSignature: "token-invalid-signature",
    TokenNotActiveYet: "token-not-active-yet",
    TokenIatInTheFuture: "token-iat-in-the-future",
    TokenVerificationFailed: "token-verification-failed",
    InvalidSecretKey: "secret-key-invalid",
    LocalJWKMissing: "jwk-local-missing",
    RemoteJWKFailedToLoad: "jwk-remote-failed-to-load",
    RemoteJWKInvalid: "jwk-remote-invalid",
    RemoteJWKMissing: "jwk-remote-missing",
    JWKFailedToResolve: "jwk-failed-to-resolve",
    JWKKidMismatch: "jwk-kid-mismatch"
};
var TokenVerificationErrorAction = {
    ContactSupport: "Contact support@clerk.com",
    EnsureClerkJWT: "Make sure that this is a valid Clerk-generated JWT.",
    SetClerkJWTKey: "Set the CLERK_JWT_KEY environment variable.",
    SetClerkSecretKey: "Set the CLERK_SECRET_KEY environment variable.",
    EnsureClockSync: "Make sure your system clock is in sync (e.g. turn off and on automatic time synchronization)."
};
var TokenVerificationError = class _TokenVerificationError extends Error {
    constructor({ action, message, reason }){
        super(message);
        Object.setPrototypeOf(this, _TokenVerificationError.prototype);
        this.reason = reason;
        this.message = message;
        this.action = action;
    }
    getFullMessage() {
        return `${[
            this.message,
            this.action
        ].filter((m)=>m).join(" ")} (reason=${this.reason}, token-carrier=${this.tokenCarrier})`;
    }
};
var SignJWTError = class extends (/* unused pure expression or super */ null && (Error)) {
};
var MachineTokenVerificationErrorCode = {
    TokenInvalid: "token-invalid",
    InvalidSecretKey: "secret-key-invalid",
    UnexpectedError: "unexpected-error"
};
var MachineTokenVerificationError = class _MachineTokenVerificationError extends Error {
    constructor({ message, code, status }){
        super(message);
        Object.setPrototypeOf(this, _MachineTokenVerificationError.prototype);
        this.code = code;
        this.status = status;
    }
    getFullMessage() {
        return `${this.message} (code=${this.code}, status=${this.status})`;
    }
};
 //# sourceMappingURL=chunk-HNJNM32R.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+backend@2.23.2_react_2762a69b54307b8bd802f183496730d6/node_modules/@clerk/backend/dist/runtime/browser/crypto.mjs
const webcrypto = crypto;

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+backend@2.23.2_react_2762a69b54307b8bd802f183496730d6/node_modules/@clerk/backend/dist/chunk-AR5UB427.mjs

// src/runtime.ts

var globalFetch = fetch.bind(globalThis);
var runtime = {
    crypto: webcrypto,
    get fetch () {
        return  false ? 0 : globalFetch;
    },
    AbortController: globalThis.AbortController,
    Blob: globalThis.Blob,
    FormData: globalThis.FormData,
    Headers: globalThis.Headers,
    Request: globalThis.Request,
    Response: globalThis.Response
};
// src/util/rfc4648.ts
var base64url = {
    parse (string, opts) {
        return parse(string, base64UrlEncoding, opts);
    },
    stringify (data, opts) {
        return stringify(data, base64UrlEncoding, opts);
    }
};
var base64UrlEncoding = {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    bits: 6
};
function parse(string, encoding, opts = {}) {
    if (!encoding.codes) {
        encoding.codes = {};
        for(let i = 0; i < encoding.chars.length; ++i){
            encoding.codes[encoding.chars[i]] = i;
        }
    }
    if (!opts.loose && string.length * encoding.bits & 7) {
        throw new SyntaxError("Invalid padding");
    }
    let end = string.length;
    while(string[end - 1] === "="){
        --end;
        if (!opts.loose && !((string.length - end) * encoding.bits & 7)) {
            throw new SyntaxError("Invalid padding");
        }
    }
    const out = new (opts.out ?? Uint8Array)(end * encoding.bits / 8 | 0);
    let bits = 0;
    let buffer = 0;
    let written = 0;
    for(let i = 0; i < end; ++i){
        const value = encoding.codes[string[i]];
        if (value === void 0) {
            throw new SyntaxError("Invalid character " + string[i]);
        }
        buffer = buffer << encoding.bits | value;
        bits += encoding.bits;
        if (bits >= 8) {
            bits -= 8;
            out[written++] = 255 & buffer >> bits;
        }
    }
    if (bits >= encoding.bits || 255 & buffer << 8 - bits) {
        throw new SyntaxError("Unexpected end of data");
    }
    return out;
}
function stringify(data, encoding, opts = {}) {
    const { pad = true } = opts;
    const mask = (1 << encoding.bits) - 1;
    let out = "";
    let bits = 0;
    let buffer = 0;
    for(let i = 0; i < data.length; ++i){
        buffer = buffer << 8 | 255 & data[i];
        bits += 8;
        while(bits > encoding.bits){
            bits -= encoding.bits;
            out += encoding.chars[mask & buffer >> bits];
        }
    }
    if (bits) {
        out += encoding.chars[mask & buffer << encoding.bits - bits];
    }
    if (pad) {
        while(out.length * encoding.bits & 7){
            out += "=";
        }
    }
    return out;
}
// src/jwt/algorithms.ts
var algToHash = {
    RS256: "SHA-256",
    RS384: "SHA-384",
    RS512: "SHA-512"
};
var RSA_ALGORITHM_NAME = "RSASSA-PKCS1-v1_5";
var jwksAlgToCryptoAlg = {
    RS256: RSA_ALGORITHM_NAME,
    RS384: RSA_ALGORITHM_NAME,
    RS512: RSA_ALGORITHM_NAME
};
var algs = Object.keys(algToHash);
function getCryptoAlgorithm(algorithmName) {
    const hash = algToHash[algorithmName];
    const name = jwksAlgToCryptoAlg[algorithmName];
    if (!hash || !name) {
        throw new Error(`Unsupported algorithm ${algorithmName}, expected one of ${algs.join(",")}.`);
    }
    return {
        hash: {
            name: algToHash[algorithmName]
        },
        name: jwksAlgToCryptoAlg[algorithmName]
    };
}
// src/jwt/assertions.ts
var isArrayString = (s)=>{
    return Array.isArray(s) && s.length > 0 && s.every((a)=>typeof a === "string");
};
var assertAudienceClaim = (aud, audience)=>{
    const audienceList = [
        audience
    ].flat().filter((a)=>!!a);
    const audList = [
        aud
    ].flat().filter((a)=>!!a);
    const shouldVerifyAudience = audienceList.length > 0 && audList.length > 0;
    if (!shouldVerifyAudience) {
        return;
    }
    if (typeof aud === "string") {
        if (!audienceList.includes(aud)) {
            throw new TokenVerificationError({
                action: TokenVerificationErrorAction.EnsureClerkJWT,
                reason: TokenVerificationErrorReason.TokenVerificationFailed,
                message: `Invalid JWT audience claim (aud) ${JSON.stringify(aud)}. Is not included in "${JSON.stringify(audienceList)}".`
            });
        }
    } else if (isArrayString(aud)) {
        if (!aud.some((a)=>audienceList.includes(a))) {
            throw new TokenVerificationError({
                action: TokenVerificationErrorAction.EnsureClerkJWT,
                reason: TokenVerificationErrorReason.TokenVerificationFailed,
                message: `Invalid JWT audience claim array (aud) ${JSON.stringify(aud)}. Is not included in "${JSON.stringify(audienceList)}".`
            });
        }
    }
};
var assertHeaderType = (typ)=>{
    if (typeof typ === "undefined") {
        return;
    }
    if (typ !== "JWT") {
        throw new TokenVerificationError({
            action: TokenVerificationErrorAction.EnsureClerkJWT,
            reason: TokenVerificationErrorReason.TokenInvalid,
            message: `Invalid JWT type ${JSON.stringify(typ)}. Expected "JWT".`
        });
    }
};
var assertHeaderAlgorithm = (alg)=>{
    if (!algs.includes(alg)) {
        throw new TokenVerificationError({
            action: TokenVerificationErrorAction.EnsureClerkJWT,
            reason: TokenVerificationErrorReason.TokenInvalidAlgorithm,
            message: `Invalid JWT algorithm ${JSON.stringify(alg)}. Supported: ${algs}.`
        });
    }
};
var assertSubClaim = (sub)=>{
    if (typeof sub !== "string") {
        throw new TokenVerificationError({
            action: TokenVerificationErrorAction.EnsureClerkJWT,
            reason: TokenVerificationErrorReason.TokenVerificationFailed,
            message: `Subject claim (sub) is required and must be a string. Received ${JSON.stringify(sub)}.`
        });
    }
};
var assertAuthorizedPartiesClaim = (azp, authorizedParties)=>{
    if (!azp || !authorizedParties || authorizedParties.length === 0) {
        return;
    }
    if (!authorizedParties.includes(azp)) {
        throw new TokenVerificationError({
            reason: TokenVerificationErrorReason.TokenInvalidAuthorizedParties,
            message: `Invalid JWT Authorized party claim (azp) ${JSON.stringify(azp)}. Expected "${authorizedParties}".`
        });
    }
};
var assertExpirationClaim = (exp, clockSkewInMs)=>{
    if (typeof exp !== "number") {
        throw new TokenVerificationError({
            action: TokenVerificationErrorAction.EnsureClerkJWT,
            reason: TokenVerificationErrorReason.TokenVerificationFailed,
            message: `Invalid JWT expiry date claim (exp) ${JSON.stringify(exp)}. Expected number.`
        });
    }
    const currentDate = new Date(Date.now());
    const expiryDate = /* @__PURE__ */ new Date(0);
    expiryDate.setUTCSeconds(exp);
    const expired = expiryDate.getTime() <= currentDate.getTime() - clockSkewInMs;
    if (expired) {
        throw new TokenVerificationError({
            reason: TokenVerificationErrorReason.TokenExpired,
            message: `JWT is expired. Expiry date: ${expiryDate.toUTCString()}, Current date: ${currentDate.toUTCString()}.`
        });
    }
};
var assertActivationClaim = (nbf, clockSkewInMs)=>{
    if (typeof nbf === "undefined") {
        return;
    }
    if (typeof nbf !== "number") {
        throw new TokenVerificationError({
            action: TokenVerificationErrorAction.EnsureClerkJWT,
            reason: TokenVerificationErrorReason.TokenVerificationFailed,
            message: `Invalid JWT not before date claim (nbf) ${JSON.stringify(nbf)}. Expected number.`
        });
    }
    const currentDate = new Date(Date.now());
    const notBeforeDate = /* @__PURE__ */ new Date(0);
    notBeforeDate.setUTCSeconds(nbf);
    const early = notBeforeDate.getTime() > currentDate.getTime() + clockSkewInMs;
    if (early) {
        throw new TokenVerificationError({
            reason: TokenVerificationErrorReason.TokenNotActiveYet,
            message: `JWT cannot be used prior to not before date claim (nbf). Not before date: ${notBeforeDate.toUTCString()}; Current date: ${currentDate.toUTCString()};`
        });
    }
};
var assertIssuedAtClaim = (iat, clockSkewInMs)=>{
    if (typeof iat === "undefined") {
        return;
    }
    if (typeof iat !== "number") {
        throw new TokenVerificationError({
            action: TokenVerificationErrorAction.EnsureClerkJWT,
            reason: TokenVerificationErrorReason.TokenVerificationFailed,
            message: `Invalid JWT issued at date claim (iat) ${JSON.stringify(iat)}. Expected number.`
        });
    }
    const currentDate = new Date(Date.now());
    const issuedAtDate = /* @__PURE__ */ new Date(0);
    issuedAtDate.setUTCSeconds(iat);
    const postIssued = issuedAtDate.getTime() > currentDate.getTime() + clockSkewInMs;
    if (postIssued) {
        throw new TokenVerificationError({
            reason: TokenVerificationErrorReason.TokenIatInTheFuture,
            message: `JWT issued at date claim (iat) is in the future. Issued at date: ${issuedAtDate.toUTCString()}; Current date: ${currentDate.toUTCString()};`
        });
    }
};
// src/jwt/cryptoKeys.ts

function pemToBuffer(secret) {
    const trimmed = secret.replace(/-----BEGIN.*?-----/g, "").replace(/-----END.*?-----/g, "").replace(/\s/g, "");
    const decoded = isomorphicAtob(trimmed);
    const buffer = new ArrayBuffer(decoded.length);
    const bufView = new Uint8Array(buffer);
    for(let i = 0, strLen = decoded.length; i < strLen; i++){
        bufView[i] = decoded.charCodeAt(i);
    }
    return bufView;
}
function importKey(key, algorithm, keyUsage) {
    if (typeof key === "object") {
        return runtime.crypto.subtle.importKey("jwk", key, algorithm, false, [
            keyUsage
        ]);
    }
    const keyData = pemToBuffer(key);
    const format = keyUsage === "sign" ? "pkcs8" : "spki";
    return runtime.crypto.subtle.importKey(format, keyData, algorithm, false, [
        keyUsage
    ]);
}
// src/jwt/verifyJwt.ts
var DEFAULT_CLOCK_SKEW_IN_MS = 5 * 1e3;
async function hasValidSignature(jwt, key) {
    const { header, signature, raw } = jwt;
    const encoder = new TextEncoder();
    const data = encoder.encode([
        raw.header,
        raw.payload
    ].join("."));
    const algorithm = getCryptoAlgorithm(header.alg);
    try {
        const cryptoKey = await importKey(key, algorithm, "verify");
        const verified = await runtime.crypto.subtle.verify(algorithm.name, cryptoKey, signature, data);
        return {
            data: verified
        };
    } catch (error) {
        return {
            errors: [
                new TokenVerificationError({
                    reason: TokenVerificationErrorReason.TokenInvalidSignature,
                    message: error?.message
                })
            ]
        };
    }
}
function decodeJwt(token) {
    const tokenParts = (token || "").toString().split(".");
    if (tokenParts.length !== 3) {
        return {
            errors: [
                new TokenVerificationError({
                    reason: TokenVerificationErrorReason.TokenInvalid,
                    message: `Invalid JWT form. A JWT consists of three parts separated by dots.`
                })
            ]
        };
    }
    const [rawHeader, rawPayload, rawSignature] = tokenParts;
    const decoder = new TextDecoder();
    const header = JSON.parse(decoder.decode(base64url.parse(rawHeader, {
        loose: true
    })));
    const payload = JSON.parse(decoder.decode(base64url.parse(rawPayload, {
        loose: true
    })));
    const signature = base64url.parse(rawSignature, {
        loose: true
    });
    const data = {
        header,
        payload,
        signature,
        raw: {
            header: rawHeader,
            payload: rawPayload,
            signature: rawSignature,
            text: token
        }
    };
    return {
        data
    };
}
async function verifyJwt(token, options) {
    const { audience, authorizedParties, clockSkewInMs, key } = options;
    const clockSkew = clockSkewInMs || DEFAULT_CLOCK_SKEW_IN_MS;
    const { data: decoded, errors } = decodeJwt(token);
    if (errors) {
        return {
            errors
        };
    }
    const { header, payload } = decoded;
    try {
        const { typ, alg } = header;
        assertHeaderType(typ);
        assertHeaderAlgorithm(alg);
        const { azp, sub, aud, iat, exp, nbf } = payload;
        assertSubClaim(sub);
        assertAudienceClaim([
            aud
        ], [
            audience
        ]);
        assertAuthorizedPartiesClaim(azp, authorizedParties);
        assertExpirationClaim(exp, clockSkew);
        assertActivationClaim(nbf, clockSkew);
        assertIssuedAtClaim(iat, clockSkew);
    } catch (err) {
        return {
            errors: [
                err
            ]
        };
    }
    const { data: signatureValid, errors: signatureErrors } = await hasValidSignature(decoded, key);
    if (signatureErrors) {
        return {
            errors: [
                new TokenVerificationError({
                    action: TokenVerificationErrorAction.EnsureClerkJWT,
                    reason: TokenVerificationErrorReason.TokenVerificationFailed,
                    message: `Error verifying JWT signature. ${signatureErrors[0]}`
                })
            ]
        };
    }
    if (!signatureValid) {
        return {
            errors: [
                new TokenVerificationError({
                    reason: TokenVerificationErrorReason.TokenInvalidSignature,
                    message: "JWT signature is invalid."
                })
            ]
        };
    }
    return {
        data: payload
    };
}
 //# sourceMappingURL=chunk-AR5UB427.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+backend@2.23.2_react_2762a69b54307b8bd802f183496730d6/node_modules/@clerk/backend/dist/chunk-RPS7XK5K.mjs
var __typeError = (msg)=>{
    throw TypeError(msg);
};
var __accessCheck = (obj, member, msg)=>member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value)=>member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method)=>(__accessCheck(obj, member, "access private method"), method);
 //# sourceMappingURL=chunk-RPS7XK5K.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/buildAccountsBaseUrl.mjs
//#region src/buildAccountsBaseUrl.ts
/**
* Builds a full origin string pointing to the Account Portal for the given frontend API.
*/ function buildAccountsBaseUrl(frontendApi) {
    if (!frontendApi) return "";
    return `https://${frontendApi.replace(/clerk\.accountsstage\./, "accountsstage.").replace(/clerk\.accounts\.|clerk\./, "accounts.")}`;
}
//#endregion
 //# sourceMappingURL=buildAccountsBaseUrl.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/url-Cdy8w8vK.mjs


//#region src/url.ts
function parseSearchParams(queryString = "") {
    if (queryString.startsWith("?")) queryString = queryString.slice(1);
    return new URLSearchParams(queryString);
}
function stripScheme(url = "") {
    return (url || "").replace(/^.+:\/\//, "");
}
function addClerkPrefix(str) {
    if (!str) return "";
    let regex;
    if (str.match(/^(clerk\.)+\w*$/)) regex = /(clerk\.)*(?=clerk\.)/;
    else if (str.match(/\.clerk.accounts/)) return str;
    else regex = /^(clerk\.)*/gi;
    return `clerk.${str.replace(regex, "")}`;
}
/**
*
* Retrieve the clerk-js major tag using the major version from the pkgVersion
* param or use the frontendApi to determine if the canary tag should be used.
* The default tag is `latest`.
*/ const getClerkJsMajorVersionOrTag = (frontendApi, version)=>{
    if (!version && isStaging(frontendApi)) return "canary";
    if (!version) return "latest";
    return version.split(".")[0] || "latest";
};
/**
*
* Retrieve the clerk-js script url from the frontendApi and the major tag
* using the {@link getClerkJsMajorVersionOrTag} or a provided clerkJSVersion tag.
*/ const getScriptUrl = (frontendApi, { clerkJSVersion })=>{
    const noSchemeFrontendApi = frontendApi.replace(/http(s)?:\/\//, "");
    const major = getClerkJsMajorVersionOrTag(frontendApi, clerkJSVersion);
    return `https://${noSchemeFrontendApi}/npm/@clerk/clerk-js@${clerkJSVersion || major}/dist/clerk.browser.js`;
};
function isLegacyDevAccountPortalOrigin(host) {
    return constants_ByUssRbE_LEGACY_DEV_INSTANCE_SUFFIXES.some((legacyDevSuffix)=>{
        return host.startsWith("accounts.") && host.endsWith(legacyDevSuffix);
    });
}
function isCurrentDevAccountPortalOrigin(host) {
    return CURRENT_DEV_INSTANCE_SUFFIXES.some((currentDevSuffix)=>{
        return host.endsWith(currentDevSuffix) && !host.endsWith(".clerk" + currentDevSuffix);
    });
}
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
function hasTrailingSlash(input = "", respectQueryAndFragment) {
    if (!respectQueryAndFragment) return input.endsWith("/");
    return TRAILING_SLASH_RE.test(input);
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
    if (!respectQueryAndFragment) return input.endsWith("/") ? input : input + "/";
    if (hasTrailingSlash(input, true)) return input || "/";
    let path = input;
    let fragment = "";
    const fragmentIndex = input.indexOf("#");
    if (fragmentIndex >= 0) {
        path = input.slice(0, fragmentIndex);
        fragment = input.slice(fragmentIndex);
        if (!path) return fragment;
    }
    const [s0, ...s] = path.split("?");
    return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
    if (!respectQueryAndFragment) return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
    if (!hasTrailingSlash(input, true)) return input || "/";
    let path = input;
    let fragment = "";
    const fragmentIndex = input.indexOf("#");
    if (fragmentIndex >= 0) {
        path = input.slice(0, fragmentIndex);
        fragment = input.slice(fragmentIndex);
    }
    const [s0, ...s] = path.split("?");
    return (s0.slice(0, -1) || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
    return input.startsWith("/");
}
function withoutLeadingSlash(input = "") {
    return (hasLeadingSlash(input) ? input.slice(1) : input) || "/";
}
function withLeadingSlash(input = "") {
    return hasLeadingSlash(input) ? input : "/" + input;
}
function cleanDoubleSlashes(input = "") {
    return input.split("://").map((string_)=>string_.replace(/\/{2,}/g, "/")).join("://");
}
function isNonEmptyURL(url) {
    return url && url !== "/";
}
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function joinURL(base, ...input) {
    let url = base || "";
    for (const segment of input.filter((url$1)=>isNonEmptyURL(url$1)))if (url) {
        const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
        url = withTrailingSlash(url) + _segment;
    } else url = segment;
    return url;
}
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
//#endregion
 //# sourceMappingURL=url-Cdy8w8vK.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/authorization-XX4mKaAz.mjs
//#region src/authorization.ts
const TYPES_TO_OBJECTS = {
    strict_mfa: {
        afterMinutes: 10,
        level: "multi_factor"
    },
    strict: {
        afterMinutes: 10,
        level: "second_factor"
    },
    moderate: {
        afterMinutes: 60,
        level: "second_factor"
    },
    lax: {
        afterMinutes: 1440,
        level: "second_factor"
    }
};
const ALLOWED_LEVELS = new Set([
    "first_factor",
    "second_factor",
    "multi_factor"
]);
const ALLOWED_TYPES = new Set([
    "strict_mfa",
    "strict",
    "moderate",
    "lax"
]);
const isValidMaxAge = (maxAge)=>typeof maxAge === "number" && maxAge > 0;
const isValidLevel = (level)=>ALLOWED_LEVELS.has(level);
const isValidVerificationType = (type)=>ALLOWED_TYPES.has(type);
const prefixWithOrg = (value)=>value.replace(/^(org:)*/, "org:");
/**
* Checks if a user has the required organization-level authorization.
* Verifies if the user has the specified role or permission within their organization.
* @returns null, if unable to determine due to missing data or unspecified role/permission.
*/ const checkOrgAuthorization = (params, options)=>{
    const { orgId, orgRole, orgPermissions } = options;
    if (!params.role && !params.permission) return null;
    if (!orgId || !orgRole || !orgPermissions) return null;
    if (params.permission) return orgPermissions.includes(prefixWithOrg(params.permission));
    if (params.role) return prefixWithOrg(orgRole) === prefixWithOrg(params.role);
    return null;
};
const checkForFeatureOrPlan = (claim, featureOrPlan)=>{
    const { org: orgFeatures, user: userFeatures } = splitByScope(claim);
    const [scope, _id] = featureOrPlan.split(":");
    const id = _id || scope;
    if (scope === "org") return orgFeatures.includes(id);
    else if (scope === "user") return userFeatures.includes(id);
    else return [
        ...orgFeatures,
        ...userFeatures
    ].includes(id);
};
const checkBillingAuthorization = (params, options)=>{
    const { features, plans } = options;
    if (params.feature && features) return checkForFeatureOrPlan(features, params.feature);
    if (params.plan && plans) return checkForFeatureOrPlan(plans, params.plan);
    return null;
};
const splitByScope = (fea)=>{
    const features = fea ? fea.split(",").map((f)=>f.trim()) : [];
    return {
        org: features.filter((f)=>f.split(":")[0].includes("o")).map((f)=>f.split(":")[1]),
        user: features.filter((f)=>f.split(":")[0].includes("u")).map((f)=>f.split(":")[1])
    };
};
const validateReverificationConfig = (config)=>{
    if (!config) return false;
    const convertConfigToObject = (config$1)=>{
        if (typeof config$1 === "string") return TYPES_TO_OBJECTS[config$1];
        return config$1;
    };
    const isValidStringValue = typeof config === "string" && isValidVerificationType(config);
    const isValidObjectValue = typeof config === "object" && isValidLevel(config.level) && isValidMaxAge(config.afterMinutes);
    if (isValidStringValue || isValidObjectValue) return convertConfigToObject.bind(null, config);
    return false;
};
/**
* Evaluates if the user meets re-verification authentication requirements.
* Compares the user's factor verification ages against the specified maxAge.
* Handles different verification levels (first factor, second factor, multi-factor).
* @returns null, if requirements or verification data are missing.
*/ const checkReverificationAuthorization = (params, { factorVerificationAge })=>{
    if (!params.reverification || !factorVerificationAge) return null;
    const isValidReverification = validateReverificationConfig(params.reverification);
    if (!isValidReverification) return null;
    const { level, afterMinutes } = isValidReverification();
    const [factor1Age, factor2Age] = factorVerificationAge;
    const isValidFactor1 = factor1Age !== -1 ? afterMinutes > factor1Age : null;
    const isValidFactor2 = factor2Age !== -1 ? afterMinutes > factor2Age : null;
    switch(level){
        case "first_factor":
            return isValidFactor1;
        case "second_factor":
            return factor2Age !== -1 ? isValidFactor2 : isValidFactor1;
        case "multi_factor":
            return factor2Age === -1 ? isValidFactor1 : isValidFactor1 && isValidFactor2;
    }
};
/**
* Creates a function for comprehensive user authorization checks.
* Combines organization-level and reverification authentication checks.
* The returned function authorizes if both checks pass, or if at least one passes
* when the other is indeterminate. Fails if userId is missing.
*/ const createCheckAuthorization = (options)=>{
    return (params)=>{
        if (!options.userId) return false;
        const billingAuthorization = checkBillingAuthorization(params, options);
        const orgAuthorization = checkOrgAuthorization(params, options);
        const reverificationAuthorization = checkReverificationAuthorization(params, options);
        if ([
            billingAuthorization || orgAuthorization,
            reverificationAuthorization
        ].some((a)=>a === null)) return [
            billingAuthorization || orgAuthorization,
            reverificationAuthorization
        ].some((a)=>a === true);
        return [
            billingAuthorization || orgAuthorization,
            reverificationAuthorization
        ].every((a)=>a === true);
    };
};
/**
* Shared utility function that centralizes auth state resolution logic,
* preventing duplication across different packages.
* @internal
*/ const resolveAuthState = ({ authObject: { sessionId, sessionStatus, userId, actor, orgId, orgRole, orgSlug, signOut, getToken, has, sessionClaims }, options: { treatPendingAsSignedOut = true } })=>{
    if (sessionId === void 0 && userId === void 0) return {
        isLoaded: false,
        isSignedIn: void 0,
        sessionId,
        sessionClaims: void 0,
        userId,
        actor: void 0,
        orgId: void 0,
        orgRole: void 0,
        orgSlug: void 0,
        has: void 0,
        signOut,
        getToken
    };
    if (sessionId === null && userId === null) return {
        isLoaded: true,
        isSignedIn: false,
        sessionId,
        userId,
        sessionClaims: null,
        actor: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        has: ()=>false,
        signOut,
        getToken
    };
    if (treatPendingAsSignedOut && sessionStatus === "pending") return {
        isLoaded: true,
        isSignedIn: false,
        sessionId: null,
        userId: null,
        sessionClaims: null,
        actor: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        has: ()=>false,
        signOut,
        getToken
    };
    if (!!sessionId && !!sessionClaims && !!userId && !!orgId && !!orgRole) return {
        isLoaded: true,
        isSignedIn: true,
        sessionId,
        sessionClaims,
        userId,
        actor: actor || null,
        orgId,
        orgRole,
        orgSlug: orgSlug || null,
        has,
        signOut,
        getToken
    };
    if (!!sessionId && !!sessionClaims && !!userId && !orgId) return {
        isLoaded: true,
        isSignedIn: true,
        sessionId,
        sessionClaims,
        userId,
        actor: actor || null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        has,
        signOut,
        getToken
    };
};
//#endregion
 //# sourceMappingURL=authorization-XX4mKaAz.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/authorization.mjs



;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/jwtPayloadParser.mjs

//#region src/jwtPayloadParser.ts
const parsePermissions = ({ per, fpm })=>{
    if (!per || !fpm) return {
        permissions: [],
        featurePermissionMap: []
    };
    const permissions = per.split(",").map((p)=>p.trim());
    return {
        permissions,
        featurePermissionMap: fpm.split(",").map((permission)=>Number.parseInt(permission.trim(), 10)).map((permission)=>permission.toString(2).padStart(permissions.length, "0").split("").map((bit)=>Number.parseInt(bit, 10)).reverse()).filter(Boolean)
    };
};
/**
*
*/ function buildOrgPermissions({ features, permissions, featurePermissionMap }) {
    if (!features || !permissions || !featurePermissionMap) return [];
    const orgPermissions = [];
    for(let featureIndex = 0; featureIndex < features.length; featureIndex++){
        const feature = features[featureIndex];
        if (featureIndex >= featurePermissionMap.length) continue;
        const permissionBits = featurePermissionMap[featureIndex];
        if (!permissionBits) continue;
        for(let permIndex = 0; permIndex < permissionBits.length; permIndex++)if (permissionBits[permIndex] === 1) orgPermissions.push(`org:${feature}:${permissions[permIndex]}`);
    }
    return orgPermissions;
}
/**
* Resolves the signed-in auth state from JWT claims.
*
* @experimental
*/ const __experimental_JWTPayloadToAuthObjectProperties = (claims)=>{
    let orgId;
    let orgRole;
    let orgSlug;
    let orgPermissions;
    const factorVerificationAge = claims.fva ?? null;
    const sessionStatus = claims.sts ?? null;
    switch(claims.v){
        case 2:
            if (claims.o) {
                orgId = claims.o?.id;
                orgSlug = claims.o?.slg;
                if (claims.o?.rol) orgRole = `org:${claims.o?.rol}`;
                const { org } = splitByScope(claims.fea);
                const { permissions, featurePermissionMap } = parsePermissions({
                    per: claims.o?.per,
                    fpm: claims.o?.fpm
                });
                orgPermissions = buildOrgPermissions({
                    features: org,
                    featurePermissionMap,
                    permissions
                });
            }
            break;
        default:
            orgId = claims.org_id;
            orgRole = claims.org_role;
            orgSlug = claims.org_slug;
            orgPermissions = claims.org_permissions;
            break;
    }
    return {
        sessionClaims: claims,
        sessionId: claims.sid,
        sessionStatus,
        actor: claims.act,
        userId: claims.sub,
        orgId,
        orgRole,
        orgSlug,
        orgPermissions,
        factorVerificationAge
    };
};
//#endregion
 //# sourceMappingURL=jwtPayloadParser.mjs.map

// EXTERNAL MODULE: ../../node_modules/.pnpm/cookie@1.0.2/node_modules/cookie/dist/index.js
var dist = __webpack_require__(6156);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+backend@2.23.2_react_2762a69b54307b8bd802f183496730d6/node_modules/@clerk/backend/dist/chunk-I24FT6SE.mjs




// src/constants.ts
var API_URL = "https://api.clerk.com";
var API_VERSION = "v1";
var USER_AGENT = `${"@clerk/backend"}@${"2.23.2"}`;
var MAX_CACHE_LAST_UPDATED_AT_SECONDS = 5 * 60;
var SUPPORTED_BAPI_VERSION = "2025-11-10";
var Attributes = {
    AuthToken: "__clerkAuthToken",
    AuthSignature: "__clerkAuthSignature",
    AuthStatus: "__clerkAuthStatus",
    AuthReason: "__clerkAuthReason",
    AuthMessage: "__clerkAuthMessage",
    ClerkUrl: "__clerkUrl"
};
var Cookies = {
    Session: "__session",
    Refresh: "__refresh",
    ClientUat: "__client_uat",
    Handshake: "__clerk_handshake",
    DevBrowser: "__clerk_db_jwt",
    RedirectCount: "__clerk_redirect_count",
    HandshakeNonce: "__clerk_handshake_nonce"
};
var QueryParameters = {
    ClerkSynced: "__clerk_synced",
    SuffixedCookies: "suffixed_cookies",
    ClerkRedirectUrl: "__clerk_redirect_url",
    // use the reference to Cookies to indicate that it's the same value
    DevBrowser: Cookies.DevBrowser,
    Handshake: Cookies.Handshake,
    HandshakeHelp: "__clerk_help",
    LegacyDevBrowser: "__dev_session",
    HandshakeReason: "__clerk_hs_reason",
    HandshakeNonce: Cookies.HandshakeNonce,
    HandshakeFormat: "format"
};
var Headers2 = {
    Accept: "accept",
    AuthMessage: "x-clerk-auth-message",
    Authorization: "authorization",
    AuthReason: "x-clerk-auth-reason",
    AuthSignature: "x-clerk-auth-signature",
    AuthStatus: "x-clerk-auth-status",
    AuthToken: "x-clerk-auth-token",
    CacheControl: "cache-control",
    ClerkRedirectTo: "x-clerk-redirect-to",
    ClerkRequestData: "x-clerk-request-data",
    ClerkUrl: "x-clerk-clerk-url",
    CloudFrontForwardedProto: "cloudfront-forwarded-proto",
    ContentType: "content-type",
    ContentSecurityPolicy: "content-security-policy",
    ContentSecurityPolicyReportOnly: "content-security-policy-report-only",
    EnableDebug: "x-clerk-debug",
    ForwardedHost: "x-forwarded-host",
    ForwardedPort: "x-forwarded-port",
    ForwardedProto: "x-forwarded-proto",
    Host: "host",
    Location: "location",
    Nonce: "x-nonce",
    Origin: "origin",
    Referrer: "referer",
    SecFetchDest: "sec-fetch-dest",
    SecFetchSite: "sec-fetch-site",
    UserAgent: "user-agent",
    ReportingEndpoints: "reporting-endpoints"
};
var ContentTypes = {
    Json: "application/json"
};
var chunk_I24FT6SE_constants = {
    Attributes,
    Cookies,
    Headers: Headers2,
    ContentTypes,
    QueryParameters
};
// src/createRedirect.ts

var buildUrl = (_baseUrl, _targetUrl, _returnBackUrl, _devBrowserToken)=>{
    if (_baseUrl === "") {
        return legacyBuildUrl(_targetUrl.toString(), _returnBackUrl?.toString());
    }
    const baseUrl = new URL(_baseUrl);
    const returnBackUrl = _returnBackUrl ? new URL(_returnBackUrl, baseUrl) : void 0;
    const res = new URL(_targetUrl, baseUrl);
    const isCrossOriginRedirect = `${baseUrl.hostname}:${baseUrl.port}` !== `${res.hostname}:${res.port}`;
    if (returnBackUrl) {
        if (isCrossOriginRedirect) {
            returnBackUrl.searchParams.delete(chunk_I24FT6SE_constants.QueryParameters.ClerkSynced);
        }
        res.searchParams.set("redirect_url", returnBackUrl.toString());
    }
    if (isCrossOriginRedirect && _devBrowserToken) {
        res.searchParams.set(chunk_I24FT6SE_constants.QueryParameters.DevBrowser, _devBrowserToken);
    }
    return res.toString();
};
var legacyBuildUrl = (targetUrl, redirectUrl)=>{
    let url;
    if (!targetUrl.startsWith("http")) {
        if (!redirectUrl || !redirectUrl.startsWith("http")) {
            throw new Error("destination url or return back url should be an absolute path url!");
        }
        const baseURL = new URL(redirectUrl);
        url = new URL(targetUrl, baseURL.origin);
    } else {
        url = new URL(targetUrl);
    }
    if (redirectUrl) {
        url.searchParams.set("redirect_url", redirectUrl);
    }
    return url.toString();
};
var createRedirect = (params)=>{
    const { publishableKey, redirectAdapter, signInUrl, signUpUrl, baseUrl, sessionStatus } = params;
    const parsedPublishableKey = parsePublishableKey(publishableKey);
    const frontendApi = parsedPublishableKey?.frontendApi;
    const isDevelopment = parsedPublishableKey?.instanceType === "development";
    const accountsBaseUrl = buildAccountsBaseUrl(frontendApi);
    const hasPendingStatus = sessionStatus === "pending";
    const redirectToTasks = (url, { returnBackUrl })=>{
        return redirectAdapter(buildUrl(baseUrl, `${url}/tasks`, returnBackUrl, isDevelopment ? params.devBrowserToken : null));
    };
    const redirectToSignUp = ({ returnBackUrl } = {})=>{
        if (!signUpUrl && !accountsBaseUrl) {
            errorThrower.throwMissingPublishableKeyError();
        }
        const accountsSignUpUrl = `${accountsBaseUrl}/sign-up`;
        function buildSignUpUrl(signIn) {
            if (!signIn) {
                return;
            }
            const url = new URL(signIn, baseUrl);
            url.pathname = `${url.pathname}/create`;
            return url.toString();
        }
        const targetUrl = signUpUrl || buildSignUpUrl(signInUrl) || accountsSignUpUrl;
        if (hasPendingStatus) {
            return redirectToTasks(targetUrl, {
                returnBackUrl
            });
        }
        return redirectAdapter(buildUrl(baseUrl, targetUrl, returnBackUrl, isDevelopment ? params.devBrowserToken : null));
    };
    const redirectToSignIn = ({ returnBackUrl } = {})=>{
        if (!signInUrl && !accountsBaseUrl) {
            errorThrower.throwMissingPublishableKeyError();
        }
        const accountsSignInUrl = `${accountsBaseUrl}/sign-in`;
        const targetUrl = signInUrl || accountsSignInUrl;
        if (hasPendingStatus) {
            return redirectToTasks(targetUrl, {
                returnBackUrl
            });
        }
        return redirectAdapter(buildUrl(baseUrl, targetUrl, returnBackUrl, isDevelopment ? params.devBrowserToken : null));
    };
    return {
        redirectToSignUp,
        redirectToSignIn
    };
};
// src/util/mergePreDefinedOptions.ts
function mergePreDefinedOptions(preDefinedOptions, options) {
    return Object.keys(preDefinedOptions).reduce((obj, key)=>{
        return {
            ...obj,
            [key]: options[key] || obj[key]
        };
    }, {
        ...preDefinedOptions
    });
}
// src/util/optionsAssertions.ts
function assertValidSecretKey(val) {
    if (!val || typeof val !== "string") {
        throw Error("Missing Clerk Secret Key. Go to https://dashboard.clerk.com and get your key for your instance.");
    }
}
function assertValidPublishableKey(val) {
    parsePublishableKey(val, {
        fatal: true
    });
}
// src/tokens/authenticateContext.ts


// src/tokens/tokenTypes.ts
var TokenType = {
    SessionToken: "session_token",
    ApiKey: "api_key",
    M2MToken: "m2m_token",
    OAuthToken: "oauth_token"
};
// src/tokens/authenticateContext.ts
var AuthenticateContext = class {
    constructor(cookieSuffix, clerkRequest, options){
        this.cookieSuffix = cookieSuffix;
        this.clerkRequest = clerkRequest;
        /**
     * The original Clerk frontend API URL, extracted from publishable key before proxy URL override.
     * Used for backend operations like token validation and issuer checking.
     */ this.originalFrontendApi = "";
        if (options.acceptsToken === TokenType.M2MToken || options.acceptsToken === TokenType.ApiKey) {
            this.initHeaderValues();
        } else {
            this.initPublishableKeyValues(options);
            this.initHeaderValues();
            this.initCookieValues();
            this.initHandshakeValues();
        }
        Object.assign(this, options);
        this.clerkUrl = this.clerkRequest.clerkUrl;
    }
    /**
   * Retrieves the session token from either the cookie or the header.
   *
   * @returns {string | undefined} The session token if available, otherwise undefined.
   */ get sessionToken() {
        return this.sessionTokenInCookie || this.tokenInHeader;
    }
    usesSuffixedCookies() {
        const suffixedClientUat = this.getSuffixedCookie(chunk_I24FT6SE_constants.Cookies.ClientUat);
        const clientUat = this.getCookie(chunk_I24FT6SE_constants.Cookies.ClientUat);
        const suffixedSession = this.getSuffixedCookie(chunk_I24FT6SE_constants.Cookies.Session) || "";
        const session = this.getCookie(chunk_I24FT6SE_constants.Cookies.Session) || "";
        if (session && !this.tokenHasIssuer(session)) {
            return false;
        }
        if (session && !this.tokenBelongsToInstance(session)) {
            return true;
        }
        if (!suffixedClientUat && !suffixedSession) {
            return false;
        }
        const { data: sessionData } = decodeJwt(session);
        const sessionIat = sessionData?.payload.iat || 0;
        const { data: suffixedSessionData } = decodeJwt(suffixedSession);
        const suffixedSessionIat = suffixedSessionData?.payload.iat || 0;
        if (suffixedClientUat !== "0" && clientUat !== "0" && sessionIat > suffixedSessionIat) {
            return false;
        }
        if (suffixedClientUat === "0" && clientUat !== "0") {
            return false;
        }
        if (this.instanceType !== "production") {
            const isSuffixedSessionExpired = this.sessionExpired(suffixedSessionData);
            if (suffixedClientUat !== "0" && clientUat === "0" && isSuffixedSessionExpired) {
                return false;
            }
        }
        if (!suffixedClientUat && suffixedSession) {
            return false;
        }
        return true;
    }
    /**
   * Determines if the request came from a different origin based on the referrer header.
   * Used for cross-origin detection in multi-domain authentication flows.
   *
   * @returns {boolean} True if referrer exists and is from a different origin, false otherwise.
   */ isCrossOriginReferrer() {
        if (!this.referrer || !this.clerkUrl.origin) {
            return false;
        }
        try {
            const referrerOrigin = new URL(this.referrer).origin;
            return referrerOrigin !== this.clerkUrl.origin;
        } catch  {
            return false;
        }
    }
    /**
   * Determines if the referrer URL is from a Clerk domain (accounts portal or FAPI).
   * This includes both development and production account portal domains, as well as FAPI domains
   * used for redirect-based authentication flows.
   *
   * @returns {boolean} True if the referrer is from a Clerk accounts portal or FAPI domain, false otherwise
   */ isKnownClerkReferrer() {
        if (!this.referrer) {
            return false;
        }
        try {
            const referrerOrigin = new URL(this.referrer);
            const referrerHost = referrerOrigin.hostname;
            if (this.frontendApi) {
                const fapiHost = this.frontendApi.startsWith("http") ? new URL(this.frontendApi).hostname : this.frontendApi;
                if (referrerHost === fapiHost) {
                    return true;
                }
            }
            if (isLegacyDevAccountPortalOrigin(referrerHost) || isCurrentDevAccountPortalOrigin(referrerHost)) {
                return true;
            }
            const expectedAccountsUrl = buildAccountsBaseUrl(this.frontendApi);
            if (expectedAccountsUrl) {
                const expectedAccountsOrigin = new URL(expectedAccountsUrl).origin;
                if (referrerOrigin.origin === expectedAccountsOrigin) {
                    return true;
                }
            }
            if (referrerHost.startsWith("accounts.")) {
                return true;
            }
            return false;
        } catch  {
            return false;
        }
    }
    initPublishableKeyValues(options) {
        assertValidPublishableKey(options.publishableKey);
        this.publishableKey = options.publishableKey;
        const originalPk = parsePublishableKey(this.publishableKey, {
            fatal: true,
            domain: options.domain,
            isSatellite: options.isSatellite
        });
        this.originalFrontendApi = originalPk.frontendApi;
        const pk = parsePublishableKey(this.publishableKey, {
            fatal: true,
            proxyUrl: options.proxyUrl,
            domain: options.domain,
            isSatellite: options.isSatellite
        });
        this.instanceType = pk.instanceType;
        this.frontendApi = pk.frontendApi;
    }
    initHeaderValues() {
        this.tokenInHeader = this.parseAuthorizationHeader(this.getHeader(chunk_I24FT6SE_constants.Headers.Authorization));
        this.origin = this.getHeader(chunk_I24FT6SE_constants.Headers.Origin);
        this.host = this.getHeader(chunk_I24FT6SE_constants.Headers.Host);
        this.forwardedHost = this.getHeader(chunk_I24FT6SE_constants.Headers.ForwardedHost);
        this.forwardedProto = this.getHeader(chunk_I24FT6SE_constants.Headers.CloudFrontForwardedProto) || this.getHeader(chunk_I24FT6SE_constants.Headers.ForwardedProto);
        this.referrer = this.getHeader(chunk_I24FT6SE_constants.Headers.Referrer);
        this.userAgent = this.getHeader(chunk_I24FT6SE_constants.Headers.UserAgent);
        this.secFetchDest = this.getHeader(chunk_I24FT6SE_constants.Headers.SecFetchDest);
        this.accept = this.getHeader(chunk_I24FT6SE_constants.Headers.Accept);
    }
    initCookieValues() {
        this.sessionTokenInCookie = this.getSuffixedOrUnSuffixedCookie(chunk_I24FT6SE_constants.Cookies.Session);
        this.refreshTokenInCookie = this.getSuffixedCookie(chunk_I24FT6SE_constants.Cookies.Refresh);
        this.clientUat = Number.parseInt(this.getSuffixedOrUnSuffixedCookie(chunk_I24FT6SE_constants.Cookies.ClientUat) || "") || 0;
    }
    initHandshakeValues() {
        this.devBrowserToken = this.getQueryParam(chunk_I24FT6SE_constants.QueryParameters.DevBrowser) || this.getSuffixedOrUnSuffixedCookie(chunk_I24FT6SE_constants.Cookies.DevBrowser);
        this.handshakeToken = this.getQueryParam(chunk_I24FT6SE_constants.QueryParameters.Handshake) || this.getCookie(chunk_I24FT6SE_constants.Cookies.Handshake);
        this.handshakeRedirectLoopCounter = Number(this.getCookie(chunk_I24FT6SE_constants.Cookies.RedirectCount)) || 0;
        this.handshakeNonce = this.getQueryParam(chunk_I24FT6SE_constants.QueryParameters.HandshakeNonce) || this.getCookie(chunk_I24FT6SE_constants.Cookies.HandshakeNonce);
    }
    getQueryParam(name) {
        return this.clerkRequest.clerkUrl.searchParams.get(name);
    }
    getHeader(name) {
        return this.clerkRequest.headers.get(name) || void 0;
    }
    getCookie(name) {
        return this.clerkRequest.cookies.get(name) || void 0;
    }
    getSuffixedCookie(name) {
        return this.getCookie(getSuffixedCookieName(name, this.cookieSuffix)) || void 0;
    }
    getSuffixedOrUnSuffixedCookie(cookieName) {
        if (this.usesSuffixedCookies()) {
            return this.getSuffixedCookie(cookieName);
        }
        return this.getCookie(cookieName);
    }
    parseAuthorizationHeader(authorizationHeader) {
        if (!authorizationHeader) {
            return void 0;
        }
        const [scheme, token] = authorizationHeader.split(" ", 2);
        if (!token) {
            return scheme;
        }
        if (scheme === "Bearer") {
            return token;
        }
        return void 0;
    }
    tokenHasIssuer(token) {
        const { data, errors } = decodeJwt(token);
        if (errors) {
            return false;
        }
        return !!data.payload.iss;
    }
    tokenBelongsToInstance(token) {
        if (!token) {
            return false;
        }
        const { data, errors } = decodeJwt(token);
        if (errors) {
            return false;
        }
        const tokenIssuer = data.payload.iss.replace(/https?:\/\//gi, "");
        return this.originalFrontendApi === tokenIssuer;
    }
    sessionExpired(jwt) {
        return !!jwt && jwt?.payload.exp <= Date.now() / 1e3 >> 0;
    }
};
var createAuthenticateContext = async (clerkRequest, options)=>{
    const cookieSuffix = options.publishableKey ? await getCookieSuffix(options.publishableKey, runtime.crypto.subtle) : "";
    return new AuthenticateContext(cookieSuffix, clerkRequest, options);
};
// src/tokens/authObjects.ts


// src/util/path.ts
var SEPARATOR = "/";
var MULTIPLE_SEPARATOR_REGEX = new RegExp("(?<!:)" + SEPARATOR + "{1,}", "g");
function joinPaths(...args) {
    return args.filter((p)=>p).join(SEPARATOR).replace(MULTIPLE_SEPARATOR_REGEX, SEPARATOR);
}
// src/api/endpoints/AbstractApi.ts
var AbstractAPI = class {
    constructor(request){
        this.request = request;
    }
    requireId(id) {
        if (!id) {
            throw new Error("A valid resource ID is required.");
        }
    }
};
// src/api/endpoints/ActorTokenApi.ts
var basePath = "/actor_tokens";
var ActorTokenAPI = class extends AbstractAPI {
    async create(params) {
        return this.request({
            method: "POST",
            path: basePath,
            bodyParams: params
        });
    }
    async revoke(actorTokenId) {
        this.requireId(actorTokenId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath, actorTokenId, "revoke")
        });
    }
};
// src/api/endpoints/AccountlessApplicationsAPI.ts
var basePath2 = "/accountless_applications";
var AccountlessApplicationAPI = class extends AbstractAPI {
    async createAccountlessApplication(params) {
        const headerParams = params?.requestHeaders ? Object.fromEntries(params.requestHeaders.entries()) : void 0;
        return this.request({
            method: "POST",
            path: basePath2,
            headerParams
        });
    }
    async completeAccountlessApplicationOnboarding(params) {
        const headerParams = params?.requestHeaders ? Object.fromEntries(params.requestHeaders.entries()) : void 0;
        return this.request({
            method: "POST",
            path: joinPaths(basePath2, "complete"),
            headerParams
        });
    }
};
// src/api/endpoints/AllowlistIdentifierApi.ts
var basePath3 = "/allowlist_identifiers";
var AllowlistIdentifierAPI = class extends AbstractAPI {
    async getAllowlistIdentifierList(params = {}) {
        return this.request({
            method: "GET",
            path: basePath3,
            queryParams: {
                ...params,
                paginated: true
            }
        });
    }
    async createAllowlistIdentifier(params) {
        return this.request({
            method: "POST",
            path: basePath3,
            bodyParams: params
        });
    }
    async deleteAllowlistIdentifier(allowlistIdentifierId) {
        this.requireId(allowlistIdentifierId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath3, allowlistIdentifierId)
        });
    }
};
// src/api/endpoints/APIKeysApi.ts
var basePath4 = "/api_keys";
var APIKeysAPI = class extends AbstractAPI {
    async list(queryParams) {
        return this.request({
            method: "GET",
            path: basePath4,
            queryParams
        });
    }
    async create(params) {
        return this.request({
            method: "POST",
            path: basePath4,
            bodyParams: params
        });
    }
    async revoke(params) {
        const { apiKeyId, ...bodyParams } = params;
        this.requireId(apiKeyId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath4, apiKeyId, "revoke"),
            bodyParams
        });
    }
    async getSecret(apiKeyId) {
        this.requireId(apiKeyId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath4, apiKeyId, "secret")
        });
    }
    async verifySecret(secret) {
        return this.request({
            method: "POST",
            path: joinPaths(basePath4, "verify"),
            bodyParams: {
                secret
            }
        });
    }
};
// src/api/endpoints/BetaFeaturesApi.ts
var basePath5 = "/beta_features";
var BetaFeaturesAPI = class extends AbstractAPI {
    /**
   * Change the domain of a production instance.
   *
   * Changing the domain requires updating the DNS records accordingly, deploying new SSL certificates,
   * updating your Social Connection's redirect URLs and setting the new keys in your code.
   *
   * @remarks
   * WARNING: Changing your domain will invalidate all current user sessions (i.e. users will be logged out).
   *          Also, while your application is being deployed, a small downtime is expected to occur.
   */ async changeDomain(params) {
        return this.request({
            method: "POST",
            path: joinPaths(basePath5, "change_domain"),
            bodyParams: params
        });
    }
};
// src/api/endpoints/BlocklistIdentifierApi.ts
var basePath6 = "/blocklist_identifiers";
var BlocklistIdentifierAPI = class extends AbstractAPI {
    async getBlocklistIdentifierList(params = {}) {
        return this.request({
            method: "GET",
            path: basePath6,
            queryParams: params
        });
    }
    async createBlocklistIdentifier(params) {
        return this.request({
            method: "POST",
            path: basePath6,
            bodyParams: params
        });
    }
    async deleteBlocklistIdentifier(blocklistIdentifierId) {
        this.requireId(blocklistIdentifierId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath6, blocklistIdentifierId)
        });
    }
};
// src/api/endpoints/ClientApi.ts
var basePath7 = "/clients";
var ClientAPI = class extends AbstractAPI {
    async getClientList(params = {}) {
        return this.request({
            method: "GET",
            path: basePath7,
            queryParams: {
                ...params,
                paginated: true
            }
        });
    }
    async getClient(clientId) {
        this.requireId(clientId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath7, clientId)
        });
    }
    verifyClient(token) {
        return this.request({
            method: "POST",
            path: joinPaths(basePath7, "verify"),
            bodyParams: {
                token
            }
        });
    }
    async getHandshakePayload(queryParams) {
        return this.request({
            method: "GET",
            path: joinPaths(basePath7, "handshake_payload"),
            queryParams
        });
    }
};
// src/api/endpoints/DomainApi.ts
var basePath8 = "/domains";
var DomainAPI = class extends AbstractAPI {
    async list() {
        return this.request({
            method: "GET",
            path: basePath8
        });
    }
    async add(params) {
        return this.request({
            method: "POST",
            path: basePath8,
            bodyParams: params
        });
    }
    async update(params) {
        const { domainId, ...bodyParams } = params;
        this.requireId(domainId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath8, domainId),
            bodyParams
        });
    }
    /**
   * Deletes a satellite domain for the instance.
   * It is currently not possible to delete the instance's primary domain.
   */ async delete(satelliteDomainId) {
        return this.deleteDomain(satelliteDomainId);
    }
    /**
   * @deprecated Use `delete` instead
   */ async deleteDomain(satelliteDomainId) {
        this.requireId(satelliteDomainId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath8, satelliteDomainId)
        });
    }
};
// src/api/endpoints/EmailAddressApi.ts
var basePath9 = "/email_addresses";
var EmailAddressAPI = class extends AbstractAPI {
    async getEmailAddress(emailAddressId) {
        this.requireId(emailAddressId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath9, emailAddressId)
        });
    }
    async createEmailAddress(params) {
        return this.request({
            method: "POST",
            path: basePath9,
            bodyParams: params
        });
    }
    async updateEmailAddress(emailAddressId, params = {}) {
        this.requireId(emailAddressId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath9, emailAddressId),
            bodyParams: params
        });
    }
    async deleteEmailAddress(emailAddressId) {
        this.requireId(emailAddressId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath9, emailAddressId)
        });
    }
};
// src/api/endpoints/IdPOAuthAccessTokenApi.ts
var basePath10 = "/oauth_applications/access_tokens";
var IdPOAuthAccessTokenApi = class extends AbstractAPI {
    async verifyAccessToken(accessToken) {
        return this.request({
            method: "POST",
            path: joinPaths(basePath10, "verify"),
            bodyParams: {
                access_token: accessToken
            }
        });
    }
};
// src/api/endpoints/InstanceApi.ts
var basePath11 = "/instance";
var InstanceAPI = class extends AbstractAPI {
    async get() {
        return this.request({
            method: "GET",
            path: basePath11
        });
    }
    async update(params) {
        return this.request({
            method: "PATCH",
            path: basePath11,
            bodyParams: params
        });
    }
    async updateRestrictions(params) {
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath11, "restrictions"),
            bodyParams: params
        });
    }
    async updateOrganizationSettings(params) {
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath11, "organization_settings"),
            bodyParams: params
        });
    }
};
// src/api/endpoints/InvitationApi.ts
var basePath12 = "/invitations";
var InvitationAPI = class extends AbstractAPI {
    async getInvitationList(params = {}) {
        return this.request({
            method: "GET",
            path: basePath12,
            queryParams: {
                ...params,
                paginated: true
            }
        });
    }
    async createInvitation(params) {
        return this.request({
            method: "POST",
            path: basePath12,
            bodyParams: params
        });
    }
    async createInvitationBulk(params) {
        return this.request({
            method: "POST",
            path: joinPaths(basePath12, "bulk"),
            bodyParams: params
        });
    }
    async revokeInvitation(invitationId) {
        this.requireId(invitationId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath12, invitationId, "revoke")
        });
    }
};
// src/api/endpoints/MachineApi.ts
var basePath13 = "/machines";
var MachineApi = class extends AbstractAPI {
    async get(machineId) {
        this.requireId(machineId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath13, machineId)
        });
    }
    async list(queryParams = {}) {
        return this.request({
            method: "GET",
            path: basePath13,
            queryParams
        });
    }
    async create(bodyParams) {
        return this.request({
            method: "POST",
            path: basePath13,
            bodyParams
        });
    }
    async update(params) {
        const { machineId, ...bodyParams } = params;
        this.requireId(machineId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath13, machineId),
            bodyParams
        });
    }
    async delete(machineId) {
        this.requireId(machineId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath13, machineId)
        });
    }
    async getSecretKey(machineId) {
        this.requireId(machineId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath13, machineId, "secret_key")
        });
    }
    async rotateSecretKey(params) {
        const { machineId, previousTokenTtl } = params;
        this.requireId(machineId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath13, machineId, "secret_key", "rotate"),
            bodyParams: {
                previousTokenTtl
            }
        });
    }
    /**
   * Creates a new machine scope, allowing the specified machine to access another machine.
   *
   * @param machineId - The ID of the machine that will have access to another machine.
   * @param toMachineId - The ID of the machine that will be scoped to the current machine.
   */ async createScope(machineId, toMachineId) {
        this.requireId(machineId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath13, machineId, "scopes"),
            bodyParams: {
                toMachineId
            }
        });
    }
    /**
   * Deletes a machine scope, removing access from one machine to another.
   *
   * @param machineId - The ID of the machine that has access to another machine.
   * @param otherMachineId - The ID of the machine that is being accessed.
   */ async deleteScope(machineId, otherMachineId) {
        this.requireId(machineId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath13, machineId, "scopes", otherMachineId)
        });
    }
};
// src/api/endpoints/M2MTokenApi.ts
var basePath14 = "/m2m_tokens";
var _M2MTokenApi_instances, createRequestOptions_fn;
var M2MTokenApi = class extends AbstractAPI {
    constructor(){
        super(...arguments);
        __privateAdd(this, _M2MTokenApi_instances);
    }
    async createToken(params) {
        const { claims = null, machineSecretKey, secondsUntilExpiration = null } = params || {};
        const requestOptions = __privateMethod(this, _M2MTokenApi_instances, createRequestOptions_fn).call(this, {
            method: "POST",
            path: basePath14,
            bodyParams: {
                secondsUntilExpiration,
                claims
            }
        }, machineSecretKey);
        return this.request(requestOptions);
    }
    async revokeToken(params) {
        const { m2mTokenId, revocationReason = null, machineSecretKey } = params;
        this.requireId(m2mTokenId);
        const requestOptions = __privateMethod(this, _M2MTokenApi_instances, createRequestOptions_fn).call(this, {
            method: "POST",
            path: joinPaths(basePath14, m2mTokenId, "revoke"),
            bodyParams: {
                revocationReason
            }
        }, machineSecretKey);
        return this.request(requestOptions);
    }
    async verifyToken(params) {
        const { token, machineSecretKey } = params;
        const requestOptions = __privateMethod(this, _M2MTokenApi_instances, createRequestOptions_fn).call(this, {
            method: "POST",
            path: joinPaths(basePath14, "verify"),
            bodyParams: {
                token
            }
        }, machineSecretKey);
        return this.request(requestOptions);
    }
};
_M2MTokenApi_instances = new WeakSet();
createRequestOptions_fn = function(options, machineSecretKey) {
    if (machineSecretKey) {
        return {
            ...options,
            headerParams: {
                ...options.headerParams,
                Authorization: `Bearer ${machineSecretKey}`
            }
        };
    }
    return options;
};
// src/api/endpoints/JwksApi.ts
var basePath15 = "/jwks";
var JwksAPI = class extends AbstractAPI {
    async getJwks() {
        return this.request({
            method: "GET",
            path: basePath15
        });
    }
};
// src/api/endpoints/JwtTemplatesApi.ts
var basePath16 = "/jwt_templates";
var JwtTemplatesApi = class extends AbstractAPI {
    async list(params = {}) {
        return this.request({
            method: "GET",
            path: basePath16,
            queryParams: {
                ...params,
                paginated: true
            }
        });
    }
    async get(templateId) {
        this.requireId(templateId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath16, templateId)
        });
    }
    async create(params) {
        return this.request({
            method: "POST",
            path: basePath16,
            bodyParams: params
        });
    }
    async update(params) {
        const { templateId, ...bodyParams } = params;
        this.requireId(templateId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath16, templateId),
            bodyParams
        });
    }
    async delete(templateId) {
        this.requireId(templateId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath16, templateId)
        });
    }
};
// src/api/endpoints/OrganizationApi.ts
var basePath17 = "/organizations";
var OrganizationAPI = class extends AbstractAPI {
    async getOrganizationList(params) {
        return this.request({
            method: "GET",
            path: basePath17,
            queryParams: params
        });
    }
    async createOrganization(params) {
        return this.request({
            method: "POST",
            path: basePath17,
            bodyParams: params
        });
    }
    async getOrganization(params) {
        const { includeMembersCount } = params;
        const organizationIdOrSlug = "organizationId" in params ? params.organizationId : params.slug;
        this.requireId(organizationIdOrSlug);
        return this.request({
            method: "GET",
            path: joinPaths(basePath17, organizationIdOrSlug),
            queryParams: {
                includeMembersCount
            }
        });
    }
    async updateOrganization(organizationId, params) {
        this.requireId(organizationId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath17, organizationId),
            bodyParams: params
        });
    }
    async updateOrganizationLogo(organizationId, params) {
        this.requireId(organizationId);
        const formData = new runtime.FormData();
        formData.append("file", params?.file);
        if (params?.uploaderUserId) {
            formData.append("uploader_user_id", params?.uploaderUserId);
        }
        return this.request({
            method: "PUT",
            path: joinPaths(basePath17, organizationId, "logo"),
            formData
        });
    }
    async deleteOrganizationLogo(organizationId) {
        this.requireId(organizationId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath17, organizationId, "logo")
        });
    }
    async updateOrganizationMetadata(organizationId, params) {
        this.requireId(organizationId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath17, organizationId, "metadata"),
            bodyParams: params
        });
    }
    async deleteOrganization(organizationId) {
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath17, organizationId)
        });
    }
    async getOrganizationMembershipList(params) {
        const { organizationId, ...queryParams } = params;
        this.requireId(organizationId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath17, organizationId, "memberships"),
            queryParams
        });
    }
    async getInstanceOrganizationMembershipList(params) {
        return this.request({
            method: "GET",
            path: "/organization_memberships",
            queryParams: params
        });
    }
    async createOrganizationMembership(params) {
        const { organizationId, ...bodyParams } = params;
        this.requireId(organizationId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath17, organizationId, "memberships"),
            bodyParams
        });
    }
    async updateOrganizationMembership(params) {
        const { organizationId, userId, ...bodyParams } = params;
        this.requireId(organizationId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath17, organizationId, "memberships", userId),
            bodyParams
        });
    }
    async updateOrganizationMembershipMetadata(params) {
        const { organizationId, userId, ...bodyParams } = params;
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath17, organizationId, "memberships", userId, "metadata"),
            bodyParams
        });
    }
    async deleteOrganizationMembership(params) {
        const { organizationId, userId } = params;
        this.requireId(organizationId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath17, organizationId, "memberships", userId)
        });
    }
    async getOrganizationInvitationList(params) {
        const { organizationId, ...queryParams } = params;
        this.requireId(organizationId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath17, organizationId, "invitations"),
            queryParams
        });
    }
    async createOrganizationInvitation(params) {
        const { organizationId, ...bodyParams } = params;
        this.requireId(organizationId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath17, organizationId, "invitations"),
            bodyParams
        });
    }
    async createOrganizationInvitationBulk(organizationId, params) {
        this.requireId(organizationId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath17, organizationId, "invitations", "bulk"),
            bodyParams: params
        });
    }
    async getOrganizationInvitation(params) {
        const { organizationId, invitationId } = params;
        this.requireId(organizationId);
        this.requireId(invitationId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath17, organizationId, "invitations", invitationId)
        });
    }
    async revokeOrganizationInvitation(params) {
        const { organizationId, invitationId, ...bodyParams } = params;
        this.requireId(organizationId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath17, organizationId, "invitations", invitationId, "revoke"),
            bodyParams
        });
    }
    async getOrganizationDomainList(params) {
        const { organizationId, ...queryParams } = params;
        this.requireId(organizationId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath17, organizationId, "domains"),
            queryParams
        });
    }
    async createOrganizationDomain(params) {
        const { organizationId, ...bodyParams } = params;
        this.requireId(organizationId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath17, organizationId, "domains"),
            bodyParams: {
                ...bodyParams,
                verified: bodyParams.verified ?? true
            }
        });
    }
    async updateOrganizationDomain(params) {
        const { organizationId, domainId, ...bodyParams } = params;
        this.requireId(organizationId);
        this.requireId(domainId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath17, organizationId, "domains", domainId),
            bodyParams
        });
    }
    async deleteOrganizationDomain(params) {
        const { organizationId, domainId } = params;
        this.requireId(organizationId);
        this.requireId(domainId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath17, organizationId, "domains", domainId)
        });
    }
};
// src/api/endpoints/OAuthApplicationsApi.ts
var basePath18 = "/oauth_applications";
var OAuthApplicationsApi = class extends AbstractAPI {
    async list(params = {}) {
        return this.request({
            method: "GET",
            path: basePath18,
            queryParams: params
        });
    }
    async get(oauthApplicationId) {
        this.requireId(oauthApplicationId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath18, oauthApplicationId)
        });
    }
    async create(params) {
        return this.request({
            method: "POST",
            path: basePath18,
            bodyParams: params
        });
    }
    async update(params) {
        const { oauthApplicationId, ...bodyParams } = params;
        this.requireId(oauthApplicationId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath18, oauthApplicationId),
            bodyParams
        });
    }
    async delete(oauthApplicationId) {
        this.requireId(oauthApplicationId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath18, oauthApplicationId)
        });
    }
    async rotateSecret(oauthApplicationId) {
        this.requireId(oauthApplicationId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath18, oauthApplicationId, "rotate_secret")
        });
    }
};
// src/api/endpoints/PhoneNumberApi.ts
var basePath19 = "/phone_numbers";
var PhoneNumberAPI = class extends AbstractAPI {
    async getPhoneNumber(phoneNumberId) {
        this.requireId(phoneNumberId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath19, phoneNumberId)
        });
    }
    async createPhoneNumber(params) {
        return this.request({
            method: "POST",
            path: basePath19,
            bodyParams: params
        });
    }
    async updatePhoneNumber(phoneNumberId, params = {}) {
        this.requireId(phoneNumberId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath19, phoneNumberId),
            bodyParams: params
        });
    }
    async deletePhoneNumber(phoneNumberId) {
        this.requireId(phoneNumberId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath19, phoneNumberId)
        });
    }
};
// src/api/endpoints/ProxyCheckApi.ts
var basePath20 = "/proxy_checks";
var ProxyCheckAPI = class extends AbstractAPI {
    async verify(params) {
        return this.request({
            method: "POST",
            path: basePath20,
            bodyParams: params
        });
    }
};
// src/api/endpoints/RedirectUrlApi.ts
var basePath21 = "/redirect_urls";
var RedirectUrlAPI = class extends AbstractAPI {
    async getRedirectUrlList() {
        return this.request({
            method: "GET",
            path: basePath21,
            queryParams: {
                paginated: true
            }
        });
    }
    async getRedirectUrl(redirectUrlId) {
        this.requireId(redirectUrlId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath21, redirectUrlId)
        });
    }
    async createRedirectUrl(params) {
        return this.request({
            method: "POST",
            path: basePath21,
            bodyParams: params
        });
    }
    async deleteRedirectUrl(redirectUrlId) {
        this.requireId(redirectUrlId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath21, redirectUrlId)
        });
    }
};
// src/api/endpoints/SamlConnectionApi.ts
var basePath22 = "/saml_connections";
var SamlConnectionAPI = class extends AbstractAPI {
    async getSamlConnectionList(params = {}) {
        return this.request({
            method: "GET",
            path: basePath22,
            queryParams: params
        });
    }
    async createSamlConnection(params) {
        return this.request({
            method: "POST",
            path: basePath22,
            bodyParams: params,
            options: {
                deepSnakecaseBodyParamKeys: true
            }
        });
    }
    async getSamlConnection(samlConnectionId) {
        this.requireId(samlConnectionId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath22, samlConnectionId)
        });
    }
    async updateSamlConnection(samlConnectionId, params = {}) {
        this.requireId(samlConnectionId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath22, samlConnectionId),
            bodyParams: params,
            options: {
                deepSnakecaseBodyParamKeys: true
            }
        });
    }
    async deleteSamlConnection(samlConnectionId) {
        this.requireId(samlConnectionId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath22, samlConnectionId)
        });
    }
};
// src/api/endpoints/SessionApi.ts
var basePath23 = "/sessions";
var SessionAPI = class extends AbstractAPI {
    async getSessionList(params = {}) {
        return this.request({
            method: "GET",
            path: basePath23,
            queryParams: {
                ...params,
                paginated: true
            }
        });
    }
    async getSession(sessionId) {
        this.requireId(sessionId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath23, sessionId)
        });
    }
    async createSession(params) {
        return this.request({
            method: "POST",
            path: basePath23,
            bodyParams: params
        });
    }
    async revokeSession(sessionId) {
        this.requireId(sessionId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath23, sessionId, "revoke")
        });
    }
    async verifySession(sessionId, token) {
        this.requireId(sessionId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath23, sessionId, "verify"),
            bodyParams: {
                token
            }
        });
    }
    /**
   * Retrieves a session token or generates a JWT using a specified template.
   *
   * @param sessionId - The ID of the session for which to generate the token
   * @param template - Optional name of the JWT template configured in the Clerk Dashboard.
   * @param expiresInSeconds - Optional expiration time for the token in seconds.
   *   If not provided, uses the default expiration.
   *
   * @returns A promise that resolves to the generated token
   *
   * @throws {Error} When sessionId is invalid or empty
   */ async getToken(sessionId, template, expiresInSeconds) {
        this.requireId(sessionId);
        const path = template ? joinPaths(basePath23, sessionId, "tokens", template) : joinPaths(basePath23, sessionId, "tokens");
        const requestOptions = {
            method: "POST",
            path
        };
        if (expiresInSeconds !== void 0) {
            requestOptions.bodyParams = {
                expires_in_seconds: expiresInSeconds
            };
        }
        return this.request(requestOptions);
    }
    async refreshSession(sessionId, params) {
        this.requireId(sessionId);
        const { suffixed_cookies, ...restParams } = params;
        return this.request({
            method: "POST",
            path: joinPaths(basePath23, sessionId, "refresh"),
            bodyParams: restParams,
            queryParams: {
                suffixed_cookies
            }
        });
    }
};
// src/api/endpoints/SignInTokenApi.ts
var basePath24 = "/sign_in_tokens";
var SignInTokenAPI = class extends AbstractAPI {
    async createSignInToken(params) {
        return this.request({
            method: "POST",
            path: basePath24,
            bodyParams: params
        });
    }
    async revokeSignInToken(signInTokenId) {
        this.requireId(signInTokenId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath24, signInTokenId, "revoke")
        });
    }
};
// src/api/endpoints/SignUpApi.ts
var basePath25 = "/sign_ups";
var SignUpAPI = class extends AbstractAPI {
    async get(signUpAttemptId) {
        this.requireId(signUpAttemptId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath25, signUpAttemptId)
        });
    }
    async update(params) {
        const { signUpAttemptId, ...bodyParams } = params;
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath25, signUpAttemptId),
            bodyParams
        });
    }
};
// src/api/endpoints/TestingTokenApi.ts
var basePath26 = "/testing_tokens";
var TestingTokenAPI = class extends AbstractAPI {
    async createTestingToken() {
        return this.request({
            method: "POST",
            path: basePath26
        });
    }
};
// src/api/endpoints/UserApi.ts
var basePath27 = "/users";
var UserAPI = class extends AbstractAPI {
    async getUserList(params = {}) {
        const { limit, offset, orderBy, ...userCountParams } = params;
        const [data, totalCount] = await Promise.all([
            this.request({
                method: "GET",
                path: basePath27,
                queryParams: params
            }),
            this.getCount(userCountParams)
        ]);
        return {
            data,
            totalCount
        };
    }
    async getUser(userId) {
        this.requireId(userId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath27, userId)
        });
    }
    async createUser(params) {
        return this.request({
            method: "POST",
            path: basePath27,
            bodyParams: params
        });
    }
    async updateUser(userId, params = {}) {
        this.requireId(userId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath27, userId),
            bodyParams: params
        });
    }
    async updateUserProfileImage(userId, params) {
        this.requireId(userId);
        const formData = new runtime.FormData();
        formData.append("file", params?.file);
        return this.request({
            method: "POST",
            path: joinPaths(basePath27, userId, "profile_image"),
            formData
        });
    }
    async updateUserMetadata(userId, params) {
        this.requireId(userId);
        return this.request({
            method: "PATCH",
            path: joinPaths(basePath27, userId, "metadata"),
            bodyParams: params
        });
    }
    async deleteUser(userId) {
        this.requireId(userId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath27, userId)
        });
    }
    async getCount(params = {}) {
        return this.request({
            method: "GET",
            path: joinPaths(basePath27, "count"),
            queryParams: params
        });
    }
    async getUserOauthAccessToken(userId, provider) {
        this.requireId(userId);
        const hasPrefix = provider.startsWith("oauth_");
        const _provider = hasPrefix ? provider : `oauth_${provider}`;
        if (hasPrefix) {
            deprecated("getUserOauthAccessToken(userId, provider)", "Remove the `oauth_` prefix from the `provider` argument.");
        }
        return this.request({
            method: "GET",
            path: joinPaths(basePath27, userId, "oauth_access_tokens", _provider),
            queryParams: {
                paginated: true
            }
        });
    }
    async disableUserMFA(userId) {
        this.requireId(userId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath27, userId, "mfa")
        });
    }
    async getOrganizationMembershipList(params) {
        const { userId, limit, offset } = params;
        this.requireId(userId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath27, userId, "organization_memberships"),
            queryParams: {
                limit,
                offset
            }
        });
    }
    async getOrganizationInvitationList(params) {
        const { userId, ...queryParams } = params;
        this.requireId(userId);
        return this.request({
            method: "GET",
            path: joinPaths(basePath27, userId, "organization_invitations"),
            queryParams
        });
    }
    async verifyPassword(params) {
        const { userId, password } = params;
        this.requireId(userId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath27, userId, "verify_password"),
            bodyParams: {
                password
            }
        });
    }
    async verifyTOTP(params) {
        const { userId, code } = params;
        this.requireId(userId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath27, userId, "verify_totp"),
            bodyParams: {
                code
            }
        });
    }
    async banUser(userId) {
        this.requireId(userId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath27, userId, "ban")
        });
    }
    async unbanUser(userId) {
        this.requireId(userId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath27, userId, "unban")
        });
    }
    async lockUser(userId) {
        this.requireId(userId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath27, userId, "lock")
        });
    }
    async unlockUser(userId) {
        this.requireId(userId);
        return this.request({
            method: "POST",
            path: joinPaths(basePath27, userId, "unlock")
        });
    }
    async deleteUserProfileImage(userId) {
        this.requireId(userId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath27, userId, "profile_image")
        });
    }
    async deleteUserPasskey(params) {
        this.requireId(params.userId);
        this.requireId(params.passkeyIdentificationId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath27, params.userId, "passkeys", params.passkeyIdentificationId)
        });
    }
    async deleteUserWeb3Wallet(params) {
        this.requireId(params.userId);
        this.requireId(params.web3WalletIdentificationId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath27, params.userId, "web3_wallets", params.web3WalletIdentificationId)
        });
    }
    async deleteUserExternalAccount(params) {
        this.requireId(params.userId);
        this.requireId(params.externalAccountId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath27, params.userId, "external_accounts", params.externalAccountId)
        });
    }
    async deleteUserBackupCodes(userId) {
        this.requireId(userId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath27, userId, "backup_code")
        });
    }
    async deleteUserTOTP(userId) {
        this.requireId(userId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath27, userId, "totp")
        });
    }
};
// src/api/endpoints/WaitlistEntryApi.ts
var basePath28 = "/waitlist_entries";
var WaitlistEntryAPI = class extends AbstractAPI {
    /**
   * List waitlist entries.
   * @param params Optional parameters (e.g., `query`, `status`, `orderBy`).
   */ async list(params = {}) {
        return this.request({
            method: "GET",
            path: basePath28,
            queryParams: params
        });
    }
    /**
   * Create a waitlist entry.
   * @param params The parameters for creating a waitlist entry.
   */ async create(params) {
        return this.request({
            method: "POST",
            path: basePath28,
            bodyParams: params
        });
    }
    /**
   * Invite a waitlist entry.
   * @param id The waitlist entry ID.
   * @param params Optional parameters (e.g., `ignoreExisting`).
   */ async invite(id, params = {}) {
        this.requireId(id);
        return this.request({
            method: "POST",
            path: joinPaths(basePath28, id, "invite"),
            bodyParams: params
        });
    }
    /**
   * Reject a waitlist entry.
   * @param id The waitlist entry ID.
   */ async reject(id) {
        this.requireId(id);
        return this.request({
            method: "POST",
            path: joinPaths(basePath28, id, "reject")
        });
    }
    /**
   * Delete a waitlist entry.
   * @param id The waitlist entry ID.
   */ async delete(id) {
        this.requireId(id);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath28, id)
        });
    }
};
// src/api/endpoints/WebhookApi.ts
var basePath29 = "/webhooks";
var WebhookAPI = class extends AbstractAPI {
    async createSvixApp() {
        return this.request({
            method: "POST",
            path: joinPaths(basePath29, "svix")
        });
    }
    async generateSvixAuthURL() {
        return this.request({
            method: "POST",
            path: joinPaths(basePath29, "svix_url")
        });
    }
    async deleteSvixApp() {
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath29, "svix")
        });
    }
};
// src/api/endpoints/BillingApi.ts
var basePath30 = "/billing";
var organizationBasePath = "/organizations";
var userBasePath = "/users";
var BillingAPI = class extends AbstractAPI {
    /**
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */ async getPlanList(params) {
        return this.request({
            method: "GET",
            path: joinPaths(basePath30, "plans"),
            queryParams: params
        });
    }
    /**
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */ async cancelSubscriptionItem(subscriptionItemId, params) {
        this.requireId(subscriptionItemId);
        return this.request({
            method: "DELETE",
            path: joinPaths(basePath30, "subscription_items", subscriptionItemId),
            queryParams: params
        });
    }
    /**
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */ async extendSubscriptionItemFreeTrial(subscriptionItemId, params) {
        this.requireId(subscriptionItemId);
        return this.request({
            method: "POST",
            path: joinPaths("/billing", "subscription_items", subscriptionItemId, "extend_free_trial"),
            bodyParams: params
        });
    }
    /**
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */ async getOrganizationBillingSubscription(organizationId) {
        this.requireId(organizationId);
        return this.request({
            method: "GET",
            path: joinPaths(organizationBasePath, organizationId, "billing", "subscription")
        });
    }
    /**
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */ async getUserBillingSubscription(userId) {
        this.requireId(userId);
        return this.request({
            method: "GET",
            path: joinPaths(userBasePath, userId, "billing", "subscription")
        });
    }
};
// src/api/request.ts

// ../../node_modules/.pnpm/map-obj@5.0.2/node_modules/map-obj/index.js
var isObject = (value)=>typeof value === "object" && value !== null;
var isObjectCustom = (value)=>isObject(value) && !(value instanceof RegExp) && !(value instanceof Error) && !(value instanceof Date) && !(globalThis.Blob && value instanceof globalThis.Blob);
var mapObjectSkip = Symbol("mapObjectSkip");
var _mapObject = (object, mapper, options, isSeen = /* @__PURE__ */ new WeakMap())=>{
    options = {
        deep: false,
        target: {},
        ...options
    };
    if (isSeen.has(object)) {
        return isSeen.get(object);
    }
    isSeen.set(object, options.target);
    const { target } = options;
    delete options.target;
    const mapArray = (array)=>array.map((element)=>isObjectCustom(element) ? _mapObject(element, mapper, options, isSeen) : element);
    if (Array.isArray(object)) {
        return mapArray(object);
    }
    for (const [key, value] of Object.entries(object)){
        const mapResult = mapper(key, value, object);
        if (mapResult === mapObjectSkip) {
            continue;
        }
        let [newKey, newValue, { shouldRecurse = true } = {}] = mapResult;
        if (newKey === "__proto__") {
            continue;
        }
        if (options.deep && shouldRecurse && isObjectCustom(newValue)) {
            newValue = Array.isArray(newValue) ? mapArray(newValue) : _mapObject(newValue, mapper, options, isSeen);
        }
        target[newKey] = newValue;
    }
    return target;
};
function mapObject(object, mapper, options) {
    if (!isObject(object)) {
        throw new TypeError(`Expected an object, got \`${object}\` (${typeof object})`);
    }
    if (Array.isArray(object)) {
        throw new TypeError("Expected an object, got an array");
    }
    return _mapObject(object, mapper, options);
}
// ../../node_modules/.pnpm/change-case@5.4.4/node_modules/change-case/dist/index.js
var SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
var SPLIT_UPPER_UPPER_RE = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu;
var SPLIT_SEPARATE_NUMBER_RE = /(\d)\p{Ll}|(\p{L})\d/u;
var DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;
var SPLIT_REPLACE_VALUE = "$1\x00$2";
var DEFAULT_PREFIX_SUFFIX_CHARACTERS = "";
function split(value) {
    let result = value.trim();
    result = result.replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE).replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);
    result = result.replace(DEFAULT_STRIP_REGEXP, "\x00");
    let start = 0;
    let end = result.length;
    while(result.charAt(start) === "\x00")start++;
    if (start === end) return [];
    while(result.charAt(end - 1) === "\x00")end--;
    return result.slice(start, end).split(/\0/g);
}
function splitSeparateNumbers(value) {
    const words = split(value);
    for(let i = 0; i < words.length; i++){
        const word = words[i];
        const match2 = SPLIT_SEPARATE_NUMBER_RE.exec(word);
        if (match2) {
            const offset = match2.index + (match2[1] ?? match2[2]).length;
            words.splice(i, 1, word.slice(0, offset), word.slice(offset));
        }
    }
    return words;
}
function noCase(input, options) {
    const [prefix, words, suffix] = splitPrefixSuffix(input, options);
    return prefix + words.map(lowerFactory(options?.locale)).join(options?.delimiter ?? " ") + suffix;
}
function snakeCase(input, options) {
    return noCase(input, {
        delimiter: "_",
        ...options
    });
}
function lowerFactory(locale) {
    return locale === false ? (input)=>input.toLowerCase() : (input)=>input.toLocaleLowerCase(locale);
}
function splitPrefixSuffix(input, options = {}) {
    const splitFn = options.split ?? (options.separateNumbers ? splitSeparateNumbers : split);
    const prefixCharacters = options.prefixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
    const suffixCharacters = options.suffixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
    let prefixIndex = 0;
    let suffixIndex = input.length;
    while(prefixIndex < input.length){
        const char = input.charAt(prefixIndex);
        if (!prefixCharacters.includes(char)) break;
        prefixIndex++;
    }
    while(suffixIndex > prefixIndex){
        const index = suffixIndex - 1;
        const char = input.charAt(index);
        if (!suffixCharacters.includes(char)) break;
        suffixIndex = index;
    }
    return [
        input.slice(0, prefixIndex),
        splitFn(input.slice(prefixIndex, suffixIndex)),
        input.slice(suffixIndex)
    ];
}
// ../../node_modules/.pnpm/snakecase-keys@9.0.2/node_modules/snakecase-keys/index.js
var PlainObjectConstructor = {}.constructor;
function snakecaseKeys(obj, options) {
    if (Array.isArray(obj)) {
        if (obj.some((item)=>item.constructor !== PlainObjectConstructor)) {
            throw new Error("obj must be array of plain objects");
        }
        options = {
            deep: true,
            exclude: [],
            parsingOptions: {},
            ...options
        };
        const convertCase2 = options.snakeCase || ((key)=>snakeCase(key, options.parsingOptions));
        return obj.map((item)=>{
            return mapObject(item, (key, val)=>{
                return [
                    matches(options.exclude, key) ? key : convertCase2(key),
                    val,
                    mapperOptions(key, val, options)
                ];
            }, options);
        });
    } else {
        if (obj.constructor !== PlainObjectConstructor) {
            throw new Error("obj must be an plain object");
        }
    }
    options = {
        deep: true,
        exclude: [],
        parsingOptions: {},
        ...options
    };
    const convertCase = options.snakeCase || ((key)=>snakeCase(key, options.parsingOptions));
    return mapObject(obj, (key, val)=>{
        return [
            matches(options.exclude, key) ? key : convertCase(key),
            val,
            mapperOptions(key, val, options)
        ];
    }, options);
}
function matches(patterns, value) {
    return patterns.some((pattern)=>{
        return typeof pattern === "string" ? pattern === value : pattern.test(value);
    });
}
function mapperOptions(key, val, options) {
    return options.shouldRecurse ? {
        shouldRecurse: options.shouldRecurse(key, val)
    } : void 0;
}
var snakecase_keys_default = snakecaseKeys;
// src/api/resources/AccountlessApplication.ts
var AccountlessApplication = class _AccountlessApplication {
    constructor(publishableKey, secretKey, claimUrl, apiKeysUrl){
        this.publishableKey = publishableKey;
        this.secretKey = secretKey;
        this.claimUrl = claimUrl;
        this.apiKeysUrl = apiKeysUrl;
    }
    static fromJSON(data) {
        return new _AccountlessApplication(data.publishable_key, data.secret_key, data.claim_url, data.api_keys_url);
    }
};
// src/api/resources/ActorToken.ts
var ActorToken = class _ActorToken {
    constructor(id, status, userId, actor, token, url, createdAt, updatedAt){
        this.id = id;
        this.status = status;
        this.userId = userId;
        this.actor = actor;
        this.token = token;
        this.url = url;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromJSON(data) {
        return new _ActorToken(data.id, data.status, data.user_id, data.actor, data.token, data.url, data.created_at, data.updated_at);
    }
};
// src/api/resources/AllowlistIdentifier.ts
var AllowlistIdentifier = class _AllowlistIdentifier {
    constructor(id, identifier, identifierType, createdAt, updatedAt, instanceId, invitationId){
        this.id = id;
        this.identifier = identifier;
        this.identifierType = identifierType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.instanceId = instanceId;
        this.invitationId = invitationId;
    }
    static fromJSON(data) {
        return new _AllowlistIdentifier(data.id, data.identifier, data.identifier_type, data.created_at, data.updated_at, data.instance_id, data.invitation_id);
    }
};
// src/api/resources/APIKey.ts
var APIKey = class _APIKey {
    constructor(id, type, name, subject, scopes, claims, revoked, revocationReason, expired, expiration, createdBy, description, lastUsedAt, createdAt, updatedAt, secret){
        this.id = id;
        this.type = type;
        this.name = name;
        this.subject = subject;
        this.scopes = scopes;
        this.claims = claims;
        this.revoked = revoked;
        this.revocationReason = revocationReason;
        this.expired = expired;
        this.expiration = expiration;
        this.createdBy = createdBy;
        this.description = description;
        this.lastUsedAt = lastUsedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.secret = secret;
    }
    static fromJSON(data) {
        return new _APIKey(data.id, data.type, data.name, data.subject, data.scopes, data.claims, data.revoked, data.revocation_reason, data.expired, data.expiration, data.created_by, data.description, data.last_used_at, data.created_at, data.updated_at, data.secret);
    }
};
// src/api/resources/BlocklistIdentifier.ts
var BlocklistIdentifier = class _BlocklistIdentifier {
    constructor(id, identifier, identifierType, createdAt, updatedAt, instanceId){
        this.id = id;
        this.identifier = identifier;
        this.identifierType = identifierType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.instanceId = instanceId;
    }
    static fromJSON(data) {
        return new _BlocklistIdentifier(data.id, data.identifier, data.identifier_type, data.created_at, data.updated_at, data.instance_id);
    }
};
// src/api/resources/Session.ts
var SessionActivity = class _SessionActivity {
    constructor(id, isMobile, ipAddress, city, country, browserVersion, browserName, deviceType){
        this.id = id;
        this.isMobile = isMobile;
        this.ipAddress = ipAddress;
        this.city = city;
        this.country = country;
        this.browserVersion = browserVersion;
        this.browserName = browserName;
        this.deviceType = deviceType;
    }
    static fromJSON(data) {
        return new _SessionActivity(data.id, data.is_mobile, data.ip_address, data.city, data.country, data.browser_version, data.browser_name, data.device_type);
    }
};
var Session = class _Session {
    constructor(id, clientId, userId, status, lastActiveAt, expireAt, abandonAt, createdAt, updatedAt, lastActiveOrganizationId, latestActivity, actor = null){
        this.id = id;
        this.clientId = clientId;
        this.userId = userId;
        this.status = status;
        this.lastActiveAt = lastActiveAt;
        this.expireAt = expireAt;
        this.abandonAt = abandonAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastActiveOrganizationId = lastActiveOrganizationId;
        this.latestActivity = latestActivity;
        this.actor = actor;
    }
    static fromJSON(data) {
        return new _Session(data.id, data.client_id, data.user_id, data.status, data.last_active_at, data.expire_at, data.abandon_at, data.created_at, data.updated_at, data.last_active_organization_id, data.latest_activity && SessionActivity.fromJSON(data.latest_activity), data.actor);
    }
};
// src/api/resources/Client.ts
var Client = class _Client {
    constructor(id, sessionIds, sessions, signInId, signUpId, lastActiveSessionId, lastAuthenticationStrategy, createdAt, updatedAt){
        this.id = id;
        this.sessionIds = sessionIds;
        this.sessions = sessions;
        this.signInId = signInId;
        this.signUpId = signUpId;
        this.lastActiveSessionId = lastActiveSessionId;
        this.lastAuthenticationStrategy = lastAuthenticationStrategy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromJSON(data) {
        return new _Client(data.id, data.session_ids, data.sessions.map((x)=>Session.fromJSON(x)), data.sign_in_id, data.sign_up_id, data.last_active_session_id, data.last_authentication_strategy, data.created_at, data.updated_at);
    }
};
// src/api/resources/CnameTarget.ts
var CnameTarget = class _CnameTarget {
    constructor(host, value, required){
        this.host = host;
        this.value = value;
        this.required = required;
    }
    static fromJSON(data) {
        return new _CnameTarget(data.host, data.value, data.required);
    }
};
// src/api/resources/Cookies.ts
var Cookies2 = class _Cookies {
    constructor(cookies){
        this.cookies = cookies;
    }
    static fromJSON(data) {
        return new _Cookies(data.cookies);
    }
};
// src/api/resources/DeletedObject.ts
var DeletedObject = class _DeletedObject {
    constructor(object, id, slug, deleted){
        this.object = object;
        this.id = id;
        this.slug = slug;
        this.deleted = deleted;
    }
    static fromJSON(data) {
        return new _DeletedObject(data.object, data.id || null, data.slug || null, data.deleted);
    }
};
// src/api/resources/Domain.ts
var Domain = class _Domain {
    constructor(id, name, isSatellite, frontendApiUrl, developmentOrigin, cnameTargets, accountsPortalUrl, proxyUrl){
        this.id = id;
        this.name = name;
        this.isSatellite = isSatellite;
        this.frontendApiUrl = frontendApiUrl;
        this.developmentOrigin = developmentOrigin;
        this.cnameTargets = cnameTargets;
        this.accountsPortalUrl = accountsPortalUrl;
        this.proxyUrl = proxyUrl;
    }
    static fromJSON(data) {
        return new _Domain(data.id, data.name, data.is_satellite, data.frontend_api_url, data.development_origin, data.cname_targets && data.cname_targets.map((x)=>CnameTarget.fromJSON(x)), data.accounts_portal_url, data.proxy_url);
    }
};
// src/api/resources/Email.ts
var Email = class _Email {
    constructor(id, fromEmailName, emailAddressId, toEmailAddress, subject, body, bodyPlain, status, slug, data, deliveredByClerk){
        this.id = id;
        this.fromEmailName = fromEmailName;
        this.emailAddressId = emailAddressId;
        this.toEmailAddress = toEmailAddress;
        this.subject = subject;
        this.body = body;
        this.bodyPlain = bodyPlain;
        this.status = status;
        this.slug = slug;
        this.data = data;
        this.deliveredByClerk = deliveredByClerk;
    }
    static fromJSON(data) {
        return new _Email(data.id, data.from_email_name, data.email_address_id, data.to_email_address, data.subject, data.body, data.body_plain, data.status, data.slug, data.data, data.delivered_by_clerk);
    }
};
// src/api/resources/IdentificationLink.ts
var IdentificationLink = class _IdentificationLink {
    constructor(id, type){
        this.id = id;
        this.type = type;
    }
    static fromJSON(data) {
        return new _IdentificationLink(data.id, data.type);
    }
};
// src/api/resources/Verification.ts
var Verification = class _Verification {
    constructor(status, strategy, externalVerificationRedirectURL = null, attempts = null, expireAt = null, nonce = null, message = null){
        this.status = status;
        this.strategy = strategy;
        this.externalVerificationRedirectURL = externalVerificationRedirectURL;
        this.attempts = attempts;
        this.expireAt = expireAt;
        this.nonce = nonce;
        this.message = message;
    }
    static fromJSON(data) {
        return new _Verification(data.status, data.strategy, data.external_verification_redirect_url ? new URL(data.external_verification_redirect_url) : null, data.attempts, data.expire_at, data.nonce);
    }
};
// src/api/resources/EmailAddress.ts
var EmailAddress = class _EmailAddress {
    constructor(id, emailAddress, verification, linkedTo){
        this.id = id;
        this.emailAddress = emailAddress;
        this.verification = verification;
        this.linkedTo = linkedTo;
    }
    static fromJSON(data) {
        return new _EmailAddress(data.id, data.email_address, data.verification && Verification.fromJSON(data.verification), data.linked_to.map((link)=>IdentificationLink.fromJSON(link)));
    }
};
// src/api/resources/ExternalAccount.ts
var ExternalAccount = class _ExternalAccount {
    constructor(id, provider, identificationId, externalId, approvedScopes, emailAddress, firstName, lastName, imageUrl, username, phoneNumber, publicMetadata = {}, label, verification){
        this.id = id;
        this.provider = provider;
        this.identificationId = identificationId;
        this.externalId = externalId;
        this.approvedScopes = approvedScopes;
        this.emailAddress = emailAddress;
        this.firstName = firstName;
        this.lastName = lastName;
        this.imageUrl = imageUrl;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.publicMetadata = publicMetadata;
        this.label = label;
        this.verification = verification;
    }
    static fromJSON(data) {
        return new _ExternalAccount(data.id, data.provider, data.identification_id, data.provider_user_id, data.approved_scopes, data.email_address, data.first_name, data.last_name, data.image_url || "", data.username, data.phone_number, data.public_metadata, data.label, data.verification && Verification.fromJSON(data.verification));
    }
};
// src/api/resources/IdPOAuthAccessToken.ts
var IdPOAuthAccessToken = class _IdPOAuthAccessToken {
    constructor(id, clientId, type, subject, scopes, revoked, revocationReason, expired, expiration, createdAt, updatedAt){
        this.id = id;
        this.clientId = clientId;
        this.type = type;
        this.subject = subject;
        this.scopes = scopes;
        this.revoked = revoked;
        this.revocationReason = revocationReason;
        this.expired = expired;
        this.expiration = expiration;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromJSON(data) {
        return new _IdPOAuthAccessToken(data.id, data.client_id, data.type, data.subject, data.scopes, data.revoked, data.revocation_reason, data.expired, data.expiration, data.created_at, data.updated_at);
    }
};
// src/api/resources/Instance.ts
var Instance = class _Instance {
    constructor(id, environmentType, allowedOrigins){
        this.id = id;
        this.environmentType = environmentType;
        this.allowedOrigins = allowedOrigins;
    }
    static fromJSON(data) {
        return new _Instance(data.id, data.environment_type, data.allowed_origins);
    }
};
// src/api/resources/InstanceRestrictions.ts
var InstanceRestrictions = class _InstanceRestrictions {
    constructor(allowlist, blocklist, blockEmailSubaddresses, blockDisposableEmailDomains, ignoreDotsForGmailAddresses){
        this.allowlist = allowlist;
        this.blocklist = blocklist;
        this.blockEmailSubaddresses = blockEmailSubaddresses;
        this.blockDisposableEmailDomains = blockDisposableEmailDomains;
        this.ignoreDotsForGmailAddresses = ignoreDotsForGmailAddresses;
    }
    static fromJSON(data) {
        return new _InstanceRestrictions(data.allowlist, data.blocklist, data.block_email_subaddresses, data.block_disposable_email_domains, data.ignore_dots_for_gmail_addresses);
    }
};
// src/api/resources/InstanceSettings.ts
var InstanceSettings = class _InstanceSettings {
    constructor(id, restrictedToAllowlist, fromEmailAddress, progressiveSignUp, enhancedEmailDeliverability){
        this.id = id;
        this.restrictedToAllowlist = restrictedToAllowlist;
        this.fromEmailAddress = fromEmailAddress;
        this.progressiveSignUp = progressiveSignUp;
        this.enhancedEmailDeliverability = enhancedEmailDeliverability;
    }
    static fromJSON(data) {
        return new _InstanceSettings(data.id, data.restricted_to_allowlist, data.from_email_address, data.progressive_sign_up, data.enhanced_email_deliverability);
    }
};
// src/api/resources/Invitation.ts
var Invitation = class _Invitation {
    constructor(id, emailAddress, publicMetadata, createdAt, updatedAt, status, url, revoked){
        this.id = id;
        this.emailAddress = emailAddress;
        this.publicMetadata = publicMetadata;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
        this.url = url;
        this.revoked = revoked;
        this._raw = null;
    }
    get raw() {
        return this._raw;
    }
    static fromJSON(data) {
        const res = new _Invitation(data.id, data.email_address, data.public_metadata, data.created_at, data.updated_at, data.status, data.url, data.revoked);
        res._raw = data;
        return res;
    }
};
// src/api/resources/JSON.ts
var ObjectType = {
    AccountlessApplication: "accountless_application",
    ActorToken: "actor_token",
    AllowlistIdentifier: "allowlist_identifier",
    ApiKey: "api_key",
    BlocklistIdentifier: "blocklist_identifier",
    Client: "client",
    Cookies: "cookies",
    Domain: "domain",
    Email: "email",
    EmailAddress: "email_address",
    ExternalAccount: "external_account",
    FacebookAccount: "facebook_account",
    GoogleAccount: "google_account",
    Instance: "instance",
    InstanceRestrictions: "instance_restrictions",
    InstanceSettings: "instance_settings",
    Invitation: "invitation",
    Machine: "machine",
    MachineScope: "machine_scope",
    MachineSecretKey: "machine_secret_key",
    M2MToken: "machine_to_machine_token",
    JwtTemplate: "jwt_template",
    OauthAccessToken: "oauth_access_token",
    IdpOAuthAccessToken: "clerk_idp_oauth_access_token",
    OAuthApplication: "oauth_application",
    Organization: "organization",
    OrganizationDomain: "organization_domain",
    OrganizationInvitation: "organization_invitation",
    OrganizationMembership: "organization_membership",
    OrganizationSettings: "organization_settings",
    PhoneNumber: "phone_number",
    ProxyCheck: "proxy_check",
    RedirectUrl: "redirect_url",
    SamlAccount: "saml_account",
    SamlConnection: "saml_connection",
    Session: "session",
    SignInAttempt: "sign_in_attempt",
    SignInToken: "sign_in_token",
    SignUpAttempt: "sign_up_attempt",
    SmsMessage: "sms_message",
    User: "user",
    WaitlistEntry: "waitlist_entry",
    Web3Wallet: "web3_wallet",
    Token: "token",
    TotalCount: "total_count",
    TestingToken: "testing_token",
    Role: "role",
    Permission: "permission",
    BillingPayer: "commerce_payer",
    BillingPaymentAttempt: "commerce_payment_attempt",
    BillingSubscription: "commerce_subscription",
    BillingSubscriptionItem: "commerce_subscription_item",
    BillingPlan: "commerce_plan",
    Feature: "feature"
};
// src/api/resources/Machine.ts
var Machine = class _Machine {
    constructor(id, name, instanceId, createdAt, updatedAt, scopedMachines, defaultTokenTtl, secretKey){
        this.id = id;
        this.name = name;
        this.instanceId = instanceId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.scopedMachines = scopedMachines;
        this.defaultTokenTtl = defaultTokenTtl;
        this.secretKey = secretKey;
    }
    static fromJSON(data) {
        return new _Machine(data.id, data.name, data.instance_id, data.created_at, data.updated_at, data.scoped_machines.map((m)=>new _Machine(m.id, m.name, m.instance_id, m.created_at, m.updated_at, [], // Nested machines don't have scoped_machines
            m.default_token_ttl)), data.default_token_ttl, data.secret_key);
    }
};
// src/api/resources/MachineScope.ts
var MachineScope = class _MachineScope {
    constructor(fromMachineId, toMachineId, createdAt, deleted){
        this.fromMachineId = fromMachineId;
        this.toMachineId = toMachineId;
        this.createdAt = createdAt;
        this.deleted = deleted;
    }
    static fromJSON(data) {
        return new _MachineScope(data.from_machine_id, data.to_machine_id, data.created_at, data.deleted);
    }
};
// src/api/resources/MachineSecretKey.ts
var MachineSecretKey = class _MachineSecretKey {
    constructor(secret){
        this.secret = secret;
    }
    static fromJSON(data) {
        return new _MachineSecretKey(data.secret);
    }
};
// src/api/resources/M2MToken.ts
var M2MToken = class _M2MToken {
    constructor(id, subject, scopes, claims, revoked, revocationReason, expired, expiration, createdAt, updatedAt, token){
        this.id = id;
        this.subject = subject;
        this.scopes = scopes;
        this.claims = claims;
        this.revoked = revoked;
        this.revocationReason = revocationReason;
        this.expired = expired;
        this.expiration = expiration;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.token = token;
    }
    static fromJSON(data) {
        return new _M2MToken(data.id, data.subject, data.scopes, data.claims, data.revoked, data.revocation_reason, data.expired, data.expiration, data.created_at, data.updated_at, data.token);
    }
};
// src/api/resources/JwtTemplate.ts
var JwtTemplate = class _JwtTemplate {
    constructor(id, name, claims, lifetime, allowedClockSkew, customSigningKey, signingAlgorithm, createdAt, updatedAt){
        this.id = id;
        this.name = name;
        this.claims = claims;
        this.lifetime = lifetime;
        this.allowedClockSkew = allowedClockSkew;
        this.customSigningKey = customSigningKey;
        this.signingAlgorithm = signingAlgorithm;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromJSON(data) {
        return new _JwtTemplate(data.id, data.name, data.claims, data.lifetime, data.allowed_clock_skew, data.custom_signing_key, data.signing_algorithm, data.created_at, data.updated_at);
    }
};
// src/api/resources/OauthAccessToken.ts
var OauthAccessToken = class _OauthAccessToken {
    constructor(externalAccountId, provider, token, publicMetadata = {}, label, scopes, tokenSecret, expiresAt){
        this.externalAccountId = externalAccountId;
        this.provider = provider;
        this.token = token;
        this.publicMetadata = publicMetadata;
        this.label = label;
        this.scopes = scopes;
        this.tokenSecret = tokenSecret;
        this.expiresAt = expiresAt;
    }
    static fromJSON(data) {
        return new _OauthAccessToken(data.external_account_id, data.provider, data.token, data.public_metadata, data.label || "", data.scopes, data.token_secret, data.expires_at);
    }
};
// src/api/resources/OAuthApplication.ts
var OAuthApplication = class _OAuthApplication {
    constructor(id, instanceId, name, clientId, clientUri, clientImageUrl, dynamicallyRegistered, consentScreenEnabled, pkceRequired, isPublic, scopes, redirectUris, authorizeUrl, tokenFetchUrl, userInfoUrl, discoveryUrl, tokenIntrospectionUrl, createdAt, updatedAt, clientSecret){
        this.id = id;
        this.instanceId = instanceId;
        this.name = name;
        this.clientId = clientId;
        this.clientUri = clientUri;
        this.clientImageUrl = clientImageUrl;
        this.dynamicallyRegistered = dynamicallyRegistered;
        this.consentScreenEnabled = consentScreenEnabled;
        this.pkceRequired = pkceRequired;
        this.isPublic = isPublic;
        this.scopes = scopes;
        this.redirectUris = redirectUris;
        this.authorizeUrl = authorizeUrl;
        this.tokenFetchUrl = tokenFetchUrl;
        this.userInfoUrl = userInfoUrl;
        this.discoveryUrl = discoveryUrl;
        this.tokenIntrospectionUrl = tokenIntrospectionUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.clientSecret = clientSecret;
    }
    static fromJSON(data) {
        return new _OAuthApplication(data.id, data.instance_id, data.name, data.client_id, data.client_uri, data.client_image_url, data.dynamically_registered, data.consent_screen_enabled, data.pkce_required, data.public, data.scopes, data.redirect_uris, data.authorize_url, data.token_fetch_url, data.user_info_url, data.discovery_url, data.token_introspection_url, data.created_at, data.updated_at, data.client_secret);
    }
};
// src/api/resources/Organization.ts
var Organization = class _Organization {
    constructor(id, name, slug, imageUrl, hasImage, createdAt, updatedAt, publicMetadata = {}, privateMetadata = {}, maxAllowedMemberships, adminDeleteEnabled, membersCount, createdBy){
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.imageUrl = imageUrl;
        this.hasImage = hasImage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.publicMetadata = publicMetadata;
        this.privateMetadata = privateMetadata;
        this.maxAllowedMemberships = maxAllowedMemberships;
        this.adminDeleteEnabled = adminDeleteEnabled;
        this.membersCount = membersCount;
        this.createdBy = createdBy;
        this._raw = null;
    }
    get raw() {
        return this._raw;
    }
    static fromJSON(data) {
        const res = new _Organization(data.id, data.name, data.slug, data.image_url || "", data.has_image, data.created_at, data.updated_at, data.public_metadata, data.private_metadata, data.max_allowed_memberships, data.admin_delete_enabled, data.members_count, data.created_by);
        res._raw = data;
        return res;
    }
};
// src/api/resources/OrganizationInvitation.ts
var OrganizationInvitation = class _OrganizationInvitation {
    constructor(id, emailAddress, role, roleName, organizationId, createdAt, updatedAt, expiresAt, url, status, publicMetadata = {}, privateMetadata = {}, publicOrganizationData){
        this.id = id;
        this.emailAddress = emailAddress;
        this.role = role;
        this.roleName = roleName;
        this.organizationId = organizationId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.expiresAt = expiresAt;
        this.url = url;
        this.status = status;
        this.publicMetadata = publicMetadata;
        this.privateMetadata = privateMetadata;
        this.publicOrganizationData = publicOrganizationData;
        this._raw = null;
    }
    get raw() {
        return this._raw;
    }
    static fromJSON(data) {
        const res = new _OrganizationInvitation(data.id, data.email_address, data.role, data.role_name, data.organization_id, data.created_at, data.updated_at, data.expires_at, data.url, data.status, data.public_metadata, data.private_metadata, data.public_organization_data);
        res._raw = data;
        return res;
    }
};
// src/api/resources/OrganizationMembership.ts
var OrganizationMembership = class _OrganizationMembership {
    constructor(id, role, permissions, publicMetadata = {}, privateMetadata = {}, createdAt, updatedAt, organization, publicUserData){
        this.id = id;
        this.role = role;
        this.permissions = permissions;
        this.publicMetadata = publicMetadata;
        this.privateMetadata = privateMetadata;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.organization = organization;
        this.publicUserData = publicUserData;
        this._raw = null;
    }
    get raw() {
        return this._raw;
    }
    static fromJSON(data) {
        const res = new _OrganizationMembership(data.id, data.role, data.permissions, data.public_metadata, data.private_metadata, data.created_at, data.updated_at, Organization.fromJSON(data.organization), OrganizationMembershipPublicUserData.fromJSON(data.public_user_data));
        res._raw = data;
        return res;
    }
};
var OrganizationMembershipPublicUserData = class _OrganizationMembershipPublicUserData {
    constructor(identifier, firstName, lastName, imageUrl, hasImage, userId){
        this.identifier = identifier;
        this.firstName = firstName;
        this.lastName = lastName;
        this.imageUrl = imageUrl;
        this.hasImage = hasImage;
        this.userId = userId;
    }
    static fromJSON(data) {
        return new _OrganizationMembershipPublicUserData(data.identifier, data.first_name, data.last_name, data.image_url, data.has_image, data.user_id);
    }
};
// src/api/resources/OrganizationSettings.ts
var OrganizationSettings = class _OrganizationSettings {
    constructor(enabled, maxAllowedMemberships, maxAllowedRoles, maxAllowedPermissions, creatorRole, adminDeleteEnabled, domainsEnabled, slugDisabled, domainsEnrollmentModes, domainsDefaultRole){
        this.enabled = enabled;
        this.maxAllowedMemberships = maxAllowedMemberships;
        this.maxAllowedRoles = maxAllowedRoles;
        this.maxAllowedPermissions = maxAllowedPermissions;
        this.creatorRole = creatorRole;
        this.adminDeleteEnabled = adminDeleteEnabled;
        this.domainsEnabled = domainsEnabled;
        this.slugDisabled = slugDisabled;
        this.domainsEnrollmentModes = domainsEnrollmentModes;
        this.domainsDefaultRole = domainsDefaultRole;
    }
    static fromJSON(data) {
        return new _OrganizationSettings(data.enabled, data.max_allowed_memberships, data.max_allowed_roles, data.max_allowed_permissions, data.creator_role, data.admin_delete_enabled, data.domains_enabled, data.slug_disabled, data.domains_enrollment_modes, data.domains_default_role);
    }
};
// src/api/resources/PhoneNumber.ts
var PhoneNumber = class _PhoneNumber {
    constructor(id, phoneNumber, reservedForSecondFactor, defaultSecondFactor, verification, linkedTo){
        this.id = id;
        this.phoneNumber = phoneNumber;
        this.reservedForSecondFactor = reservedForSecondFactor;
        this.defaultSecondFactor = defaultSecondFactor;
        this.verification = verification;
        this.linkedTo = linkedTo;
    }
    static fromJSON(data) {
        return new _PhoneNumber(data.id, data.phone_number, data.reserved_for_second_factor, data.default_second_factor, data.verification && Verification.fromJSON(data.verification), data.linked_to.map((link)=>IdentificationLink.fromJSON(link)));
    }
};
// src/api/resources/ProxyCheck.ts
var ProxyCheck = class _ProxyCheck {
    constructor(id, domainId, lastRunAt, proxyUrl, successful, createdAt, updatedAt){
        this.id = id;
        this.domainId = domainId;
        this.lastRunAt = lastRunAt;
        this.proxyUrl = proxyUrl;
        this.successful = successful;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromJSON(data) {
        return new _ProxyCheck(data.id, data.domain_id, data.last_run_at, data.proxy_url, data.successful, data.created_at, data.updated_at);
    }
};
// src/api/resources/RedirectUrl.ts
var RedirectUrl = class _RedirectUrl {
    constructor(id, url, createdAt, updatedAt){
        this.id = id;
        this.url = url;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromJSON(data) {
        return new _RedirectUrl(data.id, data.url, data.created_at, data.updated_at);
    }
};
// src/api/resources/SamlConnection.ts
var SamlConnection = class _SamlConnection {
    constructor(id, name, domain, organizationId, idpEntityId, idpSsoUrl, idpCertificate, idpMetadataUrl, idpMetadata, acsUrl, spEntityId, spMetadataUrl, active, provider, userCount, syncUserAttributes, allowSubdomains, allowIdpInitiated, createdAt, updatedAt, attributeMapping){
        this.id = id;
        this.name = name;
        this.domain = domain;
        this.organizationId = organizationId;
        this.idpEntityId = idpEntityId;
        this.idpSsoUrl = idpSsoUrl;
        this.idpCertificate = idpCertificate;
        this.idpMetadataUrl = idpMetadataUrl;
        this.idpMetadata = idpMetadata;
        this.acsUrl = acsUrl;
        this.spEntityId = spEntityId;
        this.spMetadataUrl = spMetadataUrl;
        this.active = active;
        this.provider = provider;
        this.userCount = userCount;
        this.syncUserAttributes = syncUserAttributes;
        this.allowSubdomains = allowSubdomains;
        this.allowIdpInitiated = allowIdpInitiated;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.attributeMapping = attributeMapping;
    }
    static fromJSON(data) {
        return new _SamlConnection(data.id, data.name, data.domain, data.organization_id, data.idp_entity_id, data.idp_sso_url, data.idp_certificate, data.idp_metadata_url, data.idp_metadata, data.acs_url, data.sp_entity_id, data.sp_metadata_url, data.active, data.provider, data.user_count, data.sync_user_attributes, data.allow_subdomains, data.allow_idp_initiated, data.created_at, data.updated_at, data.attribute_mapping && AttributeMapping.fromJSON(data.attribute_mapping));
    }
};
var SamlAccountConnection = class _SamlAccountConnection {
    constructor(id, name, domain, active, provider, syncUserAttributes, allowSubdomains, allowIdpInitiated, createdAt, updatedAt){
        this.id = id;
        this.name = name;
        this.domain = domain;
        this.active = active;
        this.provider = provider;
        this.syncUserAttributes = syncUserAttributes;
        this.allowSubdomains = allowSubdomains;
        this.allowIdpInitiated = allowIdpInitiated;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromJSON(data) {
        return new _SamlAccountConnection(data.id, data.name, data.domain, data.active, data.provider, data.sync_user_attributes, data.allow_subdomains, data.allow_idp_initiated, data.created_at, data.updated_at);
    }
};
var AttributeMapping = class _AttributeMapping {
    constructor(userId, emailAddress, firstName, lastName){
        this.userId = userId;
        this.emailAddress = emailAddress;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    static fromJSON(data) {
        return new _AttributeMapping(data.user_id, data.email_address, data.first_name, data.last_name);
    }
};
// src/api/resources/SamlAccount.ts
var SamlAccount = class _SamlAccount {
    constructor(id, provider, providerUserId, active, emailAddress, firstName, lastName, verification, samlConnection, lastAuthenticatedAt, enterpriseConnectionId){
        this.id = id;
        this.provider = provider;
        this.providerUserId = providerUserId;
        this.active = active;
        this.emailAddress = emailAddress;
        this.firstName = firstName;
        this.lastName = lastName;
        this.verification = verification;
        this.samlConnection = samlConnection;
        this.lastAuthenticatedAt = lastAuthenticatedAt;
        this.enterpriseConnectionId = enterpriseConnectionId;
    }
    static fromJSON(data) {
        return new _SamlAccount(data.id, data.provider, data.provider_user_id, data.active, data.email_address, data.first_name, data.last_name, data.verification && Verification.fromJSON(data.verification), data.saml_connection && SamlAccountConnection.fromJSON(data.saml_connection), data.last_authenticated_at ?? null, data.enterprise_connection_id);
    }
};
// src/api/resources/SignInTokens.ts
var SignInToken = class _SignInToken {
    constructor(id, userId, token, status, url, createdAt, updatedAt){
        this.id = id;
        this.userId = userId;
        this.token = token;
        this.status = status;
        this.url = url;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromJSON(data) {
        return new _SignInToken(data.id, data.user_id, data.token, data.status, data.url, data.created_at, data.updated_at);
    }
};
// src/api/resources/SignUpAttempt.ts
var SignUpAttemptVerification = class _SignUpAttemptVerification {
    constructor(nextAction, supportedStrategies){
        this.nextAction = nextAction;
        this.supportedStrategies = supportedStrategies;
    }
    static fromJSON(data) {
        return new _SignUpAttemptVerification(data.next_action, data.supported_strategies);
    }
};
var SignUpAttemptVerifications = class _SignUpAttemptVerifications {
    constructor(emailAddress, phoneNumber, web3Wallet, externalAccount){
        this.emailAddress = emailAddress;
        this.phoneNumber = phoneNumber;
        this.web3Wallet = web3Wallet;
        this.externalAccount = externalAccount;
    }
    static fromJSON(data) {
        return new _SignUpAttemptVerifications(data.email_address && SignUpAttemptVerification.fromJSON(data.email_address), data.phone_number && SignUpAttemptVerification.fromJSON(data.phone_number), data.web3_wallet && SignUpAttemptVerification.fromJSON(data.web3_wallet), data.external_account);
    }
};
var SignUpAttempt = class _SignUpAttempt {
    constructor(id, status, requiredFields, optionalFields, missingFields, unverifiedFields, verifications, username, emailAddress, phoneNumber, web3Wallet, passwordEnabled, firstName, lastName, customAction, externalId, createdSessionId, createdUserId, abandonAt, legalAcceptedAt, publicMetadata, unsafeMetadata){
        this.id = id;
        this.status = status;
        this.requiredFields = requiredFields;
        this.optionalFields = optionalFields;
        this.missingFields = missingFields;
        this.unverifiedFields = unverifiedFields;
        this.verifications = verifications;
        this.username = username;
        this.emailAddress = emailAddress;
        this.phoneNumber = phoneNumber;
        this.web3Wallet = web3Wallet;
        this.passwordEnabled = passwordEnabled;
        this.firstName = firstName;
        this.lastName = lastName;
        this.customAction = customAction;
        this.externalId = externalId;
        this.createdSessionId = createdSessionId;
        this.createdUserId = createdUserId;
        this.abandonAt = abandonAt;
        this.legalAcceptedAt = legalAcceptedAt;
        this.publicMetadata = publicMetadata;
        this.unsafeMetadata = unsafeMetadata;
    }
    static fromJSON(data) {
        return new _SignUpAttempt(data.id, data.status, data.required_fields, data.optional_fields, data.missing_fields, data.unverified_fields, data.verifications ? SignUpAttemptVerifications.fromJSON(data.verifications) : null, data.username, data.email_address, data.phone_number, data.web3_wallet, data.password_enabled, data.first_name, data.last_name, data.custom_action, data.external_id, data.created_session_id, data.created_user_id, data.abandon_at, data.legal_accepted_at, data.public_metadata, data.unsafe_metadata);
    }
};
// src/api/resources/SMSMessage.ts
var SMSMessage = class _SMSMessage {
    constructor(id, fromPhoneNumber, toPhoneNumber, message, status, phoneNumberId, data){
        this.id = id;
        this.fromPhoneNumber = fromPhoneNumber;
        this.toPhoneNumber = toPhoneNumber;
        this.message = message;
        this.status = status;
        this.phoneNumberId = phoneNumberId;
        this.data = data;
    }
    static fromJSON(data) {
        return new _SMSMessage(data.id, data.from_phone_number, data.to_phone_number, data.message, data.status, data.phone_number_id, data.data);
    }
};
// src/api/resources/Token.ts
var Token = class _Token {
    constructor(jwt){
        this.jwt = jwt;
    }
    static fromJSON(data) {
        return new _Token(data.jwt);
    }
};
// src/api/resources/Web3Wallet.ts
var Web3Wallet = class _Web3Wallet {
    constructor(id, web3Wallet, verification){
        this.id = id;
        this.web3Wallet = web3Wallet;
        this.verification = verification;
    }
    static fromJSON(data) {
        return new _Web3Wallet(data.id, data.web3_wallet, data.verification && Verification.fromJSON(data.verification));
    }
};
// src/api/resources/User.ts
var User = class _User {
    constructor(id, passwordEnabled, totpEnabled, backupCodeEnabled, twoFactorEnabled, banned, locked, createdAt, updatedAt, imageUrl, hasImage, primaryEmailAddressId, primaryPhoneNumberId, primaryWeb3WalletId, lastSignInAt, externalId, username, firstName, lastName, publicMetadata = {}, privateMetadata = {}, unsafeMetadata = {}, emailAddresses = [], phoneNumbers = [], web3Wallets = [], externalAccounts = [], samlAccounts = [], lastActiveAt, createOrganizationEnabled, createOrganizationsLimit = null, deleteSelfEnabled, legalAcceptedAt, locale){
        this.id = id;
        this.passwordEnabled = passwordEnabled;
        this.totpEnabled = totpEnabled;
        this.backupCodeEnabled = backupCodeEnabled;
        this.twoFactorEnabled = twoFactorEnabled;
        this.banned = banned;
        this.locked = locked;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.imageUrl = imageUrl;
        this.hasImage = hasImage;
        this.primaryEmailAddressId = primaryEmailAddressId;
        this.primaryPhoneNumberId = primaryPhoneNumberId;
        this.primaryWeb3WalletId = primaryWeb3WalletId;
        this.lastSignInAt = lastSignInAt;
        this.externalId = externalId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.publicMetadata = publicMetadata;
        this.privateMetadata = privateMetadata;
        this.unsafeMetadata = unsafeMetadata;
        this.emailAddresses = emailAddresses;
        this.phoneNumbers = phoneNumbers;
        this.web3Wallets = web3Wallets;
        this.externalAccounts = externalAccounts;
        this.samlAccounts = samlAccounts;
        this.lastActiveAt = lastActiveAt;
        this.createOrganizationEnabled = createOrganizationEnabled;
        this.createOrganizationsLimit = createOrganizationsLimit;
        this.deleteSelfEnabled = deleteSelfEnabled;
        this.legalAcceptedAt = legalAcceptedAt;
        this.locale = locale;
        this._raw = null;
    }
    get raw() {
        return this._raw;
    }
    static fromJSON(data) {
        const res = new _User(data.id, data.password_enabled, data.totp_enabled, data.backup_code_enabled, data.two_factor_enabled, data.banned, data.locked, data.created_at, data.updated_at, data.image_url, data.has_image, data.primary_email_address_id, data.primary_phone_number_id, data.primary_web3_wallet_id, data.last_sign_in_at, data.external_id, data.username, data.first_name, data.last_name, data.public_metadata, data.private_metadata, data.unsafe_metadata, (data.email_addresses || []).map((x)=>EmailAddress.fromJSON(x)), (data.phone_numbers || []).map((x)=>PhoneNumber.fromJSON(x)), (data.web3_wallets || []).map((x)=>Web3Wallet.fromJSON(x)), (data.external_accounts || []).map((x)=>ExternalAccount.fromJSON(x)), (data.saml_accounts || []).map((x)=>SamlAccount.fromJSON(x)), data.last_active_at, data.create_organization_enabled, data.create_organizations_limit, data.delete_self_enabled, data.legal_accepted_at, data.locale);
        res._raw = data;
        return res;
    }
    /**
   * The primary email address of the user.
   */ get primaryEmailAddress() {
        return this.emailAddresses.find(({ id })=>id === this.primaryEmailAddressId) ?? null;
    }
    /**
   * The primary phone number of the user.
   */ get primaryPhoneNumber() {
        return this.phoneNumbers.find(({ id })=>id === this.primaryPhoneNumberId) ?? null;
    }
    /**
   * The primary web3 wallet of the user.
   */ get primaryWeb3Wallet() {
        return this.web3Wallets.find(({ id })=>id === this.primaryWeb3WalletId) ?? null;
    }
    /**
   * The full name of the user.
   */ get fullName() {
        return [
            this.firstName,
            this.lastName
        ].join(" ").trim() || null;
    }
};
// src/api/resources/WaitlistEntry.ts
var WaitlistEntry = class _WaitlistEntry {
    constructor(id, emailAddress, status, invitation, createdAt, updatedAt, isLocked){
        this.id = id;
        this.emailAddress = emailAddress;
        this.status = status;
        this.invitation = invitation;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isLocked = isLocked;
    }
    static fromJSON(data) {
        return new _WaitlistEntry(data.id, data.email_address, data.status, data.invitation && Invitation.fromJSON(data.invitation), data.created_at, data.updated_at, data.is_locked);
    }
};
// src/api/resources/Feature.ts
var Feature = class _Feature {
    constructor(id, name, description, slug, avatarUrl){
        this.id = id;
        this.name = name;
        this.description = description;
        this.slug = slug;
        this.avatarUrl = avatarUrl;
    }
    static fromJSON(data) {
        return new _Feature(data.id, data.name, data.description ?? null, data.slug, data.avatar_url ?? null);
    }
};
// src/api/resources/CommercePlan.ts
var BillingPlan = class _BillingPlan {
    constructor(id, name, slug, description, isDefault, isRecurring, hasBaseFee, publiclyVisible, fee, annualFee, annualMonthlyFee, forPayerType, features){
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.isDefault = isDefault;
        this.isRecurring = isRecurring;
        this.hasBaseFee = hasBaseFee;
        this.publiclyVisible = publiclyVisible;
        this.fee = fee;
        this.annualFee = annualFee;
        this.annualMonthlyFee = annualMonthlyFee;
        this.forPayerType = forPayerType;
        this.features = features;
    }
    static fromJSON(data) {
        const formatAmountJSON = (fee)=>{
            return fee ? {
                amount: fee.amount,
                amountFormatted: fee.amount_formatted,
                currency: fee.currency,
                currencySymbol: fee.currency_symbol
            } : null;
        };
        return new _BillingPlan(data.id, data.name, data.slug, data.description ?? null, data.is_default, data.is_recurring, data.has_base_fee, data.publicly_visible, formatAmountJSON(data.fee), formatAmountJSON(data.annual_fee), formatAmountJSON(data.annual_monthly_fee), data.for_payer_type, (data.features ?? []).map((feature)=>Feature.fromJSON(feature)));
    }
};
// src/api/resources/CommerceSubscriptionItem.ts
var BillingSubscriptionItem = class _BillingSubscriptionItem {
    constructor(id, status, planPeriod, periodStart, nextPayment, amount, plan, planId, createdAt, updatedAt, periodEnd, canceledAt, pastDueAt, endedAt, payerId, isFreeTrial, lifetimePaid){
        this.id = id;
        this.status = status;
        this.planPeriod = planPeriod;
        this.periodStart = periodStart;
        this.nextPayment = nextPayment;
        this.amount = amount;
        this.plan = plan;
        this.planId = planId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.periodEnd = periodEnd;
        this.canceledAt = canceledAt;
        this.pastDueAt = pastDueAt;
        this.endedAt = endedAt;
        this.payerId = payerId;
        this.isFreeTrial = isFreeTrial;
        this.lifetimePaid = lifetimePaid;
    }
    static fromJSON(data) {
        function formatAmountJSON(amount) {
            if (!amount) {
                return amount;
            }
            return {
                amount: amount.amount,
                amountFormatted: amount.amount_formatted,
                currency: amount.currency,
                currencySymbol: amount.currency_symbol
            };
        }
        return new _BillingSubscriptionItem(data.id, data.status, data.plan_period, data.period_start, data.next_payment, formatAmountJSON(data.amount) ?? void 0, data.plan ? BillingPlan.fromJSON(data.plan) : null, data.plan_id ?? null, data.created_at, data.updated_at, data.period_end, data.canceled_at, data.past_due_at, data.ended_at, data.payer_id, data.is_free_trial, formatAmountJSON(data.lifetime_paid) ?? void 0);
    }
};
// src/api/resources/CommerceSubscription.ts
var BillingSubscription = class _BillingSubscription {
    constructor(id, status, payerId, createdAt, updatedAt, activeAt, pastDueAt, subscriptionItems, nextPayment, eligibleForFreeTrial){
        this.id = id;
        this.status = status;
        this.payerId = payerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.activeAt = activeAt;
        this.pastDueAt = pastDueAt;
        this.subscriptionItems = subscriptionItems;
        this.nextPayment = nextPayment;
        this.eligibleForFreeTrial = eligibleForFreeTrial;
    }
    static fromJSON(data) {
        const nextPayment = data.next_payment ? {
            date: data.next_payment.date,
            amount: {
                amount: data.next_payment.amount.amount,
                amountFormatted: data.next_payment.amount.amount_formatted,
                currency: data.next_payment.amount.currency,
                currencySymbol: data.next_payment.amount.currency_symbol
            }
        } : null;
        return new _BillingSubscription(data.id, data.status, data.payer_id, data.created_at, data.updated_at, data.active_at ?? null, data.past_due_at ?? null, (data.subscription_items ?? []).map((item)=>BillingSubscriptionItem.fromJSON(item)), nextPayment, data.eligible_for_free_trial ?? false);
    }
};
// src/api/resources/Deserializer.ts
function deserialize(payload) {
    let data, totalCount;
    if (Array.isArray(payload)) {
        const data2 = payload.map((item)=>jsonToObject(item));
        return {
            data: data2
        };
    } else if (isPaginated(payload)) {
        data = payload.data.map((item)=>jsonToObject(item));
        totalCount = payload.total_count;
        return {
            data,
            totalCount
        };
    } else {
        return {
            data: jsonToObject(payload)
        };
    }
}
function isPaginated(payload) {
    if (!payload || typeof payload !== "object" || !("data" in payload)) {
        return false;
    }
    return Array.isArray(payload.data) && payload.data !== void 0;
}
function getCount(item) {
    return item.total_count;
}
function jsonToObject(item) {
    if (typeof item !== "string" && "object" in item && "deleted" in item) {
        return DeletedObject.fromJSON(item);
    }
    switch(item.object){
        case ObjectType.AccountlessApplication:
            return AccountlessApplication.fromJSON(item);
        case ObjectType.ActorToken:
            return ActorToken.fromJSON(item);
        case ObjectType.AllowlistIdentifier:
            return AllowlistIdentifier.fromJSON(item);
        case ObjectType.ApiKey:
            return APIKey.fromJSON(item);
        case ObjectType.BlocklistIdentifier:
            return BlocklistIdentifier.fromJSON(item);
        case ObjectType.Client:
            return Client.fromJSON(item);
        case ObjectType.Cookies:
            return Cookies2.fromJSON(item);
        case ObjectType.Domain:
            return Domain.fromJSON(item);
        case ObjectType.EmailAddress:
            return EmailAddress.fromJSON(item);
        case ObjectType.Email:
            return Email.fromJSON(item);
        case ObjectType.IdpOAuthAccessToken:
            return IdPOAuthAccessToken.fromJSON(item);
        case ObjectType.Instance:
            return Instance.fromJSON(item);
        case ObjectType.InstanceRestrictions:
            return InstanceRestrictions.fromJSON(item);
        case ObjectType.InstanceSettings:
            return InstanceSettings.fromJSON(item);
        case ObjectType.Invitation:
            return Invitation.fromJSON(item);
        case ObjectType.JwtTemplate:
            return JwtTemplate.fromJSON(item);
        case ObjectType.Machine:
            return Machine.fromJSON(item);
        case ObjectType.MachineScope:
            return MachineScope.fromJSON(item);
        case ObjectType.MachineSecretKey:
            return MachineSecretKey.fromJSON(item);
        case ObjectType.M2MToken:
            return M2MToken.fromJSON(item);
        case ObjectType.OauthAccessToken:
            return OauthAccessToken.fromJSON(item);
        case ObjectType.OAuthApplication:
            return OAuthApplication.fromJSON(item);
        case ObjectType.Organization:
            return Organization.fromJSON(item);
        case ObjectType.OrganizationInvitation:
            return OrganizationInvitation.fromJSON(item);
        case ObjectType.OrganizationMembership:
            return OrganizationMembership.fromJSON(item);
        case ObjectType.OrganizationSettings:
            return OrganizationSettings.fromJSON(item);
        case ObjectType.PhoneNumber:
            return PhoneNumber.fromJSON(item);
        case ObjectType.ProxyCheck:
            return ProxyCheck.fromJSON(item);
        case ObjectType.RedirectUrl:
            return RedirectUrl.fromJSON(item);
        case ObjectType.SamlConnection:
            return SamlConnection.fromJSON(item);
        case ObjectType.SignInToken:
            return SignInToken.fromJSON(item);
        case ObjectType.SignUpAttempt:
            return SignUpAttempt.fromJSON(item);
        case ObjectType.Session:
            return Session.fromJSON(item);
        case ObjectType.SmsMessage:
            return SMSMessage.fromJSON(item);
        case ObjectType.Token:
            return Token.fromJSON(item);
        case ObjectType.TotalCount:
            return getCount(item);
        case ObjectType.User:
            return User.fromJSON(item);
        case ObjectType.WaitlistEntry:
            return WaitlistEntry.fromJSON(item);
        case ObjectType.BillingPlan:
            return BillingPlan.fromJSON(item);
        case ObjectType.BillingSubscription:
            return BillingSubscription.fromJSON(item);
        case ObjectType.BillingSubscriptionItem:
            return BillingSubscriptionItem.fromJSON(item);
        case ObjectType.Feature:
            return Feature.fromJSON(item);
        default:
            return item;
    }
}
// src/api/request.ts
function buildRequest(options) {
    const requestFn = async (requestOptions)=>{
        const { secretKey, machineSecretKey, useMachineSecretKey = false, requireSecretKey = true, apiUrl = API_URL, apiVersion = API_VERSION, userAgent = USER_AGENT, skipApiVersionInUrl = false } = options;
        const { path, method, queryParams, headerParams, bodyParams, formData, options: opts } = requestOptions;
        const { deepSnakecaseBodyParamKeys = false } = opts || {};
        if (requireSecretKey) {
            assertValidSecretKey(secretKey);
        }
        const url = skipApiVersionInUrl ? joinPaths(apiUrl, path) : joinPaths(apiUrl, apiVersion, path);
        const finalUrl = new URL(url);
        if (queryParams) {
            const snakecasedQueryParams = snakecase_keys_default({
                ...queryParams
            });
            for (const [key, val] of Object.entries(snakecasedQueryParams)){
                if (val) {
                    [
                        val
                    ].flat().forEach((v)=>finalUrl.searchParams.append(key, v));
                }
            }
        }
        const headers = new Headers({
            "Clerk-API-Version": SUPPORTED_BAPI_VERSION,
            [chunk_I24FT6SE_constants.Headers.UserAgent]: userAgent,
            ...headerParams
        });
        const authorizationHeader = chunk_I24FT6SE_constants.Headers.Authorization;
        if (!headers.has(authorizationHeader)) {
            if (useMachineSecretKey && machineSecretKey) {
                headers.set(authorizationHeader, `Bearer ${machineSecretKey}`);
            } else if (secretKey) {
                headers.set(authorizationHeader, `Bearer ${secretKey}`);
            }
        }
        let res;
        try {
            if (formData) {
                res = await runtime.fetch(finalUrl.href, {
                    method,
                    headers,
                    body: formData
                });
            } else {
                headers.set("Content-Type", "application/json");
                const buildBody = ()=>{
                    const hasBody = method !== "GET" && bodyParams && Object.keys(bodyParams).length > 0;
                    if (!hasBody) {
                        return null;
                    }
                    const formatKeys = (object)=>snakecase_keys_default(object, {
                            deep: deepSnakecaseBodyParamKeys
                        });
                    return {
                        body: JSON.stringify(Array.isArray(bodyParams) ? bodyParams.map(formatKeys) : formatKeys(bodyParams))
                    };
                };
                res = await runtime.fetch(finalUrl.href, {
                    method,
                    headers,
                    ...buildBody()
                });
            }
            const isJSONResponse = res?.headers && res.headers?.get(chunk_I24FT6SE_constants.Headers.ContentType) === chunk_I24FT6SE_constants.ContentTypes.Json;
            const responseBody = await (isJSONResponse ? res.json() : res.text());
            if (!res.ok) {
                return {
                    data: null,
                    errors: chunk_I24FT6SE_parseErrors(responseBody),
                    status: res?.status,
                    statusText: res?.statusText,
                    clerkTraceId: getTraceId(responseBody, res?.headers),
                    retryAfter: getRetryAfter(res?.headers)
                };
            }
            return {
                ...deserialize(responseBody),
                errors: null
            };
        } catch (err) {
            if (err instanceof Error) {
                return {
                    data: null,
                    errors: [
                        {
                            code: "unexpected_error",
                            message: err.message || "Unexpected error"
                        }
                    ],
                    clerkTraceId: getTraceId(err, res?.headers)
                };
            }
            return {
                data: null,
                errors: chunk_I24FT6SE_parseErrors(err),
                status: res?.status,
                statusText: res?.statusText,
                clerkTraceId: getTraceId(err, res?.headers),
                retryAfter: getRetryAfter(res?.headers)
            };
        }
    };
    return withLegacyRequestReturn(requestFn);
}
function getTraceId(data, headers) {
    if (data && typeof data === "object" && "clerk_trace_id" in data && typeof data.clerk_trace_id === "string") {
        return data.clerk_trace_id;
    }
    const cfRay = headers?.get("cf-ray");
    return cfRay || "";
}
function getRetryAfter(headers) {
    const retryAfter = headers?.get("Retry-After");
    if (!retryAfter) {
        return;
    }
    const value = parseInt(retryAfter, 10);
    if (isNaN(value)) {
        return;
    }
    return value;
}
function chunk_I24FT6SE_parseErrors(data) {
    if (!!data && typeof data === "object" && "errors" in data) {
        const errors = data.errors;
        return errors.length > 0 ? errors.map(parseError) : [];
    }
    return [];
}
function withLegacyRequestReturn(cb) {
    return async (...args)=>{
        const { data, errors, totalCount, status, statusText, clerkTraceId, retryAfter } = await cb(...args);
        if (errors) {
            const error = new ClerkAPIResponseError(statusText || "", {
                data: [],
                status,
                clerkTraceId,
                retryAfter
            });
            error.errors = errors;
            throw error;
        }
        if (typeof totalCount !== "undefined") {
            return {
                data,
                totalCount
            };
        }
        return data;
    };
}
// src/api/factory.ts
function createBackendApiClient(options) {
    const request = buildRequest(options);
    return {
        __experimental_accountlessApplications: new AccountlessApplicationAPI(buildRequest({
            ...options,
            requireSecretKey: false
        })),
        actorTokens: new ActorTokenAPI(request),
        allowlistIdentifiers: new AllowlistIdentifierAPI(request),
        apiKeys: new APIKeysAPI(buildRequest({
            ...options,
            skipApiVersionInUrl: true
        })),
        betaFeatures: new BetaFeaturesAPI(request),
        blocklistIdentifiers: new BlocklistIdentifierAPI(request),
        /**
     * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
     */ billing: new BillingAPI(request),
        clients: new ClientAPI(request),
        domains: new DomainAPI(request),
        emailAddresses: new EmailAddressAPI(request),
        idPOAuthAccessToken: new IdPOAuthAccessTokenApi(buildRequest({
            ...options,
            skipApiVersionInUrl: true
        })),
        instance: new InstanceAPI(request),
        invitations: new InvitationAPI(request),
        jwks: new JwksAPI(request),
        jwtTemplates: new JwtTemplatesApi(request),
        machines: new MachineApi(request),
        m2m: new M2MTokenApi(buildRequest({
            ...options,
            skipApiVersionInUrl: true,
            requireSecretKey: false,
            useMachineSecretKey: true
        })),
        oauthApplications: new OAuthApplicationsApi(request),
        organizations: new OrganizationAPI(request),
        phoneNumbers: new PhoneNumberAPI(request),
        proxyChecks: new ProxyCheckAPI(request),
        redirectUrls: new RedirectUrlAPI(request),
        samlConnections: new SamlConnectionAPI(request),
        sessions: new SessionAPI(request),
        signInTokens: new SignInTokenAPI(request),
        signUps: new SignUpAPI(request),
        testingTokens: new TestingTokenAPI(request),
        users: new UserAPI(request),
        waitlistEntries: new WaitlistEntryAPI(request),
        webhooks: new WebhookAPI(request)
    };
}
// src/tokens/machine.ts
var M2M_TOKEN_PREFIX = "mt_";
var OAUTH_TOKEN_PREFIX = "oat_";
var API_KEY_PREFIX = "ak_";
var MACHINE_TOKEN_PREFIXES = [
    M2M_TOKEN_PREFIX,
    OAUTH_TOKEN_PREFIX,
    API_KEY_PREFIX
];
function isMachineTokenByPrefix(token) {
    return MACHINE_TOKEN_PREFIXES.some((prefix)=>token.startsWith(prefix));
}
function getMachineTokenType(token) {
    if (token.startsWith(M2M_TOKEN_PREFIX)) {
        return TokenType.M2MToken;
    }
    if (token.startsWith(OAUTH_TOKEN_PREFIX)) {
        return TokenType.OAuthToken;
    }
    if (token.startsWith(API_KEY_PREFIX)) {
        return TokenType.ApiKey;
    }
    throw new Error("Unknown machine token type");
}
var isTokenTypeAccepted = (tokenType, acceptsToken)=>{
    if (!tokenType) {
        return false;
    }
    if (acceptsToken === "any") {
        return true;
    }
    const tokenTypes = Array.isArray(acceptsToken) ? acceptsToken : [
        acceptsToken
    ];
    return tokenTypes.includes(tokenType);
};
function isMachineTokenType(type) {
    return type === TokenType.ApiKey || type === TokenType.M2MToken || type === TokenType.OAuthToken;
}
// src/tokens/authObjects.ts
var createDebug = (data)=>{
    return ()=>{
        const res = {
            ...data
        };
        res.secretKey = (res.secretKey || "").substring(0, 7);
        res.jwtKey = (res.jwtKey || "").substring(0, 7);
        return {
            ...res
        };
    };
};
function signedInAuthObject(authenticateContext, sessionToken, sessionClaims) {
    const { actor, sessionId, sessionStatus, userId, orgId, orgRole, orgSlug, orgPermissions, factorVerificationAge } = __experimental_JWTPayloadToAuthObjectProperties(sessionClaims);
    const apiClient = createBackendApiClient(authenticateContext);
    const getToken = createGetToken({
        sessionId,
        sessionToken,
        fetcher: async (sessionId2, template, expiresInSeconds)=>(await apiClient.sessions.getToken(sessionId2, template || "", expiresInSeconds)).jwt
    });
    return {
        tokenType: TokenType.SessionToken,
        actor,
        sessionClaims,
        sessionId,
        sessionStatus,
        userId,
        orgId,
        orgRole,
        orgSlug,
        orgPermissions,
        factorVerificationAge,
        getToken,
        has: createCheckAuthorization({
            orgId,
            orgRole,
            orgPermissions,
            userId,
            factorVerificationAge,
            features: sessionClaims.fea || "",
            plans: sessionClaims.pla || ""
        }),
        debug: createDebug({
            ...authenticateContext,
            sessionToken
        }),
        isAuthenticated: true
    };
}
function signedOutAuthObject(debugData, initialSessionStatus) {
    return {
        tokenType: TokenType.SessionToken,
        sessionClaims: null,
        sessionId: null,
        sessionStatus: initialSessionStatus ?? null,
        userId: null,
        actor: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        orgPermissions: null,
        factorVerificationAge: null,
        getToken: ()=>Promise.resolve(null),
        has: ()=>false,
        debug: createDebug(debugData),
        isAuthenticated: false
    };
}
function authenticatedMachineObject(tokenType, token, verificationResult, debugData) {
    const baseObject = {
        id: verificationResult.id,
        subject: verificationResult.subject,
        getToken: ()=>Promise.resolve(token),
        has: ()=>false,
        debug: createDebug(debugData),
        isAuthenticated: true
    };
    switch(tokenType){
        case TokenType.ApiKey:
            {
                const result = verificationResult;
                return {
                    ...baseObject,
                    tokenType,
                    name: result.name,
                    claims: result.claims,
                    scopes: result.scopes,
                    userId: result.subject.startsWith("user_") ? result.subject : null,
                    orgId: result.subject.startsWith("org_") ? result.subject : null
                };
            }
        case TokenType.M2MToken:
            {
                const result = verificationResult;
                return {
                    ...baseObject,
                    tokenType,
                    claims: result.claims,
                    scopes: result.scopes,
                    machineId: result.subject
                };
            }
        case TokenType.OAuthToken:
            {
                const result = verificationResult;
                return {
                    ...baseObject,
                    tokenType,
                    scopes: result.scopes,
                    userId: result.subject,
                    clientId: result.clientId
                };
            }
        default:
            throw new Error(`Invalid token type: ${tokenType}`);
    }
}
function unauthenticatedMachineObject(tokenType, debugData) {
    const baseObject = {
        id: null,
        subject: null,
        scopes: null,
        has: ()=>false,
        getToken: ()=>Promise.resolve(null),
        debug: createDebug(debugData),
        isAuthenticated: false
    };
    switch(tokenType){
        case TokenType.ApiKey:
            {
                return {
                    ...baseObject,
                    tokenType,
                    name: null,
                    claims: null,
                    scopes: null,
                    userId: null,
                    orgId: null
                };
            }
        case TokenType.M2MToken:
            {
                return {
                    ...baseObject,
                    tokenType,
                    claims: null,
                    scopes: null,
                    machineId: null
                };
            }
        case TokenType.OAuthToken:
            {
                return {
                    ...baseObject,
                    tokenType,
                    scopes: null,
                    userId: null,
                    clientId: null
                };
            }
        default:
            throw new Error(`Invalid token type: ${tokenType}`);
    }
}
function invalidTokenAuthObject() {
    return {
        isAuthenticated: false,
        tokenType: null,
        getToken: ()=>Promise.resolve(null),
        has: ()=>false,
        debug: ()=>({})
    };
}
var makeAuthObjectSerializable = (obj)=>{
    const { debug, getToken, has, ...rest } = obj;
    return rest;
};
var createGetToken = (params)=>{
    const { fetcher, sessionToken, sessionId } = params || {};
    return async (options = {})=>{
        if (!sessionId) {
            return null;
        }
        if (options.template || options.expiresInSeconds !== void 0) {
            return fetcher(sessionId, options.template, options.expiresInSeconds);
        }
        return sessionToken;
    };
};
var getAuthObjectFromJwt = (jwt, { treatPendingAsSignedOut = true, ...options })=>{
    const authObject = signedInAuthObject(options, jwt.raw.text, jwt.payload);
    if (treatPendingAsSignedOut && authObject.sessionStatus === "pending") {
        return signedOutAuthObject(options, authObject.sessionStatus);
    }
    return authObject;
};
var getAuthObjectForAcceptedToken = ({ authObject, acceptsToken = TokenType.SessionToken })=>{
    if (acceptsToken === "any") {
        return authObject;
    }
    if (Array.isArray(acceptsToken)) {
        if (!isTokenTypeAccepted(authObject.tokenType, acceptsToken)) {
            return invalidTokenAuthObject();
        }
        return authObject;
    }
    if (!isTokenTypeAccepted(authObject.tokenType, acceptsToken)) {
        if (isMachineTokenType(acceptsToken)) {
            return unauthenticatedMachineObject(acceptsToken, authObject.debug);
        }
        return signedOutAuthObject(authObject.debug);
    }
    return authObject;
};
// src/tokens/authStatus.ts
var AuthStatus = {
    SignedIn: "signed-in",
    SignedOut: "signed-out",
    Handshake: "handshake"
};
var AuthErrorReason = {
    ClientUATWithoutSessionToken: "client-uat-but-no-session-token",
    DevBrowserMissing: "dev-browser-missing",
    DevBrowserSync: "dev-browser-sync",
    PrimaryRespondsToSyncing: "primary-responds-to-syncing",
    PrimaryDomainCrossOriginSync: "primary-domain-cross-origin-sync",
    SatelliteCookieNeedsSyncing: "satellite-needs-syncing",
    SessionTokenAndUATMissing: "session-token-and-uat-missing",
    SessionTokenMissing: "session-token-missing",
    SessionTokenExpired: "session-token-expired",
    SessionTokenIATBeforeClientUAT: "session-token-iat-before-client-uat",
    SessionTokenNBF: "session-token-nbf",
    SessionTokenIatInTheFuture: "session-token-iat-in-the-future",
    SessionTokenWithoutClientUAT: "session-token-but-no-client-uat",
    ActiveOrganizationMismatch: "active-organization-mismatch",
    TokenTypeMismatch: "token-type-mismatch",
    UnexpectedError: "unexpected-error"
};
function signedIn(params) {
    const { authenticateContext, headers = new Headers(), token } = params;
    const toAuth = ({ treatPendingAsSignedOut = true } = {})=>{
        if (params.tokenType === TokenType.SessionToken) {
            const { sessionClaims } = params;
            const authObject = signedInAuthObject(authenticateContext, token, sessionClaims);
            if (treatPendingAsSignedOut && authObject.sessionStatus === "pending") {
                return signedOutAuthObject(void 0, authObject.sessionStatus);
            }
            return authObject;
        }
        const { machineData } = params;
        return authenticatedMachineObject(params.tokenType, token, machineData, authenticateContext);
    };
    return {
        status: AuthStatus.SignedIn,
        reason: null,
        message: null,
        proxyUrl: authenticateContext.proxyUrl || "",
        publishableKey: authenticateContext.publishableKey || "",
        isSatellite: authenticateContext.isSatellite || false,
        domain: authenticateContext.domain || "",
        signInUrl: authenticateContext.signInUrl || "",
        signUpUrl: authenticateContext.signUpUrl || "",
        afterSignInUrl: authenticateContext.afterSignInUrl || "",
        afterSignUpUrl: authenticateContext.afterSignUpUrl || "",
        isSignedIn: true,
        isAuthenticated: true,
        tokenType: params.tokenType,
        toAuth,
        headers,
        token
    };
}
function signedOut(params) {
    const { authenticateContext, headers = new Headers(), reason, message = "", tokenType } = params;
    const toAuth = ()=>{
        if (tokenType === TokenType.SessionToken) {
            return signedOutAuthObject({
                ...authenticateContext,
                status: AuthStatus.SignedOut,
                reason,
                message
            });
        }
        return unauthenticatedMachineObject(tokenType, {
            reason,
            message,
            headers
        });
    };
    return withDebugHeaders({
        status: AuthStatus.SignedOut,
        reason,
        message,
        proxyUrl: authenticateContext.proxyUrl || "",
        publishableKey: authenticateContext.publishableKey || "",
        isSatellite: authenticateContext.isSatellite || false,
        domain: authenticateContext.domain || "",
        signInUrl: authenticateContext.signInUrl || "",
        signUpUrl: authenticateContext.signUpUrl || "",
        afterSignInUrl: authenticateContext.afterSignInUrl || "",
        afterSignUpUrl: authenticateContext.afterSignUpUrl || "",
        isSignedIn: false,
        isAuthenticated: false,
        tokenType,
        toAuth,
        headers,
        token: null
    });
}
function handshake(authenticateContext, reason, message = "", headers) {
    return withDebugHeaders({
        status: AuthStatus.Handshake,
        reason,
        message,
        publishableKey: authenticateContext.publishableKey || "",
        isSatellite: authenticateContext.isSatellite || false,
        domain: authenticateContext.domain || "",
        proxyUrl: authenticateContext.proxyUrl || "",
        signInUrl: authenticateContext.signInUrl || "",
        signUpUrl: authenticateContext.signUpUrl || "",
        afterSignInUrl: authenticateContext.afterSignInUrl || "",
        afterSignUpUrl: authenticateContext.afterSignUpUrl || "",
        isSignedIn: false,
        isAuthenticated: false,
        tokenType: TokenType.SessionToken,
        toAuth: ()=>null,
        headers,
        token: null
    });
}
function signedOutInvalidToken() {
    const authObject = invalidTokenAuthObject();
    return withDebugHeaders({
        status: AuthStatus.SignedOut,
        reason: AuthErrorReason.TokenTypeMismatch,
        message: "",
        proxyUrl: "",
        publishableKey: "",
        isSatellite: false,
        domain: "",
        signInUrl: "",
        signUpUrl: "",
        afterSignInUrl: "",
        afterSignUpUrl: "",
        isSignedIn: false,
        isAuthenticated: false,
        tokenType: null,
        toAuth: ()=>authObject,
        headers: new Headers(),
        token: null
    });
}
var withDebugHeaders = (requestState)=>{
    const headers = new Headers(requestState.headers || {});
    if (requestState.message) {
        try {
            headers.set(chunk_I24FT6SE_constants.Headers.AuthMessage, requestState.message);
        } catch  {}
    }
    if (requestState.reason) {
        try {
            headers.set(chunk_I24FT6SE_constants.Headers.AuthReason, requestState.reason);
        } catch  {}
    }
    if (requestState.status) {
        try {
            headers.set(chunk_I24FT6SE_constants.Headers.AuthStatus, requestState.status);
        } catch  {}
    }
    requestState.headers = headers;
    return requestState;
};
// src/tokens/clerkRequest.ts

// src/tokens/clerkUrl.ts
var ClerkUrl = class extends URL {
    isCrossOrigin(other) {
        return this.origin !== new URL(other.toString()).origin;
    }
};
var createClerkUrl = (...args)=>{
    return new ClerkUrl(...args);
};
// src/tokens/clerkRequest.ts
var ClerkRequest = class extends Request {
    constructor(input, init){
        const url = typeof input !== "string" && "url" in input ? input.url : String(input);
        super(url, init || typeof input === "string" ? void 0 : input);
        this.clerkUrl = this.deriveUrlFromHeaders(this);
        this.cookies = this.parseCookies(this);
    }
    toJSON() {
        return {
            url: this.clerkUrl.href,
            method: this.method,
            headers: JSON.stringify(Object.fromEntries(this.headers)),
            clerkUrl: this.clerkUrl.toString(),
            cookies: JSON.stringify(Object.fromEntries(this.cookies))
        };
    }
    /**
   * Used to fix request.url using the x-forwarded-* headers
   * TODO add detailed description of the issues this solves
   */ deriveUrlFromHeaders(req) {
        const initialUrl = new URL(req.url);
        const forwardedProto = req.headers.get(chunk_I24FT6SE_constants.Headers.ForwardedProto);
        const forwardedHost = req.headers.get(chunk_I24FT6SE_constants.Headers.ForwardedHost);
        const host = req.headers.get(chunk_I24FT6SE_constants.Headers.Host);
        const protocol = initialUrl.protocol;
        const resolvedHost = this.getFirstValueFromHeader(forwardedHost) ?? host;
        const resolvedProtocol = this.getFirstValueFromHeader(forwardedProto) ?? protocol?.replace(/[:/]/, "");
        const origin = resolvedHost && resolvedProtocol ? `${resolvedProtocol}://${resolvedHost}` : initialUrl.origin;
        if (origin === initialUrl.origin) {
            return createClerkUrl(initialUrl);
        }
        return createClerkUrl(initialUrl.pathname + initialUrl.search, origin);
    }
    getFirstValueFromHeader(value) {
        return value?.split(",")[0];
    }
    parseCookies(req) {
        const cookiesRecord = (0,dist/* parse */.Qc)(this.decodeCookieValue(req.headers.get("cookie") || ""));
        return new Map(Object.entries(cookiesRecord));
    }
    decodeCookieValue(str) {
        return str ? str.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent) : str;
    }
};
var createClerkRequest = (...args)=>{
    return args[0] instanceof ClerkRequest ? args[0] : new ClerkRequest(...args);
};
// src/tokens/cookie.ts
var getCookieName = (cookieDirective)=>{
    return cookieDirective.split(";")[0]?.split("=")[0];
};
var getCookieValue = (cookieDirective)=>{
    return cookieDirective.split(";")[0]?.split("=")[1];
};
// src/tokens/keys.ts
var cache = {};
var lastUpdatedAt = 0;
function getFromCache(kid) {
    return cache[kid];
}
function getCacheValues() {
    return Object.values(cache);
}
function setInCache(cacheKey, jwk, shouldExpire = true) {
    cache[cacheKey] = jwk;
    lastUpdatedAt = shouldExpire ? Date.now() : -1;
}
var PEM_HEADER = "-----BEGIN PUBLIC KEY-----";
var PEM_TRAILER = "-----END PUBLIC KEY-----";
var RSA_PREFIX = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA";
var RSA_SUFFIX = "IDAQAB";
function loadClerkJwkFromPem(params) {
    const { kid, pem } = params;
    const prefixedKid = `local-${kid}`;
    const cachedJwk = getFromCache(prefixedKid);
    if (cachedJwk) {
        return cachedJwk;
    }
    if (!pem) {
        throw new TokenVerificationError({
            action: TokenVerificationErrorAction.SetClerkJWTKey,
            message: "Missing local JWK.",
            reason: TokenVerificationErrorReason.LocalJWKMissing
        });
    }
    const modulus = pem.replace(/\r\n|\n|\r/g, "").replace(PEM_HEADER, "").replace(PEM_TRAILER, "").replace(RSA_PREFIX, "").replace(RSA_SUFFIX, "").replace(/\+/g, "-").replace(/\//g, "_");
    const jwk = {
        kid: prefixedKid,
        kty: "RSA",
        alg: "RS256",
        n: modulus,
        e: "AQAB"
    };
    setInCache(prefixedKid, jwk, false);
    return jwk;
}
async function loadClerkJWKFromRemote(params) {
    const { secretKey, apiUrl = API_URL, apiVersion = API_VERSION, kid, skipJwksCache } = params;
    if (skipJwksCache || cacheHasExpired() || !getFromCache(kid)) {
        if (!secretKey) {
            throw new TokenVerificationError({
                action: TokenVerificationErrorAction.ContactSupport,
                message: "Failed to load JWKS from Clerk Backend or Frontend API.",
                reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
            });
        }
        const fetcher = ()=>fetchJWKSFromBAPI(apiUrl, secretKey, apiVersion);
        const { keys } = await retry(fetcher);
        if (!keys || !keys.length) {
            throw new TokenVerificationError({
                action: TokenVerificationErrorAction.ContactSupport,
                message: "The JWKS endpoint did not contain any signing keys. Contact support@clerk.com.",
                reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
            });
        }
        keys.forEach((key)=>setInCache(key.kid, key));
    }
    const jwk = getFromCache(kid);
    if (!jwk) {
        const cacheValues = getCacheValues();
        const jwkKeys = cacheValues.map((jwk2)=>jwk2.kid).sort().join(", ");
        throw new TokenVerificationError({
            action: `Go to your Dashboard and validate your secret and public keys are correct. ${TokenVerificationErrorAction.ContactSupport} if the issue persists.`,
            message: `Unable to find a signing key in JWKS that matches the kid='${kid}' of the provided session token. Please make sure that the __session cookie or the HTTP authorization header contain a Clerk-generated session JWT. The following kid is available: ${jwkKeys}`,
            reason: TokenVerificationErrorReason.JWKKidMismatch
        });
    }
    return jwk;
}
async function fetchJWKSFromBAPI(apiUrl, key, apiVersion) {
    if (!key) {
        throw new TokenVerificationError({
            action: TokenVerificationErrorAction.SetClerkSecretKey,
            message: "Missing Clerk Secret Key or API Key. Go to https://dashboard.clerk.com and get your key for your instance.",
            reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
        });
    }
    const url = new URL(apiUrl);
    url.pathname = joinPaths(url.pathname, apiVersion, "/jwks");
    const response = await runtime.fetch(url.href, {
        headers: {
            Authorization: `Bearer ${key}`,
            "Clerk-API-Version": SUPPORTED_BAPI_VERSION,
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT
        }
    });
    if (!response.ok) {
        const json = await response.json();
        const invalidSecretKeyError = getErrorObjectByCode(json?.errors, TokenVerificationErrorCode.InvalidSecretKey);
        if (invalidSecretKeyError) {
            const reason = TokenVerificationErrorReason.InvalidSecretKey;
            throw new TokenVerificationError({
                action: TokenVerificationErrorAction.ContactSupport,
                message: invalidSecretKeyError.message,
                reason
            });
        }
        throw new TokenVerificationError({
            action: TokenVerificationErrorAction.ContactSupport,
            message: `Error loading Clerk JWKS from ${url.href} with code=${response.status}`,
            reason: TokenVerificationErrorReason.RemoteJWKFailedToLoad
        });
    }
    return response.json();
}
function cacheHasExpired() {
    if (lastUpdatedAt === -1) {
        return false;
    }
    const isExpired = Date.now() - lastUpdatedAt >= MAX_CACHE_LAST_UPDATED_AT_SECONDS * 1e3;
    if (isExpired) {
        cache = {};
    }
    return isExpired;
}
var getErrorObjectByCode = (errors, code)=>{
    if (!errors) {
        return null;
    }
    return errors.find((err)=>err.code === code);
};
// src/tokens/verify.ts

async function verifyToken(token, options) {
    const { data: decodedResult, errors } = decodeJwt(token);
    if (errors) {
        return {
            errors
        };
    }
    const { header } = decodedResult;
    const { kid } = header;
    try {
        let key;
        if (options.jwtKey) {
            key = loadClerkJwkFromPem({
                kid,
                pem: options.jwtKey
            });
        } else if (options.secretKey) {
            key = await loadClerkJWKFromRemote({
                ...options,
                kid
            });
        } else {
            return {
                errors: [
                    new TokenVerificationError({
                        action: TokenVerificationErrorAction.SetClerkJWTKey,
                        message: "Failed to resolve JWK during verification.",
                        reason: TokenVerificationErrorReason.JWKFailedToResolve
                    })
                ]
            };
        }
        return await verifyJwt(token, {
            ...options,
            key
        });
    } catch (error) {
        return {
            errors: [
                error
            ]
        };
    }
}
function handleClerkAPIError(tokenType, err, notFoundMessage) {
    if (isClerkAPIResponseError(err)) {
        let code;
        let message;
        switch(err.status){
            case 401:
                code = MachineTokenVerificationErrorCode.InvalidSecretKey;
                message = err.errors[0]?.message || "Invalid secret key";
                break;
            case 404:
                code = MachineTokenVerificationErrorCode.TokenInvalid;
                message = notFoundMessage;
                break;
            default:
                code = MachineTokenVerificationErrorCode.UnexpectedError;
                message = "Unexpected error";
        }
        return {
            data: void 0,
            tokenType,
            errors: [
                new MachineTokenVerificationError({
                    message,
                    code,
                    status: err.status
                })
            ]
        };
    }
    return {
        data: void 0,
        tokenType,
        errors: [
            new MachineTokenVerificationError({
                message: "Unexpected error",
                code: MachineTokenVerificationErrorCode.UnexpectedError,
                status: err.status
            })
        ]
    };
}
async function verifyM2MToken(token, options) {
    try {
        const client = createBackendApiClient(options);
        const verifiedToken = await client.m2m.verifyToken({
            token
        });
        return {
            data: verifiedToken,
            tokenType: TokenType.M2MToken,
            errors: void 0
        };
    } catch (err) {
        return handleClerkAPIError(TokenType.M2MToken, err, "Machine token not found");
    }
}
async function verifyOAuthToken(accessToken, options) {
    try {
        const client = createBackendApiClient(options);
        const verifiedToken = await client.idPOAuthAccessToken.verifyAccessToken(accessToken);
        return {
            data: verifiedToken,
            tokenType: TokenType.OAuthToken,
            errors: void 0
        };
    } catch (err) {
        return handleClerkAPIError(TokenType.OAuthToken, err, "OAuth token not found");
    }
}
async function verifyAPIKey(secret, options) {
    try {
        const client = createBackendApiClient(options);
        const verifiedToken = await client.apiKeys.verifySecret(secret);
        return {
            data: verifiedToken,
            tokenType: TokenType.ApiKey,
            errors: void 0
        };
    } catch (err) {
        return handleClerkAPIError(TokenType.ApiKey, err, "API key not found");
    }
}
async function verifyMachineAuthToken(token, options) {
    if (token.startsWith(M2M_TOKEN_PREFIX)) {
        return verifyM2MToken(token, options);
    }
    if (token.startsWith(OAUTH_TOKEN_PREFIX)) {
        return verifyOAuthToken(token, options);
    }
    if (token.startsWith(API_KEY_PREFIX)) {
        return verifyAPIKey(token, options);
    }
    throw new Error("Unknown machine token type");
}
// src/tokens/handshake.ts
async function verifyHandshakeJwt(token, { key }) {
    const { data: decoded, errors } = decodeJwt(token);
    if (errors) {
        throw errors[0];
    }
    const { header, payload } = decoded;
    const { typ, alg } = header;
    assertHeaderType(typ);
    assertHeaderAlgorithm(alg);
    const { data: signatureValid, errors: signatureErrors } = await hasValidSignature(decoded, key);
    if (signatureErrors) {
        throw new TokenVerificationError({
            reason: TokenVerificationErrorReason.TokenVerificationFailed,
            message: `Error verifying handshake token. ${signatureErrors[0]}`
        });
    }
    if (!signatureValid) {
        throw new TokenVerificationError({
            reason: TokenVerificationErrorReason.TokenInvalidSignature,
            message: "Handshake signature is invalid."
        });
    }
    return payload;
}
async function verifyHandshakeToken(token, options) {
    const { secretKey, apiUrl, apiVersion, jwksCacheTtlInMs, jwtKey, skipJwksCache } = options;
    const { data, errors } = decodeJwt(token);
    if (errors) {
        throw errors[0];
    }
    const { kid } = data.header;
    let key;
    if (jwtKey) {
        key = loadClerkJwkFromPem({
            kid,
            pem: jwtKey
        });
    } else if (secretKey) {
        key = await loadClerkJWKFromRemote({
            secretKey,
            apiUrl,
            apiVersion,
            kid,
            jwksCacheTtlInMs,
            skipJwksCache
        });
    } else {
        throw new TokenVerificationError({
            action: TokenVerificationErrorAction.SetClerkJWTKey,
            message: "Failed to resolve JWK during handshake verification.",
            reason: TokenVerificationErrorReason.JWKFailedToResolve
        });
    }
    return verifyHandshakeJwt(token, {
        key
    });
}
var HandshakeService = class {
    constructor(authenticateContext, options, organizationMatcher){
        this.authenticateContext = authenticateContext;
        this.options = options;
        this.organizationMatcher = organizationMatcher;
    }
    /**
   * Determines if a request is eligible for handshake based on its headers
   *
   * Currently, a request is only eligible for a handshake if we can say it's *probably* a request for a document, not a fetch or some other exotic request.
   * This heuristic should give us a reliable enough signal for browsers that support `Sec-Fetch-Dest` and for those that don't.
   *
   * @returns boolean indicating if the request is eligible for handshake
   */ isRequestEligibleForHandshake() {
        const { accept, secFetchDest } = this.authenticateContext;
        if (secFetchDest === "document" || secFetchDest === "iframe") {
            return true;
        }
        if (!secFetchDest && accept?.startsWith("text/html")) {
            return true;
        }
        return false;
    }
    /**
   * Builds the redirect headers for a handshake request
   * @param reason - The reason for the handshake (e.g. 'session-token-expired')
   * @returns Headers object containing the Location header for redirect
   * @throws Error if clerkUrl is missing in authenticateContext
   */ buildRedirectToHandshake(reason) {
        if (!this.authenticateContext?.clerkUrl) {
            throw new Error("Missing clerkUrl in authenticateContext");
        }
        const redirectUrl = this.removeDevBrowserFromURL(this.authenticateContext.clerkUrl);
        let baseUrl = this.authenticateContext.frontendApi.startsWith("http") ? this.authenticateContext.frontendApi : `https://${this.authenticateContext.frontendApi}`;
        baseUrl = baseUrl.replace(/\/+$/, "") + "/";
        const url = new URL("v1/client/handshake", baseUrl);
        url.searchParams.append("redirect_url", redirectUrl?.href || "");
        url.searchParams.append("__clerk_api_version", SUPPORTED_BAPI_VERSION);
        url.searchParams.append(chunk_I24FT6SE_constants.QueryParameters.SuffixedCookies, this.authenticateContext.usesSuffixedCookies().toString());
        url.searchParams.append(chunk_I24FT6SE_constants.QueryParameters.HandshakeReason, reason);
        url.searchParams.append(chunk_I24FT6SE_constants.QueryParameters.HandshakeFormat, "nonce");
        if (this.authenticateContext.instanceType === "development" && this.authenticateContext.devBrowserToken) {
            url.searchParams.append(chunk_I24FT6SE_constants.QueryParameters.DevBrowser, this.authenticateContext.devBrowserToken);
        }
        const toActivate = this.getOrganizationSyncTarget(this.authenticateContext.clerkUrl, this.organizationMatcher);
        if (toActivate) {
            const params = this.getOrganizationSyncQueryParams(toActivate);
            params.forEach((value, key)=>{
                url.searchParams.append(key, value);
            });
        }
        return new Headers({
            [chunk_I24FT6SE_constants.Headers.Location]: url.href
        });
    }
    /**
   * Gets cookies from either a handshake nonce or a handshake token
   * @returns Promise resolving to string array of cookie directives
   */ async getCookiesFromHandshake() {
        const cookiesToSet = [];
        if (this.authenticateContext.handshakeNonce) {
            try {
                const handshakePayload = await this.authenticateContext.apiClient?.clients.getHandshakePayload({
                    nonce: this.authenticateContext.handshakeNonce
                });
                if (handshakePayload) {
                    cookiesToSet.push(...handshakePayload.directives);
                }
            } catch (error) {
                console.error("Clerk: HandshakeService: error getting handshake payload:", error);
            }
        } else if (this.authenticateContext.handshakeToken) {
            const handshakePayload = await verifyHandshakeToken(this.authenticateContext.handshakeToken, this.authenticateContext);
            if (handshakePayload && Array.isArray(handshakePayload.handshake)) {
                cookiesToSet.push(...handshakePayload.handshake);
            }
        }
        return cookiesToSet;
    }
    /**
   * Resolves a handshake request by verifying the handshake token and setting appropriate cookies
   * @returns Promise resolving to either a SignedInState or SignedOutState
   * @throws Error if handshake verification fails or if there are issues with the session token
   */ async resolveHandshake() {
        const headers = new Headers({
            "Access-Control-Allow-Origin": "null",
            "Access-Control-Allow-Credentials": "true"
        });
        const cookiesToSet = await this.getCookiesFromHandshake();
        let sessionToken = "";
        cookiesToSet.forEach((x)=>{
            headers.append("Set-Cookie", x);
            if (getCookieName(x).startsWith(chunk_I24FT6SE_constants.Cookies.Session)) {
                sessionToken = getCookieValue(x);
            }
        });
        if (this.authenticateContext.instanceType === "development") {
            const newUrl = new URL(this.authenticateContext.clerkUrl);
            newUrl.searchParams.delete(chunk_I24FT6SE_constants.QueryParameters.Handshake);
            newUrl.searchParams.delete(chunk_I24FT6SE_constants.QueryParameters.HandshakeHelp);
            newUrl.searchParams.delete(chunk_I24FT6SE_constants.QueryParameters.DevBrowser);
            newUrl.searchParams.delete(chunk_I24FT6SE_constants.QueryParameters.HandshakeNonce);
            headers.append(chunk_I24FT6SE_constants.Headers.Location, newUrl.toString());
            headers.set(chunk_I24FT6SE_constants.Headers.CacheControl, "no-store");
        }
        if (sessionToken === "") {
            return signedOut({
                tokenType: TokenType.SessionToken,
                authenticateContext: this.authenticateContext,
                reason: AuthErrorReason.SessionTokenMissing,
                message: "",
                headers
            });
        }
        const { data, errors: [error] = [] } = await verifyToken(sessionToken, this.authenticateContext);
        if (data) {
            return signedIn({
                tokenType: TokenType.SessionToken,
                authenticateContext: this.authenticateContext,
                sessionClaims: data,
                headers,
                token: sessionToken
            });
        }
        if (this.authenticateContext.instanceType === "development" && (error?.reason === TokenVerificationErrorReason.TokenExpired || error?.reason === TokenVerificationErrorReason.TokenNotActiveYet || error?.reason === TokenVerificationErrorReason.TokenIatInTheFuture)) {
            const developmentError = new TokenVerificationError({
                action: error.action,
                message: error.message,
                reason: error.reason
            });
            developmentError.tokenCarrier = "cookie";
            console.error(`Clerk: Clock skew detected. This usually means that your system clock is inaccurate. Clerk will attempt to account for the clock skew in development.

To resolve this issue, make sure your system's clock is set to the correct time (e.g. turn off and on automatic time synchronization).

---

${developmentError.getFullMessage()}`);
            const { data: retryResult, errors: [retryError] = [] } = await verifyToken(sessionToken, {
                ...this.authenticateContext,
                clockSkewInMs: 864e5
            });
            if (retryResult) {
                return signedIn({
                    tokenType: TokenType.SessionToken,
                    authenticateContext: this.authenticateContext,
                    sessionClaims: retryResult,
                    headers,
                    token: sessionToken
                });
            }
            throw new Error(retryError?.message || "Clerk: Handshake retry failed.");
        }
        throw new Error(error?.message || "Clerk: Handshake failed.");
    }
    /**
   * Handles handshake token verification errors in development mode
   * @param error - The TokenVerificationError that occurred
   * @throws Error with a descriptive message about the verification failure
   */ handleTokenVerificationErrorInDevelopment(error) {
        if (error.reason === TokenVerificationErrorReason.TokenInvalidSignature) {
            const msg = `Clerk: Handshake token verification failed due to an invalid signature. If you have switched Clerk keys locally, clear your cookies and try again.`;
            throw new Error(msg);
        }
        throw new Error(`Clerk: Handshake token verification failed: ${error.getFullMessage()}.`);
    }
    /**
   * Checks if a redirect loop is detected and sets headers to track redirect count
   * @param headers - The Headers object to modify
   * @returns boolean indicating if a redirect loop was detected (true) or if the request can proceed (false)
   */ checkAndTrackRedirectLoop(headers) {
        if (this.authenticateContext.handshakeRedirectLoopCounter === 3) {
            return true;
        }
        const newCounterValue = this.authenticateContext.handshakeRedirectLoopCounter + 1;
        const cookieName = chunk_I24FT6SE_constants.Cookies.RedirectCount;
        headers.append("Set-Cookie", `${cookieName}=${newCounterValue}; SameSite=Lax; HttpOnly; Max-Age=2`);
        return false;
    }
    removeDevBrowserFromURL(url) {
        const updatedURL = new URL(url);
        updatedURL.searchParams.delete(chunk_I24FT6SE_constants.QueryParameters.DevBrowser);
        updatedURL.searchParams.delete(chunk_I24FT6SE_constants.QueryParameters.LegacyDevBrowser);
        return updatedURL;
    }
    getOrganizationSyncTarget(url, matchers) {
        return matchers.findTarget(url);
    }
    getOrganizationSyncQueryParams(toActivate) {
        const ret = /* @__PURE__ */ new Map();
        if (toActivate.type === "personalAccount") {
            ret.set("organization_id", "");
        }
        if (toActivate.type === "organization") {
            if (toActivate.organizationId) {
                ret.set("organization_id", toActivate.organizationId);
            }
            if (toActivate.organizationSlug) {
                ret.set("organization_id", toActivate.organizationSlug);
            }
        }
        return ret;
    }
};
// src/tokens/organizationMatcher.ts

var OrganizationMatcher = class {
    constructor(options){
        this.organizationPattern = this.createMatcher(options?.organizationPatterns);
        this.personalAccountPattern = this.createMatcher(options?.personalAccountPatterns);
    }
    createMatcher(pattern) {
        if (!pattern) {
            return null;
        }
        try {
            return match(pattern);
        } catch (e) {
            throw new Error(`Invalid pattern "${pattern}": ${e}`);
        }
    }
    findTarget(url) {
        const orgTarget = this.findOrganizationTarget(url);
        if (orgTarget) {
            return orgTarget;
        }
        return this.findPersonalAccountTarget(url);
    }
    findOrganizationTarget(url) {
        if (!this.organizationPattern) {
            return null;
        }
        try {
            const result = this.organizationPattern(url.pathname);
            if (!result || !("params" in result)) {
                return null;
            }
            const params = result.params;
            if (params.id) {
                return {
                    type: "organization",
                    organizationId: params.id
                };
            }
            if (params.slug) {
                return {
                    type: "organization",
                    organizationSlug: params.slug
                };
            }
            return null;
        } catch (e) {
            console.error("Failed to match organization pattern:", e);
            return null;
        }
    }
    findPersonalAccountTarget(url) {
        if (!this.personalAccountPattern) {
            return null;
        }
        try {
            const result = this.personalAccountPattern(url.pathname);
            return result ? {
                type: "personalAccount"
            } : null;
        } catch (e) {
            console.error("Failed to match personal account pattern:", e);
            return null;
        }
    }
};
// src/tokens/request.ts
var RefreshTokenErrorReason = {
    NonEligibleNoCookie: "non-eligible-no-refresh-cookie",
    NonEligibleNonGet: "non-eligible-non-get",
    InvalidSessionToken: "invalid-session-token",
    MissingApiClient: "missing-api-client",
    MissingSessionToken: "missing-session-token",
    MissingRefreshToken: "missing-refresh-token",
    ExpiredSessionTokenDecodeFailed: "expired-session-token-decode-failed",
    ExpiredSessionTokenMissingSidClaim: "expired-session-token-missing-sid-claim",
    FetchError: "fetch-error",
    UnexpectedSDKError: "unexpected-sdk-error",
    UnexpectedBAPIError: "unexpected-bapi-error"
};
function assertSignInUrlExists(signInUrl, key) {
    if (!signInUrl && isDevelopmentFromSecretKey(key)) {
        throw new Error(`Missing signInUrl. Pass a signInUrl for dev instances if an app is satellite`);
    }
}
function assertProxyUrlOrDomain(proxyUrlOrDomain) {
    if (!proxyUrlOrDomain) {
        throw new Error(`Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl`);
    }
}
function assertSignInUrlFormatAndOrigin(_signInUrl, origin) {
    let signInUrl;
    try {
        signInUrl = new URL(_signInUrl);
    } catch  {
        throw new Error(`The signInUrl needs to have a absolute url format.`);
    }
    if (signInUrl.origin === origin) {
        throw new Error(`The signInUrl needs to be on a different origin than your satellite application.`);
    }
}
function assertMachineSecretOrSecretKey(authenticateContext) {
    if (!authenticateContext.machineSecretKey && !authenticateContext.secretKey) {
        throw new Error("Machine token authentication requires either a Machine secret key or a Clerk secret key. Ensure a Clerk secret key or Machine secret key is set.");
    }
}
function isRequestEligibleForRefresh(err, authenticateContext, request) {
    return err.reason === TokenVerificationErrorReason.TokenExpired && !!authenticateContext.refreshTokenInCookie && request.method === "GET";
}
function checkTokenTypeMismatch(parsedTokenType, acceptsToken, authenticateContext) {
    const mismatch = !isTokenTypeAccepted(parsedTokenType, acceptsToken);
    if (mismatch) {
        const tokenTypeToReturn = typeof acceptsToken === "string" ? acceptsToken : parsedTokenType;
        return signedOut({
            tokenType: tokenTypeToReturn,
            authenticateContext,
            reason: AuthErrorReason.TokenTypeMismatch
        });
    }
    return null;
}
function isTokenTypeInAcceptedArray(acceptsToken, authenticateContext) {
    let parsedTokenType = null;
    const { tokenInHeader } = authenticateContext;
    if (tokenInHeader) {
        if (isMachineTokenByPrefix(tokenInHeader)) {
            parsedTokenType = getMachineTokenType(tokenInHeader);
        } else {
            parsedTokenType = TokenType.SessionToken;
        }
    }
    const typeToCheck = parsedTokenType ?? TokenType.SessionToken;
    return isTokenTypeAccepted(typeToCheck, acceptsToken);
}
var authenticateRequest = async (request, options)=>{
    const authenticateContext = await createAuthenticateContext(createClerkRequest(request), options);
    const acceptsToken = options.acceptsToken ?? TokenType.SessionToken;
    if (acceptsToken !== TokenType.M2MToken) {
        assertValidSecretKey(authenticateContext.secretKey);
        if (authenticateContext.isSatellite) {
            assertSignInUrlExists(authenticateContext.signInUrl, authenticateContext.secretKey);
            if (authenticateContext.signInUrl && authenticateContext.origin) {
                assertSignInUrlFormatAndOrigin(authenticateContext.signInUrl, authenticateContext.origin);
            }
            assertProxyUrlOrDomain(authenticateContext.proxyUrl || authenticateContext.domain);
        }
    }
    if (acceptsToken === TokenType.M2MToken) {
        assertMachineSecretOrSecretKey(authenticateContext);
    }
    const organizationMatcher = new OrganizationMatcher(options.organizationSyncOptions);
    const handshakeService = new HandshakeService(authenticateContext, {
        organizationSyncOptions: options.organizationSyncOptions
    }, organizationMatcher);
    async function refreshToken(authenticateContext2) {
        if (!options.apiClient) {
            return {
                data: null,
                error: {
                    message: "An apiClient is needed to perform token refresh.",
                    cause: {
                        reason: RefreshTokenErrorReason.MissingApiClient
                    }
                }
            };
        }
        const { sessionToken: expiredSessionToken, refreshTokenInCookie: refreshToken2 } = authenticateContext2;
        if (!expiredSessionToken) {
            return {
                data: null,
                error: {
                    message: "Session token must be provided.",
                    cause: {
                        reason: RefreshTokenErrorReason.MissingSessionToken
                    }
                }
            };
        }
        if (!refreshToken2) {
            return {
                data: null,
                error: {
                    message: "Refresh token must be provided.",
                    cause: {
                        reason: RefreshTokenErrorReason.MissingRefreshToken
                    }
                }
            };
        }
        const { data: decodeResult, errors: decodedErrors } = decodeJwt(expiredSessionToken);
        if (!decodeResult || decodedErrors) {
            return {
                data: null,
                error: {
                    message: "Unable to decode the expired session token.",
                    cause: {
                        reason: RefreshTokenErrorReason.ExpiredSessionTokenDecodeFailed,
                        errors: decodedErrors
                    }
                }
            };
        }
        if (!decodeResult?.payload?.sid) {
            return {
                data: null,
                error: {
                    message: "Expired session token is missing the `sid` claim.",
                    cause: {
                        reason: RefreshTokenErrorReason.ExpiredSessionTokenMissingSidClaim
                    }
                }
            };
        }
        try {
            const response = await options.apiClient.sessions.refreshSession(decodeResult.payload.sid, {
                format: "cookie",
                suffixed_cookies: authenticateContext2.usesSuffixedCookies(),
                expired_token: expiredSessionToken || "",
                refresh_token: refreshToken2 || "",
                request_origin: authenticateContext2.clerkUrl.origin,
                // The refresh endpoint expects headers as Record<string, string[]>, so we need to transform it.
                request_headers: Object.fromEntries(Array.from(request.headers.entries()).map(([k, v])=>[
                        k,
                        [
                            v
                        ]
                    ]))
            });
            return {
                data: response.cookies,
                error: null
            };
        } catch (err) {
            if (err?.errors?.length) {
                if (err.errors[0].code === "unexpected_error") {
                    return {
                        data: null,
                        error: {
                            message: `Fetch unexpected error`,
                            cause: {
                                reason: RefreshTokenErrorReason.FetchError,
                                errors: err.errors
                            }
                        }
                    };
                }
                return {
                    data: null,
                    error: {
                        message: err.errors[0].code,
                        cause: {
                            reason: err.errors[0].code,
                            errors: err.errors
                        }
                    }
                };
            } else {
                return {
                    data: null,
                    error: {
                        message: `Unexpected Server/BAPI error`,
                        cause: {
                            reason: RefreshTokenErrorReason.UnexpectedBAPIError,
                            errors: [
                                err
                            ]
                        }
                    }
                };
            }
        }
    }
    async function attemptRefresh(authenticateContext2) {
        const { data: cookiesToSet, error } = await refreshToken(authenticateContext2);
        if (!cookiesToSet || cookiesToSet.length === 0) {
            return {
                data: null,
                error
            };
        }
        const headers = new Headers();
        let sessionToken = "";
        cookiesToSet.forEach((x)=>{
            headers.append("Set-Cookie", x);
            if (getCookieName(x).startsWith(chunk_I24FT6SE_constants.Cookies.Session)) {
                sessionToken = getCookieValue(x);
            }
        });
        const { data: jwtPayload, errors } = await verifyToken(sessionToken, authenticateContext2);
        if (errors) {
            return {
                data: null,
                error: {
                    message: `Clerk: unable to verify refreshed session token.`,
                    cause: {
                        reason: RefreshTokenErrorReason.InvalidSessionToken,
                        errors
                    }
                }
            };
        }
        return {
            data: {
                jwtPayload,
                sessionToken,
                headers
            },
            error: null
        };
    }
    function handleMaybeHandshakeStatus(authenticateContext2, reason, message, headers) {
        if (!handshakeService.isRequestEligibleForHandshake()) {
            return signedOut({
                tokenType: TokenType.SessionToken,
                authenticateContext: authenticateContext2,
                reason,
                message
            });
        }
        const handshakeHeaders = headers ?? handshakeService.buildRedirectToHandshake(reason);
        if (handshakeHeaders.get(chunk_I24FT6SE_constants.Headers.Location)) {
            handshakeHeaders.set(chunk_I24FT6SE_constants.Headers.CacheControl, "no-store");
        }
        const isRedirectLoop = handshakeService.checkAndTrackRedirectLoop(handshakeHeaders);
        if (isRedirectLoop) {
            const msg = `Clerk: Refreshing the session token resulted in an infinite redirect loop. This usually means that your Clerk instance keys do not match - make sure to copy the correct publishable and secret keys from the Clerk dashboard.`;
            console.log(msg);
            return signedOut({
                tokenType: TokenType.SessionToken,
                authenticateContext: authenticateContext2,
                reason,
                message
            });
        }
        return handshake(authenticateContext2, reason, message, handshakeHeaders);
    }
    function handleMaybeOrganizationSyncHandshake(authenticateContext2, auth) {
        const organizationSyncTarget = organizationMatcher.findTarget(authenticateContext2.clerkUrl);
        if (!organizationSyncTarget) {
            return null;
        }
        let mustActivate = false;
        if (organizationSyncTarget.type === "organization") {
            if (organizationSyncTarget.organizationSlug && organizationSyncTarget.organizationSlug !== auth.orgSlug) {
                mustActivate = true;
            }
            if (organizationSyncTarget.organizationId && organizationSyncTarget.organizationId !== auth.orgId) {
                mustActivate = true;
            }
        }
        if (organizationSyncTarget.type === "personalAccount" && auth.orgId) {
            mustActivate = true;
        }
        if (!mustActivate) {
            return null;
        }
        if (authenticateContext2.handshakeRedirectLoopCounter >= 3) {
            console.warn("Clerk: Organization activation handshake loop detected. This is likely due to an invalid organization ID or slug. Skipping organization activation.");
            return null;
        }
        const handshakeState = handleMaybeHandshakeStatus(authenticateContext2, AuthErrorReason.ActiveOrganizationMismatch, "");
        if (handshakeState.status !== "handshake") {
            return null;
        }
        return handshakeState;
    }
    async function authenticateRequestWithTokenInHeader() {
        const { tokenInHeader } = authenticateContext;
        try {
            const { data, errors } = await verifyToken(tokenInHeader, authenticateContext);
            if (errors) {
                throw errors[0];
            }
            return signedIn({
                tokenType: TokenType.SessionToken,
                authenticateContext,
                sessionClaims: data,
                headers: new Headers(),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                token: tokenInHeader
            });
        } catch (err) {
            return handleSessionTokenError(err, "header");
        }
    }
    async function authenticateRequestWithTokenInCookie() {
        const hasActiveClient = authenticateContext.clientUat;
        const hasSessionToken = !!authenticateContext.sessionTokenInCookie;
        const hasDevBrowserToken = !!authenticateContext.devBrowserToken;
        if (authenticateContext.handshakeNonce || authenticateContext.handshakeToken) {
            try {
                return await handshakeService.resolveHandshake();
            } catch (error) {
                if (error instanceof TokenVerificationError && authenticateContext.instanceType === "development") {
                    handshakeService.handleTokenVerificationErrorInDevelopment(error);
                } else {
                    console.error("Clerk: unable to resolve handshake:", error);
                }
            }
        }
        const isRequestEligibleForMultiDomainSync = authenticateContext.isSatellite && authenticateContext.secFetchDest === "document";
        if (authenticateContext.instanceType === "production" && isRequestEligibleForMultiDomainSync) {
            return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SatelliteCookieNeedsSyncing, "");
        }
        if (authenticateContext.instanceType === "development" && isRequestEligibleForMultiDomainSync && !authenticateContext.clerkUrl.searchParams.has(chunk_I24FT6SE_constants.QueryParameters.ClerkSynced)) {
            const redirectURL = new URL(authenticateContext.signInUrl);
            redirectURL.searchParams.append(chunk_I24FT6SE_constants.QueryParameters.ClerkRedirectUrl, authenticateContext.clerkUrl.toString());
            const headers = new Headers({
                [chunk_I24FT6SE_constants.Headers.Location]: redirectURL.toString()
            });
            return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SatelliteCookieNeedsSyncing, "", headers);
        }
        const redirectUrl = new URL(authenticateContext.clerkUrl).searchParams.get(chunk_I24FT6SE_constants.QueryParameters.ClerkRedirectUrl);
        if (authenticateContext.instanceType === "development" && !authenticateContext.isSatellite && redirectUrl) {
            const redirectBackToSatelliteUrl = new URL(redirectUrl);
            if (authenticateContext.devBrowserToken) {
                redirectBackToSatelliteUrl.searchParams.append(chunk_I24FT6SE_constants.QueryParameters.DevBrowser, authenticateContext.devBrowserToken);
            }
            redirectBackToSatelliteUrl.searchParams.append(chunk_I24FT6SE_constants.QueryParameters.ClerkSynced, "true");
            const headers = new Headers({
                [chunk_I24FT6SE_constants.Headers.Location]: redirectBackToSatelliteUrl.toString()
            });
            return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.PrimaryRespondsToSyncing, "", headers);
        }
        if (authenticateContext.instanceType === "development" && authenticateContext.clerkUrl.searchParams.has(chunk_I24FT6SE_constants.QueryParameters.DevBrowser)) {
            return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.DevBrowserSync, "");
        }
        if (authenticateContext.instanceType === "development" && !hasDevBrowserToken) {
            return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.DevBrowserMissing, "");
        }
        if (!hasActiveClient && !hasSessionToken) {
            return signedOut({
                tokenType: TokenType.SessionToken,
                authenticateContext,
                reason: AuthErrorReason.SessionTokenAndUATMissing
            });
        }
        if (!hasActiveClient && hasSessionToken) {
            return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SessionTokenWithoutClientUAT, "");
        }
        if (hasActiveClient && !hasSessionToken) {
            return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.ClientUATWithoutSessionToken, "");
        }
        const { data: decodeResult, errors: decodedErrors } = decodeJwt(authenticateContext.sessionTokenInCookie);
        if (decodedErrors) {
            return handleSessionTokenError(decodedErrors[0], "cookie");
        }
        if (decodeResult.payload.iat < authenticateContext.clientUat) {
            return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.SessionTokenIATBeforeClientUAT, "");
        }
        try {
            const { data, errors } = await verifyToken(authenticateContext.sessionTokenInCookie, authenticateContext);
            if (errors) {
                throw errors[0];
            }
            const signedInRequestState = signedIn({
                tokenType: TokenType.SessionToken,
                authenticateContext,
                sessionClaims: data,
                headers: new Headers(),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                token: authenticateContext.sessionTokenInCookie
            });
            const shouldForceHandshakeForCrossDomain = !authenticateContext.isSatellite && // We're on primary
            authenticateContext.secFetchDest === "document" && // Document navigation
            authenticateContext.isCrossOriginReferrer() && // Came from different domain
            !authenticateContext.isKnownClerkReferrer() && // Not from Clerk accounts portal or FAPI
            authenticateContext.handshakeRedirectLoopCounter === 0;
            if (shouldForceHandshakeForCrossDomain) {
                return handleMaybeHandshakeStatus(authenticateContext, AuthErrorReason.PrimaryDomainCrossOriginSync, "Cross-origin request from satellite domain requires handshake");
            }
            const authObject = signedInRequestState.toAuth();
            if (authObject.userId) {
                const handshakeRequestState = handleMaybeOrganizationSyncHandshake(authenticateContext, authObject);
                if (handshakeRequestState) {
                    return handshakeRequestState;
                }
            }
            return signedInRequestState;
        } catch (err) {
            return handleSessionTokenError(err, "cookie");
        }
        return signedOut({
            tokenType: TokenType.SessionToken,
            authenticateContext,
            reason: AuthErrorReason.UnexpectedError
        });
    }
    async function handleSessionTokenError(err, tokenCarrier) {
        if (!(err instanceof TokenVerificationError)) {
            return signedOut({
                tokenType: TokenType.SessionToken,
                authenticateContext,
                reason: AuthErrorReason.UnexpectedError
            });
        }
        let refreshError;
        if (isRequestEligibleForRefresh(err, authenticateContext, request)) {
            const { data, error } = await attemptRefresh(authenticateContext);
            if (data) {
                return signedIn({
                    tokenType: TokenType.SessionToken,
                    authenticateContext,
                    sessionClaims: data.jwtPayload,
                    headers: data.headers,
                    token: data.sessionToken
                });
            }
            if (error?.cause?.reason) {
                refreshError = error.cause.reason;
            } else {
                refreshError = RefreshTokenErrorReason.UnexpectedSDKError;
            }
        } else {
            if (request.method !== "GET") {
                refreshError = RefreshTokenErrorReason.NonEligibleNonGet;
            } else if (!authenticateContext.refreshTokenInCookie) {
                refreshError = RefreshTokenErrorReason.NonEligibleNoCookie;
            } else {
                refreshError = null;
            }
        }
        err.tokenCarrier = tokenCarrier;
        const reasonToHandshake = [
            TokenVerificationErrorReason.TokenExpired,
            TokenVerificationErrorReason.TokenNotActiveYet,
            TokenVerificationErrorReason.TokenIatInTheFuture
        ].includes(err.reason);
        if (reasonToHandshake) {
            return handleMaybeHandshakeStatus(authenticateContext, convertTokenVerificationErrorReasonToAuthErrorReason({
                tokenError: err.reason,
                refreshError
            }), err.getFullMessage());
        }
        return signedOut({
            tokenType: TokenType.SessionToken,
            authenticateContext,
            reason: err.reason,
            message: err.getFullMessage()
        });
    }
    function handleMachineError(tokenType, err) {
        if (!(err instanceof MachineTokenVerificationError)) {
            return signedOut({
                tokenType,
                authenticateContext,
                reason: AuthErrorReason.UnexpectedError
            });
        }
        return signedOut({
            tokenType,
            authenticateContext,
            reason: err.code,
            message: err.getFullMessage()
        });
    }
    async function authenticateMachineRequestWithTokenInHeader() {
        const { tokenInHeader } = authenticateContext;
        if (!tokenInHeader) {
            return handleSessionTokenError(new Error("Missing token in header"), "header");
        }
        if (!isMachineTokenByPrefix(tokenInHeader)) {
            return signedOut({
                tokenType: acceptsToken,
                authenticateContext,
                reason: AuthErrorReason.TokenTypeMismatch,
                message: ""
            });
        }
        const parsedTokenType = getMachineTokenType(tokenInHeader);
        const mismatchState = checkTokenTypeMismatch(parsedTokenType, acceptsToken, authenticateContext);
        if (mismatchState) {
            return mismatchState;
        }
        const { data, tokenType, errors } = await verifyMachineAuthToken(tokenInHeader, authenticateContext);
        if (errors) {
            return handleMachineError(tokenType, errors[0]);
        }
        return signedIn({
            tokenType,
            authenticateContext,
            machineData: data,
            token: tokenInHeader
        });
    }
    async function authenticateAnyRequestWithTokenInHeader() {
        const { tokenInHeader } = authenticateContext;
        if (!tokenInHeader) {
            return handleSessionTokenError(new Error("Missing token in header"), "header");
        }
        if (isMachineTokenByPrefix(tokenInHeader)) {
            const parsedTokenType = getMachineTokenType(tokenInHeader);
            const mismatchState = checkTokenTypeMismatch(parsedTokenType, acceptsToken, authenticateContext);
            if (mismatchState) {
                return mismatchState;
            }
            const { data: data2, tokenType, errors: errors2 } = await verifyMachineAuthToken(tokenInHeader, authenticateContext);
            if (errors2) {
                return handleMachineError(tokenType, errors2[0]);
            }
            return signedIn({
                tokenType,
                authenticateContext,
                machineData: data2,
                token: tokenInHeader
            });
        }
        const { data, errors } = await verifyToken(tokenInHeader, authenticateContext);
        if (errors) {
            return handleSessionTokenError(errors[0], "header");
        }
        return signedIn({
            tokenType: TokenType.SessionToken,
            authenticateContext,
            sessionClaims: data,
            token: tokenInHeader
        });
    }
    if (Array.isArray(acceptsToken)) {
        if (!isTokenTypeInAcceptedArray(acceptsToken, authenticateContext)) {
            return signedOutInvalidToken();
        }
    }
    if (authenticateContext.tokenInHeader) {
        if (acceptsToken === "any") {
            return authenticateAnyRequestWithTokenInHeader();
        }
        if (acceptsToken === TokenType.SessionToken) {
            return authenticateRequestWithTokenInHeader();
        }
        return authenticateMachineRequestWithTokenInHeader();
    }
    if (acceptsToken === TokenType.OAuthToken || acceptsToken === TokenType.ApiKey || acceptsToken === TokenType.M2MToken) {
        return signedOut({
            tokenType: acceptsToken,
            authenticateContext,
            reason: "No token in header"
        });
    }
    return authenticateRequestWithTokenInCookie();
};
var debugRequestState = (params)=>{
    const { isSignedIn, isAuthenticated, proxyUrl, reason, message, publishableKey, isSatellite, domain } = params;
    return {
        isSignedIn,
        isAuthenticated,
        proxyUrl,
        reason,
        message,
        publishableKey,
        isSatellite,
        domain
    };
};
var convertTokenVerificationErrorReasonToAuthErrorReason = ({ tokenError, refreshError })=>{
    switch(tokenError){
        case TokenVerificationErrorReason.TokenExpired:
            return `${AuthErrorReason.SessionTokenExpired}-refresh-${refreshError}`;
        case TokenVerificationErrorReason.TokenNotActiveYet:
            return AuthErrorReason.SessionTokenNBF;
        case TokenVerificationErrorReason.TokenIatInTheFuture:
            return AuthErrorReason.SessionTokenIatInTheFuture;
        default:
            return AuthErrorReason.UnexpectedError;
    }
};
// src/tokens/factory.ts
var chunk_I24FT6SE_defaultOptions = {
    secretKey: "",
    machineSecretKey: "",
    jwtKey: "",
    apiUrl: void 0,
    apiVersion: void 0,
    proxyUrl: "",
    publishableKey: "",
    isSatellite: false,
    domain: "",
    audience: ""
};
function createAuthenticateRequest(params) {
    const buildTimeOptions = mergePreDefinedOptions(chunk_I24FT6SE_defaultOptions, params.options);
    const apiClient = params.apiClient;
    const authenticateRequest2 = (request, options = {})=>{
        const { apiUrl, apiVersion } = buildTimeOptions;
        const runTimeOptions = mergePreDefinedOptions(buildTimeOptions, options);
        return authenticateRequest(request, {
            ...options,
            ...runTimeOptions,
            // We should add all the omitted props from options here (eg apiUrl / apiVersion)
            // to avoid runtime options override them.
            apiUrl,
            apiVersion,
            apiClient
        });
    };
    return {
        authenticateRequest: authenticateRequest2,
        debugRequestState
    };
}
// src/util/decorateObjectWithResources.ts
var decorateObjectWithResources = async (obj, authObj, opts)=>{
    const { loadSession, loadUser, loadOrganization } = opts || {};
    const { userId, sessionId, orgId } = authObj;
    const { sessions, users, organizations } = createBackendApiClient({
        ...opts
    });
    const [sessionResp, userResp, organizationResp] = await Promise.all([
        loadSession && sessionId ? sessions.getSession(sessionId) : Promise.resolve(void 0),
        loadUser && userId ? users.getUser(userId) : Promise.resolve(void 0),
        loadOrganization && orgId ? organizations.getOrganization({
            organizationId: orgId
        }) : Promise.resolve(void 0)
    ]);
    const resources = stripPrivateDataFromObject({
        session: sessionResp,
        user: userResp,
        organization: organizationResp
    });
    return Object.assign(obj, resources);
};
function stripPrivateDataFromObject(authObject) {
    const user = authObject.user ? {
        ...authObject.user
    } : authObject.user;
    const organization = authObject.organization ? {
        ...authObject.organization
    } : authObject.organization;
    prunePrivateMetadata(user);
    prunePrivateMetadata(organization);
    return {
        ...authObject,
        user,
        organization
    };
}
function prunePrivateMetadata(resource) {
    if (resource) {
        if ("privateMetadata" in resource) {
            delete resource["privateMetadata"];
        }
        if ("private_metadata" in resource) {
            delete resource["private_metadata"];
        }
    }
    return resource;
}
// src/internal.ts

 //# sourceMappingURL=chunk-I24FT6SE.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+backend@2.23.2_react_2762a69b54307b8bd802f183496730d6/node_modules/@clerk/backend/dist/internal.mjs





 //# sourceMappingURL=internal.mjs.map

// EXTERNAL MODULE: ../../node_modules/.pnpm/react@18.3.1/node_modules/react/index.js
var react = __webpack_require__(3169);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/app-router-context.shared-runtime.js
"use client";

const app_router_context_shared_runtime_AppRouterContext = /*#__PURE__*/ (/* unused pure expression or super */ null && (React.createContext(null)));
const app_router_context_shared_runtime_LayoutRouterContext = /*#__PURE__*/ (/* unused pure expression or super */ null && (React.createContext(null)));
const app_router_context_shared_runtime_GlobalLayoutRouterContext = /*#__PURE__*/ (/* unused pure expression or super */ null && (React.createContext(null)));
const TemplateContext = /*#__PURE__*/ (/* unused pure expression or super */ null && (React.createContext(null)));
if (false) {}
const MissingSlotContext = /*#__PURE__*/ react.createContext(new Set()); //# sourceMappingURL=app-router-context.shared-runtime.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/hooks-client-context.shared-runtime.js
"use client";

const hooks_client_context_shared_runtime_SearchParamsContext = /*#__PURE__*/ (/* unused pure expression or super */ null && (createContext(null)));
const hooks_client_context_shared_runtime_PathnameContext = /*#__PURE__*/ (/* unused pure expression or super */ null && (createContext(null)));
const hooks_client_context_shared_runtime_PathParamsContext = /*#__PURE__*/ (/* unused pure expression or super */ null && (createContext(null)));
if (false) {} //# sourceMappingURL=hooks-client-context.shared-runtime.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/client-hook-in-server-component-error.js

function client_hook_in_server_component_error_clientHookInServerComponentError(hookName) {
    if (false) {}
} //# sourceMappingURL=client-hook-in-server-component-error.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/server-inserted-html.shared-runtime.js
"use client";

// Use `React.createContext` to avoid errors from the RSC checks because
// it can't be imported directly in Server Components:
//
//   import { createContext } from 'react'
//
// More info: https://github.com/vercel/next.js/pull/40686
const ServerInsertedHTMLContext = /*#__PURE__*/ (/* unused pure expression or super */ null && (React.createContext(null)));
function useServerInsertedHTML(callback) {
    const addInsertedServerHTMLCallback = useContext(ServerInsertedHTMLContext);
    // Should have no effects on client where there's no flush effects provider
    if (addInsertedServerHTMLCallback) {
        addInsertedServerHTMLCallback(callback);
    }
} //# sourceMappingURL=server-inserted-html.shared-runtime.js.map

// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/action-async-storage.external.js
var action_async_storage_external = __webpack_require__(7013);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/redirect-status-code.js
var redirect_status_code_RedirectStatusCode;
(function(RedirectStatusCode) {
    RedirectStatusCode[RedirectStatusCode["SeeOther"] = 303] = "SeeOther";
    RedirectStatusCode[RedirectStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    RedirectStatusCode[RedirectStatusCode["PermanentRedirect"] = 308] = "PermanentRedirect";
})(redirect_status_code_RedirectStatusCode || (redirect_status_code_RedirectStatusCode = {})); //# sourceMappingURL=redirect-status-code.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/redirect.js



const REDIRECT_ERROR_CODE = "NEXT_REDIRECT";
var RedirectType;
(function(RedirectType) {
    RedirectType["push"] = "push";
    RedirectType["replace"] = "replace";
})(RedirectType || (RedirectType = {}));
function getRedirectError(url, type, statusCode) {
    if (statusCode === void 0) statusCode = RedirectStatusCode.TemporaryRedirect;
    const error = new Error(REDIRECT_ERROR_CODE);
    error.digest = REDIRECT_ERROR_CODE + ";" + type + ";" + url + ";" + statusCode + ";";
    const requestStore = requestAsyncStorage.getStore();
    if (requestStore) {
        error.mutableCookies = requestStore.mutableCookies;
    }
    return error;
}
/**
 * When used in a streaming context, this will insert a meta tag to
 * redirect the user to the target page. When used in a custom app route, it
 * will serve a 307/303 to the caller.
 *
 * @param url the url to redirect to
 */ function redirect_redirect(url, type) {
    if (type === void 0) type = "replace";
    const actionStore = actionAsyncStorage.getStore();
    throw getRedirectError(url, type, // as we don't want the POST request to follow the redirect,
    // as it could result in erroneous re-submissions.
    (actionStore == null ? void 0 : actionStore.isAction) ? RedirectStatusCode.SeeOther : RedirectStatusCode.TemporaryRedirect);
}
/**
 * When used in a streaming context, this will insert a meta tag to
 * redirect the user to the target page. When used in a custom app route, it
 * will serve a 308/303 to the caller.
 *
 * @param url the url to redirect to
 */ function permanentRedirect(url, type) {
    if (type === void 0) type = "replace";
    const actionStore = actionAsyncStorage.getStore();
    throw getRedirectError(url, type, // as we don't want the POST request to follow the redirect,
    // as it could result in erroneous re-submissions.
    (actionStore == null ? void 0 : actionStore.isAction) ? RedirectStatusCode.SeeOther : RedirectStatusCode.PermanentRedirect);
}
/**
 * Checks an error to determine if it's an error generated by the
 * `redirect(url)` helper.
 *
 * @param error the error that may reference a redirect error
 * @returns true if the error is a redirect error
 */ function isRedirectError(error) {
    if (typeof error !== "object" || error === null || !("digest" in error) || typeof error.digest !== "string") {
        return false;
    }
    const [errorCode, type, destination, status] = error.digest.split(";", 4);
    const statusCode = Number(status);
    return errorCode === REDIRECT_ERROR_CODE && (type === "replace" || type === "push") && typeof destination === "string" && !isNaN(statusCode) && statusCode in RedirectStatusCode;
}
function getURLFromRedirectError(error) {
    if (!isRedirectError(error)) return null;
    // Slices off the beginning of the digest that contains the code and the
    // separating ';'.
    return error.digest.split(";", 3)[2];
}
function getRedirectTypeFromError(error) {
    if (!isRedirectError(error)) {
        throw new Error("Not a redirect error");
    }
    return error.digest.split(";", 2)[1];
}
function getRedirectStatusCodeFromError(error) {
    if (!isRedirectError(error)) {
        throw new Error("Not a redirect error");
    }
    return Number(error.digest.split(";", 4)[3]);
} //# sourceMappingURL=redirect.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/not-found.js
const NOT_FOUND_ERROR_CODE = "NEXT_NOT_FOUND";
/**
 * When used in a React server component, this will set the status code to 404.
 * When used in a custom app route it will just send a 404 status.
 */ function not_found_notFound() {
    // eslint-disable-next-line no-throw-literal
    const error = new Error(NOT_FOUND_ERROR_CODE);
    error.digest = NOT_FOUND_ERROR_CODE;
    throw error;
}
/**
 * Checks an error to determine if it's an error generated by the `notFound()`
 * helper.
 *
 * @param error the error that may reference a not found error
 * @returns true if the error is a not found error
 */ function isNotFoundError(error) {
    if (typeof error !== "object" || error === null || !("digest" in error)) {
        return false;
    }
    return error.digest === NOT_FOUND_ERROR_CODE;
} //# sourceMappingURL=not-found.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/navigation.js






const INTERNAL_URLSEARCHPARAMS_INSTANCE = Symbol("internal for urlsearchparams readonly");
function readonlyURLSearchParamsError() {
    return new Error("ReadonlyURLSearchParams cannot be modified");
}
class ReadonlyURLSearchParams {
    [Symbol.iterator]() {
        return this[INTERNAL_URLSEARCHPARAMS_INSTANCE][Symbol.iterator]();
    }
    append() {
        throw readonlyURLSearchParamsError();
    }
    delete() {
        throw readonlyURLSearchParamsError();
    }
    set() {
        throw readonlyURLSearchParamsError();
    }
    sort() {
        throw readonlyURLSearchParamsError();
    }
    constructor(urlSearchParams){
        this[INTERNAL_URLSEARCHPARAMS_INSTANCE] = urlSearchParams;
        this.entries = urlSearchParams.entries.bind(urlSearchParams);
        this.forEach = urlSearchParams.forEach.bind(urlSearchParams);
        this.get = urlSearchParams.get.bind(urlSearchParams);
        this.getAll = urlSearchParams.getAll.bind(urlSearchParams);
        this.has = urlSearchParams.has.bind(urlSearchParams);
        this.keys = urlSearchParams.keys.bind(urlSearchParams);
        this.values = urlSearchParams.values.bind(urlSearchParams);
        this.toString = urlSearchParams.toString.bind(urlSearchParams);
        this.size = urlSearchParams.size;
    }
}
/**
 * Get a read-only URLSearchParams object. For example searchParams.get('foo') would return 'bar' when ?foo=bar
 * Learn more about URLSearchParams here: https://developer.mozilla.org/docs/Web/API/URLSearchParams
 */ function useSearchParams() {
    clientHookInServerComponentError("useSearchParams");
    const searchParams = useContext(SearchParamsContext);
    // In the case where this is `null`, the compat types added in
    // `next-env.d.ts` will add a new overload that changes the return type to
    // include `null`.
    const readonlySearchParams = useMemo(()=>{
        if (!searchParams) {
            // When the router is not ready in pages, we won't have the search params
            // available.
            return null;
        }
        return new ReadonlyURLSearchParams(searchParams);
    }, [
        searchParams
    ]);
    if (true) {
        // AsyncLocalStorage should not be included in the client bundle.
        const { bailoutToClientRendering } = __webpack_require__(9977);
        // TODO-APP: handle dynamic = 'force-static' here and on the client
        bailoutToClientRendering("useSearchParams()");
    }
    return readonlySearchParams;
}
/**
 * Get the current pathname. For example usePathname() on /dashboard?foo=bar would return "/dashboard"
 */ function usePathname() {
    clientHookInServerComponentError("usePathname");
    // In the case where this is `null`, the compat types added in `next-env.d.ts`
    // will add a new overload that changes the return type to include `null`.
    return useContext(PathnameContext);
}

/**
 * Get the router methods. For example router.push('/dashboard')
 */ function useRouter() {
    clientHookInServerComponentError("useRouter");
    const router = useContext(AppRouterContext);
    if (router === null) {
        throw new Error("invariant expected app router to be mounted");
    }
    return router;
}
// this function performs a depth-first search of the tree to find the selected
// params
function getSelectedParams(tree, params) {
    if (params === void 0) params = {};
    const parallelRoutes = tree[1];
    for (const parallelRoute of Object.values(parallelRoutes)){
        const segment = parallelRoute[0];
        const isDynamicParameter = Array.isArray(segment);
        const segmentValue = isDynamicParameter ? segment[1] : segment;
        if (!segmentValue || segmentValue.startsWith(PAGE_SEGMENT_KEY)) continue;
        // Ensure catchAll and optional catchall are turned into an array
        const isCatchAll = isDynamicParameter && (segment[2] === "c" || segment[2] === "oc");
        if (isCatchAll) {
            params[segment[0]] = segment[1].split("/");
        } else if (isDynamicParameter) {
            params[segment[0]] = segment[1];
        }
        params = getSelectedParams(parallelRoute, params);
    }
    return params;
}
/**
 * Get the current parameters. For example useParams() on /dashboard/[team]
 * where pathname is /dashboard/nextjs would return { team: 'nextjs' }
 */ function useParams() {
    clientHookInServerComponentError("useParams");
    const globalLayoutRouter = useContext(GlobalLayoutRouterContext);
    const pathParams = useContext(PathParamsContext);
    return useMemo(()=>{
        // When it's under app router
        if (globalLayoutRouter == null ? void 0 : globalLayoutRouter.tree) {
            return getSelectedParams(globalLayoutRouter.tree);
        }
        // When it's under client side pages router
        return pathParams;
    }, [
        globalLayoutRouter == null ? void 0 : globalLayoutRouter.tree,
        pathParams
    ]);
}
// TODO-APP: handle parallel routes
/**
 * Get the canonical parameters from the current level to the leaf node.
 */ function getSelectedLayoutSegmentPath(tree, parallelRouteKey, first, segmentPath) {
    if (first === void 0) first = true;
    if (segmentPath === void 0) segmentPath = [];
    let node;
    if (first) {
        // Use the provided parallel route key on the first parallel route
        node = tree[1][parallelRouteKey];
    } else {
        // After first parallel route prefer children, if there's no children pick the first parallel route.
        const parallelRoutes = tree[1];
        var _parallelRoutes_children;
        node = (_parallelRoutes_children = parallelRoutes.children) != null ? _parallelRoutes_children : Object.values(parallelRoutes)[0];
    }
    if (!node) return segmentPath;
    const segment = node[0];
    const segmentValue = getSegmentValue(segment);
    if (!segmentValue || segmentValue.startsWith(PAGE_SEGMENT_KEY)) {
        return segmentPath;
    }
    segmentPath.push(segmentValue);
    return getSelectedLayoutSegmentPath(node, parallelRouteKey, false, segmentPath);
}
// TODO-APP: Expand description when the docs are written for it.
/**
 * Get the canonical segment path from the current level to the leaf node.
 */ function useSelectedLayoutSegments(parallelRouteKey) {
    if (parallelRouteKey === void 0) parallelRouteKey = "children";
    clientHookInServerComponentError("useSelectedLayoutSegments");
    const { tree } = useContext(LayoutRouterContext);
    return getSelectedLayoutSegmentPath(tree, parallelRouteKey);
}
// TODO-APP: Expand description when the docs are written for it.
/**
 * Get the segment below the current level
 */ function useSelectedLayoutSegment(parallelRouteKey) {
    if (parallelRouteKey === void 0) parallelRouteKey = "children";
    clientHookInServerComponentError("useSelectedLayoutSegment");
    const selectedLayoutSegments = useSelectedLayoutSegments(parallelRouteKey);
    if (selectedLayoutSegments.length === 0) {
        return null;
    }
    return selectedLayoutSegments[0];
}

 //# sourceMappingURL=navigation.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/api/navigation.js
 //# sourceMappingURL=navigation.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/exports/next-response.js
// This file is for modularized imports for next/server to get fully-treeshaking.
 //# sourceMappingURL=next-response.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/constants.js

const constants_Headers = {
    NextRewrite: "x-middleware-rewrite",
    NextResume: "x-middleware-next",
    NextRedirect: "Location",
    // Used by next to identify internal navigation for app router
    NextUrl: "next-url",
    NextAction: "next-action",
    // Used by next to identify internal navigation for pages router
    NextjsData: "x-nextjs-data"
};
const constants_constants = {
    Headers: constants_Headers
};
 //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/utils/response.js


const isRedirect = (res)=>{
    return res.headers.get(constants_constants.Headers.NextRedirect);
};
const setHeader = (res, name, val)=>{
    res.headers.set(name, val);
    return res;
};
 //# sourceMappingURL=response.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/devBrowser-Dm-lbUnV.mjs
//#region src/devBrowser.ts
const DEV_BROWSER_JWT_KEY = "__clerk_db_jwt";
const DEV_BROWSER_JWT_HEADER = "Clerk-Db-Jwt";
function setDevBrowserJWTInURL(url, jwt) {
    const resultURL = new URL(url);
    const jwtFromSearch = resultURL.searchParams.get(DEV_BROWSER_JWT_KEY);
    resultURL.searchParams.delete(DEV_BROWSER_JWT_KEY);
    const jwtToSet = jwtFromSearch || jwt;
    if (jwtToSet) resultURL.searchParams.set(DEV_BROWSER_JWT_KEY, jwtToSet);
    return resultURL;
}
/**
* Gets the __clerk_db_jwt JWT from either the hash or the search
* Side effect:
* Removes __clerk_db_jwt JWT from the URL (hash and searchParams) and updates the browser history
*/ function extractDevBrowserJWTFromURL(url) {
    const jwt = readDevBrowserJwtFromSearchParams(url);
    if (removeDevBrowserJwt(url).href !== url.href && typeof globalThis.history !== "undefined") globalThis.history.replaceState(null, "", removeDevBrowserJwt(url));
    return jwt;
}
const readDevBrowserJwtFromSearchParams = (url)=>{
    return url.searchParams.get(DEV_BROWSER_JWT_KEY) || "";
};
const removeDevBrowserJwt = (url)=>{
    return removeDevBrowserJwtFromURLSearchParams(removeLegacyDevBrowserJwt(url));
};
const removeDevBrowserJwtFromURLSearchParams = (_url)=>{
    const url = new URL(_url);
    url.searchParams.delete(DEV_BROWSER_JWT_KEY);
    return url;
};
/**
* Removes the __clerk_db_jwt JWT from the URL hash, as well as
* the legacy __dev_session JWT from the URL searchParams
* We no longer need to use this value, however, we should remove it from the URL
* Existing v4 apps will write the JWT to the hash and the search params in order to ensure
* backwards compatibility with older v4 apps.
* The only use case where this is needed now is when a user upgrades to clerk@5 locally
* without changing the component's version on their dashboard.
* In this scenario, the AP@4 -> localhost@5 redirect will still have the JWT in the hash,
* in which case we need to remove it.
*/ const removeLegacyDevBrowserJwt = (_url)=>{
    const DEV_BROWSER_JWT_MARKER_REGEXP = /__clerk_db_jwt\[(.*)\]/;
    const DEV_BROWSER_JWT_LEGACY_KEY = "__dev_session";
    const url = new URL(_url);
    url.searchParams.delete(DEV_BROWSER_JWT_LEGACY_KEY);
    url.hash = decodeURI(url.hash).replace(DEV_BROWSER_JWT_MARKER_REGEXP, "");
    if (url.href.endsWith("#")) url.hash = "";
    return url;
};
//#endregion
 //# sourceMappingURL=devBrowser-Dm-lbUnV.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/utils/serverRedirectWithAuth.js





const serverRedirectWithAuth = (clerkRequest, res, opts)=>{
    const location = res.headers.get("location");
    const shouldAppendDevBrowser = res.headers.get(chunk_I24FT6SE_constants.Headers.ClerkRedirectTo) === "true";
    if (shouldAppendDevBrowser && !!location && isDevelopmentFromSecretKey(opts.secretKey) && clerkRequest.clerkUrl.isCrossOrigin(location)) {
        const dbJwt = clerkRequest.cookies.get(DEV_BROWSER_JWT_KEY) || "";
        const url = new URL(location);
        const urlWithDevBrowser = setDevBrowserJWTInURL(url, dbJwt);
        return NextResponse.redirect(urlWithDevBrowser.href, res);
    }
    return res;
};
 //# sourceMappingURL=serverRedirectWithAuth.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/package.json
const package_namespaceObject = {"i8":"14.1.0"};
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/utils/logFormatter.js

const maskSecretKey = (str)=>{
    if (!str || typeof str !== "string") {
        return str;
    }
    try {
        return (str || "").replace(/^(sk_(live|test)_)(.+?)(.{3})$/, "$1*********$4");
    } catch  {
        return "";
    }
};
const logFormatter = (entry)=>{
    return (Array.isArray(entry) ? entry : [
        entry
    ]).map((entry2)=>{
        if (typeof entry2 === "string") {
            return maskSecretKey(entry2);
        }
        const masked = Object.fromEntries(Object.entries(entry2).map(([k, v])=>[
                k,
                maskSecretKey(v)
            ]));
        return JSON.stringify(masked, null, 2);
    }).join(", ");
};
 //# sourceMappingURL=logFormatter.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/utils/debugLogger.js



const createDebugLogger = (name, formatter)=>()=>{
        const entries = [];
        let isEnabled = false;
        return {
            enable: ()=>{
                isEnabled = true;
            },
            debug: (...args)=>{
                if (isEnabled) {
                    entries.push(args.map((arg)=>typeof arg === "function" ? arg() : arg));
                }
            },
            commit: ()=>{
                if (isEnabled) {
                    console.log(debugLogHeader(name));
                    for (const log of entries){
                        let output = formatter(log);
                        output = output.split("\n").map((l)=>`  ${l}`).join("\n");
                        if (process.env.VERCEL) {
                            output = truncate(output, 4096);
                        }
                        console.log(output);
                    }
                    console.log(debugLogFooter(name));
                }
            }
        };
    };
const withLogger = (loggerFactoryOrName, handlerCtor)=>{
    return (...args)=>{
        const factory = typeof loggerFactoryOrName === "string" ? createDebugLogger(loggerFactoryOrName, logFormatter) : loggerFactoryOrName;
        const logger = factory();
        const handler = handlerCtor(logger);
        try {
            const res = handler(...args);
            if (typeof res === "object" && "then" in res && typeof res.then === "function") {
                return res.then((val)=>{
                    logger.commit();
                    return val;
                }).catch((err)=>{
                    logger.commit();
                    throw err;
                });
            }
            logger.commit();
            return res;
        } catch (err) {
            logger.commit();
            throw err;
        }
    };
};
function debugLogHeader(name) {
    return `[clerk debug start: ${name}]`;
}
function debugLogFooter(name) {
    return `[clerk debug end: ${name}] (@clerk/nextjs=${"6.35.4"},next=${package_namespaceObject.i8},timestamp=${Math.round(/* @__PURE__ */ new Date().getTime() / 1e3)})`;
}
function truncate(str, maxLength) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8");
    const encodedString = encoder.encode(str);
    const truncatedString = encodedString.slice(0, maxLength);
    return decoder.decode(truncatedString).replace(/\uFFFD/g, "");
}
 //# sourceMappingURL=debugLogger.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/apiUrlFromPublishableKey-B2KkwQp6.mjs


//#region src/apiUrlFromPublishableKey.ts
/**
* Get the correct API url based on the publishable key.
*
* @param publishableKey - The publishable key to parse.
* @returns One of Clerk's API URLs.
*/ const apiUrlFromPublishableKey = (publishableKey)=>{
    const frontendApi = parsePublishableKey(publishableKey)?.frontendApi;
    if (frontendApi?.startsWith("clerk.") && constants_ByUssRbE_LEGACY_DEV_INSTANCE_SUFFIXES.some((suffix)=>frontendApi?.endsWith(suffix))) return PROD_API_URL;
    if (LOCAL_ENV_SUFFIXES.some((suffix)=>frontendApi?.endsWith(suffix))) return LOCAL_API_URL;
    if (STAGING_ENV_SUFFIXES.some((suffix)=>frontendApi?.endsWith(suffix))) return STAGING_API_URL;
    return PROD_API_URL;
};
//#endregion
 //# sourceMappingURL=apiUrlFromPublishableKey-B2KkwQp6.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/underscore-DjQrhefX.mjs
//#region src/underscore.ts
/**
* Convert words to a sentence.
*
* @param items - An array of words to be joined.
* @returns A string with the items joined by a comma and the last item joined by ", or".
*/ const toSentence = (items)=>{
    if (items.length == 0) return "";
    if (items.length == 1) return items[0];
    let sentence = items.slice(0, -1).join(", ");
    sentence += `, or ${items.slice(-1)}`;
    return sentence;
};
const IP_V4_ADDRESS_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
/**
* Checks if a string is a valid IPv4 address.
*
* @returns True if the string is a valid IPv4 address, false otherwise.
*/ function isIPV4Address(str) {
    return IP_V4_ADDRESS_REGEX.test(str || "");
}
/**
* Converts the first character of a string to uppercase.
*
* @param str - The string to be converted.
* @returns The modified string with the rest of the string unchanged.
*
* @example
* ```ts
* titleize('hello world') // 'Hello world'
* ```
*/ function titleize(str) {
    const s = str || "";
    return s.charAt(0).toUpperCase() + s.slice(1);
}
/**
* Converts a string from snake_case to camelCase.
*/ function snakeToCamel(str) {
    return str ? str.replace(/([-_][a-z])/g, (match)=>match.toUpperCase().replace(/-|_/, "")) : "";
}
/**
* Converts a string from camelCase to snake_case.
*/ function camelToSnake(str) {
    return str ? str.replace(/[A-Z]/g, (letter)=>`_${letter.toLowerCase()}`) : "";
}
const createDeepObjectTransformer = (transform)=>{
    const deepTransform = (obj)=>{
        if (!obj) return obj;
        if (Array.isArray(obj)) return obj.map((el)=>{
            if (typeof el === "object" || Array.isArray(el)) return deepTransform(el);
            return el;
        });
        const copy = {
            ...obj
        };
        const keys = Object.keys(copy);
        for (const oldName of keys){
            const newName = transform(oldName.toString());
            if (newName !== oldName) {
                copy[newName] = copy[oldName];
                delete copy[oldName];
            }
            if (typeof copy[newName] === "object") copy[newName] = deepTransform(copy[newName]);
        }
        return copy;
    };
    return deepTransform;
};
/**
* Transforms camelCased objects/ arrays to snake_cased.
* This function recursively traverses all objects and arrays of the passed value
* camelCased keys are removed.
*
* @function
*/ const deepCamelToSnake = createDeepObjectTransformer(camelToSnake);
/**
* Transforms snake_cased objects/ arrays to camelCased.
* This function recursively traverses all objects and arrays of the passed value
* camelCased keys are removed.
*
* @function
*/ const deepSnakeToCamel = createDeepObjectTransformer(snakeToCamel);
/**
* A function to determine if a value is truthy.
*
* @returns True for `true`, true, positive numbers. False for `false`, false, 0, negative integers and anything else.
*/ function isTruthy(value) {
    if (typeof value === `boolean`) return value;
    if (value === void 0 || value === null) return false;
    if (typeof value === `string`) {
        if (value.toLowerCase() === `true`) return true;
        if (value.toLowerCase() === `false`) return false;
    }
    const number = parseInt(value, 10);
    if (isNaN(number)) return false;
    if (number > 0) return true;
    return false;
}
/**
* Get all non-undefined values from an object.
*/ function getNonUndefinedValues(obj) {
    return Object.entries(obj).reduce((acc, [key, value])=>{
        if (value !== void 0) acc[key] = value;
        return acc;
    }, {});
}
//#endregion
 //# sourceMappingURL=underscore-DjQrhefX.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/underscore.mjs



;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/constants.js



const CLERK_JS_VERSION = process.env.NEXT_PUBLIC_CLERK_JS_VERSION || "";
const CLERK_JS_URL = process.env.NEXT_PUBLIC_CLERK_JS_URL || "";
const constants_API_VERSION = process.env.CLERK_API_VERSION || "v1";
const SECRET_KEY = process.env.CLERK_SECRET_KEY || "";
const MACHINE_SECRET_KEY = process.env.CLERK_MACHINE_SECRET_KEY || "";
const PUBLISHABLE_KEY = "pk_test_Ym9zcy1pbXBhbGEtNjguY2xlcmsuYWNjb3VudHMuZGV2JA" || 0;
const ENCRYPTION_KEY = process.env.CLERK_ENCRYPTION_KEY || "";
const constants_API_URL = process.env.CLERK_API_URL || apiUrlFromPublishableKey(PUBLISHABLE_KEY);
const DOMAIN = process.env.NEXT_PUBLIC_CLERK_DOMAIN || "";
const PROXY_URL = process.env.NEXT_PUBLIC_CLERK_PROXY_URL || "";
const IS_SATELLITE = isTruthy(process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE) || false;
const SIGN_IN_URL = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "";
const SIGN_UP_URL = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "";
const SDK_METADATA = {
    name: "@clerk/nextjs",
    version: "6.35.4",
    environment: "production"
};
const TELEMETRY_DISABLED = isTruthy(process.env.NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED);
const TELEMETRY_DEBUG = isTruthy(process.env.NEXT_PUBLIC_CLERK_TELEMETRY_DEBUG);
const KEYLESS_DISABLED = isTruthy(process.env.NEXT_PUBLIC_CLERK_KEYLESS_DISABLED) || false;
 //# sourceMappingURL=constants.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/utils/sdk-versions.js


const isNext13 = package_namespaceObject.i8.startsWith("13.");
const isNextWithUnstableServerActions = isNext13 || package_namespaceObject.i8.startsWith("14.0");
 //# sourceMappingURL=sdk-versions.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/utils/feature-flags.js




const canUseKeyless = !isNextWithUnstableServerActions && // Next.js will inline the value of 'development' or 'production' on the client bundle, so this is client-safe.
isDevelopmentEnvironment() && !KEYLESS_DISABLED;
 //# sourceMappingURL=feature-flags.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/exports/next-request.js
// This file is for modularized imports for next/server to get fully-treeshaking.
 //# sourceMappingURL=next-request.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/app-router/server/utils.js


const isPrerenderingBailout = (e)=>{
    if (!(e instanceof Error) || !("message" in e)) {
        return false;
    }
    const { message } = e;
    const lowerCaseInput = message.toLowerCase();
    const dynamicServerUsage = lowerCaseInput.includes("dynamic server usage");
    const bailOutPrerendering = lowerCaseInput.includes("this page needs to bail out of prerendering");
    const routeRegex = /Route .*? needs to bail out of prerendering at this point because it used .*?./;
    return routeRegex.test(message) || dynamicServerUsage || bailOutPrerendering;
};
async function buildRequestLike() {
    try {
        const { headers } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 1813));
        const resolvedHeaders = await headers();
        return new NextRequest("https://placeholder.com", {
            headers: resolvedHeaders
        });
    } catch (e) {
        if (e && isPrerenderingBailout(e)) {
            throw e;
        }
        throw new Error(`Clerk: auth(), currentUser() and clerkClient(), are only supported in App Router (/app directory).
If you're using /pages, try getAuth() instead.
Original error: ${e}`);
    }
}
function getScriptNonceFromHeader(cspHeaderValue) {
    var _a;
    const directives = cspHeaderValue.split(";").map((directive2)=>directive2.trim());
    const directive = directives.find((dir)=>dir.startsWith("script-src")) || directives.find((dir)=>dir.startsWith("default-src"));
    if (!directive) {
        return;
    }
    const nonce = (_a = directive.split(" ").slice(1).map((source)=>source.trim()).find((source)=>source.startsWith("'nonce-") && source.length > 8 && source.endsWith("'"))) == null ? void 0 : _a.slice(7, -1);
    if (!nonce) {
        return;
    }
    if (/[&><\u2028\u2029]/g.test(nonce)) {
        throw new Error("Nonce value from Content-Security-Policy contained invalid HTML escape characters, which is disallowed for security reasons. Make sure that your nonce value does not contain the following characters: `<`, `>`, `&`");
    }
    return nonce;
}
 //# sourceMappingURL=utils.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+backend@2.23.2_react_2762a69b54307b8bd802f183496730d6/node_modules/@clerk/backend/dist/chunk-P263NW7Z.mjs
// src/jwt/legacyReturn.ts
function withLegacyReturn(cb) {
    return async (...args)=>{
        const { data, errors } = await cb(...args);
        if (errors) {
            throw errors[0];
        }
        return data;
    };
}
function withLegacySyncReturn(cb) {
    return (...args)=>{
        const { data, errors } = cb(...args);
        if (errors) {
            throw errors[0];
        }
        return data;
    };
}
 //# sourceMappingURL=chunk-P263NW7Z.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/telemetry-wqMDWlvR.mjs


//#region src/telemetry/throttler.ts
const DEFAULT_CACHE_TTL_MS = 864e5;
/**
* Manages throttling for telemetry events using a configurable cache implementation
* to mitigate event flooding in frequently executed code paths.
*/ var TelemetryEventThrottler = class {
    #cache;
    #cacheTtl;
    constructor(cache){
        this.#cacheTtl = DEFAULT_CACHE_TTL_MS;
        this.#cache = cache;
    }
    isEventThrottled(payload) {
        const now = Date.now();
        const key = this.#generateKey(payload);
        const entry = this.#cache.getItem(key);
        if (!entry) {
            this.#cache.setItem(key, now);
            return false;
        }
        if (now - entry > this.#cacheTtl) {
            this.#cache.setItem(key, now);
            return false;
        }
        return true;
    }
    /**
	* Generates a consistent unique key for telemetry events by sorting payload properties.
	* This ensures that payloads with identical content in different orders produce the same key.
	*/ #generateKey(event) {
        const { sk: _sk, pk: _pk, payload, ...rest } = event;
        const sanitizedEvent = {
            ...payload,
            ...rest
        };
        return JSON.stringify(Object.keys({
            ...payload,
            ...rest
        }).sort().map((key)=>sanitizedEvent[key]));
    }
};
/**
* LocalStorage-based cache implementation for browser environments.
*/ var LocalStorageThrottlerCache = class {
    #storageKey;
    getItem(key) {
        return this.#getCache()[key];
    }
    setItem(key, value) {
        try {
            const cache = this.#getCache();
            cache[key] = value;
            localStorage.setItem(this.#storageKey, JSON.stringify(cache));
        } catch (err) {
            if (err instanceof DOMException && (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED") && localStorage.length > 0) localStorage.removeItem(this.#storageKey);
        }
    }
    removeItem(key) {
        try {
            const cache = this.#getCache();
            delete cache[key];
            localStorage.setItem(this.#storageKey, JSON.stringify(cache));
        } catch  {}
    }
    #getCache() {
        try {
            const cacheString = localStorage.getItem(this.#storageKey);
            if (!cacheString) return {};
            return JSON.parse(cacheString);
        } catch  {
            return {};
        }
    }
    static isSupported() {
        return  false && 0;
    }
    constructor(){
        this.#storageKey = "clerk_telemetry_throttler";
    }
};
/**
* In-memory cache implementation for non-browser environments (e.g., React Native).
*/ var InMemoryThrottlerCache = class {
    #cache;
    #maxSize;
    getItem(key) {
        if (this.#cache.size > this.#maxSize) {
            this.#cache.clear();
            return;
        }
        return this.#cache.get(key);
    }
    setItem(key, value) {
        this.#cache.set(key, value);
    }
    removeItem(key) {
        this.#cache.delete(key);
    }
    constructor(){
        this.#cache = /* @__PURE__ */ new Map();
        this.#maxSize = 1e4;
    }
};
//#endregion
//#region src/telemetry/collector.ts
/**
* Type guard to check if window.Clerk exists and has the expected structure.
*/ function isWindowClerkWithMetadata(clerk) {
    return typeof clerk === "object" && clerk !== null && "constructor" in clerk && typeof clerk.constructor === "function";
}
const VALID_LOG_LEVELS = new Set([
    "error",
    "warn",
    "info",
    "debug",
    "trace"
]);
const DEFAULT_CONFIG = {
    samplingRate: 1,
    maxBufferSize: 5,
    endpoint: "https://clerk-telemetry.com"
};
var TelemetryCollector = class {
    #config;
    #eventThrottler;
    #metadata;
    #buffer;
    #pendingFlush;
    constructor(options){
        this.#metadata = {};
        this.#buffer = [];
        this.#pendingFlush = null;
        this.#config = {
            maxBufferSize: options.maxBufferSize ?? DEFAULT_CONFIG.maxBufferSize,
            samplingRate: options.samplingRate ?? DEFAULT_CONFIG.samplingRate,
            perEventSampling: options.perEventSampling ?? true,
            disabled: options.disabled ?? false,
            debug: options.debug ?? false,
            endpoint: DEFAULT_CONFIG.endpoint
        };
        if (!options.clerkVersion && "undefined" === "undefined") this.#metadata.clerkVersion = "";
        else this.#metadata.clerkVersion = options.clerkVersion ?? "";
        this.#metadata.sdk = options.sdk;
        this.#metadata.sdkVersion = options.sdkVersion;
        this.#metadata.publishableKey = options.publishableKey ?? "";
        const parsedKey = parsePublishableKey(options.publishableKey);
        if (parsedKey) this.#metadata.instanceType = parsedKey.instanceType;
        if (options.secretKey) this.#metadata.secretKey = options.secretKey.substring(0, 16);
        this.#eventThrottler = new TelemetryEventThrottler(LocalStorageThrottlerCache.isSupported() ? new LocalStorageThrottlerCache() : new InMemoryThrottlerCache());
    }
    get isEnabled() {
        if (this.#metadata.instanceType !== "development") return false;
        if (this.#config.disabled || typeof process !== "undefined" && process.env && isTruthy(process.env.CLERK_TELEMETRY_DISABLED)) return false;
        if (false) {}
        return true;
    }
    get isDebug() {
        return this.#config.debug || typeof process !== "undefined" && process.env && isTruthy(process.env.CLERK_TELEMETRY_DEBUG);
    }
    record(event) {
        try {
            const preparedPayload = this.#preparePayload(event.event, event.payload);
            this.#logEvent(preparedPayload.event, preparedPayload);
            if (!this.#shouldRecord(preparedPayload, event.eventSamplingRate)) return;
            this.#buffer.push({
                kind: "event",
                value: preparedPayload
            });
            this.#scheduleFlush();
        } catch (error) {
            console.error("[clerk/telemetry] Error recording telemetry event", error);
        }
    }
    /**
	* Records a telemetry log entry if logging is enabled and not in debug mode.
	*
	* @param entry - The telemetry log entry to record.
	*/ recordLog(entry) {
        try {
            if (!this.#shouldRecordLog(entry)) return;
            const levelIsValid = typeof entry?.level === "string" && VALID_LOG_LEVELS.has(entry.level);
            const messageIsValid = typeof entry?.message === "string" && entry.message.trim().length > 0;
            let normalizedTimestamp = null;
            const timestampInput = entry?.timestamp;
            if (typeof timestampInput === "number" || typeof timestampInput === "string") {
                const candidate = new Date(timestampInput);
                if (!Number.isNaN(candidate.getTime())) normalizedTimestamp = candidate;
            }
            if (!levelIsValid || !messageIsValid || normalizedTimestamp === null) {
                if (this.isDebug && typeof console !== "undefined") console.warn("[clerk/telemetry] Dropping invalid telemetry log entry", {
                    levelIsValid,
                    messageIsValid,
                    timestampIsValid: normalizedTimestamp !== null
                });
                return;
            }
            const sdkMetadata = this.#getSDKMetadata();
            const logData = {
                sdk: sdkMetadata.name,
                sdkv: sdkMetadata.version,
                cv: this.#metadata.clerkVersion ?? "",
                lvl: entry.level,
                msg: entry.message,
                ts: normalizedTimestamp.toISOString(),
                pk: this.#metadata.publishableKey || null,
                payload: this.#sanitizeContext(entry.context)
            };
            this.#buffer.push({
                kind: "log",
                value: logData
            });
            this.#scheduleFlush();
        } catch (error) {
            console.error("[clerk/telemetry] Error recording telemetry log entry", error);
        }
    }
    #shouldRecord(preparedPayload, eventSamplingRate) {
        return this.isEnabled && !this.isDebug && this.#shouldBeSampled(preparedPayload, eventSamplingRate);
    }
    #shouldRecordLog(_entry) {
        return true;
    }
    #shouldBeSampled(preparedPayload, eventSamplingRate) {
        const randomSeed = Math.random();
        if (!(randomSeed <= this.#config.samplingRate && (this.#config.perEventSampling === false || typeof eventSamplingRate === "undefined" || randomSeed <= eventSamplingRate))) return false;
        return !this.#eventThrottler.isEventThrottled(preparedPayload);
    }
    #scheduleFlush() {
        if (true) {
            this.#flush();
            return;
        }
        if (this.#buffer.length >= this.#config.maxBufferSize) {
            if (this.#pendingFlush) if (typeof cancelIdleCallback !== "undefined") cancelIdleCallback(Number(this.#pendingFlush));
            else clearTimeout(Number(this.#pendingFlush));
            this.#flush();
            return;
        }
        if (this.#pendingFlush) return;
        if ("requestIdleCallback" in window) this.#pendingFlush = requestIdleCallback(()=>{
            this.#flush();
            this.#pendingFlush = null;
        });
        else this.#pendingFlush = setTimeout(()=>{
            this.#flush();
            this.#pendingFlush = null;
        }, 0);
    }
    #flush() {
        const itemsToSend = [
            ...this.#buffer
        ];
        this.#buffer = [];
        this.#pendingFlush = null;
        if (itemsToSend.length === 0) return;
        const eventsToSend = itemsToSend.filter((item)=>item.kind === "event").map((item)=>item.value);
        const logsToSend = itemsToSend.filter((item)=>item.kind === "log").map((item)=>item.value);
        if (eventsToSend.length > 0) {
            const eventsUrl = new URL("/v1/event", this.#config.endpoint);
            fetch(eventsUrl, {
                headers: {
                    "Content-Type": "application/json"
                },
                keepalive: true,
                method: "POST",
                body: JSON.stringify({
                    events: eventsToSend
                })
            }).catch(()=>void 0);
        }
        if (logsToSend.length > 0) {
            const logsUrl = new URL("/v1/logs", this.#config.endpoint);
            fetch(logsUrl, {
                headers: {
                    "Content-Type": "application/json"
                },
                keepalive: true,
                method: "POST",
                body: JSON.stringify({
                    logs: logsToSend
                })
            }).catch(()=>void 0);
        }
    }
    /**
	* If running in debug mode, log the event and its payload to the console.
	*/ #logEvent(event, payload) {
        if (!this.isDebug) return;
        if (typeof console.groupCollapsed !== "undefined") {
            console.groupCollapsed("[clerk/telemetry]", event);
            console.log(payload);
            console.groupEnd();
        } else console.log("[clerk/telemetry]", event, payload);
    }
    /**
	* If in browser, attempt to lazily grab the SDK metadata from the Clerk singleton, otherwise fallback to the initially passed in values.
	*
	* This is necessary because the sdkMetadata can be set by the host SDK after the TelemetryCollector is instantiated.
	*/ #getSDKMetadata() {
        const sdkMetadata = {
            name: this.#metadata.sdk,
            version: this.#metadata.sdkVersion
        };
        if (false) {}
        return sdkMetadata;
    }
    /**
	* Append relevant metadata from the Clerk singleton to the event payload.
	*/ #preparePayload(event, payload) {
        const sdkMetadata = this.#getSDKMetadata();
        return {
            event,
            cv: this.#metadata.clerkVersion ?? "",
            it: this.#metadata.instanceType ?? "",
            sdk: sdkMetadata.name,
            sdkv: sdkMetadata.version,
            ...this.#metadata.publishableKey ? {
                pk: this.#metadata.publishableKey
            } : {},
            ...this.#metadata.secretKey ? {
                sk: this.#metadata.secretKey
            } : {},
            payload
        };
    }
    /**
	* Best-effort sanitization of the context payload. Returns a plain object with JSON-serializable
	* values or null when the input is missing or not serializable. Arrays are not accepted.
	*/ #sanitizeContext(context) {
        if (context === null || typeof context === "undefined") return null;
        if (typeof context !== "object") return null;
        try {
            const cleaned = JSON.parse(JSON.stringify(context));
            if (cleaned && typeof cleaned === "object" && !Array.isArray(cleaned)) return cleaned;
            return null;
        } catch  {
            return null;
        }
    }
};
//#endregion
//#region src/telemetry/events/component-mounted.ts
const EVENT_COMPONENT_MOUNTED = "COMPONENT_MOUNTED";
const EVENT_COMPONENT_OPENED = "COMPONENT_OPENED";
const EVENT_SAMPLING_RATE$3 = .1;
/** Increase sampling for high-signal auth components on mount. */ const AUTH_COMPONENTS = new Set([
    "SignIn",
    "SignUp"
]);
/**
* Returns the per-event sampling rate for component-mounted telemetry events.
* Uses a higher rate for SignIn/SignUp to improve signal quality.
*
*  @internal
*/ function getComponentMountedSamplingRate(component) {
    return AUTH_COMPONENTS.has(component) ? 1 : EVENT_SAMPLING_RATE$3;
}
/**
* Factory for prebuilt component telemetry events.
*
* @internal
*/ function createPrebuiltComponentEvent(event) {
    return function(component, props, additionalPayload) {
        return {
            event,
            eventSamplingRate: event === EVENT_COMPONENT_MOUNTED ? getComponentMountedSamplingRate(component) : EVENT_SAMPLING_RATE$3,
            payload: {
                component,
                appearanceProp: Boolean(props?.appearance),
                baseTheme: Boolean(props?.appearance?.baseTheme),
                elements: Boolean(props?.appearance?.elements),
                variables: Boolean(props?.appearance?.variables),
                ...additionalPayload
            }
        };
    };
}
/**
* Helper function for `telemetry.record()`. Create a consistent event object for when a prebuilt (AIO) component is mounted.
*
* @param component - The name of the component.
* @param props - The props passed to the component. Will be filtered to a known list of props.
* @param additionalPayload - Additional data to send with the event.
* @example
* telemetry.record(eventPrebuiltComponentMounted('SignUp', props));
*/ function eventPrebuiltComponentMounted(component, props, additionalPayload) {
    return createPrebuiltComponentEvent(EVENT_COMPONENT_MOUNTED)(component, props, additionalPayload);
}
/**
* Helper function for `telemetry.record()`. Create a consistent event object for when a prebuilt (AIO) component is opened as a modal.
*
* @param component - The name of the component.
* @param props - The props passed to the component. Will be filtered to a known list of props.
* @param additionalPayload - Additional data to send with the event.
* @example
* telemetry.record(eventPrebuiltComponentOpened('GoogleOneTap', props));
*/ function eventPrebuiltComponentOpened(component, props, additionalPayload) {
    return createPrebuiltComponentEvent(EVENT_COMPONENT_OPENED)(component, props, additionalPayload);
}
/**
* Helper function for `telemetry.record()`. Create a consistent event object for when a component is mounted. Use `eventPrebuiltComponentMounted` for prebuilt components.
*
* **Caution:** Filter the `props` you pass to this function to avoid sending too much data.
*
* @param component - The name of the component.
* @param props - The props passed to the component. Ideally you only pass a handful of props here.
* @example
* telemetry.record(eventComponentMounted('SignUp', props));
*/ function eventComponentMounted(component, props = {}) {
    return {
        event: EVENT_COMPONENT_MOUNTED,
        eventSamplingRate: getComponentMountedSamplingRate(component),
        payload: {
            component,
            ...props
        }
    };
}
//#endregion
//#region src/telemetry/events/method-called.ts
const EVENT_METHOD_CALLED = "METHOD_CALLED";
const EVENT_SAMPLING_RATE$2 = .1;
/**
* Fired when a helper method is called from a Clerk SDK.
*/ function eventMethodCalled(method, payload) {
    return {
        event: EVENT_METHOD_CALLED,
        eventSamplingRate: EVENT_SAMPLING_RATE$2,
        payload: {
            method,
            ...payload
        }
    };
}
//#endregion
//#region src/telemetry/events/framework-metadata.ts
const EVENT_FRAMEWORK_METADATA = "FRAMEWORK_METADATA";
const EVENT_SAMPLING_RATE$1 = .1;
/**
* Fired when a helper method is called from a Clerk SDK.
*/ function eventFrameworkMetadata(payload) {
    return {
        event: EVENT_FRAMEWORK_METADATA,
        eventSamplingRate: EVENT_SAMPLING_RATE$1,
        payload
    };
}
//#endregion
//#region src/telemetry/events/theme-usage.ts
const EVENT_THEME_USAGE = "THEME_USAGE";
const EVENT_SAMPLING_RATE = 1;
/**
* Helper function for `telemetry.record()`. Create a consistent event object for tracking theme usage in ClerkProvider.
*
* @param appearance - The appearance prop from ClerkProvider.
* @example
* telemetry.record(eventThemeUsage(appearance));
*/ function eventThemeUsage(appearance) {
    return {
        event: EVENT_THEME_USAGE,
        eventSamplingRate: EVENT_SAMPLING_RATE,
        payload: analyzeThemeUsage(appearance)
    };
}
/**
* Analyzes the appearance prop to extract theme usage information for telemetry.
*
* @internal
*/ function analyzeThemeUsage(appearance) {
    if (!appearance || typeof appearance !== "object") return {};
    const themeProperty = appearance.theme || appearance.baseTheme;
    if (!themeProperty) return {};
    let themeName;
    if (Array.isArray(themeProperty)) for (const theme of themeProperty){
        const name = extractThemeName(theme);
        if (name) {
            themeName = name;
            break;
        }
    }
    else themeName = extractThemeName(themeProperty);
    return {
        themeName
    };
}
/**
* Extracts the theme name from a theme object.
*
* @internal
*/ function extractThemeName(theme) {
    if (typeof theme === "string") return theme;
    if (typeof theme === "object" && theme !== null) {
        if ("name" in theme && typeof theme.name === "string") return theme.name;
    }
}
//#endregion
 //# sourceMappingURL=telemetry-wqMDWlvR.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/telemetry.mjs








;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+backend@2.23.2_react_2762a69b54307b8bd802f183496730d6/node_modules/@clerk/backend/dist/index.mjs






// src/index.ts

var verifyToken2 = withLegacyReturn(verifyToken);
function createClerkClient(options) {
    const opts = {
        ...options
    };
    const apiClient = createBackendApiClient(opts);
    const requestState = createAuthenticateRequest({
        options: opts,
        apiClient
    });
    const telemetry = new TelemetryCollector({
        publishableKey: opts.publishableKey,
        secretKey: opts.secretKey,
        samplingRate: 0.1,
        ...opts.sdkMetadata ? {
            sdk: opts.sdkMetadata.name,
            sdkVersion: opts.sdkMetadata.version
        } : {},
        ...opts.telemetry || {}
    });
    return {
        ...apiClient,
        ...requestState,
        telemetry
    };
}
 //# sourceMappingURL=index.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/createClerkClient.js



const clerkClientDefaultOptions = {
    secretKey: SECRET_KEY,
    publishableKey: PUBLISHABLE_KEY,
    apiUrl: constants_API_URL,
    apiVersion: constants_API_VERSION,
    userAgent: `${"@clerk/nextjs"}@${"6.35.4"}`,
    proxyUrl: PROXY_URL,
    domain: DOMAIN,
    isSatellite: IS_SATELLITE,
    machineSecretKey: MACHINE_SECRET_KEY,
    sdkMetadata: SDK_METADATA,
    telemetry: {
        disabled: TELEMETRY_DISABLED,
        debug: TELEMETRY_DEBUG
    }
};
const createClerkClientWithOptions = (options)=>createClerkClient({
        ...clerkClientDefaultOptions,
        ...options
    });
 //# sourceMappingURL=createClerkClient.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/headers-utils.js


function getCustomAttributeFromRequest(req, key) {
    return key in req ? req[key] : void 0;
}
function getAuthKeyFromRequest(req, key) {
    return getCustomAttributeFromRequest(req, constants.Attributes[key]) || getHeader(req, constants.Headers[key]);
}
function getHeader(req, name) {
    var _a, _b;
    if (isNextRequest(req) || isRequestWebAPI(req)) {
        return req.headers.get(name);
    }
    return req.headers[name] || req.headers[name.toLowerCase()] || ((_b = (_a = req.socket) == null ? void 0 : _a._httpMessage) == null ? void 0 : _b.getHeader(name));
}
function headers_utils_detectClerkMiddleware(req) {
    return Boolean(getAuthKeyFromRequest(req, "AuthStatus"));
}
function isNextRequest(val) {
    try {
        const { headers, nextUrl, cookies } = val || {};
        return typeof (headers == null ? void 0 : headers.get) === "function" && typeof (nextUrl == null ? void 0 : nextUrl.searchParams.get) === "function" && typeof (cookies == null ? void 0 : cookies.get) === "function";
    } catch  {
        return false;
    }
}
function isRequestWebAPI(val) {
    try {
        const { headers } = val || {};
        return typeof (headers == null ? void 0 : headers.get) === "function";
    } catch  {
        return false;
    }
}
 //# sourceMappingURL=headers-utils.js.map

// EXTERNAL MODULE: external "node:async_hooks"
var external_node_async_hooks_ = __webpack_require__(2067);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/middleware-storage.js


const clerkMiddlewareRequestDataStore = /* @__PURE__ */ new Map();
const clerkMiddlewareRequestDataStorage = new external_node_async_hooks_.AsyncLocalStorage();
 //# sourceMappingURL=middleware-storage.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/logger-B9q7E6uE.mjs
//#region src/logger.ts
const loggedMessages = /* @__PURE__ */ new Set();
const logger = {
    warnOnce: (msg)=>{
        if (loggedMessages.has(msg)) return;
        loggedMessages.add(msg);
        console.warn(msg);
    },
    logOnce: (msg)=>{
        if (loggedMessages.has(msg)) return;
        console.log(msg);
        loggedMessages.add(msg);
    }
};
//#endregion
 //# sourceMappingURL=logger-B9q7E6uE.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/logger.mjs



;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/proxy-Bq8EHApG.mjs
//#region src/proxy.ts
function isValidProxyUrl(key) {
    if (!key) return true;
    return isHttpOrHttps(key) || isProxyUrlRelative(key);
}
function isHttpOrHttps(key) {
    return /^http(s)?:\/\//.test(key || "");
}
function isProxyUrlRelative(key) {
    return key.startsWith("/");
}
function proxyUrlToAbsoluteURL(url) {
    if (!url) return "";
    return isProxyUrlRelative(url) ? new URL(url, window.location.origin).toString() : url;
}
//#endregion
 //# sourceMappingURL=proxy-Bq8EHApG.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+shared@3.35.2_react-_53013bc09a1814881f9a4a47ff287534/node_modules/@clerk/shared/dist/runtime/handleValueOrFn-CcwnRX-K.mjs
//#region src/utils/handleValueOrFn.ts
function handleValueOrFn(value, url, defaultValue) {
    if (typeof value === "function") return value(url);
    if (typeof value !== "undefined") return value;
    if (typeof defaultValue !== "undefined") return defaultValue;
}
//#endregion
 //# sourceMappingURL=handleValueOrFn-CcwnRX-K.mjs.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/vendor/crypto-es.js
var kt = Object.defineProperty;
var bt = (c, t, s)=>t in c ? kt(c, t, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: s
    }) : c[t] = s;
var it = (c, t, s)=>bt(c, typeof t != "symbol" ? t + "" : t, s);
var lt, ht, dt, pt, xt, _t, at = ((lt = typeof globalThis != "undefined" ? globalThis : void 0) == null ? void 0 : lt.crypto) || ((ht = typeof __webpack_require__.g != "undefined" ? __webpack_require__.g : void 0) == null ? void 0 : ht.crypto) || ((dt =  false ? 0 : void 0) == null ? void 0 : dt.crypto) || ((pt = typeof self != "undefined" ? self : void 0) == null ? void 0 : pt.crypto) || ((_t = (xt = typeof frames != "undefined" ? frames : void 0) == null ? void 0 : xt[0]) == null ? void 0 : _t.crypto), Z;
at ? Z = (c)=>{
    let t = [];
    for(let s = 0, e; s < c; s += 4)t.push(at.getRandomValues(new Uint32Array(1))[0]);
    return new u(t, c);
} : Z = (c)=>{
    let t = [], s = (e)=>{
        let r = e, o = 987654321, n = 4294967295;
        return ()=>{
            o = 36969 * (o & 65535) + (o >> 16) & n, r = 18e3 * (r & 65535) + (r >> 16) & n;
            let h = (o << 16) + r & n;
            return h /= 4294967296, h += .5, h * (Math.random() > .5 ? 1 : -1);
        };
    };
    for(let e = 0, r; e < c; e += 4){
        let o = s((r || Math.random()) * 4294967296);
        r = o() * 987654071, t.push(o() * 4294967296 | 0);
    }
    return new u(t, c);
};
var m = class {
    static create(...t) {
        return new this(...t);
    }
    mixIn(t) {
        return Object.assign(this, t);
    }
    clone() {
        let t = new this.constructor;
        return Object.assign(t, this), t;
    }
}, u = class extends m {
    constructor(t = [], s = t.length * 4){
        super();
        let e = t;
        if (e instanceof ArrayBuffer && (e = new Uint8Array(e)), (e instanceof Int8Array || e instanceof Uint8ClampedArray || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array) && (e = new Uint8Array(e.buffer, e.byteOffset, e.byteLength)), e instanceof Uint8Array) {
            let r = e.byteLength, o = [];
            for(let n = 0; n < r; n += 1)o[n >>> 2] |= e[n] << 24 - n % 4 * 8;
            this.words = o, this.sigBytes = r;
        } else this.words = t, this.sigBytes = s;
    }
    toString(t = Mt) {
        return t.stringify(this);
    }
    concat(t) {
        let s = this.words, e = t.words, r = this.sigBytes, o = t.sigBytes;
        if (this.clamp(), r % 4) for(let n = 0; n < o; n += 1){
            let h = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
            s[r + n >>> 2] |= h << 24 - (r + n) % 4 * 8;
        }
        else for(let n = 0; n < o; n += 4)s[r + n >>> 2] = e[n >>> 2];
        return this.sigBytes += o, this;
    }
    clamp() {
        let { words: t, sigBytes: s } = this;
        t[s >>> 2] &= 4294967295 << 32 - s % 4 * 8, t.length = Math.ceil(s / 4);
    }
    clone() {
        let t = super.clone.call(this);
        return t.words = this.words.slice(0), t;
    }
};
it(u, "random", Z);
var Mt = {
    stringify (c) {
        let { words: t, sigBytes: s } = c, e = [];
        for(let r = 0; r < s; r += 1){
            let o = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
            e.push((o >>> 4).toString(16)), e.push((o & 15).toString(16));
        }
        return e.join("");
    },
    parse (c) {
        let t = c.length, s = [];
        for(let e = 0; e < t; e += 2)s[e >>> 3] |= parseInt(c.substr(e, 2), 16) << 24 - e % 8 * 4;
        return new u(s, t / 2);
    }
}, ft = {
    stringify (c) {
        let { words: t, sigBytes: s } = c, e = [];
        for(let r = 0; r < s; r += 1){
            let o = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
            e.push(String.fromCharCode(o));
        }
        return e.join("");
    },
    parse (c) {
        let t = c.length, s = [];
        for(let e = 0; e < t; e += 1)s[e >>> 2] |= (c.charCodeAt(e) & 255) << 24 - e % 4 * 8;
        return new u(s, t);
    }
}, X = {
    stringify (c) {
        try {
            return decodeURIComponent(escape(ft.stringify(c)));
        } catch  {
            throw new Error("Malformed UTF-8 data");
        }
    },
    parse (c) {
        return ft.parse(unescape(encodeURIComponent(c)));
    }
}, N = class extends m {
    constructor(){
        super(), this._minBufferSize = 0;
    }
    reset() {
        this._data = new u, this._nDataBytes = 0;
    }
    _append(t) {
        let s = t;
        typeof s == "string" && (s = X.parse(s)), this._data.concat(s), this._nDataBytes += s.sigBytes;
    }
    _process(t) {
        let s, { _data: e, blockSize: r } = this, o = e.words, n = e.sigBytes, h = r * 4, x = n / h;
        t ? x = Math.ceil(x) : x = Math.max((x | 0) - this._minBufferSize, 0);
        let p = x * r, _ = Math.min(p * 4, n);
        if (p) {
            for(let y = 0; y < p; y += r)this._doProcessBlock(o, y);
            s = o.splice(0, p), e.sigBytes -= _;
        }
        return new u(s, _);
    }
    clone() {
        let t = super.clone.call(this);
        return t._data = this._data.clone(), t;
    }
}, crypto_es_H = class extends N {
    constructor(t){
        super(), this.blockSize = 512 / 32, this.cfg = Object.assign(new m, t), this.reset();
    }
    static _createHelper(t) {
        return (s, e)=>new t(e).finalize(s);
    }
    static _createHmacHelper(t) {
        return (s, e)=>new crypto_es_$(t, e).finalize(s);
    }
    reset() {
        super.reset.call(this), this._doReset();
    }
    update(t) {
        return this._append(t), this._process(), this;
    }
    finalize(t) {
        return t && this._append(t), this._doFinalize();
    }
}, crypto_es_$ = class extends m {
    constructor(t, s){
        super();
        let e = new t;
        this._hasher = e;
        let r = s;
        typeof r == "string" && (r = X.parse(r));
        let o = e.blockSize, n = o * 4;
        r.sigBytes > n && (r = e.finalize(s)), r.clamp();
        let h = r.clone();
        this._oKey = h;
        let x = r.clone();
        this._iKey = x;
        let p = h.words, _ = x.words;
        for(let y = 0; y < o; y += 1)p[y] ^= 1549556828, _[y] ^= 909522486;
        h.sigBytes = n, x.sigBytes = n, this.reset();
    }
    reset() {
        let t = this._hasher;
        t.reset(), t.update(this._iKey);
    }
    update(t) {
        return this._hasher.update(t), this;
    }
    finalize(t) {
        let s = this._hasher, e = s.finalize(t);
        return s.reset(), s.finalize(this._oKey.clone().concat(e));
    }
};
var zt = (c, t, s)=>{
    let e = [], r = 0;
    for(let o = 0; o < t; o += 1)if (o % 4) {
        let n = s[c.charCodeAt(o - 1)] << o % 4 * 2, h = s[c.charCodeAt(o)] >>> 6 - o % 4 * 2, x = n | h;
        e[r >>> 2] |= x << 24 - r % 4 * 8, r += 1;
    }
    return u.create(e, r);
}, tt = {
    stringify (c) {
        let { words: t, sigBytes: s } = c, e = this._map;
        c.clamp();
        let r = [];
        for(let n = 0; n < s; n += 3){
            let h = t[n >>> 2] >>> 24 - n % 4 * 8 & 255, x = t[n + 1 >>> 2] >>> 24 - (n + 1) % 4 * 8 & 255, p = t[n + 2 >>> 2] >>> 24 - (n + 2) % 4 * 8 & 255, _ = h << 16 | x << 8 | p;
            for(let y = 0; y < 4 && n + y * .75 < s; y += 1)r.push(e.charAt(_ >>> 6 * (3 - y) & 63));
        }
        let o = e.charAt(64);
        if (o) for(; r.length % 4;)r.push(o);
        return r.join("");
    },
    parse (c) {
        let t = c.length, s = this._map, e = this._reverseMap;
        if (!e) {
            this._reverseMap = [], e = this._reverseMap;
            for(let o = 0; o < s.length; o += 1)e[s.charCodeAt(o)] = o;
        }
        let r = s.charAt(64);
        if (r) {
            let o = c.indexOf(r);
            o !== -1 && (t = o);
        }
        return zt(c, t, e);
    },
    _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
};
var d = [];
for(let c = 0; c < 64; c += 1)d[c] = Math.abs(Math.sin(c + 1)) * 4294967296 | 0;
var w = (c, t, s, e, r, o, n)=>{
    let h = c + (t & s | ~t & e) + r + n;
    return (h << o | h >>> 32 - o) + t;
}, B = (c, t, s, e, r, o, n)=>{
    let h = c + (t & e | s & ~e) + r + n;
    return (h << o | h >>> 32 - o) + t;
}, k = (c, t, s, e, r, o, n)=>{
    let h = c + (t ^ s ^ e) + r + n;
    return (h << o | h >>> 32 - o) + t;
}, b = (c, t, s, e, r, o, n)=>{
    let h = c + (s ^ (t | ~e)) + r + n;
    return (h << o | h >>> 32 - o) + t;
}, crypto_es_L = class extends crypto_es_H {
    _doReset() {
        this._hash = new u([
            1732584193,
            4023233417,
            2562383102,
            271733878
        ]);
    }
    _doProcessBlock(t, s) {
        let e = t;
        for(let Y = 0; Y < 16; Y += 1){
            let ct = s + Y, G = t[ct];
            e[ct] = (G << 8 | G >>> 24) & 16711935 | (G << 24 | G >>> 8) & 4278255360;
        }
        let r = this._hash.words, o = e[s + 0], n = e[s + 1], h = e[s + 2], x = e[s + 3], p = e[s + 4], _ = e[s + 5], y = e[s + 6], M = e[s + 7], z = e[s + 8], v = e[s + 9], g = e[s + 10], O = e[s + 11], S = e[s + 12], P = e[s + 13], I = e[s + 14], W = e[s + 15], i = r[0], a = r[1], f = r[2], l = r[3];
        i = w(i, a, f, l, o, 7, d[0]), l = w(l, i, a, f, n, 12, d[1]), f = w(f, l, i, a, h, 17, d[2]), a = w(a, f, l, i, x, 22, d[3]), i = w(i, a, f, l, p, 7, d[4]), l = w(l, i, a, f, _, 12, d[5]), f = w(f, l, i, a, y, 17, d[6]), a = w(a, f, l, i, M, 22, d[7]), i = w(i, a, f, l, z, 7, d[8]), l = w(l, i, a, f, v, 12, d[9]), f = w(f, l, i, a, g, 17, d[10]), a = w(a, f, l, i, O, 22, d[11]), i = w(i, a, f, l, S, 7, d[12]), l = w(l, i, a, f, P, 12, d[13]), f = w(f, l, i, a, I, 17, d[14]), a = w(a, f, l, i, W, 22, d[15]), i = B(i, a, f, l, n, 5, d[16]), l = B(l, i, a, f, y, 9, d[17]), f = B(f, l, i, a, O, 14, d[18]), a = B(a, f, l, i, o, 20, d[19]), i = B(i, a, f, l, _, 5, d[20]), l = B(l, i, a, f, g, 9, d[21]), f = B(f, l, i, a, W, 14, d[22]), a = B(a, f, l, i, p, 20, d[23]), i = B(i, a, f, l, v, 5, d[24]), l = B(l, i, a, f, I, 9, d[25]), f = B(f, l, i, a, x, 14, d[26]), a = B(a, f, l, i, z, 20, d[27]), i = B(i, a, f, l, P, 5, d[28]), l = B(l, i, a, f, h, 9, d[29]), f = B(f, l, i, a, M, 14, d[30]), a = B(a, f, l, i, S, 20, d[31]), i = k(i, a, f, l, _, 4, d[32]), l = k(l, i, a, f, z, 11, d[33]), f = k(f, l, i, a, O, 16, d[34]), a = k(a, f, l, i, I, 23, d[35]), i = k(i, a, f, l, n, 4, d[36]), l = k(l, i, a, f, p, 11, d[37]), f = k(f, l, i, a, M, 16, d[38]), a = k(a, f, l, i, g, 23, d[39]), i = k(i, a, f, l, P, 4, d[40]), l = k(l, i, a, f, o, 11, d[41]), f = k(f, l, i, a, x, 16, d[42]), a = k(a, f, l, i, y, 23, d[43]), i = k(i, a, f, l, v, 4, d[44]), l = k(l, i, a, f, S, 11, d[45]), f = k(f, l, i, a, W, 16, d[46]), a = k(a, f, l, i, h, 23, d[47]), i = b(i, a, f, l, o, 6, d[48]), l = b(l, i, a, f, M, 10, d[49]), f = b(f, l, i, a, I, 15, d[50]), a = b(a, f, l, i, _, 21, d[51]), i = b(i, a, f, l, S, 6, d[52]), l = b(l, i, a, f, x, 10, d[53]), f = b(f, l, i, a, g, 15, d[54]), a = b(a, f, l, i, n, 21, d[55]), i = b(i, a, f, l, z, 6, d[56]), l = b(l, i, a, f, W, 10, d[57]), f = b(f, l, i, a, y, 15, d[58]), a = b(a, f, l, i, P, 21, d[59]), i = b(i, a, f, l, p, 6, d[60]), l = b(l, i, a, f, O, 10, d[61]), f = b(f, l, i, a, h, 15, d[62]), a = b(a, f, l, i, v, 21, d[63]), r[0] = r[0] + i | 0, r[1] = r[1] + a | 0, r[2] = r[2] + f | 0, r[3] = r[3] + l | 0;
    }
    _doFinalize() {
        let t = this._data, s = t.words, e = this._nDataBytes * 8, r = t.sigBytes * 8;
        s[r >>> 5] |= 128 << 24 - r % 32;
        let o = Math.floor(e / 4294967296), n = e;
        s[(r + 64 >>> 9 << 4) + 15] = (o << 8 | o >>> 24) & 16711935 | (o << 24 | o >>> 8) & 4278255360, s[(r + 64 >>> 9 << 4) + 14] = (n << 8 | n >>> 24) & 16711935 | (n << 24 | n >>> 8) & 4278255360, t.sigBytes = (s.length + 1) * 4, this._process();
        let h = this._hash, x = h.words;
        for(let p = 0; p < 4; p += 1){
            let _ = x[p];
            x[p] = (_ << 8 | _ >>> 24) & 16711935 | (_ << 24 | _ >>> 8) & 4278255360;
        }
        return h;
    }
    clone() {
        let t = super.clone.call(this);
        return t._hash = this._hash.clone(), t;
    }
}, St = crypto_es_H._createHelper(crypto_es_L), Pt = crypto_es_H._createHmacHelper(crypto_es_L);
var T = class extends m {
    constructor(t){
        super(), this.cfg = Object.assign(new m, {
            keySize: 128 / 32,
            hasher: crypto_es_L,
            iterations: 1
        }, t);
    }
    compute(t, s) {
        let e, { cfg: r } = this, o = r.hasher.create(), n = u.create(), h = n.words, { keySize: x, iterations: p } = r;
        for(; h.length < x;){
            e && o.update(e), e = o.update(t).finalize(s), o.reset();
            for(let _ = 1; _ < p; _ += 1)e = o.finalize(e), o.reset();
            n.concat(e);
        }
        return n.sigBytes = x * 4, n;
    }
};
var C = class extends N {
    constructor(t, s, e){
        super(), this.cfg = Object.assign(new m, e), this._xformMode = t, this._key = s, this.reset();
    }
    static createEncryptor(t, s) {
        return this.create(this._ENC_XFORM_MODE, t, s);
    }
    static createDecryptor(t, s) {
        return this.create(this._DEC_XFORM_MODE, t, s);
    }
    static _createHelper(t) {
        let s = (e)=>typeof e == "string" ? q : E;
        return {
            encrypt (e, r, o) {
                return s(r).encrypt(t, e, r, o);
            },
            decrypt (e, r, o) {
                return s(r).decrypt(t, e, r, o);
            }
        };
    }
    reset() {
        super.reset.call(this), this._doReset();
    }
    process(t) {
        return this._append(t), this._process();
    }
    finalize(t) {
        return t && this._append(t), this._doFinalize();
    }
};
C._ENC_XFORM_MODE = 1;
C._DEC_XFORM_MODE = 2;
C.keySize = 128 / 32;
C.ivSize = 128 / 32;
var et = class extends m {
    constructor(t, s){
        super(), this._cipher = t, this._iv = s;
    }
    static createEncryptor(t, s) {
        return this.Encryptor.create(t, s);
    }
    static createDecryptor(t, s) {
        return this.Decryptor.create(t, s);
    }
};
function yt(c, t, s) {
    let e = c, r, o = this._iv;
    o ? (r = o, this._iv = void 0) : r = this._prevBlock;
    for(let n = 0; n < s; n += 1)e[t + n] ^= r[n];
}
var j = class extends et {
};
j.Encryptor = class extends j {
    processBlock(c, t) {
        let s = this._cipher, { blockSize: e } = s;
        yt.call(this, c, t, e), s.encryptBlock(c, t), this._prevBlock = c.slice(t, t + e);
    }
};
j.Decryptor = class extends j {
    processBlock(c, t) {
        let s = this._cipher, { blockSize: e } = s, r = c.slice(t, t + e);
        s.decryptBlock(c, t), yt.call(this, c, t, e), this._prevBlock = r;
    }
};
var vt = {
    pad (c, t) {
        let s = t * 4, e = s - c.sigBytes % s, r = e << 24 | e << 16 | e << 8 | e, o = [];
        for(let h = 0; h < e; h += 4)o.push(r);
        let n = u.create(o, e);
        c.concat(n);
    },
    unpad (c) {
        let t = c, s = t.words[t.sigBytes - 1 >>> 2] & 255;
        t.sigBytes -= s;
    }
}, crypto_es_U = class extends C {
    constructor(t, s, e){
        super(t, s, Object.assign({
            mode: j,
            padding: vt
        }, e)), this.blockSize = 128 / 32;
    }
    reset() {
        let t;
        super.reset.call(this);
        let { cfg: s } = this, { iv: e, mode: r } = s;
        this._xformMode === this.constructor._ENC_XFORM_MODE ? t = r.createEncryptor : (t = r.createDecryptor, this._minBufferSize = 1), this._mode = t.call(r, this, e && e.words), this._mode.__creator = t;
    }
    _doProcessBlock(t, s) {
        this._mode.processBlock(t, s);
    }
    _doFinalize() {
        let t, { padding: s } = this.cfg;
        return this._xformMode === this.constructor._ENC_XFORM_MODE ? (s.pad(this._data, this.blockSize), t = this._process(!0)) : (t = this._process(!0), s.unpad(t)), t;
    }
}, V = class extends m {
    constructor(t){
        super(), this.mixIn(t);
    }
    toString(t) {
        return (t || this.formatter).stringify(this);
    }
}, Rt = {
    stringify (c) {
        let t, { ciphertext: s, salt: e } = c;
        return e ? t = u.create([
            1398893684,
            1701076831
        ]).concat(e).concat(s) : t = s, t.toString(tt);
    },
    parse (c) {
        let t, s = tt.parse(c), e = s.words;
        return e[0] === 1398893684 && e[1] === 1701076831 && (t = u.create(e.slice(2, 4)), e.splice(0, 4), s.sigBytes -= 16), V.create({
            ciphertext: s,
            salt: t
        });
    }
}, E = class extends m {
    static encrypt(t, s, e, r) {
        let o = Object.assign(new m, this.cfg, r), n = t.createEncryptor(e, o), h = n.finalize(s), x = n.cfg;
        return V.create({
            ciphertext: h,
            key: e,
            iv: x.iv,
            algorithm: t,
            mode: x.mode,
            padding: x.padding,
            blockSize: n.blockSize,
            formatter: o.format
        });
    }
    static decrypt(t, s, e, r) {
        let o = s, n = Object.assign(new m, this.cfg, r);
        return o = this._parse(o, n.format), t.createDecryptor(e, n).finalize(o.ciphertext);
    }
    static _parse(t, s) {
        return typeof t == "string" ? s.parse(t, this) : t;
    }
};
E.cfg = Object.assign(new m, {
    format: Rt
});
var Ft = {
    execute (c, t, s, e, r) {
        let o = e;
        o || (o = u.random(64 / 8));
        let n;
        r ? n = T.create({
            keySize: t + s,
            hasher: r
        }).compute(c, o) : n = T.create({
            keySize: t + s
        }).compute(c, o);
        let h = u.create(n.words.slice(t), s * 4);
        return n.sigBytes = t * 4, V.create({
            key: n,
            iv: h,
            salt: o
        });
    }
}, q = class extends E {
    static encrypt(t, s, e, r) {
        let o = Object.assign(new m, this.cfg, r), n = o.kdf.execute(e, t.keySize, t.ivSize, o.salt, o.hasher);
        o.iv = n.iv;
        let h = E.encrypt.call(this, t, s, n.key, o);
        return h.mixIn(n), h;
    }
    static decrypt(t, s, e, r) {
        let o = s, n = Object.assign(new m, this.cfg, r);
        o = this._parse(o, n.format);
        let h = n.kdf.execute(e, t.keySize, t.ivSize, o.salt, n.hasher);
        return n.iv = h.iv, E.decrypt.call(this, t, o, h.key, n);
    }
};
q.cfg = Object.assign(E.cfg, {
    kdf: Ft
});
var R = [], ut = [], gt = [], mt = [], wt = [], Bt = [], st = [], rt = [], ot = [], nt = [], A = [];
for(let c = 0; c < 256; c += 1)c < 128 ? A[c] = c << 1 : A[c] = c << 1 ^ 283;
var crypto_es_F = 0, crypto_es_D = 0;
for(let c = 0; c < 256; c += 1){
    let t = crypto_es_D ^ crypto_es_D << 1 ^ crypto_es_D << 2 ^ crypto_es_D << 3 ^ crypto_es_D << 4;
    t = t >>> 8 ^ t & 255 ^ 99, R[crypto_es_F] = t, ut[t] = crypto_es_F;
    let s = A[crypto_es_F], e = A[s], r = A[e], o = A[t] * 257 ^ t * 16843008;
    gt[crypto_es_F] = o << 24 | o >>> 8, mt[crypto_es_F] = o << 16 | o >>> 16, wt[crypto_es_F] = o << 8 | o >>> 24, Bt[crypto_es_F] = o, o = r * 16843009 ^ e * 65537 ^ s * 257 ^ crypto_es_F * 16843008, st[t] = o << 24 | o >>> 8, rt[t] = o << 16 | o >>> 16, ot[t] = o << 8 | o >>> 24, nt[t] = o, crypto_es_F ? (crypto_es_F = s ^ A[A[A[r ^ s]]], crypto_es_D ^= A[A[crypto_es_D]]) : (crypto_es_D = 1, crypto_es_F = crypto_es_D);
}
var At = [
    0,
    1,
    2,
    4,
    8,
    16,
    32,
    64,
    128,
    27,
    54
], J = class extends crypto_es_U {
    _doReset() {
        let t;
        if (this._nRounds && this._keyPriorReset === this._key) return;
        this._keyPriorReset = this._key;
        let s = this._keyPriorReset, e = s.words, r = s.sigBytes / 4;
        this._nRounds = r + 6;
        let n = (this._nRounds + 1) * 4;
        this._keySchedule = [];
        let h = this._keySchedule;
        for(let p = 0; p < n; p += 1)p < r ? h[p] = e[p] : (t = h[p - 1], p % r ? r > 6 && p % r === 4 && (t = R[t >>> 24] << 24 | R[t >>> 16 & 255] << 16 | R[t >>> 8 & 255] << 8 | R[t & 255]) : (t = t << 8 | t >>> 24, t = R[t >>> 24] << 24 | R[t >>> 16 & 255] << 16 | R[t >>> 8 & 255] << 8 | R[t & 255], t ^= At[p / r | 0] << 24), h[p] = h[p - r] ^ t);
        this._invKeySchedule = [];
        let x = this._invKeySchedule;
        for(let p = 0; p < n; p += 1){
            let _ = n - p;
            p % 4 ? t = h[_] : t = h[_ - 4], p < 4 || _ <= 4 ? x[p] = t : x[p] = st[R[t >>> 24]] ^ rt[R[t >>> 16 & 255]] ^ ot[R[t >>> 8 & 255]] ^ nt[R[t & 255]];
        }
    }
    encryptBlock(t, s) {
        this._doCryptBlock(t, s, this._keySchedule, gt, mt, wt, Bt, R);
    }
    decryptBlock(t, s) {
        let e = t, r = e[s + 1];
        e[s + 1] = e[s + 3], e[s + 3] = r, this._doCryptBlock(e, s, this._invKeySchedule, st, rt, ot, nt, ut), r = e[s + 1], e[s + 1] = e[s + 3], e[s + 3] = r;
    }
    _doCryptBlock(t, s, e, r, o, n, h, x) {
        let p = t, _ = this._nRounds, y = p[s] ^ e[0], M = p[s + 1] ^ e[1], z = p[s + 2] ^ e[2], v = p[s + 3] ^ e[3], g = 4;
        for(let W = 1; W < _; W += 1){
            let i = r[y >>> 24] ^ o[M >>> 16 & 255] ^ n[z >>> 8 & 255] ^ h[v & 255] ^ e[g];
            g += 1;
            let a = r[M >>> 24] ^ o[z >>> 16 & 255] ^ n[v >>> 8 & 255] ^ h[y & 255] ^ e[g];
            g += 1;
            let f = r[z >>> 24] ^ o[v >>> 16 & 255] ^ n[y >>> 8 & 255] ^ h[M & 255] ^ e[g];
            g += 1;
            let l = r[v >>> 24] ^ o[y >>> 16 & 255] ^ n[M >>> 8 & 255] ^ h[z & 255] ^ e[g];
            g += 1, y = i, M = a, z = f, v = l;
        }
        let O = (x[y >>> 24] << 24 | x[M >>> 16 & 255] << 16 | x[z >>> 8 & 255] << 8 | x[v & 255]) ^ e[g];
        g += 1;
        let S = (x[M >>> 24] << 24 | x[z >>> 16 & 255] << 16 | x[v >>> 8 & 255] << 8 | x[y & 255]) ^ e[g];
        g += 1;
        let P = (x[z >>> 24] << 24 | x[v >>> 16 & 255] << 16 | x[y >>> 8 & 255] << 8 | x[M & 255]) ^ e[g];
        g += 1;
        let I = (x[v >>> 24] << 24 | x[y >>> 16 & 255] << 16 | x[M >>> 8 & 255] << 8 | x[z & 255]) ^ e[g];
        g += 1, p[s] = O, p[s + 1] = S, p[s + 2] = P, p[s + 3] = I;
    }
};
J.keySize = 256 / 32;
var Ht = crypto_es_U._createHelper(J);
var K = (/* unused pure expression or super */ null && ([])), Q = class extends (/* unused pure expression or super */ null && (crypto_es_H)) {
    _doReset() {
        this._hash = new u([
            1732584193,
            4023233417,
            2562383102,
            271733878,
            3285377520
        ]);
    }
    _doProcessBlock(t, s) {
        let e = this._hash.words, r = e[0], o = e[1], n = e[2], h = e[3], x = e[4];
        for(let p = 0; p < 80; p += 1){
            if (p < 16) K[p] = t[s + p] | 0;
            else {
                let y = K[p - 3] ^ K[p - 8] ^ K[p - 14] ^ K[p - 16];
                K[p] = y << 1 | y >>> 31;
            }
            let _ = (r << 5 | r >>> 27) + x + K[p];
            p < 20 ? _ += (o & n | ~o & h) + 1518500249 : p < 40 ? _ += (o ^ n ^ h) + 1859775393 : p < 60 ? _ += (o & n | o & h | n & h) - 1894007588 : _ += (o ^ n ^ h) - 899497514, x = h, h = n, n = o << 30 | o >>> 2, o = r, r = _;
        }
        e[0] = e[0] + r | 0, e[1] = e[1] + o | 0, e[2] = e[2] + n | 0, e[3] = e[3] + h | 0, e[4] = e[4] + x | 0;
    }
    _doFinalize() {
        let t = this._data, s = t.words, e = this._nDataBytes * 8, r = t.sigBytes * 8;
        return s[r >>> 5] |= 128 << 24 - r % 32, s[(r + 64 >>> 9 << 4) + 14] = Math.floor(e / 4294967296), s[(r + 64 >>> 9 << 4) + 15] = e, t.sigBytes = s.length * 4, this._process(), this._hash;
    }
    clone() {
        let t = super.clone.call(this);
        return t._hash = this._hash.clone(), t;
    }
}, Xt = crypto_es_H._createHelper(Q), Dt = crypto_es_H._createHmacHelper(Q);


;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/errors.js

const missingDomainAndProxy = `
Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl.

1) With middleware
   e.g. export default clerkMiddleware({domain:'YOUR_DOMAIN',isSatellite:true});
2) With environment variables e.g.
   NEXT_PUBLIC_CLERK_DOMAIN='YOUR_DOMAIN'
   NEXT_PUBLIC_CLERK_IS_SATELLITE='true'
   `;
const missingSignInUrlInDev = `
Invalid signInUrl. A satellite application requires a signInUrl for development instances.
Check if signInUrl is missing from your configuration or if it is not an absolute URL

1) With middleware
   e.g. export default clerkMiddleware({signInUrl:'SOME_URL', isSatellite:true});
2) With environment variables e.g.
   NEXT_PUBLIC_CLERK_SIGN_IN_URL='SOME_URL'
   NEXT_PUBLIC_CLERK_IS_SATELLITE='true'`;
const getAuthAuthHeaderMissing = ()=>authAuthHeaderMissing("getAuth");
const authAuthHeaderMissing = (helperName = "auth", prefixSteps)=>`Clerk: ${helperName}() was called but Clerk can't detect usage of clerkMiddleware(). Please ensure the following:
- ${prefixSteps ? [
        ...prefixSteps,
        ""
    ].join("\n- ") : " "}clerkMiddleware() is used in your Next.js Middleware.
- Your Middleware matcher is configured to match this route or page.
- If you are using the src directory, make sure the Middleware file is inside of it.

For more details, see https://clerk.com/err/auth-middleware
`;
const errors_authSignatureInvalid = (/* unused pure expression or super */ null && (`Clerk: Unable to verify request, this usually means the Clerk middleware did not run. Ensure Clerk's middleware is properly integrated and matches the current route. For more information, see: https://clerk.com/docs/reference/nextjs/clerk-middleware. (code=auth_signature_invalid)`));
const encryptionKeyInvalid = `Clerk: Unable to decrypt request data, this usually means the encryption key is invalid. Ensure the encryption key is properly set. For more information, see: https://clerk.com/docs/reference/nextjs/clerk-middleware#dynamic-keys. (code=encryption_key_invalid)`;
const encryptionKeyInvalidDev = `Clerk: Unable to decrypt request data.

Refresh the page if your .env file was just updated. If the issue persists, ensure the encryption key is valid and properly set.

For more information, see: https://clerk.com/docs/reference/nextjs/clerk-middleware#dynamic-keys. (code=encryption_key_invalid)`;
 //# sourceMappingURL=errors.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/errorThrower.js


const errorThrower_errorThrower = buildErrorThrower({
    packageName: "@clerk/nextjs"
});
 //# sourceMappingURL=errorThrower.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/utils.js














const OVERRIDE_HEADERS = "x-middleware-override-headers";
const MIDDLEWARE_HEADER_PREFIX = "x-middleware-request";
const setRequestHeadersOnNextResponse = (res, req, newHeaders)=>{
    if (!res.headers.get(OVERRIDE_HEADERS)) {
        res.headers.set(OVERRIDE_HEADERS, [
            ...req.headers.keys()
        ]);
        req.headers.forEach((val, key)=>{
            res.headers.set(`${MIDDLEWARE_HEADER_PREFIX}-${key}`, val);
        });
    }
    Object.entries(newHeaders).forEach(([key, val])=>{
        res.headers.set(OVERRIDE_HEADERS, `${res.headers.get(OVERRIDE_HEADERS)},${key}`);
        res.headers.set(`${MIDDLEWARE_HEADER_PREFIX}-${key}`, val);
    });
};
function decorateRequest(req, res, requestState, requestData, keylessMode, machineAuthObject) {
    const { reason, message, status, token } = requestState;
    if (!res) {
        res = NextResponse.next();
    }
    if (res.headers.get(constants_constants.Headers.NextRedirect)) {
        return res;
    }
    let rewriteURL;
    if (res.headers.get(constants_constants.Headers.NextResume) === "1") {
        res.headers.delete(constants_constants.Headers.NextResume);
        rewriteURL = new URL(req.url);
    }
    const rewriteURLHeader = res.headers.get(constants_constants.Headers.NextRewrite);
    if (rewriteURLHeader) {
        const reqURL = new URL(req.url);
        rewriteURL = new URL(rewriteURLHeader);
        if (rewriteURL.origin !== reqURL.origin) {
            return res;
        }
    }
    if (rewriteURL) {
        const clerkRequestData = encryptClerkRequestData(requestData, keylessMode, machineAuthObject);
        setRequestHeadersOnNextResponse(res, req, {
            [chunk_I24FT6SE_constants.Headers.AuthStatus]: status,
            [chunk_I24FT6SE_constants.Headers.AuthToken]: token || "",
            [chunk_I24FT6SE_constants.Headers.AuthSignature]: token ? createTokenSignature(token, (requestData == null ? void 0 : requestData.secretKey) || SECRET_KEY || keylessMode.secretKey || "") : "",
            [chunk_I24FT6SE_constants.Headers.AuthMessage]: message || "",
            [chunk_I24FT6SE_constants.Headers.AuthReason]: reason || "",
            [chunk_I24FT6SE_constants.Headers.ClerkUrl]: req.clerkUrl.toString(),
            ...clerkRequestData ? {
                [chunk_I24FT6SE_constants.Headers.ClerkRequestData]: clerkRequestData
            } : {}
        });
        res.headers.set(constants_constants.Headers.NextRewrite, rewriteURL.href);
    }
    return res;
}
const handleMultiDomainAndProxy = (clerkRequest, opts)=>{
    const relativeOrAbsoluteProxyUrl = handleValueOrFn(opts == null ? void 0 : opts.proxyUrl, clerkRequest.clerkUrl, PROXY_URL);
    let proxyUrl;
    if (!!relativeOrAbsoluteProxyUrl && !isHttpOrHttps(relativeOrAbsoluteProxyUrl)) {
        proxyUrl = new URL(relativeOrAbsoluteProxyUrl, clerkRequest.clerkUrl).toString();
    } else {
        proxyUrl = relativeOrAbsoluteProxyUrl;
    }
    const isSatellite = handleValueOrFn(opts.isSatellite, new URL(clerkRequest.url), IS_SATELLITE);
    const domain = handleValueOrFn(opts.domain, new URL(clerkRequest.url), DOMAIN);
    const signInUrl = (opts == null ? void 0 : opts.signInUrl) || SIGN_IN_URL;
    if (isSatellite && !proxyUrl && !domain) {
        throw new Error(missingDomainAndProxy);
    }
    if (isSatellite && !isHttpOrHttps(signInUrl) && isDevelopmentFromSecretKey(opts.secretKey || SECRET_KEY)) {
        throw new Error(missingSignInUrlInDev);
    }
    return {
        proxyUrl,
        isSatellite,
        domain,
        signInUrl
    };
};
const redirectAdapter = (url)=>{
    return NextResponse.redirect(url, {
        headers: {
            [chunk_I24FT6SE_constants.Headers.ClerkRedirectTo]: "true"
        }
    });
};
function assertAuthStatus(req, error) {
    if (!detectClerkMiddleware(req)) {
        throw new Error(error);
    }
}
function assertKey(key, onError) {
    if (!key) {
        onError();
    }
    return key;
}
function createTokenSignature(token, key) {
    return Dt(token, key).toString();
}
function assertTokenSignature(token, key, signature) {
    if (!signature) {
        throw new Error(authSignatureInvalid);
    }
    const expectedSignature = createTokenSignature(token, key);
    if (expectedSignature !== signature) {
        throw new Error(authSignatureInvalid);
    }
}
const KEYLESS_ENCRYPTION_KEY = "clerk_keyless_dummy_key";
function encryptClerkRequestData(requestData, keylessModeKeys, machineAuthObject) {
    const isEmpty = (obj)=>{
        if (!obj) {
            return true;
        }
        return !Object.values(obj).some((v)=>v !== void 0);
    };
    if (isEmpty(requestData) && isEmpty(keylessModeKeys) && !machineAuthObject) {
        return;
    }
    if (requestData.secretKey && !ENCRYPTION_KEY) {
        logger.warnOnce("Clerk: Missing `CLERK_ENCRYPTION_KEY`. Required for propagating `secretKey` middleware option. See docs: https://clerk.com/docs/reference/nextjs/clerk-middleware#dynamic-keys");
        return;
    }
    const maybeKeylessEncryptionKey = isProductionEnvironment() ? ENCRYPTION_KEY || assertKey(SECRET_KEY, ()=>errorThrower_errorThrower.throwMissingSecretKeyError()) : ENCRYPTION_KEY || SECRET_KEY || KEYLESS_ENCRYPTION_KEY;
    return Ht.encrypt(JSON.stringify({
        ...keylessModeKeys,
        ...requestData,
        machineAuthObject: machineAuthObject != null ? machineAuthObject : void 0
    }), maybeKeylessEncryptionKey).toString();
}
function decryptClerkRequestData(encryptedRequestData) {
    if (!encryptedRequestData) {
        return {};
    }
    const maybeKeylessEncryptionKey = isProductionEnvironment() ? ENCRYPTION_KEY || SECRET_KEY : ENCRYPTION_KEY || SECRET_KEY || KEYLESS_ENCRYPTION_KEY;
    try {
        return decryptData(encryptedRequestData, maybeKeylessEncryptionKey);
    } catch  {
        if (canUseKeyless) {
            try {
                return decryptData(encryptedRequestData, KEYLESS_ENCRYPTION_KEY);
            } catch  {
                throwInvalidEncryptionKey();
            }
        }
        throwInvalidEncryptionKey();
    }
}
function throwInvalidEncryptionKey() {
    if (isProductionEnvironment()) {
        throw new Error(encryptionKeyInvalid);
    }
    throw new Error(encryptionKeyInvalidDev);
}
function decryptData(data, key) {
    const decryptedBytes = Ht.decrypt(data, key);
    const encoded = decryptedBytes.toString(X);
    return JSON.parse(encoded);
}
 //# sourceMappingURL=utils.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/clerkClient.js







const clerkClient = async ()=>{
    var _a, _b;
    let requestData;
    try {
        const request = await buildRequestLike();
        const encryptedRequestData = getHeader(request, chunk_I24FT6SE_constants.Headers.ClerkRequestData);
        requestData = decryptClerkRequestData(encryptedRequestData);
    } catch (err) {
        if (err && isPrerenderingBailout(err)) {
            throw err;
        }
    }
    const options = (_b = (_a = clerkMiddlewareRequestDataStorage.getStore()) == null ? void 0 : _a.get("requestData")) != null ? _b : requestData;
    if ((options == null ? void 0 : options.secretKey) || (options == null ? void 0 : options.publishableKey)) {
        return createClerkClientWithOptions(options);
    }
    return createClerkClientWithOptions({});
};
 //# sourceMappingURL=clerkClient.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/content-security-policy.js


class ContentSecurityPolicyDirectiveManager {
    /**
   * Creates a new ContentSecurityPolicyDirectiveSet with default values
   * @returns A new ContentSecurityPolicyDirectiveSet with default values
   */ static createDefaultDirectives() {
        return Object.entries(this.DEFAULT_DIRECTIVES).reduce((acc, [key, values])=>{
            acc[key] = new Set(values);
            return acc;
        }, {});
    }
    /**
   * Checks if a value is a special keyword that requires quoting
   * @param value - The value to check
   * @returns True if the value is a special keyword
   */ static isKeyword(value) {
        return this.KEYWORDS.has(value.replace(/^'|'$/g, ""));
    }
    /**
   * Formats a value according to CSP rules, adding quotes for special keywords
   * @param value - The value to format
   * @returns The formatted value
   */ static formatValue(value) {
        const unquoted = value.replace(/^'|'$/g, "");
        return this.isKeyword(unquoted) ? `'${unquoted}'` : value;
    }
    /**
   * Handles directive values, ensuring proper formatting and special case handling
   * @param values - Array of values to process
   * @returns Set of formatted values
   */ static handleDirectiveValues(values) {
        const result = /* @__PURE__ */ new Set();
        if (values.includes("'none'") || values.includes("none")) {
            result.add("'none'");
            return result;
        }
        values.forEach((v)=>result.add(this.formatValue(v)));
        return result;
    }
}
/** Set of special keywords that require quoting in CSP directives */ ContentSecurityPolicyDirectiveManager.KEYWORDS = /* @__PURE__ */ new Set([
    "none",
    "self",
    "strict-dynamic",
    "unsafe-eval",
    "unsafe-hashes",
    "unsafe-inline"
]);
/** Default CSP directives and their values */ ContentSecurityPolicyDirectiveManager.DEFAULT_DIRECTIVES = {
    "connect-src": [
        "self",
        "https://clerk-telemetry.com",
        "https://*.clerk-telemetry.com",
        "https://api.stripe.com",
        "https://maps.googleapis.com"
    ],
    "default-src": [
        "self"
    ],
    "form-action": [
        "self"
    ],
    "frame-src": [
        "self",
        "https://challenges.cloudflare.com",
        "https://*.js.stripe.com",
        "https://js.stripe.com",
        "https://hooks.stripe.com"
    ],
    "img-src": [
        "self",
        "https://img.clerk.com"
    ],
    "script-src": [
        "self",
        ... false ? 0 : [],
        "unsafe-inline",
        "https:",
        "http:",
        "https://*.js.stripe.com",
        "https://js.stripe.com",
        "https://maps.googleapis.com"
    ],
    "style-src": [
        "self",
        "unsafe-inline"
    ],
    "worker-src": [
        "self",
        "blob:"
    ]
};
function handleExistingDirective(mergedCSP, key, values) {
    if (values.includes("'none'") || values.includes("none")) {
        mergedCSP[key] = /* @__PURE__ */ new Set([
            "'none'"
        ]);
        return;
    }
    const deduplicatedSet = /* @__PURE__ */ new Set();
    mergedCSP[key].forEach((value)=>{
        deduplicatedSet.add(ContentSecurityPolicyDirectiveManager.formatValue(value));
    });
    values.forEach((value)=>{
        deduplicatedSet.add(ContentSecurityPolicyDirectiveManager.formatValue(value));
    });
    mergedCSP[key] = deduplicatedSet;
}
function handleCustomDirective(customDirectives, key, values) {
    if (values.includes("'none'") || values.includes("none")) {
        customDirectives.set(key, /* @__PURE__ */ new Set([
            "'none'"
        ]));
        return;
    }
    const formattedValues = /* @__PURE__ */ new Set();
    values.forEach((value)=>{
        const formattedValue = ContentSecurityPolicyDirectiveManager.formatValue(value);
        formattedValues.add(formattedValue);
    });
    customDirectives.set(key, formattedValues);
}
function formatCSPHeader(mergedCSP) {
    return Object.entries(mergedCSP).sort(([a], [b])=>a.localeCompare(b)).map(([key, values])=>{
        const valueObjs = Array.from(values).map((v)=>({
                raw: v,
                formatted: ContentSecurityPolicyDirectiveManager.formatValue(v)
            }));
        return `${key} ${valueObjs.map((item)=>item.formatted).join(" ")}`;
    }).join("; ");
}
function generateNonce() {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const binaryString = Array.from(randomBytes, (byte)=>String.fromCharCode(byte)).join("");
    return btoa(binaryString);
}
function buildContentSecurityPolicyDirectives(strict, host, customDirectives, nonce) {
    const directives = Object.entries(ContentSecurityPolicyDirectiveManager.DEFAULT_DIRECTIVES).reduce((acc, [key, values])=>{
        acc[key] = new Set(values);
        return acc;
    }, {});
    directives["connect-src"].add(host);
    if (strict) {
        directives["script-src"].delete("http:");
        directives["script-src"].delete("https:");
        directives["script-src"].add("'strict-dynamic'");
        if (nonce) {
            directives["script-src"].add(`'nonce-${nonce}'`);
        }
    }
    if (customDirectives) {
        const customDirectivesMap = /* @__PURE__ */ new Map();
        Object.entries(customDirectives).forEach(([key, values])=>{
            const valuesArray = Array.isArray(values) ? values : [
                values
            ];
            if (ContentSecurityPolicyDirectiveManager.DEFAULT_DIRECTIVES[key]) {
                handleExistingDirective(directives, key, valuesArray);
            } else {
                handleCustomDirective(customDirectivesMap, key, valuesArray);
            }
        });
        customDirectivesMap.forEach((values, key)=>{
            directives[key] = values;
        });
    }
    return formatCSPHeader(directives);
}
function createContentSecurityPolicyHeaders(host, options) {
    var _a;
    const headers = [];
    const nonce = options.strict ? generateNonce() : void 0;
    let cspHeader = buildContentSecurityPolicyDirectives((_a = options.strict) != null ? _a : false, host, options.directives, nonce);
    if (options.reportTo) {
        cspHeader += "; report-to csp-endpoint";
        headers.push([
            chunk_I24FT6SE_constants.Headers.ReportingEndpoints,
            `csp-endpoint="${options.reportTo}"`
        ]);
    }
    if (options.reportOnly) {
        headers.push([
            chunk_I24FT6SE_constants.Headers.ContentSecurityPolicyReportOnly,
            cspHeader
        ]);
    } else {
        headers.push([
            chunk_I24FT6SE_constants.Headers.ContentSecurityPolicy,
            cspHeader
        ]);
    }
    if (nonce) {
        headers.push([
            chunk_I24FT6SE_constants.Headers.Nonce,
            nonce
        ]);
    }
    return {
        headers
    };
}
 //# sourceMappingURL=content-security-policy.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/keyless.js


const keylessCookiePrefix = `__clerk_keys_`;
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b)=>b.toString(16).padStart(2, "0")).join("");
    return hashHex.slice(0, 16);
}
async function getKeylessCookieName() {
    const PATH = process.env.PWD;
    if (!PATH) {
        return `${keylessCookiePrefix}${0}`;
    }
    const lastThreeDirs = PATH.split("/").filter(Boolean).slice(-3).reverse().join("/");
    const hash = await hashString(lastThreeDirs);
    return `${keylessCookiePrefix}${hash}`;
}
async function getKeylessCookieValue(getter) {
    if (!canUseKeyless) {
        return void 0;
    }
    const keylessCookieName = await getKeylessCookieName();
    let keyless;
    try {
        if (keylessCookieName) {
            keyless = JSON.parse(getter(keylessCookieName) || "{}");
        }
    } catch  {
        keyless = void 0;
    }
    return keyless;
}
 //# sourceMappingURL=keyless.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/nextErrors.js

const CONTROL_FLOW_ERROR = {
    REDIRECT_TO_URL: "CLERK_PROTECT_REDIRECT_TO_URL",
    REDIRECT_TO_SIGN_IN: "CLERK_PROTECT_REDIRECT_TO_SIGN_IN",
    REDIRECT_TO_SIGN_UP: "CLERK_PROTECT_REDIRECT_TO_SIGN_UP"
};
const LEGACY_NOT_FOUND_ERROR_CODE = "NEXT_NOT_FOUND";
function isLegacyNextjsNotFoundError(error) {
    if (typeof error !== "object" || error === null || !("digest" in error)) {
        return false;
    }
    return error.digest === LEGACY_NOT_FOUND_ERROR_CODE;
}
const HTTPAccessErrorStatusCodes = {
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401
};
const ALLOWED_CODES = new Set(Object.values(HTTPAccessErrorStatusCodes));
const HTTP_ERROR_FALLBACK_ERROR_CODE = "NEXT_HTTP_ERROR_FALLBACK";
function isHTTPAccessFallbackError(error) {
    if (typeof error !== "object" || error === null || !("digest" in error) || typeof error.digest !== "string") {
        return false;
    }
    const [prefix, httpStatus] = error.digest.split(";");
    return prefix === HTTP_ERROR_FALLBACK_ERROR_CODE && ALLOWED_CODES.has(Number(httpStatus));
}
function whichHTTPAccessFallbackError(error) {
    if (!isHTTPAccessFallbackError(error)) {
        return void 0;
    }
    const [, httpStatus] = error.digest.split(";");
    return Number(httpStatus);
}
function isNextjsNotFoundError(error) {
    return isLegacyNextjsNotFoundError(error) || // Checks for the error thrown from `notFound()` for canary versions of next@15
    whichHTTPAccessFallbackError(error) === HTTPAccessErrorStatusCodes.NOT_FOUND;
}
const nextErrors_REDIRECT_ERROR_CODE = "NEXT_REDIRECT";
function nextjsRedirectError(url, extra, type = "replace", statusCode = 307) {
    const error = new Error(nextErrors_REDIRECT_ERROR_CODE);
    error.digest = `${nextErrors_REDIRECT_ERROR_CODE};${type};${url};${statusCode};`;
    error.clerk_digest = CONTROL_FLOW_ERROR.REDIRECT_TO_URL;
    Object.assign(error, extra);
    throw error;
}
function buildReturnBackUrl(url, returnBackUrl) {
    return returnBackUrl === null ? "" : returnBackUrl || url;
}
function redirectToSignInError(url, returnBackUrl) {
    nextjsRedirectError(url, {
        clerk_digest: CONTROL_FLOW_ERROR.REDIRECT_TO_SIGN_IN,
        returnBackUrl: buildReturnBackUrl(url, returnBackUrl)
    });
}
function redirectToSignUpError(url, returnBackUrl) {
    nextjsRedirectError(url, {
        clerk_digest: CONTROL_FLOW_ERROR.REDIRECT_TO_SIGN_UP,
        returnBackUrl: buildReturnBackUrl(url, returnBackUrl)
    });
}
function isNextjsRedirectError(error) {
    if (typeof error !== "object" || error === null || !("digest" in error) || typeof error.digest !== "string") {
        return false;
    }
    const digest = error.digest.split(";");
    const [errorCode, type] = digest;
    const destination = digest.slice(2, -2).join(";");
    const status = digest.at(-2);
    const statusCode = Number(status);
    return errorCode === nextErrors_REDIRECT_ERROR_CODE && (type === "replace" || type === "push") && typeof destination === "string" && !isNaN(statusCode) && statusCode === 307;
}
function isRedirectToSignInError(error) {
    if (isNextjsRedirectError(error) && "clerk_digest" in error) {
        return error.clerk_digest === CONTROL_FLOW_ERROR.REDIRECT_TO_SIGN_IN;
    }
    return false;
}
function isRedirectToSignUpError(error) {
    if (isNextjsRedirectError(error) && "clerk_digest" in error) {
        return error.clerk_digest === CONTROL_FLOW_ERROR.REDIRECT_TO_SIGN_UP;
    }
    return false;
}
function isNextjsUnauthorizedError(error) {
    return whichHTTPAccessFallbackError(error) === HTTPAccessErrorStatusCodes.UNAUTHORIZED;
}
function unauthorized() {
    const error = new Error(HTTP_ERROR_FALLBACK_ERROR_CODE);
    error.digest = `${HTTP_ERROR_FALLBACK_ERROR_CODE};${HTTPAccessErrorStatusCodes.UNAUTHORIZED}`;
    throw error;
}
 //# sourceMappingURL=nextErrors.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/nextFetcher.js

function isNextFetcher(fetch) {
    return "__nextPatched" in fetch && fetch.__nextPatched === true;
}
 //# sourceMappingURL=nextFetcher.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/protect.js




function createProtect(opts) {
    const { redirectToSignIn, authObject, redirect, notFound, request, unauthorized } = opts;
    return async (...args)=>{
        var _a, _b, _c, _d, _e, _f;
        const paramsOrFunction = getAuthorizationParams(args[0]);
        const unauthenticatedUrl = ((_a = args[0]) == null ? void 0 : _a.unauthenticatedUrl) || ((_b = args[1]) == null ? void 0 : _b.unauthenticatedUrl);
        const unauthorizedUrl = ((_c = args[0]) == null ? void 0 : _c.unauthorizedUrl) || ((_d = args[1]) == null ? void 0 : _d.unauthorizedUrl);
        const requestedToken = ((_e = args[0]) == null ? void 0 : _e.token) || ((_f = args[1]) == null ? void 0 : _f.token) || TokenType.SessionToken;
        const handleUnauthenticated = ()=>{
            if (unauthenticatedUrl) {
                return redirect(unauthenticatedUrl);
            }
            if (isPageRequest(request)) {
                return redirectToSignIn();
            }
            return notFound();
        };
        const handleUnauthorized = ()=>{
            if (authObject.tokenType !== TokenType.SessionToken) {
                return unauthorized();
            }
            if (unauthorizedUrl) {
                return redirect(unauthorizedUrl);
            }
            return notFound();
        };
        if (!isTokenTypeAccepted(authObject.tokenType, requestedToken)) {
            return handleUnauthorized();
        }
        if (authObject.tokenType !== TokenType.SessionToken) {
            if (!authObject.isAuthenticated) {
                return handleUnauthorized();
            }
            return authObject;
        }
        if (authObject.sessionStatus === "pending") {
            return handleUnauthenticated();
        }
        if (!authObject.userId) {
            return handleUnauthenticated();
        }
        if (!paramsOrFunction) {
            return authObject;
        }
        if (typeof paramsOrFunction === "function") {
            if (paramsOrFunction(authObject.has)) {
                return authObject;
            }
            return handleUnauthorized();
        }
        if (authObject.has(paramsOrFunction)) {
            return authObject;
        }
        return handleUnauthorized();
    };
}
const getAuthorizationParams = (arg)=>{
    if (!arg) {
        return void 0;
    }
    if (arg.unauthenticatedUrl || arg.unauthorizedUrl || arg.token) {
        return void 0;
    }
    if (Object.keys(arg).length === 1 && "token" in arg) {
        return void 0;
    }
    return arg;
};
const isServerActionRequest = (req)=>{
    var _a, _b;
    return !!req.headers.get(constants_constants.Headers.NextUrl) && (((_a = req.headers.get(chunk_I24FT6SE_constants.Headers.Accept)) == null ? void 0 : _a.includes("text/x-component")) || ((_b = req.headers.get(chunk_I24FT6SE_constants.Headers.ContentType)) == null ? void 0 : _b.includes("multipart/form-data")) || !!req.headers.get(constants_constants.Headers.NextAction));
};
const isPageRequest = (req)=>{
    var _a;
    return req.headers.get(chunk_I24FT6SE_constants.Headers.SecFetchDest) === "document" || req.headers.get(chunk_I24FT6SE_constants.Headers.SecFetchDest) === "iframe" || ((_a = req.headers.get(chunk_I24FT6SE_constants.Headers.Accept)) == null ? void 0 : _a.includes("text/html")) || isAppRouterInternalNavigation(req) || isPagesRouterInternalNavigation(req);
};
const isAppRouterInternalNavigation = (req)=>!!req.headers.get(constants_constants.Headers.NextUrl) && !isServerActionRequest(req) || isPagePathAvailable();
const isPagePathAvailable = ()=>{
    const __fetch = globalThis.fetch;
    if (!isNextFetcher(__fetch)) {
        return false;
    }
    const { page, pagePath } = __fetch.__nextGetStaticStore().getStore() || {};
    return Boolean(// available on next@14
    pagePath || // available on next@15
    page);
};
const isPagesRouterInternalNavigation = (req)=>!!req.headers.get(constants_constants.Headers.NextjsData);
 //# sourceMappingURL=protect.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@clerk+nextjs@6.35.4_next@1_83e514640d7998c09f57119951286ff1/node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js


















const clerkMiddleware = (...args)=>{
    const [request, event] = parseRequestAndEvent(args);
    const [handler, params] = parseHandlerAndOptions(args);
    const middleware = clerkMiddlewareRequestDataStorage.run(clerkMiddlewareRequestDataStore, ()=>{
        const baseNextMiddleware = withLogger("clerkMiddleware", (logger)=>async (request2, event2)=>{
                var _a, _b;
                const resolvedParams = typeof params === "function" ? await params(request2) : params;
                const keyless = await getKeylessCookieValue((name)=>{
                    var _a2;
                    return (_a2 = request2.cookies.get(name)) == null ? void 0 : _a2.value;
                });
                const publishableKey = assertKey(resolvedParams.publishableKey || PUBLISHABLE_KEY || (keyless == null ? void 0 : keyless.publishableKey), ()=>errorThrower_errorThrower.throwMissingPublishableKeyError());
                const secretKey = assertKey(resolvedParams.secretKey || SECRET_KEY || (keyless == null ? void 0 : keyless.secretKey), ()=>errorThrower_errorThrower.throwMissingSecretKeyError());
                const signInUrl = resolvedParams.signInUrl || SIGN_IN_URL;
                const signUpUrl = resolvedParams.signUpUrl || SIGN_UP_URL;
                const options = {
                    publishableKey,
                    secretKey,
                    signInUrl,
                    signUpUrl,
                    ...resolvedParams
                };
                clerkMiddlewareRequestDataStore.set("requestData", options);
                const resolvedClerkClient = await clerkClient();
                if (options.debug) {
                    logger.enable();
                }
                const clerkRequest = createClerkRequest(request2);
                logger.debug("options", options);
                logger.debug("url", ()=>clerkRequest.toJSON());
                const authHeader = request2.headers.get(chunk_I24FT6SE_constants.Headers.Authorization);
                if (authHeader && authHeader.startsWith("Basic ")) {
                    logger.debug("Basic Auth detected");
                }
                const cspHeader = request2.headers.get(chunk_I24FT6SE_constants.Headers.ContentSecurityPolicy);
                if (cspHeader) {
                    logger.debug("Content-Security-Policy detected", ()=>({
                            value: cspHeader
                        }));
                }
                const requestState = await resolvedClerkClient.authenticateRequest(clerkRequest, createAuthenticateRequestOptions(clerkRequest, options));
                logger.debug("requestState", ()=>({
                        status: requestState.status,
                        headers: JSON.stringify(Object.fromEntries(requestState.headers)),
                        reason: requestState.reason
                    }));
                const locationHeader = requestState.headers.get(chunk_I24FT6SE_constants.Headers.Location);
                if (locationHeader) {
                    const res = NextResponse.redirect(locationHeader);
                    requestState.headers.forEach((value, key)=>{
                        if (key === chunk_I24FT6SE_constants.Headers.Location) {
                            return;
                        }
                        res.headers.append(key, value);
                    });
                    return res;
                } else if (requestState.status === AuthStatus.Handshake) {
                    throw new Error("Clerk: handshake status without redirect");
                }
                const authObject = requestState.toAuth();
                logger.debug("auth", ()=>({
                        auth: authObject,
                        debug: authObject.debug()
                    }));
                const redirectToSignIn = createMiddlewareRedirectToSignIn(clerkRequest);
                const redirectToSignUp = createMiddlewareRedirectToSignUp(clerkRequest);
                const protect = await createMiddlewareProtect(clerkRequest, authObject, redirectToSignIn);
                const authHandler = createMiddlewareAuthHandler(requestState, redirectToSignIn, redirectToSignUp);
                authHandler.protect = protect;
                let handlerResult = NextResponse.next();
                try {
                    const userHandlerResult = await clerkMiddlewareRequestDataStorage.run(clerkMiddlewareRequestDataStore, async ()=>handler == null ? void 0 : handler(authHandler, request2, event2));
                    handlerResult = userHandlerResult || handlerResult;
                } catch (e) {
                    handlerResult = handleControlFlowErrors(e, clerkRequest, request2, requestState);
                }
                if (options.contentSecurityPolicy) {
                    const { headers } = createContentSecurityPolicyHeaders(((_b = (_a = parsePublishableKey(publishableKey)) == null ? void 0 : _a.frontendApi) != null ? _b : "").replace("$", ""), options.contentSecurityPolicy);
                    headers.forEach(([key, value])=>{
                        setHeader(handlerResult, key, value);
                    });
                    logger.debug("Clerk generated CSP", ()=>({
                            headers
                        }));
                }
                if (requestState.headers) {
                    requestState.headers.forEach((value, key)=>{
                        if (key === chunk_I24FT6SE_constants.Headers.ContentSecurityPolicy) {
                            logger.debug("Content-Security-Policy detected", ()=>({
                                    value
                                }));
                        }
                        handlerResult.headers.append(key, value);
                    });
                }
                if (isRedirect(handlerResult)) {
                    logger.debug("handlerResult is redirect");
                    return serverRedirectWithAuth(clerkRequest, handlerResult, options);
                }
                if (options.debug) {
                    setRequestHeadersOnNextResponse(handlerResult, clerkRequest, {
                        [chunk_I24FT6SE_constants.Headers.EnableDebug]: "true"
                    });
                }
                const keylessKeysForRequestData = // Only pass keyless credentials when there are no explicit keys
                secretKey === (keyless == null ? void 0 : keyless.secretKey) ? {
                    publishableKey: keyless == null ? void 0 : keyless.publishableKey,
                    secretKey: keyless == null ? void 0 : keyless.secretKey
                } : {};
                decorateRequest(clerkRequest, handlerResult, requestState, resolvedParams, keylessKeysForRequestData, authObject.tokenType === "session_token" ? null : makeAuthObjectSerializable(authObject));
                return handlerResult;
            });
        const keylessMiddleware = async (request2, event2)=>{
            var _a, _b;
            if (isKeylessSyncRequest(request2)) {
                return returnBackFromKeylessSync(request2);
            }
            const resolvedParams = typeof params === "function" ? await params(request2) : params;
            const keyless = await getKeylessCookieValue((name)=>{
                var _a2;
                return (_a2 = request2.cookies.get(name)) == null ? void 0 : _a2.value;
            });
            const isMissingPublishableKey = !(resolvedParams.publishableKey || PUBLISHABLE_KEY || (keyless == null ? void 0 : keyless.publishableKey));
            const authHeader = (_b = (_a = getHeader(request2, chunk_I24FT6SE_constants.Headers.Authorization)) == null ? void 0 : _a.replace("Bearer ", "")) != null ? _b : "";
            if (isMissingPublishableKey && !isMachineTokenByPrefix(authHeader)) {
                const res = NextResponse.next();
                setRequestHeadersOnNextResponse(res, request2, {
                    [chunk_I24FT6SE_constants.Headers.AuthStatus]: "signed-out"
                });
                return res;
            }
            return baseNextMiddleware(request2, event2);
        };
        const nextMiddleware = async (request2, event2)=>{
            if (canUseKeyless) {
                return keylessMiddleware(request2, event2);
            }
            return baseNextMiddleware(request2, event2);
        };
        if (request && event) {
            return nextMiddleware(request, event);
        }
        return nextMiddleware;
    });
    return middleware;
};
const parseRequestAndEvent = (args)=>{
    return [
        args[0] instanceof Request ? args[0] : void 0,
        args[0] instanceof Request ? args[1] : void 0
    ];
};
const parseHandlerAndOptions = (args)=>{
    return [
        typeof args[0] === "function" ? args[0] : void 0,
        (args.length === 2 ? args[1] : typeof args[0] === "function" ? {} : args[0]) || {}
    ];
};
const isKeylessSyncRequest = (request)=>request.nextUrl.pathname === "/clerk-sync-keyless";
const returnBackFromKeylessSync = (request)=>{
    const returnUrl = request.nextUrl.searchParams.get("returnUrl");
    const url = new URL(request.url);
    url.pathname = "";
    return NextResponse.redirect(returnUrl || url.toString());
};
const createAuthenticateRequestOptions = (clerkRequest, options)=>{
    return {
        ...options,
        ...handleMultiDomainAndProxy(clerkRequest, options),
        // TODO: Leaving the acceptsToken as 'any' opens up the possibility of
        // an economic attack. We should revisit this and only verify a token
        // when auth() or auth.protect() is invoked.
        acceptsToken: "any"
    };
};
const createMiddlewareRedirectToSignIn = (clerkRequest)=>{
    return (opts = {})=>{
        const url = clerkRequest.clerkUrl.toString();
        redirectToSignInError(url, opts.returnBackUrl);
    };
};
const createMiddlewareRedirectToSignUp = (clerkRequest)=>{
    return (opts = {})=>{
        const url = clerkRequest.clerkUrl.toString();
        redirectToSignUpError(url, opts.returnBackUrl);
    };
};
const createMiddlewareProtect = (clerkRequest, rawAuthObject, redirectToSignIn)=>{
    return async (params, options)=>{
        const notFound = ()=>not_found_notFound();
        const redirect = (url)=>nextjsRedirectError(url, {
                redirectUrl: url
            });
        const requestedToken = (params == null ? void 0 : params.token) || (options == null ? void 0 : options.token) || TokenType.SessionToken;
        const authObject = getAuthObjectForAcceptedToken({
            authObject: rawAuthObject,
            acceptsToken: requestedToken
        });
        return createProtect({
            request: clerkRequest,
            redirect,
            notFound,
            unauthorized: unauthorized,
            authObject,
            redirectToSignIn
        })(params, options);
    };
};
const createMiddlewareAuthHandler = (requestState, redirectToSignIn, redirectToSignUp)=>{
    const authHandler = async (options)=>{
        var _a;
        const rawAuthObject = requestState.toAuth({
            treatPendingAsSignedOut: options == null ? void 0 : options.treatPendingAsSignedOut
        });
        const acceptsToken = (_a = options == null ? void 0 : options.acceptsToken) != null ? _a : TokenType.SessionToken;
        const authObject = getAuthObjectForAcceptedToken({
            authObject: rawAuthObject,
            acceptsToken
        });
        if (authObject.tokenType === TokenType.SessionToken && isTokenTypeAccepted(TokenType.SessionToken, acceptsToken)) {
            return Object.assign(authObject, {
                redirectToSignIn,
                redirectToSignUp
            });
        }
        return authObject;
    };
    return authHandler;
};
const handleControlFlowErrors = (e, clerkRequest, nextRequest, requestState)=>{
    var _a;
    if (isNextjsUnauthorizedError(e)) {
        const response = new NextResponse(null, {
            status: 401
        });
        const authObject = requestState.toAuth();
        if (authObject && authObject.tokenType === TokenType.OAuthToken) {
            const publishableKey = parsePublishableKey(requestState.publishableKey);
            return setHeader(response, "WWW-Authenticate", `Bearer resource_metadata="https://${publishableKey == null ? void 0 : publishableKey.frontendApi}/.well-known/oauth-protected-resource"`);
        }
        return response;
    }
    if (isNextjsNotFoundError(e)) {
        return setHeader(// This is an internal rewrite purely to trigger a not found error. We do not want Next.js to think that the
        // destination URL is a valid page, so we use `nextRequest.url` as the base for the fake URL, which Next.js
        // understands is an internal URL and won't run middleware against the request.
        NextResponse.rewrite(new URL(`/clerk_${Date.now()}`, nextRequest.url)), chunk_I24FT6SE_constants.Headers.AuthReason, "protect-rewrite");
    }
    const isRedirectToSignIn = isRedirectToSignInError(e);
    const isRedirectToSignUp = isRedirectToSignUpError(e);
    if (isRedirectToSignIn || isRedirectToSignUp) {
        const redirect = createRedirect({
            redirectAdapter: redirectAdapter,
            baseUrl: clerkRequest.clerkUrl,
            signInUrl: requestState.signInUrl,
            signUpUrl: requestState.signUpUrl,
            publishableKey: requestState.publishableKey,
            sessionStatus: (_a = requestState.toAuth()) == null ? void 0 : _a.sessionStatus
        });
        const { returnBackUrl } = e;
        return redirect[isRedirectToSignIn ? "redirectToSignIn" : "redirectToSignUp"]({
            returnBackUrl
        });
    }
    if (isNextjsRedirectError(e)) {
        return redirectAdapter(e.redirectUrl);
    }
    throw e;
};
 //# sourceMappingURL=clerkMiddleware.js.map

;// CONCATENATED MODULE: ./middleware.ts


const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)"
]);
/* harmony default export */ const middleware = (clerkMiddleware(async (auth, req)=>{
    // If it's a public route, allow access
    if (isPublicRoute(req)) {
        return NextResponse.next();
    }
    // For protected routes, check auth
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next();
}));
const config = {
    matcher: [
        "/dashboard(.*)",
        "/api/trpc(.*)",
        "/sign-in(.*)",
        "/sign-up(.*)"
    ]
};

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=private-next-root-dir%2Fmiddleware.ts&page=%2Fmiddleware&rootDir=C%3A%5CUsers%5Crinoruser%5CDesktop%5Cprogravity%5Capps%5Cweb&matchers=W3sicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpP1xcL2Rhc2hib2FyZCguKikoLmpzb24pP1tcXC8jXFw%2FXT8kIiwib3JpZ2luYWxTb3VyY2UiOiIvZGFzaGJvYXJkKC4qKSJ9LHsicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpP1xcL2FwaVxcL3RycGMoLiopKC5qc29uKT9bXFwvI1xcP10%2FJCIsIm9yaWdpbmFsU291cmNlIjoiL2FwaS90cnBjKC4qKSJ9LHsicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpP1xcL3NpZ24taW4oLiopKC5qc29uKT9bXFwvI1xcP10%2FJCIsIm9yaWdpbmFsU291cmNlIjoiL3NpZ24taW4oLiopIn0seyJyZWdleHAiOiJeKD86XFwvKF9uZXh0XFwvZGF0YVxcL1teL117MSx9KSk%2FXFwvc2lnbi11cCguKikoLmpzb24pP1tcXC8jXFw%2FXT8kIiwib3JpZ2luYWxTb3VyY2UiOiIvc2lnbi11cCguKikifV0%3D&preferredRegion=&middlewareConfig=eyJtYXRjaGVycyI6W3sicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpP1xcL2Rhc2hib2FyZCguKikoLmpzb24pP1tcXC8jXFw%2FXT8kIiwib3JpZ2luYWxTb3VyY2UiOiIvZGFzaGJvYXJkKC4qKSJ9LHsicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpP1xcL2FwaVxcL3RycGMoLiopKC5qc29uKT9bXFwvI1xcP10%2FJCIsIm9yaWdpbmFsU291cmNlIjoiL2FwaS90cnBjKC4qKSJ9LHsicmVnZXhwIjoiXig%2FOlxcLyhfbmV4dFxcL2RhdGFcXC9bXi9dezEsfSkpP1xcL3NpZ24taW4oLiopKC5qc29uKT9bXFwvI1xcP10%2FJCIsIm9yaWdpbmFsU291cmNlIjoiL3NpZ24taW4oLiopIn0seyJyZWdleHAiOiJeKD86XFwvKF9uZXh0XFwvZGF0YVxcL1teL117MSx9KSk%2FXFwvc2lnbi11cCguKikoLmpzb24pP1tcXC8jXFw%2FXT8kIiwib3JpZ2luYWxTb3VyY2UiOiIvc2lnbi11cCguKikifV19!


// Import the userland code.

const mod = {
    ...middleware_namespaceObject
};
const handler = mod.middleware || mod.default;
const page = "/middleware";
if (typeof handler !== "function") {
    throw new Error(`The Middleware "${page}" must export a \`middleware\` or a \`default\` function`);
}
function nHandler(opts) {
    return adapter({
        ...opts,
        page,
        handler
    });
}

//# sourceMappingURL=middleware.js.map

/***/ }),

/***/ 6156:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Qc = parse;
__webpack_unused_export__ = serialize;
/**
 * RegExp to match cookie-name in RFC 6265 sec 4.1.1
 * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
 * which has been replaced by the token definition in RFC 7230 appendix B.
 *
 * cookie-name       = token
 * token             = 1*tchar
 * tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
 *                     "*" / "+" / "-" / "." / "^" / "_" /
 *                     "`" / "|" / "~" / DIGIT / ALPHA
 *
 * Note: Allowing more characters - https://github.com/jshttp/cookie/issues/191
 * Allow same range as cookie value, except `=`, which delimits end of name.
 */ const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
/**
 * RegExp to match cookie-value in RFC 6265 sec 4.1.1
 *
 * cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
 * cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
 *                     ; US-ASCII characters excluding CTLs,
 *                     ; whitespace DQUOTE, comma, semicolon,
 *                     ; and backslash
 *
 * Allowing more characters: https://github.com/jshttp/cookie/issues/191
 * Comma, backslash, and DQUOTE are not part of the parsing algorithm.
 */ const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
/**
 * RegExp to match domain-value in RFC 6265 sec 4.1.1
 *
 * domain-value      = <subdomain>
 *                     ; defined in [RFC1034], Section 3.5, as
 *                     ; enhanced by [RFC1123], Section 2.1
 * <subdomain>       = <label> | <subdomain> "." <label>
 * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
 *                     Labels must be 63 characters or less.
 *                     'let-dig' not 'letter' in the first char, per RFC1123
 * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
 * <let-dig-hyp>     = <let-dig> | "-"
 * <let-dig>         = <letter> | <digit>
 * <letter>          = any one of the 52 alphabetic characters A through Z in
 *                     upper case and a through z in lower case
 * <digit>           = any one of the ten digits 0 through 9
 *
 * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
 *
 * > (Note that a leading %x2E ("."), if present, is ignored even though that
 * character is not permitted, but a trailing %x2E ("."), if present, will
 * cause the user agent to ignore the attribute.)
 */ const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
/**
 * RegExp to match path-value in RFC 6265 sec 4.1.1
 *
 * path-value        = <any CHAR except CTLs or ";">
 * CHAR              = %x01-7F
 *                     ; defined in RFC 5234 appendix B.1
 */ const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
const __toString = Object.prototype.toString;
const NullObject = /* @__PURE__ */ (()=>{
    const C = function() {};
    C.prototype = Object.create(null);
    return C;
})();
/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 */ function parse(str, options) {
    const obj = new NullObject();
    const len = str.length;
    // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.
    if (len < 2) return obj;
    const dec = options?.decode || decode;
    let index = 0;
    do {
        const eqIdx = str.indexOf("=", index);
        if (eqIdx === -1) break; // No more cookie pairs.
        const colonIdx = str.indexOf(";", index);
        const endIdx = colonIdx === -1 ? len : colonIdx;
        if (eqIdx > endIdx) {
            // backtrack on prior semicolon
            index = str.lastIndexOf(";", eqIdx - 1) + 1;
            continue;
        }
        const keyStartIdx = startIndex(str, index, eqIdx);
        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        const key = str.slice(keyStartIdx, keyEndIdx);
        // only assign once
        if (obj[key] === undefined) {
            let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
            let valEndIdx = endIndex(str, endIdx, valStartIdx);
            const value = dec(str.slice(valStartIdx, valEndIdx));
            obj[key] = value;
        }
        index = endIdx + 1;
    }while (index < len);
    return obj;
}
function startIndex(str, index, max) {
    do {
        const code = str.charCodeAt(index);
        if (code !== 0x20 /*   */  && code !== 0x09 /* \t */ ) return index;
    }while (++index < max);
    return max;
}
function endIndex(str, index, min) {
    while(index > min){
        const code = str.charCodeAt(--index);
        if (code !== 0x20 /*   */  && code !== 0x09 /* \t */ ) return index + 1;
    }
    return min;
}
/**
 * Serialize data into a cookie header.
 *
 * Serialize a name value pair into a cookie string suitable for
 * http headers. An optional options object specifies cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 */ function serialize(name, val, options) {
    const enc = options?.encode || encodeURIComponent;
    if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`argument name is invalid: ${name}`);
    }
    const value = enc(val);
    if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${val}`);
    }
    let str = name + "=" + value;
    if (!options) return str;
    if (options.maxAge !== undefined) {
        if (!Number.isInteger(options.maxAge)) {
            throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
        }
        str += "; Max-Age=" + options.maxAge;
    }
    if (options.domain) {
        if (!domainValueRegExp.test(options.domain)) {
            throw new TypeError(`option domain is invalid: ${options.domain}`);
        }
        str += "; Domain=" + options.domain;
    }
    if (options.path) {
        if (!pathValueRegExp.test(options.path)) {
            throw new TypeError(`option path is invalid: ${options.path}`);
        }
        str += "; Path=" + options.path;
    }
    if (options.expires) {
        if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) {
            throw new TypeError(`option expires is invalid: ${options.expires}`);
        }
        str += "; Expires=" + options.expires.toUTCString();
    }
    if (options.httpOnly) {
        str += "; HttpOnly";
    }
    if (options.secure) {
        str += "; Secure";
    }
    if (options.partitioned) {
        str += "; Partitioned";
    }
    if (options.priority) {
        const priority = typeof options.priority === "string" ? options.priority.toLowerCase() : undefined;
        switch(priority){
            case "low":
                str += "; Priority=Low";
                break;
            case "medium":
                str += "; Priority=Medium";
                break;
            case "high":
                str += "; Priority=High";
                break;
            default:
                throw new TypeError(`option priority is invalid: ${options.priority}`);
        }
    }
    if (options.sameSite) {
        const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
        switch(sameSite){
            case true:
            case "strict":
                str += "; SameSite=Strict";
                break;
            case "lax":
                str += "; SameSite=Lax";
                break;
            case "none":
                str += "; SameSite=None";
                break;
            default:
                throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
        }
    }
    return str;
}
/**
 * URL-decode string value. Optimized to skip native call when no %.
 */ function decode(str) {
    if (str.indexOf("%") === -1) return str;
    try {
        return decodeURIComponent(str);
    } catch (e) {
        return str;
    }
}
/**
 * Determine if value is a Date.
 */ function isDate(val) {
    return __toString.call(val) === "[object Date]";
} //# sourceMappingURL=index.js.map


/***/ }),

/***/ 9652:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod);
// src/index.ts
var src_exports = {};
__export(src_exports, {
    RequestCookies: ()=>RequestCookies,
    ResponseCookies: ()=>ResponseCookies,
    parseCookie: ()=>parseCookie,
    parseSetCookie: ()=>parseSetCookie,
    stringifyCookie: ()=>stringifyCookie
});
module.exports = __toCommonJS(src_exports);
// src/serialize.ts
function stringifyCookie(c) {
    var _a;
    const attrs = [
        "path" in c && c.path && `Path=${c.path}`,
        "expires" in c && (c.expires || c.expires === 0) && `Expires=${(typeof c.expires === "number" ? new Date(c.expires) : c.expires).toUTCString()}`,
        "maxAge" in c && typeof c.maxAge === "number" && `Max-Age=${c.maxAge}`,
        "domain" in c && c.domain && `Domain=${c.domain}`,
        "secure" in c && c.secure && "Secure",
        "httpOnly" in c && c.httpOnly && "HttpOnly",
        "sameSite" in c && c.sameSite && `SameSite=${c.sameSite}`,
        "priority" in c && c.priority && `Priority=${c.priority}`
    ].filter(Boolean);
    return `${c.name}=${encodeURIComponent((_a = c.value) != null ? _a : "")}; ${attrs.join("; ")}`;
}
function parseCookie(cookie) {
    const map = /* @__PURE__ */ new Map();
    for (const pair of cookie.split(/; */)){
        if (!pair) continue;
        const splitAt = pair.indexOf("=");
        if (splitAt === -1) {
            map.set(pair, "true");
            continue;
        }
        const [key, value] = [
            pair.slice(0, splitAt),
            pair.slice(splitAt + 1)
        ];
        try {
            map.set(key, decodeURIComponent(value != null ? value : "true"));
        } catch  {}
    }
    return map;
}
function parseSetCookie(setCookie) {
    if (!setCookie) {
        return void 0;
    }
    const [[name, value], ...attributes] = parseCookie(setCookie);
    const { domain, expires, httponly, maxage, path, samesite, secure, priority } = Object.fromEntries(attributes.map(([key, value2])=>[
            key.toLowerCase(),
            value2
        ]));
    const cookie = {
        name,
        value: decodeURIComponent(value),
        domain,
        ...expires && {
            expires: new Date(expires)
        },
        ...httponly && {
            httpOnly: true
        },
        ...typeof maxage === "string" && {
            maxAge: Number(maxage)
        },
        path,
        ...samesite && {
            sameSite: parseSameSite(samesite)
        },
        ...secure && {
            secure: true
        },
        ...priority && {
            priority: parsePriority(priority)
        }
    };
    return compact(cookie);
}
function compact(t) {
    const newT = {};
    for(const key in t){
        if (t[key]) {
            newT[key] = t[key];
        }
    }
    return newT;
}
var SAME_SITE = [
    "strict",
    "lax",
    "none"
];
function parseSameSite(string) {
    string = string.toLowerCase();
    return SAME_SITE.includes(string) ? string : void 0;
}
var PRIORITY = [
    "low",
    "medium",
    "high"
];
function parsePriority(string) {
    string = string.toLowerCase();
    return PRIORITY.includes(string) ? string : void 0;
}
function splitCookiesString(cookiesString) {
    if (!cookiesString) return [];
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                    cookiesSeparatorFound = true;
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
// src/request-cookies.ts
var RequestCookies = class {
    constructor(requestHeaders){
        /** @internal */ this._parsed = /* @__PURE__ */ new Map();
        this._headers = requestHeaders;
        const header = requestHeaders.get("cookie");
        if (header) {
            const parsed = parseCookie(header);
            for (const [name, value] of parsed){
                this._parsed.set(name, {
                    name,
                    value
                });
            }
        }
    }
    [Symbol.iterator]() {
        return this._parsed[Symbol.iterator]();
    }
    /**
   * The amount of cookies received from the client
   */ get size() {
        return this._parsed.size;
    }
    get(...args) {
        const name = typeof args[0] === "string" ? args[0] : args[0].name;
        return this._parsed.get(name);
    }
    getAll(...args) {
        var _a;
        const all = Array.from(this._parsed);
        if (!args.length) {
            return all.map(([_, value])=>value);
        }
        const name = typeof args[0] === "string" ? args[0] : (_a = args[0]) == null ? void 0 : _a.name;
        return all.filter(([n])=>n === name).map(([_, value])=>value);
    }
    has(name) {
        return this._parsed.has(name);
    }
    set(...args) {
        const [name, value] = args.length === 1 ? [
            args[0].name,
            args[0].value
        ] : args;
        const map = this._parsed;
        map.set(name, {
            name,
            value
        });
        this._headers.set("cookie", Array.from(map).map(([_, value2])=>stringifyCookie(value2)).join("; "));
        return this;
    }
    /**
   * Delete the cookies matching the passed name or names in the request.
   */ delete(names) {
        const map = this._parsed;
        const result = !Array.isArray(names) ? map.delete(names) : names.map((name)=>map.delete(name));
        this._headers.set("cookie", Array.from(map).map(([_, value])=>stringifyCookie(value)).join("; "));
        return result;
    }
    /**
   * Delete all the cookies in the cookies in the request.
   */ clear() {
        this.delete(Array.from(this._parsed.keys()));
        return this;
    }
    /**
   * Format the cookies in the request as a string for logging
   */ [Symbol.for("edge-runtime.inspect.custom")]() {
        return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
    }
    toString() {
        return [
            ...this._parsed.values()
        ].map((v)=>`${v.name}=${encodeURIComponent(v.value)}`).join("; ");
    }
};
// src/response-cookies.ts
var ResponseCookies = class {
    constructor(responseHeaders){
        /** @internal */ this._parsed = /* @__PURE__ */ new Map();
        var _a, _b, _c;
        this._headers = responseHeaders;
        const setCookie = (_c = (_b = (_a = responseHeaders.getSetCookie) == null ? void 0 : _a.call(responseHeaders)) != null ? _b : responseHeaders.get("set-cookie")) != null ? _c : [];
        const cookieStrings = Array.isArray(setCookie) ? setCookie : splitCookiesString(setCookie);
        for (const cookieString of cookieStrings){
            const parsed = parseSetCookie(cookieString);
            if (parsed) this._parsed.set(parsed.name, parsed);
        }
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-get CookieStore#get} without the Promise.
   */ get(...args) {
        const key = typeof args[0] === "string" ? args[0] : args[0].name;
        return this._parsed.get(key);
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-getAll CookieStore#getAll} without the Promise.
   */ getAll(...args) {
        var _a;
        const all = Array.from(this._parsed.values());
        if (!args.length) {
            return all;
        }
        const key = typeof args[0] === "string" ? args[0] : (_a = args[0]) == null ? void 0 : _a.name;
        return all.filter((c)=>c.name === key);
    }
    has(name) {
        return this._parsed.has(name);
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-set CookieStore#set} without the Promise.
   */ set(...args) {
        const [name, value, cookie] = args.length === 1 ? [
            args[0].name,
            args[0].value,
            args[0]
        ] : args;
        const map = this._parsed;
        map.set(name, normalizeCookie({
            name,
            value,
            ...cookie
        }));
        replace(map, this._headers);
        return this;
    }
    /**
   * {@link https://wicg.github.io/cookie-store/#CookieStore-delete CookieStore#delete} without the Promise.
   */ delete(...args) {
        const [name, path, domain] = typeof args[0] === "string" ? [
            args[0]
        ] : [
            args[0].name,
            args[0].path,
            args[0].domain
        ];
        return this.set({
            name,
            path,
            domain,
            value: "",
            expires: /* @__PURE__ */ new Date(0)
        });
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
    }
    toString() {
        return [
            ...this._parsed.values()
        ].map(stringifyCookie).join("; ");
    }
};
function replace(bag, headers) {
    headers.delete("set-cookie");
    for (const [, value] of bag){
        const serialized = stringifyCookie(value);
        headers.append("set-cookie", serialized);
    }
}
function normalizeCookie(cookie = {
    name: "",
    value: ""
}) {
    if (typeof cookie.expires === "number") {
        cookie.expires = new Date(cookie.expires);
    }
    if (cookie.maxAge) {
        cookie.expires = new Date(Date.now() + cookie.maxAge * 1e3);
    }
    if (cookie.path === null || cookie.path === void 0) {
        cookie.path = "/";
    }
    return cookie;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 541:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
var __dirname = "/";

(()=>{
    "use strict";
    var e = {
        491: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.ContextAPI = void 0;
            const n = r(223);
            const a = r(172);
            const o = r(930);
            const i = "context";
            const c = new n.NoopContextManager;
            class ContextAPI {
                constructor(){}
                static getInstance() {
                    if (!this._instance) {
                        this._instance = new ContextAPI;
                    }
                    return this._instance;
                }
                setGlobalContextManager(e) {
                    return (0, a.registerGlobal)(i, e, o.DiagAPI.instance());
                }
                active() {
                    return this._getContextManager().active();
                }
                with(e, t, r, ...n) {
                    return this._getContextManager().with(e, t, r, ...n);
                }
                bind(e, t) {
                    return this._getContextManager().bind(e, t);
                }
                _getContextManager() {
                    return (0, a.getGlobal)(i) || c;
                }
                disable() {
                    this._getContextManager().disable();
                    (0, a.unregisterGlobal)(i, o.DiagAPI.instance());
                }
            }
            t.ContextAPI = ContextAPI;
        },
        930: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.DiagAPI = void 0;
            const n = r(56);
            const a = r(912);
            const o = r(957);
            const i = r(172);
            const c = "diag";
            class DiagAPI {
                constructor(){
                    function _logProxy(e) {
                        return function(...t) {
                            const r = (0, i.getGlobal)("diag");
                            if (!r) return;
                            return r[e](...t);
                        };
                    }
                    const e = this;
                    const setLogger = (t, r = {
                        logLevel: o.DiagLogLevel.INFO
                    })=>{
                        var n, c, s;
                        if (t === e) {
                            const t = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                            e.error((n = t.stack) !== null && n !== void 0 ? n : t.message);
                            return false;
                        }
                        if (typeof r === "number") {
                            r = {
                                logLevel: r
                            };
                        }
                        const u = (0, i.getGlobal)("diag");
                        const l = (0, a.createLogLevelDiagLogger)((c = r.logLevel) !== null && c !== void 0 ? c : o.DiagLogLevel.INFO, t);
                        if (u && !r.suppressOverrideMessage) {
                            const e = (s = (new Error).stack) !== null && s !== void 0 ? s : "<failed to generate stacktrace>";
                            u.warn(`Current logger will be overwritten from ${e}`);
                            l.warn(`Current logger will overwrite one already registered from ${e}`);
                        }
                        return (0, i.registerGlobal)("diag", l, e, true);
                    };
                    e.setLogger = setLogger;
                    e.disable = ()=>{
                        (0, i.unregisterGlobal)(c, e);
                    };
                    e.createComponentLogger = (e)=>new n.DiagComponentLogger(e);
                    e.verbose = _logProxy("verbose");
                    e.debug = _logProxy("debug");
                    e.info = _logProxy("info");
                    e.warn = _logProxy("warn");
                    e.error = _logProxy("error");
                }
                static instance() {
                    if (!this._instance) {
                        this._instance = new DiagAPI;
                    }
                    return this._instance;
                }
            }
            t.DiagAPI = DiagAPI;
        },
        653: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.MetricsAPI = void 0;
            const n = r(660);
            const a = r(172);
            const o = r(930);
            const i = "metrics";
            class MetricsAPI {
                constructor(){}
                static getInstance() {
                    if (!this._instance) {
                        this._instance = new MetricsAPI;
                    }
                    return this._instance;
                }
                setGlobalMeterProvider(e) {
                    return (0, a.registerGlobal)(i, e, o.DiagAPI.instance());
                }
                getMeterProvider() {
                    return (0, a.getGlobal)(i) || n.NOOP_METER_PROVIDER;
                }
                getMeter(e, t, r) {
                    return this.getMeterProvider().getMeter(e, t, r);
                }
                disable() {
                    (0, a.unregisterGlobal)(i, o.DiagAPI.instance());
                }
            }
            t.MetricsAPI = MetricsAPI;
        },
        181: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.PropagationAPI = void 0;
            const n = r(172);
            const a = r(874);
            const o = r(194);
            const i = r(277);
            const c = r(369);
            const s = r(930);
            const u = "propagation";
            const l = new a.NoopTextMapPropagator;
            class PropagationAPI {
                constructor(){
                    this.createBaggage = c.createBaggage;
                    this.getBaggage = i.getBaggage;
                    this.getActiveBaggage = i.getActiveBaggage;
                    this.setBaggage = i.setBaggage;
                    this.deleteBaggage = i.deleteBaggage;
                }
                static getInstance() {
                    if (!this._instance) {
                        this._instance = new PropagationAPI;
                    }
                    return this._instance;
                }
                setGlobalPropagator(e) {
                    return (0, n.registerGlobal)(u, e, s.DiagAPI.instance());
                }
                inject(e, t, r = o.defaultTextMapSetter) {
                    return this._getGlobalPropagator().inject(e, t, r);
                }
                extract(e, t, r = o.defaultTextMapGetter) {
                    return this._getGlobalPropagator().extract(e, t, r);
                }
                fields() {
                    return this._getGlobalPropagator().fields();
                }
                disable() {
                    (0, n.unregisterGlobal)(u, s.DiagAPI.instance());
                }
                _getGlobalPropagator() {
                    return (0, n.getGlobal)(u) || l;
                }
            }
            t.PropagationAPI = PropagationAPI;
        },
        997: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.TraceAPI = void 0;
            const n = r(172);
            const a = r(846);
            const o = r(139);
            const i = r(607);
            const c = r(930);
            const s = "trace";
            class TraceAPI {
                constructor(){
                    this._proxyTracerProvider = new a.ProxyTracerProvider;
                    this.wrapSpanContext = o.wrapSpanContext;
                    this.isSpanContextValid = o.isSpanContextValid;
                    this.deleteSpan = i.deleteSpan;
                    this.getSpan = i.getSpan;
                    this.getActiveSpan = i.getActiveSpan;
                    this.getSpanContext = i.getSpanContext;
                    this.setSpan = i.setSpan;
                    this.setSpanContext = i.setSpanContext;
                }
                static getInstance() {
                    if (!this._instance) {
                        this._instance = new TraceAPI;
                    }
                    return this._instance;
                }
                setGlobalTracerProvider(e) {
                    const t = (0, n.registerGlobal)(s, this._proxyTracerProvider, c.DiagAPI.instance());
                    if (t) {
                        this._proxyTracerProvider.setDelegate(e);
                    }
                    return t;
                }
                getTracerProvider() {
                    return (0, n.getGlobal)(s) || this._proxyTracerProvider;
                }
                getTracer(e, t) {
                    return this.getTracerProvider().getTracer(e, t);
                }
                disable() {
                    (0, n.unregisterGlobal)(s, c.DiagAPI.instance());
                    this._proxyTracerProvider = new a.ProxyTracerProvider;
                }
            }
            t.TraceAPI = TraceAPI;
        },
        277: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.deleteBaggage = t.setBaggage = t.getActiveBaggage = t.getBaggage = void 0;
            const n = r(491);
            const a = r(780);
            const o = (0, a.createContextKey)("OpenTelemetry Baggage Key");
            function getBaggage(e) {
                return e.getValue(o) || undefined;
            }
            t.getBaggage = getBaggage;
            function getActiveBaggage() {
                return getBaggage(n.ContextAPI.getInstance().active());
            }
            t.getActiveBaggage = getActiveBaggage;
            function setBaggage(e, t) {
                return e.setValue(o, t);
            }
            t.setBaggage = setBaggage;
            function deleteBaggage(e) {
                return e.deleteValue(o);
            }
            t.deleteBaggage = deleteBaggage;
        },
        993: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.BaggageImpl = void 0;
            class BaggageImpl {
                constructor(e){
                    this._entries = e ? new Map(e) : new Map;
                }
                getEntry(e) {
                    const t = this._entries.get(e);
                    if (!t) {
                        return undefined;
                    }
                    return Object.assign({}, t);
                }
                getAllEntries() {
                    return Array.from(this._entries.entries()).map(([e, t])=>[
                            e,
                            t
                        ]);
                }
                setEntry(e, t) {
                    const r = new BaggageImpl(this._entries);
                    r._entries.set(e, t);
                    return r;
                }
                removeEntry(e) {
                    const t = new BaggageImpl(this._entries);
                    t._entries.delete(e);
                    return t;
                }
                removeEntries(...e) {
                    const t = new BaggageImpl(this._entries);
                    for (const r of e){
                        t._entries.delete(r);
                    }
                    return t;
                }
                clear() {
                    return new BaggageImpl;
                }
            }
            t.BaggageImpl = BaggageImpl;
        },
        830: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.baggageEntryMetadataSymbol = void 0;
            t.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        },
        369: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.baggageEntryMetadataFromString = t.createBaggage = void 0;
            const n = r(930);
            const a = r(993);
            const o = r(830);
            const i = n.DiagAPI.instance();
            function createBaggage(e = {}) {
                return new a.BaggageImpl(new Map(Object.entries(e)));
            }
            t.createBaggage = createBaggage;
            function baggageEntryMetadataFromString(e) {
                if (typeof e !== "string") {
                    i.error(`Cannot create baggage metadata from unknown type: ${typeof e}`);
                    e = "";
                }
                return {
                    __TYPE__: o.baggageEntryMetadataSymbol,
                    toString () {
                        return e;
                    }
                };
            }
            t.baggageEntryMetadataFromString = baggageEntryMetadataFromString;
        },
        67: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.context = void 0;
            const n = r(491);
            t.context = n.ContextAPI.getInstance();
        },
        223: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NoopContextManager = void 0;
            const n = r(780);
            class NoopContextManager {
                active() {
                    return n.ROOT_CONTEXT;
                }
                with(e, t, r, ...n) {
                    return t.call(r, ...n);
                }
                bind(e, t) {
                    return t;
                }
                enable() {
                    return this;
                }
                disable() {
                    return this;
                }
            }
            t.NoopContextManager = NoopContextManager;
        },
        780: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.ROOT_CONTEXT = t.createContextKey = void 0;
            function createContextKey(e) {
                return Symbol.for(e);
            }
            t.createContextKey = createContextKey;
            class BaseContext {
                constructor(e){
                    const t = this;
                    t._currentContext = e ? new Map(e) : new Map;
                    t.getValue = (e)=>t._currentContext.get(e);
                    t.setValue = (e, r)=>{
                        const n = new BaseContext(t._currentContext);
                        n._currentContext.set(e, r);
                        return n;
                    };
                    t.deleteValue = (e)=>{
                        const r = new BaseContext(t._currentContext);
                        r._currentContext.delete(e);
                        return r;
                    };
                }
            }
            t.ROOT_CONTEXT = new BaseContext;
        },
        506: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.diag = void 0;
            const n = r(930);
            t.diag = n.DiagAPI.instance();
        },
        56: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.DiagComponentLogger = void 0;
            const n = r(172);
            class DiagComponentLogger {
                constructor(e){
                    this._namespace = e.namespace || "DiagComponentLogger";
                }
                debug(...e) {
                    return logProxy("debug", this._namespace, e);
                }
                error(...e) {
                    return logProxy("error", this._namespace, e);
                }
                info(...e) {
                    return logProxy("info", this._namespace, e);
                }
                warn(...e) {
                    return logProxy("warn", this._namespace, e);
                }
                verbose(...e) {
                    return logProxy("verbose", this._namespace, e);
                }
            }
            t.DiagComponentLogger = DiagComponentLogger;
            function logProxy(e, t, r) {
                const a = (0, n.getGlobal)("diag");
                if (!a) {
                    return;
                }
                r.unshift(t);
                return a[e](...r);
            }
        },
        972: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.DiagConsoleLogger = void 0;
            const r = [
                {
                    n: "error",
                    c: "error"
                },
                {
                    n: "warn",
                    c: "warn"
                },
                {
                    n: "info",
                    c: "info"
                },
                {
                    n: "debug",
                    c: "debug"
                },
                {
                    n: "verbose",
                    c: "trace"
                }
            ];
            class DiagConsoleLogger {
                constructor(){
                    function _consoleFunc(e) {
                        return function(...t) {
                            if (console) {
                                let r = console[e];
                                if (typeof r !== "function") {
                                    r = console.log;
                                }
                                if (typeof r === "function") {
                                    return r.apply(console, t);
                                }
                            }
                        };
                    }
                    for(let e = 0; e < r.length; e++){
                        this[r[e].n] = _consoleFunc(r[e].c);
                    }
                }
            }
            t.DiagConsoleLogger = DiagConsoleLogger;
        },
        912: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.createLogLevelDiagLogger = void 0;
            const n = r(957);
            function createLogLevelDiagLogger(e, t) {
                if (e < n.DiagLogLevel.NONE) {
                    e = n.DiagLogLevel.NONE;
                } else if (e > n.DiagLogLevel.ALL) {
                    e = n.DiagLogLevel.ALL;
                }
                t = t || {};
                function _filterFunc(r, n) {
                    const a = t[r];
                    if (typeof a === "function" && e >= n) {
                        return a.bind(t);
                    }
                    return function() {};
                }
                return {
                    error: _filterFunc("error", n.DiagLogLevel.ERROR),
                    warn: _filterFunc("warn", n.DiagLogLevel.WARN),
                    info: _filterFunc("info", n.DiagLogLevel.INFO),
                    debug: _filterFunc("debug", n.DiagLogLevel.DEBUG),
                    verbose: _filterFunc("verbose", n.DiagLogLevel.VERBOSE)
                };
            }
            t.createLogLevelDiagLogger = createLogLevelDiagLogger;
        },
        957: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.DiagLogLevel = void 0;
            var r;
            (function(e) {
                e[e["NONE"] = 0] = "NONE";
                e[e["ERROR"] = 30] = "ERROR";
                e[e["WARN"] = 50] = "WARN";
                e[e["INFO"] = 60] = "INFO";
                e[e["DEBUG"] = 70] = "DEBUG";
                e[e["VERBOSE"] = 80] = "VERBOSE";
                e[e["ALL"] = 9999] = "ALL";
            })(r = t.DiagLogLevel || (t.DiagLogLevel = {}));
        },
        172: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.unregisterGlobal = t.getGlobal = t.registerGlobal = void 0;
            const n = r(200);
            const a = r(521);
            const o = r(130);
            const i = a.VERSION.split(".")[0];
            const c = Symbol.for(`opentelemetry.js.api.${i}`);
            const s = n._globalThis;
            function registerGlobal(e, t, r, n = false) {
                var o;
                const i = s[c] = (o = s[c]) !== null && o !== void 0 ? o : {
                    version: a.VERSION
                };
                if (!n && i[e]) {
                    const t = new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e}`);
                    r.error(t.stack || t.message);
                    return false;
                }
                if (i.version !== a.VERSION) {
                    const t = new Error(`@opentelemetry/api: Registration of version v${i.version} for ${e} does not match previously registered API v${a.VERSION}`);
                    r.error(t.stack || t.message);
                    return false;
                }
                i[e] = t;
                r.debug(`@opentelemetry/api: Registered a global for ${e} v${a.VERSION}.`);
                return true;
            }
            t.registerGlobal = registerGlobal;
            function getGlobal(e) {
                var t, r;
                const n = (t = s[c]) === null || t === void 0 ? void 0 : t.version;
                if (!n || !(0, o.isCompatible)(n)) {
                    return;
                }
                return (r = s[c]) === null || r === void 0 ? void 0 : r[e];
            }
            t.getGlobal = getGlobal;
            function unregisterGlobal(e, t) {
                t.debug(`@opentelemetry/api: Unregistering a global for ${e} v${a.VERSION}.`);
                const r = s[c];
                if (r) {
                    delete r[e];
                }
            }
            t.unregisterGlobal = unregisterGlobal;
        },
        130: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.isCompatible = t._makeCompatibilityCheck = void 0;
            const n = r(521);
            const a = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
            function _makeCompatibilityCheck(e) {
                const t = new Set([
                    e
                ]);
                const r = new Set;
                const n = e.match(a);
                if (!n) {
                    return ()=>false;
                }
                const o = {
                    major: +n[1],
                    minor: +n[2],
                    patch: +n[3],
                    prerelease: n[4]
                };
                if (o.prerelease != null) {
                    return function isExactmatch(t) {
                        return t === e;
                    };
                }
                function _reject(e) {
                    r.add(e);
                    return false;
                }
                function _accept(e) {
                    t.add(e);
                    return true;
                }
                return function isCompatible(e) {
                    if (t.has(e)) {
                        return true;
                    }
                    if (r.has(e)) {
                        return false;
                    }
                    const n = e.match(a);
                    if (!n) {
                        return _reject(e);
                    }
                    const i = {
                        major: +n[1],
                        minor: +n[2],
                        patch: +n[3],
                        prerelease: n[4]
                    };
                    if (i.prerelease != null) {
                        return _reject(e);
                    }
                    if (o.major !== i.major) {
                        return _reject(e);
                    }
                    if (o.major === 0) {
                        if (o.minor === i.minor && o.patch <= i.patch) {
                            return _accept(e);
                        }
                        return _reject(e);
                    }
                    if (o.minor <= i.minor) {
                        return _accept(e);
                    }
                    return _reject(e);
                };
            }
            t._makeCompatibilityCheck = _makeCompatibilityCheck;
            t.isCompatible = _makeCompatibilityCheck(n.VERSION);
        },
        886: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.metrics = void 0;
            const n = r(653);
            t.metrics = n.MetricsAPI.getInstance();
        },
        901: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.ValueType = void 0;
            var r;
            (function(e) {
                e[e["INT"] = 0] = "INT";
                e[e["DOUBLE"] = 1] = "DOUBLE";
            })(r = t.ValueType || (t.ValueType = {}));
        },
        102: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.createNoopMeter = t.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t.NOOP_OBSERVABLE_GAUGE_METRIC = t.NOOP_OBSERVABLE_COUNTER_METRIC = t.NOOP_UP_DOWN_COUNTER_METRIC = t.NOOP_HISTOGRAM_METRIC = t.NOOP_COUNTER_METRIC = t.NOOP_METER = t.NoopObservableUpDownCounterMetric = t.NoopObservableGaugeMetric = t.NoopObservableCounterMetric = t.NoopObservableMetric = t.NoopHistogramMetric = t.NoopUpDownCounterMetric = t.NoopCounterMetric = t.NoopMetric = t.NoopMeter = void 0;
            class NoopMeter {
                constructor(){}
                createHistogram(e, r) {
                    return t.NOOP_HISTOGRAM_METRIC;
                }
                createCounter(e, r) {
                    return t.NOOP_COUNTER_METRIC;
                }
                createUpDownCounter(e, r) {
                    return t.NOOP_UP_DOWN_COUNTER_METRIC;
                }
                createObservableGauge(e, r) {
                    return t.NOOP_OBSERVABLE_GAUGE_METRIC;
                }
                createObservableCounter(e, r) {
                    return t.NOOP_OBSERVABLE_COUNTER_METRIC;
                }
                createObservableUpDownCounter(e, r) {
                    return t.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
                }
                addBatchObservableCallback(e, t) {}
                removeBatchObservableCallback(e) {}
            }
            t.NoopMeter = NoopMeter;
            class NoopMetric {
            }
            t.NoopMetric = NoopMetric;
            class NoopCounterMetric extends NoopMetric {
                add(e, t) {}
            }
            t.NoopCounterMetric = NoopCounterMetric;
            class NoopUpDownCounterMetric extends NoopMetric {
                add(e, t) {}
            }
            t.NoopUpDownCounterMetric = NoopUpDownCounterMetric;
            class NoopHistogramMetric extends NoopMetric {
                record(e, t) {}
            }
            t.NoopHistogramMetric = NoopHistogramMetric;
            class NoopObservableMetric {
                addCallback(e) {}
                removeCallback(e) {}
            }
            t.NoopObservableMetric = NoopObservableMetric;
            class NoopObservableCounterMetric extends NoopObservableMetric {
            }
            t.NoopObservableCounterMetric = NoopObservableCounterMetric;
            class NoopObservableGaugeMetric extends NoopObservableMetric {
            }
            t.NoopObservableGaugeMetric = NoopObservableGaugeMetric;
            class NoopObservableUpDownCounterMetric extends NoopObservableMetric {
            }
            t.NoopObservableUpDownCounterMetric = NoopObservableUpDownCounterMetric;
            t.NOOP_METER = new NoopMeter;
            t.NOOP_COUNTER_METRIC = new NoopCounterMetric;
            t.NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric;
            t.NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric;
            t.NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric;
            t.NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric;
            t.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric;
            function createNoopMeter() {
                return t.NOOP_METER;
            }
            t.createNoopMeter = createNoopMeter;
        },
        660: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NOOP_METER_PROVIDER = t.NoopMeterProvider = void 0;
            const n = r(102);
            class NoopMeterProvider {
                getMeter(e, t, r) {
                    return n.NOOP_METER;
                }
            }
            t.NoopMeterProvider = NoopMeterProvider;
            t.NOOP_METER_PROVIDER = new NoopMeterProvider;
        },
        200: function(e, t, r) {
            var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                if (n === undefined) n = r;
                Object.defineProperty(e, n, {
                    enumerable: true,
                    get: function() {
                        return t[r];
                    }
                });
            } : function(e, t, r, n) {
                if (n === undefined) n = r;
                e[n] = t[r];
            });
            var a = this && this.__exportStar || function(e, t) {
                for(var r in e)if (r !== "default" && !Object.prototype.hasOwnProperty.call(t, r)) n(t, e, r);
            };
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            a(r(46), t);
        },
        651: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t._globalThis = void 0;
            t._globalThis = typeof globalThis === "object" ? globalThis : __webpack_require__.g;
        },
        46: function(e, t, r) {
            var n = this && this.__createBinding || (Object.create ? function(e, t, r, n) {
                if (n === undefined) n = r;
                Object.defineProperty(e, n, {
                    enumerable: true,
                    get: function() {
                        return t[r];
                    }
                });
            } : function(e, t, r, n) {
                if (n === undefined) n = r;
                e[n] = t[r];
            });
            var a = this && this.__exportStar || function(e, t) {
                for(var r in e)if (r !== "default" && !Object.prototype.hasOwnProperty.call(t, r)) n(t, e, r);
            };
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            a(r(651), t);
        },
        939: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.propagation = void 0;
            const n = r(181);
            t.propagation = n.PropagationAPI.getInstance();
        },
        874: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NoopTextMapPropagator = void 0;
            class NoopTextMapPropagator {
                inject(e, t) {}
                extract(e, t) {
                    return e;
                }
                fields() {
                    return [];
                }
            }
            t.NoopTextMapPropagator = NoopTextMapPropagator;
        },
        194: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.defaultTextMapSetter = t.defaultTextMapGetter = void 0;
            t.defaultTextMapGetter = {
                get (e, t) {
                    if (e == null) {
                        return undefined;
                    }
                    return e[t];
                },
                keys (e) {
                    if (e == null) {
                        return [];
                    }
                    return Object.keys(e);
                }
            };
            t.defaultTextMapSetter = {
                set (e, t, r) {
                    if (e == null) {
                        return;
                    }
                    e[t] = r;
                }
            };
        },
        845: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.trace = void 0;
            const n = r(997);
            t.trace = n.TraceAPI.getInstance();
        },
        403: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NonRecordingSpan = void 0;
            const n = r(476);
            class NonRecordingSpan {
                constructor(e = n.INVALID_SPAN_CONTEXT){
                    this._spanContext = e;
                }
                spanContext() {
                    return this._spanContext;
                }
                setAttribute(e, t) {
                    return this;
                }
                setAttributes(e) {
                    return this;
                }
                addEvent(e, t) {
                    return this;
                }
                setStatus(e) {
                    return this;
                }
                updateName(e) {
                    return this;
                }
                end(e) {}
                isRecording() {
                    return false;
                }
                recordException(e, t) {}
            }
            t.NonRecordingSpan = NonRecordingSpan;
        },
        614: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NoopTracer = void 0;
            const n = r(491);
            const a = r(607);
            const o = r(403);
            const i = r(139);
            const c = n.ContextAPI.getInstance();
            class NoopTracer {
                startSpan(e, t, r = c.active()) {
                    const n = Boolean(t === null || t === void 0 ? void 0 : t.root);
                    if (n) {
                        return new o.NonRecordingSpan;
                    }
                    const s = r && (0, a.getSpanContext)(r);
                    if (isSpanContext(s) && (0, i.isSpanContextValid)(s)) {
                        return new o.NonRecordingSpan(s);
                    } else {
                        return new o.NonRecordingSpan;
                    }
                }
                startActiveSpan(e, t, r, n) {
                    let o;
                    let i;
                    let s;
                    if (arguments.length < 2) {
                        return;
                    } else if (arguments.length === 2) {
                        s = t;
                    } else if (arguments.length === 3) {
                        o = t;
                        s = r;
                    } else {
                        o = t;
                        i = r;
                        s = n;
                    }
                    const u = i !== null && i !== void 0 ? i : c.active();
                    const l = this.startSpan(e, o, u);
                    const g = (0, a.setSpan)(u, l);
                    return c.with(g, s, undefined, l);
                }
            }
            t.NoopTracer = NoopTracer;
            function isSpanContext(e) {
                return typeof e === "object" && typeof e["spanId"] === "string" && typeof e["traceId"] === "string" && typeof e["traceFlags"] === "number";
            }
        },
        124: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.NoopTracerProvider = void 0;
            const n = r(614);
            class NoopTracerProvider {
                getTracer(e, t, r) {
                    return new n.NoopTracer;
                }
            }
            t.NoopTracerProvider = NoopTracerProvider;
        },
        125: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.ProxyTracer = void 0;
            const n = r(614);
            const a = new n.NoopTracer;
            class ProxyTracer {
                constructor(e, t, r, n){
                    this._provider = e;
                    this.name = t;
                    this.version = r;
                    this.options = n;
                }
                startSpan(e, t, r) {
                    return this._getTracer().startSpan(e, t, r);
                }
                startActiveSpan(e, t, r, n) {
                    const a = this._getTracer();
                    return Reflect.apply(a.startActiveSpan, a, arguments);
                }
                _getTracer() {
                    if (this._delegate) {
                        return this._delegate;
                    }
                    const e = this._provider.getDelegateTracer(this.name, this.version, this.options);
                    if (!e) {
                        return a;
                    }
                    this._delegate = e;
                    return this._delegate;
                }
            }
            t.ProxyTracer = ProxyTracer;
        },
        846: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.ProxyTracerProvider = void 0;
            const n = r(125);
            const a = r(124);
            const o = new a.NoopTracerProvider;
            class ProxyTracerProvider {
                getTracer(e, t, r) {
                    var a;
                    return (a = this.getDelegateTracer(e, t, r)) !== null && a !== void 0 ? a : new n.ProxyTracer(this, e, t, r);
                }
                getDelegate() {
                    var e;
                    return (e = this._delegate) !== null && e !== void 0 ? e : o;
                }
                setDelegate(e) {
                    this._delegate = e;
                }
                getDelegateTracer(e, t, r) {
                    var n;
                    return (n = this._delegate) === null || n === void 0 ? void 0 : n.getTracer(e, t, r);
                }
            }
            t.ProxyTracerProvider = ProxyTracerProvider;
        },
        996: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.SamplingDecision = void 0;
            var r;
            (function(e) {
                e[e["NOT_RECORD"] = 0] = "NOT_RECORD";
                e[e["RECORD"] = 1] = "RECORD";
                e[e["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
            })(r = t.SamplingDecision || (t.SamplingDecision = {}));
        },
        607: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.getSpanContext = t.setSpanContext = t.deleteSpan = t.setSpan = t.getActiveSpan = t.getSpan = void 0;
            const n = r(780);
            const a = r(403);
            const o = r(491);
            const i = (0, n.createContextKey)("OpenTelemetry Context Key SPAN");
            function getSpan(e) {
                return e.getValue(i) || undefined;
            }
            t.getSpan = getSpan;
            function getActiveSpan() {
                return getSpan(o.ContextAPI.getInstance().active());
            }
            t.getActiveSpan = getActiveSpan;
            function setSpan(e, t) {
                return e.setValue(i, t);
            }
            t.setSpan = setSpan;
            function deleteSpan(e) {
                return e.deleteValue(i);
            }
            t.deleteSpan = deleteSpan;
            function setSpanContext(e, t) {
                return setSpan(e, new a.NonRecordingSpan(t));
            }
            t.setSpanContext = setSpanContext;
            function getSpanContext(e) {
                var t;
                return (t = getSpan(e)) === null || t === void 0 ? void 0 : t.spanContext();
            }
            t.getSpanContext = getSpanContext;
        },
        325: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.TraceStateImpl = void 0;
            const n = r(564);
            const a = 32;
            const o = 512;
            const i = ",";
            const c = "=";
            class TraceStateImpl {
                constructor(e){
                    this._internalState = new Map;
                    if (e) this._parse(e);
                }
                set(e, t) {
                    const r = this._clone();
                    if (r._internalState.has(e)) {
                        r._internalState.delete(e);
                    }
                    r._internalState.set(e, t);
                    return r;
                }
                unset(e) {
                    const t = this._clone();
                    t._internalState.delete(e);
                    return t;
                }
                get(e) {
                    return this._internalState.get(e);
                }
                serialize() {
                    return this._keys().reduce((e, t)=>{
                        e.push(t + c + this.get(t));
                        return e;
                    }, []).join(i);
                }
                _parse(e) {
                    if (e.length > o) return;
                    this._internalState = e.split(i).reverse().reduce((e, t)=>{
                        const r = t.trim();
                        const a = r.indexOf(c);
                        if (a !== -1) {
                            const o = r.slice(0, a);
                            const i = r.slice(a + 1, t.length);
                            if ((0, n.validateKey)(o) && (0, n.validateValue)(i)) {
                                e.set(o, i);
                            } else {}
                        }
                        return e;
                    }, new Map);
                    if (this._internalState.size > a) {
                        this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, a));
                    }
                }
                _keys() {
                    return Array.from(this._internalState.keys()).reverse();
                }
                _clone() {
                    const e = new TraceStateImpl;
                    e._internalState = new Map(this._internalState);
                    return e;
                }
            }
            t.TraceStateImpl = TraceStateImpl;
        },
        564: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.validateValue = t.validateKey = void 0;
            const r = "[_0-9a-z-*/]";
            const n = `[a-z]${r}{0,255}`;
            const a = `[a-z0-9]${r}{0,240}@[a-z]${r}{0,13}`;
            const o = new RegExp(`^(?:${n}|${a})$`);
            const i = /^[ -~]{0,255}[!-~]$/;
            const c = /,|=/;
            function validateKey(e) {
                return o.test(e);
            }
            t.validateKey = validateKey;
            function validateValue(e) {
                return i.test(e) && !c.test(e);
            }
            t.validateValue = validateValue;
        },
        98: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.createTraceState = void 0;
            const n = r(325);
            function createTraceState(e) {
                return new n.TraceStateImpl(e);
            }
            t.createTraceState = createTraceState;
        },
        476: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.INVALID_SPAN_CONTEXT = t.INVALID_TRACEID = t.INVALID_SPANID = void 0;
            const n = r(475);
            t.INVALID_SPANID = "0000000000000000";
            t.INVALID_TRACEID = "00000000000000000000000000000000";
            t.INVALID_SPAN_CONTEXT = {
                traceId: t.INVALID_TRACEID,
                spanId: t.INVALID_SPANID,
                traceFlags: n.TraceFlags.NONE
            };
        },
        357: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.SpanKind = void 0;
            var r;
            (function(e) {
                e[e["INTERNAL"] = 0] = "INTERNAL";
                e[e["SERVER"] = 1] = "SERVER";
                e[e["CLIENT"] = 2] = "CLIENT";
                e[e["PRODUCER"] = 3] = "PRODUCER";
                e[e["CONSUMER"] = 4] = "CONSUMER";
            })(r = t.SpanKind || (t.SpanKind = {}));
        },
        139: (e, t, r)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.wrapSpanContext = t.isSpanContextValid = t.isValidSpanId = t.isValidTraceId = void 0;
            const n = r(476);
            const a = r(403);
            const o = /^([0-9a-f]{32})$/i;
            const i = /^[0-9a-f]{16}$/i;
            function isValidTraceId(e) {
                return o.test(e) && e !== n.INVALID_TRACEID;
            }
            t.isValidTraceId = isValidTraceId;
            function isValidSpanId(e) {
                return i.test(e) && e !== n.INVALID_SPANID;
            }
            t.isValidSpanId = isValidSpanId;
            function isSpanContextValid(e) {
                return isValidTraceId(e.traceId) && isValidSpanId(e.spanId);
            }
            t.isSpanContextValid = isSpanContextValid;
            function wrapSpanContext(e) {
                return new a.NonRecordingSpan(e);
            }
            t.wrapSpanContext = wrapSpanContext;
        },
        847: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.SpanStatusCode = void 0;
            var r;
            (function(e) {
                e[e["UNSET"] = 0] = "UNSET";
                e[e["OK"] = 1] = "OK";
                e[e["ERROR"] = 2] = "ERROR";
            })(r = t.SpanStatusCode || (t.SpanStatusCode = {}));
        },
        475: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.TraceFlags = void 0;
            var r;
            (function(e) {
                e[e["NONE"] = 0] = "NONE";
                e[e["SAMPLED"] = 1] = "SAMPLED";
            })(r = t.TraceFlags || (t.TraceFlags = {}));
        },
        521: (e, t)=>{
            Object.defineProperty(t, "__esModule", {
                value: true
            });
            t.VERSION = void 0;
            t.VERSION = "1.6.0";
        }
    };
    var t = {};
    function __nccwpck_require__(r) {
        var n = t[r];
        if (n !== undefined) {
            return n.exports;
        }
        var a = t[r] = {
            exports: {}
        };
        var o = true;
        try {
            e[r].call(a.exports, a, a.exports, __nccwpck_require__);
            o = false;
        } finally{
            if (o) delete t[r];
        }
        return a.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var r = {};
    (()=>{
        var e = r;
        Object.defineProperty(e, "__esModule", {
            value: true
        });
        e.trace = e.propagation = e.metrics = e.diag = e.context = e.INVALID_SPAN_CONTEXT = e.INVALID_TRACEID = e.INVALID_SPANID = e.isValidSpanId = e.isValidTraceId = e.isSpanContextValid = e.createTraceState = e.TraceFlags = e.SpanStatusCode = e.SpanKind = e.SamplingDecision = e.ProxyTracerProvider = e.ProxyTracer = e.defaultTextMapSetter = e.defaultTextMapGetter = e.ValueType = e.createNoopMeter = e.DiagLogLevel = e.DiagConsoleLogger = e.ROOT_CONTEXT = e.createContextKey = e.baggageEntryMetadataFromString = void 0;
        var t = __nccwpck_require__(369);
        Object.defineProperty(e, "baggageEntryMetadataFromString", {
            enumerable: true,
            get: function() {
                return t.baggageEntryMetadataFromString;
            }
        });
        var n = __nccwpck_require__(780);
        Object.defineProperty(e, "createContextKey", {
            enumerable: true,
            get: function() {
                return n.createContextKey;
            }
        });
        Object.defineProperty(e, "ROOT_CONTEXT", {
            enumerable: true,
            get: function() {
                return n.ROOT_CONTEXT;
            }
        });
        var a = __nccwpck_require__(972);
        Object.defineProperty(e, "DiagConsoleLogger", {
            enumerable: true,
            get: function() {
                return a.DiagConsoleLogger;
            }
        });
        var o = __nccwpck_require__(957);
        Object.defineProperty(e, "DiagLogLevel", {
            enumerable: true,
            get: function() {
                return o.DiagLogLevel;
            }
        });
        var i = __nccwpck_require__(102);
        Object.defineProperty(e, "createNoopMeter", {
            enumerable: true,
            get: function() {
                return i.createNoopMeter;
            }
        });
        var c = __nccwpck_require__(901);
        Object.defineProperty(e, "ValueType", {
            enumerable: true,
            get: function() {
                return c.ValueType;
            }
        });
        var s = __nccwpck_require__(194);
        Object.defineProperty(e, "defaultTextMapGetter", {
            enumerable: true,
            get: function() {
                return s.defaultTextMapGetter;
            }
        });
        Object.defineProperty(e, "defaultTextMapSetter", {
            enumerable: true,
            get: function() {
                return s.defaultTextMapSetter;
            }
        });
        var u = __nccwpck_require__(125);
        Object.defineProperty(e, "ProxyTracer", {
            enumerable: true,
            get: function() {
                return u.ProxyTracer;
            }
        });
        var l = __nccwpck_require__(846);
        Object.defineProperty(e, "ProxyTracerProvider", {
            enumerable: true,
            get: function() {
                return l.ProxyTracerProvider;
            }
        });
        var g = __nccwpck_require__(996);
        Object.defineProperty(e, "SamplingDecision", {
            enumerable: true,
            get: function() {
                return g.SamplingDecision;
            }
        });
        var p = __nccwpck_require__(357);
        Object.defineProperty(e, "SpanKind", {
            enumerable: true,
            get: function() {
                return p.SpanKind;
            }
        });
        var d = __nccwpck_require__(847);
        Object.defineProperty(e, "SpanStatusCode", {
            enumerable: true,
            get: function() {
                return d.SpanStatusCode;
            }
        });
        var _ = __nccwpck_require__(475);
        Object.defineProperty(e, "TraceFlags", {
            enumerable: true,
            get: function() {
                return _.TraceFlags;
            }
        });
        var f = __nccwpck_require__(98);
        Object.defineProperty(e, "createTraceState", {
            enumerable: true,
            get: function() {
                return f.createTraceState;
            }
        });
        var b = __nccwpck_require__(139);
        Object.defineProperty(e, "isSpanContextValid", {
            enumerable: true,
            get: function() {
                return b.isSpanContextValid;
            }
        });
        Object.defineProperty(e, "isValidTraceId", {
            enumerable: true,
            get: function() {
                return b.isValidTraceId;
            }
        });
        Object.defineProperty(e, "isValidSpanId", {
            enumerable: true,
            get: function() {
                return b.isValidSpanId;
            }
        });
        var v = __nccwpck_require__(476);
        Object.defineProperty(e, "INVALID_SPANID", {
            enumerable: true,
            get: function() {
                return v.INVALID_SPANID;
            }
        });
        Object.defineProperty(e, "INVALID_TRACEID", {
            enumerable: true,
            get: function() {
                return v.INVALID_TRACEID;
            }
        });
        Object.defineProperty(e, "INVALID_SPAN_CONTEXT", {
            enumerable: true,
            get: function() {
                return v.INVALID_SPAN_CONTEXT;
            }
        });
        const O = __nccwpck_require__(67);
        Object.defineProperty(e, "context", {
            enumerable: true,
            get: function() {
                return O.context;
            }
        });
        const P = __nccwpck_require__(506);
        Object.defineProperty(e, "diag", {
            enumerable: true,
            get: function() {
                return P.diag;
            }
        });
        const N = __nccwpck_require__(886);
        Object.defineProperty(e, "metrics", {
            enumerable: true,
            get: function() {
                return N.metrics;
            }
        });
        const S = __nccwpck_require__(939);
        Object.defineProperty(e, "propagation", {
            enumerable: true,
            get: function() {
                return S.propagation;
            }
        });
        const C = __nccwpck_require__(845);
        Object.defineProperty(e, "trace", {
            enumerable: true,
            get: function() {
                return C.trace;
            }
        });
        e["default"] = {
            context: O.context,
            diag: P.diag,
            metrics: N.metrics,
            propagation: S.propagation,
            trace: C.trace
        };
    })();
    module.exports = r;
})();


/***/ }),

/***/ 765:
/***/ ((module) => {

"use strict";
var __dirname = "/";

(()=>{
    "use strict";
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    var e = {};
    (()=>{
        var r = e;
        /*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ r.parse = parse;
        r.serialize = serialize;
        var i = decodeURIComponent;
        var t = encodeURIComponent;
        var a = /; */;
        var n = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        function parse(e, r) {
            if (typeof e !== "string") {
                throw new TypeError("argument str must be a string");
            }
            var t = {};
            var n = r || {};
            var o = e.split(a);
            var s = n.decode || i;
            for(var p = 0; p < o.length; p++){
                var f = o[p];
                var u = f.indexOf("=");
                if (u < 0) {
                    continue;
                }
                var v = f.substr(0, u).trim();
                var c = f.substr(++u, f.length).trim();
                if ('"' == c[0]) {
                    c = c.slice(1, -1);
                }
                if (undefined == t[v]) {
                    t[v] = tryDecode(c, s);
                }
            }
            return t;
        }
        function serialize(e, r, i) {
            var a = i || {};
            var o = a.encode || t;
            if (typeof o !== "function") {
                throw new TypeError("option encode is invalid");
            }
            if (!n.test(e)) {
                throw new TypeError("argument name is invalid");
            }
            var s = o(r);
            if (s && !n.test(s)) {
                throw new TypeError("argument val is invalid");
            }
            var p = e + "=" + s;
            if (null != a.maxAge) {
                var f = a.maxAge - 0;
                if (isNaN(f) || !isFinite(f)) {
                    throw new TypeError("option maxAge is invalid");
                }
                p += "; Max-Age=" + Math.floor(f);
            }
            if (a.domain) {
                if (!n.test(a.domain)) {
                    throw new TypeError("option domain is invalid");
                }
                p += "; Domain=" + a.domain;
            }
            if (a.path) {
                if (!n.test(a.path)) {
                    throw new TypeError("option path is invalid");
                }
                p += "; Path=" + a.path;
            }
            if (a.expires) {
                if (typeof a.expires.toUTCString !== "function") {
                    throw new TypeError("option expires is invalid");
                }
                p += "; Expires=" + a.expires.toUTCString();
            }
            if (a.httpOnly) {
                p += "; HttpOnly";
            }
            if (a.secure) {
                p += "; Secure";
            }
            if (a.sameSite) {
                var u = typeof a.sameSite === "string" ? a.sameSite.toLowerCase() : a.sameSite;
                switch(u){
                    case true:
                        p += "; SameSite=Strict";
                        break;
                    case "lax":
                        p += "; SameSite=Lax";
                        break;
                    case "strict":
                        p += "; SameSite=Strict";
                        break;
                    case "none":
                        p += "; SameSite=None";
                        break;
                    default:
                        throw new TypeError("option sameSite is invalid");
                }
            }
            return p;
        }
        function tryDecode(e, r) {
            try {
                return r(e);
            } catch (r) {
                return e;
            }
        }
    })();
    module.exports = e;
})();


/***/ }),

/***/ 1813:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  headers: () => (/* reexport */ headers_headers)
});

// UNUSED EXPORTS: cookies, draftMode

// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/spec-extension/adapters/request-cookies.js
var request_cookies = __webpack_require__(4984);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/spec-extension/adapters/headers.js
var headers = __webpack_require__(8924);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/server/web/spec-extension/cookies.js
var cookies = __webpack_require__(9782);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/request-async-storage.external.js
var request_async_storage_external = __webpack_require__(3992);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/action-async-storage.external.js
var action_async_storage_external = __webpack_require__(7013);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/hooks-server-context.js
const DYNAMIC_ERROR_CODE = "DYNAMIC_SERVER_USAGE";
class DynamicServerError extends Error {
    constructor(description){
        super("Dynamic server usage: " + description);
        this.description = description;
        this.digest = DYNAMIC_ERROR_CODE;
    }
}
function isDynamicServerError(err) {
    if (typeof err !== "object" || err === null || !("digest" in err) || typeof err.digest !== "string") {
        return false;
    }
    return err.digest === DYNAMIC_ERROR_CODE;
} //# sourceMappingURL=hooks-server-context.js.map

// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/static-generation-async-storage.external.js
var static_generation_async_storage_external = __webpack_require__(261);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/static-generation-bailout.js


const NEXT_STATIC_GEN_BAILOUT = "NEXT_STATIC_GEN_BAILOUT";
class StaticGenBailoutError extends Error {
    constructor(...args){
        super(...args);
        this.code = NEXT_STATIC_GEN_BAILOUT;
    }
}
function isStaticGenBailoutError(error) {
    if (typeof error !== "object" || error === null || !("code" in error)) {
        return false;
    }
    return error.code === NEXT_STATIC_GEN_BAILOUT;
}
function formatErrorMessage(reason, opts) {
    const { dynamic, link } = opts || {};
    const suffix = link ? " See more info here: " + link : "";
    return "Page" + (dynamic ? ' with `dynamic = "' + dynamic + '"`' : "") + " couldn't be rendered statically because it used `" + reason + "`." + suffix;
}
const static_generation_bailout_staticGenerationBailout = (reason, param)=>{
    let { dynamic, link } = param === void 0 ? {} : param;
    const staticGenerationStore = static_generation_async_storage_external/* staticGenerationAsyncStorage */.A.getStore();
    if (!staticGenerationStore) return false;
    if (staticGenerationStore.forceStatic) {
        return true;
    }
    if (staticGenerationStore.dynamicShouldError) {
        throw new StaticGenBailoutError(formatErrorMessage(reason, {
            link,
            dynamic: dynamic != null ? dynamic : "error"
        }));
    }
    const message = formatErrorMessage(reason, {
        dynamic,
        // this error should be caught by Next to bail out of static generation
        // in case it's uncaught, this link provides some additional context as to why
        link: "https://nextjs.org/docs/messages/dynamic-server-error"
    });
    // If postpone is available, we should postpone the render.
    staticGenerationStore.postpone == null ? void 0 : staticGenerationStore.postpone.call(staticGenerationStore, reason);
    // As this is a bailout, we don't want to revalidate, so set the revalidate
    // to 0.
    staticGenerationStore.revalidate = 0;
    if (staticGenerationStore.isStaticGeneration) {
        const err = new DynamicServerError(message);
        staticGenerationStore.dynamicUsageDescription = reason;
        staticGenerationStore.dynamicUsageStack = err.stack;
        throw err;
    }
    return false;
}; //# sourceMappingURL=static-generation-bailout.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/draft-mode.js

class draft_mode_DraftMode {
    get isEnabled() {
        return this._provider.isEnabled;
    }
    enable() {
        if (staticGenerationBailout("draftMode().enable()")) {
            return;
        }
        return this._provider.enable();
    }
    disable() {
        if (staticGenerationBailout("draftMode().disable()")) {
            return;
        }
        return this._provider.disable();
    }
    constructor(provider){
        this._provider = provider;
    }
} //# sourceMappingURL=draft-mode.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/headers.js







function headers_headers() {
    if (static_generation_bailout_staticGenerationBailout("headers", {
        link: "https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering"
    })) {
        return headers/* HeadersAdapter */.h.seal(new Headers({}));
    }
    const requestStore = request_async_storage_external/* requestAsyncStorage */.F.getStore();
    if (!requestStore) {
        throw new Error("Invariant: headers() expects to have requestAsyncStorage, none available.");
    }
    return requestStore.headers;
}
function headers_cookies() {
    if (staticGenerationBailout("cookies", {
        link: "https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering"
    })) {
        return RequestCookiesAdapter.seal(new RequestCookies(new Headers({})));
    }
    const requestStore = requestAsyncStorage.getStore();
    if (!requestStore) {
        throw new Error("Invariant: cookies() expects to have requestAsyncStorage, none available.");
    }
    const asyncActionStore = actionAsyncStorage.getStore();
    if (asyncActionStore && (asyncActionStore.isAction || asyncActionStore.isAppRoute)) {
        // We can't conditionally return different types here based on the context.
        // To avoid confusion, we always return the readonly type here.
        return requestStore.mutableCookies;
    }
    return requestStore.cookies;
}
function draftMode() {
    const requestStore = requestAsyncStorage.getStore();
    if (!requestStore) {
        throw new Error("Invariant: draftMode() expects to have requestAsyncStorage, none available.");
    }
    return new DraftMode(requestStore.draftMode);
} //# sourceMappingURL=headers.js.map

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/api/headers.js
 //# sourceMappingURL=headers.js.map


/***/ }),

/***/ 7013:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* unused harmony export actionAsyncStorage */
/* harmony import */ var _async_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2237);

const actionAsyncStorage = (0,_async_local_storage__WEBPACK_IMPORTED_MODULE_0__/* .createAsyncLocalStorage */ .P)(); //# sourceMappingURL=action-async-storage.external.js.map


/***/ }),

/***/ 9977:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  bailoutToClientRendering: () => (/* binding */ bailoutToClientRendering)
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/shared/lib/lazy-dynamic/bailout-to-csr.js
// This has to be a shared module which is shared between client component error boundary and dynamic component
const BAILOUT_TO_CSR = "BAILOUT_TO_CLIENT_SIDE_RENDERING";
/** An error that should be thrown when we want to bail out to client-side rendering. */ class BailoutToCSRError extends Error {
    constructor(reason){
        super("Bail out to client-side rendering: " + reason);
        this.reason = reason;
        this.digest = BAILOUT_TO_CSR;
    }
}
/** Checks if a passed argument is an error that is thrown if we want to bail out to client-side rendering. */ function isBailoutToCSRError(err) {
    if (typeof err !== "object" || err === null || !("digest" in err)) {
        return false;
    }
    return err.digest === BAILOUT_TO_CSR;
} //# sourceMappingURL=bailout-to-csr.js.map

// EXTERNAL MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/static-generation-async-storage.external.js
var static_generation_async_storage_external = __webpack_require__(261);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@14.1.0_@opentelemetry+_95d5a05ac7ec0d735f17a907e734f3d8/node_modules/next/dist/esm/client/components/bailout-to-client-rendering.js


function bailoutToClientRendering(reason) {
    const staticGenerationStore = static_generation_async_storage_external/* staticGenerationAsyncStorage */.A.getStore();
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.forceStatic) return;
    if (staticGenerationStore == null ? void 0 : staticGenerationStore.isStaticGeneration) throw new BailoutToCSRError(reason);
} //# sourceMappingURL=bailout-to-client-rendering.js.map


/***/ }),

/***/ 3992:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ requestAsyncStorage)
/* harmony export */ });
/* harmony import */ var _async_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2237);

const requestAsyncStorage = (0,_async_local_storage__WEBPACK_IMPORTED_MODULE_0__/* .createAsyncLocalStorage */ .P)(); //# sourceMappingURL=request-async-storage.external.js.map


/***/ }),

/***/ 261:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ staticGenerationAsyncStorage)
/* harmony export */ });
/* harmony import */ var _async_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2237);

const staticGenerationAsyncStorage = (0,_async_local_storage__WEBPACK_IMPORTED_MODULE_0__/* .createAsyncLocalStorage */ .P)(); //# sourceMappingURL=static-generation-async-storage.external.js.map


/***/ }),

/***/ 8924:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ HeadersAdapter)
/* harmony export */ });
/* unused harmony export ReadonlyHeadersError */
/* harmony import */ var _reflect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3433);

/**
 * @internal
 */ class ReadonlyHeadersError extends Error {
    constructor(){
        super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
    }
    static callable() {
        throw new ReadonlyHeadersError();
    }
}
class HeadersAdapter extends Headers {
    constructor(headers){
        // We've already overridden the methods that would be called, so we're just
        // calling the super constructor to ensure that the instanceof check works.
        super();
        this.headers = new Proxy(headers, {
            get (target, prop, receiver) {
                // Because this is just an object, we expect that all "get" operations
                // are for properties. If it's a "get" for a symbol, we'll just return
                // the symbol.
                if (typeof prop === "symbol") {
                    return _reflect__WEBPACK_IMPORTED_MODULE_0__/* .ReflectAdapter */ .g.get(target, prop, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return undefined.
                if (typeof original === "undefined") return;
                // If the original casing exists, return the value.
                return _reflect__WEBPACK_IMPORTED_MODULE_0__/* .ReflectAdapter */ .g.get(target, original, receiver);
            },
            set (target, prop, value, receiver) {
                if (typeof prop === "symbol") {
                    return _reflect__WEBPACK_IMPORTED_MODULE_0__/* .ReflectAdapter */ .g.set(target, prop, value, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, use the prop as the key.
                return _reflect__WEBPACK_IMPORTED_MODULE_0__/* .ReflectAdapter */ .g.set(target, original ?? prop, value, receiver);
            },
            has (target, prop) {
                if (typeof prop === "symbol") return _reflect__WEBPACK_IMPORTED_MODULE_0__/* .ReflectAdapter */ .g.has(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return false.
                if (typeof original === "undefined") return false;
                // If the original casing exists, return true.
                return _reflect__WEBPACK_IMPORTED_MODULE_0__/* .ReflectAdapter */ .g.has(target, original);
            },
            deleteProperty (target, prop) {
                if (typeof prop === "symbol") return _reflect__WEBPACK_IMPORTED_MODULE_0__/* .ReflectAdapter */ .g.deleteProperty(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return true.
                if (typeof original === "undefined") return true;
                // If the original casing exists, delete the property.
                return _reflect__WEBPACK_IMPORTED_MODULE_0__/* .ReflectAdapter */ .g.deleteProperty(target, original);
            }
        });
    }
    /**
   * Seals a Headers instance to prevent modification by throwing an error when
   * any mutating method is called.
   */ static seal(headers) {
        return new Proxy(headers, {
            get (target, prop, receiver) {
                switch(prop){
                    case "append":
                    case "delete":
                    case "set":
                        return ReadonlyHeadersError.callable;
                    default:
                        return _reflect__WEBPACK_IMPORTED_MODULE_0__/* .ReflectAdapter */ .g.get(target, prop, receiver);
                }
            }
        });
    }
    /**
   * Merges a header value into a string. This stores multiple values as an
   * array, so we need to merge them into a string.
   *
   * @param value a header value
   * @returns a merged header value (a string)
   */ merge(value) {
        if (Array.isArray(value)) return value.join(", ");
        return value;
    }
    /**
   * Creates a Headers instance from a plain object or a Headers instance.
   *
   * @param headers a plain object or a Headers instance
   * @returns a headers instance
   */ static from(headers) {
        if (headers instanceof Headers) return headers;
        return new HeadersAdapter(headers);
    }
    append(name, value) {
        const existing = this.headers[name];
        if (typeof existing === "string") {
            this.headers[name] = [
                existing,
                value
            ];
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            this.headers[name] = value;
        }
    }
    delete(name) {
        delete this.headers[name];
    }
    get(name) {
        const value = this.headers[name];
        if (typeof value !== "undefined") return this.merge(value);
        return null;
    }
    has(name) {
        return typeof this.headers[name] !== "undefined";
    }
    set(name, value) {
        this.headers[name] = value;
    }
    forEach(callbackfn, thisArg) {
        for (const [name, value] of this.entries()){
            callbackfn.call(thisArg, value, name, this);
        }
    }
    *entries() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(name);
            yield [
                name,
                value
            ];
        }
    }
    *keys() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            yield name;
        }
    }
    *values() {
        for (const key of Object.keys(this.headers)){
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(key);
            yield value;
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
} //# sourceMappingURL=headers.js.map


/***/ }),

/***/ 3433:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ ReflectAdapter)
/* harmony export */ });
class ReflectAdapter {
    static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "function") {
            return value.bind(target);
        }
        return value;
    }
    static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    }
    static has(target, prop) {
        return Reflect.has(target, prop);
    }
    static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
} //# sourceMappingURL=reflect.js.map


/***/ }),

/***/ 4984:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Qb: () => (/* binding */ RequestCookiesAdapter),
/* harmony export */   vr: () => (/* binding */ MutableRequestCookiesAdapter)
/* harmony export */ });
/* unused harmony exports ReadonlyRequestCookiesError, getModifiedCookieValues, appendMutableCookies */
/* harmony import */ var _cookies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9782);
/* harmony import */ var _reflect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3433);


/**
 * @internal
 */ class ReadonlyRequestCookiesError extends Error {
    constructor(){
        super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options");
    }
    static callable() {
        throw new ReadonlyRequestCookiesError();
    }
}
class RequestCookiesAdapter {
    static seal(cookies) {
        return new Proxy(cookies, {
            get (target, prop, receiver) {
                switch(prop){
                    case "clear":
                    case "delete":
                    case "set":
                        return ReadonlyRequestCookiesError.callable;
                    default:
                        return _reflect__WEBPACK_IMPORTED_MODULE_1__/* .ReflectAdapter */ .g.get(target, prop, receiver);
                }
            }
        });
    }
}
const SYMBOL_MODIFY_COOKIE_VALUES = Symbol.for("next.mutated.cookies");
function getModifiedCookieValues(cookies) {
    const modified = cookies[SYMBOL_MODIFY_COOKIE_VALUES];
    if (!modified || !Array.isArray(modified) || modified.length === 0) {
        return [];
    }
    return modified;
}
function appendMutableCookies(headers, mutableCookies) {
    const modifiedCookieValues = getModifiedCookieValues(mutableCookies);
    if (modifiedCookieValues.length === 0) {
        return false;
    }
    // Return a new response that extends the response with
    // the modified cookies as fallbacks. `res` cookies
    // will still take precedence.
    const resCookies = new ResponseCookies(headers);
    const returnedCookies = resCookies.getAll();
    // Set the modified cookies as fallbacks.
    for (const cookie of modifiedCookieValues){
        resCookies.set(cookie);
    }
    // Set the original cookies as the final values.
    for (const cookie of returnedCookies){
        resCookies.set(cookie);
    }
    return true;
}
class MutableRequestCookiesAdapter {
    static wrap(cookies, onUpdateCookies) {
        const responseCookies = new _cookies__WEBPACK_IMPORTED_MODULE_0__/* .ResponseCookies */ .n(new Headers());
        for (const cookie of cookies.getAll()){
            responseCookies.set(cookie);
        }
        let modifiedValues = [];
        const modifiedCookies = new Set();
        const updateResponseCookies = ()=>{
            var _fetch___nextGetStaticStore;
            // TODO-APP: change method of getting staticGenerationAsyncStore
            const staticGenerationAsyncStore = fetch.__nextGetStaticStore == null ? void 0 : (_fetch___nextGetStaticStore = fetch.__nextGetStaticStore.call(fetch)) == null ? void 0 : _fetch___nextGetStaticStore.getStore();
            if (staticGenerationAsyncStore) {
                staticGenerationAsyncStore.pathWasRevalidated = true;
            }
            const allCookies = responseCookies.getAll();
            modifiedValues = allCookies.filter((c)=>modifiedCookies.has(c.name));
            if (onUpdateCookies) {
                const serializedCookies = [];
                for (const cookie of modifiedValues){
                    const tempCookies = new _cookies__WEBPACK_IMPORTED_MODULE_0__/* .ResponseCookies */ .n(new Headers());
                    tempCookies.set(cookie);
                    serializedCookies.push(tempCookies.toString());
                }
                onUpdateCookies(serializedCookies);
            }
        };
        return new Proxy(responseCookies, {
            get (target, prop, receiver) {
                switch(prop){
                    // A special symbol to get the modified cookie values
                    case SYMBOL_MODIFY_COOKIE_VALUES:
                        return modifiedValues;
                    // TODO: Throw error if trying to set a cookie after the response
                    // headers have been set.
                    case "delete":
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === "string" ? args[0] : args[0].name);
                            try {
                                target.delete(...args);
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    case "set":
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === "string" ? args[0] : args[0].name);
                            try {
                                return target.set(...args);
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    default:
                        return _reflect__WEBPACK_IMPORTED_MODULE_1__/* .ReflectAdapter */ .g.get(target, prop, receiver);
                }
            }
        });
    }
} //# sourceMappingURL=request-cookies.js.map


/***/ }),

/***/ 9782:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   n: () => (/* reexport safe */ next_dist_compiled_edge_runtime_cookies__WEBPACK_IMPORTED_MODULE_0__.ResponseCookies),
/* harmony export */   q: () => (/* reexport safe */ next_dist_compiled_edge_runtime_cookies__WEBPACK_IMPORTED_MODULE_0__.RequestCookies)
/* harmony export */ });
/* harmony import */ var next_dist_compiled_edge_runtime_cookies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9652);
/* harmony import */ var next_dist_compiled_edge_runtime_cookies__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_compiled_edge_runtime_cookies__WEBPACK_IMPORTED_MODULE_0__);
 //# sourceMappingURL=cookies.js.map


/***/ }),

/***/ 6455:
/***/ ((module) => {

"use strict";
// Note: This file is JS because it's used by the taskfile-swc.js file, which is JS.
// Keep file changes in sync with the corresponding `.d.ts` files.
/**
 * These are the browser versions that support all of the following:
 * static import: https://caniuse.com/es6-module
 * dynamic import: https://caniuse.com/es6-module-dynamic-import
 * import.meta: https://caniuse.com/mdn-javascript_operators_import_meta
 */ 
const MODERN_BROWSERSLIST_TARGET = [
    "chrome 64",
    "edge 79",
    "firefox 67",
    "opera 51",
    "safari 12"
];
module.exports = MODERN_BROWSERSLIST_TARGET; //# sourceMappingURL=modern-browserslist-target.js.map


/***/ }),

/***/ 842:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    withRequest: function() {
        return withRequest;
    },
    getTestReqInfo: function() {
        return getTestReqInfo;
    }
});
const _nodeasync_hooks = __webpack_require__(2067);
const testStorage = new _nodeasync_hooks.AsyncLocalStorage();
function extractTestInfoFromRequest(req, reader) {
    const proxyPortHeader = reader.header(req, "next-test-proxy-port");
    if (!proxyPortHeader) {
        return undefined;
    }
    const url = reader.url(req);
    const proxyPort = Number(proxyPortHeader);
    const testData = reader.header(req, "next-test-data") || "";
    return {
        url,
        proxyPort,
        testData
    };
}
function withRequest(req, reader, fn) {
    const testReqInfo = extractTestInfoFromRequest(req, reader);
    if (!testReqInfo) {
        return fn();
    }
    return testStorage.run(testReqInfo, fn);
}
function getTestReqInfo(req, reader) {
    const testReqInfo = testStorage.getStore();
    if (testReqInfo) {
        return testReqInfo;
    }
    if (req && reader) {
        return extractTestInfoFromRequest(req, reader);
    }
    return undefined;
} //# sourceMappingURL=context.js.map


/***/ }),

/***/ 9956:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(6195)["Buffer"];

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    reader: function() {
        return reader;
    },
    handleFetch: function() {
        return handleFetch;
    },
    interceptFetch: function() {
        return interceptFetch;
    }
});
const _context = __webpack_require__(842);
const reader = {
    url (req) {
        return req.url;
    },
    header (req, name) {
        return req.headers.get(name);
    }
};
function getTestStack() {
    let stack = (new Error().stack ?? "").split("\n");
    // Skip the first line and find first non-empty line.
    for(let i = 1; i < stack.length; i++){
        if (stack[i].length > 0) {
            stack = stack.slice(i);
            break;
        }
    }
    // Filter out franmework lines.
    stack = stack.filter((f)=>!f.includes("/next/dist/"));
    // At most 5 lines.
    stack = stack.slice(0, 5);
    // Cleanup some internal info and trim.
    stack = stack.map((s)=>s.replace("webpack-internal:///(rsc)/", "").trim());
    return stack.join("    ");
}
async function buildProxyRequest(testData, request) {
    const { url, method, headers, body, cache, credentials, integrity, mode, redirect, referrer, referrerPolicy } = request;
    return {
        testData,
        api: "fetch",
        request: {
            url,
            method,
            headers: [
                ...Array.from(headers),
                [
                    "next-test-stack",
                    getTestStack()
                ]
            ],
            body: body ? Buffer.from(await request.arrayBuffer()).toString("base64") : null,
            cache,
            credentials,
            integrity,
            mode,
            redirect,
            referrer,
            referrerPolicy
        }
    };
}
function buildResponse(proxyResponse) {
    const { status, headers, body } = proxyResponse.response;
    return new Response(body ? Buffer.from(body, "base64") : null, {
        status,
        headers: new Headers(headers)
    });
}
async function handleFetch(originalFetch, request) {
    const testInfo = (0, _context.getTestReqInfo)(request, reader);
    if (!testInfo) {
        throw new Error(`No test info for ${request.method} ${request.url}`);
    }
    const { testData, proxyPort } = testInfo;
    const proxyRequest = await buildProxyRequest(testData, request);
    const resp = await originalFetch(`http://localhost:${proxyPort}`, {
        method: "POST",
        body: JSON.stringify(proxyRequest),
        next: {
            // @ts-ignore
            internal: true
        }
    });
    if (!resp.ok) {
        throw new Error(`Proxy request failed: ${resp.status}`);
    }
    const proxyResponse = await resp.json();
    const { api } = proxyResponse;
    switch(api){
        case "continue":
            return originalFetch(request);
        case "abort":
        case "unhandled":
            throw new Error(`Proxy request aborted [${request.method} ${request.url}]`);
        default:
            break;
    }
    return buildResponse(proxyResponse);
}
function interceptFetch(originalFetch) {
    __webpack_require__.g.fetch = function testFetch(input, init) {
        var _init_next;
        // Passthrough internal requests.
        // @ts-ignore
        if (init == null ? void 0 : (_init_next = init.next) == null ? void 0 : _init_next.internal) {
            return originalFetch(input, init);
        }
        return handleFetch(originalFetch, new Request(input, init));
    };
    return ()=>{
        __webpack_require__.g.fetch = originalFetch;
    };
} //# sourceMappingURL=fetch.js.map


/***/ }),

/***/ 8939:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    interceptTestApis: function() {
        return interceptTestApis;
    },
    wrapRequestHandler: function() {
        return wrapRequestHandler;
    }
});
const _context = __webpack_require__(842);
const _fetch = __webpack_require__(9956);
function interceptTestApis() {
    return (0, _fetch.interceptFetch)(__webpack_require__.g.fetch);
}
function wrapRequestHandler(handler) {
    return (req, fn)=>(0, _context.withRequest)(req, _fetch.reader, ()=>handler(req, fn));
} //# sourceMappingURL=server-edge.js.map


/***/ }),

/***/ 2329:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ 
var l = Symbol.for("react.element"), n = Symbol.for("react.portal"), p = Symbol.for("react.fragment"), q = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z = Symbol.iterator;
function A(a) {
    if (null === a || "object" !== typeof a) return null;
    a = z && a[z] || a["@@iterator"];
    return "function" === typeof a ? a : null;
}
var B = {
    isMounted: function() {
        return !1;
    },
    enqueueForceUpdate: function() {},
    enqueueReplaceState: function() {},
    enqueueSetState: function() {}
}, C = Object.assign, D = {};
function E(a, b, e) {
    this.props = a;
    this.context = b;
    this.refs = D;
    this.updater = e || B;
}
E.prototype.isReactComponent = {};
E.prototype.setState = function(a, b) {
    if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, b, "setState");
};
E.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {}
F.prototype = E.prototype;
function G(a, b, e) {
    this.props = a;
    this.context = b;
    this.refs = D;
    this.updater = e || B;
}
var H = G.prototype = new F;
H.constructor = G;
C(H, E.prototype);
H.isPureReactComponent = !0;
var I = Array.isArray, J = Object.prototype.hasOwnProperty, K = {
    current: null
}, L = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
};
function M(a, b, e) {
    var d, c = {}, k = null, h = null;
    if (null != b) for(d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b)J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
    var g = arguments.length - 2;
    if (1 === g) c.children = e;
    else if (1 < g) {
        for(var f = Array(g), m = 0; m < g; m++)f[m] = arguments[m + 2];
        c.children = f;
    }
    if (a && a.defaultProps) for(d in g = a.defaultProps, g)void 0 === c[d] && (c[d] = g[d]);
    return {
        $$typeof: l,
        type: a,
        key: k,
        ref: h,
        props: c,
        _owner: K.current
    };
}
function N(a, b) {
    return {
        $$typeof: l,
        type: a.type,
        key: b,
        ref: a.ref,
        props: a.props,
        _owner: a._owner
    };
}
function O(a) {
    return "object" === typeof a && null !== a && a.$$typeof === l;
}
function escape(a) {
    var b = {
        "=": "=0",
        ":": "=2"
    };
    return "$" + a.replace(/[=:]/g, function(a) {
        return b[a];
    });
}
var P = /\/+/g;
function Q(a, b) {
    return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R(a, b, e, d, c) {
    var k = typeof a;
    if ("undefined" === k || "boolean" === k) a = null;
    var h = !1;
    if (null === a) h = !0;
    else switch(k){
        case "string":
        case "number":
            h = !0;
            break;
        case "object":
            switch(a.$$typeof){
                case l:
                case n:
                    h = !0;
            }
    }
    if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a) {
        return a;
    })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
    h = 0;
    d = "" === d ? "." : d + ":";
    if (I(a)) for(var g = 0; g < a.length; g++){
        k = a[g];
        var f = d + Q(k, g);
        h += R(k, b, e, f, c);
    }
    else if (f = A(a), "function" === typeof f) for(a = f.call(a), g = 0; !(k = a.next()).done;)k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
    else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
    return h;
}
function S(a, b, e) {
    if (null == a) return a;
    var d = [], c = 0;
    R(a, d, "", "", function(a) {
        return b.call(e, a, c++);
    });
    return d;
}
function T(a) {
    if (-1 === a._status) {
        var b = a._result;
        b = b();
        b.then(function(b) {
            if (0 === a._status || -1 === a._status) a._status = 1, a._result = b;
        }, function(b) {
            if (0 === a._status || -1 === a._status) a._status = 2, a._result = b;
        });
        -1 === a._status && (a._status = 0, a._result = b);
    }
    if (1 === a._status) return a._result.default;
    throw a._result;
}
var U = {
    current: null
}, V = {
    transition: null
}, W = {
    ReactCurrentDispatcher: U,
    ReactCurrentBatchConfig: V,
    ReactCurrentOwner: K
};
function X() {
    throw Error("act(...) is not supported in production builds of React.");
}
exports.Children = {
    map: S,
    forEach: function(a, b, e) {
        S(a, function() {
            b.apply(this, arguments);
        }, e);
    },
    count: function(a) {
        var b = 0;
        S(a, function() {
            b++;
        });
        return b;
    },
    toArray: function(a) {
        return S(a, function(a) {
            return a;
        }) || [];
    },
    only: function(a) {
        if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
        return a;
    }
};
exports.Component = E;
exports.Fragment = p;
exports.Profiler = r;
exports.PureComponent = G;
exports.StrictMode = q;
exports.Suspense = w;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
exports.act = X;
exports.cloneElement = function(a, b, e) {
    if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var d = C({}, a.props), c = a.key, k = a.ref, h = a._owner;
    if (null != b) {
        void 0 !== b.ref && (k = b.ref, h = K.current);
        void 0 !== b.key && (c = "" + b.key);
        if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
        for(f in b)J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
    }
    var f = arguments.length - 2;
    if (1 === f) d.children = e;
    else if (1 < f) {
        g = Array(f);
        for(var m = 0; m < f; m++)g[m] = arguments[m + 2];
        d.children = g;
    }
    return {
        $$typeof: l,
        type: a.type,
        key: c,
        ref: k,
        props: d,
        _owner: h
    };
};
exports.createContext = function(a) {
    a = {
        $$typeof: u,
        _currentValue: a,
        _currentValue2: a,
        _threadCount: 0,
        Provider: null,
        Consumer: null,
        _defaultValue: null,
        _globalName: null
    };
    a.Provider = {
        $$typeof: t,
        _context: a
    };
    return a.Consumer = a;
};
exports.createElement = M;
exports.createFactory = function(a) {
    var b = M.bind(null, a);
    b.type = a;
    return b;
};
exports.createRef = function() {
    return {
        current: null
    };
};
exports.forwardRef = function(a) {
    return {
        $$typeof: v,
        render: a
    };
};
exports.isValidElement = O;
exports.lazy = function(a) {
    return {
        $$typeof: y,
        _payload: {
            _status: -1,
            _result: a
        },
        _init: T
    };
};
exports.memo = function(a, b) {
    return {
        $$typeof: x,
        type: a,
        compare: void 0 === b ? null : b
    };
};
exports.startTransition = function(a) {
    var b = V.transition;
    V.transition = {};
    try {
        a();
    } finally{
        V.transition = b;
    }
};
exports.unstable_act = X;
exports.useCallback = function(a, b) {
    return U.current.useCallback(a, b);
};
exports.useContext = function(a) {
    return U.current.useContext(a);
};
exports.useDebugValue = function() {};
exports.useDeferredValue = function(a) {
    return U.current.useDeferredValue(a);
};
exports.useEffect = function(a, b) {
    return U.current.useEffect(a, b);
};
exports.useId = function() {
    return U.current.useId();
};
exports.useImperativeHandle = function(a, b, e) {
    return U.current.useImperativeHandle(a, b, e);
};
exports.useInsertionEffect = function(a, b) {
    return U.current.useInsertionEffect(a, b);
};
exports.useLayoutEffect = function(a, b) {
    return U.current.useLayoutEffect(a, b);
};
exports.useMemo = function(a, b) {
    return U.current.useMemo(a, b);
};
exports.useReducer = function(a, b, e) {
    return U.current.useReducer(a, b, e);
};
exports.useRef = function(a) {
    return U.current.useRef(a);
};
exports.useState = function(a) {
    return U.current.useState(a);
};
exports.useSyncExternalStore = function(a, b, e) {
    return U.current.useSyncExternalStore(a, b, e);
};
exports.useTransition = function() {
    return U.current.useTransition();
};
exports.version = "18.3.1";


/***/ }),

/***/ 3169:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

if (true) {
    module.exports = __webpack_require__(2329);
} else {}


/***/ }),

/***/ 2237:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ createAsyncLocalStorage)
/* harmony export */ });
const sharedAsyncLocalStorageNotAvailableError = new Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available");
class FakeAsyncLocalStorage {
    disable() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    getStore() {
        // This fake implementation of AsyncLocalStorage always returns `undefined`.
        return undefined;
    }
    run() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    exit() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
    enterWith() {
        throw sharedAsyncLocalStorageNotAvailableError;
    }
}
const maybeGlobalAsyncLocalStorage = globalThis.AsyncLocalStorage;
function createAsyncLocalStorage() {
    if (maybeGlobalAsyncLocalStorage) {
        return new maybeGlobalAsyncLocalStorage();
    }
    return new FakeAsyncLocalStorage();
} //# sourceMappingURL=async-local-storage.js.map


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(548));
/******/ (_ENTRIES = typeof _ENTRIES === "undefined" ? {} : _ENTRIES).middleware_middleware = __webpack_exports__;
/******/ }
]);
//# sourceMappingURL=middleware.js.map