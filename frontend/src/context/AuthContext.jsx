import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES_LIST = [
  { id: 'STATE_ADMIN', label: 'State Administrator', desc: 'State-wide oversight across CALA divisions, fund reallocations & policy control' },
  { id: 'DISTRICT_COLLECTOR', label: 'District Collector / DM', desc: 'Statutory arbitration authority, revenue sanction & Section 3G(5) powers' },
  { id: 'PROJECT_DIRECTOR', label: 'Project Director (NHAI/Railways)', desc: 'Executing agency authority, contractor interface & fund sanctions' },
  { id: 'CALA_OFFICER', label: 'Competent Authority (CALA / SLAO)', desc: 'Passing statutory awards, 3G determination, PFMS direct disbursement' },
  { id: 'REVENUE_OFFICER', label: 'Revenue Officer / Tahsildar', desc: 'Joint Measurement Survey (JMS), land records, title verification' },
  { id: 'POLICY_ANALYST', label: 'Policy Analyst / Auditor', desc: 'Predictive analytics review, delay trend modeling, statutory compliance' },
  { id: 'AUDITOR_VIEWER', label: 'CAG / Public Auditor (Read-Only)', desc: 'Read-only inspection of awards, audit trail & public accounts' }
];

export const DEMO_USERS = [
  {
    id: 'USR-TN-001',
    officialId: 'GOV-TN-IAS-041',
    name: 'Dr. K. Senthil Nathan, IAS',
    role: 'STATE_ADMIN',
    designation: 'Principal Secretary, Highways & Minor Ports Department',
    department: 'Highways & Minor Ports Dept, Govt of Tamil Nadu',
    state: 'Tamil Nadu',
    district: 'All Districts',
    email: 'psec.highways@tn.gov.in'
  },
  {
    id: 'USR-TN-002',
    officialId: 'GOV-TN-IAS-189',
    name: 'Smt. P. Divya, IAS',
    role: 'DISTRICT_COLLECTOR',
    designation: 'District Collector & District Magistrate',
    department: 'Revenue Administration',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    email: 'collector.kan@tn.gov.in'
  },
  {
    id: 'USR-KL-003',
    officialId: 'GOV-KL-IAS-211',
    name: 'Shri V. R. Premkumar, IAS',
    role: 'DISTRICT_COLLECTOR',
    designation: 'District Collector & Special CALA Coordinator',
    department: 'Revenue Department, Govt of Kerala',
    state: 'Kerala',
    district: 'Malappuram',
    email: 'collector.mlp@kerala.gov.in'
  },
  {
    id: 'USR-KA-004',
    officialId: 'NHAI-CGM-402',
    name: 'Er. R. Sundaram',
    role: 'PROJECT_DIRECTOR',
    designation: 'Chief General Manager (Tech) & Project Director',
    department: 'National Highways Authority of India (RO Bengaluru & Chennai)',
    state: 'Karnataka',
    district: 'Bengaluru Urban & Kolar',
    email: 'pd.bce@nhai.org'
  },
  {
    id: 'USR-PY-005',
    officialId: 'GOV-PY-SLAO-092',
    name: 'Thiru E. Vallavan, PCS',
    role: 'CALA_OFFICER',
    designation: 'District Revenue Officer & Competent Authority (CALA)',
    department: 'Department of Revenue & Disaster Management, Puducherry',
    state: 'Puducherry',
    district: 'Puducherry',
    email: 'cala.pdy@py.gov.in'
  },
  {
    id: 'USR-AP-006',
    officialId: 'GOV-AP-IAS-304',
    name: 'Dr. A. Mallikarjuna, IAS',
    role: 'DISTRICT_COLLECTOR',
    designation: 'District Collector & Arbitrator Sec 3G(5)',
    department: 'Revenue Administration, Govt of Andhra Pradesh',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    email: 'collector.vsp@ap.gov.in'
  }
];

