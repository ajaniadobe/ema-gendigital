// AVG-style blog carousel: a horizontal track of article cards (image on top,
// title, description, "Read More"), with prev/next arrows and page-group dots.

function decorateCard(row, index) {
  const card = document.createElement('li');
  card.className = 'carousel-blog-slide';
  card.dataset.slideIndex = index;

  const cells = row.querySelectorAll(':scope > div');
  const [imageCell, contentCell] = cells;

  if (imageCell) imageCell.className = 'carousel-blog-slide-image';
  if (contentCell) contentCell.className = 'carousel-blog-slide-content';

  // The whole card is a link to the article. Reuse the article URL from the
  // title link (first link in the content cell) so the card is clickable.
  const titleLink = contentCell && contentCell.querySelector('a');
  if (titleLink) {
    const href = titleLink.getAttribute('href');
    const anchor = document.createElement('a');
    anchor.className = 'carousel-blog-card-link';
    anchor.href = href;
    if (imageCell) anchor.append(imageCell);
    if (contentCell) anchor.append(contentCell);
    card.append(anchor);
  } else {
    cells.forEach((c) => card.append(c));
  }

  return card;
}

function pageCount(block) {
  const perView = parseInt(getComputedStyle(block).getPropertyValue('--cards-per-view'), 10) || 1;
  const total = block.querySelectorAll('.carousel-blog-slide').length;
  return { perView, pages: Math.max(1, Math.ceil(total / perView)) };
}

function updateDots(block) {
  const track = block.querySelector('.carousel-blog-slides');
  const cards = [...block.querySelectorAll('.carousel-blog-slide')];
  if (!cards.length) return;
  const { perView, pages } = pageCount(block);
  const cardW = cards[0].getBoundingClientRect().width
    + parseFloat(getComputedStyle(track).columnGap || 0);
  const current = Math.round(track.scrollLeft / (cardW * perView));
  block.querySelectorAll('.carousel-blog-slide-indicator button').forEach((b, i) => {
    if (i === Math.min(current, pages - 1)) b.setAttribute('disabled', 'true');
    else b.removeAttribute('disabled');
  });
  // Disable nav buttons at the ends.
  const prev = block.querySelector('.slide-prev');
  const next = block.querySelector('.slide-next');
  const maxScroll = track.scrollWidth - track.clientWidth - 1;
  if (prev) prev.disabled = track.scrollLeft <= 1;
  if (next) next.disabled = track.scrollLeft >= maxScroll;
}

function scrollToPage(block, page) {
  const track = block.querySelector('.carousel-blog-slides');
  const cards = [...block.querySelectorAll('.carousel-blog-slide')];
  if (!cards.length) return;
  const { perView, pages } = pageCount(block);
  const target = Math.max(0, Math.min(page, pages - 1));
  const cardW = cards[0].getBoundingClientRect().width
    + parseFloat(getComputedStyle(track).columnGap || 0);
  track.scrollTo({ left: cardW * perView * target, behavior: 'smooth' });
}

function currentPage(block) {
  const track = block.querySelector('.carousel-blog-slides');
  const cards = [...block.querySelectorAll('.carousel-blog-slide')];
  if (!cards.length) return 0;
  const { perView } = pageCount(block);
  const cardW = cards[0].getBoundingClientRect().width
    + parseFloat(getComputedStyle(track).columnGap || 0);
  return Math.round(track.scrollLeft / (cardW * perView));
}

export default function init(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const container = document.createElement('div');
  container.className = 'carousel-blog-slides-container';

  const track = document.createElement('ul');
  track.className = 'carousel-blog-slides';

  rows.forEach((row, idx) => {
    track.append(decorateCard(row, idx));
    row.remove();
  });

  // Prev / next arrows.
  const nav = document.createElement('div');
  nav.className = 'carousel-blog-navigation-buttons';
  nav.innerHTML = `
    <button type="button" class="slide-prev" aria-label="Previous Slide"></button>
    <button type="button" class="slide-next" aria-label="Next Slide"></button>`;

  container.append(track, nav);
  block.append(container);

  // Page dots.
  const { pages } = pageCount(block);
  const dotsNav = document.createElement('nav');
  dotsNav.setAttribute('aria-label', 'Carousel Slide Controls');
  const dots = document.createElement('ol');
  dots.className = 'carousel-blog-slide-indicators';
  for (let i = 0; i < pages; i += 1) {
    const li = document.createElement('li');
    li.className = 'carousel-blog-slide-indicator';
    li.dataset.targetPage = i;
    li.innerHTML = `<button type="button" aria-label="Show Slide ${i + 1} of ${pages}"></button>`;
    dots.append(li);
  }
  dotsNav.append(dots);
  block.append(dotsNav);

  // Events.
  nav.querySelector('.slide-prev').addEventListener('click', () => scrollToPage(block, currentPage(block) - 1));
  nav.querySelector('.slide-next').addEventListener('click', () => scrollToPage(block, currentPage(block) + 1));
  dots.querySelectorAll('button').forEach((b, i) => {
    b.addEventListener('click', () => scrollToPage(block, i));
  });

  let ticking = false;
  block.querySelector('.carousel-blog-slides').addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateDots(block);
      ticking = false;
    });
  });
  window.addEventListener('resize', () => updateDots(block));
  updateDots(block);
}
