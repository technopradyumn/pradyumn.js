# pradyumn

> Declarative, composable rules for React applications.

[![npm version](https://img.shields.io/npm/v/pradyumn.svg)](https://www.npmjs.com/package/pradyumn)
[![npm downloads](https://img.shields.io/npm/dm/pradyumn.svg)](https://www.npmjs.com/package/pradyumn)
[![license](https://img.shields.io/npm/l/pradyumn.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B%20%7C%2019%2B-61dafb)](https://react.dev/)

**pradyumn** gives React applications a clean, testable rule engine so that business and UI rules — permissions, feature flags, validation conditions — can be expressed declaratively instead of being scattered across JSX, hooks, and event handlers.

```tsx
import { Rule, Rules, useRule, all, any, not } from "pradyumn";

<Rule when={user.role === "admin"} fallback={<AccessDenied />}>
  <AdminPanel />
</Rule>
```

---

## Installation

```bash
npm install pradyumn
```

> **Peer dependencies:** `react >= 18.0.0` and `react-dom >= 18.0.0`

---

## Quick Start

```tsx
import { Rule, Rules, useRule, all, any, not } from "pradyumn";

function Dashboard({ user }) {
  return (
    <Rule when={user.isLoggedIn} fallback={<Login />}>
      <Home />
    </Rule>
  );
}
```

---

## API

### `<Rule>`

Conditionally renders `children` when `when` is `true`, or `fallback` when `false`.

```tsx
<Rule
  when={user.role === "admin"}
  fallback={<AccessDenied />}
>
  <AdminPanel />
</Rule>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `when` | `boolean \| (() => boolean)` | ✅ | The condition to evaluate |
| `children` | `ReactNode` | ✅ | Rendered when condition is `true` |
| `fallback` | `ReactNode` | ❌ | Rendered when condition is `false`. Defaults to `null` |

---

### `<Rules>`

Combines multiple rules with `all` (AND) or `any` (OR) logic.

```tsx
// All rules must pass
<Rules
  all={[
    () => user.isLoggedIn,
    () => user.emailVerified,
    () => user.plan === "pro",
  ]}
  fallback={<UpgradePlan />}
>
  <ProFeature />
</Rules>
```

```tsx
// At least one rule must pass
<Rules
  any={[
    () => user.role === "admin",
    () => user.role === "editor",
  ]}
  fallback={<ReadOnly />}
>
  <EditButton />
</Rules>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `all` | `RuleInput[]` | one of | Every rule must pass (logical AND) |
| `any` | `RuleInput[]` | one of | At least one rule must pass (logical OR) |
| `fallback` | `ReactNode` | ❌ | Rendered when rules fail |
| `children` | `ReactNode` | ✅ | Rendered when rules pass |

> ⚠️ Only `all` **or** `any` can be used at a time — TypeScript enforces this at compile time.

---

### `useRule(rule)`

Evaluates a rule synchronously inside a component.

```tsx
const { result: isAdmin, error } = useRule(() => user.role === "admin");

if (error) console.error("Rule failed:", error);

return isAdmin ? <AdminBadge /> : null;
```

**Returns:** `{ result: boolean, error: Error | null }`

---

### `all(...rules)`

Returns a rule function that passes when **every** rule passes (logical AND).

```ts
const canPublish = all(
  () => user.isLoggedIn,
  () => user.emailVerified,
  () => user.role === "author",
);

// Use in JSX
<Rule when={canPublish}>
  <PublishButton />
</Rule>

// Use standalone
canPublish(); // boolean
```

---

### `any(...rules)`

Returns a rule function that passes when **at least one** rule passes (logical OR).

```ts
const canEdit = any(
  () => user.role === "admin",
  () => user.role === "editor",
);
```

---

### `not(rule)`

Returns a rule function that **inverts** the given rule.

```ts
const isNotBanned = not(() => user.isBanned);

<Rule when={isNotBanned}>
  <Feed />
</Rule>
```

---

### `evaluate(rule)`

The core evaluator — React-free. Useful for testing rules outside of components.

```ts
import { evaluate } from "pradyumn";

evaluate(true);           // true
evaluate(() => false);    // false
```

---

## Composition

Rules compose naturally with each other:

```tsx
// loggedIn AND NOT banned AND (admin OR editor)
const canAccess = all(
  () => user.isLoggedIn,
  not(() => user.isBanned),
  any(
    () => user.role === "admin",
    () => user.role === "editor",
  ),
);

<Rule when={canAccess} fallback={<AccessDenied />}>
  <Editor />
</Rule>
```

---

## Reusable Rules

Define rules as plain functions — easy to test, reuse, and share:

```ts
// rules/document.ts
export const canEditDocument = (user: User, doc: Document) =>
  user.id === doc.ownerId || user.role === "admin";

// In your component
<Rule when={() => canEditDocument(user, document)}>
  <EditButton />
</Rule>

// In your tests — no React needed
expect(canEditDocument(adminUser, doc)).toBe(true);
expect(canEditDocument(otherUser, doc)).toBe(false);
```

---

## Feature Flags

```tsx
<Rule when={flags.newDashboard}>
  <NewDashboard />
</Rule>

<Rules all={[() => flags.betaEnabled, () => user.isBetaUser]}>
  <BetaFeature />
</Rules>
```

---

## Error Handling

If a rule function throws, the condition is treated as `false` (fail-closed). Errors never accidentally grant access.

```tsx
// If canEdit throws, fallback is shown — never children
<Rule when={canEdit} fallback={<AccessDenied />}>
  <Editor />
</Rule>

// useRule exposes the error so you can log it
const { result, error } = useRule(canEdit);
if (error) reportError(error);
```

---

## TypeScript

Fully typed. All public APIs ship with declaration files.

```ts
import type { RuleFn, RuleInput, RuleFnWithContext } from "pradyumn";

// Typed context rule
type AppCtx = { user: User; document: Document };
const canEdit: RuleFnWithContext<AppCtx> = (ctx) =>
  ctx.user.id === ctx.document.ownerId;
```

---

## Security

> **Important:** Client-side rules control what the **UI shows**. They are **not authorization**.
>
> A user with browser DevTools can bypass any client-side check.  
> **Always enforce sensitive permissions on the server.**

```
UI rule  →  controls visibility
Server   →  controls access
```

Do not use `pradyumn` as the only guard for:
- API endpoints
- Database access
- Payment flows
- Delete operations
- Admin operations

---

## Philosophy

**pradyumn** complements React — it does not replace it.

- Use normal `condition && <Component />` for simple one-off conditions
- Use `pradyumn` when rules become **reusable**, **composable**, or need **consistent evaluation behavior**

```
simple → explicit → composable → testable → type-safe
```

---

## Roadmap

| Version | Feature |
|---|---|
| `v0.1` | Core API — `Rule`, `Rules`, `useRule`, `all`, `any`, `not` ✅ |
| `v0.2` | Debug mode, improved error messages |
| `v0.3` | Explainability — why did a rule fail? |
| `v0.4` | Async rules |
| `v0.5` | Validation primitives |
| `v0.6` | Feature flag adapters |
| `v1.0` | Stable API |

---

## Contributing

```bash
git clone https://github.com/technopradyumn/pradyumn.js.git
cd pradyumn.js
npm install
npm test
npm run build
```

Pull requests are welcome. Please include tests for any new behavior.

---

## License

MIT © [technopradyumn](https://github.com/technopradyumn)
