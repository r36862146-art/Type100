import { cursorMath } from "../src/features/typing/engine/cursor";
import { matcher } from "../src/features/typing/engine/matcher";
import { parseTextToModel } from "../src/features/typing/parser";

const words = parseTextToModel("hi there");
const lengths = cursorMath.getWordLengths(words);

let cursor = { wordIndex: 1, charIndex: 4 }; // 'e' of 'there' (length 5)
let newCursor = cursorMath.advance(lengths, cursor);

console.log("Cursor after advance:", newCursor);

if (!newCursor) {
  console.log("TEXT EXHAUSTED");
}
