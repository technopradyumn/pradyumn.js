import React, { HTMLAttributes, ReactNode } from "react";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  gradient?: boolean | string;
  children?: ReactNode;
}

/**
 * Modern semantic typography heading with optional radiant gradient fill.
 */
export function Heading({
  level = 2,
  gradient = false,
  style,
  children,
  ...rest
}: HeadingProps): ReactNode {
  const Component = `h${level}` as const;

  const fontSizes: Record<number, string> = {
    1: "2.5rem",
    2: "2rem",
    3: "1.5rem",
    4: "1.25rem",
    5: "1rem",
    6: "0.875rem",
  };

  const gradientFill =
    typeof gradient === "string"
      ? gradient
      : "linear-gradient(135deg, #FF3366 0%, #FF9933 100%)";

  const gradientStyle: React.CSSProperties = gradient
    ? {
        background: gradientFill,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
      }
    : {};

  const headingStyle: React.CSSProperties = {
    margin: 0,
    fontSize: fontSizes[level] || "1.5rem",
    fontWeight: "800",
    letterSpacing: level <= 2 ? "-0.5px" : "-0.2px",
    lineHeight: 1.25,
    color: "#f8fafc",
    ...gradientStyle,
    ...style,
  };

  return React.createElement(Component, { style: headingStyle, ...rest }, children);
}
