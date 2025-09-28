"use client";

import React from "react";

const NAMED: Record<string, string> = {
  red: "#EF4444",
  purple: "#8B5CF6",
  green: "#22C55E",
  peach: "#FFCBA4",
  blue: "#3B82F6",
  navy: "#001F3F",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#9CA3AF",
};

const ALIASES: Record<string, string> = {
  "navy blue": "navy",
  "dark blue": "#1E3A8A",
  "sky blue": "#87CEEB",
  "baby blue": "#89CFF0",
  "forest green": "#228B22",
};

function normalizeColor(input: string) {
  const key = input.trim().toLowerCase();
  if (NAMED[key]) return NAMED[key];
  if (ALIASES[key]) return NAMED[ALIASES[key]] ?? ALIASES[key];
  const collapsed = key.replace(/[\s_-]+/g, "");
  if (NAMED[collapsed]) return NAMED[collapsed];
  const words = key.split(/\s+/);
  const last = words[words.length - 1];
  if (NAMED[last]) return NAMED[last];
  return input;
}

export default function ColorSwatches({
  colors,
  value,
  onChange,
}: {
  colors: string[];
  value?: string;
  onChange?: (color: string) => void;
}) {
  const [selected, setSelected] = React.useState<string | undefined>(value);
  React.useEffect(() => setSelected(value), [value]);

  const pick = (c: string) => {
    setSelected(c);
    onChange?.(c);
  };

  if (!colors?.length) return null;

  return (
    <div className="space-y-4">
      <div className="text-[16px] text-[#10151F]">
        Color: <span className="font-medium">{selected ?? "None"}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {colors.map((c) => {
          const isSel = selected?.toLowerCase() === c.toLowerCase();
          return (
            <button
              key={c}
              type="button"
              title={c}
              onClick={() => pick(c)}
              aria-pressed={isSel}
              className={`relative inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border transition ${
                isSel ? "ring-2 ring-[#E1DFE1] ring-offset-2" : "hover:ring-1 hover:ring-[#E1DFE1]"
              }`}
              style={{ backgroundColor: normalizeColor(c), borderColor: "rgba(0,0,0,0.08)" }}
            />
          );
        })}
      </div>
    </div>
  );
}
