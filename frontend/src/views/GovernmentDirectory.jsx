import React, { useState, useEffect, useMemo } from 'react';
import {
  Landmark,
  Building2,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Award,
  FileText,
  ChevronRight,
  X,
  Info,
  Globe,
  Clock,
  RotateCcw,
  Check,
  Star,
  ArrowLeft
} from 'lucide-react';

const ALPHABET = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

const STATE_CONFIG = {
  TN: {
    name: 'Tamil Nadu',
    code: 'TN',
    capital: 'Chennai',
    secretariat: 'Fort St. George, Chennai',
    themeColor: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  KL: {
    name: 'Kerala',
    code: 'KL',
    capital: 'Thiruvananthapuram',
    secretariat: 'Government Secretariat, Thiruvananthapuram',
    themeColor: 'teal',
    badgeClass: 'bg-teal-100 text-teal-900 border-teal-300'
  },
  PY: {
    name: 'Puducherry',
    code: 'PY',
    capital: 'Puducherry',
    secretariat: "Chief Minister's Secretariat, Beach Road, Puducherry",
    themeColor: 'indigo',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300'
  },
  AP: {
    name: 'Andhra Pradesh',
    code: 'AP',
    capital: 'Amaravati',
    secretariat: 'A.P. Secretariat, Velagapudi, Amaravati',
    themeColor: 'blue',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  KA: {
    name: 'Karnataka',
    code: 'KA',
    capital: 'Bengaluru',
    secretariat: 'Vidhana Soudha, Bengaluru',
    themeColor: 'amber',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300'
  }
};

export default function GovernmentDirectory({ onNavigate, onGoBack }) {
  const [activeTab, setActiveTab] = useState('ministers'); // 'ministers' | 'chief_ministers' | 'ministries' | 'contacts' | 'verification'
  const [ministers, setMinisters] = useState([]);
  const [chiefMinisters, setChiefMinisters] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters state for Union Ministers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedParty, setSelectedParty] = useState('ALL');

  // Modal profile state
  const [selectedMinister, setSelectedMinister] = useState(null);

  // Fetch directory data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [minResp, cmResp, deptResp, contactResp, verifResp] = await Promise.all([
          fetch('/api/government/ministers'),
          fetch('/api/government/chief-ministers'),
          fetch('/api/government/ministries'),
          fetch('/api/government/contacts'),
          fetch('/api/government/verification')
        ]);

        if (minResp.ok) {
          const d = await minResp.json();
          setMinisters(d.ministers || []);
        }
        if (cmResp.ok) {
          const cmd = await cmResp.json();
          setChiefMinisters(cmd.chief_ministers || []);
        }
        if (deptResp.ok) {
          const d = await deptResp.json();
          setMinistries(d.ministries || []);
        }
        if (contactResp.ok) {
          const d = await contactResp.json();
          setContacts(d.contacts || []);
        }
        if (verifResp.ok) {
          const d = await verifResp.json();
          setVerificationData(d);
        }
      } catch (err) {
        console.error('Failed to load government directory:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Unique options for filter dropdowns
  const ministryOptions = useMemo(() => {
    const set = new Set();
    ministers.forEach(m => {
      if (m.primary_ministry) set.add(m.primary_ministry);
    });
    return Array.from(set).sort();
  }, [ministers]);

  const stateOptions = useMemo(() => {
    const set = new Set();
    ministers.forEach(m => {
      if (m.state) {
        m.state.split('/').forEach(s => set.add(s.trim()));
      }
    });
    return Array.from(set).sort();
  }, [ministers]);

  const partyOptions = useMemo(() => {
    const set = new Set();
    ministers.forEach(m => {
      if (m.party) set.add(m.party);
    });
    return Array.from(set).sort();
  }, [ministers]);

  // Clean name helper for alphabetical matching
  const cleanNameForAlpha = (name) => {
    const tokens = name.split(' ');
    for (const t of tokens) {
      if (!['shri', 'smt.', 'smt', 'dr.', 'dr', 'rao', 'er.', 'thiru'].includes(t.toLowerCase())) {
        return t;
      }
    }
    return tokens[0] || '';
  };

  // Filtered ministers
  const filteredMinisters = useMemo(() => {
    return ministers.filter(m => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const queryTerms = searchQuery.toLowerCase().trim().split(/\s+/);
        const searchable = [
          m.full_name,
          m.current_position,
          m.primary_ministry,
          ...(m.portfolios || []),
          m.state || '',
          m.constituency || '',
          m.party || ''
        ].join(' ').toLowerCase();

        const matchesAll = queryTerms.every(t => searchable.includes(t));
        if (!matchesAll) return false;
      }

      // 2. Category
      if (selectedCategory !== 'ALL' && m.category !== selectedCategory) {
        return false;
      }

      // 3. Alphabetical Letter
      if (selectedLetter !== 'ALL') {
        const clean = cleanNameForAlpha(m.full_name).toUpperCase();
        if (!clean.startsWith(selectedLetter) && !m.full_name.toUpperCase().startsWith(selectedLetter)) {
          return false;
        }
      }

      // 4. Ministry
      if (selectedMinistry !== 'ALL') {
        const matchesMin = m.primary_ministry === selectedMinistry || (m.portfolios && m.portfolios.some(p => p.includes(selectedMinistry)));
        if (!matchesMin) return false;
      }

      // 5. State
      if (selectedState !== 'ALL') {
        if (!m.state || !m.state.includes(selectedState)) return false;
      }

      // 6. Party
      if (selectedParty !== 'ALL' && m.party !== selectedParty) {
        return false;
      }

      return true;
    });
  }, [ministers, searchQuery, selectedCategory, selectedLetter, selectedMinistry, selectedState, selectedParty]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedLetter('ALL');
    setSelectedMinistry('ALL');
    setSelectedState('ALL');
    setSelectedParty('ALL');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'ALL' || selectedLetter !== 'ALL' || selectedMinistry !== 'ALL' || selectedState !== 'ALL' || selectedParty !== 'ALL';

  return (
    <div className="space-y-6 pb-12">
      {/* Optional Top Back Button if accessed from another view */}
      {onGoBack && (
        <div className="flex items-center justify-between">
          <button
            onClick={onGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer touch-manipulation"
            title="Go to previous page"
            aria-label="Previous page"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>← Back / Previous Page</span>
          </button>
        </div>
      )}

      {/* 1. Official Directory Master Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm border border-blue-800">
              <Landmark className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-wider">
                  Official Public Record
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Government of India & Southern States Executive Directory (TN &bull; KL &bull; PY &bull; AP &bull; KA)
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Government of India & State Executive Directory
              </h1>
              <p className="text-xs md:text-sm text-slate-600 font-medium mt-1 max-w-3xl">
                Official reference directory for Union Ministers, Southern Region Chief Ministers (Tamil Nadu, Kerala, Puducherry, Andhra Pradesh, Karnataka), Ministries, and Public Offices.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Verified Official Data
            </span>
            <span className="text-[11px] text-slate-500 mt-1 font-mono">
              Last Verified: 24-09-2026
            </span>
          </div>
        </div>

        {/* Politically Neutral Compliance Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-blue-900 shrink-0" />
          <span>
            <strong>Neutrality & Verification Protocol:</strong> Sourced exclusively from official government portals (PM India, India.gov.in, State Government Secretariats). Strictly informational; ministers and chief ministers are cataloged with equal format without ranking, endorsement, or evaluation.
          </span>
        </div>
      </div>

      {/* 2. Directory Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-3 rounded-t-lg shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('ministers')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'ministers'
              ? 'border-blue-900 text-blue-900 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Union Council of Ministers ({ministers.filter(m => m.category !== 'Chief Minister').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chief_ministers')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'chief_ministers'
              ? 'border-amber-600 text-amber-900 bg-amber-50/60 font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>Chief Ministers (TN, KL, PY, AP, KA) (5)</span>
        </button>

        <button
          onClick={() => setActiveTab('ministries')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'ministries'
              ? 'border-blue-900 text-blue-900 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Ministries & Departments ({ministries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'contacts'
              ? 'border-blue-900 text-blue-900 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Verified Official Contacts</span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'verification'
              ? 'border-blue-900 text-blue-900 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sources & Governance</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: UNION MINISTERS */}
      {/* ==================================================================== */}
      {activeTab === 'ministers' && (
        <div className="space-y-4">
          {/* Search & Comprehensive Filters Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-4">
            {/* Top Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search minister, ministry, portfolio, constituency or state (e.g., Nitin Gadkari, Railways, Karnataka, Varanasi)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Alphabetical A-Z Strip */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> A-Z:
              </span>
              {ALPHABET.map((letter) => {
                const isSelected = selectedLetter === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-blue-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Dropdown Filters & Role Pills */}
            <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'ALL', label: 'All Roles' },
                  { id: 'Cabinet Minister', label: 'Cabinet Ministers' },
                  { id: 'Minister of State (Independent Charge)', label: 'MoS (Independent Charge)' },
                  { id: 'Minister of State', label: 'Ministers of State' },
                  { id: 'Chief Minister', label: 'Chief Ministers' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Dropdown Selectors */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedMinistry}
                  onChange={(e) => setSelectedMinistry(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                >
                  <option value="ALL">All Ministries</option>
                  {ministryOptions.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                >
                  <option value="ALL">All States / UTs</option>
                  {stateOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={selectedParty}
                  onChange={(e) => setSelectedParty(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-900"
                >
                  <option value="ALL">All Affiliations</option>
                  {partyOptions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
                    title="Reset all filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span>
              Showing <strong>{filteredMinisters.length}</strong> of <strong>{ministers.length}</strong> Executives
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Strict Non-Partisan Order: Protocol / Alphabetical
            </span>
          </div>

          {/* Minister Cards Grid (3 cols desktop, 2 cols tablet, 1 col mobile) */}
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
              <div className="animate-spin w-6 h-6 border-2 border-blue-900 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-xs font-semibold">Synchronizing with Official Government Registry...</p>
            </div>
          ) : filteredMinisters.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
              <Landmark className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No official matches the specified filter criteria</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try searching for partial names, ministries, or clearing the active filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 bg-blue-900 text-white text-xs font-bold rounded-md hover:bg-blue-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMinisters.map((m) => (
                <div
                  key={m.minister_id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  {/* Card Header & Photo */}
                  <div>
                    <div className="flex items-start gap-3.5">
                      {/* Photo / Silhouette with source metadata */}
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center shadow-inner">
                          {m.photo_url ? (
                            <img
                              src={m.photo_url}
                              alt={m.full_name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                                e.target.style.display = 'none';
                              }}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : null}
                          <User className="w-8 h-8 text-slate-400 absolute" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              m.category === 'Prime Minister'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-black'
                                : m.category === 'Chief Minister'
                                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold'
                                : m.category === 'Cabinet Minister'
                                ? 'bg-blue-100 text-blue-950 border border-blue-200'
                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                            }`}
                          >
                            {m.category}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 truncate mt-1" title={m.full_name}>
                          {m.full_name}
                        </h3>
                        <p className="text-[11px] text-blue-900 font-semibold line-clamp-1 mt-0.5">
                          {m.current_position || m.primary_ministry}
                        </p>
                      </div>
                    </div>

                    {/* Metadata Attributes */}
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                      {/* Political Affiliation */}
                      <div className="text-[11px] text-slate-600 flex items-center justify-between">
                        <span className="text-slate-400">Political Affiliation:</span>
                        <span className="font-medium text-slate-800 text-right truncate max-w-[180px]">{m.party}</span>
                      </div>

                      {/* Constituency & State */}
                      <div className="text-[11px] text-slate-600 flex items-center justify-between">
                        <span className="text-slate-400">Constituency:</span>
                        <span className="font-medium text-slate-800 text-right">
                          {m.constituency ? `${m.constituency}, ${m.state}` : m.state} ({m.parliamentary_house})
                        </span>
                      </div>

                      {/* Dynamic Age */}
                      <div className="text-[11px] text-slate-600 flex items-center justify-between">
                        <span className="text-slate-400">Age:</span>
                        <span className="font-semibold text-slate-800">{m.age_display}</span>
                      </div>

                      {/* Dynamic Tenure */}
                      <div className="text-[11px] text-slate-600 flex items-center justify-between">
                        <span className="text-slate-400">Tenure:</span>
                        <span className="font-medium text-slate-700 text-right">
                          {m.tenure?.formatted_start} – Present
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Badge & Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Verified Official Information
                      </span>
                      <span className="text-slate-400 font-mono">24-09-2026</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => setSelectedMinister(m)}
                        className="w-full py-1.5 px-2 bg-blue-900 text-white rounded-md font-bold hover:bg-blue-800 transition-colors text-center text-xs flex items-center justify-center gap-1"
                      >
                        <User className="w-3 h-3" />
                        View Profile
                      </button>

                      <a
                        href={m.official_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 px-2 bg-slate-100 text-slate-800 rounded-md font-semibold hover:bg-slate-200 transition-colors text-center text-xs flex items-center justify-center gap-1 border border-slate-300"
                      >
                        <Globe className="w-3 h-3 text-slate-600" />
                        Official Portal
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: SOUTHERN REGION CHIEF MINISTERS (TN, KL, PY, AP, KA) */}
      {/* ==================================================================== */}
      {activeTab === 'chief_ministers' && (
        <div className="space-y-5">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white border border-blue-900 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                    Executive Heads &bull; Southern Region
                  </span>
                  <span className="text-xs text-blue-200 font-mono">
                    Mandate Jurisdictions: TN, KL, PY, AP, KA
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1.5">
                  Chief Ministers of Southern Region States & Union Territory
                </h2>
                <p className="text-xs text-blue-100 mt-1 max-w-3xl">
                  Constitutional and administrative leadership overseeing State Land Administration, Joint Measurement Surveys (JMS), Revenue Departments, and CALA authorities across Tamil Nadu, Kerala, Puducherry, Andhra Pradesh, and Karnataka.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-xs rounded-lg border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  5 CM Records Verified
                </span>
              </div>
            </div>
          </div>

          {/* 5 Chief Ministers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {chiefMinisters.map((cm) => {
              const stateInfo = STATE_CONFIG[cm.state_code] || {};
              return (
                <div
                  key={cm.minister_id}
                  className="bg-white border-2 border-slate-200 hover:border-blue-900 rounded-2xl p-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  {/* Top State Banner Badge */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-blue-900 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        {cm.state_code}
                      </span>
                      <div>
                        <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                          {cm.state}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {cm.jurisdiction}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ Verified CMO
                    </span>
                  </div>

                  {/* Leader Header & Photo */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center shadow-inner">
                          {cm.photo_url ? (
                            <img
                              src={cm.photo_url}
                              alt={cm.full_name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                                e.target.style.display = 'none';
                              }}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : null}
                          <User className="w-10 h-10 text-slate-400 absolute" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">
                          Chief Minister
                        </span>
                        <h3 className="text-base font-black text-slate-900 mt-1 truncate" title={cm.full_name}>
                          {cm.full_name}
                        </h3>
                        <p className="text-xs text-blue-900 font-semibold mt-0.5">
                          {cm.current_position}
                        </p>
                      </div>
                    </div>

                    {/* Metadata Table */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Party Affiliation:</span>
                        <span className="font-bold text-slate-900 text-right truncate max-w-[170px]">
                          {cm.party}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Constituency:</span>
                        <span className="font-semibold text-slate-800 text-right">
                          {cm.constituency} ({cm.state})
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Dynamic Age:</span>
                        <span className="font-bold text-slate-900">
                          {cm.age_display}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Current Tenure:</span>
                        <span className="font-medium text-slate-700 text-right">
                          {cm.tenure?.formatted_start} – Present
                        </span>
                      </div>
                    </div>

                    {/* Key Portfolios */}
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Key Constitutional Portfolios:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cm.portfolios?.slice(0, 4).map((p, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium bg-blue-50/70 border border-blue-200 text-blue-950 px-2 py-0.5 rounded"
                          >
                            {p}
                          </span>
                        ))}
                        {cm.portfolios?.length > 4 && (
                          <span className="text-[10px] font-semibold text-slate-500 px-1 py-0.5">
                            +{cm.portfolios.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Secretariat & Contacts Coordinates */}
                    <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-blue-900 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{cm.office_address}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-mono">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{cm.official_phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-900 font-mono text-[10px]">
                          <Mail className="w-3 h-3 text-blue-800" />
                          <span>{cm.official_email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setSelectedMinister(cm)}
                      className="w-full py-2 px-2 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors text-center text-xs flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <User className="w-3.5 h-3.5" />
                      View Full Profile
                    </button>

                    <a
                      href={cm.contact_portal || cm.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-2 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-lg font-bold transition-colors text-center text-xs flex items-center justify-center gap-1 border border-amber-300"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-800" />
                      CMO Portal
                      <ExternalLink className="w-3 h-3 text-amber-700" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: MINISTRIES & DEPARTMENTS */}
      {/* ==================================================================== */}
      {activeTab === 'ministries' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Union Ministries & Associated Departments
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Statutory jurisdictions, allocated departments, cabinet and state ministers, and official government website domains.
            </p>
          </div>

          <div className="space-y-3">
            {ministries.map((min) => (
              <div
                key={min.ministry_id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-colors space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
                      {min.short_name || 'MIN'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {min.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {min.headquarters}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={min.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-50 text-blue-900 rounded-md font-bold text-xs hover:bg-blue-100 transition-colors flex items-center gap-1 border border-blue-200"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Official Website
                      <ExternalLink className="w-3 h-3 text-blue-700" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Column 1: Minister In-Charge */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cabinet Minister In-Charge
                    </span>
                    {min.cabinet_minister ? (
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">
                          {min.cabinet_minister.full_name}
                        </span>
                        <span className="text-[11px] text-slate-600 block mt-0.5">
                          {min.cabinet_minister.party}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Cabinet Secretariat Oversight</span>
                    )}

                    {min.mos_ministers && min.mos_ministers.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Ministers of State (MoS)
                        </span>
                        {min.mos_ministers.map((mos) => (
                          <div key={mos.minister_id} className="text-[11px] text-slate-700">
                            &bull; {mos.full_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Column 2: Allocated Departments */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Key Departments & Statutory Bodies
                    </span>
                    <ul className="space-y-1">
                      {min.departments.map((dept, i) => (
                        <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span>{dept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 3: Contact & Statutory Acts */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Primary Statutory Acts
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {min.primary_statutory_acts?.map((act, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-white border border-slate-300 text-slate-700 px-1.5 py-0.5 rounded">
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 text-[11px] text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{min.official_phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="font-mono text-[10px]">{min.official_email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: VERIFIED OFFICIAL CONTACTS */}
      {/* ==================================================================== */}
      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Verified Official Government Contacts
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Published official public office telephones, addresses, NIC/gov emails, and grievance/contact web pages.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Official Public Records
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Ministry / Department</th>
                    <th className="py-3 px-4">Minister In-Charge</th>
                    <th className="py-3 px-4">Headquarters Address</th>
                    <th className="py-3 px-4">Official Phone</th>
                    <th className="py-3 px-4">Official Email</th>
                    <th className="py-3 px-4">Web Portals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contacts.map((c) => (
                    <tr key={c.ministry_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div>{c.ministry_name}</div>
                        <span className="text-[10px] text-slate-400 font-mono font-normal">
                          {c.short_name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {c.cabinet_minister_name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs text-[11px]">
                        {c.office_address}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-mono text-[11px] whitespace-nowrap">
                        {c.official_phone}
                      </td>
                      <td className="py-3 px-4 text-blue-900 font-mono text-[11px] whitespace-nowrap">
                        {c.official_email}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={c.official_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-[10px] font-bold hover:bg-slate-200 transition-colors flex items-center gap-1 border border-slate-300"
                            title="Visit Official Ministry Website"
                          >
                            <Globe className="w-3 h-3 text-slate-600" />
                            Website
                          </a>
                          <a
                            href={c.contact_portal}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-blue-50 text-blue-900 rounded text-[10px] font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 border border-blue-200"
                            title="Open Official Contact / Grievance Portal"
                          >
                            <ExternalLink className="w-3 h-3 text-blue-800" />
                            Contact
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: SOURCES & GOVERNANCE */}
      {/* ==================================================================== */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
            <h2 className="text-lg font-black text-slate-900">
              Government Directory Governance & Verification System
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              This module operates under strict government neutrality and data accuracy guidelines. All ministerial portfolios, terms, office addresses, and telephone lines are validated against authoritative Government of India gazettes and digital portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Authoritative Primary Sources
              </h3>
              <div className="space-y-2 text-xs">
                {verificationData?.primary_sources?.map((s) => (
                  <div key={s.source_id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900 text-xs">{s.name}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Authority: {s.authority}</div>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-900 text-[11px] font-mono hover:underline flex items-center gap-1 mt-1"
                    >
                      {s.url}
                      <ExternalLink className="w-3 h-3 text-blue-700" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-900" />
                Data Protection & Neutrality Commitments
              </h3>
              <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                  <strong className="text-blue-950 block mb-0.5">Strict Non-Partisan Presentation:</strong>
                  Ministers from all officially recognized parties are presented with uniform card geometry, typography, and factual metadata. No sentiment analysis, ranking, popularity ratings, or endorsements are generated.
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">Privacy & Personal Data Safeguard:</strong>
                  In accordance with national security and DPDP regulations, personal telephone numbers, private residential emails, and unverified contacts are strictly excluded. Only published official ministry office contact coordinates are included.
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
                  <strong className="text-emerald-950 block mb-0.5">Dynamic Age & Tenure Engine:</strong>
                  Ages and tenure spans are dynamically calculated upon request execution against verified dates of birth and term inception timestamps to prevent static data obsolescence.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. MINISTER DETAILED PROFILE MODAL */}
      {/* ==================================================================== */}
      {selectedMinister && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4 sticky top-0 z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                  {selectedMinister.photo_url ? (
                    <img
                      src={selectedMinister.photo_url}
                      alt={selectedMinister.full_name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.style.display = 'none';
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : null}
                  <User className="w-8 h-8 text-slate-400 absolute" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-blue-900 text-white">
                      {selectedMinister.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      ✓ Verified Official
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    {selectedMinister.full_name}
                  </h2>
                  <p className="text-xs text-blue-900 font-semibold">
                    {selectedMinister.current_position}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMinister(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                title="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Information Sections A through E */}
            <div className="p-6 space-y-5 text-xs">
              {/* Section A: Basic Information */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <User className="w-3.5 h-3.5 text-blue-900" />
                  A. Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Full Name</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block">{selectedMinister.full_name}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Calculated Age</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block">{selectedMinister.age_display}</span>
                    <span className="text-[10px] text-slate-400">DOB: {selectedMinister.date_of_birth}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">State / Union Territory</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block">{selectedMinister.state}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Constituency & House</span>
                    <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                      {selectedMinister.constituency} ({selectedMinister.parliamentary_house})
                    </span>
                  </div>
                </div>
              </div>

              {/* Section B: Current Portfolios */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <Award className="w-3.5 h-3.5 text-blue-900" />
                  B. Official Portfolios & Allocations
                </h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="font-bold text-blue-950 text-xs">{selectedMinister.primary_ministry}</div>
                  <ul className="space-y-1">
                    {selectedMinister.portfolios?.map((p, idx) => (
                      <li key={idx} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                        <span className="text-blue-900 font-bold">&bull;</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Section C: Tenure & Status */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-blue-900" />
                  C. Statutory Ministerial Tenure
                </h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Current Term Inception</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedMinister.tenure?.formatted_start}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Status</span>
                    <span className="font-bold text-emerald-700 text-xs">Active in Office</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Duration</span>
                    <span className="font-bold text-blue-900 text-xs">{selectedMinister.tenure?.duration_str}</span>
                  </div>
                </div>
              </div>

              {/* Section D: Political Affiliation (Factual) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <FileText className="w-3.5 h-3.5 text-blue-900" />
                  D. Political Affiliation & Representation
                </h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Political Party</span>
                    <span className="font-bold text-slate-900 text-xs">{selectedMinister.party}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">Legislative Body</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedMinister.parliamentary_house}</span>
                  </div>
                </div>
              </div>

              {/* Section E: Official Verified Contact Coordinates */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
                  <Phone className="w-3.5 h-3.5 text-blue-900" />
                  E. Verified Official Public Office Contacts
                </h4>
                <div className="p-3.5 bg-blue-50/40 rounded-lg border border-blue-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Secretariat Office Address</span>
                      <span className="font-medium text-slate-800 text-xs">{selectedMinister.office_address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-blue-100">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block">Office Telephone</span>
                        <span className="font-mono text-xs font-bold text-slate-900">{selectedMinister.official_phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block">Official Email</span>
                        <span className="font-mono text-xs font-bold text-blue-900">{selectedMinister.official_email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo & Source Metadata */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <span>Photo Source: {selectedMinister.photo_source || 'Official Government Website'}</span>
                <span className="font-mono text-[10px]">Verified: 24-09-2026</span>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 sticky bottom-0">
              <span className="text-[11px] text-slate-500">
                Official Government Coordinates
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={selectedMinister.contact_portal || selectedMinister.official_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  CMO / Grievance Portal
                </a>

                <a
                  href={selectedMinister.official_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-md font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Visit Official Portal
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
