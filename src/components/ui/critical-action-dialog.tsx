"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

/**
 * Requirement 63: Security & Admin UX
 * Enforces strict friction for dangerous operations (Delete, Revoke, Publish).
 * Requires the user to manually type the confirmation string to proceed.
 */

interface CriticalActionDialogProps {
  title: string;
  description: string;
  consequenceExplanation: string;
  confirmationString: string; // The exact text the user must type (e.g. "DELETE ASPIRIN")
  actionLabel: string;
  isDestructive?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function CriticalActionDialog({
  title,
  description,
  consequenceExplanation,
  confirmationString,
  actionLabel,
  isDestructive = true,
  onConfirm,
  onCancel,
}: CriticalActionDialogProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isMatch = input === confirmationString;

  const handleConfirm = async () => {
    if (!isMatch) return;
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-border">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`p-3 rounded-full flex-shrink-0 ${isDestructive ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>

          <div className="bg-secondary border border-border rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-foreground mb-1">
              Consequences:
            </p>
            <p className="text-sm text-muted-foreground">
              {consequenceExplanation}
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirm-action-input"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              To confirm, type{" "}
              <span className="font-mono font-bold text-foreground select-all bg-muted px-1 py-0.5 rounded">
                {confirmationString}
              </span>{" "}
              below:
            </label>
            <input
              id="confirm-action-input"
              type="text"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={confirmationString}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="bg-secondary px-6 py-4 border-t border-border flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={isDestructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={!isMatch || isLoading}
          >
            {isLoading ? "Processing..." : actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
