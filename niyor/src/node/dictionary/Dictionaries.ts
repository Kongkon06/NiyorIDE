import { Dictionary } from './Dictionary';

export class Dictionaries {

  static dictionaries: Dictionaries;

  public assamese: Dictionary;
  public english: Dictionary;
  public assamesePoribhasha: Dictionary;
  public englishPoribhasha: Dictionary;
  static assamese: Dictionary;
  static english: Dictionary;
  static assamesePoribhasha: Dictionary;
  static englishPoribhasha: Dictionary;

  constructor() {
    this.assamese = new Dictionary();
    this.english = new Dictionary();
    this.assamesePoribhasha = new Dictionary();
    this.englishPoribhasha = new Dictionary();

  }

  static getDictionaries(): Dictionaries {
    if (Dictionaries.dictionaries == null) {
      Dictionaries.dictionaries = new Dictionaries();
    }

    return Dictionaries.dictionaries;
  }

  static getDictionary(i: number): Dictionary {
    switch (i) {
      case 0: return this.assamese;
      case 1: return this.english;
      case 2: return this.assamesePoribhasha;
      case 3: return this.englishPoribhasha;
      default: return this.assamese;
    }
  }
  loadAssameseEnglishDictionaries(
    IdeasFile: string,
    engWrdIdFile: string,
    asmWrdIdFile: string,
    examplesFile: string,
    idiomsFile: string,
    poribhashaFile: string
  ): void {
    let i = 0;

    // --- Ideas File ---
    const ideasLines = IdeasFile.split(/\r?\n/);
    for (const line of ideasLines) {
      const fields = line.split("\t");
      if (fields.length >= 3) {
        this.assamese.asmIdeaIdIdea.set(fields[0], fields[2]);
        this.assamese.engIdeaIdIdea.set(fields[0].toLowerCase(), fields[1]);
        i++;
      }
    }
    console.log(`Number of lines inserted from ${IdeasFile}: ${i}`);

    // --- engWrdIdFile ---
    i = 0;
    const engLines = engWrdIdFile.split(/\r?\n/);
    for (const line of engLines) {
      const fields = line.split("\t");
      if (fields.length >= 3) {
        this.assamese.engWrdIdWrd.set(fields[0], fields[1]);
        this.assamese.engWrdWrdId.set(fields[1], fields[0]);
        this.assamese.engWrdIdIdeaId.set(fields[0], fields[2]);
        i++;
      }
    }
    console.log(`Number of lines inserted from ${engWrdIdFile}: ${i}`);

    // --- asmWrdIdFile ---
    i = 0;
    const asmLines = asmWrdIdFile.split(/\r?\n/);
    for (const line of asmLines) {
      const fields = line.split("\t");
      if (fields.length >= 3) {
        this.assamese.asmWrdIdWrd.set(fields[0], fields[1]);
        this.assamese.asmWrdWrdId.set(fields[1], fields[0]);
        this.assamese.asmWrdIdIdeaId.set(fields[0], fields[2]);
        i++;
      }
    }
    console.log(`Number of lines inserted from ${asmWrdIdFile}: ${i}`);

    // --- examplesFile (compressed) ---
    i = 0;
    try {
      // Read file directly as UTF-8 text (no decompression)
      const lines = examplesFile.split(/\r?\n/);

      for (const line of lines) {
        const fields = line.split("\t");
        if (fields.length >= 2) {
          const unicodefield0 = fields[0];
          if (this.assamese.asmWrdWrdId.has(unicodefield0)) {
            const wordId = this.assamese.asmWrdWrdId.get(unicodefield0)!;
            if (!this.assamese.examples.has(wordId)) {
              this.assamese.examples.set(wordId, []);
            }
            this.assamese.examples.get(wordId)!.push(fields[1]);
            i++;
          }
        }
      }
    } catch (e) {
      console.error(`Failed to read examples file: ${examplesFile}`, e);
    }

    console.log(`Number of lines inserted from ${examplesFile}: ${i}`);


    // --- idiomsFile ---
    i = 0;
    const idiomLines = idiomsFile.split(/\r?\n/);
    for (const line of idiomLines) {
      const fields = line.split("\t");
      if (fields.length >= 3) {
        const unicodefield0 = fields[0];
        if (!this.assamese.idioms.has(unicodefield0)) {
          this.assamese.idioms.set(unicodefield0, []);
        }
        this.assamese.idioms.get(unicodefield0)!.push(fields[1], fields[2]);
        i++;
      }
    }
    console.log(`Number of lines inserted from ${idiomsFile}: ${i}`);

    // --- poribhashaFile ---
    i = 0;
    const poriLines = poribhashaFile.split(/\r?\n/);
    const addedAlready = new Set<string>();
    for (const line of poriLines) {
      const fields = line.split("\t");
      if (fields.length >= 2) {
        if (!addedAlready.has(fields[0])) {
          this.assamese.officialWrd.push([fields[0], fields[1]]);
          addedAlready.add(fields[0]);
        }
        i++;
      }
    }
    console.log(`Number of lines inserted from ${poribhashaFile}: ${i}`);
  }

  setAssameseEnglishDictionaries(dictionaryFile: string): void {
    const lines = dictionaryFile.split(/\r?\n/);

    let count = 0;
    for (const line of lines) {
      if (!line.trim()) continue; // skip empty lines
      this.assamese.setNewEntry(line);
      this.english.setNewEntryReversed(line);
      count++;
    }
    console.log(
      `Number of words inserted to assamese-english dictionary: ${count}`
    );
  }

  setPoriBhashaDictionaries(poribhashaFile: string): void {
    const lines = poribhashaFile.split(/\r?\n/);

    for (const line of lines) {
      if (!line.trim()) continue;
      this.englishPoribhasha.setNewEntry(line);
    }
  }
}
