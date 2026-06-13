import { Utilities } from '../utils/Utilities';

export class ToolTipSingleton{
  static hasAssamesePrefix(newWord:string) {
        const reversedWord = Utilities.reverseX(newWord);
     
      let romanCount = 0;
      for (let i = 0; i < reversedWord.length && /[a-zA-Z]/.test(reversedWord[i]); i++) {
        romanCount++;
      }

      return romanCount < reversedWord.length;
    }
}
