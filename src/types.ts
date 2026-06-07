/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IPTVChannel {
  id: string; // generated or actual
  name: string;
  url: string;
  logo: string;
  category: string;
  languages?: string[];
  countries?: string[];
  httpReferrer?: string;
  userAgent?: string;
}

export type IPTVTab = 'streams' | 'favorites' | 'creator';

export interface CategoryButton {
  id: string; // "All", "Sports", "Movies", "News", "Music"
  label: string;
  url: string;
}
