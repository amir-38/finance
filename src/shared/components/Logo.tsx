import { cn } from "@/shared/utils/index"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  withLabel?: boolean
  mono?: boolean
  className?: string
}

const sizeStyles = {
  sm: "size-8 rounded-lg text-sm",
  md: "size-10 rounded-xl text-base",
  lg: "size-14 rounded-2xl text-2xl",
}

export function Logo({ size = "md", withLabel = false, mono = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center gradient-primary font-bold text-white shadow-lg shadow-primary/25",
          sizeStyles[size]
        )}
      >
        F
      </div>
      {withLabel && (
        <span className={cn("text-lg font-bold tracking-tight", mono ? "text-white" : "text-foreground")}>
          Finance
          <span className={mono ? undefined : "text-gradient"}>Flow</span>
        </span>
      )}
    </div>
  )
}
