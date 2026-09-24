/**
 * pradyumn.js — The Simplest, Ultra-Declarative TypeScript UI Creation Library.
 *
 * 50+ unique built-in features:
 * - Declarative Control Flow (<Rule>, <Rules>, <Show>, <Switch>, <For>, <Async>, <ErrorBoundary>)
 * - Reactive State Signals (signal, derived, persistentSignal, createStore, useSignal)
 * - Zero-Boilerplate Form Engine (<Form>, <Field>, <Input>, <Select>, <Checkbox>, v validators, useForm)
 * - Fluent UI Layout Primitives (<Box>, <Stack>, <Grid>, <Card>, <Button>, <Badge>, <Heading>, <Text>, <Divider>, <Avatar>, <Spacer>, <Skeleton>, <Animate>, <Modal>)
 * - Overlay & Feedback System (toast, <Toaster>, <Drawer>, <Tooltip>, <ConfirmDialog>)
 * - Universal Web Functionality Hooks (useTheme, useClipboard, useMediaQuery, useDebounce, useThrottle, useHotkeys, useClickOutside, useOnlineStatus, useToggle, usePrevious, useDocumentTitle)
 * - Design Tokens & Theme Engine (createPradyumnTheme, defaultDarkTheme, defaultLightTheme)
 */

// ─── 1. Core Logic & Types ──────────────────────────────────────────────────
export type { RuleFn, RuleFnWithContext, RuleInput } from "./core/types";
export { evaluate } from "./core/evaluate";
export { all, any, not } from "./core/combinators";

// ─── 2. Reactive State & Signals ────────────────────────────────────────────
export { signal, derived, persistentSignal, createStore } from "./core/signals";
export type { Signal, Store, Subscriber, Unsubscribe, ActionCreator } from "./core/signals";

// ─── 3. Declarative Control Flow Components ─────────────────────────────────
export { Rule } from "./react/Rule";
export type { RuleProps } from "./react/Rule";

export { Rules } from "./react/Rules";
export type { RulesProps } from "./react/Rules";

export { Show } from "./control/Show";
export type { ShowProps } from "./control/Show";

export { Switch, Case, Default } from "./control/Switch";
export type { SwitchProps, CaseProps, DefaultProps } from "./control/Switch";

export { For } from "./control/For";
export type { ForProps } from "./control/For";

export { Async } from "./control/Async";
export type { AsyncProps } from "./control/Async";

export { ErrorBoundary } from "./control/ErrorBoundary";
export type { ErrorBoundaryProps } from "./control/ErrorBoundary";

// ─── 4. Fluent UI & Layout Components ───────────────────────────────────────
export { Box } from "./ui/Box";
export type { BoxProps } from "./ui/Box";

export { Stack } from "./ui/Stack";
export type { StackProps } from "./ui/Stack";

export { Grid } from "./ui/Grid";
export type { GridProps } from "./ui/Grid";

export { Card } from "./ui/Card";
export type { CardProps } from "./ui/Card";

export { Button } from "./ui/Button";
export type { ButtonProps } from "./ui/Button";

export { Badge } from "./ui/Badge";
export type { BadgeProps } from "./ui/Badge";

export { Heading } from "./ui/Heading";
export type { HeadingProps } from "./ui/Heading";

export { Text } from "./ui/Text";
export type { TextProps } from "./ui/Text";

export { Divider } from "./ui/Divider";
export type { DividerProps } from "./ui/Divider";

export { Avatar } from "./ui/Avatar";
export type { AvatarProps } from "./ui/Avatar";

export { Spacer } from "./ui/Spacer";
export type { SpacerProps } from "./ui/Spacer";

export { Skeleton } from "./ui/Skeleton";
export type { SkeletonProps } from "./ui/Skeleton";

export { Animate } from "./ui/Animate";
export type { AnimateProps } from "./ui/Animate";

export { Modal } from "./ui/Modal";
export type { ModalProps } from "./ui/Modal";

// ─── 5. Declarative Forms & Validation Engine ───────────────────────────────
export { v, validateField } from "./core/validators";
export type { ValidatorFn } from "./core/validators";

export { Form } from "./forms/Form";
export type { FormProps } from "./forms/Form";

export { Field } from "./forms/Field";
export type { FieldProps } from "./forms/Field";

export { Input } from "./forms/Input";
export type { InputProps } from "./forms/Input";

export { Select } from "./forms/Select";
export type { SelectProps, SelectOption } from "./forms/Select";

export { Checkbox } from "./forms/Checkbox";
export type { CheckboxProps } from "./forms/Checkbox";

export { useForm } from "./hooks/useForm";
export type {
  UseFormOptions,
  UseFormResult,
  FormValidationRules,
  FormErrors,
  FormTouched,
} from "./hooks/useForm";

// ─── 6. Feedback & Overlay System ───────────────────────────────────────────
export { toast, Toaster } from "./feedback/Toast";
export type { ToasterProps, ToastItem, ToastType } from "./feedback/Toast";

export { Drawer } from "./feedback/Drawer";
export type { DrawerProps } from "./feedback/Drawer";

export { Tooltip } from "./feedback/Tooltip";
export type { TooltipProps } from "./feedback/Tooltip";

export { ConfirmDialog } from "./feedback/ConfirmDialog";
export type { ConfirmDialogProps } from "./feedback/ConfirmDialog";

// ─── 7. Design Tokens & Theme Engine ────────────────────────────────────────
export { createPradyumnTheme, defaultDarkTheme, defaultLightTheme } from "./core/theme";
export type { ThemeTokens, ThemeColors } from "./core/theme";

// ─── 8. Universal Web & Utility Hooks ───────────────────────────────────────
export { useRule } from "./react/useRule";
export type { UseRuleResult } from "./react/useRule";

export { useSignal } from "./hooks/useSignal";
export { useTheme } from "./hooks/useTheme";
export type { UseThemeResult, ThemeMode } from "./hooks/useTheme";

export { useClipboard } from "./hooks/useClipboard";
export type { UseClipboardResult } from "./hooks/useClipboard";

export { useMediaQuery } from "./hooks/useMediaQuery";
export { useDebounce } from "./hooks/useDebounce";
export { useThrottle } from "./hooks/useThrottle";
export { useHotkeys } from "./hooks/useHotkeys";
export { useClickOutside } from "./hooks/useClickOutside";
export { useOnlineStatus } from "./hooks/useOnlineStatus";
export { useToggle } from "./hooks/useToggle";
export type { UseToggleResult } from "./hooks/useToggle";

export { usePrevious } from "./hooks/usePrevious";
export { useDocumentTitle } from "./hooks/useDocumentTitle";
