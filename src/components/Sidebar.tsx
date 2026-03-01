'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    ListTodo,
    Search,
    BarChart3,
    ArrowUpFromLine
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Lists', href: '/lists', icon: ListTodo },
    { name: 'Saved Searches', href: '/saved', icon: Search },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[220px] bg-[#1A1916] h-screen flex flex-col shrink-0">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-[#2A2926]">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="font-display italic text-white text-[18px] tracking-wide">ThesisFlow</span>
                    <ArrowUpFromLine className="h-3 w-3 text-white/70 group-hover:text-white transition-colors group-hover:-translate-y-0.5 duration-150" />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-6 py-2 text-[14px] transition-editorial relative",
                                isActive
                                    ? "text-white font-medium"
                                    : "text-gray-400 hover:text-gray-200"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-accent)]" />
                            )}
                            <item.icon className={cn(
                                "h-4 w-4 shrink-0 transition-editorial",
                                isActive ? "text-[var(--color-accent)]" : "text-gray-500 hover:text-gray-300"
                            )} strokeWidth={isActive ? 2.5 : 2} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Thesis Chips - Hardcoded bottom section */}
            <div className="px-6 py-6 border-t border-[#2A2926]">
                <div className="mb-3">
                    <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">Active Thesis</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['B2B SaaS', 'Seed', 'AI/ML', 'India'].map((thesis) => (
                        <div key={thesis} className="px-2.5 py-1 rounded bg-[#2A2926] border border-[#3A3936] text-[11px] font-mono text-gray-300 uppercase tracking-wide">
                            {thesis}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
