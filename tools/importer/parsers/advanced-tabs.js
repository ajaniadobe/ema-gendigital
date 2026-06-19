/* eslint-disable */
/* global WebImporter */
/**
 * Parser for advanced-tabs. Base: advanced-tabs (custom block).
 * Source: AVG.com device-tabbed media+text panel (#media-1). Content for each device
 * (PC/Mac/Android/iOS) is in sibling .js-pc / .js-mac / .js-android / .js-ios spans/imgs.
 * Tab labels are the per-device product names (.icon-product span.js-{device}).
 * Each row = one device tab: [tab label] | [media image + heading + body + primary download CTA].
 * The product icon and platform glyphs are structural and NOT emitted.
 */
export default function parse(element, { document }) {
  const devices = ['pc', 'mac', 'android', 'ios'];

  const cells = [];
  devices.forEach((device) => {
    const cls = `.js-${device}`;

    // Tab label = product name for this device.
    const labelEl = element.querySelector(`.icon-product span${cls}`);
    const label = labelEl ? (labelEl.textContent || '').trim() : '';

    // Heading text for this device.
    const headingSpan = element.querySelector(`h1 span${cls}, h2 span${cls}, h3 span${cls}`);
    // Body text for this device.
    const bodySpan = element.querySelector(`.body-3 span${cls}, .body-2 span${cls}, p span${cls}`);
    // Media image for this device.
    const media = element.querySelector(`.span6.img img${cls}, .img img${cls}, img${cls}`);
    // Primary download CTA for this device (first matching button link).
    const cta = element.querySelector(`a.button${cls}, a${cls}.button, .buttons a${cls}`);

    // Skip devices with no meaningful content.
    if (!label && !headingSpan && !bodySpan) return;

    const contentCell = [];
    if (media) contentCell.push(media);
    if (headingSpan) {
      const h = document.createElement('h2');
      h.textContent = (headingSpan.textContent || '').trim();
      contentCell.push(h);
    }
    if (bodySpan) {
      const p = document.createElement('p');
      p.textContent = (bodySpan.textContent || '').trim();
      contentCell.push(p);
    }
    if (cta) {
      const a = document.createElement('a');
      a.setAttribute('href', cta.getAttribute('href'));
      a.textContent = (cta.textContent || '').replace(/\s+/g, ' ').trim();
      contentCell.push(a);
    }

    const labelCell = [];
    if (label) {
      const p = document.createElement('p');
      p.textContent = label;
      labelCell.push(p);
    }

    cells.push([labelCell.length ? labelCell : '', contentCell.length ? contentCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'advanced-tabs', cells });
  element.replaceWith(block);
}
