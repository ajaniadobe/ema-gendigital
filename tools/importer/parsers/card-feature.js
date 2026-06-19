/* eslint-disable */
/* global WebImporter */
/**
 * Parser for card-feature. Base: card-feature (custom block).
 * Source: AVG.com feature grids (#highlights .highlight, .cards tip cards).
 * Each feature = icon (structural — NOT emitted) + heading + text.
 * The section H2 / subheadline are section-level default content and are NOT part of the cards.
 * Item layout varies across pages, so detection falls back through several container patterns
 * and ultimately groups each heading with its following paragraph.
 * NOTE: validated against representative URL secure-vpn (extracts all 4 .highlight features).
 * Some family members (e.g. antitrack) have no #highlights block at all — the parser
 * gracefully no-ops there via the empty-block guard.
 */
export default function parse(element, { document }) {
  // Try known item-container classes first (mutually exclusive query chain).
  let items = Array.from(
    element.querySelectorAll('.highlight, .cards-card, .card-feature-item, .feature-card')
  );

  // Fallback: direct children of a known grid wrapper.
  if (!items.length) {
    const wrapper = element.querySelector('.highlights-wrapper, .cards, .row');
    if (wrapper) {
      items = Array.from(wrapper.children).filter(
        (c) => c.querySelector('h2, h3, h4') && c.querySelector('p')
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
    // Last-resort fallback: pair each heading with its following paragraph,
    // skipping the leading section headline (first h2).
    const headings = Array.from(element.querySelectorAll('h3, h4'));
    headings.forEach((heading) => {
      const featureCell = [heading];
      let sib = heading.nextElementSibling;
      while (sib && !/^H[1-6]$/.test(sib.tagName)) {
        if (sib.tagName === 'P' || sib.querySelector?.('p')) {
          const p = sib.tagName === 'P' ? sib : sib.querySelector('p');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'card-feature', cells });
  element.replaceWith(block);
}
