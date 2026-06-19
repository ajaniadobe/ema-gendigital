/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tool-placeholder. Base: tool-placeholder (custom block).
 * Source: AVG.com interactive tool widgets (#top .tool / #app, e.g. Random Password Generator).
 * The interactive logic is OUT OF SCOPE — this is a STATIC stand-in. We preserve the widget's
 * verbatim visible labels as static content (sample value, strength badge, length label, and
 * the character-set labels). Icon SVGs and form controls (sliders, checkboxes, buttons) are
 * structural and NOT emitted. The page H1 / sub-h1 are section-level default content.
 * FLAG: static placeholder — interactive widget behavior not migrated.
 * NOTE: validated against representative URL random-password-generator (10 verbatim labels).
 * Other free-tool members (e.g. awards) have no widget under #top — parser no-ops there.
 */
export default function parse(element, { document }) {
  // The widget container.
  const widget = element.querySelector('#app, .tool, [class*="generator"], .widget') || element;

  if (!widget) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const contentCell = [];

  // Collect verbatim visible labels: any element with direct text and no structural role.
  const labelSelectors = [
    '.password', '.badge', '.length-settings label', '.length',
    '.complexity-settings label', '.custom-control-label',
    '#pwd-copy-btn span', '[class*="label"]', 'label',
  ];
  const seen = new Set();
  labelSelectors.forEach((sel) => {
    widget.querySelectorAll(sel).forEach((el) => {
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        const p = document.createElement('p');
        p.textContent = text;
        contentCell.push(p);
      }
    });
  });

  // Fallback: if no labels found, capture the widget's full visible text as a single block.
  if (!contentCell.length) {
    const text = (widget.textContent || '').replace(/\s+/g, ' ').trim();
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      contentCell.push(p);
    }
  }

  if (!contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'tool-placeholder', cells });
  element.replaceWith(block);
}
