# Static Portfolio (HTML / CSS / JavaScript)

<p align="center">
  <img
    src="https://raw.githubusercontent.com/iSev7n/Dark-Portfolio/refs/heads/main/assets/projects/dark-portfolio.png"
    alt="Dark Portfolio Preview"
    width="800"
  />
</p>

A fast, offline-capable personal portfolio built with **vanilla web technologies**.  
No frameworks, no build step — designed for clarity, longevity, and control.

This site functions as both a portfolio and a long-form writing platform.

---

## Features

- Centered hero with avatar, greeting, and social icons  
- Tab-based navigation (About, Work, Projects, Posts, Music)  
- Projects grid with detailed descriptions  
- Posts index with:
  - Sorting (newest, oldest, title)
  - Live filtering
  - Reading-time estimates  
- Docs-style post view:
  - Left sidebar tree grouped by year
  - Markdown-rendered content
  - Embedded images inside posts  
- Offline-first friendly (static assets only)  
- Dark / light theme toggle  
- RSS feed for posts (`rss.xml`)  

---

## Tech Stack

- HTML5  
- CSS (custom properties, responsive layout)  
- Vanilla JavaScript  
- Custom lightweight Markdown parser  
- Static JSON content (no backend)  

---

## Local Development

Run a local server (required for fetch and routing):

```bash
python -m http.server 5173
```

Then open:

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
│   └── base.css
│
├── js/
│   ├── ui.js
│   ├── data.js
|   ├── icons.js
|   ├── layout.js
│   ├── markdown.js
│   ├── config.js
│   └── pages/
│       ├── posts.js
│       ├── post.js
│       ├── projects.js
|       ├── work.js
|       ├── experience.js
│       ├── about.js
│       └── music.js
│
├── content/
│   └── posts.json
│
└── assets/
    ├── favicon_io/
    ├── posts/
    └── projects/
    
```

---

## Content Management

### Posts

All writing lives in:

```
content/posts.json
```

Each post supports:
- Title, slug, date, tags
- Summary
- Full Markdown body
- Embedded images via Markdown links

Example:

```md
[Post Image](/assets/posts/example.jpg)
*Figure 1. Caption text.*
```

---

## Configuration

Edit site-wide values in:

```
js/config.js
```

Includes:
- Name and tagline
- Social links
- “Now Playing” music metadata
- Theme defaults

---

## Hosting

This site is designed to be hosted as **static files**.

Works well on:
- Namecheap shared hosting
- GitHub Pages
- Netlify
- Cloudflare Pages

No server-side code required.

---

## Philosophy

- Predictable UI over clever abstractions  
- Offline-first by default  
- Systems thinking applied to frontend architecture  
- Calm, readable software that ages well  

---

## License

Personal portfolio.  
Reuse structure with attribution if referenced.
