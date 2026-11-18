// ===================================================
//  DemoSender — Main Application Logic
//  Matches Reference Design 100%
// ===================================================

var DEFAULT_PRODUCTS = [
  {
    id: 'qr-connect',
    name: 'QR Connect',
    tagline: 'Scan & Connect',
    type: 'qr',
    emoji: '📲',
    demoLink: 'https://yoursite.com/demo/qr-connect',
    message: 'Hello {clientName}! 👋\n\nThank you for your interest. Here is the demo for *QR Connect* - connect your business digitally with just one QR code scan!\n\n🔗 Demo Link: {demoLink}\n\nFeel free to reach out if you have any questions. We would love to help! 😊\n\n- {company}'
  },
  {
    id: 'digital-menu',
    name: 'Digital Menu',
    tagline: 'For restaurants',
    type: 'menu',
    emoji: '🍽️',
    demoLink: 'https://yoursite.com/demo/digital-menu',
    message: 'Hello {clientName}! 👋\n\nThank you for your interest. Here is the demo for *Digital Menu* - no more paper menus, go fully digital!\n\n🔗 Demo Link: {demoLink}\n\nPerfect solution for your restaurant. Let us know if you have any questions! 😊\n\n- {company}'
  },
  {
    id: 'business-website',
    name: 'Business Website',
    tagline: 'Online presence',
    type: 'web',
    emoji: '🌐',
    demoLink: 'https://yoursite.com/demo/business-website',
    message: 'Hello {clientName}! 👋\n\nThank you for your interest. Here is the demo for *Business Website* - take your business online and reach more customers!\n\n🔗 Demo Link: {demoLink}\n\nThe perfect online solution for your business. Feel free to reach out! 😊\n\n- {company}'
  },
  {
    id: 'social-kit',
    name: 'Social Kit',
    tagline: 'Social media tools',
    type: 'social',
    emoji: '📱',
    demoLink: 'https://yoursite.com/demo/social-kit',
    message: 'Hello {clientName}! 👋\n\nThank you for your interest. Here is the demo for *Social Kit* - manage all your social media marketing from one place!\n\n🔗 Demo Link: {demoLink}\n\nBoost your business online presence today! 😊\n\n- {company}'
  }
];

var DEFAULT_SETTINGS = {
  companyName: 'DemoSender',
  appPin: '2026',
  introMsg: 'Hello! We are from {company}. We are sharing an exclusive demo just for you!',
  products: DEFAULT_PRODUCTS
};

var settings = {};
var clients = [];
var selectedProduct = null;

document.addEventListener('DOMContentLoaded', function () {
  try {
    checkAppLock();
  } catch (e) {
    console.error('App lock check error:', e);
  }
  loadData();
  if (!selectedProduct && settings.products && settings.products.length > 0) {
    selectedProduct = settings.products[0];
  }
  renderProductGrid();
  renderDashboard();
  renderSettings();
  updateCountryFlag();
  initFirebaseSync();
  try {
    checkAppLock();
  } catch (e) {}

  // Instant real-time search event listeners
  var searchInput = document.getElementById('dashSearch');
  if (searchInput) {
    searchInput.addEventListener('input', renderDashboard);
    searchInput.addEventListener('search', renderDashboard);
    searchInput.addEventListener('keyup', renderDashboard);
    searchInput.addEventListener('change', renderDashboard);
  }
});

function loadData() {
  try {
    var s = localStorage.getItem('ds_settings');
    var c = localStorage.getItem('ds_clients');
    settings = s ? JSON.parse(s) : JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    clients = c ? JSON.parse(c) : [];
    if (!settings.products || settings.products.length === 0) {
      settings.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    }
  } catch (e) {
    settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    clients = [];
  }
}

function saveData() {
  localStorage.setItem('ds_settings', JSON.stringify(settings));
  localStorage.setItem('ds_clients', JSON.stringify(clients));
}

function switchTab(tabId) {
  document.querySelectorAll('.bnav-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.drawer-link').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach(function (pane) {
    pane.classList.remove('active');
  });
  var target = document.getElementById('tab-' + tabId);
  if (target) target.classList.add('active');

  // Always keep hamburger menu available
  var btnHam = document.getElementById('btnHamburger');
  if (btnHam) btnHam.style.display = 'flex';

  if (tabId === 'dashboard') renderDashboard();
  if (tabId === 'settings') renderSettings();
}

function openDrawer() {
  var overlay = document.getElementById('drawerOverlay');
  var sidebar = document.getElementById('drawerSidebar');
  if (overlay) overlay.classList.add('open');
  if (sidebar) sidebar.classList.add('open');
}

function closeDrawer() {
  var overlay = document.getElementById('drawerOverlay');
  var sidebar = document.getElementById('drawerSidebar');
  if (overlay) overlay.classList.remove('open');
  if (sidebar) sidebar.classList.remove('open');
}

function toggleExtra() {
  var body = document.getElementById('extraBody');
  var caret = document.getElementById('extraCaret');
  if (!body) return;
  var isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  if (caret) caret.classList.toggle('open', !isOpen);
}

