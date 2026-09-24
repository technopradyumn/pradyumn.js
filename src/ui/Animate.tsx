import React, { HTMLAttributes, ReactNode } from "react";

export interface AnimateProps extends HTMLAttributes<HTMLDivElement> {
  type?: "fade" | "slide-up" | "slide-down" | "scale";
  duration?: number;
  delay?: number;
  children?: ReactNode;
}

/**
 * Hardware-accelerated micro-animation wrapper.
 */
export function Animate({
  type = "fade",
  duration = 250,
  delay = 0,
  style,
  children,
  ...rest
}: AnimateProps): ReactNode {
  const getAnimationName = () => {
    switch (type) {
      case "fade":
        return "pradyumn-fade";
      case "slide-up":
        return "pradyumn-slide-up";
      case "slide-down":
        return "pradyumn-slide-down";
      case "scale":
        return "pradyumn-scale";
    }
  };

  const animStyle: React.CSSProperties = {
    animationName: getAnimationName(),
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
    animationFillMode: "both",
    animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    ...style,
  };

  return (
    <div style={animStyle} {...rest}>
      {children}
    </div>
  );
}
