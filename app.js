/* SPADRA — app.js */
// Transparent nav that locks in with a solid background on scroll
var nav = document.querySelector('.nav');
function onScroll() {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Footer year
document.querySelectorAll('#yr').forEach(function (el) { el.textContent = new Date().getFullYear(); });

// ---- Buy catalog: estimated resale values (good condition) ----
var CATEGORIES = {
  iphone: { label: 'iPhones', items: [
    ['iPhone 16 Pro Max', 1125], ['iPhone 16 Pro', 975], ['iPhone 16 / 16 Plus', 770],
    ['iPhone 15 Pro Max', 670], ['iPhone 15 Pro', 595], ['iPhone 15 / 15 Plus', 435],
    ['iPhone 14 Pro Max', 460], ['iPhone 14 Pro', 415], ['iPhone 14 / 14 Plus', 300],
    ['iPhone 13 Pro / Pro Max', 300], ['iPhone 13 / 13 mini', 230], ['iPhone 12 series', 150]
  ]},
  ipad: { label: 'iPads', items: [
    ['iPad Pro 13" (M4)', 950], ['iPad Pro 11" (M4)', 750], ['iPad Pro 12.9" (M2)', 650],
    ['iPad Air (M2)', 450], ['iPad Air (M1)', 350], ['iPad mini 6', 300], ['iPad (10th gen)', 250]
  ]},
  mac: { label: 'Macs', items: [
    ['MacBook Pro 14" (M3)', 1200], ['MacBook Air 13" (M3)', 850], ['MacBook Pro 13" (M2)', 800],
    ['MacBook Air 13" (M2)', 700], ['iMac 24" (M1)', 600], ['MacBook Air (M1)', 450], ['Mac mini (M2)', 400]
  ]},
  gaming: { label: 'Gaming', items: [
    ['PlayStation 5 (disc)', 350], ['Steam Deck 512GB', 350], ['PlayStation 5 Slim', 320],
    ['Xbox Series X', 320], ['PlayStation 5 Digital', 280], ['Nintendo Switch OLED', 220],
    ['Xbox Series S', 180], ['Nintendo Switch', 160]
  ]},
  drone: { label: 'Drones', items: [
    ['DJI Mavic 3 Pro', 1300], ['DJI Air 3', 750], ['DJI Avata 2', 600],
    ['DJI Mini 4 Pro', 550], ['DJI Mini 3', 350]
  ]}
};
var BUY_FACTOR = 0.65; // we buy at ~65% of resale value
function round5(n) { return Math.round(n / 5) * 5; }

var activeCat = 'iphone';
var tabsEl = document.getElementById('cat-tabs');
var modelSel = document.getElementById('s-model');

function fillModels() {
  if (!modelSel) return;
  modelSel.innerHTML = '<option value="">Select…</option>';
  CATEGORIES[activeCat].items.forEach(function (it, i) {
    var o = document.createElement('option');
    o.value = i; o.textContent = it[0];
    modelSel.appendChild(o);
  });
}

if (tabsEl) {
  Object.keys(CATEGORIES).forEach(function (key) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = CATEGORIES[key].label;
    if (key === activeCat) b.classList.add('on');
    b.onclick = function () {
      activeCat = key;
      tabsEl.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      fillModels();
      document.getElementById('quote-box').classList.remove('show');
    };
    tabsEl.appendChild(b);
  });
  fillModels();
}

