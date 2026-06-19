// Baked-in structural USP-stripe icons keyed by the benefit label.
// (These are UI assets, not author-editable images.)
const ICONS = {
  award: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 15.3 6.8 18l1-5.8L3.6 8.1l5.8-.8L12 2z"/></svg>',
  scam: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8 4v6c0 5-3.4 9.2-8 10-4.6-.8-8-5-8-10V6l8-4zm-1 13l6-6-1.4-1.4L11 12.2 8.4 9.6 7 11l4 4z"/></svg>',
  light: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2zM9 20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9v1z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.6a15.5 15.5 0 0 0-1.3-3.4A8 8 0 0 1 18.9 8zM12 4c.8 1 1.5 2.5 1.9 4h-3.8C10.5 6.5 11.2 5 12 4zM4.3 14a8 8 0 0 1 0-4h3a18 18 0 0 0 0 4h-3zm.8 2h2.6c.3 1.2.8 2.4 1.3 3.4A8 8 0 0 1 5.1 16zM7.7 8H5.1a8 8 0 0 1 3.9-3.4C8.5 5.6 8 6.8 7.7 8zM12 20c-.8-1-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 3-1.9 4zm2.1-6H9.9a16 16 0 0 1 0-4h4.2a16 16 0 0 1 0 4zm.8 5.4c.5-1 1-2.2 1.3-3.4h2.6a8 8 0 0 1-3.9 3.4zM16.7 14a18 18 0 0 0 0-4h3a8 8 0 0 1 0 4h-3z"/></svg>',
};

function pickIcon(text) {
  const t = text.toLowerCase();
  if (t.includes('award')) return ICONS.award;
  if (t.includes('scam')) return ICONS.scam;
  if (t.includes('light')) return ICONS.light;
  if (t.includes('trusted') || t.includes('worldwide') || t.includes('million')) return ICONS.globe;
  return ICONS.award;
}

export default function decorate(block) {
  // Each USP item is a row with a single label cell.
  [...block.children].forEach((row) => {
    row.classList.add('usp-stripe-item');
    const label = row.textContent.trim();
    row.insertAdjacentHTML('afterbegin', `<span class="usp-stripe-icon">${pickIcon(label)}</span>`);
  });
}
