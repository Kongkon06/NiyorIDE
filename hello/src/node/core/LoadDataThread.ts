import { Dictionaries } from '../dictionary/Dictionaries';
import { Phonetic } from '../phonetic/Phonetic';
import { Romanization } from '../phonetic/Romanization';
import { WordsTrie } from '../phonetic/WordTrie';
import { InflexTrie } from './InflexTrie';
import { Utilities } from '../utils/Utilities';

export class LoadDataThread {
  constructor() {
  }

  run(): void {
    console.log("Loading data.....");

    Romanization.InitializeMaps();
    // const dictionaryFile = "../files/processed_dictionary.txt";
    const dictionaryFile = "T_WrdASMIdea.csv";

    const unicodeToRomanOverrideFile = "unicode_to_roman_override.txt";

    Romanization.initializeUnicodeToRomanOverrideMaps(unicodeToRomanOverrideFile);

    const wordsMapTree = WordsTrie.getWordsTrie();
    wordsMapTree.LoadDictionaryWords(dictionaryFile);

    Phonetic.initUserWordHashes();
    Phonetic.setInflexTypes("inflexions_comb.txt");

    Phonetic.createSingleInflections();
    Phonetic.createInflexCombinations();

    Phonetic.initializeCharPhoneticMap();
    Phonetic.loadAllWords(dictionaryFile);

    // add the phonetic words from the dictionary only for each character
    Phonetic.createPhoneticTree(dictionaryFile);

    // add user defined words and character mappings
    // Phonetic.addUserWordsToPhoneticTree("profile/DEFAULT.dat");

    Phonetic.initializeDistances();
    Phonetic.initializeDeleteCharMap();

    const inflexTree = InflexTrie.getInflexTrie();
    inflexTree.LoadInflections(Phonetic.singleInflexionsReverse);

    Utilities.initializeAlphabetOrder();

    const IdeasFile = "T_IdeaBase.tsv";
    const engWrdIdFile = "T_WrdENGIdea.csv";
    const asmWrdWrdId = "T_WrdASMIdea.csv";
    const examplesFile = "T_WrdExamples.tsv";
    const idiomsFile = "T_Idioms.tsv";
    const poribhashaFile = "T_Poribhasha.tsv";

    this.LoadDictionary(IdeasFile, engWrdIdFile, asmWrdWrdId, examplesFile, idiomsFile, poribhashaFile);

    // inflexTree.printData();
  }

  private LoadDictionary(
    IdeasFile: string,
    engWrdIdFile: string,
    asmWrdWrdId: string,
    examplesFile: string,
    idiomsFile: string,
    poribhashaFile: string
  ): void {
    const dictionaries = Dictionaries.getDictionaries();

    dictionaries.loadAssameseEnglishDictionaries(
      IdeasFile,
      engWrdIdFile,
      asmWrdWrdId,
      examplesFile,
      idiomsFile,
      poribhashaFile
    );
  }
}

