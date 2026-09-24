import React, { ReactNode, useState } from "react";

export interface TooltipProps {
  content: string | ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}

/**
 * Micro hover tooltip with auto position offsets.
 */
export function Tooltip({
  content,
  position = "top",
  children,
}: TooltipProps): ReactNode {
  const [visible, setVisible] = useState(false);

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { bottom: "100%", left: "50%", transform: "translateX(-50%) translateY(-6px)" },
    bottom: { top: "100%", left: "50%", transform: "translateX(-50%) translateY(6px)" },
    left: { right: "100%", top: "50%", transform: "translateY(-50%) translateX(-6px)" },
    right: { left: "100%", top: "50%", transform: "translateY(-50%) translateX(6px)" },
  };

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          style={{
            position: "absolute",
            zIndex: 9999,
            padding: "0.35rem 0.65rem",
            background: "#1e293b",
            color: "#f8fafc",
            fontSize: "0.78rem",
            fontWeight: "500",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            pointerEvents: "none",
            animation: "pradyumn-fade 0.15s ease-out",
            ...positionStyles[position],
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
