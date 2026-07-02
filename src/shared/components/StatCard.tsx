import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { cn } from "@/shared/utils/index"

type StatCardAccent = "primary" | "success" | "danger" | "warning"

const accentStyles: Record<StatCardAccent, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
}

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  accent?: StatCardAccent
  trend?: { value: number; label?: string }
  loading?: boolean
  className?: string
}

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "primary",
  trend,
  loading,
  className,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend.value >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "glass-card overflow-hidden border-0 py-5 transition-shadow hover:shadow-xl hover:shadow-black/5",
          className
        )}
      >
        <CardContent className="flex flex-col gap-4 px-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <div className={cn("flex size-9 items-center justify-center rounded-xl", accentStyles[accent])}>
              <Icon className="size-4.5" />
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
          )}

          {trend && !loading && (
            <div
              className={cn(
                "flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}
            >
              {isPositive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              <span>{Math.abs(trend.value)}%</span>
              {trend.label && <span className="text-muted-foreground">{trend.label}</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
