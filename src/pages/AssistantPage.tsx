import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  analyzeRequirement,
  askServiceQuestion,
} from '../services/aiService';
import type { AIServiceResponse } from '../types';
import {
  Sparkles,
  Search,
  RotateCcw,
  CheckCircle2,
  Circle,
  Landmark,
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  FileText,
  Printer,
  Share2,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  Check,
  Shield,
  Layers,
  ListOrdered,
  FileCheck2,
  Compass,
} from 'lucide-react';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

type TabType = 'overview' | 'documents' | 'steps' | 'links' | 'videos' | 'faqs';

const AssistantPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const serviceParam = searchParams.get('service') || '';

  const [inputQuery, setInputQuery] = useState(queryParam || serviceParam);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIServiceResponse | null>(null);
  const [checkedDocuments, setCheckedDocuments] = useState<Record<string, boolean>>({});
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Follow-up question state
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpAnswers, setFollowUpAnswers] = useState<
    { question: string; answer: string }[]
  >([]);

  const performAnalysis = useCallback(
    async (queryText: string) => {
      if (!queryText.trim()) return;
      setLoading(true);
      setCheckedDocuments({});
      setFollowUpAnswers([]);

      try {
        const response = await analyzeRequirement(queryText, language);
        setResult(response);
      } catch (err) {
        console.error('Error analyzing requirement:', err);
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  // Trigger analysis when URL params change
  useEffect(() => {
    const term = serviceParam || queryParam || 'Income Certificate';
    // oxlint-disable-next-line react/set-state-in-effect
    performAnalysis(term);
  }, [queryParam, serviceParam, performAnalysis]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    setSearchParams({ q: inputQuery.trim() });
    performAnalysis(inputQuery.trim());
  };

  const handleResetSearch = () => {
    setInputQuery('');
    setSearchParams({});
    setResult(null);
    setCheckedDocuments({});
    setFollowUpAnswers([]);
  };

  const toggleDocumentCheck = (doc: string) => {
    setCheckedDocuments((prev) => ({
      ...prev,
      [doc]: !prev[doc],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `MahaSahayak - ${result?.serviceName}`,
          text: `Check out the requirements and steps for ${result?.serviceName} on MahaSahayak`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // ignore
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim() || !result) return;

    const q = followUpQuestion.trim();
    setFollowUpQuestion('');
    setFollowUpLoading(true);

    try {
      const ans = await askServiceQuestion(result.serviceName, q, language);
      setFollowUpAnswers((prev) => [...prev, { question: q, answer: ans }]);
    } catch (err) {
      console.error('Failed to answer question:', err);
    } finally {
      setFollowUpLoading(false);
    }
  };

  // Count checked documents
  const totalDocs = result?.requiredDocuments?.length || 0;
  const checkedCount =
    result?.requiredDocuments?.filter((d) => checkedDocuments[d])?.length || 0;
  const progressPercent = totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0;

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: t.overview, icon: Layers },
    { id: 'documents', label: t.requiredDocuments, icon: FileCheck2 },
    { id: 'steps', label: t.stepByStep, icon: ListOrdered },
    { id: 'links', label: t.officialLinks, icon: ExternalLink },
    { id: 'videos', label: t.videoTutorials, icon: YoutubeIcon },
    { id: 'faqs', label: t.faqs, icon: HelpCircle },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search & Query Bar with Reset Button */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0A2240]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#0A2240] hover:bg-[#163864] text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FF9933]" />
              <span>{t.searchButton}</span>
            </button>

            <button
              type="button"
              onClick={handleResetSearch}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              title={t.resetSearch}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">{t.resetSearch}</span>
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-gray-500 font-medium">{t.exampleSearches}:</span>
          {[
            'Income Certificate',
            'Caste Certificate',
            'Domicile Certificate',
            'Update Aadhaar Card',
            'Non-Creamy Layer',
            'Renew Driving Licence',
          ].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setInputQuery(sample);
                setSearchParams({ q: sample });
                performAnalysis(sample);
              }}
              className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs transition-colors cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#FF9933] animate-spin" />
            <Compass className="w-6 h-6 text-[#0A2240] absolute" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">{t.loading}</h3>
            <p className="text-xs text-gray-500">
              Consulting official Maharashtra Aaple Sarkar and Central portals...
            </p>
          </div>
        </div>
      )}

      {/* Result Dashboard */}
      {!loading && result && (
        <div className="space-y-8 animate-fadeIn">
          {/* Service Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0A2240] via-[#102e54] to-[#0A2240] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                      result.category === 'maharashtra'
                        ? 'bg-[#FF9933] text-gray-950'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    {result.category === 'maharashtra'
                      ? 'Maharashtra State (Aaple Sarkar)'
                      : 'Central Government'}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-blue-200 border border-white/10">
                    {result.department}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  {result.serviceName}
                </h1>
                {result.serviceNameLocal && result.serviceNameLocal !== result.serviceName && (
                  <p className="text-base text-amber-300 font-medium">
                    {result.serviceNameLocal}
                  </p>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
                  title="Print guidance checklist"
                >
                  <Printer className="w-4 h-4 text-[#FF9933]" />
                  <span>{t.printGuide}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                </button>

                {result.officialLinks && result.officialLinks[0] && (
                  <a
                    href={result.officialLinks[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9933] hover:bg-[#e07f1f] text-gray-950 text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <span>{t.officialPortal}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-gray-400 block text-[11px]">{t.processingTime}</span>
                <strong className="text-white text-sm">{result.processingTime}</strong>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-gray-400 block text-[11px]">{t.fees}</span>
                <strong className="text-white text-sm truncate block">{result.fees}</strong>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-gray-400 block text-[11px]">Required Documents</span>
                <strong className="text-white text-sm">
                  {result.requiredDocuments.length} Verified Papers
                </strong>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-gray-400 block text-[11px]">Source Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Official RTS Verified
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Header */}
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-thin bg-white rounded-t-2xl px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#0A2240] text-[#0A2240] bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF9933]' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'documents' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-[#0A2240]">
                      {result.requiredDocuments.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="bg-white p-6 sm:p-8 rounded-b-2xl border border-t-0 border-gray-200 shadow-sm min-h-[400px]">
            {/* TAB A: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0A2240]" />
                    <span>About this Service</span>
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {result.overview}
                  </p>
                </div>

                {/* Eligibility Conditions */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span>Who is Eligible? (पात्रता)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.eligibility.map((cond, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs sm:text-sm text-gray-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings Banner */}
                {result.warnings && result.warnings.length > 0 && (
                  <div className="pt-2">
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Important Warnings & Statutory Rules</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-xs text-amber-900">
                        {result.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB B: REQUIRED DOCUMENTS CHECKLIST */}
            {activeTab === 'documents' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Progress Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 w-full sm:w-auto">
                    <div className="text-sm font-bold text-[#0A2240]">
                      Document Preparation Tracker: {checkedCount} of {totalDocs} {t.documentsChecked}
                    </div>
                    <p className="text-xs text-gray-600">
                      Check off documents you have in hand before proceeding to the portal.
                    </p>
                  </div>
                  <div className="w-full sm:w-48 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>{progressPercent}% Ready</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {progressPercent === 100 && (
                  <div className="p-3.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>{t.allDocumentsReady}</span>
                  </div>
                )}

                {/* Checklist items */}
                <div className="space-y-2.5">
                  {result.requiredDocuments.map((doc, idx) => {
                    const isChecked = !!checkedDocuments[doc];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleDocumentCheck(doc)}
                        className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50/70 border-emerald-300 text-gray-900 shadow-xs'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-emerald-600 focus:outline-hidden"
                          aria-label={isChecked ? 'Mark unready' : 'Mark ready'}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1 text-sm font-medium">
                          <span className={isChecked ? 'line-through text-gray-500' : 'text-gray-900'}>
                            {doc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
                  <strong>Standard Maharashtra Document Upload Guidelines:</strong>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Documents must be scanned in PDF or JPEG format.</li>
                    <li>File size must be between 75KB and 256KB for Aaple Sarkar.</li>
                    <li>Photograph should be between 5KB and 50KB in width 160px × height 200px.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB C: STEP-BY-STEP PROCESS */}
            {activeTab === 'steps' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    Application Walkthrough (कसा अर्ज करावा)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Follow these verified sequential steps on the official government portal.
                  </p>
                </div>

                <div className="relative border-l-2 border-blue-200 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6 py-2">
                  {result.applicationSteps.map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Step Circle Number */}
                      <span className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-[#0A2240] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        {idx + 1}
                      </span>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/90 group-hover:border-[#0A2240]/40 group-hover:bg-white transition-all">
                        <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                          Step {idx + 1}
                        </div>
                        <p className="text-sm font-medium text-gray-800 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div className="text-xs text-blue-900">
                    <strong>Need official assistance?</strong> You can also apply through any authorized
                    Aaple Sarkar Seva Kendra (Maha e-Seva Kendra) near your home.
                  </div>
                  {result.officialLinks && result.officialLinks[0] && (
                    <a
                      href={result.officialLinks[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-[#0A2240] text-white text-xs font-bold hover:bg-[#163864] shrink-0 ml-3"
                    >
                      Open Portal &rarr;
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* TAB D: OFFICIAL LINKS */}
            {activeTab === 'links' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900">Official Government Portals</h3>
                  <p className="text-xs text-gray-500">
                    Always apply directly on official government servers ending in .gov.in or .nic.in.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.officialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-2xl bg-gray-50 hover:bg-white border border-gray-200 hover:border-[#0A2240] hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            Verified .gov.in
                          </span>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#FF9933] transition-colors" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-[#0A2240]">
                          {link.label}
                        </h4>
                        <p className="text-xs text-gray-500 break-all">{link.url}</p>
                      </div>
                      <div className="pt-4 text-xs font-semibold text-[#0A2240] group-hover:underline flex items-center gap-1">
                        <span>Visit Official Portal</span>
                        <span>&rarr;</span>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Phishing Warning:</strong> Fake portals mimicking Aaple Sarkar or UIDAI
                    exist. Ensure your browser address bar displays <strong>https://</strong> and ends
                    with <strong>.gov.in</strong> or <strong>.mahaonline.gov.in</strong> before entering
                    any personal data or OTP.
                  </div>
                </div>
              </div>
            )}

            {/* TAB E: VIDEO TUTORIALS */}
            {activeTab === 'videos' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <YoutubeIcon className="w-5 h-5 text-red-600" />
                    <span>Search-Based YouTube Tutorial Recommendations</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Watch real screen recordings of the application form filling, document upload, and fee payment.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.youtubeSearchQueries.map((query, idx) => {
                    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                      query
                    )}`;

                    return (
                      <a
                        key={idx}
                        href={searchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-red-500 hover:shadow-lg transition-all group flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                              <YoutubeIcon className="w-4 h-4" />
                              <span>YouTube Search Query</span>
                            </span>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-red-700">
                            "{query}"
                          </h4>
                          <p className="text-xs text-gray-500">
                            Click to open verified YouTube search results directly for step-by-step video tutorials.
                          </p>
                        </div>
                        <div className="pt-4 flex items-center gap-2 text-xs font-bold text-red-600 group-hover:underline">
                          <span>Search Videos on YouTube &rarr;</span>
                        </div>
                      </a>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-2">
                  <strong>Official Government YouTube Channels to Watch:</strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>UIDAI Official:</strong> Tutorials on Aadhaar PVC, Address Update, and e-KYC.
                    </li>
                    <li>
                      <strong>MahaOnline Official / Aaple Sarkar:</strong> Official walkthroughs for Revenue, Caste, and Domicile certificates.
                    </li>
                    <li>
                      <strong>Parivahan Sarathi:</strong> Driver licensing test tutorials and road signs guides.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB F: FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#0A2240]" />
                    <span>Frequently Asked Questions</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Common questions and clarifications regarding this service.
                  </p>
                </div>

                <div className="space-y-3">
                  {result.faqs.map((faq, idx) => {
                    const isExpanded = expandedFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-gray-200 overflow-hidden bg-white transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                          className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <span>{faq.question}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-500 shrink-0 ml-2" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 ml-2" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Ask AI Follow-up Question Box */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF9933]" />
                <span>{t.askFollowUp}</span>
              </h3>
              <p className="text-xs text-gray-500">
                Ask any specific query regarding documents, eligibility, or rules for {result.serviceName}.
              </p>
            </div>

            {/* Past Q&A history */}
            {followUpAnswers.length > 0 && (
              <div className="space-y-3 pt-2">
                {followUpAnswers.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs sm:text-sm">
                    <div className="font-bold text-[#0A2240] flex items-center gap-2">
                      <span>Q:</span>
                      <span>{item.question}</span>
                    </div>
                    <div className="text-gray-700 leading-relaxed pl-4 border-l-2 border-[#FF9933]">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
              <input
                type="text"
                value={followUpQuestion}
                onChange={(e) => setFollowUpQuestion(e.target.value)}
                placeholder={t.askFollowUpPlaceholder}
                className="flex-1 py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0A2240]"
                disabled={followUpLoading}
              />
              <button
                type="submit"
                disabled={followUpLoading || !followUpQuestion.trim()}
                className="px-5 py-2.5 bg-[#0A2240] hover:bg-[#163864] disabled:bg-gray-300 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                {followUpLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-[#FF9933]" />
                )}
                <span>{t.sendQuestion}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* No Results Fallback */}
      {!loading && !result && (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">{t.noResults}</h3>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/directory')}
              className="px-6 py-2.5 bg-[#0A2240] text-white font-semibold text-xs rounded-xl hover:bg-[#163864]"
            >
              Open Service Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantPage;
