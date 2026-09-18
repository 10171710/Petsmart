/* ==========================================================================
   PAWVILLE — dashboard.js
   --------------------------------------------------------------------------
   Dedicated customer dashboard (dashboard.html). Injects the account sidebar
   + topbar into their placeholders, session-guards the page, fills the
   greeting, computes stats, renders booking analytics, pet summary, upcoming +
   recent bookings, powers the quick-book form, loyalty card and logout.
   Load AFTER main.js and invoice.js.
   ========================================================================== */
(function () {
  "use strict";

  var LOGO = "assets/images/logo.png";
  var AVATAR = "assets/images/ava-account-default.jpg";
  var STORE_KEY = "pv-appointments";
  var PETS_KEY = "pv-pets";

  var GROOMER_PRICES = {
    essential: { label: "Essential Groom", price: 35 },
    signature: { label: "Signature Groom", price: 59 },
    spa: { label: "Spa Package", price: 79 },
    club: { label: "Unlimited Club", price: 79 }
  };

  var PET_EMOJI = { dog: '<i class="fa-solid fa-dog fa-fw"></i>', cat: '<i class="fa-solid fa-cat fa-fw"></i>', rabbit: '<i class="fa-solid fa-paw fa-fw"></i>', bird: '<i class="fa-solid fa-dove fa-fw"></i>' };

  function session() { return window.PawSession ? PawSession.get() : null; }
  function myEmail() { var s = session(); return s ? s.email : ""; }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function loadAppointments() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function saveAppointments(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function loadPets() {
    try { return JSON.parse(localStorage.getItem(PETS_KEY)) || []; } catch (e) { return []; }
  }
  function savePets(list) {
    try { localStorage.setItem(PETS_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function myName() { var s = session(); return s && s.name ? s.name : "Pet Parent"; }

  function seedDemo() {
    var appts = loadAppointments();
    var email = myEmail() || "demo@pawville.com";
    var hasMyDemo = appts.some(function (a) { return String(a.email || "").toLowerCase() === email.toLowerCase(); });
    if (!hasMyDemo) {
      var today = new Date();
      var iso = function (offset) { var d = new Date(today); d.setDate(d.getDate() + offset); return d.toDateString(); };
      var demoList = [
        { id: "PV-481201", pet: "dog", petName: "Bella", breed: "Golden Retriever", client: myName(), email: email, packageKey: "signature", packageLabel: "Signature Groom", price: 59, date: iso(1), time: "10:00", groomer: "Mia Torres", status: "confirmed" },
        { id: "PV-481202", pet: "dog", petName: "Milo", breed: "Beagle", client: myName(), email: email, packageKey: "essential", packageLabel: "Essential Groom", price: 35, date: iso(4), time: "14:00", groomer: "Leo Chen", status: "pending" },
        { id: "PV-481206", pet: "dog", petName: "Bella", breed: "Golden Retriever", client: myName(), email: email, packageKey: "spa", packageLabel: "Spa Package", price: 79, date: iso(-6), time: "11:30", groomer: "Amira Patel", status: "completed" },
        { id: "PV-481207", pet: "dog", petName: "Milo", breed: "Beagle", client: myName(), email: email, packageKey: "essential", packageLabel: "Essential Groom", price: 35, date: iso(-16), time: "15:00", groomer: "Mia Torres", status: "completed" }
      ];
      saveAppointments(appts.concat(demoList));
    }
  }

  function seedPets() {
    var pets = loadPets();
    var email = myEmail() || "demo@pawville.com";
    var hasMyPets = pets.some(function (p) { return String(p.email || "").toLowerCase() === email.toLowerCase(); });
    if (!hasMyPets) {
      var demoPets = [
        { id: "PT-7701", email: email, name: "Bella", species: "dog", breed: "Golden Retriever", age: "3 years", notes: "Loves belly rubs & blueberry shampoo" },
        { id: "PT-7702", email: email, name: "Milo", species: "dog", breed: "Beagle", age: "2 years", notes: "Friendly, sensitive ears" },
        { id: "PT-7703", email: email, name: "Luna", species: "cat", breed: "British Shorthair", age: "4 years", notes: "Quiet and gentle" }
      ];
      savePets(pets.concat(demoPets));
    }
  }

  function myAppointments() {
    var email = myEmail();
    return loadAppointments().filter(function (a) {
      return email && String(a.email || "").toLowerCase() === String(email).toLowerCase();
    });
  }

  function myPets() {
    var email = myEmail();
    return loadPets().filter(function (p) {
      return email && String(p.email || "").toLowerCase() === String(email).toLowerCase();
    });
  }

  function statusBadge(status) {
    var map = {
      pending: '<span class="badge-clay bg-coral">Pending</span>',
      confirmed: '<span class="badge-clay bg-teal">Confirmed</span>',
      completed: '<span class="badge-clay bg-teal">Completed</span>',
      cancelled: '<span class="badge-clay" style="color:var(--pv-muted)">Cancelled</span>'
    };
    return map[status] || map.pending;
  }

  /* ------------------------------------------------------------------
     Sidebar + topbar templates (account portal)
  ------------------------------------------------------------------ */
  var SIDEBAR_TEMPLATE = `
  <aside class="admin-sidebar" id="admin-sidebar">
    <a class="sidebar-brand" href="index.html">
      <img src="${LOGO}" alt="PawVille logo">
      <div>
        <div class="bb-name">Paw<span style="color:#000">Ville</span></div>
        <div class="bb-sub">My Account</div>
      </div>
    </a>

    <div class="sidebar-cta">
      <a class="btn-clay" href="account/bookings.html"><i class="fa-solid fa-calendar-plus fa-fw"></i> New Booking</a>
      <a class="btn-clay-outline" href="account/pets.html#add-pet"><i class="fa-solid fa-circle-plus fa-fw"></i> Add a Pet</a>
    </div>

    <nav class="flex-grow-1 side-menu">
      <div class="nav-section">Menu</div>
      <ul class="nav flex-column">
        <li class="nav-item"><a class="nav-link" href="dashboard.html" data-nav="index"><span class="nav-ico"><i class="fa-solid fa-chart-line fa-fw"></i></span> Overview</a></li>
        <li class="nav-item"><a class="nav-link" href="account/bookings.html" data-nav="bookings"><span class="nav-ico"><i class="fa-solid fa-calendar-days fa-fw"></i></span> My Bookings</a></li>
        <li class="nav-item"><a class="nav-link" href="account/pets.html" data-nav="pets"><span class="nav-ico"><i class="fa-solid fa-paw fa-fw"></i></span> My Pets</a></li>
        <li class="nav-item"><a class="nav-link" href="account/invoices.html" data-nav="invoices"><span class="nav-ico"><i class="fa-solid fa-file-invoice fa-fw"></i></span> Invoices</a></li>
        <li class="nav-item"><a class="nav-link" href="account/rewards.html" data-nav="rewards"><span class="nav-ico"><i class="fa-solid fa-award fa-fw"></i></span> Loyalty Rewards</a></li>
        <li class="nav-item"><a class="nav-link" href="account/profile.html" data-nav="profile"><span class="nav-ico"><i class="fa-solid fa-user-gear fa-fw"></i></span> Profile &amp; Settings</a></li>
      </ul>
      <div class="nav-section">Resources</div>
      <ul class="nav flex-column">
        <li class="nav-item"><a class="nav-link" href="account/profile.html#help" data-nav="help"><span class="nav-ico"><i class="fa-solid fa-circle-question fa-fw"></i></span> Help Center</a></li>
      </ul>
    </nav>
  </aside>
  `;

  var TOPBAR_TEMPLATE = `
  <header class="admin-topbar" id="admin-topbar">
    <button class="navbar-toggler" type="button" id="admin-menu-btn" aria-label="Toggle menu" style="width:42px;height:42px">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    </button>

    <div class="topbar-title">
      <strong>Customer Portal</strong>
    </div>

    <div class="ms-auto d-flex align-items-center gap-2">
      <div class="clay-inset d-none d-lg-flex align-items-center gap-2 px-3" style="border-radius:999px;max-width:300px">
        <span style="color:var(--pv-muted)"><i class="fa-solid fa-magnifying-glass fa-fw"></i></span>
        <input type="text" class="form-control form-clay border-0 shadow-none" id="account-search" placeholder="Search my bookings…" style="box-shadow:none!important">
      </div>

      <button class="nav-icon-btn" type="button" id="theme-toggle" title="Toggle theme" aria-label="Toggle theme">
        <span class="icon-sun"><i class="fa-solid fa-sun fa-fw"></i></span>
        <span class="icon-moon"><i class="fa-solid fa-moon fa-fw"></i></span>
      </button>
      <button class="nav-icon-btn" type="button" id="dir-toggle" title="Toggle RTL / LTR" aria-label="Toggle direction">
        <span id="dir-label" class="fw-bold" style="font-size:.78rem">RTL</span>
      </button>
      <div class="dropdown">
        <a href="#" class="d-flex align-items-center gap-1 text-decoration-none" data-bs-toggle="dropdown" aria-expanded="false">
          <span class="fw-bold d-none d-md-inline" id="top-name" style="color:var(--pv-text)">Pet Parent</span>
          <i class="fa-solid fa-chevron-down fa-fw" style="font-size:.7rem;color:var(--pv-muted)"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" style="min-width:210px">
          <li><a class="dropdown-item" href="dashboard.html"><i class="fa-solid fa-chart-line fa-fw"></i> My Dashboard</a></li>
          <li><a class="dropdown-item" href="account/rewards.html"><i class="fa-solid fa-award fa-fw"></i> Loyalty Rewards</a></li>
          <li><a class="dropdown-item" href="index.html"><i class="fa-solid fa-globe fa-fw"></i> View Website</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" data-logout><i class="fa-solid fa-right-from-bracket fa-fw"></i> Logout</a></li>
        </ul>
      </div>
    </div>
  </header>
  `;

  function inject() {
    var sb = document.getElementById("admin-sidebar");
    if (sb) sb.outerHTML = SIDEBAR_TEMPLATE;
    var tb = document.getElementById("admin-topbar");
    if (tb) tb.outerHTML = TOPBAR_TEMPLATE;
    var s = session();
    if (s) {
      var name = s.name || "Pet Parent";
      var n1 = document.getElementById("side-name");
      var n2 = document.getElementById("top-name");
      if (n1) n1.textContent = name;
      if (n2) n2.textContent = name;
    }
  }

  function markActive() {
    var file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".admin-sidebar .nav-link[data-nav]").forEach(function (link) {
      var target = link.getAttribute("data-nav");
      if (target === "help") return;
      var isIndex = target === "index" && file === "dashboard.html";
      var isOther = target !== "index" && file.indexOf(target) === 0;
      if (isIndex || isOther) link.classList.add("active");
    });
  }

  function bindSidebar() {
    var sidebar = document.querySelector(".admin-sidebar");
    var btn = document.getElementById("admin-menu-btn");
    if (!sidebar || !btn) return;
    var backdrop = document.createElement("div");
    backdrop.className = "admin-menu-backdrop";
    document.body.appendChild(backdrop);
    function close() { sidebar.classList.remove("open"); backdrop.classList.remove("show"); }
    btn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      backdrop.classList.toggle("show", sidebar.classList.contains("open"));
    });
    backdrop.addEventListener("click", close);
    sidebar.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
  }

  /* ------------------------------------------------------------------
     Greeting + date
  ------------------------------------------------------------------ */
  function fillGreeting() {
    var s = session();
    var name = (s && s.name) ? s.name : "Pet Parent";
    var first = String(name).split(" ")[0] || "there";
    var greet = document.getElementById("dash-greeting");
    if (greet) greet.textContent = "Hey there, " + first + "!";
    var eyebrow = document.getElementById("dash-eyebrow");
    if (eyebrow) eyebrow.textContent = (s && s.role === "admin") ? "ADMIN DASHBOARD" : "MY DASHBOARD";
    var today = document.getElementById("dash-today");
    if (today) today.textContent = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }

  /* ------------------------------------------------------------------
     Stats + loyalty
  ------------------------------------------------------------------ */
  function renderStats() {
    var list = myAppointments();
    var upcoming = list.filter(function (a) { return a.status !== "completed" && a.status !== "cancelled"; });
    var done = list.filter(function (a) { return a.status === "completed"; });
    var set = function (id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
    set("stat-upcoming", upcoming.length);
    set("stat-upcoming-2", upcoming.length);
    set("stat-completed", done.length);
    set("stat-completed-2", done.length);
    set("stat-pets", myPets().length);
    var pts = done.length * 10;
    set("stat-points", pts);
    var donut = document.getElementById("stat-points-donut");
    if (donut) donut.textContent = pts;
    var donutBox = donut && donut.closest(".donut");
    if (donutBox) donutBox.style.setProperty("--p", Math.min(100, (pts / 50) * 100));
    var bar = document.getElementById("loyalty-bar");
    var progText = document.getElementById("loyalty-progress-text");
    if (bar) bar.style.width = Math.min(100, (pts / 50) * 100) + "%";
    if (progText) progText.textContent = pts + " / 50 pts to free bath";
  }

  /* ------------------------------------------------------------------
     Booking analytics bars (this week)
  ------------------------------------------------------------------ */
  function renderAnalytics() {
    var wrap = document.getElementById("analytics-bars");
    if (!wrap) return;
    var counts = [0, 0, 0, 0, 0, 0, 0];
    var now = new Date();
    var isoToday = now.toDateString();
    var startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    myAppointments().forEach(function (a) {
      var d = new Date(a.date);
      if (isNaN(d.getTime())) d = new Date(a.date.indexOf(isoToday) !== -1 ? now : now);
      var dd = new Date(a.date);
      if (isNaN(dd.getTime())) return;
      if (dd.getTime() < new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate()).getTime() - 86400000) return;
      var idx = (dd.getDay() + 6) % 7;
      counts[idx]++;
    });
    var groups = wrap.querySelectorAll(".cbar-group");
    var max = Math.max.apply(null, counts.concat([1]));
    groups.forEach(function (g, i) {
      var bar = g.querySelector(".cbar");
      var val = g.querySelector(".cbar-val");
      if (!bar) return;
      bar.style.height = Math.max(6, Math.round((counts[i] / max) * 100)) + "%";
      if (val) val.textContent = counts[i];
    });
  }

  /* ------------------------------------------------------------------
     Upcoming appointments (schedule list)
  ------------------------------------------------------------------ */
  function renderUpcoming() {
    var wrap = document.getElementById("upcoming-list");
    if (!wrap) return;
    var list = myAppointments().filter(function (a) {
      return a.status !== "completed" && a.status !== "cancelled";
    }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (!list.length) {
      wrap.innerHTML = '<div class="text-secondary text-center py-4" style="font-size:.9rem">No upcoming appointments — book one with the quick form below.</div>';
      bindActions();
      return;
    }
    wrap.innerHTML = list.slice(0, 4).map(function (a) {
      return (
        '<div class="schedule-item" data-id="' + a.id + '">' +
          '<div class="schedule-time">' + shortDate(a.date) + '<small>' + (a.time || "—") + '</small></div>' +
          '<div class="pet-bubble">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</div>' +
          '<div class="sched-body">' +
            '<div class="sched-title">' + escapeHtml(a.petName) + ' · ' + a.packageLabel + '</div>' +
            '<div class="sched-sub">Groomer: ' + escapeHtml(a.groomer) + ' · $' + a.price + '</div>' +
          '</div>' +
          statusBadge(a.status) +
          '<button class="btn-clay-outline btn-sm text-danger flex-shrink-0" data-action="cancel" title="Cancel booking"><i class="fa-solid fa-xmark fa-fw"></i></button>' +
        '</div>'
      );
    }).join("");
    bindActions();
  }

  function shortDate(s) {
    var d = new Date(s);
    if (isNaN(d.getTime())) return sanitizeText(s);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function sanitizeText(s) {
    return String(s == null ? "—" : s).split(" ").slice(0, 3).join(" ");
  }

  /* ------------------------------------------------------------------
     Recently completed + invoices
  ------------------------------------------------------------------ */
  function renderHistory() {
    var body = document.getElementById("history-body");
    if (!body) return;
    var done = myAppointments().filter(function (a) { return a.status === "completed"; }).slice(0, 6);
    body.innerHTML = done.length
      ? done.map(function (a) {
          return (
            '<tr data-id="' + a.id + '">' +
              '<td><div class="d-flex align-items-center gap-2"><span style="font-size:1.2rem">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</span><span class="fw-bold">' + escapeHtml(a.petName) + '</span></div></td>' +
              '<td>' + a.packageLabel + '</td>' +
              '<td>' + shortDate(a.date) + '</td>' +
              '<td>$' + a.price + '</td>' +
              '<td>' + statusBadge(a.status) + '</td>' +
              '<td class="text-end"><button class="btn-clay btn-sm" data-invoice="' + a.id + '"><i class="fa-solid fa-file-invoice fa-fw"></i> Invoice</button></td>' +
            '</tr>'
          );
        }).join("")
      : '<tr><td colspan="6" class="text-center text-secondary py-5">No completed grooms yet — invoices appear here after a groom is done.</td></tr>';
    bindActions();
  }

  /* ------------------------------------------------------------------
     Pet summary cards
  ------------------------------------------------------------------ */
  function renderPets() {
    var grid = document.getElementById("pets-summary");
    if (!grid) return;
    var pets = myPets();
    grid.innerHTML = pets.length
      ? pets.map(function (p) {
          return (
            '<div class="col-md-6 col-xl-4">' +
              '<div class="clay-inset pet-card h-100">' +
                '<div class="pc-head">' +
                  '<div class="pet-bubble">' + (PET_EMOJI[p.species] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</div>' +
                  '<a class="feature-link" href="account/pets.html" title="Manage pets"><i class="fa-solid fa-arrow-up-right-from-square fa-fw"></i></a>' +
                '</div>' +
                '<div><div class="pc-name">' + escapeHtml(p.name) + '</div>' +
                '<div class="pc-breed">' + escapeHtml(p.breed) + '</div></div>' +
                '<div class="pc-foot">' +
                  '<span class="clay-chip"><span class="dot"></span> ' + escapeHtml(p.age || "—") + '</span>' +
                  '<span class="clay-chip"><span class="dot"></span> ' + escapeHtml(p.species || "pet") + '</span>' +
                '</div>' +
              '</div>' +
            '</div>'
          );
        }).join("")
      : '<div class="col-12"><div class="text-secondary text-center py-4" style="font-size:.9rem">No pets saved yet — add your first one to make booking faster.</div></div>';
  }

  /* ------------------------------------------------------------------
     Next free slot
  ------------------------------------------------------------------ */
  function renderNextSlot() {
    var el = document.getElementById("next-slot");
    if (!el) return;
    var taken = {};
    var open = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
    var today = new Date().toDateString();
    myAppointments().forEach(function (a) {
      if (String(a.date).indexOf(today) !== -1) taken[a.time] = true;
    });
    var free = open.filter(function (t) { return !taken[t]; });
    el.textContent = free.length ? free[0] : "Tmr 09:00";
    el.title = free.length ? "Free slot today" : "Earliest tomorrow";
  }

  function bindActions() {
    document.querySelectorAll("[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var row = btn.closest("[data-id]") || btn.closest("tr");
        var id = row.getAttribute("data-id");
        var list = loadAppointments();
        var appt = list.find(function (a) { return a.id === id; });
        if (!appt) return;
        appt.status = "cancelled";
        saveAppointments(list);
        window.PawToast("Booking cancelled.", "info");
        renderStats();
        renderUpcoming();
        renderHistory();
        renderAnalytics();
        renderNextSlot();
      });
    });

    document.querySelectorAll("[data-invoice]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-invoice");
        var appt = loadAppointments().find(function (a) { return a.id === id; });
        if (appt && window.PawInvoice) PawInvoice.open(appt, LOGO);
      });
    });
  }

  /* ------------------------------------------------------------------
     Quick-book form
  ------------------------------------------------------------------ */
  function bindBooking() {
    var form = document.getElementById("booking-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var s = session();
      var pkgKey = fd.get("package") || "signature";
      var pkg = GROOMER_PRICES[pkgKey] || GROOMER_PRICES.signature;
      var appt = {
        id: "PV-" + Date.now().toString().slice(-6),
        pet: fd.get("petType") || "dog",
        petName: fd.get("petName") || "My Pet",
        breed: fd.get("breed") || "Mixed breed",
        client: (s && s.name) || "Pet Parent",
        email: (s && s.email) || "",
        packageKey: pkgKey,
        packageLabel: pkg.label,
        price: pkg.price,
        date: fd.get("date") || "Today",
        time: fd.get("time") || "10:00",
        groomer: fd.get("groomer") || "Mia Torres",
        notes: fd.get("notes") || "",
        status: "pending"
      };
      var list = loadAppointments();
      list.unshift(appt);
      saveAppointments(list);
      form.reset();
      bindPetPrefill();
      renderStats();
      renderUpcoming();
      renderHistory();
      renderAnalytics();
      renderNextSlot();
      window.PawToast("Booking requested! We'll confirm soon!", "success");
    });
  }

  function bindPetPrefill() {
    var sel = document.getElementById("bk-pet");
    if (!sel) return;
    var pets = myPets();
    sel.innerHTML = '<option value="">Add a new pet below…</option>' +
      pets.map(function (p) {
        return '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.name) + ' (' + escapeHtml(p.breed) + ')</option>';
      }).join("");
    sel.addEventListener("change", function () {
      var p = pets.find(function (x) { return x.id === sel.value; });
      if (p) {
        var name = document.getElementById("bk-name");
        var breed = document.getElementById("bk-breed");
        if (name) name.value = p.name;
        if (breed) breed.value = p.breed;
      }
    });
  }

  /* ------------------------------------------------------------------
     Logout + search + help
  ------------------------------------------------------------------ */
  function bindLogout() {
    document.querySelectorAll("[data-logout]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.PawSession) PawSession.clear();
        window.location.href = "index.html";
      });
    });
  }

  function bindSearch() {
    var search = document.getElementById("account-search");
    if (!search) return;
    search.addEventListener("input", function () {
      var q = search.value.toLowerCase();
      document.querySelectorAll("[data-id]").forEach(function (el) {
        var show = el.textContent.toLowerCase().indexOf(q) !== -1;
        if (el.matches("tr")) el.style.display = show ? "" : "none";
        else if (el.querySelector && el.querySelector(".schedule-item")) {}
        else if (el.classList.contains("schedule-item")) el.style.display = show ? "" : "none";
      });
    });
  }

  function bindHelp() {
    document.querySelectorAll('[data-nav="help"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        PawPopup({
          icon: '<i class="fa-solid fa-circle-question fa-fw"></i>',
          title: "Help Center",
          content: "<p>How can we help?</p><ul style='margin:0'><li>Reschedule or cancel — My Bookings page</li><li>Add another pet — My Pets page</li><li>Print an invoice — Invoices page</li><li>Track your rewards — Loyalty Rewards page</li><li>Still stuck? Talk to the salon on the Contact page</li></ul>",
          wide: true
        });
      });
    });
  }

  function bindPrint() {
    var printBtn = document.getElementById("invoice-print");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
  }

  /* ------------------------------------------------------------------
     Init (direct dashboard access)
  ------------------------------------------------------------------ */
  function init() {
    if (!session()) {
      var defaultSession = {
        role: "user",
        name: "demo@pawville.com".split("@")[0].replace(/^./, function (c) { return c.toUpperCase(); }),
        email: "demo@pawville.com"
      };
      if (window.PawSession) PawSession.set(defaultSession);
    }
    seedDemo();
    seedPets();
    inject();
    markActive();
    bindSidebar();
    fillGreeting();
    renderStats();
    renderAnalytics();
    renderUpcoming();
    renderHistory();
    renderPets();
    renderNextSlot();
    bindBooking();
    bindPetPrefill();
    bindLogout();
    bindSearch();
    bindHelp();
    bindPrint();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();