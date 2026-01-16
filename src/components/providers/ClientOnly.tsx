"use client";

import { useEffect, useState, startTransition } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
}

/**
 * Simple wrapper component that only renders children after client-side mount.
 * Prevents hydration mismatches for dialogs, modals, and components that
 * generate random IDs (like Radix UI components).
 *
 * @example
 * ```tsx
 * <ClientOnly>
 *   <Dialog open={open}>
 *     <DialogContent>...</DialogContent>
 *   </Dialog>
 * </ClientOnly>
 * ```
 */
export function ClientOnly({ children }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
