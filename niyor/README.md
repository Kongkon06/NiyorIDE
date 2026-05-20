**Word Suggestion Engine Overview — high level**
- **Load phase:** `AssameseEngine.initialize()` reads CSV/TSV/text files, initializes Romanization maps and phonetic/inflexion metadata, builds dictionary and phonetic/character tries. See luitPad-engine.ts.
- **Structures built:** a character-level dictionary trie (`WordsTrie.charTree`), a roman→unicode phonetic trie (`Phonetic.roman2UnicodeTreeDefault` and profile tree), inflexion trie (`InflexTrie.inflexTreeNode`), and various maps (char→phonetic, unicode→roman overrides, distances).
- **Suggest flow:** `AssameseEngine.suggest()` → `Phonetic.phoneticWordChoices()` (+ optional `profileWordChoices`) → `Phonetic.arrangeWordChoices()` → convert hex-unicode strings to display strings with `Utilities.getUnicode()` and return list.

**Detailed workflow (step-by-step)**
1. Initialization (file reads + map setup)
   - `AssameseEngine.initialize()` calls:
     - `Romanization.InitializeMaps()` to populate unicode→roman maps and sound-alter maps. (phonetic/Romanization.ts)
     - Reads files: dictionary CSV (`T_WrdASMIdea.csv`), `unicode_to_roman_override.txt`, `inflexions_comb.txt`, `T_IdeaBase.tsv`, `T_WrdENGIdea.csv`, `T_WrdASMIdea.csv`, `T_WrdExamples.tsv`, `T_Idioms.tsv`, `T_Poribhasha.tsv`. (luitPad-engine.ts)
     - `Romanization.initializeUnicodeToRomanOverrideMaps()` loads overrides into `UnicodeToRomanOverrideMap`/`List`.
     - `WordsTrie.getWordsTrie().LoadDictionaryWords(dictionaryFile)` parses the CSV and inserts words into `WordsTrie.charTree` by hex-code segments. (phonetic/WordTrie.ts)
     - `Phonetic.setInflexTypes(inflexions_combFile)` parses inflex categories into `inflexTypes`. (phonetic/Phonetic.ts)
     - `Phonetic.createSingleInflections()` and `createInflexCombinations()` produce `singleInflexions` and `allInflexions` maps used for inflection suggestions.
     - `Phonetic.initializeCharPhoneticMap()` creates phonetic-equivalence mapping for roman characters.
     - `Phonetic.loadAllWords(dictionaryFile)` builds `Phonetic.allWords` (unicode→roman).
     - `Phonetic.createPhoneticTree(dictionaryFile)` calls `Romanization.Romanize(fileContent, roman2UnicodeMap)` which converts each unicode word to a roman key and builds a map roman→list(unicode). Then it inserts each roman key into `Phonetic.roman2UnicodeTreeDefault` using `Phonetic.insertWord()` where each node stores a `roman2UnicodeList` of mapped unicode words.
     - `InflexTrie.getInflexTrie().LoadInflections(Phonetic.singleInflexionsReverse)` builds the inflection trie (reversed strings).
     - `Dictionaries.getDictionaries().loadAssameseEnglishDictionaries(...)` parses idea/word ID CSVs and populates `Dictionary` maps for meanings/examples/idioms. (dictionary/Dictionaries.ts)
     - `Utilities.initializeAlphabetOrder()`, vowel/consonant/zero-length char maps.
