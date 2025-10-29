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
  IconLayoutSidebarFilled
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import Footer01 from '@/components/ui/footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image";
import { BorderBeam } from '@/components/ui/border-beam';
import ThemeSwitcher from '@/components/ui/toggle-theme';

export default function ReceiptIQHomepage() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="relative min-h-screen w-full">
      {/* Header */}
      <header className="sticky top-0 backdrop-blur-md bg-transparent/50 z-50">
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="45" viewBox="0 0 220 64" className="mt-2">
                  {/* Rounded square on the left */}
                  <rect x="2" y="2" width="60" height="60" rx="5" stroke="currentColor" strokeWidth="2" fill="white" />
                  {/* Squiggly line in the center */}
                  <path d="M12 32 L16 28 L20 36 L24 28 L28 36 L32 28 L36 36 L40 28 L44 36 L48 28 L52 36 L55 32" stroke="black" strokeWidth="3" fill="none" />
                  {/* Text next to it */}
                  <text x="75" y="40" fontFamily="Roboto, sans-serif" fill="currentColor" fontSize="30">
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
            <ThemeSwitcher />
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
            <h1 className="mx-auto max-w-3xl text-6xl font-bold leading-tight sm:text-4xl md:text-6xl dark:text-white">
              AI-Powered <br />
              Data Extraction
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              ReceiptIQ helps teams process receipts faster, smarter and more efficiently, delivering the flexibilty and accuracy.
            </p>
            <div className="mt-8 flex justify-center">
              <Button data-umami-event="get_started@home_herosection" asChild size='lg'>
                <Link href="/signup">
                  <IconArrowRight size={18} /> Get Started
                </Link>
              </Button>
            </div>
            <div className='relative w-full bg-transparent px-2 pt-10 pb-20 md:py-16'>
              <div className="gradient -translate-x-1/2 absolute inset-0 left-1/2 h-1/4 w-3/4 animate-image-glow blur-[5rem] md:top-[10%] md:h-1/3"></div>
              <div className="-m-2 lg:-m-4 rounded-xl bg-opacity-50 p-2 ring-1 ring-foreground/20 ring-inset backdrop-blur-3xl lg:rounded-2xl">
                <Image src={"/assets/images/app_page1.avif"} alt='app page 1' width={1300} height={800} />
                <BorderBeam
                  duration={4}
                  size={400}
                  reverse
                  className="from-transparent via-green-500 to-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        <Separator className='px-10' />
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