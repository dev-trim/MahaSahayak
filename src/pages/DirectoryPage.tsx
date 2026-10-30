import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { services, serviceCategories } from '../data/services';
import {
  Search,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Landmark,
  Building2,
  Award,
  Compass,
  FileText,
  Users,
  Globe,
  Filter,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

const DirectoryPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Category filter
      if (selectedCategory === 'maharashtra' && service.category !== 'maharashtra') return false;
      if (selectedCategory === 'central' && service.category !== 'central') return false;
      if (selectedCategory === 'certificates' && service.subcategory !== 'certificates') return false;
      if (
        selectedCategory === 'identity' &&
        service.subcategory !== 'identity' &&
        service.subcategory !== 'licences'
      )
        return false;
      if (selectedCategory === 'welfare' && service.subcategory !== 'welfare') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = service.serviceName.toLowerCase().includes(q);
        const inNameMr = service.serviceNameMr?.toLowerCase().includes(q);
        const inNameHi = service.serviceNameHi?.toLowerCase().includes(q);
        const inDept = service.department.toLowerCase().includes(q);
        const inDesc = service.description.toLowerCase().includes(q);
        const inKeywords = service.keywords?.some((k) => k.toLowerCase().includes(q));

        if (!inName && !inNameMr && !inNameHi && !inDept && !inDesc && !inKeywords) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

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
      case 'death-certificate':
        return FileText;
      case 'non-creamy-layer':
        return Award;
      case 'aadhaar-services':
        return Compass;
      case 'driving-licence':
        return Compass;
      case 'ration-card':
        return Users;
      case 'pan-card':
        return FileText;
      case 'aaple-sarkar':
      default:
        return Globe;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0A2240] border border-blue-200 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>Official Service Catalog</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A2240] tracking-tight">
          {t.serviceDirectory}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {t.directorySubtitle}
        </p>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service name, department, or keyword (e.g. Income, Caste, RTO, Ration)..."
            className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0A2240]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-xs text-gray-400 hover:text-gray-700 underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pt-2 pb-1">
          <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {serviceCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0A2240] text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Showing <strong>{filteredServices.length}</strong> of {services.length} services
        </span>
        <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Right to Services (RTS) Verified
        </span>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = getServiceIcon(service.id);
            const isState = service.category === 'maharashtra';

            return (
              <div
                key={service.id}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white border border-gray-200 shadow-xs hover:shadow-lg hover:border-[#0A2240]/40 transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0A2240] flex items-center justify-center shrink-0 group-hover:bg-[#0A2240] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5 text-[#FF9933]" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isState
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {isState ? 'Maharashtra (Aaple Sarkar)' : 'Central Gov'}
                    </span>
                  </div>

                  {/* Title & Department */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#0A2240] transition-colors leading-snug">
                      {service.serviceName}
                    </h3>
                    {service.serviceNameMr && (
                      <p className="text-xs text-amber-700 font-medium mt-0.5">
                        {service.serviceNameMr}
                      </p>
                    )}
                    <span className="text-[11px] text-gray-500 font-medium block mt-1 line-clamp-1">
                      {service.department}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Metric Chips */}
                  <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                    <div>
                      <span className="text-gray-400 block">Processing:</span>
                      <strong className="text-gray-800">{service.processingTime}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Official Fee:</span>
                      <strong className="text-gray-800 truncate block">{service.fees}</strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/assistant?service=${service.id}`)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0A2240] hover:bg-[#163864] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Guide & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF9933]" />
                  </button>

                  <a
                    href={service.officialPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200 transition-colors cursor-pointer"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-800">No matching services found</h3>
            <p className="text-xs text-gray-500">
              Try adjusting your search query or reset category filter.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A2240] text-white text-xs font-semibold rounded-xl hover:bg-[#163864] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Search & Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
