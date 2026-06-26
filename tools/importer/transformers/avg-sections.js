/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AVG.com section breaks + section metadata.
 *
 * Driven entirely by payload.template.sections (from page-templates.json). For each
 * section, locates the section's root element via its configured selector(s), inserts
 * a <hr> before every non-first section, and emits a "Section Metadata" block carrying
 * the section's `style` (e.g. light / dark / light-blue).
 *
 * IMPORTANT - two-phase, marker-based design:
 * Block parsers run BETWEEN our beforeTransform and afterTransform hooks, and several of
 * them REPLACE the section root element via element.replaceWith(block) (e.g.
 * card-feature replaces `section.cards`, tool-placeholder replaces `#top`,
 * accordion-faq replaces `#faq`). That means the section selectors in page-templates.json
 * NO LONGER MATCH anything by the time afterTransform runs - which previously caused all
 * section breaks AND the section style metadata (e.g. the free-tool `tips` light-blue
 * variant) to be silently dropped.
 *
 * To survive parser replacement we resolve the section roots in beforeTransform (while the
 * original DOM is intact) and drop a stable, parser-proof marker element as a SIBLING
 * immediately before each section root. Because the marker is a previous sibling - not the
 * section root itself nor a descendant of it - a parser's replaceWith on the section root
 * never touches it. In afterTransform we replace each marker with the real <hr> break
 * (for non-first sections) and the Section Metadata block.
 *
 * Section selectors come from page-templates.json (built from the captured DOM), never guessed.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

const MARKER_TAG = 'eds-section-marker';

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
  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections)
    ? template.sections
    : [];
  if (sections.length < 2) return;

  const document = element.ownerDocument;

  // --- Phase 1 (beforeTransform): drop parser-proof markers before parsers mutate the DOM ---
  // Markers are inserted as previous siblings of each section root, so they survive
  // any later element.replaceWith(block) the block parsers perform on the section roots.
  if (hookName === TransformHook.beforeTransform) {
    sections.forEach((section, index) => {
      const sectionEl = findSectionElement(element, section);
      if (!sectionEl || !sectionEl.parentNode) return;

      const marker = document.createElement(MARKER_TAG);
      marker.setAttribute('data-section-index', String(index));
      if (section.style) marker.setAttribute('data-section-style', section.style);
      sectionEl.parentNode.insertBefore(marker, sectionEl);
    });
    return;
  }

  // --- Phase 2 (afterTransform): turn markers into real section breaks + metadata ---
  if (hookName === TransformHook.afterTransform) {
    const markers = Array.from(element.querySelectorAll(MARKER_TAG));
    markers.forEach((marker) => {
      const index = Number(marker.getAttribute('data-section-index'));
      const style = marker.getAttribute('data-section-style');
      const parent = marker.parentNode;
      if (!parent) return;

      // Insert a section break (<hr>) before every section except the first, so each
      // section boundary is represented in the imported markdown.
      if (index > 0) {
        parent.insertBefore(document.createElement('hr'), marker);
      }

      // Emit the Section Metadata block (carrying e.g. light / dark / light-blue) for
      // every section that defines a style, placed at the section boundary.
      if (style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style },
        });
        parent.insertBefore(metadataBlock, marker);
      }

      // Drop the marker itself - it is not authorable content.
      marker.remove();
    });
  }
}
