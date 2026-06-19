export default function init(el) {
  // Each top-level row of the block is one card.
  const rows = [...el.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    row.classList.add('card-inner');

    // Pull a leading image (if any) into a dedicated picture container.
    const pic = row.querySelector('picture');
    if (pic) {
      const picPara = pic.closest('p');
      const picDiv = document.createElement('div');
      picDiv.className = 'card-picture-container';
      picDiv.append(pic);
      row.insertAdjacentElement('afterbegin', picDiv);
      if (picPara && !picPara.textContent.trim()) picPara.remove();
    }

    // The content cell (the inner div holding the copy).
    const con = row.querySelector(':scope > div:not([class])');
    if (con) con.classList.add('card-content-container');

    // Move a trailing CTA link to its own container at the bottom.
    const ctaPara = row.querySelector(':scope > div:last-of-type > p:last-of-type');
    const cta = ctaPara ? ctaPara.querySelector('a') : null;
    if (cta) {
      const hashAware = el.classList.contains('hash-aware');
      if (hashAware) cta.href = `${cta.getAttribute('href')}${window.location.hash}`;
      ctaPara.classList.add('card-cta-container');
      row.append(ctaPara);
    }
  });
}
