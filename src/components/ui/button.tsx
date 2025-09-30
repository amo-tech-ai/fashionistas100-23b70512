import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-touch",
  {
    variants: {
      variant: {
        primary: "bg-text-primary text-white hover:bg-text-primary/90",
        secondary: "bg-surface-1 border border-border-strong text-text-primary hover:bg-surface-2",
        ghost: "bg-transparent text-text-muted hover:bg-surface-2 hover:text-text-primary",
        icon: "rounded-full border border-border-strong hover:bg-surface-2",
        action: "bg-action text-white hover:bg-action/90",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
        success: "bg-success text-success-foreground hover:bg-success/90",
        
        /* Legacy compatibility */
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-surface-2 hover:text-text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-sm min-h-[32px]",
        md: "h-10 px-4 py-2 min-h-[40px]",
        lg: "h-11 px-6 min-h-[44px]",
        icon: "h-10 w-10 min-h-[40px] min-w-[40px]",
        
        /* Legacy compatibility */
        default: "h-10 px-4 py-2 min-h-[40px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
