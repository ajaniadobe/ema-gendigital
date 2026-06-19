/* eslint-disable */
/* global WebImporter */
/**
 * Parser for rating. Base: rating (custom block).
 * Source: AVG.com Trustpilot widget (.trustpilot / iframe.trustpilot-widget).
 * STATIC Trustpilot reference. The stars/score/caption render INSIDE the Trustpilot
 * iframe and are not present in the source DOM, so we emit a static rating block:
 *   - a verbatim caption referencing Trustpilot
 *   - an author-editable score placeholder cell (filled in by the author)
 * The star glyphs are structural/baked and are NOT emitted as content.
 */
export default function parse(element, { document }) {
  // Confirm this is a Trustpilot rating reference.
  const widget = element.querySelector('iframe.trustpilot-widget, iframe[title*="Trustpilot"], iframe[src*="trustpilot"], .trustpilot-widget')
    || element;

  if (!widget) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Caption — verbatim Trustpilot reference (source provides no visible text).
  const caption = document.createElement('p');
  caption.textContent = 'Customer reviews powered by Trustpilot';

  // Author-editable score placeholder — the numeric score is not in the DOM.
  const score = document.createElement('p');
  score.textContent = '[Score]';

  const cells = [];
  cells.push([score]);
  cells.push([caption]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'rating', cells });
  element.replaceWith(block);
}
