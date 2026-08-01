import { cn } from "@/lib/cn";

function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid h-8 w-8 place-items-center rounded border border-transparent text-ink-faint",
        "transition-colors hover:border-line hover:bg-surface hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-[3px] border border-brass-deep bg-surface font-mono text-[13px] font-semibold text-brass"
          >
            13
          </span>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-ink">
              Chess 13
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:inline">
              Hotseat
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <IconButton label="Rules">
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
              <path
                d="M2.5 3.2A1.2 1.2 0 0 1 3.7 2H7a1.5 1.5 0 0 1 1.5 1.5v9.3A1.3 1.3 0 0 0 7.2 11.5H2.5zM13.5 3.2A1.2 1.2 0 0 0 12.3 2H9a1.5 1.5 0 0 0-1.5 1.5v9.3a1.3 1.3 0 0 1 1.3-1.3h4.7z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
          <IconButton label="Sound">
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
              <path
                d="M8.5 3 5 5.8H2.8v4.4H5L8.5 13zM11 6.2a2.6 2.6 0 0 1 0 3.6M12.9 4.4a5.2 5.2 0 0 1 0 7.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
          <IconButton label="Settings">
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
              <circle
                cx="8"
                cy="8"
                r="2.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
              />
              <path
                d="M8 1.6v1.7M8 12.7v1.7M14.4 8h-1.7M3.3 8H1.6M12.5 3.5l-1.2 1.2M4.7 11.3l-1.2 1.2M12.5 12.5l-1.2-1.2M4.7 4.7 3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>
        </div>
      </div>
    </header>
  );
}
