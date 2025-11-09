'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Phone, Globe, X, Sun, Moon, Menu, ClipboardList } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { fetchPharmaciesByCity } from '@/lib/pharmacyApi';

const PharmacyMap = dynamic(() => import('@/components/PharmacyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
    </div>
  ),
});

interface Pharmacy {
  pharmacyNameLatin: string;
  pharmacyNameArabic: string;
  cityCode: string;
  pharmacyPhone: string;
  addressLatin: string;
  addressArabic: string;
  latitude: number;
  longitude: number;
}

const MOCK_PHARMACIES: Pharmacy[] = [
  {
    pharmacyNameLatin: "Atlas Pharmacy",
    pharmacyNameArabic: "صيدلية أطلس",
    cityCode: "CASABLANCA",
    pharmacyPhone: "+212 522 123456",
    addressLatin: "123 Boulevard Mohammed V, Casablanca",
    addressArabic: "123 شارع محمد الخامس، الدار البيضاء",
    latitude: 33.5898,
    longitude: -7.6187
  },
  {
    pharmacyNameLatin: "Sahara Health Pharmacy",
    pharmacyNameArabic: "صيدلية الصحراء",
    cityCode: "CASABLANCA",
    pharmacyPhone: "+212 522 234567",
    addressLatin: "45 Rue Allal Ben Abdellah, Casablanca",
    addressArabic: "45 شارع علال بن عبد الله، الدار البيضاء",
    latitude: 33.5731,
    longitude: -7.5898
  },
  {
    pharmacyNameLatin: "Marrakech Central Pharmacy",
    pharmacyNameArabic: "صيدلية مراكش المركزية",
    cityCode: "MARRAKECH",
    pharmacyPhone: "+212 524 345678",
    addressLatin: "78 Avenue Mohammed VI, Marrakech",
    addressArabic: "78 شارع محمد السادس، مراكش",
    latitude: 31.6295,
    longitude: -7.9811
  },
  {
    pharmacyNameLatin: "Jemaa El-Fna Pharmacy",
    pharmacyNameArabic: "صيدلية جامع الفنا",
    cityCode: "MARRAKECH",
    pharmacyPhone: "+212 524 456789",
    addressLatin: "12 Place Jemaa el-Fna, Marrakech",
    addressArabic: "12 ساحة جامع الفنا، مراكش",
    latitude: 31.6258,
    longitude: -7.9891
  },
  {
    pharmacyNameLatin: "Rabat Capital Pharmacy",
    pharmacyNameArabic: "صيدلية الرباط العاصمة",
    cityCode: "RABAT",
    pharmacyPhone: "+212 537 567890",
    addressLatin: "234 Avenue Hassan II, Rabat",
    addressArabic: "234 شارع الحسن الثاني، الرباط",
    latitude: 34.0209,
    longitude: -6.8416
  },
  {
    pharmacyNameLatin: "Agdal Pharmacy",
    pharmacyNameArabic: "صيدلية أكدال",
    cityCode: "RABAT",
    pharmacyPhone: "+212 537 678901",
    addressLatin: "56 Rue Ibn Sina, Agdal, Rabat",
    addressArabic: "56 شارع ابن سينا، أكدال، الرباط",
    latitude: 33.9716,
    longitude: -6.8498
  },
  {
    pharmacyNameLatin: "Fes Medina Pharmacy",
    pharmacyNameArabic: "صيدلية فاس المدينة",
    cityCode: "FES",
    pharmacyPhone: "+212 535 789012",
    addressLatin: "89 Boulevard Moulay Youssef, Fes",
    addressArabic: "89 شارع مولاي يوسف، فاس",
    latitude: 34.0181,
    longitude: -5.0078
  },
  {
    pharmacyNameLatin: "Boujeloud Pharmacy",
    pharmacyNameArabic: "صيدلية باب بوجلود",
    cityCode: "FES",
    pharmacyPhone: "+212 535 890123",
    addressLatin: "23 Bab Boujeloud, Fes",
    addressArabic: "23 باب بوجلود، فاس",
    latitude: 34.0633,
    longitude: -4.9746
  },
  {
    pharmacyNameLatin: "Tangier Port Pharmacy",
    pharmacyNameArabic: "صيدلية ميناء طنجة",
    cityCode: "TANGIER",
    pharmacyPhone: "+212 539 901234",
    addressLatin: "101 Avenue d'Espagne, Tangier",
    addressArabic: "101 شارع إسبانيا، طنجة",
    latitude: 35.7595,
    longitude: -5.8340
  },
  {
    pharmacyNameLatin: "Kasbah Pharmacy",
    pharmacyNameArabic: "صيدلية القصبة",
    cityCode: "TANGIER",
    pharmacyPhone: "+212 539 012345",
    addressLatin: "45 Place de la Kasbah, Tangier",
    addressArabic: "45 ساحة القصبة، طنجة",
    latitude: 35.7847,
    longitude: -5.8119
  },
  {
    pharmacyNameLatin: "Agadir Bay Pharmacy",
    pharmacyNameArabic: "صيدلية خليج أكادير",
    cityCode: "AGADIR",
    pharmacyPhone: "+212 528 123456",
    addressLatin: "67 Boulevard du 20 Août, Agadir",
    addressArabic: "67 شارع 20 أغسطس، أكادير",
    latitude: 30.4278,
    longitude: -9.5981
  },
  {
    pharmacyNameLatin: "Souss Pharmacy",
    pharmacyNameArabic: "صيدلية سوس",
    cityCode: "AGADIR",
    pharmacyPhone: "+212 528 234567",
    addressLatin: "34 Avenue Hassan II, Agadir",
    addressArabic: "34 شارع الحسن الثاني، أكادير",
    latitude: 30.4202,
    longitude: -9.5982
  },
  {
    pharmacyNameLatin: "Meknes Imperial Pharmacy",
    pharmacyNameArabic: "صيدلية مكناس الإمبراطورية",
    cityCode: "MEKNES",
    pharmacyPhone: "+212 535 345678",
    addressLatin: "12 Avenue Mohammed V, Meknes",
    addressArabic: "12 شارع محمد الخامس، مكناس",
    latitude: 33.8935,
    longitude: -5.5473
  },
  {
    pharmacyNameLatin: "Oujda East Pharmacy",
    pharmacyNameArabic: "صيدلية وجدة الشرقية",
    cityCode: "OUJDA",
    pharmacyPhone: "+212 536 456789",
    addressLatin: "88 Boulevard Derfoufi, Oujda",
    addressArabic: "88 شارع درفوفي، وجدة",
    latitude: 34.6814,
    longitude: -1.9086
  },
  {
    pharmacyNameLatin: "Tetouan Plaza Pharmacy",
    pharmacyNameArabic: "صيدلية تطوان بلازا",
    cityCode: "TETOUAN",
    pharmacyPhone: "+212 539 567890",
    addressLatin: "56 Avenue Mohammed V, Tetouan",
    addressArabic: "56 شارع محمد الخامس، تطوان",
    latitude: 35.5889,
    longitude: -5.3626
  },
  {
    pharmacyNameLatin: "Kenitra Marina Pharmacy",
    pharmacyNameArabic: "صيدلية القنيطرة المارينا",
    cityCode: "KENITRA",
    pharmacyPhone: "+212 537 678901",
    addressLatin: "23 Avenue Hassan II, Kenitra",
    addressArabic: "23 شارع الحسن الثاني، القنيطرة",
    latitude: 34.2610,
    longitude: -6.5802
  },
  {
    pharmacyNameLatin: "Beni Mellal Center Pharmacy",
    pharmacyNameArabic: "صيدلية بني ملال المركز",
    cityCode: "BENI_MELLAL",
    pharmacyPhone: "+212 523 789012",
    addressLatin: "45 Boulevard Mohammed VI, Beni Mellal",
    addressArabic: "45 شارع محمد السادس، بني ملال",
    latitude: 32.3394,
    longitude: -6.3498
  },
  {
    pharmacyNameLatin: "El Jadida Coastal Pharmacy",
    pharmacyNameArabic: "صيدلية الجديدة الساحلية",
    cityCode: "EL_JADIDA",
    pharmacyPhone: "+212 523 890123",
    addressLatin: "78 Avenue Mohammed V, El Jadida",
    addressArabic: "78 شارع محمد الخامس، الجديدة",
    latitude: 33.2316,
    longitude: -8.5007
  },
  {
    pharmacyNameLatin: "Nador Mediterranean Pharmacy",
    pharmacyNameArabic: "صيدلية الناظور المتوسطية",
    cityCode: "NADOR",
    pharmacyPhone: "+212 536 901234",
    addressLatin: "90 Boulevard Youssef Ben Tachfine, Nador",
    addressArabic: "90 شارع يوسف بن تاشفين، الناظور",
    latitude: 35.1681,
    longitude: -2.9332
  },
  {
    pharmacyNameLatin: "Safi Harbor Pharmacy",
    pharmacyNameArabic: "صيدلية ميناء آسفي",
    cityCode: "SAFI",
    pharmacyPhone: "+212 524 012345",
    addressLatin: "34 Rue de la Marine, Safi",
    addressArabic: "34 شارع البحرية، آسفي",
    latitude: 32.2994,
    longitude: -9.2372
  }
];

