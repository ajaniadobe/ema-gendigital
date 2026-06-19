export default function decorate(block) {
  // Each award is a row: badge image + caption text.
  // A row with no image is the section header (heading + intro) and spans full width.
  [...block.children].forEach((row) => {
    const inner = row.querySelector(':scope > div') || row;
    const pic = inner.querySelector('picture, img');
    if (!pic) {
      row.classList.add('awards-strip-header');
      return;
    }
    row.classList.add('awards-strip-item');
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
