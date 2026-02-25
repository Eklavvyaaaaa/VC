'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Command, User, ChevronDown, Building2, ArrowRight } from 'lucide-react';
import { MOCK_COMPANIES } from '@/lib/data';
import Link from 'next/link';

export function Header() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<typeof MOCK_COMPANIES>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (query.length > 1) {
            const filtered = MOCK_COMPANIES.filter(c =>
                c.name.toLowerCase().includes(query.toLowerCase()) ||
                c.sector.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            setResults(filtered);
            setShowResults(true);
        } else {
            setResults([]);
            setShowResults(false);
        }
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-20 border-b-[1.5px] border-neutral-border bg-white flex items-center justify-between px-10 sticky top-0 z-50 w-full shadow-sm">
            <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2 text-neutral-muted">
                    <span className="text-[11px] font-bold uppercase tracking-widest">Workspace</span>
                    <span className="text-neutral-border">/</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">Discovery</span>
                </div>
            </div>

            {/* Central Search Bar */}
            <div className="flex-[2] max-w-2xl px-8" ref={searchRef}>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-muted group-focus-within:text-primary-foreground transition-colors" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length > 1 && setShowResults(true)}
                        placeholder="Search entities, sectors, or signals..."
                        className="w-full bg-neutral-soft border-[1.5px] border-neutral-border rounded-xl pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary-foreground transition-all placeholder:text-neutral-muted/50 font-medium"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border-[1.5px] border-neutral-border px-1.5 py-0.5 rounded-lg text-[10px] font-black text-neutral-muted shadow-sm group-focus-within:hidden transition-all">
                        <Command className="h-2.5 w-2.5" />
                        <span>K</span>
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-white border-[1.5px] border-neutral-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                            <div className="p-2 border-b-[1.5px] border-neutral-border bg-neutral-soft/50">
                                <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-widest px-2">Global Discovery Results</span>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto overflow-x-hidden">
                                {results.length > 0 ? (
                                    results.map((company) => (
                                        <Link
                                            key={company.id}
                                            href={`/companies/${company.id}`}
                                            onClick={() => setShowResults(false)}
                                            className="flex items-center justify-between p-3 hover:bg-primary/5 border-b border-neutral-soft last:border-0 group/item transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-neutral-soft border border-neutral-border flex items-center justify-center group-hover/item:border-primary-border group-hover/item:text-primary-foreground transition-all">
                                                    <Building2 className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground">{company.name}</span>
                                                    <span className="text-[11px] text-neutral-muted font-medium">{company.sector} • {company.location}</span>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-3.5 w-3.5 text-neutral-border group-hover/item:text-primary-foreground transition-all opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0" />
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-sm text-neutral-muted italic">No matching entities found in current universe.</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-neutral-soft/50 flex items-center justify-center">
                                <button className="text-[10px] font-bold text-primary-foreground uppercase tracking-widest hover:underline">
                                    Deep Search across 10M+ signals
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6 justify-end flex-1">
                <button className="relative p-2 rounded-lg hover:bg-neutral-soft transition-all group border border-transparent hover:border-neutral-border">
                    <Bell className="h-4 w-4 text-neutral-muted group-hover:text-foreground" />
                    <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-primary-foreground rounded-full border border-white" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l-[1.5px] border-neutral-border cursor-pointer group h-10">
                    <div className="h-9 w-9 rounded-lg bg-neutral-soft border-[1.5px] border-neutral-border flex items-center justify-center text-[11px] font-black text-neutral-muted group-hover:border-primary-border group-hover:text-primary-foreground transition-all shadow-sm">
                        EK
                    </div>
                    <ChevronDown className="h-3 w-3 text-neutral-muted group-hover:text-foreground transition-all" />
                </div>
            </div>
        </header>
    );
}
