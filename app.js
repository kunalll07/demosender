// ===================================================
//  DemoSender -- Main Application Logic
//  WhatsApp Demo Sending Tool
// ===================================================

// ===== DEFAULT DATA =====
const DEFAULT_PRODUCTS = [
  {
    id: 'qr-connect',
    emoji: '\uD83D\uDCF2',
    name: 'QR Connect',
    tagline: 'Scan & Connect',
    demoLink: 'https://yoursite.com/demo/qr-connect',
    message: 'Hello {clientName}! \uD83D\uDC4B\n\nThank you for your interest. Here is the demo for *QR Connect* - connect your business digitally with just one QR code scan!\n\n\uD83D\uDD17 Demo Link: {demoLink}\n\nFeel free to reach out if you have any questions. We would love to help! \uD83D\uDE0A\n\n- {company}'
  },
  {
    id: 'digital-menu',
    emoji: '\uD83C\uDF7D\uFE0F',
    name: 'Digital Menu',
    tagline: 'For restaurants',
    demoLink: 'https://yoursite.com/demo/digital-menu',
    message: 'Hello {clientName}! \uD83D\uDC4B\n\nThank you for your interest. Here is the demo for *Digital Menu* - no more paper menus, go fully digital!\n\n\uD83D\uDD17 Demo Link: {demoLink}\n\nPerfect solution for your restaurant. Let us know if you have any questions! \uD83D\uDE0A\n\n- {company}'
  },
  {
    id: 'business-website',
    emoji: '\uD83C\uDF10',
    name: 'Business Website',
    tagline: 'Online presence',
    demoLink: 'https://yoursite.com/demo/business-website',
    message: 'Hello {clientName}! \uD83D\uDC4B\n\nThank you for your interest. Here is the demo for *Business Website* - take your business online and reach more customers!\n\n\uD83D\uDD17 Demo Link: {demoLink}\n\nThe perfect online solution for your business. Feel free to reach out! \uD83D\uDE0A\n\n- {company}'
  },
  {
    id: 'social-kit',
    emoji: '\uD83D\uDCF1',
    name: 'Social Kit',
    tagline: 'Social media tools',
    demoLink: 'https://yoursite.com/demo/social-kit',
    message: 'Hello {clientName}! \uD83D\uDC4B\n\nThank you for your interest. Here is the demo for *Social Kit* - manage all your social media marketing from one place!\n\n\uD83D\uDD17 Demo Link: {demoLink}\n\nBoost your business online presence today! \uD83D\uDE0A\n\n- {company}'
  }
];

const DEFAULT_SETTINGS = {
  companyName: 'DemoSender',
  introMsg: 'Hello! We are from {company}. We are sharing an exclusive demo just for you:',
  products: DEFAULT_PRODUCTS
};

// ===== STATE =====
var settings = {};
var clients = [];
var history = [];
var selectedProduct = null;
var followupTargetId = null;

// ===== INIT =====
  document.addEventListener('DOMContentLoaded', function () {
    loadData();
    setupTabs();
    renderProductGrid();
    renderDashboard();
    renderHistory();
    renderSettings();
    checkReminders();
    updatePreview();
    document.getElementById('clientName').addEventListener('input', updatePreview);
    document.getElementById('customMsg').addEventListener('input', updatePreview);
  });

  // ===== DATA PERSISTENCE =====
  function loadData() {
    try {
      var s = localStorage.getItem('ds_settings');
      var c = localStorage.getItem('ds_clients');
      var h = localStorage.getItem('ds_history');
      settings = s ? JSON.parse(s) : JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      clients = c ? JSON.parse(c) : [];
      history = h ? JSON.parse(h) : [];
      if (!settings.products || settings.products.length === 0) {
        settings.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
      }
    } catch (e) {
      settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      clients = [];
      history = [];
    }
  }

  function saveData() {
    localStorage.setItem('ds_settings', JSON.stringify(settings));
    localStorage.setItem('ds_clients', JSON.stringify(clients));
    localStorage.setItem('ds_history', JSON.stringify(history));
  }

  // ===== TABS =====
  function setupTabs() {
        var buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(function (btn) {
          btn.addEventListener('click', function () {
            var tab = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
            document.querySelectorAll('.tab-content').forEach(function (c) { c.classList.remove('active'); });
            btn.classList.add('active');
            document.getElementById('tab-' + tab).classList.add('active');
            if (tab === 'dashboard') renderDashboard();
            if (tab === 'history') renderHistory();
            if (tab === 'settings') renderSettings();
          });
        });
      }

