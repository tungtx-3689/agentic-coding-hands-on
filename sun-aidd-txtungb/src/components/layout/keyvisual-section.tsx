interface KeyVisualSectionProps {
  children: React.ReactNode;
  className?: string;
  fullScreen?: boolean;
}

export function KeyVisualSection({ children, className = "", fullScreen = false }: KeyVisualSectionProps) {
  return (
    <div
      className={`relative overflow-hidden ${fullScreen ? "min-h-screen flex flex-col" : ""} ${className}`}
      style={{
        backgroundImage: "url('/aidd-keyvisual.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Fade to system bg at bottom */}
      {!fullScreen && (
        <div
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 0%, #00101a 100%)" }}
        />
      )}
      {/* Subtle dark overlay on content (90% transparent = 10% opacity) */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(11, 15, 18, 0.1)" }} />
      <div className={`relative z-10 ${fullScreen ? "flex flex-col flex-1" : ""}`}>
        {children}
      </div>
    </div>
  );
}
