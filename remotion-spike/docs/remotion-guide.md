# Remotion Presentations Guide

## Mental Model

Videos are pure functions of frame numbers. Every visual is `f(frame) → pixels`.
Remotion wraps this in React: components receive a frame counter via
`useCurrentFrame()`, compute animated values from it, and return JSX.

There is no timeline editor. There are no keyframes. Animation is code.

## Viewing & Rendering Modes

### 1. Browser Presentation Mode

Full-viewport, responsive, live in the browser. Mount composition components
directly into a `100vw × 100vh` div using Vite + React — no Remotion Player
component involved.

Content adapts to the viewport. No fixed canvas, no aspect ratio constraint.

**Why no video output:** Remotion's renderer needs compositionWidth/Height to
define the exact pixel grid for screenshotting frames. A responsive viewport has
no fixed pixel grid, so there is nothing to screenshot at a consistent resolution.

**Why no render preview:** The browser viewport varies per screen. A slide that
fits perfectly on a 1920×1080 monitor may overflow on a 1366×768 laptop. Since
there is no fixed canvas, there is no guarantee that what you see matches what
any particular render would produce.

**Setup:** A Vite + React entry point that imports composition components and
mounts them in a full-viewport div with `overflow: hidden`.

**Run:** `npx vite --open` (or `pnpm exec vite --open`)

### 2. Video Preview Mode

Fixed-canvas preview for checking what the rendered video will look like.
Two options:

**Remotion Studio:** Built-in development environment with props panel (sidebar),
frame scrubber, and playback controls. Uses webpack internally (Rspack available
as experimental alternative).

- Setup: `remotion.config.ts` + `src/index.ts` with `registerRoot()`
- Run: `npx remotion studio`
- Note: `remotion.config.ts` applies to Studio and CLI only — not to Node.js APIs

**@remotion/player in a custom page:** Embed the Player component in any React
app (Vite, Next.js, Remix, Create React App). The Player enforces
`compositionWidth × compositionHeight` internally and scales for display via CSS.

- Setup: Install `@remotion/player`, create a React entry point
- Run: depends on your app setup (e.g. `npx vite --open`)
- The Player takes the component directly via `component={MyComp}` — do NOT
  wrap in `<Composition>`. `<Composition>` is only for Studio/CLI registration.

**Responsive Player sizing:** To fit the Player within a container while
preserving aspect ratio, use the documented wrapper pattern:

```tsx
<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
  <div style={{
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    margin: "auto",
    aspectRatio: `${compositionWidth} / ${compositionHeight}`,
    maxHeight: "100%",
    maxWidth: "100%",
  }}>
    <Player
      component={MyComp}
      compositionWidth={compositionWidth}
      compositionHeight={compositionHeight}
      durationInFrames={duration}
      fps={30}
      style={{ width: "100%" }}
    />
  </div>
</div>
```

### 3. Video Render Mode

Headless rendering to video files. The pipeline:
`bundle()` → `renderFrames()` → `stitchFramesToVideo()`

Remotion opens a headless Chromium browser, loads each frame, screenshots at
`compositionWidth × compositionHeight` pixels, then pipes frames to FFmpeg to
stitch into a video file.

**Run:** `npx remotion render src/index.ts CompositionId out/video.mp4`

- Entry point and output location are optional (Remotion auto-detects entry,
  defaults output to `out/`)
- Composition ID is required

**Options:**

| Flag | Purpose | Example |
|------|---------|---------|
| `--codec` | Output format | h264, h265, vp8, vp9, png, prores, h264-mkv |
| `--fps` | Override frame rate | `--fps 60` |
| `--frames` | Render a range (not a count) | `--frames 0-100` |
| `--width` / `--height` | Override output resolution | `--width 1920 --height 1080` |
| `--scale` | Multiply dimensions (0-16, default 1) | `--scale 2` |

Output resolution matches `compositionWidth × compositionHeight` by default,
but can be overridden with `--width`, `--height`, or `--scale`.

### 4. Hybrid Architecture

The same composition components work in all three modes. Compositions are just
React functions of frame numbers — the mounting mechanism differs, not the code.

**Entry points — one project, multiple mounts:**

| Mode | Entry Point | Mounts via |
|------|-------------|------------|
| Browser presentation | Vite entry (e.g. `viewer.tsx`) | Full-viewport div |
| Video preview (Studio) | `src/index.ts` | `registerRoot()` + `<Composition>` |
| Video preview (Player) | Any React entry | `<Player component={MyComp}>` |
| File render | CLI | `npx remotion render` uses `registerRoot()` entry |

**The visual fidelity boundary:**

Browser presentation mode and video preview/render mode use different rendering
contexts. What you see in one may not exactly match the other.

Known sources of divergence:

1. **Media elements:** During preview, `<OffthreadVideo>` uses the browser's
   `<video>` element. During render, it extracts the exact frame via FFmpeg
   into an `<Img>` tag. Previews may show imprecise seeking; renders are
   frame-accurate.
2. **Chromium version:** Your browser and the headless Chromium used for
   rendering may differ, causing subtle font rendering or anti-aliasing
   differences.
3. **Font availability:** Fonts installed on your dev machine may not be
   available on a render server.
