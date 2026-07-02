import { Outlet } from "react-router-dom"
import { motion } from "framer-motion"
import { BarChart3, ShieldCheck, Sparkles } from "lucide-react"

import { Logo } from "@/shared/components/Logo"

const highlights = [
  { icon: BarChart3, text: "Наглядная аналитика доходов и расходов" },
  { icon: ShieldCheck, text: "Безопасное хранение данных в Supabase" },
  { icon: Sparkles, text: "Цели, бюджеты и напоминания в одном месте" },
]

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_55%)]" />

        <Logo size="md" withLabel mono className="relative" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative space-y-8"
        >
          <h1 className="max-w-md text-3xl font-bold leading-tight text-white">
            Полный контроль над личными финансами
          </h1>
          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <Icon className="size-4.5" />
                </span>
                <span className="text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} FinanceFlow</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <Logo size="md" withLabel />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
