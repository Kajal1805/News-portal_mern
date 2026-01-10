import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "fixed top-4 right-4 z-50 rounded-lg bg-white shadow-lg p-4 border border-gray-200 flex flex-col gap-1 w-80 transition-all",
  {
    variants: {
      type: {
        default: "",
        success: "border-green-500 text-green-700",
        error: "border-red-500 text-red-700",
      },
    },
    defaultVariants: {
      type: "default",
    },
  }
);

export function Toast({ title, description, type = "default" }) {
  return (
    <div className={cn(toastVariants({ type }))}>
      <strong className="font-semibold">{title}</strong>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
}