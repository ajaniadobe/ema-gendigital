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
  // Free-tool upsell layout: a single `.modal-bottom` card (icon + h4 + per-platform
  // description and download button). Emit it as ONE card, keeping only the default
  // PC variant (`.js-pc`) so the mac/ios/android duplicates are not repeated.
  const modal = element.matches && element.matches('.modal-bottom')
    ? element
    : (element.querySelector ? element.querySelector('.modal-bottom') : null);
  if (modal) {
    const cardCell = [];
    const icon = modal.querySelector('img');
    if (icon) {
      const img = document.createElement('img');
      img.setAttribute('src', icon.getAttribute('src'));
      img.setAttribute('alt', icon.getAttribute('alt') || '');
      cardCell.push(img);
    }
    const heading = modal.querySelector('h2, h3, h4');
    if (heading) {
      const h = document.createElement('h3');
      h.textContent = (heading.textContent || '').trim();
      cardCell.push(h);
    }
    // PC-variant description (fall back to the first description paragraph).
    const descEl = modal.querySelector('.text .js-pc p, .text .pc p, .text p, .js-pc p, p');
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = (descEl.textContent || '').replace(/\s+/g, ' ').trim();
      if (p.textContent) cardCell.push(p);
    }
    // PC-variant download link (fall back to the first link).
    const linkEl = modal.querySelector('.button-wrapper .js-pc a[href], .js-pc a[href], a[href]');
    if (linkEl) {
      const a = document.createElement('a');
      a.setAttribute('href', linkEl.getAttribute('href'));
      a.textContent = (linkEl.textContent || 'Free download').replace(/\s+/g, ' ').trim();
      cardCell.push(a);
    }
    if (cardCell.length) {
      const block = WebImporter.Blocks.createBlock(document, { name: 'card', cells: [[cardCell]] });
      element.replaceWith(block);
      return;
    }
  }

  // Locate the individual cards. Support several source layouts.
  let cards = Array.from(element.querySelectorAll('.included-card, .card-item, .card-product'));
  if (!cards.length) {
    // business-product "Free tools and guides" grid: each card is a `.span4`
    // column holding a thumbnail `a > img` plus an `h3` title link.
    cards = Array.from(element.querySelectorAll(':scope .span4, :scope .row > .span4'))
      .filter((c) => c.querySelector('img') || c.querySelector('h2, h3, h4'));
  }
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
    // Thumbnail image (e.g. the guide cover) — preserved so the card renders its art.
    const thumb = card.querySelector('img');
    // Default platform link: prefer .js-pc, else the first link.
    const link = card.querySelector('a.js-pc, a[href]');

    const cardCell = [];
    if (thumb) {
      const img = document.createElement('img');
      img.setAttribute('src', thumb.getAttribute('src'));
      if (thumb.getAttribute('alt')) img.setAttribute('alt', thumb.getAttribute('alt'));
      cardCell.push(img);
    }
    if (name) cardCell.push(name);
    if (desc && desc !== name) cardCell.push(desc);
    // Standalone "Learn more"-style link — but only when it isn't just a repeat
    // of the title link already inside `name` (the Free-tools cards wrap their
    // h3 title in the same link, which would otherwise duplicate the row).
    const nameHref = name && name.querySelector('a[href]')
      ? name.querySelector('a[href]').getAttribute('href')
      : null;
    if (link && link.getAttribute('href') !== nameHref) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      // Prefer the title text over an empty/image-only link's text.
      const linkText = (link.textContent || '').replace(/\s+/g, ' ').trim();
      a.textContent = linkText || (name ? (name.textContent || '').trim() : '');
      if (a.textContent) cardCell.push(a);
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
