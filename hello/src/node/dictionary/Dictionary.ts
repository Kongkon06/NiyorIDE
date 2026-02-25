import { Utilities } from '../utils/Utilities';

export class Dictionary {
  asmIdeaIdIdea: Map<string, string> = new Map();
  engIdeaIdIdea: Map<string, string> = new Map();
  engWrdIdWrd: Map<string, string> = new Map();
  engWrdWrdId: Map<string, string> = new Map();
  engWrdIdIdeaId: Map<string, string> = new Map();
  asmWrdIdWrd: Map<string, string> = new Map();
  asmWrdWrdId: Map<string, string> = new Map();
  asmWrdIdIdeaId: Map<string, string> = new Map();

  examples: Map<string, string[]> = new Map();
  idioms: Map<string, string[]> = new Map();
  officialWrd: [string, string][] = [];

  words: Map<string, Map<string, number>> = new Map();
  meanings: string[] = [];

  constructor() { }

  setNewEntry(line: string): void {
    const fields = line.split("\t");
    if (fields.length < 2) return;

    const word = fields[0].trim();
    if (!word) return;

    const index = this.meanings.length;

    for (let i = 1; i < fields.length; i++) {
      const trimmed = fields[i].trim();
      if (!trimmed) continue;

      if (!this.words.has(word)) {
        this.words.set(word, new Map());
      }

      const entry = this.words.get(word)!;
      if (!entry.has(trimmed)) {
        entry.set(trimmed, index);
      }
    }
  }

  setNewEntryReversed(line: string): void {
    const fields = line.split("\t");
    if (fields.length < 2) return;

    const word = fields[0].trim();
    if (!word) return;

    const index = this.meanings.length;

    for (let i = 1; i < fields.length; i++) {
      const trimmed = fields[i].trim();
      if (!trimmed || trimmed.split(" ").length > 1) continue;

      if (!this.words.has(trimmed)) {
        this.words.set(trimmed, new Map());
      }

      const entry = this.words.get(trimmed)!;
      if (!entry.has(word)) {
        entry.set(word, index);
      }
    }
  }

  hasWord(word: string): boolean {
    return this.asmWrdWrdId.has(word) || this.engWrdWrdId.has(word.toLowerCase());
  }

  getWords(): string[] {
    return Array.from(this.words.keys());
  }

  getMeanings(str: string): string[] {
    const results: string[] = [];

    if (str.trim().length === 0) return results;

    let wrdId = "";
    let ideaId = "";

    // Assamese lookup
    if (this.asmWrdWrdId.has(str)) {
      wrdId = this.asmWrdWrdId.get(str)!;
      ideaId = this.asmWrdIdIdeaId.get(wrdId) ?? "";
    }

    // English lookup (case-insensitive in original C++)
    const lower = str.toLowerCase();
    if (this.engWrdWrdId.has(lower)) {
      wrdId = this.engWrdWrdId.get(lower)!;
      ideaId = this.engWrdIdIdeaId.get(wrdId) ?? "";
    }

    if (ideaId.length === 0) return results;

    // Assamese meaning
    if (this.asmIdeaIdIdea.has(ideaId)) {
      const asmMeaning = this.asmIdeaIdIdea.get(ideaId)!;
      results.push(Utilities.getHTMLStringFromMixedHexString(asmMeaning));
    }

    // English meaning
    if (this.engIdeaIdIdea.has(ideaId)) {
      const engMeaning = this.engIdeaIdIdea.get(ideaId)!;
      results.push(engMeaning);
    }

    return results;
  }

  getIdioms(str: string): string[] {
    const results: string[] = [];
    if (str.trim().length === 0) return results;

    for (const [idiom, values] of this.idioms.entries()) {
      if (idiom.includes(str)) {
        results.push(Utilities.getHTMLStringFromMixedHexString(idiom));
        for (const a of values) {
          results.push(Utilities.getHTMLStringFromMixedHexString(a));
        }
      }
    }
    return results;
  }

  getExamples(str: string): string[] {
    const results: string[] = [];
    if (str.trim().length === 0) return results;

    if (this.asmWrdWrdId.has(str)) {
      const wrdId = this.asmWrdWrdId.get(str)!;
      if (this.examples.has(wrdId)) {
        for (const a of this.examples.get(wrdId)!) {
          results.push(Utilities.getHTMLStringFromMixedHexString(a));
        }
      }
    }
    return results;
  }

  getOfficialUse(str: string): string[] {
    const results: string[] = [];
    if (str.length === 0) return results;

    for (const [first, second] of this.officialWrd) {
      if (
        first.toLowerCase().includes(str.toLowerCase()) ||
        second.toLowerCase().includes(str.toLowerCase())
      ) {
        results.push(
          first + " " + Utilities.getHTMLStringFromMixedHexString(second)
        );
      }
    }
    return results;
  }

  getSynonyms(str: string): string[] {
    const results: string[] = [];
    const resultsEng: string[] = [];
    const resultsAsm: string[] = [];

    if (str.trim().length === 0) return results;

    let wrdId = "";
    let ideaId = "";

    // Assamese side
    if (this.asmWrdWrdId.has(str)) {
      wrdId = this.asmWrdWrdId.get(str)!;
      if (this.asmWrdIdIdeaId.has(wrdId)) {
        ideaId = this.asmWrdIdIdeaId.get(wrdId)!;
      }
    }

    // English side
    if (this.engWrdWrdId.has(str)) {
      wrdId = this.engWrdWrdId.get(str)!;
      if (this.engWrdIdIdeaId.has(wrdId)) {
        ideaId = this.engWrdIdIdeaId.get(wrdId)!;
      }
    }

    const addedAlready: Set<string> = new Set();

    // Loop over Assamese wordId→ideaId map
    for (const [asmID, id] of this.asmWrdIdIdeaId.entries()) {
      if (ideaId === id) {
        if (asmID !== wrdId && this.asmWrdIdWrd.has(asmID)) {
          const word = this.asmWrdIdWrd.get(asmID)!;
          if (!addedAlready.has(word)) {
            resultsAsm.push(
              Utilities.getHTMLStringFromMixedHexString(word)
            );
            addedAlready.add(word);
          }
        }
      }
    }

    // Loop over English wordId→ideaId map
    for (const [engID, id] of this.engWrdIdIdeaId.entries()) {
      if (ideaId === id) {
        if (engID !== wrdId && this.engWrdIdWrd.has(engID)) {
          const word = this.engWrdIdWrd.get(engID)!;
          if (!addedAlready.has(word)) {
            resultsEng.push(word);
            addedAlready.add(word);
          }
        }
      }
    }

    if (resultsAsm.length !== 0) {
      results.push(resultsAsm.join(","));
    }
    if (resultsEng.length !== 0) {
      results.push(resultsEng.join(","));
    }

    return results;
  }

}
