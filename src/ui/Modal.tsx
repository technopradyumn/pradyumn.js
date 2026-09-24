import React, { ReactNode, useEffect } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  width?: string | number;
  children: ReactNode;
}

/**
 * Modern glassmorphic dialog with backdrop blur and ESC key support.
 */
export function Modal({
  open,
  onClose,
  title,
  width = "500px",
  children,
}: ModalProps): ReactNode {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "pradyumn-fade 0.2s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#0f172a",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
          animation: "pradyumn-scale 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          {title ? (
            typeof title === "string" ? (
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "#f8fafc" }}>
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

        <div>{children}</div>
      </div>
    </div>
  );
}
