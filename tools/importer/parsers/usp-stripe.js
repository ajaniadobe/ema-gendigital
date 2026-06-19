/* eslint-disable */
/* global WebImporter */
/**
 * Parser for usp-stripe. Base: usp-stripe (custom block).
 * Source: AVG.com benefit stripe (.usp-stripe with .usp-stripe-item children).
 * Each item is an icon + label. The icons are baked/structural and are NOT emitted —
 * only the verbatim benefit labels are emitted, one per row.
 */
export default function parse(element, { document }) {
  // The list of benefit items.
  const items = Array.from(
    element.querySelectorAll('.usp-stripe-item, .usp-item, li')
  );

  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    // Verbatim label only — skip the structural icon image.
    const labelEl = item.querySelector('span, p, .usp-label') || item;
    const text = (labelEl.textContent || '').trim();
    if (!text) return;
    const p = document.createElement('p');
    p.textContent = text;
    cells.push([p]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'usp-stripe', cells });
  element.replaceWith(block);
}
