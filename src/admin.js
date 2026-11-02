/* ==========================================================================
   RB Homes & Property — admin.js
   Dashboard, login, CRUD, settings and password management.
   ========================================================================== */
(function () {
  'use strict';

  var Store = window.RB.store;
  var U = Store.util;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = U.esc, naira = U.naira, timeAgo = U.timeAgo;

  var ICONS = {
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    money: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><circle cx="12" cy="12" r="2.6"/><path d="M8 9h.01M16 15h.01"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.4"/><path d="M2.5 21a6.5 6.5 0 0 1 13 0"/><path d="M17 11a3 3 0 1 0 0-6"/><path d="M18 21a6 6 0 0 0-3-5.2"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.6 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.8-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.5-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.7-.1l1-1.1c.2-.3.5-.2.8-.1l2 1c.3.2.5.2.6.4.1.2.1.9-.1 1.5z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>'
  };

  /* ------------------------------------------------------------------ toast */
  var toastHost;
  function toast(msg, kind) {
    if (!toastHost) {
      toastHost = document.createElement('div');
      toastHost.className = 'toasts';
      toastHost.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastHost);
    }
    var el = document.createElement('div');
    el.className = 'toast' + (kind ? ' toast--' + kind : '');
    var icon = kind === 'err'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5h.01"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
    el.innerHTML = icon + '<span>' + esc(msg) + '</span>';
    toastHost.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-out');
      setTimeout(function () { el.remove(); }, 260);
    }, 3800);
  }

  /* ------------------------------------------------------- password toggles */
  $$('[data-pw]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('data-pw'));
      if (!input) return;
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.style.color = show ? 'var(--gold)' : '';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  /* ==========================================================================
     LOGIN
     ========================================================================== */
  var authScreen = $('#authScreen');
  var appShell = $('#appShell');
  var loginForm = $('#loginForm');
  var recoverForm = $('#recoverForm');
  var authErr = $('#authErr');
  var authErrText = $('#authErrText');

  function showAuthError(msg) {
    if (!authErr) return;
    authErrText.textContent = msg;
    authErr.classList.add('is-on');
    clearTimeout(showAuthError._t);
    showAuthError._t = setTimeout(function () { authErr.classList.remove('is-on'); }, 6000);
  }
  function clearAuthError() { if (authErr) authErr.classList.remove('is-on'); }

  if ($('#forgotBtn')) {
    $('#forgotBtn').addEventListener('click', function () {
      loginForm.classList.add('hidden');
      recoverForm.classList.remove('hidden');
      $('#authTitle').textContent = 'Reset password';
      $('#authSubtitle').textContent = 'Use your recovery key to set a new password.';
      clearAuthError();
    });
  }
  if ($('#backToLogin')) {
    $('#backToLogin').addEventListener('click', function () {
      recoverForm.classList.add('hidden');
      loginForm.classList.remove('hidden');
      $('#authTitle').textContent = 'Staff sign in';
      $('#authSubtitle').textContent = 'Enter your credentials to open the RB Homes dashboard.';
      clearAuthError();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var user = $('#loginUser').value.trim();
      var pass = $('#loginPass').value;
      if (!user || !pass) { showAuthError('Please enter both your username and password.'); return; }
      var btn = $('#loginBtn');
      btn.disabled = true; btn.textContent = 'Signing in…';
      clearAuthError();

      Store.auth.login(user, pass).then(function (res) {
        btn.disabled = false; btn.textContent = 'Sign in';
        if (!res.ok) { showAuthError(res.error); return; }
        $('#loginPass').value = '';
        enterApp();
        if (res.mustChangePassword) {
          setTimeout(function () {
            toast('Signed in. You are still using the demo password — change it under Password & login.', 'info');
          }, 600);
        }
      }).catch(function () {
        btn.disabled = false; btn.textContent = 'Sign in';
        showAuthError('Something went wrong while signing in. Please try again.');
      });
    });
  }

  if (recoverForm) {
    recoverForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var user = $('#recoverUser').value.trim() || 'admin';
      var key = $('#recoverKey').value.trim();
      var next = $('#recoverNew').value;
      clearAuthError();
      Store.auth.resetWithKey(user, key, next).then(function (res) {
        if (!res.ok) { showAuthError(res.error); return; }
        recoverForm.reset();
        toast('Password updated. You can sign in now.', '');
        $('#backToLogin').click();
      });
    });
  }

  function enterApp() {
    if (authScreen) authScreen.classList.add('hidden');
    if (appShell) appShell.classList.remove('hidden');
    document.body.style.background = '#f4f5f2';
    paintUser();
    renderAll();
    showView('dashboard');
  }

  function exitApp() {
    if (appShell) appShell.classList.add('hidden');
    if (authScreen) authScreen.classList.remove('hidden');
    document.body.style.background = '';
    $('#loginPass').value = '';
    window.scrollTo({ top: 0 });
  }

  function logout() {
    confirmBox('Sign out?', 'You will need your username and password to sign back in.', function () {
      Store.auth.logout();
      exitApp();
      toast('Signed out.', '');
    }, 'Sign out');
  }
  ['#logoutBtn', '#logoutBtn2'].forEach(function (sel) {
    var b = $(sel);
    if (b) b.addEventListener('click', logout);
  });

  function paintUser() {
    var u = Store.auth.user();
    if (!u) return;
    $('#userAvatar').textContent = Store.auth.initials();
    $('#userName').textContent = u.name || u.username;
    $('#userRole').textContent = u.role || 'Administrator';
    $('#ddName').textContent = u.name || u.username;
    $('#ddUser').textContent = '@' + u.username;
    var secUser = $('#secUser'); if (secUser) secUser.textContent = u.username;
    paintBanner();
  }

  /* Gentle, non-blocking nudge while the demo password is still in use. */
  function paintBanner() {
    var host = $('#pwBanner');
    if (!host) return;
    if (!Store.auth.user() || !Store.auth.user().mustChangePassword) { host.innerHTML = ''; return; }
    host.innerHTML =
      '<div class="banner">' +
        '<span class="banner__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6z"/><path d="M12 8v4M12 15.5h.01"/></svg></span>' +
        '<div><b>You are still using the demo password</b>' +
        '<p>Anyone reading the sign-in screen knows it. Set your own password to protect this dashboard.</p></div>' +
        '<button class="btn btn--gold btn--sm" data-goto-security>Change password</button>' +
        '<button class="banner__close" data-dismiss-banner aria-label="Dismiss">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>';
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-goto-security]')) {
      showView('security');
      setTimeout(function () { var pw = $('#pwCurrent'); if (pw) pw.focus(); }, 220);
    }
    if (e.target.closest('[data-dismiss-banner]')) paintBannerHide();
  });
  function paintBannerHide() {
    var host = $('#pwBanner');
    if (host) host.innerHTML = '';
  }

  /* -------------------------------------------------------- user dropdown */
  var userChip = $('#userChip'), userDropdown = $('#userDropdown');
  if (userChip && userDropdown) {
    userChip.addEventListener('click', function (e) {
      e.stopPropagation();
      userDropdown.classList.toggle('is-open');
    });
    document.addEventListener('click', function () { userDropdown.classList.remove('is-open'); });
    userDropdown.addEventListener('click', function (e) {
      if (e.target.closest('button, a')) userDropdown.classList.remove('is-open');
    });
  }

  /* ------------------------------------------------------ sidebar (mobile) */
  var sidebar = $('#sidebar'), scrim = $('#scrim');
  if ($('#sidebarToggle')) {
    $('#sidebarToggle').addEventListener('click', function () {
      sidebar.classList.toggle('is-open');
      scrim.classList.toggle('is-on');
    });
  }
  if (scrim) {
    scrim.addEventListener('click', function () {
      sidebar.classList.remove('is-open');
      scrim.classList.remove('is-on');
    });
  }

  /* ==========================================================================
     VIEW ROUTING
     ========================================================================== */
  var VIEWS = {
    dashboard: ['Dashboard', 'Overview of your portfolio'],
    properties: ['All properties', 'Add, edit and manage listings'],
    enquiries: ['Client enquiries', 'Follow up on website requests'],
    settings: ['Site settings', 'Business details shown on the website'],
    security: ['Password & login', 'Credentials for this dashboard'],
    activity: ['Activity log', 'What has happened in this dashboard']
  };

  function showView(name) {
    if (!VIEWS[name]) name = 'dashboard';
    $$('.view').forEach(function (v) { v.classList.toggle('is-on', v.id === 'view-' + name); });
    $$('.side__link[data-view]').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-view') === name);
    });
    $('#viewTitle').innerHTML = VIEWS[name][0] + '<span>' + VIEWS[name][1] + '</span>';
    sidebar.classList.remove('is-open');
    if (scrim) scrim.classList.remove('is-on');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (name === 'properties') renderPropTable();
    if (name === 'enquiries') renderEnquiries();
    if (name === 'activity') renderActivity();
    if (name === 'security') paintSecurity();
    if (name === 'settings') fillSettings();
  }

  document.addEventListener('click', function (e) {
    var viewBtn = e.target.closest('[data-view]');
    if (viewBtn) { showView(viewBtn.getAttribute('data-view')); return; }
    var actBtn = e.target.closest('[data-action]');
    if (actBtn) handleAction(actBtn.getAttribute('data-action'));
  });

  /* ==========================================================================
     DASHBOARD
     ========================================================================== */
  function renderDashboard() {
    var s = Store.stats();
    var user = Store.auth.user();
    var hour = new Date().getHours();
    var greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    var g = $('#greeting');
    if (g) g.textContent = greet + ', ' + (user ? (user.name || user.username) : 'Admin');
    var t = $('#todayLine');
    if (t) {
      t.textContent = new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
        ' · ' + s.available + ' active listings · ' + s.newEnquiries + ' new enquiries';
    }

    var statHTML = [
      { label: 'Total listings', value: s.total, sub: s.featured + ' featured on homepage', icon: ICONS.home, cls: '' },
      { label: 'Available now', value: s.available, sub: s.pending + ' under offer', icon: ICONS.check, cls: 'stat__icon--green' },
      { label: 'New enquiries', value: s.newEnquiries, sub: s.enquiries + ' total received', icon: ICONS.chat, cls: 'stat__icon--amber' },
      { label: 'Portfolio value', value: naira(s.portfolioValue, { short: true }), sub: 'sum of sale asking prices', icon: ICONS.money, cls: 'stat__icon--blue' },
      { label: 'Listing views', value: s.views, sub: 'across all properties', icon: ICONS.eye, cls: '' },
      { label: 'Sold / rented', value: s.sold, sub: 'closed listings on record', icon: ICONS.users, cls: 'stat__icon--blue' }
    ].map(function (x) {
      return '<div class="stat">' +
        '<div class="stat__top"><span class="stat__label">' + x.label + '</span>' +
        '<span class="stat__icon ' + x.cls + '">' + x.icon + '</span></div>' +
        '<b class="stat__value">' + x.value + '</b>' +
        '<div class="stat__sub">' + x.sub + '</div></div>';
    }).join('');
    $('#statsRow').innerHTML = statHTML;

    // recent enquiries
    var enqs = Store.enquiries.list().slice(0, 4);
    if (!enqs.length) {
      $('#dashEnquiries').innerHTML = '<div class="table-empty">No enquiries yet.</div>';
    } else {
      $('#dashEnquiries').innerHTML = '<div class="table-wrap"><table class="data" style="min-width:520px"><tbody>' +
        enqs.map(function (e) {
          return '<tr>' +
            '<td><div class="tprop"><span class="avatar" style="width:34px;height:34px;font-size:.74rem">' + esc(initials(e.name)) + '</span>' +
            '<div><b>' + esc(e.name) + '</b><span>' + esc(e.interest) + '</span></div></div></td>' +
            '<td class="tmuted">' + esc(e.phone) + '</td>' +
            '<td>' + statusTag(e.status) + '</td>' +
            '<td class="tmuted" style="text-align:right">' + timeAgo(e.createdAt) + '</td>' +
            '</tr>';
        }).join('') + '</tbody></table></div>';
    }

    // purpose bars
    var maxP = Math.max(s.forSale, s.forRent, s.shortlet, 1);
    $('#dashPurposeBars').innerHTML = [
      { label: 'For sale', v: s.forSale, cls: '' },
      { label: 'For rent', v: s.forRent, cls: 'bar-fill--blue' },
      { label: 'Short-let', v: s.shortlet, cls: 'bar-fill--amber' }
    ].map(function (b) {
      var pct = Math.round((b.v / maxP) * 100);
      return '<div class="bar-row"><div class="bar-row__top"><span>' + b.label + '</span><span>' + b.v + '</span></div>' +
        '<div class="bar-track"><div class="bar-fill ' + b.cls + '" style="width:' + (b.v ? Math.max(pct, 6) : 0) + '%"></div></div></div>';
    }).join('');

    // 7 day chart
    var days = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      var next = new Date(d); next.setDate(next.getDate() + 1);
      var n = Store.enquiries.list().filter(function (e) {
        var t = new Date(e.createdAt).getTime();
        return t >= d.getTime() && t < next.getTime();
      }).length;
      days.push({ label: d.toLocaleDateString('en-NG', { weekday: 'short' }).slice(0, 3), n: n });
    }
    var maxD = Math.max.apply(null, days.map(function (x) { return x.n; }).concat([1]));
    $('#dashChart').innerHTML = days.map(function (d) {
      var h = Math.round((d.n / maxD) * 100);
      return '<div class="chart__bar"><span class="chart__val">' + d.n + '</span>' +
        '<div class="chart__fill" style="height:' + Math.max(h, d.n ? 8 : 3) + '%" title="' + d.n + ' enquiries"></div>' +
        '<span class="chart__lab">' + d.label + '</span></div>';
    }).join('');

    // activity feed
    var logs = Store.logs.list().slice(0, 5);
    $('#dashActivity').innerHTML = logs.length ? '<div class="feed">' + logs.map(function (l) {
      return '<div class="feed__item"><span class="feed__dot"></span><div><b>' + esc(l.action) + '</b>' +
        (l.detail ? '<span>' + esc(l.detail) + '</span>' : '') + '</div><time>' + timeAgo(l.at) + '</time></div>';
    }).join('') + '</div>' : '<p class="tmuted">No activity yet.</p>';

    // nav badges
    var navProp = $('#navPropCount'); if (navProp) navProp.textContent = s.total;
    var navEnq = $('#navEnqCount'); if (navEnq) navEnq.textContent = s.newEnquiries;
    var bell = $('#bellDot');
    if (bell) {
      bell.textContent = s.newEnquiries;
      bell.classList.toggle('hidden', !s.newEnquiries);
    }
  }

  function initials(name) {
    return String(name || '?').split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  }
  function statusTag(st) {
    if (st === 'new') return '<span class="tag tag--amber">New</span>';
    if (st === 'contacted') return '<span class="tag tag--blue">Contacted</span>';
    if (st === 'closed') return '<span class="tag tag--green">Closed</span>';
    return '<span class="tag tag--muted">' + esc(st) + '</span>';
  }
  function propStatusTag(st) {
    if (st === 'available') return '<span class="tag tag--green"><span class="dot dot--green"></span>Available</span>';
    if (st === 'pending') return '<span class="tag tag--amber"><span class="dot dot--amber"></span>Under offer</span>';
    if (st === 'sold') return '<span class="tag tag--red">Sold</span>';
    if (st === 'rented') return '<span class="tag tag--red">Rented</span>';
    return '<span class="tag tag--muted">' + esc(st) + '</span>';
  }

  $('#bellBtn').addEventListener('click', function () { showView('enquiries'); setEnqFilter('new'); });

  /* ==========================================================================
     PROPERTIES TABLE
     ========================================================================== */
  var propFilters = { q: '', purpose: '', status: '', sort: 'new' };

  function propRows() {
    var all = Store.properties.list({ includeAll: true });
    var q = propFilters.q.trim().toLowerCase();
    var out = all.filter(function (p) {
      if (propFilters.purpose && p.purpose !== propFilters.purpose) return false;
      if (propFilters.status && p.status !== propFilters.status) return false;
      if (q) {
        var hay = [p.title, p.location, p.ref, p.type, p.address].join(' ').toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
    out.sort(function (a, b) {
      switch (propFilters.sort) {
        case 'old': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priceHigh': return b.price - a.price;
        case 'priceLow': return a.price - b.price;
        case 'views': return (b.views || 0) - (a.views || 0);
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    return out;
  }

  function renderPropTable() {
    var rows = propRows();
    var body = $('#propTableBody');
    var empty = $('#propTableEmpty');
    if (!body) return;
    if (!rows.length) {
      body.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
    } else {
      if (empty) empty.classList.add('hidden');
      body.innerHTML = rows.map(function (p) {
        return '<tr data-row="' + esc(p.id) + '">' +
          '<td><div class="tprop"><img src="' + esc(p.image) + '" alt="">' +
            '<div><b>' + esc(p.title) + '</b><span>' + esc(p.ref) + ' · ' + esc(p.location) + '</span></div></div></td>' +
          '<td><span class="tag ' + (p.purpose === 'sale' ? 'tag--green' : p.purpose === 'rent' ? 'tag--blue' : 'tag--amber') + '">' +
            (p.purpose === 'sale' ? 'Sale' : p.purpose === 'rent' ? 'Rent' : 'Short-let') + '</span></td>' +
          '<td class="tnum">' + naira(p.price, { short: p.price >= 10000000 }) +
            (p.purpose === 'sale' ? '' : '<span class="tmuted"> /' + (p.period === 'night' ? 'night' : p.period === 'month' ? 'mo' : 'yr') + '</span>') + '</td>' +
          '<td class="tmuted">' + esc(p.type) + '</td>' +
          '<td class="tmuted">' + (p.beds || '—') + '</td>' +
          '<td><select class="select select--mini" data-status="' + esc(p.id) + '">' +
            ['available', 'pending', 'sold', 'rented'].map(function (s) {
              return '<option value="' + s + '"' + (p.status === s ? ' selected' : '') + '>' +
                s.charAt(0).toUpperCase() + s.slice(1) + '</option>';
            }).join('') + '</select></td>' +
          '<td class="tmuted">' + (p.views || 0) + '</td>' +
          '<td><div class="row-actions">' +
            '<button class="iconbtn' + (p.featured ? ' is-on' : '') + '" data-feature="' + esc(p.id) + '" title="Toggle featured" aria-label="Toggle featured">' + ICONS.star + '</button>' +
            '<button class="iconbtn" data-edit="' + esc(p.id) + '" title="Edit" aria-label="Edit">' + ICONS.edit + '</button>' +
            '<button class="iconbtn" data-delete="' + esc(p.id) + '" title="Delete" aria-label="Delete">' + ICONS.trash + '</button>' +
          '</div></td>' +
        '</tr>';
      }).join('');
    }
    var s = Store.stats();
    var sum = $('#propSummary');
    if (sum) sum.textContent = rows.length + ' of ' + s.total + ' listings shown · ' + s.available + ' available · ' + s.pending + ' under offer';
  }

  // delegates
  var propBody = $('#propTableBody');
  if (propBody) {
    propBody.addEventListener('change', function (e) {
      var sel = e.target.closest('[data-status]');
      if (!sel) return;
      Store.properties.setStatus(sel.getAttribute('data-status'), sel.value);
      toast('Status updated to “' + sel.value + '”.', '');
      renderPropTable(); renderDashboard();
    });
    propBody.addEventListener('click', function (e) {
      var edit = e.target.closest('[data-edit]');
      if (edit) { openPropModal(edit.getAttribute('data-edit')); return; }
      var del = e.target.closest('[data-delete]');
      if (del) {
        var p = Store.properties.get(del.getAttribute('data-delete'));
        confirmBox('Delete this property?', '“' + p.title + '” will be removed from the website immediately.', function () {
          Store.properties.remove(p.id);
          toast('Property deleted.', '');
          renderPropTable(); renderDashboard();
        }, 'Delete');
        return;
      }
      var feat = e.target.closest('[data-feature]');
      if (feat) {
        var pr = Store.properties.toggleFeatured(feat.getAttribute('data-feature'));
        toast(pr.featured ? 'Marked as featured.' : 'Removed from featured.', '');
        renderPropTable(); renderDashboard();
      }
    });
  }

  ['#propSearch', '#propPurposeFilter', '#propStatusFilter', '#propSortFilter'].forEach(function (sel) {
    var el = $(sel);
    if (!el) return;
    el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', function () {
      propFilters.q = $('#propSearch').value;
      propFilters.purpose = $('#propPurposeFilter').value;
      propFilters.status = $('#propStatusFilter').value;
      propFilters.sort = $('#propSortFilter').value;
      renderPropTable();
    });
  });

  var globalSearch = $('#globalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var v = globalSearch.value.trim();
      if (!v) return;
      var enqHit = Store.enquiries.list().filter(function (x) {
        return (x.name + ' ' + x.phone + ' ' + x.message).toLowerCase().indexOf(v.toLowerCase()) > -1;
      });
      if (enqHit.length && !Store.properties.list({ includeAll: true }).some(function (p) {
        return (p.title + ' ' + p.ref + ' ' + p.location).toLowerCase().indexOf(v.toLowerCase()) > -1;
      })) {
        showView('enquiries');
      } else {
        showView('properties');
        $('#propSearch').value = v;
        propFilters.q = v;
        renderPropTable();
      }
      globalSearch.value = '';
    });
  }

  /* ==========================================================================
     PROPERTY EDITOR
     ========================================================================== */
  var IMAGES = [
    'assets/img/p1.jpg', 'assets/img/p2.jpg', 'assets/img/p3.jpg', 'assets/img/p4.jpg',
    'assets/img/p5.jpg', 'assets/img/p6.jpg', 'assets/img/p7.jpg', 'assets/img/p8.jpg',
    'assets/img/hero.jpg', 'assets/img/about.jpg'
  ];

  function openPropModal(id) {
    var form = $('#propForm');
    form.reset();
    $$('#propForm .field--error').forEach(function (f) { f.classList.remove('field--error'); });
    var picker = $('#pfImagePicker');
    picker.innerHTML = IMAGES.map(function (src) {
      return '<button type="button" data-img="' + src + '"><img src="' + src + '" alt=""></button>';
    }).join('');

    var locList = $('#locationList');
    if (locList) {
      var locs = ['Bodija', 'Jericho', 'Akobo', 'Iwo Road', 'Old Ife Road', 'Ring Road', 'Oluyole', 'Alalubosa', 'Eleyele', 'Toll Gate', 'Ido'].concat(Store.properties.locations());
      var uniq = {};
      locList.innerHTML = locs.filter(function (l) { if (uniq[l]) return false; uniq[l] = 1; return true; })
        .map(function (l) { return '<option value="' + esc(l) + '">'; }).join('');
    }

    var p = id ? Store.properties.get(id) : null;
    $('#propModalTitle').textContent = p ? 'Edit ' + p.ref : 'Add property';
    $('#pfId').value = p ? p.id : '';

    if (p) {
      $('#pfTitle').value = p.title;
      $('#pfPurpose').value = p.purpose;
      $('#pfType').value = p.type;
      $('#pfPrice').value = p.price;
      $('#pfPeriod').value = p.period || 'year';
      $('#pfBeds').value = p.beds || 0;
      $('#pfBaths').value = p.baths || 0;
      $('#pfArea').value = p.area || 0;
      $('#pfStatus').value = p.status;
      $('#pfLocation').value = p.location;
      $('#pfAddress').value = p.address || '';
      $('#pfImage').value = p.image;
      $('#pfDescription').value = p.description || '';
      $('#pfFeatures').value = (p.features || []).join('\n');
      $('#pfFeatured').checked = !!p.featured;
    } else {
      $('#pfPurpose').value = 'sale';
      $('#pfType').value = 'Duplex';
      $('#pfStatus').value = 'available';
      $('#pfImage').value = IMAGES[0];
      $('#pfFeatured').checked = false;
      $('#pfBeds').value = 3;
      $('#pfBaths').value = 3;
    }
    syncPropPreview();
    syncPeriodVisibility();
    openModal('#propModal');
    setTimeout(function () { $('#pfTitle').focus(); }, 120);
  }

  function syncPropPreview() {
    var src = $('#pfImage').value.trim() || IMAGES[0];
    $('#pfImagePreview').src = src;
    $$('#pfImagePicker button').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-img') === src);
    });
  }
  function syncPeriodVisibility() {
    var sale = $('#pfPurpose').value === 'sale';
    $('#pfPeriodWrap').style.visibility = sale ? 'hidden' : 'visible';
  }

  var picker = $('#pfImagePicker');
  if (picker) {
    picker.addEventListener('click', function (e) {
      var b = e.target.closest('[data-img]');
      if (!b) return;
      $('#pfImage').value = b.getAttribute('data-img');
      syncPropPreview();
    });
  }
  if ($('#pfImage')) $('#pfImage').addEventListener('input', syncPropPreview);
  if ($('#pfPurpose')) $('#pfPurpose').addEventListener('change', syncPeriodVisibility);

  var propForm = $('#propForm');
  if (propForm) {
    propForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = $('#pfTitle'), price = $('#pfPrice'), loc = $('#pfLocation');
      var ok = true;
      if (!title.value.trim()) { title.closest('.field').classList.add('field--error'); ok = false; }
      if ($('#pfPrice').value === '' || Number($('#pfPrice').value) < 0) { price.closest('.field').classList.add('field--error'); ok = false; }
      if (!loc.value.trim()) { loc.closest('.field').classList.add('field--error'); ok = false; }
      if (!ok) { toast('Please complete the required fields.', 'err'); return; }

      var data = {
        title: title.value.trim(),
        purpose: $('#pfPurpose').value,
        type: $('#pfType').value,
        price: Number($('#pfPrice').value),
        period: $('#pfPurpose').value === 'sale' ? '' : $('#pfPeriod').value,
        beds: Number($('#pfBeds').value) || 0,
        baths: Number($('#pfBaths').value) || 0,
        area: Number($('#pfArea').value) || 0,
        status: $('#pfStatus').value,
        location: loc.value.trim(),
        address: $('#pfAddress').value.trim(),
        image: $('#pfImage').value.trim() || IMAGES[0],
        description: $('#pfDescription').value.trim(),
        features: $('#pfFeatures').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean),
        featured: $('#pfFeatured').checked
      };

      var id = $('#pfId').value;
      if (id) {
        Store.properties.update(id, data);
        toast('Changes saved.', '');
      } else {
        var created = Store.properties.create(data);
        toast('Property added as ' + created.ref + '.', '');
      }
      closeModal('#propModal');
      renderAll();
      if ($('#view-properties').classList.contains('is-on')) renderPropTable();
    });
  }

  $$('#propForm .input, #propForm .select, #propForm .textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      var f = el.closest('.field');
      if (f) f.classList.remove('field--error');
    });
  });

  /* ==========================================================================
     ENQUIRIES
     ========================================================================== */
  var enqFilter = 'all';

  function setEnqFilter(f) {
    enqFilter = f;
    $$('#enqSeg button').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-filter') === f);
    });
    renderEnquiries();
  }

  if ($('#enqSeg')) {
    $('#enqSeg').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-filter]');
      if (b) setEnqFilter(b.getAttribute('data-filter'));
    });
  }

  function renderEnquiries() {
    var all = Store.enquiries.list();
    var list = enqFilter === 'all' ? all : all.filter(function (e) { return e.status === enqFilter; });
    $('#cAll').textContent = all.length;
    $('#cNew').textContent = all.filter(function (e) { return e.status === 'new'; }).length;
    $('#cContacted').textContent = all.filter(function (e) { return e.status === 'contacted'; }).length;
    $('#cClosed').textContent = all.filter(function (e) { return e.status === 'closed'; }).length;

    var grid = $('#enqGrid'), empty = $('#enqEmpty');
    if (!list.length) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    grid.innerHTML = list.map(function (e) {
      return '<article class="enq enq--' + esc(e.status) + '" data-enq="' + esc(e.id) + '">' +
        '<div class="enq__top">' +
          '<span class="avatar">' + esc(initials(e.name)) + '</span>' +
          '<div class="enq__who"><b>' + esc(e.name) + '</b><span>' + esc(e.phone) + (e.email ? ' · ' + esc(e.email) : '') + '</span></div>' +
          '<span style="margin-left:auto">' + statusTag(e.status) + '</span>' +
        '</div>' +
        '<div class="enq__meta">' +
          '<span class="tag tag--muted">' + esc(e.interest) + '</span>' +
          (e.budget ? '<span class="tag tag--muted">' + esc(e.budget) + '</span>' : '') +
          '<span class="tag tag--muted">' + timeAgo(e.createdAt) + '</span>' +
        '</div>' +
        (e.message ? '<div class="enq__msg">' + esc(e.message) + '</div>' : '') +
        (e.propertyTitle ? '<div class="enq__props">Interested in: <b>' + esc(e.propertyTitle) + '</b></div>' : '') +
        (e.notes ? '<div class="enq__notes">Note: ' + esc(e.notes) + '</div>' : '') +
        '<div class="enq__actions">' +
          '<a class="btn btn--ghost btn--xs" href="tel:' + esc(String(e.phone).replace(/\s/g, '')) + '">' + ICONS.phone + ' Call</a>' +
          '<a class="btn btn--ghost btn--xs" target="_blank" rel="noopener" href="https://wa.me/' + esc(waNumber(e.phone)) + '?text=' + encodeURIComponent('Hello ' + e.name + ', this is RB Homes and Property following up on your enquiry.') + '">' + ICONS.whatsapp + ' WhatsApp</a>' +
          '<button class="btn btn--ghost btn--xs" data-enq-view="' + esc(e.id) + '">' + ICONS.eye + ' Details</button>' +
          (e.status !== 'closed'
            ? '<button class="btn btn--ghost btn--xs" data-enq-close="' + esc(e.id) + '">' + ICONS.check + ' Close</button>'
            : '') +
          '<button class="btn btn--danger btn--xs" data-enq-del="' + esc(e.id) + '">' + ICONS.trash + '</button>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function waNumber(phone) {
    var d = String(phone || '').replace(/\D/g, '');
    if (d.indexOf('234') === 0) return d;
    if (d.indexOf('0') === 0) return '234' + d.slice(1);
    return '234' + d;
  }

  var enqGrid = $('#enqGrid');
  if (enqGrid) {
    enqGrid.addEventListener('click', function (e) {
      var view = e.target.closest('[data-enq-view]');
      if (view) { openEnquiry(view.getAttribute('data-enq-view')); return; }
      var close = e.target.closest('[data-enq-close]');
      if (close) {
        Store.enquiries.update(close.getAttribute('data-enq-close'), { status: 'closed' });
        toast('Enquiry marked as closed.', '');
        renderEnquiries(); renderDashboard();
        return;
      }
      var del = e.target.closest('[data-enq-del]');
      if (del) {
        var en = Store.enquiries.get(del.getAttribute('data-enq-del'));
        confirmBox('Delete this enquiry?', 'The record for ' + en.name + ' will be permanently removed.', function () {
          Store.enquiries.remove(en.id);
          toast('Enquiry deleted.', '');
          renderEnquiries(); renderDashboard();
        }, 'Delete');
      }
    });
  }

  var activeEnqId = null;
  function openEnquiry(id) {
    var e = Store.enquiries.get(id);
    if (!e) return;
    activeEnqId = id;
    $('#enqModalBody').innerHTML =
      '<div class="enq__top" style="margin-bottom:14px"><span class="avatar">' + esc(initials(e.name)) + '</span>' +
        '<div class="enq__who"><b>' + esc(e.name) + '</b><span>' + esc(e.interest) + '</span></div>' +
        '<span style="margin-left:auto">' + statusTag(e.status) + '</span></div>' +
      '<div class="feed" style="margin-bottom:16px">' +
        feedRow('Phone', e.phone) +
        (e.email ? feedRow('Email', e.email) : '') +
        (e.budget ? feedRow('Budget', e.budget) : '') +
        feedRow('Received', U.dateLabel(e.createdAt) + ' · ' + timeAgo(e.createdAt)) +
        (e.propertyTitle ? feedRow('Property', e.propertyTitle) : '') +
      '</div>' +
      (e.message ? '<div class="enq__msg" style="margin-bottom:16px">' + esc(e.message) + '</div>' : '') +
      '<div class="field"><label for="enqNote">Internal note</label>' +
        '<textarea class="textarea" id="enqNote" placeholder="e.g. Called, inspection booked for Saturday 10am">' + esc(e.notes || '') + '</textarea></div>' +
      '<div class="field"><label for="enqStatus">Status</label><select class="select" id="enqStatus">' +
        ['new', 'contacted', 'closed'].map(function (s) {
          return '<option value="' + s + '"' + (e.status === s ? ' selected' : '') + '>' + s.charAt(0).toUpperCase() + s.slice(1) + '</option>';
        }).join('') + '</select></div>';
    openModal('#enqModal');
  }
  function feedRow(label, value) {
    return '<div class="feed__item" style="border:0;padding:5px 0"><div style="width:82px;flex:none"><b>' + esc(label) + '</b></div>' +
      '<span style="color:var(--ink);font-size:.86rem">' + esc(value) + '</span></div>';
  }

  if ($('#enqSaveNote')) {
    $('#enqSaveNote').addEventListener('click', function () {
      if (!activeEnqId) return;
      Store.enquiries.update(activeEnqId, {
        notes: $('#enqNote').value.trim(),
        status: $('#enqStatus').value
      });
      closeModal('#enqModal');
      toast('Enquiry updated.', '');
      renderEnquiries(); renderDashboard();
    });
  }

  /* ==========================================================================
     SETTINGS
     ========================================================================== */
  function fillSettings() {
    var s = Store.settings.get();
    Object.keys(s).forEach(function (k) {
      var el = document.getElementById('set' + k.charAt(0).toUpperCase() + k.slice(1));
      if (!el) return;
      if (el.type === 'checkbox') el.checked = !!s[k];
      else el.value = s[k];
    });
  }

  var settingsForm = $('#settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var patch = {};
      ['businessName', 'tagline', 'phone', 'whatsapp', 'email', 'address', 'hours', 'mapsQuery', 'heroHeadline', 'heroSub'].forEach(function (k) {
        var el = $('#set' + k.charAt(0).toUpperCase() + k.slice(1));
        if (el) patch[k] = el.value.trim();
      });
      patch.notifyEmail = $('#setNotify').checked;
      patch.autoReply = $('#setAutoReply').checked;
      Store.settings.save(patch);
      toast('Settings saved. Refresh the website to see them.', '');
      renderDashboard();
    });
  }
  if ($('#resetSettings')) {
    $('#resetSettings').addEventListener('click', function () {
      confirmBox('Reset site settings?', 'Business details on the website will go back to the original values.', function () {
        var s = Store.settings.get();
        Store.settings.save({
          businessName: 'RB Homes and Property', tagline: 'Real Estate Consultants',
          phone: '0816 430 9699', whatsapp: '2348164309699',
          email: 'hello@rbhomesandproperty.ng',
          address: 'Old Ife Rd, LG, opposite Alhiayu Hospital, Ibadan 200113, Oyo',
          hours: 'Open 24 hours, 7 days a week', mapsQuery: '9XR5+H6 Ibadan',
          heroHeadline: 'Find a home in Ibadan you can trust the title on.',
          heroSub: 'RB Homes and Property is a consultancy on Old Ife Road, Ibadan. We handle verified sales, rentals, land and property management — with documents checked before you pay a naira.'
        });
        fillSettings();
        toast('Settings reset.', '');
      }, 'Reset');
    });
  }

  var importFile = $('#importFile');
  if (importFile) {
    importFile.addEventListener('change', function () {
      var file = importFile.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          Store.importJSON(reader.result);
          toast('Backup restored.', '');
          renderAll(); fillSettings(); paintUser();
        } catch (err) {
          toast('Could not restore: ' + err.message, 'err');
        }
        importFile.value = '';
      };
      reader.readAsText(file);
    });
  }

  /* ==========================================================================
     SECURITY
     ========================================================================== */
  function paintSecurity() {
    var u = Store.auth.user();
    var data = JSON.parse(Store.exportJSON());
    var rec = (data.users || []).filter(function (x) { return u && x.username === u.username; })[0];
    $('#secSignedIn').textContent = u ? new Date(u.at).toLocaleString('en-NG') : '—';
    $('#secPwChanged').textContent = rec && rec.passwordChangedAt
      ? U.dateLabel(rec.passwordChangedAt) + ' · ' + timeAgo(rec.passwordChangedAt)
      : 'Never changed from default';
    $('#secCreated').textContent = rec ? U.dateLabel(rec.createdAt) : '—';
  }

  var pwNew = $('#pwNew');
  if (pwNew) {
    pwNew.addEventListener('input', function () {
      var v = pwNew.value;
      var checks = {
        len: v.length >= 8,
        upper: /[A-Z]/.test(v),
        lower: /[a-z]/.test(v),
        num: /[0-9]/.test(v)
      };
      $$('#pwRules li').forEach(function (li) {
        li.classList.toggle('ok', !!checks[li.getAttribute('data-rule')]);
      });
      var st = U.passwordStrength(v);
      var wrap = $('#pwStrength');
      wrap.setAttribute('data-score', st.score);
      $('#pwStrengthLabel').textContent = v ? st.label : 'Password strength';
    });
  }

  var pwForm = $('#pwForm');
  if (pwForm) {
    pwForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var current = $('#pwCurrent').value;
      var next = $('#pwNew').value;
      var confirm = $('#pwConfirm').value;
      var confirmField = $('#pwConfirm').closest('.field');

      if (!current) { toast('Enter your current password.', 'err'); $('#pwCurrent').focus(); return; }
      var issues = U.passwordIssues(next);
      if (issues.length) { toast('New password needs ' + issues.join(', ') + '.', 'err'); $('#pwNew').focus(); return; }
      if (next !== confirm) {
        confirmField.classList.add('field--error');
        toast('The two new passwords do not match.', 'err');
        return;
      }
      confirmField.classList.remove('field--error');

      var btn = pwForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Updating…';
      Store.auth.changePassword(current, next).then(function (res) {
        btn.disabled = false; btn.textContent = 'Update password';
        if (!res.ok) { toast(res.error, 'err'); return; }
        pwForm.reset();
        $$('#pwRules li').forEach(function (li) { li.classList.remove('ok'); });
        $('#pwStrength').setAttribute('data-score', '0');
        $('#pwStrengthLabel').textContent = 'Password strength';
        toast('Password updated successfully. Use the new one next time you sign in.', '');
        paintBanner(); paintSecurity(); renderDashboard();
      });
    });
  }
  if ($('#pwConfirm')) {
    $('#pwConfirm').addEventListener('input', function () {
      $('#pwConfirm').closest('.field').classList.remove('field--error');
    });
  }

  var userForm = $('#userForm');
  if (userForm) {
    userForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nu = $('#newUsername').value.trim();
      var pw = $('#userPw').value;
      var btn = userForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Updating…';
      Store.auth.changeUsername(nu, pw).then(function (res) {
        btn.disabled = false; btn.textContent = 'Update username';
        if (!res.ok) { toast(res.error, 'err'); return; }
        userForm.reset();
        paintUser(); paintSecurity(); renderDashboard();
        toast('Username changed to “' + res.username + '”.', '');
      });
    });
  }

  /* ==========================================================================
     ACTIVITY
     ========================================================================== */
  function renderActivity() {
    var logs = Store.logs.list();
    var host = $('#activityList');
    if (!logs.length) { host.innerHTML = '<p class="tmuted">No activity recorded yet.</p>'; return; }
    host.innerHTML = '<div class="feed">' + logs.map(function (l) {
      return '<div class="feed__item"><span class="feed__dot"></span>' +
        '<div><b>' + esc(l.action) + '</b><span>' + esc(l.detail || '') + (l.who ? ' · ' + esc(l.who) : '') + '</span></div>' +
        '<time>' + U.dateLabel(l.at) + ' · ' + timeAgo(l.at) + '</time></div>';
    }).join('') + '</div>';
  }

  /* ==========================================================================
     ACTIONS / MODALS
     ========================================================================== */
  function handleAction(action) {
    switch (action) {
      case 'new-property':
        showView('properties');
        openPropModal(null);
        break;
      case 'export':
        exportBackup();
        break;
      case 'reset-demo':
        confirmBox('Reload demo data?', 'Your current listings and enquiries will be replaced with the original sample data. The admin account is kept.', function () {
          Store.resetDemo().then(function () {
            toast('Demo data restored.', '');
            renderAll(); fillSettings(); paintUser();
          });
        }, 'Reload');
        break;
      case 'wipe':
        confirmBox('Delete all data?', 'Every listing and enquiry will be permanently deleted from this browser. Download a backup first if you need one.', function () {
          Store.wipeData(true);
          toast('All listings and enquiries deleted.', '');
          renderAll();
        }, 'Delete everything');
        break;
      case 'clear-log':
        confirmBox('Clear the activity log?', 'This only removes the history list — properties and enquiries are untouched.', function () {
          Store.logs.clear();
          renderActivity(); renderDashboard();
          toast('Activity log cleared.', '');
        }, 'Clear');
        break;
      default: break;
    }
  }

  function exportBackup() {
    var blob = new Blob([Store.exportJSON()], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var d = new Date();
    a.href = url;
    a.download = 'rbhomes-backup-' + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    toast('Backup downloaded.', '');
  }

  var confirmCb = null;
  function confirmBox(title, text, cb, yesLabel) {
    $('#confirmTitle').textContent = title;
    $('#confirmText').textContent = text;
    $('#confirmYes').textContent = yesLabel || 'Yes, continue';
    confirmCb = cb;
    openModal('#confirmModal');
  }
  if ($('#confirmYes')) {
    $('#confirmYes').addEventListener('click', function () {
      var cb = confirmCb;
      confirmCb = null;
      closeModal('#confirmModal');
      if (cb) cb();
    });
  }

  function openModal(sel) {
    var m = $(sel);
    if (!m) return;
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(sel) {
    var m = $(sel);
    if (!m) return;
    m.classList.remove('is-open');
    if (!$('.admin-modal.is-open')) document.body.style.overflow = '';
  }
  $$('[data-close-modal]').forEach(function (b) { b.addEventListener('click', function () { closeModal('#propModal'); }); });
  $$('[data-close-confirm]').forEach(function (b) { b.addEventListener('click', function () { closeModal('#confirmModal'); }); });
  $$('[data-close-enq]').forEach(function (b) { b.addEventListener('click', function () { closeModal('#enqModal'); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeModal('#propModal'); closeModal('#confirmModal'); closeModal('#enqModal');
    if (userDropdown) userDropdown.classList.remove('is-open');
  });

  /* ==========================================================================
     BOOT
     ========================================================================== */
  function renderAll() {
    renderDashboard();
    renderPropTable();
    renderEnquiries();
    renderActivity();
  }

  Store.init().then(function () {
    if (!Store.storageOK()) {
      var w = $('#storageWarn');
      if (w) {
        w.className = 'storage-warn';
        w.textContent = 'Storage is blocked in this preview frame, so changes will only last until you reload. Download the folder and open admin.html in a normal browser tab for full persistence.';
      }
    }
    if (Store.auth.isLoggedIn()) {
      enterApp();
    } else {
      // prefill username for convenience
      var lu = $('#loginUser');
      if (lu && !lu.value) lu.value = 'admin';
      setTimeout(function () { var p = $('#loginPass'); if (p) p.focus(); }, 250);
    }
    var y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  });
})();
