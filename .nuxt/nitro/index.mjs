import 'unenv/runtime/polyfill/fetch.node';
import { Server } from 'http';
import { parentPort } from 'worker_threads';
import { createApp, useBase } from 'h3';
import { createFetch as createFetch$1 } from 'ohmyfetch';
import destr from 'destr';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { error404, errorDev } from '@nuxt/design';
import { createRenderer } from 'vue-bundle-renderer';
import devalue from '@nuxt/devalue';
import defu from 'defu';
import htmlTemplate from '/Users/nathan/currentWorking/Gudao-platform-api-nuxt-strapi/compise-nuxtjs-hello-world/.nuxt/views/document.template.mjs';
import { createRenderer as createRenderer$1 } from 'vue-server-renderer/build.dev.js';

const _runtimeConfig = {"public":{"_app":{"basePath":"/","assetsPath":"/_nuxt/","cdnURL":null}},"private":{}};
for (const type of ["private", "public"]) {
  for (const key in _runtimeConfig[type]) {
    _runtimeConfig[type][key] = destr(process.env[key] || _runtimeConfig[type][key]);
  }
}
const privateConfig = deepFreeze(defu(_runtimeConfig.private, _runtimeConfig.public));
const publicConfig = deepFreeze(_runtimeConfig.public);
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
function timingMiddleware(_req, res, next) {
  const start = globalTiming.start();
  const _end = res.end;
  res.end = (data, encoding, callback) => {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!res.headersSent) {
      res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(res, data, encoding, callback);
  };
  next();
}

const cwd = process.cwd();
const hasReqHeader = (req, header, includes) => req.headers[header] && req.headers[header].toLowerCase().includes(includes);
function handleError(error, req, res) {
  const isJsonRequest = hasReqHeader(req, "accept", "application/json") || hasReqHeader(req, "user-agent", "curl/") || hasReqHeader(req, "user-agent", "httpie/");
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace(".vue", ".js").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const is404 = error.statusCode === 404;
  const errorObject = {
    statusCode: error.statusCode || 500,
    statusMessage: is404 ? "Page Not Found" : "Internal Server Error",
    description: !is404 ? `
    <h1>${error.message}</h1>
    <pre>${stack.map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n")}</pre>
    ` : ""
  };
  res.statusCode = error.statusCode || 500;
  res.statusMessage = error.statusMessage || "Internal Server Error";
  if (!is404) {
    console.error(error.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest) {
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(errorObject));
  }
  const errorTemplate = is404 ? error404 : errorDev ;
  const html = errorTemplate(errorObject);
  res.end(html);
}

const middleware = [
    
  ];

const app = createApp({
  debug: destr(true),
  onError: handleError
});
app.use(timingMiddleware);
app.use(middleware);
app.use(() => Promise.resolve().then(function () { return render; }).then((e) => e.renderMiddleware), { lazy: true });
app.stack;
const handle = useBase("/", app);
const localCall = createCall(handle);
const localFetch = createFetch(localCall, globalThis.fetch);
const $fetch = createFetch$1({ fetch: localFetch });
globalThis.$fetch = $fetch;

const server = new Server(handle);
const netServer = server.listen(0, () => {
  parentPort.postMessage({
    event: "listen",
    port: netServer.address().port
  });
});

