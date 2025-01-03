// path : src/components/menu/Header.tsx
'use client';

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/menu/mode-toggle"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function Header() {
    const navItems = [
        { href: "/dashboard", label: "Tableau de bord" },
        { href: "/clients", label: "Clients" },
        { href: "/articles", label: "Articles" },
    ]

    return (
        <header className="bg-background border-b">
            <div className="container mx-auto flex justify-between items-center py-4">
                <Link href="/" className="text-2xl font-bold">
                    GestFact
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex gap-4 items-center">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Button asChild variant="ghost">
                                    <Link href={item.href}>{item.label}</Link>
                                </Button>
                            </li>
                        ))}
                        <li>
                            <ModeToggle />
                        </li>
                    </ul>
                </nav>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center gap-4">
                    <ModeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <nav className="flex flex-col gap-4 mt-8">
                                {navItems.map((item) => (
                                    <Button
                                        key={item.href}
                                        asChild
                                        variant="ghost"
                                        className="w-full justify-start"
                                    >
                                        <Link href={item.href}>{item.label}</Link>
                                    </Button>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
