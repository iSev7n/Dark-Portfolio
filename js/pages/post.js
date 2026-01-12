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
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  /* ------------------------------------------------------------------------
     Boot + inputs
     ------------------------------------------------------------------------ */
  const app = document.getElementById("app");
  const slug = new URLSearchParams(location.search).get("slug");

  /* ------------------------------------------------------------------------
     Load posts + resolve current post
     ------------------------------------------------------------------------ */
  const posts = await Data.getPosts();
  const post = slug ? posts.find((p) => p.slug === slug) : posts[0];

  if (!post) {
    app.innerHTML = `<div class="content"><h1>Not found</h1></div>`;
    return;
  }

  /* ------------------------------------------------------------------------
     Build sidebar tree grouped by year
     ------------------------------------------------------------------------ */
  const byYear = {};
  for (const p of posts) {
    const y = (p.date || "").slice(0, 4) || "Other";
    (byYear[y] ||= []).push(p);
  }

  // Newest-first inside each year
  Object.values(byYear).forEach((list) =>
    list.sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  );

  // Year order: newest year first
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

  /* ------------------------------------------------------------------------
     Tags + article rendering
     ------------------------------------------------------------------------ */
  const tags = (post.tags || [])
    .map((t) => `<span class="tag">${UI.esc(String(t).toUpperCase())}</span>`)
    .join("");

  /* ------------------------------------------------------------------------
     Final HTML (layout unchanged)
     ------------------------------------------------------------------------ */
  app.innerHTML = `
    <div class="docs">
      <aside class="sidebar">
        <div class="side-title">
          <div>📝 Posts</div>
          <a href="posts.html" class="datecol">all</a>
        </div>
        <div class="tree">${treeHtml}</div>
      </aside>

      <article class="content">
        <div class="datecol">Posts > ${UI.esc((post.date || "").slice(0, 4))}</div>
        <h1 style="margin:10px 0 6px">${UI.esc(post.title)}</h1>
        <div>${tags}</div>
        <div class="meta">
          <span>Published: ${UI.fmt(post.date)}</span>
          <span>Modified: ${UI.fmt(post.date)}</span>
        </div>
        <hr>
        <div>${Markdown.toHtml(post.body)}</div>
      </article>
    </div>
  `;
});
