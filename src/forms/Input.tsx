import React, { InputHTMLAttributes, ReactNode, forwardRef, useState } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  hasError?: boolean;
}

/**
 * Modern styled text input with prefix/suffix slots and clear action.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      prefixIcon,
      suffixIcon,
      clearable = false,
      onClear,
      hasError = false,
      value,
      onChange,
      disabled,
      style,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const hasValue = value !== undefined && value !== null && String(value).length > 0;

    const containerStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.6rem 0.85rem",
      background: "#0f172a",
      border: `1px solid ${
        hasError
          ? "#ef4444"
          : isFocused
          ? "#ff3366"
          : "rgba(255, 255, 255, 0.12)"
      }`,
      borderRadius: "10px",
      boxShadow: isFocused
        ? hasError
          ? "0 0 0 2px rgba(239, 68, 68, 0.25)"
          : "0 0 0 2px rgba(255, 51, 102, 0.25)"
        : "none",
      transition: "all 0.2s ease",
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? "not-allowed" : "text",
      ...style,
    };

    const inputElementStyle: React.CSSProperties = {
      flex: 1,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "#f8fafc",
      fontSize: "0.95rem",
      fontFamily: "inherit",
      width: "100%",
    };

    return (
      <div style={containerStyle}>
        {prefixIcon && <span style={{ color: "#64748b", display: "flex" }}>{prefixIcon}</span>}
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={inputElementStyle}
          {...rest}
        />
        {clearable && hasValue && !disabled && (
          <button
            type="button"
            onClick={onClear}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              padding: "0.1rem",
              lineHeight: 1,
              fontSize: "0.85rem",
            }}
          >
            ✕
          </button>
        )}
        {suffixIcon && <span style={{ color: "#64748b", display: "flex" }}>{suffixIcon}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
