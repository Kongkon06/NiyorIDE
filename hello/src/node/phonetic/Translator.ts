// Translator
import { AsciiTrie } from '../character/AsciiTrie';

class QKeyValuePair {
  ascii: string;
  len: number;

  constructor(key: string, length: number) {
    this.ascii = key;
    this.len = length;
  }
}

// Equivalent of QLeftRightPair
class QLeftRightPair {
  left: string;
  right: string;

  constructor(left: string = "", right: string = "") {
    this.left = left;
    this.right = right;
  }
}

function compareQKeyValuePair(a: QKeyValuePair, b: QKeyValuePair): number {
  return b.len - a.len; // longest first, like typical C++ custom comparator
}

export class Translator{
  private static translator: Translator | null = null;
  private static i = 0;
  private static jerr = 0;
  private static prevWasRoman = true; 
  private static prevWasNumeric= false; 
  static voidModifierMap: Map<string,string> | null = null ;
  static unicode2AsciiMap: Map<string,string> | null = null ;
  static unicode2AsciiMapExt: Map<string,string> | null = null ;

  static unicode2AsciiMatraLeftMap: Map<string,string> | null = null ;
  static ascii2UnicodeMatraLeftMap: Map<string,string> | null = null ;
  static unicode2AsciiMatraRightMap: Map<string,string> | null = null ;
  static ascii2UnicodeMatraRightMap: Map<string,string> | null = null ;

  static vowelModifierMap: Map<string, string> | null = null;
  static unicode2AsciiMatraRefMap: Map<string,string> | null = null ;
  static ascii2UnicodeMatraRefMap: Map<string,string> | null = null ;

  static ascii2UnicodeExoticMatraMap: Map<string,string> | null = null ;
  static unicode2AsciiExoticMatraMap: Map<string,string> | null = null ;

  static numericUnicode2AsciiMap: Map<string,string>;
  static numericAscii2UnicodeMap: Map<string,string>; 

  static ascii2UnicodeMap: Map<string,string> | null = null ;

  static ascii2UnicodeList: QKeyValuePair[] | null = null;
  static unicode2AsciiList: QKeyValuePair[] | null = null;

  static romanAsciiMap: Map<string, string> | null = null;
  static unicode2MatraCombMap: Map<string, QLeftRightPair> | null = null;
  static unicode2PrefixMatraCombMap: Map<string, QLeftRightPair> | null = null;
  static unicode2SuffixMatraCombMap: Map<string, QLeftRightPair> | null = null;

  static initializeMatraCombinations(): void {

  if (Translator.unicode2MatraCombMap != null) {
    return;
  }

  Translator.unicode2MatraCombMap = new Map<string, QLeftRightPair>();

  Translator.unicode2MatraCombMap.set("0x9be",new QLeftRightPair("", "0xb1"));

  Translator.unicode2MatraCombMap.set("0x9bf",new QLeftRightPair("0xbf", ""));

  Translator.unicode2MatraCombMap.set("0x9c0",new QLeftRightPair("", "0xcf"));

  Translator.unicode2MatraCombMap.set("0x9c1",new QLeftRightPair("", "0xb3")); 

  Translator.unicode2MatraCombMap.set("0x9c2",new QLeftRightPair("", "0xd3"));
  Translator.unicode2MatraCombMap.set("0x9c3",new QLeftRightPair("", "0xd4"));
  Translator.unicode2MatraCombMap.set("0x9c7",new QLeftRightPair("0xcb", "")); 
  Translator.unicode2MatraCombMap.set("0x9c8",new QLeftRightPair("0xcd", ""));
  Translator.unicode2MatraCombMap.set("0x9cb",new QLeftRightPair("0xcb", "0xb1"));
  Translator.unicode2MatraCombMap.set("0x9cc",new QLeftRightPair("0xcb", "0xcc"));

  }

  static initializePrefixMatraCombinations(): void {
  if (Translator.unicode2PrefixMatraCombMap != null) {
    return;
  }
  Translator.unicode2PrefixMatraCombMap = new Map<string, QLeftRightPair>();

  Translator.unicode2PrefixMatraCombMap.set("0x9f00x9cd",new QLeftRightPair("", "0xc7"));
  
  }

  static initializeSuffixMatraCombinations(): void {

  if (Translator.unicode2SuffixMatraCombMap != null) {
    return;
  }
  Translator.unicode2SuffixMatraCombMap = new Map<string, QLeftRightPair>();
  Translator.unicode2SuffixMatraCombMap.set("0x9cd0x9af",new QLeftRightPair("", "0xc9"));

  }

  static initializeAsciiToUnicodeMap(): void {
    if (Translator.ascii2UnicodeMap !== null) {
      return;
    }

    Translator.ascii2UnicodeMap = new Map<string, string>();

    // reverse unicode2AsciiMap into ascii2UnicodeMap
    if (Translator.unicode2AsciiMap) {
      for (const [key, value] of Translator.unicode2AsciiMap!.entries()) {
        Translator.ascii2UnicodeMap.set(value, key);
      }
    }

    // Extra inserts
    Translator.ascii2UnicodeMap.set("0xcb", "0x9c7");
    Translator.ascii2UnicodeMap.set("0xc6", "0x9c8");
    Translator.ascii2UnicodeMap.set("0xe5", "0x99b");
    Translator.ascii2UnicodeMap.set("0xc5", "0x9c1");
    Translator.ascii2UnicodeMap.set("0xe4", "0x99a");
    Translator.ascii2UnicodeMap.set("0xcb0xb1", "0x9cb");
    Translator.ascii2UnicodeMap.set("0x17d", "0x9950x9cd0x9b7");
    Translator.ascii2UnicodeMap.set("0xf08e", "0x9950x9cd0x9b7");
    Translator.ascii2UnicodeMap.set("0xcb0xcc", "0x9cc");
    Translator.ascii2UnicodeMap.set("0x310x2b", "0x9f00x9c1");
    Translator.ascii2UnicodeMap.set("0xa60xa8", "0x9b80x9cd0x995");

    // Build ascii2UnicodeList
    Translator.ascii2UnicodeList = [];
    for (const key of Translator.ascii2UnicodeMap.keys()) {
      Translator.ascii2UnicodeList.push(new QKeyValuePair(key, key.length));
    }

    Translator.ascii2UnicodeList.sort(compareQKeyValuePair);

    // Build unicode2AsciiList
    Translator.unicode2AsciiList = [];
    if (Translator.unicode2AsciiMap) {
      for (const key of Translator.unicode2AsciiMap.keys()) {
        Translator.unicode2AsciiList.push(new QKeyValuePair(key, key.length));
      }
    }

    Translator.unicode2AsciiList.sort(compareQKeyValuePair);

    // Matra maps
    Translator.ascii2UnicodeMatraLeftMap = new Map<string, string>();
    if (Translator.unicode2AsciiMatraLeftMap) {
      for (const [key, value] of Translator.unicode2AsciiMatraLeftMap!.entries()) {
        Translator.ascii2UnicodeMatraLeftMap.set(value, key);
      }
    }
    Translator.ascii2UnicodeMatraLeftMap.set("0xcb", "0x9c7");
    Translator.ascii2UnicodeMatraLeftMap.set("0xc6", "0x9c8");

    Translator.ascii2UnicodeMatraRightMap = new Map<string, string>();
    if (Translator.unicode2AsciiMatraRightMap) {
      for (const [key, value] of Translator.unicode2AsciiMatraRightMap!.entries()) {
        Translator.ascii2UnicodeMatraRightMap.set(value, key);
      }
    }

    Translator.ascii2UnicodeMatraRefMap = new Map<string, string>();
    if (Translator.unicode2AsciiMatraRefMap) {
      for (const [key, value] of Translator.unicode2AsciiMatraRefMap!.entries()) {
        Translator.ascii2UnicodeMatraRefMap.set(value, key);
      }
    }

    Translator.ascii2UnicodeExoticMatraMap = new Map<string, string>();
    if (Translator.unicode2AsciiExoticMatraMap) {
      for (const [key, value] of Translator.unicode2AsciiExoticMatraMap!.entries()) {
        Translator.ascii2UnicodeExoticMatraMap.set(value, key);
      }
    }

    console.log("Characters loaded", Translator.ascii2UnicodeList.length);

    Translator.numericAscii2UnicodeMap = new Map<string, string>();
    if (Translator.numericUnicode2AsciiMap) {
      for (const [key, value] of Translator.numericUnicode2AsciiMap!.entries()) {
        Translator.numericAscii2UnicodeMap.set(value, key);
      }
    }
  }