2. Building tries and nodes
   - `TreeNode` (core) is the node structure: `links: Map<string,TreeNode>`, `unicode`, `fullWord`, `used`, `children`, `roman2UnicodeList[]`. (core/TreeNode.ts)
   - Inserting to tries:
     - `Phonetic.insertWord(curNode, charList, unicodeWord)` for phonetic (roman char sequence → add unicode to node's `roman2UnicodeList` and set `fullWord`).
     - `WordsTrie.insertWord()` for dictionary words (splits hex string into segments then inserts into `WordsTrie.charTree` setting node.unicode and `fullWord`).
     - `AsciiTrie.insertWord()` and `CharTrie.insertWord()` follow the same insertion pattern for ascii/unicode mapping tries.
3. Runtime suggestion pipeline (input → returned suggestions)
   - User calls `AssameseBackendService.suggest()` → ensures engine initialized then `AssameseEngine.suggest(newWord)`. (luitPad-backend-service.ts)
   - `Phonetic.phoneticWordChoices(rawNewWord, words[], profileTree=false)`:
     - Convert input to phonetic representation: `Phonetic.phoneticEquivString()` maps characters (via `charPhoneticMap`) and `Phonetic.processPhoneticInput()` applies `deleteCharMap` substitutions.
     - Build a stack `notSeen` of roman phonetic chars (prepended so search explores prefix order).
     - If `newWord.length === 1` call `Phonetic.clearForNewWord()` which marks subtree nodes whose first phonetic char matches (optimization).
     - Call `Phonetic.searchRoman2UnicodeTree()` which traverses the `TreeNode.links` depth-first from the marked root, collecting `WordUnicode` results from `roman2UnicodeList` found at nodes at the target depth; traversal uses `seen`/`notSeen` stacks to control depth and branching.
     - `Phonetic.rankWords()` computes a distance (`Phonetic.wordDistance()` — Levenshtein-like with special char distance overrides) for ranking, sorts and filters best matches.
     - `Phonetic.markUsedWord(...)` marks nodes used in the tree (`used=true`) to avoid duplicates and for UI highlighting.
   - `Phonetic.profileWordChoices()` adds user-defined / profile words matching the phonetic prefix (if newWord length >= 3).
   - `Phonetic.arrangeWordChoices()` pads and prepares `wordList` (calls `Utilities.getUnicode()` to convert "0x..." hex strings to actual Unicode characters).
   - Final output is a list of display-ready strings.
4. Inflexion and related choices
   - `Phonetic.phoneticInflexChoices()` computes candidate inflection suffixes by computing `wordDistance()` against `singleInflexions` keys, sorting by distance and returning corresponding inflected forms.
5. Misc helpers
   - `Romanization.convert2Roman()` converts unicode hex sequences to roman ascii by tokenizing hex tokens, applying vowel modifiers, forward/backward sound alterations, and building roman keys used in phonetic maps.
   - `Utilities` contains hex↔unicode conversions, string splitting, ordering, HTML entity conversion for web display.

**Core data structures**
- `TreeNode` (core/TreeNode.ts): node used by all tries; stores children via `links`, terminal marker `fullWord`, associated `unicode` value, `roman2UnicodeList` for phonetic tree.
- Tries:
  - `WordsTrie` (`phonetic/WordTrie.ts`): char-level trie for the raw dictionary (hex-coded words).
  - `Phonetic.roman2UnicodeTreeDefault` (`phonetic/Phonetic.ts`): roman-letter trie mapping romanized keys → Unicode words; used for phonetic reverse lookup.
  - `InflexTrie` (`core/InflexTrie.ts`): reversed trie to match inflection suffixes efficiently.
  - `AsciiTrie` / `CharTrie` (`character/AsciiTrie.ts`, `character/CharTrie.ts`): character mapping tries used by Translator & input mapping.

**File-by-file summary (niyor/src/node)**
- luitPad-engine.ts:
  - **Purpose:** Main engine orchestrator. Reads files and calls initializers to build romanization, phonetic trees, dictionary maps, and inflex trie.
  - **Key functions:** `initialize()` (full startup pipeline), `LoadDictionary()` (wraps Dictionaries load), `suggest()` (entry point for generating suggestions).
- luitPad-backend-service.ts:
  - **Purpose:** RPC backend service implementing `AssameseService`, exposes `suggest()` to front-end; lazily initializes engine.
  - **Key functions:** `suggest(word)` calls engine.
- luitPad-backend-module.ts:
  - **Purpose:** Theia/DI container module wiring singletons and RPC handlers (engine, backend service, axm runner).
- axm-runner.ts:
  - **Purpose:** Runs external `tupal` command for AXM scripts; small wrapper returning Promise of stdout.

**Files in `phonetic/`**
- Phonetic.ts:
  - **Purpose:** Core phonetic engine: build roman→unicode tries, rank/search words, inflection handling, and distance-based ranking.
  - **Key functions:** `createPhoneticTree()`, `insertWord()`, `phoneticWordChoices()`, `rankWords()`, `phoneticEquivString()`, `wordDistance()`, `createSingleInflections()`, `createInflexCombinations()`.
- Romanization.ts:
  - **Purpose:** Map Unicode hex tokens to roman strings and provide overrides, forward/backward sound rules, and Romanize bulk dictionary data.
  - **Key functions:** `InitializeMaps()`, `initializeUnicodeToRomanOverrideMaps()`, `Romanize()`, `convert2Roman()`.
- Translator.ts:
  - **Purpose:** Character/ASCII ↔ Unicode transliteration and mapping tables (lots of mapping tables for matra/composite chars); also builds ascii/unicode tries via `AsciiTrie`.
  - **Key functions:** `initializeAsciiToUnicodeMap()`, `initializeUnicodeToAsciiMap()`, `initializeAsciiTree()`, `initializeUnicodeTree()`.
- WordTrie.ts:
  - **Purpose:** Loads raw dictionary CSV and constructs `WordsTrie.charTree`. Also holds language-specific small-distance maps (equivalences).
  - **Key functions:** `LoadDictionaryWords()`, `insertWord()`, `addWords()`.

**Files in `core/`**
- TreeNode.ts:
  - **Purpose:** Generic trie node used everywhere.
- InflexTrie.ts:
  - **Purpose:** Trie specialized for inflection lookup (stores reversed keys for suffix matching).
  - **Key functions:** `LoadInflections()`, `hasInflection()`.
- LoadDataThread.ts:
  - **Purpose:** A threaded-style loader (same actions as `AssameseEngine.initialize()` but using local filenames); useful reference/historical code path.
- Constants.ts:
  - **Purpose:** Common type/struct equivalents (KeyValue, WordUnicode, enums) and global flags.

**Files in `dictionary/`**
- Dictionaries.ts:
  - **Purpose:** Top-level dictionary manager that holds multiple `Dictionary` instances and loads TSV/CSV into them (`loadAssameseEnglishDictionaries`).
  - **Key functions:** `loadAssameseEnglishDictionaries()`, `setAssameseEnglishDictionaries()`.
- Dictionary.ts:
  - **Purpose:** Single-language dictionary storage and lookup helpers (meanings, examples, idioms, synonyms).
  - **Key functions:** `setNewEntry()`, `setNewEntryReversed()`, `getMeanings()`, `getIdioms()`, `getExamples()`, `getSynonyms()`.

**Files in `character/`**
- AsciiTrie.ts:
  - **Purpose:** Trie for ascii/unicode mapping; used by `Translator` to build mappings and retrieve choices by prefix.
- CharTrie.ts:
  - **Purpose:** Similar to `AsciiTrie` but focused on char-level prefix matching and returning key/value pairs for choices.

**Files in `utils/`**
- Utilities.ts:
  - **Purpose:** Utility helpers for hex/unicode conversions, splitting, ordering, HTML entity conversion, vowel/consonant maps and other small helpers used across the engine.

**Files in `editor/`**
- ToolTipSingleTon.ts:
  - **Purpose:** Small utility used by UI to decide whether a string contains Assamese (used for tooltip logic).

---

If you want, next I can:
- Run a quick example: load the CSVs and call `AssameseEngine.suggest()` with sample inputs (need the files accessible), or
- Produce a sequence diagram / Mermaid flowchart illustrating the exact method calls and data flow during `initialize()` and `suggest()`.

Which would you like me to do next?