const translations = {
  en: {
    title: "Diabetic Screening",
    subtitle: "Find pharmacies offering diabetic screening services across Morocco",
    searchPlaceholder: "Search pharmacies...",
    filterCity: "Filter by City",
    allCities: "All Cities",
    resultsCount: "pharmacies found",
    phone: "Phone",
    selectOnMap: "Click to view on map",
    noResults: "No pharmacies found",
    loading: "Loading pharmacies...",
    riskAssessment: "Risk Assessment"
  },
  fr: {
    title: "Dépistage Diabétique",
    subtitle: "Trouvez des pharmacies offrant des services de dépistage diabétique au Maroc",
    searchPlaceholder: "Rechercher des pharmacies...",
    filterCity: "Filtrer par Ville",
    allCities: "Toutes les Villes",
    resultsCount: "pharmacies trouvées",
    phone: "Téléphone",
    selectOnMap: "Cliquez pour voir sur la carte",
    noResults: "Aucune pharmacie trouvée",
    loading: "Chargement des pharmacies...",
    riskAssessment: "Évaluation des risques"
  },
  ar: {
    title: "فحص السكري",
    subtitle: "ابحث عن الصيدليات التي تقدم خدمات فحص السكري في جميع أنحاء المغرب",
    searchPlaceholder: "ابحث عن الصيدليات...",
    filterCity: "تصفية حسب المدينة",
    allCities: "كل المدن",
    resultsCount: "صيدلية وجدت",
    phone: "الهاتف",
    selectOnMap: "انقر للعرض على الخريطة",
    noResults: "لم يتم العثور على صيدليات",
    loading: "جاري تحميل الصيدليات...",
    riskAssessment: "تقييم المخاطر"
  }
};

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'fr' | 'ar'>('fr');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('CASABLANCA');
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const t = translations[language];
  const isRTL = language === 'ar';

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(MOCK_PHARMACIES.map(p => p.cityCode)));
    return uniqueCities.sort();
  }, []);

  useEffect(() => {
    const loadPharmacies = async () => {
      setLoading(true);
      try {
        const data = await fetchPharmaciesByCity(selectedCity);
        setPharmacies(data);
      } catch (error) {
        console.error('Failed to fetch pharmacies from API, using fallback data:', error);
        const filtered = MOCK_PHARMACIES.filter(p => p.cityCode === selectedCity);
        setPharmacies(filtered);
      } finally {
        setLoading(false);
      }
    };

    loadPharmacies();
  }, [selectedCity]);

  const filteredPharmacies = useMemo(() => {
    if (!searchQuery) return pharmacies;

    const query = searchQuery.toLowerCase();
    return pharmacies.filter(pharmacy => {
      if (language === 'ar') {
        return pharmacy.pharmacyNameArabic.toLowerCase().includes(query) ||
               pharmacy.addressArabic.toLowerCase().includes(query);
      } else {
        return pharmacy.pharmacyNameLatin.toLowerCase().includes(query) ||
               pharmacy.addressLatin.toLowerCase().includes(query);
      }
    });
  }, [pharmacies, searchQuery, language]);

  const getPharmacyName = (pharmacy: Pharmacy) => {
    return language === 'ar' ? pharmacy.pharmacyNameArabic : pharmacy.pharmacyNameLatin;
  };

  const getAddress = (pharmacy: Pharmacy) => {
    return language === 'ar' ? pharmacy.addressArabic : pharmacy.addressLatin;
  };

  const formatCityName = (cityCode: string) => {
    return cityCode.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-900'} ${isRTL ? 'rtl' : 'ltr'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <header className={`mb-8 lg:mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent mb-2">
                {t.title}
              </h1>
              <p className={`text-sm lg:text-base ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{t.subtitle}</p>
            </div>

            <div className="hidden lg:flex gap-2">
              <button
                onClick={() => router.push('/risk-assessment')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${isDarkMode ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
              >
                <ClipboardList size={18} />
                <span className="font-medium">{t.riskAssessment}</span>
              </button>
              <button
                onClick={toggleDarkMode}
                className={`px-3 py-2 rounded-lg transition-all ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-2 rounded-lg transition-all ${language === 'en' ? 'bg-teal-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-2 rounded-lg transition-all ${language === 'fr' ? 'bg-teal-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-3 py-2 rounded-lg transition-all ${language === 'ar' ? 'bg-teal-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
              >
                العربية
              </button>
            </div>

            <div className="lg:hidden relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
              >
                <Menu size={24} />
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl shadow-2xl p-4 z-50 min-w-[200px]`}>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          router.push('/risk-assessment');
                          setIsMenuOpen(false);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium`}
                      >
                        <ClipboardList size={18} />
                        <span>{t.riskAssessment}</span>
                      </button>

                      <div className={`text-xs font-semibold mb-1 mt-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Theme</div>
                      <button
                        onClick={() => {
                          toggleDarkMode();
                          setIsMenuOpen(false);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                      </button>

                      <div className={`text-xs font-semibold mb-1 mt-3 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Language</div>
                      <button
                        onClick={() => {
                          setLanguage('en');
                          setIsMenuOpen(false);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all ${language === 'en' ? 'bg-teal-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('fr');
                          setIsMenuOpen(false);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all ${language === 'fr' ? 'bg-teal-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Français
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('ar');
                          setIsMenuOpen(false);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all ${language === 'ar' ? 'bg-teal-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        العربية
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:hidden mb-4">
            <button
              onClick={() => router.push('/risk-assessment')}
              className={`w-full py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ClipboardList size={20} />
              <span>{t.riskAssessment}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`relative ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all`}
              />
            </div>

            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={`w-full ${isRTL ? 'pr-4 pl-10' : 'pl-4 pr-10'} py-3 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{formatCityName(city)}</option>
                ))}
              </select>
              <div className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} pointer-events-none`}>
                <Globe size={20} />
              </div>
            </div>
          </div>

        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="h-[600px] lg:h-[700px] overflow-hidden flex flex-col">
            <h2 className={`text-xl font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {loading ? t.loading : `${filteredPharmacies.length} ${t.resultsCount}`}
            </h2>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
                </div>
              ) : filteredPharmacies.length === 0 ? (
                <div className={`flex flex-col items-center justify-center h-full ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  <Search size={48} className="mb-4 opacity-50" />
                  <p>{t.noResults}</p>
                </div>
              ) : (
                filteredPharmacies.map((pharmacy, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPharmacy(pharmacy)}
                    className={`p-4 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-teal-500' : 'bg-white border-gray-200 hover:border-teal-500'} rounded-xl border transition-all cursor-pointer group shadow-lg ${
                      selectedPharmacy === pharmacy ? (isDarkMode ? 'border-teal-500 bg-slate-900' : 'border-teal-500 bg-teal-50') : ''
                    } ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <div className={`flex items-start justify-between mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <h3 className="text-lg font-semibold text-teal-400 group-hover:text-teal-300 transition-colors">
                        {getPharmacyName(pharmacy)}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-lime-500/20 text-lime-400 rounded-lg whitespace-nowrap ml-2">
                        {formatCityName(pharmacy.cityCode)}
                      </span>
                    </div>

                    <div className={`flex items-start gap-2 mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} text-sm ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <MapPin size={16} className={`mt-1 flex-shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                      <span>{getAddress(pharmacy)}</span>
                    </div>

                    <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Phone size={16} className="flex-shrink-0" />
                      <span dir="ltr">{pharmacy.pharmacyPhone}</span>
                    </div>

                    <div className={`mt-3 text-xs text-teal-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t.selectOnMap} →
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-2xl border shadow-xl h-[600px] lg:h-[700px] overflow-hidden relative`}>
            <PharmacyMap
              pharmacies={filteredPharmacies}
              selectedPharmacy={selectedPharmacy}
              onPharmacySelect={setSelectedPharmacy}
              isDarkMode={isDarkMode}
              language={language}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(20, 184, 166, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 184, 166, 0.7);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
