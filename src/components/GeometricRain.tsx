export function GeometricRain() {
  const marks = [
    { left: "8%", speed: 22, delay: 0, shape: "circle" },
    { left: "22%", speed: 14, delay: -9, shape: "dot" },
    { left: "38%", speed: 32, delay: -20, shape: "diamond" },
    { left: "54%", speed: 18, delay: -14, shape: "cross" },
    { left: "70%", speed: 26, delay: -2, shape: "asterisk" },
    { left: "86%", speed: 11, delay: -17, shape: "zigzag" },
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen z-[9999] pointer-events-none">
      {marks.map((m, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: m.left,
            animation: `float-down ${m.speed}s linear ${m.delay}s infinite`,
          }}
        >
          {[0, 1, 2, 3].map((copy) => (
            <div
              key={copy}
              className="pointer-events-auto hover:opacity-100 hover:scale-110 hover:[animation-play-state:paused] transition-all duration-[180ms]"
              style={{ marginBottom: 280, opacity: 0.7 }}
            >
              <MarkShape shape={m.shape} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function MarkShape({ shape }: { shape: string }) {
  const stroke = "#C8F04A";
  const size = shape === "dot" ? 24 : 80;

  switch (shape) {
    case "circle":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" stroke={stroke} strokeWidth="4" fill="none" />
        </svg>
      );
    case "dot":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill={stroke} />
        </svg>
      );
    case "diamond":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <path d="M40 4 L76 40 L40 76 L4 40 Z" stroke={stroke} strokeWidth="4" fill="none" />
        </svg>
      );
    case "cross":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <path d="M40 8 V72 M8 40 H72" stroke={stroke} strokeWidth="6" />
        </svg>
      );
    case "asterisk":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <path d="M40 8 V72 M8 40 H72 M16 16 L64 64 M64 16 L16 64" stroke={stroke} strokeWidth="4" />
        </svg>
      );
    case "zigzag":
      return (
        <svg width={size} height={size} viewBox="0 0 80 80">
          <path d="M10 20 L30 60 L50 20 L70 60" stroke={stroke} strokeWidth="4" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}
