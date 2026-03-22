import { useState, useEffect, useCallback, useMemo } from "react";

// ── Remotion-like primitives ──────────────────────────────────
const FPS = 30;

function interpolate(frame, inputRange, outputRange, opts = {}) {
  const { extrapolateLeft = "clamp", extrapolateRight = "clamp" } = opts;
  let t = (frame - inputRange[0]) / (inputRange[1] - inputRange[0]);
  if (extrapolateLeft === "clamp") t = Math.max(0, t);
  if (extrapolateRight === "clamp") t = Math.min(1, t);
  // easeInOut cubic
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return outputRange[0] + eased * (outputRange[1] - outputRange[0]);
}

function spring(frame, { from = 0, to = 1, damping = 12, stiffness = 170, mass = 1, delay = 0 } = {}) {
  const f = Math.max(0, frame - delay);
  const t = f / FPS;
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  let value;
  if (zeta < 1) {
    const omegaD = omega * Math.sqrt(1 - zeta * zeta);
    value = 1 - Math.exp(-zeta * omega * t) * (Math.cos(omegaD * t) + (zeta * omega / omegaD) * Math.sin(omegaD * t));
  } else {
    value = 1 - (1 + omega * t) * Math.exp(-omega * t);
  }
  return from + value * (to - from);
}