// ===== PRODUCT GRID =====
function renderProductGrid() {
          var grid = document.getElementById('productGrid');
          grid.innerHTML = '';
            settings.products.forEach(function (p) {
              var div = document.createElement('div');
              div.className = 'product-chip' + (selectedProduct && selectedProduct.id === p.id ? ' selected' : '');

              var emojiSpan = document.createElement('span');
              emojiSpan.className = 'product-emoji';
              emojiSpan.textContent = p.emoji;

              var nameSpan = document.createElement('span');
              nameSpan.className = 'product-name';
              nameSpan.textContent = p.name;

              var taglineSpan = document.createElement('span');
              taglineSpan.className = 'product-tagline';
              taglineSpan.textContent = p.tagline;

              div.appendChild(emojiSpan);
              div.appendChild(nameSpan);
              div.appendChild(taglineSpan);

              div.addEventListener('click', function () { selectProduct(p.id); });
              grid.appendChild(div);
            });
          }

function selectProduct(id) {
              selectedProduct = settings.products.find(function (p) { return p.id === id; }) || null;
              renderProductGrid();
              updatePreview();
            }

// ===== MESSAGE PREVIEW =====
function updatePreview() {
              var nameEl = document.getElementById('clientName');
              var name = nameEl ? nameEl.value.trim() : '';
              if (!name) name = 'Valued Customer';

              var preview = document.getElementById('sendPreview');
              var previewText = document.getElementById('previewText');

              if (!selectedProduct) {
                preview.style.display = 'none';
                return;
              }

              var msg = buildMessage(name, selectedProduct);
              previewText.textContent = msg;
              preview.style.display = 'block';
            }

function buildMessage(clientName, product) {
              var msg = product.message || '';
              msg = msg.split('{demoLink}').join(product.demoLink || '');
              msg = msg.split('{clientName}').join(clientName);
              msg = msg.split('{company}').join(settings.companyName || 'Our Company');

              var extraEl = document.getElementById('customMsg');
              var extra = extraEl ? extraEl.value.trim() : '';
              if (extra) msg = msg + '\n\n' + extra;

              return msg;
            }

// ===== SEND DEMO =====
function sendDemo() {
              var name = document.getElementById('clientName').value.trim();
              var cc = document.getElementById('countryCode').value;
              var num = document.getElementById('whatsappNumber').value.trim().replace(/\D/g, '');

              if (!name) { showToast('Please enter the client name!'); return; }
              if (!num || num.length < 10) { showToast('Please enter a valid WhatsApp number!'); return; }
              if (!selectedProduct) { showToast('Please select a product!'); return; }

              var fullNumber = cc + num;
              var message = buildMessage(name, selectedProduct);
              var waUrl = 'https://wa.me/' + fullNumber + '?text=' + encodeURIComponent(message);

              var clientId = saveClient(name, num, cc, selectedProduct);
              saveHistory(clientId, name, fullNumber, selectedProduct);

              showToast('Opening WhatsApp...');
              setTimeout(function () { window.open(waUrl, '_blank'); }, 300);

                setTimeout(function () {
                  document.getElementById('clientName').value = '';
                  document.getElementById('whatsappNumber').value = '';
                  document.getElementById('customMsg').value = '';
                  selectedProduct = null;
                  renderProductGrid();
                  updatePreview();
                }, 600);
              }

function saveClient(name, number, cc, product) {
                  var existing = null;
                  for (var i = 0; i < clients.length; i++) {
                    if (clients[i].number === number && clients[i].cc === cc) {
                      existing = clients[i];
                      break;
                    }
                  }
                  var now = new Date().toISOString();

                  if (existing) {
                    existing.product = product.id;
                    existing.sentAt = now;
                    saveData();
                    return existing.id;
                  }

                  var id = 'c_' + Date.now();
                  clients.push({ id: id, name: name, number: number, cc: cc, product: product.id, sentAt: now, followup: null, followupDone: false });
                  saveData();
                  return id;
                }