const STATIC_ASSETS_BASE = "/_nuxt/static" + "/" + "1634471997";
const PAYLOAD_JS = "/payload.js";
const getClientManifest = cachedImport(() => import('/Users/nathan/currentWorking/Gudao-platform-api-nuxt-strapi/compise-nuxtjs-hello-world/.nuxt/dist/server/client.manifest.mjs'));
const getSSRApp = cachedImport(() => import('/Users/nathan/currentWorking/Gudao-platform-api-nuxt-strapi/compise-nuxtjs-hello-world/.nuxt/dist/server/server.mjs'));
const getSSRRenderer = cachedResult(async () => {
  const clientManifest = await getClientManifest();
  if (!clientManifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getSSRApp();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const { renderToString: renderToString2 } = await Promise.resolve().then(function () { return vue2; });
  return createRenderer(createSSRApp, { clientManifest, renderToString: renderToString2, publicPath: clientManifest.publicPath || "/_nuxt" }).renderToString;
});
const getSPARenderer = cachedResult(async () => {
  const clientManifest = await getClientManifest();
  return (ssrContext) => {
    ssrContext.nuxt = {};
    return {
      html: '<div id="__nuxt"></div>',
      renderResourceHints: () => "",
      renderStyles: () => "",
      renderScripts: () => clientManifest.initial.map((s) => {
        const isMJS = !s.endsWith(".js");
        return `<script ${isMJS ? 'type="module"' : ""} src="${clientManifest.publicPath}${s}"><\/script>`;
      }).join("")
    };
  };
});
function renderToString$1(ssrContext) {
  const getRenderer = ssrContext.noSSR ? getSPARenderer : getSSRRenderer;
  return getRenderer().then((renderToString2) => renderToString2(ssrContext)).catch((err) => {
    console.warn("Server Side Rendering Error:", err);
    return getSPARenderer().then((renderToString2) => renderToString2(ssrContext));
  });
}
async function renderMiddleware(req, res) {
  let url = req.url;
  let isPayloadReq = false;
  if (url.startsWith(STATIC_ASSETS_BASE) && url.endsWith(PAYLOAD_JS)) {
    isPayloadReq = true;
    url = url.substr(STATIC_ASSETS_BASE.length, url.length - STATIC_ASSETS_BASE.length - PAYLOAD_JS.length) || "/";
  }
  const ssrContext = {
    url,
    req,
    res,
    runtimeConfig: { private: privateConfig, public: publicConfig },
    noSSR: req.spa || req.headers["x-nuxt-no-ssr"],
    ...req.context || {}
  };
  const rendered = await renderToString$1(ssrContext);
  if (ssrContext.error) {
    throw ssrContext.error;
  }
  if (ssrContext.redirected || res.writableEnded) {
    return;
  }
  if (ssrContext.nuxt.hooks) {
    await ssrContext.nuxt.hooks.callHook("app:rendered");
  }
  const payload = ssrContext.payload || ssrContext.nuxt;
  let data;
  if (isPayloadReq) {
    data = renderPayload(payload, url);
    res.setHeader("Content-Type", "text/javascript;charset=UTF-8");
  } else {
    data = await renderHTML(payload, rendered, ssrContext);
    res.setHeader("Content-Type", "text/html;charset=UTF-8");
  }
  const error = ssrContext.nuxt && ssrContext.nuxt.error;
  res.statusCode = error ? error.statusCode : 200;
  res.end(data, "utf-8");
}
async function renderHTML(payload, rendered, ssrContext) {
  const state = `<script>window.__NUXT__=${devalue(payload)}<\/script>`;
  const html = rendered.html;
  if ("renderMeta" in ssrContext) {
    rendered.meta = await ssrContext.renderMeta();
  }
  const {
    htmlAttrs = "",
    bodyAttrs = "",
    headAttrs = "",
    headTags = "",
    bodyScriptsPrepend = "",
    bodyScripts = ""
  } = rendered.meta || {};
  return htmlTemplate({
    HTML_ATTRS: htmlAttrs,
    HEAD_ATTRS: headAttrs,
    HEAD: headTags + rendered.renderResourceHints() + rendered.renderStyles() + (ssrContext.styles || ""),
    BODY_ATTRS: bodyAttrs,
    APP: bodyScriptsPrepend + html + state + rendered.renderScripts() + bodyScripts
  });
}
function renderPayload(payload, url) {
  return `__NUXT_JSONP__("${url}", ${devalue(payload)})`;
}
function _interopDefault(e) {
  return e && typeof e === "object" && "default" in e ? e.default : e;
}
function cachedImport(importer) {
  return cachedResult(() => importer().then(_interopDefault));
}
function cachedResult(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}

const render = /*#__PURE__*/Object.freeze({
  __proto__: null,
  renderMiddleware: renderMiddleware
});

const _renderer = createRenderer$1({});
const __VUE_SSR_CONTEXT__ = globalThis.__VUE_SSR_CONTEXT__ = {};
function renderToString(component, context) {
  return new Promise((resolve, reject) => {
    _renderer.renderToString(component, context, (err, result) => {
      const styles = [__VUE_SSR_CONTEXT__, context].map((c) => c && c._styles && c._styles.default).filter(Boolean);
      if (!context._styles) {
        context._styles = {};
      }
      context._styles.default = {
        ids: [...styles.map((s) => s.ids)],
        css: styles.map((s) => s.css).join(""),
        media: styles.map((s) => s.media).join("")
      };
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

const vue2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  renderToString: renderToString
});
//# sourceMappingURL=index.mjs.map