function getProductSvg(type) {
  switch (type) {
    case 'qr':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect>' +
        '<rect x="14" y="3" width="7" height="7" rx="1.5"></rect>' +
        '<rect x="3" y="14" width="7" height="7" rx="1.5"></rect>' +
        '<rect x="15" y="15" width="5" height="5" rx="1"></rect>' +
        '</svg>';
    case 'menu':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<path d="M18 2v20M18 8a3 3 0 0 1-3-3V2M6 2v7a3 3 0 0 0 3 3v10M9 2v4"></path>' +
        '</svg>';
    case 'web':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<circle cx="12" cy="12" r="10"></circle>' +
        '<line x1="2" y1="12" x2="22" y2="12"></line>' +
        '<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>' +
        '</svg>';
    case 'social':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect>' +
        '<rect x="14" y="3" width="7" height="7" rx="1.5"></rect>' +
        '<rect x="3" y="14" width="7" height="7" rx="1.5"></rect>' +
        '<rect x="14" y="14" width="7" height="7" rx="1.5"></rect>' +
        '</svg>';
    default:
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect>' +
        '<rect x="14" y="3" width="7" height="7" rx="1.5"></rect>' +
        '<rect x="3" y="14" width="7" height="7" rx="1.5"></rect>' +
        '<rect x="14" y="14" width="7" height="7" rx="1.5"></rect>' +
        '</svg>';
  }
}

function renderProductGrid() {
  var grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '';

  settings.products.forEach(function (p) {
    var isSelected = selectedProduct && selectedProduct.id === p.id;
    var chip = document.createElement('div');
    chip.className = 'product-chip' + (isSelected ? ' selected' : '');

    var iconWrap = document.createElement('div');
    iconWrap.className = 'chip-icon-wrap';
    if (p.type) {
      iconWrap.innerHTML = getProductSvg(p.type);
    } else {
      iconWrap.textContent = p.emoji || '📦';
    }

    var nameEl = document.createElement('div');
    nameEl.className = 'chip-name';
    nameEl.textContent = p.name;

    var tagEl = document.createElement('div');
    tagEl.className = 'chip-tag';
    tagEl.textContent = p.tagline || '';

    chip.appendChild(iconWrap);
    chip.appendChild(nameEl);
    chip.appendChild(tagEl);

    if (isSelected) {
      var check = document.createElement('div');
      check.className = 'chip-check';
      check.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      chip.appendChild(check);
    }

    chip.addEventListener('click', function () {
      selectedProduct = p;
      renderProductGrid();
    });

    grid.appendChild(chip);
  });
}

function buildMessage(clientName, product) {
  var msg = product.message || '';
  msg = msg.split('{demoLink}').join(product.demoLink || '');
  msg = msg.split('{clientName}').join(clientName);
  msg = msg.split('{company}').join(settings.companyName || 'DemoSender');

  var extra = document.getElementById('customMsg');
  var extraVal = extra ? extra.value.trim() : '';
  if (extraVal) {
    msg = msg + '\n\n' + extraVal;
  }
  return msg;
}

function getWhatsAppUrl(fullNumber, message) {
  return 'https://api.whatsapp.com/send?phone=' + fullNumber + '&text=' + encodeURIComponent(message);
}

function handleSendClick(event) {
  var nameEl = document.getElementById('clientName');
  var numEl = document.getElementById('whatsappNumber');
  var ccEl = document.getElementById('countryCode');

  var name = nameEl ? nameEl.value.trim() : '';
  var rawNum = numEl ? numEl.value.trim() : '';
  var cc = ccEl ? ccEl.value : '91';

  var num = rawNum.replace(/\D/g, '');

  if (!name) {
    showToast('⚠️ Please enter the client name!');
    if (nameEl) nameEl.focus();
    if (event) event.preventDefault();
    return false;
  }

  if (!num || num.length < 10) {
    showToast('⚠️ Please enter a 10-digit WhatsApp number!');
    if (numEl) numEl.focus();
    if (event) event.preventDefault();
    return false;
  }

  if (num.startsWith('0')) num = num.substring(1);
  if (cc === '91' && num.length === 12 && num.startsWith('91')) num = num.substring(2);

  if (!selectedProduct && settings.products && settings.products.length > 0) {
    selectedProduct = settings.products[0];
  }
  if (!selectedProduct) {
    showToast('⚠️ Please select a product!');
    if (event) event.preventDefault();
    return false;
  }

  var fullNumber = cc + num;
  var message = buildMessage(name, selectedProduct);
  var waUrl = getWhatsAppUrl(fullNumber, message);

  var btn = document.getElementById('sendBtn');
  if (btn) btn.href = waUrl;

  saveClient(name, num, cc, selectedProduct);
  showToast('🚀 Opening WhatsApp...');

  try {
    var win = window.open(waUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = waUrl;
    }
  } catch (e) {
    window.location.href = waUrl;
  }

  setTimeout(function () {
    if (nameEl) nameEl.value = '';
    if (numEl) numEl.value = '';
    var cm = document.getElementById('customMsg');
    if (cm) cm.value = '';
  }, 400);

  if (event) event.preventDefault();
  return false;
}

