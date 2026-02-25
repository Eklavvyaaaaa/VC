'use client';

import React from 'react';
import {
    Zap,
    BookOpen,
    Lightbulb,
    ArrowUpRight,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function RightPanel() {
    return (
        <aside className="w-80 border-l-[1.5px] border-neutral-border bg-neutral-soft/30 h-screen hidden xl:flex flex-col p-6 space-y-8 overflow-y-auto no-scrollbar shadow-[-1px_0_0_0_rgba(0,0,0,0.02)]">
            {/* Quick Start Guide */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-muted px-1 flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" />
                    Explorer Guide
                </h3>
                <div className="space-y-3">
                    {[
                        "Search across 500+ VC-backed entities",
                        "Enrich profiles with proprietary signals",
                        "Save to custom investment lists",
                        "Export clean CSV for CRM syncing"
                    ].map((step, i) => (
                        <div key={i} className="bg-white border-[1.5px] border-neutral-border rounded-xl p-4 shadow-sm flex gap-4 items-start group hover:border-primary-border hover:shadow-md transition-all cursor-default">
                            <div className="h-5 w-5 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm">
                                {i + 1}
                            </div>
                            <span className="text-[12px] text-neutral-muted leading-relaxed font-bold group-hover:text-foreground">
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Platform Status */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-muted px-1 flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5" />
                    Engine Status
                </h3>
                <div className="bg-white border-[1.5px] border-neutral-border rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-muted">Extraction Queue</span>
                        <span className="text-[11px] font-black text-emerald-600 flex items-center gap-1.5 uppercase tracking-tight">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Healthy
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-muted">Last Scrape</span>
                        <span className="text-[11px] font-black flex items-center gap-1.5 uppercase tracking-tight">
                            <Clock className="h-3.5 w-3.5 text-neutral-muted" />
                            3m ago
                        </span>
                    </div>
                    <div className="pt-2">
                        <div className="w-full bg-neutral-soft rounded-full h-2 border-[1.5px] border-neutral-border p-[1px]">
                            <div className="bg-primary-foreground h-full rounded-full w-[85%] shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] font-black text-neutral-muted uppercase tracking-tighter">Throughput</span>
                            <span className="text-[10px] text-foreground font-black uppercase">85% Capacity</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-primary/50 border-[1.5px] border-primary-border rounded-2xl p-5 space-y-3 shadow-sm group">
                <div className="flex items-center gap-2 text-primary-foreground">
                    <Lightbulb className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Pro Tip</span>
                </div>
                <p className="text-[12px] text-foreground/80 leading-relaxed font-bold">
                    Use <kbd className="bg-white border-[1.5px] border-primary-border px-1.5 py-0.5 rounded-md text-[10px] font-black mx-1 shadow-sm">⌘K</kbd> to quickly find any company or research note across your workspace.
                </p>
                <button className="text-[10px] font-black text-primary-foreground flex items-center gap-1 hover:gap-3 transition-all pt-1 uppercase tracking-[0.1em]">
                    Learn shortcuts <ArrowUpRight className="h-3 w-3" />
                </button>
            </div>

            <div className="flex-1" />

            {/* Trial Badge */}
            <div className="border-[1.5px] border-neutral-border rounded-xl p-4 flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-all">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-muted uppercase tracking-[0.2em] leading-none">Workspace Tier</p>
                    <p className="text-xs font-black text-foreground uppercase tracking-tight">Premium Trial</p>
                </div>
                <span className="bg-neutral-soft border-[1.5px] border-neutral-border text-neutral-muted text-[10px] font-black px-2.5 py-1.5 rounded-lg">12 days left</span>
            </div>
        </aside>
    );
}
