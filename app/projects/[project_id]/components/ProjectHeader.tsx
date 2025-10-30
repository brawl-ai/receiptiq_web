"use client"
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import ThemeSwitcher from "@/components/ui/toggle-theme";
import { IconCheck, IconRocket } from "@tabler/icons-react"

export function ProjectHeader({ title, isSubscribed }: { title?: string, isSubscribed: boolean }) {
    return (
        <header className="flex my-2 h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1 dark:text-white" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4 dark:bg-white"
                />
                <h1 className="text-xl dark:text-white font-medium">{title.toLocaleUpperCase()}</h1>
                <div className="ml-auto flex items-center gap-4">
                    {isSubscribed ?
                        <RainbowButton>
                            <IconCheck />
                            <span>You are subscribed</span>
                        </RainbowButton>
                        :
                        <RainbowButton data-umami-event="upgrade@home">
                            <IconRocket />
                            <span>Upgrade</span>
                        </RainbowButton>
                    }
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    )
}
