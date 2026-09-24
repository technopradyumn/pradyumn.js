import React, { FormHTMLAttributes, ReactNode, useState } from "react";

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "children"> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: ReactNode | ((state: { isSubmitting: boolean }) => ReactNode);
}

/**
 * Smart Form container with automatic preventDefault and submission loading state.
 */
export function Form({ onSubmit, children, style, ...rest }: FormProps): ReactNode {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem", ...style }}
      {...rest}
    >
      {typeof children === "function" ? children({ isSubmitting }) : children}
    </form>
  );
}
