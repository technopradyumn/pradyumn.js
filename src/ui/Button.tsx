import React, { ButtonHTMLAttributes, ReactNode, useState } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  children?: ReactNode;
}

/**
 * Smart interactive button with built-in loading states, variants, and icon slots.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  disabled,
  style,
  children,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: ButtonProps): ReactNode {
  const [isHovered, setIsHovered] = useState(false);

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "0.35rem 0.75rem", fontSize: "0.8rem", borderRadius: "8px" },
    md: { padding: "0.6rem 1.25rem", fontSize: "0.9rem", borderRadius: "10px" },
    lg: { padding: "0.85rem 1.75rem", fontSize: "1.05rem", borderRadius: "14px" },
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          background: isHovered
            ? "linear-gradient(135deg, #FF1A53 0%, #FF851A 100%)"
            : "linear-gradient(135deg, #FF3366 0%, #FF9933 100%)",
          color: "#ffffff",
          border: "none",
          boxShadow: isHovered ? "0 6px 20px rgba(255, 51, 102, 0.4)" : "0 4px 14px rgba(255, 51, 102, 0.25)",
        };
      case "secondary":
        return {
          background: isHovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)",
          color: "#f8fafc",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        };
      case "danger":
        return {
          background: isHovered ? "#dc2626" : "#ef4444",
          color: "#ffffff",
          border: "none",
        };
      case "ghost":
        return {
          background: isHovered ? "rgba(255, 255, 255, 0.06)" : "transparent",
          color: "#94a3b8",
          border: "none",
        };
    }
  };

  const buttonStyle: React.CSSProperties = {
    display: fullWidth ? "flex" : "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontWeight: "600",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
    width: fullWidth ? "100%" : "auto",
    ...sizeStyles[size],
    ...getVariantStyles(),
    ...style,
  };

  return (
    <button
      disabled={disabled || loading}
      style={buttonStyle}
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
      {loading && (
        <span
          style={{
            display: "inline-block",
            width: "14px",
            height: "14px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "pradyumn-spin 0.6s linear infinite",
          }}
        />
      )}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}
