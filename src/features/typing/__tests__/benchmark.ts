import { performance } from "perf_hooks";
import { useTypingStore } from "../store";
import { DEFAULT_TYPING_CONFIG } from "../constants";

// Helper to generate text
function generateText(wordCount: number): string {
  const words = ["hello", "world", "type", "fast", "benchmark", "stress", "test", "react", "engine", "zustand"];
  const out = [];
  for (let i = 0; i < wordCount; i++) {
    out.push(words[Math.floor(Math.random() * words.length)]);
  }
  return out.join(" ");
}

function runBenchmark(wpmTarget: number, textLengthWords: number) {
  console.log(`\n==============================================`);
  console.log(`Running Benchmark: ${wpmTarget} WPM | ${textLengthWords} Words`);
  
  const text = generateText(textLengthWords);
  const totalKeystrokes = text.length; // rough estimate
  
  // Calculate keystroke interval to simulate the WPM
  // WPM = (Keystrokes / 5) / Minutes
  // Minutes = (Keystrokes / 5) / WPM
  // Total Ms = Minutes * 60 * 1000
  // Interval Ms = Total Ms / Keystrokes
  const totalMinutes = (totalKeystrokes / 5) / wpmTarget;
  const totalMs = totalMinutes * 60 * 1000;
  const intervalMs = totalMs / totalKeystrokes;

  console.log(`Target Keystroke Interval: ${intervalMs.toFixed(2)}ms`);
  console.log(`Total Characters: ${totalKeystrokes}`);

  const store = useTypingStore.getState();
  
  // Measure Initialization
  const initStart = performance.now();
  store.initSession(text, DEFAULT_TYPING_CONFIG);
  const initTime = performance.now() - initStart;
  console.log(`Initialization Time: ${initTime.toFixed(2)}ms`);

  // Measure Keystroke Latency
  let maxLatency = 0;
  let totalLatency = 0;
  const latencies: number[] = [];

  const startMem = process.memoryUsage().heapUsed;

  // We run this synchronously as fast as possible to measure RAW latency, 
  // rather than actually waiting the interval (which would just measure setTimeout overhead)
  const fullRunStart = performance.now();

  for (let i = 0; i < totalKeystrokes; i++) {
    const key = text[i];
    
    const keyStart = performance.now();
    useTypingStore.getState().handleKeystroke(key);
    const keyLatency = performance.now() - keyStart;
    
    if (keyLatency > maxLatency) maxLatency = keyLatency;
    totalLatency += keyLatency;
    latencies.push(keyLatency);
  }

  const fullRunTime = performance.now() - fullRunStart;
  const endMem = process.memoryUsage().heapUsed;

  const avgLatency = totalLatency / totalKeystrokes;
  
  console.log(`--- Results ---`);
  console.log(`Total Engine Processing Time: ${fullRunTime.toFixed(2)}ms`);
  console.log(`Average Keystroke Latency: ${avgLatency.toFixed(3)}ms`);
  console.log(`Max Keystroke Latency: ${maxLatency.toFixed(3)}ms`);
  console.log(`Memory Delta: ${((endMem - startMem) / 1024 / 1024).toFixed(2)} MB`);
  
  // Check if we meet 60FPS budget (16.6ms per frame)
  if (maxLatency < 16) {
    console.log(`✅ Engine easily maintains 60FPS budget (Max < 16ms)`);
  } else {
    console.log(`❌ Frame drops detected! Max latency exceeded 16ms.`);
  }
}

// 100 WPM
runBenchmark(100, 50);

// 200 WPM
runBenchmark(200, 500);

// 300+ WPM (approx 5,000 characters is roughly 1000 words)
runBenchmark(300, 1000);