function saveClient(name, number, cc, product) {
  loadData();
  var existing = null;
  for (var i = 0; i < clients.length; i++) {
    if (clients[i].number === number && clients[i].cc === cc && (clients[i].name || '').toLowerCase() === name.toLowerCase()) {
      existing = clients[i];
      break;
    }
  }

  var now = new Date().toISOString();
  if (existing) {
    existing.product = product.id;
    existing.sentAt = now;
    saveData();
    if (isFirebaseReady && db) {
      db.collection('clients').doc(existing.id).set(existing).catch(function(e) {
        console.warn('Firebase client update notice:', e);
      });
    }
    renderDashboard();
    return existing.id;
  }

  var id = 'c_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  var newClient = {
    id: id,
    name: name,
    number: number,
    cc: cc,
    product: product.id,
    sentAt: now,
    followup: null,
    followupDone: false
  };
  clients.push(newClient);
  saveData();
  if (isFirebaseReady && db) {
    db.collection('clients').doc(id).set(newClient).catch(function(e) {
      console.warn('Firebase client save notice:', e);
    });
  }
  renderDashboard();
  return id;
}

function renderDashboard() {
  loadData();
  var filterEl = document.getElementById('dashFilter');
  var searchEl = document.getElementById('dashSearch');
  var clearBtn = document.getElementById('dashSearchClear');
  var filter = filterEl ? filterEl.value : 'all';
  var search = searchEl ? searchEl.value.toLowerCase().trim() : '';

  if (clearBtn) {
    clearBtn.style.display = (searchEl && searchEl.value.trim().length > 0) ? 'flex' : 'none';
  }

  var total = clients.length;
  var pending = clients.filter(function (c) { return !c.followupDone && c.followup; }).length;
  var today = todayISO();
  var overdue = clients.filter(function (c) { return c.followup && !c.followupDone && c.followup.date < today; }).length;

  var sTot = document.getElementById('statTotal');
  var sFol = document.getElementById('statFollowups');
  var sOve = document.getElementById('statOverdue');
  if (sTot) sTot.textContent = total;
  if (sFol) sFol.textContent = pending;
  if (sOve) sOve.textContent = overdue;

  var clearBar = document.getElementById('clearBar');
  if (clearBar) {
    clearBar.style.display = total > 0 ? 'flex' : 'none';
  }

  // 1. Filter dropdown (all, pending, done)
  var filtered = clients.slice();
  if (filter === 'pending') filtered = filtered.filter(function (c) { return c.followup && !c.followupDone; });
  if (filter === 'done') filtered = filtered.filter(function (c) { return c.followupDone; });

  // Robust, real-time smart search
  if (search) {
    var searchDigits = search.replace(/\D/g, '');
    filtered = filtered.filter(function (c) {
      if (!c) return false;
      var name = (c.name || c.clientName || '').toLowerCase();
      var num = (c.number || c.phone || '').toLowerCase();
      var numOnly = num.replace(/\D/g, '');
      var cc = String(c.cc || '');
      var fullNum1 = cc + numOnly;
      var fullNum2 = '+' + cc + ' ' + num;
      var fullNum3 = '+' + cc + numOnly;

      var prod = settings.products.find(function (p) { return p.id === c.product; });
      var prodName = prod ? prod.name.toLowerCase() : '';
      var prodTag = prod && prod.tagline ? prod.tagline.toLowerCase() : '';

      // Match name
      if (name.indexOf(search) !== -1) return true;

      // Match initials (e.g. 'RS' for 'Rahul Sharma')
      var initials = name.split(/\s+/).map(function (w) { return w[0] || ''; }).join('').toLowerCase();
      if (initials && initials === search) return true;

      // Match product name, id, or tagline
      if (prodName && prodName.indexOf(search) !== -1) return true;
      if (c.product && c.product.toLowerCase().indexOf(search) !== -1) return true;
      if (prodTag && prodTag.indexOf(search) !== -1) return true;

      // Match formatted phone strings
      if (num.indexOf(search) !== -1) return true;
      if (fullNum1.indexOf(search) !== -1) return true;
      if (fullNum2.toLowerCase().indexOf(search) !== -1) return true;
      if (fullNum3.indexOf(search) !== -1) return true;

      // Match digits-only (even 1 digit or country code digits)
      if (searchDigits.length > 0) {
        if (numOnly.indexOf(searchDigits) !== -1) return true;
        if (fullNum1.indexOf(searchDigits) !== -1) return true;
      }

      // Match followup note if present
      if (c.followup && c.followup.note && c.followup.note.toLowerCase().indexOf(search) !== -1) return true;

      return false;
    });
  }

  var sab = document.getElementById('searchActiveBar');
  if (sab) {
    if (search) {
      sab.className = 'search-active-bar';
      sab.style.display = 'flex';
      sab.innerHTML = '<span>Showing <b>' + filtered.length + '</b> of ' + total + ' clients for \"' + escapeHtml(search) + '\"</span>' +
        '<button type="button" onclick="resetSearch()">Show All</button>';
    } else {
      sab.style.display = 'none';
    }
  }

  filtered.sort(function (a, b) { return new Date(b.sentAt) - new Date(a.sentAt); });

  var list = document.getElementById('clientList');
  if (!list) return;
  list.innerHTML = '';

  if (filtered.length === 0) {
    var emptyBox = document.createElement('div');
    emptyBox.className = 'empty-box';

    if (search) {
      emptyBox.innerHTML =
        '<div style="font-size:38px;margin-bottom:12px;opacity:0.6;">🔍</div>' +
        '<div class="empty-title">No matching clients found</div>' +
        '<div class="empty-desc">No clients match "<b>' + escapeHtml(search) + '</b>".</div>' +
        '<button type="button" class="btn-clear-search" onclick="resetSearch()">✕ Clear Search</button>';
    } else {
      emptyBox.innerHTML =
        '<div class="mailbox-svg">' +
        '<svg viewBox="0 0 160 120" fill="none" style="width:100%;height:100%;">' +
        '<ellipse cx="80" cy="100" rx="56" ry="10" fill="#e5e7eb"></ellipse>' +
        '<rect x="73" y="55" width="14" height="42" rx="2" fill="#374151"></rect>' +
        '<rect x="42" y="25" width="76" height="38" rx="8" fill="#1f2937"></rect>' +
        '<path d="M42 35 C42 25 50 20 62 20 L98 20 C110 20 118 25 118 35 L118 63 L42 63 Z" fill="#4b5563"></path>' +
        '<rect x="66" y="28" width="36" height="24" rx="3" fill="#ffffff"></rect>' +
        '<polygon points="66,28 84,40 102,28" fill="#e5e7eb"></polygon>' +
        '<path d="M66 48 L76 38 M102 48 L92 38" stroke="#d1d5db" stroke-width="1.5"></path>' +
        '<rect x="115" y="32" width="4" height="20" rx="1" fill="#9ca3af"></rect>' +
        '<path d="M119 32 L132 38 L119 44 Z" fill="#ef4444"></path>' +
        '<path d="M136 24 L138 28 L142 30 L138 32 L136 36 L134 32 L130 30 L134 28 Z" fill="#d1d5db"></path>' +
        '<path d="M30 42 L31.5 45 L34.5 46.5 L31.5 48 L30 51 L28.5 48 L25.5 46.5 L28.5 45 Z" fill="#d1d5db"></path>' +
        '<circle cx="108" cy="18" r="2" fill="#d1d5db"></circle>' +
        '</svg>' +
        '</div>' +
        '<div class="empty-title">No clients found</div>' +
        '<div class="empty-desc">Send a demo first to see clients here!</div>';
    }

    list.appendChild(emptyBox);
    return;
  }

  filtered.forEach(function (c) {
    list.appendChild(buildClientCard(c));
  });
}

