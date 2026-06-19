/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import promoBarParser from './parsers/promo-bar.js';
import heroParser from './parsers/hero.js';
import ratingParser from './parsers/rating.js';
import uspStripeParser from './parsers/usp-stripe.js';
import advancedTabsParser from './parsers/advanced-tabs.js';
import awardsStripParser from './parsers/awards-strip.js';
import columnsParser from './parsers/columns.js';
import cardParser from './parsers/card.js';
import carouselParser from './parsers/carousel.js';
import teaserCtaParser from './parsers/teaser-cta.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/avg-cleanup.js';
import sectionsTransformer from './transformers/avg-sections.js';

// PARSER REGISTRY
const parsers = {
  'promo-bar': promoBarParser,
  'hero': heroParser,
  'rating': ratingParser,
  'usp-stripe': uspStripeParser,
  'advanced-tabs': advancedTabsParser,
  'awards-strip': awardsStripParser,
  'columns': columnsParser,
  'card': cardParser,
  'carousel': carouselParser,
  'teaser-cta': teaserCtaParser,
};

// TRANSFORMER REGISTRY
const transformers = [cleanupTransformer, sectionsTransformer];

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
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
