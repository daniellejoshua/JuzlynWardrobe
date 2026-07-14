"use client"
import { cn } from "@/lib/utils"
interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg"
    message?: string
    variant?: "inline" | "overlay" | "fullscreen"
}
const sizeClasses = {
    sm: "w-4 h-4 border",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-2",
}



export function LoadingSpinner({
    size = "md",
    message,
    variant = "inline",
}: LoadingSpinnerProps) {
    const spinner = (
        <div
            className={cn(
                "rounded-full animate-spin border-white/10 border-t-white/80",
                sizeClasses[size]
            )}
        />
    )

    const content = (
        <div className="flex flex-col items-center gap-3">
            {size === "lg" ? (
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-white/80 animate-spin" />
                </div>
            ) : (
                spinner
            )}
            {message && (
                <p className="text-sm text-white/70 font-medium">{message}</p>
            )}
        </div>
    )

    if (variant === "fullscreen") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="relative">{content}</div>
            </div>
        )
    }

    if (variant === "overlay") {
        return (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                {content}
            </div>
        )
    }

    // inline
    return content
}