const CHECK_ICON = `<svg class="teaser-cta-icon" viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
  <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export default function decorate(block) {
  // Closing CTA banner: a check icon + message on the left, download CTA on the right.
  const inner = block.querySelector(':scope > div');
  if (inner) inner.classList.add('teaser-cta-content');

  // Group all CTA links into a button cluster.
  const links = [...block.querySelectorAll('a')];
  if (links.length) {
    const cluster = document.createElement('div');
    cluster.className = 'teaser-cta-buttons';
    const firstPara = links[0].closest('p');
    (firstPara || block).insertAdjacentElement('beforebegin', cluster);
    links.forEach((a) => {
      const p = a.closest('p');
      cluster.append(a);
      if (p && !p.textContent.trim() && !p.querySelector('img')) p.remove();
    });
  }

  // Prepend the check icon to the message paragraph.
  const message = inner && inner.querySelector('p');
  if (message && !message.querySelector('.teaser-cta-icon')) {
    message.insertAdjacentHTML('afterbegin', CHECK_ICON);
  }
}
