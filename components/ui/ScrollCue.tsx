export function ScrollCue({ className = "" }: { className?: string }) {
  return (
    <a
      href="#atlas"
      className={`circle inline-flex h-6 w-6 items-center justify-center border border-current ${className}`}
      aria-label="Scroll"
    >
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M2 4l4 4 4-4" />
      </svg>
    </a>
  );
}