// ── Slide definitions ─────────────────────────────────────────
const SLIDE_DURATION = 150; // frames per slide
const slides = [
  {
    id: "title",
    render: (f) => {
      const titleY = spring(f, { from: 60, to: 0, delay: 10 });
      const titleOp = interpolate(f, [10, 40], [0, 1]);
      const subOp = interpolate(f, [30, 60], [0, 1]);
      const subY = spring(f, { from: 30, to: 0, delay: 30 });
      const tagOp = interpolate(f, [50, 80], [0, 1]);
      const lineW = interpolate(f, [20, 70], [0, 100]);
      return (
        <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
          <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)` }}
               className="text-7xl font-black tracking-tighter"
               >
            <span style={{ color: "oklch(0.75 0.18 145)" }}>Remotion</span>
          </div>
          <div style={{ width: `${lineW}%`, height: 2, background: "oklch(0.75 0.18 145 / 0.5)" }} />
          <div style={{ opacity: subOp, transform: `translateY(${subY}px)` }}
               className="text-2xl font-light tracking-wide" style2="true">
            <span style={{ opacity: subOp, transform: `translateY(${subY}px)`, color: "oklch(0.85 0 0)" }}>
              Make videos programmatically
            </span>
          </div>
          <div style={{ opacity: tagOp }} className="mt-4 px-4 py-2 rounded text-sm font-mono"
               >
            <span style={{ opacity: tagOp, color: "oklch(0.6 0 0)", background: "oklch(0.2 0 0)", padding: "8px 16px", borderRadius: 6 }}>
              React → MP4 / WebM / GIF
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "why",
    render: (f) => {
      const items = [
        "Videos are just functions of time",
        "Use React components as frames",
        "Parameterize everything with props",
        "Render on CI — no GUI needed",
      ];
      const headOp = interpolate(f, [5, 25], [0, 1]);
      const headX = spring(f, { from: -40, to: 0, delay: 5 });
      return (
        <div className="flex flex-col justify-center h-full px-16 gap-8">
          <div style={{ opacity: headOp, transform: `translateX(${headX}px)` }}>
            <span className="text-5xl font-black" style={{ color: "oklch(0.75 0.18 145)" }}>Why Remotion?</span>
          </div>
          <div className="flex flex-col gap-5 ml-2">
            {items.map((txt, i) => {
              const delay = 25 + i * 18;
              const op = interpolate(f, [delay, delay + 20], [0, 1]);
              const x = spring(f, { from: 50, to: 0, delay });
              const dotScale = spring(f, { from: 0, to: 1, delay: delay + 5 });
              return (
                <div key={i} className="flex items-center gap-4" style={{ opacity: op, transform: `translateX(${x}px)` }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: "oklch(0.75 0.18 145)",
                    transform: `scale(${dotScale})`,
                    flexShrink: 0,
                  }} />
                  <span className="text-xl font-light" style={{ color: "oklch(0.9 0 0)" }}>{txt}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },
  {
    id: "code",
    render: (f) => {
      const headOp = interpolate(f, [5, 20], [0, 1]);
      const codeOp = interpolate(f, [15, 40], [0, 1]);
      const codeY = spring(f, { from: 30, to: 0, delay: 15 });
      const lines = [
        { c: "oklch(0.6 0.12 280)", t: "export const" },
        { c: "oklch(0.8 0.18 145)", t: " MyVideo" },
        { c: "oklch(0.6 0 0)", t: ": React.FC = () => {" },
        { c: "oklch(0.6 0.12 280)", t: "  const " },
        { c: "oklch(0.9 0 0)", t: "frame" },
        { c: "oklch(0.6 0 0)", t: " = " },
        { c: "oklch(0.75 0.15 60)", t: "useCurrentFrame" },
        { c: "oklch(0.6 0 0)", t: "();" },
        { c: "oklch(0.6 0.12 280)", t: "  const " },
        { c: "oklch(0.9 0 0)", t: "opacity" },
        { c: "oklch(0.6 0 0)", t: " = " },
        { c: "oklch(0.75 0.15 60)", t: "interpolate" },
        { c: "oklch(0.6 0 0)", t: "(frame," },
        { c: "oklch(0.6 0 0)", t: "    [0, 30], [0, 1]);" },
        { c: "oklch(0.4 0 0)", t: "" },
        { c: "oklch(0.6 0.12 280)", t: "  return " },
        { c: "oklch(0.6 0 0)", t: "(" },
        { c: "oklch(0.55 0.12 200)", t: '    <div style={{ opacity }}>' },
        { c: "oklch(0.85 0.1 60)", t: '      Hello from frame {frame}!' },
        { c: "oklch(0.55 0.12 200)", t: "    </div>" },
        { c: "oklch(0.6 0 0)", t: "  );" },
        { c: "oklch(0.6 0 0)", t: "};" },
      ];
      return (
        <div className="flex flex-col justify-center h-full px-16 gap-6">
          <div style={{ opacity: headOp }}>
            <span className="text-4xl font-black" style={{ color: "oklch(0.75 0.18 145)" }}>It's just React</span>
          </div>
          <div style={{ opacity: codeOp, transform: `translateY(${codeY}px)`,
                         background: "oklch(0.12 0 0)", borderRadius: 12, padding: "24px 28px",
                         border: "1px solid oklch(0.25 0 0)", fontFamily: "'JetBrains Mono', monospace",
                         fontSize: 14, lineHeight: 1.7 }}>
            {lines.map((ln, i) => {
              const d = 30 + i * 3;
              const lnOp = interpolate(f, [d, d + 15], [0, 1]);
              return (
                <div key={i} style={{ opacity: lnOp, color: ln.c, whiteSpace: "pre" }}>{ln.t || "\u00A0"}</div>
              );
            })}
          </div>
        </div>
      );
    },
  },
  {
    id: "pipeline",
    render: (f) => {
      const stages = [
        { icon: "⚛️", label: "React" },
        { icon: "🎞️", label: "Frames" },
        { icon: "🔧", label: "FFmpeg" },
        { icon: "🎬", label: "Video" },
      ];
      const headOp = interpolate(f, [5, 25], [0, 1]);
      return (
        <div className="flex flex-col items-center justify-center h-full gap-12 px-8">
          <div style={{ opacity: headOp }}>
            <span className="text-4xl font-black" style={{ color: "oklch(0.75 0.18 145)" }}>The Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            {stages.map((s, i) => {
              const delay = 20 + i * 22;
              const scale = spring(f, { from: 0, to: 1, delay });
              const op = interpolate(f, [delay, delay + 15], [0, 1]);
              const arrowOp = interpolate(f, [delay + 10, delay + 20], [0, 1]);
              return (
                <div key={i} className="flex items-center gap-2">
                  <div style={{
                    opacity: op, transform: `scale(${scale})`,
                    background: "oklch(0.15 0.02 145)", border: "1px solid oklch(0.3 0.05 145)",
                    borderRadius: 16, padding: "24px 28px",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 100,
                  }}>
                    <span style={{ fontSize: 36 }}>{s.icon}</span>
                    <span style={{ color: "oklch(0.9 0 0)", fontWeight: 600, fontSize: 16 }}>{s.label}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <span style={{ opacity: arrowOp, color: "oklch(0.5 0.1 145)", fontSize: 28, margin: "0 4px" }}>→</span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ opacity: interpolate(f, [100, 120], [0, 1]), color: "oklch(0.55 0 0)", fontSize: 14, fontFamily: "monospace" }}>
            npx remotion render src/index.ts MyComp out.mp4
          </div>
        </div>
      );
    },
  },
  {
    id: "end",
    render: (f) => {
      const scale = spring(f, { from: 0.7, to: 1, delay: 10, damping: 8 });
      const op = interpolate(f, [10, 35], [0, 1]);
      const linkOp = interpolate(f, [40, 65], [0, 1]);
      const glowPulse = Math.sin(f / 15) * 0.15 + 0.85;
      return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <div style={{ opacity: op, transform: `scale(${scale})` }}>
            <span className="text-6xl font-black" style={{
              color: "oklch(0.75 0.18 145)",
              textShadow: `0 0 ${40 * glowPulse}px oklch(0.5 0.18 145 / 0.4)`,
            }}>
              Ship videos like code.
            </span>
          </div>
          <div style={{ opacity: linkOp, color: "oklch(0.55 0 0)", fontFamily: "monospace", fontSize: 18 }}>
            remotion.dev
          </div>
        </div>
      );
    },
  },
];

const TOTAL_FRAMES = slides.length * SLIDE_DURATION;

// ── Player ────────────────────────────────────────────────────
export default function RemotionPresentation() {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setFrame((f) => {
        if (f >= TOTAL_FRAMES - 1) { return 0; }
        return f + 1;
      });
    }, 1000 / FPS);
    return () => clearInterval(id);
  }, [playing]);

  const currentSlideIdx = Math.min(Math.floor(frame / SLIDE_DURATION), slides.length - 1);
  const localFrame = frame - currentSlideIdx * SLIDE_DURATION;

  const goToSlide = useCallback((i) => {
    setFrame(i * SLIDE_DURATION);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space") { e.preventDefault(); setPlaying((p) => !p); }
      if (e.code === "ArrowRight") setFrame((f) => Math.min(f + SLIDE_DURATION, TOTAL_FRAMES - 1));
      if (e.code === "ArrowLeft") setFrame((f) => Math.max(f - SLIDE_DURATION, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const progress = (frame / (TOTAL_FRAMES - 1)) * 100;

  return (
    <div style={{
      width: "100%", height: "100vh", background: "oklch(0.08 0 0)",
      display: "flex", flexDirection: "column", fontFamily: "'Inter', system-ui, sans-serif",
      overflow: "hidden", position: "relative",
    }}>
      {/* Subtle grid bg */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Stage */}
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        {slides[currentSlideIdx].render(localFrame)}
      </div>

      {/* Controls */}
      <div style={{
        padding: "12px 20px", display: "flex", alignItems: "center", gap: 16,
        background: "oklch(0.1 0 0)", borderTop: "1px solid oklch(0.2 0 0)", zIndex: 2,
      }}>
        <button onClick={() => setPlaying((p) => !p)} style={{
          background: "none", border: "1px solid oklch(0.3 0 0)", borderRadius: 6,
          color: "oklch(0.8 0 0)", padding: "6px 14px", cursor: "pointer", fontSize: 13,
          fontFamily: "monospace",
        }}>
          {playing ? "⏸ pause" : "▶ play"}
        </button>

        {/* Slide dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {slides.map((s, i) => (
            <button key={s.id} onClick={() => goToSlide(i)} style={{
              width: 10, height: 10, borderRadius: "50%", border: "none", cursor: "pointer",
              background: i === currentSlideIdx ? "oklch(0.75 0.18 145)" : "oklch(0.3 0 0)",
              transition: "background 0.2s",
            }} />
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ flex: 1, height: 3, background: "oklch(0.2 0 0)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: "oklch(0.75 0.18 145)", transition: "width 0.05s linear",
          }} />
        </div>

        <span style={{ color: "oklch(0.45 0 0)", fontFamily: "monospace", fontSize: 12 }}>
          {currentSlideIdx + 1}/{slides.length} · f{frame}
        </span>
      </div>
    </div>
  );
}
