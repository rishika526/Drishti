// DRISHTI: Drishti Academy Training & Threat Recognition Hub
// Stage 4: Drishti Academy, AAR & Performance Analytics

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ACADEMY_CATEGORIES,
  ACADEMY_VIDEO_LESSONS,
  INTERACTIVE_MODULES,
  FEATURED_MODULE,
} from '../data/academyData';
import {
  AcademyCategory,
  EducationalVideoLesson,
  InteractiveLearningModule,
  AcademyProgressState,
} from '../types/academy';
import { getAcademyProgress } from '../data/sessionStore';
import { AcademyVideoModal } from '../components/academy/AcademyVideoModal';
import { InteractiveModuleModal } from '../components/academy/InteractiveModuleModal';
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle2,
  Award,
  Video,
  Search,
  Filter,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const DrishtiAcademyPage: React.FC = () => {
  const navigate = useNavigate();

  // Progress State
  const [progress, setProgress] = useState<AcademyProgressState>(() => getAcademyProgress());

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<AcademyCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Modals
  const [activeVideo, setActiveVideo] = useState<EducationalVideoLesson | null>(null);
  const [activeModule, setActiveModule] = useState<InteractiveLearningModule | null>(null);

  const refreshProgress = () => {
    setProgress(getAcademyProgress());
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  // Filtered Interactive Modules
  const filteredModules = INTERACTIVE_MODULES.filter((m) => {
    const matchesCategory =
      selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered Video Lessons
  const filteredVideos = ACADEMY_VIDEO_LESSONS.filter((v) => {
    const matchesCategory =
      selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channelName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const completedModulesCount = Object.values(progress.moduleProgress).filter((m) => m.completed).length;
  const completedVideosCount = progress.completedVideoIds.length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto select-none font-sans">
      
      {/* 1. Header & Training Overview */}
      <div className="border-b border-military-border pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-military-olive text-xs font-bold uppercase tracking-wider font-mono">
            <BookOpen className="w-4 h-4" />
            <span>Air Defense Training Doctrine // Knowledge Academy</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-military-charcoal font-sans mt-1">
            Drishti Academy
          </h2>
          <p className="text-sm text-military-steel mt-1 max-w-2xl font-sans leading-relaxed">
            Essential counter-drone fundamentals, multi-rotor aerodynamics, multi-sensor correlation doctrine, and verified video lessons from authoritative public institutions.
          </p>
        </div>

        {/* Learning Progress Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-lg bg-military-cream border border-military-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-military-olive/15 border border-military-olive/30 flex items-center justify-center text-military-olive font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-military-charcoal font-mono">
                {completedModulesCount} / {INTERACTIVE_MODULES.length} MODULES
              </div>
              <div className="text-[10px] text-military-steel font-mono">
                {completedVideosCount} / {ACADEMY_VIDEO_LESSONS.length} VIDEOS WATCHED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Continue Learning / Featured Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2A3528] to-[#1E251C] text-white border border-[#3E4C3B] shadow-military-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40 uppercase">
              Featured Academy Course
            </span>
            <span className="text-[11px] font-mono text-slate-300">
              {FEATURED_MODULE.code}
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            {FEATURED_MODULE.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {FEATURED_MODULE.description}
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {FEATURED_MODULE.durationMinutes} mins
            </span>
            <span>•</span>
            <span className="text-military-sand">{FEATURED_MODULE.difficulty} Level</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">4-Question Knowledge Quiz Included</span>
          </div>
        </div>

        <button
          onClick={() => setActiveModule(FEATURED_MODULE)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 shrink-0 z-10"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Module</span>
        </button>
      </div>

      {/* 3. Search Bar & Category Filter Chips */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-military-steel absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctrine modules, topics, or videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-military-cream border border-military-border text-xs text-military-charcoal placeholder-military-subtle focus:outline-none focus:ring-1 focus:ring-military-olive"
            />
          </div>

          <div className="text-xs text-military-steel font-mono">
            Showing {filteredModules.length} Modules & {filteredVideos.length} Video Lessons
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {ACADEMY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-military-olive text-white font-semibold shadow-military-subtle'
                  : 'bg-military-cream border border-military-border text-military-charcoal hover:bg-military-sand/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Section 1: Interactive Learning Modules (with Quizzes) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-military-border pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-military-olive" />
            <h3 className="text-lg font-bold text-military-charcoal font-sans">
              Interactive Learning Modules
            </h3>
          </div>
          <span className="text-xs text-military-steel font-mono">
            Structured Slides & Instant Evaluation Quizzes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredModules.map((mod) => {
            const modProgress = progress.moduleProgress[mod.id];
            const isCompleted = modProgress?.completed;

            return (
              <div
                key={mod.id}
                className="p-5 rounded-xl border border-military-border bg-military-cream flex flex-col justify-between transition-all hover:shadow-military-card hover:border-military-olive/70 relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-military-sand font-bold text-military-charcoal">
                      {mod.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : modProgress?.started
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isCompleted
                        ? `Passed (${modProgress.highestQuizScorePct}%)`
                        : modProgress?.started
                        ? 'In Progress'
                        : 'Not Started'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-military-charcoal font-sans">
                      {mod.title}
                    </h4>
                    <p className="text-xs text-military-steel font-sans leading-relaxed mt-1 line-clamp-3">
                      {mod.description}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-military-border/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-military-subtle font-mono block">
                      Learning Objectives
                    </span>
                    <div className="space-y-0.5">
                      {mod.objectives.slice(0, 2).map((obj, idx) => (
                        <div key={idx} className="text-[11px] text-military-charcoal flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-military-olive shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-military-border/60 flex items-center justify-between">
                  <span className="text-xs text-military-steel font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {mod.durationMinutes} mins
                  </span>

                  <button
                    onClick={() => setActiveModule(mod)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-military-olive hover:bg-military-olive-dark text-white text-xs font-bold transition-all shadow-military-subtle"
                  >
                    <span>{isCompleted ? 'Review Module' : 'Launch Module'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Section 2: Educational Video Library */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-military-border pb-2">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-military-olive" />
            <h3 className="text-lg font-bold text-military-charcoal font-sans">
              Verified Educational Video Library
            </h3>
          </div>
          <span className="text-xs text-military-steel font-mono">
            FAA, NASA, NATO & Engineering Channels
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((vid) => {
            const isCompleted = progress.completedVideoIds.includes(vid.id);

            return (
              <div
                key={vid.id}
                className="p-5 rounded-xl border border-military-border bg-military-cream flex flex-col justify-between transition-all hover:shadow-military-card hover:border-military-olive/70"
              >
                <div className="space-y-3">
                  
                  {/* Video Thumbnail Box */}
                  <div
                    onClick={() => setActiveVideo(vid)}
                    className="relative w-full h-36 bg-slate-900 rounded-lg overflow-hidden cursor-pointer group flex items-center justify-center border border-military-border"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-11 h-11 rounded-full bg-military-olive text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white">
                      {vid.duration}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-military-steel">
                      <span className="font-bold text-military-olive truncate">{vid.channelName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-military-sand text-military-charcoal text-[10px]">
                        {vid.difficulty}
                      </span>
                    </div>

                    <h4
                      onClick={() => setActiveVideo(vid)}
                      className="text-sm font-bold text-military-charcoal font-sans mt-1 line-clamp-2 cursor-pointer hover:text-military-olive transition-colors"
                    >
                      {vid.title}
                    </h4>

                    <p className="text-xs text-military-steel font-sans mt-1 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-military-border/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-military-steel">
                    {isCompleted ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : (
                      'Available'
                    )}
                  </span>

                  <button
                    onClick={() => setActiveVideo(vid)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-military-border bg-military-sand/30 hover:bg-military-sand/60 text-military-charcoal text-xs font-bold transition-colors"
                  >
                    <span>Watch Lesson</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Video Lesson Modal */}
      {activeVideo && (
        <AcademyVideoModal
          video={activeVideo}
          isCompleted={progress.completedVideoIds.includes(activeVideo.id)}
          isOpen={true}
          onClose={() => setActiveVideo(null)}
          onStatusChange={refreshProgress}
        />
      )}

      {/* Active Interactive Module Modal */}
      {activeModule && (
        <InteractiveModuleModal
          module={activeModule}
          isOpen={true}
          onClose={() => setActiveModule(null)}
          onProgressSaved={refreshProgress}
        />
      )}

    </div>
  );
};

export default DrishtiAcademyPage;
