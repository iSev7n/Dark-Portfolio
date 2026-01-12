document.addEventListener("DOMContentLoaded", async ()=>{
  const app = document.getElementById("app");
  const slug = new URLSearchParams(location.search).get("slug");
  const posts = await Data.getPosts();

  const post = slug ? posts.find(p=>p.slug===slug) : posts[0];
  if(!post){
    app.innerHTML = `<div class="content"><h1>Not found</h1></div>`;
    return;
  }

  const byYear = {};
  for(const p of posts){
    const y = (p.date||"").slice(0,4) || "Other";
    (byYear[y] ||= []).push(p);
  }
  Object.values(byYear).forEach(list=> list.sort((a,b)=>(b.date||"").localeCompare(a.date||"")));
  const years = Object.keys(byYear).sort((a,b)=>b.localeCompare(a));

  const treeHtml = years.map(y=>{
    const items = byYear[y].map(p=>`
      <a class="${p.slug===post.slug?'active':''}" href="post.html?slug=${encodeURIComponent(p.slug)}">${UI.esc(p.title)}</a>
    `).join("");
    return `<div class="year">${UI.esc(y)}</div>${items}`;
  }).join("");

  const tags = (post.tags||[]).map(t=>`<span class="tag">${UI.esc(t.toUpperCase())}</span>`).join("");

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
        <div class="datecol">Posts > ${UI.esc((post.date||"").slice(0,4))}</div>
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
