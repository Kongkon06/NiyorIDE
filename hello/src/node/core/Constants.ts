// Constants
export const toolTipPrefix =
  `<html><head><meta charset=utf-8\"></head><body bgcolor="#8AB8E6" font size="10">`;
export const toolTipSuffix = "</body></html>";
export const CRYPTOSEED: number = 12345; // placeholder

// Struct equivalents
export class KeyFloat {
  key: string = "";
  value: number = 0;
}

export class KeyValue {
  key: string = "";
  value: string = "";
}

export class WordUnicode {
  word: string;
  unicode: string;

  constructor(word: string = "", unicode: string = "") {
    this.word = word;
    this.unicode = unicode;
  }
}

export class WordRank {
  word: string = "";
  unicode: string = "";
  rank: number = 0;
  len: number = 0;
}

export class KeyDistance {
  word: string = "";
  dist: number = 0;
}

export class StringInt {
  key: string = "";
  size: number = 0;
}

// Enums
export enum APP_STATES { F2, F3, F4 }
export enum CONFIG_STATES { C0, C1, C2, C3, C4 }

// Global-like variables (replacing extern)
export let state: APP_STATES;
export let autoMatraSetting: boolean;
export let autoCharacterFillSetting: boolean;
export let singleCharacterModeSetting: boolean;
export let hideTooltipModeSetting: boolean;

