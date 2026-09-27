import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'react-feather';
import type { Recommendation, RecommendationTone } from './rules';

const TONES: Record<RecommendationTone, string> = {
  warm: 'from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30 dark:from-amber-400/15 dark:via-orange-400/5 dark:border-amber-400/25',
  wet: 'from-sky-500/10 via-blue-500/5 to-transparent border-sky-500/30 dark:from-sky-400/15 dark:via-blue-400/5 dark:border-sky-400/25',
  cool: 'from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/30 dark:from-indigo-400/15 dark:via-purple-400/5 dark:border-indigo-400/25',
  pleasant: 'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30 dark:from-emerald-400/15 dark:via-teal-400/5 dark:border-emerald-400/25',
  neutral: 'from-slate-500/10 via-slate-500/5 to-transparent border-slate-500/30 dark:from-slate-400/15 dark:border-slate-400/25',
};

/** One-line advice; tap to expand. Give it a `key` per place so a dismissal doesn't carry over. */
const WeatherRecommendations = ({ recommendation }: { recommendation: Recommendation }) => {
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full rounded-2xl bg-linear-to-r ${TONES[recommendation.tone]} backdrop-blur-md border shadow-soft flex items-center gap-2 pr-2`}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="flex items-start sm:items-center gap-3 min-w-0 grow text-left pl-5 py-3.5 cursor-pointer"
      >
        <span className="text-xl shrink-0 select-none" aria-hidden="true">
          {recommendation.emoji}
        </span>
        <span
          className={`text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug ${expanded ? 'whitespace-normal wrap-break-word' : 'truncate'}`}
        >
          {recommendation.text}
        </span>
        <span className="text-slate-400 dark:text-slate-500 shrink-0 self-center">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-slate-600 dark:text-slate-300 shrink-0"
        aria-label="Dismiss recommendation"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
};

export default WeatherRecommendations;
