import { useState } from "react"
import type { ComponentProps } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "./input"
import { Button } from "./button"
import { cn } from "@/shared/utils/index"

function PasswordInput({ className, ...props }: ComponentProps<"input">) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-9", className)} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </div>
  )
}

export { PasswordInput }
