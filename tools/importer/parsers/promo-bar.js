/* eslint-disable */
/* global WebImporter */
/**
 * Parser for promo-bar. Base: promo-bar (custom block).
 * Source: AVG.com message-bar announcement (section.message-bar).
 * Single linked announcement message. The star SVG icon is structural/baked
 * into block CSS and is NOT emitted as content.
 */
export default function parse(element, { document }) {
  // The announcement is a single anchor wrapping the message text.
  const link = element.querySelector('a.message-bar__content, a[href]');
  const messageText = element.querySelector('.message-bar__content span, span');

  // Bail gracefully if there is no message.
  if (!messageText || !messageText.textContent.trim()) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build a single anchor carrying the verbatim message text + destination,
  // dropping the structural star icon image.
  let cellContent;
  if (link) {
    const a = document.createElement('a');
    a.setAttribute('href', link.getAttribute('href'));
    a.textContent = messageText.textContent.trim();
    cellContent = a;
  } else {
    const p = document.createElement('p');
    p.textContent = messageText.textContent.trim();
    cellContent = p;
  }

  const cells = [];
  cells.push([cellContent]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'promo-bar', cells });
  element.replaceWith(block);
}
