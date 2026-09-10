/* ==========================================================================
   PAWVILLE — service-details.js
   --------------------------------------------------------------------------
   Renders the dynamic service detail page (service-details.html?service=slug).
   Reads data from window.PawServices (service-data.js) and fills the page
   skeleton. Defaults to the Full Groom Packages service when no valid slug
   is given. Load AFTER main.js.
   ========================================================================== */
(function () {
  "use strict";

  var ORDER = ["bath-brush", "haircut-styling", "nail-trimming", "ear-cleaning", "spa-wellness", "full-groom"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function slug() {
    var s = (new URLSearchParams(window.location.search).get("service") || "").toLowerCase().trim();
    return window.PawServices && window.PawServices[s] ? s : "full-groom";
  }

  function render() {
    if (!window.PawServices) return;
    var sv = PawServices[slug()];

    var set = function (id, val) { var el = document.getElementById(id); if (el && val != null) el.textContent = val; };

    /* Hero + page meta */
    set("svc-breadcrumb", sv.name);
    set("svc-eyebrow", "Service detail");
    set("svc-title", sv.name);
    set("svc-subtitle", sv.heroSub);
    document.title = sv.name + " — PawVille Pet Grooming & Care Salon";
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", sv.heroSub);
    var og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute("content", sv.name + " — PawVille");

    /* What's included (step cards) */
    set("svc-includes-head", "What's included in " + sv.name);
    var desc = document.getElementById("svc-description");
    if (desc) desc.textContent = sv.description || "";
    var incImg = document.getElementById("svc-includes-img");
    if (incImg && sv.image) {
      incImg.innerHTML =
        '<img src="' + esc(sv.image) + '" alt="' + esc(sv.name) + '" class="w-100 rounded-4" ' +
        'style="aspect-ratio:16/8;object-fit:cover;background:var(--pv-bg-soft);box-shadow:var(--clay-shadow)">';
    }
    var flow = document.getElementById("svc-flow");
    if (flow) {
      flow.innerHTML = sv.includes.map(function (st) {
        return (
          '<div class="col-sm-6">' +
            '<div class="clay-inset p-3 h-100">' +
              '<div class="fw-bold mb-1">' + st.icon + ' ' + esc(st.title) + '</div>' +
              '<div class="text-secondary" style="font-size:.92rem">' + esc(st.text) + '</div>' +
            '</div>' +
          '</div>'
        );
      }).join("");
    }

    /* Pricing */
    set("svc-pricing-title", sv.pricingTitle);
    set("svc-pricing-intro", sv.pricingIntro);
    var table = document.getElementById("svc-pricing-table");
    if (table) {
      table.innerHTML = sv.pricingRows.map(function (r) {
        return (
          '<tr>' +
            '<td><span class="badge-clay ' + esc(r.badge) + '">' + esc(r.name) + '</span></td>' +
            '<td>' + esc(r.detail) + '</td>' +
            '<td>' + esc(r.duration) + '</td>' +
            '<td class="text-end fw-bold">' + esc(r.price) + '</td>' +
          '</tr>'
        );
      }).join("");
    }
    set("svc-pricing-note", sv.pricingNote);

    /* FAQ accordion */
    var faq = document.getElementById("svc-faq");
    if (faq) {
      faq.innerHTML = sv.faqs.map(function (f, i) {
        var first = i === 0;
        return (
          '<div class="accordion-item">' +
            '<h3 class="accordion-header"><button class="accordion-button' + (first ? "" : " collapsed") + '" type="button" data-bs-toggle="collapse" data-bs-target="#svc-faq-' + i + '" aria-expanded="' + first + '">' + esc(f.q) + '</button></h3>' +
            '<div id="svc-faq-' + i + '" class="accordion-collapse collapse' + (first ? " show" : "") + '" data-bs-parent="#svcFaq">' +
              '<div class="accordion-body">' + esc(f.a) + '</div>' +
            '</div>' +
          '</div>'
        );
      }).join("");
    }

    /* Sidebar: quick price list */
    var priceList = document.getElementById("svc-price-list");
    if (priceList) {
      priceList.innerHTML = ORDER.map(function (s) {
        var sv2 = PawServices[s];
        return '<li><a href="service-details.html?service=' + s + '">' + esc(sv2.name) + '</a><span class="text-secondary fw-bold">' + esc(sv2.priceShort) + '</span></li>';
      }).join("");
    }

    /* Sidebar: book CTA */
    var book = document.getElementById("svc-book-btn");
    if (book) {
      book.textContent = sv.bookLabel;
      book.href = sv.bookHref;
    }

    /* Sidebar: related services */
    var related = document.getElementById("svc-related");
    if (related) {
      related.innerHTML = sv.related.map(function (s) {
        var r = PawServices[s];
        if (!r) return "";
        return (
          '<a href="service-details.html?service=' + s + '" class="d-flex align-items-center gap-3 p-2 rounded-4" style="background:var(--pv-bg-soft)">' +
            '<div class="icon-bubble">' + r.icon + '</div>' +
            '<div><div class="fw-bold">' + esc(r.name) + '</div><div class="text-secondary" style="font-size:.85rem">From ' + esc(r.priceShort) + '</div></div>' +
          '</a>'
        );
      }).join("");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
