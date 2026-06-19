/* eslint-disable */
/* global WebImporter */
/**
 * Parser for steps. Base: steps (custom block).
 * Source: AVG.com numbered how-to section (#highlights-bottom .highlight-bottom items).
 * Each step = icon/number glyph (structural — NOT emitted) + heading + text.
 * The .arrow-right separators and the section H2 (default content) are NOT part of the block.
 * Step numbering is applied structurally by block CSS, so only heading + text are emitted per step.
 * NOTE: validated against representative URL secure-vpn (3 steps). Some family members
 * (e.g. antitrack) have no #highlights-bottom section — parser gracefully no-ops there.
 */
export default function parse(element, { document }) {
  let steps = Array.from(element.querySelectorAll('.highlight-bottom, .step'));
  if (!steps.length) {
    const wrapper = element.querySelector('.highlights-bottom-wrapper, .steps-wrapper');
    if (wrapper) {
      steps = Array.from(wrapper.children).filter(
        (c) => !c.classList.contains('arrow-right') && c.querySelector('h2, h3, h4')
      );
    }
  }

  if (!steps.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  steps.forEach((step) => {
    const heading = step.querySelector('h2, h3, h4, [class*="title"]');
    const text = step.querySelector('p, [class*="body"]');
    const stepCell = [];
    if (heading) stepCell.push(heading);
    if (text && text !== heading) stepCell.push(text);
    if (stepCell.length) cells.push([stepCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'steps', cells });
  element.replaceWith(block);
}
