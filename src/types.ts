import type { InferOutput } from 'valibot';
import type { YandexMetrikaSchemeOptions } from './runtime/scheme';

export type YandexMetrikaModuleOptions = InferOutput<typeof YandexMetrikaSchemeOptions>;
