/**
 * Core type primitives for pradyumn.js.
 *
 * Design decisions:
 * - `RuleFn` is a zero-argument function that returns boolean.
 *   Components capture external state through closures; no context argument
 *   is needed at the component boundary in v0.1. Context-parameterized rules
 *   (`RuleFnWithContext`) are provided for reusable, standalone rule functions
 *   that should be tested without closures.
 * - `RuleInput` is the union type accepted everywhere: a pre-evaluated boolean
 *   or a function to be called by the evaluator.
 * - `Promise<boolean>` is intentionally EXCLUDED from v0.1. An async rule
 *   returning a Promise would be treated as truthy (Promises are truthy objects),
 *   creating a silent security bug. Async support is deferred to v0.4.
 */

/** A no-argument rule function. The primary type for component props. */
export type RuleFn = () => boolean;

/**
 * A rule function that receives an explicit context object.
 * Use this for reusable, testable rule functions defined outside JSX.
 *
 * @example
 * const canEdit: RuleFnWithContext<AppCtx> = (ctx) =>
 *   ctx.user.id === ctx.document.ownerId;
 */
export type RuleFnWithContext<TContext> = (context: TContext) => boolean;

/**
 * The union type accepted by `<Rule when={...}>`, `useRule()`, and all combinators.
 * Either a literal boolean or a `RuleFn`.
 */
export type RuleInput = boolean | RuleFn;
