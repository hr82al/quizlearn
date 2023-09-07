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

function isLetter(ch: string) {
  return !NOT_LETTERS.includes(ch);
}

function isSpace(ch: string) {
  return " \n".includes(ch);
}

declare global {
  interface Array<T> {
      shuffle(): Array<T>;
      count(element: T): number;
      compareTo(arr: T[]): boolean;
  }
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