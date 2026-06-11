interface StarBadgeProps {
  count: number;
}

export function StarBadge({ count }: StarBadgeProps) {
  const stars = count >= 50 ? 3 : count >= 20 ? 2 : count >= 10 ? 1 : 0;
  if (stars === 0) return null;

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${stars} star badge`}>
      {Array.from({ length: stars }).map((_, i) => (
        <svg
          key={i}
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="#ffea9e"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}
