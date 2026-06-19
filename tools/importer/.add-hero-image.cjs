const fs = require('fs');
const f = 'content/avg/en-us/homepage.plain.html';
let h = fs.readFileSync(f, 'utf8');

// Current hero foreground row has a single text column. Add a second column with the
// product device image so the hero renders text-left / image-right (matches source).
const heroOpen = '<div class="hero"><div><div><h1 id="get-free-antivirus-thats-trusted-by-experts">';
if (!h.includes(heroOpen)) { console.error('hero open not found'); process.exit(1); }
if (h.includes('homepage-t1/media-1-pc.png')) { console.error('hero image already present'); process.exit(1); }

// The text column ends at the first `</div>` after the Free download CTA paragraph,
// before the row-closing `</div></div>`. Insert an image column right after the text column.
const textColEnd = '<p><strong><a href="/en-us/download-thank-you.php?product=FREEGSR-HP">Free download</a></strong></p></div>';
const imageCol = '<div><picture><img src="https://static2.avg.com/10004857/web/i/homepage-t1/media-1-pc.png" alt="AVG AntiVirus running on a laptop and phone"></picture></div>';

if (!h.includes(textColEnd)) { console.error('text column end marker not found'); process.exit(1); }
h = h.replace(textColEnd, textColEnd + imageCol);

fs.writeFileSync(f, h);
console.log('Added hero product image column.');
