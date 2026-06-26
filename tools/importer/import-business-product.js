/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import promoBarParser from './parsers/promo-bar.js';
import heroParser from './parsers/hero.js';
import comparisonMatrixParser from './parsers/comparison-matrix.js';
import teaserCtaParser from './parsers/teaser-cta.js';
import columnsParser from './parsers/columns.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardParser from './parsers/card.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/avg-cleanup.js';
import sectionsTransformer from './transformers/avg-sections.js';

// PARSER REGISTRY
const parsers = {
  'promo-bar': promoBarParser,
  'hero': heroParser,
  'comparison-matrix': comparisonMatrixParser,
  'teaser-cta': teaserCtaParser,
  'columns': columnsParser,
  'columns-feature': columnsFeatureParser,
  'card': cardParser,
};

// TRANSFORMER REGISTRY
const transformers = [cleanupTransformer, sectionsTransformer];

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  "name": "business-product",
  "description": "Business/enterprise product page: hero with demo/contact-sales CTA, feature media sections, product comparison/spec table, contact CTA.",
  "urls": [
    "https://www.avg.com/en-us/business-security",
    "https://www.avg.com/en-us/antivirus-business-edition",
    "https://www.avg.com/en-us/business-events-and-webinars",
    "https://www.avg.com/en-us/business-resources",
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
        "#FreeToolsAndGuides, #body-inner div.section:has(.span4 h3):has(.span4 img)"
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
        "#FreeToolsAndGuides"
      ],
      "style": "light",
      "blocks": [
        "card"
      ],
      "defaultContent": [
        "#FreeToolsAndGuides h2",
        "#FreeToolsAndGuides > .container > .row:first-child > .span12 > p"
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
