import React, { HTMLAttributes, ReactNode, useState } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
}

/**
 * Modern user avatar with image fallbacks to computed initials and online status badge.
 */
export function Avatar({
  src,
  name,
  size = "md",
  status,
  style,
  ...rest
}: AvatarProps): ReactNode {
  const [hasError, setHasError] = useState(false);

  const sizePixels: Record<string, number> = {
    sm: 32,
    md: 42,
    lg: 56,
    xl: 72,
  };

  const px = sizePixels[size] || 42;

  const getInitials = (n?: string): string => {
    if (!n) return "?";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`.toUpperCase();
    }
    return (n[0] || "?").toUpperCase();
  };

  const statusColors: Record<string, string> = {
    online: "#10b981",
    offline: "#64748b",
    busy: "#ef4444",
    away: "#f59e0b",
  };

  const avatarContainerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    width: `${px}px`,
    height: `${px}px`,
    flexShrink: 0,
    ...style,
  };

  const circleStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #FF3366 0%, #FF9933 100%)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: `${px * 0.4}px`,
    userSelect: "none",
  };

  return (
    <div style={avatarContainerStyle} {...rest}>
      {src && !hasError ? (
        <img
          src={src}
          alt={name || "Avatar"}
          onError={() => setHasError(true)}
          style={{ ...circleStyle, border: "2px solid rgba(255, 255, 255, 0.1)" }}
        />
      ) : (
        <div style={circleStyle}>{getInitials(name)}</div>
      )}

      {status && (
        <span
          style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            width: `${Math.max(8, px * 0.25)}px`,
            height: `${Math.max(8, px * 0.25)}px`,
            borderRadius: "50%",
            backgroundColor: statusColors[status] || "#10b981",
            border: "2px solid #090d16",
          }}
        />
      )}
    </div>
  );
}
