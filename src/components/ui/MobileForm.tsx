import React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface MobileFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

/**
 * MobileForm - Mobile-optimized form wrapper
 * 
 * Features:
 * - Automatic single-column layout on mobile
 * - Touch-friendly spacing
 * - Proper keyboard handling
 * - Safe area padding support
 */
export const MobileForm: React.FC<MobileFormProps> = ({
  children,
  className,
  ...props
}) => {
  const isMobile = useIsMobile()

  return (
    <form
      className={cn(
        "space-y-6",
        isMobile && "mobile-container mobile-section-spacing",
        className
      )}
      {...props}
    >
      {children}
    </form>
  )
}

interface MobileFormFieldProps {
  label: string
  name: string
  error?: string
  required?: boolean
  description?: string
  children: React.ReactNode
  className?: string
}

/**
 * MobileFormField - Mobile-optimized form field wrapper
 * 
 * Features:
 * - Touch-friendly labels (minimum tap target)
 * - Clear error messaging
 * - Proper spacing for mobile
 * - Accessible form controls
 */
export const MobileFormField: React.FC<MobileFormFieldProps> = ({
  label,
  name,
  error,
  required,
  description,
  children,
  className,
}) => {
  const isMobile = useIsMobile()

  return (
    <div className={cn("space-y-2", isMobile && "mobile-gap-md", className)}>
      <Label
        htmlFor={name}
        className={cn(
          "text-sm font-medium text-foreground",
          isMobile && "mobile-label min-touch",
          error && "text-danger"
        )}
      >
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </Label>
      
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {children}
      
      {error && (
        <p
          className="text-sm text-danger font-medium"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

interface MobileFormGridProps {
  children: React.ReactNode
  columns?: number
  className?: string
}

/**
 * MobileFormGrid - Responsive form grid layout
 * 
 * Features:
 * - Single column on mobile
 * - Multi-column on desktop
 * - Proper gap spacing
 */
export const MobileFormGrid: React.FC<MobileFormGridProps> = ({
  children,
  columns = 2,
  className,
}) => {
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        "grid gap-6",
        isMobile ? "grid-cols-1" : `md:grid-cols-${columns}`,
        className
      )}
      style={!isMobile ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}
    >
      {children}
    </div>
  )
}

interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

/**
 * MobileInput - Mobile-optimized input component
 * 
 * Features:
 * - Minimum 44px height on mobile
 * - Proper font size to prevent zoom on iOS
 * - Touch-friendly padding
 */
export const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, error, ...props }, ref) => {
    const isMobile = useIsMobile()

    return (
      <Input
        ref={ref}
        className={cn(
          "transition-colors",
          isMobile && "mobile-input min-touch",
          error && "border-danger focus-visible:ring-danger",
          className
        )}
        {...props}
      />
    )
  }
)
MobileInput.displayName = "MobileInput"

interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

/**
 * MobileTextarea - Mobile-optimized textarea component
 * 
 * Features:
 * - Minimum height for comfortable typing
 * - Proper font size to prevent zoom on iOS
 * - Touch-friendly resize handle
 */
export const MobileTextarea = React.forwardRef<HTMLTextAreaElement, MobileTextareaProps>(
  ({ className, error, ...props }, ref) => {
    const isMobile = useIsMobile()

    return (
      <Textarea
        ref={ref}
        className={cn(
          "transition-colors",
          isMobile && "mobile-textarea",
          error && "border-danger focus-visible:ring-danger",
          className
        )}
        {...props}
      />
    )
  }
)
MobileTextarea.displayName = "MobileTextarea"

export default MobileForm
