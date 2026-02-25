'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    ChevronDown,
    ArrowUpDown,
    ChevronRight,
    SlidersHorizontal,
    Globe,
    Building2,
    CheckCircle2
} from 'lucide-react';
import { MOCK_COMPANIES } from '@/lib/data';
import { Company } from '@/types';
import { cn } from '@/lib/utils';

export default function CompaniesPage() {
    const [search, setSearch] = useState('');
    const [sectorFilter, setSectorFilter] = useState('All');
    const [stageFilter, setStageFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Company; direction: 'asc' | 'desc' } | null>(null);

    const sectors = useMemo(() => ['All', ...new Set(MOCK_COMPANIES.map(c => c.sector))].sort(), []);
    const stages = useMemo(() => ['All', 'Seed', 'Series A', 'Series B', 'Series C', 'Late Stage', 'Exit'], []);

    const filteredCompanies = useMemo(() => {
        let result = MOCK_COMPANIES.filter(company => {
            const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) ||
                company.description.toLowerCase().includes(search.toLowerCase());
            const matchesSector = sectorFilter === 'All' || company.sector === sectorFilter;
            const matchesStage = stageFilter === 'All' || company.stage === stageFilter;
            return matchesSearch && matchesSector && matchesStage;
        });

        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = String(a[sortConfig.key]);
                const bVal = String(b[sortConfig.key]);
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [search, sectorFilter, stageFilter, sortConfig]);

    const requestSort = (key: keyof Company) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight text-foreground">Universe Workspace</h1>
                    <p className="text-sm text-neutral-muted font-medium">Venture Discovery • {MOCK_COMPANIES.length} Entities Tracked</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Signal
                </button>
            </div>

            {/* Filter Hub */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white border-[1.5px] border-neutral-border rounded-2xl p-1.5 shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-muted group-focus-within:text-primary-foreground transition-colors" />
                    <input
                        type="text"
                        placeholder="Search entities, thesis, or founders..."
                        className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-sm focus:ring-0 placeholder:text-neutral-muted/50 font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-6 w-[1.5px] bg-neutral-border hidden md:block" />
                <div className="flex items-center gap-2 pr-4">
                    <div className="flex items-center gap-3 px-4 border-r-[1.5px] border-neutral-border">
                        <span className="text-[10px] font-black text-neutral-muted uppercase tracking-[0.1em]">Sector</span>
                        <select
                            className="bg-transparent border-none text-xs font-black text-foreground focus:ring-0 cursor-pointer p-0 pr-8"
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                        >
                            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-3 px-4">
                        <span className="text-[10px] font-black text-neutral-muted uppercase tracking-[0.1em]">Stage</span>
                        <select
                            className="bg-transparent border-none text-xs font-black text-foreground focus:ring-0 cursor-pointer p-0 pr-8"
                            value={stageFilter}
                            onChange={(e) => setStageFilter(e.target.value)}
                        >
                            {stages.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Entity Table */}
            <div className="border-[1.5px] border-neutral-border rounded-2xl bg-white overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-soft/50 border-b-[1.5px] border-neutral-border">
                            <th className="px-8 py-5">
                                <button onClick={() => requestSort('name')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-neutral-muted hover:text-foreground transition-colors">
                                    Entity <ArrowUpDown className="h-3 w-3" />
                                </button>
                            </th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-neutral-muted">Core Sector</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-neutral-muted">Maturity</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-wider text-neutral-muted">Hub</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-wider text-neutral-muted">Signal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-[1.5px] divide-neutral-border">
                        {filteredCompanies.length > 0 ? (
                            filteredCompanies.map((company) => (
                                <tr key={company.id} className="hover:bg-primary/[0.02] transition-all group cursor-pointer">
                                    <td className="px-6 py-5">
                                        <Link href={`/companies/${company.id}`} className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-neutral-soft border-[1.5px] border-neutral-border flex items-center justify-center font-black text-xs text-neutral-muted group-hover:border-primary-border group-hover:text-primary-foreground group-hover:shadow-sm transition-all shrink-0">
                                                {company.name[0]}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[14px] font-black text-foreground group-hover:text-primary-foreground transition-colors tracking-tight truncate">{company.name}</span>
                                                <span className="text-xs text-neutral-muted font-bold opacity-70 tracking-tight truncate">{company.website.replace('https://', '')}</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="bg-neutral-soft text-neutral-muted text-[10px] font-black px-2.5 py-1 rounded-lg border-[1.5px] border-neutral-border uppercase tracking-wider whitespace-nowrap">
                                            {company.sector}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black border-[1.5px] uppercase tracking-wider whitespace-nowrap",
                                            company.stage === 'Seed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                company.stage.startsWith('Series') ? "bg-primary text-primary-foreground border-primary-border" :
                                                    "bg-neutral-soft text-neutral-muted border-neutral-border"
                                        )}>
                                            {company.stage}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-neutral-muted truncate max-w-[200px]">
                                        {company.location}
                                    </td>
                                    <td className="px-6 py-5 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2 text-emerald-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="text-[10px] font-black uppercase tracking-tight">Verified</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-6 text-neutral-muted">
                                        <div className="h-20 w-20 rounded-full bg-neutral-soft flex items-center justify-center border-[1.5px] border-neutral-border shadow-inner">
                                            <Search className="h-8 w-8 opacity-20" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-foreground">No matching entities tracked</p>
                                            <p className="text-xs font-bold max-w-xs mx-auto">Try refining your thesis filters or discovery keywords.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pb-10">
                <p className="text-[11px] font-black text-neutral-muted uppercase tracking-[0.2em]">
                    Showing <span className="text-foreground">{filteredCompanies.length}</span> results
                </p>
                <div className="flex gap-3">
                    <button className="btn-secondary py-2 px-5 text-[11px] font-black uppercase tracking-widest disabled:opacity-30" disabled>RelPrev</button>
                    <button className="btn-secondary py-2 px-5 text-[11px] font-black uppercase tracking-widest">RelNext</button>
                </div>
            </div>
        </div>
    );
}
