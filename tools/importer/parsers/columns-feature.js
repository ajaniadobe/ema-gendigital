/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: AVG.com #features section — an image beside a feature list of heading/text pairs
 * (.features-right .features-wrapper .feature). Library: multi-column (columns base).
 * This variant = 2 columns: [media image] + [stacked feature heading/text pairs].
 * The section H2 is section-level default content and is NOT part of the block.
 * Feature item icons are structural and NOT emitted; only heading + text per feature.
 * NOTE: validated against representative URL secure-vpn (8 .feature items + media image).
 * Some family members (e.g. antitrack) have no #features .feature structure — the parser
 * gracefully no-ops there via the empty-block guard.
 * Also handles the business-security "Easy to manage" layout (ul.features-list > li.tick).
 */
export default function parse(element, { document }) {
  // Feature items (each = heading + text). Two source layouts are supported:
  //   - secure-vpn #features: `.feature` divs (heading/text, leading <img> icon).
  //   - business-security "Easy to manage": `ul.features-list > li.tick`, each
  //     holding a `p.like-h4` heading and a following `p` description.
  let features = Array.from(element.querySelectorAll('.feature'));
  let featureMode = 'feature';
  if (!features.length) {
    features = Array.from(element.querySelectorAll('.features-list > li, ul.features-list li, li.tick'));
    featureMode = 'li';
  }

  // Main media image — the large screenshot beside the feature list.
  // Prefer an image that is NOT inside a feature item.
  const allImgs = Array.from(element.querySelectorAll('img'));
  const mediaImg = allImgs.find((img) => !img.closest('.feature, .features-list, li')) || allImgs[0] || null;

  if (!features.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build the feature-list cell (heading + text per feature).
  const listCell = [];
  features.forEach((feat) => {
    if (featureMode === 'li') {
      // li layout: first p (often .like-h4) is the heading, remaining p's the text.
      const ps = Array.from(feat.querySelectorAll('p'));
      const heading = feat.querySelector('p.like-h4') || ps[0] || null;
      ps.forEach((p) => {
        if (p === heading) {
          const h = document.createElement('h3');
          h.textContent = (p.textContent || '').trim();
          listCell.push(h);
        } else {
          const para = document.createElement('p');
          para.textContent = (p.textContent || '').trim();
          if (para.textContent) listCell.push(para);
        }
      });
    } else {
      const heading = feat.querySelector('h2, h3, h4');
      const text = feat.querySelector('p');
      if (heading) listCell.push(heading);
      if (text) listCell.push(text);
    }
  });

  if (!listCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 2-column row: media image | feature list. Pad media cell if no image found.
  const mediaCell = mediaImg ? [mediaImg] : [''];

  const cells = [];
  cells.push([mediaCell, listCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
