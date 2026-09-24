import React, { HTMLAttributes, ReactNode } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  rounded?: string | number;
}

/**
 * Shimmering animated placeholder for loading states.
 */
export function Skeleton({
  width = "100%",
  height = "1.25rem",
  circle = false,
  rounded,
  style,
  ...rest
}: SkeletonProps): ReactNode {
  const defaultRadius = circle ? "50%" : rounded !== undefined ? rounded : "8px";

  const skeletonStyle: React.CSSProperties = {
    width: circle && height ? height : typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: typeof defaultRadius === "number" ? `${defaultRadius}px` : defaultRadius,
    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
    backgroundSize: "200% 100%",
    animation: "pradyumn-shimmer 1.5s infinite",
    ...style,
  };

  return <div style={skeletonStyle} {...rest} />;
}
