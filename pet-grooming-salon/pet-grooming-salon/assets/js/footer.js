/* ==========================================================================
   PAWVILLE — footer.js
   --------------------------------------------------------------------------
   Injects the shared footer into any element with id="footer".
   Edit the FOOTER_TEMPLATE string below to change the footer on ALL pages.
   Load this file AFTER main.js at the end of <body>.
   ========================================================================== */

(function () {
  "use strict";

  var LOGO = "assets/images/logo.png";

  var FOOTER_TEMPLATE = `
  <footer class="pv-footer">
    <div class="pv-container">
      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <a class="footer-brand d-inline-flex align-items-center gap-1 mb-3" href="index.html">
            <img src="${LOGO}" alt="PawVille logo" style="width:44px;height:44px">
            <span>PawVille</span>
          </a>
          <p class="text-secondary mb-4 pe-lg-5">Pampered paws, happy hearts. A fresh, friendly grooming &amp; care studio for every pet — right here in your neighborhood.</p>
          <div class="social-row mb-4">
            <a href="https://www.facebook.com/login/" target="_blank" rel="noopener" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H17V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.3H7.9V13h2.7v8z"/></svg></a>
            <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg></a>
            <a href="https://x.com/i/flow/login" target="_blank" rel="noopener" aria-label="X"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.7 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21h-3l7.1-8.1L2 3h6.3l4.3 5.7zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg></a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 3.6 12 3.6 12 3.6h0s-4.6 0-7.7.3c-.5.1-1.5.1-2.4 1C1.2 5.6 1 7.2 1 7.2S.8 9.1.8 11v1.8C.8 14.6 1 16.5 1 16.5s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.3 7.6.3s4.6 0 7.7-.4c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.6V11c0-1.9-.2-3.8-.2-3.8zM9.8 15V8.4l6 3.3z"/></svg></a>
          </div>
          <p class="mb-0 text-secondary">🐾️ Certified &amp; insured · Loving pet care since 2012</p>
        </div>

        <div class="col-lg-2 col-md-6 col-6">
          <h5 class="footer-title">Quick Links</h5>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="groomers.html">Our Groomers</a></li>
            <li><a href="pricing.html">Pricing</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6 col-6">
          <h5 class="footer-title">Services</h5>
          <ul class="footer-links">
            <li><a href="services.html">Bath &amp; Brush</a></li>
            <li><a href="services.html">Haircut &amp; Styling</a></li>
            <li><a href="services.html">Nail Trimming</a></li>
            <li><a href="services.html">Ear Cleaning</a></li>
            <li><a href="service-details.html?service=full-groom">Full Groom Packages</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6">
          <h5 class="footer-title">Newsletter</h5>
          <p class="text-secondary">Grooming tips, seasonal offers &amp; pet news — straight to your inbox.</p>
          <form data-newsletter class="d-flex gap-2">
            <input type="email" class="form-control form-clay" placeholder="Your email" required aria-label="Email address">
            <button class="btn-clay btn-sm flex-shrink-0" type="submit">Join</button>
          </form>
          <div class="mt-4 d-flex flex-column gap-2 text-secondary">
            <span>📍 24 Wagtail Lane, Pet District</span>
            <span>📞 +1 (555) 012-3456</span>
            <span>✉️ hello@pawville.com</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span>© <span id="year">2025</span> PawVille. Crafted with 🧡 for pets &amp; their humans.</span>
        <div class="d-flex gap-4">
          <a href="#" class="text-secondary" data-policy="privacy">Privacy Policy</a>
          <a href="#" class="text-secondary" data-policy="terms">Terms of Service</a>
          <a href="#" class="text-secondary" data-policy="refund">Refund Policy</a>
        </div>
      </div>
    </div>
  </footer>
  `;

  var POLICIES = {
    privacy: {
      title: "Privacy Policy",
      body: "Your privacy matters to PawVille. We only collect what you share with us — name, email, and booking details — to provide grooming services, send appointment reminders, and share occasional pet-care tips. We never sell your personal data. Cookies help the site remember your theme and language preferences. You can request deletion of your data at any time by emailing hello@pawville.com."
    },
    terms: {
      title: "Terms of Service",
      body: "By using the PawVille website and services, you agree to provide accurate information when booking, treat our groomers and staff with respect, and keep pets leashed in the waiting area. Prices, services, and availability may change without notice. Appointments must be canceled at least 24 hours in advance to avoid a cancellation fee."
    },
    refund: {
      title: "Refund Policy",
      body: "Not happy with your pet's groom? We offer a free touch-up within 72 hours of service. Full refunds are available for services canceled at least 24 hours before the appointment. No-shows and same-day cancellations are non-refundable. For package purchases, unused sessions are refundable on request."
    }
  };

  function render() {
    var host = document.getElementById("footer");
    if (host) {
      host.innerHTML = FOOTER_TEMPLATE;
      var yearEl = host.querySelector("#year");
      if (yearEl) yearEl.textContent = new Date().getFullYear();
      host.querySelectorAll("[data-policy]").forEach(function (a) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          var p = POLICIES[a.getAttribute("data-policy")];
          if (p && window.PawPopup) {
            PawPopup({ icon: "🐾️", title: p.title, content: p.body, wide: true });
          }
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