function saveHistory(clientId, name, fullNumber, product) {
                  history.unshift({
                    id: 'h_' + Date.now(),
                    clientId: clientId,
                    clientName: name,
                    number: fullNumber,
                    product: product.id,
                    sentAt: new Date().toISOString()
                  });
                  if (history.length > 200) history = history.slice(0, 200);
                  saveData();
                }

// ===== DASHBOARD =====
function renderDashboard() {
                  var filterEl = document.getElementById('dashFilter');
                  var searchEl = document.getElementById('dashSearch');
                  var filter = filterEl ? filterEl.value : 'all';
                  var search = searchEl ? searchEl.value.toLowerCase() : '';

                  var total = clients.length;
                  var pending = clients.filter(function (c) { return !c.followupDone && c.followup; }).length;
                  var todayStr = todayISO();
                  var overdue = clients.filter(function (c) { return c.followup && !c.followupDone && c.followup.date < todayStr; }).length;

                  // Build stats using DOM methods -- no innerHTML with HTML strings
                  var statsRow = document.getElementById('statsRow');
                  statsRow.innerHTML = '';

                  var statsData = [
                    { number: total, label: 'Total Clients', color: 'var(--primary)' },
                    { number: pending, label: 'Follow-ups', color: 'var(--warning)' },
                    { number: overdue, label: 'Overdue', color: 'var(--danger)' }
                  ];

                    statsData.forEach(function (s) {
                      var card = document.createElement('div');
                      card.className = 'stat-card';

                      var num = document.createElement('div');
                      num.className = 'stat-number';
                      num.style.color = s.color;
                      num.textContent = s.number;

                      var lbl = document.createElement('div');
                      lbl.className = 'stat-label';
                      lbl.textContent = s.label;

                      card.appendChild(num);
                      card.appendChild(lbl);
                      statsRow.appendChild(card);
                    });

                    // Filter clients
                    var filtered = clients.slice();
                    if (filter === 'pending') filtered = filtered.filter(function (c) { return c.followup && !c.followupDone; });
                    if (filter === 'done') filtered = filtered.filter(function (c) { return c.followupDone; });
                    if (search) filtered = filtered.filter(function (c) {
                      return c.name.toLowerCase().indexOf(search) !== -1 || c.number.indexOf(search) !== -1;
                    });

                    filtered.sort(function (a, b) {
                      var aOver = isOverdue(a), bOver = isOverdue(b);
                      if (aOver && !bOver) return -1;
                      if (!aOver && bOver) return 1;
                      return new Date(b.sentAt) - new Date(a.sentAt);
                    });

                    var list = document.getElementById('clientList');
                    list.innerHTML = '';

                    if (filtered.length === 0) {
                      var empty = document.createElement('div');
                      empty.className = 'empty-state';
                      empty.innerHTML = '<div class="empty-icon">\uD83D\uDCED</div><p>No clients found</p><small>Send a demo first to see clients here!</small>';
                      list.appendChild(empty);
                      return;
                    }

                    filtered.forEach(function (c) {
                      var card = buildClientCard(c);
                      list.appendChild(card);
                    });
                  }

                      function buildClientCard(c) {
                        var product = settings.products.find(function (p) { return p.id === c.product; });
                        var overdue = isOverdue(c);
                        var dueToday = isDueToday(c);
                        var initials = c.name.split(' ').map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase();

                        var cardClass = 'client-card';
                        if (c.followupDone) cardClass += ' done';
                        else if (overdue) cardClass += ' overdue';
                        else if (dueToday) cardClass += ' due-today';

                        var card = document.createElement('div');
                        card.className = cardClass;
                        card.id = 'cc-' + c.id;

                        // Top row
                        var top = document.createElement('div');
                        top.className = 'client-top';

                        var avatar = document.createElement('div');
                        avatar.className = 'client-avatar';
                        avatar.textContent = initials;

                        var info = document.createElement('div');
                        info.className = 'client-info';

                        var nameDiv = document.createElement('div');
                        nameDiv.className = 'client-name';
                        nameDiv.textContent = c.name;

                        var numDiv = document.createElement('div');
                        numDiv.className = 'client-number';
                        numDiv.textContent = '\uD83D\uDCF1 +' + c.cc + ' ' + c.number;

                        info.appendChild(nameDiv);
                        info.appendChild(numDiv);
                        top.appendChild(avatar);
                        top.appendChild(info);

                        // Meta badges
                        var meta = document.createElement('div');
                        meta.className = 'client-meta';

                        if (product) {
                          var prodBadge = document.createElement('span');
                          prodBadge.className = 'badge badge-product';
                          prodBadge.textContent = product.emoji + ' ' + product.name;
                          meta.appendChild(prodBadge);
                        }

                        var dateBadge = document.createElement('span');
                        dateBadge.className = 'badge badge-date';
                        dateBadge.textContent = '\uD83D\uDD50 ' + formatDate(c.sentAt);
                        meta.appendChild(dateBadge);

                        if (c.followup && !c.followupDone) {
                          var fBadge = document.createElement('span');
                          if (overdue) {
                            fBadge.className = 'badge badge-overdue';
                            fBadge.textContent = '\uD83D\uDD34 Overdue: ' + formatDateStr(c.followup.date);
                          } else if (dueToday) {
                            fBadge.className = 'badge badge-today';
                            fBadge.textContent = '\uD83D\uDFE1 Follow up today!';
                          } else {
                            fBadge.className = 'badge badge-date';
                            fBadge.textContent = '\uD83D\uDCC5 ' + formatDateStr(c.followup.date);
                          }
                          meta.appendChild(fBadge);
                        } else if (c.followupDone) {
                          var doneBadge = document.createElement('span');
                          doneBadge.className = 'badge badge-done';
                          doneBadge.textContent = '\u2705 Follow-up Done';
                          meta.appendChild(doneBadge);
                        }

                        if (c.followup && c.followup.note) {
                          var noteBadge = document.createElement('span');
                          noteBadge.className = 'badge badge-date';
                          noteBadge.textContent = '\uD83D\uDCDD ' + c.followup.note;
                          meta.appendChild(noteBadge);
                        }

                        // Action buttons
                        var actions = document.createElement('div');
                        actions.className = 'client-actions';

                        var resendBtn = document.createElement('button');
                        resendBtn.className = 'action-btn btn-resend';
                        resendBtn.textContent = '\uD83D\uDCE4 Resend';
                        resendBtn.onclick = function () { resendDemo(c.id); };

                        var followBtn = document.createElement('button');
                        followBtn.className = 'action-btn btn-followup';
                        followBtn.textContent = '\uD83D\uDCC5 Follow-up';
                        followBtn.onclick = function () { openFollowup(c.id); };

                        var delBtn = document.createElement('button');
                        delBtn.className = 'action-btn btn-delete';
                        delBtn.textContent = '\uD83D\uDDD1\uFE0F';
                        delBtn.onclick = function () { deleteClient(c.id); };

                        actions.appendChild(resendBtn);
                        actions.appendChild(followBtn);

                        if (!c.followupDone && c.followup) {
                          var doneBtn = document.createElement('button');
                          doneBtn.className = 'action-btn btn-done';
                          doneBtn.textContent = '\u2705 Done';
                          doneBtn.onclick = function () { markFollowupDone(c.id); };
                          actions.appendChild(doneBtn);
                        }

                        actions.appendChild(delBtn);

                        card.appendChild(top);
                        card.appendChild(meta);
                        card.appendChild(actions);

                        return card;
                      }

                      // ===== HISTORY =====
                      function renderHistory() {
                        var searchEl = document.getElementById('historySearch');
                        var prodEl = document.getElementById('historyProduct');
                        var search = searchEl ? searchEl.value.toLowerCase() : '';
                        var prodFilter = prodEl ? prodEl.value : 'all';

                          // Populate product dropdown
                          var currentVal = prodEl ? prodEl.value : 'all';
                          prodEl.innerHTML = '';
                          var allOpt = document.createElement('option');
                          allOpt.value = 'all';
                          allOpt.textContent = 'All Products';
                          prodEl.appendChild(allOpt);

                          settings.products.forEach(function (p) {
                            var opt = document.createElement('option');
                            opt.value = p.id;
                            opt.textContent = p.emoji + ' ' + p.name;
                            if (opt.value === currentVal) opt.selected = true;
                            prodEl.appendChild(opt);
                          });

                          var filtered = history.slice();
                          if (prodFilter !== 'all') filtered = filtered.filter(function (h) { return h.product === prodFilter; });
                          if (search) filtered = filtered.filter(function (h) {
                            return h.clientName.toLowerCase().indexOf(search) !== -1 || h.number.indexOf(search) !== -1;
                          });

                          var list = document.getElementById('historyList');
                          list.innerHTML = '';

                          if (filtered.length === 0) {
                            var empty = document.createElement('div');
                            empty.className = 'empty-state';
                            empty.innerHTML = '<div class="empty-icon">\uD83D\uDCDC</div><p>No history yet</p><small>Sent demos will appear here</small>';
                            list.appendChild(empty);
                            return;
                          }

                          filtered.forEach(function (h) {
                            var product = settings.products.find(function (p) { return p.id === h.product; });

                            var item = document.createElement('div');
                            item.className = 'history-item';

                            var icon = document.createElement('div');
                            icon.className = 'history-product-icon';
                            icon.textContent = product ? product.emoji : '\uD83D\uDCE6';

                            var info = document.createElement('div');
                            info.className = 'history-info';

                            var hName = document.createElement('div');
                            hName.className = 'history-name';
                            hName.textContent = h.clientName;

                            var hDetails = document.createElement('div');
                            hDetails.className = 'history-details';
                            hDetails.textContent = '\uD83D\uDCF1 +' + h.number + ' \u00B7 ' + formatDate(h.sentAt);

                            var hProduct = document.createElement('div');
                            hProduct.className = 'history-product-name';
                            hProduct.textContent = product ? product.name : h.product;

                            info.appendChild(hName);
                            info.appendChild(hDetails);
                            info.appendChild(hProduct);

                            var resendBtn = document.createElement('button');
                            resendBtn.className = 'history-resend';
                            resendBtn.title = 'Resend';
                            resendBtn.textContent = '\uD83D\uDCE4';
                            resendBtn.onclick = (function (hid) {
                              return function () { resendDemoByHistory(hid); };
                            })(h.id);

                            item.appendChild(icon);
                            item.appendChild(info);
                            item.appendChild(resendBtn);
                            list.appendChild(item);
                          });
                        }

