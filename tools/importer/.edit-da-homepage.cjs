/* DOM-based edits applied directly to the DA source HTML (canonical picture markup),
   then re-serialized for upload. Reads /tmp/da_homepage.html, writes /tmp/da_homepage.out.html.
   Idempotent where practical. */
const fs = require('fs');
const parse5 = require('parse5');

const src = fs.readFileSync('/tmp/da_homepage.html', 'utf8');
const doc = parse5.parse(src);

const A = parse5.defaultTreeAdapter;
function walk(node, fn) { fn(node); (node.childNodes || []).forEach((c) => walk(c, fn)); }
function findAll(root, fn) { const out = []; walk(root, (n) => { if (fn(n)) out.push(n); }); return out; }
function cls(n) { const a = (n.attrs || []).find((x) => x.name === 'class'); return a ? a.value : ''; }
function text(n) { let t = ''; walk(n, (m) => { if (m.nodeName === '#text') t += m.value; }); return t.trim(); }
function frag(html) { return parse5.parseFragment(html).childNodes; }
function idxOf(parent, child) { return parent.childNodes.indexOf(child); }
function insertBefore(parent, nodes, ref) {
  const i = idxOf(parent, ref);
  nodes.forEach((n) => { n.parentNode = parent; });
  parent.childNodes.splice(i, 0, ...nodes);
}
function insertAfter(parent, nodes, ref) {
  const i = idxOf(parent, ref);
  nodes.forEach((n) => { n.parentNode = parent; });
  parent.childNodes.splice(i + 1, 0, ...nodes);
}

const main = findAll(doc, (n) => n.tagName === 'main')[0];
const fullText = text(main);

/* 1. Hero "Also available for" line after the hero Free download CTA paragraph. */
if (!fullText.includes('Also available for')) {
  // The hero CTA is the <p> inside .hero containing the download-thank-you link.
  const hero = findAll(main, (n) => cls(n) === 'hero')[0];
  const ps = hero ? findAll(hero, (n) => n.tagName === 'p') : [];
  const ctaP = ps.find((p) => {
    const a = findAll(p, (n) => n.tagName === 'a')[0];
    const href = a && (a.attrs || []).find((x) => x.name === 'href');
    return href && href.value.includes('download-thank-you') && /^Free download$/.test(text(p));
  });
  if (ctaP) {
    const line = frag('<p>Also available for <a href="/en-us/avg-antivirus-for-mac">Mac</a>, <a href="/en-us/antivirus-for-android">Android</a>, and <a href="/en-us/mobile-security-for-iphone-ipad">iOS</a></p>');
    insertAfter(ctaP.parentNode, line, ctaP);
  } else { console.error('WARN: hero CTA paragraph not found'); }
}

/* 2. Rating block before usp-stripe. */
if (!findAll(main, (n) => cls(n) === 'rating').length) {
  const usp = findAll(main, (n) => cls(n) === 'usp-stripe')[0];
  if (usp) {
    const rating = frag('<div class="rating"><div><div>4.5</div></div><div><div>5</div></div><div><div>Excellent</div></div><div><div>Based on 41,686 reviews on Trustpilot</div></div></div>');
    insertBefore(usp.parentNode, rating, usp);
  } else { console.error('WARN: usp-stripe not found'); }
}

/* helper: within a columns block, swap the two cells of its single row so image leads */
function swapColumns(headingFragment) {
  const cols = findAll(main, (n) => cls(n) === 'columns');
  for (const col of cols) {
    const row = (col.childNodes || []).find((c) => c.tagName === 'div');
    if (!row) continue;
    const cells = (row.childNodes || []).filter((c) => c.tagName === 'div');
    if (cells.length !== 2) continue;
    if (!text(col).includes(headingFragment)) continue;
    // Determine which cell has the big image (picture) vs text (h2)
    const cell0HasH2 = !!findAll(cells[0], (n) => n.tagName === 'h2').length;
    if (cell0HasH2) {
      // text is first -> move it after the image cell
      row.childNodes = row.childNodes.filter((c) => c !== cells[0]);
      row.childNodes.push(cells[0]);
    }
    return true;
  }
  console.error('WARN: columns not found for', headingFragment);
  return false;
}

/* 3 & 4. Image-left for Free Antivirus and Ultimate. */
swapColumns('Protection against scams and viruses made easy');
swapColumns('Ultimate protection, privacy, and performance');

/* 5. "Included in AVG Ultimate:" label before the card block. */
if (!fullText.includes('Included in AVG Ultimate')) {
  const card = findAll(main, (n) => cls(n) === 'card')[0];
  if (card) insertBefore(card.parentNode, frag('<p>Included in AVG Ultimate:</p>'), card);
  else console.error('WARN: card block not found');
}

/* 6. Split the dark section: move carousel-blog + teaser into a new top-level
   section div, prepend the blog heading + See all articles link. */
const carousel = findAll(main, (n) => cls(n) === 'carousel-blog')[0];
if (carousel && !fullText.includes('Get expert advice')) {
  const darkSection = carousel.parentNode; // top-level section div under main
  // Collect carousel + following siblings (teaser etc.) to relocate
  const sib = darkSection.childNodes;
  const startIdx = sib.indexOf(carousel);
  const moved = sib.splice(startIdx); // carousel and everything after it
  // Build new section
  const newSection = frag('<div></div>')[0];
  const heading = frag('<h2 id="get-expert-advice-on-security-privacy-and-device-performance">Get expert advice on security, privacy, and device performance</h2><p><a href="https://www.avg.com/en/signal">See all articles</a></p>');
  heading.forEach((n) => { n.parentNode = newSection; });
  moved.forEach((n) => { n.parentNode = newSection; });
  newSection.childNodes = [...heading, ...moved];
  // Insert new section right after the dark section
  insertAfter(main, [newSection], darkSection);
}

const out = parse5.serialize(doc);
fs.writeFileSync('/tmp/da_homepage.out.html', out);
console.log('DOM edits applied -> /tmp/da_homepage.out.html');
