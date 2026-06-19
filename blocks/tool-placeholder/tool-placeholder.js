/*
 * Tool Placeholder block
 *
 * Static, non-interactive stand-in for an out-of-scope interactive tool widget
 * (e.g. the AVG random-password-generator). It renders the original tool's
 * verbatim labels/chrome so the page layout reads correctly, but contains NO
 * application logic. An author can later replace this placeholder with the
 * live tool (a fragment, embed, or custom integration).
 *
 * Authored structure (one row per line):
 *   | (generated value)   | Very strong          |   <- readout + status badge
 *   | Copy                |                      |   <- action button label
 *   | Password length:    | 15                   |   <- control label + value
 *   | Characters used:    | ABC, abc, 123, #$&   |   <- control label + options
 *
 * Each row becomes a labelled, disabled-looking control. Nothing here is wired
 * to behaviour; it is purely presentational.
 */

export default function decorate(block) {
  block.setAttribute('aria-hidden', 'false');
  block.setAttribute('role', 'group');
  block.setAttribute(
    'aria-label',
    'Interactive tool placeholder (non-functional preview)',
  );

  [...block.children].forEach((row, index) => {
    row.classList.add('tool-placeholder-row');
    const cells = [...row.children];

    // First row = the generated value readout + status badge.
    if (index === 0) {
      row.classList.add('tool-placeholder-readout');
      if (cells[0]) cells[0].classList.add('tool-placeholder-value');
      if (cells[1]) cells[1].classList.add('tool-placeholder-badge');
      return;
    }

    // A single-cell row with a short label is treated as an action button.
    if (cells.length === 1 && cells[0].textContent.trim().length <= 24) {
      cells[0].classList.add('tool-placeholder-action');
      cells[0].setAttribute('role', 'button');
      cells[0].setAttribute('aria-disabled', 'true');
      return;
    }

    // Otherwise: a control row = label cell + value/options cell.
    if (cells[0]) cells[0].classList.add('tool-placeholder-label');
    if (cells[1]) cells[1].classList.add('tool-placeholder-control');
  });
}