4. **Viewport units:** Compositions should use pixel values, not `vw`/`vh`.
   The composition canvas is a fixed pixel grid — viewport units would resolve
   differently in the browser vs headless renderer.

The Player preview is visually faithful to render output (same browser engine,
same composition dimensions), but Remotion's docs do not guarantee pixel-perfect
accuracy.

**Recommended project structure:**

```
src/
  compositions/     — shared video components (used by all modes)
  viewer.tsx        — browser presentation entry point (Vite)
  index.ts          — Remotion entry point (registerRoot)
  index.css         — global styles, Tailwind import
remotion.config.ts  — render/studio config (webpack overrides, output format)
```

## Spike → Remotion API Mapping

The spike (incubator/remotion-spike) hand-rolled two animation primitives.
Remotion provides real versions:

| Spike (hand-rolled) | Remotion API |
|---------------------|--------------|
| `interpolate(frame, [0, 30], [0, 1])` | `interpolate(frame, [0, 30], [0, 1])` |
| `spring(frame, { from, to, damping, stiffness, delay })` | `spring({ frame, fps, from, to, damping, stiffness })` |
| `const FPS = 30` | `const { fps } = useVideoConfig()` |
| `slides[i].render(localFrame)` | `<Composition>` + `<Series>` or `<Sequence>` |
| `setInterval` player loop | Remotion Studio (built-in player) |
| Vite dev server | `npx remotion studio` (webpack internally) |
| No video output | `npx remotion render` → MP4/WebM |

Key difference: Remotion's `spring()` takes `{ frame, fps }` from hooks, not
raw frame math. The spike baked FPS as a module constant.

## Slide Archetypes

Five proven slide patterns from the spike, with their animation choreography:

### 1. Title Slide
- Large title springs in from below (translateY 60→0, delay 10)
- Decorative line interpolates width 0→100% (frames 20-70)
- Subtitle springs in from below with later delay (delay 30)
- Tag/badge fades in last (frames 50-80)

### 2. Bullet List
- Heading springs in from left (translateX -40→0, delay 5)
- Each bullet staggers with `delay = 25 + i * 18`:
  - Text fades in + springs from right (translateX 50→0)
  - Dot scales from 0→1 with slight extra delay (+5 frames)

### 3. Code Reveal
- Heading fades in (frames 5-20)
- Code block container springs up (translateY 30→0, delay 15)
- Each line fades in sequentially: `delay = 30 + lineIndex * 3`
- Dark background (oklch 0.12), monospace font, syntax-colored spans

### 4. Pipeline / Diagram
- Heading fades in (frames 5-25)
- Each stage springs to scale (0→1) with stagger: `delay = 20 + i * 22`
- Arrow connectors fade in between stages (delay + 10)
- Command-line example fades in at the end (frames 100-120)

### 5. Closing / CTA
- Large text springs with bouncy damping (damping: 8) and scale (0.7→1)
- Glow pulse effect: `Math.sin(frame / 15) * 0.15 + 0.85` on textShadow
- Link/URL fades in below (frames 40-65)

## Animation Recipes

### Staggered entrance (list items)
```tsx
const delay = baseDelay + index * intervalFrames;
const opacity = interpolate(frame, [delay, delay + 20], [0, 1]);
const x = spring({ frame, fps, from: 50, to: 0, config: { damping: 12 } });
```
Typical values: baseDelay 20-30, interval 15-20 frames between items.

### Spring entrance (element appears)
```tsx
const y = spring({ frame, fps, from: 60, to: 0, delay: 10 });
const opacity = interpolate(frame, [10, 40], [0, 1]);
// Apply both: style={{ opacity, transform: `translateY(${y}px)` }}
```

### Sequential code line reveal
```tsx
lines.map((line, i) => {
  const d = 30 + i * 3;  // 3-frame gap between lines
  const lineOpacity = interpolate(frame, [d, d + 15], [0, 1]);
  return <div style={{ opacity: lineOpacity }}>{line}</div>;
});
```

### Pulsing glow
```tsx
const pulse = Math.sin(frame / 15) * 0.15 + 0.85;
// style={{ textShadow: `0 0 ${40 * pulse}px color` }}
```

## Design System

### Colors (oklch)
- Primary green: `oklch(0.75 0.18 145)` — titles, accents, active states
- Text bright: `oklch(0.9 0 0)` — body text
- Text dim: `oklch(0.55 0 0)` — secondary text, URLs
- Text muted: `oklch(0.45 0 0)` — frame counters, metadata
- Background: `oklch(0.08 0 0)` — main bg
- Surface: `oklch(0.12 0 0)` — code blocks, cards
- Border: `oklch(0.25 0 0)` — subtle borders
- Grid overlay: white at 3% opacity, 40px spacing

### Typography
- Headings: Inter/system-ui, font-black, tracking-tighter
- Body: Inter/system-ui, font-light
- Code: JetBrains Mono, 14px, line-height 1.7

### Animation defaults
- FPS: 30
- Slide duration: 150 frames (5 seconds)
- Spring defaults: damping 12, stiffness 170, mass 1
- Bouncy spring: damping 8 (for emphasis/closing)
- Fade duration: typically 20-30 frames
