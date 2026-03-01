'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Check,
    ExternalLink,
    Clock,
    Link as LinkIcon,
    Copy,
    Download,
    Zap
} from 'lucide-react';
import { Company, EnrichmentData, CompanyList } from '@/types';
import { cn } from '@/lib/utils';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/storage';

export default function CompanyProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [company, setCompany] = useState<Company | null>(null);
    const [loadingCompany, setLoadingCompany] = useState(true);
    const [enrichment, setEnrichment] = useState<EnrichmentData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isEnriching, setIsEnriching] = useState(false);
    const [note, setNote] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'signals' | 'notes'>('overview');
    const [selectedList, setSelectedList] = useState<string>('default');
    const [lists, setLists] = useState<CompanyList[]>([]);
    const [isCopied, setIsCopied] = useState(false);
    const [enrichStatus, setEnrichStatus] = useState<'idle' | 'loading' | 'success' | 'cached' | 'error'>('idle');

    useEffect(() => {
        // Hydrate dynamic lists on mount
        const savedLists = getFromStorage<CompanyList[]>(STORAGE_KEYS.LISTS, []) || [];
        setLists(savedLists);
    }, []);

    useEffect(() => {
        if (!id) return;
        // Dynamically toggle the "Saved" checkmark state when changing the pipeline dropdown
        if (selectedList === 'default') {
            const savedList = getFromStorage<string[]>(STORAGE_KEYS.SAVED_COMPANIES, []) || [];
            setIsSaved(savedList.includes(id as string));
        } else {
            const allLists = getFromStorage<CompanyList[]>(STORAGE_KEYS.LISTS, []) || [];
            const currentList = allLists.find(l => l.id === selectedList);
            setIsSaved(currentList ? currentList.companyIds.includes(id as string) : false);
        }
    }, [selectedList, id]);

    useEffect(() => {
        const fetchCompany = async () => {
            setLoadingCompany(true);
            try {
                const res = await fetch('/api/companies');
                const data = await res.json();
                if (data.companies) {
                    const found = data.companies.find((c: Company) => String(c.id) === String(id));
                    if (found) {
                        setCompany(found);

                        // Push to recently viewed feature
                        try {
                            const stored = localStorage.getItem('recentlyViewed');
                            const existing = stored ? JSON.parse(stored) : [];
                            const filtered = existing.filter((c: any) => c.id !== found.id);
                            const updated = [
                                { ...found, viewedAt: new Date().toISOString() },
                                ...filtered
                            ].slice(0, 5);
                            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
                        } catch (e) {
                            console.error('Failed to update recentlyViewed', e);
                        }
                        const cached = getFromStorage<EnrichmentData | null>(`${STORAGE_KEYS.CACHED_ENRICHMENT_PREFIX}${id}`, null);
                        if (cached) {
                            setEnrichment(cached);
                            setEnrichStatus('cached');
                        }
                        const savedNote = getFromStorage<string>(`${STORAGE_KEYS.NOTES_PREFIX}${id}`, '');
                        if (savedNote) setNote(savedNote);
                        const savedList = getFromStorage<string[]>(STORAGE_KEYS.SAVED_COMPANIES, []) || [];
                        if (selectedList === 'default') {
                            setIsSaved(savedList.includes(id as string));
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingCompany(false);
            }
        };
        fetchCompany();
    }, [id]);

    const handleSaveNote = () => {
        if (!note.trim()) return;
        setIsSaving(true);
        setTimeout(() => {
            setToStorage(`${STORAGE_KEYS.NOTES_PREFIX}${id}`, note);
            setIsSaving(false);
            setNote('');
            // Toast logic would go here
        }, 300);
    };

    const toggleSaveCompany = () => {
        if (selectedList === 'default') {
            const savedList = getFromStorage<string[]>(STORAGE_KEYS.SAVED_COMPANIES, []) || [];
            let newList;
            if (isSaved) {
                newList = savedList.filter(companyId => companyId !== id);
            } else {
                newList = [...savedList, id as string];
            }
            setToStorage(STORAGE_KEYS.SAVED_COMPANIES, newList);
            setIsSaved(!isSaved);
        } else {
            const allLists = getFromStorage<CompanyList[]>(STORAGE_KEYS.LISTS, []) || [];
            const listIndex = allLists.findIndex(l => l.id === selectedList);
            if (listIndex >= 0) {
                const currentList = allLists[listIndex];
                if (isSaved) {
                    currentList.companyIds = currentList.companyIds.filter(companyId => companyId !== id);
                } else {
                    currentList.companyIds.push(id as string);
                }
                allLists[listIndex] = currentList;
                setToStorage(STORAGE_KEYS.LISTS, allLists);
                setLists(allLists);
                setIsSaved(!isSaved);
            }
        }
    };

    const handleCopyUrl = async () => {
        if (!company?.website) return;
        try {
            await navigator.clipboard.writeText(company.website);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleEnrich = async () => {
        if (!company) return;
        setIsEnriching(true);
        setEnrichStatus('loading');
        try {
            const resp = await fetch('/api/enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: company.website,
                    companyId: company.id
                })
            });

            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || 'Enrichment failed');

            setEnrichment(data);
            setToStorage(`${STORAGE_KEYS.CACHED_ENRICHMENT_PREFIX}${id}`, data);
            setEnrichStatus('success');
        } catch (err) {
            console.error(err);
            setEnrichStatus('error');
        } finally {
            setIsEnriching(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-[var(--color-score-high)]';
        if (score >= 50) return 'text-[var(--color-score-mid)]';
        return 'text-[var(--color-score-low)]';
    };

    if (loadingCompany) {
        return (
            <div className="space-y-8 pb-16 flex flex-col items-center justify-center pt-32">
                <div className="flex gap-2 items-center">
                    <span className="h-2 w-2 bg-muted rounded-full animate-pulse" />
                    <span className="h-2 w-2 bg-muted rounded-full animate-pulse delay-75" />
                    <span className="h-2 w-2 bg-muted rounded-full animate-pulse delay-150" />
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="space-y-8 pb-16 flex flex-col items-center justify-center pt-32 animate-in fade-in duration-300">
                <h2 className="font-display italic text-[24px] text-primary mb-2">Company not found</h2>
                <p className="text-[14px] text-secondary mb-6">The company you're looking for doesn't exist or isn't available.</p>
                <button
                    onClick={() => router.push('/companies')}
                    className="flex items-center gap-2 text-[14px] font-medium text-secondary hover:text-primary transition-editorial bg-white px-5 py-2.5 rounded-xl border border-default shadow-sm hover:border-strong"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Companies
                </button>
            </div>
        );
    }

    // Helper to generate consistent fake scores since it's not in the mock DB yet
    // Convert part of the string ID to a number for the mock score calculation
    const numericIdPart = parseInt(company.id.substring(0, 8), 16) || 1;
    const mockScore = 40 + (numericIdPart * 17) % 60;

    // Mock signals for the timeline tab based on the original data + some extras
    const mockSignals = enrichment ? [
        { type: 'AI', text: enrichment.summary.substring(0, 60) + '...', date: new Date(enrichment.timestamp || Date.now()).toISOString() },
        ...(enrichment.derivedSignals || []).map((s, i) => ({ type: ['hiring', 'funding', 'product', 'press'][i % 4], text: s, date: new Date(Date.now() - (i + 1) * 86400000).toISOString() }))
    ] : [
        { type: 'press', text: 'Blog post detected: "Scaling Infrastructure"', date: '2024-02-10T00:00:00.000Z' },
        { type: 'product', text: 'New feature launched', date: '2024-01-15T00:00:00.000Z' },
        { type: 'hiring', text: 'Hiring spike (Engineering)', date: '2023-11-20T00:00:00.000Z' }
    ];

    return (
        <div className="space-y-8 pb-16">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1 text-[13px] font-medium text-secondary hover:text-primary transition-editorial w-max"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
            </button>

            {/* 65 / 35 Layout translated to 8/4 Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 items-start gap-12">

                {/* Left Column (Approx 66%) */}
                <div className="xl:col-span-8 min-w-0 space-y-10">

                    {/* Header Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-lg bg-strong flex items-center justify-center font-bold text-white shrink-0 text-sm shadow-card-sm">
                                    {company.name[0]}
                                </div>
                                <h1 className="font-display text-[32px] text-primary tracking-tight leading-none flex items-center gap-3">
                                    {company.name}
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-editorial pt-1">
                                        <ExternalLink className="h-5 w-5" />
                                    </a>
                                </h1>
                            </div>

                            {/* Thesis Score Block */}
                            <div className="flex flex-col items-end">
                                <span className="font-mono text-[11px] uppercase tracking-wide text-muted">Thesis Match</span>
                                <div className="flex items-baseline gap-1">
                                    <span className={cn("font-mono text-[32px] font-bold leading-none tracking-tight", getScoreColor(mockScore))}>
                                        {mockScore}
                                    </span>
                                    <span className="font-mono text-[14px] text-muted">/100</span>
                                </div>
                                <span className="font-mono text-[10px] text-muted mt-1.5 px-2 py-0.5 rounded border border-default bg-subtle">
                                    Match score: {mockScore}% — {(mockScore % 3) + 2} thesis keywords matched
                                </span>
                            </div>
                        </div>

                        <p className="text-[15px] font-medium text-secondary max-w-2xl leading-relaxed">
                            {company.description}
                        </p>

                        {/* Meta Chips */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            {[
                                { label: 'Stage', val: company.stage },
                                { label: 'Sector', val: company.sector },
                                { label: 'HQ', val: company.location }
                            ].map((meta, i) => (
                                <div key={i} className="flex items-center px-2.5 py-1.5 rounded-lg border border-default bg-card text-[12px] font-mono shadow-sm">
                                    <span className="text-muted mr-2">{meta.label}</span>
                                    <span className="text-primary font-medium">{meta.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 border-b border-default">
                            {(['overview', 'signals', 'notes'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "pb-3 text-[14px] font-medium capitalize transition-editorial relative",
                                        activeTab === tab ? "text-primary" : "text-muted hover:text-secondary"
                                    )}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Contents */}
                        <div className="min-h-[300px]">

                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div className="space-y-3 lg:pr-12">
                                        <p className="text-[15px] text-primary leading-[1.7]">
                                            {company.name} operates in the {company.sector} sector, primarily focused on scaling their {company.stage} operations. Their recent traction indicates strong product-market fit within the {company.location} tech ecosystem.
                                            {enrichment && ` As analyzed recently, ${enrichment.summary.toLowerCase()}`}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-display italic text-[22px] text-primary">Why this matches your thesis</h3>
                                        <div className="space-y-3">
                                            {[
                                                { text: `High conviction in ${company.sector} infrastructure`, keywords: [company.sector, 'infrastructure'], weight: 'High' },
                                                { text: `${company.stage} valuation aligns with Fund II targets`, keywords: [company.stage, 'Fund II'], weight: 'Medium' },
                                                { text: `Strong founder background (signal intent)`, keywords: ['founder bias'], weight: 'High' },
                                                { text: `${company.location} is a priority geo`, keywords: [company.location], weight: 'Low' }
                                            ].map((point, i) => (
                                                <div key={i} className="flex flex-col gap-2 p-3.5 rounded-lg border border-default bg-card shadow-sm">
                                                    <div className="flex items-start gap-3">
                                                        <Check className="h-4 w-4 text-accent shrink-0 mt-[2px]" />
                                                        <span className="text-[14px] text-secondary leading-relaxed">{point.text}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between pl-7 border-t border-default pt-2 mt-1">
                                                        <div className="flex gap-1.5 flex-wrap">
                                                            {point.keywords.map(kw => (
                                                                <span key={kw} className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded text-muted bg-subtle border border-default">
                                                                    {kw}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] uppercase font-mono text-muted flex items-center gap-1">
                                                            Weight: <span className={cn(
                                                                point.weight === 'High' ? 'text-[var(--color-score-high)]' :
                                                                    point.weight === 'Medium' ? 'text-[var(--color-score-mid)]' :
                                                                        'text-[var(--color-score-low)]'
                                                            )}>{point.weight}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'signals' && (
                                <div className="space-y-0 relative animate-in fade-in duration-300">
                                    <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-border-strong" />
                                    {mockSignals.map((signal, i) => {
                                        const colorMap: Record<string, string> = {
                                            hiring: 'bg-[var(--color-accent)]',
                                            funding: 'bg-[var(--color-amber)]',
                                            product: 'bg-[#2563EB]', // Specific blue requested
                                            press: 'bg-[var(--color-text-muted)]',
                                            AI: 'bg-[var(--color-accent)]'
                                        };
                                        const bgColor = colorMap[signal.type] || colorMap.press;

                                        return (
                                            <div key={i} className="flex items-start gap-5 py-4 relative group">
                                                <div className={cn("h-[15px] w-[15px] rounded-full border-2 border-bg-card shrink-0 mt-[3px] relative z-10", bgColor)} />
                                                <div className="flex flex-col gap-1 w-full">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[14px] font-medium text-primary">{signal.text}</span>
                                                    </div>
                                                    <span className="font-mono text-[12px] text-muted">
                                                        {new Date(signal.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Add a note..."
                                            className="w-full bg-transparent border-none text-[15px] text-primary placeholder:text-muted focus:ring-0 resize-y min-h-[100px] font-sans"
                                        />
                                        <div className="flex justify-end pt-2 border-t border-default">
                                            <button
                                                onClick={handleSaveNote}
                                                disabled={isSaving || !note.trim()}
                                                className="btn-primary disabled:opacity-50"
                                            >
                                                {isSaving ? 'Saving...' : 'Save Note'}
                                            </button>
                                        </div>
                                    </div>
                                    {getFromStorage<string>(`${STORAGE_KEYS.NOTES_PREFIX}${id}`, '') && (
                                        <div className="p-5 rounded-xl border border-default bg-card shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[13px] font-semibold text-primary">Me</span>
                                                <span className="font-mono text-[11px] text-muted">Saved note</span>
                                            </div>
                                            <p className="text-[14px] text-secondary whitespace-pre-wrap leading-relaxed">
                                                {getFromStorage<string>(`${STORAGE_KEYS.NOTES_PREFIX}${id}`, '')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                </div>

                {/* Right Column (Approx 33%) - Sticky Panel */}
                <div className="xl:col-span-4 space-y-6 sticky top-8">

                    {/* Enrichment Card */}
                    <div className="border border-default bg-card rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-display text-[20px] text-primary">Enrichment</h3>
                            {enrichStatus === 'success' && (
                                <span className="font-mono text-[11px] text-muted flex items-center gap-1">
                                    <Check className="h-3 w-3 text-accent" /> Success
                                </span>
                            )}
                            {enrichStatus === 'cached' && (
                                <span className="font-mono text-[11px] text-muted flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted" /> Cached
                                </span>
                            )}
                            {enrichStatus === 'error' && (
                                <span className="font-mono text-[11px] text-[var(--color-score-low)] flex items-center gap-1">
                                    <Zap className="h-3 w-3" /> Failed
                                </span>
                            )}
                        </div>

                        {enrichStatus === 'idle' || enrichStatus === 'error' ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                                <Zap className={cn("h-8 w-8 stroke-[1.5]", enrichStatus === 'error' ? "text-[var(--color-score-low)]" : "text-muted")} />
                                <p className="text-[14px] text-secondary">
                                    {enrichStatus === 'error' ? "Enrichment pipeline failed." : (!company.website ? "Cannot enrich without a valid website source." : "No enrichment data yet")}
                                </p>
                                <button
                                    onClick={handleEnrich}
                                    disabled={!company.website}
                                    className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {enrichStatus === 'error' ? "Retry Enrichment" : "Enrich Company"}
                                </button>
                            </div>
                        ) : enrichStatus === 'loading' ? (
                            <div className="space-y-4 py-2">
                                <div className="h-3 bg-subtle rounded-full w-full animate-pulse" />
                                <div className="h-3 bg-subtle rounded-full w-[90%] animate-pulse" />
                                <div className="h-3 bg-subtle rounded-full w-[75%] animate-pulse" />
                            </div>
                        ) : enrichment ? (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="space-y-2">
                                    <h4 className="font-mono text-[11px] uppercase tracking-wide text-muted">Summary</h4>
                                    <p className="text-[13px] text-primary leading-relaxed">
                                        {enrichment?.summary}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-mono text-[11px] uppercase tracking-wide text-muted">What They Do</h4>
                                    <ul className="space-y-1.5 pt-1">
                                        {enrichment?.whatTheyDo.map((item, i) => (
                                            <li key={i} className="text-[13px] text-secondary flex items-start gap-2 leading-relaxed">
                                                <span className="text-muted mt-0.5">•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-mono text-[11px] uppercase tracking-wide text-muted">Keywords</h4>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {enrichment?.keywords.map(tag => (
                                            <span key={tag} className="px-2 py-1 border border-default rounded-md text-[11px] font-mono text-secondary bg-subtle">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-default">
                                    <h4 className="font-mono text-[11px] uppercase tracking-wide text-muted">Sources</h4>
                                    <div className="flex items-center gap-2 pt-1">
                                        <LinkIcon className="h-3 w-3 text-muted" />
                                        <a href={company.website} target="_blank" className="font-mono text-[11px] text-accent hover:underline truncate">
                                            {company.website}
                                        </a>
                                    </div>
                                    <div className="font-mono text-[10px] text-muted">
                                        Scraped {new Date(enrichment!.timestamp || Date.now()).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Save to List Card */}
                    <div className="border border-default bg-card rounded-xl p-6 shadow-sm space-y-4">
                        <h3 className="font-display text-[20px] text-primary">Save to List</h3>
                        <div className="space-y-3">
                            <select
                                value={selectedList}
                                onChange={(e) => setSelectedList(e.target.value)}
                                className="input-editorial w-full"
                            >
                                <option value="default">Default Pipeline</option>
                                {lists.map(list => (
                                    <option key={list.id} value={list.id}>{list.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={toggleSaveCompany}
                                className={cn(
                                    "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[14px] font-medium transition-editorial border",
                                    isSaved
                                        ? "bg-bg-subtle text-primary border-default"
                                        : "bg-primary text-white border-primary hover:bg-black"
                                )}
                            >
                                {isSaved ? (
                                    <><Check className="h-4 w-4 text-accent" /> Saved to List</>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="border border-default bg-card rounded-xl shadow-sm overflow-hidden text-[14px] text-primary">
                        <button
                            onClick={handleCopyUrl}
                            className="w-full flex items-center justify-between px-6 py-3.5 border-b border-default hover:bg-subtle transition-editorial"
                        >
                            <span className="flex items-center gap-2">
                                {isCopied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4 text-muted" />}
                                {isCopied ? 'Copied URL!' : 'Copy URL'}
                            </span>
                        </button>
                        <button className="w-full flex items-center justify-between px-6 py-3.5 border-b border-default hover:bg-subtle transition-editorial group">
                            <span className="flex items-center gap-2"><Download className="h-4 w-4 text-muted" /> Export JSON</span>
                        </button>
                        <button disabled className="w-full flex items-center justify-between px-6 py-3.5 bg-subtle text-muted cursor-not-allowed">
                            <span className="flex items-center gap-2"><ExternalLink className="h-4 w-4 text-muted" /> Share</span>
                            <span className="font-mono text-[10px] uppercase tracking-wide">Coming soon</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
