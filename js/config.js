// js/config.js
window.SITE_CONFIG = {
  siteName: "Thomas Davis",
  signature: "Thomas Davis",

  taglineLine1: "I'm a <a href='#'>Software Developer</a> building <a href='#'>clean web apps</a>.",
  taglineLine2: "Docs-style portfolio with posts, projects, and notes.",

  links: [
    { icon: "home", href: "index.html", title: "Home" },
    { icon: "github", href: "https://github.com/iSev7n", title: "GitHub" },
    { icon: "mail", href: "mailto:tomatarmy@outlook.com", title: "Email" },
    { icon: "rss", href: "rss.xml", title: "RSS" }
  ],

  tabs: [
    { key:"about", label:"About", href:"index.html", emoji:"🏠"},
    { key:"posts", label:"Posts", href:"posts.html", emoji:"📝"},
    { key:"work", label:"Work", href:"work.html", emoji:"🧰"},
    { key:"projects", label:"Projects", href:"projects.html", emoji:"📁"},
    { key:"experience", label:"Experience", href:"experience.html", emoji:"🎒"},
    { key:"music", label:"Music", href:"music.html", emoji:"🎵"}
  ],

  nowPlaying: {
    title: "Main Playlist",
    desc: "My go-to background playlist for coding and deep focus.",
    href: "music.html"
  },

  music: {
    ytListId: "PLY2pabb5IMzATuTdV4NeEDaZY5rpEYngu",
    open: "https://music.youtube.com/playlist?list=PLY2pabb5IMzATuTdV4NeEDaZY5rpEYngu"
  },

  contentMode: "file"
};
