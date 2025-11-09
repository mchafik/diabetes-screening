'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Phone, Globe, X, Sun, Moon, Menu, ClipboardList } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { fetchPharmaciesByCity } from '@/lib/pharmacyApi';
import { LIST_OF_CITIES, getCityName } from '@/data/cities';

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

const cities = LIST_OF_CITIES;

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
    const savedLanguage = localStorage.getItem('language');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage as 'en' | 'fr' | 'ar');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const changeLanguage = (lang: 'en' | 'fr' | 'ar') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = translations[language];
  const isRTL = language === 'ar';


  useEffect(() => {
    const loadPharmacies = async () => {
      setLoading(true);
      try {
        const data = await fetchPharmaciesByCity(selectedCity);
        setPharmacies(data);
      } catch (error) {
        console.error('Failed to fetch pharmacies from API:', error);
        setPharmacies([]);
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


  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-900'} ${isRTL ? 'rtl' : 'ltr'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <header className={`mb-8 lg:mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent mb-3 lg:mb-4">
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
                onClick={() => changeLanguage('en')}
                className={`px-3 py-2 rounded-lg transition-all ${language === 'en' ? 'bg-teal-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('fr')}
                className={`px-3 py-2 rounded-lg transition-all ${language === 'fr' ? 'bg-teal-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
              >
                FR
              </button>
              <button
                onClick={() => changeLanguage('ar')}
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
                          changeLanguage('en');
                          setIsMenuOpen(false);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all ${language === 'en' ? 'bg-teal-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          changeLanguage('fr');
                          setIsMenuOpen(false);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all ${language === 'fr' ? 'bg-teal-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Français
                      </button>
                      <button
                        onClick={() => {
                          changeLanguage('ar');
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
                  <option key={city.id} value={city.city}>{getCityName(city.city, language)}</option>
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
                        {getCityName(pharmacy.cityCode, language)}
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
