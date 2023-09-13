

function notAName(char: string) {
  return /[^a-zA-Z0-9]/.test(char);
}

function withEdgeSpaces(text: string, elems: string[]) {
  let result: string[] = [];
  elems.forEach(elem => {

  });
}

function isSpace(char: string) {
  return  "\n ".includes(char);
}

export class QuizAttr {

  typeContent: [string, string][]

  constructor(content: [string, string][]) {
    this.typeContent = content;
  }

  static from(text: string) {
    // split to space, word, character items
    text = ` ${text} `;
    let pieces: string[] = [];
    let idx = 0;
    let tmp = "";
    while (idx + 2 < text.length) {
      const [isSpacePrev, isCharPrev, isSpecialPrev, prevChar] = [isSpace(text[idx]), (!notAName(text[idx]) && !isSpace(text[idx])), (notAName(text[idx]) && !isSpace(text[idx])), text[idx]];
      const [isSpacePost, isCharPost, isSpecialPost] = [isSpace(text[idx + 1]), (!notAName(text[idx + 1]) && !isSpace(text[idx + 1])), (notAName(text[idx + 1]) && !isSpace(text[idx + 1]))];

      if (
         // "c "
        (isCharPrev && isSpacePost)        ||
        // "+ "
        (isSpecialPrev && isSpacePost)     ||
        // " c"
        (isSpacePrev && isCharPost)        ||
        // " +"
        (isSpacePrev && isSpecialPost)     ||
        // "c+"
        (isCharPrev && isSpecialPost)      ||
        // "+c"
        (isSpecialPrev && isCharPost)
      ) {
        tmp += prevChar;
        pieces.push(tmp);
        tmp = "";
      } else if (
        // "cc"
        (isCharPrev && isCharPost)         ||
         // "++"
         (isSpecialPrev && isSpecialPost)  ||
         // "  "
         (isSpacePrev && isSpacePost)
      ) {
        tmp += prevChar;
      }
      idx++;
    }
    let tmpS: string[] = []; 
    // split operators except NOT_SPLIT
    const NOT_SPLIT = ["===", "!==", "==", "!=", "+=", "-=", "*=", "/=", "%="];
    pieces.forEach(i => {
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
    pieces = tmpS.slice(1,-1);

    // combine word, chars whit spaces
    idx = 0;
    const items = new Map<string, string[]>()
    while (idx + 3 < pieces.length) {
      const slice = pieces.slice(idx, idx + 3);
      const [isSpacePrev, prevText] = [isSpace(slice[0].at(0) ?? ""), slice[0]];
      const [isSpaceRoot, rootText] = [isSpace(slice[1].at(0) ?? ""), slice[1]];
      const [isSpacePost, postText] = [isSpace(slice[2].at(0) ?? ""), slice[2]];
      if (isSpacePrev && !isSpaceRoot && isSpacePost) {
          const arr = items.get(rootText) ?? [];
          items.set(rootText, arr.concat(`${prevText}${rootText}${postText}`));
      }
      idx++;
    }
    const result: [string, string[]][] = [];
    for (const [k, v] of Array.from(items.entries())) {
      result.push([k, v]);
    }
    return result.shuffle();
  }
}