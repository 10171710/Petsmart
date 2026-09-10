/* ==========================================================================
   PAWVILLE — navbar.js
   --------------------------------------------------------------------------
   Injects the shared public navigation bar into any element with id="navbar".
   Edit the NAV_TEMPLATE string below to change the nav across ALL pages at once.
   Includes: brand, links, dark/light toggle, RTL/LTR toggle, CTA buttons.
   Load this file AFTER main.js at the end of <body>.
   ========================================================================== */

(function () {
  "use strict";

  var LOGO = "assets/images/logo.png";

  var NAV_TEMPLATE = `
  <nav class="navbar navbar-expand-lg fixed-top pv-navbar">
    <div class="pv-container w-100 d-flex flex-wrap align-items-center gap-2">
      <a class="navbar-brand me-auto me-lg-2" href="index.html">
        <img src="${LOGO}" alt="PawVille logo">
        <span>PawVille</span>
      </a>

      <div class="collapse navbar-collapse order-lg-0" id="pvMainNav">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-nav="home" role="button" data-bs-toggle="dropdown" aria-expanded="false">Home</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="index.html" data-nav="home">General Landing</a></li>
              <li><a class="dropdown-item" href="home-pet-care.html" data-nav="home">Pet Grooming &amp; Care</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link" href="about.html" data-nav="about">About</a></li>
          <li class="nav-item"><a class="nav-link" href="services.html" data-nav="services">Services</a></li>
          <li class="nav-item"><a class="nav-link" href="groomers.html" data-nav="groomers">Groomers</a></li>
          <li class="nav-item"><a class="nav-link" href="pricing.html" data-nav="pricing">Pricing</a></li>
          <li class="nav-item"><a class="nav-link" href="blog.html" data-nav="blog">Blog</a></li>
          <li class="nav-item"><a class="nav-link" href="contact.html" data-nav="contact">Contact</a></li>
          <li class="nav-item d-lg-none mt-2"><a class="nav-link fw-semibold btn-clay text-center" href="login.html" id="nav-mobile-login">Login</a></li>
        </ul>
      </div>

      <div class="d-flex align-items-center gap-2 order-lg-last ms-lg-2">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#pvMainNav" aria-controls="pvMainNav" aria-expanded="false" aria-label="Toggle navigation">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <button class="nav-icon-btn" type="button" id="theme-toggle" title="Toggle dark / light mode" aria-label="Toggle theme">
          <span class="icon-sun"><i class="fa-solid fa-sun"></i></span>
          <span class="icon-moon"><i class="fa-solid fa-moon"></i></span>
        </button>
        <button class="nav-icon-btn d-none d-sm-inline-grid" type="button" id="dir-toggle" title="Toggle RTL / LTR layout" aria-label="Toggle direction">
          <span id="dir-label" class="fw-bold" style="font-size:.78rem">RTL</span>
        </button>
        <a class="btn-clay btn-sm d-none d-md-inline-flex" href="login.html">Login</a>
        <a class="btn-clay btn-sm d-none d-xl-inline-flex" href="pricing.html">Book Now</a>
      </div>
    </div>
  </nav>
  `;

  function render() {
    var host = document.getElementById("navbar");
    if (host) host.innerHTML = NAV_TEMPLATE;
    var session = window.PawSession && window.PawSession.get();
    if (host && session) {
      var loginLink = host.querySelector('.btn-clay[href="login.html"]');
      if (loginLink) {
        loginLink.textContent = session.role === "admin" ? "Admin" : "My Account";
        loginLink.href = session.role === "admin" ? "admin/index.html" : "account/index.html";
      }
      var mobileLogin = host.querySelector("#nav-mobile-login");
      if (mobileLogin) {
        mobileLogin.textContent = session.role === "admin" ? "Admin" : "My Account";
        mobileLogin.href = session.role === "admin" ? "admin/index.html" : "account/index.html";
      }
    }
    if (window.PawMarkActiveNav) window.PawMarkActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
