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

  // tools/importer/import-consumer-product.js
  var import_consumer_product_exports = {};
  __export(import_consumer_product_exports, {
    default: () => import_consumer_product_default
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

  // tools/importer/parsers/hero-product.js
  function parse2(element, { document }) {
    const heroImage = element.querySelector(':scope > img, .product-name + img, img[class*="hero"]');
    const heading = element.querySelector(".product-name h1, h1, h2");
    const intro = element.querySelector(".hero-subheadline, .hero-intro, p");
    let cta = element.querySelector(".actionboxes-footer a[href], a.bi-download-link[href]");
    if (!cta) {
      cta = Array.from(element.querySelectorAll("a[href]")).find(
        (a) => !/checkout\.avg\.com|store-cb\.avg\.com/.test(a.getAttribute("href") || "") && /try|free|download/i.test(a.textContent || "")
      ) || null;
    }
    if (!heading && !intro) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (heroImage) cells.push([heroImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (intro) contentCell.push(intro);
    if (cta) {
      const a = document.createElement("a");
      a.setAttribute("href", cta.getAttribute("href"));
      a.textContent = (cta.textContent || "").replace(/\s+/g, " ").trim();
      contentCell.push(a);
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/rating.js
  function parse3(element, { document }) {
    const widget = element.querySelector('iframe.trustpilot-widget, iframe[title*="Trustpilot"], iframe[src*="trustpilot"], .trustpilot-widget') || element;
    if (!widget) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const caption = document.createElement("p");
    caption.textContent = "Customer reviews powered by Trustpilot";
    const score = document.createElement("p");
    score.textContent = "[Score]";
    const cells = [];
    cells.push([score]);
    cells.push([caption]);
    const block = WebImporter.Blocks.createBlock(document, { name: "rating", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card-pricing.js
  function parse4(element, { document }) {
    let boxes = Array.from(element.querySelectorAll(".box.font-avg-sans-1, .actionbox-buy .box"));
    if (!boxes.length) {
      boxes = Array.from(element.querySelectorAll(".box")).filter((b) => b.querySelector(".actionbox-title, .actionbox-price-main"));
    }
    if (!boxes.length) {
      boxes = Array.from(element.querySelectorAll("div")).filter(
        (b) => b.querySelector('.actionbox-price-main, [class*="price-main"]') && b.querySelector('a[href*="checkout.avg.com"]')
      );
    }
    if (!boxes.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    boxes.forEach((box) => {
      const cardCell = [];
      const term = box.querySelector(".actionbox-title");
      if (term) {
        const h = document.createElement("p");
        h.textContent = (term.textContent || "").trim();
        cardCell.push(h);
      }
      const savings = box.querySelector(".header-wrap .label .label-text, .label .label-text");
      if (savings) {
        const s = document.createElement("p");
        s.textContent = (savings.textContent || "").trim();
        cardCell.push(s);
      }
      const price = box.querySelector(".actionbox-price-main");
      if (price) {
        const p = document.createElement("p");
        p.textContent = (price.textContent || "").replace(/\s+/g, " ").trim();
        cardCell.push(p);
      }
      const buy = box.parentElement ? box.parentElement.querySelector('a.actionbox-button, a.bi-cart-link, a[href*="checkout.avg.com"]') : null;
      const buyLink = buy || box.querySelector('a.actionbox-button, a.bi-cart-link, a[href*="checkout.avg.com"]');
      if (buyLink) {
        const a = document.createElement("a");
        a.setAttribute("href", buyLink.getAttribute("href"));
        a.textContent = (buyLink.textContent || "").replace(/\s+/g, " ").trim();
        cardCell.push(a);
      }
      if (cardCell.length) cells.push([cardCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "card-pricing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/usp-stripe.js
  function parse5(element, { document }) {
    const items = Array.from(
      element.querySelectorAll(".usp-stripe-item, .usp-item, li")
    );
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const labelEl = item.querySelector("span, p, .usp-label") || item;
      const text = (labelEl.textContent || "").trim();
      if (!text) return;
      const p = document.createElement("p");
      p.textContent = text;
      cells.push([p]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "usp-stripe", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card-feature.js
  function parse6(element, { document }) {
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

  // tools/importer/parsers/columns-feature.js
  function parse7(element, { document }) {
    const features = Array.from(element.querySelectorAll(".feature"));
    let mediaImg = null;
    const allImgs = Array.from(element.querySelectorAll("img"));
    mediaImg = allImgs.find((img) => !img.closest(".feature")) || null;
    if (!features.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const listCell = [];
    features.forEach((feat) => {
      const heading = feat.querySelector("h2, h3, h4");
      const text = feat.querySelector("p");
      if (heading) listCell.push(heading);
      if (text) listCell.push(text);
    });
    if (!listCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const mediaCell = mediaImg ? [mediaImg] : [""];
    const cells = [];
    cells.push([mediaCell, listCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/steps.js
  function parse8(element, { document }) {
    let steps = Array.from(element.querySelectorAll(".highlight-bottom, .step"));
    if (!steps.length) {
      const wrapper = element.querySelector(".highlights-bottom-wrapper, .steps-wrapper");
      if (wrapper) {
        steps = Array.from(wrapper.children).filter(
          (c) => !c.classList.contains("arrow-right") && c.querySelector("h2, h3, h4")
        );
      }
    }
    if (!steps.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    steps.forEach((step) => {
      const heading = step.querySelector('h2, h3, h4, [class*="title"]');
      const text = step.querySelector('p, [class*="body"]');
      const stepCell = [];
      if (heading) stepCell.push(heading);
      if (text && text !== heading) stepCell.push(text);
      if (stepCell.length) cells.push([stepCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "steps", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse9(element, { document }) {
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

  // tools/importer/parsers/carousel-blog.js
  function parse10(element, { document }) {
    let slides = Array.from(element.querySelectorAll("a.tns-item, .tns-item, .carousel-slide, .slide"));
    if (!slides.length) {
      const track = element.querySelector(".tns-slider, .tiny-slider, .carousel-track");
      if (track) slides = Array.from(track.querySelectorAll(":scope > a, :scope > div"));
    }
    if (!slides.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    slides.forEach((slide) => {
      var _a;
      const img = slide.querySelector("img");
      const title = slide.querySelector(".blog-title, h2, h3, h4, h5");
      const teaser = slide.querySelector(".blog-perex, p");
      const ctaText = slide.querySelector('.button span, .button, [class*="button"]');
      const href = slide.getAttribute("href") || ((_a = slide.querySelector("a")) == null ? void 0 : _a.getAttribute("href"));
      const textCell = [];
      if (title) {
        if (href) {
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = (title.textContent || "").trim();
          textCell.push(a);
        } else {
          textCell.push(title);
        }
      }
      if (teaser) textCell.push(teaser);
      if (href && ctaText) {
        const cta = document.createElement("a");
        cta.setAttribute("href", href);
        cta.textContent = (ctaText.textContent || "Read More").replace(/\s+/g, " ").trim();
        textCell.push(cta);
      }
      const imageCell = img ? [img] : [""];
      if (textCell.length || img) cells.push([imageCell, textCell.length ? textCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-blog", cells });
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
        "nav#menu",
        "#menu",
        "#navigation-main",
        "nav#navigation-main"
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
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      const sections = template && Array.isArray(template.sections) ? template.sections : [];
      if (sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const sectionEl = findSectionElement(element, section);
        if (!sectionEl) continue;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.parentNode) {
            sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
          }
        }
        if (i > 0 && sectionEl.parentNode) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-consumer-product.js
  var parsers = {
    "promo-bar": parse,
    "hero-product": parse2,
    "rating": parse3,
    "card-pricing": parse4,
    "usp-stripe": parse5,
    "card-feature": parse6,
    "columns-feature": parse7,
    "steps": parse8,
    "accordion-faq": parse9,
    "carousel-blog": parse10
  };
  var transformers = [transform, transform2];
  var PAGE_TEMPLATE = {
    "name": "consumer-product",
    "description": "Consumer product/app landing page: hero with commerce-driven pricing cards + free-trial CTA + Trustpilot, USP stripe, feature grids, 3-easy-steps, how-to-install / system requirements, FAQ accordion, blog carousel.",
    "urls": [
      "https://www.avg.com/en-us/antitrack",
      "https://www.avg.com/en-us/antivirus-for-android",
      "https://www.avg.com/en-us/avg-antivirus-for-mac",
      "https://www.avg.com/en-us/avg-cleaner-for-mac-guide",
      "https://www.avg.com/en-us/avg-driver-updater",
      "https://www.avg.com/en-us/avg-memory-cleaner",
      "https://www.avg.com/en-us/avg-pctuneup",
      "https://www.avg.com/en-us/avg-remover",
      "https://www.avg.com/en-us/avg-tuneup-for-mac",
      "https://www.avg.com/en-us/avg-tuneup-ios",
      "https://www.avg.com/en-us/battery-saver-for-windows",
      "https://www.avg.com/en-us/breachguard",
      "https://www.avg.com/en-us/download-secure-vpn-android",
      "https://www.avg.com/en-us/download-secure-vpn-ios",
      "https://www.avg.com/en-us/download-secure-vpn-mac",
      "https://www.avg.com/en-us/free-antivirus-download",
      "https://www.avg.com/en-us/internet-security",
      "https://www.avg.com/en-us/internet-security-be-demo",
      "https://www.avg.com/en-us/internet-security-for-mac",
      "https://www.avg.com/en-us/mobile-security-for-iphone-ipad",
      "https://www.avg.com/en-us/secure-browser",
      "https://www.avg.com/en-us/secure-vpn",
      "https://www.avg.com/en-us/store",
      "https://www.avg.com/en-us/tuneup-software-updater",
      "https://www.avg.com/en-us/ultimate",
      "https://www.avg.com/en-us/windows-10-antivirus",
      "https://www.avg.com/en-us/windows-11-antivirus",
      "https://www.avg.com/en-us/windows-7-antivirus",
      "https://www.avg.com/en-us/windows-8-antivirus"
    ],
    "blocks": [
      {
        "name": "promo-bar",
        "instances": [
          "#homepage > section.message-bar",
          "section.message-bar"
        ]
      },
      {
        "name": "hero-product",
        "instances": [
          "#hero"
        ]
      },
      {
        "name": "rating",
        "instances": [
          "#hero .trustpilot, #hero iframe, #hero .rating"
        ]
      },
      {
        "name": "card-pricing",
        "instances": [
          "#hero .pricing, #hero .buy, #bft .pricing, #bft"
        ]
      },
      {
        "name": "usp-stripe",
        "instances": [
          ".usp-stripe"
        ]
      },
      {
        "name": "card-feature",
        "instances": [
          "#highlights .cards, #highlights"
        ]
      },
      {
        "name": "columns-feature",
        "instances": [
          "#features .feature, #features"
        ]
      },
      {
        "name": "steps",
        "instances": [
          "#highlights-bottom .steps, #highlights-bottom"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          "#sysreq .faq, #sysreq #faq, #sysreq"
        ]
      },
      {
        "name": "carousel-blog",
        "instances": [
          "#blogposts"
        ]
      }
    ],
    "sections": [
      {
        "id": "highlights",
        "name": "section-highlights",
        "selector": [
          "#highlights"
        ],
        "style": "light",
        "blocks": [
          "card-feature"
        ],
        "defaultContent": [
          "#highlights h2",
          "#highlights > p"
        ]
      },
      {
        "id": "trial",
        "name": "section-trial",
        "selector": [
          "#trial"
        ],
        "style": "light",
        "blocks": [],
        "defaultContent": [
          "#trial h2",
          "#trial p",
          "#trial a"
        ]
      },
      {
        "id": "features",
        "name": "section-features",
        "selector": [
          "#features"
        ],
        "style": "light",
        "blocks": [
          "columns-feature"
        ],
        "defaultContent": [
          "#features h2"
        ]
      },
      {
        "id": "highlights-bottom",
        "name": "section-steps",
        "selector": [
          "#highlights-bottom"
        ],
        "style": "light",
        "blocks": [
          "steps"
        ],
        "defaultContent": [
          "#highlights-bottom h2"
        ]
      },
      {
        "id": "sysreq",
        "name": "section-sysreq",
        "selector": [
          "#sysreq"
        ],
        "style": "light",
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": [
          "#sysreq h2",
          "#sysreq h3",
          "#sysreq p",
          "#sysreq ul"
        ]
      },
      {
        "id": "blogposts",
        "name": "section-blog",
        "selector": [
          "#blogposts"
        ],
        "style": "light",
        "blocks": [
          "carousel-blog"
        ],
        "defaultContent": [
          "#blogposts h2",
          "#blogposts a"
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
  var import_consumer_product_default = {
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
  return __toCommonJS(import_consumer_product_exports);
})();
