// Homepage artwork, deliberately separate from the monochrome site mark.
export function ChichaPoster() {
  return (
    <span className="poster-mount">
      <img
        src="/brand/tu-envidia-es-mi-progreso-poster.png"
        alt="Tu envidia es mi progreso"
        width="1448"
        height="1086"
        className="poster-sheet"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </span>
  );
}
