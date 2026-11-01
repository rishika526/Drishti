// DRISHTI: Academy Video Lesson Viewer Modal
// Stage 4: Drishti Academy, AAR & Performance Analytics

import React, { useState } from 'react';
import { EducationalVideoLesson } from '../../types/academy';
import { markVideoCompleted } from '../../data/sessionStore';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Clock,
  Shield,
  BookOpen,
  Award,
  Play,
} from 'lucide-react';

interface AcademyVideoModalProps {
  video: EducationalVideoLesson;
  isCompleted: boolean;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: () => void;
}

export const AcademyVideoModal: React.FC<AcademyVideoModalProps> = ({
  video,
  isCompleted,
  isOpen,
  onClose,
  onStatusChange,
}) => {
  const [completed, setCompleted] = useState<boolean>(isCompleted);

  if (!isOpen) return null;

  const handleMarkComplete = () => {
    markVideoCompleted(video.id, video.title);
    setCompleted(true);
    onStatusChange();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-[#FAF9F6] border border-military-border rounded-xl shadow-military-elevated overflow-hidden flex flex-col text-xs text-military-charcoal">
        
        {/* Header */}
        <div className="bg-military-charcoal text-white p-5 border-b border-military-border-dark flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-military-olive text-[10px] font-bold font-mono text-white uppercase">
                ACADEMY VIDEO LESSON
              </span>
              <span className="text-[11px] text-military-sand/80 font-mono">
                CHANNEL: {video.channelName}
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight mt-1 font-sans">
              {video.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            title="Close Lesson"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-4 flex-1 min-h-0 overflow-y-auto">
          
          {/* YouTube Embed Container */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-military-border shadow-inner">
            <iframe
              src={`${video.embedUrl}?rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Fallback YouTube External Link & Video Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            <div className="flex items-center gap-3 font-mono">
              <span className="px-2 py-0.5 rounded bg-military-sand/50 text-military-charcoal font-bold">
                {video.difficulty}
              </span>
              <span className="text-military-steel flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {video.duration}
              </span>
              <span className="text-military-olive font-semibold">
                {video.category}
              </span>
            </div>

            <a
              href={video.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-military-olive hover:text-military-olive-dark font-medium underline font-mono text-[11px]"
            >
              <span>Open on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-lg bg-military-sand/30 border border-military-border space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-military-olive font-mono block">
              Educational Abstract & Objectives
            </span>
            <p className="text-xs text-military-charcoal leading-relaxed">
              {video.description}
            </p>
          </div>

          {/* Key Topics */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-military-subtle font-mono block">
              Syllabus Competencies Covered
            </span>
            <div className="flex flex-wrap gap-1.5">
              {video.keyTopics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded bg-military-sand/50 text-military-charcoal border border-military-border text-[11px] font-mono"
                >
                  ✓ {topic}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-military-border bg-military-sand/20 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-military-border text-military-steel hover:bg-military-sand/40 hover:text-military-charcoal font-medium transition-colors"
          >
            Close Viewer
          </button>

          {!completed ? (
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-military-olive hover:bg-military-olive-dark text-white font-bold tracking-wider uppercase transition-all shadow-military-subtle"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Lesson as Completed</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold font-mono text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Lesson Completed</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
