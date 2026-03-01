'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  ListTodo,
  Zap,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { CompanyList } from '@/types';

export default function Home() {
  const [universeSize, setUniverseSize] = useState<number | null>(null);
  const [enrichmentCount, setEnrichmentCount] = useState<number | null>(null);
  const [pipelineCount, setPipelineCount] = useState<number | null>(null);
  const [savedSearchesCount, setSavedSearchesCount] = useState<number | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<any[] | null>(null);

  useEffect(() => {
    // 1. Fetch Universe Size
    const fetchUniverse = async () => {
      try {
        const res = await fetch('/api/companies');
        const data = await res.json();
        if (data.companies) {
          setUniverseSize(data.companies.length);
        } else {
          setUniverseSize(0);
        }
      } catch (err) {
        console.error('Failed to fetch companies', err);
        setUniverseSize(0);
      }
    };
    fetchUniverse();

    // 2. Count Enrichments
    try {
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.CACHED_ENRICHMENT_PREFIX)) {
          count++;
        }
      }
      setEnrichmentCount(count);
    } catch (err) {
      console.error('Failed to read enrichments', err);
      setEnrichmentCount(0);
    }

    // 3. Count Active Pipeline / Lists
    try {
      const lists = getFromStorage<CompanyList[]>(STORAGE_KEYS.LISTS, []);
      const totalCompanies = lists.reduce((sum, list) => sum + (list.companyIds ? list.companyIds.length : 0), 0);
      setPipelineCount(totalCompanies);
    } catch (err) {
      console.error('Failed to read lists', err);
      setPipelineCount(0);
    }

    // 4. Count Saved Searches
    try {
      // Assuming it's an array of searches
      const searches = getFromStorage<any[]>(STORAGE_KEYS.SAVED_SEARCHES, []);
      setSavedSearchesCount(searches.length);
    } catch (err) {
      console.error('Failed to read saved searches', err);
      setSavedSearchesCount(0);
    }

    // 5. Load Recently Viewed
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      } else {
        setRecentlyViewed([]);
      }
    } catch (err) {
      console.error('Failed to load recently viewed', err);
      setRecentlyViewed([]);
    }
  }, []);

  const getTimeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const renderStatValue = (value: number | null) => {
    if (value === null) {
      return <div className="w-16 h-6 bg-gray-200 animate-pulse rounded mt-1" />;
    }
    return <p className="font-sans text-[32px] font-black text-primary tracking-tighter leading-none mt-1">{value}</p>;
  };

  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-300">
      {/* Workspace Header */}
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-[40px] text-primary tracking-tight leading-none">Intelligence Hub</h1>
        <p className="text-[15px] text-secondary font-medium">Your thesis-driven sourcing engine.</p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Universe Size', value: universeSize, icon: Building2, iconBg: 'bg-white', iconBorder: 'border-primary', trendColor: 'text-primary' },
          { label: 'Enrichments', value: enrichmentCount, icon: Zap, iconBg: 'bg-white', iconBorder: 'border-amber-500', trendColor: 'text-primary' },
          { label: 'Active Pipeline', value: pipelineCount, icon: ListTodo, iconBg: 'bg-white', iconBorder: 'border-emerald-500', trendColor: 'text-primary' },
          { label: 'Saved Searches', value: savedSearchesCount, icon: Search, iconBg: 'bg-white', iconBorder: 'border-primary', trendColor: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="bg-card border-2 border-primary p-5 shadow-sm group hover:border-strong transition-editorial flex flex-col min-h-[140px]">
            <div className="flex items-center justify-between mb-auto">
              <div className={cn("p-2 border-2 rounded-xl transition-editorial", stat.iconBg, stat.iconBorder)}>
                <stat.icon className={cn("h-5 w-5", stat.trendColor)} />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-primary">{stat.label}</p>
              {renderStatValue(stat.value)}
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
              Recently Viewed Companies
            </h2>
            <Link href="/companies" className="font-mono text-[11px] uppercase tracking-wide text-accent hover:underline transition-editorial">
              Explore All Analysis
            </Link>
          </div>

          <div className="space-y-0 relative">
            {!recentlyViewed ? (
              <div className="py-8 space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-6 h-6 rounded-full bg-subtle animate-pulse shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-subtle rounded w-1/3 animate-pulse" />
                      <div className="h-3 bg-subtle rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentlyViewed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 border border-dashed border-default rounded-xl bg-card mt-4">
                <Clock className="h-8 w-8 text-muted stroke-[1.5]" />
                <div className="space-y-1">
                  <p className="text-[15px] font-medium text-primary">No recent activity yet.</p>
                  <p className="text-[13px] text-secondary">Start exploring companies to see them here.</p>
                </div>
                <Link href="/companies" className="btn-primary mt-2 inline-flex items-center gap-2">
                  Explore Companies <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="absolute left-[27px] top-6 bottom-6 w-[1px] bg-border" />
                {recentlyViewed.map((item: any, i: number) => (
                  <Link key={item.id || i} href={`/companies/${item.id}`} className="block">
                    <div className="flex items-start gap-5 py-4 group relative bg-page hover:bg-subtle -mx-4 px-4 transition-editorial cursor-pointer">
                      <div className="h-[22px] w-[22px] rounded-full border-2 border-page bg-subtle shrink-0 mt-0.5 relative z-10 flex items-center justify-center group-hover:border-subtle group-hover:bg-accent transition-colors">
                        <div className="h-1.5 w-1.5 rounded-full bg-border-strong group-hover:bg-white" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="text-[14px] font-medium text-primary truncate">{item.name}</h4>
                          <span className="font-mono text-[11px] text-muted whitespace-nowrap">{getTimeAgo(item.viewedAt)}</span>
                        </div>
                        <p className="text-[13px] text-secondary truncate">{item.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            )}
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
