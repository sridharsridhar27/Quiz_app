import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

