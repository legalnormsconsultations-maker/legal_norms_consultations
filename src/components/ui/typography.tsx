import type React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Display({ className, children, ...props }: TypographyProps) {
  return (
    <h1
      className={cn(
        "text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight sm:leading-tight",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function PageHeading({
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <h1
      className={cn(
        "text-3xl md:text-4xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function SectionHeading({
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <h2
      className={cn(
        "text-2xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function BodyText({ className, children, ...props }: TypographyProps) {
  return (
    <p
      className={cn("text-base text-foreground/90 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function LabelText({ className, children, ...props }: TypographyProps) {
  return (
    <span
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function MetadataText({
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <span
      className={cn(
        "text-xs font-medium uppercase tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function TableText({ className, children, ...props }: TypographyProps) {
  return (
    <span
      className={cn("text-sm text-foreground/80 leading-normal", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export function DashboardMetric({
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <div
      className={cn(
        "text-4xl font-bold tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function HelperText({ className, children, ...props }: TypographyProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function SubSectionHeading({
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <h3
      className={cn(
        "text-xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export const H1 = PageHeading;
export const H2 = SectionHeading;
export const H3 = SubSectionHeading;
export const Paragraph = BodyText;
