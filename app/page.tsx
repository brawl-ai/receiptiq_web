"use client"

import React, { useState } from 'react';
import {
  IconSparkles,
  IconFileText,
  IconSettings,
  IconFolders,
  IconDownload,
  IconChartBar,
  IconArrowRight,
  IconLogin,
  IconRocket,
  IconMoon,
  IconSun,
  IconLayoutSidebarFilled
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GridPattern } from '@/components/ui/grid-pattern';
import { Separator } from '@/components/ui/separator';
import Footer01 from '@/components/ui/footer';
import { RainbowButton } from '@/components/ui/rainbow-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTheme } from 'next-themes';

export default function ReceiptIQHomepage() {
  const [opened, setOpened] = useState(false);
  const { theme, setTheme } = useTheme()

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <GridPattern
        className="absolute min-h-screen inset-0 -z-20 opacity-20 dark:bg-stone-900 dark:opacity-100"
        width={20}
        height={20}
        strokeDasharray={"4 2"}
        x={-5} 
        y={-5}
      />
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-transparent">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* Mobile burger */}
            <IconLayoutSidebarFilled 
                onClick={() => setOpened(!opened)}
                size={24}
                className="sm:hidden dark:text-white text-blue-500"
            />
            <div className="flex items-center gap-3">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="220" height="64" viewBox="0 0 220 64" className="mt-2 text-blue-500 dark:text-blue-500">
                  {/* Rounded square on the left */}
                  <rect x="2" y="2" width="60" height="60" rx="5" stroke="currentColor" strokeWidth="2" fill="transparent" />
                  {/* Squiggly line in the center */}
                  <path d="M12 32 L16 28 L20 36 L24 28 L28 36 L32 28 L36 36 L40 28 L44 36 L48 28 L52 36 L55 32" stroke="currentColor" strokeWidth="3" fill="none" />
                {/* Text next to it */}
                <text x="75" y="40" fontFamily="Arial, sans-serif" fill="currentColor" fontSize="28" fontWeight={"bold"}>
                  ReceiptIQ
                </text>
              </svg>
              </Link>
            </div>
          </div>

          <nav className="hidden items-center gap-4 sm:flex">
            <Link href="/pricing" className="text-sm text-muted-foreground dark:text-gray-300">
              Pricing
            </Link>
            <Button asChild variant="outline" data-umami-event="login@home" className="dark:border-gray-600 dark:text-gray-300 hover:dark:bg-gray-800">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild data-umami-event="get_started@home" className="bg-blue-500 text-white hover:bg-blue-700">
              <Link href="/signup">Get Started</Link>
            </Button>
            {theme === 'dark' ?
            <IconSun size={16} className="mr-2 text-gray-300" onClick={() => setTheme('light')} />
            :<IconMoon size={16} className="mr-2" onClick={() => setTheme('dark')} />
            }
          </nav>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {opened && (
        <aside className="fixed left-0 z-30 h-screen w-64 bg-white dark:bg-stone-900 backdrop-blur-3xl border-r p-4 sm:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/pricing" className="text-sm text-center dark:text-gray-300">
              Pricing
            </Link>
            <div className="border-t pt-4 flex flex-col gap-2">
              <Button asChild variant="outline" data-umami-event="login@home_sidebar" className='dark:border-gray-600 dark:text-gray-300 hover:dark:bg-gray-800'>
                <Link href="/login">
                  <IconLogin size={16} className="mr-2" /> Log in
                </Link>
              </Button>
              <Button asChild data-umami-event="get_started@homepage_sidebar" className='bg-blue-500 text-white hover:bg-blue-700'>
                <Link href="/signup">
                  <IconRocket size={16} className="mr-2" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Main */}
      <main>
        {/* Hero Section */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-4xl md:text-4xl dark:text-white">
              One tool to{" "}
              <span className="text-blue-500">extract data</span> from receipts
              and manage your workflow
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              ReceiptIQ helps teams process receipts faster, smarter and more
              efficiently, delivering the visibility and data-driven insights to
              mitigate risk and ensure compliance.
            </p>
            <div className="mt-8 flex justify-center">
              <RainbowButton data-umami-event="get_started@home_herosection" asChild size='lg'> 
                <Link href="/signup">
                  <IconArrowRight size={18} /> Get Started
                </Link>
              </RainbowButton>
            </div>
          </div>
        </section>

        <Separator className='px-10'/>
        {/* Features Section */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <span className="inline-block rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-500">
              FEATURES
            </span>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Maximize your team productivity and accuracy with our affordable,
              user-friendly receipt management system.
            </p>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <IconSparkles size={28} />,
                  title: "AI-Powered Data Extraction",
                  desc: "Uses AI model to intelligently extract structured data from receipts with high accuracy and minimal manual intervention.",
                  color: "bg-blue-100 text-blue-500",
                },
                {
                  icon: <IconFileText size={28} />,
                  title: "Multi-Format Support",
                  desc: "Process any receipt format including images (JPEG and PNG) and PDF documents seamlessly in one unified platform.",
                  color: "bg-green-100 text-green-600",
                },
                {
                  icon: <IconSettings size={28} />,
                  title: "Custom Schema Definition",
                  desc: "Define custom fields and data structures for extraction that match your specific business requirements and workflows.",
                  color: "bg-orange-100 text-orange-600",
                },
                {
                  icon: <IconFolders size={28} />,
                  title: "Project Management",
                  desc: "Organize receipts into projects with custom field schemas, making it easy to manage different clients or expense categories.",
                  color: "bg-purple-100 text-purple-600",
                },
                {
                  icon: <IconDownload size={28} />,
                  title: "Data Export",
                  desc: "Export extracted data as CSV files for easy integration with accounting software, spreadsheets, and other business tools.",
                  color: "bg-red-100 text-red-600",
                },
                {
                  icon: <IconChartBar size={28} />,
                  title: "Dynamic Dashboard",
                  desc: "ReceiptIQ helps accounting teams work faster, smarter and more efficiently, delivering the visibility and insights for compliance tracking.",
                  color: "bg-blue-100 text-blue-500",
                },
              ].map((f, i) => (
                  <Card key={i}>
                    <CardHeader className={`flex items-center gap-4`}>
                      <CardTitle className={`${f.color} flex h-12 w-12 items-center justify-center rounded-md`}>{f.icon}</CardTitle>
                      <CardDescription className="text-xl font-semibold dark:text-white">{f.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-muted-foreground leading-relaxed">
                      <p>{f.desc}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer01 />
    </div>
  );
}