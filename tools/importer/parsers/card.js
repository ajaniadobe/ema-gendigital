/* eslint-disable */
/* global WebImporter */
/**
 * Parser for card. Base: card (custom block).
 * Source: AVG.com product card grids (.included / .included-card, business resources grid,
 * free-tool upsell .js-platform-switch).
 * Each card = product icon (structural — NOT emitted) + name heading + description + "Learn more" link.
 * Cards expose multiple platform-specific links (js-pc/js-mac/...) — only the default (PC/first) is kept.
 * The "Included in AVG Ultimate:" title is section-level default content and is NOT part of the cards.
 */
export default function parse(element, { document }) {
  // Locate the individual cards. Support several source layouts.
  let cards = Array.from(element.querySelectorAll('.included-card, .card-item, .card-product'));
  if (!cards.length) {
    cards = Array.from(element.querySelectorAll(':scope .cards > div, :scope .row > div > div'));
  }

  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const name = card.querySelector('.h5, h2, h3, h4, [class*="title"]');
    const desc = card.querySelector('.body-3, .included-card-body .body-3, p, [class*="body"]');
    // Default platform link: prefer .js-pc, else the first link.
    const link = card.querySelector('a.js-pc, a[href]');

    const cardCell = [];
    if (name) cardCell.push(name);
    if (desc && desc !== name) cardCell.push(desc);
    if (link) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = (link.textContent || '').trim();
      cardCell.push(a);
    }
    if (cardCell.length) cells.push([cardCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'card', cells });
  element.replaceWith(block);
}