function buildClientCard(c) {
  var product = settings.products.find(function (p) { return p.id === c.product; });
  var today = todayISO();
  var overdue = c.followup && !c.followupDone && c.followup.date < today;
  var dueToday = c.followup && !c.followupDone && c.followup.date === today;
  var initials = c.name.split(' ').map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase();

  var card = document.createElement('div');
  card.className = 'client-item' + (c.followupDone ? ' done' : overdue ? ' overdue' : '');

  var headRow = document.createElement('div');
  headRow.className = 'ci-head';

  var avatar = document.createElement('div');
  avatar.className = 'ci-avatar';
  avatar.textContent = initials;

  var col = document.createElement('div');
  col.style.flex = '1';
  col.style.minWidth = '0';

  var nameEl = document.createElement('div');
  nameEl.className = 'ci-name';
  nameEl.textContent = c.name;

  var phoneEl = document.createElement('div');
  phoneEl.className = 'ci-phone';
  phoneEl.textContent = '📱 +' + c.cc + ' ' + c.number;

  col.appendChild(nameEl);
  col.appendChild(phoneEl);
  headRow.appendChild(avatar);
  headRow.appendChild(col);

  // Actions wrapper: WhatsApp Remind button + Red trash button
  var actionsWrap = document.createElement('div');
  actionsWrap.className = 'ci-head-actions';

  // Green WhatsApp "Remind" button
  var remindBtn = document.createElement('button');
  remindBtn.type = 'button';
  remindBtn.className = 'ci-remind-btn';
  remindBtn.title = 'Remind ' + (c.name || 'client') + ' on WhatsApp';
  remindBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor">' +
    '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.03C9.36 7.03 9.08 7.1 8.84 7.35C8.6 7.61 7.94 8.22 7.94 9.47C7.94 10.72 8.86 11.93 8.98 12.1C9.11 12.27 10.76 14.88 13.33 15.97C15.47 16.87 15.91 16.69 16.37 16.65C16.83 16.6 17.86 16.03 18.07 15.43C18.28 14.83 18.28 14.32 18.22 14.21C18.15 14.1 17.98 14.04 17.73 13.92C17.48 13.79 16.26 13.2 16.03 13.11C15.81 13.03 15.65 12.98 15.48 13.23C15.31 13.48 14.84 14.04 14.7 14.21C14.55 14.37 14.41 14.39 14.16 14.27C13.91 14.14 12.87 13.8 11.63 12.7C10.67 11.84 10.02 10.78 9.89 10.56C9.77 10.34 9.88 10.22 10 10.1C10.11 9.99 10.24 9.82 10.37 9.68C10.5 9.53 10.54 9.43 10.62 9.26C10.71 9.1 10.67 8.95 10.6 8.82C10.54 8.7 10.07 7.53 9.87 7.05C9.67 6.58 9.48 6.64 9.34 6.64C9.21 6.63 9.06 6.63 8.91 6.63L9.53 7.03Z"/>' +
    '</svg>' +
    '<span>Remind</span>';
  remindBtn.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    sendReminder(c.id);
  };
  actionsWrap.appendChild(remindBtn);

  // Small stylish red trash button
  var trashBtn = document.createElement('button');
  trashBtn.type = 'button';
  trashBtn.className = 'ci-trash-btn';
  trashBtn.title = 'Delete client';
  trashBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="3 6 5 6 21 6"></polyline>' +
    '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>' +
    '<line x1="10" y1="11" x2="10" y2="17"></line>' +
    '<line x1="14" y1="11" x2="14" y2="17"></line>' +
    '</svg>';
  trashBtn.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    confirmAndDeleteClient(c.id, c.name);
  };
  actionsWrap.appendChild(trashBtn);

  headRow.appendChild(actionsWrap);

  var badgesRow = document.createElement('div');
  badgesRow.className = 'ci-badges';

  if (product) {
    var pBadge = document.createElement('span');
    pBadge.className = 'ci-badge b-product';
    pBadge.textContent = (product.emoji || '📦') + ' ' + product.name;
    badgesRow.appendChild(pBadge);
  }

  var dBadge = document.createElement('span');
  dBadge.className = 'ci-badge b-time';
  dBadge.textContent = '🕐 ' + formatDate(c.sentAt);
  badgesRow.appendChild(dBadge);

  if (c.remindedAt) {
    var rBadge = document.createElement('span');
    rBadge.className = 'ci-badge b-reminded';
    rBadge.textContent = '🔔 Reminded ' + formatDate(c.remindedAt);
    badgesRow.appendChild(rBadge);
  }

  if (c.followup && !c.followupDone) {
    var fBadge = document.createElement('span');
    if (overdue) {
      fBadge.className = 'ci-badge b-overdue';
      fBadge.textContent = '🔴 Overdue: ' + formatDateStr(c.followup.date);
    } else if (dueToday) {
      fBadge.className = 'ci-badge b-today';
      fBadge.textContent = '🟡 Follow up today!';
    } else {
      fBadge.className = 'ci-badge b-time';
      fBadge.textContent = '📅 ' + formatDateStr(c.followup.date);
    }
    badgesRow.appendChild(fBadge);
  } else if (c.followupDone) {
    var doneBadge = document.createElement('span');
    doneBadge.className = 'ci-badge b-done';
    doneBadge.textContent = '✅ Follow-up Done';
    badgesRow.appendChild(doneBadge);
  }

  card.appendChild(headRow);
  card.appendChild(badgesRow);
  return card;
}

