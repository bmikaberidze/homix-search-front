import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-[var(--radius)] px-[18px] py-[14px] font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[14px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7065f0] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"

    const variantClasses = variant === 'outline'
      ? "bg-white border-[1.5px] border-[#7065f0] text-[#7065f0] hover:bg-[#f0effb]"
      : "bg-[#7065f0] text-white hover:bg-[#5048c7] shadow-sm hover:shadow-md"

    return (
      <button
        className={`${baseClasses} ${variantClasses} ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
