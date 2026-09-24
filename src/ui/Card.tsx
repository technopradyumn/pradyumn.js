import React, { HTMLAttributes, ReactNode, useState } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "bordered" | "flat";
  glow?: boolean;
  hover?: boolean;
  p?: string | number;
  rounded?: string | number;
  children?: ReactNode;
}

/**
 * Modern surface container with glassmorphism, subtle borders, and optional hover elevation.
 */
export function Card({
  variant = "glass",
  glow = false,
  hover = false,
  p = "1.5rem",
  rounded = "18px",
  style,
  children,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: CardProps): ReactNode {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "glass":
        return {
          background: "rgba(17, 24, 39, 0.65)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        };
      case "bordered":
        return {
          background: "transparent",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        };
      case "flat":
        return {
          background: "#111827",
          border: "none",
        };
    }
  };

  const glowStyle: React.CSSProperties = glow
    ? {
        boxShadow: "0 0 25px rgba(255, 51, 102, 0.25)",
      }
    : {};

  const hoverStyle: React.CSSProperties =
    hover && isHovered
      ? {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 35px rgba(0, 0, 0, 0.45)",
          borderColor: "rgba(255, 255, 255, 0.18)",
        }
      : {};

  const cardStyle: React.CSSProperties = {
    padding: typeof p === "number" ? `${p}px` : p,
    borderRadius: typeof rounded === "number" ? `${rounded}px` : rounded,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    ...getVariantStyles(),
    ...glowStyle,
    ...hoverStyle,
    ...style,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (onMouseEnter) onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        if (onMouseLeave) onMouseLeave(e);
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
