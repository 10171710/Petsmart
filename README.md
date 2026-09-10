# 🐾 PawVille — Pet Grooming & Care Salon Template

A complete, sellable **multipurpose HTML template** for pet grooming & care salons, built with **Bootstrap 5.3**, custom **glassmorphism** styling, dark/light modes and full **RTL/LTR** support.

Perfect for ThemeForest / TemplateMonster listings or direct client projects.

---

## ✨ Features

### Front-End Website
- **Two distinct home pages**
  - `index.html` — modern, general services landing page
  - `home-pet-care.html` — niche page tailored for pet grooming & care salons
- **Standard pages**
  - About Us — mission, vision, team, history timeline, testimonials
  - Services — bath & brush, haircut & styling, nail trimming, ear cleaning, spa & full groom packages by pet size
  - Groomers — staff profile cards with certifications & specialities
  - Pricing — visit plans, membership, day care/boarding pricing, comparison table & FAQ
  - Service Details — includes FAQ accordion, price list & related services sidebar
  - Blog — searchable & filterable list with sidebar widgets
  - Blog Details — full article, author box, comments & sidebar
  - Contact — form, contact info cards, embedded map
  - Login / Register — glass-style auth cards
  - Coming Soon / Maintenance — live countdown + notify form
  - 404 — friendly lost-pet error page

### Admin Dashboard (`admin/`)
- **Dashboard** — stats, weekly chart, quick booking form, upcoming appointments & grooming history
- **Appointments** — manage & filter all orders/appointments, confirm / complete / cancel with live status badges
- **Customers** — client accounts, pets, spend & club membership
- **Messages** — chat-style inbox with reply form
- **Analytics** — SVG line chart, donut charts, top groomers & booking bars

### Dashboard "Customer" flows (on `admin/index.html`)
- Book grooming appointments by selecting **pet type → breed → grooming package** (+ date, time, groomer)
- View **upcoming appointments** with **confirmation status**
- **Grooming history** with past services & dates
- **Download past invoices** via a printable invoice modal

### Design & UX
- ✅ **Glassmorphism UI** — frosted translucent panels, backdrop blur, bright edges & a pastel backdrop; fresh and colorful yet minimal
- ✅ **Bootstrap 5.3** grid + components (accordion, carousel, dropdowns, modal, tables)
- ✅ **Dark & light modes** with a one-click toggle (persisted in `localStorage`)
- ✅ **RTL / LTR toggle** in the navigation bar (Bootstrap-native RTL support)
- ✅ Fully responsive, **mobile-first** for all screen sizes
- ✅ Clean, semantic & **SEO-optimized** markup (meta tags, OG tags, alt text, ARIA labels)
- ✅ **Separate JS files** for the navigation bar and footer for easy reuse & editing
- ✅ Dependency-free demo data — appointments are stored in `localStorage`
- ✅ `prefers-reduced-motion` support & scroll-reveal animations

---

## 🗂 Project Structure

```
pet-grooming-salon/
├── index.html                 # Home 1 — general services landing
├── home-pet-care.html         # Home 2 — pet grooming & care niche page
├── about.html
├── services.html
├── service-details.html
├── groomers.html
├── pricing.html
├── blog.html                  # searchable / filterable list
├── blog-details.html          # post + sidebar
├── contact.html
├── login.html
├── register.html
├── coming-soon.html           # countdown / maintenance
├── 404.html
├── admin/
│   ├── index.html             # dashboard (booking, upcoming, history, invoices)
│   ├── appointments.html
│   ├── customers.html
│   ├── messages.html
│   └── analytics.html
└── assets/
    ├── css/
    │   └── style.css          # full glassmorphism theme (light/dark + RTL)
    ├── js/
    │   ├── main.js            # theme & RTL toggles, reveal, counters, forms…
    │   ├── navbar.js          # shared navigation (edit once)
    │   ├── footer.js          # shared footer (edit once)
    │   └── admin.js           # sidebar/topbar + dashboard logic
    └── images/                # self-contained SVG illustrations
```

---

## 🚀 Getting Started

No build step required.

1. Open the project folder.
2. Double-click `index.html` (or serve it) in any modern browser.
3. To preview the admin dashboard, open `admin/index.html` (also linked from the login page).

> Tip: for the best experience run a tiny local server, e.g. `npx serve .` or VS Code "Live Server".

### Dependencies (CDN)
- **Bootstrap 5.3.3** — `cdn.jsdelivr.net`
- **Google Fonts** — *Plus Jakarta Sans* (display) + *Inter* (body)
- **Font Awesome 6.5.2** — `cdnjs.cloudflare.com` (icons)
- Everything else (illustrations, charts, toggles, booking) is self-contained.

---

## 🎨 Customization

### Navigation & Footer (edit once, applies everywhere)
The nav and footer are **rendered from single files**:
- `assets/js/navbar.js` → edit the `NAV_TEMPLATE` string
- `assets/js/footer.js` → edit the `FOOTER_TEMPLATE` string

### Colors & theming
All design tokens live at the top of `assets/css/style.css`:
- `:root` (light) and `[data-bs-theme="dark"]` blocks
- Change `--pv-primary`, `--pv-secondary`, `--pv-accent`, `--pv-violet`, surfaces and glass shadows.

### Dark / Light mode
- Toggle buttons are in the navbar / admin topbar (`#theme-toggle`).
- Preference is stored in `localStorage` (`pv-theme`) and respects `prefers-color-scheme` on first visit.

### RTL / LTR
- Toggle in the navbar (`#dir-toggle`) flips the `<html dir>` attribute.
- Bootstrap 5.3 handles directional flipping; layout uses logical CSS properties throughout.
- Preference is stored in `localStorage` (`pv-dir`).

### Demo data
- Appointments seeded in the admin dashboard are stored in `localStorage` under `pv-appointments`.
- To start fresh, clear browser storage or call `localStorage.removeItem('pv-appointments')`.

---

## 🖥 Browser Support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Works over `file://` and over HTTP.

---

## 📜 License

Free to use in personal and commercial projects. Credits appreciated, not required.
