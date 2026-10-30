import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { services, exampleSearches } from '../data/services';
import {
  Search,
  FileUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
  Compass,
  FileText,
  Landmark,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // 8 Popular Services matching exact requirement
  const popularServiceIds = [
    'aaple-sarkar',
    'income-certificate',
    'caste-certificate',
    'domicile-certificate',
    'birth-certificate',
    'non-creamy-layer',
    'aadhaar-services',
    'driving-licence',
  ];

  const popularServices = popularServiceIds
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/assistant?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleExampleClick = (example: string) => {
    setSearchQuery(example);
    navigate(`/assistant?q=${encodeURIComponent(example)}`);
  };

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'income-certificate':
        return FileText;
      case 'caste-certificate':
        return Award;
      case 'domicile-certificate':
        return Landmark;
      case 'birth-certificate':
        return Building2;
      case 'non-creamy-layer':
        return Award;
      case 'aadhaar-services':
        return Compass;
      case 'driving-licence':
        return Compass;
      case 'aaple-sarkar':
      default:
        return Globe;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A2240] via-[#0E2C52] to-[#0A2240] text-white pt-12 pb-20 md:pt-16 md:pb-28">
        {/* Subtle Decorative Background Rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge & Language Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-300 font-medium shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>Maharashtra State Citizen AI Navigator</span>
            </div>

            {/* In-Hero Language Selector */}
            <div className="inline-flex items-center bg-white/10 p-1 rounded-full border border-white/20 text-xs">
              {(
                [
                  { code: 'en', label: 'English' },
                  { code: 'mr', label: 'मराठी' },
                  { code: 'hi', label: 'हिन्दी' },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 rounded-full font-semibold transition-all duration-150 ${
                    language === lang.code
                      ? 'bg-[#FF9933] text-gray-950 font-bold shadow-xs'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Hero Headings */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Main Search Interface */}
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="relative p-2 rounded-2xl bg-white shadow-2xl shadow-black/25 border border-gray-100 flex flex-col sm:flex-row gap-2 transition-all focus-within:ring-4 focus-within:ring-amber-500/20"
            >
              <div className="relative flex-1 flex items-center pl-4">
                <Search className="w-6 h-6 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full py-3.5 pl-3 pr-4 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base bg-transparent focus:outline-hidden font-normal"
                />
              </div>

              <div className="flex items-center gap-2 px-1 pb-1 sm:p-0">
                <button
                  type="button"
                  onClick={() => navigate('/upload')}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold transition-all hover:scale-[1.02] shrink-0"
                  title="Upload application form, notice or bill"
                >
                  <FileUp className="w-4 h-4 text-[#FF9933]" />
                  <span className="hidden sm:inline">{t.uploadButton}</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0A2240] hover:bg-[#163864] text-white text-sm sm:text-base font-bold shadow-md shadow-blue-950/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-[#FF9933]" />
                  <span>{t.searchButton}</span>
                </button>
              </div>
            </form>

            {/* Example Search Suggestions */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-blue-200/80 font-medium">{t.exampleSearches}:</span>
              {exampleSearches.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer hover:border-amber-300/50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">100% Free Guidance</div>
                <div className="text-gray-400">Zero charges for citizens</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">Verified Portals Only</div>
                <div className="text-gray-400">Aaple Sarkar & UIDAI</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">Document Checklists</div>
                <div className="text-gray-400">Never miss a paper</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">RTS Timelines</div>
                <div className="text-gray-400">Right to Services assured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Maharashtra Services Section */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
              <span>महाराष्ट्र शासन सेवा</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A2240] tracking-tight">
              {t.popularServices}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t.popularServicesSubtitle}
            </p>
          </div>

          {/* 8 Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((service) => {
              if (!service) return null;
              const Icon = getServiceIcon(service.id);
              const isState = service.category === 'maharashtra';

              return (
                <div
                  key={service.id}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#0A2240]/40 transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Category Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-[#0A2240] group-hover:bg-[#0A2240] group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6 text-[#FF9933] group-hover:text-[#FF9933]" />
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isState
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {isState ? t.stateGov : t.centralGov}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0A2240] transition-colors leading-snug">
                        {service.serviceName}
                      </h3>
                      {service.serviceNameMr && (
                        <p className="text-xs text-amber-700 font-medium mt-0.5">
                          {service.serviceNameMr}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Key Attributes */}
                    <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                      <div>
                        <span className="text-gray-400 block">Time:</span>
                        <strong className="text-gray-800">{service.processingTime}</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Govt Fee:</span>
                        <strong className="text-gray-800 truncate block">{service.fees}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => navigate(`/assistant?service=${service.id}`)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-[#0A2240] text-gray-800 hover:text-white text-xs font-bold transition-all border border-gray-200 group-hover:border-[#0A2240]"
                    >
                      <span>{t.viewGuide}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FF9933] group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View Full Directory Link */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => navigate('/directory')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 hover:border-[#0A2240] text-gray-800 font-semibold text-sm shadow-xs hover:shadow-md transition-all"
            >
              <span>Explore All Maharashtra & Central Services</span>
              <ChevronRight className="w-4 h-4 text-[#FF9933]" />
            </button>
          </div>
        </div>
      </section>

      {/* How MahaSahayak Works 3-Step Section */}
      <section className="py-16 bg-white border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A2240]">
              How MahaSahayak Simplifies Government Services
            </h2>
            <p className="text-sm text-gray-600">
              No more wandering between multiple government offices or paying commissions to middlemen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-[#0A2240] text-white flex items-center justify-center font-bold text-lg">
                  1
                </span>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Step 1
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Explain or Upload</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Describe what you want to achieve in plain Marathi, Hindi, or English (e.g. "I need an income proof for college admission") or upload an official notice or utility bill.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-[#FF9933] text-gray-950 flex items-center justify-center font-bold text-lg">
                  2
                </span>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Step 2
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">AI Pinpoints the Service</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our engine identifies the designated department, checks statutory eligibility, extracts the exact document checklist, and reveals official fees and processing days.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-[#138808] text-white flex items-center justify-center font-bold text-lg">
                  3
                </span>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  Step 3
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Apply Directly & Watch Videos</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Follow step-by-step instructions, use verified YouTube tutorials to see the exact clicks on Aaple Sarkar or UIDAI, and apply directly without fear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-14 bg-gradient-to-r from-[#0A2240] to-[#163864] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Have an official document or bill and not sure what service you need?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">
            Upload your document or utility receipt safely. MahaSahayak AI will extract the requirement and guide you to the right Maharashtra service.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate('/upload')}
              className="px-6 py-3 rounded-xl bg-[#FF9933] hover:bg-[#e07f1f] text-gray-950 font-bold text-sm shadow-lg transition-transform hover:scale-105"
            >
              Upload Document Requirement
            </button>
            <button
              type="button"
              onClick={() => navigate('/directory')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              Browse 500+ Maharashtra Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
