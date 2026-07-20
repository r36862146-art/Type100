interface CharacterCounterProps {
  current: number;
  max: number;
}

export function CharacterCounter({ current, max }: CharacterCounterProps) {
  const isOver = current > max;
  
  return (
    <div 
      className={`text-sm mt-1 text-right ${isOver ? 'text-destructive font-medium' : 'text-muted-foreground'}`}
      aria-live="polite"
    >
      {current} / {max}
    </div>
  );
}
