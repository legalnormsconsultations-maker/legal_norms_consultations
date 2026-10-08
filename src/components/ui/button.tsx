import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

// Standardizing the predictable Component API across the entire Design System
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Core UI: Button
 *
 * Enforces the strict Design System API constraints.
 * Encapsulates complex Tailwind logic internally so consumers only need to pass `variant` and `size`.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    // Internal mapping of strict variant rules (No random Tailwind colors leaking to the consumer)
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
      outline:
        "border border-border bg-card hover:bg-muted hover:text-foreground",
      secondary: "bg-muted text-foreground hover:bg-muted/80",
      ghost: "hover:bg-muted hover:text-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    const compiledClasses =
      `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

    return <Comp className={compiledClasses} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
