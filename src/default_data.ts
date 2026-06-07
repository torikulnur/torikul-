/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IPTVChannel } from "./types";

export const DEFAULT_CHANNELS: IPTVChannel[] = [
  {
    id: "redbull-tv",
    name: "Red Bull TV",
    url: "https://rbmn-live.akamaized.net/hls/live/590964/sports/sports/master.m3u8",
    logo: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=100&h=100&fit=crop&q=80",
    category: "Sports"
  },
  {
    id: "nasa-tv",
    name: "NASA TV Live",
    url: "https://ntv-ateme-live.nasa.gov/hls/live/nasa_ateme_live.m3u8",
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&q=80",
    category: "News"
  },
  {
    id: "trt-world",
    name: "TRT World News",
    url: "https://trtworld.live.trt.com.tr/hls/trtworld_live.m3u8",
    logo: "https://images.unsplash.com/photo-1495020689067-958852a6565d?w=100&h=100&fit=crop&q=80",
    category: "News"
  },
  {
    id: "tears-of-steel",
    name: "Sci-Fi Theater (Tears of Steel)",
    url: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
    logo: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=100&h=100&fit=crop&q=80",
    category: "Movies"
  },
  {
    id: "deccan-music",
    name: "Deccan Music TV",
    url: "https://live.tvdeccan.com/hls/stream.m3u8",
    logo: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&q=80",
    category: "Music"
  },
  {
    id: "euronews-eng",
    name: "Euronews English",
    url: "https://euronews-eng-p3-multiplex.hexaglobe.net/playlist.m3u8",
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&q=80",
    category: "News"
  }
];
