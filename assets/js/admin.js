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
  var ADMIN_ROLE = "Administrator";
  try {
    var _sess = window.PawSession && PawSession.get();
    if (_sess) {
      if (_sess.name) ADMIN_NAME = _sess.name;
      ADMIN_ROLE = _sess.role === "admin" ? "Administrator" : "Member";
    }
  } catch (err) {}

  /* ------------------------------------------------------------------
     Sidebar + topbar templates (edit here to update all admin pages)
  ------------------------------------------------------------------ */
  var SIDEBAR_TEMPLATE = `
  <aside class="admin-sidebar" id="admin-sidebar">
    <a class="sidebar-brand" href="index.html">
      <img src="${LOGO}" alt="PawVille logo">
      <div>
        <div class="bb-name">Paw<span style="color:var(--pv-primary)">Ville</span></div>
        <div class="bb-sub">Admin Dashboard</div>
      </div>
    </a>

    <nav class="flex-grow-1">
      <div class="nav-section">Main</div>
      <ul class="nav flex-column">
        <li class="nav-item"><a class="nav-link" href="index.html" data-nav="index"><span class="nav-ico"><i class="fa-solid fa-chart-line"></i></span> Dashboard</a></li>
        <li class="nav-item"><a class="nav-link" href="appointments.html" data-nav="appointments"><span class="nav-ico"><i class="fa-solid fa-calendar-days"></i></span> Appointments</a></li>
        <li class="nav-item"><a class="nav-link" href="customers.html" data-nav="customers"><span class="nav-ico"><i class="fa-solid fa-users"></i></span> Customers</a></li>
        <li class="nav-item"><a class="nav-link" href="messages.html" data-nav="messages"><span class="nav-ico"><i class="fa-solid fa-comments"></i></span> Messages <span class="badge-clay bg-coral ms-auto" style="font-size:.72rem">4</span></a></li>
        <li class="nav-item"><a class="nav-link" href="analytics.html" data-nav="analytics"><span class="nav-ico"><i class="fa-solid fa-chart-column"></i></span> Analytics</a></li>
      </ul>
      <div class="nav-section">General</div>
      <ul class="nav flex-column">
        <li class="nav-item"><a class="nav-link" href="#" data-nav="settings"><span class="nav-ico"><i class="fa-solid fa-gear"></i></span> Settings</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-nav="help"><span class="nav-ico"><i class="fa-solid fa-circle-question"></i></span> Help Center</a></li>      </ul>
    </nav>

    <div class="clay-inset p-3 mt-3">
      <div class="d-flex align-items-center gap-3">
        <div class="flex-grow-1">
          <div class="fw-bold" style="font-size:.9rem">${ADMIN_NAME}</div>
          <div class="text-secondary" style="font-size:.78rem">${ADMIN_ROLE}</div>
        </div>
        <a href="../index.html" title="View website" class="nav-icon-btn" style="width:34px;height:34px">↗</a>
        <a href="../login.html" title="Log out" class="nav-icon-btn" style="width:34px;height:34px"><i class="fa-solid fa-power-off"></i></a>
      </div>
    </div>
  </aside>
  `;

  var TOPBAR_TEMPLATE = `
  <header class="admin-topbar" id="admin-topbar">
    <button class="navbar-toggler" type="button" id="admin-menu-btn" aria-label="Toggle menu" style="width:42px;height:42px">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    </button>

    <div class="clay-inset d-none d-md-flex align-items-center gap-2 px-3" style="border-radius:999px;flex:1;max-width:340px">
      <span style="color:var(--pv-muted)"><i class="fa-solid fa-magnifying-glass"></i></span>
      <input type="text" class="form-control form-clay border-0 shadow-none" id="admin-search" placeholder="Search appointments, pets, clients…" style="box-shadow:none!important">
    </div>

    <div class="ms-auto d-flex align-items-center gap-2">
      <button class="nav-icon-btn" type="button" id="theme-toggle" title="Toggle theme" aria-label="Toggle theme">
        <span class="icon-sun"><i class="fa-solid fa-sun"></i></span>
        <span class="icon-moon"><i class="fa-solid fa-moon"></i></span>
      </button>
      <button class="nav-icon-btn" type="button" id="dir-toggle" title="Toggle RTL / LTR" aria-label="Toggle direction">
        <span id="dir-label" class="fw-bold" style="font-size:.78rem">RTL</span>
      </button>
      <button class="nav-icon-btn position-relative" type="button" id="admin-bell" title="Notifications" aria-label="Notifications">
<i class="fa-solid fa-bell"></i>
      </button>
    </div>
  </header>
  `;

  function inject() {
    var sb = document.getElementById("admin-sidebar");
    if (sb) sb.outerHTML = SIDEBAR_TEMPLATE;
    var tb = document.getElementById("admin-topbar");
    if (tb) tb.outerHTML = TOPBAR_TEMPLATE;
    var greet = document.getElementById("admin-greet-name");
    if (greet) greet.textContent = ADMIN_NAME.split(" ")[0];
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

  var PET_EMOJI = { dog: '<i class="fa-solid fa-dog"></i>', cat: '<i class="fa-solid fa-cat"></i>', rabbit: '<i class="fa-solid fa-paw"></i>', bird: '<i class="fa-solid fa-dove"></i>' };

  function appointmentRow(a) {
    return (
      '<tr data-id="' + a.id + '">' +
        '<td><div class="d-flex align-items-center gap-2"><span style="font-size:1.3rem">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw"></i>') + '</span><div><div class="fw-bold">' + escapeHtml(a.petName) + '</div><div class="text-secondary" style="font-size:.8rem">' + escapeHtml(a.breed) + '</div></div></div></td>' +
        '<td><div class="fw-bold">' + escapeHtml(a.client) + '</div><div class="text-secondary" style="font-size:.8rem">' + escapeHtml(a.email) + '</div></td>' +
        '<td><div class="fw-bold">' + a.packageLabel + '</div><div class="text-secondary" style="font-size:.8rem">$' + a.price + '</div></td>' +
        '<td>' + a.date + '<div class="text-secondary" style="font-size:.8rem">' + a.time + '</div></td>' +
        '<td>' + escapeHtml(a.groomer) + '</td>' +
        '<td>' + statusBadge(a.status) + '</td>' +
        '<td class="text-end"><div class="dropdown">' +
          '<button class="btn-clay-outline btn-sm" data-bs-toggle="dropdown">⋯</button>' +
          '<ul class="dropdown-menu dropdown-menu-end">' +
            '<li><a class="dropdown-item" href="#" data-action="confirm"><i class="fa-solid fa-check"></i> Confirm</a></li>' +
            '<li><a class="dropdown-item" href="#" data-action="complete"><i class="fa-solid fa-check-double"></i> Complete</a></li>' +
            '<li><a class="dropdown-item text-danger" href="#" data-action="cancel"><i class="fa-solid fa-xmark"></i> Cancel</a></li>' +
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
                '<td><span style="font-size:1.2rem">' + (PET_EMOJI[a.pet] || '<i class="fa-solid fa-paw"></i>') + '</span> <span class="fw-bold">' + escapeHtml(a.petName) + '</span></td>' +
                '<td>' + a.packageLabel + '</td>' +
                '<td>$' + a.price + '</td>' +
                '<td>' + a.date + '</td>' +
                '<td>' + statusBadge(a.status) + '</td>' +
                '<td class="text-end"><button class="btn-clay btn-sm" data-invoice="' + a.id + '"><i class="fa-solid fa-file-invoice"></i> Invoice</button></td>' +
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
        var q = search.value.toLowerCase();
        document.querySelectorAll("tbody tr[data-id]").forEach(function (tr) {
          tr.style.display = tr.textContent.toLowerCase().indexOf(q) !== -1 ? "" : "none";
        });
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
    renderAppointments();
    bindBooking();
    bindPrint();
    bindTables();
    bindMessages();
    bindAdminUtility();
    bindCustomerPagination();
  }

  function bindAdminUtility() {
    var settings = document.querySelector('[data-nav="settings"]');
    if (settings) settings.addEventListener("click", function (e) {
      e.preventDefault();
      PawPopup({
        icon: '<i class="fa-solid fa-gear"></i>',
        title: "Salon settings",
        content: "<p>Opening hours, grooming availability and notification preferences can be managed here. Your current demo settings:</p><ul style='margin:0'><li>Mon–Sat 8AM–7PM, Sun 9AM–4PM</li><li>New-appointment notifications: on</li><li>Client reminders: 24h before appointment</li></ul>",
        wide: true
      });
    });
    var help = document.querySelector('[data-nav="help"]');
    if (help) help.addEventListener("click", function (e) {
      e.preventDefault();
      PawPopup({
        icon: '<i class="fa-solid fa-circle-question"></i>',
        title: "Help Center",
        content: "<p>Need a hand? Try these:</p><ul style='margin:0'><li>Managing appointments — Appointments page</li><li>Client questions — Messages page</li><li>Booking issues — open the booking form on the Dashboard</li><li>Email us at hello@pawville.com anytime</li></ul>",
        wide: true
      });
    });
    var bell = document.getElementById("admin-bell");
    if (bell) bell.addEventListener("click", function () {
      PawPopup({
        icon: '<i class="fa-solid fa-bell"></i>',
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
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:1200;background:rgba(18,22,28,0.5);" +
      "backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:18px;";
    overlay.innerHTML =
      '<div style="background:#fff;color:#1f2429;border:3px solid #1f2429;border-radius:22px;' +
      'box-shadow:8px 8px 0 rgba(31,36,41,0.28);padding:28px 30px;max-width:420px;width:100%;' +
      'font-family:\'Plus Jakarta Sans\',sans-serif">' +
        '<div style="text-align:center;font-size:40px;line-height:1"><i class="fa-solid fa-user-plus"></i></div>' +
        '<div style="text-align:center;font-weight:700;font-size:1.15rem;margin-top:8px">Add a new customer</div>' +
        '<form id="add-customer-form" style="margin-top:14px">' +
          '<div style="margin-bottom:10px"><label style="display:block;font-weight:700;font-size:.85rem;margin-bottom:4px">Full name</label>' +
          '<input name="name" required placeholder="e.g. Rachel H." style="width:100%;padding:9px 12px;border:2px solid #e2e2e2;border-radius:12px;font-family:inherit"></div>' +
          '<div style="margin-bottom:10px"><label style="display:block;font-weight:700;font-size:.85rem;margin-bottom:4px">Email</label>' +
          '<input type="email" name="email" required placeholder="e.g. rachel@email.com" style="width:100%;padding:9px 12px;border:2px solid #e2e2e2;border-radius:12px;font-family:inherit"></div>' +
          '<div style="margin-bottom:10px"><label style="display:block;font-weight:700;font-size:.85rem;margin-bottom:4px">Phone (10 digits)</label>' +
          '<input name="phone" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" required placeholder="e.g. 5550102030" style="width:100%;padding:9px 12px;border:2px solid #e2e2e2;border-radius:12px;font-family:inherit">' +
          '<div id="phone-err" style="display:none;color:#85481f;font-size:.8rem;font-weight:700;margin-top:4px">Phone must be exactly 10 digits.</div></div>' +
          '<div style="display:flex;gap:10px;margin-top:16px">' +
            '<button type="button" class="btn-clay-outline" style="flex:1" id="add-customer-cancel">Cancel</button>' +
            '<button type="submit" class="btn-clay" style="flex:1">Add customer</button>' +
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
      document.getElementById("phone-err").style.display = "none";
    });
    document.getElementById("add-customer-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);
      var name = (fd.get("name") || "").trim();
      var email = (fd.get("email") || "").trim().toLowerCase();
      var phone = (fd.get("phone") || "").trim();
      if (!name || !email) return;
      if (!/^\d{10}$/.test(phone)) {
        document.getElementById("phone-err").style.display = "block";
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
          '<td><div class="d-flex align-items-center gap-3"><div class="clay-avatar sm"><img src="../assets/images/ava-admin-default.jpg" alt=""></div>' +
          '<div><div class="fw-bold">' + escapeHtml(name) + '</div><div class="text-secondary" style="font-size:.8rem">' + escapeHtml(email) + '</div></div></div></td>' +
          '<td><span style="font-size:1.1rem"><i class="fa-solid fa-paw"></i></span> —</td>' +
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
    function getRows() {
      return Array.prototype.slice.call(tbody.querySelectorAll("tr"));
    }
    function render() {
      var rows = getRows();
      var total = Math.max(1, Math.ceil(rows.length / PER_PAGE));
      if (page > total) page = total;
      rows.forEach(function (r) { r.classList.add("d-none"); });
      rows.slice((page - 1) * PER_PAGE, page * PER_PAGE).forEach(function (r) { r.classList.remove("d-none"); });
      var html =
        '<li class="page-item"><a class="btn-clay-outline" href="#" data-page="' + (page - 1) + '" style="padding:.5rem 1rem">← Prev</a></li>';
      for (var p = 1; p <= total; p++) {
        html += '<li class="page-item"><a class="' + (p === page ? "btn-clay" : "btn-clay-outline") + '" href="#" data-page="' + p + '" style="padding:.5rem 1rem">' + p + '</a></li>';
      }
      html += '<li class="page-item"><a class="btn-clay-outline" href="#" data-page="' + (page + 1) + '" style="padding:.5rem 1rem">Next »</a></li>';
      pager.innerHTML = html;
      var nav = pager.closest("nav");
      if (nav) nav.classList.toggle("d-none", total <= 1);
    }
    pager.addEventListener("click", function (e) {
      var a = e.target.closest("[data-page]");
      if (!a) return;
      e.preventDefault();
      var p = parseInt(a.getAttribute("data-page"), 10);
      var total = Math.max(1, Math.ceil(getRows().length / PER_PAGE));
      if (p < 1 || p > total) return;
      page = p;
      render();
    });
    customerPagerRefresh = render;
    render();
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
