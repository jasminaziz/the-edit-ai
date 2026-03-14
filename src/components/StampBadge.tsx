export function StampBadge() {
  return (
    <div className="fixed bottom-8 left-8 z-[100] group cursor-pointer">
      <svg
        width="88"
        height="88"
        viewBox="0 0 88 88"
        className="animate-spin-slow group-hover:[animation-play-state:paused] group-hover:scale-105 transition-transform duration-200"
      >
        <circle cx="44" cy="44" r="42" fill="#2D35C9" />
        <circle cx="44" cy="44" r="10" fill="#C8F04A" />
        <defs>
          <path
            id="stamp-text-path"
            d="M44,44 m-30,0 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0"
          />
        </defs>
        <text
          fill="#FFFFFF"
          fontSize="8.5"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="600"
          letterSpacing="0.14em"
          textTransform="uppercase"
        >
          <textPath href="#stamp-text-path">
            THE EDIT · JASMIN AZIZ · THE EDIT · JASMIN AZIZ ·
          </textPath>
        </text>
      </svg>
    </div>
  );
}