function confirmAndDeleteClient(clientId, clientName) {
  var conf = prompt("⚠️ Type 'clear' to confirm deleting " + (clientName || "this client") + ":");
  if (!conf || conf.trim().toLowerCase() !== 'clear') {
    showToast("❌ Cancelled! You must type 'clear' to delete.");
    return;
  }
  deleteClient(clientId);
}
window.confirmAndDeleteClient = confirmAndDeleteClient;

function deleteClient(clientId) {
  loadData();
  clients = clients.filter(function (c) {
    if (!c) return false;
    return c.id !== clientId && String(c.id) !== String(clientId);
  });
  saveData();
  if (isFirebaseReady && db) {
    db.collection('clients').doc(clientId).delete().catch(function (e) {
      console.warn('Firebase client delete notice:', e);
    });
  }
  renderDashboard();
  showToast('🗑️ Client deleted');
}
window.deleteClient = deleteClient;

function clearAllClients() {
  if (clients.length === 0) {
    showToast('Dashboard is already empty!');
    return;
  }
  var conf = prompt('⚠️ Type "clear" to delete ALL clients:');
  if (!conf || conf.trim().toLowerCase() !== 'clear') {
    showToast('❌ Cancelled! You must type "clear" to delete.');
    return;
  }
  var toDelete = clients.slice();
  clients = [];
  saveData();
  if (isFirebaseReady && db) {
    toDelete.forEach(function (c) {
      db.collection('clients').doc(c.id).delete().catch(function () {});
    });
  }
  renderDashboard();
  showToast('🗑️ All clients cleared!');
}
window.clearAllClients = clearAllClients;

function renderSettings() {
  var cn = document.getElementById('companyName');
  var im = document.getElementById('introMsg');
  if (cn) cn.value = settings.companyName || '';
  if (im) im.value = settings.introMsg || '';

  renderProductSettingsList();
}

