import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { Plus, Search } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { ThemeToggle } from "@/shared/components/ThemeToggle"
import { ROUTES } from "@/shared/config/routes"
import { getPageTitle } from "@/shared/config/navigation"
import { MobileNav } from "./MobileNav"

interface TopbarProps {
  userMenu?: ReactNode
}

export function Topbar({ userMenu }: TopbarProps) {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <MobileNav />

      <h2 className="hidden shrink-0 text-lg font-semibold text-foreground sm:block">
        {getPageTitle(pathname)}
      </h2>

      <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Поиск операций, категорий…" className="bg-muted/50 pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <Button asChild size="sm" className="hidden gap-1.5 sm:flex">
          <Link to={ROUTES.TRANSACTIONS}>
            <Plus className="size-4" />
            Добавить
          </Link>
        </Button>
        <Button asChild size="icon" className="sm:hidden">
          <Link to={ROUTES.TRANSACTIONS} aria-label="Добавить операцию">
            <Plus className="size-4" />
          </Link>
        </Button>

        <ThemeToggle />
        {userMenu}
      </div>
    </header>
  )
}
