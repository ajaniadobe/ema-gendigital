/* eslint-disable */
/* global WebImporter */
/**
 * Parser for comparison-matrix. Base: comparison-matrix (custom block).
 * Source: AVG.com B2B product feature matrix (#comparison .avg-comparison-table table).
 * Structure: <thead> product header columns (icon + name + "View features" link),
 *            <tbody> feature rows (feature headline + description, then per-product tick/cross),
 *            <tfoot> per-product Buy-now / store links + pricing.
 * Tick/cross glyph images are STRUCTURAL — emitted as verbatim "Yes"/"No"/blank text, not images.
 * Product icons and platform-icon strips are structural and NOT emitted.
 * Column count = 1 (feature column) + N product columns; every row padded to match.
 */
export default function parse(element, { document }) {
  const table = element.querySelector('table');
  if (!table) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Determine product columns. Pick the thead row that actually contains product headers
  // (a th holding .header / .like-h4), since the spacer row also matches `thead tr`.
  const headerRows = Array.from(table.querySelectorAll('thead tr'));
  const headerRow = headerRows.find((tr) => tr.querySelector('th .header, th .like-h4'))
    || headerRows.find((tr) => tr.querySelector('th'))
    || null;
  const productThs = headerRow
    ? Array.from(headerRow.querySelectorAll('th')).filter((th) => th.querySelector('.like-h4, .header'))
    : [];
  const colCount = 1 + productThs.length;

  const cells = [];

  // Header row: label + product name (with detail link) per product.
  const headerCells = [''];
  productThs.forEach((th) => {
    const cell = [];
    const nameEl = th.querySelector('.like-h4');
    const productLink = th.querySelector('.header a[href]');
    const name = nameEl ? (nameEl.textContent || '').trim() : '';
    if (productLink && name) {
      const a = document.createElement('a');
      a.setAttribute('href', productLink.getAttribute('href'));
      a.textContent = name;
      cell.push(a);
    } else if (name) {
      const p = document.createElement('p');
      p.textContent = name;
      cell.push(p);
    }
    // "View features" link.
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

    const rowCells = [labelCell.length ? labelCell : ''];

    // Per-product value cells: tick glyph -> "Yes" text, blank -> "".
    const valueTds = Array.from(tr.querySelectorAll('td.tick'));
    valueTds.forEach((td) => {
      const glyph = td.querySelector('img');
      if (glyph) {
        const p = document.createElement('p');
        p.textContent = (glyph.getAttribute('alt') || 'Yes').trim();
        rowCells.push([p]);
      } else {
        rowCells.push('');
      }
    });

    // Pad to column count.
    while (rowCells.length < colCount) rowCells.push('');
    cells.push(rowCells);
  });

  // Footer row: per-product Buy-now / store links (preserved as-is; commerce out of scope).
  const footRow = table.querySelector('tfoot tr');
  if (footRow) {
    const footCells = [''];
    const footTds = Array.from(footRow.querySelectorAll('td')).slice(1); // skip leading pricing/label td
    let any = false;
    footTds.forEach((td) => {
      const buy = td.querySelector('a[href*="store"], a[href*="checkout"], a.button, a.bi-cart-link, a[href]');
      if (buy) {
        const a = document.createElement('a');
        a.setAttribute('href', buy.getAttribute('href'));
        a.textContent = (buy.textContent || 'Buy now').replace(/\s+/g, ' ').trim();
        footCells.push([a]);
        any = true;
      } else {
        footCells.push('');
      }
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
