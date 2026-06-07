/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Tv, 
  Search, 
  Star, 
  User, 
  Cpu, 
  Sparkles, 
  Radio, 
  HelpCircle, 
  ExternalLink,
  Flame,
  Signal,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { IPTVChannel, IPTVTab } from "./types";
import { DEFAULT_CHANNELS } from "./default_data";
import IPTVPlayer from "./components/IPTVPlayer";
import CreatorProfile from "./components/CreatorProfile";
import CategoryBar from "./components/CategoryBar";
import ChannelList from "./components/ChannelList";

export default function App() {
  const [activeTab, setActiveTab] = useState<IPTVTab>("streams");
  const [currentCategory, setCurrentCategory] = useState<string>("All");
  const [channels, setChannels] = useState<IPTVChannel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<IPTVChannel | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(" ");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState<{ text: string; type: "success" | "info" | "warning" } | null>(null);

  // Initialize favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("t_tech_iptv_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading favorites from localStorage:", e);
    }
  }, []);

  // Fetch Category Data with exact User-specified Category Buttons & fallbacks
  const fetchCategoryData = async (category: string) => {
    setIsLoading(true);
    setSearchQuery(""); // Clear search on category change
    
    let endpointUrl = "";
    switch (category) {
      case "All":
        endpointUrl = "https://api.allorigins.win/raw?url=https://iptv-org.github.io/api/streams.json";
        break;
      case "Sports":
        endpointUrl = "https://api.allorigins.win/raw?url=https://iptv-org.github.io/api/categories/sports.json";
        break;
      case "Movies":
        endpointUrl = "https://api.allorigins.win/raw?url=https://iptv-org.github.io/api/categories/movies.json";
        break;
      case "News":
        endpointUrl = "https://api.allorigins.win/raw?url=https://iptv-org.github.io/api/categories/news.json";
        break;
      case "Music":
        endpointUrl = "https://api.allorigins.win/raw?url=https://iptv-org.github.io/api/categories/music.json";
        break;
      default:
        endpointUrl = "https://api.allorigins.win/raw?url=https://iptv-org.github.io/api/streams.json";
    }

    try {
      showSystemNotice(`Accessing primary stream hub for category [${category}]...`, "info");
      
      const response = await fetch(endpointUrl);
      if (!response.ok) {
        throw new Error(`Primary channel request returned status: ${response.status}`);
      }
      
      const rawData = await response.json();
      
      if (!Array.isArray(rawData)) {
        throw new Error("Invalid schema received from primary stream hub.");
      }

      // Convert raw response back to standard IPTVChannel interface
      const mapped: IPTVChannel[] = rawData
        .slice(0, 100) // Limit to 100 channels for great high-end render speed in preview
        .map((item: any, idx: number) => {
          const name = item.name || formatChannelIdToName(item.channel) || `Channel #${idx + 1}`;
          return {
            id: `iptv-org-${idx}-${category}-${item.channel || idx}`,
            name: name,
            url: item.url,
            logo: item.logo || generateDefaultLogo(name),
            category: category,
            httpReferrer: item.http_referrer,
            userAgent: item.user_agent
          };
        })
        .filter((c: IPTVChannel) => c.url); // Must have a valid URL

      if (mapped.length === 0) {
        throw new Error("No channels detected in the primary response pool.");
      }

      // Inject default curated stable channels that match this category
      const curated = DEFAULT_CHANNELS.filter(
        (c) => category === "All" || c.category.toLowerCase().includes(category.toLowerCase())
      );

      // Unique channels list merging
      const combined = [...curated, ...mapped];
      
      setChannels(combined);
      
      // Auto-play first available channel when starting stream
      if (combined.length > 0 && !currentChannel) {
        setCurrentChannel(combined[0]);
      }
      
      showSystemNotice(`Direct link pool synced successfully! Loaded ${combined.length} channels.`, "success");
    } catch (error) {
      console.warn(`Primary IPTV URL load failed. Initializing CRITICAL FALLBACK for [${category}] category:`, error);
      showSystemNotice(`Connecting backup dataset (Foridul local repository DB)...`, "warning");

      // Critical Fallback Fetch (Loads Foridul's database inside catch block instantly)
      try {
        const fallbackResponse = await fetch("https://raw.githubusercontent.com/foridul422/IPTV-/main/channels.json");
        if (!fallbackResponse.ok) {
          throw new Error(`Foridul channels repository returned status: ${fallbackResponse.status}`);
        }
        
        const fbData = await fallbackResponse.json();
        
        if (!Array.isArray(fbData)) {
          throw new Error("Invalid backup dataset format.");
        }

        // Map and validate response structure from repository
        const fallbackMapped: IPTVChannel[] = fbData.map((item: any, idx: number) => ({
          id: `fb-${idx}-${item.name || idx}`,
          name: item.name || `TV Feed #${idx + 1}`,
          url: item.url || item.stream || "",
          logo: item.logo || item.tvg_logo || generateDefaultLogo(item.name || ""),
          category: item.category || item.group || "General",
        })).filter((c: IPTVChannel) => c.url);

        // Filter the channels locally based on selected category name case-insensitively
        let filtered: IPTVChannel[] = [];
        if (category === "All") {
          filtered = fallbackMapped;
        } else {
          const searchTag = category.toLowerCase();
          filtered = fallbackMapped.filter((channel) => {
            const hasCategoryMatch = channel.category && channel.category.toLowerCase().includes(searchTag);
            const hasNameMatch = channel.name && channel.name.toLowerCase().includes(searchTag);
            return hasCategoryMatch || hasNameMatch;
          });
        }

        // Inject default high-quality stable streams matching the category
        const curated = DEFAULT_CHANNELS.filter(
          (c) => category === "All" || c.category.toLowerCase().includes(category.toLowerCase())
        );

        const combinedFallback = [...curated, ...filtered];

        setChannels(combinedFallback);

        if (combinedFallback.length > 0 && !currentChannel) {
          setCurrentChannel(combinedFallback[0]);
        }

        showSystemNotice(`Fallback sync established! Resolved ${combinedFallback.length} channels in Category [${category}].`, "success");
      } catch (fallbackError) {
        console.error("Critical error: Backup repository also failed:", fallbackError);
        showSystemNotice("Unable to load remote datasets. Initializing local curated stream deck.", "warning");
        
        // Final ultimate recovery: load default stable channels
        const curated = DEFAULT_CHANNELS.filter(
          (c) => category === "All" || c.category.toLowerCase().includes(category.toLowerCase())
        );
        setChannels(curated);
        if (curated.length > 0 && !currentChannel) {
          setCurrentChannel(curated[0]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchCategoryData("All");
  }, []);

  // Show status feedback line in cyber terminal style
  const showSystemNotice = (msg: string, type: "success" | "info" | "warning") => {
    setNoticeMessage({ text: msg, type });
    // Keep visible for a while then auto-hide
    const timer = setTimeout(() => {
      setNoticeMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  };

  // Convert name format
  const formatChannelIdToName = (id: string): string => {
    if (!id) return "";
    return id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Generate nice logo fallback
  const generateDefaultLogo = (name: string): string => {
    const encoded = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encoded}&background=0a1020&color=00f0ff&bold=true&size=100`;
  };

  // Toggle favorite channel IDs
  const handleToggleFavorite = (channelId: string) => {
    let updated: string[] = [];
    if (favorites.includes(channelId)) {
      updated = favorites.filter((id) => id !== channelId);
      showSystemNotice("Removed channel from cyber favorites list.", "info");
    } else {
      updated = [...favorites, channelId];
      showSystemNotice("Added channel to cyber favorites list.", "success");
    }
    setFavorites(updated);
    localStorage.setItem("t_tech_iptv_favorites", JSON.stringify(updated));
  };

  // Find favorite channels based on the ID array
  const favoriteChannels = channels.filter((channel) => favorites.includes(channel.id));

  // Switch category on user click
  const handleSelectCategory = (catId: string) => {
    setCurrentCategory(catId);
    fetchCategoryData(catId);
  };

  // Smart sequential fallback: play next stream if current stream reports loading error
  const handlePlayNextFallback = () => {
    if (channels.length <= 1) return;
    const currentIndex = channels.findIndex((c) => c.id === currentChannel?.id);
    const nextIndex = (currentIndex + 1) % channels.length;
    setCurrentChannel(channels[nextIndex]);
    showSystemNotice(`Switching to backup stream: ${channels[nextIndex].name}`, "info");
  };

  return (
    <div className="min-h-screen pb-24 text-gray-100 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Absolute background graphics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/30 via-transparent to-transparent -z-10" />

      {/* Primary Container */}
      <div className="w-full max-w-lg mx-auto flex flex-col px-4 pt-4 space-y-4">
        
        {/* Floating Top Header Brand with Cyberpunk Styling */}
        <header className="flex items-center justify-between py-1.5 px-3 rounded-2xl bg-[#090e1a]/80 border border-white/5 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00f0ff] to-[#ff0080]/90 p-[1px] shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#03060f]">
                <Tv className="h-4.5 w-4.5 text-[#00f0ff] animate-pulse" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#00f0ff]" />
            </div>
            <div>
              <h1 className="font-display text-base font-black tracking-widest text-white uppercase leading-none">
                T-Tech <span className="text-[#00f0ff]">IPTV</span>
              </h1>
              <p className="text-[8px] font-mono tracking-widest text-[#00f0ff]/80 uppercase leading-none mt-0.5">
                CYBERNET ENTERTAINMENT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Indicator Lamp */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        {/* Embedded Player - Pinnable Player Component at top of viewport */}
        <section id="player-anchor" className="sticky top-2 z-35">
          <IPTVPlayer 
            currentChannel={currentChannel} 
            onPlayNextFallback={handlePlayNextFallback}
          />
        </section>

        {/* Dynamic notice overlay tracker inside terminal readout format */}
        <AnimatePresence>
          {noticeMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`
                rounded-xl p-3 border font-mono text-[10px] leading-relaxed flex items-center gap-2.5 shadow-md
                ${noticeMessage.type === "success" 
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                  : noticeMessage.type === "warning"
                  ? "bg-amber-500/5 border-amber-500/20 text-amber-300"
                  : "bg-blue-500/5 border-blue-500/20 text-blue-300"
                }
              `}
            >
              {noticeMessage.type === "success" && <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
              {noticeMessage.type === "warning" && <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />}
              {noticeMessage.type === "info" && <Cpu className="h-4 w-4 text-blue-400 flex-shrink-0 animate-spin" />}
              <span className="flex-1 uppercase">{noticeMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN BODY NAVIGATION SECTIONS */}
        <main className="space-y-4">
          <AnimatePresence mode="wait">
            
            {/* STREAMS TAB VIEW */}
            {activeTab === "streams" && (
              <motion.div
                key="streams-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Search Box Component */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    id="channel-search-box"
                    type="text"
                    placeholder="Search channel title or category matrix..."
                    value={searchQuery === " " ? "" : searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl bg-[#090e1a]/90 border border-white/5 py-3 pl-10 pr-4 font-sans text-xs text-white placeholder-gray-500 outline-hidden focus:border-[#00f0ff]/30 focus:shadow-[0_0_15px_rgba(0,240,255,0.06)]"
                  />
                  {searchQuery && searchQuery !== " " && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-[#121b30] px-2 py-0.5 text-[9px] font-mono text-[#00f0ff]"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Horizontally scrollable Category bar below the search box */}
                <CategoryBar 
                  selectedCategory={currentCategory} 
                  onSelectCategory={handleSelectCategory}
                  isLoading={isLoading}
                />

                {/* Channels Deck */}
                <ChannelList
                  channels={channels}
                  currentChannel={currentChannel}
                  onSelectChannel={setCurrentChannel}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  searchQuery={searchQuery === " " ? "" : searchQuery}
                  setSearchQuery={setSearchQuery}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {/* FAVORITES TAB VIEW */}
            {activeTab === "favorites" && (
              <motion.div
                key="favorites-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Favorites Dossier Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f0ff]/80">
                      // DIRECT SYNC FAVS
                    </span>
                    <h2 className="font-display text-lg font-bold text-white tracking-tight">
                      BOOKMARKED STREAMS
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#ff0080]/10 px-2.5 py-0.5 text-[10px] font-mono text-[#ff0080]/90 border border-[#ff0080]/20 font-bold uppercase tracking-wide">
                    {favorites.length} saved
                  </span>
                </div>

                {/* Channels Deck */}
                <ChannelList
                  channels={favoriteChannels}
                  currentChannel={currentChannel}
                  onSelectChannel={setCurrentChannel}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  searchQuery={""}
                  setSearchQuery={() => {}}
                  isLoading={false}
                />
              </motion.div>
            )}

            {/* CREATOR PROFILE TAB VIEW */}
            {activeTab === "creator" && (
              <motion.div
                key="creator-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CreatorProfile />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

      </div>

      {/* Sticky Bottom Nav Bar Tailored Specially for Mobile Devices */}
      <nav 
        id="t-tech-bottom-nav"
        className="fixed bottom-0 right-0 left-0 bg-[#060b1e]/90 border-t border-white/5 backdrop-blur-xl z-40 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-4">
          
          {/* Streams Tab Button */}
          <button
            id="nav-tab-streams"
            onClick={() => setActiveTab("streams")}
            className={`
              flex flex-col items-center justify-center flex-1 h-full py-2 transition-all cursor-pointer relative
              ${activeTab === "streams" ? "text-[#00f0ff]" : "text-gray-400 hover:text-white"}
            `}
          >
            <Radio className={`h-5 w-5 transition-transform ${activeTab === "streams" ? "scale-110" : ""}`} />
            <span className="text-[10px] font-medium mt-1 font-display tracking-wider uppercase">
              Streams
            </span>
            {activeTab === "streams" && (
              <motion.span 
                layoutId="active-indicator-dot"
                className="absolute top-0 w-8 h-0.5 bg-[#00f0ff] rounded-full shadow-[0_0_8px_rgba(0,240,255,0.8)]"
              />
            )}
          </button>

          {/* Favorites Tab Button */}
          <button
            id="nav-tab-favorites"
            onClick={() => setActiveTab("favorites")}
            className={`
              flex flex-col items-center justify-center flex-1 h-full py-2 transition-all cursor-pointer relative
              ${activeTab === "favorites" ? "text-[#ff0080]" : "text-gray-400 hover:text-white"}
            `}
          >
            <Star className={`h-5 w-5 transition-transform ${activeTab === "favorites" ? "scale-110 fill-[#ff0080]/20" : ""}`} />
            <span className="text-[10px] font-medium mt-1 font-display tracking-wider uppercase">
              Favorites
            </span>
            {activeTab === "favorites" && (
              <motion.span 
                layoutId="active-indicator-dot"
                className="absolute top-0 w-8 h-0.5 bg-[#ff0080] rounded-full shadow-[0_0_8px_rgba(255,0,128,0.8)]"
              />
            )}
          </button>

          {/* Creator tab Button */}
          <button
            id="nav-tab-creator"
            onClick={() => setActiveTab("creator")}
            className={`
              flex flex-col items-center justify-center flex-1 h-full py-2 transition-all cursor-pointer relative
              ${activeTab === "creator" ? "text-amber-400" : "text-gray-400 hover:text-white"}
            `}
          >
            <User className={`h-5 w-5 transition-transform ${activeTab === "creator" ? "scale-110" : ""}`} />
            <span className="text-[10px] font-medium mt-1 font-display tracking-wider uppercase">
              Creator
            </span>
            {activeTab === "creator" && (
              <motion.span 
                layoutId="active-indicator-dot"
                className="absolute top-0 w-8 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]"
              />
            )}
          </button>

        </div>
      </nav>
    </div>
  );
}
