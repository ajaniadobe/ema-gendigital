/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import promoBarParser from './parsers/promo-bar.js';
import heroProductParser from './parsers/hero-product.js';
import ratingParser from './parsers/rating.js';
import cardPricingParser from './parsers/card-pricing.js';
import uspStripeParser from './parsers/usp-stripe.js';
import cardFeatureParser from './parsers/card-feature.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import stepsParser from './parsers/steps.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import carouselBlogParser from './parsers/carousel-blog.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/avg-cleanup.js';
import sectionsTransformer from './transformers/avg-sections.js';

// PARSER REGISTRY
const parsers = {
  'promo-bar': promoBarParser,
  'hero-product': heroProductParser,
  'rating': ratingParser,
  'card-pricing': cardPricingParser,
  'usp-stripe': uspStripeParser,
  'card-feature': cardFeatureParser,
  'columns-feature': columnsFeatureParser,
  'steps': stepsParser,
  'accordion-faq': accordionFaqParser,
  'carousel-blog': carouselBlogParser,
};

// TRANSFORMER REGISTRY
const transformers = [cleanupTransformer, sectionsTransformer];

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  "name": "consumer-product",
  "description": "Consumer product/app landing page: hero with commerce-driven pricing cards + free-trial CTA + Trustpilot, USP stripe, feature grids, 3-easy-steps, how-to-install / system requirements, FAQ accordion, blog carousel.",
  "urls": [
    "https://www.avg.com/en-us/secure-vpn",
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
        ".combined-actionbox:not(#hero *), .actionbox-facelift:not(#hero *)"
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
