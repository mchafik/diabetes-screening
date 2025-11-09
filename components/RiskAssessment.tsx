'use client';

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
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
    },
    fr: {
      backToList: 'Retour aux évaluations',
      submit: 'Calculer le risque',
      reset: 'Refaire le test',
      yourScore: 'Votre score',
      riskLevel: 'Niveau de risque',
      allQuestionsRequired: 'Veuillez répondre à toutes les questions',
      selectOption: 'Sélectionnez une option',
    },
    ar: {
      backToList: 'العودة إلى التقييمات',
      submit: 'حساب المخاطر',
      reset: 'إعادة الاختبار',
      yourScore: 'نتيجتك',
      riskLevel: 'مستوى المخاطر',
      allQuestionsRequired: 'يرجى الإجابة على جميع الأسئلة',
      selectOption: 'اختر خيارًا',
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

              return (
                <div key={question.id} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {qIndex + 1}. {questionText}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => {
                      const optionLabel = language === 'ar' ? option.labelAr : language === 'fr' ? option.labelFr : option.labelEn;
                      const isSelected = answers[question.id] === option.points;

                      return (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswerChange(question.id, option.points)}
                          className={`w-full p-4 rounded-lg border-2 transition-all ${isRTL ? 'text-right' : 'text-left'} ${
                            isSelected
                              ? 'border-teal-500 bg-teal-500/20'
                              : isDarkMode
                              ? 'border-slate-700 hover:border-teal-500/50 bg-slate-800'
                              : 'border-gray-300 hover:border-teal-500/50 bg-white'
                          }`}
                        >
                          {optionLabel}
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
