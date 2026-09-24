import React, { InputHTMLAttributes, ReactNode, forwardRef } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string | ReactNode;
}

/**
 * Accessible styled checkbox with custom indicator.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, onChange, disabled, style, ...rest }, ref) => {
    return (
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.6rem",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          userSelect: "none",
          fontSize: "0.9rem",
          color: "#f8fafc",
          ...style,
        }}
      >
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            width: "18px",
            height: "18px",
            borderRadius: "6px",
            border: `1.5px solid ${checked ? "#ff3366" : "rgba(255, 255, 255, 0.2)"}`,
            backgroundColor: checked ? "#ff3366" : "#0f172a",
            cursor: disabled ? "not-allowed" : "pointer",
            display: "grid",
            placeContent: "center",
            outline: "none",
            transition: "all 0.15s ease",
          }}
          {...rest}
        />
        {label}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
