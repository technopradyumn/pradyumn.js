import React, { ReactNode } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Pre-built accessible confirmation dialog.
 */
export function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps): ReactNode {
  return (
    <Modal open={open} onClose={onCancel} title={title} width="420px">
      <div style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
        {message}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