  static initializeUnicodeToAsciiMap(): void {
  if (Translator.unicode2AsciiMap != null) {
    return;
  }
  Translator.unicode2AsciiMap = new Map<string,string>();
  Translator.unicode2AsciiMatraLeftMap = new Map<string,string>();
  Translator.unicode2AsciiMatraRightMap = new Map<string,string>();
  Translator.unicode2AsciiMatraRefMap = new Map<string,string>();

  Translator.unicode2AsciiExoticMatraMap = new Map<string,string>();

  Translator.unicode2AsciiMap.set("0x20", "0x20");
  Translator.unicode2AsciiMap.set("0x21", "0x2f");

  Translator.unicode2AsciiMap.set("0x985", "0xd5");
  Translator.unicode2AsciiMap.set("0x986", "0xd50xb1");
  Translator.unicode2AsciiMap.set("0x987", "0xfd0xd7");
  Translator.unicode2AsciiMap.set("0x988", "0xd6");

  Translator.unicode2AsciiMap.set("0x989", "0xeb0xd7");
  Translator.unicode2AsciiMap.set("0x98a", "0xd8");
  Translator.unicode2AsciiMap.set("0x98b", "0xd90xd4");
  Translator.unicode2AsciiMap.set("0x98b", "0xd9");

  Translator.unicode2AsciiMap.set("0x98f", "0xdb");
  Translator.unicode2AsciiMap.set("0x990", "0xdc");
  Translator.unicode2AsciiMap.set("0x993", "0xdd");
  Translator.unicode2AsciiMap.set("0x994", "0xde");

  // ka kha
  Translator.unicode2AsciiMap.set("0x995", "0xdf");
  Translator.unicode2AsciiMap.set("0x996", "0xe0");
  Translator.unicode2AsciiMap.set("0x997", "0xe1");
  Translator.unicode2AsciiMap.set("0x998", "0xe2");
  Translator.unicode2AsciiMap.set("0x999", "0xe3");

  // cha chaa
  Translator.unicode2AsciiMap.set("0x99a",
                           "0x32"); // Translator.unicode2AsciiMap.set("0x99a","0xe4");
  Translator.unicode2AsciiMap.set("0x99b",
                           "0x36"); // Translator.unicode2AsciiMap.set("0x99b","0x35");
  Translator.unicode2AsciiMap.set("0x99c", "0xe6");
  Translator.unicode2AsciiMap.set("0x99d", "0xe7");
  Translator.unicode2AsciiMap.set("0x99e", "0xdb0x7");

  // ta tha da
  Translator.unicode2AsciiMap.set("0x99f", "0xe9");
  Translator.unicode2AsciiMap.set("0x9a0", "0xea");
  Translator.unicode2AsciiMap.set("0x9a1", "0xeb");
  Translator.unicode2AsciiMap.set("0x9a2", "0xec");
  Translator.unicode2AsciiMap.set("0x9a3", "0xed");

  // Ta Tha Da
  Translator.unicode2AsciiMap.set("0x9a4", "0xee");
  Translator.unicode2AsciiMap.set("0x9a5", "0xef");
  Translator.unicode2AsciiMap.set("0x9a6", "0xf0");
  Translator.unicode2AsciiMap.set("0x9a7", "0xf1");
  Translator.unicode2AsciiMap.set("0x9a8", "0xf2");

  // pa pha bo bho mo
  Translator.unicode2AsciiMap.set("0x9aa", "0xf3");
  Translator.unicode2AsciiMap.set("0x9ab", "0xf4");
  Translator.unicode2AsciiMap.set("0x9ac", "0xf5");
  Translator.unicode2AsciiMap.set("0x9ad", "0xf6");
  Translator.unicode2AsciiMap.set("0x9ae", "0xf7");

  // ja ra la wab
  Translator.unicode2AsciiMap.set("0x9af", "0xfb");
  Translator.unicode2AsciiMap.set("0x9f0", "0x31");
  Translator.unicode2AsciiMap.set("0x9b2", "0xf9");
  // Translator.unicode2AsciiMap.set("0x9f1","0xf50xc4");
  Translator.unicode2AsciiMap.set("0x9f1", "0xbb");

  // xa xha dxha ha
  Translator.unicode2AsciiMap.set("0x9b6", "0xfa");
  Translator.unicode2AsciiMap.set("0x9b7", "0xf8"); // 0xb8 removed
  Translator.unicode2AsciiMap.set("0x9b8", "0xfc");
  Translator.unicode2AsciiMap.set("0x9b9", "0xfd");

  Translator.unicode2AsciiMap.set("0x9950x9cd0x9b7", "0xf08e");
  Translator.unicode2AsciiMap.set("0x9950x9cd0x9b7", "0x17d");
  Translator.unicode2AsciiMap.set("0x9950x9cd0x9b7", "0xf08e");

  // ya r dhra dhra
  Translator.unicode2AsciiMap.set("0x9950x9b7", "0x17d");
  Translator.unicode2AsciiMap.set("0x9df", "0xfb0xfe");
  Translator.unicode2AsciiMap.set("0x9dc", "0xeb0xc20xff");
  Translator.unicode2AsciiMap.set("0x9dd", "0xec0xc20xff");

  // hasantiya bisorgo

  Translator.unicode2AsciiMap.set("0x9ce", "0xc8");
  Translator.unicode2AsciiMap.set("0x981", "0xd2");
  Translator.unicode2AsciiMap.set("0x982", "0xd1");
  Translator.unicode2AsciiMap.set("0x983", "0xd0");

  // all the kars/matra
  Translator.unicode2AsciiMap.set("0x9be", "0xb1");
  Translator.unicode2AsciiMap.set("0x9bf", "0xbf");
  Translator.unicode2AsciiMap.set("0x9c0", "0xcf");
  Translator.unicode2AsciiMap.set("0x9c1","0xb3");
  Translator.unicode2AsciiMap.set("0x9c2", "0xd3");
  Translator.unicode2AsciiMap.set("0x9c3", "0xd4");
  Translator.unicode2AsciiMap.set("0x9c7","0xce");
  Translator.unicode2AsciiMap.set("0x9c8", "0xcd");
  Translator.unicode2AsciiMap.set("0x9cd0x9af", "0xc9");
  Translator.unicode2AsciiMap.set("0xcc", "0xcc");

  Translator.unicode2AsciiMatraRightMap.set("0x9be", "0xb1");
  Translator.unicode2AsciiMatraLeftMap.set("0x9bf", "0xbf");
  Translator.unicode2AsciiMatraRightMap.set("0x9c0", "0xcf");
  Translator.unicode2AsciiMatraRightMap.set("0x9c1", "0xb3");
  Translator.unicode2AsciiMatraRightMap.set("0x9c2", "0xd3");
  Translator.unicode2AsciiMatraRightMap.set("0x9c3", "0xd4");
  Translator.unicode2AsciiMatraLeftMap.set("0x9c7", "0xce"); 
  Translator.unicode2AsciiMatraLeftMap.set("0x9c8", "0xcd");
  Translator.unicode2AsciiMatraRightMap.set("0xcc", "0xcc");

  // ref and dirgha ref

  Translator.unicode2AsciiMap.set("0x9f00x9cdM", "0xc7");
  Translator.unicode2AsciiMatraRefMap.set("0x9f00x9cdM", "0xc7");
  Translator.unicode2AsciiMap.set("0x9f00x9cdM0x9c0", "0xb9");
  Translator.unicode2AsciiMatraRefMap.set("0x9f00x9cdM0x9c0", "0xb9");

  Translator.unicode2AsciiMap.set("0x981", "0xd2");
  //   Translator.unicode2AsciiExoticMatraMap.set("0x9cd0x9af","0xc9");
  Translator.unicode2AsciiExoticMatraMap.set("0x981", "0xd2");

  Translator.unicode2AsciiMap.set("0x9cb", "0xce0xb1"); // unicode2AsciiMap.set("0x9cb","0xcb0xb1");
                            // Translator.unicode2AsciiMap.set("0x9cb","0xcd");
  Translator.unicode2AsciiMap.set("0x9cc", "0xce0xcc"); // unicode2AsciiMap.set("0x9cc", "0xcb0xcc");

  Translator.unicode2AsciiMap.set("0x964", "0xbc");

  // small symbols punctuation
  Translator.unicode2AsciiMap.set("0x2d", "0x2d");
  Translator.unicode2AsciiMap.set("0x2e", "0x2e");
  Translator.unicode2AsciiMap.set("0x2f", "0x2f");
  Translator.unicode2AsciiMap.set("0x2c", "0x2c");
  Translator.unicode2AsciiMap.set("0x2018", "0x2018");
  Translator.unicode2AsciiMap.set("0x2019", "0x2019");
  Translator.unicode2AsciiMap.set("0x2013", "0x2013");
  Translator.unicode2AsciiMap.set("0x5b", "0x5b");
  Translator.unicode2AsciiMap.set("0x5d", "0x5d");

  Translator.unicode2AsciiMap.set("0x3b", "0xca0x2c");
  Translator.unicode2AsciiMap.set("0x3f", "0x2022");

  // jya kars

  // composite letters
  Translator.unicode2AsciiMap.set("0x9950x9cd0x995", "0x21");
  Translator.unicode2AsciiMap.set("0x9950x9cd0x99f", "0x22");
  Translator.unicode2AsciiMap.set("0x9950x9cd0x9a8", "0x23");
  Translator.unicode2AsciiMap.set("0x9950x9cd0x9ac", "0x24");

  Translator.unicode2AsciiMap.set("0x9950x9cd0x9ae", "0x25");
  Translator.unicode2AsciiMap.set("0x9970x9c1", "0x26");
  Translator.unicode2AsciiMap.set("0x9950x9cd0x9b8", "0x27");

  Translator.unicode2AsciiMap.set("0x9b60x9cd0x99a", "0x28");
  Translator.unicode2AsciiMap.set("0x9970x9cd0x9aa", "0x29");
  Translator.unicode2AsciiMap.set("0x99a0x9cd0x99b0x9cd0x9f0", "0x34");

  // composite chars
  Translator.unicode2AsciiMap.set("0x9aa0x9cd0x9a4", "0x35");
  Translator.unicode2AsciiMap.set("0x99c0x9cd0x99c", "0x37");
  Translator.unicode2AsciiMap.set("0x99c0x9cd0x99c0x9cd0x9ac", "0x38");
  Translator.unicode2AsciiMap.set("0x99c0x9cd0x99c", "0x39");
  Translator.unicode2AsciiMap.set("0x99c0x9cd0x99e", "0x3a");
  Translator.unicode2AsciiMap.set("0x99c0x9cd0x9ac", "0x3b");
  Translator.unicode2AsciiMap.set("0x99c0x9cd0x9f0", "0x3c");
  Translator.unicode2AsciiMap.set("0x99e0x9cd0x99a", "0x3d");
  Translator.unicode2AsciiMap.set("0x99e0x9cd0x9a5", "0x3e");
  Translator.unicode2AsciiMap.set("0x99e0x9cd0x99c", "0x3f");
  Translator.unicode2AsciiMap.set("0x99e0x9cd0x99d", "0x40");
  Translator.unicode2AsciiMap.set("0x99f0x9cd0x9a4", "0x41");
  Translator.unicode2AsciiMap.set("0x99f0x9cd0x9ac", "0x42");
  Translator.unicode2AsciiMap.set("0x99f0x9cd0x9f0", "0x43");
  Translator.unicode2AsciiMap.set("0x9a10x9cd0x9a1", "0x44");
  Translator.unicode2AsciiMap.set("0x9a10x9cd0x9f0", "0x45");
  Translator.unicode2AsciiMap.set("0x9a30x9cd0x9a0", "0x46");
  Translator.unicode2AsciiMap.set("0x9a30x9cd0x9a1", "0x47");
  Translator.unicode2AsciiMap.set("0x9a30x9cd0x9a10x9cd0x9f0", "0x48");
  Translator.unicode2AsciiMap.set("0x9a30x9cd0x9a3", "0x4A");

  Translator.unicode2AsciiMap.set("0x9a40x9cd0x9a4", "0x4d");
  Translator.unicode2AsciiMap.set("0x9a40x9cd0x9ac", "0x4e");
  Translator.unicode2AsciiMap.set("0x9b20x9cd0x9ac", "0x4f");
  Translator.unicode2AsciiMap.set("0x9a40x9cd0x9a8", "0x50");
  Translator.unicode2AsciiMap.set("0x9a40x9cd0x9ac", "0x51");
  Translator.unicode2AsciiMap.set("0x9a40x9cd0x9ae", "0x52");
  Translator.unicode2AsciiMap.set("0x9a40x9cd0x9f0", "0x53");

  Translator.unicode2AsciiMap.set("0x9a50x9cd0x9ae", "0x54");
  Translator.unicode2AsciiMap.set("0x9b90x9c1", "0x55");

  Translator.unicode2AsciiMap.set("0x9a60x9cd0x9a6", "0x56");
  Translator.unicode2AsciiMap.set("0x9a60x9cd0x9a60x9cd0x9ac", "0x57");

  Translator.unicode2AsciiMap.set("0x9a60x9cd0x9a7", "0x58");
  Translator.unicode2AsciiMap.set("0x9a60x9cd0x9ac0x9cd0x9a7", "0x59");
  Translator.unicode2AsciiMap.set("0x9a60x9cd0x9ac", "0x5a");
  Translator.unicode2AsciiMap.set("0x9a60x9cd0x9ad0x9cd0x9f0", "0x5c");
  Translator.unicode2AsciiMap.set("0x9a60x9cd0x9f0", "0x5e");

  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a0", "0x5f");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a1", "0x60");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a40x9c1", "0x63");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9a40x9c1", "0x64");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a60x9cd0x9f0", "0x66");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9a4", "0x21220xa60xbb");
  Translator.unicode2AsciiMap.set("0x9b60x9c1", "0x71");

  Translator.unicode2AsciiMap.set("0x9ac0x9cd0x9a6", "0x73");
  Translator.unicode2AsciiMap.set("0x9ac0x9cd0x9a7", "0x74");
  // bhra  pra
  Translator.unicode2AsciiMap.set("0x9ad0x9cd0x9f0", "0x77");
  Translator.unicode2AsciiMap.set("0x9aa0x9cd0x9f0", "0x78");
  Translator.unicode2AsciiMap.set("0x9ae0x9cd0x9ad", "0x79");

  Translator.unicode2AsciiMap.set("0x9ae0x9cd0x9ad0x9cd0x9f0", "0x7a");
  Translator.unicode2AsciiMap.set("0x9b60x9cd0x9f0", "0x7c");
  Translator.unicode2AsciiMap.set("0x9b20x9cd0x9b2", "0x7e");

  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9b2", "0x80");
  Translator.unicode2AsciiMap.set("0x9b90x9cd0x9a8", "0x81");

  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a6", "0xb5");
  Translator.unicode2AsciiMap.set("0x9a60x9cd0x9ad", "0xbe");

  Translator.unicode2AsciiMap.set("0x9b20x9cd0x9aa", "0x160");

  Translator.unicode2AsciiMap.set("0x9aa0x9cd0x9f0", "0x203a0xb6");
  Translator.unicode2AsciiMap.set("0x9f00x9c1", "0x310x6e"); // 0xb8 removed

  Translator.unicode2AsciiMap.set("0x9950x9cd0x9a4", "0x4d0x90");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a4", "0x21220x4c");
  Translator.unicode2AsciiMap.set("0x9b60x9cd0x9f1", "0x9d0xab");

  Translator.unicode2AsciiMap.set("0x9b60x9cd0x9a8", "0x9d0x178");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a8", "0xf9");

  Translator.unicode2AsciiMap.set("0x989", "0xeb0xc20xd7");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9ae", "0x690x6a");
  Translator.unicode2AsciiMap.set("0x9970x9cd0x9f0", "0xa20xb6");
  Translator.unicode2AsciiMap.set("0x9b60x9cd0x9b2", "0x9d0xad");
  Translator.unicode2AsciiMap.set("0x9b70x9cd0x99f", "0xa90x2020");
  Translator.unicode2AsciiMap.set("0x9b70x9cd0x99f0x9cd0x9f0", "0xa90x20200xaa");

  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9f1", "0xa60xa4");

  Translator.unicode2AsciiMap.set("0x9b90x9cd0x9b2", "0xaf");

  Translator.unicode2AsciiMap.set("0x9ae0x9cd0x9aa", "0xa50xf3");

  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9ae", "0xa60x153");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a5", "0x4c0x161");
  Translator.unicode2AsciiMap.set("0x9b70x9cd0x9a0", "0x20210xc2");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a8", "0x690xa7");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a7", "0x670xc5");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9a5", "0xa60x161");
  Translator.unicode2AsciiMap.set("0x9ac0x9cd0x9f0", "0xe80x70");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x995","0xa60xa8");   
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a7", "0x67");
  //   matra removed
  Translator.unicode2AsciiMap.set("0x9cd0x9f0", "0xe8");
  Translator.unicode2AsciiMap.set("0x9c1", "0x6e");
  Translator.unicode2AsciiMap.set("0x9ae0x9cd0x9ac", "0x690xa4");
  Translator.unicode2AsciiMap.set("0x9b20x9cd0x9a1", "0x2039");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x99f", "0x2c6");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9950x9c1", "0xa60xc50xa8");
  Translator.unicode2AsciiMap.set("0x9990x9cd0x995", "0x201a");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x995", "0xa90xa8");
  Translator.unicode2AsciiMap.set("0x9970x9cd0x9a8", "0xa20x178");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9ab", "0xa60xa3");
  Translator.unicode2AsciiMap.set("0x9b70x9cd0x9ae", "0x192");
  Translator.unicode2AsciiMap.set("0x9ac0x9cd0x9b2", "0xf50x76");
  Translator.unicode2AsciiMap.set("0x9a30x9cd0x99f", "0xb00x490xd7");
  Translator.unicode2AsciiMap.set("0x9b90x9cd0x9f0", "0xfd0x7d");
  Translator.unicode2AsciiMap.set("0x9b70x9cd0x9aa", "0xa90xf3");
  Translator.unicode2AsciiMap.set("0x9950x9cd0x9b2", "0xdf0x76");
  Translator.unicode2AsciiMap.set("0x9cd", "0xc4");
  Translator.unicode2AsciiMap.set("0x9ac0x9cd0x9ac", "0xf50x33");
  Translator.unicode2AsciiMap.set("0x9aa0x9cd0x9b2", "0x203a0xad"); // po + lo
  Translator.unicode2AsciiMap.set("0x99e", "0xdb0x17e");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9aa", "0xa60xf3");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9a4", "0x21220xa6");
  Translator.unicode2AsciiMap.set("0x9a30x9cd0x99f", "0x4b0x490xd7");
  Translator.unicode2AsciiMap.set("0x9ae0x9cd0x9ac", "0xa50xa4");
  Translator.unicode2AsciiMap.set("0x9b20x9cd0x99f", "0x1520x490xd7");
  Translator.unicode2AsciiMap.set("0x9970x9cd0x9b2", "0xa20xad");
  Translator.unicode2AsciiMap.set("0x9b60x9cd0x9f00x9c0", "0xc0");
  Translator.unicode2AsciiMap.set("0x9b90x9cd0x9ae", "0x70");
  Translator.unicode2AsciiMap.set("0x99c0x9cd0x99c", "0x37");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9a40x9cd0x9f0", "0x4c0x61");

  Translator.unicode2AsciiMap.set("0x9950x9cd0x9a4", "0x4d0x90");

  Translator.unicode2AsciiMap.set("0x9950x9cd0x9f0", "0x530x90");

  Translator.unicode2AsciiMap.set("0x9a80x9cd0x9b8", "0x6b");
  Translator.unicode2AsciiMap.set("0x9a30x9cd0x99f", "0xb00x490xd7");
  Translator.unicode2AsciiMap.set("0x9a80x9cd0x99f", "0x4b0x490xd7");

  Translator.unicode2AsciiMap.set("0x9b70x9cd0x9a3", "0xf80x17e");
  Translator.unicode2AsciiMap.set("0x9990x9cd0x997", "0x65");
  Translator.unicode2AsciiMap.set("0x9b80x9cd0x9a8", "0xa60xa7");

  Translator.unicode2AsciiMap.set("0x9b90x9cd0x9a3", "0xf081");
  Translator.unicode2AsciiMap.set("0x9b90x9cd0x9a8", "0xfd0x90");
  Translator.unicode2AsciiMap.set("0x9ab0x9cd0x9b2", "0xf40x76");

  Translator.numericUnicode2AsciiMap = new Map<string,string>();

  Translator.numericUnicode2AsciiMap.set("0x9e6", "0x30");
  Translator.numericUnicode2AsciiMap.set("0x9e7", "0x31");
  Translator.numericUnicode2AsciiMap.set("0x9e8", "0x32");
  Translator.numericUnicode2AsciiMap.set("0x9e9", "0x33");
  Translator.numericUnicode2AsciiMap.set("0x9ea", "0x34");
  Translator.numericUnicode2AsciiMap.set("0x9eb", "0x35");
  Translator.numericUnicode2AsciiMap.set("0x9ec", "0x36");
  Translator.numericUnicode2AsciiMap.set("0x9ed", "0x37");
  Translator.numericUnicode2AsciiMap.set("0x9ee", "0x38");
  Translator.numericUnicode2AsciiMap.set("0x9ef", "0x39");

  Translator.numericUnicode2AsciiMap.set("0x2c", "0x2c");
  Translator.numericUnicode2AsciiMap.set("0xed", "0xed");
  Translator.numericUnicode2AsciiMap.set("0x2d", "0x2d");
  Translator.numericUnicode2AsciiMap.set("0x2e", "0x2e");

  }

 static initializeUnicodeToAsciiMapExt(): void {
  if (Translator.unicode2AsciiMapExt != null) {
    return;
  }

  Translator.unicode2AsciiMapExt = new Map();

  Translator.unicode2AsciiMapExt.set("0x20", "0x20");
  Translator.unicode2AsciiMapExt.set("0x21", "0x2f");

  Translator.unicode2AsciiMapExt.set("0x985", "0xd5");
  Translator.unicode2AsciiMapExt.set("0x986", "0xd50xb1");
  Translator.unicode2AsciiMapExt.set("0x987", "0xfd0xd7");
  Translator.unicode2AsciiMapExt.set("0x988", "0xd6");

  Translator.unicode2AsciiMapExt.set("0x989", "0xeb0xd70xc2");
  Translator.unicode2AsciiMapExt.set("0x98a", "0xd8");
  Translator.unicode2AsciiMapExt.set("0x98b", "0xd90xd4");
  Translator.unicode2AsciiMapExt.set("0x98b", "0xd9");

  Translator.unicode2AsciiMapExt.set("0x98f", "0xdb");
  Translator.unicode2AsciiMapExt.set("0x990", "0xdc");
  Translator.unicode2AsciiMapExt.set("0x993", "0xdd");
  Translator.unicode2AsciiMapExt.set("0x994", "0xde");

  // ka kha
  Translator.unicode2AsciiMapExt.set("0x995", "0xdf0xc2");
  Translator.unicode2AsciiMapExt.set("0x996", "0xe0");
  Translator.unicode2AsciiMapExt.set("0x997", "0xe1");
  Translator.unicode2AsciiMapExt.set("0x998", "0xe2");
  Translator.unicode2AsciiMapExt.set("0x999", "0xe3");

  // cha chaa
  Translator.unicode2AsciiMapExt.set(
      "0x99a", "0x320xc2"); // Translator.unicode2AsciiMapExt.set("0x99a","0xe4");
  Translator.unicode2AsciiMapExt.set(
      "0x99b", "0x36"); // Translator.unicode2AsciiMapExt.set("0x99b","0x35");
  Translator.unicode2AsciiMapExt.set("0x99c", "0xe6");
  Translator.unicode2AsciiMapExt.set("0x99d", "0xe7");
  Translator.unicode2AsciiMapExt.set("0x99e", "0xdb0x7");

  // ta tha da
  Translator.unicode2AsciiMapExt.set("0x99f", "0xe90xc2");
  Translator.unicode2AsciiMapExt.set("0x9a0", "0xea0xc2");
  Translator.unicode2AsciiMapExt.set("0x9a1", "0xeb0xc2");
  Translator.unicode2AsciiMapExt.set("0x9a2", "0xec0xc2");
  Translator.unicode2AsciiMapExt.set("0x9a3", "0xed");

  // Ta Tha Da
  Translator.unicode2AsciiMapExt.set("0x9a4", "0xee0xc2");
  Translator.unicode2AsciiMapExt.set("0x9a5", "0xef");
  Translator.unicode2AsciiMapExt.set("0x9a6", "0xf0");
  Translator.unicode2AsciiMapExt.set("0x9a7", "0xf1");
  Translator.unicode2AsciiMapExt.set("0x9a8", "0xf2");

  // pa pha bo bho mo
  Translator.unicode2AsciiMapExt.set("0x9aa", "0xc20xf3");
  Translator.unicode2AsciiMapExt.set("0x9ab", "0xf40xc2");
  Translator.unicode2AsciiMapExt.set("0x9ac", "0xc20xf5");
  Translator.unicode2AsciiMapExt.set("0x9ad", "0xf60xc2");
  Translator.unicode2AsciiMapExt.set("0x9ae", "0xf7");

  // ja ra la wab
  Translator.unicode2AsciiMapExt.set("0x9af", "0xfb");
  Translator.unicode2AsciiMapExt.set("0x9f0", "0x31");
  Translator.unicode2AsciiMapExt.set("0x9b2", "0xf9");
  // Translator.unicode2AsciiMapExt.set("0x9f1","0xf50xc4");
  Translator.unicode2AsciiMapExt.set("0x9f1", "0xbb");

  // xa xha dxha ha
  Translator.unicode2AsciiMapExt.set("0x9b6", "0xfa");
  Translator.unicode2AsciiMapExt.set("0x9b7", "0xf8"); // 0xb8 removed
  Translator.unicode2AsciiMapExt.set("0x9b8", "0xfc");
  Translator.unicode2AsciiMapExt.set("0x9b9", "0xfd");

  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9b7", "0xf08e");
  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9b7", "0x17d");
  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9b7", "0xf08e");

  // ya r dhra dhra
  Translator.unicode2AsciiMapExt.set("0x9950x9b7", "0x17d");
  Translator.unicode2AsciiMapExt.set("0x9df", "0xfb0xfe");
  Translator.unicode2AsciiMapExt.set("0x9dc", "0xeb0xc20xff");
  Translator.unicode2AsciiMapExt.set("0x9dd", "0xec0xc20xff");

  // hasantiya bisorgo

  Translator.unicode2AsciiMapExt.set("0x9ce", "0xc8");
  Translator.unicode2AsciiMapExt.set("0x981", "0xd2");
  Translator.unicode2AsciiMapExt.set("0x982", "0xd1");
  Translator.unicode2AsciiMapExt.set("0x983", "0xd0");

  // all the kars/matra
  Translator.unicode2AsciiMapExt.set("0x9be", "0xb1");
  Translator.unicode2AsciiMapExt.set("0x9bf", "0xbf");
  Translator.unicode2AsciiMapExt.set("0x9c0", "0xcf");
  Translator.unicode2AsciiMapExt.set(
      "0x9c1", "0xb3"); // Translator.unicode2AsciiMapExt.set("0x9c1","0xc5");
  Translator.unicode2AsciiMapExt.set("0x9c2", "0xd3");
  Translator.unicode2AsciiMapExt.set("0x9c3", "0xd4");
  Translator.unicode2AsciiMapExt.set(
      "0x9c7", "0xce"); // Translator.unicode2AsciiMapExt.set("0x9c7","0xcb");
  Translator.unicode2AsciiMapExt.set("0x9c8", "0xcd");
  Translator.unicode2AsciiMapExt.set("0x9cd0x9af", "0xc9");
  Translator.unicode2AsciiMapExt.set("0xcc", "0xcc");
  // Translator.unicode2AsciiMapExt.set("0x9af")

  // ref and dirgha ref

  //  Translator.unicode2AsciiMapExt.set("0x9f00x9cd", "0xc7");
  Translator.unicode2AsciiMapExt.set("0x9f00x9cdM0x9c0", "0xb9");

  Translator.unicode2AsciiMapExt.set("0x981", "0xd2");

  Translator.unicode2AsciiMapExt.set(
      "0x9cb", "0xce0xb1"); // Translator.unicode2AsciiMapExt.set("0x9cb","0xcb0xb1");
                            // Translator.unicode2AsciiMapExt.set("0x9cb","0xcd");
  Translator.unicode2AsciiMapExt.set(
      "0x9cc", "0xce0xcc"); // Translator.unicode2AsciiMapExt.set("0x9cc", "0xcb0xcc");

  Translator.unicode2AsciiMapExt.set("0x964", "0xbc");

  // small symbols punctuation
  Translator.unicode2AsciiMapExt.set("0x2d", "0x2d");
  Translator.unicode2AsciiMapExt.set("0x2e", "0x2e");
  Translator.unicode2AsciiMapExt.set("0x2f", "0x2f");
  Translator.unicode2AsciiMapExt.set("0x2c", "0x2c");
  Translator.unicode2AsciiMapExt.set("0x2018", "0x2018");
  Translator.unicode2AsciiMapExt.set("0x2019", "0x2019");
  Translator.unicode2AsciiMapExt.set("0x2013", "0x2013");
  Translator.unicode2AsciiMapExt.set("0x5b", "0x5b");
  Translator.unicode2AsciiMapExt.set("0x5d", "0x5d");

  Translator.unicode2AsciiMapExt.set("0x3b", "0xca0x2c");
  Translator.unicode2AsciiMapExt.set("0x3f", "0x2022");

  // jya kars

  // composite letters
  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x995", "0x21");
  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x99f", "0x22");
  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9a8", "0x23");
  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9ac", "0x24");

  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9ae", "0x25");
  Translator.unicode2AsciiMapExt.set("0x9970x9c1", "0x26");
  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9b8", "0x27");

  Translator.unicode2AsciiMapExt.set("0x9b60x9cd0x99a", "0x28");
  Translator.unicode2AsciiMapExt.set("0x9970x9cd0x9aa", "0x29");
  Translator.unicode2AsciiMapExt.set("0x99a0x9cd0x99b0x9cd0x9f0", "0x34");

  // composite chars
  Translator.unicode2AsciiMapExt.set("0x9aa0x9cd0x9a4", "0x35");
  Translator.unicode2AsciiMapExt.set("0x99c0x9cd0x99c", "0x37");
  Translator.unicode2AsciiMapExt.set("0x99c0x9cd0x99c0x9cd0x9ac", "0x38");
  Translator.unicode2AsciiMapExt.set("0x99c0x9cd0x99c", "0x39");
  Translator.unicode2AsciiMapExt.set("0x99c0x9cd0x99e", "0x3a");
  Translator.unicode2AsciiMapExt.set("0x99c0x9cd0x9ac", "0x3b");
  Translator.unicode2AsciiMapExt.set("0x99c0x9cd0x9f0", "0x3c");
  Translator.unicode2AsciiMapExt.set("0x99e0x9cd0x99a", "0x3d");
  Translator.unicode2AsciiMapExt.set("0x99e0x9cd0x9a5", "0x3e");
  Translator.unicode2AsciiMapExt.set("0x99e0x9cd0x99c", "0x3f");
  Translator.unicode2AsciiMapExt.set("0x99e0x9cd0x99d", "0x40");
  Translator.unicode2AsciiMapExt.set("0x99f0x9cd0x9a4", "0x41");
  Translator.unicode2AsciiMapExt.set("0x99f0x9cd0x9ac", "0x42");
  Translator.unicode2AsciiMapExt.set("0x99f0x9cd0x9f0", "0x43");
  Translator.unicode2AsciiMapExt.set("0x9a10x9cd0x9a1", "0x44");
  Translator.unicode2AsciiMapExt.set("0x9a10x9cd0x9f0", "0x45");
  Translator.unicode2AsciiMapExt.set("0x9a30x9cd0x9a0", "0x46");
  Translator.unicode2AsciiMapExt.set("0x9a30x9cd0x9a1", "0x47");
  Translator.unicode2AsciiMapExt.set("0x9a30x9cd0x9a10x9cd0x9f0", "0x48");
  Translator.unicode2AsciiMapExt.set("0x9a30x9cd0x9a3", "0x4A");

  Translator.unicode2AsciiMapExt.set("0x9a40x9cd0x9a4", "0x4d");
  Translator.unicode2AsciiMapExt.set("0x9a40x9cd0x9ac", "0x4e");
  Translator.unicode2AsciiMapExt.set("0x9b20x9cd0x9ac", "0x4f");
  Translator.unicode2AsciiMapExt.set("0x9a40x9cd0x9a8", "0x50");
  Translator.unicode2AsciiMapExt.set("0x9a40x9cd0x9ac", "0x51");
  Translator.unicode2AsciiMapExt.set("0x9a40x9cd0x9ae", "0x52");
  Translator.unicode2AsciiMapExt.set("0x9a40x9cd0x9f0", "0x53");

  Translator.unicode2AsciiMapExt.set("0x9a50x9cd0x9ae", "0x54");
  Translator.unicode2AsciiMapExt.set("0x9b90x9c1", "0x55");

  Translator.unicode2AsciiMapExt.set("0x9a60x9cd0x9a6", "0x56");
  Translator.unicode2AsciiMapExt.set("0x9a60x9cd0x9a60x9cd0x9ac", "0x57");

  Translator.unicode2AsciiMapExt.set("0x9a60x9cd0x9a7", "0x58");
  Translator.unicode2AsciiMapExt.set("0x9a60x9cd0x9ac0x9cd0x9a7", "0x59");
  Translator.unicode2AsciiMapExt.set("0x9a60x9cd0x9ac", "0x5a");
  Translator.unicode2AsciiMapExt.set("0x9a60x9cd0x9ad0x9cd0x9f0", "0x5c");
  Translator.unicode2AsciiMapExt.set("0x9a60x9cd0x9f0", "0x5e");

  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a0", "0x5f");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a1", "0x60");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a40x9c1", "0x63");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9a40x9c1", "0x64");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a60x9cd0x9f0", "0x66");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9a4", "0x21220xa60xbb");
  Translator.unicode2AsciiMapExt.set("0x9b60x9c1", "0x71");

  Translator.unicode2AsciiMapExt.set("0x9ac0x9cd0x9a6", "0x73");
  Translator.unicode2AsciiMapExt.set("0x9ac0x9cd0x9a7", "0x74");
  // bhra  pra
  Translator.unicode2AsciiMapExt.set("0x9ad0x9cd0x9f0", "0x77");
  Translator.unicode2AsciiMapExt.set("0x9aa0x9cd0x9f0", "0x78");
  Translator.unicode2AsciiMapExt.set("0x9ae0x9cd0x9ad", "0x79");

  Translator.unicode2AsciiMapExt.set("0x9ae0x9cd0x9ad0x9cd0x9f0", "0x7a");
  Translator.unicode2AsciiMapExt.set("0x9b60x9cd0x9f0", "0x7c");
  Translator.unicode2AsciiMapExt.set("0x9b20x9cd0x9b2", "0x7e");

  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9b2", "0x80");
  Translator.unicode2AsciiMapExt.set("0x9b90x9cd0x9a8", "0x81");

  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a6", "0xb5");
  Translator.unicode2AsciiMapExt.set("0x9a60x9cd0x9ad", "0xbe");

  Translator.unicode2AsciiMapExt.set("0x9b20x9cd0x9aa", "0x160");

  Translator.unicode2AsciiMapExt.set("0x9aa0x9cd0x9f0", "0x203a0xb6");
  Translator.unicode2AsciiMapExt.set("0x9f00x9c1", "0x310x6e"); // 0xb8 removed

  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9a4", "0x4d0x90");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a4", "0x21220x4c");
  Translator.unicode2AsciiMapExt.set("0x9b60x9cd0x9f1", "0x9d0xab");

  Translator.unicode2AsciiMapExt.set("0x9b60x9cd0x9a8", "0x9d0x178");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a8", "0xf9");

  Translator.unicode2AsciiMapExt.set("0x989", "0xeb0xc20xd7");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9ae", "0x690x6a");
  Translator.unicode2AsciiMapExt.set("0x9970x9cd0x9f0", "0xa20xb6");
  Translator.unicode2AsciiMapExt.set("0x9b60x9cd0x9b2", "0x9d0xad");
  Translator.unicode2AsciiMapExt.set("0x9b70x9cd0x99f", "0xa90x2020");
  Translator.unicode2AsciiMapExt.set("0x9b70x9cd0x99f0x9cd0x9f0", "0xa90x20200xaa");

  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9f1", "0xa60xa4");

  Translator.unicode2AsciiMapExt.set("0x9b90x9cd0x9b2", "0xaf");

  Translator.unicode2AsciiMapExt.set("0x9ae0x9cd0x9aa", "0xa50xf3");

  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9ae", "0xa60x153");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a5", "0x4c0x161");
  Translator.unicode2AsciiMapExt.set("0x9b70x9cd0x9a0", "0x20210xc2");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a8", "0x690xa7");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a7", "0x670xc5");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9a5", "0xa60x161");
  Translator.unicode2AsciiMapExt.set("0x9ac0x9cd0x9f0", "0xf50x70");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x995", "0xa60xa8"); // unicode2AsciiMapExt.set("0x9b80x9cd0x995","0xa60xa8"
                                                              // );
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a7", "0x67");
  //   Translator.unicode2AsciiMapExt.set("0x9a70x9cd0x9f00x9c1", "0xf10xe80x6e");
  //   //0xb8 matra removed
  Translator.unicode2AsciiMapExt.set("0x9cd0x9f0", "0xe8");
  Translator.unicode2AsciiMapExt.set("0x9c1", "0x6e");
  Translator.unicode2AsciiMapExt.set("0x9ae0x9cd0x9ac", "0x690xa4");
  Translator.unicode2AsciiMapExt.set("0x9b20x9cd0x9a1", "0x2039");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x99f", "0x2c6");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9950x9c1", "0xa60xc50xa8");
  Translator.unicode2AsciiMapExt.set("0x9990x9cd0x995", "0x201a");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x995", "0xa90xa8");
  Translator.unicode2AsciiMapExt.set("0x9970x9cd0x9a8", "0xa20x178");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9ab", "0xa60xa3");
  Translator.unicode2AsciiMapExt.set("0x9b70x9cd0x9ae", "0x192");
  Translator.unicode2AsciiMapExt.set("0x9ac0x9cd0x9b2", "0xf50x76");
  Translator.unicode2AsciiMapExt.set("0x9a30x9cd0x99f", "0xb00x490xd7");
  Translator.unicode2AsciiMapExt.set("0x9b90x9cd0x9f0", "0xfd0x7d");
  Translator.unicode2AsciiMapExt.set("0x9b70x9cd0x9aa", "0xa90xf3");
  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9b2", "0xdf0x76");
  Translator.unicode2AsciiMapExt.set("0x9cd", "0xc4");
  Translator.unicode2AsciiMapExt.set("0x9ac0x9cd0x9ac", "0xf50x33");
  Translator.unicode2AsciiMapExt.set("0x9aa0x9cd0x9b2", "0x203a0xad"); // po + lo
  Translator.unicode2AsciiMapExt.set("0x99e", "0xdb0x17e");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9aa", "0xa60xf3");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9a4", "0x21220xa6");
  Translator.unicode2AsciiMapExt.set("0x9a30x9cd0x99f", "0x4b0x490xd7");
  Translator.unicode2AsciiMapExt.set("0x9ae0x9cd0x9ac", "0xa50xa4");
  Translator.unicode2AsciiMapExt.set("0x9b20x9cd0x99f", "0x1520x490xd7");
  Translator.unicode2AsciiMapExt.set("0x9970x9cd0x9b2", "0xa20xad");
  Translator.unicode2AsciiMapExt.set("0x9b60x9cd0x9f00x9c0", "0xc0");
  Translator.unicode2AsciiMapExt.set("0x9b90x9cd0x9ae", "0x70");
  Translator.unicode2AsciiMapExt.set("0x99c0x9cd0x99c", "0x37");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9a40x9cd0x9f0", "0x4c0x61");

  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9a4", "0x4d0x90");

  Translator.unicode2AsciiMapExt.set("0x9950x9cd0x9f0", "0x530x90");

  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x9b8", "0x6b");
  Translator.unicode2AsciiMapExt.set("0x9a30x9cd0x99f", "0xb00x490xd7");
  Translator.unicode2AsciiMapExt.set("0x9a80x9cd0x99f", "0x4b0x490xd7");

  Translator.unicode2AsciiMapExt.set("0x9b70x9cd0x9a3", "0xf80x17e");
  Translator.unicode2AsciiMapExt.set("0x9990x9cd0x997", "0x65");
  Translator.unicode2AsciiMapExt.set("0x9b80x9cd0x9a8", "0xa60xa7");

  Translator.unicode2AsciiMapExt.set("0x9b90x9cd0x9a3", "0xf081");
  Translator.unicode2AsciiMapExt.set("0x9b90x9cd0x9a8", "0xfd0x90");
  Translator.unicode2AsciiMapExt.set("0x9ab0x9cd0x9b2", "0xf40x76");
  }


 static initializeRomanAsciiMap(): void {
  if(Translator.romanAsciiMap != null){
      return;
    }
  Translator.romanAsciiMap = new Map<string,string>();

  Translator.romanAsciiMap.set("0x27", "0x27");

  Translator.romanAsciiMap.set("0x41", "0x41");
  Translator.romanAsciiMap.set("0x42", "0x42");
  Translator.romanAsciiMap.set("0x43", "0x43");
  Translator.romanAsciiMap.set("0x44", "0x44");
  Translator.romanAsciiMap.set("0x45", "0x45");
  Translator.romanAsciiMap.set("0x46", "0x46");
  Translator.romanAsciiMap.set("0x47", "0x47");
  Translator.romanAsciiMap.set("0x48", "0x48");
  Translator.romanAsciiMap.set("0x49", "0x49");
  Translator.romanAsciiMap.set("0x4a", "0x4a");
  Translator.romanAsciiMap.set("0x4b", "0x4b");
  Translator.romanAsciiMap.set("0x4c", "0x4c");
  Translator.romanAsciiMap.set("0x4d", "0x4d");
  Translator.romanAsciiMap.set("0x4e", "0x4e");
  Translator.romanAsciiMap.set("0x4f", "0x4f");

  Translator.romanAsciiMap.set("0x50", "0x50");
  Translator.romanAsciiMap.set("0x51", "0x51");
  Translator.romanAsciiMap.set("0x52", "0x52");
  Translator.romanAsciiMap.set("0x53", "0x53");
  Translator.romanAsciiMap.set("0x54", "0x54");
  Translator.romanAsciiMap.set("0x55", "0x55");
  Translator.romanAsciiMap.set("0x56", "0x56");
  Translator.romanAsciiMap.set("0x57", "0x57");
  Translator.romanAsciiMap.set("0x58", "0x58");
  Translator.romanAsciiMap.set("0x59", "0x59");
  Translator.romanAsciiMap.set("0x5a", "0x5a");

  Translator.romanAsciiMap.set("0x61", "0x61");
  Translator.romanAsciiMap.set("0x62", "0x62");
  Translator.romanAsciiMap.set("0x63", "0x63");
  Translator.romanAsciiMap.set("0x64", "0x64");
  Translator.romanAsciiMap.set("0x65", "0x65");
  Translator.romanAsciiMap.set("0x66", "0x66");
  Translator.romanAsciiMap.set("0x67", "0x67");
  Translator.romanAsciiMap.set("0x68", "0x68");
  Translator.romanAsciiMap.set("0x69", "0x69");
  Translator.romanAsciiMap.set("0x6a", "0x6a");
  Translator.romanAsciiMap.set("0x6b", "0x6b");
  Translator.romanAsciiMap.set("0x6c", "0x6c");
  Translator.romanAsciiMap.set("0x6d", "0x6d");
  Translator.romanAsciiMap.set("0x6e", "0x6e");
  Translator.romanAsciiMap.set("0x6f", "0x6f");

  Translator.romanAsciiMap.set("0x70", "0x70");
  Translator.romanAsciiMap.set("0x71", "0x71");
  Translator.romanAsciiMap.set("0x72", "0x72");
  Translator.romanAsciiMap.set("0x73", "0x73");
  Translator.romanAsciiMap.set("0x74", "0x74");
  Translator.romanAsciiMap.set("0x75", "0x75");
  Translator.romanAsciiMap.set("0x76", "0x76");
  Translator.romanAsciiMap.set("0x77", "0x77");
  Translator.romanAsciiMap.set("0x78", "0x78");
  Translator.romanAsciiMap.set("0x79", "0x79");
  Translator.romanAsciiMap.set("0x7a", "0x7a");

  Translator.romanAsciiMap.set("0x7b", "0x7b");
  Translator.romanAsciiMap.set("0x7c", "0x7c");
  Translator.romanAsciiMap.set("0x7d", "0x7d");
  Translator.romanAsciiMap.set("0x7e", "0x7e");
  Translator.romanAsciiMap.set("0x7f", "0x7f");

  Translator.romanAsciiMap.set("0xb7", "0xb7");
  Translator.romanAsciiMap.set("0x2013", "0x2013");
  Translator.romanAsciiMap.set("0x2014", "0x2014");
  Translator.romanAsciiMap.set("0x201c", "0x201c");
  Translator.romanAsciiMap.set("0x201d", "0x201d");
  Translator.romanAsciiMap.set("0x2018", "0x2018");
  Translator.romanAsciiMap.set("0x2019", "0x2019");

  Translator.romanAsciiMap.set("0xff", "0xff");
  Translator.romanAsciiMap.set("0xeb", "0xeb");
  Translator.romanAsciiMap.set("0x2c", "0x2c");
  Translator.romanAsciiMap.set("0x2f", "0x2f");
  Translator.romanAsciiMap.set("0x3a", "0x3a");
  Translator.romanAsciiMap.set("0x5b", "0x5b");
  Translator.romanAsciiMap.set("0x5d", "0x5d");

  Translator.romanAsciiMap.set("0xe0", "0xe0");
  Translator.romanAsciiMap.set("0xe2", "0xe2");
  Translator.romanAsciiMap.set("0xe4", "0xe4");
  Translator.romanAsciiMap.set("0xe5", "0xe5");

  Translator.romanAsciiMap.set("0xf2", "0xf2");
  Translator.romanAsciiMap.set("0xfb", "0xfb");
  Translator.romanAsciiMap.set("0xe4", "0xe4");
  Translator.romanAsciiMap.set("0xe5", "0xe5");

  Translator.romanAsciiMap.set("0f75", "0xf7");
  Translator.romanAsciiMap.set("0xd4", "0xd4");
  Translator.romanAsciiMap.set("0xd9", "0xd9");

  Translator.romanAsciiMap.set("0xfe", "0xfe");
  // Translator.romanAsciiMap.set("0xbc","0xbc");
  Translator.romanAsciiMap.set("0x2d", "0x2d");

  Translator.romanAsciiMap.set("0x2e", "0x2e");
  Translator.romanAsciiMap.set("0xbc", "0x964");
  // Translator.romanAsciiMap.set( "0x964", "0xbc");
  }

  static initializeVowelModifierMap():void {

  if (Translator.vowelModifierMap != null) return;

  Translator.vowelModifierMap = new Map();
  Translator.vowelModifierMap.set("0x9be", "0x986");

  Translator.vowelModifierMap.set("0x9bf", "0x987");
  Translator.vowelModifierMap.set("0x9c0", "0x988");
  Translator.vowelModifierMap.set("0x9c1", "0x989");

  Translator.vowelModifierMap.set("0x9c2", "0x98A");
  Translator.vowelModifierMap.set("0x9c3", "0x98B");

  Translator.vowelModifierMap.set("0x9c7", "0x98F");
  Translator.vowelModifierMap.set("0x9c8", "0x990");

  Translator.vowelModifierMap.set("0x9cb", "0x993");
  Translator.vowelModifierMap.set("0x9cc", "0x994");
  }

  static getTranslator(): Translator {
    if (Translator.translator !== null) {
      return Translator.translator;
    }
    Translator.translator = new Translator();
    return Translator.translator;
  }

  constructor() {

    Translator.initializeUnicodeToAsciiMap();
    Translator.initializeUnicodeToAsciiMapExt();
    Translator.initializeAsciiToUnicodeMap();
    Translator.initializeVowelModifierMap();
    Translator.initializeAsciiTree();

    Translator.initializeMatraCombinations();
    Translator.initializePrefixMatraCombinations();
    Translator.initializeSuffixMatraCombinations();
    Translator.initializeUnicodeTree();
    Translator.initializeRomanAsciiMap();
  }

  
  static reverse(str: string): string {
  if (str.length <= 0) {
    return "";
  }

  // Split into array of characters, reverse, join back
  return str.split("").reverse().join("");
  }

  static split(str:string,delim:string): string[]{
    const strList: string[] = [];

    if (delim.length === 0) {
      for (let i = 0; i < str.length; i++) {
        strList.push(str[i]); // push each character
      }
      console.log("split", strList.length);
      return strList;
    }

    const list = str.split(delim);
    for (const item of list) {
      if (item !== "") {
        strList.push(item);
      }
    }

    return strList;
  }

