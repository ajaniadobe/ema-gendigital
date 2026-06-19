/*
 * Comparison Matrix Block (variant of table)
 * B2B product feature-comparison matrix.
 *
 * Authoring model (rows of the block):
 *   Row 1 (header): | <comparison title> | <Product A: image + name + "View features" link> | <Product B: ...> |
 *   Rows 2..n-1 (features): | <feature name> \n <feature description> | <Yes/No> | <Yes/No> |
 *   Row n (footer, optional): | (empty) | <Buy now link A> | <Buy now link B> |
 *
 * A feature cell value of "yes" / "✓" / "x" / "no" (case-insensitive) renders a
 * structural tick / cross glyph (baked in, not an authored image).
 */

const YES = new Set(['yes', 'y', '✓', 'true', 'included', '✔']);
const NO = new Set(['no', 'n', '-', '✗', '×', 'false', '']);

function isLastContentRow(block, row) {
  // footer row = last row whose product cells contain a link (Buy now)
  if (row !== block.lastElementChild) return false;
  const cells = [...row.children].slice(1);
  return cells.some((c) => c.querySelector('a'));
}

export default function decorate(block) {
  const rows = [...block.children];
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const tfoot = document.createElement('tfoot');

  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    const cells = [...row.children];
    const isHeader = i === 0;
    const isFooter = isLastContentRow(block, row);

    cells.forEach((cell, c) => {
      const isFeatureCol = c === 0;
      const el = document.createElement(isHeader || isFeatureCol ? 'th' : 'td');
      if (isHeader && !isFeatureCol) {
        el.className = 'comparison-matrix-product';
        // wrap product header content: image + name + features link
        el.innerHTML = cell.innerHTML;
        el.querySelectorAll('a').forEach((a) => a.classList.add('comparison-matrix-features-link'));
      } else if (isFeatureCol) {
        el.className = isHeader ? 'comparison-matrix-title' : 'comparison-matrix-feature';
        el.innerHTML = cell.innerHTML;
      } else if (isFooter) {
        el.className = 'comparison-matrix-buy';
        el.innerHTML = cell.innerHTML;
        const a = el.querySelector('a');
        if (a) a.classList.add('comparison-matrix-buy-link', 'button');
      } else {
        // feature value cell -> tick / cross glyph
        const raw = cell.textContent.trim().toLowerCase();
        el.className = 'comparison-matrix-value';
        if (YES.has(raw)) {
          el.classList.add('is-yes');
          el.setAttribute('aria-label', 'Included');
        } else if (NO.has(raw)) {
          el.classList.add('is-no');
          el.setAttribute('aria-label', 'Not included');
        } else {
          // free text value (e.g. "Up to 10 devices")
          el.classList.add('is-text');
          el.innerHTML = cell.innerHTML;
        }
      }
      tr.append(el);
    });

    if (isHeader) thead.append(tr);
    else if (isFooter) tfoot.append(tr);
    else tbody.append(tr);
  });

  table.append(thead, tbody);
  if (tfoot.children.length) table.append(tfoot);
  block.replaceChildren(table);
}
