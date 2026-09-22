'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextType>({
  open: false,
  setOpen: () => {},
});

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div
        className={cn("relative inline-flex min-w-0", className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  children,
  className,
  asChild,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }) {
  return (
    <span className={cn('inline-flex min-w-0 w-full', className)} {...props}>
      {children}
    </span>
  );
}

export function TooltipContent({
  children,
  className,
  side = 'top',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { side?: 'top' | 'bottom' | 'left' | 'right' }) {
  const { open } = React.useContext(TooltipContext);
  if (!open) return null;

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      role="tooltip"
      className={cn(
        'absolute z-50 overflow-hidden rounded-xl bg-popover px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-lg border border-border animate-in fade-in-0 zoom-in-95 pointer-events-none whitespace-nowrap',
        positionClasses[side],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
