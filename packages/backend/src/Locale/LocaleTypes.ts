import collections from "@/Locale/locales";

export type TranslatorCollectionKey = keyof typeof collections;

export type TranslatorCollection = Record<string, Record<string, string>>;

export type Translator = (key: string, variables?: Record<string, string>) => string;
