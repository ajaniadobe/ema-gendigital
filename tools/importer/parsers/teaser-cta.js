/* eslint-disable */
/* global WebImporter */
/**
 * Parser for teaser-cta. Base: teaser-cta (custom block).
 * Source: AVG.com closing CTA banner (#teaser) and business management-console promo banner
 * (.section.banner-management-console). Single-cell banner: heading + optional paragraph + CTA.
 * Homepage variant: "Whatever devices you use..." headline + Free download cluster (default PC kept).
 * Business variant: heading + paragraph + "Learn more".
 * The decorative icon image is structural and is NOT emitted.
 */
export default function parse(element, { document }) {
  // Heading: a real heading, or the banner lead text inside .ico.
  const heading = element.querySelector('h1, h2, h3, .ico p, .like-h2, [class*="title"]');

  // Optional supporting paragraph (distinct from the heading element).
  const paragraphs = Array.from(element.querySelectorAll('p')).filter((p) => p !== heading);
  const paragraph = paragraphs.find((p) => (p.textContent || '').trim());

  // Primary CTA: prefer the default PC download / first meaningful button or link.
  const cta = element.querySelector('.js-pc a.button, a.button, a.cta, .buttons a, a[class*="button"]')
    || element.querySelector('a[href]');

  if (!heading && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const contentCell = [];
  if (heading) {
    // Preserve heading text; .ico p is plain text, headings keep their tag.
    contentCell.push(heading);
  }
  if (paragraph && paragraph !== heading) contentCell.push(paragraph);
  if (cta) {
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href'));
    a.textContent = (cta.textContent || '').replace(/\s+/g, ' ').trim();
    contentCell.push(a);
  }

  const cells = [];
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser-cta', cells });
  element.replaceWith(block);
}
