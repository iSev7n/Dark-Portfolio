# Static Portfolio (HTML / CSS / JavaScript)

<p align="center">
  <img
    src="https://raw.githubusercontent.com/iSev7n/Dark-Portfolio/refs/heads/main/assets/projects/dark-portfolio.png"
    alt="Dark Portfolio Preview"
    width="800"
  />
</p>

A fast, offline-capable personal portfolio built with **vanilla web technologies**.  
No frameworks. No build step. Designed for clarity, longevity, and control.

This site functions as both a portfolio and a long-form writing platform.

---

## Features

- Centered hero with avatar, greeting, and social icons  
- Tab-based navigation (About, Work, Projects, Posts, Music)  
- Projects grid with detailed descriptions  
- Posts system powered by individual Markdown files:
  - Sorted dynamically
  - Live filtering
  - Reading-time estimates  
  - Docs-style post layout with year-grouped sidebar  
- Custom lightweight Markdown parser  
- Embedded images inside posts  
- Offline-first friendly (static assets only)  
- Dark / light theme toggle  
- RSS feed (`rss.xml`)  

---

## Tech Stack

- HTML5  
- CSS (custom properties, responsive layout)  
- Vanilla JavaScript  
- Custom Markdown renderer  
- File-based content system (`.md` posts)  

No backend. No framework. No build tooling.

---

## Local Development

Run a local server (required for `fetch` and routing):

```bash
python -m http.server 5173
```

Open:

```
http://localhost:5173
```

---

## Project Structure

```
/
├── index.html
├── posts.html
├── post.html
├── projects.html
├── experience.html
├── music.html
├── work.html
├── rss.xml
│
├── css/
│   ├── base.css
│   └── pages/
│       ├── music.css
│       ├── post.css
│       ├── posts.css
│       └── projects.css
│
├── js/
│   ├── ui.js
│   ├── data.js
│   ├── icons.js
│   ├── layout.js
│   ├── markdown.js
│   ├── config.js
│   └── pages/
│       ├── posts.js
│       ├── post.js
│       ├── projects.js
│       ├── work.js
│       ├── experience.js
│       ├── about.js
│       └── music.js
│
├── content/
│   └── posts/
│       ├── post_1.md
│       ├── post_2.md
│       └── ...
│
└── assets/
    ├── favicon_io/
    ├── posts/
    └── projects/
```

---

## Content System

### Posts

All writing lives in:

```
content/posts/*.md
```

Each post includes metadata (title, slug, date, tags) and full Markdown content.

This file-based approach allows:

- Clean Git diffs  
- Better scalability  
- Easier long-form writing  
- No centralized JSON bottleneck  

---

## Configuration

Edit site-wide values in:

```
js/config.js
```

Includes:

- Identity and tagline  
- Social links  
- Music integration  
- Theme defaults  

---

## Hosting

Designed for static hosting:

- GitHub Pages  
- Netlify  
- Cloudflare Pages  
- Shared hosting  

No server-side runtime required.

---

## Philosophy

- Predictable UI over clever abstractions  
- Long-term maintainability over trend adoption  
- Systems thinking applied to frontend architecture  
- Calm, readable software that ages well  

---

## License

Personal portfolio project.  
Structure may be reused with attribution.
