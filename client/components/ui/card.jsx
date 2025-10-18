import * as React from "react";
import { cn } from "@/lib/utils";

const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-lg p-6 transition-all duration-200 hover:shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Card };


