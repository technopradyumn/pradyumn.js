import React, { ElementType, HTMLAttributes, ReactNode } from "react";

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /** HTML tag to render (default 'div') */
  as?: ElementType;
  /** Apply glassmorphism styling */
  glass?: boolean;
  /** Background color or CSS variable */
  bg?: string;
  /** Padding shorthand (e.g. "1rem" or "10px 20px") */
  p?: string | number;
  /** Margin shorthand */
  m?: string | number;
  /** Border radius shorthand */
  rounded?: string | number;
  /** Border shorthand */
  border?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  children?: ReactNode;
}

/**
 * Universal polymorphic layout primitive with built-in style props and glassmorphism.
 */
export function Box({
  as: Component = "div",
  glass = false,
  bg,
  p,
  m,
  rounded,
  border,
  style,
  children,
  ...rest
}: BoxProps): ReactNode {
  const glassStyle: React.CSSProperties = glass
    ? {
        background: "rgba(17, 24, 39, 0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }
    : {};

  const boxStyle: React.CSSProperties = {
    boxSizing: "border-box",
    ...(bg ? { background: bg } : {}),
    ...(p !== undefined ? { padding: typeof p === "number" ? `${p}px` : p } : {}),
    ...(m !== undefined ? { margin: typeof m === "number" ? `${m}px` : m } : {}),
    ...(rounded !== undefined
      ? { borderRadius: typeof rounded === "number" ? `${rounded}px` : rounded }
      : {}),
    ...(border ? { border } : {}),
    ...glassStyle,
    ...style,
  };

  return (
    <Component style={boxStyle} {...rest}>
      {children}
    </Component>
  );
}
