import { getCollections } from "@/Locale/getCollections";

export type TranslatorCollections = ReturnType<typeof getCollections>;

export type TranslatorCollectionKey = keyof TranslatorCollections;

export type TranslatorCollection = Record<string, Record<string, string>>;

export type Translator = (key: string, variables?: Record<string, string>) => string;
