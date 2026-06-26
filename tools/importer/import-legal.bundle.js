/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-legal.js
  var import_legal_exports = {};
  __export(import_legal_exports, {
    default: () => import_legal_default
  });

  // tools/importer/parsers/promo-bar.js
  function parse(element, { document }) {
    const link = element.querySelector("a.message-bar__content, a[href]");
    const messageText = element.querySelector(".message-bar__content span, span");
    if (!messageText || !messageText.textContent.trim()) {
      element.replaceWith(...element.childNodes);
      return;
    }
    let cellContent;
    if (link) {
      const a = document.createElement("a");
      a.setAttribute("href", link.getAttribute("href"));
      a.textContent = messageText.textContent.trim();
      cellContent = a;
    } else {
      const p = document.createElement("p");
      p.textContent = messageText.textContent.trim();
      cellContent = p;
    }
    const cells = [];
    cells.push([cellContent]);
    const block = WebImporter.Blocks.createBlock(document, { name: "promo-bar", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/avg-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#ensNotifyBanner",
        "#cheqMini",
        "#cheq-dev",
        "#ensModalWrapper",
        "dialog#ensModalWrapper",
        '[id^="cheq-modal"]',
        '[class^="cheq-modal"]',
        '[class*="cheq-modal__"]',
        "#ensModalWrapper ~ *"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe.aamIframeLoaded",
        'iframe[src*="demdex.net"]',
        '[id^="destination_publishing_iframe"]',
        '[id^="batBeacon"]',
        'img[src*="bat.bing.com"]',
        'img[src*="demdex.net"]',
        'img[width="1"][height="1"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        'a.sr-only.sr-only-focusable[href="#body-inner"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".js-mac",
        ".js-android",
        ".js-ios"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".js-notification-overlay-for-wrong-download",
        ".notification-overlay-for-wrong-download"
      ]);
      element.querySelectorAll(".js-platform-switch, .js-pc.pc, div.js-pc").forEach((wrapper) => {
        const onlyWrapperClasses = [...wrapper.classList].every((c) => c === "js-platform-switch" || c === "js-pc" || c === "pc");
        if (wrapper.tagName === "DIV" && onlyWrapperClasses) {
          wrapper.replaceWith(...wrapper.childNodes);
        } else {
          wrapper.classList.remove("js-platform-switch", "js-pc", "pc");
          if (!wrapper.getAttribute("class")) wrapper.removeAttribute("class");
        }
      });
      element.querySelectorAll(".js-pc").forEach((el) => {
        el.classList.remove("js-pc", "pc");
        if (!el.getAttribute("class")) el.removeAttribute("class");
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "nav.navigation.global-navigation",
        "nav#menu",
        "#menu",
        "#navigation-main",
        "nav#navigation-main"
      ]);
      WebImporter.DOMUtils.remove(element, [
        'a.sr-only.sr-only-focusable[href="#navigation-links"]',
        "#modal-video",
        "div.video.modal",
        "#ZN_8ksX2qGJaVxaYw6"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#bottom",
        "#footer",
        "#language-selector",
        ".language-selector.modal"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".sticky-bar.is-sticky"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
        el.removeAttribute("data-tracking");
      });
    }
  }

  // tools/importer/import-legal.js
  var parsers = {
    "promo-bar": parse
  };
  var transformers = [transform];
  var PAGE_TEMPLATE = {
    "name": "legal",
    "description": "Legal/policy long-form page: title + rich-text body (headings, paragraphs, lists). Default content, no custom blocks.",
    "urls": [
      "https://www.avg.com/en-us/accessibility-policy",
      "https://www.avg.com/en-us/beta",
      "https://www.avg.com/en-us/cancellation-refund-policy",
      "https://www.avg.com/en-us/consent-policy",
      "https://www.avg.com/en-us/cookies",
      "https://www.avg.com/en-us/do-not-sell",
      "https://www.avg.com/en-us/eula",
      "https://www.avg.com/en-us/legal-documentation",
      "https://www.avg.com/en-us/policies",
      "https://www.avg.com/en-us/privacy",
      "https://www.avg.com/en-us/privacy-preferences",
      "https://www.avg.com/en-us/privacy/updates",
      "https://www.avg.com/en-us/products-policy",
      "https://www.avg.com/en-us/remote-access-terms-and-conditions",
      "https://www.avg.com/en-us/research-participant-terms-conditions",
      "https://www.avg.com/en-us/secure-vpn-acceptable-use",
      "https://www.avg.com/en-us/subscription-details",
      "https://www.avg.com/en-us/supplier",
      "https://www.avg.com/en-us/supplier-guidelines",
      "https://www.avg.com/en-us/trademarks",
      "https://www.avg.com/en-us/vpn-dmca",
      "https://www.avg.com/en-us/vpn-policy",
      "https://www.avg.com/en-us/vpn-territory"
    ],
    "blocks": [
      {
        "name": "promo-bar",
        "instances": [
          "section.message-bar"
        ]
      }
    ],
    "sections": []
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.filter((b) => !b.name.startsWith("section-")).forEach((blockDef) => {
      blockDef.instances.forEach((rawSelector) => {
        const selectors = rawSelector.split(",").map((s) => s.trim()).filter(Boolean);
        let matched = [];
        let usedSelector = selectors[0];
        for (const sel of selectors) {
          try {
            const els = document.querySelectorAll(sel);
            if (els.length) {
              matched = [...els];
              usedSelector = sel;
              break;
            }
          } catch (e) {
          }
        }
        matched.forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector: usedSelector, element, section: blockDef.section || null });
        });
      });
    });
    return pageBlocks;
  }
  function toTargetPath(originalURL) {
    const pathname = new URL(originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
    let p = pathname;
    if (p.startsWith("/en-us/")) {
      p = "/avg" + p;
    } else if (!p.startsWith("/avg/")) {
      p = "/avg/en-us" + (p.startsWith("/") ? p : "/" + p);
    }
    return WebImporter.FileUtils.sanitizePath(p);
  }
  var import_legal_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = toTargetPath(params.originalURL);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_legal_exports);
})();