// ===== FOLLOW-UP =====
function openFollowup(clientId) {
                            followupTargetId = clientId;
                            var c = clients.find(function (cl) { return cl.id === clientId; });
                            document.getElementById('followupClientName').textContent = '\uD83D\uDC64 ' + c.name;
                            document.getElementById('followupDate').value = c.followup ? c.followup.date : '';
                            document.getElementById('followupNote').value = c.followup ? c.followup.note : '';
                            document.getElementById('followupModal').style.display = 'flex';
                          }

function saveFollowup() {
                            var date = document.getElementById('followupDate').value;
                            var note = document.getElementById('followupNote').value.trim();
                            if (!date) { showToast('Please select a date!'); return; }

                            var c = clients.find(function (cl) { return cl.id === followupTargetId; });
                            if (c) {
                              c.followup = { date: date, note: note };
                              c.followupDone = false;
                              saveData();
                              renderDashboard();
                              showToast('Follow-up reminder set!');
                            }
                            closeModal();
                          }

function markFollowupDone(clientId) {
                            var c = clients.find(function (cl) { return cl.id === clientId; });
                            if (c) {
                              c.followupDone = true;
                              saveData();
                              renderDashboard();
                              showToast('Follow-up marked as done!');
                            }
                          }

function closeModal() {
                            document.getElementById('followupModal').style.display = 'none';
                            followupTargetId = null;
                          }

                            document.addEventListener('DOMContentLoaded', function () {
                              document.getElementById('followupModal').addEventListener('click', function (e) {
                                if (e.target === e.currentTarget) closeModal();
                              });
                            });

                            // ===== RESEND =====
                            function resendDemo(clientId) {
                              var c = clients.find(function (cl) { return cl.id === clientId; });
                              if (!c) return;
                              var product = settings.products.find(function (p) { return p.id === c.product; });
                              if (!product) { showToast('Product not found!'); return; }

                              var message = buildMessage(c.name, product);
                              var fullNumber = c.cc + c.number;
                              var waUrl = 'https://wa.me/' + fullNumber + '?text=' + encodeURIComponent(message);

                              saveHistory(clientId, c.name, fullNumber, product);
                              c.sentAt = new Date().toISOString();
                              saveData();

                              showToast('Opening WhatsApp...');
                              setTimeout(function () { window.open(waUrl, '_blank'); }, 300);
                            }

                            function resendDemoByHistory(historyId) {
                              var h = history.find(function (item) { return item.id === historyId; });
                              if (!h) return;
                              var product = settings.products.find(function (p) { return p.id === h.product; });
                              if (!product) { showToast('Product not found!'); return; }

                              var message = buildMessage(h.clientName, product);
                              var waUrl = 'https://wa.me/' + h.number + '?text=' + encodeURIComponent(message);
                              showToast('Opening WhatsApp...');
                              setTimeout(function () { window.open(waUrl, '_blank'); }, 300);
                            }

                            // ===== DELETE =====
                            function deleteClient(clientId) {
                              if (!confirm('Are you sure you want to delete this client?')) return;
                              clients = clients.filter(function (c) { return c.id !== clientId; });
                              history = history.filter(function (h) { return h.clientId !== clientId; });
                              saveData();
                              renderDashboard();
                              showToast('Client deleted');
                            }

                            // ===== SETTINGS =====
                            function renderSettings() {
                              document.getElementById('companyName').value = settings.companyName || '';
                              document.getElementById('introMsg').value = settings.introMsg || '';
                              renderProductSettings();
                            }

                            function renderProductSettings() {
                            var container = document.getElementById('productSettings');
                            container.innerHTML = '';

                              settings.products.forEach(function (p, i) {
                                var card = document.createElement('div');
                                card.className = 'product-setting-card';

                                var header = document.createElement('div');
                                header.className = 'product-setting-header';

                                var label = document.createElement('span');
                                label.textContent = p.emoji + ' Product ' + (i + 1);

                                var removeBtn = document.createElement('button');
                                removeBtn.className = 'remove-product-btn';
                                removeBtn.textContent = '\u2715 Remove';
                                removeBtn.onclick = (function (idx) { return function () { removeProduct(idx); }; })(i);

                                header.appendChild(label);
                                header.appendChild(removeBtn);
                                card.appendChild(header);

                                var fields = [
                                  { placeholder: 'Emoji', key: 'emoji' },
                                  { placeholder: 'Product name', key: 'name' },
                                  { placeholder: 'Short tagline', key: 'tagline' },
                                  { placeholder: 'Demo Link (https://...)', key: 'demoLink' },
                                  { placeholder: 'WhatsApp Message Template', key: 'message' }
                                ];

                                fields.forEach(function (f) {
                                  var inp = document.createElement('input');
                                  inp.type = 'text';
                                  inp.placeholder = f.placeholder;
                                  inp.value = p[f.key] || '';
                                  inp.style.marginBottom = '8px';
                                  inp.oninput = (function (idx, key) {
                                    return function () { settings.products[idx][key] = this.value; };
                                  })(i, f.key);
                                  card.appendChild(inp);
                                });

                                var hint = document.createElement('small');
                                hint.style.cssText = 'color:var(--text-muted);font-size:11px;display:block;margin-top:4px';
                                hint.textContent = 'Variables: {demoLink}  {clientName}  {company}';
                                card.appendChild(hint);

                                container.appendChild(card);
                              });
                            }

                            function addProduct() {
                              settings.products.push({
                                id: 'p_' + Date.now(),
                                emoji: '\uD83C\uDD95',
                                name: 'New Product',
                                tagline: 'Short description here',
                                demoLink: 'https://yoursite.com/demo/new-product',
    message: 'Hello {clientName}! \uD83D\uDC4B\n\nHere is the demo for our latest product!\n\n\uD83D\uDD17 Demo: {demoLink}\n\nFeel free to reach out! \uD83D\uDE0A\n\n- {company}'
                              });
                              renderProductSettings();
                              showToast('New product added!');
                            }

                            function removeProduct(index) {
                              if (settings.products.length <= 1) { showToast('At least one product is required!'); return; }
                              if (!confirm('Remove this product?')) return;
                              settings.products.splice(index, 1);
                              renderProductSettings();
                              showToast('Product removed');
                            }

                            function saveSettings() {
                              settings.companyName = document.getElementById('companyName').value.trim();
                              settings.introMsg = document.getElementById('introMsg').value.trim();
                              saveData();
                              renderProductGrid();
                              if (selectedProduct) {
                                selectedProduct = settings.products.find(function (p) { return p.id === selectedProduct.id; }) || null;
                              }
                              showToast('Settings saved!');
                            }

                            // ===== REMINDERS =====
                            function checkReminders() {
                              var todayStr = todayISO();
                              var overdueClients = clients.filter(function (c) {
                                return c.followup && !c.followupDone && c.followup.date <= todayStr;
                              });
                              if (overdueClients.length > 0) {
                                var text = overdueClients.length === 1
                                  ? 'Follow-up pending for ' + overdueClients[0].name + '!'
                                  : overdueClients.length + ' follow-ups are pending!';
                                document.getElementById('reminderText').textContent = '\u26A0\uFE0F ' + text;
                                document.getElementById('reminderBanner').style.display = 'flex';
                              }
                            }

                            function dismissReminder() {
                              document.getElementById('reminderBanner').style.display = 'none';
                            }

                            // ===== EXPORT / IMPORT =====
                            function exportData() {
                              var data = { settings: settings, clients: clients, history: history, exportedAt: new Date().toISOString() };
                              var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                              var url = URL.createObjectURL(blob);
                              var a = document.createElement('a');
                              a.href = url;
                              a.download = 'demosender-backup-' + todayISO() + '.json';
                              a.click();
                              URL.revokeObjectURL(url);
                              showToast('Data exported!');
                            }

                            function importDataClick() {
                              document.getElementById('importFile').click();
                            }

                            function importData(event) {
                              var file = event.target.files[0];
                              if (!file) return;
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                  try {
                                    var data = JSON.parse(e.target.result);
                                    if (data.settings) settings = data.settings;
                                    if (data.clients) clients = data.clients;
                                    if (data.history) history = data.history;
                                    saveData();
                                    renderSettings();
                                    renderProductGrid();
                                    renderDashboard();
                                    renderHistory();
                                    showToast('Data imported successfully!');
                                  } catch (err) {
                                    showToast('Invalid file! Please use a valid JSON backup.');
                                  }
                                };
                                reader.readAsText(file);
                                event.target.value = '';
                              }

                              function clearAllData() {
                                if (!confirm('This will permanently delete all data! Are you sure?')) return;
                                if (!confirm('Last chance! All clients, history and settings will be lost. Continue?')) return;
                                localStorage.clear();
                                loadData();
                                renderDashboard();
                                renderHistory();
                                renderSettings();
                                renderProductGrid();
                                showToast('All data cleared');
                              }

                              // ===== HELPERS =====
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

                              function isOverdue(c) {
                                if (!c.followup || c.followupDone) return false;
                                return c.followup.date < todayISO();
                              }

                              function isDueToday(c) {
                                if (!c.followup || c.followupDone) return false;
                                return c.followup.date === todayISO();
                              }

                                function showToast(msg, duration) {
                                  duration = duration || 2800;
                                  var toast = document.getElementById('toast');
                                  toast.textContent = msg;
                                  toast.classList.add('show');
                                  setTimeout(function () { toast.classList.remove('show'); }, duration);
                                }
