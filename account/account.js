/* ==========================================================================
   PAWVILLE — account.js
   --------------------------------------------------------------------------
   Customer dashboard: injects the account sidebar + topbar into placeholders,
   guards the pages behind a session, and powers bookings, pets, invoices and
   profile. Load AFTER main.js and invoice.js.
   ========================================================================== */
(function () {
  "use strict";

  var LOGO = "../assets/images/logo.png";
  var AVATAR = "../assets/images/ava-account-default.jpg";
  var STORE_KEY = "pv-appointments";
  var PETS_KEY = "pv-pets";
  var ACCOUNTS_KEY = "pv-accounts";

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
  function loadAccounts() {
    try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || []; } catch (e) { return []; }
  }
  function saveAccounts(list) {
    try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list)); } catch (e) {}
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
     Sidebar + topbar templates
  ------------------------------------------------------------------ */
  var SIDEBAR_TEMPLATE = `
  <aside class="admin-sidebar" id="admin-sidebar">
    <a class="sidebar-brand" href="index.html">
      <img src="${LOGO}" alt="PawVille logo">
      <div>
        <div class="bb-name">Paw<span style="color:var(--pv-primary)">Ville</span></div>
        <div class="bb-sub">My Account</div>
      </div>
    </a>

    <div class="sidebar-cta">
      <a class="btn-clay" href="bookings.html"><i class="fa-solid fa-calendar-plus fa-fw"></i> New Booking</a>
      <a class="btn-clay-outline" href="pets.html#add-pet"><i class="fa-solid fa-circle-plus fa-fw"></i> Add a Pet</a>
    </div>

    <nav class="flex-grow-1 side-menu">
      <div class="nav-section">Menu</div>
      <ul class="nav flex-column">
        <li class="nav-item"><a class="nav-link" href="index.html" data-nav="index"><span class="nav-ico"><i class="fa-solid fa-chart-line fa-fw"></i></span> Overview</a></li>
        <li class="nav-item"><a class="nav-link" href="bookings.html" data-nav="bookings"><span class="nav-ico"><i class="fa-solid fa-calendar-days fa-fw"></i></span> My Bookings</a></li>
        <li class="nav-item"><a class="nav-link" href="pets.html" data-nav="pets"><span class="nav-ico"><i class="fa-solid fa-paw fa-fw"></i></span> My Pets</a></li>
        <li class="nav-item"><a class="nav-link" href="invoices.html" data-nav="invoices"><span class="nav-ico"><i class="fa-solid fa-file-invoice fa-fw"></i></span> Invoices</a></li>
        <li class="nav-item"><a class="nav-link" href="rewards.html" data-nav="rewards"><span class="nav-ico"><i class="fa-solid fa-gift fa-fw"></i></span> Loyalty Rewards</a></li>
        <li class="nav-item"><a class="nav-link" href="profile.html" data-nav="profile"><span class="nav-ico"><i class="fa-solid fa-user-gear fa-fw"></i></span> Profile &amp; Settings</a></li>
      </ul>
      <div class="nav-section">Resources</div>
      <ul class="nav flex-column">
        <li class="nav-item"><a class="nav-link" href="#" data-nav="help"><span class="nav-ico"><i class="fa-solid fa-circle-question fa-fw"></i></span> Help Center</a></li>
        <li class="nav-item"><a class="nav-link" href="../admin/index.html"><span class="nav-ico"><i class="fa-solid fa-screwdriver-wrench fa-fw"></i></span> Admin Portal</a></li>
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
      <button class="nav-icon-btn position-relative" type="button" id="account-bell" title="Notifications" aria-label="Notifications">
        <i class="fa-solid fa-bell fa-fw"></i>
        <span class="nav-icon-badge">2</span>
      </button>
      <div class="dropdown">
        <a href="#" class="d-flex align-items-center gap-1 text-decoration-none" data-bs-toggle="dropdown" aria-expanded="false">
          <span class="fw-bold d-none d-md-inline" id="top-name" style="color:var(--pv-text)">Pet Parent</span>
          <i class="fa-solid fa-chevron-down fa-fw" style="font-size:.7rem;color:var(--pv-muted)"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" style="min-width:200px">
          <li><a class="dropdown-item" href="index.html"><i class="fa-solid fa-chart-line fa-fw"></i> My Dashboard</a></li>
          <li><a class="dropdown-item" href="rewards.html"><i class="fa-solid fa-gift fa-fw"></i> Loyalty Rewards</a></li>
          <li><a class="dropdown-item" href="profile.html"><i class="fa-solid fa-user-gear fa-fw"></i> Profile &amp; Settings</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="../index.html"><i class="fa-solid fa-globe fa-fw"></i> View Website</a></li>
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
      var isIndex = target === "index" && file === "index.html";
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

  function bindToggles() {
    var dirLabel = document.getElementById("dir-label");
    if (dirLabel) dirLabel.textContent = document.documentElement.getAttribute("dir") === "rtl" ? "LTR" : "RTL";
  }

  /* ------------------------------------------------------------------
     Overview stats
  ------------------------------------------------------------------ */
  function shortDate(s) {
    var d = new Date(s);
    if (isNaN(d.getTime())) {
      return String(s == null ? "" : s).split(" ").slice(0, 3).join(" ");
    }
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function weekdayIndex(d) {
    return (d.getDay() + 6) % 7; /* Mon = 0 … Sun = 6 */
  }

  function renderGreeting() {
    var s = session();
    var greet = document.getElementById("dash-greeting");
    if (greet && s) greet.textContent = (s.name || "Pet Parent").split(" ")[0];
    var eye = document.getElementById("dash-eyebrow");
    if (eye) eye.textContent = "WELCOME BACK";
    var today = document.getElementById("dash-today");
    if (today) today.textContent = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }

  function renderStats() {
    var list = myAppointments();
    var upcoming = list.filter(function (a) { return a.status !== "completed" && a.status !== "cancelled"; });
    var done = list.filter(function (a) { return a.status === "completed"; });
    var set = function (id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
    var pts = done.length * 10;
    set("stat-upcoming", upcoming.length);
    set("stat-upcoming-2", upcoming.length);
    set("stat-completed", done.length);
    set("stat-completed-2", done.length);
    set("stat-pets", myPets().length);
    set("stat-points", pts);
    var donut = document.getElementById("stat-points-donut");
    if (donut) donut.textContent = pts;
    var ld = document.getElementById("loyalty-donut");
    var pct = Math.min(100, Math.round((pts / 50) * 100));
    if (ld) ld.style.setProperty("--p", pct);
    var pctEl = document.getElementById("loyalty-pct");
    if (pctEl) pctEl.textContent = pct + "%";
    var bar = document.getElementById("loyalty-bar");
    var progText = document.getElementById("loyalty-progress-text");
    if (bar) bar.style.width = Math.min(100, (pts / 50) * 100) + "%";
    if (progText) progText.textContent = pts + " / 50 pts to free bath";
    var next = document.getElementById("next-slot");
    if (next) {
      var sorted = upcoming.slice().sort(function (a, b) { return a.date.localeCompare(b.date); });
      next.textContent = sorted.length ? shortDate(sorted[0].date) : "—";
    }
  }

  /* ------------------------------------------------------------------
     Booking activity bars + nearby summary
  ------------------------------------------------------------------ */
  function renderAnalytics() {
    var barsWrap = document.getElementById("analytics-bars");
    if (!barsWrap) return;
    var counts = [0, 0, 0, 0, 0, 0, 0];
    myAppointments().forEach(function (a) {
      var d = new Date(a.date);
      if (!isNaN(d.getTime())) counts[weekdayIndex(d)]++;
    });
    var max = Math.max.apply(null, counts.concat([1]));
    var groups = barsWrap.querySelectorAll(".cbar-group");
    groups.forEach(function (g, i) {
      var bar = g.querySelector(".cbar");
      var val = g.querySelector(".cbar-val");
      if (!bar) return;
      bar.style.height = Math.max(6, Math.round((counts[i] / max) * 100)) + "%";
      if (val) val.textContent = counts[i];
    });
  }

  /* ------------------------------------------------------------------
     Upcoming appointments (homepage list + legacy table)
  ------------------------------------------------------------------ */
  function renderUpcoming() {
    var list = document.getElementById("upcoming-list");
    var items = myAppointments().filter(function (a) {
      return a.status !== "completed" && a.status !== "cancelled";
    }).sort(function (a, b) { return a.date.localeCompare(b.date); });
    if (list) {
      list.innerHTML = items.length
        ? items.slice(0, 5).map(function (a) {
            return (
              '<div class="schedule-item">' +
                '<div class="schedule-time">' + shortDate(a.date) + '<small>' + (a.time || "—") + '</small></div>' +
                '<div class="pet-bubble">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</div>' +
                '<div class="sched-body">' +
                  '<div class="sched-title">' + escapeHtml(a.petName) + ' · ' + a.packageLabel + '</div>' +
                  '<div class="sched-sub">Groomer: ' + escapeHtml(a.groomer) + '</div>' +
                '</div>' +
                statusBadge(a.status) +
                '<button class="nav-icon-btn" type="button" data-action="cancel" data-id="' + a.id + '" title="Cancel booking" aria-label="Cancel booking" style="width:38px;height:38px"><i class="fa-solid fa-xmark fa-fw"></i></button>' +
              '</div>'
            );
          }).join("")
        : '<div class="text-secondary text-center py-4" style="font-size:.9rem">No upcoming appointments — book one with the quick form.</div>';
    }
    var body = document.getElementById("upcoming-body");
    if (body) {
      body.innerHTML = items.length
        ? items.map(appointmentRow).join("")
        : '<tr><td colspan="6" class="text-center text-secondary py-5">No upcoming appointments — book one below.</td></tr>';
    }
    bindAppointmentActions();
  }

  /* ------------------------------------------------------------------
     Recently completed history (homepage)
  ------------------------------------------------------------------ */
  function renderHistory() {
    var body = document.getElementById("history-body");
    if (!body) return;
    var done = myAppointments().filter(function (a) { return a.status === "completed"; })
      .sort(function (a, b) { return b.date.localeCompare(a.date); });
    body.innerHTML = done.length
      ? done.slice(0, 5).map(function (a) {
          return (
            '<tr>' +
              '<td><div class="d-flex align-items-center gap-2"><span style="font-size:1.1rem">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</span><span class="fw-bold" style="font-size:.9rem">' + escapeHtml(a.petName) + '</span></div></td>' +
              '<td><span style="font-size:.88rem">' + a.packageLabel + '</span></td>' +
              '<td>' + shortDate(a.date) + '</td>' +
              '<td class="text-end"><button class="btn-clay-outline btn-sm" data-invoice="' + a.id + '"><i class="fa-solid fa-file-invoice fa-fw"></i> Invoice</button></td>' +
            '</tr>'
          );
        }).join("")
      : '<tr><td colspan="4" class="text-center text-secondary py-4" style="font-size:.9rem">Completed grooms appear here with their invoices.</td></tr>';
    bindAppointmentActions();
  }

  /* ------------------------------------------------------------------
     Pets summary chips (homepage)
  ------------------------------------------------------------------ */
  function renderPetsSummary() {
    var wrap = document.getElementById("pets-summary");
    if (!wrap) return;
    var pets = myPets();
    wrap.innerHTML = pets.length
      ? pets.map(function (p) {
          return (
            '<div class="pet-bubble chip" title="' + escapeHtml(p.name) + ' (' + escapeHtml(p.breed) + ')">' +
              '<span style="font-size:1.5rem;line-height:1">' + (PET_EMOJI[p.species] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</span>' +
              '<span class="pb-name">' + escapeHtml(p.name) + '</span>' +
              '<span class="clay-chip" style="font-size:.7rem;padding:.15rem .6rem">' + escapeHtml(p.breed) + '</span>' +
            '</div>'
          );
        }).join("")
      : '<div class="text-secondary text-center py-4" style="font-size:.9rem">No pets saved yet — <a class="feature-link" href="pets.html#add-pet">add your first</a>.</div>';
  }

  /* ------------------------------------------------------------------
     Full bookings list (bookings.html)
  ------------------------------------------------------------------ */
  function renderBookings() {
    var body = document.getElementById("bookings-body");
    if (!body) return;
    var list = myAppointments().slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    body.innerHTML = list.length
      ? list.map(appointmentRow).join("")
      : '<tr><td colspan="6" class="text-center text-secondary py-5">You haven\'t booked any grooms yet.</td></tr>';
    bindAppointmentActions();
  }

  function appointmentRow(a) {
    var actions;
    if (a.status === "completed") {
      actions = '<button class="btn-clay btn-sm" data-invoice="' + a.id + '"><i class="fa-solid fa-file-invoice fa-fw"></i> Invoice</button>';
    } else if (a.status === "cancelled") {
      actions = '<button class="btn-clay-outline btn-sm" data-action="delete"><i class="fa-solid fa-trash-can fa-fw"></i> Remove</button>';
    } else {
      actions = '<button class="btn-clay-outline btn-sm text-danger" data-action="cancel"><i class="fa-solid fa-xmark fa-fw"></i> Cancel</button>';
    }
    return (
      '<tr data-id="' + a.id + '">' +
        '<td><div class="d-flex align-items-center gap-2"><span style="font-size:1.3rem">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</span><div><div class="fw-bold">' + escapeHtml(a.petName) + '</div><div class="text-secondary" style="font-size:.8rem">' + escapeHtml(a.breed) + '</div></div></div></td>' +
        '<td><div class="fw-bold">' + a.packageLabel + '</div><div class="text-secondary" style="font-size:.8rem">$' + a.price + '</div></td>' +
        '<td>' + a.date + '<div class="text-secondary" style="font-size:.8rem">' + a.time + '</div></td>' +
        '<td>' + escapeHtml(a.groomer) + '</td>' +
        '<td>' + statusBadge(a.status) + '</td>' +
        '<td class="text-end">' + actions + '</td>' +
      '</tr>'
    );
  }

  function bindAppointmentActions() {
    document.querySelectorAll("[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var row = btn.closest("tr") || btn.closest(".schedule-item");
        var id = (row && row.getAttribute("data-id")) || btn.getAttribute("data-id");
        var action = btn.getAttribute("data-action");
        var list = loadAppointments();
        var appt = list.find(function (a) { return a.id === id; });
        if (!appt) return;
        if (action === "delete") {
          list = list.filter(function (a) { return a.id !== id; });
          saveAppointments(list);
          window.PawToast("Booking removed.", "info");
        } else {
          appt.status = "cancelled";
          saveAppointments(list);
          window.PawToast("Booking cancelled.", "info");
        }
        renderUpcoming();
        renderBookings();
        renderStats();
        renderHistory();
        renderAnalytics();
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
     Booking form (index page)
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
      renderUpcoming();
      renderStats();
      renderAnalytics();
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
     Pets (pets.html)
  ------------------------------------------------------------------ */
  function renderPets() {
    var grid = document.getElementById("pets-grid");
    if (!grid) return;
    var pets = myPets();
    grid.innerHTML = pets.length
      ? pets.map(function (p) {
          return (
            '<div class="col-md-6 col-xl-4">' +
              '<div class="clay p-4 h-100 reveal in">' +
                '<div class="d-flex justify-content-between align-items-start mb-3">' +
                  '<span style="font-size:2.6rem;line-height:1">' + (PET_EMOJI[p.species] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</span>' +
                  '<button class="nav-icon-btn" type="button" data-pet-del="' + escapeHtml(p.id) + '" title="Remove pet" aria-label="Remove pet"><i class="fa-solid fa-trash-can fa-fw"></i></button>' +
                '</div>' +
                '<div class="h5 mb-1">' + escapeHtml(p.name) + '</div>' +
                '<div class="text-secondary" style="font-size:.85rem">' + escapeHtml(p.breed) + '</div>' +
                '<div class="d-flex flex-wrap gap-2 mt-3">' +
                  '<span class="clay-chip"><span class="dot"></span> ' + escapeHtml(p.age || "—") + '</span>' +
                  '<span class="clay-chip"><span class="dot"></span> ' + escapeHtml(p.species || "pet") + '</span>' +
                '</div>' +
                (p.notes ? '<p class="text-secondary mt-3 mb-0" style="font-size:.85rem">' + escapeHtml(p.notes) + '</p>' : '') +
              '</div>' +
            '</div>'
          );
        }).join("")
      : '<div class="col-12 text-center text-secondary py-5">No pets saved yet — add your first one below.</div>';
    document.querySelectorAll("[data-pet-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-pet-del");
        savePets(loadPets().filter(function (p) { return p.id !== id; }));
        window.PawToast("Pet removed.", "info");
        renderPets();
        renderStats();
      });
    });
  }

  function bindPets() {
    var form = document.getElementById("pet-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var s = session();
      var pet = {
        id: "PT-" + Date.now().toString().slice(-6),
        email: (s && s.email) || "",
        name: fd.get("petName") || "My Pet",
        species: fd.get("species") || "dog",
        breed: fd.get("breed") || "Mixed breed",
        age: fd.get("age") || "",
        notes: fd.get("notes") || ""
      };
      var list = loadPets();
      list.unshift(pet);
      savePets(list);
      form.reset();
      renderPets();
      renderStats();
      window.PawToast(pet.name + " added to your pack!", "success");
    });
  }

  /* ------------------------------------------------------------------
     Rewards (rewards.html)
  ------------------------------------------------------------------ */
  function renderRewards() {
    var done = myAppointments().filter(function (a) { return a.status === "completed"; });
    var pts = done.length * 10;
    var set = function (id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
    set("rewards-points", pts);
    set("rewards-grooms", done.length);
    set("rewards-earned", Math.floor(pts / 50));
    var tier = document.getElementById("rewards-tier");
    if (tier) tier.textContent = pts >= 200 ? "VIP Member" : (pts >= 50 ? "Paw Loyal" : "Paw Parent");
    var pct = Math.min(100, Math.round((pts / 50) * 100));
    var donut = document.getElementById("reward-tier-donut");
    if (donut) donut.style.setProperty("--p", pct);
    set("reward-tier-pct", pct + "%");
    set("reward-tier-pts", pts + " / 50");
    var fill = document.getElementById("reward-tier-fill");
    if (fill) fill.style.width = pct + "%";
    var text = document.getElementById("reward-tier-text");
    if (text) text.textContent = (pts >= 50 ? "You've earned a free bath & shine — enjoy!" : pts + " / 50 pts to a free bath");
    var body = document.getElementById("rewards-history-body");
    if (body) {
      var sorted = done.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
      body.innerHTML = sorted.length
        ? sorted.map(function (a) {
            return (
              '<tr>' +
                '<td><div class="d-flex align-items-center gap-2"><span style="font-size:1.2rem">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</span><span class="fw-bold" style="font-size:.9rem">' + escapeHtml(a.petName) + '</span></div></td>' +
                '<td><span style="font-size:.88rem">' + a.packageLabel + '</span></td>' +
                '<td>' + shortDate(a.date) + '</td>' +
                '<td class="text-end"><span class="badge-clay bg-teal" style="font-size:.78rem">+10 pts</span></td>' +
              '</tr>'
            );
          }).join("")
        : '<tr><td colspan="4" class="text-center text-secondary py-4" style="font-size:.9rem">Complete your first groom to start earning points.</td></tr>';
    }
  }

  /* ------------------------------------------------------------------
     Invoices (invoices.html)
  ------------------------------------------------------------------ */
  function renderInvoices() {
    var body = document.getElementById("invoices-body");
    if (!body) return;
    var done = myAppointments().filter(function (a) { return a.status === "completed"; });
    body.innerHTML = done.length
      ? done.map(function (a) {
          return (
            '<tr>' +
              '<td><div class="d-flex align-items-center gap-2"><span style="font-size:1.2rem">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</span><span class="fw-bold">' + escapeHtml(a.petName) + '</span></div></td>' +
              '<td>' + a.packageLabel + '</td>' +
              '<td>$' + a.price + '.00</td>' +
              '<td>' + a.date + '</td>' +
              '<td>' + statusBadge(a.status) + '</td>' +
              '<td class="text-end"><button class="btn-clay btn-sm" data-invoice="' + a.id + '"><i class="fa-solid fa-file-invoice fa-fw"></i> View Invoice</button></td>' +
            '</tr>'
          );
        }).join("")
      : '<tr><td colspan="6" class="text-center text-secondary py-5">No completed grooms yet — invoices appear here after a groom is done.</td></tr>';
    bindAppointmentActions();
  }

  /* ------------------------------------------------------------------
     Profile (profile.html)
  ------------------------------------------------------------------ */
  function fillProfile() {
    var s = session();
    if (!s) return;
    var first = document.getElementById("prof-first");
    var last = document.getElementById("prof-last");
    var email = document.getElementById("prof-email");
    var phone = document.getElementById("prof-phone");
    if (first) first.value = (s.name || "").split(" ")[0] || "";
    if (last) last.value = (s.name || "").split(" ").slice(1).join(" ") || "";
    if (email) email.value = s.email || "";
    if (phone) phone.value = s.phone || "";
  }

  function bindProfile() {
    var form = document.getElementById("profile-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var s = session() || {};
        var name = ((fd.get("first") || "") + " " + (fd.get("last") || "")).replace(/\s+/g, " ").trim() || s.name;
        var email = (fd.get("email") || s.email || "").trim().toLowerCase();
        s.name = name;
        s.email = email;
        s.phone = fd.get("phone") || "";
        PawSession.set(s);
        var accounts = loadAccounts();
        accounts.forEach(function (a) { if (a.email === s.email) { a.name = name; a.phone = s.phone; } });
        saveAccounts(accounts);
        var n1 = document.getElementById("side-name");
        var n2 = document.getElementById("top-name");
        if (n1) n1.textContent = name;
        if (n2) n2.textContent = name;
        window.PawToast("Profile updated!", "success");
      });
    }
    var passForm = document.getElementById("pass-form");
    if (passForm) {
      passForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(passForm);
        var pass = fd.get("pass") || "";
        var confirm = fd.get("confirm") || "";
        if (pass.length < 8) {
          window.PawToast("Password must be at least 8 characters.", "error");
          return;
        }
        if (pass !== confirm) {
          window.PawToast("Passwords don't match.", "error");
          return;
        }
        var s = session() || {};
        var accounts = loadAccounts();
        accounts.forEach(function (a) { if (a.email === (s.email || "")) { a.password = pass; } });
        saveAccounts(accounts);
        passForm.reset();
        window.PawToast("Password updated!", "success");
      });
    }
  }

  /* ------------------------------------------------------------------
     Logout + search
  ------------------------------------------------------------------ */
  function bindLogout() {
    document.querySelectorAll("[data-logout]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.PawSession) PawSession.clear();
        window.location.href = "../index.html";
      });
    });
  }

  function bindHelp() {
    var help = document.querySelector('[data-nav="help"]');
    if (help) help.addEventListener("click", function (e) {
      e.preventDefault();
      PawPopup({
        icon: '<i class="fa-solid fa-circle-question fa-fw"></i>',
        title: "Help Center",
        content: "<p>Need a hand? Try these:</p><ul style='margin:0'><li>Booking help — <a href='bookings.html'>My Bookings</a></li><li>Manage pets — <a href='pets.html'>My Pets</a></li><li>Invoices — <a href='invoices.html'>Invoices</a></li><li>Points &amp; rewards — <a href='rewards.html'>Loyalty Rewards</a></li><li>Email us at hello@pawville.com anytime</li></ul>",
        wide: true
      });
    });
  }

  function bindAccountUtility() {
    var bell = document.getElementById("account-bell");
    if (bell) bell.addEventListener("click", function () {
      PawPopup({
        icon: '<i class="fa-solid fa-bell fa-fw"></i>',
        title: "Notifications",
        content: "<ul style='margin:0'><li>Your booking has been confirmed!</li><li>You're 15 pts away from a free bath</li></ul>",
        wide: true
      });
    });
    var addPet = document.getElementById("btn-save-pet");
    if (addPet) addPet.addEventListener("click", function () {
      window.location.href = "pets.html#add-pet";
    });
  }

  function bindSearch() {
    var search = document.getElementById("account-search");
    if (!search) return;
    search.addEventListener("input", function () {
      var q = search.value.toLowerCase();
      document.querySelectorAll("tbody tr[data-id]").forEach(function (tr) {
        tr.style.display = tr.textContent.toLowerCase().indexOf(q) !== -1 ? "" : "none";
      });
    });
  }

  function bindPrint() {
    var printBtn = document.getElementById("invoice-print");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
  }

  /* ------------------------------------------------------------------
     Init (session-guarded)
  ------------------------------------------------------------------ */
  function init() {
    if (!session()) {
      window.location.href = "../login.html";
      return;
    }
    inject();
    markActive();
    bindSidebar();
    bindToggles();
    renderGreeting();
    renderStats();
    renderAnalytics();
    renderUpcoming();
    renderHistory();
    renderPetsSummary();
    renderBookings();
    bindBooking();
    bindPetPrefill();
    renderPets();
    bindPets();
    renderInvoices();
    renderRewards();
    fillProfile();
    bindProfile();
    bindLogout();
    bindSearch();
    bindPrint();
    bindHelp();
    bindAccountUtility();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
