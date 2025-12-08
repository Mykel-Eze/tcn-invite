import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-card-foreground shadow-2xl p-6",
                className
            )}
            {...props}
        />
    )
})
Card.displayName = "Card"

export { Card }
