import { Infillinator } from "@/redux/features/quiz/quizSlice";

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

export function prettyQuiz(quiz: Infillinator[]): string {
    let result: string[] = [];
    quiz.forEach(i => {
        const value = i[0];
        const key = i[1].map(i => `"${i}"`).join(", ");
        result.push(`"${value}":\n    ${key}`);
    });
    return result.join("\n");
}

export function capitalize(text: string) {
    if (text.length > 0) {
        return text.at(0)?.toUpperCase() + text.slice(1);
    }
    return text;
}