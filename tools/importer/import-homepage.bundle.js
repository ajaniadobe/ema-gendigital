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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
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

  // tools/importer/parsers/hero.js
  function parse2(element, { document }) {
    const heroImage = element.querySelector(':scope > img, .span6.img img, img[class*="hero"], .hero-image img');
    const heading = element.querySelector("h1, h2");
    const intro = element.querySelector(".top-text, .body-1, .text > div, .hero-intro, p");
    const primaryCta = element.querySelector(
      ".js-pc a.button, .buttons a.button, .button-wrapper a.button, a.button.primary, a.cta"
    );
    if (!heading && !intro) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (heroImage) {
      cells.push([heroImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (intro) contentCell.push(intro);
    if (primaryCta) {
      const a = document.createElement("a");
      a.setAttribute("href", primaryCta.getAttribute("href"));
      a.textContent = (primaryCta.textContent || "").trim();
      contentCell.push(a);
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
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

  // tools/importer/parsers/usp-stripe.js
  function parse4(element, { document }) {
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

  // tools/importer/parsers/advanced-tabs.js
  function parse5(element, { document }) {
    const devices = ["pc", "mac", "android", "ios"];
    const cells = [];
    devices.forEach((device) => {
      const cls = `.js-${device}`;
      const labelEl = element.querySelector(`.icon-product span${cls}`);
      const label = labelEl ? (labelEl.textContent || "").trim() : "";
      const headingSpan = element.querySelector(`h1 span${cls}, h2 span${cls}, h3 span${cls}`);
      const bodySpan = element.querySelector(`.body-3 span${cls}, .body-2 span${cls}, p span${cls}`);
      const media = element.querySelector(`.span6.img img${cls}, .img img${cls}, img${cls}`);
      const cta = element.querySelector(`a.button${cls}, a${cls}.button, .buttons a${cls}`);
      if (!label && !headingSpan && !bodySpan) return;
      const contentCell = [];
      if (media) contentCell.push(media);
      if (headingSpan) {
        const h = document.createElement("h2");
        h.textContent = (headingSpan.textContent || "").trim();
        contentCell.push(h);
      }
      if (bodySpan) {
        const p = document.createElement("p");
        p.textContent = (bodySpan.textContent || "").trim();
        contentCell.push(p);
      }
      if (cta) {
        const a = document.createElement("a");
        a.setAttribute("href", cta.getAttribute("href"));
        a.textContent = (cta.textContent || "").replace(/\s+/g, " ").trim();
        contentCell.push(a);
      }
      const labelCell = [];
      if (label) {
        const p = document.createElement("p");
        p.textContent = label;
        labelCell.push(p);
      }
      cells.push([labelCell.length ? labelCell : "", contentCell.length ? contentCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "advanced-tabs", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/awards-strip.js
  function parse6(element, { document }) {
    const heading = element.querySelector("h1, h2, h3");
    const intro = element.querySelector(".body-2, p");
    const awards = Array.from(element.querySelectorAll(".awards-icon"));
    if (!heading && !awards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const headCell = [];
    if (heading) headCell.push(heading);
    if (intro) headCell.push(intro);
    if (headCell.length) cells.push([headCell]);
    awards.forEach((award) => {
      const img = award.querySelector("img");
      const caption = award.querySelector(".body-2, p, div");
      const awardCell = [];
      if (img) awardCell.push(img);
      if (caption) awardCell.push(caption);
      if (awardCell.length) cells.push([awardCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "awards-strip", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse7(element, { document }) {
    const textCol = element.querySelector('.span6.text, .text, [class*="text"]');
    const imgCol = element.querySelector('.span6.img, .img, [class*="img"]');
    const productImg = imgCol ? imgCol.querySelector("img") : element.querySelector(".span6.img img");
    const eyebrowEl = element.querySelector(".icon-product");
    const heading = element.querySelector("h1, h2, h3");
    const paragraph = element.querySelector(".body-3, .body-2, p");
    const cta = element.querySelector(".buttons a.button, a.button, a.cta");
    if (!heading && !paragraph) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [];
    if (eyebrowEl) {
      const eyebrow = document.createElement("p");
      eyebrow.textContent = (eyebrowEl.textContent || "").replace(/\s+/g, " ").trim();
      if (eyebrow.textContent) textCell.push(eyebrow);
    }
    if (heading) textCell.push(heading);
    if (paragraph) textCell.push(paragraph);
    if (cta) {
      const a = document.createElement("a");
      a.setAttribute("href", cta.getAttribute("href"));
      a.textContent = (cta.textContent || "").trim();
      textCell.push(a);
    }
    const imageCell = productImg ? [productImg] : [""];
    const cells = [];
    cells.push([textCell, imageCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card.js
  function parse8(element, { document }) {
    let cards = Array.from(element.querySelectorAll(".included-card, .card-item, .card-product"));
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
      const link = card.querySelector("a.js-pc, a[href]");
      const cardCell = [];
      if (name) cardCell.push(name);
      if (desc && desc !== name) cardCell.push(desc);
      if (link) {
        const a = document.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        a.textContent = (link.textContent || "").trim();
        cardCell.push(a);
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

  // tools/importer/parsers/carousel.js
  function parse9(element, { document }) {
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
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-cta.js
  function parse10(element, { document }) {
    const heading = element.querySelector('h1, h2, h3, .ico p, .like-h2, [class*="title"]');
    const paragraphs = Array.from(element.querySelectorAll("p")).filter((p) => p !== heading);
    const paragraph = paragraphs.find((p) => (p.textContent || "").trim());
    const cta = element.querySelector('.js-pc a.button, a.button, a.cta, .buttons a, a[class*="button"]') || element.querySelector("a[href]");
    if (!heading && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    if (paragraph && paragraph !== heading) contentCell.push(paragraph);
    if (cta) {
      const a = document.createElement("a");
      a.setAttribute("href", cta.getAttribute("href"));
      a.textContent = (cta.textContent || "").replace(/\s+/g, " ").trim();
      contentCell.push(a);
    }
    const cells = [];
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "teaser-cta", cells });
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

  // tools/importer/import-homepage.js
  var parsers = {
    "promo-bar": parse,
    "hero": parse2,
    "rating": parse3,
    "usp-stripe": parse4,
    "advanced-tabs": parse5,
    "awards-strip": parse6,
    "columns": parse7,
    "card": parse8,
    "carousel": parse9,
    "teaser-cta": parse10
  };
  var transformers = [transform, transform2];
  var PAGE_TEMPLATE = {
    "name": "homepage",
    "description": "AVG homepage: promo bar, megamenu header, hero with Trustpilot rating, alternating media+text product features, awards strip, Included-in-Ultimate cards grid, blog carousel, closing CTA banner, footer.",
    "urls": [
      "https://www.avg.com/en-us/homepage"
    ],
    "blocks": [
      {
        "name": "promo-bar",
        "instances": [
          "#homepage > section.message-bar"
        ]
      },
      {
        "name": "hero",
        "instances": [
          "#top"
        ]
      },
      {
        "name": "rating",
        "instances": [
          "#top .trustpilot, #top iframe.trustpilot-widget, #top .rating"
        ]
      },
      {
        "name": "usp-stripe",
        "instances": [
          "#body-inner .section-usp-stripe",
          "#top + .section-usp-stripe"
        ]
      },
      {
        "name": "advanced-tabs",
        "instances": [
          "#media-1"
        ]
      },
      {
        "name": "awards-strip",
        "instances": [
          "#awards-card"
        ]
      },
      {
        "name": "columns",
        "instances": [
          "#media-2",
          "#media-3 > .container"
        ]
      },
      {
        "name": "card",
        "instances": [
          "#media-3 .included",
          "#body-inner div.included"
        ]
      },
      {
        "name": "carousel",
        "instances": [
          "#blogposts"
        ]
      },
      {
        "name": "teaser-cta",
        "instances": [
          "#teaser"
        ]
      }
    ],
    "sections": [
      {
        "id": "media-1",
        "name": "section-media-1",
        "selector": [
          "#media-1"
        ],
        "style": "light",
        "blocks": [
          "advanced-tabs"
        ],
        "defaultContent": []
      },
      {
        "id": "awards-card",
        "name": "section-awards",
        "selector": [
          "#awards-card"
        ],
        "style": "light",
        "blocks": [
          "awards-strip"
        ],
        "defaultContent": []
      },
      {
        "id": "media-2",
        "name": "section-media-2",
        "selector": [
          "#media-2"
        ],
        "style": "light",
        "blocks": [
          "columns"
        ],
        "defaultContent": []
      },
      {
        "id": "media-3",
        "name": "section-media-3",
        "selector": [
          "#media-3"
        ],
        "style": "dark",
        "blocks": [
          "columns",
          "card"
        ],
        "defaultContent": []
      },
      {
        "id": "blog",
        "name": "section-blog",
        "selector": [
          "#blogposts"
        ],
        "style": "light",
        "blocks": [
          "carousel"
        ],
        "defaultContent": [
          "#blogposts h2",
          "#blogposts > .container > a"
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