static createStringFromCodeList(list: string[], base: number = 16): string {
  let text = "";

  for (const code of list) {
    const value = parseInt(code, base);
    if (!isNaN(value)) {
      text += String.fromCharCode(value);
    }
  }

  return text;
}

 static getStringListFromHexString(word: string, delim: string): string[] {
    const firstList = word.split(delim);
    const resultList: string[] = [];

    for (const code of firstList) {
      const trimmed = code.trim();
      if (trimmed.length > 0) {
        resultList.push(trimmed);
      }
    }

    return resultList;
  }
 
 static getStringListFromUnicodeString(unicodeString: string): string[] {
    const stringList: string[] = [];

    for (const ch of unicodeString) {
      stringList.push(Translator.convertToHexString(ch.charCodeAt(0)));
    }

    return stringList;
  }

  // === getCode ===
 static getCode(line: string, delim: string): string {
    let code = "";

    for (const c of line) {
      // append delim + unicode hex value
      code += delim + c.charCodeAt(0).toString(16);
    }

    return code;
 }

  // === getUnicode ===
 static getUnicode(str: string, delim: string): string {
    // split() already written earlier
    return Translator.createStringFromCodeList(
      Translator.split(str, delim),
      16 // base 16 hex
    );
 }

  // === getUnicodeString ===
 static getUnicodeString(str: string): string {
    let unicodeString = "";

    if (str.length <= 0) {
      return unicodeString;
    }

    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);

      if (
        (2433 <= code && code <= 2554) ||
        code === 0x27 ||
        code === 0x19 ||
        code === 0x2010 ||
        code === 0x2011 ||
        code === 0x2019 ||
        code === 0x2d
      ) {
        unicodeString +=
          "0x" + Translator.convertToHexString(code).toLowerCase();
      }
    }

    return unicodeString;
 }
  // helper (you probably already have this)
 static convertToHexString(value: number): string {
    if (value === 0) {
      return "0";
    }

    let str = "";

    while (value > 0) {
      const remainder = value % 16;
      value = Math.floor(value / 16);

      switch (remainder) {
        case 0: str += "0"; break;
        case 1: str += "1"; break;
        case 2: str += "2"; break;
        case 3: str += "3"; break;
        case 4: str += "4"; break;
        case 5: str += "5"; break;
        case 6: str += "6"; break;
        case 7: str += "7"; break;
        case 8: str += "8"; break;
        case 9: str += "9"; break;
        case 10: str += "a"; break;
        case 11: str += "b"; break;
        case 12: str += "c"; break;
        case 13: str += "d"; break;
        case 14: str += "e"; break;
        case 15: str += "f"; break;
      }
    }

    // the C++ version reverses because digits were appended LSB → MSB
    return Translator.reverse(str);
 }

 createUnicodeWords(input: string, words: string[]): void {
    const splitLines = Translator.split(input, "\n");

    for (const line of splitLines) {
      let word = "";
      let prevSpace = true;
      let tempWord = "";

      for (const c of line) {
        const code = Translator.getCode(c, "0x");

        if (code === "0x20") {
          // handle space
          tempWord = word;
          if (tempWord.replace(/0x20/g, "").length > 0) {
            words.push(word);
          }
          word = "";
          prevSpace = true;
        } else if (code !== "0x20" && prevSpace === true) {
          // first non-space after space
          tempWord = word;
          if (tempWord.replace(/0x20/g, "").length > 0) {
            words.push(word);
          }
          word = "";
          prevSpace = false;
        }

        word += code;
      }

      words.push(word);
      words.push("0xghij"); // keep as marker, same as in C++
    }
  }

 createAsciiWords(input: string, words: string[]): void {
    const splitLines = Translator.split(input, "\n");

    for (const line of splitLines) {
      let word = "";
      let prevSpace = true;
      let tempWord = "";

      for (const c of line) {
        const code = Translator.getCode(c, "0x");

        if (code === "0x20") {
          // handle space
          tempWord = word;
          if (tempWord.replace(/0x20/g, "").length > 0) {
            words.push(word);
          }
          word = "";
          prevSpace = true;
        } else if (code !== "0x20" && prevSpace === true) {
          // first non-space after space
          tempWord = word;
          if (tempWord.replace(/0x20/g, "").length > 0) {
            words.push(word);
          }
          word = "";
          prevSpace = false;
        }

        word += code;
      }

      words.push(word);
      words.push("0xghij");
    }
 }
 static readGeetanjaliFile(fileName: string): string {
    try {
      const data = fileName;
      // Add "\n" at end of each line (fs already keeps line endings intact)
      return data.endsWith("\n") ? data : data + "\n";
    } catch (err: any) {
      console.error("Error reading file:", err.message);
      return "";
    }
  }

  // Equivalent of isNumeric
 static isNumeric(word: string): boolean {
    let processed = word;
    for (const [pattern] of Translator.numericAscii2UnicodeMap) {
      processed = processed.replace(new RegExp(pattern, "g"), "");
    }
    return processed.length === 0;
  }

  // Equivalent of isRoman
 static isRoman(word: string): boolean {
    const charList = word.split("0x").slice(1); // remove first empty element
    const totChars = charList.length;

    let numRoman = 0;
    for (const c of charList) {
      if (Translator.romanAsciiMap!.has("0x" + c)) {
        numRoman++;
      }
    }

    return totChars > 0 && numRoman / totChars > 0.85;
 }
  
 translateNumericAndAssamese(word: string): string {
    let newWord = "";
    let list = Translator.getStringListFromHexString(word, "0x");

    // Consume leading numeric entries
    while (
      list.length > 0 &&
      Translator.numericAscii2UnicodeMap!.has("0x" + list[0])
    ) {
      newWord += Translator.numericAscii2UnicodeMap!.get("0x" + list[0]) ?? "";
      list.shift(); // removeFirst()
    }

    // Rebuild word with remaining hex parts
    word = "";
    while (list.length > 0) {
      word += "0x" + list[0];
      list.shift();
    }

    // Append Assamese translation
    newWord =
      Translator.getUnicode(newWord, "0x") + Translator.translateAssamese(word);

    return newWord;
 }

 static translateAssamese(word: string): string {
    const asciitree = AsciiTrie.getAsciiTrie();
    const matraStack: string[] = [];
    const chandraStack: string[] = [];
    let tempChar = "";
    let output = "";
    let trimmed = true;

    // split word into chars by "0x"
    let chars = Translator.split(word, "0x");

    while (chars.length > 0 && trimmed === true) {
      // remove unwanted prefixes
      word = word.replace(/^0xc3/, "");
      word = word.replace(/^0xc2/, "");
      word = word.replace(/^0xc1/, "");
      word = word.replace(/^0xb8/, "");

      if (["c1", "c2", "c3", "b8"].includes(chars[0])) {
        chars.shift();
        trimmed = true;
        continue;
      }

      const asciiString = asciitree.findPrefix(chars);
      trimmed = false;
      if (asciiString.length === 0) break;
      trimmed = true;

      if (word.indexOf(asciiString) === 0) {
        // remove the matched asciiString from word
        word = word.substring(asciiString.length);

        tempChar = "";
        let tempQChar = "";
        let tempQString = "";

        if (Translator.ascii2UnicodeMatraRefMap!.has(asciiString)) {
          // Ref Matra
          tempQChar = output.charAt(output.length - 1);
          output = output.substring(0, output.length - 1);
          tempQString = Translator.ascii2UnicodeMatraRefMap!.get(asciiString)!;
          tempQString = tempQString.replace("M", Translator.getUnicodeString(tempQChar));
          output += Translator.getUnicode(tempQString, "0x");

        } else if (Translator.ascii2UnicodeMatraLeftMap!.has(asciiString)) {
          // Left Matra
          if (matraStack.length === 0) {
            matraStack.push(asciiString);
          } else if (matraStack.length === 2) {
            tempChar = matraStack.pop()!;
            output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(tempChar)!, "0x");
            tempChar = matraStack.pop()!;
            output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(tempChar)!, "0x");
            matraStack.push(asciiString);

            if (chandraStack.length > 0) {
              tempChar = matraStack.pop()!;
              output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(tempChar)!, "0x");
            }
          }

        } else if (Translator.ascii2UnicodeMatraRightMap!.has(asciiString)) {
          // Right Matra
          if (matraStack.length === 0) {
            output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(asciiString)!, "0x");
          } else if (matraStack.length === 2) {
            tempChar = matraStack.pop()!;
            output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(tempChar)!, "0x");
            tempChar = matraStack.pop()!;
            tempChar += asciiString;
            output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(tempChar)!, "0x");

            if (chandraStack.length > 0) {
              output += Translator.getUnicode("0x981", "0x");
              chandraStack.pop();
            }
          }

        } else if (asciiString === "0xd2") {
          // chandrabindu
          chandraStack.push("0x981");

        } else if (asciiString === "0xc9") {
          // jya kar
          output += this.handle0x9cd(asciiString, matraStack, output);

        } else {
          // Normal character handling
          if (matraStack.length === 0) {
            output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(asciiString)!, "0x");
          } else if (matraStack.length === 1) {
            matraStack.push(asciiString);
          } else if (matraStack.length === 2) {
            if (Translator.ascii2UnicodeExoticMatraMap!.has(asciiString)) {
              tempChar = matraStack.pop()!;
              tempChar = tempChar + Translator.ascii2UnicodeExoticMatraMap!.get(asciiString)!;
              matraStack.push(tempChar);
            } else {
              tempChar = matraStack.pop()!;
              output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(tempChar)!, "0x");
              tempChar = matraStack.pop()!;
              output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(tempChar)!, "0x");
              if (chandraStack.length > 0) {
                output += Translator.getUnicode("0x981", "0x");
                chandraStack.pop();
              }
              output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(asciiString)!, "0x");
            }
          }
        }
      }
    }

    // flush remaining matras
    if (matraStack.length === 2) {
      tempChar = matraStack.pop()!;
      output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(tempChar)!, "0x");
      tempChar = matraStack.pop()!;
      output += Translator.getUnicode(Translator.ascii2UnicodeMap!.get(tempChar)!, "0x");
    }

    return output;
  }

