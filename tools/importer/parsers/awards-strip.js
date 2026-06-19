/* eslint-disable */
/* global WebImporter */
/**
 * Parser for awards-strip. Base: awards-strip (custom block).
 * Source: AVG.com #awards-card — heading + paragraph + row of award badge images with captions.
 * The laurel/goblet decorations (leading icon, .d-sm-none laurels) are structural and NOT emitted.
 * Editorial award badge images (.awards-icon img) ARE kept, each with its verbatim caption.
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, h2, h3');
  const intro = element.querySelector('.body-2, p');

  // Editorial award badges: each .awards-icon holds a badge image + caption.
  const awards = Array.from(element.querySelectorAll('.awards-icon'));

  if (!heading && !awards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row: heading + intro paragraph.
  const headCell = [];
  if (heading) headCell.push(heading);
  if (intro) headCell.push(intro);
  if (headCell.length) cells.push([headCell]);

  // One row per award badge: editorial image + verbatim caption.
  awards.forEach((award) => {
    const img = award.querySelector('img');
    const caption = award.querySelector('.body-2, p, div');
    const awardCell = [];
    if (img) awardCell.push(img);
    if (caption) awardCell.push(caption);
    if (awardCell.length) cells.push([awardCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'awards-strip', cells });
  element.replaceWith(block);
}
