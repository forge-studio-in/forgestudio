import * as React from "react";
import { cn } from "@/lib/utils";
import { Icon, IconName } from "./Icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "text";
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "right",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-200 ease-out rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background group";
    
    const variants = {
      primary:
        "bg-primary text-forge-black hover:bg-primary/90 active:bg-primary/80 border border-transparent",
      secondary:
        "bg-transparent border border-border text-foreground hover:border-muted hover:bg-white/5 active:bg-white/10",
      ghost:
        "bg-transparent text-foreground hover:bg-white/5 active:bg-white/10 border border-transparent",
      text: "bg-transparent text-foreground p-0 hover:text-primary transition-colors border-transparent",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    };

    // Text variant shouldn't have height/padding constraints
    const appliedSize = variant === "text" ? "" : sizes[size];

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          appliedSize,
          disabled || isLoading ? "opacity-50 cursor-not-allowed" : "",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Icon
            name="LoaderCircle"
            className="mr-2 h-4 w-4 animate-spin"
          />
        )}
        {!isLoading && icon && iconPosition === "left" && (
          <Icon
            name={icon}
            size={18}
            className="mr-2 transition-transform duration-200 group-hover:-translate-x-1"
          />
        )}
        <span>{children}</span>
        {!isLoading && icon && iconPosition === "right" && (
          <Icon
            name={icon}
            size={18}
            className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
          />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