static translateRoman(word: string): string {
    let newWord = "";
    const list = Translator.getStringListFromHexString(word, "0x");

    for (let i = 0; i < list.length; i++) {
      const val = Translator.romanAsciiMap!.get("0x" + list[i]);
      if (val) {
        newWord += val;
      }
    }

    return Translator.getUnicode(newWord, "0x");
  }

  static translateNumeric(word: string): string {
    let newWord = "";
    const list = Translator.getStringListFromHexString(word, "0x");

    for (let i = 0; i < list.length; i++) {
      const val = Translator.numericAscii2UnicodeMap!.get("0x" + list[i]);
      if (val) {
        newWord += val;
      }
    }

    return Translator.getUnicode(newWord, "0x");
  }

  static handle0x9cd(unicodeChar: string, matraStack: string[], output: string): string {
    let tempQChar = "";

    if (matraStack.length === 2) {
      tempQChar = matraStack.pop()!;
      tempQChar = Translator.ascii2UnicodeMap!.get(tempQChar)! + "0x9cd0x9af";
      Translator.ascii2UnicodeMap!.set(tempQChar, tempQChar);
      matraStack.push(tempQChar);

      return "";
    } else if (matraStack.length === 0) {
      // stack empty
      const lastChar = output.charAt(output.length - 1);
      tempQChar = Translator.getUnicodeString(lastChar);

      if (Translator.vowelModifierMap!.has(tempQChar)) {
        // remove last character
        output = output.substring(0, output.length - 1);
        tempQChar = "0x9cd0x9af" + tempQChar;
      } else {
        tempQChar = "0x9cd0x9af";
      }

      return Translator.getUnicode(tempQChar, "0x");
    }

    console.log("nothing found", unicodeChar);
    return "";
  }


 static initializeAsciiTree(): void {
    const asciiTree = AsciiTrie.getAsciiTrie();
    const charMap = new Map<string, string>();
    if(Translator.ascii2UnicodeList == null){
      Translator.ascii2UnicodeList = [];
    }
    for (const itQKeyVal of Translator.ascii2UnicodeList) {
      charMap.set(itQKeyVal.ascii, itQKeyVal.ascii);
      // console.log(itQKeyVal.ascii);
    }

    asciiTree.addWords(charMap);
    // asciiTree.printData();
  }

 static initializeUnicodeTree(): void {
    const unicodeTree = AsciiTrie.getUnicodeTrie();

    const unicode2AsciiExtList: QKeyValuePair[] = [];

    for (const [key] of Translator.unicode2AsciiMapExt!.entries()) {
      // console.log(key);
      unicode2AsciiExtList.push(new QKeyValuePair(key, key.length));
    }

    for (const [key] of Translator.unicode2MatraCombMap!.entries()) {
      unicode2AsciiExtList.push(new QKeyValuePair(key, key.length));
    }

    for (const [key] of Translator.unicode2PrefixMatraCombMap!.entries()) {
      unicode2AsciiExtList.push(new QKeyValuePair(key, key.length));
    }

    for (const [key] of Translator.unicode2SuffixMatraCombMap!.entries()) {
      unicode2AsciiExtList.push(new QKeyValuePair(key, key.length));
    }

    // Sort using the compare function
    unicode2AsciiExtList.sort(compareQKeyValuePair);

    const charMap = new Map<string, string>();
    for (const itQKeyVal of unicode2AsciiExtList) {
      charMap.set(itQKeyVal.ascii, itQKeyVal.ascii);
      // console.log(itQKeyVal.ascii);
    }

    unicodeTree.addWords(charMap);
    unicode2AsciiExtList.length = 0;

    // unicodeTree.printData();
  }

  translateToUnicode(word: string): string {
    let output = "";
    const origword = word;

    if (false && (Translator.i < 0 || Translator.i > 180)) {
      return "";
    }

    Translator.i++;
    if (Translator.i === 706) {
      console.log(`Word number = ${Translator.i}  Word ${word}`);
    }

    if (Translator.isNumeric(word) && Translator.prevWasRoman === false) {
      return Translator.translateNumeric(word) + " ";
    }

    if (Translator.isRoman(word)) {
      Translator.prevWasRoman = true;
      return Translator.translateRoman(word) + " ";
    }

    output = Translator.translateAssamese(word);

    if (word.length > 0) {
      word = origword;
      output = this.translateNumericAndAssamese(word);
    }

    if (word.length > 0) {
      Translator.jerr++;
      console.log(
        `${Translator.jerr} Failed on word ${Translator.i} as ${word} original ${origword}`
      );
    }

    Translator.prevWasRoman = false;
    Translator.i=0;
    Translator.jerr =0;
    return output + " ";
  }

  static isUnicodeEnglish(word: string): boolean {
    const chars = Translator.split(word, "0x");
    for (const Char of chars) {
      if (!Translator.romanAsciiMap!.has("0x" + Char)) {
        return false;
      }
    }
    return true;
  }

  static isUnicodeNumeric(word: string): boolean {
    const chars = Translator.split(word, "0x");
    for (const Char of chars) {
      if (!Translator.numericUnicode2AsciiMap!.has("0x" + Char)) {
        return false;
      }
    }
    return true;
  }

  translateTextToAscii(text: string): string {
    const unicodeWords: string[] = [];
    Translator.translator!.createUnicodeWords(text, unicodeWords);

    let output = "";
    for (const word of unicodeWords) {
      if (word === "0xghij") {
        output += "\n";
      } else {
        output += Translator.translator!.translateToAscii(word) + " ";
      }
    }
    return output;
  }

