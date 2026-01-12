/* ==========================================================================
   data.js
   Purpose:
   - Centralized data access layer
   - Loads posts from static JSON
   - Provides simple caching
   - Acts as the single source of truth for content
   ========================================================================== */

(function () {
  const CACHE = {
    posts: null,
  };

  window.Data = {
    /* ----------------------------------------------------------------------
       Load all posts from content/posts.json
       - Cached after first load
       ---------------------------------------------------------------------- */
    async getPosts() {
      if (CACHE.posts) return CACHE.posts;

      const res = await fetch(new URL("content/posts.json", document.baseURI));
      if (!res.ok) {
        throw new Error("Failed to load posts.json");
      }

      const json = await res.json();
      const posts = Array.isArray(json.posts) ? json.posts : [];

      // Normalize + sort newest first (default)
      CACHE.posts = posts.slice().sort((a, b) =>
        (b.date || "").localeCompare(a.date || "")
      );

      return CACHE.posts;
    },

    /* ----------------------------------------------------------------------
       Find a single post by slug
       ---------------------------------------------------------------------- */
    async getPostBySlug(slug) {
      const posts = await this.getPosts();
      return posts.find((p) => p.slug === slug) || null;
    },

    /* ----------------------------------------------------------------------
       Group posts by year (used by docs sidebar)
       ---------------------------------------------------------------------- */
    async getPostsByYear() {
      const posts = await this.getPosts();
      const map = {};

      posts.forEach((p) => {
        const year = (p.date || "").slice(0, 4) || "Unknown";
        if (!map[year]) map[year] = [];
        map[year].push(p);
      });

      return map;
    },
  };
})();
