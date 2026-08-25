import { getTypeColor } from "../typeTheme";

export function TypeBadge({ type }: { type: string }) {
  return (
    <span
      style={{ "--accent": getTypeColor(type) } as React.CSSProperties}
      className="accent-bg rounded-full px-3 py-1 font-mono text-label font-bold uppercase tracking-label text-white"
    >
      {type}
    </span>
  );
}