function renderProductSettingsList() {
  var container = document.getElementById('productSettingsList');
  if (!container) return;
  container.innerHTML = '';

  settings.products.forEach(function (p, idx) {
    var topRow = document.createElement('div');
    topRow.className = 'pm-row';

    var emojiBox = document.createElement('div');
    emojiBox.className = 'pm-icon';
    emojiBox.innerHTML = getProductSvg(p.type || 'qr');

    var nameTitle = document.createElement('div');
    nameTitle.className = 'pm-name';
    nameTitle.textContent = 'PRODUCT ' + (idx + 1);

    var rmBtn = document.createElement('button');
    rmBtn.type = 'button';
    rmBtn.className = 'pm-remove-btn';
    rmBtn.innerHTML = '✕ Remove';
    rmBtn.onclick = (function (i) {
      return function () { removeProduct(i); };
    })(idx);

    topRow.appendChild(emojiBox);
    topRow.appendChild(nameTitle);
    topRow.appendChild(rmBtn);
    container.appendChild(topRow);

    var expRow = document.createElement('button');
    expRow.type = 'button';
    expRow.className = 'pm-expand-btn';

    var expIcon = document.createElement('div');
    expIcon.className = 'pm-icon';
    expIcon.innerHTML = getProductSvg(p.type || 'qr');

    var expLabel = document.createElement('div');
    expLabel.className = 'pm-expand-label';
    expLabel.textContent = p.name;

    var chevron = document.createElement('div');
    chevron.innerHTML = '<svg class="pm-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';

    expRow.appendChild(expIcon);
    expRow.appendChild(expLabel);
    expRow.appendChild(chevron);
    container.appendChild(expRow);

    var fieldsBox = document.createElement('div');
    fieldsBox.className = 'pm-fields';

    expRow.onclick = function () {
      fieldsBox.classList.toggle('open');
    };

    var fields = [
      { key: 'name', placeholder: 'Product Name', value: p.name },
      { key: 'tagline', placeholder: 'Tagline (e.g. Scan & Connect)', value: p.tagline },
      { key: 'demoLink', placeholder: 'Demo URL (https://...)', value: p.demoLink },
      { key: 'message', placeholder: 'WhatsApp Message Template', value: p.message, isArea: true }
    ];

    fields.forEach(function (f) {
      var el = f.isArea ? document.createElement('textarea') : document.createElement('input');
      if (!f.isArea) el.type = 'text';
      if (f.isArea) el.rows = 4;
      el.placeholder = f.placeholder;
      el.value = f.value || '';
      el.oninput = (function (i, k, lbl) {
        return function () {
          settings.products[i][k] = this.value;
          if (k === 'name') lbl.textContent = this.value || 'Product';
        };
      })(idx, f.key, expLabel);
      fieldsBox.appendChild(el);
    });

    var hint = document.createElement('div');
    hint.className = 'pm-hint';
    hint.textContent = 'Variables: {clientName}  {demoLink}  {company}';
    fieldsBox.appendChild(hint);

    container.appendChild(fieldsBox);
  });
}

function addProduct() {
  settings.products.push({
    id: 'p_' + Date.now(),
    name: 'New Product',
    tagline: 'Short tagline here',
    type: 'qr',
    emoji: '📲',
    demoLink: 'https://yoursite.com/demo/new',
    message: 'Hello {clientName}! 👋\n\nHere is the demo link: {demoLink}\n\n- {company}'
  });
  renderProductSettingsList();
  showToast('New product added!');
}

function removeProduct(index) {
  if (settings.products.length <= 1) {
    showToast('At least one product is required!');
    return;
  }
  settings.products.splice(index, 1);
  renderProductSettingsList();
  renderProductGrid();
  showToast('Product removed');
}

