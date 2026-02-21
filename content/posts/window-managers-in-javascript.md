# Window Managers in JavaScript: Building Drag, Resize, Focus, and Z-Index Without a Framework

Most web apps are page-driven. You click something and move somewhere else.

A **desktop-style UI** isn’t like that. You’re not navigating away from things. You’re inside an environment where multiple things stay open and active at the same time.

That means you need a **window manager**.

This post breaks down what a real window manager actually needs to handle and how I approach building one in plain JavaScript without letting the code turn into a mess.

If you’ve ever tried building a browser desktop that feels solid instead of fake, this is the core system behind it.

---

## What a window manager actually controls

A window manager isn’t just draggable boxes on a screen.

At minimum it should own:

- **Focus** — which window is currently active  
- **Z-index stacking** — what shows on top  
- **Dragging** — pointer tracking, clamping, preventing jitter  
- **Resizing** — edges, corners, min/max constraints  
- **Window state** — minimized, maximized, normal  
- **Taskbar behavior** — running apps, minimize/restore  
- **Persistence** — restoring layout after refresh  

The big mindset change here is:

> **Applications shouldn’t control their own window behavior. The system should.**

Once you separate that responsibility, everything becomes easier to reason about and stays consistent across apps.

---

## Model windows as state objects, not just DOM elements

If you treat windows as just DOM nodes, your logic ends up scattered across event handlers and UI code.

Instead, treat each window as data and let the UI reflect that state.

Example:

```js
const win = {
  id: "notes-1",
  title: "Notepad",
  x: 180,
  y: 120,
  w: 720,
  h: 480,
  z: 12,
  state: "normal", // normal | minimized | maximized
  canResize: true,
  canMove: true,
  minW: 360,
  minH: 240,
  appKey: "notepad"
};
```

Your UI becomes a projection of that state.

When something changes, you update the state and patch what’s needed. That keeps behavior predictable and avoids hidden side effects.

---

## Focus rules (where most window systems break)

Focus is not just “the clicked window gets highlighted.”

A real focus system has to handle things like:

- Clicking a window should bring it forward  
- Clicking inside inputs shouldn’t interfere with dragging  
- Clicking the desktop should clear focus  
- Keyboard shortcuts should affect only the focused window  
- Minimized windows shouldn’t receive focus  

A simple baseline rule set:

1. Pointer down requests focus  
2. `focusedId` updates  
3. Focus update also bumps z-index  

The important part here is this:

> Focus logic should live in one place.

Don’t let random components change focus directly. Route everything through a single `focusWindow(id)` function so behavior stays consistent.

---

## Z-index stacking without chaos

The easiest broken solution is giving the active window something like `z-index: 9999`.

That works until you need to restore order or maintain history.

A cleaner approach is using a simple monotonic counter:

```js
let zTop = 10;

function bringToFront(win){
  zTop += 1;
  win.z = zTop;
}
```

This keeps stacking predictable without complicated bookkeeping.

### Optional cleanup

If your app runs long enough, z values can grow.

If you want to keep things tidy, occasionally:

- Sort windows by z  
- Reassign values from 1..N  

Do it during idle time so users never notice.

---

## Dragging that actually feels solid

Dragging itself isn’t complicated, but the small details decide whether it feels real or cheap.

The biggest rule I follow is:

> Don’t fight the browser’s event model.

### Minimum setup

- Use `pointerdown`, `pointermove`, `pointerup`  
- Use `setPointerCapture` so the pointer stays tracked outside the window  
- Calculate movement from the initial pointer position  

Example logic:

```js
let drag = null;

function onTitlePointerDown(e, win){
  if (!win.canMove || win.state !== "normal") return;

  e.preventDefault();
  e.currentTarget.setPointerCapture(e.pointerId);

  drag = {
    id: win.id,
    startX: e.clientX,
    startY: e.clientY,
    baseX: win.x,
    baseY: win.y
  };

  focusWindow(win.id);
}

function onPointerMove(e){
  if(!drag) return;
  const win = getWindowById(drag.id);

  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;

  win.x = drag.baseX + dx;
  win.y = drag.baseY + dy;

  clampToDesktop(win);
  patchWindowStyle(win);
}

function onPointerUp(e){
  drag = null;
  saveLayout();
}
```

