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

  // tools/importer/import-free-tool.js
  var import_free_tool_exports = {};
  __export(import_free_tool_exports, {
    default: () => import_free_tool_default
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

  // tools/importer/parsers/tool-placeholder.js
  function parse2(element, { document }) {
    const widget = element.querySelector('#app, .tool, [class*="generator"], .widget') || element;
    if (!widget) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    const labelSelectors = [
      ".password",
      ".badge",
      ".length-settings label",
      ".length",
      ".complexity-settings label",
      ".custom-control-label",
      "#pwd-copy-btn span",
      '[class*="label"]',
      "label"
    ];
    const seen = /* @__PURE__ */ new Set();
    labelSelectors.forEach((sel) => {
      widget.querySelectorAll(sel).forEach((el) => {
        const text = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (text && !seen.has(text)) {
          seen.add(text);
          const p = document.createElement("p");
          p.textContent = text;
          contentCell.push(p);
        }
      });
    });
    if (!contentCell.length) {
      const text = (widget.textContent || "").replace(/\s+/g, " ").trim();
      if (text) {
        const p = document.createElement("p");
        p.textContent = text;
        contentCell.push(p);
      }
    }
    if (!contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "tool-placeholder", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card.js
  function parse3(element, { document }) {
    const modal = element.matches && element.matches(".modal-bottom") ? element : element.querySelector ? element.querySelector(".modal-bottom") : null;
    if (modal) {
      const cardCell = [];
      const icon = modal.querySelector("img");
      if (icon) {
        const img = document.createElement("img");
        img.setAttribute("src", icon.getAttribute("src"));
        img.setAttribute("alt", icon.getAttribute("alt") || "");
        cardCell.push(img);
      }
      const heading = modal.querySelector("h2, h3, h4");
      if (heading) {
        const h = document.createElement("h3");
        h.textContent = (heading.textContent || "").trim();
        cardCell.push(h);
      }
      const descEl = modal.querySelector(".text .js-pc p, .text .pc p, .text p, .js-pc p, p");
      if (descEl) {
        const p = document.createElement("p");
        p.textContent = (descEl.textContent || "").replace(/\s+/g, " ").trim();
        if (p.textContent) cardCell.push(p);
      }
      const linkEl = modal.querySelector(".button-wrapper .js-pc a[href], .js-pc a[href], a[href]");
      if (linkEl) {
        const a = document.createElement("a");
        a.setAttribute("href", linkEl.getAttribute("href"));
        a.textContent = (linkEl.textContent || "Free download").replace(/\s+/g, " ").trim();
        cardCell.push(a);
      }
      if (cardCell.length) {
        const block2 = WebImporter.Blocks.createBlock(document, { name: "card", cells: [[cardCell]] });
        element.replaceWith(block2);
        return;
      }
    }
    let cards = Array.from(element.querySelectorAll(".included-card, .card-item, .card-product"));
    if (!cards.length) {
      cards = Array.from(element.querySelectorAll(":scope .span4, :scope .row > .span4")).filter((c) => c.querySelector("img") || c.querySelector("h2, h3, h4"));
    }
    if (!cards.length) {
      cards = Array.from(element.querySelectorAll(":scope .cards > div, :scope .row > div > div"));
    }
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const name = card.querySelector('.h5, h2, h3, h4, [class*="title"]');
      const desc = card.querySelector('.body-3, .included-card-body .body-3, p, [class*="body"]');
      const thumb = card.querySelector("img");
      const link = card.querySelector("a.js-pc, a[href]");
      const cardCell = [];
      if (thumb) {
        const img = document.createElement("img");
        img.setAttribute("src", thumb.getAttribute("src"));
        if (thumb.getAttribute("alt")) img.setAttribute("alt", thumb.getAttribute("alt"));
        cardCell.push(img);
      }
      if (name) cardCell.push(name);
      if (desc && desc !== name) cardCell.push(desc);
      const nameHref = name && name.querySelector("a[href]") ? name.querySelector("a[href]").getAttribute("href") : null;
      if (link && link.getAttribute("href") !== nameHref) {
        const a = document.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        const linkText = (link.textContent || "").replace(/\s+/g, " ").trim();
        a.textContent = linkText || (name ? (name.textContent || "").trim() : "");
        if (a.textContent) cardCell.push(a);
      }
      if (cardCell.length) cells.push([cardCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "card", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card-feature.js
  function parse4(element, { document }) {
    let items = Array.from(
      element.querySelectorAll(".highlight, .cards-card, .card-feature-item, .feature-card")
    );
    if (!items.length) {
      const wrapper = element.querySelector(".highlights-wrapper, .cards, .row");
      if (wrapper) {
        items = Array.from(wrapper.children).filter(
          (c) => c.querySelector("h2, h3, h4") && c.querySelector("p")
        );
      }
    }
    const cells = [];
    if (items.length) {
      items.forEach((item) => {
        const heading = item.querySelector('h2, h3, h4, [class*="title"]');
        const text = item.querySelector('p, [class*="body"]');
        const featureCell = [];
        if (heading) featureCell.push(heading);
        if (text && text !== heading) featureCell.push(text);
        if (featureCell.length) cells.push([featureCell]);
      });
    } else {
      const headings = Array.from(element.querySelectorAll("h3, h4"));
      headings.forEach((heading) => {
        var _a;
        const featureCell = [heading];
        let sib = heading.nextElementSibling;
        while (sib && !/^H[1-6]$/.test(sib.tagName)) {
          if (sib.tagName === "P" || ((_a = sib.querySelector) == null ? void 0 : _a.call(sib, "p"))) {
            const p = sib.tagName === "P" ? sib : sib.querySelector("p");
            if (p) featureCell.push(p);
            break;
          }
          sib = sib.nextElementSibling;
        }
        cells.push([featureCell]);
      });
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "card-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    let items = Array.from(element.querySelectorAll(".accordion-item, .faq-item"));
    if (!items.length) {
      const questions = Array.from(element.querySelectorAll(".accordion-title, .question"));
      items = questions.map((q) => q.parentElement).filter(Boolean);
    }
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const titleEl = item.querySelector(".accordion-title, .question");
      const contentEl = item.querySelector(".accordion-content, .answer");
      const questionHeading = titleEl && titleEl.querySelector("h2, h3, h4, h5") || titleEl;
      if (!questionHeading) return;
      const contentCell = [];
      if (contentEl) {
        Array.from(contentEl.children).forEach((child) => {
          if ((child.textContent || "").trim() || child.querySelector("img, a, li")) {
            contentCell.push(child);
          }
        });
        if (!contentCell.length && (contentEl.textContent || "").trim()) {
          contentCell.push(contentEl);
        }
      }
      cells.push([questionHeading, contentCell.length ? contentCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
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

  // tools/importer/transformers/avg-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  var MARKER_TAG = "eds-section-marker";
  function findSectionElement(element, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const selector of selectors) {
      if (!selector) continue;
      try {
        const found = element.querySelector(selector);
        if (found) return found;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const document = element.ownerDocument;
    if (hookName === TransformHook2.beforeTransform) {
      sections.forEach((section, index) => {
        const sectionEl = findSectionElement(element, section);
        if (!sectionEl || !sectionEl.parentNode) return;
        const marker = document.createElement(MARKER_TAG);
        marker.setAttribute("data-section-index", String(index));
        if (section.style) marker.setAttribute("data-section-style", section.style);
        sectionEl.parentNode.insertBefore(marker, sectionEl);
      });
      return;
    }
    if (hookName === TransformHook2.afterTransform) {
      const markers = Array.from(element.querySelectorAll(MARKER_TAG));
      markers.forEach((marker) => {
        const index = Number(marker.getAttribute("data-section-index"));
        const style = marker.getAttribute("data-section-style");
        const parent = marker.parentNode;
        if (!parent) return;
        if (index > 0) {
          parent.insertBefore(document.createElement("hr"), marker);
        }
        if (style) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style }
          });
          parent.insertBefore(metadataBlock, marker);
        }
        marker.remove();
      });
    }
  }

  // tools/importer/import-free-tool.js
  var parsers = {
    "promo-bar": parse,
    "tool-placeholder": parse2,
    "card": parse3,
    "card-feature": parse4,
    "accordion-faq": parse5
  };
  var transformers = [transform, transform2];
  var PAGE_TEMPLATE = {
    "name": "free-tool",
    "description": "Free interactive tool page: hero with tool widget (interactive logic out of scope, rendered as placeholder), upsell card, how-to 3-column tips, FAQ accordion.",
    "urls": [
      "https://www.avg.com/en-us/awards",
      "https://www.avg.com/en-us/help-me-choose",
      "https://www.avg.com/en-us/online-markets-by-country",
      "https://www.avg.com/en-us/online-research-faq",
      "https://www.avg.com/en-us/online-research-main",
      "https://www.avg.com/en-us/random-password-generator",
      "https://www.avg.com/en-us/ransomware-decryption-tools"
    ],
    "blocks": [
      {
        "name": "promo-bar",
        "instances": [
          "section.message-bar"
        ]
      },
      {
        "name": "tool-placeholder",
        "instances": [
          "#top .tool, #top"
        ]
      },
      {
        "name": "card",
        "instances": [
          ".modal-bottom:not(.modal *)"
        ]
      },
      {
        "name": "card-feature",
        "instances": [
          "section.cards"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          "section#faq.faq",
          "#faq"
        ]
      }
    ],
    "sections": [
      {
        "id": "hero",
        "name": "section-hero",
        "selector": [
          "#top"
        ],
        "style": "light",
        "blocks": [
          "tool-placeholder"
        ],
        "defaultContent": [
          "#top h1",
          "#top > p"
        ]
      },
      {
        "id": "tips",
        "name": "section-tips",
        "selector": [
          "section.cards"
        ],
        "style": "light-blue",
        "blocks": [
          "card-feature"
        ],
        "defaultContent": [
          "section.cards h2"
        ]
      },
      {
        "id": "faq",
        "name": "section-faq",
        "selector": [
          "#faq"
        ],
        "style": "light",
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": [
          "#faq h2",
          "#faq > p"
        ]
      }
    ]
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
  var import_free_tool_default = {
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
  return __toCommonJS(import_free_tool_exports);
})();
