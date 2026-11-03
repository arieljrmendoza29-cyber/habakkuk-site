# Habakkuk Management LLC: Website

**Reliable Management. Lasting Value.**

Official website for Habakkuk Management LLC, a property management company in Milwaukee, Wisconsin, established in 2018.

Live site: https://habakkukmanagementllc.com

## Overview

A fast, static, five-page website with no build step and no dependencies. It works on phones, tablets and desktops.

| Page                | Content                                                                 |
|---------------------|-------------------------------------------------------------------------|
| `index.html`        | Home: hero with photo and sign, rolling stats, service overview, owner and tenant links |
| `about.html`        | Company story, core values, stats, leadership                          |
| `services.html`     | Six expandable service cards, Additional Services, and a "How It Works" process |
| `properties.html`   | Property types, owner and tenant calls to action, rental availability  |
| `contact.html`      | Phone, fax, email, office, inquiry form and full-width map             |
| `privacy.html`      | Privacy Policy, linked from every footer and under both forms          |

Every page shares the same header and footer. If you change one of those, make the same change on all six pages. The popup lives only in `index.html`.

Links such as `contact.html?role=Tenant` preselect "I'm a" on the contact form, and links such as `services.html#commercial` open that service card.

## Project structure

```
.
├── index.html        # Home
├── about.html        # About Us
├── services.html     # Services
├── properties.html   # Properties
├── contact.html      # Contact Us + map
├── privacy.html      # Privacy Policy
├── styles.css        # Brand styles and responsive layout
├── script.js         # Menu, animations, contact form
├── 404.html          # Not-found page (GitHub Pages)
├── assets/
│   ├── logo.png            # Primary logo
│   ├── quinn-goodlow-meeting.webp   # Photo of Quinn with clients
│   └── favicon.svg         # Logo mark icon
├── CNAME             # Custom domain for GitHub Pages
├── robots.txt
└── sitemap.xml
```

## Brand system

| Token       | Value     | Use                          |
|-------------|-----------|------------------------------|
| Deep Navy   | `#002D62` | Headings, header, footer     |
| Brick Red   | `#C41E3A` | Buttons, accents, rules      |
| Slate Gray  | `#606060` | Secondary text               |
| Light Mist  | `#F5F5F5` | Tinted sections, form fields |

- **Headings:** Cinzel (a free web stand-in for Trajan)
- **Body:** Open Sans
- **Logo:** the roofline and wordmark are drawn as inline SVG in `index.html`

## Motion

| Interaction   | Behavior                                       |
|---------------|------------------------------------------------|
| Button press  | Sinks to 95%, then springs back                |
| Rolling stats | Digits roll into place, 100 ms apart           |
| Service cards | Expand with ease-out (fast, then slow) over 350 ms |
| Form success  | Circle draws first, then the tick, 470 ms total |

All motion is turned off for visitors who set "reduce motion" on their device.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy with GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**, set **Source** to *Deploy from a branch*, then pick `main` and `/ (root)`.
3. At your domain registrar, point `habakkukmanagementllc.com` to GitHub Pages:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www`: `<your-github-username>.github.io`
4. Back in **Settings → Pages**, confirm the custom domain and tick **Enforce HTTPS**.

## Setup checklist

- [ ] **Activate email delivery (one time):** the contact form and the popup send directly to `QuinnGoodlow@habakkukmanagementllc.com` through [FormSubmit](https://formsubmit.co). After the site is live, send one test message. FormSubmit then emails an **activation link** to that inbox. Click it, and every later submission arrives in the inbox.
- [ ] **Services:** confirm the service details match what the company offers.
- [ ] **Privacy Policy:** have a qualified legal professional review `privacy.html`, and set the Effective and Last Updated dates at the top of the page.
- [ ] **Testimonials:** use only real client reviews, with each client's permission to show their name.

## Popup

A "Free Property Consultation" popup opens on the **home page only**, **6 seconds after every load**, including each refresh. To change the delay, edit `POPUP_DELAY` in `script.js` (in milliseconds). Visitors can close it with ×, the Esc key, or by clicking outside it.

## Images

| File                       | Used for                          |
|----------------------------|-----------------------------------|
| `assets/logo.png`          | Brushed-metal sign, popup         |
| `assets/quinn-goodlow-meeting.webp` | Home page hero, Leadership section (About) |
| `assets/favicon.svg`       | Browser tab icon                  |

## Contact

Habakkuk Management LLC
313 N Plankinton Avenue, STE 207, Milwaukee, WI 53203
Phone 414-374-5062 · Fax 414-374-5067
QuinnGoodlow@habakkukmanagementllc.com

© Habakkuk Management LLC. All rights reserved.
