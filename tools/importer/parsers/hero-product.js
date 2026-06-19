/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-product. Base: hero.
 * Source: AVG.com dark product hero (#hero). Library: 1 column, 3 rows —
 * [name], [product/background image], [title + intro + free-trial CTA].
 * H1 = .product-name h1; intro = .hero-subheadline.
 * EXCLUDED (separate blocks / structural):
 *   - Trustpilot widget  -> the separate `rating` block
 *   - .js-platform-switch pricing action-boxes -> the separate `card-pricing` block
 *   - product icon glyph  -> structural
 * The free-trial CTA ("Try it for ... days") is the hero's call-to-action.
 * NOTE: validated against representative URL secure-vpn (#hero -> H1, subheadline, trial CTA).
 * On some members (e.g. antitrack) the live DOM omits the #hero id, so the page-templates
 * selector matches nothing there — the parser no-ops gracefully via the empty-block guard.
 */
export default function parse(element, { document }) {
  // Product / background image — the leading hero image (direct child of #hero).
  const heroImage = element.querySelector(':scope > img, .product-name + img, img[class*="hero"]');

  // Title.
  const heading = element.querySelector('.product-name h1, h1, h2');

  // Intro / subheadline.
  const intro = element.querySelector('.hero-subheadline, .hero-intro, p');

  // Free-trial CTA — the trial download link (not a checkout/Buy-now pricing link).
  let cta = element.querySelector('.actionboxes-footer a[href], a.bi-download-link[href]');
  if (!cta) {
    cta = Array.from(element.querySelectorAll('a[href]')).find(
      (a) => !/checkout\.avg\.com|store-cb\.avg\.com/.test(a.getAttribute('href') || '')
        && /try|free|download/i.test(a.textContent || '')
    ) || null;
  }

  if (!heading && !intro) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: product / background image (optional).
  if (heroImage) cells.push([heroImage]);

  // Row 3: title + intro + free-trial CTA, in a single cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (intro) contentCell.push(intro);
  if (cta) {
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href'));
    a.textContent = (cta.textContent || '').replace(/\s+/g, ' ').trim();
    contentCell.push(a);
  }
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