static translateTextToUnicode(text: string): string {

    if (!Translator.translator) {
      throw new Error("Translator not initialized");
    }

    const geetanjaliWords: string[] = [];
    Translator.translator.createAsciiWords(text, geetanjaliWords);

    let output = "";
    let i = 1;

    for (const word of geetanjaliWords) {
      if (word === "0xghij") {
        output += "\n";
      } else {
        output += Translator.translator.translateToUnicode(word);
        i++;
      }
    }

    return output;
  }
  translateToAscii(word: string): string {
    if (Translator.isUnicodeEnglish(word)) {
      return this.translateToEnglishAscii(word);
    } else if (Translator.isUnicodeNumeric(word)) {
      return this.translateToNumericAscii(word);
    } else {
      return this.translateToAssameseAscii(word);
    }
  }

  private translateToNumericAscii(word: string): string {
    let output = "";
    const chars = Translator.split(word, "0x");

    for (const Char of chars) {
      const val = Translator.numericUnicode2AsciiMap!.get("0x" + Char);
      if (val) {
        output += Translator.getUnicode(val, "0x");
      }
    }
    return output;
  }

  private translateToEnglishAscii(word: string): string {
    let output = "";
    const chars = Translator.split(word, "0x");

    for (const Char of chars) {
      const val = Translator.romanAsciiMap!.get("0x" + Char);
      if (val) {
        output += Translator.getUnicode(val, "0x");
      }
    }
    return output;
  }

  translateToAssameseAscii(word: string): string {
  const unicodeTree = AsciiTrie.getUnicodeTrie();
  let output = "";

  const origWord = word;
  // static unsigned int i = 0;  → not needed, unless you want a persistent counter
  let trimmed = true;
  let chars: string[] = Translator.split(word, "0x");
  let prevWord = "";
  let prefixMatra = "";
  let suffixMatra = "";

  const chandra = /0x9aa0x9cd0x9b2/;
  if (chandra.test(word)) {
    console.debug("word=", word);
  }

  while (chars.length > 0 && trimmed === true) {
    const unicodeString = unicodeTree.findPrefix(chars);

    if (unicodeString === "0x20") {
      trimmed = true;
      continue;
    }

    trimmed = false;
    if (unicodeString.length === 0) break;
    trimmed = true;

    if (word.startsWith(unicodeString)) {
      word = word.replace(unicodeString, "");

      if (Translator.unicode2MatraCombMap!.has(unicodeString)) {
        const comb = Translator.unicode2MatraCombMap!.get(unicodeString)!;
        if (comb.left !== "") {
          output += Translator.getUnicode(comb.left, "0x");
        }
        output += prevWord;
        if (comb.right !== "") {
          output += Translator.getUnicode(comb.right, "0x");
        }
        prevWord = "";
      } else if (Translator.unicode2PrefixMatraCombMap!.has(unicodeString)) {
        prefixMatra = unicodeString;
      } else if (Translator.unicode2SuffixMatraCombMap!.has(unicodeString)) {
        suffixMatra = unicodeString;

        if (suffixMatra.length > 0) {
          const comb = Translator.unicode2SuffixMatraCombMap!.get(suffixMatra)!;
          if (comb.left !== "") {
            prevWord =
              Translator.getUnicode(comb.left, "0x") + prevWord;
          }
          if (comb.right !== "") {
            prevWord =
              prevWord + Translator.getUnicode(comb.right, "0x");
          }
          suffixMatra = "";
        }
      } else if (Translator.unicode2AsciiMapExt!.has(unicodeString)) {
        if (chandra.test(origWord)) {
          console.debug(
            "output word =",
            unicodeString,
            Translator.unicode2AsciiMapExt!.get(unicodeString)
          );
        }
        output += prevWord;
        prevWord = Translator.getUnicode(
          Translator.unicode2AsciiMapExt!.get(unicodeString)!,
          "0x"
        );

        if (prefixMatra.length > 0) {
          const comb = Translator.unicode2PrefixMatraCombMap!.get(prefixMatra)!;
          if (comb.left !== "") {
            prevWord = Translator.getUnicode(comb.left, "0x") + prevWord;
          }
          if (comb.right !== "") {
            prevWord = prevWord + Translator.getUnicode(comb.right, "0x");
          }
          prefixMatra = "";
        }
      }
    }
  }

  if (prevWord.length > 0) {
    output += prevWord;
  }

  if (chandra.test(origWord)) {
    console.debug("output word =", output);
  }

  return output;
  }

 }
