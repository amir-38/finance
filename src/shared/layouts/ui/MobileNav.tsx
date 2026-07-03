import { NavLink } from "react-router-dom"
import { Menu } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Logo } from "@/shared/components/Logo"
import { Button } from "@/shared/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet"
import { NAV_ITEMS } from "@/shared/config/navigation"
import { cn } from "@/shared/utils/index"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t('common.openMenu')}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="h-16 justify-center border-b border-border/60 px-5">
          <SheetTitle asChild>
            <Logo size="sm" withLabel />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-3 py-2">
          {NAV_ITEMS.map(({ labelKey, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              end={href === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                )
              }
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="truncate">{t(labelKey)}</span>
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
