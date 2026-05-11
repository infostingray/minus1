export default function Logo({ className = '', showWord = true }) {
  return (
    <div className={"flex items-center gap-3 " + className}>
      <svg viewBox="0 0 200 200" className="h-7 w-7" fill="none" aria-hidden="true">
        <rect x="20" y="20" width="160" height="160" stroke="currentColor" strokeWidth="10" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="10" />
        <line x1="100" y1="100" x2="100" y2="180" stroke="currentColor" strokeWidth="10" />
        <circle cx="100" cy="100" r="8" fill="currentColor" />
      </svg>
      {showWord && (
        <span className="font-mono text-[13px] tracking-[0.28em] uppercase">
          Minus<span className="text-silver">/</span>1
        </span>
      )}
    </div>
  )
}
