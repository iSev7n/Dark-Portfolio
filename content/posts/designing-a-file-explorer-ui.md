# Designing a File Explorer UI: Grid/List Views, Per-Folder Memory, Drag Reorder, and Context Menus

A file explorer looks simple.

Folders. Files. Click to open.

But the moment you try to build one that feels real — not just functional, but trustworthy — you realize it’s one of the most demanding UI systems you can design.

A good file explorer is:

- Predictable  
- Forgiving  
- Fast  
- Hard to break  

A bad one feels fragile, inconsistent, and unsafe.

And when users are dealing with their files, unsafe is unacceptable.

This post breaks down how I approach building a **desktop-style file explorer UI** in JavaScript, based on lessons learned while building Desktop4Kids OS.

---

## Why file explorers are deceptively hard

A file explorer is where users manipulate their stuff.

Not demo data.
Not disposable UI state.
Their files.

That changes everything.

Mistakes in a file explorer feel worse than mistakes elsewhere because:

- Deleting the wrong file creates anxiety  
- Losing layout preferences feels careless  
- Inconsistent behavior breaks confidence  

The goal is not cleverness.

The goal is confidence.

If users hesitate before dragging something, the system isn’t calm enough.

---

## Core responsibilities of a file explorer

At minimum, a real file explorer must handle:

- Folder navigation and breadcrumbs  
- Multiple view modes (grid / list)  
- Selection (single and multi-select)  
- Context menus (right-click behavior)  
- Drag-and-drop reordering  
- Persistent layout preferences  
- Safe delete behavior (trash and restore)  

Each feature on its own is manageable.

Together, they form a state-heavy system with many interaction rules.

That’s where architecture matters.

---

## Treat the filesystem as a model, not the DOM

One of the biggest architectural mistakes is letting the DOM become the filesystem.

If you move DOM nodes around as your primary source of truth, you’ll eventually hit walls with persistence, sorting, and view switching.

Instead, treat files and folders as data objects.

Example:

```js
{
  id: "file-123",
  name: "notes.txt",
  type: "file",
  ext: "txt",
  size: 2048,
  modified: "2025-01-04",
  path: "/Documents",
  icon: "text",
  order: 3
}
```

All logic operates on this data:

- Sorting  
- Manual ordering  
- Selection  
- Persistence  
- Permissions  

The DOM is just a renderer.

When data is authoritative, features stack cleanly instead of fighting each other.

---

## Grid view vs list view (two renderers, one state)

Grid and list views should not be separate systems.

They should be two renderers over the same state.

Shared state:

- Current folder  
- Item list  
- Selection  
- Ordering  
- Sort mode  

Different renderers:

- Grid → icons + labels  
- List → rows + metadata columns  

Switching views should not:

- Reload data  
- Reset selection  
- Recompute ordering  

It should simply re-render.

If view switching feels instant, users feel in control.

If it flickers, resets, or loses state, trust erodes.

---

## Per-folder view memory (small feature, huge impact)

One detail that instantly makes a file explorer feel real:

> Each folder remembers how you prefer to view it.

That includes:

- Grid or list  
- Icon size  
- Sort order  
- Manual drag order  

Implementation is simple:

```js
folderPrefs[path] = {
  view: "grid",
  sort: "name",
  order: ["id3", "id1", "id2"]
};
```

When entering a folder:

1. Load preferences  
2. Apply ordering  
3. Render  

That persistence creates ownership.

Users feel like the environment adapts to them — not the other way around.

---

## Drag-and-drop reordering (data first, always)

Drag reorder is not about moving DOM nodes.

It is about updating order state.

Correct flow:

1. Pointer down → initiate drag intent  
2. Show visual placeholder  
3. Calculate target index from pointer position  
4. Update order array  
5. Re-render  

Example order state:

```js
order = ["fileA", "fileC", "fileB"];
```

Dragging `fileB` between A and C modifies the array.

The UI reflects the new order.

Why this matters:

If the DOM is your source of truth:

- Persistence becomes painful  
- Sorting conflicts with manual order  
- View switching breaks layout  
- Reconciliation gets messy  

Data-first ordering avoids those traps.

---

## Selection rules (where UX lives or dies)

Selection must be boring.

Boring is good.

Rules I follow:

- Click selects one  
- Ctrl/Cmd toggles  
- Shift selects range  
- Clicking empty space clears  
- Right-click selects before opening menu  

That last rule matters more than it seems.

If a context menu applies to the wrong file, users feel betrayed.

Trust evaporates instantly.

---

## Context menus as capability gates

Context menus are not decorative.

They are capability boundaries.

Each action must be explicitly valid for the current state:

- Open  
- Rename  
- Delete  
- Duplicate  
- Properties  

Availability depends on:

- Selection count  
- Item type  
- Permission model  

A strong rule:

> Unsafe actions should be impossible, not merely blocked after invocation.

Disable invalid options. Don’t offer them.

Clarity prevents error.

---

## Safe delete: trash beats fear

Permanent delete should rarely be the default.

A trash system introduces:

- Recoverability  
- Confidence  
- Reduced hesitation  

Implementation pattern:

- Delete moves item to `/Trash`  
- Metadata stores original path  
- Restore reverses the move  

When mistakes are reversible, experimentation increases.

Users become comfortable.

Comfort drives adoption.

---

## Performance considerations

File explorers can contain many items.

Performance rules:

- Batch DOM updates  
- Avoid layout reads inside loops  
- Use document fragments  
- Virtualize large folders if necessary  

But do not prematurely optimize.

Correct behavior and stability matter more than micro-optimizations.

Speed without reliability feels brittle.

---

## Accessibility and predictability

A file explorer must support:

- Keyboard navigation  
- Visible focus states  
- Logical tab order  

Accessibility is not a feature — it is part of predictability.

Users expect:

- Arrow keys to move selection  
- Enter to open  
- Delete to remove  
- Escape to clear  

The closer you align with established mental models, the less cognitive load users carry.

---

## The mental model users expect

Users bring expectations from real operating systems.

You do not need to clone Windows or macOS.

But you must respect core assumptions:

- Folders contain things  
- Order stays unless changed  
- Actions are reversible  
- Preferences persist  
- Right-click means options  

Violating these expectations feels wrong, even if the UI looks modern.

Consistency matters more than style.

---

## Why this system matters

A file explorer becomes foundational.

It enables:

- Media viewers  
- Editors  
- Project tools  
- Educational content  
- File-based workflows  

In Desktop4Kids OS, the file explorer is often the first environment users truly understand.

That makes it the most important to get right.

If users feel confident there, they trust everything else more easily.

---

## Closing thoughts

Designing a file explorer forces you to confront:

- State architecture  
- Interaction design  
- User trust  
- Safety-first systems  

It is one of the best exercises in building calm software.

If users feel safe moving files around, they will feel safe inside your system.

And once users feel safe, everything else becomes easier.