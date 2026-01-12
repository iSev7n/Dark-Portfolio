(function(){
  const cfg = window.SITE_CONFIG;
  const LS_KEY = "portfolio_cms_posts_v2";

  function normalize(posts){
    const clean = (posts||[]).map(p=>({
      title:p.title||"Untitled",
      slug:p.slug||slugify(p.title||"untitled"),
      date:p.date||new Date().toISOString().slice(0,10),
      tags:Array.isArray(p.tags)?p.tags:[],
      summary:p.summary||"",
      body:p.body||""
    }));
    clean.sort((a,b)=>(b.date||"").localeCompare(a.date||""));
    return clean;
  }

  function slugify(s){
    return String(s??"").toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g,"")
      .replace(/\s+/g,"-")
      .replace(/-+/g,"-")
      .slice(0,80) || "post";
  }

  async function loadFile(){
    const res = await fetch("content/posts.json", { cache:"no-store" });
    if(!res.ok) throw new Error("Failed to load posts.json");
    const data = await res.json();
    return normalize(data.posts||[]);
  }

  function loadLocal(){
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return normalize([]);
    try{ return normalize((JSON.parse(raw).posts)||[]); }catch{ return normalize([]); }
  }
  function saveLocal(posts){
    localStorage.setItem(LS_KEY, JSON.stringify({ posts }, null, 2));
  }

  async function getPosts(){
    if(cfg.contentMode === "local") return loadLocal();
    return await loadFile();
  }
  async function getBySlug(slug){
    const posts = await getPosts();
    return posts.find(p=>p.slug===slug) || null;
  }

  async function getDrafts(){ return loadLocal(); }
  async function upsertDraft(post){
    const drafts = loadLocal();
    const idx = drafts.findIndex(p=>p.slug===post.slug);
    if(idx>=0) drafts[idx]=post; else drafts.unshift(post);
    saveLocal(normalize(drafts));
    return loadLocal();
  }
  async function delDraft(slug){
    const drafts = loadLocal().filter(p=>p.slug!==slug);
    saveLocal(normalize(drafts));
    return loadLocal();
  }

  async function publishToGitHub({ token, owner, repo, branch, path, posts }){
    const api = "https://api.github.com";
    const target = `${api}/repos/${owner}/${repo}/contents/${path}`;
    const content = JSON.stringify({ posts: normalize(posts) }, null, 2);
    const b64 = btoa(unescape(encodeURIComponent(content)));

    let sha=null;
    const getRes = await fetch(`${target}?ref=${encodeURIComponent(branch)}`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept":"application/vnd.github+json" }
    });
    if(getRes.ok){ sha = (await getRes.json()).sha; }

    const putRes = await fetch(target, {
      method:"PUT",
      headers:{
        "Authorization": `Bearer ${token}`,
        "Accept":"application/vnd.github+json",
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        message: sha ? "Update posts.json via Admin" : "Create posts.json via Admin",
        content: b64,
        sha: sha || undefined,
        branch
      })
    });
    if(!putRes.ok) throw new Error(await putRes.text());
    return await putRes.json();
  }

  window.Data = { slugify, getPosts, getBySlug, getDrafts, upsertDraft, delDraft, publishToGitHub };
})();
