/* ==========================================================================
   PAWVILLE — main.js
   --------------------------------------------------------------------------
   Handles: theme (dark/light) toggle, RTL/LTR toggle, active nav state,
            reveal animations, counters, back-to-top, forms, countdown,
            animated background orbs + cursor glow.
   Depends on: navbar.js, footer.js (both must be loaded BEFORE this file)
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_THEME = "pv-theme";
  var STORAGE_DIR = "pv-dir";

  /* ------------------------------------------------------------------
     THEME + DIR (shared helpers used by navbar.js & admin.js)
  ------------------------------------------------------------------ */
  window.PawTheme = {
    apply: function (theme) {
      var root = document.documentElement;
      root.setAttribute("data-bs-theme", theme);
      try { localStorage.setItem(STORAGE_THEME, theme); } catch (e) {}
      var isDark = theme === "dark";
      var icon = document.getElementById("theme-icon");
      if (icon) {
        icon.classList.toggle("icon-sun", isDark);
        icon.classList.toggle("icon-moon", !isDark);
      }
      var label = document.getElementById("theme-label");
      if (label) label.textContent = isDark ? "Light" : "Dark";
      var themeBtns = document.querySelectorAll("#theme-toggle, [data-theme-toggle]");
      themeBtns.forEach(function (btn) {
        btn.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
        btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      });
    },
    current: function () {
      try { return localStorage.getItem(STORAGE_THEME); } catch (e) {}
      return null;
    },
    toggle: function () {
      var cur = document.documentElement.getAttribute("data-bs-theme");
      this.apply(cur === "dark" ? "light" : "dark");
    },
    init: function () {
      var saved = this.current();
      var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.apply(saved || (prefersDark ? "dark" : "light"));
    }
  };

  window.PawDir = {
    /* Bootstrap's default build only mirrors what CSS logical properties
       cover; several core components (dropdown menus, modal offsets, grid
       gutters, form-check spacing) still use physical left/right internally
       and need the dedicated RTL build to avoid overlapping in RTL mode. */
    swapBootstrap: function (dir) {
      var link = document.getElementById("bs-core-css") || document.querySelector('link[href*="bootstrap.min.css"], link[href*="bootstrap.rtl.min.css"]');
      if (!link) return;
      var ltrHref = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
      var rtlHref = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css";
      var next = dir === "rtl" ? rtlHref : ltrHref;
      if (link.getAttribute("href") !== next) link.setAttribute("href", next);
    },
    apply: function (dir) {
      var root = document.documentElement;
      root.setAttribute("dir", dir);
      try { localStorage.setItem(STORAGE_DIR, dir); } catch (e) {}
      var labels = document.querySelectorAll("#dir-label, [data-dir-label]");
      labels.forEach(function (label) {
        label.textContent = dir === "rtl" ? "LTR" : "RTL";
      });
      var dirBtns = document.querySelectorAll("#dir-toggle, [data-dir-toggle]");
      dirBtns.forEach(function (btn) {
        btn.setAttribute("title", dir === "rtl" ? "Switch to LTR layout" : "Switch to RTL layout");
        btn.setAttribute("aria-label", dir === "rtl" ? "Switch to LTR layout" : "Switch to RTL layout");
        btn.classList.toggle("active", dir === "rtl");
      });
      this.swapBootstrap(dir);
      if (dir === "rtl") {
        this.fixDots();
      } else {
        this.stripDots();
      }
    },
    current: function () {
      try { return localStorage.getItem(STORAGE_DIR); } catch (e) {}
      return null;
    },
    toggle: function () {
      var cur = document.documentElement.getAttribute("dir") || "ltr";
      this.apply(cur === "rtl" ? "ltr" : "rtl");
    },
    init: function () {
      var saved = this.current();
      if (saved) {
        this.apply(saved);
      } else {
        this.swapBootstrap(document.documentElement.getAttribute("dir") === "rtl" ? "rtl" : "ltr");
        if (document.documentElement.getAttribute("dir") === "rtl") this.fixDots();
      }
      this.observeDots();
    },

    /* In RTL the bidi algorithm pulls a sentence's terminal dot to the LEFT
       (e.g. ".Pick a date") and detaches a leading number or symbol (e.g.
       "yrs exp.14", "reserved. © 2026"). Inserting an LRM (U+200E) after
       each sentence-ending mark and before leading digits/symbols keeps
       everything LTR-anchored. Harmless in LTR. */
    fixDots: function () {
      if (document.documentElement.getAttribute("dir") !== "rtl") return;
      var LRM = "\u200E";
      var nodes = [];
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (n) {
        var p = n.parentNode;
        if (!p || p.nodeType !== 1 || /^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|TEXTAREA)$/.test(p.nodeName)) return;
        var t = n.textContent;
        if (!t || (t.indexOf(".") === -1 && t.indexOf("?") === -1 && t.indexOf("!") === -1 && t.indexOf("0") === -1 && t.indexOf("1") === -1 && t.indexOf("2") === -1 && t.indexOf("3") === -1 && t.indexOf("4") === -1 && t.indexOf("5") === -1 && t.indexOf("6") === -1 && t.indexOf("7") === -1 && t.indexOf("8") === -1 && t.indexOf("9") === -1)) return;
        var out = "";
        var changed = false;
        var lineStart = true;
        for (var i = 0; i < t.length; i++) {
          var c = t[i];
          if (lineStart && !/\s/.test(c) && c !== LRM && c !== "." && c !== "?" && c !== "!" && !(c >= "A" && c <= "Z") && !(c >= "a" && c <= "z")) {
            out += LRM;
            changed = true;
            lineStart = false;
          } else if (c === LRM) {
            lineStart = false;
          } else if ((c >= "A" && c <= "Z") || (c >= "a" && c <= "z")) {
            lineStart = false;
          }
          out += c;
          if (c === "." || c === "?" || c === "!") {
            var prev = i > 0 ? t[i - 1] : "";
            var next = t[i + 1];
            var ellipsis = prev === ".";
            var decimal = prev >= "0" && prev <= "9";
            var midWord = !!next && /[A-Za-z0-9]/.test(next);
            var already = next === LRM;
            if (!ellipsis && !decimal && !midWord && !already) {
              out += LRM;
              changed = true;
              lineStart = true;
            }
          }
        }
        if (changed) n.textContent = out;
      });
    },
    stripDots: function () {
      var LRM = "\u200E";
      var nodes = [];
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (n) {
        if (n.textContent.indexOf(LRM) === -1) return;
        n.textContent = n.textContent.split(LRM).join("");
      });
    },

    /* Fix dots in content injected after init (navbar, footer, dashboards) */
    observeDots: function () {
      if (this._obs) return;
      var self = this;
      var scheduled = false;
      this._obs = new MutationObserver(function () {
        if (document.documentElement.getAttribute("dir") !== "rtl") return;
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(function () {
          scheduled = false;
          self.fixDots();
        });
      });
      this._obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  };

  /* ------------------------------------------------------------------
     SESSION helper (demo auth: user vs admin)
  ------------------------------------------------------------------ */
  window.PawSession = {
    get: function () {
      try { return JSON.parse(localStorage.getItem("pv-session")); } catch (e) { return null; }
    },
    set: function (obj) {
      try { localStorage.setItem("pv-session", JSON.stringify(obj)); } catch (e) {}
    },
    clear: function () {
      try { localStorage.removeItem("pv-session"); } catch (e) {}
    }
  };

  /* ------------------------------------------------------------------
     TOAST helper
  ------------------------------------------------------------------ */
  window.PawToast = function (message, type) {
    type = type || "success";
    var colors = { success: "#2ec6bd", error: "#85481f", info: "#2ec6bd" };
    var wrap = document.getElementById("pv-toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "pv-toast-wrap";
      wrap.style.cssText =
        "position:fixed;bottom:24px;inset-inline-start:50%;transform:translateX(-50%);" +
        "z-index:1080;display:flex;flex-direction:column;gap:10px;align-items:center;pointer-events:none;";
      document.body.appendChild(wrap);
    }
    var t = document.createElement("div");
    t.textContent = message;
    t.style.cssText =
      "pointer-events:auto;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.95rem;" +
      "color:#fff;background:" + (colors[type] || "#2ec6bd") + ";border-radius:999px;" +
      "padding:12px 22px;box-shadow:0 10px 24px rgba(0,0,0,0.22);animation:toastIn .35s ease;";
    wrap.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .4s ease, transform .4s ease";
      t.style.opacity = "0";
      t.style.transform = "translateY(10px)";
      setTimeout(function () { t.remove(); }, 420);
    }, 2600);
    var style = document.createElement("style");
    style.textContent = "@keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(.95)}to{opacity:1;transform:none}}";
    if (!document.getElementById("pv-toast-style")) { style.id = "pv-toast-style"; document.head.appendChild(style); }
  };

  /* ------------------------------------------------------------------
     POPUP modal helper
  ------------------------------------------------------------------ */
  window.PawPopup = function (opts) {
    opts = opts || {};
    var overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:1200;background:rgba(18,22,28,0.5);" +
      "backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:18px;";
    var box = document.createElement("div");
    box.style.cssText =
      "background:#fff;color:#1f2429;border:3px solid #1f2429;border-radius:22px;" +
      "box-shadow:8px 8px 0 rgba(31,36,41,0.28);padding:30px 34px;text-align:center;" +
      "max-width:360px;width:100%;font-family:'Plus Jakarta Sans',sans-serif;animation:popupIn .3s ease;";
    if (opts.wide) box.style.maxWidth = "540px";
    var bodyHtml =
      '<div style="font-size:42px;line-height:1">' + (opts.icon || '<i class="fa-solid fa-paw"></i>') + "</div>" +
      '<div style="font-weight:700;font-size:1.2rem;margin-top:10px">' + (opts.title || "Done!") + "</div>";
    if (opts.content) {
      bodyHtml += '<div style="margin-top:10px;text-align:start;font-size:0.92rem;line-height:1.65;color:#555;max-height:52vh;overflow-y:auto;padding:0 4px">' + opts.content + "</div>";
    } else if (opts.message) {
      bodyHtml += '<div style="margin-top:6px;color:#6c757d;font-size:0.95rem">' + opts.message + "</div>";
    }
    bodyHtml += '<button type="button" class="btn-clay" style="margin-top:20px;min-width:110px">Okay</button>';
    box.innerHTML = bodyHtml;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    var popStyle = document.createElement("style");
    popStyle.textContent = "@keyframes popupIn{from{opacity:0;transform:scale(.88) translateY(10px)}to{opacity:1;transform:none}}";
    if (!document.getElementById("pv-popup-style")) { popStyle.id = "pv-popup-style"; document.head.appendChild(popStyle); }
    function close() {
      overlay.style.transition = "opacity .25s ease";
      overlay.style.opacity = "0";
      setTimeout(function () { overlay.remove(); }, 260);
    }
    box.querySelector("button").addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function h(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", h); }
    });
  };

  /* ------------------------------------------------------------------
     Active nav link based on current file
  ------------------------------------------------------------------ */
  function markActiveNav() {
    var current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!current || current === "/") current = "index.html";
    document.querySelectorAll(".pv-navbar a[data-nav]").forEach(function (link) {
      var target = (link.getAttribute("data-nav") || "").toLowerCase();
      var isHome = target === "home" && (current === "index.html" || current === "home-pet-care.html");
      var isOther = target !== "home" && current.indexOf(target) === 0;
      if (isHome || isOther) link.classList.add("active");
    });
  }
  window.PawMarkActiveNav = markActiveNav;

  /* ------------------------------------------------------------------
     Reveal on scroll
  ------------------------------------------------------------------ */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Animated counters
  ------------------------------------------------------------------ */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    function animate(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1400;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) { nums.forEach(animate); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animate(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Back to top
  ------------------------------------------------------------------ */
  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 500);
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     Bind theme / dir toggles via event delegation so it works no matter
     when the navbar / admin topbar are injected.
  ------------------------------------------------------------------ */
  function bindToggles() {
    document.addEventListener("click", function (e) {
      var target = e.target;
      var themeBtn = target.closest ? target.closest("#theme-toggle") : null;
      if (themeBtn) {
        e.preventDefault();
        PawTheme.toggle();
        return;
      }
      var dirBtn = target.closest ? target.closest("#dir-toggle") : null;
      if (dirBtn) {
        e.preventDefault();
        PawDir.toggle();
      }
    });
  }

  /* ------------------------------------------------------------------
     Countdown (coming soon)
  ------------------------------------------------------------------ */
  function initCountdown() {
    var el = document.getElementById("countdown");
    if (!el) return;
    var target = new Date(el.getAttribute("data-target") || new Date(Date.now() + 21 * 86400000).toISOString());
    function tick() {
      var diff = target - new Date();
      if (diff < 0) diff = 0;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      el.querySelectorAll("[data-cd]").forEach(function (box) {
        var v = box.getAttribute("data-cd");
        var n = v === "d" ? d : v === "h" ? h : v === "m" ? m : s;
        box.textContent = String(n).padStart(2, "0");
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------
     Generic forms: contact + newsletter (demo handlers)
  ------------------------------------------------------------------ */
  function initForms() {
    var contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = contactForm.querySelector("button[type='submit']");
        btn.disabled = true; btn.innerHTML = "Sending...";
        setTimeout(function () {
          btn.disabled = false; btn.innerHTML = "Send Message";
          contactForm.reset();
          PawToast("Message sent! We'll bark back soon.", "success");
        }, 900);
      });
    }
    document.addEventListener("submit", function (e) {
      var f = e.target.closest ? e.target.closest("[data-newsletter]") : null;
      if (!f) return;
      e.preventDefault();
      f.reset();
      PawPopup({
        icon: '<i class="fa-solid fa-circle-check"></i>',
        title: "Subscribed!",
        message: "Thanks for joining - paw-some grooming tips are on the way."
      });
    });
    var authForms = document.querySelectorAll("[data-auth]");
    authForms.forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var btn = f.querySelector("button[type='submit']");
        var mode = f.getAttribute("data-auth");
        var origin = new URLSearchParams(window.location.search).get("redirect");
        if (mode === "register") {
          var fd = new FormData(f);
          var email = (fd.get("email") || "").trim().toLowerCase();
          var name = ((fd.get("first") || "Pet") + " " + (fd.get("last") || "Parent")).replace(/\s+/g, " ").trim();
          var roleInput = f.querySelector('[name="role"]');
          var regRole = roleInput && roleInput.value === "admin" ? "admin" : "user";
          var accounts = [];
          try { accounts = JSON.parse(localStorage.getItem("pv-accounts")) || []; } catch (err) {}
          accounts.push({ name: name, email: email, password: fd.get("pass") || "", role: regRole, phone: "", pets: [] });
          try { localStorage.setItem("pv-accounts", JSON.stringify(accounts)); } catch (err) {}
          PawSession.set({ role: regRole, name: name, email: email });
          if (btn) { btn.disabled = true; btn.innerHTML = "Creating account..."; }
          PawToast(regRole === "admin" ? "Admin account created - welcome aboard!" : "Account created - welcome!");
          setTimeout(function () {
            window.location.href = regRole === "admin" ? "admin/index.html" : "dashboard.html";
          }, 1000);
          return;
        }
        var emailInput = f.querySelector('[name="email"]');
        var loginEmail = (emailInput && emailInput.value) ? String(emailInput.value).trim().toLowerCase() : "demo@pawville.com";
        var passInput = f.querySelector('[name="pass"]');
        var loginPass = (passInput && passInput.value) ? String(passInput.value) : "";
        var roleInput = f.querySelector('[name="role"]');
        var isAdmin = roleInput && roleInput.value === "admin";
        var accounts = [];
        try { accounts = JSON.parse(localStorage.getItem("pv-accounts")) || []; } catch (err) {}
        var match = null;
        for (var i = 0; i < accounts.length; i++) {
          if (accounts[i] && accounts[i].email === loginEmail && (accounts[i].role || "user") === (isAdmin ? "admin" : "user")) {
            match = accounts[i]; break;
          }
        }
        if (match && match.password && match.password !== loginPass) {
          PawPopup({
            icon: '<i class="fa-solid fa-triangle-exclamation"></i>',
            title: "Invalid password",
            message: "The password you entered doesn't match this account. Please try again."
          });
          return;
        }
        var loginName = match ? match.name : (isAdmin ? "Mia Torres" : loginEmail.split("@")[0].replace(/^./, function (c) { return c.toUpperCase(); }));
        PawSession.set({
          role: isAdmin ? "admin" : "user",
          name: loginName,
          email: loginEmail
        });
        if (btn) { btn.disabled = true; btn.innerHTML = "Signing in..."; }
        PawToast("Welcome back!");
        setTimeout(function () {
          window.location.href = origin || (isAdmin ? "admin/index.html" : "dashboard.html");
        }, 1000);
      });
    });
  }

  /* ------------------------------------------------------------------
     Init everything
  ------------------------------------------------------------------ */
  function init() {
    PawTheme.init();
    PawDir.init();
    bindToggles();
    markActiveNav();
    initReveal();
    initCounters();
    initBackToTop();
    initCountdown();
    initForms();

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    var qs = new URLSearchParams(window.location.search);
    if (qs.get("msg")) PawToast(qs.get("msg"), "success");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();