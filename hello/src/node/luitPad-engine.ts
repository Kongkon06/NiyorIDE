import * as fs from 'fs';
import * as path from 'path';

import { Phonetic } from "./phonetic/Phonetic";
import { Translator } from "./phonetic/Translator";
import { WordsTrie } from "./phonetic/WordTrie";
import { Dictionaries } from "./dictionary/Dictionaries";
import { Romanization } from "./phonetic/Romanization";
import { InflexTrie } from "./core/InflexTrie";
import { Utilities } from "./utils/Utilities";

export class AssameseEngine {

  static LoadDictionary(IdeasFile:string, engWrdIdFile:string, asmWrdWrdId:string, examplesFile:string, idiomsFile:string, poribhashaFile:string) {
        const dictionaries = Dictionaries.getDictionaries();
        dictionaries.loadAssameseEnglishDictionaries(IdeasFile, engWrdIdFile, asmWrdWrdId, examplesFile, idiomsFile, poribhashaFile);
    }


  async initialize(): Promise<void> {
            console.log("Loading data.....");
            Romanization.InitializeMaps();
            // const dictionaryFile = "../files/processed_dictionary.txt";
            const dictionaryFilePath = path.resolve(__dirname,'../../files/T_WrdASMIdea.csv');
            const unicodeToRomanOverrideFilePath = path.resolve(__dirname,'../../files/unicode_to_roman_override.txt');
            const inflexions_combFilePath = path.resolve(__dirname,'../../files/inflexions_comb.txt');
            const IdeasFilePath = path.resolve(__dirname,'../../files/T_IdeaBase.tsv');
            const engWrdIdFilePath = path.resolve(__dirname,'../../files/T_WrdENGIdea.csv');
            const asmWrdWrdIdPath = path.resolve(__dirname,'../../files/T_WrdASMIdea.csv');
            const examplesFilePath = path.resolve(__dirname,'../../files/T_WrdExamples.tsv');
            const idiomsFilePath = path.resolve(__dirname,'../../files/T_Idioms.tsv');
            const poribhashaFilePath = path.resolve(__dirname,'../../files/T_Poribhasha.tsv');

            const dictionaryFile = fs.readFileSync(dictionaryFilePath, 'utf8');
            const unicodeToRomanOverrideFile = fs.readFileSync(unicodeToRomanOverrideFilePath,'utf8');
            const inflexions_combFile = fs.readFileSync(inflexions_combFilePath,'utf8');
            Romanization.initializeUnicodeToRomanOverrideMaps(unicodeToRomanOverrideFile);
            const wordsMapTree = WordsTrie.getWordsTrie();
            wordsMapTree.LoadDictionaryWords(dictionaryFile);
            Phonetic.initUserWordHashes();
            Phonetic.setInflexTypes(inflexions_combFile);
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
            const IdeasFile = fs.readFileSync(IdeasFilePath,'utf8'); 
            const engWrdIdFile = fs.readFileSync(engWrdIdFilePath,'utf8'); 
            const asmWrdWrdId = fs.readFileSync(asmWrdWrdIdPath,'utf8');
            const examplesFile = fs.readFileSync(examplesFilePath,'utf8');
            const idiomsFile = fs.readFileSync(idiomsFilePath,'utf8');
            const poribhashaFile = fs.readFileSync(poribhashaFilePath,'utf8');
            AssameseEngine.LoadDictionary(IdeasFile, engWrdIdFile, asmWrdWrdId, examplesFile, idiomsFile, poribhashaFile);
            // inflexTree.printData();
            Utilities.initializeVowelMap();
            Utilities.initializeConsonantMap();
            Utilities.initializeZeroLengthChar();
    }

  suggest(newWord: string): string[] {

    const newWordList: string[] = [];
    const pairedWordList: any[] = [];
    const pairedUserList: any[] = [];

    console.log("Running phonetic choices...");
    Phonetic.phoneticWordChoices(newWord, pairedWordList, false);

    if (newWord.length >= 3) {
        Phonetic.profileWordChoices(newWord, pairedUserList);
    }

    Phonetic.arrangeWordChoices(
        pairedWordList,
        newWordList,
        Phonetic.processPhoneticInput(
            Phonetic.phoneticEquivString(newWord)
        )
    );

    for (const word of pairedUserList) {
        newWordList.unshift(Utilities.getUnicode(word.unicode, "0x"));
    }

    console.log("Word List:" ,newWordList);
    return newWordList;
  }
}
