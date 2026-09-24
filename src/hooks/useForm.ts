import { ChangeEvent, FormEvent, useState } from "react";
import { ValidatorFn, validateField } from "../core/validators";

export type FormValidationRules<T> = {
  [K in keyof T]?: ValidatorFn[];
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type FormTouched<T> = {
  [K in keyof T]?: boolean;
};

export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validate?: FormValidationRules<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

export interface UseFormResult<T extends Record<string, unknown>> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setFieldError: (field: keyof T, error: string | undefined) => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e?: FormEvent) => Promise<void>;
  reset: () => void;
}

/**
 * All-in-one form management hook with built-in validation rules and touched state tracking.
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate = {},
  onSubmit,
}: UseFormOptions<T>): UseFormResult<T> {
  const [values, setFormValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAll = (currentValues: T): FormErrors<T> => {
    const newErrors: FormErrors<T> = {};
    for (const key in validate) {
      const fieldValidators = validate[key];
      if (fieldValidators) {
        const error = validateField(currentValues[key], fieldValidators, currentValues);
        if (error) {
          newErrors[key] = error;
        }
      }
    }
    return newErrors;
  };

  const setValue = <K extends keyof T>(field: K, value: T[K]) => {
    setFormValues((prev) => {
      const updated = { ...prev, [field]: value };
      if (validate[field]) {
        const err = validateField(value, validate[field]!, updated);
        setErrors((prevErr) => ({ ...prevErr, [field]: err || undefined }));
      }
      return updated;
    });
  };

  const setValues = (newVals: Partial<T>) => {
    setFormValues((prev) => ({ ...prev, ...newVals }));
  };

  const setFieldError = (field: keyof T, error: string | undefined) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const finalValue = type === "checkbox" ? checked : value;
    setValue(name as keyof T, finalValue as T[keyof T]);
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const validationErrors = validateAll(values);
    setErrors(validationErrors);

    // Mark all as touched
    const allTouched: FormTouched<T> = {};
    for (const key in values) {
      allTouched[key] = true;
    }
    setTouched(allTouched);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setValues,
    setFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}
