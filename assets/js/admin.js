/* ==========================================================================
   PAWVILLE — admin.js
   --------------------------------------------------------------------------
   Injects the admin sidebar + topbar into placeholders and powers the whole
   dashboard: theme/dir toggles, booking flow (localStorage), appointment
   status, invoice modal + print, table search/filter and messages.
   Load AFTER main.js.
   ========================================================================== */
(function () {
  "use strict";

  var LOGO = "../assets/images/logo.png";
  var AVATAR = "../assets/images/ava-admin-default.jpg";
  var ADMIN_NAME = "Mia Torres";
  try {
    var _sess = window.PawSession && PawSession.get();
    if (_sess && _sess.name) ADMIN_NAME = _sess.name;
  } catch (err) {}

  /* ------------------------------------------------------------------
     Sidebar + topbar templates (edit here to update all admin pages)
  ------------------------------------------------------------------ */
  var SIDEBAR_TEMPLATE = `
  <aside class="admin-sidebar" id="admin-sidebar">
    <a class="sidebar-brand" href="../index.html">
      <img src="${LOGO}" alt="PawVille logo">
      <div>
        <div class="bb-name">Paw<span style="color:var(--pv-primary)">Ville</span></div>
        <div class="bb-sub">Admin Dashboard</div>
      </div>
    </a>

    <div class="sidebar-cta">
      <a class="btn-clay" href="index.html#booking-form"><i class="fa-solid fa-calendar-plus fa-fw"></i> New Booking</a>
      <a class="btn-clay-outline" href="customers.html"><i class="fa-solid fa-user-plus fa-fw"></i> Add Customer</a>
    </div>

    <nav class="flex-grow-1 side-menu">
      <div class="nav-section">Menu</div>
      <ul class="nav flex-column">
        <li class="nav-item"><a class="nav-link" href="index.html" data-nav="index"><span class="nav-ico"><i class="fa-solid fa-chart-line fa-fw"></i></span> Dashboard</a></li>
        <li class="nav-item"><a class="nav-link" href="appointments.html" data-nav="appointments"><span class="nav-ico"><i class="fa-solid fa-calendar-days fa-fw"></i></span> Appointments</a></li>
        <li class="nav-item"><a class="nav-link" href="customers.html" data-nav="customers"><span class="nav-ico"><i class="fa-solid fa-users fa-fw"></i></span> Customers</a></li>
        <li class="nav-item"><a class="nav-link" href="pets.html" data-nav="pets"><span class="nav-ico"><i class="fa-solid fa-paw fa-fw"></i></span> Pets</a></li>
        <li class="nav-item"><a class="nav-link" href="messages.html" data-nav="messages"><span class="nav-ico"><i class="fa-solid fa-comments fa-fw"></i></span> Messages <span class="badge-clay bg-coral ms-auto" style="font-size:.72rem">4</span></a></li>
        <li class="nav-item"><a class="nav-link" href="analytics.html" data-nav="analytics"><span class="nav-ico"><i class="fa-solid fa-chart-column fa-fw"></i></span> Analytics</a></li>
      </ul>
      <div class="nav-section">Resources</div>
      <ul class="nav flex-column">
        <li class="nav-item"><a class="nav-link" href="#" data-nav="settings"><span class="nav-ico"><i class="fa-solid fa-gear fa-fw"></i></span> Settings</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-nav="help"><span class="nav-ico"><i class="fa-solid fa-circle-question fa-fw"></i></span> Help Center</a></li>
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
      <strong>Admin Portal</strong>
    </div>

    <div class="ms-auto d-flex align-items-center gap-2">
      <div class="clay-inset d-none d-lg-flex align-items-center gap-2 px-3" style="border-radius:999px;max-width:300px">
        <span style="color:var(--pv-muted)"><i class="fa-solid fa-magnifying-glass fa-fw"></i></span>
        <input type="text" class="form-control form-clay border-0 shadow-none" id="admin-search" placeholder="Search appointments, pets, clients…" style="box-shadow:none!important">
      </div>

      <button class="nav-icon-btn" type="button" id="theme-toggle" title="Toggle theme" aria-label="Toggle theme">
        <span class="icon-sun"><i class="fa-solid fa-sun fa-fw"></i></span>
        <span class="icon-moon"><i class="fa-solid fa-moon fa-fw"></i></span>
      </button>
      <button class="nav-icon-btn" type="button" id="dir-toggle" title="Toggle RTL / LTR" aria-label="Toggle direction">
        <span id="dir-label" class="fw-bold" style="font-size:.78rem">RTL</span>
      </button>
      <button class="nav-icon-btn position-relative" type="button" id="admin-bell" title="Notifications" aria-label="Notifications">
        <i class="fa-solid fa-bell fa-fw"></i>
        <span class="nav-icon-badge">3</span>
      </button>
      <div class="dropdown">
        <a href="#" class="d-flex align-items-center gap-1 text-decoration-none" data-bs-toggle="dropdown" aria-expanded="false">
          <span class="fw-bold d-none d-md-inline" style="color:var(--pv-text);font-size:.9rem">${ADMIN_NAME}</span>
          <i class="fa-solid fa-chevron-down fa-fw" style="font-size:.7rem;color:var(--pv-muted)"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" style="min-width:200px">
          <li><a class="dropdown-item" href="index.html"><i class="fa-solid fa-gauge-high fa-fw"></i> Admin Dashboard</a></li>
          <li><a class="dropdown-item" href="appointments.html"><i class="fa-solid fa-calendar-days fa-fw"></i> Appointments</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="../index.html"><i class="fa-solid fa-globe fa-fw"></i> View Website</a></li>
          <li><a class="dropdown-item" href="../login.html"><i class="fa-solid fa-right-from-bracket fa-fw"></i> Logout</a></li>
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
    var greet = document.getElementById("admin-greet-name");
    if (greet) greet.textContent = (ADMIN_NAME || "Pet Parent").split(" ")[0];
  }

  /* ------------------------------------------------------------------
     Active link highlight based on current file
  ------------------------------------------------------------------ */
  function markActive() {
    var file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".admin-sidebar .nav-link[data-nav]").forEach(function (link) {
      var target = link.getAttribute("data-nav");
      if (target === "settings" || target === "help") return;
      if (file.indexOf(target) === 0 || (target === "index" && file === "index.html")) {
        link.classList.add("active");
      }
    });
  }

  /* ------------------------------------------------------------------
     Mobile sidebar toggle + backdrop
  ------------------------------------------------------------------ */
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
     Booked appointments storage helpers
  ------------------------------------------------------------------ */
  var STORE_KEY = "pv-appointments";
  var GROOMER_PRICES = {
    essential: { label: "Essential Groom", price: 35 },
    signature: { label: "Signature Groom", price: 59 },
    spa: { label: "Spa Package", price: 79 },
    club: { label: "Unlimited Club", price: 79 }
  };

  function loadAppointments() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function saveAppointments(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {}
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

  var PET_EMOJI = { dog: '<i class="fa-solid fa-dog fa-fw"></i>', cat: '<i class="fa-solid fa-cat fa-fw"></i>', rabbit: '<i class="fa-solid fa-paw fa-fw"></i>', bird: '<i class="fa-solid fa-dove fa-fw"></i>' };

  function appointmentRow(a) {
    return (
      '<tr data-id="' + a.id + '">' +
        '<td><div class="d-flex align-items-center gap-2"><span style="font-size:1.3rem">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</span><div><div class="fw-bold">' + escapeHtml(a.petName) + '</div><div class="text-secondary" style="font-size:.8rem">' + escapeHtml(a.breed) + '</div></div></div></td>' +
        '<td><div class="fw-bold">' + escapeHtml(a.client) + '</div><div class="text-secondary" style="font-size:.8rem">' + escapeHtml(a.email) + '</div></td>' +
        '<td><div class="fw-bold">' + a.packageLabel + '</div><div class="text-secondary" style="font-size:.8rem">$' + a.price + '</div></td>' +
        '<td>' + a.date + '<div class="text-secondary" style="font-size:.8rem">' + a.time + '</div></td>' +
        '<td>' + escapeHtml(a.groomer) + '</td>' +
        '<td>' + statusBadge(a.status) + '</td>' +
        '<td class="text-end"><div class="dropdown">' +
          '<button class="btn-clay-outline btn-sm" data-bs-toggle="dropdown">⋯</button>' +
          '<ul class="dropdown-menu dropdown-menu-end">' +
            '<li><a class="dropdown-item" href="#" data-action="confirm"><i class="fa-solid fa-check fa-fw"></i> Confirm</a></li>' +
            '<li><a class="dropdown-item" href="#" data-action="complete"><i class="fa-solid fa-check-double fa-fw"></i> Complete</a></li>' +
            '<li><a class="dropdown-item text-danger" href="#" data-action="cancel"><i class="fa-solid fa-xmark fa-fw"></i> Cancel</a></li>' +
          '</ul></div></td>' +
      '</tr>'
    );
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ------------------------------------------------------------------
     Booking form (admin dashboard)
  ------------------------------------------------------------------ */
  function bindBooking() {
    var form = document.getElementById("booking-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var pkgKey = fd.get("package") || "signature";
      var pkg = GROOMER_PRICES[pkgKey] || GROOMER_PRICES.signature;
      var appt = {
        id: "PV-" + Date.now().toString().slice(-6),
        pet: fd.get("petType") || "dog",
        petName: fd.get("petName") || "My Pet",
        breed: fd.get("breed") || "Mixed breed",
        client: fd.get("clientName") || "Client",
        email: fd.get("clientEmail") || "client@email.com",
        packageKey: pkgKey,
        packageLabel: pkg.label,
        price: pkg.price,
        date: fd.get("date") || "Today",
        time: fd.get("time") || "10:00",
        groomer: fd.get("groomer") || ADMIN_NAME,
        status: "pending"
      };
      var list = loadAppointments();
      list.unshift(appt);
      saveAppointments(list);
      form.reset();
      renderAppointments();
      renderOverview();
      window.PawToast("Appointment booked! Check the upcoming list.", "success");
    });
  }

  /* ------------------------------------------------------------------
     Render appointment tables + status actions + invoice
  ------------------------------------------------------------------ */
  function renderAppointments() {
    var list = loadAppointments();
    var upcomingBody = document.getElementById("upcoming-body");
    if (upcomingBody) {
      var upcoming = list.filter(function (a) { return a.status !== "completed" && a.status !== "cancelled"; });
      upcomingBody.innerHTML = upcoming.length
        ? upcoming.map(appointmentRow).join("")
        : '<tr><td colspan="7" class="text-center text-secondary py-5">No upcoming appointments — book one with the form above.</td></tr>';
    }
    var historyBody = document.getElementById("history-body");
    if (historyBody) {
      var done = list.filter(function (a) { return a.status === "completed"; });
      historyBody.innerHTML = done.length
        ? done.map(function (a) {
            return (
              '<tr>' +
                '<td><span style="font-size:1.2rem">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</span> <span class="fw-bold">' + escapeHtml(a.petName) + '</span></td>' +
                '<td>' + a.packageLabel + '</td>' +
                '<td>$' + a.price + '</td>' +
                '<td>' + a.date + '</td>' +
                '<td>' + statusBadge(a.status) + '</td>' +
                '<td class="text-end"><button class="btn-clay btn-sm" data-invoice="' + a.id + '"><i class="fa-solid fa-file-invoice fa-fw"></i> Invoice</button></td>' +
              '</tr>'
            );
          }).join("")
        : '<tr><td colspan="6" class="text-center text-secondary py-5">No completed grooms yet.</td></tr>';
    }
    bindAppointmentActions();
  }

  function bindAppointmentActions() {
    document.querySelectorAll("[data-action]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var row = link.closest("tr");
        var id = row.getAttribute("data-id");
        var action = link.getAttribute("data-action");
        var list = loadAppointments();
        var appt = list.find(function (a) { return a.id === id; });
        if (!appt) return;
        appt.status = action === "confirm" ? "confirmed" : action === "complete" ? "completed" : "cancelled";
        saveAppointments(list);
        window.PawToast("Appointment " + action + "ed!", "info");
        renderAppointments();
      });
    });

    document.querySelectorAll("[data-invoice]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-invoice");
        var list = loadAppointments();
        var appt = list.find(function (a) { return a.id === id; });
        if (appt) openInvoice(appt);
      });
    });
  }

  /* ------------------------------------------------------------------
     Invoice modal + print
  ------------------------------------------------------------------ */
  function openInvoice(a) {
    if (window.PawInvoice) { PawInvoice.open(a, LOGO); return; }
    var modalEl = document.getElementById("invoiceModal");
    if (!modalEl) return;
    var fill = document.getElementById("invoice-fill");
    if (fill) {
      fill.innerHTML =
        '<div class="d-flex justify-content-between flex-wrap gap-3 mb-4">' +
          '<div><div class="d-flex align-items-center gap-2"><img src="' + LOGO + '" style="width:40px;height:40px" alt=""><span class="h5 mb-0 fw-bold">PawVille</span></div>' +
          '<div class="text-secondary mt-2" style="font-size:.85rem">24 Wagtail Lane, Pet District<br>+1 (555) 012-3456 · hello@pawville.com</div></div>' +
          '<div class="text-end"><div class="h5 mb-1 fw-bold">INVOICE</div><div class="text-secondary" style="font-size:.85rem">#' + a.id + '</div>' +
          '<div class="text-secondary" style="font-size:.85rem">' + a.date + ' · ' + a.time + '</div></div></div>' +
        '<div class="row mb-4"><div class="col-sm-6"><div class="text-secondary" style="font-size:.8rem;text-transform:uppercase;letter-spacing:1px">Billed to</div>' +
          '<div class="fw-bold mt-1">' + escapeHtml(a.client) + '</div><div class="text-secondary" style="font-size:.85rem">' + escapeHtml(a.email) + '</div></div>' +
          '<div class="col-sm-6 mt-3 mt-sm-0"><div class="text-secondary" style="font-size:.8rem;text-transform:uppercase;letter-spacing:1px">Service details</div>' +
          '<div class="fw-bold mt-1">' + escapeHtml(a.petName) + ' (' + escapeHtml(a.breed) + ')</div>' +
          '<div class="text-secondary" style="font-size:.85rem">Groomer: ' + escapeHtml(a.groomer) + '</div></div></div>' +
        '<table class="table" style="border-collapse:separate;border-spacing:0 6px"><thead><tr>' +
          '<th class="text-secondary" style="font-size:.75rem;text-transform:uppercase">Description</th>' +
          '<th class="text-secondary text-end" style="font-size:.75rem;text-transform:uppercase">Amount</th></tr></thead><tbody>' +
          '<tr><td class="fw-bold">' + a.packageLabel + '</td><td class="text-end fw-bold">$' + a.price + '.00</td></tr>' +
          '<tr><td class="text-secondary">VAT (10%)</td><td class="text-end text-secondary">$' + (a.price * 0.1).toFixed(2) + '</td></tr>' +
          '<tr><td class="fw-bold" style="font-size:1.05rem">Total</td><td class="text-end fw-bold" style="font-size:1.1rem">$' + (a.price * 1.1).toFixed(2) + '</td></tr>' +
        '</tbody></table>' +
        '<p class="text-secondary mb-0 mt-3" style="font-size:.85rem">Thank you for choosing PawVille! Please retain this invoice for your records.</p>';
    }
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  function bindPrint() {
    var printBtn = document.getElementById("invoice-print");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
  }

  /* ------------------------------------------------------------------
     Admin tables: search & filter
  ------------------------------------------------------------------ */
  function bindTables() {
    var search = document.getElementById("admin-search");
    if (search) {
      search.addEventListener("input", function () {
        var q = (search.value || "").trim().toLowerCase();
        // 1. Appointments & tables with data-id
        document.querySelectorAll("tbody tr[data-id]").forEach(function (tr) {
          tr.style.display = tr.textContent.toLowerCase().indexOf(q) !== -1 ? "" : "none";
        });
        // 2. Customers table pagination & filtering
        if (customerPagerRefresh) {
          customerPagerRefresh(q);
        }
        // 3. Pets directory cards (if on pets.html)
        var petCards = document.querySelectorAll("#pets-grid > div");
        if (petCards.length) {
          petCards.forEach(function (card) {
            card.style.display = card.textContent.toLowerCase().indexOf(q) !== -1 ? "" : "none";
          });
        }
      });
    }
    var statusFilter = document.getElementById("status-filter");
    if (statusFilter) {
      statusFilter.addEventListener("change", function () {
        var v = statusFilter.value;
        document.querySelectorAll("tbody tr[data-id]").forEach(function (tr) {
          var badge = tr.querySelector(".badge-clay");
          var txt = badge ? badge.textContent.toLowerCase() : "";
          tr.style.display = v === "all" || txt.indexOf(v) !== -1 ? "" : "none";
        });
      });
    }
  }

  /* ------------------------------------------------------------------
     Overview analytics (admin/index.html homepage)
     ------------------------------------------------------------------ */
  var PETS_KEY = "pv-pets";
  function loadPets() {
    try { return JSON.parse(localStorage.getItem(PETS_KEY)) || []; } catch (e) { return []; }
  }
  function savePets(list) {
    try { localStorage.setItem(PETS_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function weekdayIndex(d) {
    return (d.getDay() + 6) % 7; /* Mon = 0 … Sun = 6 */
  }

  function renderOverview() {
    var list = loadAppointments();
    var today = new Date();
    var todayStr = today.toDateString();
    var inWeek = (function () {
      var start = new Date(today);
      start.setDate(today.getDate() - weekdayIndex(today));
      start.setHours(0, 0, 0, 0);
      return function (d) { return d.getTime() >= start.getTime(); };
    })();

    /* KPI metrics */
    var revenue = 0, counts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    var weekCounts = [0, 0, 0, 0, 0, 0, 0];
    var completionsThisWeek = 0, bookedToday = 0;
    var clientMap = {};
    list.forEach(function (a) {
      var d = new Date(a.date);
      if (!isNaN(d.getTime())) {
        if (a.status !== "cancelled") revenue += Number(a.price) || 0;
        if (d.toDateString() === todayStr) bookedToday++;
        if (inWeek(d)) {
          weekCounts[weekdayIndex(d)]++;
          if (a.status === "completed") completionsThisWeek++;
        }
      }
      if (counts.hasOwnProperty(a.status)) counts[a.status]++;
      var k = String(a.email || a.client || "").toLowerCase();
      if (k) clientMap[k] = true;
    });
    var clients = Object.keys(clientMap).length;

    var setTxt = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    setTxt("stat-revenue", revenue.toLocaleString());
    setTxt("stat-appointments", list.length);
    setTxt("stat-pending", counts.pending);
    setTxt("stat-clients", clients);
    setTxt("stat-pets-registered", loadPets().length);
    setTxt("stat-pet-total", loadPets().length);
    setTxt("sched-today", bookedToday);
    setTxt("sched-confirmed", counts.confirmed);
    setTxt("sched-completed", completionsThisWeek);
    setTxt("sched-cancelled", counts.cancelled);

    /* Weekly bars */
    var barsWrap = document.getElementById("week-bars");
    if (barsWrap) {
      var groups = barsWrap.querySelectorAll(".cbar-group");
      var max = Math.max.apply(null, weekCounts.concat([1]));
      groups.forEach(function (g, i) {
        var bar = g.querySelector(".cbar");
        var val = g.querySelector(".cbar-val");
        if (!bar) return;
        bar.style.height = Math.max(6, Math.round((weekCounts[i] / max) * 100)) + "%";
        if (val) val.textContent = weekCounts[i];
      });
    }

    /* Status donut + legend */
    var activeTotal = counts.pending + counts.confirmed || 1;
    var confirmedPct = Math.round((counts.confirmed / activeTotal) * 100);
    var donut = document.getElementById("status-donut");
    if (donut) donut.style.setProperty("--p", confirmedPct);
    var dv = document.getElementById("status-donut-val");
    if (dv) dv.textContent = confirmedPct + "%";
    setTxt("lg-pending", counts.pending);
    setTxt("lg-confirmed", counts.confirmed);
    setTxt("lg-completed", counts.completed);
    setTxt("lg-cancelled", counts.cancelled);

    /* Today's schedule (or next upcoming) */
    var tdList = document.getElementById("today-list");
    if (tdList) {
      var upcoming = list
        .filter(function (a) { return a.status !== "completed" && a.status !== "cancelled"; })
        .sort(function (a, b) { return (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")); });
      var scheduled = upcoming.length ? upcoming : [];
      tdList.innerHTML = scheduled.length
        ? scheduled.slice(0, 5).map(function (a) {
            return (
              '<div class="schedule-item">' +
                '<div class="schedule-time">' + shortDay(a.date) + '<small>' + (a.time || "—") + '</small></div>' +
                '<div class="pet-bubble">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</div>' +
                '<div class="sched-body">' +
                  '<div class="sched-title">' + escapeHtml(a.petName) + ' · ' + a.packageLabel + '</div>' +
                  '<div class="sched-sub">' + escapeHtml(a.client) + ' · Groomer: ' + escapeHtml(a.groomer) + '</div>' +
                '</div>' +
                statusBadge(a.status) +
              '</div>'
            );
          }).join("")
        : '<div class="text-secondary text-center py-4" style="font-size:.9rem">No active appointments — book one with the quick form.</div>';
    }

    /* Top groomers (by completed) */
    var tgWrap = document.getElementById("top-groomers");
    if (tgWrap) {
      var groomerDone = {};
      list.forEach(function (a) {
        if (a.status === "completed" && a.groomer) groomerDone[a.groomer] = (groomerDone[a.groomer] || 0) + 1;
      });
      var entries = Object.keys(groomerDone).map(function (g) { return { name: g, n: groomerDone[g] }; }).sort(function (x, y) { return y.n - x.n; });
      var tgMax = Math.max.apply(null, entries.map(function (e) { return e.n; }).concat([1]));
      if (!entries.length) {
        entries = [
          { name: "Mia Torres", n: 0 }, { name: "Leo Chen", n: 0 }, { name: "Amira Patel", n: 0 }, { name: "Noah Grant", n: 0 }
        ];
      }
      var colors = ["var(--pv-primary)", "var(--pv-secondary)", "var(--pv-primary-deep)", "var(--pv-primary)"];
      tgWrap.innerHTML = entries.slice(0, 4).map(function (e, i) {
        var w = Math.max(8, Math.round((e.n / tgMax) * 100));
        return (
          '<div>' +
            '<div class="d-flex justify-content-between fw-bold"><span style="font-size:.86rem">' + escapeHtml(e.name) + '</span><span>' + e.n + '</span></div>' +
            '<div class="clay-inset mt-1" style="border-radius:999px;height:9px"><div class="h-100 rounded-pill" style="width:' + w + '%;background:' + colors[i % colors.length] + '"></div></div>' +
          '</div>'
        );
      }).join("");
    }

    /* Recent customers */
    var rcBody = document.getElementById("recent-customers");
    if (rcBody) {
      var byClient = {};
      list.forEach(function (a) {
        var key = String(a.email || a.client || "").toLowerCase();
        if (!key) return;
        if (!byClient[key]) byClient[key] = { name: a.client || "Client", email: a.email || "", last: "", pet: a.petName, pets: {} };
        if (String(a.date).localeCompare(byClient[key].last) > 0) {
          byClient[key].last = a.date;
          byClient[key].pet = a.petName;
        }
        if (a.petName) byClient[key].pets[a.petName] = true;
      });
      var rc = Object.keys(byClient).map(function (k) { return byClient[k]; }).sort(function (x, y) { return y.last.localeCompare(x.last); });
      rcBody.innerHTML = rc.length
        ? rc.slice(0, 6).map(function (c) {
            return (
              '<tr>' +
                '<td><div><div class="fw-bold" style="font-size:.9rem">' + escapeHtml(c.name) + '</div><div class="text-secondary" style="font-size:.78rem">' + escapeHtml(c.email) + '</div></div></td>' +
                '<td><span style="font-size:1.1rem"><i class="fa-solid fa-paw fa-fw"></i></span> ' + escapeHtml(c.pet || "—") + '</td>' +
                '<td>' + shortDay(c.last) + '</td>' +
                '<td><span class="badge-clay bg-teal">Active</span></td>' +
              '</tr>'
            );
          }).join("")
        : '<tr><td colspan="4" class="text-center text-secondary py-4" style="font-size:.9rem">No customer bookings yet.</td></tr>';
    }

    /* Service mix donut */
    var pkgCounts = {};
    list.forEach(function (a) { pkgCounts[a.packageLabel] = (pkgCounts[a.packageLabel] || 0) + 1; });
    var pkgLegend = document.getElementById("package-legend");
    var pkgDonut = document.getElementById("package-donut");
    var pkgVal = document.getElementById("package-donut-val");
    var total = list.length || 0;
    if (pkgLegend) {
      var pk = Object.keys(pkgCounts).length ? pkgCounts : { "Signature Groom": 1, "Essential Groom": 1, "Spa Package": 1 };
      var topKey = Object.keys(pk).sort(function (x, y) { return pk[y] - pk[x]; })[0];
      var pct = total ? Math.round((pk[topKey] / total) * 100) : 50;
      if (pkgDonut) pkgDonut.style.setProperty("--p", Math.max(4, pct));
      if (pkgVal) pkgVal.textContent = total ? topKey : "—";
      var dotClasses = ["lg-dot brown", "lg-dot teal", "lg-dot coral", "lg-dot muted"];
      pkgLegend.innerHTML = Object.keys(pk).map(function (k, i) {
        var c = total ? Math.round((pk[k] / total) * 100) : 0;
        return (
          '<div class="lg-item"><span class="' + dotClasses[i % dotClasses.length] + '"></span>' +
          '<span class="lg-name">' + escapeHtml(k) + '</span><span class="lg-value">' + c + '%</span></div>'
        );
      }).join("");
    }
  }

  function shortDay(s) {
    var d = new Date(s);
    if (isNaN(d.getTime())) {
      var t = String(s == null ? "" : s);
      return t.split(" ").slice(0, 3).join(" ");
    }
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  /* ------------------------------------------------------------------
     Admin Pets page (all registered pets)
     ------------------------------------------------------------------ */
  var ADMIN_PET_BREEDS = { dog: "Dog", cat: "Cat", rabbit: "Rabbit", bird: "Bird" };

  function seedPets() {
    if (loadPets().length) return;
    var emailMap = {};
    loadAppointments().forEach(function (a) { if (a.email) emailMap[a.email.toLowerCase()] = a.client || "Client"; });
    var owners = Object.keys(emailMap);
    var fallbackPet = function (species, name, breed, owner, age) {
      return { id: "PT-" + Math.random().toString(36).slice(2, 8).toUpperCase(), email: owner ? owner.toLowerCase() : "", name: name, species: species, breed: breed, age: age, notes: "" };
    };
    var seeds = [
      fallbackPet("dog", "Bella", "Golden Retriever", owners[0] || "rachel@email.com", "3 years"),
      fallbackPet("cat", "Mr. Whiskers", "Persian", owners[1] || "noor@email.com", "5 years"),
      fallbackPet("dog", "Luna", "Poodle", owners[2] || "liam@email.com", "2 years"),
      fallbackPet("rabbit", "Clover", "Mini Lop", owners[3] || "sofia@email.com", "1 year"),
      fallbackPet("dog", "Rex", "German Shepherd", owners[4] || "omar@email.com", "4 years"),
      fallbackPet("cat", "Luna", "British Shorthair", owners[5] || "grace@email.com", "3 years")
    ];
    savePets(seeds);
  }

  function renderAllPets() {
    var grid = document.getElementById("pets-grid");
    var pets = loadPets();
    if (grid) {
      var emails = {};
      loadAppointments().forEach(function (a) { if (a.email) emails[a.email.toLowerCase()] = a.client || "Client"; });
      grid.innerHTML = pets.length
        ? pets.map(function (p) {
            var owner = p.email ? (emails[p.email.toLowerCase()] || p.email) : "Walk-in / guest";
            return (
              '<div class="col-md-6 col-xl-4">' +
                '<div class="clay p-4 h-100 reveal in">' +
                  '<div class="d-flex justify-content-between align-items-start mb-3">' +
                    '<span style="font-size:2.6rem;line-height:1">' + (PET_EMOJI[p.species] || '<i class="fa-solid fa-paw fa-fw"></i>') + '</span>' +
                    '<div class="d-flex gap-2">' +
                      '<span class="badge-clay bg-teal" style="font-size:.72rem">' + (ADMIN_PET_BREEDS[p.species] || "Pet") + '</span>' +
                      '<button class="nav-icon-btn" type="button" data-pet-del="' + escapeHtml(p.id) + '" title="Remove pet" aria-label="Remove pet" style="width:38px;height:38px"><i class="fa-solid fa-trash-can fa-fw"></i></button>' +
                    '</div>' +
                  '</div>' +
                  '<div class="h5 mb-1" style="font-size:1.15rem">' + escapeHtml(p.name) + '</div>' +
                  '<div class="text-secondary" style="font-size:.85rem">' + escapeHtml(p.breed) + '</div>' +
                  '<div class="clay-inset p-3 mt-3" style="border-radius:var(--radius-sm)">' +
                    '<div class="d-flex justify-content-between"><span class="text-secondary" style="font-size:.78rem">Owner</span><span class="fw-bold" style="font-size:.85rem">' + escapeHtml(owner) + '</span></div>' +
                    '<div class="d-flex justify-content-between mt-1"><span class="text-secondary" style="font-size:.78rem">Age</span><span class="fw-bold" style="font-size:.85rem">' + escapeHtml(p.age || "—") + '</span></div>' +
                  '</div>' +
                '</div>' +
              '</div>'
            );
          }).join("")
        : '<div class="col-12 text-center text-secondary py-5">No pets registered yet.</div>';
      document.querySelectorAll("[data-pet-del]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-pet-del");
          savePets(loadPets().filter(function (p) { return p.id !== id; }));
          window.PawToast("Pet removed.", "info");
          renderAllPets();
        });
      });
    }
    var total = document.getElementById("pet-stat-total");
    if (total) total.textContent = pets.length;
    var dogs = document.getElementById("pet-stat-dogs");
    if (dogs) dogs.textContent = pets.filter(function (p) { return p.species === "dog"; }).length;
    var cats = document.getElementById("pet-stat-cats");
    if (cats) cats.textContent = pets.filter(function (p) { return p.species === "cat"; }).length;
    var visits = document.getElementById("pet-stat-visits");
    if (visits) visits.textContent = loadAppointments().length;
  }

  function bindAdminPets() {
    var form = document.getElementById("pet-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var pet = {
        id: "PT-" + Date.now().toString().slice(-6),
        email: (fd.get("email") || "").trim().toLowerCase(),
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
      renderAllPets();
      window.PawToast(pet.name + " registered to the salon!", "success");
    });
  }

  function bindOverview() {
    var dateEl = document.getElementById("admin-today");
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    renderOverview();
  }

  /* ------------------------------------------------------------------
     Messages: open + reply demo
  ------------------------------------------------------------------ */
  function bindMessages() {
    document.querySelectorAll(".msg-row").forEach(function (row) {
      row.addEventListener("click", function () {
        document.querySelectorAll(".msg-row").forEach(function (r) { r.classList.remove("active"); });
        row.classList.add("active");
        row.classList.remove("unread");
      });
    });
    var reply = document.getElementById("reply-form");
    if (reply) {
      reply.addEventListener("submit", function (e) {
        e.preventDefault();
        reply.reset();
        window.PawToast("Reply sent to the customer.", "success");
      });
    }
  }

  /* ------------------------------------------------------------------
     Seed demo data once
  ------------------------------------------------------------------ */
  function seedDemo() {
    if (loadAppointments().length) return;
    var today = new Date();
    function iso(offset) { var d = new Date(today); d.setDate(d.getDate() + offset); return d.toDateString(); }
    saveAppointments([
      { id: "PV-481203", pet: "dog", petName: "Bella", breed: "Golden Retriever", client: "Rachel H.", email: "rachel@email.com", packageKey: "signature", packageLabel: "Signature Groom", price: 59, date: iso(1), time: "10:00", groomer: "Mia Torres", status: "confirmed" },
      { id: "PV-481204", pet: "cat", petName: "Mr. Whiskers", breed: "Persian", client: "Noor A.", email: "noor@email.com", packageKey: "spa", packageLabel: "Spa Package", price: 79, date: iso(2), time: "13:30", groomer: "Amira Patel", status: "pending" },
      { id: "PV-481205", pet: "dog", petName: "Luna", breed: "Poodle", client: "Liam K.", email: "liam@email.com", packageKey: "essential", packageLabel: "Essential Groom", price: 35, date: iso(3), time: "09:00", groomer: "Leo Chen", status: "confirmed" },
      { id: "PV-481206", pet: "rabbit", petName: "Clover", breed: "Mini Lop", client: "Sofia R.", email: "sofia@email.com", packageKey: "essential", packageLabel: "Essential Groom", price: 29, date: iso(-5), time: "11:00", groomer: "Sara Kim", status: "completed" },
      { id: "PV-481207", pet: "dog", petName: "Rex", breed: "German Shepherd", client: "Omar F.", email: "omar@email.com", packageKey: "signature", packageLabel: "Signature Groom", price: 69, date: iso(-12), time: "15:00", groomer: "Mia Torres", status: "completed" },
      { id: "PV-481208", pet: "cat", petName: "Luna", breed: "British Shorthair", client: "Grace M.", email: "grace@email.com", packageKey: "club", packageLabel: "Unlimited Club", price: 79, date: iso(-20), time: "12:00", groomer: "Amira Patel", status: "completed" }
    ]);
  }

  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  function init() {
    inject();
    markActive();
    bindSidebar();
    bindToggles(); // theme + dir (elements injected above)
    seedDemo();
    seedPets();
    renderAppointments();
    bindBooking();
    bindPrint();
    bindTables();
    bindMessages();
    bindAdminUtility();
    bindCustomerPagination();
    bindCustomerView();
    bindOverview();
    renderAllPets();
    bindAdminPets();
  }

  function bindAdminUtility() {
    var settings = document.querySelector('[data-nav="settings"]');
    if (settings) settings.addEventListener("click", function (e) {
      e.preventDefault();
      PawPopup({
        icon: '<i class="fa-solid fa-gear fa-fw"></i>',
        title: "Salon settings",
        content: "<p>Opening hours, grooming availability and notification preferences can be managed here. Your current demo settings:</p><ul style='margin:0'><li>Mon–Sat 8AM–7PM, Sun 9AM–4PM</li><li>New-appointment notifications: on</li><li>Client reminders: 24h before appointment</li></ul>",
        wide: true
      });
    });
    var help = document.querySelector('[data-nav="help"]');
    if (help) help.addEventListener("click", function (e) {
      e.preventDefault();
      PawPopup({
        icon: '<i class="fa-solid fa-circle-question fa-fw"></i>',
        title: "Help Center",
        content: "<p>Need a hand? Try these:</p><ul style='margin:0'><li>Managing appointments — Appointments page</li><li>Client questions — Messages page</li><li>Booking issues — open the booking form on the Dashboard</li><li>Email us at hello@pawville.com anytime</li></ul>",
        wide: true
      });
    });
    var bell = document.getElementById("admin-bell");
    if (bell) bell.addEventListener("click", function () {
      PawPopup({
        icon: '<i class="fa-solid fa-bell fa-fw"></i>',
        title: "Notifications",
        content: "<ul style='margin:0'><li>3 new booking requests await confirmation</li><li>1 client message needs a reply</li><li>New review from Rachel H. — 5 stars</li></ul>",
        wide: true
      });
    });
    var addCustomer = document.getElementById("btn-add-customer");
    if (addCustomer) addCustomer.addEventListener("click", openAddCustomer);
  }

  function openAddCustomer() {
    var overlay = document.createElement("div");
    overlay.id = "add-customer-overlay";
    overlay.className = "quick-modal";
    overlay.innerHTML =
      '<div class="quick-modal-card clay-lg">' +
        '<div class="quick-modal-icon"><i class="fa-solid fa-user-plus fa-fw"></i></div>' +
        '<div class="quick-modal-title">Add a new customer</div>' +
        '<form id="add-customer-form" class="quick-modal-form">' +
          '<div class="mb-3"><label class="form-label" for="qm-name">Full name</label>' +
          '<input id="qm-name" name="name" class="form-control form-clay" required placeholder="e.g. Rachel H."></div>' +
          '<div class="mb-3"><label class="form-label" for="qm-email">Email</label>' +
          '<input id="qm-email" type="email" name="email" class="form-control form-clay" required placeholder="e.g. rachel@email.com"></div>' +
          '<div class="mb-1"><label class="form-label" for="qm-phone">Phone (10 digits)</label>' +
          '<input id="qm-phone" name="phone" class="form-control form-clay" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" required placeholder="e.g. 5550102030">' +
          '<div id="phone-err" class="quick-modal-error d-none">Phone must be exactly 10 digits.</div></div>' +
          '<div class="quick-modal-actions">' +
            '<button type="button" class="btn-clay-outline" id="add-customer-cancel">Cancel</button>' +
            '<button type="submit" class="btn-clay">Add customer</button>' +
          '</div>' +
        '</form>' +
      '</div>';
    document.body.appendChild(overlay);
    function closeOverlay() {
      overlay.style.transition = "opacity .25s ease";
      overlay.style.opacity = "0";
      setTimeout(function () { overlay.remove(); }, 260);
    }
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeOverlay(); });
    document.getElementById("add-customer-cancel").addEventListener("click", closeOverlay);
    var phoneInput = document.getElementById("add-customer-form").querySelector('[name="phone"]');
    phoneInput.addEventListener("input", function () {
      var digits = phoneInput.value.replace(/\D/g, "");
      if (digits !== phoneInput.value) phoneInput.value = digits;
      document.getElementById("phone-err").classList.add("d-none");
    });
    document.getElementById("add-customer-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);
      var name = (fd.get("name") || "").trim();
      var email = (fd.get("email") || "").trim().toLowerCase();
      var phone = (fd.get("phone") || "").trim();
      if (!name || !email) return;
      if (!/^\d{10}$/.test(phone)) {
        document.getElementById("phone-err").classList.remove("d-none");
        return;
      }
      var accounts = [];
      try { accounts = JSON.parse(localStorage.getItem("pv-accounts")) || []; } catch (err) {}
      accounts.push({ name: name, email: email, password: "", role: "user", phone: phone, pets: [] });
      try { localStorage.setItem("pv-accounts", JSON.stringify(accounts)); } catch (err) {}
      var tbody = document.querySelector("table.table-clay tbody");
      if (tbody) {
        var row = document.createElement("tr");
        row.innerHTML =
          '<td><div><div class="fw-bold">' + escapeHtml(name) + '</div><div class="text-secondary" style="font-size:.8rem">' + escapeHtml(email) + '</div></div></td>' +
          '<td><span style="font-size:1.1rem"><i class="fa-solid fa-paw fa-fw"></i></span> —</td>' +
          '<td>Never</td>' +
          '<td class="fw-bold">$0</td>' +
          '<td><span class="badge-clay">—</span></td>' +
          '<td><span class="badge-clay bg-teal">Active</span></td>' +
          '<td class="text-end"><button class="btn-clay-outline btn-sm" type="button">View</button></td>';
        tbody.insertBefore(row, tbody.firstChild);
        if (customerPagerRefresh) customerPagerRefresh();
      }
      var cc = document.getElementById("client-count");
      if (cc) cc.textContent = (parseInt(cc.textContent, 10) || 0) + 1;
      var st = document.getElementById("stat-total-clients");
      if (st) st.textContent = (parseInt(st.textContent, 10) || 0) + 1;
      closeOverlay();
      PawToast(name + " added to customers");
    });
    document.addEventListener("keydown", function h(e2) {
      if (e2.key === "Escape") { closeOverlay(); document.removeEventListener("keydown", h); }
    });
  }

  var customerPagerRefresh = null;

  function bindCustomerPagination() {
    var tbody = document.querySelector("table.table-clay tbody");
    var pager = document.getElementById("customers-pager");
    if (!tbody || !pager) return;
    var PER_PAGE = 5;
    var page = 1;
    var currentQuery = "";

    function getRows() {
      return Array.prototype.slice.call(tbody.querySelectorAll("tr:not(.no-results-row)"));
    }

    function render(searchQuery) {
      if (typeof searchQuery === "string") {
        currentQuery = searchQuery.trim().toLowerCase();
        page = 1;
      }
      var allRows = getRows();
      var noResultsEl = tbody.querySelector(".no-results-row");
      if (noResultsEl) noResultsEl.remove();

      var matchingRows = allRows.filter(function (r) {
        if (!currentQuery) return true;
        // Match by customer name, email, pet name / species, etc.
        return r.textContent.toLowerCase().indexOf(currentQuery) !== -1;
      });

      allRows.forEach(function (r) { r.classList.add("d-none"); });

      if (matchingRows.length === 0) {
        var emptyTr = document.createElement("tr");
        emptyTr.className = "no-results-row";
        emptyTr.innerHTML = '<td colspan="7" class="text-center text-secondary py-4" style="font-size:.9rem">No customers found matching "' + escapeHtml(currentQuery) + '".</td>';
        tbody.appendChild(emptyTr);
        var nav = pager.closest("nav");
        if (nav) nav.classList.add("d-none");
        return;
      }

      var total = Math.max(1, Math.ceil(matchingRows.length / PER_PAGE));
      if (page > total) page = total;
      if (page < 1) page = 1;

      matchingRows.slice((page - 1) * PER_PAGE, page * PER_PAGE).forEach(function (r) {
        r.classList.remove("d-none");
      });

      var html =
        '<li class="page-item ' + (page <= 1 ? "disabled" : "") + '"><a class="btn-clay-outline" href="#" data-page="' + (page - 1) + '" style="padding:.5rem 1rem"><span class="pager-arrow">←</span> Prev</a></li>';
      for (var p = 1; p <= total; p++) {
        html += '<li class="page-item"><a class="' + (p === page ? "btn-clay" : "btn-clay-outline") + '" href="#" data-page="' + p + '" style="padding:.5rem 1rem">' + p + '</a></li>';
      }
      html += '<li class="page-item ' + (page >= total ? "disabled" : "") + '"><a class="btn-clay-outline" href="#" data-page="' + (page + 1) + '" style="padding:.5rem 1rem">Next <span class="pager-arrow">»</span></a></li>';
      pager.innerHTML = html;
      var nav = pager.closest("nav");
      if (nav) nav.classList.toggle("d-none", total <= 1);
    }

    pager.addEventListener("click", function (e) {
      var a = e.target.closest("[data-page]");
      if (!a) return;
      e.preventDefault();
      var p = parseInt(a.getAttribute("data-page"), 10);
      var allRows = getRows();
      var matchingRows = allRows.filter(function (r) {
        if (!currentQuery) return true;
        return r.textContent.toLowerCase().indexOf(currentQuery) !== -1;
      });
      var total = Math.max(1, Math.ceil(matchingRows.length / PER_PAGE));
      if (p < 1 || p > total) return;
      page = p;
      render();
    });

    customerPagerRefresh = render;
    render();
  }

  function bindCustomerView() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("table.table-clay button.btn-clay-outline");
      if (!btn || btn.textContent.trim().toLowerCase() !== "view") return;
      var tr = btn.closest("tr");
      if (!tr) return;
      var nameEl = tr.querySelector(".fw-bold");
      var emailEl = tr.querySelector(".text-secondary");
      if (!nameEl) return;
      var name = nameEl.textContent.trim();
      var email = emailEl ? emailEl.textContent.trim() : "";
      var tds = tr.querySelectorAll("td");
      var pet = tds[1] ? tds[1].textContent.trim() : "—";
      var lastVisit = tds[2] ? tds[2].textContent.trim() : "—";
      var spent = tds[3] ? tds[3].textContent.trim() : "$0";
      var club = tds[4] ? tds[4].textContent.trim() : "—";
      var status = tds[5] ? tds[5].textContent.trim() : "Active";

      if (window.PawPopup) {
        PawPopup({
          icon: '<i class="fa-solid fa-user fa-fw"></i>',
          title: "Customer: " + name,
          content:
            '<div class="d-flex flex-column gap-2" style="font-size:.9rem">' +
              '<div><strong>Email:</strong> ' + escapeHtml(email) + '</div>' +
              '<div><strong>Registered pet:</strong> ' + escapeHtml(pet) + '</div>' +
              '<div><strong>Last visit:</strong> ' + escapeHtml(lastVisit) + '</div>' +
              '<div><strong>Total spend:</strong> ' + escapeHtml(spent) + '</div>' +
              '<div><strong>Club plan:</strong> ' + escapeHtml(club) + '</div>' +
              '<div><strong>Account status:</strong> ' + escapeHtml(status) + '</div>' +
            '</div>',
          wide: true
        });
      }
    });
  }

  function bindToggles() {
    // Click handling is delegated globally in main.js; here we only sync labels.
    var dirLabel = document.getElementById("dir-label");
    if (dirLabel) dirLabel.textContent = document.documentElement.getAttribute("dir") === "rtl" ? "LTR" : "RTL";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
