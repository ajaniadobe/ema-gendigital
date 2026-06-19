/* eslint-disable */
/* global WebImporter */
/**
 * Parser for card-pricing. Base: card-pricing (custom block).
 * Source: AVG.com static pricing action-boxes (#bft / #hero .pricing, .box.font-avg-sans-1).
 * STATIC pricing cards — commerce is OUT OF SCOPE. We preserve the verbatim copy
 * (term, savings label, price, "Buy now") and the checkout.avg.com link structure AS-IS,
 * with no dynamic wiring. FLAG: retained as static reference content for authors.
 * Each .box becomes one card row: [term, savings, price summary, Buy now link].
 */
export default function parse(element, { document }) {
  // Each pricing option is a .box. Some pages render device-quantity variants as
  // separate vue-action-box groups, so detection falls back progressively.
  let boxes = Array.from(element.querySelectorAll('.box.font-avg-sans-1, .actionbox-buy .box'));
  if (!boxes.length) {
    boxes = Array.from(element.querySelectorAll('.box')).filter((b) => b.querySelector('.actionbox-title, .actionbox-price-main'));
  }
  if (!boxes.length) {
    // Last resort: any container that holds a price + a checkout link.
    boxes = Array.from(element.querySelectorAll('div')).filter(
      (b) => b.querySelector('.actionbox-price-main, [class*="price-main"]')
        && b.querySelector('a[href*="checkout.avg.com"]')
    );
  }

  if (!boxes.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  boxes.forEach((box) => {
    const cardCell = [];

    // Term (e.g. "1 year").
    const term = box.querySelector('.actionbox-title');
    if (term) {
      const h = document.createElement('p');
      h.textContent = (term.textContent || '').trim();
      cardCell.push(h);
    }

    // Savings label (e.g. "Save 46%").
    const savings = box.querySelector('.header-wrap .label .label-text, .label .label-text');
    if (savings) {
      const s = document.createElement('p');
      s.textContent = (savings.textContent || '').trim();
      cardCell.push(s);
    }

    // Price summary — verbatim, normalized whitespace.
    const price = box.querySelector('.actionbox-price-main');
    if (price) {
      const p = document.createElement('p');
      p.textContent = (price.textContent || '').replace(/\s+/g, ' ').trim();
      cardCell.push(p);
    }

    // Buy now checkout link — preserved AS-IS (commerce out of scope).
    const buy = box.parentElement
      ? box.parentElement.querySelector('a.actionbox-button, a.bi-cart-link, a[href*="checkout.avg.com"]')
      : null;
    const buyLink = buy || box.querySelector('a.actionbox-button, a.bi-cart-link, a[href*="checkout.avg.com"]');
    if (buyLink) {
      const a = document.createElement('a');
      a.setAttribute('href', buyLink.getAttribute('href'));
      a.textContent = (buyLink.textContent || '').replace(/\s+/g, ' ').trim();
      cardCell.push(a);
    }

    if (cardCell.length) cells.push([cardCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'card-pricing', cells });
  element.replaceWith(block);
}
