
import { useSession } from "next-auth/react";

const NOT_LETTERS = "!@#$%^&*()_-+={}[:;\"'\\|,.<>/?]"
const NOT_LETTERS_R = /[!@#$%^&*()_={}[:;\"'\\|,.<>/?\]+-]/


export function splitToElements(dbQuestion: string): string[] {

  if (dbQuestion.length === 0) {
    return [];
  }

  let elements: string[] = [];
  let element = "";
  let prevCh =  dbQuestion[0];
  for (const ch of dbQuestion) {
    element += ch;
    const isPrevLetter = isLetter(prevCh);
    const isCurrLetter = isLetter(ch);
    const isPrevSpace = isSpace(prevCh);
    const isCurrSpace = isSpace(ch)
    if (isPrevLetter && !isCurrLetter ||
        isPrevSpace && !isCurrSpace ||
        !isPrevLetter && isCurrLetter && !isCurrSpace
      ) {
      elements.push(element.slice(0,-1));
      element = element.slice(-1);
    }
    // updates for next step
    prevCh = ch;
  }
  elements.push(element);
  elements = splitOperators(elements);
  return elements;
}

function splitOperators(x: string[]) {
  let out: string[] = [];
  for (const v of x) {
    if (!NOT_LETTERS_R.test(v)) {
      out.push(v);
      continue;
    }
    if (/^(===|==|!==|!=)/.test(v)) {
      out.push(v);
      continue;
    }
    let tmp = v.trim();
    if (tmp.length === v.length) {
      out.push(...v.split(""));
    } else {
      out.push(...tmp.split("").slice(0,-1));
      out.push(v.slice(tmp.length - 1));
    }
  }
  return out;
}


declare global {
  interface Array<T> {
      shuffle(): Array<T>;
      count(element: T): number;
      compareTo(arr: T[]): boolean;
      mapJoin<U>(callbackfn: (value: T, index: number, array: T[]) => U, callbackSep: (index: number) => U, thisArg?: any): U[];
  }
}


/* take array and 2 call backs 
for example arr = [1,2,3]
arr.mapJoin((x)=>x, (y) => 0);
will result
[1,0,2,0,3]
*/
Array.prototype.mapJoin = function<U, T>(callbackfn: (value: T, index: number, array: T[]) => U, callbackSep: (index: number) => U, thisArg?: any): U[] {
    if (this.length <= 1) {
      if (this.length === 0) {
        return [];
      } else {
        return [callbackfn(this[0], 0, this)];
      }
    }
    const out: U[] = [];
    let idx = 0;
    for (let i = 0; i < this.length - 1; i++) {
      out.push(callbackfn(this[i], idx, this));
      idx++;
      out.push(callbackSep(idx));
      idx++;
    }
    out.push(callbackfn(this[this.length - 1], idx, this));
    return out;
  }


Array.prototype.compareTo = function(arr) {
  if (this.length !== arr.length) {
    return false;
  }
  for (let i = 0; i < this.length; i++) {
    if (this[i] !== arr[i]) {
      return false;
    }
  }
  return true;
}

Array.prototype.shuffle = function() {
  const indexes: number[] = [];
  for (let i = 0; i < this.length; i++) {
    while (true) {
      let tmp = Math.floor(Math.random() * this.length);
      if (!indexes.includes(tmp)) {
        indexes.push(tmp);
        break;
      }
    }
  }
  const out: string[][] = Array(this.length).fill([]);
  for (let i = 0; i < this.length; i++) {
    out[i] = this[indexes[i]]
  }
  return out;
}

Array.prototype.count = function(element) {
  return this.filter(e => e === element).length;
}

function splitToWords(text: string): string[] {
  return text.split(" ").filter(w => w.length > 0);
}

function checkVariant(text1: string, text2: string) {
  const tmp1 = splitToWords(text1);
  const tmp2 = splitToWords(text2);
  if (tmp1.length != tmp2.length) {
    return false;
  }
  for (let i = 0; i < tmp1.length; i++) {
    if (tmp1[i] !== tmp2[i]) {
      return false;
    } 
  }
  return true;
}


/*
An answer in a database can be in two variants
1 - plain string 
  "Some answer"
2 - array encoded as a json in a plain string. And checker should output correct if user's answer is equal on of the variants
  '["text1","text2"]' 
 */
export function checkFill(usersAnswer: string, dbAnswer: string) {
  
  try {
    let tmp = JSON.parse(dbAnswer) as string[];
    for (const i of tmp) {
      if (checkVariant(i, usersAnswer)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    return checkVariant(dbAnswer, usersAnswer);
  }
}

export function useIsAdmin() {
  const session = useSession();
  return session.data?.user?.email === "hr82al@gmail.com";
}

export async function getUser(user:string | null | undefined, email: null | string = null) {
  if (user === null || user === undefined) {
    return null;
  }
  const host = process.env.NEXTAUTH_URL ?? ""
  const result = await (await fetch(
    `${host}/api/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name: user, email: email}),
    }
  )).json();
    return result as { id: number, name: string, bcryptHash: string, email: string };
}

type EdgeFunction = (text: string) => boolean


function splitByEdgeFunction(text: string, edgeFunction: EdgeFunction) {
    // find all indexes whose prev element is differ result of edge function
    if (text.length < 2) {
        return [0, text.length];
    }
    let indexes = []
    for (let i = 1; i < text.length; i++) {
        const isPrevSpace = edgeFunction(text[i - 1]);
        const isCurSpace = edgeFunction(text[i]);

        if (isCurSpace !== isPrevSpace) {
            indexes.push(i);
        }
    }
    return indexes
}

function shuffle<T>(arr: T[]) {
    let tmp: T[] = [];
    while (arr.length > 0) {
        const rand = Math.floor(Math.random() * arr.length);
        tmp = tmp.concat(arr.splice(rand, 1));
    }
    return tmp;
}

function isSpace(ch: string) {
    return " \n".includes(ch);
}

function splitBySpaces(text: string) {
    // find all index where meet space and not space
    return splitByEdgeFunction(text, isSpace);
}


function isLetter(ch: string) {
    return /[a-zA-Z0-9]/.test(ch);
}

function splitByLetter(text: string) {
    // find all indexes where meet letter and not letter
    return splitByEdgeFunction(text, isLetter);
}


export function splitToItems(text: string) {
    const spaceEdges = splitBySpaces(text);
    const letterEdges = splitByLetter(text);
    const edges = Array.from(
        new Set([0,text.length].concat(spaceEdges, letterEdges))
    ).sort((x,y) => x - y);

    let elements = [];
    for (let i = 1; i < edges.length; i++) {
        elements.push(text.slice(edges[i - 1], edges[i]));
    }

    // split not letters and not in a list by character
    let tmp: string[] = [];
    const NOT_SPLIT = [
        "==",
        "===",
        "!=",
        "!==",
        "=>",
        ">=",
        "<=",
        "++",
        "--",
        "+=",
        "-=",
        "*=",
        "/=",
        "%="
    ];
    elements.forEach(i => {
        if (!isSpace(i[0]) && !isLetter(i[0]) && !NOT_SPLIT.includes(i)) {
            tmp = tmp.concat(i.split(""));
        } else {
            tmp.push(i);
        }
    });
    elements = tmp;

    // add to elements trailing spaces
    let elementsWithSpaces = [];
    for (let i = 0; i < elements.length - 1; i++) {
        const nextIsSpace = isSpace(elements[i + 1].slice(0, 1));
        if (nextIsSpace) {
            elementsWithSpaces.push(elements[i] + elements[i + 1]);
            i++;
        } else {
            elementsWithSpaces.push(elements[i]);
        }
    }
    const last = elements[elements.length - 1];
    if (typeof last === "string" && last.length > 0 && !isSpace(last[0])) {
        elementsWithSpaces.push(last);
    }
    
    // combine resembles to groups
    let groupsMap = new Map<string, string[]>();
    elementsWithSpaces.forEach(i => {
        const trimmed = i.trim();
        const value = (groupsMap.get(trimmed) ?? []).concat(i);
        groupsMap.set(
            trimmed,
            value,
        )
    });
    const groups = Array.from(groupsMap.entries());
    return shuffle(groups);
}

export function capitalize(text: string) {
    if (text.length > 0) {
        return text.at(0)?.toUpperCase() + text.slice(1);
    }
    return text;
}