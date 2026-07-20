export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const lerp = (start: number, end: number, amt: number) => (1 - amt) * start + amt * end;
