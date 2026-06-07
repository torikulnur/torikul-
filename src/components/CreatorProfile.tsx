/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Facebook, Instagram, ShieldCheck, Mail, Cpu, ExternalLink, Calendar, CodeXml, Globe } from "lucide-react";

export default function CreatorProfile() {
  return (
    <div 
      id="creator-tab-view" 
      className="space-y-6 animate-fade-in px-1"
    >
      {/* Dossier Header Title */}
      <div className="flex items-center justify-between border-b border-[#00f0ff]/10 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f0ff]/85">
            // T-TECH FOUNDER PROFILE
          </span>
          <h2 className="font-display text-xl font-extrabold text-white tracking-tight uppercase">
            CREATOR DOSSIER
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-mono text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="h-3 w-3" /> VERIFIED DEVELOPER
        </div>
      </div>

      {/* Cyberpunk ID Dossier Badge */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#090e1a]/95 to-[#04070e]/95 border border-[#00f0ff]/15 p-5 shadow-[0_0_20px_rgba(0,240,255,0.05)] neon-border">
        {/* Decorative corner light accents */}
        <div className="absolute top-0 right-0 h-10 w-10 border-t-2 border-r-2 border-[#00f0ff]/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 h-10 w-10 border-b-2 border-l-2 border-[#00f0ff]/30 rounded-bl-2xl" />

        {/* Ambient background matrix grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(0,240,255,0.04),transparent)] uppercase pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
          {/* Exact HTML Block specified for Photo Profile */}
          <div 
            id="torikul-photo-container" 
            className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.25)] flex-shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {/* The model must use the exact HTML asked by the user */}
            <a href="https://ibb.co.com/sd2LqKYz" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <img 
                src="https://i.ibb.co.com/0RcPrCbv/IMG-20260608-012226.jpg" 
                alt="IMG-20260608-012226" 
                border="0"
                className="w-full h-full object-cover"
              />
            </a>
          </div>

          {/* Profile particulars next to/under image */}
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            <div>
              {/* Name: "Torikul Islam" in a bold gradient layout */}
              <h1 className="font-display text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-gray-100 to-[#00f0ff] bg-clip-text text-transparent uppercase tracking-wider">
                Torikul Islam
              </h1>
              
              {/* Tagline: "Founder & Lead Developer of T-Tech" */}
              <p className="mt-1 text-xs md:text-sm font-semibold text-[#00f0ff] font-mono tracking-wide uppercase flex items-center justify-center md:justify-start gap-1.5 neon-text-glow">
                <Cpu className="h-4 w-4 text-[#ff0080]" />
                Founder & Lead Developer of T-Tech
              </p>
            </div>

            {/* Custom Bio */}
            <div className="p-4 rounded-xl bg-[#03060f]/60 border border-white/5 font-sans text-xs md:text-sm leading-relaxed text-gray-300">
              "Hello! I'm Torikul Islam. A dedicated student with an expert-level proficiency in technology and creating complex digital solutions."
            </div>

            {/* Social links pointing EXACTLY to requested addresses */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a 
                id="facebook-connect-btn"
                href="https://www.facebook.com/share/18tpEvXJw7/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-blue-500/20 active:translate-y-0"
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook Connect</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>

              <a 
                id="instagram-connect-btn"
                href="https://www.instagram.com/torikul____islam?igsh=bno3d2wxODNyc2Mx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e1306c] to-[#f77737] px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-pink-500/20 active:translate-y-0"
              >
                <Instagram className="h-4 w-4" />
                <span>Instagram Profile</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* T-Tech Systems Overview / Digital Certifications */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#0a1020]/90 border border-white/5 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#00f0ff]/5 border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff]">
            <CodeXml className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Core Tech Stack
            </h4>
            <span className="text-xs font-bold text-white block">
              React + TypeScript
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-[#0a1020]/90 border border-white/5 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#ff0080]/5 border border-[#ff0080]/20 flex items-center justify-center text-[#ff0080]">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Global Stream
            </h4>
            <span className="text-xs font-bold text-white block">
              HLS Protocol Enabled
            </span>
          </div>
        </div>
      </div>

      {/* System info disclaimer */}
      <div className="rounded-xl bg-[#03060f] p-4 border border-[#00f0ff]/10 flex items-start gap-3">
        <Cpu className="h-5 w-5 text-[#00f0ff] flex-shrink-0 mt-0.5" />
        <div className="text-[11px] font-mono text-gray-400 leading-relaxed">
          <p className="text-white font-semibold uppercase mb-1">
            // T-TECH SYSTEM ARCHITECTURE
          </p>
          Designed for seamless entertainment delivery. For client-side IPTV streaming optimization, this client connects directly with high-performance HLS engines to decode streams in real-time. Created on June 8, 2026.
        </div>
      </div>
    </div>
  );
}
