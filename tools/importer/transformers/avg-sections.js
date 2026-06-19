/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AVG.com section breaks + section metadata.
 *
 * Driven entirely by payload.template.sections (from page-templates.json). For each
 * section, locates the section's root element via its configured selector(s), inserts
 * a <hr> before every non-first section, and appends a "Section Metadata" block
 * carrying the section's `style` (e.g. light / dark / light-blue).
 *
 * Runs in afterTransform only (block parsers have already produced their tables).
 * Section selectors come from page-templates.json (which itself was built from the
 * captured DOM), never guessed.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

/** Resolve the first matching element for a section's selector list. */
function findSectionElement(element, section) {
  const selectors = Array.isArray(section.selector)
    ? section.selector
    : [section.selector];
  for (const selector of selectors) {
    if (!selector) continue;
    try {
      const found = element.querySelector(selector);
      if (found) return found;
    } catch (e) {
      // Invalid/unsupported selector on this page - skip it.
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections)
      ? template.sections
      : [];
    if (sections.length < 2) return;

    const document = element.ownerDocument;

    // Process in reverse so inserting nodes never shifts the position of
    // sections we have not handled yet.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = findSectionElement(element, section);
      if (!sectionEl) continue;

      // Append a Section Metadata block immediately after the section element
      // for every section that defines a style.
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (sectionEl.parentNode) {
          sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
        }
      }

      // Insert a section break (<hr>) before every section except the first,
      // so each section boundary is represented in the imported markdown.
      if (i > 0 && sectionEl.parentNode) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
