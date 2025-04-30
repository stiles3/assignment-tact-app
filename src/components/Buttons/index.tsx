"use client";
import React from "react";
import { ColorRing } from "react-loader-spinner";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "black";

type ButtonSize = "default" | "sm" | "lg" | "full" | "auto";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const getVariantClasses = (variant: ButtonVariant = "default") => {
  const baseClasses =
    "inline-flex h-[45px] items-center px-[27px] justify-center rounded-md text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-opacity-20 disabled:bg-gray-500 disabled:pointer-events-none ring-offset-white";

  const variantClasses = {
    default: "bg-black text-white hover:bg-gray-800",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "hover:bg-gray-100 hover:text-gray-800",
    link: "underline-offset-4 hover:underline text-blue-600",
    black: "bg-black text-white hover:bg-gray-800",
  };

  return `${baseClasses} ${variantClasses[variant]}`;
};

const getSizeClasses = (size: ButtonSize = "default") => {
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    full: "w-full",
    auto: "w-auto",
  };

  return sizeClasses[size];
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? React.Fragment : "button";
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    const combinedClasses = `${variantClasses} ${sizeClasses} ${
      className || ""
    }`;

    return (
      <Comp
        className={combinedClasses}
        ref={asChild ? undefined : ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <ColorRing
            visible={true}
            height="30"
            width="30"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={["#5B32E5", "#5B32E5", "#5B32E5", "#5B32E5", "#5B32E5"]}
          />
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
