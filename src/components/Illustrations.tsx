export function SpinningSun() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className="animate-spin-slow hover:scale-110 hover:[animation-duration:3s] transition-transform duration-200"
    >
      {/* Rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1="60"
          y1="10"
          x2="60"
          y2="22"
          stroke="#FAF8F4"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${angle} 60 60)`}
        />
      ))}
      {/* Sun body */}
      <circle cx="60" cy="60" r="24" fill="#C8F04A" />
      {/* Inner circle */}
      <circle cx="60" cy="60" r="12" fill="#2D35C9" />
    </svg>
  );
}



export function OpenBook() {
  return (
    <svg
      width="120"
      height="90"
      viewBox="0 0 120 90"
      className="group"
    >
      {/* Left page */}
      <path d="M60 15 L15 20 L15 80 L60 75 Z" stroke="#C8F04A" strokeWidth="3" fill="none" />
      {/* Right page with fan animation */}
      <path
        d="M60 15 L105 20 L105 80 L60 75 Z"
        stroke="#C8F04A"
        strokeWidth="3"
        fill="none"
        className="animate-page-fan origin-[60px_75px] group-hover:[animation-duration:1s] group-hover:scale-110 transition-transform duration-200"
      />
      {/* Spine */}
      <line x1="60" y1="12" x2="60" y2="78" stroke="#C8F04A" strokeWidth="3" />
    </svg>
  );
}

export function FloatingArrow() {
  return (
    <svg
      width="60"
      height="80"
      viewBox="0 0 60 80"
      className="animate-float-arrow"
    >
      <path d="M30 8 V60 M12 44 L30 64 L48 44" stroke="#C8F04A" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
