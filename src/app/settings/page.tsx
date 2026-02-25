'use client';

import React from 'react';
import {
    Settings,
    User,
    Bell,
    Shield,
    Database,
    Zap,
    CreditCard,
    ChevronRight,
    Search,
    Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-foreground uppercase tracking-widest">Workspace Settings</h1>
                <p className="text-sm text-neutral-muted font-bold">Configure your intelligence engine and team preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-2">
                    {[
                        { name: 'General', icon: Globe, active: true },
                        { name: 'Team Members', icon: User },
                        { name: 'Notifications', icon: Bell },
                        { name: 'Security', icon: Shield },
                        { name: 'Data Sources', icon: Database },
                        { name: 'API & Webhooks', icon: Zap },
                        { name: 'Billing', icon: CreditCard },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-black uppercase tracking-tight transition-all border-[1.5px] border-transparent shadow-sm",
                                item.active
                                    ? "bg-primary text-primary-foreground border-primary-border shadow-md"
                                    : "text-neutral-muted hover:bg-neutral-soft hover:text-foreground hover:border-neutral-border"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="md:col-span-3 space-y-12">
                    <section className="space-y-8">
                        <div className="border-b-[1.5px] border-neutral-border pb-5">
                            <h2 className="text-lg font-black text-foreground uppercase tracking-widest leading-none">General Configuration</h2>
                            <p className="text-xs text-neutral-muted font-bold mt-2">Workspace-wide settings and visual identity controls.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-neutral-muted uppercase tracking-[0.2em] px-1">Workspace Name</label>
                                <input
                                    type="text"
                                    defaultValue="Veridia Capital internal"
                                    className="input-calm w-full max-w-lg border-[1.5px] border-neutral-border rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-neutral-muted uppercase tracking-[0.2em] px-1">Primary Region</label>
                                <select className="input-calm w-full max-w-lg bg-white border-[1.5px] border-neutral-border rounded-xl px-4 py-3 text-sm font-bold shadow-sm cursor-pointer">
                                    <option>Global Discovery</option>
                                    <option>EMEA Focused</option>
                                    <option>North America</option>
                                    <option>APAC Emerging</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="border-b-[1.5px] border-neutral-border pb-5">
                            <h2 className="text-lg font-black text-foreground uppercase tracking-widest leading-none">Discovery Intelligence</h2>
                            <p className="text-xs text-neutral-muted font-bold mt-2">Control the behavior of the Antigravity deep enrichment engine.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: 'Auto-Enrichment', desc: 'Automatically enrich new companies on discovery', active: true },
                                { title: 'Social Listening', desc: 'Monitor founder activity and headcount spikes in real-time', active: false },
                                { title: 'Proprietary Signals', desc: 'Generate thesis matches based on internal strategy notes', active: true },
                            ].map((toggle, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-white border-[1.5px] border-neutral-border rounded-2xl shadow-sm group hover:border-primary-border transition-all">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-black text-foreground tracking-tight">{toggle.title}</span>
                                        <span className="text-xs text-neutral-muted font-bold opacity-70 tracking-tight">{toggle.desc}</span>
                                    </div>
                                    <div className={cn(
                                        "h-6 w-12 rounded-full transition-all cursor-pointer relative border-[1.5px]",
                                        toggle.active ? "bg-primary-foreground border-primary-foreground shadow-[0_0_10px_rgba(124,58,237,0.3)]" : "bg-neutral-border border-neutral-border"
                                    )}>
                                        <div className={cn(
                                            "h-3.5 w-3.5 bg-white rounded-full absolute top-1 transition-all shadow-md",
                                            toggle.active ? "right-1" : "left-1"
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex justify-end gap-4 pt-8 border-t-[1.5px] border-neutral-border">
                        <button className="btn-secondary px-6 font-black uppercase text-[10px] tracking-widest">Discard Changes</button>
                        <button className="btn-primary px-8 font-black uppercase text-[10px] tracking-widest">Save Preferences</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
