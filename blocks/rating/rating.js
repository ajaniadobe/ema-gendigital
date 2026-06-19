// Static rating reference (replaces the live Trustpilot iframe).
// Author supplies: a score (e.g. "4.7"), an optional max ("5"),
// an optional star count, and optional review-count / label text.
// Star glyph is baked into the codebase (structural asset).

function star(filled) {
  return `<svg class="rating-star${filled ? ' is-filled' : ''}" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l2.9 6.26L21.5 9l-5 4.6L18 21l-6-3.4L6 21l1.5-7.4-5-4.6 6.6-.74L12 2z"/>
  </svg>`;
}

export default function decorate(block) {
  // Expected authoring rows (each a <div>):
  //   score | max          -> e.g. "4.7" | "5"
  //   stars               -> e.g. "5" (number of stars to render, optional)
  //   label               -> e.g. "TrustScore" / brand text (optional)
  //   reviews             -> e.g. "Based on 12,345 reviews" (optional)
  const rows = [...block.children];
  const values = rows.map((r) => r.textContent.trim());

  const score = values[0] || '';
  const max = (rows[0] && rows[0].children.length > 1)
    ? rows[0].children[1].textContent.trim() : '5';
  const starCount = parseInt(values[1], 10);
  const stars = Number.isNaN(starCount) ? 5 : starCount;

  block.textContent = '';
  block.classList.add('no-iframe');

  const starsEl = document.createElement('div');
  starsEl.className = 'rating-stars';
  for (let i = 0; i < 5; i += 1) starsEl.insertAdjacentHTML('beforeend', star(i < stars));

  const scoreEl = document.createElement('div');
  scoreEl.className = 'rating-score';
  scoreEl.textContent = max ? `${score} / ${max}` : score;

  block.append(starsEl, scoreEl);

  // Remaining rows (label, reviews) become caption lines.
  values.slice(2).filter(Boolean).forEach((text) => {
    const cap = document.createElement('div');
    cap.className = 'rating-caption';
    cap.textContent = text;
    block.append(cap);
  });
}
