import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Plus-Polish: Enhanced focus rings, consistent spacing, semantic tokens
  'inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 ease-out cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
  {
    variants: {
      variant: {
        // Plus-Polish: Using semantic color tokens from tokens.css
        primary: 'bg-primary text-primary-foreground shadow-lg hover:brightness-105 hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-primary',
        secondary: 'bg-surface-2 text-foreground border border-border hover:bg-surface-2/80 hover:border-primary/30 focus-visible:ring-primary',
        ghost: 'bg-transparent text-muted border border-border hover:bg-surface/50 hover:border-primary/50 hover:text-foreground focus-visible:ring-primary',
        danger: 'bg-destructive text-destructive-foreground shadow-md hover:brightness-110 focus-visible:ring-destructive',
        success: 'bg-success text-success-foreground shadow-md hover:brightness-110 focus-visible:ring-success',
      },
      size: {
        sm: 'h-11 px-4 text-sm',
        md: 'h-12 px-5 text-[15px]',
        lg: 'h-14 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
