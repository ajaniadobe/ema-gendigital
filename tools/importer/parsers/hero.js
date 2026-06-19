/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero. Base: hero.
 * Source: AVG.com homepage (#top) and business pages (.section-intro-variant-b).
 * Library structure: 1 column, 3 rows — [name], [background/hero image], [title + intro + CTA].
 * The Trustpilot widget inside the hero is a SEPARATE rating block (not emitted here).
 * The decorative glow background is structural and not emitted.
 */
export default function parse(element, { document }) {
  // Hero / device image — the editorial image at the top of the hero.
  const heroImage = element.querySelector(':scope > img, .span6.img img, img[class*="hero"], .hero-image img');

  // Title.
  const heading = element.querySelector('h1, h2');

  // Intro paragraph (may contain an inline link).
  const intro = element.querySelector('.top-text, .body-1, .text > div, .hero-intro, p');

  // Primary CTA — prefer the PC/default download button; fall back to first meaningful button.
  const primaryCta = element.querySelector(
    '.js-pc a.button, .buttons a.button, .button-wrapper a.button, a.button.primary, a.cta'
  );

  // Bail gracefully if nothing meaningful was found.
  if (!heading && !intro) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background / hero image (optional).
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 3: title + intro + CTA, all in a single cell.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (intro) contentCell.push(intro);
  if (primaryCta) {
    // Emit a clean anchor preserving the visible label and href.
    const a = document.createElement('a');
    a.setAttribute('href', primaryCta.getAttribute('href'));
    a.textContent = (primaryCta.textContent || '').trim();
    contentCell.push(a);
  }
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
