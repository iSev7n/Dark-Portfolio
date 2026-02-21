/* ==========================================================================
   js/pages/post.js
   Purpose:
   - Renders a single post in a docs-style layout:
     - Left sidebar tree grouped by year
     - Main article content (title, tags, meta, markdown body)
   Dependencies:
   - Data.getPosts()
   - UI.esc(), UI.fmt()
   - Markdown.toHtml()
   Behavior:
   - If no slug is provided, shows the newest post (posts[0])
   - If slug not found, shows "Not found"

   Upgrades as of FEB2026:
   - Prev/Next navigation (based on date order)
   - Reading time
   - Optional cover image support: post.cover (or post.thumb)
   ========================================================================== */


document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");
  const slug = new URLSearchParams(location.search).get("slug");

  const posts = await Data.getPosts();
  const sorted = posts.slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const post = slug ? sorted.find((p) => p.slug === slug) : sorted[0];

  // Load markdown body from file
let mdBody = "";
try {
  const res = await fetch(`content/posts/${post.slug}.md`);
  if (!res.ok) throw new Error("Missing markdown file");
  mdBody = await res.text();
} catch (err) {
  console.error(err);
  mdBody = "Post content not found.";
}

// Reading time
const wordCount = mdBody.trim().split(/\s+/).filter(Boolean).length;
const minutes = wordCount ? Math.max(1, Math.round(wordCount / 220)) : null;

  if (!post) {
    app.innerHTML = `<div class="content"><h1>Not found</h1></div>`;
    return;
  }

  const idx = sorted.findIndex(p => p.slug === post.slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null; // older
  const next = idx > 0 ? sorted[idx - 1] : null; // newer

  // Sidebar grouped by year
  const byYear = {};
  for (const p of sorted) {
    const y = (p.date || "").slice(0, 4) || "Other";
    (byYear[y] ||= []).push(p);
  }
  Object.values(byYear).forEach((list) =>
    list.sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  );
  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

  const treeHtml = years
    .map((y) => {
      const items = byYear[y]
        .map(
          (p) => `
            <a class="${p.slug === post.slug ? "active" : ""}"
               href="post.html?slug=${encodeURIComponent(p.slug)}">${UI.esc(p.title)}</a>
          `
        )
        .join("");
      return `<div class="year">${UI.esc(y)}</div>${items}`;
    })
    .join("");

  const tags = (post.tags || [])
    .map((t) => `<span class="tag">${UI.esc(String(t).toUpperCase())}</span>`)
    .join("");

  const cover = post.cover || post.thumb || "";
  const coverHtml = cover
    ? `
      <div class="post-cover">
        <img src="${UI.esc(new URL(String(cover).replace(/^\/+/, ""), document.baseURI))}" alt="" loading="lazy">
      </div>
    `
    : "";

const isMobile = window.matchMedia("(max-width: 980px)").matches;

app.innerHTML = `
  <div class="docs">
    <aside class="sidebar">
      <details class="side-collapsible" ${isMobile ? "" : "open"}>
        <summary class="side-summary">
          <span>📝 Posts</span>
          <span class="side-summary-right">
            <a href="posts.html" class="datecol">all</a>
            <span class="chev">▾</span>
          </span>
        </summary>

        <div class="tree">${treeHtml}</div>
      </details>
    </aside>

      <article class="content">
        <div class="datecol"><a href="posts.html">Posts</a> > ${UI.esc((post.date || "").slice(0, 4))}</div>

        <h1 class="post-title">${UI.esc(post.title)}</h1>

        <div class="post-tags">${tags}</div>

        <div class="meta">
          <span>Published: ${UI.fmt(post.date)}</span>
          ${minutes ? `<span>${minutes} min read</span>` : ""}
        </div>

        ${coverHtml}

        <hr>

        <div>${Markdown.toHtml(mdBody)}</div>

        <div class="post-nav">
          ${prev ? `<a class="navbtn" href="post.html?slug=${encodeURIComponent(prev.slug)}">← ${UI.esc(prev.title)}</a>` : `<span></span>`}
          ${next ? `<a class="navbtn" href="post.html?slug=${encodeURIComponent(next.slug)}">${UI.esc(next.title)} →</a>` : `<span></span>`}
        </div>
      </article>
    </div>
  `;
});
