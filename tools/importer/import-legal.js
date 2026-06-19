/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import promoBarParser from './parsers/promo-bar.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/avg-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'promo-bar': promoBarParser,
};

// TRANSFORMER REGISTRY
const transformers = [cleanupTransformer];

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
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
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
  template.blocks
    .filter((b) => !b.name.startsWith('section-'))
    .forEach((blockDef) => {
      blockDef.instances.forEach((rawSelector) => {
        // instances may be comma-joined fallback selectors; try each, use first that matches
        const selectors = rawSelector.split(',').map((s) => s.trim()).filter(Boolean);
        let matched = [];
        let usedSelector = selectors[0];
        for (const sel of selectors) {
          try {
            const els = document.querySelectorAll(sel);
            if (els.length) { matched = [...els]; usedSelector = sel; break; }
          } catch (e) { /* invalid selector, skip */ }
        }
        matched.forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector: usedSelector, element, section: blockDef.section || null });
        });
      });
    });
  return pageBlocks;
}

// Map source path /en-us/<slug> -> target /avg/en-us/<slug>
function toTargetPath(originalURL) {
  const pathname = new URL(originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
  let p = pathname;
  if (p.startsWith('/en-us/')) {
    p = '/avg' + p;
  } else if (!p.startsWith('/avg/')) {
    p = '/avg/en-us' + (p.startsWith('/') ? p : '/' + p);
  }
  return WebImporter.FileUtils.sanitizePath(p);
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
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
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
