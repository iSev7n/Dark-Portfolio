// js/config.js
// ======================================================
// Site-wide configuration (consumed by layout + pages)
// ======================================================
//
// Used by:
// - layout.js (topbar, hero, tabs)
// - pages/*.js (About, Posts, Projects, Music, etc.)
// - data.js (content mode selection)
//
// NOTE: Keep this file as plain data (no logic) so it’s
// easy to maintain and safe to edit.
// ======================================================

window.SITE_CONFIG = {
  // ----------------------------------------------------
  // Identity
  // ----------------------------------------------------
  siteName: "Thomas Davis",
  signature: "Thomas Davis",

  // ----------------------------------------------------
  // Hero / tagline (supports simple inline HTML)
  // ----------------------------------------------------
  taglineLine1:
    "I'm a <a href='#'>Software Developer</a> building <a href='#'>clean web apps</a>.",
  taglineLine2: "Docs-style portfolio with posts, projects, and notes.",

  // ----------------------------------------------------
  // Social / quick links (icons map to js/icons.js keys)
  // ----------------------------------------------------
  links: [
    { icon: "home", href: "index.html", title: "Home" },
    { icon: "github", href: "https://github.com/iSev7n", title: "GitHub" },
    { icon: "mail", href: "mailto:tomatarmy@outlook.com", title: "Email" },
    { icon: "rss", href: "rss.xml", title: "RSS" },
  ],

  // ----------------------------------------------------
  // Primary navigation tabs (hero tab bar)
  // ----------------------------------------------------
  tabs: [
    { key: "about", label: "About", href: "index.html", emoji: "🏠" },
    { key: "posts", label: "Posts", href: "posts.html", emoji: "📝" },
    { key: "work", label: "Work", href: "work.html", emoji: "🧰" },
    { key: "projects", label: "Projects", href: "projects.html", emoji: "📁" },
    { key: "experience", label: "Experience", href: "experience.html", emoji: "🎒" },
    { key: "music", label: "Music", href: "music.html", emoji: "🎵" },
  ],

  // ----------------------------------------------------
  // “Now Playing” card (used on About + Music)
  // ----------------------------------------------------
  nowPlaying: {
    title: "Main Playlist",
    desc: "My go-to background playlist for coding and deep focus.",
    href: "music.html",
  },

  // ----------------------------------------------------
  // Music page embed configuration
  // ----------------------------------------------------
  music: {
    ytListId: "PLY2pabb5IMzATuTdV4NeEDaZY5rpEYngu",
    open: "https://music.youtube.com/playlist?list=PLY2pabb5IMzATuTdV4NeEDaZY5rpEYngu",
  },

  // ----------------------------------------------------
  // Content source mode for posts
  // - "file": fetch content/posts.json
  // - "local": use localStorage drafts (admin mode)
  // ----------------------------------------------------
  contentMode: "file",
};
