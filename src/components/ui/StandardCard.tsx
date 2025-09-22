import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const StandardCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl ring-1 ring-black/5 shadow-subtle bg-card text-card-foreground transition-fast hover:shadow-moderate",
      className
    )}
    {...props}
  />
))
StandardCard.displayName = "StandardCard"

interface StandardCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

const StandardCardHeader = React.forwardRef<
  HTMLDivElement,
  StandardCardHeaderProps
>(({ className, title, subtitle, action, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-start justify-between p-6 border-b border-border/50",
      className
    )}
    {...props}
  >
    <div className="space-y-1">
      {title && (
        <h3 className="text-lg font-semibold leading-none tracking-tight text-card-foreground">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
      {children}
    </div>
    {action && (
      <div className="flex items-center gap-2">
        {action}
      </div>
    )}
  </div>
))
StandardCardHeader.displayName = "StandardCardHeader"

const StandardCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
))
StandardCardContent.displayName = "StandardCardContent"

interface StandardCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode
}

const StandardCardFooter = React.forwardRef<
  HTMLDivElement,
  StandardCardFooterProps
>(({ className, actions, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between p-6 pt-0",
      className
    )}
    {...props}
  >
    {children}
    {actions && (
      <div className="flex items-center gap-2">
        {actions}
      </div>
    )}
  </div>
))
StandardCardFooter.displayName = "StandardCardFooter"

export { 
  StandardCard, 
  StandardCardHeader, 
  StandardCardContent, 
  StandardCardFooter 
}