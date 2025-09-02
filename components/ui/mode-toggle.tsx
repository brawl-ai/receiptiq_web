"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { IconMoon, IconSun } from "@tabler/icons-react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      {theme === 'dark' ?
        <IconSun size={22} className="cursor-pointer text-gray-300" onClick={() => setTheme('light')} />
        :
        <IconMoon size={22} className="cursor-pointer" onClick={() => setTheme('dark')} />
      }
    </div>
  )
}
