export type EngineEvent =
  | { type: "FIRST_KEY" }
  | { type: "CHARACTER_TYPED"; payload: { char: string } }
  | { type: "CHARACTER_CORRECT"; payload: { char: string } }
  | { type: "CHARACTER_INCORRECT"; payload: { expected: string; typed: string } }
  | { type: "WORD_COMPLETED"; payload: { wordIndex: number } }
  | { type: "WORD_INCOMPLETED"; payload: { wordIndex: number } }
  | { type: "BACKSPACE"; payload: { erasedState: string } }
  | { type: "TEXT_EXHAUSTED" }
  | { type: "SESSION_COMPLETED" };

export interface EngineResult<T = any> {
  nextState: T;
  events: EngineEvent[];
}
