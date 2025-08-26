import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-inter",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card hover:shadow-hover",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-card hover:shadow-hover",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-card hover:shadow-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-card hover:shadow-hover",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-accent text-white hover:opacity-90 shadow-elegant hover:shadow-hover transform hover:scale-105 transition-bounce",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-card hover:shadow-hover",
        silver: "bg-silver text-silver-foreground hover:bg-silver/90 shadow-card hover:shadow-hover",
        charcoal: "bg-charcoal text-charcoal-foreground hover:bg-charcoal/90 shadow-card hover:shadow-hover",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-lg px-8 text-base",
        xl: "h-16 rounded-xl px-10 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
