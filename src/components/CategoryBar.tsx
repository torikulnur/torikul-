/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, Trophy, Film, Newspaper, Music, Play } from "lucide-react";

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isLoading: boolean;
}

export const CATEGORIES_CONFIG = [
  { id: "All", label: "All Feed", icon: Grid },
  { id: "Sports", label: "Sports", icon: Trophy },
  { id: "Movies", label: "Movies", icon: Film },
  { id: "News", label: "News", icon: Newspaper },
  { id: "Music", label: "Music", icon: Music },
];

export default function CategoryBar({ 
  selectedCategory, 
  onSelectCategory, 
  isLoading 
}: CategoryBarProps) {
  return (
    <div className="space-y-2">
      {/* Label and Info */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono tracking-widest text-[#00f0ff]/80">
          // BROWSE CATEGORY TRANSMISSIONS
        </span>
        {isLoading && (
          <span className="inline-flex items-center gap-1.5 text-[9px] font-mono text-[#00f0ff] animate-pulse">
            <span className="h-1 w-1 rounded-full bg-[#00f0ff] animate-ping" />
            TUNING BEACON...
          </span>
        )}
      </div>

      {/* Horizontally scrollable category list */}
      <div id="category-scroller-container" className="relative">
        <div 
          id="category-scroller" 
          className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
        >
          {CATEGORIES_CONFIG.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                id={`category-btn-${cat.id.toLowerCase()}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-semibold
                  transition-all duration-300 transform active:scale-95 whitespace-nowrap cursor-pointer select-none
                  border border-[#00f0ff]/15 relative overflow-hidden backdrop-blur-md
                  ${isSelected 
                    ? "active bg-[#00f0ff] text-[#03060f] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.6)] font-bold" 
                    : "bg-[#0a1020]/80 text-gray-300 hover:text-[#00f0ff] hover:bg-[#121b30] hover:border-[#00f0ff]/30"
                  }
                `}
                style={isSelected ? {
                  backgroundColor: '#00f0ff',
                  color: '#03060f',
                  boxShadow: '0 0 15px rgba(0,240,255,0.6), 0 0 30px rgba(0,240,255,0.4)',
                  borderColor: '#00f0ff'
                } : undefined}
              >
                {/* Visual scanline inside button */}
                <span className="pointer-events-none absolute inset-y-0 left-0 w-[4px] bg-[#00f0ff] opacity-0" />
                
                {/* Icon indicator with scaling */}
                <IconComponent className={`h-4.5 w-4.5 transition-transform ${isSelected ? "scale-110" : ""}`} />
                
                <span>{cat.label}</span>

                {/* Cyber index dot */}
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#03060f] animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
