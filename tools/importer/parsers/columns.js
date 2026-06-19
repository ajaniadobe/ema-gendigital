/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns. Base: columns.
 * Source: AVG.com side-by-side media+text sections (#media-2, #media-3 .container,
 * business "One subscription" section). Library: multi-column; column count from visual grouping.
 * This variant = 2 columns: [text column] + [image column].
 * Text column = eyebrow/product name + heading + paragraph + CTA.
 * Structural assets (product icon, platform icon strip) are NOT emitted; the editorial
 * product screenshot IS kept as the image column.
 */
export default function parse(element, { document }) {
  // Text side and image side.
  const textCol = element.querySelector('.span6.text, .text, [class*="text"]');
  const imgCol = element.querySelector('.span6.img, .img, [class*="img"]');

  // Editorial product screenshot (image column).
  const productImg = imgCol ? imgCol.querySelector('img') : element.querySelector('.span6.img img');

  // Eyebrow / product name (editorial text, drop the leading product icon img).
  const eyebrowEl = element.querySelector('.icon-product');
  const heading = element.querySelector('h1, h2, h3');
  const paragraph = element.querySelector('.body-3, .body-2, p');
  const cta = element.querySelector('.buttons a.button, a.button, a.cta');

  if (!heading && !paragraph) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build the text cell.
  const textCell = [];
  if (eyebrowEl) {
    const eyebrow = document.createElement('p');
    eyebrow.textContent = (eyebrowEl.textContent || '').replace(/\s+/g, ' ').trim();
    if (eyebrow.textContent) textCell.push(eyebrow);
  }
  if (heading) textCell.push(heading);
  if (paragraph) textCell.push(paragraph);
  if (cta) {
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href'));
    a.textContent = (cta.textContent || '').trim();
    textCell.push(a);
  }

  // Image cell.
  const imageCell = productImg ? [productImg] : [''];

  const cells = [];
  cells.push([textCell, imageCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
