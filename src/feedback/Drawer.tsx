import React, { ReactNode, useEffect } from "react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  position?: "left" | "right" | "top" | "bottom";
  size?: string | number;
  title?: string | ReactNode;
  children: ReactNode;
}

/**
 * Slide-out navigation or details drawer with backdrop.
 */
export function Drawer({
  open,
  onClose,
  position = "right",
  size = "360px",
  title,
  children,
}: DrawerProps): ReactNode {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isHorizontal = position === "left" || position === "right";
  const sizeValue = typeof size === "number" ? `${size}px` : size;

  const positionStyles: Record<string, React.CSSProperties> = {
    right: { top: 0, right: 0, bottom: 0, width: sizeValue, height: "100%" },
    left: { top: 0, left: 0, bottom: 0, width: sizeValue, height: "100%" },
    top: { top: 0, left: 0, right: 0, height: sizeValue, width: "100%" },
    bottom: { bottom: 0, left: 0, right: 0, height: sizeValue, width: "100%" },
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9998,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          position: "absolute",
          background: "#0f172a",
          borderLeft: position === "right" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          borderRight: position === "left" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          padding: "1.75rem",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
          overflowY: "auto",
          ...positionStyles[position],
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          {title ? (
            typeof title === "string" ? (
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#f8fafc" }}>
                {title}
              </h3>
            ) : (
              title
            )
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "1.25rem",
              padding: "0.25rem",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
