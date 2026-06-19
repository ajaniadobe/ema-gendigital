// Star/badge glyph baked into the codebase (structural asset, not author-editable).
const STAR_ICON = `<svg class="promo-bar-icon" width="24" height="24" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M17 3.34L22.6 1L25.4 6.38L31.1 8.31L29.8 14.21L33 19.39L28.3 23.15L27.4 29.14L21.4 28.94L17 33L12.6 28.94L6.6 29.14L5.7 23.15L1 19.39L4.2 14.21L2.9 8.31L8.6 6.38L11.4 1L17 3.34Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20.93 13L13 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export default function decorate(block) {
  // Promo bar: a single short message, optionally wrapped in a link.
  // Make the whole bar clickable when the author provides a link.
  const link = block.querySelector('a');
  const content = block.querySelector(':scope > div');
  if (content) content.classList.add('promo-bar-content');

  if (link) {
    link.classList.add('promo-bar-link');
    link.insertAdjacentHTML('afterbegin', STAR_ICON);
  } else if (content) {
    content.insertAdjacentHTML('afterbegin', STAR_ICON);
  }
}
