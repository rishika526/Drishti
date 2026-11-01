// DRISHTI: Interactive Academy Learning Module & Quiz Modal
// Stage 4: Drishti Academy, AAR & Performance Analytics

import React, { useState } from 'react';
import { InteractiveLearningModule } from '../../types/academy';
import { saveModuleProgress } from '../../data/sessionStore';
import {
  X,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Shield,
  Clock,
} from 'lucide-react';

interface InteractiveModuleModalProps {
  module: InteractiveLearningModule;
  isOpen: boolean;
  onClose: () => void;
  onProgressSaved: () => void;
}

export const InteractiveModuleModal: React.FC<InteractiveModuleModalProps> = ({
  module,
  isOpen,
  onClose,
  onProgressSaved,
}) => {
  // Mode: 'SLIDES' | 'QUIZ' | 'RESULTS'
  const [mode, setMode] = useState<'SLIDES' | 'QUIZ' | 'RESULTS'>('SLIDES');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);

  if (!isOpen) return null;

  const currentSlide = module.slides[currentSlideIndex];
  const currentQuestion = module.quiz[currentQuestionIndex];
  const totalQuestions = module.quiz.length;

  // Handle Answer Selection
  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(idx);
    setHasSubmittedAnswer(true);

    if (idx === currentQuestion.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setHasSubmittedAnswer(false);

    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Finished all questions! Compute results
      const finalScore = Math.round(((correctCount + (selectedOption === currentQuestion.correctIndex ? 0 : 0)) / totalQuestions) * 100);
      const passed = finalScore >= module.passingScorePct;
      saveModuleProgress(module.id, finalScore, passed, module.title);
      onProgressSaved();
      setMode('RESULTS');
    }
  };

  // Restart Module
  const handleRestart = () => {
    setMode('SLIDES');
    setCurrentSlideIndex(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setCorrectCount(0);
  };

  const finalScorePct = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = finalScorePct >= module.passingScorePct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col text-xs text-military-charcoal">
        
        {/* Header */}
        <div className="bg-military-charcoal text-white p-5 border-b border-military-border-dark flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-military-olive text-[10px] font-bold font-mono text-white uppercase">
                {module.code} // INTERACTIVE MODULE
              </span>
              <span className="text-[11px] text-military-sand/80 font-mono">
                {mode === 'SLIDES'
                  ? `SECTION ${currentSlideIndex + 1} OF ${module.slides.length}`
                  : mode === 'QUIZ'
                  ? `QUIZ QUESTION ${currentQuestionIndex + 1} OF ${totalQuestions}`
                  : 'MODULE EVALUATION'}
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight mt-1 font-sans">
              {module.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            title="Close Module"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* MODE 1: LESSON SLIDES */}
        {/* ----------------------------------------------------------- */}
        {mode === 'SLIDES' && (
          <>
            <div className="p-6 space-y-5 flex-1 min-h-0 overflow-y-auto">
              
              {/* Slide Title */}
              <div className="space-y-0.5 border-b border-military-border/60 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-military-olive font-mono">
                  {currentSlide.subtitle}
                </span>
                <h4 className="text-lg font-bold text-military-charcoal">
                  {currentSlide.title}
                </h4>
              </div>

              {/* Slide Paragraphs */}
              <div className="space-y-3 text-xs text-military-steel leading-relaxed font-sans font-normal">
                {currentSlide.paragraphs.map((para, idx) => (
                  <p key={idx} className="p-2.5 rounded-lg bg-military-cream border border-military-border/50 text-military-charcoal">
                    {para}
                  </p>
                ))}
              </div>

              {/* Key Takeaways */}
              <div className="p-4 rounded-xl bg-military-olive/10 border border-military-olive/30 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-military-olive font-mono flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Key Doctrinal Takeaways</span>
                </span>
                <div className="space-y-1">
                  {currentSlide.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="text-xs text-military-charcoal flex items-start gap-2">
                      <span className="text-military-olive font-bold">•</span>
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Slide Navigation Footer */}
            <div className="p-4 border-t border-military-border bg-military-sand/20 flex items-center justify-between shrink-0">
              <button
                disabled={currentSlideIndex === 0}
                onClick={() => setCurrentSlideIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded border border-military-border text-military-charcoal hover:bg-military-sand/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Section</span>
              </button>

              <div className="flex items-center gap-1.5">
                {module.slides.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentSlideIndex ? 'w-6 bg-military-olive' : 'bg-military-border'
                    }`}
                  />
                ))}
              </div>

              {currentSlideIndex + 1 < module.slides.length ? (
                <button
                  onClick={() => setCurrentSlideIndex((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded bg-military-olive hover:bg-military-olive-dark text-white font-bold transition-all shadow-military-subtle"
                >
                  <span>Next Section</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setMode('QUIZ')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white font-bold tracking-wider uppercase transition-all shadow-military-subtle animate-pulse"
                >
                  <Award className="w-4 h-4" />
                  <span>Take Knowledge Quiz</span>
                </button>
              )}
            </div>
          </>
        )}

        {/* ----------------------------------------------------------- */}
        {/* MODE 2: INTERACTIVE KNOWLEDGE QUIZ */}
        {/* ----------------------------------------------------------- */}
        {mode === 'QUIZ' && currentQuestion && (
          <>
            <div className="p-6 space-y-5 flex-1 min-h-0 overflow-y-auto">
              
              {/* Question Banner */}
              <div className="p-4 rounded-xl bg-military-sand/40 border border-military-border space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-military-olive font-mono flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                </span>
                <p className="text-sm font-bold text-military-charcoal font-sans leading-snug">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let optionStyle = 'bg-military-cream border-military-border hover:bg-military-sand/30';
                  if (hasSubmittedAnswer) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold';
                    } else if (isSelected) {
                      optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-medium';
                    } else {
                      optionStyle = 'bg-military-sand/20 border-military-border/50 opacity-60';
                    }
                  }

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          hasSubmittedAnswer && isCorrect
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : hasSubmittedAnswer && isSelected
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white border-military-border text-military-charcoal'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-xs font-sans leading-relaxed">
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Immediate Feedback Explanation Box */}
              {hasSubmittedAnswer && (
                <div
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    selectedOption === currentQuestion.correctIndex
                      ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950'
                      : 'bg-amber-50/80 border-amber-500 text-amber-950'
                  }`}
                >
                  {selectedOption === currentQuestion.correctIndex ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <span className="font-bold font-mono text-[11px] block uppercase">
                      {selectedOption === currentQuestion.correctIndex
                        ? 'Correct Assessment'
                        : 'Doctrinal Correction'}
                    </span>
                    <p className="text-xs leading-relaxed font-sans">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Quiz Footer */}
            <div className="p-4 border-t border-military-border bg-military-sand/20 flex items-center justify-between shrink-0">
              <span className="text-xs font-mono text-military-steel">
                Score: {correctCount} / {currentQuestionIndex + (hasSubmittedAnswer ? 1 : 0)}
              </span>

              {hasSubmittedAnswer && (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white font-bold tracking-wider uppercase transition-all shadow-military-subtle"
                >
                  <span>
                    {currentQuestionIndex + 1 < totalQuestions ? 'Next Question' : 'View Module Results'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        )}

        {/* ----------------------------------------------------------- */}
        {/* MODE 3: MODULE COMPLETION & QUIZ RESULTS */}
        {/* ----------------------------------------------------------- */}
        {mode === 'RESULTS' && (
          <div className="p-8 space-y-6 flex-1 min-h-0 overflow-y-auto text-center flex flex-col items-center justify-center">
            
            {/* Score Ring / Icon */}
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-lg ${
                isPassed
                  ? 'bg-emerald-100 border-emerald-600 text-emerald-800'
                  : 'bg-amber-100 border-amber-600 text-amber-800'
              }`}
            >
              {isPassed ? (
                <Award className="w-12 h-12" />
              ) : (
                <RotateCcw className="w-10 h-10" />
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-wider text-military-steel uppercase">
                {isPassed ? 'QUALIFICATION ACHIEVED' : 'RE-ASSESSMENT RECOMMENDED'}
              </span>
              <h3 className="text-2xl font-extrabold text-military-charcoal font-sans">
                {finalScorePct}% Knowledge Mastery
              </h3>
              <p className="text-xs text-military-steel max-w-md font-sans">
                {isPassed
                  ? `Congratulations! You successfully answered ${correctCount} of ${totalQuestions} questions correctly, surpassing the ${module.passingScorePct}% passing threshold.`
                  : `You scored ${correctCount} of ${totalQuestions} questions correctly. A passing score of ${module.passingScorePct}% is required for qualification. Review the lesson slides and re-attempt the quiz.`}
              </p>
            </div>

            {/* Results Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2.5 rounded border border-military-border bg-military-cream hover:bg-military-sand/40 text-military-charcoal font-bold text-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Review Lesson Slides</span>
              </button>

              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-military-subtle"
              >
                <span>Return to Academy</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
