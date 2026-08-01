import { cn } from "@/lib/cn";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];
const RANKS = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

/** The Marshal's command square, at the exact centre of the board. */
const COMMAND_FILE = 6;
const COMMAND_RANK = 7;

/**
 * The M sits inside an SVG so it scales with the square instead of with a font
 * size. Width is the binding dimension for this glyph, so FONT_SIZE fills the
 * box horizontally, and BASELINE puts the cap exactly halfway down: half of the
 * cap height below the centre line. Tune CAP_HEIGHT if the glyph reads high or
 * low.
 */
const CAP_HEIGHT = 0.7;
const FONT_SIZE = 80;
const BASELINE = 50 + (FONT_SIZE * CAP_HEIGHT) / 2;

function CommandGlyph() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <text
        x="50"
        y={BASELINE}
        textAnchor="middle"
        fontSize={FONT_SIZE}
        className="fill-square-command-ink font-command"
      >
        M
      </text>
    </svg>
  );
}

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
        isCommand && "bg-square-command",
        !isCommand && (isLight ? "bg-square-light" : "bg-square-dark"),
      )}
    >
      {isCommand && <CommandGlyph />}
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
