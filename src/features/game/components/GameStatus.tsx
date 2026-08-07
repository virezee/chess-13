import { cn } from "@/lib/cn";
import type { GameCounters } from "../../../types/panel";

function RepetitionGauge({
  value,
  limit,
}: {
  value: number;
  limit: number;
}) {
  // The third repetition loses the game, so warn before the player reaches it.
  const critical = value >= limit - 1;

  return (
    <div className="border-t border-line px-3.5 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          Repetition
        </p>
        <span
          className={cn(
            "font-mono text-[11px]",
            critical ? "text-alert" : "text-ink-dim",
          )}
        >
          {value}/{limit}
        </span>
      </div>

      <div className="mt-2 flex gap-1">
        {Array.from({ length: limit }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-[1px]",
              i >= value && "bg-track",
              i < value && !critical && "bg-ink-faint",
              i < value && critical && "bg-alert",
            )}
          />
        ))}
      </div>

      <p
        className={cn(
          "mt-2 text-[11px]",
          critical ? "text-alert" : "text-ink-faint",
        )}
      >
        {critical
          ? "One more repetition loses the game"
          : "Third repetition loses the game"}
      </p>
    </div>
  );
}

function NoProgressGauge({
  value,
  limit,
}: {
  value: number;
  limit: number;
}) {
  const ratio = limit === 0 ? 0 : Math.min(value / limit, 1);
  const critical = ratio >= 0.8;

  return (
    <div className="border-t border-line px-3.5 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          No progress
        </p>
        <span
          className={cn(
            "font-mono text-[11px]",
            critical ? "text-alert" : "text-ink-dim",
          )}
        >
          {value}/{limit}
        </span>
      </div>

      <div className="mt-2 h-1 w-full overflow-hidden rounded-[1px] bg-track">
        <div
          className={cn(
            "h-full transition-[width] duration-300",
            critical ? "bg-alert" : "bg-ink-faint",
          )}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>

      <p className="mt-2 text-[11px] text-ink-faint">
        Limit rises as pieces leave the board
      </p>
    </div>
  );
}

function Action({
  children,
  tone = "quiet",
}: {
  children: React.ReactNode;
  tone?: "quiet" | "brass";
}) {
  return (
    <button
      type="button"
      className={cn(
        "h-9 flex-1 rounded-[3px] border text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
        tone === "brass" &&
          "border-brass-deep bg-brass/10 text-brass hover:bg-brass/18",
        tone === "quiet" &&
          "border-line bg-surface-2 text-ink-dim hover:border-line-strong hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function GameStatus({
  counters,
  swapAvailable,
}: {
  counters: GameCounters;
  swapAvailable: boolean;
}) {
  return (
    <section className="overflow-hidden rounded border border-line bg-surface">
      <header className="px-3.5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          Clocks off · counters
        </p>
      </header>

      <RepetitionGauge
        value={counters.repetition}
        limit={counters.repetitionLimit}
      />
      <NoProgressGauge
        value={counters.noProgress}
        limit={counters.noProgressLimit}
      />

      <div className="border-t border-line px-3.5 py-3">
        {swapAvailable && (
          <div className="mb-2">
            <Action tone="brass">Swap sides</Action>
            <p className="mt-1.5 text-[11px] text-ink-faint">
              Available on black&apos;s first turn only
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <Action>Resign</Action>
          <Action>New game</Action>
        </div>
      </div>
    </section>
  );
}
