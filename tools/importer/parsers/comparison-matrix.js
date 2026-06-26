/* eslint-disable */
/* global WebImporter */
/**
 * Parser for comparison-matrix. Base: comparison-matrix (custom block).
 * Source: AVG.com B2B product feature matrix (#comparison table).
 * Structure (verified against business-security):
 *   <thead> row 0 = layout spacer (skipped); row 1 = product header
 *           (first <th.product.feature> holds the section label `.like-h3`,
 *            each product <th.product> holds `.header a > img + .like-h4`).
 *   <tbody> feature rows: <td.feature> (`.feature-headline` + `.feature-description`)
 *           followed by per-product <td.tick> cells holding a tick `<img alt="Yes">`.
 *   <tfoot> pricing + Buy-now rows per product (verbatim copy, commerce out of scope).
 * Tick glyphs and product logos are PRESERVED AS IMAGES so the matrix renders with
 * its checkmarks and brand icons intact (previously they were flattened to "Yes"
 * text / dropped, losing ~20 images and the pricing row).
 * Column count = 1 (feature column) + N product columns; every row padded to match.
 * Validated against business-security (template representative; urls[0]).
 */
export default function parse(element, { document }) {
  const table = element.querySelector('table');
  if (!table) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Product header is the thead row that actually carries product columns
  // (`th.product` with a `.header`/`.like-h4`), NOT the leading layout-spacer row.
  const headerRows = Array.from(table.querySelectorAll('thead tr'));
  const headerRow = headerRows.find((tr) => tr.querySelector('th.product .header, th.product .like-h4, th .like-h4'))
    || headerRows[headerRows.length - 1]
    || null;
  // Product columns: header cells that hold a product name (`.like-h4`); the first
  // cell is the section label (`.like-h3`) and is excluded.
  const productThs = headerRow
    ? Array.from(headerRow.children).filter((th) => th.querySelector('.like-h4'))
    : [];
  const colCount = 1 + productThs.length;

  const cells = [];

  // Header row: blank feature-column label + per-product logo, name (linked) and
  // "View features" link.
  const sectionLabelEl = headerRow ? headerRow.querySelector('.like-h3') : null;
  const headerCells = [sectionLabelEl ? (sectionLabelEl.textContent || '').trim() : ''];
  productThs.forEach((th) => {
    const cell = [];
    const nameEl = th.querySelector('.like-h4');
    const name = nameEl ? (nameEl.textContent || '').trim() : '';
    const productLink = th.querySelector('.header a[href], a[href]');
    const logo = th.querySelector('img');

    if (productLink) {
      // Preserve the product logo and name inside the product link.
      const a = document.createElement('a');
      a.setAttribute('href', productLink.getAttribute('href'));
      if (logo) {
        const img = document.createElement('img');
        img.setAttribute('src', logo.getAttribute('src'));
        if (logo.getAttribute('alt')) img.setAttribute('alt', logo.getAttribute('alt'));
        a.appendChild(img);
      }
      if (name) a.appendChild(document.createTextNode(name));
      cell.push(a);
    } else {
      if (logo) {
        const img = document.createElement('img');
        img.setAttribute('src', logo.getAttribute('src'));
        if (logo.getAttribute('alt')) img.setAttribute('alt', logo.getAttribute('alt'));
        cell.push(img);
      }
      if (name) {
        const p = document.createElement('p');
        p.textContent = name;
        cell.push(p);
      }
    }

    // Optional "View features" link.
    const viewFeatures = th.querySelector('.features-link a[href]');
    if (viewFeatures) {
      const a = document.createElement('a');
      a.setAttribute('href', viewFeatures.getAttribute('href'));
      a.textContent = (viewFeatures.textContent || '').trim();
      cell.push(a);
    }
    headerCells.push(cell.length ? cell : '');
  });
  cells.push(headerCells);

  // Feature rows.
  const bodyRows = Array.from(table.querySelectorAll('tbody tr'));
  bodyRows.forEach((tr) => {
    const featureTd = tr.querySelector('td.feature');
    if (!featureTd) return;

    // Feature label cell: headline + description (verbatim).
    const labelCell = [];
    const headline = featureTd.querySelector('.feature-headline');
    const description = featureTd.querySelector('.feature-description');
    if (headline) {
      const p = document.createElement('p');
      p.textContent = (headline.textContent || '').trim();
      labelCell.push(p);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = (description.textContent || '').trim();
      labelCell.push(p);
    }
    // Fall back to the whole cell text if the expected spans are absent.
    if (!labelCell.length) {
      const text = (featureTd.textContent || '').replace(/\s+/g, ' ').trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        labelCell.push(p);
      }
    }

    const rowCells = [labelCell.length ? labelCell : ''];

    // Per-product value cells: PRESERVE the tick image so the checkmark renders;
    // an empty cell stays blank.
    const valueTds = Array.from(tr.querySelectorAll('td.tick'));
    valueTds.forEach((td) => {
      const glyph = td.querySelector('img');
      if (glyph) {
        const img = document.createElement('img');
        img.setAttribute('src', glyph.getAttribute('src'));
        img.setAttribute('alt', (glyph.getAttribute('alt') || 'Yes').trim());
        rowCells.push([img]);
      } else {
        rowCells.push('');
      }
    });

    // Pad to column count.
    while (rowCells.length < colCount) rowCells.push('');
    cells.push(rowCells);
  });

  // Footer: emit the per-product pricing + Buy-now row(s). The first tfoot row
  // carries the price ("$46.99 per device per year") and the checkout link per
  // product column; keep it as static reference content (commerce out of scope).
  const footRows = Array.from(table.querySelectorAll('tfoot tr'));
  // Prefer the pricing row that has a Buy-now/store link in a product column.
  const pricingRow = footRows.find((tr) => Array.from(tr.children).slice(1)
    .some((td) => td.querySelector('a[href*="store"], a[href*="checkout"], a[href]')));
  if (pricingRow) {
    const footCells = [''];
    const footTds = Array.from(pricingRow.children).slice(1); // skip leading label/spacer td
    let any = false;
    footTds.forEach((td) => {
      const cell = [];
      // Per-device price summary, if present.
      const priceP = Array.from(td.querySelectorAll('p'))
        .find((p) => /per device|per year|\$/.test(p.textContent || ''));
      if (priceP) {
        const p = document.createElement('p');
        p.textContent = (priceP.textContent || '').replace(/\s+/g, ' ').trim();
        cell.push(p);
      }
      // Buy-now / store checkout link, preserved as-is.
      const buy = td.querySelector('a[href*="store"], a[href*="checkout"], a.button, a.bi-cart-link, a[href]');
      if (buy) {
        const a = document.createElement('a');
        a.setAttribute('href', buy.getAttribute('href'));
        a.textContent = (buy.textContent || 'Buy now').replace(/\s+/g, ' ').trim();
        cell.push(a);
        any = true;
      }
      footCells.push(cell.length ? cell : '');
    });
    while (footCells.length < colCount) footCells.push('');
    if (any) cells.push(footCells);
  }

  if (cells.length <= 1) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'comparison-matrix', cells });
  element.replaceWith(block);
}
