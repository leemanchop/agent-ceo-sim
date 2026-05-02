import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-[#1f1f24] text-[#eaeaea]",
        outline: "border border-[#1f1f24] text-[#71717a]",
        green: "bg-[#3ecf8e]/15 text-[#3ecf8e] border border-[#3ecf8e]/30",
        red: "bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30",
        amber: "bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30",
        blue: "bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30",
        purple: "bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30",
        gray: "bg-[#71717a]/15 text-[#71717a] border border-[#71717a]/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
