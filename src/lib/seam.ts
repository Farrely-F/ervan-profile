/**
 * The seam, in one place.
 *
 * Both the WebGL field (a shader uniform) and the DOM (a clip-path and a
 * crisp line) solve the same equation, so the glowing rift and the edge of
 * the worlds can never drift apart:
 *
 *   sin(θ)·(u − 0.5) + cos(θ)·(v − 0.5) = offset
 *
 * θ is measured from the horizontal screen axis, offset in uv units.
 */

export type SeamAxis = {
  sin: number;
  cos: number;
  /** true when the boundary crosses the top/bottom edges. */
  vertical: boolean;
};

export function seamAxis(angleDeg: number): SeamAxis {
  const radians = (angleDeg * Math.PI) / 180;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  return { sin, cos, vertical: Math.abs(sin) > Math.abs(cos) };
}

/** Where the boundary meets the viewport edges, in percent. */
export function seamEdges(
  angleDeg: number,
  offset: number
): { a: number; b: number } & SeamAxis {
  const { sin, cos, vertical } = seamAxis(angleDeg);
  if (vertical) {
    return {
      vertical,
      sin,
      cos,
      a: (0.5 + (offset + 0.5 * cos) / sin) * 100,
      b: (0.5 + (offset - 0.5 * cos) / sin) * 100,
    };
  }
  return {
    vertical,
    sin,
    cos,
    a: (0.5 + (offset + 0.5 * sin) / cos) * 100,
    b: (0.5 + (offset - 0.5 * sin) / cos) * 100,
  };
}

/**
 * Transform for a full-height bar that must lie exactly on the boundary:
 * the bar is rotated into the seam's normal frame, then pushed out to the
 * boundary's foot point.
 */
export function seamTransform(
  angleDeg: number,
  offset: number,
  width: number,
  height: number
): string {
  const { sin, cos } = seamAxis(angleDeg);
  return `translate(-50%, -50%) translate3d(${(offset * sin * width).toFixed(
    2
  )}px, ${(offset * cos * height).toFixed(2)}px, 0) rotate(${
    90 - angleDeg
  }deg)`;
}

/** Clip paths for the two sides of the seam. */
export function seamClips(
  angleDeg: number,
  offset: number
): { near: string; far: string } {
  const { a, b, vertical } = seamEdges(angleDeg, offset);
  if (vertical) {
    return {
      near: `polygon(0% 0%, ${a}% 0%, ${b}% 100%, 0% 100%)`,
      far: `polygon(${a}% 0%, 100% 0%, 100% 100%, ${b}% 100%)`,
    };
  }
  return {
    near: `polygon(0% 0%, 100% 0%, 100% ${b}%, 0% ${a}%)`,
    far: `polygon(0% ${a}%, 100% ${b}%, 100% 100%, 0% 100%)`,
  };
}
