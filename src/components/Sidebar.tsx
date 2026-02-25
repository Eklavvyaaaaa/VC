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
    Settings,
    ChevronDown,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Lists', href: '/lists', icon: ListTodo },
    { name: 'Saved Searches', href: '/saved', icon: Search },
    { name: 'Insights', href: '/insights', icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r-[1.5px] border-neutral-border h-screen flex flex-col shrink-0 shadow-[1px_0_0_0_rgba(0,0,0,0.02)]">
            {/* Workspace Switcher */}
            <div className="p-5">
                <div className="flex items-center justify-between p-2.5 rounded-xl border-[1.5px] border-transparent hover:border-neutral-border hover:bg-neutral-soft/50 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary-foreground text-white flex items-center justify-center font-black text-sm shadow-[0_2px_10px_rgba(124,58,237,0.3)]">
                            V
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[13px] font-black text-foreground leading-none">Veridia Cap</span>
                            <span className="text-[10px] text-neutral-muted font-bold uppercase tracking-tighter mt-1">Intelligence Hub</span>
                        </div>
                    </div>
                    <ChevronDown className="h-3 w-3 text-neutral-muted group-hover:text-foreground transition-colors" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 mt-4">
                <div className="px-3 mb-2">
                    <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-[0.1em]">Core Discovery</span>
                </div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all group border-[1.5px] border-transparent",
                                isActive
                                    ? "bg-primary/50 text-primary-foreground border-primary-border shadow-sm nav-item-active"
                                    : "text-neutral-muted hover:bg-neutral-soft hover:text-foreground hover:border-neutral-border"
                            )}
                        >
                            <item.icon className={cn(
                                "h-4 w-4 shrink-0 transition-colors",
                                isActive ? "text-primary-foreground" : "text-neutral-muted group-hover:text-foreground"
                            )} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Quick Lists / Folders */}
            <div className="px-5 py-6 space-y-4">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-[0.1em]">Universe Segments</span>
                    <button className="h-5 w-5 rounded-lg border-[1.5px] border-neutral-border hover:border-primary-border hover:bg-primary/5 flex items-center justify-center transition-all group">
                        <Plus className="h-3 w-3 text-neutral-muted group-hover:text-primary-foreground" />
                    </button>
                </div>
                <div className="space-y-1">
                    {['Q1 Pipeline', 'AI Thesis 2024', 'Portfolio Beta'].map((list) => (
                        <button key={list} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-bold text-neutral-muted hover:bg-neutral-soft hover:text-foreground transition-all group text-left border-[1.5px] border-transparent hover:border-neutral-border">
                            <div className="h-2 w-2 rounded-full bg-primary-border ring-4 ring-primary/10" />
                            {list}
                        </button>
                    ))}
                </div>
            </div>

            {/* User / Settings Footer */}
            <div className="p-4 border-t-[1.5px] border-neutral-border bg-neutral-soft/30">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all border-[1.5px] border-transparent",
                        pathname === '/settings'
                            ? "bg-primary/50 text-primary-foreground border-primary-border"
                            : "text-neutral-muted hover:bg-neutral-soft hover:text-foreground hover:border-neutral-border"
                    )}
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
