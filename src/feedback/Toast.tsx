import React, { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners = new Set<ToastListener>();

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  show(message: string, type: ToastType = "info", duration = 3000) {
    const id = Math.random().toString(36).substring(2, 9);
    const item: ToastItem = { id, message, type, duration };
    this.toasts.push(item);
    this.notify();

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  success(message: string, duration = 3000) {
    this.show(message, "success", duration);
  }

  error(message: string, duration = 4000) {
    this.show(message, "error", duration);
  }

  info(message: string, duration = 3000) {
    this.show(message, "info", duration);
  }
}

export const toast = new ToastManager();

export interface ToasterProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

/**
 * Lightweight zero-dependency Toast notification container.
 *
 * @example
 * // in App root:
 * <Toaster position="top-right" />
 *
 * // anywhere in code:
 * toast.success("Saved successfully!");
 */
export function Toaster({ position = "top-right" }: ToasterProps): React.ReactNode {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  const isTop = position.startsWith("top");
  const isRight = position.endsWith("right");

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 10000,
    top: isTop ? "1.5rem" : "auto",
    bottom: !isTop ? "1.5rem" : "auto",
    right: isRight ? "1.5rem" : "auto",
    left: !isRight ? "1.5rem" : "auto",
    display: "flex",
    flexDirection: isTop ? "column" : "column-reverse",
    gap: "0.75rem",
    maxWidth: "380px",
    width: "100%",
    pointerEvents: "none",
  };

  const typeConfig: Record<ToastType, { icon: string; bg: string; border: string; color: string }> = {
    success: { icon: "✅", bg: "rgba(16, 185, 129, 0.15)", border: "#10b981", color: "#34d399" },
    error: { icon: "❌", bg: "rgba(239, 68, 68, 0.15)", border: "#ef4444", color: "#f87171" },
    info: { icon: "ℹ️", bg: "rgba(56, 189, 248, 0.15)", border: "#38bdf8", color: "#38bdf8" },
  };

  return (
    <div style={containerStyle}>
      {toasts.map((t) => {
        const conf = typeConfig[t.type];
        return (
          <div
            key={t.id}
            style={{
              pointerEvents: "auto",
              padding: "0.85rem 1.15rem",
              background: "#0f172a",
              border: `1px solid ${conf.border}`,
              backgroundColor: conf.bg,
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              color: "#f8fafc",
              fontSize: "0.9rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              animation: "pradyumn-slide-up 0.25s ease-out",
            }}
          >
            <span>{conf.icon}</span>
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => toast.remove(t.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                padding: "0.2rem",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
