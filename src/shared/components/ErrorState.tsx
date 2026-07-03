import { AlertTriangle, RotateCw } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/utils/index"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ title, description, onRetry, className }: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title ?? t('errorState.title')}</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description ?? t('errorState.description')}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RotateCw className="size-3.5" />
          {t('common.retry')}
        </Button>
      )}
    </motion.div>
  )
}
