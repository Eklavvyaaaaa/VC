import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  ListTodo,
  Zap,
  Clock,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-300">
      {/* Workspace Header */}
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-[40px] text-primary tracking-tight leading-none">Intelligence Hub</h1>
        <p className="text-[15px] text-secondary font-medium">Real-time proprietary signals and universe discovery for Veridia Capital.</p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Universe Size', value: '1,284', icon: Building2, trend: '+12%', iconBg: 'bg-white', iconBorder: 'border-primary', trendColor: 'text-primary' },
          { label: 'Enrichments', value: '452', icon: Zap, trend: '85%', iconBg: 'bg-white', iconBorder: 'border-amber-500', trendColor: 'text-primary' },
          { label: 'Active Pipeline', value: '18', icon: ListTodo, trend: '2 new', iconBg: 'bg-white', iconBorder: 'border-emerald-500', trendColor: 'text-primary' },
          { label: 'Team Activity', value: '24', icon: Users, trend: 'Today', iconBg: 'bg-white', iconBorder: 'border-primary', trendColor: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="bg-card border-2 border-primary p-5 shadow-sm group hover:border-strong transition-editorial flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 border-2 rounded-xl transition-editorial", stat.iconBg, stat.iconBorder)}>
                <stat.icon className={cn("h-5 w-5", stat.trendColor)} />
              </div>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-primary px-3 py-1 border-2 border-primary rounded-xl bg-white">
                {stat.trend}
              </span>
            </div>
            <div className="mt-2">
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-primary">{stat.label}</p>
              <p className="font-sans text-[32px] font-black text-primary tracking-tighter leading-none mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Signals Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-default pb-4">
            <h2 className="font-mono text-[11px] uppercase tracking-wide text-primary flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              Recent Intelligence
            </h2>
            <Link href="/companies" className="font-mono text-[11px] uppercase tracking-wide text-accent hover:underline transition-editorial">
              Explore All Analysis
            </Link>
          </div>
          <div className="space-y-0 relative">
            <div className="absolute left-[27px] top-6 bottom-6 w-[1px] bg-border" />
            {[
              { id: 1, text: 'New company discovered in AgriTech', sub: 'TerraForma Labs • Nairobi', time: '2m ago' },
              { id: 2, text: 'Enrichment complete for QuantumScale', sub: 'Detected hiring surge in London', time: '1h ago' },
              { id: 3, text: 'Veridia AI moved to "Due Diligence"', sub: 'Updated by Alex Chen', time: '3h ago' },
              { id: 4, text: 'Sector alert: HealthTech', sub: '4 new Seed rounds detected today', time: '5h ago' },
              { id: 5, text: 'OrbitLink connectivity analysis refined', sub: 'New derived signals available', time: '8h ago' },
            ].map((item) => (
              <div key={item.id} className="flex items-start gap-5 py-4 group relative bg-page hover:bg-subtle -mx-4 px-4 transition-editorial cursor-pointer">
                <div className="h-[22px] w-[22px] rounded-full border-2 border-page bg-subtle shrink-0 mt-0.5 relative z-10 flex items-center justify-center group-hover:border-subtle group-hover:bg-accent transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-border-strong group-hover:bg-white" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-[14px] font-medium text-primary truncate">{item.text}</h4>
                    <span className="font-mono text-[11px] text-muted whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-[13px] text-secondary truncate">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Operations */}
        <div className="space-y-6">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-primary border-b border-default pb-4">Operational Tools</h2>
          <div className="space-y-3">
            <Link href="/companies" className="bg-card border-2 border-primary py-4 px-6 flex items-center gap-6 group transition-editorial">
              <div className="p-3 border-2 border-primary bg-subtle rounded-3xl transition-editorial shrink-0">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[17px] font-bold text-primary leading-none">Run Discovery</span>
                <span className="text-[14px] font-bold text-secondary">Segment entire universe</span>
              </div>
            </Link>

            <Link href="/insights" className="bg-card border-2 border-primary py-4 px-6 flex items-center gap-6 group transition-editorial">
              <div className="p-3 border-2 border-primary bg-subtle rounded-3xl transition-editorial shrink-0">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[17px] font-bold text-primary leading-none">Market Trends</span>
                <span className="text-[14px] font-bold text-secondary">Macro sector analysis</span>
              </div>
            </Link>

            {/* Simulated AI Pro Block */}
            <div className="border border-default bg-[#1A1916] p-6 relative overflow-hidden group hover:shadow-md transition-editorial cursor-pointer mt-6">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#F0EFE9]" />
                  <span className="font-mono text-[11px] uppercase tracking-wide text-[#F0EFE9]">ThesisFlow AI</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-[16px] font-medium text-white tracking-tight">Deep Signal Enrichment.</h3>
                  <p className="text-[13px] text-[#9C9A94] leading-relaxed">Extract precision signals from any public URL with proprietary algorithms.</p>
                </div>
                <div className="pt-2">
                  <Link href="/companies" className="text-[12px] font-medium text-[#1A1916] bg-white px-4 py-2 hover:bg-[#F0EFE9] transition-editorial inline-flex items-center justify-center">
                    Launch Engine
                  </Link>
                </div>
              </div>
              <Zap className="absolute -right-4 -bottom-4 h-24 w-24 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
