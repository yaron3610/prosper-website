import React from 'react';
import { Search, Filter, X, Check } from 'lucide-react';
import { AgeCategory, Topic, ContentType } from '../types';
import { cn } from '../lib/utils';

interface FilterBarProps {
  selectedAges: AgeCategory[];
  setSelectedAges: (ages: AgeCategory[]) => void;
  selectedTopics: Topic[];
  setSelectedTopics: (topics: Topic[]) => void;
  selectedTypes: ContentType[];
  setSelectedTypes: (types: ContentType[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AGE_CATEGORIES: AgeCategory[] = ['Pregnancy', 'Babies (0–3)', 'Toddlers (3–6)', 'Children (6–12)', 'Adolescents (12–24)', 'Parenthood'];
const TOPICS: Topic[] = ['Normative development', 'ADHD', 'Mood disorders', 'Anxiety', 'OCD', 'Trauma', 'Other'];
const CONTENT_TYPES: ContentType[] = ['Research papers', 'Review papers', 'Editorial papers'];

export const FilterBar = ({
  selectedAges, setSelectedAges,
  selectedTopics, setSelectedTopics,
  selectedTypes, setSelectedTypes,
  searchQuery, setSearchQuery
}: FilterBarProps) => {

  const toggleFilter = <T extends string>(item: T, selected: T[], setSelected: (items: T[]) => void) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const clearAll = () => {
    setSelectedAges([]);
    setSelectedTopics([]);
    setSelectedTypes([]);
    setSearchQuery('');
  };

  const hasFilters = selectedAges.length > 0 || selectedTopics.length > 0 || selectedTypes.length > 0 || searchQuery !== '';

  return (
    <div className="bg-white/60 backdrop-blur-lg border-b border-white/30 sticky top-16 z-30 shadow-sm overflow-hidden">
      {/* Background Image Accent */}
      <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none">
        <img src="https://picsum.photos/seed/science/400/400" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col gap-6">
          {/* Row 1: Search and Age Categories */}
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search research questions..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-slate-50/50"
              />
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">
                <Filter className="w-4 h-4" />
                <span>Ages:</span>
              </div>
              {AGE_CATEGORIES.map(age => (
                <button
                  key={age}
                  onClick={() => toggleFilter(age, selectedAges, setSelectedAges)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-bold transition-all border flex items-center gap-2 min-h-[44px]",
                    selectedAges.includes(age)
                      ? "bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-100 ring-2 ring-brand-200 ring-offset-2"
                      : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                  )}
                >
                  {selectedAges.includes(age) && <Check className="w-3 h-3" />}
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Content Types */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 lg:w-24 lg:justify-end">
              <span>Types:</span>
            </div>
            {CONTENT_TYPES.map(type => (
              <button
                key={type}
                onClick={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 min-h-[44px]",
                  selectedTypes.includes(type)
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg ring-2 ring-slate-200 ring-offset-2"
                    : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                )}
              >
                {selectedTypes.includes(type) && <Check className="w-3 h-3" />}
                {type}
              </button>
            ))}
            
            {hasFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 transition-colors ml-auto p-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Row 3: Topics */}
          <div className="flex flex-wrap gap-3 items-center pt-4 border-t border-white/10">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-4">Topics:</span>
            {TOPICS.map(topic => (
              <button
                key={topic}
                onClick={() => toggleFilter(topic, selectedTopics, setSelectedTopics)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 min-h-[40px]",
                  selectedTopics.includes(topic)
                    ? "bg-brand-600 text-white border-brand-600 shadow-md ring-2 ring-brand-200 ring-offset-2"
                    : "bg-slate-50 text-slate-500 border-transparent hover:border-slate-200"
                )}
              >
                {selectedTopics.includes(topic) && <Check className="w-3 h-3" />}
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
