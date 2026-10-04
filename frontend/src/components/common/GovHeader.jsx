import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  Sun,
  Moon,
  Globe,
  UserCheck,
  Shield,
  ChevronDown,
  Building2,
  ExternalLink,
  Check,
  ArrowLeft
} from 'lucide-react';

const LANG_OPTIONS = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
];

export default function GovHeader({ onNavigate, onGoBack, canGoBack = false, activeAlertsCount = 4 }) {
  const {
    currentUser,
    roles,
    switchUserRole,
    theme,
    toggleTheme,
    language,
    setLanguage,
    t
  } = useAuth();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLangObj = LANG_OPTIONS.find(l => l.code === language) || LANG_OPTIONS[0];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Indian National Tricolor Identity Bar */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#ff9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      {/* 2. Top Administrative Micro-Strip */}
      <div className="bg-[#0b1e36] text-slate-300 text-[11px] px-4 py-1 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white tracking-wide">
            {t('govIndia')}
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">
            Ministry of Road Transport & Highways &middot; Department of Land Resources (NIC)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Statutory Acts Reference */}
          <span className="hidden lg:inline bg-slate-800/80 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono">
            RFCTLARR Act 2013 &bull; NH Act 1956
          </span>

          {/* Prototype System Mandatory Notice */}
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-semibold text-[10px] tracking-wider uppercase">
            {t('prototypeBadge')}
          </span>
        </div>
      </div>

      {/* 3. Main Institutional Branding & Officer Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Emblem & Portal Title */}
        <div className="flex items-center gap-2.5">
          {canGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 touch-manipulation mr-1"
              title={t('previousPage')}
              aria-label="Go to previous page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t('back')}</span>
            </button>
          )}

          <div
            onClick={() => onNavigate('gateway')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            {/* Government Seal Emblem */}
            <div className="w-10 h-10 rounded-full border-2 border-amber-600/40 bg-gradient-to-b from-amber-50 to-slate-100 flex items-center justify-center text-blue-950 font-serif font-bold text-xs shadow-xs group-hover:border-blue-900 transition-colors">
              <span className="text-center leading-none text-[10px]">
                सत्यमेव<br />जयते
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-blue-950 flex items-center gap-1.5 font-sans">
                  <span>LandGuard</span>
                  <span className="bg-blue-900 text-white text-xs px-1.5 py-0.5 rounded font-mono font-bold">
                    AI
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-medium tracking-tight">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Tools & Officer Persona Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`px-2.5 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
              theme === 'dark'
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:text-amber-200'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle light or dark theme mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px]">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-[11px]">Dark Mode</span>
              </>
            )}
          </button>

          {/* Regional Administrative Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              title="Select Administrative Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-800" />
              <span>{currentLangObj.native}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-xl border border-slate-200 py-1 z-50 text-xs font-medium">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Regional Languages
                </div>
                {LANG_OPTIONS.map((opt) => {
                  const isSelected = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLanguage(opt.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-blue-50/80 text-blue-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs">{opt.native}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-900 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Early Warning Alerts Quick Bell */}
          <button
            onClick={() => onNavigate('alerts')}
            className="relative p-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors bg-white shadow-2xs"
            title="Early Warning Alert Center"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Officer Persona & Fast Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-md border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 transition-colors text-left shadow-2xs"
            >
              <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-blue-950 flex items-center gap-1 truncate max-w-[150px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-semibold text-blue-800 flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[150px]">
                    {roles.find(r => r.id === currentUser.role)?.label || currentUser.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-900 shrink-0" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50 text-xs">
                <div className="p-2 border-b border-slate-100 bg-slate-50 rounded-t-md mb-2">
                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-slate-600 text-[11px]">{currentUser.designation}</p>
                  <p className="text-blue-900 font-mono text-[10px] mt-0.5">ID: {currentUser.officialId}</p>
                  <p className="text-slate-500 text-[10px] truncate">{currentUser.department}</p>
                </div>

                <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Switch Administrative Role:
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  {roles.map(role => {
                    const isCurrent = role.id === currentUser.role;
                    return (
                      <button
                        key={role.id}
                        onClick={() => {
                          switchUserRole(role.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-md transition-colors flex items-start justify-between ${
                          isCurrent
                            ? 'bg-blue-900 text-white font-semibold'
                            : 'hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-xs flex items-center gap-1.5">
                            {role.label}
                          </div>
                          <div className={`text-[10px] mt-0.5 ${isCurrent ? 'text-blue-200' : 'text-slate-500'}`}>
                            {role.desc}
                          </div>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 text-center">
                  <span className="text-[10px] text-slate-500 font-medium">
                    Role-Based Access Control (RBAC) Enabled
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
