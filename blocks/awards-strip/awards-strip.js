export default function decorate(block) {
  // Each award is a row: badge image + caption text.
  [...block.children].forEach((row) => {
    row.classList.add('awards-strip-item');
    const inner = row.querySelector(':scope > div') || row;
    const pic = inner.querySelector('picture, img');
    if (pic) {
      const picPara = pic.closest('p');
      const badge = document.createElement('div');
      badge.className = 'awards-strip-badge';
      badge.append(pic.closest('picture') || pic);
      inner.insertAdjacentElement('afterbegin', badge);
      if (picPara && !picPara.textContent.trim()) picPara.remove();
    }
    inner.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim()) p.classList.add('awards-strip-caption');
    });
  });
}
