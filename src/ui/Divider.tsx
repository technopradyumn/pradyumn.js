import React, { HTMLAttributes, ReactNode } from "react";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string | ReactNode;
  color?: string;
}

/**
 * Visual separator line with optional centered label.
 */
export function Divider({
  orientation = "horizontal",
  label,
  color = "rgba(255, 255, 255, 0.08)",
  style,
  ...rest
}: DividerProps): ReactNode {
  if (orientation === "vertical") {
    return (
      <div
        style={{
          width: "1px",
          height: "100%",
          minHeight: "1rem",
          backgroundColor: color,
          display: "inline-block",
          margin: "0 0.5rem",
          ...style,
        }}
        {...rest}
      />
    );
  }

  if (label) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          width: "100%",
          margin: "1rem 0",
          ...style,
        }}
        {...rest}
      >
        <div style={{ flex: 1, height: "1px", backgroundColor: color }} />
        <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>
          {label}
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: color }} />
      </div>
    );
  }

  return (
    <hr
      style={{
        border: "none",
        borderTop: `1px solid ${color}`,
        width: "100%",
        margin: "1rem 0",
        ...style,
      }}
      {...rest}
    />
  );
}
