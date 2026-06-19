export default function decorate(block) {
  // Closing CTA banner: centered heading + a cluster of download CTAs.
  const inner = block.querySelector(':scope > div');
  if (inner) inner.classList.add('teaser-cta-content');

  // Group all CTA links into a button cluster for consistent layout.
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
}
