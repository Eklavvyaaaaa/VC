'use client';

import React from 'react';
import {
    BarChart3,
    TrendingUp,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Globe,
    Sparkles,
    Filter,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InsightsPage() {
    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-foreground uppercase tracking-widest">Market Intelligence</h1>
                <p className="text-sm text-neutral-muted font-bold">Venture trends and proprietary signals extracted across the universe.</p>
            </div>

            {/* Market Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="content-card border-[1.5px] border-neutral-border shadow-sm space-y-6 group hover:border-primary-border transition-all">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-muted flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                            Velocity Signal
                        </h3>
                        <span className="text-emerald-600 flex items-center gap-1.5 text-[11px] font-black bg-emerald-50 px-2 py-1 rounded-lg border-[1.5px] border-emerald-100 uppercase">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            14%
                        </span>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-foreground tracking-tighter">High Growth</p>
                        <p className="text-xs text-neutral-muted mt-3 leading-relaxed font-bold opacity-80">Early-stage entry points are expanding in AI Infrastructure and Biotech segments.</p>
                    </div>
                </div>

                <div className="content-card border-[1.5px] border-neutral-border shadow-sm space-y-6 group hover:border-primary-border transition-all">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-muted flex items-center gap-2">
                            <Activity className="h-4 w-4 text-amber-500" />
                            Signal Density
                        </h3>
                        <span className="text-amber-600 flex items-center gap-1.5 text-[11px] font-black bg-amber-50 px-2 py-1 rounded-lg border-[1.5px] border-amber-100 uppercase">
                            Stable
                        </span>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-foreground tracking-tighter">Concentrated</p>
                        <p className="text-xs text-neutral-muted mt-3 leading-relaxed font-bold opacity-80">Discovery signals are focusing on Series A consolidation within the FinTech sector.</p>
                    </div>
                </div>

                <div className="content-card bg-primary/40 border-[1.5px] border-primary-border shadow-md space-y-6 group hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            AI Thesis
                        </h3>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-foreground tracking-tighter">Vertical AI</p>
                        <p className="text-xs text-neutral-muted mt-3 leading-relaxed italic font-bold">Proprietary model layers are losing ground to specialized application stacks.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Sector Activity */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b-[1.5px] border-neutral-border pb-5">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-primary-foreground" />
                            Sector Distribution
                        </h2>
                    </div>
                    <div className="space-y-7">
                        {[
                            { name: 'Artificial Intelligence', count: 42, color: 'bg-primary-foreground' },
                            { name: 'FinTech', count: 28, color: 'bg-indigo-500' },
                            { name: 'HealthTech', count: 24, color: 'bg-emerald-500' },
                            { name: 'SaaS', count: 18, color: 'bg-amber-500' },
                            { name: 'Cybersecurity', count: 12, color: 'bg-slate-500' },
                        ].map((sector) => (
                            <div key={sector.name} className="space-y-3">
                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.1em]">
                                    <span className="text-foreground">{sector.name}</span>
                                    <span className="text-neutral-muted opacity-60">{sector.count}% Universe</span>
                                </div>
                                <div className="h-2.5 w-full bg-neutral-soft rounded-full border-[1.5px] border-neutral-border p-[1.5px] overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", sector.color)}
                                        style={{ width: `${sector.count}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fresh Signals */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b-[1.5px] border-neutral-border pb-5">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            Proprietary Signals
                        </h2>
                        <button className="text-[10px] font-black text-primary-foreground uppercase tracking-[0.15em] hover:underline">View Universe</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { entity: 'Scale AI', event: 'New Headcount Spike', type: 'Growth', delta: '+12%' },
                            { entity: 'Pinecone', event: 'Technical Debt Reduction', type: 'Health', delta: 'High' },
                            { entity: 'Vercel', event: 'Market Expansion', type: 'Strategy', delta: 'Global' },
                            { entity: 'Mistral', event: 'Talent Acquisition', type: 'Team', delta: 'Ex-Google' },
                        ].map((signal, i) => (
                            <div key={i} className="content-card p-5 border-[1.5px] border-neutral-border hover:border-primary-border transition-all flex items-center justify-between group shadow-sm hover:shadow-md cursor-pointer">
                                <div className="flex items-center gap-5">
                                    <div className="h-10 w-10 rounded-xl bg-neutral-soft border-[1.5px] border-neutral-border flex items-center justify-center font-black text-xs text-neutral-muted group-hover:text-primary-foreground group-hover:bg-white transition-all shadow-sm">
                                        {signal.entity[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-black text-foreground tracking-tight">{signal.entity}</span>
                                        <span className="text-[10px] text-neutral-muted font-black uppercase tracking-[0.1em] opacity-60">{signal.event}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <span className="text-[10px] font-black bg-neutral-soft text-neutral-muted px-2.5 py-1 rounded-lg border-[1.5px] border-neutral-border group-hover:border-primary-border group-hover:text-primary-foreground transition-all uppercase tracking-widest shadow-inner">
                                        {signal.type}
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-neutral-border opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all text-primary-foreground" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