function calcOffer() {
  var box = document.getElementById('quote-box');
  var mi = parseInt(modelSel.value, 10);
  var cond = parseFloat(document.getElementById('s-cond').value);
  if (isNaN(mi)) {
    box.classList.add('show');
    document.getElementById('quote-amount').textContent = '—';
    document.getElementById('quote-sub').textContent = 'Pick your model first.';
    return;
  }
  var item = CATEGORIES[activeCat].items[mi];
  var offer = round5(item[1] * cond * BUY_FACTOR);
  var condLabel = document.getElementById('s-cond').selectedOptions[0].textContent;
  document.getElementById('quote-amount').textContent = '$' + offer;
  document.getElementById('quote-sub').textContent = item[0] + ' · ' + condLabel + ' — confirmed at pickup after inspection';
  document.getElementById('quote-text').href =
    'sms:+14244260760?&body=' + encodeURIComponent(
      'Hi SPADRA! Your tool estimated $' + offer + ' for my ' + item[0] + ' (' + condLabel + '). I\'d like to book a pickup. My address is: '
    );
  // prefill the pickup form's device field
  var dev = document.getElementById('p-device');
  if (dev) dev.value = item[0] + ' — ' + condLabel + ' (est. $' + offer + ')';
  box.classList.add('show');
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---- Homepage: iPhone-only instant offer ----
var hModel = document.getElementById('h-model');
if (hModel) {
  CATEGORIES.iphone.items.forEach(function (it, i) {
    var o = document.createElement('option');
    o.value = i; o.textContent = it[0];
    hModel.appendChild(o);
  });
}
function calcHomeOffer() {
  var box = document.getElementById('h-quote-box');
  var mi = parseInt(hModel.value, 10);
  var cond = parseFloat(document.getElementById('h-cond').value);
  if (isNaN(mi)) {
    box.classList.add('show');
    document.getElementById('h-quote-amount').textContent = '—';
    document.getElementById('h-quote-sub').textContent = 'Pick your model first.';
    return;
  }
  var item = CATEGORIES.iphone.items[mi];
  var offer = round5(item[1] * cond * BUY_FACTOR);
  var condLabel = document.getElementById('h-cond').selectedOptions[0].textContent;
  document.getElementById('h-quote-amount').textContent = '$' + offer;
  document.getElementById('h-quote-sub').textContent = item[0] + ' · ' + condLabel + ' — confirmed when we meet';
  document.getElementById('h-quote-text').href =
    'sms:+14244260760?&body=' + encodeURIComponent('Hi SPADRA! Your site estimated $' + offer + ' for my ' + item[0] + ' (' + condLabel + '). I want to cash out.');
  box.classList.add('show');
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ---- Shop page: refurbished inventory ----
var SHOP = [
  { name: 'iPhone 15 Pro', spec: '128GB · Unlocked · Batt 91%', price: 649, tag: 'Best value', img: 'images/iphone.webp' },
  { name: 'iPhone 15', spec: '128GB · Unlocked · Batt 89%', price: 499, tag: 'Popular', img: 'images/iphone-side.webp' },
  { name: 'iPhone 14 Pro', spec: '128GB · Unlocked · Batt 88%', price: 479, tag: null, img: 'images/iphone.webp' },
  { name: 'iPhone 14', spec: '128GB · Unlocked · Batt 90%', price: 349, tag: null, img: 'images/iphone-side.webp' },
  { name: 'iPhone 13 Pro', spec: '128GB · Unlocked · New battery', price: 329, tag: 'New battery', img: 'images/iphone.webp' },
  { name: 'iPhone 13', spec: '128GB · Unlocked · Batt 87%', price: 269, tag: 'Budget pick', img: 'images/iphone-side.webp' }
];
var grid = document.getElementById('shop-grid');
if (grid) {
  SHOP.forEach(function (p) {
    var d = document.createElement('div');
    d.className = 'phone';
    var sms = 'sms:+14244260760?&body=' + encodeURIComponent('Hi SPADRA! Is the ' + p.name + ' (' + p.spec + ') for $' + p.price + ' still available?');
    d.innerHTML =
      (p.tag ? '<span class="badge">' + p.tag + '</span>' : '') +
      '<img src="' + p.img + '" alt="' + p.name + '">' +
      '<h3>' + p.name + '</h3>' +
      '<div class="spec">' + p.spec + '</div>' +
      '<div class="p">$' + p.price + '</div>' +
      '<a class="btn btn-ghost" style="width:100%" href="' + sms + '">Text to Buy</a>';
    grid.appendChild(d);
  });
}

// ---- Repairs page: booking form -> SMS ----
var repairForm = document.getElementById('repair-form');
if (repairForm) {
  repairForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = 'Hi SPADRA! Repair booking request:\n' +
      'Name: ' + document.getElementById('r-name').value + '\n' +
      'Phone: ' + document.getElementById('r-phone').value + '\n' +
      'Model: ' + document.getElementById('r-model').value + '\n' +
      'Issue: ' + document.getElementById('r-issue').value + '\n' +
      'Fix location: ' + (document.getElementById('r-loc').value || '—') + '\n' +
      'Notes: ' + (document.getElementById('r-notes').value || '—');
    window.location.href = 'sms:+14244260760?&body=' + encodeURIComponent(msg);
  });
}

// ---- Sell page: pickup form -> SMS ----
var pickupForm = document.getElementById('pickup-form');
if (pickupForm) {
  pickupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = 'Hi SPADRA! Pickup request:\n' +
      'Name: ' + document.getElementById('p-name').value + '\n' +
      'Phone: ' + document.getElementById('p-phone').value + '\n' +
      'Address: ' + document.getElementById('p-addr').value + ', ' + document.getElementById('p-city').value + '\n' +
      'Time: ' + document.getElementById('p-time').value + '\n' +
      'Selling: ' + (document.getElementById('p-device').value || '—');
    window.location.href = 'sms:+14244260760?&body=' + encodeURIComponent(msg);
  });
}
