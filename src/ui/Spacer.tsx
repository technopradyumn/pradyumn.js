import React, { ReactNode } from "react";

export interface SpacerProps {
  x?: string | number;
  y?: string | number;
}

/**
 * Clean whitespace spacer for layouts.
 */
export function Spacer({ x, y }: SpacerProps): ReactNode {
  return (
    <div
      style={{
        width: x !== undefined ? (typeof x === "number" ? `${x}px` : x) : "100%",
        height: y !== undefined ? (typeof y === "number" ? `${y}px` : y) : "auto",
        flexShrink: 0,
        display: x !== undefined && y === undefined ? "inline-block" : "block",
      }}
    />
  );
}
