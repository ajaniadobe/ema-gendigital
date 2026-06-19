/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel. Base: carousel.
 * Source: AVG.com blog article carousel (#blogposts .tiny-slider a.tns-item slides).
 * Library: 2 columns per slide row — [Image] | [Title + description + CTA].
 * Each slide = editorial thumbnail (kept) + linked blog title + teaser + "Read More".
 * The section H2 and "See all articles" link are section-level default content (not in the block).
 * Slide nav arrows/dots are structural and NOT emitted.
 */
export default function parse(element, { document }) {
  let slides = Array.from(element.querySelectorAll('a.tns-item, .tns-item, .carousel-slide, .slide'));
  if (!slides.length) {
    const track = element.querySelector('.tns-slider, .tiny-slider, .carousel-track');
    if (track) slides = Array.from(track.querySelectorAll(':scope > a, :scope > div'));
  }

  if (!slides.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    const title = slide.querySelector('.blog-title, h2, h3, h4, h5');
    const teaser = slide.querySelector('.blog-perex, p');
    const ctaText = slide.querySelector('.button span, .button, [class*="button"]');
    const href = slide.getAttribute('href') || slide.querySelector('a')?.getAttribute('href');

    const textCell = [];
    if (title) {
      // Wrap the title in its slide link so the article URL is preserved.
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = (title.textContent || '').trim();
        textCell.push(a);
      } else {
        textCell.push(title);
      }
    }
    if (teaser) textCell.push(teaser);
    if (href && ctaText) {
      const cta = document.createElement('a');
      cta.setAttribute('href', href);
      cta.textContent = (ctaText.textContent || 'Read More').replace(/\s+/g, ' ').trim();
      textCell.push(cta);
    }

    const imageCell = img ? [img] : [''];
    if (textCell.length || img) cells.push([imageCell, textCell.length ? textCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
