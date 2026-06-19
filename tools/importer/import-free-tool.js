/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import promoBarParser from './parsers/promo-bar.js';
import toolPlaceholderParser from './parsers/tool-placeholder.js';
import cardParser from './parsers/card.js';
import cardFeatureParser from './parsers/card-feature.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/avg-cleanup.js';
import sectionsTransformer from './transformers/avg-sections.js';

// PARSER REGISTRY
const parsers = {
  'promo-bar': promoBarParser,
  'tool-placeholder': toolPlaceholderParser,
  'card': cardParser,
  'card-feature': cardFeatureParser,
  'accordion-faq': accordionFaqParser,
};

// TRANSFORMER REGISTRY
const transformers = [cleanupTransformer, sectionsTransformer];

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
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
        "div.js-platform-switch"
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
