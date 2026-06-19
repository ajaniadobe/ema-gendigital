/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: AVG.com FAQ accordions (#sysreq .faq-container, #faq .accordion-item).
 * Library: 2 columns — each row is one accordion item: [Title cell, Content cell].
 * Question = .accordion-title h4 (verbatim); Answer = .accordion-content body (paragraphs,
 * lists, links preserved). Backs FAQPage JSON-LD, so Q/A text must stay verbatim.
 * NOTE: validated against representative URL secure-vpn (10 Q/A items under #sysreq).
 * On some members (e.g. antitrack) the FAQ is not under #sysreq, so the page-templates
 * selector finds nothing there — the parser no-ops gracefully via the empty-block guard.
 */
export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll('.accordion-item, .faq-item'));
  if (!items.length) {
    // Fallback: question/answer class pairs without an item wrapper.
    const questions = Array.from(element.querySelectorAll('.accordion-title, .question'));
    items = questions.map((q) => q.parentElement).filter(Boolean);
  }

  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    const titleEl = item.querySelector('.accordion-title, .question');
    const contentEl = item.querySelector('.accordion-content, .answer');

    // Title cell: prefer the heading text inside the title element.
    const questionHeading = (titleEl && titleEl.querySelector('h2, h3, h4, h5')) || titleEl;
    if (!questionHeading) return;

    // Content cell: gather meaningful child nodes (skip empty <p></p>).
    const contentCell = [];
    if (contentEl) {
      Array.from(contentEl.children).forEach((child) => {
        if ((child.textContent || '').trim() || child.querySelector('img, a, li')) {
          contentCell.push(child);
        }
      });
      if (!contentCell.length && (contentEl.textContent || '').trim()) {
        contentCell.push(contentEl);
      }
    }

    cells.push([questionHeading, contentCell.length ? contentCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
