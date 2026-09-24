import React, { HTMLAttributes, ReactNode } from "react";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  gap?: string | number;
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  wrap?: boolean | React.CSSProperties["flexWrap"];
  inline?: boolean;
  children?: ReactNode;
}

/**
 * High-productivity Flexbox layout container.
 *
 * @example
 * <Stack direction="row" gap="1rem" align="center">
 *   <Avatar name="Pradyumn" />
 *   <Text>Welcome back!</Text>
 * </Stack>
 */
export function Stack({
  direction = "column",
  gap = "1rem",
  align,
  justify,
  wrap,
  inline = false,
  style,
  children,
  ...rest
}: StackProps): ReactNode {
  const stackStyle: React.CSSProperties = {
    display: inline ? "inline-flex" : "flex",
    flexDirection: direction,
    gap: typeof gap === "number" ? `${gap}px` : gap,
    alignItems: align,
    justifyContent: justify,
    flexWrap: typeof wrap === "boolean" ? (wrap ? "wrap" : "nowrap") : wrap,
    ...style,
  };

  return (
    <div style={stackStyle} {...rest}>
      {children}
    </div>
  );
}
