export interface Language {
  id: number;
  name: string;
  languageCode: string;
}
export interface LanguageResponseData {
  metaInfo: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  results: Language[];
}
