import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Compass,
  FileUp,
  BookOpen,
  Home,
  Menu,
  X,
  Sparkles,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import type { Language } from '../types';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t.navHome, icon: Home },
    { to: '/assistant', label: t.navAssistant, icon: Sparkles, badge: 'AI' },
    { to: '/upload', label: t.navUpload, icon: FileUp },
    { to: '/directory', label: t.navDirectory, icon: BookOpen },
  ];

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'EN' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      {/* Tricolor Subtle Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 flex">
        <div className="w-1/3 bg-[#FF9933] h-full" />
        <div className="w-1/3 bg-white h-full" />
        <div className="w-1/3 bg-[#138808] h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Emblem */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#0A2240] text-white shadow-md shadow-blue-950/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 text-[#FF9933]" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#138808] border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                ✓
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-bold tracking-tight text-[#0A2240]">
                  MahaSahayak
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Maharashtra
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium tracking-wide">
                महाराष्ट्र शासन नागरी सहाय्य व्यासपीठ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-[#0A2240] text-white shadow-xs'
                      : 'text-gray-700 hover:text-[#0A2240] hover:bg-gray-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#FF9933]' : 'text-gray-500'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        active
                          ? 'bg-[#FF9933] text-gray-900'
                          : 'bg-blue-100 text-[#0A2240]'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Helpline & Language Switcher */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Toll-free badge */}
            <a
              href="tel:18001208040"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-colors"
              title="Aaple Sarkar Citizen Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#138808]" />
              <span>
                Helpline: <strong className="text-gray-900">1800 120 8040</strong>
              </span>
            </a>

            {/* Language Switcher */}
            <div className="flex items-center bg-gray-100/90 p-1 rounded-xl border border-gray-200">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    language === lang.code
                      ? 'bg-white text-[#0A2240] shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={lang.label}
                >
                  {lang.native}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    language === lang.code
                      ? 'bg-white text-[#0A2240] shadow-xs font-bold'
                      : 'text-gray-600'
                  }`}
                >
                  {lang.native}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                  active
                    ? 'bg-[#0A2240] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-[#FF9933]' : 'text-gray-500'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      active
                        ? 'bg-[#FF9933] text-gray-900 font-bold'
                        : 'bg-blue-100 text-[#0A2240]'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Verified Government Sources
            </span>
            <a href="tel:18001208040" className="text-[#0A2240] font-semibold">
              Call 1800 120 8040
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
