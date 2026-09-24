import React, { HTMLAttributes, ReactNode } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  dot?: boolean;
  size?: "sm" | "md";
  children?: ReactNode;
}

/**
 * Clean status indicator and category pill badge.
 */
export function Badge({
  variant = "primary",
  dot = false,
  size = "md",
  style,
  children,
  ...rest
}: BadgeProps): ReactNode {
  const variantStyles: Record<string, { bg: string; color: string; border: string; dotColor: string }> = {
    primary: {
      bg: "rgba(255, 51, 102, 0.12)",
      color: "#ff3366",
      border: "rgba(255, 51, 102, 0.25)",
      dotColor: "#ff3366",
    },
    success: {
      bg: "rgba(16, 185, 129, 0.12)",
      color: "#34d399",
      border: "rgba(16, 185, 129, 0.25)",
      dotColor: "#10b981",
    },
    warning: {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#fbbf24",
      border: "rgba(245, 158, 11, 0.25)",
      dotColor: "#f59e0b",
    },
    danger: {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#f87171",
      border: "rgba(239, 68, 68, 0.25)",
      dotColor: "#ef4444",
    },
    info: {
      bg: "rgba(56, 189, 248, 0.12)",
      color: "#38bdf8",
      border: "rgba(56, 189, 248, 0.25)",
      dotColor: "#0284c7",
    },
    neutral: {
      bg: "rgba(255, 255, 255, 0.05)",
      color: "#94a3b8",
      border: "rgba(255, 255, 255, 0.1)",
      dotColor: "#64748b",
    },
  };

  const current = variantStyles[variant] || variantStyles["neutral"];
  const isSm = size === "sm";

  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: isSm ? "0.15rem 0.45rem" : "0.25rem 0.65rem",
    fontSize: isSm ? "0.7rem" : "0.78rem",
    fontWeight: "600",
    borderRadius: "999px",
    backgroundColor: current?.bg,
    color: current?.color,
    border: `1px solid ${current?.border}`,
    lineHeight: 1.2,
    letterSpacing: "0.2px",
    ...style,
  };

  return (
    <span style={badgeStyle} {...rest}>
      {dot && (
        <span
          style={{
            width: isSm ? "5px" : "6px",
            height: isSm ? "5px" : "6px",
            borderRadius: "50%",
            backgroundColor: current?.dotColor,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
