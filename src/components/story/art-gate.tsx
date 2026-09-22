"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Keeps the art scenes off the compositor's books: while the wrapped scene is
 * out of view, every CSS animation inside it is paused. The scenes carry a
 * few hundred animated SVG nodes each — beautiful, and not free.
 */
export function ArtGate({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { rootMargin: "12% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-art={live ? "live" : "paused"}
      className={className}
    >
      {children}
    </div>
  );
}
