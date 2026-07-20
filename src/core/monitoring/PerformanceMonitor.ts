import { eventBus } from "../analytics/EventBus";

export type MetricType = 
  | "PluginInit" 
  | "DatasetLoad" 
  | "TypingLatency" 
  | "RenderCycle" 
  | "MemorySnapshot";

export interface PerformanceMetric {
  type: MetricType;
  durationMs?: number;
  memoryUsageMB?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private activeTimers: Map<string, number> = new Map();

  /**
   * Starts a timer for a specific operation.
   */
  public startTimer(id: string): void {
    this.activeTimers.set(id, performance.now());
  }

  /**
   * Ends a timer and logs the duration metric.
   */
  public endTimer(id: string, type: MetricType, metadata?: Record<string, any>): number {
    const startTime = this.activeTimers.get(id);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.activeTimers.delete(id);

    this.record({
      type,
      durationMs: duration,
      timestamp: Date.now(),
      metadata
    });

    return duration;
  }

  /**
   * Records a raw metric manually (e.g. typing latency from the engine).
   */
  public record(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    // Keep bounded history
    if (this.metrics.length > 500) {
      this.metrics.shift();
    }
    
    // Optionally fire to event bus if slow
    if (metric.durationMs && metric.durationMs > 100) {
      console.warn(`[Performance Monitor] Slow operation detected: ${metric.type} took ${metric.durationMs.toFixed(2)}ms`, metric.metadata);
    }
  }

  /**
   * Takes a snapshot of current JS heap usage if available.
   */
  public captureMemorySnapshot(): void {
    const memory = (performance as any).memory;
    if (memory) {
      this.record({
        type: "MemorySnapshot",
        memoryUsageMB: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
        timestamp: Date.now()
      });
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}

export const perfMonitor = new PerformanceMonitor();
