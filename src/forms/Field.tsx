import React, { HTMLAttributes, ReactNode } from "react";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string | ReactNode;
  error?: string | null;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

/**
 * Form field wrapper that binds labels, validation errors, and hints.
 */
export function Field({
  label,
  error,
  hint,
  required = false,
  style,
  children,
  ...rest
}: FieldProps): ReactNode {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        width: "100%",
        ...style,
      }}
      {...rest}
    >
      {label && (
        <label
          style={{
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "#cbd5e1",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          {label}
          {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
      )}

      {children}

      {error ? (
        <span style={{ fontSize: "0.78rem", color: "#f87171", fontWeight: "500" }}>
          {error}
        </span>
      ) : hint ? (
        <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{hint}</span>
      ) : null}
    </div>
  );
}
