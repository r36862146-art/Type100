import { TypingSession, Word } from "../types";
import { EngineEvent, EngineResult } from "../types/events";
import { matcher } from "./matcher";
import { cursorMath } from "./cursor";

/**
 * The core business logic engine for the typing experience.
 * Fully decoupled from React and state management libraries.
 */
export const typingEngine = {
  processKey(session: TypingSession, key: string): EngineResult<TypingSession> {
    // If finished, ignore
    if (session.status === "finished") {
      return { nextState: session, events: [] };
    }

    const events: EngineEvent[] = [];
    const isFirstKey = session.status === "idle";
    
    if (isFirstKey) {
      events.push({ type: "FIRST_KEY" });
    }

    const newStatus = isFirstKey ? "running" : session.status;
    const { words, cursor, config } = session;
    const { wordIndex, charIndex } = cursor;
    const currentWord = words[wordIndex];
    const currentCharacter = currentWord.characters[charIndex];

    const newWords = [...words];
    const newCurrentWord = { ...currentWord, characters: [...currentWord.characters] };
    newWords[wordIndex] = newCurrentWord;
    
    const wordLengths = cursorMath.getWordLengths(words);

    // ==========================================
    // BACKSPACE
    // ==========================================
    if (key === "Backspace") {
      const newCursor = cursorMath.retreat(wordLengths, cursor, config.allowCrossWordBackspace);
      
      if (newCursor.wordIndex !== cursor.wordIndex || newCursor.charIndex !== cursor.charIndex) {
        
        const targetWord = newWords[newCursor.wordIndex];
        const targetChar = targetWord.characters[newCursor.charIndex];
        
        events.push({ type: "BACKSPACE", payload: { erasedState: targetChar.state } });

        if (targetChar.state === "extra") {
          const updatedWord = { ...targetWord, characters: [...targetWord.characters] };
          updatedWord.characters.pop();
          newWords[newCursor.wordIndex] = updatedWord;
          
          if (updatedWord.characters.length > 0) {
            updatedWord.characters[updatedWord.characters.length - 1] = {
              ...updatedWord.characters[updatedWord.characters.length - 1],
              state: "current"
            };
          }
        } else {
          const updatedWord = { ...targetWord, characters: [...targetWord.characters] };
          
          if (newWords[cursor.wordIndex].characters[cursor.charIndex]) {
             const oldWord = newCursor.wordIndex === cursor.wordIndex ? updatedWord : { ...newWords[cursor.wordIndex], characters: [...newWords[cursor.wordIndex].characters] };
             oldWord.characters[cursor.charIndex] = { ...oldWord.characters[cursor.charIndex], state: "idle" };
             newWords[cursor.wordIndex] = oldWord;
          }

          updatedWord.characters[newCursor.charIndex] = { ...targetChar, state: "current" };
          newWords[newCursor.wordIndex] = updatedWord;
          
          if (newCursor.wordIndex < cursor.wordIndex) {
             for (let i = newCursor.charIndex + 1; i < updatedWord.characters.length; i++) {
               updatedWord.characters[i] = { ...updatedWord.characters[i], state: "idle" };
             }
          }
        }

        return {
          nextState: { ...session, status: newStatus, words: newWords, cursor: newCursor },
          events
        };
      }
      return { nextState: { ...session, status: newStatus }, events };
    }

    // ==========================================
    // EARLY SPACE
    // ==========================================
    if (key === " " && charIndex < currentWord.characters.length - 1) {
       for (let i = charIndex; i < newCurrentWord.characters.length; i++) {
          newCurrentWord.characters[i] = { ...newCurrentWord.characters[i], state: "missed" };
       }
       
       events.push({ type: "CHARACTER_TYPED", payload: { char: " " } });
       events.push({ type: "WORD_COMPLETED", payload: { wordIndex } });
       
       const newCursor = cursorMath.jumpToNextWord(wordLengths, cursor);
       
       if (newCursor) {
          const nextWord = { ...newWords[newCursor.wordIndex], characters: [...newWords[newCursor.wordIndex].characters] };
          nextWord.characters[newCursor.charIndex] = { ...nextWord.characters[newCursor.charIndex], state: "current" };
          newWords[newCursor.wordIndex] = nextWord;
          
          return {
             nextState: { ...session, status: newStatus, words: newWords, cursor: newCursor },
             events
          };
       } else {
          events.push({ type: "SESSION_COMPLETED" });
          return { nextState: { ...session, status: "finished", words: newWords }, events };
       }
    }

    events.push({ type: "CHARACTER_TYPED", payload: { char: key } });

    // ==========================================
    // EXTRA CHARACTERS
    // ==========================================
    if (charIndex >= currentWord.characters.length) {
       const extraChar = {
          id: `w${wordIndex}_c${charIndex}`,
          value: key,
          state: matcher.matchCharacter(undefined, key),
          wordIndex,
          charIndex
       };
       newCurrentWord.characters.push(extraChar);
       events.push({ type: "CHARACTER_INCORRECT", payload: { expected: "", typed: key } });
       
       // Update lengths to account for newly added extra char
       const updatedLengths = [...wordLengths];
       updatedLengths[wordIndex] = newCurrentWord.characters.length;
       
       return {
          nextState: { ...session, status: newStatus, words: newWords, cursor: { wordIndex, charIndex: charIndex + 1 } },
          events
       };
    }

    // ==========================================
    // NORMAL MATCHING
    // ==========================================
    const matchState = matcher.matchCharacter(currentCharacter.value, key);
    newCurrentWord.characters[charIndex] = {
       ...currentCharacter,
       state: matchState
    };

    if (matchState === "correct") {
      events.push({ type: "CHARACTER_CORRECT", payload: { char: key } });
    } else {
      events.push({ type: "CHARACTER_INCORRECT", payload: { expected: currentCharacter.value, typed: key } });
    }

    const newCursor = cursorMath.advance(wordLengths, cursor);
    
    // Check if word is completed
    if (newCursor && newCursor.wordIndex > wordIndex) {
      events.push({ type: "WORD_COMPLETED", payload: { wordIndex } });
    } else if (!newCursor) {
      events.push({ type: "WORD_COMPLETED", payload: { wordIndex } });
      events.push({ type: "SESSION_COMPLETED" });
    }

    if (newCursor) {
       const targetWord = newCursor.wordIndex === wordIndex ? newCurrentWord : { ...newWords[newCursor.wordIndex], characters: [...newWords[newCursor.wordIndex].characters] };
       targetWord.characters[newCursor.charIndex] = { ...targetWord.characters[newCursor.charIndex], state: "current" };
       newWords[newCursor.wordIndex] = targetWord;
       
       return {
          nextState: { ...session, status: newStatus, words: newWords, cursor: newCursor },
          events
       };
    } else {
       return {
          nextState: { ...session, status: "finished", words: newWords },
          events
       };
    }
  }
};
