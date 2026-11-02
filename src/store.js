/* ==========================================================================
   RB Homes & Property — store.js
   A tiny client-side "database" + auth layer built on localStorage.
   No server, no frameworks. Everything persists in the browser.

   NOTE: this is a front-end demo backend. Passwords are salted + hashed with
   SHA-256 (Web Crypto) before storage, but because everything runs in the
   browser this is NOT equivalent to server-side authentication. For a real
   deployment, move auth + data behind a server/database.
   ========================================================================== */
(function (global) {
  'use strict';

  var DB_KEY = 'rbhomes_db_v2';
  var SESSION_KEY = 'rbhomes_session_v2';

  /* ---------------------------------------------------------------- storage
     Guarded wrappers: sandboxed iframes / private modes can throw on access.
     Falls back to an in-memory store so the demo never crashes.            */
  var memory = {};
  var storageOK = (function () {
    try {
      var k = '__rb_probe__';
      global.localStorage.setItem(k, '1');
      global.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  })();

  function rawGet(k) {
    if (!storageOK) return memory[k] || null;
    try { return global.localStorage.getItem(k); } catch (e) { return memory[k] || null; }
  }
  function rawSet(k, v) {
    memory[k] = v;
    if (!storageOK) return;
    try { global.localStorage.setItem(k, v); } catch (e) { /* quota / blocked */ }
  }
  function rawDel(k) {
    delete memory[k];
    if (!storageOK) return;
    try { global.localStorage.removeItem(k); } catch (e) {}
  }

  /* ------------------------------------------------------------- utilities */
  function uid(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function naira(n, opts) {
    n = Number(n) || 0;
    opts = opts || {};
    if (opts.short) {
      if (n >= 1e9) return '₦' + trim(n / 1e9) + 'B';
      if (n >= 1e6) return '₦' + trim(n / 1e6) + 'M';
      if (n >= 1e3) return '₦' + trim(n / 1e3) + 'k';
      return '₦' + n;
    }
    return '₦' + n.toLocaleString('en-NG', { maximumFractionDigits: 0 });
  }
  function trim(v) {
    var s = (Math.round(v * 10) / 10).toString();
    return s.replace(/\.0$/, '');
  }
  function daysAgo(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }
  function timeAgo(iso) {
    var then = new Date(iso).getTime();
    if (isNaN(then)) return '';
    var s = Math.floor((Date.now() - then) / 1000);
    if (s < 60) return 'just now';
    var m = Math.floor(s / 60);
    if (m < 60) return m + ' min ago';
    var h = Math.floor(m / 60);
    if (h < 24) return h + (h === 1 ? ' hour ago' : ' hours ago');
    var d = Math.floor(h / 24);
    if (d < 30) return d + (d === 1 ? ' day ago' : ' days ago');
    var mo = Math.floor(d / 30);
    if (mo < 12) return mo + (mo === 1 ? ' month ago' : ' months ago');
    return Math.floor(mo / 12) + ' yr ago';
  }
  function dateLabel(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '—';
    return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  /* ---------------------------------------------------------------- seeding */
  function seedProperties() {
    return [
      {
        id: 'prop_1', ref: 'RB-1042', title: '4 Bedroom Detached Duplex with BQ',
        type: 'Duplex', purpose: 'sale', price: 85000000, beds: 4, baths: 5, area: 420,
        location: 'Akobo', address: 'Off Olorunda Abaa, Akobo, Ibadan',
        status: 'available', featured: true, image: 'assets/img/p1.jpg',
        description: 'A well finished four bedroom detached duplex on a quiet street off Olorunda Abaa. The house sits on a full plot with a gate house, boys quarters and space for three cars. Fitted kitchen with granite tops, all rooms en-suite, borehole and overhead tank included. Title: registered deed of assignment with survey plan available for verification.',
        features: ['All rooms en-suite', 'Boys quarters', 'Fitted kitchen', 'Borehole water', 'Paved compound', 'Gated street', 'Ready to move in'],
        createdAt: daysAgo(2), views: 148
      },
      {
        id: 'prop_2', ref: 'RB-1041', title: 'Newly Built 3 Bedroom Apartment',
        type: 'Apartment', purpose: 'rent', price: 1800000, period: 'year',
        beds: 3, baths: 3, area: 160,
        location: 'Old Ife Road', address: 'Off Old Ife Road, opposite Alhiayu Hospital axis, Ibadan',
        status: 'available', featured: true, image: 'assets/img/p2.jpg',
        description: 'First-floor three bedroom apartment in a newly completed block of four. Tiled throughout, POP ceiling, en-suite master, prepaid meter and constant water supply. Walking distance to the office, so inspection can be arranged the same day. Rent is annual and payable to the landlord, with standard agency and legal fees.',
        features: ['Prepaid meter', 'POP ceiling', 'En-suite master', 'Constant water', 'Tiled floors', 'Secure compound'],
        createdAt: daysAgo(4), views: 96
      },
      {
        id: 'prop_3', ref: 'RB-1039', title: '3 Bedroom Bungalow on Half Plot',
        type: 'Bungalow', purpose: 'sale', price: 32000000, beds: 3, baths: 2, area: 250,
        location: 'Eleyele', address: 'Eleyele, near Awotan junction, Ibadan',
        status: 'available', featured: false, image: 'assets/img/p3.jpg',
        description: 'Solid bungalow with a stone coated roof and generous sitting room, ideal for a small family or a retiree. Compound is fenced with a gate and has a small garden at the front. The property has a registered survey and the seller is the original allottee, so the chain of title is clean and short.',
        features: ['Stone coated roof', 'Fenced compound', 'Garden', 'Registered survey', 'Single owner title', 'Street parking'],
        createdAt: daysAgo(7), views: 61
      },
      {
        id: 'prop_4', ref: 'RB-1036', title: 'Serviced Estate Plot — 500sqm',
        type: 'Land', purpose: 'sale', price: 8500000, beds: 0, baths: 0, area: 500,
        location: 'Ido', address: 'Akufo / Ido corridor, Ibadan',
        status: 'available', featured: true, image: 'assets/img/p4.jpg',
        description: 'Dry, well-drained plot inside a gated estate with graded internal roads, drainage and electricity connection already on site. Sold with a deed of assignment, registered survey and a copy of the layout. Estate deed of covenants applies — no commercial building, and building must start within 24 months.',
        features: ['Gated estate', 'Graded roads', 'Electricity on site', 'Registered survey', 'Deed of assignment', 'Dry land'],
        createdAt: daysAgo(9), views: 210
      },
      {
        id: 'prop_5', ref: 'RB-1033', title: '3 Bedroom Terrace with Balcony',
        type: 'Terrace', purpose: 'sale', price: 58000000, beds: 3, baths: 4, area: 210,
        location: 'Oluyole', address: 'Oluyole Estate extension, Ibadan',
        status: 'pending', featured: false, image: 'assets/img/p5.jpg',
        description: 'Modern terrace duplex in a serviced row of six, with a private balcony, fitted wardrobes and a shared generator house. Estate levy covers security and refuse. Currently under offer — enquiries are still welcome and we will let you know if it falls through.',
        features: ['Private balcony', 'Fitted wardrobes', 'Estate security', 'Shared generator', 'Serviced row', 'Visitor parking'],
        createdAt: daysAgo(12), views: 74
      },
      {
        id: 'prop_6', ref: 'RB-1030', title: 'Furnished Short-let — 2 Bedroom Flat',
        type: 'Apartment', purpose: 'shortlet', price: 45000, period: 'night',
        beds: 2, baths: 2, area: 120,
        location: 'Jericho', address: 'Jericho GRA, Ibadan',
        status: 'available', featured: true, image: 'assets/img/p8.jpg',
        description: 'Fully furnished two bedroom short-let in Jericho GRA, suitable for business travel or family visits. Comes with 24-hour power via inverter and generator, air conditioning in all rooms, DSTV, WiFi, washing machine and a daily housekeeping option. Minimum stay is two nights; monthly rates available on request.',
        features: ['24/7 power', 'Air conditioning', 'WiFi & DSTV', 'Housekeeping option', 'Washing machine', 'Secure parking'],
        createdAt: daysAgo(3), views: 132
      },
      {
        id: 'prop_7', ref: 'RB-1028', title: '5 Bedroom Luxury Mansion with Pool',
        type: 'Duplex', purpose: 'sale', price: 265000000, beds: 5, baths: 6, area: 780,
        location: 'Alalubosa', address: 'Alalubosa GRA, Ibadan',
        status: 'available', featured: false, image: 'assets/img/p7.jpg',
        description: 'A statement property in Alalubosa GRA: five bedrooms all en-suite, family lounge, cinema room, outdoor pool, two-room boys quarters and a gate house. Built to a high specification with imported fittings and a smart security system. Certificate of Occupancy available; inspection strictly by appointment.',
        features: ['Swimming pool', 'Cinema room', 'Smart security', 'Gate house', 'Certificate of Occupancy', 'Imported fittings', 'Two-room BQ'],
        createdAt: daysAgo(15), views: 305
      },
      {
        id: 'prop_8', ref: 'RB-1025', title: '2 Bedroom Flat, Serviced Block',
        type: 'Apartment', purpose: 'rent', price: 950000, period: 'year',
        beds: 2, baths: 2, area: 98,
        location: 'Iwo Road', address: 'Off Iwo Road, near NNPC depot, Ibadan',
        status: 'available', featured: false, image: 'assets/img/p6.jpg',
        description: 'Neat two bedroom flat on the first floor of a serviced block with a shared borehole, security man and refuse collection. Good road access and close to Iwo Road transport links. Suitable for a young couple or a single professional. Annual rent, one year minimum.',
        features: ['Serviced block', 'Shared borehole', 'Security man', 'Refuse collection', 'Close to transport'],
        createdAt: daysAgo(18), views: 57
      },
      {
        id: 'prop_9', ref: 'RB-1022', title: '4 Bedroom Semi-Detached Duplex',
        type: 'Duplex', purpose: 'sale', price: 72000000, beds: 4, baths: 4, area: 300,
        location: 'Bodija', address: 'Bodija Estate, Ibadan',
        status: 'sold', featured: false, image: 'assets/img/p1.jpg',
        description: 'Sold in September. A four bedroom semi-detached duplex in Bodija with a spacious living area, fitted kitchen and a paved compound. Kept on the site for reference — similar units come up in this area regularly, so call us if you are looking.',
        features: ['Fitted kitchen', 'Paved compound', 'Spacious living area', 'Close to Bodija market'],
        createdAt: daysAgo(40), views: 188
      },
      {
        id: 'prop_10', ref: 'RB-1019', title: 'Commercial Shop Space — 40sqm',
        type: 'Commercial', purpose: 'rent', price: 650000, period: 'year',
        beds: 0, baths: 1, area: 40,
        location: 'Ring Road', address: 'Ring Road, beside filling station, Ibadan',
        status: 'available', featured: false, image: 'assets/img/p5.jpg',
        description: 'Roadside shop space with good foot traffic on Ring Road, suitable for a boutique, pharmacy or phone accessories business. Roller shutter, tiled floor, toilet at the back and space for signage. Rent is annual with a two-year option to renew at a reviewed rate.',
        features: ['Roadside frontage', 'Roller shutter', 'Tiled floor', 'Toilet', 'Signage space', 'Foot traffic'],
        createdAt: daysAgo(21), views: 43
      }
    ];
  }

  function seedEnquiries() {
    return [
      {
        id: 'enq_seed1', name: 'Adebayo Ogunleye', phone: '08031234567',
        email: 'adebayo.o@example.com', interest: 'Buying a property', budget: '₦60M – ₦150M',
        message: 'I saw the 4 bedroom duplex in Akobo on your site. Can we inspect this Saturday morning?',
        propertyId: 'prop_1', propertyTitle: '4 Bedroom Detached Duplex with BQ',
        status: 'new', notes: '', createdAt: daysAgo(0.3)
      },
      {
        id: 'enq_seed2', name: 'Chiamaka Nwosu', phone: '09065554433',
        email: 'chiamaka@example.com', interest: 'Property management', budget: '',
        message: 'I have a 3 bedroom flat in Akobo that I want to hand over for management. What is your percentage?',
        propertyId: '', propertyTitle: '',
        status: 'contacted', notes: 'Called back — sending management agreement draft.', createdAt: daysAgo(2)
      },
      {
        id: 'enq_seed3', name: 'Ibrahim Yusuf', phone: '07012223344',
        email: '', interest: 'Land / estate plot', budget: '₦3M – ₦15M',
        message: 'Please send me the estate layout for the Ido plots and the payment plan.',
        propertyId: 'prop_4', propertyTitle: 'Serviced Estate Plot — 500sqm',
        status: 'new', notes: '', createdAt: daysAgo(1.2)
      }
    ];
  }

  function seedUsers() {
    /* Default password: Rbhomes@2026 — shown on the login screen.
       The seeded hash is created on first run by ensureSeedAdmin().        */
    return [];
  }

  function defaultSettings() {
    return {
      businessName: 'RB Homes and Property',
      tagline: 'Real Estate Consultants',
      phone: '0816 430 9699',
      whatsapp: '2348164309699',
      email: 'hello@rbhomesandproperty.ng',
      address: 'Old Ife Rd, LG, opposite Alhiayu Hospital, Ibadan 200113, Oyo',
      hours: 'Open 24 hours, 7 days a week',
      mapsQuery: '9XR5+H6 Ibadan',
      heroHeadline: 'Find a home in Ibadan you can trust the title on.',
      heroSub: 'RB Homes and Property is a consultancy on Old Ife Road, Ibadan. We handle verified sales, rentals, land and property management — with documents checked before you pay a naira.',
      notifyEmail: true,
      autoReply: true
    };
  }

  function defaultDB() {
    return {
      version: 2,
      properties: seedProperties(),
      enquiries: seedEnquiries(),
      users: seedUsers(),
      settings: defaultSettings(),
      logs: [{ id: uid('log'), action: 'Store initialised', detail: 'Demo data seeded', who: 'system', at: daysAgo(0.1) }],
      savedIds: [],
      meta: { created: new Date().toISOString(), seeded: true }
    };
  }

  /* ------------------------------------------------------------------ hashing
     SHA-256(salt + password). Falls back to an FNV-1a variant when Web Crypto
     is unavailable (e.g. opened over file://), with a marker in the hash so
     verification always uses the same algorithm that produced it.          */
  function fallbackHash(str) {
    var h1 = 0x811c9dc5, h2 = 0xc2b2ae35;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      h1 ^= c; h1 = (h1 * 0x01000193) >>> 0;
      h2 = ((h2 << 5) + h2 + c) >>> 0;
    }
    var out = h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
    while (out.length < 64) out += (h1 ^ out.length).toString(16).padStart(8, '0').slice(0, 8);
    return 'fnv$' + out.slice(0, 64);
  }

  function hashPassword(password, salt) {
    var input = salt + '::' + password + '::rbhomes';
    if (global.crypto && global.crypto.subtle && global.TextEncoder) {
      return global.crypto.subtle.digest('SHA-256', new global.TextEncoder().encode(input))
        .then(function (buf) {
          return 'sha256$' + Array.prototype.map.call(new Uint8Array(buf), function (b) {
            return b.toString(16).padStart(2, '0');
          }).join('');
        })
        .catch(function () { return fallbackHash(input); });
    }
    return Promise.resolve(fallbackHash(input));
  }

  function randomSalt() {
    var arr = new Uint8Array(12);
    if (global.crypto && global.crypto.getRandomValues) global.crypto.getRandomValues(arr);
    else for (var i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
    return Array.prototype.map.call(arr, function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  /* -------------------------------------------------------------------- API */
  var DB = null;

  function load() {
    var raw = rawGet(DB_KEY);
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.properties) { DB = parsed; return DB; }
      } catch (e) { /* corrupt -> reseed below */ }
    }
    DB = defaultDB();
    persist();
    return DB;
  }
  function persist() { rawSet(DB_KEY, JSON.stringify(DB)); }
  function db() { return DB || load(); }

  /* -------- auth state (session in sessionStorage-ish memory) ------------- */
  var session = null;
  function readSession() {
    var raw;
    try { raw = global.sessionStorage.getItem(SESSION_KEY); } catch (e) { raw = memory[SESSION_KEY] || null; }
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function writeSession(s) {
    session = s;
    var raw = s ? JSON.stringify(s) : '';
    try {
      if (s) global.sessionStorage.setItem(SESSION_KEY, raw);
      else global.sessionStorage.removeItem(SESSION_KEY);
    } catch (e) { memory[SESSION_KEY] = raw; }
  }

  /* -------- password policy ---------------------------------------------- */
  function passwordIssues(pw) {
    var issues = [];
    if (!pw || pw.length < 8) issues.push('at least 8 characters');
    if (!/[A-Z]/.test(pw || '')) issues.push('one uppercase letter');
    if (!/[a-z]/.test(pw || '')) issues.push('one lowercase letter');
    if (!/[0-9]/.test(pw || '')) issues.push('one number');
    return issues;
  }
  function passwordStrength(pw) {
    if (!pw) return { score: 0, label: 'Empty' };
    var score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    score = Math.min(score, 5);
    var labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
    return { score: score, label: labels[score] };
  }

  /* -------- admin seeding ------------------------------------------------ */
  function ensureAdmin() {
    var d = db();
    if (!d.users || !d.users.length) {
      var salt = randomSalt();
      return hashPassword('Rbhomes@2026', salt).then(function (hash) {
        d.users = [{
          id: 'user_admin',
          username: 'admin',
          name: 'RB Admin',
          role: 'Administrator',
          salt: salt,
          hash: hash,
          createdAt: new Date().toISOString(),
          mustChangePassword: true,
          lastLogin: null
        }];
        persist();
        return null;
      });
    }
    return Promise.resolve(null);
  }

  /* -------- activity log ------------------------------------------------- */
  function log(action, detail, who) {
    var d = db();
    d.logs.unshift({ id: uid('log'), action: action, detail: detail || '', who: who || (currentUser() ? currentUser().username : 'visitor'), at: new Date().toISOString() });
    d.logs = d.logs.slice(0, 120);
    persist();
  }

  function currentUser() {
    if (session) return session;
    session = readSession();
    return session;
  }

  var Store = {
    /* ------------------------------------------------------------- lifecycle */
    init: function () { load(); return ensureAdmin(); },
    resetDemo: function () {
      DB = defaultDB();
      persist();
      writeSession(null);
      return ensureAdmin();
    },
    wipeData: function (keepUser) {
      var d = db();
      d.properties = [];
      d.enquiries = [];
      d.logs = [];
      d.savedIds = [];
      if (!keepUser) d.users = [];
      persist();
    },
    exportJSON: function () { return JSON.stringify(db(), null, 2); },
    importJSON: function (text) {
      var parsed = JSON.parse(text);
      if (!parsed || !Array.isArray(parsed.properties)) throw new Error('File does not look like an RB Homes backup.');
      DB = parsed;
      persist();
    },

    /* ---------------------------------------------------------------- props */
    properties: {
      list: function (opts) {
        opts = opts || {};
        var arr = db().properties.slice();
        if (opts.includeAll) return arr.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        return arr.filter(function (p) { return p.status !== 'sold' && p.status !== 'rented'; })
          .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
      },
      get: function (id) {
        return db().properties.filter(function (p) { return p.id === id; })[0] || null;
      },
      create: function (data) {
        var d = db();
        var maxRef = d.properties.reduce(function (m, p) {
          var n = parseInt(String(p.ref || '').replace(/\D/g, ''), 10);
          return isNaN(n) ? m : Math.max(m, n);
        }, 1000);
        var p = {
          id: uid('prop'),
          ref: 'RB-' + (maxRef + 1),
          title: data.title || 'Untitled property',
          type: data.type || 'Apartment',
          purpose: data.purpose || 'sale',
          price: Number(data.price) || 0,
          period: data.purpose === 'sale' ? '' : (data.period || 'year'),
          beds: Number(data.beds) || 0,
          baths: Number(data.baths) || 0,
          area: Number(data.area) || 0,
          location: data.location || '',
          address: data.address || '',
          status: data.status || 'available',
          featured: !!data.featured,
          image: data.image || 'assets/img/p1.jpg',
          description: data.description || '',
          features: data.features || [],
          views: 0,
          createdAt: new Date().toISOString()
        };
        d.properties.unshift(p);
        persist();
        log('Property added', p.ref + ' — ' + p.title);
        return p;
      },
      update: function (id, data) {
        var d = db();
        var p = d.properties.filter(function (x) { return x.id === id; })[0];
        if (!p) return null;
        Object.keys(data).forEach(function (k) {
          if (k === 'id' || k === 'views' || k === 'createdAt') return;
          p[k] = data[k];
        });
        p.price = Number(p.price) || 0;
        p.beds = Number(p.beds) || 0;
        p.baths = Number(p.baths) || 0;
        p.area = Number(p.area) || 0;
        persist();
        log('Property updated', p.ref + ' — ' + p.title);
        return p;
      },
      remove: function (id) {
        var d = db();
        var p = this.get(id);
        d.properties = d.properties.filter(function (x) { return x.id !== id; });
        persist();
        if (p) log('Property deleted', p.ref + ' — ' + p.title);
        return !!p;
      },
      setStatus: function (id, status) {
        return this.update(id, { status: status });
      },
      toggleFeatured: function (id) {
        var p = this.get(id);
        if (!p) return null;
        return this.update(id, { featured: !p.featured });
      },
      bumpView: function (id) {
        var d = db();
        var p = d.properties.filter(function (x) { return x.id === id; })[0];
        if (p) { p.views = (p.views || 0) + 1; persist(); }
      },
      types: function () {
        var seen = {};
        db().properties.forEach(function (p) { if (p.type) seen[p.type] = 1; });
        return Object.keys(seen).sort();
      },
      locations: function () {
        var seen = {};
        db().properties.forEach(function (p) { if (p.location) seen[p.location] = 1; });
        return Object.keys(seen).sort();
      }
    },

    /* --------------------------------------------------------------- saved  */
    saved: {
      list: function () { return (db().savedIds || []).slice(); },
      has: function (id) { return (db().savedIds || []).indexOf(id) > -1; },
      toggle: function (id) {
        var d = db();
        d.savedIds = d.savedIds || [];
        var i = d.savedIds.indexOf(id);
        if (i > -1) d.savedIds.splice(i, 1);
        else d.savedIds.push(id);
        persist();
        return i === -1;
      }
    },

    /* ----------------------------------------------------------- enquiries  */
    enquiries: {
      list: function (filter) {
        var arr = db().enquiries.slice().sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        if (filter && filter !== 'all') arr = arr.filter(function (e) { return e.status === filter; });
        return arr;
      },
      get: function (id) { return db().enquiries.filter(function (e) { return e.id === id; })[0] || null; },
      create: function (data) {
        var d = db();
        var e = {
          id: uid('enq'),
          name: data.name || 'Unnamed',
          phone: data.phone || '',
          email: data.email || '',
          interest: data.interest || 'General enquiry',
          budget: data.budget || '',
          message: data.message || '',
          propertyId: data.propertyId || '',
          propertyTitle: data.propertyTitle || '',
          status: 'new',
          notes: '',
          createdAt: new Date().toISOString()
        };
        d.enquiries.unshift(e);
        persist();
        log('New enquiry', e.name + ' — ' + e.interest);
        return e;
      },
      update: function (id, data) {
        var d = db();
        var e = d.enquiries.filter(function (x) { return x.id === id; })[0];
        if (!e) return null;
        Object.keys(data).forEach(function (k) { e[k] = data[k]; });
        persist();
        if (data.status) log('Enquiry status', e.name + ' → ' + data.status);
        return e;
      },
      remove: function (id) {
        var d = db();
        var e = this.get(id);
        d.enquiries = d.enquiries.filter(function (x) { return x.id !== id; });
        persist();
        if (e) log('Enquiry deleted', e.name);
        return !!e;
      }
    },

    /* ------------------------------------------------------------ settings  */
    settings: {
      get: function () { return clone(db().settings); },
      save: function (patch) {
        var d = db();
        Object.keys(patch || {}).forEach(function (k) { d.settings[k] = patch[k]; });
        persist();
        log('Site settings updated', Object.keys(patch || {}).join(', '));
        return clone(d.settings);
      }
    },

    /* ---------------------------------------------------------------- auth  */
    auth: {
      isLoggedIn: function () {
        var u = currentUser();
        if (!u) return false;
        var exists = db().users.some(function (x) { return x.username === u.username; });
        return exists;
      },
      user: function () { return currentUser(); },
      login: function (username, password) {
        var d = db();
        var u = d.users.filter(function (x) {
          return x.username.toLowerCase() === String(username || '').trim().toLowerCase();
        })[0];
        if (!u) return Promise.resolve({ ok: false, error: 'No account found with that username.' });
        return hashPassword(password, u.salt).then(function (hash) {
          if (hash !== u.hash) return { ok: false, error: 'Incorrect password. Please try again.' };
          u.lastLogin = new Date().toISOString();
          persist();
          writeSession({
            id: u.id, username: u.username, name: u.name, role: u.role,
            mustChangePassword: !!u.mustChangePassword, at: new Date().toISOString()
          });
          log('Signed in', 'Successful login', u.username);
          return { ok: true, user: u, mustChangePassword: !!u.mustChangePassword };
        });
      },
      logout: function () {
        var u = currentUser();
        if (u) log('Signed out', '', u.username);
        writeSession(null);
      },
      verifyPassword: function (password) {
        var u = currentUser();
        if (!u) return Promise.resolve(false);
        var rec = db().users.filter(function (x) { return x.username === u.username; })[0];
        if (!rec) return Promise.resolve(false);
        return hashPassword(password, rec.salt).then(function (h) { return h === rec.hash; });
      },
      changePassword: function (currentPw, newPw) {
        var self = this;
        return self.verifyPassword(currentPw).then(function (ok) {
          if (!ok) return { ok: false, error: 'Your current password is not correct.' };
          var issues = passwordIssues(newPw);
          if (issues.length) return { ok: false, error: 'New password needs ' + issues.join(', ') + '.' };
          return self.verifyPassword(newPw).then(function (same) {
            if (same) return { ok: false, error: 'New password must be different from the current one.' };
            var u = currentUser();
            var d = db();
            var rec = d.users.filter(function (x) { return x.username === u.username; })[0];
            var salt = randomSalt();
            return hashPassword(newPw, salt).then(function (hash) {
              rec.salt = salt;
              rec.hash = hash;
              rec.mustChangePassword = false;
              rec.passwordChangedAt = new Date().toISOString();
              persist();
              u.mustChangePassword = false;
              writeSession(u);
              log('Password changed', 'Admin password updated by user', rec.username);
              return { ok: true };
            });
          });
        });
      },
      changeUsername: function (newUsername, currentPw) {
        var self = this;
        var clean = String(newUsername || '').trim();
        if (!/^[a-zA-Z0-9._-]{3,24}$/.test(clean)) {
          return Promise.resolve({ ok: false, error: 'Username must be 3–24 characters: letters, numbers, dot, dash or underscore.' });
        }
        return self.verifyPassword(currentPw).then(function (ok) {
          if (!ok) return { ok: false, error: 'Enter your current password to change the username.' };
          var d = db();
          var taken = d.users.some(function (x) {
            return x.username.toLowerCase() === clean.toLowerCase() && x.username !== currentUser().username;
          });
          if (taken) return { ok: false, error: 'That username is already taken.' };
          var u = currentUser();
          var rec = d.users.filter(function (x) { return x.username === u.username; })[0];
          var old = rec.username;
          rec.username = clean;
          persist();
          u.username = clean;
          writeSession(u);
          log('Username changed', old + ' → ' + clean, clean);
          return { ok: true, username: clean };
        });
      },
      /* Recovery-key reset. In production this would be an email token issued
         by a server; here it is a fixed demo key so the flow can be shown. */
      resetWithKey: function (username, key, newPw) {
        var RECOVERY_KEY = 'RBH-RESET-2026';
        if (String(key || '').trim() !== RECOVERY_KEY) {
          return Promise.resolve({ ok: false, error: 'That recovery key is not valid.' });
        }
        var issues = passwordIssues(newPw);
        if (issues.length) {
          return Promise.resolve({ ok: false, error: 'New password needs ' + issues.join(', ') + '.' });
        }
        var d = db();
        var rec = d.users.filter(function (x) {
          return x.username.toLowerCase() === String(username || '').trim().toLowerCase();
        })[0];
        if (!rec) return Promise.resolve({ ok: false, error: 'No account found with that username.' });
        var salt = randomSalt();
        return hashPassword(newPw, salt).then(function (hash) {
          rec.salt = salt;
          rec.hash = hash;
          rec.mustChangePassword = false;
          rec.passwordChangedAt = new Date().toISOString();
          persist();
          writeSession(null);
          log('Password reset', 'Reset using recovery key', rec.username);
          return { ok: true };
        });
      },
      displayName: function () {
        var u = currentUser();
        return u ? (u.name || u.username) : '';
      },
      initials: function () {
        var u = currentUser();
        if (!u) return 'AD';
        var src = u.name || u.username || 'A';
        return src.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      }
    },

    /* ----------------------------------------------------------------- logs */
    logs: {
      list: function () { return db().logs.slice(); },
      add: log,
      clear: function () { db().logs = []; persist(); }
    },

    /* ---------------------------------------------------------------- stats */
    stats: function () {
      var d = db();
      var props = d.properties;
      return {
        total: props.length,
        available: props.filter(function (p) { return p.status === 'available'; }).length,
        pending: props.filter(function (p) { return p.status === 'pending'; }).length,
        sold: props.filter(function (p) { return p.status === 'sold' || p.status === 'rented'; }).length,
        featured: props.filter(function (p) { return p.featured; }).length,
        forSale: props.filter(function (p) { return p.purpose === 'sale'; }).length,
        forRent: props.filter(function (p) { return p.purpose === 'rent'; }).length,
        shortlet: props.filter(function (p) { return p.purpose === 'shortlet'; }).length,
        enquiries: d.enquiries.length,
        newEnquiries: d.enquiries.filter(function (e) { return e.status === 'new'; }).length,
        views: props.reduce(function (s, p) { return s + (p.views || 0); }, 0),
        portfolioValue: props.reduce(function (s, p) { return s + (p.purpose === 'sale' ? (p.price || 0) : 0); }, 0),
        saved: (d.savedIds || []).length
      };
    },

    /* -------------------------------------------------------------- helpers */
    util: { uid: uid, naira: naira, esc: esc, timeAgo: timeAgo, dateLabel: dateLabel, passwordIssues: passwordIssues, passwordStrength: passwordStrength, clone: clone },
    storageOK: function () { return storageOK; }
  };

  global.RB = { store: Store };
})(window);