const TRANSLATIONS = {
  en: {
    systemTitle: 'LandGuard AI',
    subtitle: 'Predictive Land Acquisition Risk Management System (Southern Region: TN, KL, PY, AP, KA)',
    govIndia: 'Government of India | Digital Governance Platform',
    prototypeBadge: 'Prototype / Official Demonstration System',
    portalOverview: 'Portal Overview',
    adminModules: 'Administrative Modules',
    dashboard: 'Risk Intelligence Dashboard',
    projects: 'Projects Directory',
    gis: 'GIS Spatial Map',
    alerts: 'Alert Center',
    recommendations: 'AI Recommendations',
    compensation: 'Compensation & CALA Ledger',
    legal: 'Legal & R&R Disputes',
    documents: 'Document Repository',
    analytics: 'Analytics & Reports',
    modelGov: 'Model Governance',
    audit: 'Audit Log',
    totalProjects: 'Total Projects',
    activeProjects: 'Active Projects',
    criticalRisk: 'Critical Risk',
    highRisk: 'High Risk',
    landRequired: 'Land Required (Ha)',
    landPossession: 'Possession Taken (Ha)',
    compensationPending: 'Compensation Pending',
    courtCases: 'Active Court Cases',
    viewDetails: 'View Details',
    statutoryStage: 'Statutory Acquisition Stage',
    delayProbability: 'Delay Probability',
    predictedDelay: 'Expected Delay',
    govtDirectory: 'Government Directory',
    ministersDepts: 'Ministries & Departments',
    officialContacts: 'Official Contacts',
    back: 'Back',
    previousPage: 'Previous Page',
    portalHome: 'Portal Home',
  },
  ta: {
    systemTitle: 'லேண்ட்கார்ட் AI',
    subtitle: 'நிலம் கையகப்படுத்தல் முன்கணிப்பு இடர் மேலாண்மை அமைப்பு (தென் மண்டலம்: TN, KL, PY, AP, KA)',
    govIndia: 'இந்திய அரசு | டிஜிட்டல் ஆளுகைத் தளம்',
    prototypeBadge: 'மாதிரி / அதிகாரப்பூர்வ செயல்விளக்கம்',
    portalOverview: 'தள கண்ணோட்டம்',
    adminModules: 'நிர்வாகப் பிரிவுகள்',
    dashboard: 'இடர் நுண்ணறிவு கட்டுப்பாட்டகம்',
    projects: 'திட்டங்கள் அடைவு',
    gis: 'GIS நில வரைபடம்',
    alerts: 'எச்சரிக்கை மையம்',
    recommendations: 'செயற்கை நுண்ணறிவு பரிந்துரைகள்',
    compensation: 'இழப்பீட்டுப் பதிவேடு & காலா',
    legal: 'சட்ட வழக்குகளும் மறுவாழ்வும்',
    documents: 'ஆவணக் களஞ்சியம்',
    analytics: 'பகுப்பாய்வு மற்றும் அறிக்கைகள்',
    modelGov: 'மாதிரி நிர்வாகம்',
    audit: 'தணிக்கை பதிவு',
    totalProjects: 'மொத்த திட்டங்கள்',
    activeProjects: 'செயலில் உள்ள திட்டங்கள்',
    criticalRisk: 'அதி தீவிர இடர்',
    highRisk: 'உயர் இடர்',
    landRequired: 'தேவையான நிலம் (ஹெக்டேர்)',
    landPossession: 'சுவாதீனம் பெறப்பட்டது (ஹெக்டேர்)',
    compensationPending: 'நிலுவையில் உள்ள இழப்பீடு',
    courtCases: 'செயலில் உள்ள நீதிமன்ற வழக்குகள்',
    viewDetails: 'விவரங்களைப் பார்க்க',
    statutoryStage: 'சட்டபூர்வ கையகப்படுத்தல் நிலை',
    delayProbability: 'தாமத நிகழ்தகவு',
    predictedDelay: 'எதிர்பார்க்கப்படும் தாமதம்',
    govtDirectory: 'அரசு அடைவு',
    ministersDepts: 'அமைச்சகங்களும் துறைகளும்',
    officialContacts: 'அதிகாரப்பூர்வ தொடர்புகள்',
    back: 'பின்னே (Back)',
    previousPage: 'முந்தைய பக்கம்',
    portalHome: 'முகப்பு',
  },
  hi: {
    systemTitle: 'लैंडगार्ड AI',
    subtitle: 'भूमि अधिग्रहण विलंब पूर्व चेतावनी एवं जोखिम प्रबंधन प्रणाली (दक्षिण क्षेत्र: TN, KL, PY, AP, KA)',
    govIndia: 'भारत सरकार | डिजिटल गवर्नेंस प्लेटफॉर्म',
    prototypeBadge: 'प्रोटोटाइप / आधिकारिक प्रदर्शन प्रणाली',
    portalOverview: 'पोर्टल अवलोकन',
    adminModules: 'प्रशासनिक मॉड्यूल',
    dashboard: 'जोखिम इंटेलिजेंस डैशबोर्ड',
    projects: 'परियोजना निर्देशिका',
    gis: 'जीआईएस स्थानिक मानचित्र',
    alerts: 'चेतावनी केंद्र',
    recommendations: 'एआई अनुशंसित कार्रवाइयां',
    compensation: 'मुआवजा एवं काला लेजर',
    legal: 'विधिक विवाद एवं पुनर्वास',
    documents: 'दस्तावेज़ भंडार',
    analytics: 'विश्लेषण एवं रिपोर्ट',
    modelGov: 'मॉडल गवर्नेंस',
    audit: 'ऑडिट लॉग',
    totalProjects: 'कुल परियोजनाएं',
    activeProjects: 'सक्रिय परियोजनाएं',
    criticalRisk: 'अत्यधिक गंभीर जोखिम',
    highRisk: 'उच्च जोखिम',
    landRequired: 'आवश्यक भूमि (हेक्टेयर)',
    landPossession: 'प्राप्त कब्जा (हेक्टेयर)',
    compensationPending: 'लंबित मुआवजा',
    courtCases: 'सक्रिय न्यायालय वाद',
    viewDetails: 'विवरण देखें',
    statutoryStage: 'वैधानिक अधिग्रहण चरण',
    delayProbability: 'विलंब संभावना',
    predictedDelay: 'अनुमानित विलंब',
    govtDirectory: 'सरकारी निर्देशिका',
    ministersDepts: 'मंत्रालय एवं विभाग',
    officialContacts: 'आधिकारिक संपर्क',
    back: 'पीछे (Back)',
    previousPage: 'पिछला पृष्ठ',
    portalHome: 'मुख्य पृष्ठ',
  },
  te: {
    systemTitle: 'ల్యాండ్‌గార్డ్ AI',
    subtitle: 'భూసేకరణ ముందస్తు హెచ్చరిక & ప్రమాద నిర్వహణ వ్యవస్థ (దక్షిణ ప్రాంతం: TN, KL, PY, AP, KA)',
    govIndia: 'భారత ప్రభుత్వం | డిజిటల్ గవర్నెన్స్ ప్లాట్‌ఫామ్',
    prototypeBadge: 'ప్రోటోటైప్ / అధికారిక ప్రదర్శన వ్యవస్థ',
    portalOverview: 'పోర్టల్ అవలోకనం',
    adminModules: 'పరిపాలనా విభాగాలు',
    dashboard: 'రిస్క్ ఇంటెలిజెన్స్ డాష్‌బోర్డ్',
    projects: 'ప్రాజెక్టుల జాబితా',
    gis: 'GIS స్పేషియల్ మ్యాప్',
    alerts: 'హెచ్చరిక కేంద్రం',
    recommendations: 'AI సిఫార్సులు',
    compensation: 'పరిహారం & కాళా (CALA) లెడ్జర్',
    legal: 'చట్టపరమైన & పునరావాస వివాదాలు',
    documents: 'పత్రాల నిల్వ',
    analytics: 'విశ్లేషణలు & నివేదికలు',
    modelGov: 'మోడల్ గవర్నెన్స్',
    audit: 'ఆడిట్ లాగ్',
    totalProjects: 'మొత్తం ప్రాజెక్టులు',
    activeProjects: 'క్రియాశీల ప్రాజెక్టులు',
    criticalRisk: 'అత్యంత తీవ్రమైన ప్రమాదం',
    highRisk: 'అధిక ప్రమాదం',
    landRequired: 'అవసరమైన భూమి (హెక్టార్లు)',
    landPossession: 'స్వాధీనం చేసుకున్న భూమి (హెక్టార్లు)',
    compensationPending: 'పెండింగ్‌లో ఉన్న పరిహారం',
    courtCases: 'క్రియాశీల కోర్టు కేసులు',
    viewDetails: 'వివరాలు చూడండి',
    statutoryStage: 'చట్టబద్ధ సేకరణ దశ',
    delayProbability: 'ఆలస్య సంభావ్యత',
    predictedDelay: 'అంచనా వేసిన ఆలస్యం',
    govtDirectory: 'ప్రభుత్వ డైరెక్టరీ',
    ministersDepts: 'మంత్రిత్వ శాఖలు & విభాగాలు',
    officialContacts: 'అధికారిక పరిచయాలు',
    back: 'వెనుకకు (Back)',
    previousPage: 'మునుపటి పేజీ',
    portalHome: 'హోమ్ పేజీ',
  },
  ml: {
    systemTitle: 'ലാൻഡ്ഗാർഡ് AI',
    subtitle: 'ഭൂമി ഏറ്റെടുക്കൽ മുൻകൂർ മുന്നറിയിപ്പും അപകടസാധ്യതാ മാനേജ്മെന്റും (ദക്ഷിണ മേഖല: TN, KL, PY, AP, KA)',
    govIndia: 'ഭാരത സർക്കാർ | ഡിജിറ്റൽ ഭരണ പ്ലാറ്റ്‌ഫോം',
    prototypeBadge: 'പ്രോട്ടോടൈപ്പ് / ഔദ്യോഗിക പ്രദർശന സംവിധാനം',
    portalOverview: 'പോർട്ടൽ അവലോകനം',
    adminModules: 'ഭരണ മൊഡ്യൂളുകൾ',
    dashboard: 'റിസ്ക് ഇന്റലിജൻസ് ഡാഷ്‌ബോർഡ്',
    projects: 'പദ്ധതികളുടെ ഡയറക്ടറി',
    gis: 'ജിഐഎസ് ഭൂപടം',
    alerts: 'മുന്നറിയിപ്പ് കേന്ദ്രം',
    recommendations: 'എഐ ശുപാർശകൾ',
    compensation: 'നഷ്ടപരിഹാരവും കാലാ (CALA) ലെഡ്ജറും',
    legal: 'നിയമതർക്കങ്ങളും പുനരധിവാസവും',
    documents: 'രേഖാ കലവറ',
    analytics: 'വിശകലനവും റിപ്പോർട്ടുകളും',
    modelGov: 'മോഡൽ ഭരണനിർവ്വഹണം',
    audit: 'ഓഡിറ്റ് ലോഗ്',
    totalProjects: 'ആകെ പദ്ധതികൾ',
    activeProjects: 'സജീവ പദ്ധതികൾ',
    criticalRisk: 'തീവ്രമായ അപകടസാധ്യത',
    highRisk: 'ഉയർന്ന അപകടസാധ്യത',
    landRequired: 'ആവശ്യമായ ഭൂമി (ഹെക്ടർ)',
    landPossession: 'കൈവശപ്പെടുത്തിയ ഭൂമി (ഹെക്ടർ)',
    compensationPending: 'തീർപ്പുകൽപ്പിക്കാത്ത നഷ്ടപരിഹാരം',
    courtCases: 'സജീവ കോടതി കേസുകൾ',
    viewDetails: 'വിശദാംശങ്ങൾ കാണുക',
    statutoryStage: 'നിയമപരമായ ഏറ്റെടുക്കൽ ഘട്ടം',
    delayProbability: 'കാലതാമസ സാധ്യത',
    predictedDelay: 'പ്രതീക്ഷിക്കുന്ന കാലതാമസം',
    govtDirectory: 'ഗവൺമെന്റ് ഡയറക്ടറി',
    ministersDepts: 'മന്ത്രാലയങ്ങളും വകുപ്പുകളും',
    officialContacts: 'ഔദ്യോഗിക കോൺടാക്റ്റുകൾ',
    back: 'പിന്നോട്ട് (Back)',
    previousPage: 'മുൻ പേജ്',
    portalHome: 'ഹോം പേജ്',
  },
  kn: {
    systemTitle: 'ಲ್ಯಾಂಡ್‌ಗಾರ್ಡ್ AI',
    subtitle: 'ಭೂಸ್ವಾಧೀನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಅಪಾಯ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ (ದಕ್ಷಿಣ ವಲಯ: TN, KL, PY, AP, KA)',
    govIndia: 'ಭಾರತ ಸರ್ಕಾರ | ಡಿಜಿಟಲ್ ಆಡಳಿತ ವೇದಿಕೆ',
    prototypeBadge: 'ಮಾದರಿ / ಅಧಿಕೃತ ಪ್ರದರ್ಶನ ವ್ಯವಸ್ಥೆ',
    portalOverview: 'ಪೋರ್ಟಲ್ ಅವಲೋಕನ',
    adminModules: 'ಆಡಳಿತ ಮಾಡ್ಯೂಲ್‌ಗಳು',
    dashboard: 'ಅಪಾಯ ಗುಪ್ತಚರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    projects: 'ಯೋಜನೆಗಳ ಡೈರೆಕ್ಟರಿ',
    gis: 'ಜಿಐಎಸ್ ಪ್ರಾದೇಶಿಕ ನಕ್ಷೆ',
    alerts: 'ಎಚ್ಚರಿಕೆ ಕೇಂದ್ರ',
    recommendations: 'ಎಐ ಶಿಫಾರಸುಗಳು',
    compensation: 'ಪರಿಹಾರ ಮತ್ತು ಸಿಎಎಲ್‌ಎ (CALA) ಲೆಡ್ಜರ್',
    legal: 'ಕಾನೂನು ವಿವಾದಗಳು ಮತ್ತು ಪುನರ್ವಸತಿ',
    documents: 'ದಾಖಲೆಗಳ ಭಂಡಾರ',
    analytics: 'ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವರದಿಗಳು',
    modelGov: 'ಮಾದರಿ ಆಡಳಿತ',
    audit: 'ಆಡಿಟ್ ಲಾಗ್',
    totalProjects: 'ಒಟ್ಟು ಯೋಜನೆಗಳು',
    activeProjects: 'ಸಕ್ರಿಯ ಯೋಜನೆಗಳು',
    criticalRisk: 'ಗಂಭೀರ ಅಪಾಯ',
    highRisk: 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
    landRequired: 'ಅಗತ್ಯವಿರುವ ಭೂಮಿ (ಹೆಕ್ಟೇರ್)',
    landPossession: 'ವಶಪಡಿಸಿಕೊಂಡ ಭೂಮಿ (ಹೆಕ್ಟೇರ್)',
    compensationPending: 'ಬಾಕಿ ಇರುವ ಪರಿಹಾರ',
    courtCases: 'ಸಕ್ರಿಯ ನ್ಯಾಯಾಲಯ ಪ್ರಕರಣಗಳು',
    viewDetails: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    statutoryStage: 'ಶಾಸನಬದ್ಧ ಸ್ವಾಧೀನ ಹಂತ',
    delayProbability: 'ವಿಳಂಬ ಸಂಭವನೀಯತೆ',
    predictedDelay: 'ನಿರೀಕ್ಷಿತ ವಿಳಂಬ',
    govtDirectory: 'ಸರ್ಕಾರಿ ಡೈರೆಕ್ಟರಿ',
    ministersDepts: 'ಸಚಿವಾಲಯಗಳು ಮತ್ತು ಇಲಾಖೆಗಳು',
    officialContacts: 'ಅಧಿಕೃತ ಸಂಪರ್ಕಗಳು',
    back: 'ಹಿಂದಕ್ಕೆ (Back)',
    previousPage: 'ಹಿಂದಿನ ಪುಟ',
    portalHome: 'ಮುಖಪುಟ',
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[1]); // Default to District Collector Kanchipuram
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('landguard_theme') || 'light';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('landguard_lang') || 'en';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('landguard_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('landguard_lang', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const switchUserRole = (roleId) => {
    const matched = DEMO_USERS.find(u => u.role === roleId);
    if (matched) {
      setCurrentUser(matched);
    }
  };

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        roles: ROLES_LIST,
        users: DEMO_USERS,
        switchUserRole,
        setCurrentUser,
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        t
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
