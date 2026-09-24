# pradyumn.js

> **The Simplest, Ultra-Declarative TypeScript UI Creation Library for React.**

[![npm version](https://img.shields.io/npm/v/pradyumn.svg?color=ff3366)](https://www.npmjs.com/package/pradyumn)
[![npm downloads](https://img.shields.io/npm/dm/pradyumn.svg)](https://www.npmjs.com/package/pradyumn)
[![license](https://img.shields.io/npm/l/pradyumn.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%205%2B-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B%20%7C%2019%2B-61dafb)](https://react.dev/)
[![Tests](https://img.shields.io/badge/tests-78%20passed-success)](https://vitest.dev/)

Building web applications in React or Next.js often requires installing and wiring 10+ different libraries: Redux/Zustand for state, React-Hook-Form and Zod for forms, Framer Motion for animations, Toastify for notifications, Radix for dialogs, plus endless custom hooks and nested ternaries.

**pradyumn** consolidates all of this into a single, cohesive, zero-boilerplate UI creation library powered by **50+ built-in features** in 100% strict TypeScript.

---

## ⚡ Quick Scaffold

Create a production-ready application with the official CLI:

```bash
npm create pradyumn@latest my-app
cd my-app
npm run dev
```

Or install `pradyumn` into an existing React project:

```bash
npm install pradyumn
```

> **Peer dependencies:** `react >= 18.0.0` and `react-dom >= 18.0.0`

---

## 🚀 Feature Overview (50+ Built-In Features)

### 1. 🛡️ Declarative Control Flow & Rules
Eliminate nested ternaries and messy conditional logic with expressive JSX primitives.

```tsx
import { Rule, Rules, Show, Switch, Case, Default, For, Async, all, any, not } from "pradyumn";

// 1. Declarative Permission Guard
<Rule when={user.role === "admin"} fallback={<AccessDenied />}>
  <AdminDashboard />
</Rule>

// 2. Composed Logic Combinators
const canEdit = all(() => user.isLoggedIn, not(() => user.isBanned));
<Rule when={canEdit}>
  <EditToolbar />
</Rule>

// 3. Multi-Condition Combinator Component
<Rules
  all={[() => user.isLoggedIn, () => user.emailVerified]}
  fallback={<VerifyEmailNotice />}
>
  <AccountSettings />
</Rules>

// 4. Clean Inline Conditional
<Show when={isSubscribed} fallback={<UpgradeCTA />}>
  <PremiumContent />
</Show>

// 5. Pattern Matching in JSX
<Switch value={status}>
  <Case is="loading"><Spinner /></Case>
  <Case is="success"><Dashboard /></Case>
  <Case is={["error", "failed"]}><ErrorAlert /></Case>
  <Default><EmptyState /></Default>
</Switch>

// 6. Declarative Loops with Empty Fallback
<For each={users} fallback={<Text color="muted">No users found</Text>}>
  {(user, i) => <UserCard key={user.id} user={user} />}
</For>

// 7. Zero-Boilerplate Async Promise Resolution
<Async
  promise={() => fetchUserData(userId)}
  loading={<Skeleton height={200} />}
  error={(err, retry) => <Button onClick={retry}>Retry: {err.message}</Button>}
>
  {(userData) => <ProfileView data={userData} />}
</Async>
```

---

### 2. ⚡ Reactive State & Signals
Simple, high-performance signals that bypass React dependency-array bugs and unnecessary re-renders.

```tsx
import { signal, useSignal, derived, persistentSignal, createStore } from "pradyumn";

// Reactive Signal
const count = signal(0);
count.set(5);
count.update(n => n + 1);

function Counter() {
  const value = useSignal(count);
  return <Button onClick={() => count.update(c => c + 1)}>Count: {value}</Button>;
}

// Derived (Computed) Signal
const double = derived(() => count.get() * 2, [count]);

// Persistent Signal (Auto-synced with browser localStorage)
const themeSignal = persistentSignal("app_theme", "dark");

// Global Typed Store
const store = createStore({ user: null, cart: [] }, (get, set) => ({
  addToCart: (item) => set(s => ({ cart: [...s.cart, item] })),
  clearCart: () => set({ cart: [] })
}));
```

---

### 3. 🎨 Fluent UI & Layout Components
Modern UI components with design tokens, glassmorphism, responsive grids, and micro-animations built-in.

```tsx
import { Box, Stack, Grid, Card, Button, Badge, Heading, Text, Divider, Avatar, Modal } from "pradyumn";

function Showcase() {
  return (
    <Box p="2rem" glass>
      <Card variant="glass" glow hover>
        <Stack direction="row" align="center" justify="space-between">
          <Stack direction="row" align="center" gap="1rem">
            <Avatar name="Pradyumn" size="lg" status="online" />
            <div>
              <Heading level={2} gradient>Modern Dashboard</Heading>
              <Text color="muted" size="sm">Declarative React UI</Text>
            </div>
          </Stack>
          <Badge variant="success" dot>Active</Badge>
        </Stack>

        <Divider label="ACTIONS" style={{ margin: "1.5rem 0" }} />

        {/* Auto-responsive CSS Grid without manual media queries */}
        <Grid minItemWidth="260px" gap="1rem">
          <Button variant="primary">Launch App</Button>
          <Button variant="secondary">View Analytics</Button>
          <Button variant="danger">Reset</Button>
        </Grid>
      </Card>
    </Box>
  );
}
```

---

### 4. 📝 Declarative Forms & Validation Engine
Full form state, touched tracking, and validation rules without glue code or external schema libraries.

```tsx
import { useForm, Form, Field, Input, Select, Checkbox, v, toast } from "pradyumn";

function RegistrationForm() {
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      role: "developer",
      agree: false,
    },
    validate: {
      username: [v.required("Username is required"), v.minLength(3, "At least 3 chars")],
      email: [v.required(), v.email("Invalid email")],
      agree: [v.required("You must agree to continue")],
    },
    onSubmit: async (values) => {
      await api.register(values);
      toast.success("Account created successfully!");
      form.reset();
    },
  });

  return (
    <Form onSubmit={form.handleSubmit}>
      <Field label="Username" error={form.touched.username ? form.errors.username : undefined} required>
        <Input
          name="username"
          value={form.values.username}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          clearable
          onClear={() => form.setValue("username", "")}
        />
      </Field>

      <Field label="Email" error={form.touched.email ? form.errors.email : undefined} required>
        <Input
          name="email"
          type="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
      </Field>

      <Field>
        <Checkbox
          label="I agree to terms"
          name="agree"
          checked={form.values.agree}
          onChange={form.handleChange}
        />
      </Field>

      <Button type="submit" loading={form.isSubmitting} fullWidth>
        Register
      </Button>
    </Form>
  );
}
```

---

### 5. 🌐 Web Functionality Hooks
Save hundreds of lines of boilerplate with zero-dependency browser hooks.

```tsx
import {
  useTheme,
  useClipboard,
  useMediaQuery,
  useDebounce,
  useThrottle,
  useHotkeys,
  useClickOutside,
  useOnlineStatus,
  useToggle,
  usePrevious,
  useDocumentTitle,
} from "pradyumn";

// 1. Dark/Light Theme with auto DOM sync
const { mode, isDark, toggleTheme } = useTheme("dark");

// 2. One-line copy with auto-reset
const { hasCopied, copy } = useClipboard();

// 3. Responsive media query
const isMobile = useMediaQuery("(max-width: 768px)");

// 4. Debounce search queries
const debouncedQuery = useDebounce(searchQuery, 300);

// 5. Global hotkeys
useHotkeys("ctrl+k", () => openCommandPalette());
useHotkeys("Escape", () => closeModal());

// 6. Outside click dismissal
useClickOutside(menuRef, () => closeMenu());

// 7. Network connectivity status
const isOnline = useOnlineStatus();

// 8. Dynamic tab title with auto restore
useDocumentTitle("Dashboard | Pradyumn", true);

// 9. Boolean toggle
const [isOpen, toggle, setToggle, open, close] = useToggle(false);
```

---

### 6. 🔔 Feedback, Overlays & Crash Recovery
Integrated notification and modal system without portal or z-index headaches.

```tsx
import { toast, Toaster, Modal, Drawer, Tooltip, ConfirmDialog, ErrorBoundary } from "pradyumn";

// Mount <Toaster /> once in your root app:
<Toaster position="top-right" />

// Trigger anywhere:
toast.success("Profile saved!");
toast.error("Network connection lost!");
toast.info("New update available.");

// Accessible Modal with blur & ESC key support:
<Modal open={isOpen} onClose={close} title="Confirm Order">
  <Text>Review your order summary...</Text>
</Modal>

// Slide-out Drawer:
<Drawer open={isDrawerOpen} onClose={closeDrawer} position="right">
  <NavigationList />
</Drawer>

// Hover Tooltip:
<Tooltip content="Edit profile">
  <Button variant="ghost">✏️</Button>
</Tooltip>

// Declarative Crash Recovery:
<ErrorBoundary fallback={(err, reset) => <Button onClick={reset}>Recover</Button>}>
  <AnalyticsChart />
</ErrorBoundary>
```

---

## 📊 Feature Comparison

| Feature | React Standard | Next.js | **pradyumn.js** |
| :--- | :---: | :---: | :---: |
| **Declarative Rules & Permissions** | ❌ Manual ternaries | ❌ Manual | ✅ Built-in (`<Rule>`, `<Rules>`, `all`, `any`, `not`) |
| **Reactive Signals** | ❌ Complex hooks | ❌ None | ✅ Built-in (`signal`, `derived`, `persistentSignal`) |
| **Zero-Boilerplate Forms** | ❌ External (RHF + Zod) | ❌ External | ✅ Built-in (`useForm`, `<Field>`, `v.*`) |
| **Pattern Matching JSX** | ❌ Nested ternaries | ❌ Nested ternaries | ✅ Built-in (`<Switch>`, `<Case>`, `<Default>`) |
| **Toast Notifications** | ❌ External (Toastify) | ❌ External | ✅ Built-in (`toast.success()`, `<Toaster />`) |
| **Responsive Grid without CSS** | ❌ CSS / Tailwind | ❌ CSS / Tailwind | ✅ Built-in (`<Grid minItemWidth="..." />`) |
| **Web Hooks (Theme, Copy, Hotkeys)** | ❌ 10 custom hooks | ❌ Custom hooks | ✅ Built-in (`useTheme`, `useHotkeys`, etc.) |
| **Glassmorphism Design Tokens** | ❌ CSS files | ❌ CSS files | ✅ Built-in (`defaultDarkTheme`, `Card variant="glass"`) |
| **Strict TypeScript** | ⚠️ Partial | ⚠️ Partial | ✅ 100% Strict Typechecked |

---

## 🛠️ CLI Scaffolding

To start a new project with all features pre-configured:

```bash
npm create pradyumn@latest my-app
```

Follow the prompt, then run:

```bash
cd my-app
npm run dev
```

---

## 📄 License

MIT © [technopradyumn](https://github.com/technopradyumn)
