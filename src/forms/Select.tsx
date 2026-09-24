import React, { SelectHTMLAttributes, ReactNode, forwardRef } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  hasError?: boolean;
  children?: ReactNode;
}

/**
 * Clean styled dropdown select.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, hasError = false, children, style, ...rest }, ref) => {
    const selectStyle: React.CSSProperties = {
      padding: "0.6rem 0.85rem",
      background: "#0f172a",
      border: `1px solid ${hasError ? "#ef4444" : "rgba(255, 255, 255, 0.12)"}`,
      borderRadius: "10px",
      color: "#f8fafc",
      fontSize: "0.95rem",
      outline: "none",
      cursor: "pointer",
      fontFamily: "inherit",
      width: "100%",
      ...style,
    };

    return (
      <select ref={ref} style={selectStyle} {...rest}>
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);

Select.displayName = "Select";