function saveSettings() {
  var cn = document.getElementById('companyName');
  var im = document.getElementById('introMsg');
  settings.companyName = cn ? cn.value.trim() : 'DemoSender';
  settings.introMsg = im ? im.value.trim() : '';

  saveData();
  if (isFirebaseReady && db) {
    db.collection('settings').doc('config').set(settings).catch(function (e) {
      console.warn('Firebase settings save notice:', e);
    });
  }
  renderProductGrid();
  if (selectedProduct) {
    selectedProduct = settings.products.find(function (p) { return p.id === selectedProduct.id; }) || settings.products[0];
  }
  showToast('✅ Settings saved!');
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(isoStr) {
  if (!isoStr) return '';
  var d = new Date(isoStr);
  var now = new Date();
  var diff = Math.floor((now - d) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return diff + ' min ago';
  var hrs = Math.floor(diff / 60);
  if (hrs < 24) return hrs + ' hours ago';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatDateStr(dateStr) {
  if (!dateStr) return '';
  var parts = dateStr.split('-');
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return parts[2] + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0];
}

function showToast(msg, duration) {
  duration = duration || 2500;
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, duration);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderHistory() { }


function handleSearchInput() {
  var s = document.getElementById('dashSearch');
  var clearBtn = document.getElementById('dashSearchClear');
  if (clearBtn) {
    clearBtn.style.display = (s && s.value.trim().length > 0) ? 'flex' : 'none';
  }
  renderDashboard();
}
window.handleSearchInput = handleSearchInput;

function resetSearch() {
  var s = document.getElementById('dashSearch');
  var clearBtn = document.getElementById('dashSearchClear');
  if (s) {
    s.value = '';
    s.focus();
  }
  if (clearBtn) {
    clearBtn.style.display = 'none';
  }
  renderDashboard();
}
window.resetSearch = resetSearch;

// Multi-tab real-time sync via storage event
window.addEventListener('storage', function (e) {
  if (e.key === 'ds_clients' || e.key === 'ds_settings') {
    loadData();
    renderDashboard();
  }
});


function sendReminder(clientId) {
  var client = clients.find(function (c) { return c && (c.id === clientId || String(c.id) === String(clientId)); });
  if (!client) {
    showToast('⚠️ Client not found!');
    return;
  }

  var product = settings.products.find(function (p) { return p.id === client.product; }) || (settings.products && settings.products[0]);
  var prodName = product ? product.name : 'our demo';
  var demoLink = product && product.demoLink ? product.demoLink : '';
  var company = settings.companyName || 'DemoSender';

  var msg = 'Hello ' + client.name + '! 👋\n\n' +
    'Just following up on the *' + prodName + '* demo we shared with you earlier.\n\n';

  if (demoLink) {
    msg += '🔗 Demo Link: ' + demoLink + '\n\n';
  }

  msg += 'Did you get a chance to check it out? Feel free to reach out if you have any questions or if you would like to get started! 😊\n\n' +
    '- ' + company;

  var cc = String(client.cc || '91').replace(/\D/g, '');
  var num = String(client.number || '').replace(/\D/g, '');
  var fullNumber = cc + num;
  var waUrl = 'https://api.whatsapp.com/send?phone=' + fullNumber + '&text=' + encodeURIComponent(msg);

  // Record remind timestamp
  client.remindedAt = new Date().toISOString();
  saveData();
  if (isFirebaseReady && db) {
    db.collection('clients').doc(client.id).update({
      remindedAt: client.remindedAt
    }).catch(function () {
      db.collection('clients').doc(client.id).set(client).catch(function () {});
    });
  }
  renderDashboard();

  showToast('🚀 Opening WhatsApp Reminder...');
  window.open(waUrl, '_blank');
}
window.sendReminder = sendReminder;


var FLAGS_SVG = {
  '91': '<svg viewBox="0 0 36 24" class="flag-svg"><rect width="36" height="24" rx="2" fill="#fff"/><rect width="36" height="8" fill="#FF9933"/><rect y="16" width="36" height="8" fill="#138808"/><circle cx="18" cy="12" r="3.2" fill="none" stroke="#000080" stroke-width="0.8"/><circle cx="18" cy="12" r="0.8" fill="#000080"/></svg>',
  '1': '<svg viewBox="0 0 36 24" class="flag-svg"><rect width="36" height="24" rx="2" fill="#B22234"/><rect y="2" width="36" height="2" fill="#fff"/><rect y="6" width="36" height="2" fill="#fff"/><rect y="10" width="36" height="2" fill="#fff"/><rect y="14" width="36" height="2" fill="#fff"/><rect y="18" width="36" height="2" fill="#fff"/><rect y="22" width="36" height="2" fill="#fff"/><rect width="14" height="12" rx="1" fill="#3C3B6E"/></svg>',
  '44': '<svg viewBox="0 0 36 24" class="flag-svg"><clipPath id="uk-clip"><rect width="36" height="24" rx="2"/></clipPath><g clip-path="url(#uk-clip)"><rect width="36" height="24" fill="#012169"/><path d="M0 0 L36 24 M36 0 L0 24" stroke="#fff" stroke-width="4"/><path d="M0 0 L36 24 M36 0 L0 24" stroke="#C8102E" stroke-width="2"/><path d="M18 0 v24 M0 12 h36" stroke="#fff" stroke-width="7"/><path d="M18 0 v24 M0 12 h36" stroke="#C8102E" stroke-width="4"/></g></svg>',
  '971': '<svg viewBox="0 0 36 24" class="flag-svg"><rect width="36" height="8" fill="#00732f"/><rect y="8" width="36" height="8" fill="#fff"/><rect y="16" width="36" height="8" fill="#000"/><rect width="9" height="24" rx="1" fill="#f00"/></svg>',
  '61': '<svg viewBox="0 0 36 24" class="flag-svg"><rect width="36" height="24" rx="2" fill="#00008b"/><path d="M0 0h18v12H0z" fill="#012169"/><path d="M0 0l18 12M18 0L0 12" stroke="#fff" stroke-width="2"/><path d="M9 0v12M0 6h18" stroke="#fff" stroke-width="3"/><path d="M9 0v12M0 6h18" stroke="#e4002b" stroke-width="1.5"/><circle cx="27" cy="15" r="1.5" fill="#fff"/></svg>'
};

function updateCountryFlag() {
  var sel = document.getElementById('countryCode');
  var wrap = document.getElementById('countryFlagWrap');
  if (!sel || !wrap) return;
  var val = sel.value || '91';
  wrap.innerHTML = FLAGS_SVG[val] || FLAGS_SVG['91'];
}
window.updateCountryFlag = updateCountryFlag;


// ===================================================
//  Firebase Real-Time Firestore Synchronization
// ===================================================

function updateCloudStatusBadge(isActive) {
  var b = document.getElementById('drawerCloudBadge');
  var t = document.getElementById('drawerCloudText');
  if (b) {
    b.classList.toggle('offline', !isActive);
  }
  if (t) {
    t.textContent = isActive ? 'Firebase Cloud Active' : 'Offline Mode (Local Cache)';
  }
}

function initFirebaseSync() {
  if (typeof isFirebaseReady === 'undefined' || !isFirebaseReady || !db) {
    updateCloudStatusBadge(false);
    return;
  }

  // 1. Real-time Firestore sync for clients collection
  try {
    db.collection('clients').onSnapshot(function (snapshot) {
      var cloudClients = [];
      snapshot.forEach(function (doc) {
        var data = doc.data();
        if (data && data.id) {
          cloudClients.push(data);
        }
      });

      // If cloud has documents, update local state
      if (cloudClients.length > 0) {
        clients = cloudClients;
        localStorage.setItem('ds_clients', JSON.stringify(clients));
        renderDashboard();
      } else if (clients.length > 0 && !snapshot.metadata.fromCache) {
        // Initial migration: upload existing local clients to Firestore!
        clients.forEach(function (c) {
          db.collection('clients').doc(c.id).set(c).catch(function () {});
        });
      }
      updateCloudStatusBadge(true);
    }, function (error) {
      console.warn('Firestore clients listener error (check if Database is created):', error.message);
      updateCloudStatusBadge(false);
    });

    // 2. Real-time Firestore sync for settings
    db.collection('settings').doc('config').onSnapshot(function (doc) {
      if (doc.exists) {
        var cloudSettings = doc.data();
        if (cloudSettings && cloudSettings.products && cloudSettings.products.length > 0) {
          settings = cloudSettings;
          localStorage.setItem('ds_settings', JSON.stringify(settings));
          renderProductGrid();
          renderSettings();
        }
      } else if (!doc.metadata.fromCache) {
        // Initial migration: upload settings to Firestore!
        db.collection('settings').doc('config').set(settings).catch(function () {});
      }
    }, function (error) {
      console.warn('Firestore settings listener notice:', error.message);
    });
  } catch (err) {
    console.warn('initFirebaseSync error:', err);
    updateCloudStatusBadge(false);
  }
}
window.initFirebaseSync = initFirebaseSync;


// ===================================================
//  Security App Lock & PIN System (Default: 2026)
// ===================================================

function getAppPin() {
  if (settings && settings.appPin) {
    return String(settings.appPin).trim();
  }
  return '2026';
}

function isAppLocked() {
  var isAuth = sessionStorage.getItem('ds_authenticated') === 'true';
  var isRemembered = localStorage.getItem('ds_remember_device') === 'true';
  return !isAuth && !isRemembered;
}

function checkAppLock() {
  var overlay = document.getElementById('appLockScreen');
  if (!overlay) return;

  if (isAppLocked()) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    var pinEl = document.getElementById('pinInput');
    if (pinEl) {
      pinEl.value = '';
      setTimeout(function () { pinEl.focus(); }, 150);
    }
  } else {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }
}
window.checkAppLock = checkAppLock;

function handleUnlock(event) {
  if (event) event.preventDefault();

  var pinEl = document.getElementById('pinInput');
  var errEl = document.getElementById('lockError');
  var remEl = document.getElementById('rememberDevice');
  var cardEl = document.querySelector('.lock-card');

  var entered = pinEl ? pinEl.value.trim() : '';
  var targetPin = getAppPin();

  if (entered === targetPin) {
    sessionStorage.setItem('ds_authenticated', 'true');
    if (remEl && remEl.checked) {
      localStorage.setItem('ds_remember_device', 'true');
    }

    if (errEl) errEl.style.display = 'none';

    var overlay = document.getElementById('appLockScreen');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.25s ease';
      setTimeout(function () {
        overlay.style.display = 'none';
        overlay.style.opacity = '1';
        document.body.style.overflow = '';
      }, 250);
    }

    showToast('🔓 Welcome to DemoSender!');
  } else {
    if (errEl) {
      errEl.textContent = '❌ Incorrect PIN. Please try again.';
      errEl.style.display = 'block';
    }
    if (cardEl) {
      cardEl.classList.remove('shake');
      void cardEl.offsetWidth; // trigger reflow
      cardEl.classList.add('shake');
    }
    if (pinEl) {
      pinEl.value = '';
      pinEl.focus();
    }
  }
  return false;
}
window.handleUnlock = handleUnlock;

