import { useState, type ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "react-router-dom"

import { Sidebar } from "./ui/Sidebar"
import { Topbar } from "./ui/Topbar"

interface AppLayoutProps {
  userMenu?: ReactNode
}

export function AppLayout({ userMenu }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userMenu={userMenu} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mx-auto w-full max-w-7xl"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
