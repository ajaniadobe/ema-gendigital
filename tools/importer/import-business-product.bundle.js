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

  // tools/importer/import-business-product.js
  var import_business_product_exports = {};
  __export(import_business_product_exports, {
    default: () => import_business_product_default
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

  // tools/importer/parsers/comparison-matrix.js
  function parse3(element, { document }) {
    const table = element.querySelector("table");
    if (!table) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const headerRows = Array.from(table.querySelectorAll("thead tr"));
    const headerRow = headerRows.find((tr) => tr.querySelector("th .header, th .like-h4")) || headerRows.find((tr) => tr.querySelector("th")) || null;
    const productThs = headerRow ? Array.from(headerRow.querySelectorAll("th")).filter((th) => th.querySelector(".like-h4, .header")) : [];
    const colCount = 1 + productThs.length;
    const cells = [];
    const headerCells = [""];
    productThs.forEach((th) => {
      const cell = [];
      const nameEl = th.querySelector(".like-h4");
      const productLink = th.querySelector(".header a[href]");
      const name = nameEl ? (nameEl.textContent || "").trim() : "";
      if (productLink && name) {
        const a = document.createElement("a");
        a.setAttribute("href", productLink.getAttribute("href"));
        a.textContent = name;
        cell.push(a);
      } else if (name) {
        const p = document.createElement("p");
        p.textContent = name;
        cell.push(p);
      }
      const viewFeatures = th.querySelector(".features-link a[href]");
      if (viewFeatures) {
        const a = document.createElement("a");
        a.setAttribute("href", viewFeatures.getAttribute("href"));
        a.textContent = (viewFeatures.textContent || "").trim();
        cell.push(a);
      }
      headerCells.push(cell.length ? cell : "");
    });
    cells.push(headerCells);
    const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
    bodyRows.forEach((tr) => {
      const featureTd = tr.querySelector("td.feature");
      if (!featureTd) return;
      const labelCell = [];
      const headline = featureTd.querySelector(".feature-headline");
      const description = featureTd.querySelector(".feature-description");
      if (headline) {
        const p = document.createElement("p");
        p.textContent = (headline.textContent || "").trim();
        labelCell.push(p);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = (description.textContent || "").trim();
        labelCell.push(p);
      }
      const rowCells = [labelCell.length ? labelCell : ""];
      const valueTds = Array.from(tr.querySelectorAll("td.tick"));
      valueTds.forEach((td) => {
        const glyph = td.querySelector("img");
        if (glyph) {
          const p = document.createElement("p");
          p.textContent = (glyph.getAttribute("alt") || "Yes").trim();
          rowCells.push([p]);
        } else {
          rowCells.push("");
        }
      });
      while (rowCells.length < colCount) rowCells.push("");
      cells.push(rowCells);
    });
    const footRow = table.querySelector("tfoot tr");
    if (footRow) {
      const footCells = [""];
      const footTds = Array.from(footRow.querySelectorAll("td")).slice(1);
      let any = false;
      footTds.forEach((td) => {
        const buy = td.querySelector('a[href*="store"], a[href*="checkout"], a.button, a.bi-cart-link, a[href]');
        if (buy) {
          const a = document.createElement("a");
          a.setAttribute("href", buy.getAttribute("href"));
          a.textContent = (buy.textContent || "Buy now").replace(/\s+/g, " ").trim();
          footCells.push([a]);
          any = true;
        } else {
          footCells.push("");
        }
      });
      while (footCells.length < colCount) footCells.push("");
      if (any) cells.push(footCells);
    }
    if (cells.length <= 1) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "comparison-matrix", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-cta.js
  function parse4(element, { document }) {
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

  // tools/importer/parsers/columns.js
  function parse5(element, { document }) {
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

  // tools/importer/parsers/columns-feature.js
  function parse6(element, { document }) {
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

  // tools/importer/parsers/card.js
  function parse7(element, { document }) {
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

  // tools/importer/import-business-product.js
  var parsers = {
    "promo-bar": parse,
    "hero": parse2,
    "comparison-matrix": parse3,
    "teaser-cta": parse4,
    "columns": parse5,
    "columns-feature": parse6,
    "card": parse7
  };
  var transformers = [transform, transform2];
  var PAGE_TEMPLATE = {
    "name": "business-product",
    "description": "Business/enterprise product page: hero with demo/contact-sales CTA, feature media sections, product comparison/spec table, contact CTA.",
    "urls": [
      "https://www.avg.com/en-us/antivirus-business-edition",
      "https://www.avg.com/en-us/business-events-and-webinars",
      "https://www.avg.com/en-us/business-resources",
      "https://www.avg.com/en-us/business-security",
      "https://www.avg.com/en-us/email-server-business-edition",
      "https://www.avg.com/en-us/endpoint-protection",
      "https://www.avg.com/en-us/file-server-business-edition",
      "https://www.avg.com/en-us/internet-security-business-edition",
      "https://www.avg.com/en-us/management-console",
      "https://www.avg.com/en-us/patch-management",
      "https://www.avg.com/en-us/small-business-digital-policy-guide-download",
      "https://www.avg.com/en-us/store-business"
    ],
    "blocks": [
      {
        "name": "promo-bar",
        "instances": [
          "section.message-bar"
        ]
      },
      {
        "name": "hero",
        "instances": [
          "#body-inner > div.section-intro-variant-b"
        ]
      },
      {
        "name": "comparison-matrix",
        "instances": [
          "#comparison"
        ]
      },
      {
        "name": "teaser-cta",
        "instances": [
          "#body-inner > div.section.banner-management-console"
        ]
      },
      {
        "name": "columns",
        "instances": [
          "#body-inner div.section:has(img[alt*='One subscription'])"
        ]
      },
      {
        "name": "columns-feature",
        "instances": [
          "#body-inner div.section:has(img[alt*='Easy to manage'])"
        ]
      },
      {
        "name": "card",
        "instances": [
          "#body-inner div.section:last-of-type"
        ]
      }
    ],
    "sections": [
      {
        "id": "comparison",
        "name": "section-comparison",
        "selector": [
          "#comparison"
        ],
        "style": "light",
        "blocks": [
          "comparison-matrix"
        ],
        "defaultContent": []
      },
      {
        "id": "free-tools-guides",
        "name": "section-resources",
        "selector": [
          "#body-inner div.section:last-of-type"
        ],
        "style": "light",
        "blocks": [
          "card"
        ],
        "defaultContent": [
          "#body-inner div.section:last-of-type h2",
          "#body-inner div.section:last-of-type > p"
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
  var import_business_product_default = {
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
  return __toCommonJS(import_business_product_exports);
})();
