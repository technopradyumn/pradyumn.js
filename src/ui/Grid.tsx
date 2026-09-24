import React, { HTMLAttributes, ReactNode } from "react";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Explicit number of columns (e.g. 3) or CSS grid template columns string */
  columns?: number | string;
  /** Minimum width for auto-fit responsive columns (e.g. "280px") */
  minItemWidth?: string;
  /** Spacing between grid cells */
  gap?: string | number;
  children?: ReactNode;
}

/**
 * Responsive CSS Grid container that automatically adapts across screen sizes.
 *
 * @example
 * <Grid minItemWidth="300px" gap="1.5rem">
 *   <Card>1</Card>
 *   <Card>2</Card>
 * </Grid>
 */
export function Grid({
  columns,
  minItemWidth,
  gap = "1rem",
  style,
  children,
  ...rest
}: GridProps): ReactNode {
  let templateColumns: string;

  if (minItemWidth) {
    templateColumns = `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`;
  } else if (typeof columns === "number") {
    templateColumns = `repeat(${columns}, 1fr)`;
  } else if (typeof columns === "string") {
    templateColumns = columns;
  } else {
    templateColumns = "repeat(auto-fit, minmax(260px, 1fr))";
  }

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: templateColumns,
    gap: typeof gap === "number" ? `${gap}px` : gap,
    ...style,
  };

  return (
    <div style={gridStyle} {...rest}>
      {children}
    </div>
  );
}
