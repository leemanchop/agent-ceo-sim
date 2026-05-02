"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3ecf8e] disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#eaeaea] text-[#0a0a0c] hover:bg-white",
        outline:
          "border border-[#1f1f24] bg-transparent text-[#eaeaea] hover:bg-[#111114]",
        ghost: "text-[#eaeaea] hover:bg-[#111114]",
        chip: "border border-[#1f1f24] bg-[#111114] text-[#eaeaea] hover:border-[#3ecf8e] hover:text-[#3ecf8e]",
        primary:
          "bg-[#3ecf8e] text-[#0a0a0c] hover:bg-[#4cdf9e] font-semibold",
        danger: "bg-[#ef4444] text-white hover:bg-[#f25555]",
      },
      size: {
        default: "h-8 px-3",
        sm: "h-7 px-2",
        lg: "h-10 px-4 text-sm",
        xl: "h-12 px-6 text-sm",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
