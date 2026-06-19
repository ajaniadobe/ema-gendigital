/* Surgical edits to the homepage content to add missing source copy and
   correct column image/text order. Idempotent: each edit checks before applying. */
const fs = require('fs');

const f = 'content/avg/en-us/homepage.plain.html';
let h = fs.readFileSync(f, 'utf8');
const before = h;

function must(cond, msg) { if (!cond) { console.error('FAIL:', msg); process.exit(1); } }

/* 1. Hero text column: add "Also available for" line after the Free download CTA. */
const heroCtaEnd = '<p><strong><a href="/en-us/download-thank-you.php?product=FREEGSR-HP">Free download</a></strong></p>';
must(h.includes(heroCtaEnd), 'hero CTA paragraph not found');
if (!h.includes('Also available for')) {
  const alsoLine = '<p>Also available for <a href="/en-us/avg-antivirus-for-mac">Mac</a>, <a href="/en-us/antivirus-for-android">Android</a>, and <a href="/en-us/mobile-security-for-iphone-ipad">iOS</a></p>';
  h = h.replace(heroCtaEnd, heroCtaEnd + alsoLine);
}

/* 2. Static rating block (replaces the Trustpilot widget). Standalone block placed
   right after the hero (EDS only decorates blocks at section > wrapper > block depth,
   so it cannot be nested inside the hero). Static copy mirrors the rendered widget;
   authors update later. */
const uspOpen = '<div class="usp-stripe">';
must(h.includes(uspOpen), 'usp-stripe block not found');
if (!h.includes('class="rating"')) {
  const rating = '<div class="rating"><div><div>4.5</div></div><div><div>5</div></div><div><div>Excellent</div></div><div><div>Based on 41,686 reviews on Trustpilot</div></div></div>';
  h = h.replace(uspOpen, rating + uspOpen);
}

/* 3. Free Antivirus columns: image LEFT, text right (source order). */
const faText = '<div><div><p><picture><img src="https://static2.avg.com/10004857/web/i/homepage-t1/icon-free-antivirus.svg" alt=""></picture> AVG Free Antivirus</p><h2 id="protection-against-scams-and-viruses-made-easy">Protection against scams and viruses made easy</h2><p>We’ve purpose built our free antivirus to be as straightforward as possible. Enhance the security of your digital world with our free cybersecurity.</p><p><a href="/en-us/download-thank-you.php?product=FREEGSR-HP"><picture><img src="https://static2.avg.com/10004857/web/i/buttons/win-white.svg" alt=""></picture>Free download</a><a href="/en-us/free-antivirus-download"><picture><img src="https://static2.avg.com/10004857/web/i/ico/24/arrow-right-blue.svg" alt=""></picture>Discover more</a></p></div>';
const faImg = '<div><picture><img src="https://static2.avg.com/10004857/web/i/homepage-t1/media-1-pc.png" alt=""></picture></div>';
must(h.includes(faText + faImg), 'free-antivirus columns text+img order not found');
h = h.replace(faText + faImg, faImg + faText);

/* 4. Ultimate columns: image LEFT, text right (source order). */
const ultText = '<div><div><p>AVG Ultimate</p><h2 id="ultimate-protection-privacy-and-performance">Ultimate protection, privacy, and performance</h2><p>Keep your data and devices safer and optimized with AVG Ultimate, a comprehensive suite that ensures you can handle everything the digital world throws at you.</p><p><a href="/en-us/ultimate"><u>Discover more</u></a></p></div>';
const ultImg = '<div><picture><img src="https://static2.avg.com/10004857/web/i/homepage-t1/media-3.png" alt=""></picture></div>';
must(h.includes(ultText + ultImg), 'ultimate columns text+img order not found');
h = h.replace(ultText + ultImg, ultImg + ultText);

/* 5. "Included in AVG Ultimate:" label above the card block (stays on dark band). */
const cardOpen = '<div class="card">';
must(h.includes(cardOpen), 'card block not found');
if (!h.includes('Included in AVG Ultimate')) {
  h = h.replace(cardOpen, '<p>Included in AVG Ultimate:</p>' + cardOpen);
}

/* 6. Split the dark section so the blog + teaser are a separate WHITE section
   (source: only the Ultimate band is dark). Also add the blog section heading
   + "See all articles" link. The replacement closes the dark section after the
   card block and opens a new default (white) section. */
const blogOpen = '<div class="carousel-blog">';
must(h.includes(blogOpen), 'carousel-blog block not found');
if (!h.includes('Get expert advice')) {
  const blogHeading = '<h2 id="get-expert-advice-on-security-privacy-and-device-performance">Get expert advice on security, privacy, and device performance</h2><p><a href="https://www.avg.com/en/signal">See all articles</a></p>';
  h = h.replace(blogOpen, `</div><div>${blogHeading}${blogOpen}`);
}

if (h === before) { console.log('No changes (already applied).'); }
else { fs.writeFileSync(f, h); console.log('Applied homepage copy + column-order + section-split edits.'); }
