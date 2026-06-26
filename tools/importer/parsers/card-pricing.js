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
/**
 * Read an element's text as a tidy price string. Currency/integer/decimal sit in
 * separate spans with whitespace between them, so we collapse whitespace AND
 * remove the spaces after the currency symbol and around the decimal point to
 * turn "$ 99 .99" into "$99.99".
 */
function cleanPriceText(node) {
  if (!node) return '';
  return (node.textContent || '')
    .replace(/\s+/g, ' ')
    .replace(/([$£€])\s+/g, '$1') // "$ 99" -> "$99"
    .replace(/\s+\./g, '.') // "99 .99" -> "99.99"
    .replace(/\s+\//g, '/') // "$4.49 /month" -> "$4.49/month"
    .trim();
}

/**
 * Read a `.rendered-price` block as a single clean figure. The block renders the
 * value TWICE — a desktop `.row-long` copy and a mobile `.row-short` copy — plus
 * struck-through originals (`<s>8.33</s>`), so a naive textContent yields
 * "8.33 $ 4.49 8.33 /month /month". We clone the node, drop every `.row-short`
 * duplicate AND the struck originals, then read the remaining sale figure.
 */
function readRenderedPrice(rendered) {
  if (!rendered) return '';
  const clone = rendered.cloneNode(true);
  // Remove the duplicated mobile copies so each value appears only once.
  clone.querySelectorAll('.row-short').forEach((n) => n.remove());
  // Remove struck-through originals so only the current sale price remains.
  clone.querySelectorAll('s').forEach((n) => n.remove());
  return cleanPriceText(clone);
}

/**
 * Build a clean, non-duplicated price summary from a `.actionbox-price-main`.
 * Handles two source shapes:
 *   - secure-vpn style: `.yearly-price` headline (struck original + sale price)
 *     plus a `.rendered-price` monthly figure ("It works out as $4.49/month").
 *   - antitrack style: a `.rendered-price` headline (`$54.99/year`) plus a
 *     `.month-price` element ("It works out as $4.58/month").
 */
function buildPriceSummary(price) {
  const parts = [];

  // Headline: prefer an explicit `.yearly-price`; otherwise the `.rendered-price`
  // (de-duplicated) carries the headline /year figure.
  const yearly = price.querySelector('.yearly-price');
  const renderedHeadlineUsed = !yearly;
  if (yearly) {
    const headline = cleanPriceText(yearly);
    if (headline) parts.push(headline);
  } else {
    const headline = readRenderedPrice(price.querySelector('.rendered-price'));
    if (headline) parts.push(headline);
  }

  // Monthly "It works out as ..." figure.
  // antitrack puts it in `.month-price`; secure-vpn builds it from `.rendered-price`
  // (only consumed here when it was NOT already used as the headline above).
  const monthPrice = price.querySelector('.month-price');
  if (monthPrice) {
    const m = cleanPriceText(monthPrice);
    if (m) parts.push(m);
  } else if (!renderedHeadlineUsed) {
    const rendered = price.querySelector('.rendered-price');
    const month = readRenderedPrice(rendered);
    const prefix = price.querySelector('.yearly-price-text'); // "It works out as"
    const prefixText = prefix ? cleanPriceText(prefix) : '';
    if (month) parts.push(`${prefixText ? `${prefixText} ` : ''}${month}`.trim());
  }

  return parts.join(' · '); // " · " between headline and monthly summaries.
}

/**
 * Find the checkout link that belongs to THIS box. Verified on both secure-vpn
 * and antitrack: the `<a.bi-cart-link>` is a DESCENDANT of its own `.box`
 * (inside `.footer-wrap`/`.header-footer-wrap`). The previous code looked it up
 * via `box.parentElement.querySelector(...)`, a SHARED ancestor, so every card
 * resolved to the FIRST checkout link (all svd.10.12m). Scope to the box itself.
 */
function findBuyLink(box) {
  return box.querySelector('a.actionbox-button, a.bi-cart-link, a[href*="checkout.avg.com"]');
}

/** Extract the product id (e.g. svd.10.12m) from a checkout URL for de-duplication. */
function productIdFromLink(link) {
  if (!link) return '';
  const href = link.getAttribute('href') || '';
  const m = href.match(/product=([^&]+)/);
  return m ? m[1] : '';
}

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
  // The source renders the same pricing more than once (desktop/mobile copies, and
  // on some pages a hero + a repeat block), so the instance selector can match more
  // than one container. De-duplicate by a stable key (checkout product id, else term
  // text) ACROSS all parser invocations on this page — tracked on `document` — so
  // only the first container emits cards and later duplicates collapse to nothing.
  const seen = document.__cardPricingSeen || (document.__cardPricingSeen = new Set());

  boxes.forEach((box) => {
    const cardCell = [];

    // Resolve THIS box's own checkout link first — used both for de-duplication
    // and for the emitted "Buy now" link.
    const buyLink = findBuyLink(box);
    const dedupeKey = productIdFromLink(buyLink)
      || (box.querySelector('.actionbox-title')
        ? (box.querySelector('.actionbox-title').textContent || '').trim()
        : '');
    if (dedupeKey) {
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
    }

    // Term (e.g. "1 year"). May be empty on some product pages (antitrack).
    const term = box.querySelector('.actionbox-title');
    const termText = term ? (term.textContent || '').trim() : '';
    if (termText) {
      const h = document.createElement('p');
      h.textContent = termText;
      cardCell.push(h);
    }

    // Savings label (e.g. "Save 46%").
    const savings = box.querySelector('.header-wrap .label .label-text, .label .label-text');
    if (savings) {
      const s = document.createElement('p');
      s.textContent = (savings.textContent || '').trim();
      cardCell.push(s);
    }

    // Price summary — clean, de-duplicated (no doubled row-long/row-short copies).
    const price = box.querySelector('.actionbox-price-main');
    if (price) {
      const summary = buildPriceSummary(price);
      if (summary) {
        const p = document.createElement('p');
        p.textContent = summary;
        cardCell.push(p);
      }
    }

    // Buy now checkout link — preserved AS-IS (commerce out of scope).
    // `buyLink` was already resolved above (THIS box's own link, not a shared match).
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
