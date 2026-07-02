import { NavLink } from "react-router-dom"
import { ChevronsLeft, ChevronsRight } from "lucide-react"
import { motion } from "framer-motion"

import { Logo } from "@/shared/components/Logo"
import { Button } from "@/shared/components/ui/button"
import { NAV_ITEMS } from "@/shared/config/navigation"
import { cn } from "@/shared/utils/index"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 84 : 264 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/60 bg-sidebar lg:flex"
    >
      <div className={cn("flex h-16 items-center px-5", collapsed && "justify-center px-0")}>
        <Logo size="sm" withLabel={!collapsed} />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            end={href === "/"}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-0",
                isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              )
            }
          >
            <Icon className="size-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border/60 p-3">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={onToggle}
          className={cn("w-full text-muted-foreground", !collapsed && "justify-start gap-2")}
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          {!collapsed && "Свернуть"}
        </Button>
      </div>
    </motion.aside>
  )
}
