/* ==========================================================================
   RB Homes & Property — site.js  (public website behaviour)
   ========================================================================== */
(function () {
  'use strict';

  var Store = window.RB.store;
  var U = Store.util;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = U.esc, naira = U.naira;

  /* ------------------------------------------------------------------ icons */
  var ICON = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6h18v6M3 18v2M21 18v2M3 12V7m0 0h7v5"/><path d="M6.5 9.5h.01"/></svg>',
    bath: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M7 12V6a2.5 2.5 0 0 1 5 0"/><path d="M6 20l-1 2M18 20l1 2"/></svg>',
    area: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"/><path d="M9 12h6"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.6 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.5-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.7-.1l1-1.1c.2-.3.5-.2.8-.1l2 1c.3.2.5.2.6.4.1.2.1.9-.1 1.5z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z"/></svg>'
  };

  /* ------------------------------------------------------- live settings
     Keeps the public site in sync with whatever the office saves in the
     admin dashboard (phone, address, hours, hero copy, WhatsApp number). */
  function waNumber(phone) {
    var d = String(phone || '').replace(/\D/g, '');
    if (!d) return '2348164309699';
    if (d.indexOf('234') === 0) return d;
    if (d.indexOf('0') === 0) return '234' + d.slice(1);
    return '234' + d;
  }

  function applySettings() {
    var s = Store.settings.get();
    if (!s) return;
    var tel = String(s.phone || '').replace(/\s/g, '');
    var map = {
      phone: s.phone,
      address: s.address,
      hours: s.hours,
      heroHeadline: s.heroHeadline,
      heroSub: s.heroSub
    };
    Object.keys(map).forEach(function (k) {
      $$('[data-bind="' + k + '"]').forEach(function (el) {
        if (map[k]) el.textContent = map[k];
      });
    });
    $$('[data-bind="phoneLink"]').forEach(function (el) {
      if (s.phone) { el.textContent = s.phone; el.setAttribute('href', 'tel:' + tel); }
    });
    $$('[data-bind="emailLink"]').forEach(function (el) {
      if (s.email) { el.textContent = s.email; el.setAttribute('href', 'mailto:' + s.email); }
    });
    // every wa.me link follows the configured number
    $$('a[href*="wa.me/"]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var q = href.indexOf('?');
      var query = q > -1 ? href.slice(q) : '';
      a.setAttribute('href', 'https://wa.me/' + waNumber(s.whatsapp) + query);
    });
    // mapbox target
    var mapLink = $('.mapbox');
    if (mapLink && s.mapsQuery) {
      mapLink.setAttribute('href', 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(s.mapsQuery));
      var pin = mapLink.querySelector('span span:last-child');
      if (pin) pin.textContent = s.mapsQuery + ' · Open in Google Maps';
    }
    if (s.businessName) document.title = document.title.replace(/^[^—]+—/, s.businessName + ' —');
  }

  /* -------------------------------------------------------------- toasts */
  var toastBox = $('#toasts');
  function toast(msg, kind) {
    if (!toastBox) return;
    var el = document.createElement('div');
    el.className = 'toast' + (kind ? ' toast--' + kind : '');
    var icon = kind === 'err'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5h.01"/></svg>'
      : kind === 'info'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
    el.innerHTML = icon + '<span>' + esc(msg) + '</span>';
    toastBox.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-out');
      setTimeout(function () { el.remove(); }, 260);
    }, 4200);
  }

  /* ------------------------------------------------------------ header / nav */
  var header = $('#siteHeader');
  var burger = $('#burger');
  var drawer = $('#drawer');

  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 8);
    var top = $('#toTop');
    if (top) top.classList.toggle('is-on', window.scrollY > 620);
    highlightNav();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); }
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeDrawer();
    });
  }

  var sections = ['listings', 'services', 'process', 'about', 'reviews', 'contact'];
  function highlightNav() {
    var y = window.scrollY + 140, active = '';
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= y) active = id;
    });
    $$('#navLinks a').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + active);
    });
  }

  var toTop = $('#toTop');
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  window.addEventListener('scroll', onScroll, { passive: true });

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------------- counters */
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var target = Number(el.getAttribute('data-count')) || 0;
        var suffix = el.getAttribute('data-suffix') || (target === 100 ? '' : '+');
        var start = performance.now(), dur = 1300;
        (function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
          if (p < 1) requestAnimationFrame(tick);
        })(start);
        cObs.unobserve(el);
      });
    }, { threshold: .55 });
    counters.forEach(function (c) { cObs.observe(c); });
  }

  /* --------------------------------------------------------------- reveals */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var rObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); rObs.unobserve(en.target); }
      });
    }, { threshold: .14, rootMargin: '0px 0px -40px' });
    reveals.forEach(function (r) { rObs.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('is-in'); });
  }

  /* ==========================================================================
     Listings
     ========================================================================== */
  var state = { q: '', type: '', location: '', beds: '', purpose: '', sort: 'new', savedOnly: false, page: 1, perPage: 6 };
  var grid = $('#propertyGrid');
  var countEl = $('#resultsCount');
  var loadMoreWrap = $('#loadMoreWrap');
  var clearBtn = $('#clearFilters');

  function purposeLabel(p) {
    return p.purpose === 'sale' ? 'For sale' : p.purpose === 'rent' ? 'For rent' : 'Short Let';
  }
  function purposeClass(p) {
    return p.purpose === 'sale' ? 'tag--green' : p.purpose === 'rent' ? 'tag--blue' : 'tag--amber';
  }
  function statusBadge(p) {
    if (p.status === 'sold') return '<span class="tag tag--red">Sold</span>';
    if (p.status === 'rented') return '<span class="tag tag--red">Rented</span>';
    if (p.status === 'pending') return '<span class="tag tag--amber">Under offer</span>';
    return '';
  }
  function priceLabel(p) {
    var base = naira(p.price, { short: p.price >= 10000000 });
    if (p.purpose === 'sale') return base + ' <small>asking</small>';
    if (p.purpose === 'shortlet') return base + ' <small>per night</small>';
    return base + ' <small>per ' + (p.period === 'month' ? 'month' : 'year') + '</small>';
  }

  function populateFilters() {
    var typeSel = $('#fType'), locSel = $('#fLocation');
    if (typeSel) {
      var types = Store.properties.types();
      types.forEach(function (t) {
        var o = document.createElement('option'); o.value = t; o.textContent = t; typeSel.appendChild(o);
      });
    }
    if (locSel) {
      var locs = Store.properties.locations();
      locs.forEach(function (l) {
        var o = document.createElement('option'); o.value = l; o.textContent = l; locSel.appendChild(o);
      });
    }
  }

  function getFiltered() {
    var all = Store.properties.list({ includeAll: true });
    var q = state.q.trim().toLowerCase();
    var out = all.filter(function (p) {
      if (state.savedOnly && !Store.saved.has(p.id)) return false;
      if (state.purpose && p.purpose !== state.purpose) return false;
      if (state.type && p.type !== state.type) return false;
      if (state.location && p.location !== state.location) return false;
      if (state.beds && (p.beds || 0) < Number(state.beds)) return false;
      if (q) {
        var hay = [p.title, p.location, p.address, p.type, p.description, p.ref, (p.features || []).join(' ')].join(' ').toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    out.sort(function (a, b) {
      switch (state.sort) {
        case 'low': return (a.price || 0) - (b.price || 0);
        case 'high': return (b.price || 0) - (a.price || 0);
        case 'beds': return (b.beds || 0) - (a.beds || 0);
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    // live stock first, then sold/rented archive
    return out.sort(function (a, b) {
      var rank = function (p) { return (p.status === 'sold' || p.status === 'rented') ? 1 : 0; };
      return rank(a) - rank(b);
    });
  }

  function cardHTML(p) {
    var sold = p.status === 'sold' || p.status === 'rented';
    var saved = Store.saved.has(p.id);
    return '' +
      '<article class="card' + (sold ? ' card--sold' : '') + '" data-id="' + esc(p.id) + '" tabindex="0" role="button" aria-label="View ' + esc(p.title) + '">' +
        '<div class="card__media">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + ' in ' + esc(p.location) + '" loading="lazy">' +
          '<div class="card__badges">' +
            '<span style="display:flex;gap:6px;flex-wrap:wrap">' +
              '<span class="tag tag--glass">' + esc(purposeLabel(p)) + '</span>' +
              statusBadge(p) +
              (p.featured && !sold ? '<span class="tag">Featured</span>' : '') +
            '</span>' +
            '<button class="card__save' + (saved ? ' is-on' : '') + '" data-save="' + esc(p.id) + '" aria-label="' + (saved ? 'Remove from saved' : 'Save property') + '" aria-pressed="' + saved + '">' + ICON.heart + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="card__body">' +
          '<div class="card__price">' + priceLabel(p) + '</div>' +
          '<h3 class="card__title">' + esc(p.title) + '</h3>' +
          '<div class="card__loc">' + ICON.pin + '<span>' + esc(p.location) + ' · Ref ' + esc(p.ref) + '</span></div>' +
          '<div class="card__specs">' +
            (p.beds ? '<span>' + ICON.bed + p.beds + ' bed</span>' : '') +
            (p.baths ? '<span>' + ICON.bath + p.baths + ' bath</span>' : '') +
            (p.area ? '<span>' + ICON.area + p.area + ' sqm</span>' : '<span>' + ICON.area + esc(p.type) + '</span>') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function render() {
    if (!grid) return;
    var list = getFiltered();
    var shown = list.slice(0, state.page * state.perPage);

    if (!list.length) {
      grid.innerHTML = '';
      grid.insertAdjacentHTML('beforeend',
        '<div class="empty" style="grid-column:1/-1">' +
          ICON.search +
          '<h3>No properties match those filters</h3>' +
          '<p>Try widening your budget or clearing a filter. New stock is added weekly — call us and we will look off-market too.</p>' +
          '<a class="btn btn--gold btn--sm" href="#contact" style="margin-top:8px">Tell us what you need</a>' +
        '</div>');
    } else {
      grid.innerHTML = shown.map(cardHTML).join('');
    }

    if (countEl) {
      countEl.innerHTML = list.length
        ? 'Showing <b>' + shown.length + '</b> of <b>' + list.length + '</b> propert' + (list.length === 1 ? 'y' : 'ies')
        : 'No results';
    }
    if (loadMoreWrap) loadMoreWrap.classList.toggle('hidden', shown.length >= list.length);

    var dirty = state.q || state.type || state.location || state.beds || state.purpose || state.savedOnly || state.sort !== 'new';
    if (clearBtn) clearBtn.classList.toggle('hidden', !dirty);
  }

  function syncFilterInputs() {
    if ($('#fSearch')) $('#fSearch').value = state.q;
    if ($('#fType')) $('#fType').value = state.type;
    if ($('#fLocation')) $('#fLocation').value = state.location;
    if ($('#fBeds')) $('#fBeds').value = state.beds;
    if ($('#fSort')) $('#fSort').value = state.sort;
    $$('#purposeChips .chip').forEach(function (c) {
      var isSaved = c.hasAttribute('data-saved');
      if (isSaved) c.classList.toggle('is-on', state.savedOnly);
      else c.classList.toggle('is-on', !state.savedOnly && (c.getAttribute('data-purpose') || '') === state.purpose);
    });
  }

  function resetFilters() {
    state = { q: '', type: '', location: '', beds: '', purpose: '', sort: 'new', savedOnly: false, page: 1, perPage: state.perPage };
    syncFilterInputs();
    render();
  }

  // wire filters
  var searchInput = $('#fSearch');
  if (searchInput) {
    var searchTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var v = searchInput.value;
      searchTimer = setTimeout(function () { state.q = v; state.page = 1; render(); }, 220);
    });
  }
  [['#fType', 'type'], ['#fLocation', 'location'], ['#fBeds', 'beds'], ['#fSort', 'sort']].forEach(function (pair) {
    var el = $(pair[0]);
    if (el) el.addEventListener('change', function () { state[pair[1]] = el.value; state.page = 1; render(); });
  });

  var chips = $('#purposeChips');
  if (chips) {
    chips.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      if (chip.hasAttribute('data-saved')) {
        state.savedOnly = !state.savedOnly;
        if (state.savedOnly && !Store.saved.list().length) toast('You have no saved properties yet — tap the heart on a listing.', 'info');
      } else {
        state.savedOnly = false;
        state.purpose = chip.getAttribute('data-purpose') || '';
      }
      state.page = 1;
      syncFilterInputs();
      render();
    });
  }

  if (clearBtn) clearBtn.addEventListener('click', resetFilters);

  var loadMoreBtn = $('#loadMore');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () { state.page++; render(); });
  }

  // card interactions
  if (grid) {
    grid.addEventListener('click', function (e) {
      var saveBtn = e.target.closest('[data-save]');
      if (saveBtn) {
        e.stopPropagation();
        var id = saveBtn.getAttribute('data-save');
        var nowSaved = Store.saved.toggle(id);
        saveBtn.classList.toggle('is-on', nowSaved);
        saveBtn.setAttribute('aria-pressed', nowSaved);
        saveBtn.setAttribute('aria-label', nowSaved ? 'Remove from saved' : 'Save property');
        toast(nowSaved ? 'Saved to your shortlist.' : 'Removed from your shortlist.', nowSaved ? '' : 'info');
        if (state.savedOnly) render();
        return;
      }
      var card = e.target.closest('.card');
      if (card) openProperty(card.getAttribute('data-id'));
    });
    grid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var card = e.target.closest('.card');
      if (card && !e.target.closest('[data-save]')) { e.preventDefault(); openProperty(card.getAttribute('data-id')); }
    });
  }

  /* ==========================================================================
     Property detail modal
     ========================================================================== */
  var modal = $('#propertyModal');
  var panel = $('#propertyPanel');
  var lastFocus = null;

  function openProperty(id) {
    var p = Store.properties.get(id);
    if (!p || !modal || !panel) return;
    Store.properties.bumpView(id);
    var saved = Store.saved.has(p.id);
    var sold = p.status === 'sold' || p.status === 'rented';
    var settings = Store.settings.get();
    var waText = encodeURIComponent('Hello RB Homes, I am interested in ' + p.title + ' (Ref ' + p.ref + ') listed at ' + naira(p.price) + '. Please share more details.');

    panel.innerHTML = '' +
      '<button class="modal__close" aria-label="Close">' + ICON.close + '</button>' +
      '<div class="pd__hero">' +
        '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '">' +
        '<div class="pd__hero-badges">' +
          '<span class="tag tag--glass">' + esc(purposeLabel(p)) + '</span>' +
          '<span class="tag tag--glass">' + esc(p.type) + '</span>' +
          (sold ? statusBadge(p) : '<span class="tag tag--glass">' + esc(p.status === 'pending' ? 'Under offer' : 'Available') + '</span>') +
        '</div>' +
      '</div>' +
      '<div class="pd__body">' +
        '<div>' +
          '<div class="pd__price">' + priceLabel(p) + '</div>' +
          '<h3 class="pd__title">' + esc(p.title) + '</h3>' +
          '<div class="pd__loc">' + ICON.pin + '<span>' + esc(p.address || p.location) + '</span></div>' +
          '<div class="pd__specs">' +
            (p.beds ? '<div class="pd__spec">' + ICON.bed + '<b>' + p.beds + '</b><span>Bedrooms</span></div>' : '') +
            (p.baths ? '<div class="pd__spec">' + ICON.bath + '<b>' + p.baths + '</b><span>Bathrooms</span></div>' : '') +
            (p.area ? '<div class="pd__spec">' + ICON.area + '<b>' + p.area + '</b><span>Sq metres</span></div>' : '') +
            '<div class="pd__spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v13H3z"/><path d="M8 7V4h8v3"/></svg><b>' + esc(p.ref) + '</b><span>Reference</span></div>' +
          '</div>' +
          '<h4 class="pd__h">Description</h4>' +
          '<p class="pd__desc">' + esc(p.description) + '</p>' +
          '<h4 class="pd__h">Features</h4>' +
          '<ul class="pd__features">' + (p.features || []).map(function (f) {
            return '<li>' + ICON.check + '<span>' + esc(f) + '</span></li>';
          }).join('') + '</ul>' +
        '</div>' +
        '<aside class="pd__side">' +
          '<div class="pd__agent">' +
            '<span class="avatar">RB</span>' +
            '<div><b>RB Homes &amp; Property</b><span>Real estate consultants, Ibadan</span></div>' +
          '</div>' +
          (sold
            ? '<p style="font-size:.88rem;color:var(--muted);margin-bottom:12px">This property is no longer available. Call us — we usually have a similar unit.</p>'
            : '<a class="btn btn--gold btn--block" href="#contact" data-enquire="' + esc(p.id) + '">Book an inspection</a>') +
          '<a class="btn btn--ghost btn--block" href="https://wa.me/' + esc(settings.whatsapp) + '?text=' + waText + '" target="_blank" rel="noopener">' + ICON.whatsapp + ' WhatsApp about this</a>' +
          '<a class="btn btn--ghost btn--block" href="tel:' + esc(settings.phone.replace(/\s/g, '')) + '">' + ICON.phone + ' ' + esc(settings.phone) + '</a>' +
          '<button class="btn btn--ghost btn--block" data-save-modal="' + esc(p.id) + '">' + ICON.heart + ' <span>' + (saved ? 'Saved' : 'Save property') + '</span></button>' +
          '<p class="pd__note">Listed ' + U.timeAgo(p.createdAt) + ' · ' + (p.views || 0) + ' views</p>' +
        '</aside>' +
      '</div>';

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lastFocus = document.activeElement;
    var closeBtn = panel.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();

    panel.querySelector('.modal__close').addEventListener('click', closeProperty);
    var saveModalBtn = panel.querySelector('[data-save-modal]');
    if (saveModalBtn) {
      saveModalBtn.addEventListener('click', function () {
        var on = Store.saved.toggle(p.id);
        saveModalBtn.querySelector('span').textContent = on ? 'Saved' : 'Save property';
        toast(on ? 'Saved to your shortlist.' : 'Removed from your shortlist.', on ? '' : 'info');
        render();
      });
    }
    var enquire = panel.querySelector('[data-enquire]');
    if (enquire) {
      enquire.addEventListener('click', function () {
        closeProperty();
        setTimeout(function () {
          var interest = $('#eqInterest');
          if (interest) interest.value = p.purpose === 'rent' || p.purpose === 'shortlet' ? 'Renting a property' : 'Buying a property';
          var msg = $('#eqMessage');
          if (msg && !msg.value) msg.value = 'I would like to inspect ' + p.title + ' (Ref ' + p.ref + ').';
          var form = $('#contact');
          if (form) form.scrollIntoView({ behavior: 'smooth' });
          var name = $('#eqName');
          if (name) setTimeout(function () { name.focus({ preventScroll: true }); }, 600);
        }, 120);
      });
    }
  }

  function closeProperty() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeProperty();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeProperty(); closeDrawer(); }
  });

  /* ==========================================================================
     Quick search (hero) -> filters
     ========================================================================== */
  var qs = $('#quickSearch');
  if (qs) {
    qs.addEventListener('submit', function (e) {
      e.preventDefault();
      state.location = $('#qsLocation').value;
      state.type = $('#qsType').value;
      state.purpose = $('#qsPurpose').value;
      state.savedOnly = false;
      state.page = 1;
      var budget = $('#qsBudget').value;
      state.q = '';
      syncFilterInputs();
      render();
      var target = $('#listings');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      // budget is applied as a quick post-filter note
      if (budget) {
        var parts = budget.split('-').map(Number);
        var list = getFiltered().filter(function (p) { return p.price >= parts[0] && p.price <= parts[1]; });
        if (!list.length) toast('Nothing in that budget with those filters. Try a wider budget.', 'info');
        else toast(list.length + ' propert' + (list.length === 1 ? 'y' : 'ies') + ' within that budget.', '');
      }
    });
  }

  /* footer quick links */
  $$('[data-quick]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('data-quick');
      resetFilters();
      if (v === 'land') { state.type = 'Land'; }
      else state.purpose = v;
      syncFilterInputs();
      render();
    });
  });

  /* scroll-to-contact helper for buttons elsewhere */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#contact"]');
    if (!a) return;
    closeDrawer();
  });

  /* ==========================================================================
     Enquiry form
     ========================================================================== */
  var form = $('#enquiryForm');
  function setErr(input, isErr) {
    var field = input.closest('.field');
    if (field) field.classList.toggle('field--error', !!isErr);
  }
  function validPhone(v) {
    var digits = String(v || '').replace(/[^\d]/g, '');
    return /^(0\d{10}|234\d{10}|\d{10})$/.test(digits);
  }

  if (form) {
    ['eqName', 'eqPhone', 'eqEmail', 'eqInterest'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { setErr(el, false); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#eqName'), phone = $('#eqPhone'), email = $('#eqEmail'),
          interest = $('#eqInterest'), budget = $('#eqBudget'), message = $('#eqMessage'),
          consent = $('#eqConsent');
      var ok = true;

      if (!name.value.trim() || name.value.trim().length < 2) { setErr(name, true); ok = false; }
      if (!validPhone(phone.value)) { setErr(phone, true); ok = false; }
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.value.trim())) { setErr(email, true); ok = false; }
      if (!interest.value) { setErr(interest, true); ok = false; }

      if (!consent.checked) { ok = false; toast('Please tick the consent box so we can contact you.', 'err'); }

      if (!ok) {
        var firstErr = form.querySelector('.field--error .input, .field--error .select');
        if (firstErr) firstErr.focus();
        return;
      }

      var btn = $('#eqSubmit');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      setTimeout(function () {
        Store.enquiries.create({
          name: name.value.trim(),
          phone: phone.value.trim(),
          email: email.value.trim(),
          interest: interest.value,
          budget: budget.value,
          message: message.value.trim()
        });
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Send request';
        var cfg = Store.settings.get();
        toast(cfg.autoReply === false
          ? 'Thank you, ' + name.value.trim().split(' ')[0] + '. Your request has been received.'
          : 'Thank you, ' + name.value.trim().split(' ')[0] + '. Your request is in — we will call you within 24 hours.', '');
        // open whatsapp as an optional fast path
        var settings = Store.settings.get();
        var text = encodeURIComponent('Hello RB Homes, my name is ' + name.value.trim() + '. I just sent a request on your website regarding ' + interest.value + '.');
        var link = document.createElement('a');
        link.href = 'https://wa.me/' + settings.whatsapp + '?text=' + text;
        link.target = '_blank';
        link.rel = 'noopener';
        // Not auto-opened (pop-up blockers); surface as a toast action instead.
        toast('Tip: you can also reach us instantly on WhatsApp — see the button in Contacts.', 'info');
      }, 620);
    });
  }

  window.addEventListener('focus', applySettings);
  window.addEventListener('storage', function () { applySettings(); render(); });

  /* ==========================================================================
     Boot
     ========================================================================== */
  Store.init().then(function () {
    applySettings();
    populateFilters();
    syncFilterInputs();
    render();
    onScroll();
  });
})();
