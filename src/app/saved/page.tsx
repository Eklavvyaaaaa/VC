'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Clock,
    ArrowRight,
    Trash2,
    Play,
    Filter,
    ExternalLink,
    Terminal,
    MapPin,
    Zap
} from 'lucide-react';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/storage';
import { SavedSearch } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function SavedSearchesPage() {
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

    useEffect(() => {
        const saved = getFromStorage<SavedSearch[]>(STORAGE_KEYS.SAVED_SEARCHES, []);
        setSavedSearches(saved);
    }, []);

    const deleteSearch = (id: string) => {
        const updated = savedSearches.filter(s => s.id !== id);
        setSavedSearches(updated);
        setToStorage(STORAGE_KEYS.SAVED_SEARCHES, updated);
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Saved Queries</h1>
                <p className="text-sm text-neutral-muted">Reusable discovery filters and automated signals.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {savedSearches.length > 0 ? (
                    savedSearches.map((search) => (
                        <div key={search.id} className="content-card flex items-center justify-between hover:border-primary-border transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="h-10 w-10 rounded-xl bg-neutral-soft border border-neutral-border flex items-center justify-center text-neutral-muted group-hover:text-primary-foreground group-hover:border-primary-border transition-all">
                                    <Terminal className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-foreground">{search.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            {Object.entries(search.filters).map(([key, value]) => value && (
                                                <span key={key} className="bg-neutral-soft text-neutral-muted px-2 py-0.5 rounded text-[10px] font-bold border border-neutral-border uppercase tracking-tight">
                                                    {key}: {value}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="h-3 w-[1px] bg-neutral-border" />
                                        <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-widest flex items-center gap-1">
                                            <Clock className="h-2.5 w-2.5" />
                                            {new Date(search.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/companies?${new URLSearchParams(search.filters as Record<string, string>).toString()}`}
                                    className="btn-secondary py-1.5 px-4 text-[11px] font-bold flex items-center gap-2 group/btn"
                                >
                                    <Play className="h-3 w-3 fill-neutral-muted group-hover/btn:fill-foreground transition-all" />
                                    Execute
                                </Link>
                                <button
                                    onClick={() => deleteSearch(search.id)}
                                    title="Delete Query"
                                    className="p-2 text-neutral-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="content-card border-dashed py-20 text-center space-y-6">
                        <div className="h-16 w-16 rounded-full bg-neutral-soft mx-auto flex items-center justify-center">
                            <Zap className="h-8 w-8 text-neutral-muted opacity-20" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-foreground">No saved queries</h3>
                            <p className="text-xs text-neutral-muted max-w-sm mx-auto">Save your complex filters from the discovery hub to monitor new entities automatically.</p>
                        </div>
                        <Link
                            href="/companies"
                            className="btn-secondary py-2 px-8 text-[11px] font-bold uppercase tracking-widest"
                        >
                            Open Hub
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
