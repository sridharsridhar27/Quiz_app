import * as React from "react";
import { cn } from "@/lib/utils";

const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/70 dark:bg-gray-900/60 shadow-lg border border-gray-200 backdrop-blur-md p-6 transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Card };
