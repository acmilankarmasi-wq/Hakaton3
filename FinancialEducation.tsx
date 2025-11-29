// @ts-ignore
import React, { useState } from 'react';
import { Badge, LanguageCode } from '../types';
import { translations } from '../utils/translations';
// @ts-ignore
import { Trophy, Award, BookOpen, CheckCircle, Brain, Star } from 'lucide-react';

interface FinancialEducationProps {
  language: LanguageCode;
  badges: Badge[];
  onEarnBadge: (badge: Badge) => void;
}

export const FinancialEducation: React.FC<FinancialEducationProps> = ({ language, badges, onEarnBadge }) => {
  const t = translations[language];
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Sample Quiz Data (Simplified)
  const quizzes = [
    {
      id: 1,
      title: "Budgeting Basics 101",
      icon: <BookOpen className="text-blue-400" />,
      questions: [
        { q: "What is the 50/30/20 rule?", a: ["Investing strategy", "Budgeting method", "Loan term"], correct: 1 },
        { q: "Which expense is 'essential'?", a: ["Rent", "Netflix", "Dining Out"], correct: 0 },
        { q: "Emergency funds should cover?", a: ["1 week", "3-6 months", "1 year"], correct: 1 }
      ]
    },
    {
      id: 2,
      title: "Understanding Interest",
      icon: <Brain className="text-purple-400" />,
      questions: [
        { q: "APR stands for?", a: ["Annual Percentage Rate", "All Paid Returns", "Actual Price Ratio"], correct: 0 },
        { q: "Compound interest is?", a: ["Interest on principal only", "Interest on interest", "A flat fee"], correct: 1 }
      ]
    }
  ];

  const handleAnswer = (qIndex: number, aIndex: number) => {
    if (activeQuiz === null) return;
    const currentQuiz = quizzes.find(q => q.id === activeQuiz);
    if (!currentQuiz) return;

    if (aIndex === currentQuiz.questions[qIndex].correct) {
      setScore(s => s + 100);
    }
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
    // Award a badge if not already earned
    if (!badges.find(b => b.id === 'badge-novice')) {
        onEarnBadge({
            id: 'badge-novice',
            name: 'Financial Novice',
            icon: '🏆',
            description: 'Completed your first financial quiz!',
            unlocked: true
        });
    }
    setTimeout(() => {
        setActiveQuiz(null);
        setQuizCompleted(false);
        setScore(0);
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-yellow-400" />
            {t.learn}
          </h2>
          <p className="text-white/60 text-sm">Complete quizzes to earn points and badges!</p>
        </div>
        <div className="text-right">
            <div className="text-xs text-white/50 uppercase">{t.points}</div>
            <div className="text-3xl font-bold text-yellow-400">{score + (badges.length * 500)}</div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center gap-2 ${badges.find(b => b.id === 'badge-novice') ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-black/20 opacity-50'}`}>
            <div className="text-4xl">🏆</div>
            <div className="font-bold text-white text-sm">Financial Novice</div>
            <div className="text-xs text-white/50">Complete 1 Quiz</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center gap-2 bg-black/20 opacity-50">
            <div className="text-4xl">🚀</div>
            <div className="font-bold text-white text-sm">Debt Destroyer</div>
            <div className="text-xs text-white/50">Pay off 1 Loan</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center gap-2 bg-black/20 opacity-50">
            <div className="text-4xl">🐷</div>
            <div className="font-bold text-white text-sm">Super Saver</div>
            <div className="text-xs text-white/50">Save $1,000</div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center gap-2 bg-black/20 opacity-50">
            <div className="text-4xl">🎓</div>
            <div className="font-bold text-white text-sm">Scholar</div>
            <div className="text-xs text-white/50">Complete 5 Quizzes</div>
        </div>
      </div>

      {/* Quizzes List */}
      {!activeQuiz && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map(quiz => (
                <div key={quiz.id} className="bg-white/5 hover:bg-white/10 rounded-xl p-6 border border-white/10 transition-all cursor-pointer group" onClick={() => setActiveQuiz(quiz.id)}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                            {quiz.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/50">
                        <span>{quiz.questions.length} Questions</span>
                        <span className="flex items-center gap-1 text-yellow-400"><Star size={12}/> +100pts</span>
                    </div>
                    <button className="w-full mt-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-500 transition-colors">
                        {t.takeQuiz}
                    </button>
                </div>
            ))}
        </div>
      )}

      {/* Active Quiz View */}
      {activeQuiz && (
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
            {quizCompleted ? (
                <div className="text-center py-10">
                    <Trophy size={64} className="mx-auto text-yellow-400 mb-4 animate-bounce" />
                    <h2 className="text-3xl font-bold text-white mb-2">{t.congrats}</h2>
                    <p className="text-white/70 mb-6">{t.quizComplete} You earned points!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <h3 className="text-xl font-bold text-white">Question 1 of {quizzes.find(q => q.id === activeQuiz)?.questions.length}</h3>
                        <button onClick={() => setActiveQuiz(null)} className="text-white/50 hover:text-white">Exit</button>
                    </div>
                    
                    {/* Simplified for demo: just showing first question */}
                    <div>
                        <p className="text-lg text-white mb-6">{quizzes.find(q => q.id === activeQuiz)?.questions[0].q}</p>
                        <div className="space-y-3">
                            {quizzes.find(q => q.id === activeQuiz)?.questions[0].a.map((ans, idx) => (
                                <button key={idx} onClick={() => finishQuiz()} className="w-full p-4 text-left bg-white/5 hover:bg-blue-600/20 hover:border-blue-500 border border-white/10 rounded-xl text-white transition-all">
                                    {ans}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};