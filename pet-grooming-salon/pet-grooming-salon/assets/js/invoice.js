/* ==========================================================================
   PAWVILLE — invoice.js
   --------------------------------------------------------------------------
   Shared invoice rendering for the admin dashboard and the customer account
   dashboard. Load AFTER main.js (uses bootstrap.Modal from the bundle).
   Exposes window.PawInvoice.open(appointment, logoPath).
   ========================================================================== */
(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function html(a, logo) {
    logo = logo || "assets/images/logo.png";
    return (
      '<div class="d-flex justify-content-between flex-wrap gap-3 mb-4">' +
        '<div><div class="d-flex align-items-center gap-2"><img src="' + logo + '" style="width:40px;height:40px" alt=""><span class="h5 mb-0 fw-bold">PawVille</span></div>' +
        '<div class="text-secondary mt-2" style="font-size:.85rem">24 Wagtail Lane, Pet District<br>+1 (555) 012-3456 · hello@pawville.com</div></div>' +
        '<div class="text-end"><div class="h5 mb-1 fw-bold">INVOICE</div><div class="text-secondary" style="font-size:.85rem">#' + escapeHtml(a.id) + '</div>' +
        '<div class="text-secondary" style="font-size:.85rem">' + escapeHtml(a.date) + ' · ' + escapeHtml(a.time) + '</div></div></div>' +
      '<div class="row mb-4"><div class="col-sm-6"><div class="text-secondary" style="font-size:.8rem;text-transform:uppercase;letter-spacing:1px">Billed to</div>' +
        '<div class="fw-bold mt-1">' + escapeHtml(a.client) + '</div><div class="text-secondary" style="font-size:.85rem">' + escapeHtml(a.email) + '</div></div>' +
        '<div class="col-sm-6 mt-3 mt-sm-0"><div class="text-secondary" style="font-size:.8rem;text-transform:uppercase;letter-spacing:1px">Service details</div>' +
        '<div class="fw-bold mt-1">' + escapeHtml(a.petName) + ' (' + escapeHtml(a.breed) + ')</div>' +
        '<div class="text-secondary" style="font-size:.85rem">Groomer: ' + escapeHtml(a.groomer) + '</div></div></div>' +
      '<table class="table" style="border-collapse:separate;border-spacing:0 6px"><thead><tr>' +
        '<th class="text-secondary" style="font-size:.75rem;text-transform:uppercase">Description</th>' +
        '<th class="text-secondary text-end" style="font-size:.75rem;text-transform:uppercase">Amount</th></tr></thead><tbody>' +
        '<tr><td class="fw-bold">' + escapeHtml(a.packageLabel) + '</td><td class="text-end fw-bold">$' + escapeHtml(a.price) + '.00</td></tr>' +
        '<tr><td class="text-secondary">VAT (10%)</td><td class="text-end text-secondary">$' + (a.price * 0.1).toFixed(2) + '</td></tr>' +
        '<tr><td class="fw-bold" style="font-size:1.05rem">Total</td><td class="text-end fw-bold" style="font-size:1.1rem">$' + (a.price * 1.1).toFixed(2) + '</td></tr>' +
      '</tbody></table>' +
      '<p class="text-secondary mb-0 mt-3" style="font-size:.85rem">Thank you for choosing PawVille! 🐾️ Please retain this invoice for your records.</p>'
    );
  }

  function open(a, logo) {
    var modalEl = document.getElementById("invoiceModal");
    if (!modalEl) return;
    var fill = document.getElementById("invoice-fill");
    if (fill) fill.innerHTML = html(a, logo);
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  window.PawInvoice = { html: html, open: open };
})();
