

function notAName(char: string) {
  return /[^a-zA-Z0-9]/.test(char);
}

function isSpace(char: string) {
  return "\n ".includes(char);
}

function combineWordWithSpaces(items: string[]) {
  if (items.length === 0) {
    return items;
  }
  const tmp: string[] = [];
  items[items.length - 1] += " ";
  let last = items[0];
  for (let i = 1; i < items.length; i++) {
    const isLastSpace = isSpace(last[last.length - 1]);
    const isCurrentSpace = isSpace(items[i][0]);
    if (!isLastSpace && isCurrentSpace) {
      tmp.push(last + items[i]);
      last = items[i]
    } else if (isLastSpace && !isCurrentSpace) {
      last = last + items[i];
    } else if (isLastSpace && isCurrentSpace) {
      last = last + items[i];
    } else {
      tmp.push(last);
      last = items[i];
    }
  }
  if (tmp[tmp.length - 1] !== undefined) {
    tmp[tmp.length - 1] = tmp[tmp.length - 1].slice(0, -1);
  }
  return tmp;
}

export class QuizAttr {

  typeContent: [string, string][]

  constructor(content: [string, string][]) {
    this.typeContent = content;
  }

  static from(text: string) {
    // split to space, word, character items
    text = ` ${text}  `;
    //return `'${text}'`;
    let pieces: string[] = [];
    let idx = 0;
    let tmp = "";
    while (idx + 2 < text.length) {
      const [isSpacePrev, isCharPrev, isSpecialPrev, prevChar] = [isSpace(text[idx]), (!notAName(text[idx]) && !isSpace(text[idx])), (notAName(text[idx]) && !isSpace(text[idx])), text[idx]];
      const [isSpacePost, isCharPost, isSpecialPost] = [isSpace(text[idx + 1]), (!notAName(text[idx + 1]) && !isSpace(text[idx + 1])), (notAName(text[idx + 1]) && !isSpace(text[idx + 1]))];

      if (
        // "c "
        (isCharPrev && isSpacePost) ||
        // "+ "
        (isSpecialPrev && isSpacePost) ||
        // " c"
        (isSpacePrev && isCharPost) ||
        // " +"
        (isSpacePrev && isSpecialPost) ||
        // "c+"
        (isCharPrev && isSpecialPost) ||
        // "+c"
        (isSpecialPrev && isCharPost)
      ) {
        tmp += prevChar;
        pieces.push(tmp);
        tmp = "";
      } else if (
        // "cc"
        (isCharPrev && isCharPost) ||
        // "++"
        (isSpecialPrev && isSpecialPost) ||
        // "  "
        (isSpacePrev && isSpacePost)
      ) {
        tmp += prevChar;
      }
      idx++;
    }
    // return pieces;
    let tmpS: string[] = [];
    // split operators except NOT_SPLIT
    const NOT_SPLIT = ["===", "!==", "==", "!=", "+=", "-=", "*=", "/=", "%=", "++", "--"];
    pieces.slice(1).forEach(i => {
      if (notAName(i) && !isSpace(i[0])) {
        if (NOT_SPLIT.includes(i)) {
          tmpS.push(i);
        } else {
          tmpS = tmpS.concat(i.split(""));
        }
      } else {
        tmpS.push(i);
      }
    });
    pieces = tmpS;
    //return pieces;
    // combine word, chars whit spaces
    pieces = combineWordWithSpaces(pieces);
    return pieces;
    //const result: [string, string[]][] = [];
    const tmpMap = new Map<string, string[]>();
    pieces.forEach(i => {
      const tmp = i.trim();
      const arr = tmpMap.get(tmp) ?? [];
      tmpMap.set(tmp, arr.concat(i));
    });
    const result = Array.from(tmpMap.entries());
    return result.shuffle();
  }
}
