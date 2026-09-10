/* ==========================================================================
   PAWVILLE — blog-details.js
   --------------------------------------------------------------------------
   Renders the dynamic blog detail page (blog-details.html?post=slug).
   Reads data from window.PawBlogs (blog-data.js) and fills the page
   skeleton. Defaults to the first post when no valid slug is given.
   Load AFTER blog-data.js.
   ========================================================================== */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function slug() {
    var s = (new URLSearchParams(window.location.search).get("post") || "").toLowerCase().trim();
    return window.PawBlogs && window.PawBlogs[s] ? s : Object.keys(window.PawBlogs)[0];
  }

  function buildBody(blocks) {
    return blocks.map(function (b) {
      if (b.q) return '<blockquote>' + b.q + "</blockquote>";
      return "<h2>" + esc(b.h) + "</h2><p>" + b.p + "</p>";
    }).join("");
  }

  function render() {
    if (!window.PawBlogs) return;
    var post = PawBlogs[slug()];

    var set = function (id, val) { var el = document.getElementById(id); if (el && val != null) el.textContent = val; };

    set("blog-crumb", post.category);
    set("blog-eyebrow", post.eyebrow);
    set("blog-title", post.title);
    document.title = post.title + " — PawVille Blog";
    set("blog-date", "📅 " + post.date);
    set("blog-read", "⏱ " + post.readTime);
    set("blog-comments", "💬 " + post.comments);

    var author = post.author || {};
    var initial = (author.name || "P").trim().charAt(0).toUpperCase() || "P";
    var av = document.getElementById("blog-author-avatar");
    if (av) av.textContent = initial;
    set("blog-author-name", author.name || "");
    set("blog-author-role", author.role || "");

    var img = document.getElementById("blog-hero-img");
    if (img) { img.src = post.image; img.alt = post.alt || post.title; }

    set("blog-lead", post.lead);
    var article = document.getElementById("blog-article");
    if (article) article.innerHTML = buildBody(post.body || []);

    var tagCloud = document.getElementById("blog-tags");
    if (tagCloud) {
      tagCloud.innerHTML = (post.tags || []).map(function (t) {
        return '<a href="#">' + esc(t) + "</a>";
      }).join("");
    }

    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", post.excerpt || post.lead);
    var ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) ogt.setAttribute("content", post.title + " — PawVille Blog");
    var ogi = document.querySelector('meta[property="og:image"]');
    if (ogi) ogi.setAttribute("content", post.image);

    /* Author box */
    set("author-box-name", author.name || "");
    set("author-box-role", author.role || "");
    set("author-box-bio", author.bio || "");
    var abAv = document.getElementById("author-box-avatar");
    if (abAv) abAv.textContent = initial;

    /* Sidebar: recent posts (all other posts) */
    var recent = document.getElementById("blog-recent");
    if (recent) {
      recent.innerHTML = Object.keys(PawBlogs).filter(function (k) { return k !== slug(); }).slice(0, 3).map(function (k) {
        var p = PawBlogs[k];
        return (
          '<a href="blog-details.html?post=' + k + '" class="d-flex gap-3 align-items-center">' +
            '<div class="blog-thumb rounded-4 overflow-hidden flex-shrink-0" style="width:74px;height:58px"><img src="' + esc(p.image) + '" alt=""></div>' +
            '<div><div class="fw-bold" style="font-size:.9rem;line-height:1.3;color:var(--pv-text)">' + esc(p.title) + '</div>' +
            '<div class="text-secondary" style="font-size:.78rem">' + esc(p.date) + "</div></div>" +
          "</a>"
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
