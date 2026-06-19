/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AVG.com site-wide cleanup.
 *
 * Removes non-authorable global chrome (header/megamenu, footer), cookie/consent
 * banners & modals, tracking pixels/iframes, sticky-bar duplicates, and unwraps the
 * runtime JS platform-switcher so the default (PC) variant remains as flat content.
 *
 * ALL selectors below were verified against migration-work/cleaned.html (homepage)
 * and the per-template copies under migration-work/.templates/<family>/cleaned.html.
 * Lines noted in comments reference the homepage cleaned.html capture.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // --- Cookie / consent banners & modals (verified in cleaned.html) ---
    //   #ensNotifyBanner  (line 1183)  - mini cookie notify banner
    //   #cheqMini         (line 1185)  - cookie banner inner widget
    //   #cheq-dev         (line 1162)  - consent dev/debug panel
    //   #ensModalWrapper  (line 1207)  - <dialog> privacy preference center
    //   .cheq-modal*      (lines 1208+) - consent modal sub-elements
    // Removed in beforeTransform so the consent overlays never interfere with
    // block parsing / matching.
    WebImporter.DOMUtils.remove(element, [
      '#ensNotifyBanner',
      '#cheqMini',
      '#cheq-dev',
      '#ensModalWrapper',
      'dialog#ensModalWrapper',
      '[id^="cheq-modal"]',
      '[class^="cheq-modal"]',
      '[class*="cheq-modal__"]',
      '#ensModalWrapper ~ *',
    ]);

    // --- Tracking pixels / analytics iframes (verified in cleaned.html) ---
    //   #destination_publishing_iframe_symantec_0 / symantec.demdex.net (line 1178)
    //   #batBeacon...  wrappers + bat.bing.com 1x1 img (lines 1205-1206)
    //   #ZN_8ksX2qGJaVxaYw6  empty analytics div (line 1180)
    WebImporter.DOMUtils.remove(element, [
      'iframe.aamIframeLoaded',
      'iframe[src*="demdex.net"]',
      '[id^="destination_publishing_iframe"]',
      '[id^="batBeacon"]',
      'img[src*="bat.bing.com"]',
      'img[src*="demdex.net"]',
      'img[width="1"][height="1"]',
    ]);

    // --- Skip-to-content a11y link (verified line 40) ---
    //   <a href="#body-inner" class="sr-only sr-only-focusable">Skip to content</a>
    WebImporter.DOMUtils.remove(element, [
      'a.sr-only.sr-only-focusable[href="#body-inner"]',
    ]);

    // --- JS platform-switcher (verified lines 357-358, 378/398/418, 446-462) ---
    // The .js-platform-switch / .js-pc.pc wrappers are runtime-only platform
    // switchers. Non-PC variants (.js-mac/.js-android/.js-ios) are duplicate
    // alternate-platform copies of the same content and are not authored - remove
    // them first so only the default (PC) content survives.
    WebImporter.DOMUtils.remove(element, [
      '.js-mac',
      '.js-android',
      '.js-ios',
    ]);

    // Unwrap the platform-switch + PC wrappers so the default PC content becomes
    // flat section content. Strip only the .js-pc/.pc class markers from elements
    // that also carry real content/classes; fully-unwrap pure wrapper <div>s.
    element.querySelectorAll('.js-platform-switch, .js-pc.pc, div.js-pc').forEach((wrapper) => {
      const onlyWrapperClasses = [...wrapper.classList].every((c) => (
        c === 'js-platform-switch' || c === 'js-pc' || c === 'pc'
      ));
      if (wrapper.tagName === 'DIV' && onlyWrapperClasses) {
        // Pure runtime wrapper: lift children into the parent.
        wrapper.replaceWith(...wrapper.childNodes);
      } else {
        // Element carries authorable content/classes: just drop the JS markers.
        wrapper.classList.remove('js-platform-switch', 'js-pc', 'pc');
        if (!wrapper.getAttribute('class')) wrapper.removeAttribute('class');
      }
    });
    // Remove leftover inline js-pc markers on spans/imgs/anchors that kept content.
    element.querySelectorAll('.js-pc').forEach((el) => {
      el.classList.remove('js-pc', 'pc');
      if (!el.getAttribute('class')) el.removeAttribute('class');
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // --- Global header / megamenu (verified) ---
    //   nav#menu.navigation.global-navigation (line 10) - global header shell
    //   #navigation-main (line 42)                       - megamenu nav row
    // These are a separate global block; excluded from page body.
    WebImporter.DOMUtils.remove(element, [
      'nav#menu',
      '#menu',
      '#navigation-main',
      'nav#navigation-main',
    ]);

    // --- Global footer (separate global block) ---
    //   #bottom - footer-top: login-section, logo, footer-links columns, language-selector.
    //   #footer - footer copyright/legal row.
    // Both sit outside the page body content and belong to the global footer block.
    WebImporter.DOMUtils.remove(element, [
      '#bottom',
      '#footer',
      '#language-selector',
      '.language-selector.modal',
    ]);

    // --- Sticky-bar duplicate (verified lines 359/379/399/419) ---
    //   .sticky-bar.is-sticky duplicates the promo/hero CTA at runtime.
    WebImporter.DOMUtils.remove(element, [
      '.sticky-bar.is-sticky',
    ]);

    // --- Safe leftover element/attribute cleanup ---
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
      'source',
    ]);
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-tracking');
    });
  }
}
