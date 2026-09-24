/**
 * Declarative Validation Primitives for Pradyumn.js.
 */

export type ValidatorFn = (value: unknown, allValues?: Record<string, unknown>) => string | null;

export const v = {
  required(msg = "This field is required"): ValidatorFn {
    return (val) => {
      if (val === null || val === undefined) return msg;
      if (typeof val === "string" && val.trim() === "") return msg;
      if (Array.isArray(val) && val.length === 0) return msg;
      if (typeof val === "boolean" && !val) return msg;
      return null;
    };
  },

  email(msg = "Invalid email address"): ValidatorFn {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (val) => {
      if (!val) return null; // let required handle empty
      if (typeof val === "string" && !emailRegex.test(val.trim())) {
        return msg;
      }
      return null;
    };
  },

  minLength(length: number, msg?: string): ValidatorFn {
    const message = msg || `Must be at least ${length} characters`;
    return (val) => {
      if (!val) return null;
      if (typeof val === "string" && val.length < length) return message;
      if (Array.isArray(val) && val.length < length) return message;
      return null;
    };
  },

  maxLength(length: number, msg?: string): ValidatorFn {
    const message = msg || `Must not exceed ${length} characters`;
    return (val) => {
      if (!val) return null;
      if (typeof val === "string" && val.length > length) return message;
      if (Array.isArray(val) && val.length > length) return message;
      return null;
    };
  },

  min(minVal: number, msg?: string): ValidatorFn {
    const message = msg || `Minimum value is ${minVal}`;
    return (val) => {
      if (val === null || val === undefined || val === "") return null;
      const num = Number(val);
      if (isNaN(num) || num < minVal) return message;
      return null;
    };
  },

  max(maxVal: number, msg?: string): ValidatorFn {
    const message = msg || `Maximum value is ${maxVal}`;
    return (val) => {
      if (val === null || val === undefined || val === "") return null;
      const num = Number(val);
      if (isNaN(num) || num > maxVal) return message;
      return null;
    };
  },

  pattern(regex: RegExp, msg = "Invalid format"): ValidatorFn {
    return (val) => {
      if (!val) return null;
      if (typeof val === "string" && !regex.test(val)) return msg;
      return null;
    };
  },

  match(fieldName: string, msg?: string): ValidatorFn {
    const message = msg || `Must match ${fieldName}`;
    return (val, allValues) => {
      if (!allValues) return null;
      if (val !== allValues[fieldName]) return message;
      return null;
    };
  },

  custom(fn: (val: unknown, allValues?: Record<string, unknown>) => boolean | string, defaultMsg = "Invalid field"): ValidatorFn {
    return (val, allValues) => {
      const res = fn(val, allValues);
      if (typeof res === "string") return res;
      if (!res) return defaultMsg;
      return null;
    };
  },
};

/**
 * Validates a single value against an array of validator functions.
 * Returns the first error message or null if all pass.
 */
export function validateField(
  value: unknown,
  validators: ValidatorFn[],
  allValues?: Record<string, unknown>
): string | null {
  for (const validator of validators) {
    const error = validator(value, allValues);
    if (error) return error;
  }
  return null;
}
