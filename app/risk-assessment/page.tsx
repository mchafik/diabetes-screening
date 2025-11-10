'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ClipboardList, Upload } from 'lucide-react';
import { assessments } from '@/data/assessments';
import { Assessment } from '@/types/assessment';
import RiskAssessment from '@/components/RiskAssessment';
import { useRouter } from 'next/navigation';

export default function RiskAssessmentPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr' | 'ar'>('fr');
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

  const changeLanguage = (lang: 'en' | 'fr' | 'ar') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const isRTL = language === 'ar';

  const translations = {
    en: {
      title: 'VAO Risk Assessment',
      subtitle: 'Choose how you want to complete the VAO diabetes risk assessment',
      backToHome: 'Back to Pharmacy Locator',
      fillOnline: 'Fill Online Form',
      fillOnlineDesc: 'Complete the VAO assessment form directly online',
      uploadScan: 'Upload/Scan Form',
      uploadScanDesc: 'Upload or scan a pre-filled VAO form',
      startAssessment: 'Start Assessment',
      uploadForm: 'Upload Form',
      anonymous: 'Anonymous & Confidential',
      noDataStored: 'No personal data stored',
      comingSoon: 'Coming Soon',
      uploadFeatureDesc: 'Upload feature in development - OCR processing will convert your scanned form into digital format',
    },
    fr: {
      title: 'Évaluation VAO des risques',
      subtitle: 'Choisissez comment vous souhaitez compléter l\'évaluation du risque de diabète VAO',
      backToHome: 'Retour au localisateur de pharmacies',
      fillOnline: 'Remplir le formulaire en ligne',
      fillOnlineDesc: 'Complétez le formulaire d\'évaluation VAO directement en ligne',
      uploadScan: 'Télécharger/Scanner le formulaire',
      uploadScanDesc: 'Téléchargez ou scannez un formulaire VAO pré-rempli',
      startAssessment: 'Commencer l\'évaluation',
      uploadForm: 'Télécharger le formulaire',
      anonymous: 'Anonyme et confidentiel',
      noDataStored: 'Aucune donnée personnelle stockée',
      comingSoon: 'Prochainement',
      uploadFeatureDesc: 'Fonctionnalité de téléchargement en développement - Le traitement OCR convertira votre formulaire scanné en format numérique',
    },
    ar: {
      title: 'تقييم مخاطر VAO',
      subtitle: 'اختر كيفية إكمال تقييم مخاطر السكري VAO',
      backToHome: 'العودة إلى محدد موقع الصيدليات',
      fillOnline: 'املأ النموذج عبر الإنترنت',
      fillOnlineDesc: 'أكمل نموذج تقييم VAO مباشرة عبر الإنترنت',
      uploadScan: 'تحميل / مسح النموذج',
      uploadScanDesc: 'قم بتحميل أو مسح نموذج VAO مملوء مسبقًا',
      startAssessment: 'ابدأ التقييم',
      uploadForm: 'تحميل النموذج',
      anonymous: 'مجهول وسري',
      noDataStored: 'لا يتم تخزين بيانات شخصية',
      comingSoon: 'قريباً',
      uploadFeatureDesc: 'ميزة التحميل قيد التطوير - ستقوم معالجة OCR بتحويل النموذج الممسوح ضوئيًا إلى تنسيق رقمي',
    },
  };

  const t = translations[language];

  if (selectedAssessment) {
    return (
      <RiskAssessment
        assessment={selectedAssessment}
        onBack={() => setSelectedAssessment(null)}
        isDarkMode={isDarkMode}
        language={language}
      />
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-900'} ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className={`flex items-center gap-2 ${isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'} transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft size={20} />
            <span>{t.backToHome}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                language === 'en'
                  ? 'bg-teal-500 text-white'
                  : isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('fr')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                language === 'fr'
                  ? 'bg-teal-500 text-white'
                  : isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => changeLanguage('ar')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                language === 'ar'
                  ? 'bg-teal-500 text-white'
                  : isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              AR
            </button>
          </div>
        </div>

        <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'} lg:text-center`}>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-lime-500 shadow-lg">
              <ClipboardList size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-transparent">{t.title}</h1>
          <p className={`text-lg lg:text-xl ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} mb-6 max-w-2xl mx-auto`}>
            {t.subtitle}
          </p>
          <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'} shadow-lg`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold">{t.anonymous}</span>
            <span className="text-xs opacity-60">• {t.noDataStored}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div
            className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-teal-500' : 'bg-white border-gray-200 hover:border-teal-500'} backdrop-blur-sm rounded-3xl border-2 shadow-2xl p-8 transition-all duration-300 hover:shadow-teal-500/20 hover:scale-[1.02] cursor-pointer group`}
            onClick={() => setSelectedAssessment(assessments.find(a => a.id === 'vao')!)}
          >
            <div className="mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${isDarkMode ? 'bg-teal-500/20' : 'bg-teal-50'} group-hover:scale-110 transition-transform`}>
                <ClipboardList size={32} className="text-teal-400" />
              </div>
            </div>
            <h3 className={`text-2xl lg:text-3xl font-bold mb-3 text-teal-400 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.fillOnline}
            </h3>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} mb-6 text-base leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.fillOnlineDesc}
            </p>
            <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                9 questions
              </div>
              <div className={`px-3 py-1 rounded-lg bg-teal-500/20 text-xs font-semibold text-teal-400`}>
                ~5 min
              </div>
            </div>
            <button
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg ${isDarkMode ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-teal-500 hover:bg-teal-600 text-white'} group-hover:shadow-teal-500/50`}
            >
              {t.startAssessment}
            </button>
          </div>

          <div
            className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-3xl border-2 shadow-2xl p-8 transition-all duration-300 relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-500/10 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <Upload size={32} className={`${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                </div>
              </div>
              <h3 className={`text-2xl lg:text-3xl font-bold mb-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.uploadScan}
              </h3>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'} mb-6 text-base leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.uploadScanDesc}
              </p>
              <div className="mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50'} border-2 ${isDarkMode ? 'border-amber-500/30' : 'border-amber-200'}`}>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-amber-500">{t.comingSoon}</span>
                </div>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} mb-6 italic ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.uploadFeatureDesc}
              </p>
              <button
                disabled
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all shadow-lg opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-400'}`}
              >
                {t.uploadForm}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
