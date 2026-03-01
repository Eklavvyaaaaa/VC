'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    MoreHorizontal,
    Eye,
    Bookmark,
    RefreshCw
} from 'lucide-react';
import { Company } from '@/types';
import { cn } from '@/lib/utils';

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [search, setSearch] = useState('');
    const [sectorFilter, setSectorFilter] = useState('All');
    const [stageFilter, setStageFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Company; direction: 'asc' | 'desc' } | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const loadCompanies = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch('/api/companies');
            const data = await res.json();
            if (data.companies && data.companies.length > 0) {
                setCompanies(data.companies);
            } else {
                setError(true);
            }
        } catch (e) {
            console.error(e);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCompanies();
    }, [loadCompanies]);

    const sectors = useMemo(() => ['All', ...new Set(companies.map(c => c.sector))].sort(), [companies]);
    const stages = useMemo(() => ['All', 'Seed', 'Series A', 'Series B', 'Series C', 'Late Stage', 'Exit'], []);

    const filteredCompanies = useMemo(() => {
        let result = [...companies].filter(company => {
            const matchesSearch = (company.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (company.description || '').toLowerCase().includes(search.toLowerCase());
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
    }, [companies, search, sectorFilter, stageFilter, sortConfig]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, sectorFilter, stageFilter, sortConfig]);

    const requestSort = (key: keyof Company) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const toggleRow = (id: string) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRows(newSelected);
    };

    const toggleAll = () => {
        if (selectedRows.size === filteredCompanies.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(filteredCompanies.map(c => c.id)));
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-[var(--color-score-high)]';
        if (score >= 50) return 'text-[var(--color-score-mid)]';
        return 'text-[var(--color-score-low)]';
    };

    // Helper to generate consistent fake scores since it's not in the mock DB yet
    // Convert string ID to number for arithmetic, fallback to 1 if NaN
    const getMockScore = (idStr: string) => {
        const idNum = parseInt(idStr) || parseInt(idStr.substring(0, 8), 16) || 1;
        return 40 + (idNum * 17) % 60;
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="font-display text-[28px] text-primary tracking-tight">Companies</h1>
                    <p className="font-mono text-[12px] text-muted">{filteredCompanies.length} companies · last synced 2 min ago</p>
                </div>
                <button onClick={loadCompanies} className="btn-ghost gap-2">
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-subtle border border-default p-4 rounded-xl flex items-center justify-between animate-in fade-in">
                    <span className="text-[14px] text-primary font-medium">Could not load companies from ProductHunt.</span>
                    <button onClick={loadCompanies} className="text-[13px] bg-white border border-strong px-3 py-1.5 rounded-lg hover:border-black transition-editorial font-bold text-primary shadow-sm">
                        Try again
                    </button>
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Simplified pill selects for demo */}
                    <div className="relative">
                        <select
                            className={cn(
                                "appearance-none bg-card border border-default rounded-full px-4 py-1.5 text-[13px] text-primary focus:outline-none focus:border-accent cursor-pointer pr-8 transition-editorial",
                                stageFilter !== 'All' && "bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent)]"
                            )}
                            value={stageFilter}
                            onChange={(e) => setStageFilter(e.target.value)}
                        >
                            <option value="All">Stage</option>
                            {stages.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-3 w-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            className={cn(
                                "appearance-none bg-card border border-default rounded-full px-4 py-1.5 text-[13px] text-primary focus:outline-none focus:border-accent cursor-pointer pr-8 transition-editorial",
                                sectorFilter !== 'All' && "bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent)]"
                            )}
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                        >
                            <option value="All">Sector</option>
                            {sectors.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-3 w-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {(stageFilter !== 'All' || sectorFilter !== 'All') && (
                    <button
                        onClick={() => { setStageFilter('All'); setSectorFilter('All'); }}
                        className="text-[13px] text-muted hover:text-primary transition-editorial"
                    >
                        Reset filters
                    </button>
                )}
            </div>

            {/* Entity Table (No card wrapper, directly on bg) */}
            <div className="w-full relative overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="py-3 px-2 border-b-2 border-default w-10">
                                <input
                                    type="checkbox"
                                    className="rounded border-strong text-accent focus:ring-accent w-4 h-4 cursor-pointer"
                                    checked={selectedRows.size === filteredCompanies.length && filteredCompanies.length > 0}
                                    onChange={toggleAll}
                                />
                            </th>
                            <th className="py-3 pr-4 border-b-2 border-default">
                                <button onClick={() => requestSort('name')} className="text-[11px] uppercase tracking-wide text-muted font-medium flex items-center gap-1 group">
                                    Company
                                    {sortConfig?.key === 'name' && (
                                        <span className="text-accent">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </button>
                            </th>
                            <th className="py-3 px-4 border-b-2 border-default text-[11px] uppercase tracking-wide text-muted font-medium">Sector</th>
                            <th className="py-3 px-4 border-b-2 border-default text-[11px] uppercase tracking-wide text-muted font-medium">Stage</th>
                            <th className="py-3 px-4 border-b-2 border-default text-[11px] uppercase tracking-wide text-muted font-medium text-right">Thesis Score</th>
                            <th className="py-3 px-4 border-b-2 border-default text-[11px] uppercase tracking-wide text-muted font-medium text-right">Last Enriched</th>
                            <th className="py-3 pl-4 border-b-2 border-default w-24"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <>
                                {[...Array(8)].map((_, i) => (
                                    <tr key={i} className="border-b border-default h-[48px]">
                                        <td className="px-2"><div className="w-4 h-4 bg-subtle rounded animate-pulse" /></td>
                                        <td className="pr-4 py-2"><div className="h-4 w-3/4 bg-subtle rounded animate-pulse" /></td>
                                        <td className="px-4 py-2"><div className="h-4 w-1/2 bg-subtle rounded animate-pulse" /></td>
                                        <td className="px-4 py-2"><div className="h-4 w-16 bg-subtle rounded-full animate-pulse z-10" /></td>
                                        <td className="px-4 py-2"><div className="h-4 w-8 bg-subtle rounded ml-auto animate-pulse" /></td>
                                        <td className="px-4 py-2"><div className="h-4 w-12 bg-subtle rounded ml-auto animate-pulse" /></td>
                                        <td className="pl-4 py-2"></td>
                                    </tr>
                                ))}
                            </>
                        ) : (() => {
                            const startIndex = (currentPage - 1) * itemsPerPage;
                            const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

                            return paginatedCompanies.map((company) => {
                                const isSelected = selectedRows.has(company.id);
                                const score = getMockScore(company.id);

                                return (
                                    <tr key={company.id} className="group hover:bg-subtle transition-editorial border-b border-default h-[48px]">
                                        <td className="px-2">
                                            <div className={cn("flex items-center justify-center opacity-100 transition-opacity", isSelected && "opacity-100")}>
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-strong text-accent focus:ring-accent w-4 h-4 cursor-pointer"
                                                    checked={isSelected}
                                                    onChange={() => toggleRow(company.id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="pr-4 py-2">
                                            <Link href={`/companies/${company.id}`} className="flex items-center gap-3">
                                                <div className="h-4 w-4 rounded-sm bg-strong flex items-center justify-center text-[8px] font-bold text-white shrink-0">
                                                    {company.name[0]}
                                                </div>
                                                <div className="flex flex-col min-w-0 max-w-[240px]">
                                                    <span className="text-[14px] font-semibold text-primary truncate" title={company.name}>{company.name}</span>
                                                    <span className="text-[12px] text-muted truncate" title={company.website || ''}>{(company.website || '').replace('https://', '')}</span>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="text-[13px] text-secondary">
                                                {company.sector}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-mono border",
                                                company.stage === 'Seed' ? "bg-[var(--color-amber-light)] text-[var(--color-amber)] border-[var(--color-amber-light)]" :
                                                    company.stage.startsWith('Series A') ? "bg-[var(--color-accent-light)] text-[var(--color-accent)] border-[var(--color-accent-light)]" :
                                                        "bg-subtle text-muted border-default"
                                            )}>
                                                {company.stage}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <span className={cn("font-mono text-[13px] font-bold", getScoreColor(score))}>
                                                {score}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <span className="font-mono text-[12px] text-muted">
                                                {selectedRows.size % 3 === 0 ? 'Never' : `${company.id.length % 5 + 1}d ago`}
                                            </span>
                                        </td>
                                        <td className="pl-4 py-2 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-secondary hover:text-primary hover:bg-black/5 rounded transition-editorial">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 text-secondary hover:text-primary hover:bg-black/5 rounded transition-editorial">
                                                    <Bookmark className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 text-secondary hover:text-primary hover:bg-black/5 rounded transition-editorial">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        })()}
                        {!loading && filteredCompanies.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-16 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <h3 className="font-display italic text-2xl text-primary">No companies found</h3>
                                        <p className="text-[14px] text-secondary">Try adjusting your filters or search query.</p>
                                        <button className="btn-primary mt-4">Clear Filters</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredCompanies.length > 0 && (
                <div className="flex items-center justify-center gap-6 pt-8">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="text-[13px] text-secondary hover:text-primary transition-editorial disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ← Previous
                    </button>
                    <span className="text-[13px] text-muted">Page {currentPage} of {Math.ceil(filteredCompanies.length / itemsPerPage)}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredCompanies.length / itemsPerPage), p + 1))}
                        disabled={currentPage >= Math.ceil(filteredCompanies.length / itemsPerPage)}
                        className="text-[13px] text-secondary hover:text-primary transition-editorial disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Bulk Actions Bar */}
            {selectedRows.size > 0 && (
                <div className="fixed bottom-8 left-[calc(220px+50%)] -translate-x-1/2 bg-[#1A1916] text-white px-4 py-3 rounded-xl shadow-card-md flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-200">
                    <span className="text-[14px] font-medium">{selectedRows.size} selected</span>
                    <div className="h-4 w-[1px] bg-[#3A3936]" />
                    <button className="text-[14px] text-white hover:text-gray-300 transition-editorial">Save to List</button>
                    <button className="text-[14px] text-white hover:text-gray-300 transition-editorial">Export</button>
                    <div className="h-4 w-[1px] bg-[#3A3936]" />
                    <button onClick={() => setSelectedRows(new Set())} className="text-[14px] text-gray-400 hover:text-white transition-editorial">Clear</button>
                </div>
            )}
        </div>
    );
}
