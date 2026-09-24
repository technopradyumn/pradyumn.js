/**
 * pradyumn.js — public API
 *
 * All public exports are named. There is no default export.
 * Import only what you use; the ESM build is fully tree-shakable.
 *
 * @example
 * import { Rule, Rules, useRule, all, any, not } from "pradyumn.js";
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export type { RuleFn, RuleFnWithContext, RuleInput } from "./core/types";

// ─── Core (React-free) ────────────────────────────────────────────────────────
export { evaluate } from "./core/evaluate";
export { all, any, not } from "./core/combinators";

// ─── React ────────────────────────────────────────────────────────────────────
export { Rule } from "./react/Rule";
export type { RuleProps } from "./react/Rule";

export { Rules } from "./react/Rules";
export type { RulesProps } from "./react/Rules";

export { useRule } from "./react/useRule";
export type { UseRuleResult } from "./react/useRule";
