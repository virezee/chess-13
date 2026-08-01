import { cn } from "@/lib/cn";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];
const RANKS = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

/** The Marshal's command square, at the exact centre of the board. */
const COMMAND_FILE = 6;
const COMMAND_RANK = 7;

function Square({
  file,
  rank,
  isLight,
  isCommand,
}: {
  file: number;
  rank: number;
  isLight: boolean;
  isCommand: boolean;
}) {
  return (
    <div
      data-square={`${FILES[file]}${rank}`}
      className={cn(
        "relative",
        isLight ? "bg-square-light" : "bg-square-dark",
      )}
    >
      {isCommand && (
        <span
          aria-hidden
          className="absolute inset-[18%] rotate-45 rounded-[1px] border border-brass/70 bg-brass/25"
        />
      )}
    </div>
  );
}

export function Board() {
  return (
    <div className="w-full max-w-[min(100%,calc(100vh-9.5rem))]">
      <div className="grid grid-cols-[1.4rem_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_1.4rem]">
        <div className="flex flex-col justify-around pr-2 text-right font-mono text-[10px] text-ink-faint">
          {RANKS.map((rank) => (
            <span key={rank}>{rank}</span>
          ))}
        </div>

        <div className="grid aspect-square grid-cols-[repeat(13,minmax(0,1fr))] overflow-hidden rounded-[3px] outline outline-square-edge">
          {RANKS.map((rank) =>
            FILES.map((_, file) => (
              <Square
                key={`${file}-${rank}`}
                file={file}
                rank={rank}
                isLight={(file + rank) % 2 === 0}
                isCommand={file === COMMAND_FILE && rank === COMMAND_RANK}
              />
            )),
          )}
        </div>

        <div />

        <div className="flex justify-around pt-2 font-mono text-[10px] text-ink-faint">
          {FILES.map((file) => (
            <span key={file}>{file}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
