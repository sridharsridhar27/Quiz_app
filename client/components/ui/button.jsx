import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // ✨ Primary Button (solid color)
        default:
          "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-sm hover:shadow-md",
        
        // 🩶 Outline Button (light bordered)
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 active:scale-[0.98]",
        
        // ⚪ Ghost Button (subtle background on hover)
        ghost:
          "bg-transparent text-gray-700 hover:bg-gray-100 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };

