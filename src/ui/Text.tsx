import React, { HTMLAttributes, ReactNode } from "react";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "muted" | "subtle" | "primary" | "success" | "danger";
  weight?: "normal" | "medium" | "semibold" | "bold";
  truncate?: boolean;
  lines?: number;
  mono?: boolean;
  children?: ReactNode;
}

/**
 * Expressive typography text primitive with line clamping and color tokens.
 */
export function Text({
  size = "md",
  color = "default",
  weight = "normal",
  truncate = false,
  lines,
  mono = false,
  style,
  children,
  ...rest
}: TextProps): ReactNode {
  const fontSizes: Record<string, string> = {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
  };

  const fontColors: Record<string, string> = {
    default: "#f8fafc",
    muted: "#94a3b8",
    subtle: "#64748b",
    primary: "#ff3366",
    success: "#34d399",
    danger: "#f87171",
  };

  const fontWeights: Record<string, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };

  const truncateStyles: React.CSSProperties = truncate
    ? {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }
    : lines && lines > 1
    ? {
        display: "-webkit-box",
        WebkitLineClamp: lines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }
    : {};

  const textStyle: React.CSSProperties = {
    margin: 0,
    fontSize: fontSizes[size] || "1rem",
    color: fontColors[color] || fontColors["default"],
    fontWeight: fontWeights[weight] || 400,
    fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
    lineHeight: 1.6,
    ...truncateStyles,
    ...style,
  };

  return (
    <p style={textStyle} {...rest}>
      {children}
    </p>
  );
}
