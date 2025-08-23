"use client";

export default function BackgroundLines() {
  const lines = Array.from({ length: 6 }); // number of vertical lines

  return (
    <div className="absolute inset-0 size-full pointer-events-none -z-10">
      <div className="relative size-full flex justify-between">
        {lines.map((_, i) => (
          <div
            key={i}
            className="h-full w-px bg-gray-200/30"
          />
        ))}
      </div>
    </div>
  );
}
