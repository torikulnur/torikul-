/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { IPTVChannel } from "../types";
import { Star, Play, Tv, ArrowRight, Zap, Search, SignalHigh, WifiOff } from "lucide-react";

interface ChannelListProps {
  channels: IPTVChannel[];
  currentChannel: IPTVChannel | null;
  onSelectChannel: (channel: IPTVChannel) => void;
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
}

export default function ChannelList({
  channels,
  currentChannel,
  onSelectChannel,
  favorites,
  onToggleFavorite,
  searchQuery,
  setSearchQuery,
  isLoading,
}: ChannelListProps) {
  
  // Filter channels based on Search Input locally too
  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    channel.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Shimmer skeleton items as requested: "Show a shimmering neon skeleton loader every time a new category is clicked..."
  if (isLoading) {
    return (
      <div id="shimmer-skeleton-list" className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#090e1a]/40 p-3.5 relative overflow-hidden"
          >
            {/* Shimmering logo skeleton */}
            <div className="h-12 w-12 rounded-lg shimmer-bg flex-shrink-0" />
            
            {/* Shimmering text groups */}
            <div className="flex-1 space-y-2">
              <div className="h-4.5 w-3/4 rounded shimmer-bg" />
              <div className="h-3.5 w-1/3 rounded shimmer-bg" />
            </div>

            {/* Shimmering favorite utility circle */}
            <div className="h-8 w-8 rounded-full shimmer-bg flex-shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Result Counter */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono tracking-wider text-gray-400">
          CHANNELS REGISTERED: <span className="text-[#00f0ff] font-bold">{filteredChannels.length}</span>
        </span>
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="text-[9px] font-mono text-[#ff0080]/80 hover:text-[#ff0080]"
          >
            RESET SEARCH
          </button>
        )}
      </div>

      {/* Empty States */}
      {filteredChannels.length === 0 && (
        <div className="rounded-2xl border border-white/5 bg-[#0a1020]/25 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#121b30] to-[#0a1020] border border-white/5 text-gray-400">
            <WifiOff className="h-5 w-5" />
          </div>
          <h4 className="font-display text-sm font-bold text-gray-300">NO TRANSMISSIONS SELECTED</h4>
          <p className="mt-1 text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
            We couldn't find any live channels matching your filter query. Adjust the search keyword or change categories.
          </p>
        </div>
      )}

      {/* Grid List */}
      <div id="iptv-channel-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-6">
        {filteredChannels.map((channel) => {
          const isSelected = currentChannel?.id === channel.id;
          const isFavorite = favorites.includes(channel.id);

          return (
            <div
              key={channel.id}
              id={`channel-card-${channel.id}`}
              className={`
                relative flex items-center justify-between gap-3 p-3 rounded-xl border transition-all duration-300
                ${isSelected 
                  ? "bg-[#0c152a]/80 border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.08)] scale-[1.01]" 
                  : "bg-[#090e1a]/85 border-white/5 hover:border-[#00f0ff]/20 hover:bg-[#0c152b]/55"
                }
              `}
            >
              {/* Left clickable element to Play the Channel */}
              <div 
                onClick={() => onSelectChannel(channel)}
                className="flex items-center gap-3.5 flex-1 cursor-pointer min-w-0"
              >
                {/* Logo with backup layout */}
                <div className={`
                  relative h-12 w-12 rounded-lg bg-[#03060f] border flex-shrink-0 flex items-center justify-center overflow-hidden p-1
                  ${isSelected ? "border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]" : "border-white/5"}
                `}>
                  <img 
                    src={channel.logo} 
                    alt={channel.name}
                    className="h-full w-full object-contain rounded"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback visual
                      (e.currentTarget as HTMLImageElement).src = `https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&h=100&fit=crop&q=80`;
                    }}
                  />

                  {/* Active playing badge */}
                  {isSelected && (
                    <div className="absolute right-0.5 bottom-0.5 h-2 w-2 rounded-full bg-[#00f0ff] animate-ping" />
                  )}
                </div>

                {/* Details info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] font-mono tracking-widest text-[#00f0ff] uppercase block truncate">
                      {channel.category || "General"}
                    </span>
                    <span className="text-gray-600 font-mono text-[9px]">•</span>
                    <div className="flex items-center gap-0.5 text-emerald-400 text-[8px] font-mono">
                      <SignalHigh className="h-2 w-2" /> ONLINE
                    </div>
                  </div>
                  
                  <h3 className={`text-xs md:text-sm font-bold truncate ${isSelected ? "text-[#00f0ff]" : "text-white group-hover:text-[#00f0ff]"}`}>
                    {channel.name}
                  </h3>
                </div>
              </div>

              {/* Action utilities: Play Trigger + Favorite Star toggle */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Star Favorite icon */}
                <button
                  id={`favorite-toggle-${channel.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(channel.id);
                  }}
                  className={`
                    flex h-8.5 w-8.5 items-center justify-center rounded-lg transition-transform hover:scale-115 active:scale-90 cursor-pointer
                    ${isFavorite 
                      ? "bg-[#ff0080]/10 border border-[#ff0080]/30 text-[#ff0080] shadow-[0_0_8px_rgba(255,0,128,0.15)]" 
                      : "bg-[#03060f] border border-white/5 text-gray-500 hover:text-[#ff0080] hover:bg-white/5"
                    }
                  `}
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                </button>

                {/* Quick Play Arrow icon when not active */}
                {!isSelected && (
                  <button
                    id={`play-arrow-target-${channel.id}`}
                    onClick={() => onSelectChannel(channel)}
                    className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-[#00f0ff]/5 border border-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff]/30 cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
