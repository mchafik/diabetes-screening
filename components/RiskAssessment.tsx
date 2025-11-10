'use client';

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Info } from 'lucide-react';
import { Assessment, AssessmentAnswers } from '@/types/assessment';

interface RiskAssessmentProps {
  assessment: Assessment;
  onBack: () => void;
  isDarkMode: boolean;
  language: 'en' | 'fr' | 'ar';
}

const RiskAssessment = ({ assessment, onBack, isDarkMode, language }: RiskAssessmentProps) => {
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [showBmiHelper, setShowBmiHelper] = useState(false);
  const [glycemiaValue, setGlycemiaValue] = useState('');
  const [glycemiaMeasurement, setGlycemiaMeasurement] = useState('');
  const [glycemiaInterpretation, setGlycemiaInterpretation] = useState('');
  const isRTL = language === 'ar';

  const handleAnswerChange = (questionId: string, points: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: points,
    }));
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, points) => sum + points, 0);
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === assessment.questions.length) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setGlycemiaValue('');
    setGlycemiaMeasurement('');
    setGlycemiaInterpretation('');
  };

  const getResultLevel = (score: number) => {
    return assessment.riskLevels.find(
      level => score >= level.minScore && score <= level.maxScore
    );
  };

  const getName = () => {
    if (language === 'ar') return assessment.nameAr;
    if (language === 'fr') return assessment.nameFr;
    return assessment.nameEn;
  };

  const getDescription = () => {
    if (language === 'ar') return assessment.descriptionAr;
    if (language === 'fr') return assessment.descriptionFr;
    return assessment.descriptionEn;
  };

  const translations = {
    en: {
      backToList: 'Back to assessments',
      submit: 'Calculate Risk',
      reset: 'Take test again',
      yourScore: 'Your Score',
      riskLevel: 'Risk Level',
      allQuestionsRequired: 'Please answer all questions',
      selectOption: 'Select an option',
      points: 'pts',
      bmiHelper: 'BMI Helper',
      bmiDescription: 'Use the chart below to find your BMI based on your height and weight',
      obese: 'Obese',
      overweight: 'Overweight',
      normalWeight: 'Normal Weight',
      underweight: 'Underweight',
      height: 'Height (m)',
      weight: 'Weight (kg)',
      additionalQuestions: 'Additional Questions',
      glycemiaValue: 'Blood glucose value found in g/L (Example: 1.10 g/L)',
      glycemiaMeasurement: 'Glycemia measured',
      glycemiaInterpretation: 'Interpretation',
      fastingGlycemia: 'Fasting glycemia',
      postprandialGlycemia: 'Postprandial glycemia exactly 2 hours after meal',
      randomGlycemia: 'Glycemia at any time: beyond 2 hours after meal',
      prediabetes: 'Prediabetes between 1.1 g/L and 1.26 g/L',
      fastingAbnormal: 'Fasting blood glucose ≥ 1.26 g/L',
      postprandialAbnormal: 'Postprandial glycemia ≥ 1.4 g/L',
      randomAbnormal: 'Glycemia at any time > 2 g/L',
      normal: 'Fasting or postprandial glycemia normal',
      submitFinal: 'Submit Final Assessment',
    },
    fr: {
      backToList: 'Retour aux évaluations',
      submit: 'Calculer le risque',
      reset: 'Refaire le test',
      yourScore: 'Votre score',
      riskLevel: 'Niveau de risque',
      allQuestionsRequired: 'Veuillez répondre à toutes les questions',
      selectOption: 'Sélectionnez une option',
      points: 'pts',
      bmiHelper: 'Aide IMC',
      bmiDescription: 'Utilisez le tableau ci-dessous pour trouver votre IMC',
      obese: 'Obésité',
      overweight: 'Embonpoint',
      normalWeight: 'Poids normal',
      underweight: 'Maigreur',
      height: 'Taille (m)',
      weight: 'Poids (kg)',
      additionalQuestions: 'Questions supplémentaires',
      glycemiaValue: 'Valeur de glycémie trouvée en g/L (Exemple : 1,10 g/L)',
      glycemiaMeasurement: 'Glycémie mesurée',
      glycemiaInterpretation: 'Interprétation',
      fastingGlycemia: 'Glycémie à jeun',
      postprandialGlycemia: 'Glycémie post prandiale exactement 2 heures après repas',
      randomGlycemia: 'Glycémie à n\'importe quel moment : au delà de 2 heures après repas',
      prediabetes: 'Prédiabète entre 1,1 g/L et 1,26 g/L',
      fastingAbnormal: 'GAJ ≥ 1,26 g/L',
      postprandialAbnormal: 'Glycémie Post Prandiale ≥ 1,4 g/L',
      randomAbnormal: 'Glycémie à n\'importe quel moment supérieure à 2 g/L',
      normal: 'GAJ ou GPP Normale',
      submitFinal: 'Soumettre l\'évaluation finale',
    },
    ar: {
      backToList: 'العودة إلى التقييمات',
      submit: 'حساب المخاطر',
      reset: 'إعادة الاختبار',
      yourScore: 'نتيجتك',
      riskLevel: 'مستوى المخاطر',
      allQuestionsRequired: 'يرجى الإجابة على جميع الأسئلة',
      selectOption: 'اختر خيارًا',
      points: 'نقاط',
      bmiHelper: 'مساعد مؤشر كتلة الجسم',
      bmiDescription: 'استخدم المخطط أدناه لإيجاد مؤشر كتلة جسمك',
      obese: 'سمنة',
      overweight: 'زيادة وزن',
      normalWeight: 'وزن طبيعي',
      underweight: 'نقص وزن',
      height: 'الطول (م)',
      weight: 'الوزن (كغ)',
      additionalQuestions: 'أسئلة إضافية',
      glycemiaValue: 'قيمة الجلوكوز في الدم بالجرام/لتر (مثال: 1.10 جم/لتر)',
      glycemiaMeasurement: 'قياس نسبة السكر في الدم',
      glycemiaInterpretation: 'التفسير',
      fastingGlycemia: 'نسبة السكر في الدم أثناء الصيام',
      postprandialGlycemia: 'نسبة السكر في الدم بعد الأكل بساعتين بالضبط',
      randomGlycemia: 'نسبة السكر في الدم في أي وقت: بعد ساعتين من الأكل',
      prediabetes: 'مقدمات السكري بين 1.1 و 1.26 جم/لتر',
      fastingAbnormal: 'نسبة السكر أثناء الصيام ≥ 1.26 جم/لتر',
      postprandialAbnormal: 'نسبة السكر بعد الأكل ≥ 1.4 جم/لتر',
      randomAbnormal: 'نسبة السكر في أي وقت > 2 جم/لتر',
      normal: 'نسبة السكر أثناء الصيام أو بعد الأكل طبيعية',
      submitFinal: 'إرسال التقييم النهائي',
    },
  };

  const t = translations[language];

  const score = calculateScore();
  const resultLevel = getResultLevel(score);
  const allQuestionsAnswered = Object.keys(answers).length === assessment.questions.length;

  const getRiskColor = (color: string) => {
    const colors = {
      green: isDarkMode ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-green-100 border-green-500 text-green-700',
      yellow: isDarkMode ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-yellow-100 border-yellow-500 text-yellow-700',
      orange: isDarkMode ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-orange-100 border-orange-500 text-orange-700',
      red: isDarkMode ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-red-100 border-red-500 text-red-700',
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  if (showResults && resultLevel) {
    const levelLabel = language === 'ar' ? resultLevel.labelAr : language === 'fr' ? resultLevel.labelFr : resultLevel.labelEn;
    const levelMessage = language === 'ar' ? resultLevel.messageAr : language === 'fr' ? resultLevel.messageFr : resultLevel.messageEn;

    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <button
            onClick={onBack}
            className={`mb-6 flex items-center gap-2 ${isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'} transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft size={20} />
            <span>{t.backToList}</span>
          </button>

          <div className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-2xl border shadow-xl p-8`}>
            <div className="text-center mb-8">
              <div className="mb-4">
                <CheckCircle2 size={64} className="mx-auto text-teal-400" />
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {getName()}
              </h2>
            </div>

            <div className="space-y-6">
              <div className={`p-6 rounded-xl border-2 ${getRiskColor(resultLevel.color)}`}>
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">{t.yourScore}</p>
                  <p className="text-4xl font-bold mb-4">{score}</p>
                  <p className="text-sm font-medium mb-2">{t.riskLevel}</p>
                  <p className="text-2xl font-bold mb-4">{levelLabel}</p>
                  <p className={`text-base ${isRTL ? 'text-right' : 'text-left'}`}>{levelMessage}</p>
                </div>
              </div>

              {score > 7 && (
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 ${isDarkMode ? 'border-teal-500/30' : 'border-teal-200'}`}>
                  <h3 className={`text-xl font-bold text-teal-400 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>{t.additionalQuestions}</h3>

                  <div className="space-y-6">
                    <div>
                      <label className={`block font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                        1. {t.glycemiaValue}
                      </label>
                      <input
                        type="text"
                        value={glycemiaValue}
                        onChange={(e) => setGlycemiaValue(e.target.value)}
                        placeholder="1.10"
                        className={`w-full p-3 rounded-lg border-2 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-teal-500 focus:outline-none`}
                      />
                    </div>

                    <div>
                      <label className={`block font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                        2. {t.glycemiaMeasurement}
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: 'fasting', label: t.fastingGlycemia },
                          { value: 'postprandial', label: t.postprandialGlycemia },
                          { value: 'random', label: t.randomGlycemia },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setGlycemiaMeasurement(option.value)}
                            className={`w-full p-4 rounded-lg border-2 transition-all ${isRTL ? 'text-right' : 'text-left'} ${
                              glycemiaMeasurement === option.value
                                ? 'border-teal-500 bg-teal-500/20'
                                : isDarkMode
                                ? 'border-slate-600 hover:border-teal-500/50 bg-slate-700'
                                : 'border-gray-300 hover:border-teal-500/50 bg-white'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                        3. {t.glycemiaInterpretation}
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: 'prediabetes', label: t.prediabetes },
                          { value: 'fasting_abnormal', label: t.fastingAbnormal },
                          { value: 'postprandial_abnormal', label: t.postprandialAbnormal },
                          { value: 'random_abnormal', label: t.randomAbnormal },
                          { value: 'normal', label: t.normal },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setGlycemiaInterpretation(option.value)}
                            className={`w-full p-4 rounded-lg border-2 transition-all ${isRTL ? 'text-right' : 'text-left'} ${
                              glycemiaInterpretation === option.value
                                ? 'border-teal-500 bg-teal-500/20'
                                : isDarkMode
                                ? 'border-slate-600 hover:border-teal-500/50 bg-slate-700'
                                : 'border-gray-300 hover:border-teal-500/50 bg-white'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {score > 7 && glycemiaValue && glycemiaMeasurement && glycemiaInterpretation && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-teal-500/20' : 'bg-teal-50'} border ${isDarkMode ? 'border-teal-500/50' : 'border-teal-200'}`}>
                    <p className={`text-sm font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t.glycemiaValue}: <span className="text-teal-500">{glycemiaValue} g/L</span>
                    </p>
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                      isDarkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    {t.reset}
                  </button>
                  <button
                    onClick={onBack}
                    className="flex-1 py-3 px-6 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-all"
                  >
                    {t.backToList}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-900'} ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={onBack}
          className={`mb-6 flex items-center gap-2 ${isDarkMode ? 'text-teal-400 hover:text-teal-300' : 'text-teal-600 hover:text-teal-700'} transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft size={20} />
          <span>{t.backToList}</span>
        </button>

        <div className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-2xl border shadow-xl p-8`}>
          <div className="mb-8">
            <h2 className={`text-3xl font-bold mb-2 text-teal-400 ${isRTL ? 'text-right' : 'text-left'}`}>
              {getName()}
            </h2>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} ${isRTL ? 'text-right' : 'text-left'}`}>
              {getDescription()}
            </p>
          </div>

          <div className="space-y-8">
            {assessment.questions.map((question, qIndex) => {
              const questionText = language === 'ar' ? question.textAr : language === 'fr' ? question.textFr : question.textEn;
              const isBmiQuestion = question.id === 'q9';

              return (
                <div key={question.id} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
                  <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <h3 className={`font-semibold ${isRTL ? 'text-right' : 'text-left'} flex-1`}>
                      {qIndex + 1}. {questionText}
                    </h3>
                    {isBmiQuestion && (
                      <button
                        onClick={() => setShowBmiHelper(!showBmiHelper)}
                        className={`${isRTL ? 'mr-2' : 'ml-2'} p-2 rounded-lg ${isDarkMode ? 'bg-teal-500/20 hover:bg-teal-500/30' : 'bg-teal-100 hover:bg-teal-200'} transition-all`}
                        title={t.bmiHelper}
                      >
                        <Info size={20} className="text-teal-500" />
                      </button>
                    )}
                  </div>

                  {isBmiQuestion && showBmiHelper && (
                    <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-2 ${isDarkMode ? 'border-teal-500/30' : 'border-teal-200'}`}>
                      <h4 className={`font-semibold text-teal-400 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t.bmiHelper}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t.bmiDescription}</p>

                      <div className="mb-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-red-500 rounded"></span>
                            <span>{t.obese}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-yellow-500 rounded"></span>
                            <span>{t.overweight}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-green-500 rounded"></span>
                            <span>{t.normalWeight}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 bg-orange-500 rounded"></span>
                            <span>{t.underweight}</span>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <div className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          <div className="mb-2 font-semibold">{t.weight} / {t.height}</div>
                          <table className="border-collapse w-full text-center">
                            <thead>
                              <tr>
                                <th className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}></th>
                                <th className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>1.50</th>
                                <th className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>1.60</th>
                                <th className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>1.70</th>
                                <th className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>1.80</th>
                                <th className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>1.90</th>
                                <th className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>2.00</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr><td className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>50</td><td className="border p-1 bg-green-500 text-white font-bold">22</td><td className="border p-1 bg-green-500 text-white font-bold">20</td><td className="border p-1 bg-green-500 text-white font-bold">17</td><td className="border p-1 bg-orange-500 text-white font-bold">15</td><td className="border p-1 bg-orange-500 text-white font-bold">14</td><td className="border p-1 bg-orange-500 text-white font-bold">13</td></tr>
                              <tr><td className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>60</td><td className="border p-1 bg-yellow-500 text-white font-bold">27</td><td className="border p-1 bg-green-500 text-white font-bold">23</td><td className="border p-1 bg-green-500 text-white font-bold">21</td><td className="border p-1 bg-green-500 text-white font-bold">18</td><td className="border p-1 bg-orange-500 text-white font-bold">17</td><td className="border p-1 bg-orange-500 text-white font-bold">15</td></tr>
                              <tr><td className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>70</td><td className="border p-1 bg-yellow-500 text-white font-bold">31</td><td className="border p-1 bg-yellow-500 text-white font-bold">27</td><td className="border p-1 bg-green-500 text-white font-bold">24</td><td className="border p-1 bg-green-500 text-white font-bold">22</td><td className="border p-1 bg-green-500 text-white font-bold">19</td><td className="border p-1 bg-green-500 text-white font-bold">18</td></tr>
                              <tr><td className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>80</td><td className="border p-1 bg-red-500 text-white font-bold">36</td><td className="border p-1 bg-yellow-500 text-white font-bold">31</td><td className="border p-1 bg-yellow-500 text-white font-bold">28</td><td className="border p-1 bg-yellow-500 text-white font-bold">25</td><td className="border p-1 bg-green-500 text-white font-bold">22</td><td className="border p-1 bg-green-500 text-white font-bold">20</td></tr>
                              <tr><td className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>90</td><td className="border p-1 bg-red-500 text-white font-bold">40</td><td className="border p-1 bg-red-500 text-white font-bold">35</td><td className="border p-1 bg-yellow-500 text-white font-bold">31</td><td className="border p-1 bg-yellow-500 text-white font-bold">28</td><td className="border p-1 bg-yellow-500 text-white font-bold">25</td><td className="border p-1 bg-green-500 text-white font-bold">23</td></tr>
                              <tr><td className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>100</td><td className="border p-1 bg-red-500 text-white font-bold">44</td><td className="border p-1 bg-red-500 text-white font-bold">39</td><td className="border p-1 bg-red-500 text-white font-bold">35</td><td className="border p-1 bg-yellow-500 text-white font-bold">31</td><td className="border p-1 bg-yellow-500 text-white font-bold">28</td><td className="border p-1 bg-yellow-500 text-white font-bold">25</td></tr>
                              <tr><td className={`border ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} p-1`}>110</td><td className="border p-1 bg-red-500 text-white font-bold">49</td><td className="border p-1 bg-red-500 text-white font-bold">43</td><td className="border p-1 bg-red-500 text-white font-bold">38</td><td className="border p-1 bg-red-500 text-white font-bold">34</td><td className="border p-1 bg-yellow-500 text-white font-bold">30</td><td className="border p-1 bg-yellow-500 text-white font-bold">28</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => {
                      const optionLabel = language === 'ar' ? option.labelAr : language === 'fr' ? option.labelFr : option.labelEn;
                      const isSelected = answers[question.id] === option.points;

                      return (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswerChange(question.id, option.points)}
                          className={`w-full p-4 rounded-lg border-2 transition-all flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'} ${
                            isSelected
                              ? 'border-teal-500 bg-teal-500/20'
                              : isDarkMode
                              ? 'border-slate-700 hover:border-teal-500/50 bg-slate-800'
                              : 'border-gray-300 hover:border-teal-500/50 bg-white'
                          }`}
                        >
                          <span className={`${isRTL ? 'text-right' : 'text-left'} flex-1`}>{optionLabel}</span>
                          <span className={`${isRTL ? 'mr-3' : 'ml-3'} px-3 py-1 rounded-full text-xs font-bold ${
                            isSelected
                              ? 'bg-teal-500 text-white'
                              : isDarkMode
                              ? 'bg-slate-700 text-slate-400'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {option.points} {t.points}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            {!allQuestionsAnswered && (
              <p className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.allQuestionsRequired}
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                allQuestionsAnswered
                  ? 'bg-teal-500 hover:bg-teal-600 text-white cursor-pointer'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {t.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
