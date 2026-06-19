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
  "name": "content",
  "description": "Informational/content page: intro, long-form rich text with subheadings, lists and media objects, closing CTA.",
  "urls": [
    "https://www.avg.com/en-us/activate-account",
    "https://www.avg.com/en-us/affiliate/become-an-avg-affiliate",
    "https://www.avg.com/en-us/avg-go-tech-support",
    "https://www.avg.com/en-us/campaign-landing-pages/ransomware-infographic-download",
    "https://www.avg.com/en-us/campaign-landing-pages/ransomware-kit-download",
    "https://www.avg.com/en-us/contacts",
    "https://www.avg.com/en-us/hackers-and-hacking",
    "https://www.avg.com/en-us/keeping-your-data-safe",
    "https://www.avg.com/en-us/online-security-plugin",
    "https://www.avg.com/en-us/partners",
    "https://www.avg.com/en-us/profile",
    "https://www.avg.com/en-us/remove-win32-expiro",
    "https://www.avg.com/en-us/remove-win32-neshta",
    "https://www.avg.com/en-us/remove-win32-virut",
    "https://www.avg.com/en-us/services",
    "https://www.avg.com/en-us/submit-a-sample"
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
