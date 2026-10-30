import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Compass,
  ExternalLink,
  Shield,
  AlertTriangle,
  Lock,
  X,
} from 'lucide-react';

const CURRENT_YEAR = 2026;

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const govResources = [
    { label: 'Aaple Sarkar Maharashtra', url: 'https://aaplesarkar.mahaonline.gov.in', tag: 'State Portal' },
    { label: 'UIDAI myAadhaar', url: 'https://myaadhaar.uidai.gov.in', tag: 'Central Identity' },
    { label: 'Parivahan Sarathi (RTO)', url: 'https://parivahan.gov.in', tag: 'MoRTH' },
    { label: 'Civil Registration (Birth/Death)', url: 'https://crsorgi.gov.in', tag: 'CRS India' },
    { label: 'Income Tax Instant PAN', url: 'https://www.incometax.gov.in', tag: 'Income Tax Dept' },
    { label: 'MahaFood (Ration Card PDS)', url: 'https://rcms.mahafood.gov.in', tag: 'Food & Supplies' },
  ];

  return (
    <footer className="bg-[#0A2240] text-gray-300 pt-14 pb-8 border-t border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white border border-white/20">
                <Compass className="w-5 h-5 text-[#FF9933]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">MahaSahayak</span>
            </div>
            <p className="text-xs text-amber-300/90 font-medium">
              "Government Services, Simplified for Every Citizen."
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              An AI-powered citizen guidance engine designed specifically for Maharashtra, helping
              citizens navigate state and central government services without friction, confusion, or
              middlemen.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-4 h-4" />
              <span>100% Free & Open Citizen Assistance</span>
            </div>
          </div>

          {/* How It Works & Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white">
              {t.howItWorks}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  1
                </span>
                <span>Describe your situation in your own words or upload a form.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  2
                </span>
                <span>AI matches the exact service, required documents & fees.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  3
                </span>
                <span>Follow verified steps and apply directly on the official portal.</span>
              </li>
            </ul>
            <div className="pt-3">
              <Link
                to="/directory"
                className="inline-flex items-center gap-1.5 text-xs text-[#FF9933] hover:underline font-medium"
              >
                Browse Service Directory &rarr;
              </Link>
            </div>
          </div>

          {/* Official Government Portals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white">
              {t.resources}
            </h4>
            <ul className="space-y-2 text-xs">
              {govResources.map((res) => (
                <li key={res.label}>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between text-gray-300 hover:text-white transition-colors py-0.5"
                  >
                    <span className="truncate group-hover:underline">{res.label}</span>
                    <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-amber-400 shrink-0 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Privacy Commitment */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white">
              Privacy & Citizens Rights
            </h4>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <Lock className="w-3.5 h-3.5 text-[#138808]" />
                <span>Zero Aadhaar Storage Policy</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">
                MahaSahayak never stores Aadhaar, passwords, or OTPs. All data processed is
                temporary and stays strictly client-side.
              </p>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(true)}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium underline"
              >
                Read Security Commitment &rarr;
              </button>
            </div>
            <div className="pt-1 text-xs text-gray-400">
              <span>Aaple Sarkar 24x7 Helpline: </span>
              <a href="tel:18001208040" className="text-white font-semibold hover:underline">
                1800 120 8040
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice Banner */}
        <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 uppercase tracking-wide">
                {t.disclaimer}:{' '}
              </strong>
              {t.disclaimerText}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>© {CURRENT_YEAR} MahaSahayak Platform.</span>
            <span className="hidden sm:inline">•</span>
            <span>Built for Maharashtra State Innovation Challenge</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(true)}
              className="hover:text-white underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <Link to="/directory" className="hover:text-white underline">
              Directory
            </Link>
            <a
              href="https://aaplesarkar.mahaonline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1"
            >
              <span>Aaple Sarkar</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white text-gray-900 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-[#0A2240]">Citizen Privacy & Security Policy</h3>
              </div>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-gray-600">
              <p className="font-semibold text-gray-800">
                MahaSahayak is committed to absolute citizen privacy and ethical AI use:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>No Aadhaar or Credential Storage:</strong> We NEVER ask for, capture, or store
                  12-digit Aadhaar numbers, PAN numbers, bank passwords, or OTPs.
                </li>
                <li>
                  <strong>Temporary Client-Side Processing:</strong> Uploaded document files are
                  inspected within your browser memory for requirement extraction and are not retained.
                </li>
                <li>
                  <strong>No Automated Submission Claims:</strong> MahaSahayak does not falsely claim to
                  submit applications on your behalf; we guide you directly to the official government
                  portals (.gov.in) to perform secure submissions.
                </li>
                <li>
                  <strong>Verified Sources:</strong> All procedural rules, fee ranges, and timelines are
                  derived from official Maharashtra Government citizen charters and public notifications.
                </li>
              </ul>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                Always ensure you are visiting authorized government domains ending in{' '}
                <strong>.gov.in</strong> or <strong>.nic.in</strong> before submitting payments or identity documents.
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="px-4 py-2 bg-[#0A2240] text-white text-xs font-semibold rounded-lg hover:bg-[#163864]"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
