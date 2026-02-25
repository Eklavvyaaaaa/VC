'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Building2,
    Globe,
    MapPin,
    Calendar,
    Users,
    Zap,
    Plus,
    FileText,
    ArrowLeft,
    Check,
    Save,
    ExternalLink,
    Clock,
    Sparkles,
    ShieldCheck,
    Search,
    ChevronRight,
    Loader2,
    Link as LinkIcon,
    AlertCircle
} from 'lucide-react';
import { MOCK_COMPANIES } from '@/lib/data';
import { Company, EnrichmentData } from '@/types';
import { cn } from '@/lib/utils';
import { getFromStorage, setToStorage, STORAGE_KEYS } from '@/lib/storage';

export default function CompanyProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [company, setCompany] = useState<Company | null>(null);
    const [enrichment, setEnrichment] = useState<EnrichmentData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isEnriching, setIsEnriching] = useState(false);
    const [note, setNote] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const found = MOCK_COMPANIES.find(c => c.id === id);
        if (found) {
            setCompany(found);
            const cached = getFromStorage<EnrichmentData | null>(`${STORAGE_KEYS.CACHED_ENRICHMENT_PREFIX}${id}`, null);
            if (cached) setEnrichment(cached);
            const savedNote = getFromStorage<string>(`${STORAGE_KEYS.NOTES_PREFIX}${id}`, '');
            if (savedNote) setNote(savedNote);
            const savedList = getFromStorage<string[]>(STORAGE_KEYS.SAVED_COMPANIES, []) || [];
            setIsSaved(savedList.includes(id as string));
        }
    }, [id]);

    const handleSaveNote = () => {
        setIsSaving(true);
        setTimeout(() => {
            setToStorage(`${STORAGE_KEYS.NOTES_PREFIX}${id}`, note);
            setIsSaving(false);
        }, 600);
    };

    const toggleSaveCompany = () => {
        const savedList = getFromStorage<string[]>(STORAGE_KEYS.SAVED_COMPANIES, []) || [];
        let newList;
        if (isSaved) {
            newList = savedList.filter(companyId => companyId !== id);
        } else {
            newList = [...savedList, id as string];
        }
        setToStorage(STORAGE_KEYS.SAVED_COMPANIES, newList);
        setIsSaved(!isSaved);
    };

    const handleEnrich = async () => {
        if (!company) return;
        setIsEnriching(true);
        try {
            const resp = await fetch('/api/enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    website: company.website,
                    companyName: company.name,
                    companyDescription: company.description
                })
            });

            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error || 'Enrichment failed');

            setEnrichment(data);
            setToStorage(`${STORAGE_KEYS.CACHED_ENRICHMENT_PREFIX}${id}`, data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsEnriching(false);
        }
    };

    if (!company) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <Loader2 className="h-6 w-6 text-neutral-muted animate-spin" />
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-widest">Locating Entity...</p>
        </div>
    );

    return (
        <div className="space-y-10">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-[11px] font-bold text-neutral-muted hover:text-foreground transition-all uppercase tracking-widest"
                >
                    <ArrowLeft className="h-3 w-3" />
                    Back to Workspace
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleSaveCompany}
                        className={cn(
                            "btn-secondary flex items-center gap-2 py-1.5",
                            isSaved && "bg-emerald-50 text-emerald-700 border-emerald-100"
                        )}
                    >
                        {isSaved ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        {isSaved ? 'In Pipeline' : 'Track Entity'}
                    </button>
                    <button
                        onClick={handleEnrich}
                        disabled={isEnriching}
                        className="btn-primary flex items-center gap-2 py-1.5"
                    >
                        {isEnriching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                        AI Research
                    </button>
                </div>
            </div>

            {/* Entity Header */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="h-20 w-20 rounded-xl bg-neutral-soft border border-neutral-border flex items-center justify-center text-2xl font-bold text-neutral-muted shrink-0">
                    {company.name[0]}
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{company.name}</h1>
                        <span className="badge-lavender">{company.stage}</span>
                    </div>
                    <p className="text-[15px] text-neutral-muted leading-relaxed max-w-3xl">
                        {company.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 pt-1">
                        <a href={company.website} target="_blank" className="flex items-center gap-2 text-xs font-bold text-primary-foreground hover:underline">
                            <LinkIcon className="h-3.5 w-3.5" />
                            {company.website.replace('https://', '')}
                        </a>
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-muted">
                            <MapPin className="h-3.5 w-3.5" />
                            {company.location}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-muted">
                            <Building2 className="h-3.5 w-3.5" />
                            {company.sector}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Insights Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between border-b border-neutral-border pb-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                            Venture Intelligence
                        </h2>
                        {enrichment && (
                            <span className="text-[10px] font-bold text-neutral-muted uppercase tracking-widest flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                Updated {new Date(enrichment.timestamp).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {!enrichment && !isEnriching ? (
                        <div className="content-card border-dashed border-2 py-16 text-center space-y-4">
                            <div className="h-12 w-12 rounded-full bg-neutral-soft mx-auto flex items-center justify-center">
                                <Zap className="h-5 w-5 text-neutral-muted opacity-40" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-foreground">Extract Precision Signals</h3>
                                <p className="text-xs text-neutral-muted max-w-sm mx-auto">Analyze website metadata and technical footprints to generate deep intelligence.</p>
                            </div>
                            <button onClick={handleEnrich} className="btn-secondary text-[11px] font-bold px-6">Start Engine</button>
                        </div>
                    ) : isEnriching ? (
                        <div className="content-card py-20 flex flex-col items-center justify-center gap-4 border-dashed">
                            <Loader2 className="h-6 w-6 text-primary-foreground animate-spin" />
                            <p className="text-[11px] font-bold text-neutral-muted uppercase tracking-widest animate-pulse">Running signal extraction...</p>
                        </div>
                    ) : (enrichment && (
                        <div className="space-y-8">
                            <div className="content-card bg-primary/30 border-primary-border">
                                <p className="text-[15px] font-medium text-foreground leading-relaxed italic">
                                    "{enrichment.summary}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-muted">Core Thesis</h3>
                                    <ul className="space-y-3">
                                        {enrichment.whatTheyDo.map((item, i) => (
                                            <li key={i} className="flex gap-3 text-xs text-neutral-muted leading-relaxed">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary-border shrink-0 mt-1.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-muted">Proprietary Signals</h3>
                                    <div className="space-y-2">
                                        {enrichment.derivedSignals.map((signal, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white border border-neutral-border p-3 rounded-lg group hover:border-primary-border transition-all">
                                                <span className="text-xs font-bold text-foreground">{signal}</span>
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-muted">Workspace Keywords</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {enrichment.keywords.map((tag, i) => (
                                        <span key={i} className="bg-neutral-soft text-[10px] font-bold text-neutral-muted px-2 py-1 rounded border border-neutral-border group hover:border-primary-border hover:bg-white transition-all cursor-default">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Internal Side Panel */}
                <div className="space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">Operational Data</h2>
                        <div className="content-card p-0 divide-y divide-neutral-border overflow-hidden">
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-xs text-neutral-muted flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5" />
                                    Headcount
                                </span>
                                <span className="text-xs font-bold text-foreground">50-100</span>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-xs text-neutral-muted flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Founded
                                </span>
                                <span className="text-xs font-bold text-foreground">2021</span>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-xs text-neutral-muted flex items-center gap-2">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Compliance
                                </span>
                                <span className="text-xs font-bold text-emerald-600">Verified</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">Research Diary</h2>
                            <FileText className="h-3 w-3 text-neutral-muted" />
                        </div>
                        <div className="space-y-3">
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add investment thesis or team feedback..."
                                className="input-calm w-full min-h-[200px] py-4 leading-relaxed resize-none"
                            />
                            <button
                                onClick={handleSaveNote}
                                disabled={isSaving}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                {isSaving ? 'Synching...' : 'Commit Notes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
