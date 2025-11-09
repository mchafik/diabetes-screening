'use client';

import React, { useState } from 'react';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { assessments } from '@/data/assessments';
import { Assessment } from '@/types/assessment';
import RiskAssessment from '@/components/RiskAssessment';
import { useRouter } from 'next/navigation';

export default function RiskAssessmentPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'en' | 'fr' | 'ar'>('en');
  const router = useRouter();

  const isRTL = language === 'ar';

  const translations = {
    en: {
      title: 'Risk Assessment',
      subtitle: 'Choose a diabetes risk assessment test',
      backToHome: 'Back to Pharmacy Locator',
      selectTest: 'Select Test',
      anonymous: 'Anonymous & Confidential',
      noDataStored: 'No personal data stored',
    },
    fr: {
      title: 'Évaluation des risques',
      subtitle: 'Choisissez un test d\'évaluation du risque de diabète',
      backToHome: 'Retour au localisateur de pharmacies',
      selectTest: 'Sélectionner le test',
      anonymous: 'Anonyme et confidentiel',
      noDataStored: 'Aucune donnée personnelle stockée',
    },
    ar: {
      title: 'تقييم المخاطر',
      subtitle: 'اختر اختبار تقييم خطر الإصابة بالسكري',
      backToHome: 'العودة إلى محدد موقع الصيدليات',
      selectTest: 'اختر الاختبار',
      anonymous: 'مجهول وسري',
      noDataStored: 'لا يتم تخزين بيانات شخصية',
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
              onClick={() => setLanguage('en')}
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
              onClick={() => setLanguage('fr')}
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
              onClick={() => setLanguage('ar')}
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

        <div className="text-center mb-12">
          <div className="mb-4">
            <ClipboardList size={64} className="mx-auto text-teal-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-teal-400">{t.title}</h1>
          <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} mb-4`}>
            {t.subtitle}
          </p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">{t.anonymous}</span>
            <span className="text-xs opacity-60">• {t.noDataStored}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assessments.map((assessment) => {
            const name = language === 'ar' ? assessment.nameAr : language === 'fr' ? assessment.nameFr : assessment.nameEn;
            const description = language === 'ar' ? assessment.descriptionAr : language === 'fr' ? assessment.descriptionFr : assessment.descriptionEn;

            return (
              <div
                key={assessment.id}
                className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-teal-500' : 'bg-white border-gray-200 hover:border-teal-500'} backdrop-blur-sm rounded-2xl border shadow-xl p-6 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer`}
                onClick={() => setSelectedAssessment(assessment)}
              >
                <div className="mb-4">
                  <ClipboardList size={48} className="text-teal-400" />
                </div>
                <h3 className={`text-xl font-bold mb-2 text-teal-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {name}
                </h3>
                <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} mb-4 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                  {description}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {assessment.questions.length} questions
                </p>
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                    isDarkMode
                      ? 'bg-teal-500 hover:bg-teal-600 text-white'
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                >
                  {t.selectTest}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
