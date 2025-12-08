import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
    return (
        <div className="w-full space-y-1">
            {label && (
                <label className="text-sm font-medium text-white/80 block ml-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all duration-200 hover:bg-white/10",
                    error && "border-red-500 focus-visible:ring-red-500",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-400 ml-1">{error}</span>
            )}
        </div>
    )
})
Input.displayName = "Input"

export { Input }
