import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex h-[45px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:placeholder-slate-400 disabled:opacity-90",
  {
    variants: {
      variant: {
        default: "bg-background",
        ghost: "border-none shadow-none",
      },
      state: {
        error: "border-destructive ",
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, variant, ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label
            className="mb-2 block text-sm font-medium text-[#1f1f1f] capitalize"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={inputVariants({
            variant,
            state: error ? "error" : "default",
            className,
          })}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