function togglePinVisibility() {
  var pinEl = document.getElementById('pinInput');
  var eyeSvg = document.getElementById('eyeIcon');
  if (!pinEl) return;

  var isPass = pinEl.type === 'password';
  pinEl.type = isPass ? 'text' : 'password';

  if (eyeSvg) {
    if (isPass) {
      eyeSvg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
    } else {
      eyeSvg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    }
  }
}
window.togglePinVisibility = togglePinVisibility;

function lockAppNow() {
  sessionStorage.removeItem('ds_authenticated');
  localStorage.removeItem('ds_remember_device');
  var overlay = document.getElementById('appLockScreen');
  if (overlay) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  var pinEl = document.getElementById('pinInput');
  var errEl = document.getElementById('lockError');
  if (errEl) errEl.style.display = 'none';
  if (pinEl) {
    pinEl.value = '';
    pinEl.focus();
  }
  showToast('🔒 App locked');
}
window.lockAppNow = lockAppNow;

function changeAppPin() {
  var curEl = document.getElementById('currentPinInput');
  var newEl = document.getElementById('newPinInput');

  var cur = curEl ? curEl.value.trim() : '';
  var nxt = newEl ? newEl.value.trim() : '';
  var actualCur = getAppPin();

  if (cur !== actualCur) {
    showToast('⚠️ Current PIN is incorrect!');
    if (curEl) curEl.focus();
    return;
  }

  if (!nxt || nxt.length < 4) {
    showToast('⚠️ New PIN must be at least 4 digits/characters!');
    if (newEl) newEl.focus();
    return;
  }

  settings.appPin = nxt;
  saveData();

  if (typeof isFirebaseReady !== 'undefined' && isFirebaseReady && db) {
    db.collection('settings').doc('config').set(settings).catch(function () {});
  }

  if (curEl) curEl.value = '';
  if (newEl) newEl.value = '';

  showToast('✅ Security PIN updated to: ' + nxt);
}
window.changeAppPin = changeAppPin;