### The small rule that makes it feel real

Always clamp to the desktop and keep the title bar reachable.

- Don’t allow windows to disappear fully off-screen  
- Keep at least ~40px visible at the top  

That one detail makes the system feel intentional instead of glitchy.

---

## Resizing without jumpiness

Resizing follows the same pattern as dragging, but you have to handle which edges move and enforce size limits.

Good resize behavior usually includes:

- Corners resize both directions  
- Edges resize one direction  
- Minimum sizes enforced  
- Optional maximum sizes  

A common bug is forgetting to move the origin when resizing from the left or top.

Example:

If the user drags the left edge outward:

- Width increases  
- X position must move left too  

That’s why resize logic normally ends up with eight cases (N, S, E, W, NE, NW, SE, SW).

---

## Performance: avoid layout thrashing

Dragging and resizing can feel laggy if you trigger layout recalculations every frame.

What keeps things smooth:

- Prefer `transform: translate()` instead of `top/left` when possible  
- Batch DOM writes using `requestAnimationFrame`  
- Avoid reading layout values during move loops  

A simple pattern that works well:

- Update state immediately  
- Apply DOM updates on the next animation frame  

That alone makes pointer tracking feel much smoother.

---

## Persistence: make the environment survive refresh

If your desktop resets every reload, it feels like a demo instead of a system.

Persistence can stay simple:

- Save window data in `localStorage`  
- Restore it on boot  

What I usually persist:

- Positions and sizes  
- Last focused window  
- Open apps  
- Layout preferences  

What I don’t persist:

- Hover states  
- Temporary drag data  

A good rule of thumb:

> Only persist what the user would expect to still be true tomorrow.

---

## Minimize and maximize are real state transitions

Minimize isn’t just hiding the window.

Minimize means:

- State becomes minimized  
- Window disappears from the desktop  
- App keeps running  
- Taskbar entry remains active  

Maximize usually means:

- Store previous bounds  
- Expand to the work area  
- Disable dragging  
- Limit resizing behavior  

These transitions are where systems either feel polished or start breaking.

---

## Give your system a vocabulary

Clean window managers usually end up with internal events like:

- `wm:focus`  
- `wm:move`  
- `wm:resize`  
- `wm:minimize`  
- `wm:maximize`  
- `wm:close`  

Even without a full event bus, naming these operations makes the system easier to read and maintain.

It keeps your code from turning into random function calls scattered everywhere.

---

## Testing (yes, this kind of UI can be tested)

You don’t need to test the DOM interactions perfectly.

But you *can* test the logic:

- Clamp math  
- Z-index ordering  
- Focus behavior  
- Bounds calculations  

If state logic is separated from DOM updates, testing becomes straightforward.

That’s another reason the state-object approach pays off.

---

## A window manager is really a trust system

Window managers aren’t just UI code.

They’re a **trust system**.

If moving windows feels unpredictable, users feel uncomfortable.  
If resizing glitches, it feels cheap.  
If focus jumps around, users feel lost.  

The goal isn’t fancy effects. It’s calm behavior:

- Predictable  
- Recoverable  
- Stable  

That’s what makes a desktop environment feel real.

---

## Closing thoughts

Once you can build a solid window manager, you can build:

- Full desktop environments  
- Complex dashboards  
- Internal tooling systems  
- Multi-pane editors  

It’s one of those system-level skills that transfers everywhere.

And the best part is you don’t need a framework to do it.

You mainly need:

- A strong state model  
- Consistent focus rules  
- Reliable drag/resize handling  
- Performance awareness  
- Persistence  

Everything else is just polish.