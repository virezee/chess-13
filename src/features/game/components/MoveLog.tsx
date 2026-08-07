import { cn } from "@/lib/cn";
import type { LoggedTurn } from "../../../types/panel";
import { Side } from "@/types/piece";

function Cell({
  move,
  pending,
  latest,
}: {
  move: string | null;
  pending: boolean;
  latest: boolean;
}) {
  if (move === null) {
    return (
      <span
        className={cn(
          "rounded-xs px-1.5 py-1 font-notation font-bold text-[12px]",
          pending ? "text-ink-faint" : "text-transparent",
        )}
      >
        {pending ? "…" : "-"}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "rounded-xs px-1.5 py-1 font-notation font-bold text-[12px]",
        latest ? "bg-brass/12 text-brass" : "text-ink-dim",
      )}
    >
      {move}
    </span>
  );
}

export function MoveLog({
  turns,
  toMove,
}: {
  turns: LoggedTurn[];
  toMove: Side;
}) {
  const lastIndex = turns.length - 1;

  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded border border-line bg-surface">
      <header className="flex items-baseline justify-between border-b border-line px-3.5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          Move log
        </p>
        <span className="font-mono text-[11px] text-ink-faint">
          {turns.length} turns
        </span>
      </header>

      <div className="scroll-thin max-h-76 min-h-0 flex-1 overflow-y-auto px-2 py-2">
        <ol>
          {turns.map((turn, i) => {
            const isLast = i === lastIndex;
            return (
              <li
                key={turn.number}
                className="grid grid-cols-[2rem_1fr_1fr] items-center gap-1 rounded-xs px-1 py-0.5 hover:bg-surface-2"
              >
                <span className="font-mono text-[11px] text-ink-faint">
                  {turn.number}
                </span>
                <Cell
                  move={turn.white}
                  pending={false}
                  latest={isLast && turn.black === null}
                />
                <Cell
                  move={turn.black}
                  pending={isLast && toMove === "black"}
                  latest={isLast && turn.black !== null}
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
