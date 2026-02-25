'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    Download,
    Building2,
    Users,
    ChevronRight,
    PlusCircle,
    FileJson,
    FileSpreadsheet,
    Settings2,
    ArrowUpRight
} from 'lucide-react';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/storage';
import { CompanyList, Company } from '@/types';
import { MOCK_COMPANIES } from '@/lib/data';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ListsPage() {
    const [lists, setLists] = useState<CompanyList[]>([]);
    const [newListName, setNewListName] = useState('');
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        const savedLists = getFromStorage<CompanyList[]>(STORAGE_KEYS.LISTS, []);
        setLists(savedLists);
    }, []);

    const createList = () => {
        if (!newListName.trim()) return;
        const newList: CompanyList = {
            id: Math.random().toString(36).substr(2, 9),
            name: newListName,
            companyIds: [],
            createdAt: new Date().toISOString(),
        };
        const updated = [...lists, newList];
        setLists(updated);
        setToStorage(STORAGE_KEYS.LISTS, updated);
        setNewListName('');
        setShowCreate(false);
    };

    const deleteList = (id: string) => {
        const updated = lists.filter(l => l.id !== id);
        setLists(updated);
        setToStorage(STORAGE_KEYS.LISTS, updated);
    };

    const exportAsJSON = (list: CompanyList) => {
        const companies = MOCK_COMPANIES.filter(c => list.companyIds.includes(c.id));
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(companies, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${list.name.toLowerCase().replace(/\s+/g, '_')}_export.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const exportAsCSV = (list: CompanyList) => {
        const companies = MOCK_COMPANIES.filter(c => list.companyIds.includes(c.id));
        const headers = ['Name', 'Website', 'Sector', 'Stage', 'Location', 'Description'];
        const rows = companies.map(c => [
            c.name,
            c.website,
            c.sector,
            c.stage,
            c.location,
            `"${c.description.replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${list.name.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace Collections</h1>
                    <p className="text-sm text-neutral-muted">Curated segments and investment pipelines.</p>
                </div>
                {!showCreate && (
                    <button
                        onClick={() => setShowCreate(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create Collection
                    </button>
                )}
            </div>

            {showCreate && (
                <div className="content-card border-primary-border bg-primary/20 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-4">
                        <input
                            autoFocus
                            className="flex-1 bg-white border border-neutral-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            placeholder="e.g. Series A Fintech 2024"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && createList()}
                        />
                        <button onClick={createList} className="btn-primary py-2 px-6">Confirm</button>
                        <button onClick={() => setShowCreate(false)} className="btn-secondary py-2 px-6">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {lists.length > 0 ? (
                    lists.map((list) => (
                        <div key={list.id} className="content-card group flex flex-col hover:border-primary-border transition-all">
                            <div className="flex items-start justify-between mb-6">
                                <div className="h-10 w-10 rounded-xl bg-neutral-soft border border-neutral-border flex items-center justify-center text-neutral-muted group-hover:text-primary-foreground group-hover:border-primary-border transition-all">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => exportAsJSON(list)}
                                        title="Export JSON"
                                        className="p-1.5 text-neutral-muted hover:text-foreground hover:bg-neutral-soft rounded transition-all"
                                    >
                                        <FileJson className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={() => exportAsCSV(list)}
                                        title="Export CSV"
                                        className="p-1.5 text-neutral-muted hover:text-foreground hover:bg-neutral-soft rounded transition-all"
                                    >
                                        <FileSpreadsheet className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={() => deleteList(list.id)}
                                        title="Delete List"
                                        className="p-1.5 text-neutral-muted hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1 mb-8">
                                <h3 className="text-sm font-bold text-foreground">{list.name}</h3>
                                <p className="text-[11px] font-bold text-neutral-muted uppercase tracking-widest">
                                    {list.companyIds.length} Entities • {new Date(list.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="space-y-2 mb-8 flex-1">
                                {list.companyIds.slice(0, 3).map(compId => {
                                    const company = MOCK_COMPANIES.find(c => c.id === compId);
                                    return company ? (
                                        <Link
                                            key={compId}
                                            href={`/companies/${compId}`}
                                            className="flex items-center justify-between p-2 rounded-lg bg-neutral-soft/50 border border-transparent hover:border-neutral-border hover:bg-neutral-soft transition-all group/item"
                                        >
                                            <span className="text-[13px] font-medium text-neutral-muted group-hover/item:text-foreground">{company.name}</span>
                                            <ChevronRight className="h-3.5 w-3.5 text-neutral-muted opacity-0 group-hover/item:opacity-100 transition-all" />
                                        </Link>
                                    ) : null;
                                })}
                                {list.companyIds.length > 3 && (
                                    <p className="text-[10px] font-bold text-neutral-muted uppercase tracking-widest pl-2">
                                        + {list.companyIds.length - 3} additional signals
                                    </p>
                                )}
                                {list.companyIds.length === 0 && (
                                    <div className="py-4 text-center">
                                        <p className="text-[11px] font-medium text-neutral-muted italic">Collection is empty.</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-neutral-border flex items-center justify-between">
                                <Link
                                    href="/companies"
                                    className="text-[11px] font-bold text-primary-foreground uppercase tracking-widest flex items-center gap-2 hover:underline"
                                >
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    Add Signals
                                </Link>
                                <button className="text-[11px] font-bold text-neutral-muted hover:text-foreground transition-all uppercase tracking-widest flex items-center gap-1">
                                    Open
                                    <ArrowUpRight className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full content-card border-dashed py-20 text-center space-y-6">
                        <div className="h-16 w-16 rounded-full bg-neutral-soft mx-auto flex items-center justify-center">
                            <PlusCircle className="h-8 w-8 text-neutral-muted opacity-20" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-foreground">No segments tracked yet</h3>
                            <p className="text-xs text-neutral-muted max-w-sm mx-auto">Create a collection to organize entities by high-level thesis, sector, or deal stage.</p>
                        </div>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="btn-secondary py-2 px-8 text-[11px] font-bold uppercase tracking-widest"
                        >
                            Initialize List
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
