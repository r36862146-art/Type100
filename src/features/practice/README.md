# Practice Module Architecture

The Practice Module handles the generation, caching, and serving of typing content (Words, Paragraphs, Quotes, Numbers, Punctuation, and Custom text) to the Typing Engine.

## Provider Architecture

All practice modes are implemented as **Providers** adhering to the `PracticeProvider` interface (defined in `types.ts`). A provider is responsible for generating `PracticeContent` based on a `PracticeConfig`.

```ts
interface PracticeProvider {
  getModeId(): PracticeMode;
  generate(config: PracticeConfig): Promise<PracticeContent>;
}
```

### Registration & Lifecycle

Providers are registered inside the `practiceRegistry` singleton (located in `registry.ts`).
When a user selects a practice mode, the registry dynamically invokes the correct provider. The registry handles **caching** based on a deterministic stringification of the `PracticeConfig`, ensuring that switching back to the exact same config instantaneously loads the content without regenerating or re-fetching it.

## Dataset Pipeline

For static modes (like Words, Paragraphs, Quotes), datasets are loaded via JSON files located in `content/datasets/`. 
The `datasetLoader` is responsible for parsing these JSON files efficiently. These modes load datasets based on the requested language (e.g., `en`, `hi`).

## Adding a New Provider

1. Create a new provider class/object in `providers/<mode_name>.ts` implementing `PracticeProvider`.
2. Add your new mode to the `PracticeMode` type union in `types.ts`.
3. Register your provider in `registry.ts`: `practiceRegistry.register(new MyNewProvider())`.
4. Ensure appropriate options are exposed in `PracticeToolbar.tsx` if your mode requires custom settings (e.g., difficulty, length).

## Persistence & Analytics

- **Settings Persistence**: The `usePracticeSettings` hook automatically reads from and writes to `localStorage` to preserve user preferences across sessions safely (without hydration errors).
- **Analytics**: The `usePracticeAnalytics` hook fires internal `CustomEvent`s (e.g., `type100_analytics`) whenever modes, languages, or sessions begin. This ensures framework-agnostic telemetry hooks.
