/* ==========================================================================
   Stud — theme.js
   Vanilla JS, event-delegated so it survives AJAX-replaced markup
   (cart drawer, product variant swaps) without needing re-binding.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Money formatting (Shopify's standard format-string approach)        */
  /* ------------------------------------------------------------------ */
  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = precision == null ? 2 : precision;
    thousands = thousands == null ? ',' : thousands;
    decimal = decimal == null ? '.' : decimal;
    if (isNaN(number) || number == null) return 0;
    number = (number / 100).toFixed(precision);
    const parts = number.split('.');
    const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
    const cents = parts[1] ? decimal + parts[1] : '';
    return dollars + cents;
  }

  function formatMoney(cents, format) {
    const formatString = format || window.themeMoneyFormat || '${{amount}}';
    const match = formatString.match(/\{\{\s*(\w+)\s*\}\}/);
    if (!match) return formatString;
    let value;
    switch (match[1]) {
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      default:
        value = formatWithDelimiters(cents, 2);
    }
    return formatString.replace(match[0], value);
  }

  /* ------------------------------------------------------------------ */
  /* Drawers: cart, search, mobile menu                                   */
  /* ------------------------------------------------------------------ */
  function openDrawer(el) {
    if (!el) return;
    el.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer(el) {
    if (!el) return;
    el.hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open]')) {
      openDrawer(document.querySelector('[data-cart-drawer]'));
    }
    if (e.target.closest('[data-cart-close]')) {
      closeDrawer(document.querySelector('[data-cart-drawer]'));
    }
    if (e.target.closest('[data-toggle-recover]')) {
      e.preventDefault();
      const recover = document.getElementById('RecoverPassword');
      if (recover) recover.hidden = !recover.hidden;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDrawer(document.querySelector('[data-cart-drawer]'));
    }
  });

  /* ------------------------------------------------------------------ */
  /* Cart: add / update / remove via AJAX, cart-drawer section refresh   */
  /* ------------------------------------------------------------------ */
  async function refreshCartDrawer() {
    try {
      const url = window.location.pathname + window.location.search
        + (window.location.search ? '&' : '?') + 'sections=cart-drawer';
      const res = await fetch(url);
      const data = await res.json();
      const html = data['cart-drawer'];
      if (!html) return;
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const newDrawer = temp.querySelector('[data-cart-drawer]');
      const oldDrawer = document.querySelector('[data-cart-drawer]');
      if (newDrawer && oldDrawer) {
        const wasHidden = oldDrawer.hidden;
        oldDrawer.replaceWith(newDrawer);
        newDrawer.hidden = wasHidden;
      }
    } catch (err) {
      /* non-fatal: cart mutation already happened server-side */
    }
  }

  async function updateCartCount() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      document.querySelectorAll('[data-cart-count]').forEach(function (el) {
        el.textContent = cart.item_count;
      });
    } catch (err) { /* ignore */ }
  }

  async function addToCart(id, quantity) {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: id, quantity: quantity || 1 }),
    });
    if (!res.ok) {
      const err = await res.json().catch(function () { return {}; });
      throw new Error(err.description || 'Could not add item to cart');
    }
    await Promise.all([refreshCartDrawer(), updateCartCount()]);
    openDrawer(document.querySelector('[data-cart-drawer]'));
  }

  async function changeCartLine(line, quantity) {
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity }),
    });
    await Promise.all([refreshCartDrawer(), updateCartCount()]);
  }

  document.addEventListener('submit', function (e) {
    const quickAddForm = e.target.closest('[data-quick-add-form]');
    const productForm = e.target.closest('[data-add-to-cart-form]');
    if (!quickAddForm && !productForm) return;

    e.preventDefault();
    const form = quickAddForm || productForm;
    const idInput = form.querySelector('[name="id"]');
    const qtyInput = form.querySelector('[name="quantity"]');
    const button = form.querySelector('[data-add-to-cart-button], button[type="submit"]');
    if (!idInput) return;

    if (button) button.disabled = true;
    addToCart(idInput.value, qtyInput ? parseInt(qtyInput.value, 10) : 1)
      .catch(function (err) {
        alert(err.message);
      })
      .finally(function () {
        if (button) button.disabled = false;
      });
  });

  document.addEventListener('click', function (e) {
    const minus = e.target.closest('[data-quantity-minus]');
    const plus = e.target.closest('[data-quantity-plus]');
    if (!minus && !plus) return;

    const wrap = (minus || plus).closest('[data-quantity-selector]');
    if (!wrap) return;
    const cartItem = wrap.closest('[data-cart-item]');

    if (cartItem) {
      const valueEl = wrap.querySelector('[data-quantity-value]');
      let value = parseInt(valueEl.textContent, 10);
      value = minus ? Math.max(0, value - 1) : value + 1;
      valueEl.textContent = value;
      changeCartLine(parseInt(cartItem.dataset.line, 10), value);
    } else {
      const input = wrap.querySelector('[data-quantity-value]');
      if (!input) return;
      let value = parseInt(input.value, 10) || 1;
      value = minus ? Math.max(1, value - 1) : value + 1;
      input.value = value;
    }
  });

  document.addEventListener('click', function (e) {
    const removeBtn = e.target.closest('[data-cart-remove]');
    if (!removeBtn) return;
    const cartItem = removeBtn.closest('[data-cart-item]');
    if (!cartItem) return;
    changeCartLine(parseInt(cartItem.dataset.line, 10), 0);
  });

  /* ------------------------------------------------------------------ */
  /* Sticky buy bar                                                       */
  /* Appears once the hero has scrolled out of view, so there is always   */
  /* a buy button on screen without one covering the hero itself.         */
  /* ------------------------------------------------------------------ */
  function initStickyBuy() {
    const bar = document.querySelector('[data-sticky-buy]');
    if (!bar) return;

    const hero = document.querySelector('[data-hero]');
    if (!hero || !('IntersectionObserver' in window)) {
      bar.hidden = false;
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        bar.hidden = entries[0].isIntersecting;
      },
      { rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(hero);
  }

  document.addEventListener('DOMContentLoaded', initStickyBuy);

  /* ------------------------------------------------------------------ */
  /* Photo carousel                                                       */
  /* Native scroll-snap does the work; the arrows just nudge it by one    */
  /* item and grey out at each end.                                       */
  /* ------------------------------------------------------------------ */
  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
      const track = carousel.querySelector('[data-carousel-track]');
      const prev = carousel.querySelector('[data-carousel-prev]');
      const next = carousel.querySelector('[data-carousel-next]');
      if (!track) return;

      function step() {
        const item = track.querySelector('.carousel__item');
        if (!item) return track.clientWidth * 0.8;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return item.getBoundingClientRect().width + gap;
      }

      function syncArrows() {
        const max = track.scrollWidth - track.clientWidth;
        if (prev) prev.disabled = track.scrollLeft <= 1;
        if (next) next.disabled = track.scrollLeft >= max - 1;
      }

      if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step() }); });
      if (next) next.addEventListener('click', function () { track.scrollBy({ left: step() }); });
      track.addEventListener('scroll', syncArrows, { passive: true });
      window.addEventListener('resize', syncArrows);
      syncArrows();
    });
  }

  document.addEventListener('DOMContentLoaded', initCarousels);

  /* ------------------------------------------------------------------ */
  /* Header: retract on scroll down, return on scroll up                  */
  /* ------------------------------------------------------------------ */
  function initHeaderScroll() {
    const header = document.querySelector('[data-header]');
    if (!header) return;

    let lastY = window.pageYOffset;
    let ticking = false;
    // Ignore jitter, and never hide while still near the top of the page.
    const DELTA = 6;
    const REVEAL_ZONE = 120;

    function update() {
      const y = Math.max(0, window.pageYOffset);
      if (Math.abs(y - lastY) > DELTA) {
        const scrollingDown = y > lastY;
        header.classList.toggle('site-header--hidden', scrollingDown && y > REVEAL_ZONE);
        lastY = y;
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', initHeaderScroll);

  /* ------------------------------------------------------------------ */
  /* Scroll reveal                                                        */
  /* Elements marked [data-reveal] start hidden in CSS and ease in once   */
  /* they enter the viewport. No observer support means show everything.  */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    const targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener('DOMContentLoaded', initReveal);

  /* ------------------------------------------------------------------ */
  /* Product gallery thumbnails                                           */
  /* ------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    const thumb = e.target.closest('[data-thumb]');
    if (!thumb) return;
    const wrap = thumb.closest('.product-detail__thumbs');
    if (wrap) wrap.querySelectorAll('[data-thumb]').forEach(function (t) { t.classList.remove('is-active'); });
    thumb.classList.add('is-active');
    const mainImg = document.getElementById('ProductMainImage');
    if (mainImg && thumb.dataset.fullSrc) mainImg.src = thumb.dataset.fullSrc;
  });

  /* ------------------------------------------------------------------ */
  /* Product variant picker                                               */
  /* ------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    const optionBtn = e.target.closest('[data-option-value]');
    if (!optionBtn) return;

    const form = optionBtn.closest('form[data-add-to-cart-form]');
    if (!form) return;

    const optionIndex = optionBtn.dataset.optionIndex;
    const group = optionBtn.closest('.product-option');
    group.querySelectorAll('[data-option-value]').forEach(function (b) { b.classList.remove('is-selected'); });
    optionBtn.classList.add('is-selected');
    const labelValue = group.querySelector('[data-selected-value]');
    if (labelValue) labelValue.textContent = optionBtn.dataset.optionValue;

    updateSelectedVariant(form);
  });

  function updateSelectedVariant(form) {
    const variantsScript = form.querySelector('[data-product-variants]');
    if (!variantsScript) return;
    const variants = JSON.parse(variantsScript.textContent);

    const selected = [];
    form.querySelectorAll('.product-option').forEach(function (group) {
      const active = group.querySelector('.is-selected');
      selected[parseInt(group.dataset.optionIndex, 10)] = active ? active.dataset.optionValue : null;
    });

    const match = variants.find(function (variant) {
      return variant.options.every(function (opt, i) { return opt === selected[i]; });
    });

    const idInput = form.querySelector('[data-variant-id]');
    const addButton = form.querySelector('[data-add-to-cart-button]');
    const addButtonText = form.querySelector('[data-add-to-cart-text]');
    const priceWrap = form.closest('.product-detail__info').querySelector('[data-product-price]');

    if (!match) {
      if (addButton) addButton.disabled = true;
      if (addButtonText) addButtonText.textContent = 'Unavailable';
      return;
    }

    if (idInput) idInput.value = match.id;

    if (priceWrap) {
      const onSale = match.compare_at_price && match.compare_at_price > match.price;
      priceWrap.innerHTML = onSale
        ? '<div class="price price--on-sale"><span class="price__compare">' + formatMoney(match.compare_at_price) +
          '</span><span class="price__sale">' + formatMoney(match.price) + '</span></div>'
        : '<div class="price"><span class="price__regular">' + formatMoney(match.price) + '</span></div>';
    }

    if (match.featured_image && match.featured_image.src) {
      const mainImg = document.getElementById('ProductMainImage');
      if (mainImg) mainImg.src = match.featured_image.src;
    }

    if (addButton) addButton.disabled = !match.available;
    if (addButtonText) addButtonText.textContent = match.available ? (window.themeStrings && window.themeStrings.addToCart || 'Add to cart') : 'Sold out';
  }

  /* ------------------------------------------------------------------ */
  /* Announcement bar countdown                                           */
  /* ------------------------------------------------------------------ */
  function initCountdown() {
    const el = document.querySelector('[data-countdown]');
    if (!el) return;

    let endDate = new Date(el.dataset.countdown.replace(' ', 'T'));
    if (isNaN(endDate.getTime()) || endDate.getTime() <= Date.now()) {
      endDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
    }

    const daysEl = el.querySelector('[data-countdown-days]');
    const hoursEl = el.querySelector('[data-countdown-hours]');
    const minutesEl = el.querySelector('[data-countdown-minutes]');
    const secondsEl = el.querySelector('[data-countdown-seconds]');

    function tick() {
      const diff = Math.max(0, endDate.getTime() - Date.now());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    tick();
    setInterval(tick, 1000);
  }

  document.addEventListener('DOMContentLoaded', initCountdown);
})();
