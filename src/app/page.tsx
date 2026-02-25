import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  ListTodo,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="space-y-12 pb-10">
      {/* Workspace Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase tracking-widest">Intelligence Hub</h1>
        <p className="text-sm text-neutral-muted font-bold">Real-time proprietary signals and universe discovery for Veridia Capital.</p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Universe Size', value: '1,284', icon: Building2, trend: '+12%', color: 'text-primary-foreground' },
          { label: 'Enrichments', value: '452', icon: Zap, trend: '85%', color: 'text-amber-500' },
          { label: 'Active Pipeline', value: '18', icon: ListTodo, trend: '2 new', color: 'text-emerald-600' },
          { label: 'Team Activity', value: '24', icon: Users, trend: 'Today', color: 'text-primary-foreground' },
        ].map((stat, i) => (
          <div key={i} className="content-card shadow-sm border-[1.5px] border-neutral-border group hover:border-primary-border hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className={cn("p-2.5 rounded-xl bg-neutral-soft border-[1.5px] border-neutral-border group-hover:border-primary-border group-hover:bg-primary/5 transition-all shadow-sm", stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black text-neutral-muted bg-neutral-soft px-2 py-1 rounded-lg border-[1.5px] border-neutral-border uppercase tracking-widest shadow-inner">
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-neutral-muted uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-3xl font-black text-foreground mt-2 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Signals Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b-[1.5px] border-neutral-border pb-5">
            <h2 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-foreground" />
              Recent Intelligence
            </h2>
            <Link href="/companies" className="text-[10px] font-black text-primary-foreground uppercase tracking-widest hover:underline hover:scale-105 transition-transform">
              Explore All Analysis
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { id: 1, text: 'New company discovered in AgriTech', sub: 'TerraForma Labs • Nairobi', time: '2m ago' },
              { id: 2, text: 'Enrichment complete for QuantumScale', sub: 'Detected hiring surge in London', time: '1h ago' },
              { id: 3, text: 'Veridia AI moved to "Due Diligence"', sub: 'Updated by Alex Chen', time: '3h ago' },
              { id: 4, text: 'Sector alert: HealthTech', sub: '4 new Seed rounds detected today', time: '5h ago' },
              { id: 5, text: 'OrbitLink connectivity analysis refined', sub: 'New derived signals available', time: '8h ago' },
            ].map((item) => (
              <div key={item.id} className="content-card p-5 flex items-center justify-between hover:bg-primary/[0.02] border-[1.5px] border-neutral-border transition-all group cursor-pointer shadow-sm hover:shadow-md">
                <div className="flex items-center gap-5">
                  <div className="h-10 w-10 rounded-xl bg-neutral-soft border-[1.5px] border-neutral-border flex items-center justify-center group-hover:border-primary-border group-hover:bg-white transition-all shadow-sm">
                    <Building2 className="h-4 w-4 text-neutral-muted group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-[14px] font-black text-foreground tracking-tight">{item.text}</h4>
                    <p className="text-xs text-neutral-muted font-bold mt-1 opacity-70 tracking-tight">{item.sub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black text-neutral-muted uppercase tracking-widest opacity-60">{item.time}</span>
                  <ArrowUpRight className="h-4 w-4 text-neutral-border group-hover:text-primary-foreground group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Operations */}
        <div className="space-y-8">
          <h2 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] border-b-[1.5px] border-neutral-border pb-5">Operational Tools</h2>
          <div className="space-y-4">
            <Link href="/companies" className="content-card shadow-sm border-[1.5px] border-neutral-border flex items-center gap-5 py-5 group hover:border-primary-border hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-neutral-soft border-[1.5px] border-neutral-border flex items-center justify-center transition-all group-hover:border-primary-border group-hover:bg-primary/5 shadow-sm">
                <Search className="h-4 w-4 text-neutral-muted group-hover:text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-black text-foreground tracking-tight">Run Discovery</span>
                <span className="text-xs text-neutral-muted font-bold opacity-70 tracking-tight">Segment entire universe</span>
              </div>
            </Link>

            <Link href="/insights" className="content-card shadow-sm border-[1.5px] border-neutral-border flex items-center gap-5 py-5 group hover:border-primary-border hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-neutral-soft border-[1.5px] border-neutral-border flex items-center justify-center transition-all group-hover:border-primary-border group-hover:bg-primary/5 shadow-sm">
                <BarChart3 className="h-4 w-4 text-neutral-muted group-hover:text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-black text-foreground tracking-tight">Market Trends</span>
                <span className="text-xs text-neutral-muted font-bold opacity-70 tracking-tight">Macro sector analysis</span>
              </div>
            </Link>

            {/* Simulated AI Pro Block */}
            <div className="bg-primary border-[1.5px] border-primary-border rounded-2xl p-7 relative overflow-hidden group shadow-md hover:shadow-lg transition-all cursor-pointer">
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary-foreground rounded-lg shadow-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground">Antigravity AI</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[15px] font-black leading-tight text-foreground tracking-tight">Deep Signal Enrichment is active.</h3>
                  <p className="text-xs text-neutral-muted font-bold leading-relaxed opacity-80">Extract precision signals from any public URL with proprietary accuracy algorithms.</p>
                </div>
                <div className="flex pt-3">
                  <button className="btn-primary py-2.5 px-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-primary/40">
                    Launch Engine
                  </button>
                </div>
              </div>
              <Zap className="absolute -right-8 -bottom-8 h-32 w-32 text-primary-foreground/10 rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
