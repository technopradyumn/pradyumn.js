import { describe, it, expect } from "vitest";
import { v, validateField } from "../../src/core/validators";

describe("validators", () => {
  it("validates required fields", () => {
    const required = v.required("Must not be empty");
    expect(required("")).toBe("Must not be empty");
    expect(required(null)).toBe("Must not be empty");
    expect(required(undefined)).toBe("Must not be empty");
    expect(required([])).toBe("Must not be empty");
    expect(required(false)).toBe("Must not be empty");
    expect(required("valid")).toBeNull();
    expect(required(123)).toBeNull();
  });

  it("validates email", () => {
    const email = v.email("Invalid email");
    expect(email("test@example.com")).toBeNull();
    expect(email("invalid-email")).toBe("Invalid email");
    expect(email("")).toBeNull(); // empty handled by required
  });

  it("validates minLength and maxLength", () => {
    const min = v.minLength(5);
    expect(min("abc")).toBe("Must be at least 5 characters");
    expect(min("abcde")).toBeNull();

    const max = v.maxLength(5);
    expect(max("abcdef")).toBe("Must not exceed 5 characters");
    expect(max("abc")).toBeNull();
  });

  it("validates matching fields", () => {
    const matchPassword = v.match("password", "Passwords must match");
    expect(matchPassword("secret", { password: "secret" })).toBeNull();
    expect(matchPassword("different", { password: "secret" })).toBe("Passwords must match");
  });

  it("validates field through array pipeline", () => {
    const validators = [v.required(), v.email()];
    expect(validateField("", validators)).toBe("This field is required");
    expect(validateField("invalid", validators)).toBe("Invalid email address");
    expect(validateField("user@pradyumn.dev", validators)).toBeNull();
  });
});
